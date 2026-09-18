/**
 * DrinkingDuelController.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module 1: Arcade Drinking Duel State Machine & Kinematics
 * 
 * Invariants Enforced:
 * - State Machine: [PRE_DUEL] -> [COUNTDOWN] -> [ACTIVE_DRINK] -> [ROUND_SETTLE] -> [ROUND_3_CLIMAX] (with [CHOKE_REBOUND] on spam abuse)
 * - Normalized volume floats: V_bozog, V_atreyu in [0.000, 1.000] strictly clamped.
 * - Player drain: Delta V = -0.085 per valid tap.
 * - Input Spam Guard: (t_tap - t_prevTap) < 90ms -> Delta V = 0, enters CHOKE_REBOUND (250ms lockout, flagon froth jitter).
 * - Dynamic AI Drain: V_atreyu(t+dt) = V_atreyu(t) - (r_base + r_clutch * (1.0 - V_bozog)) * dt.
 * - Climax: Hit-stop freeze frame 120ms (dt=0), table slam trauma T=1.0 decaying over 400ms (T = max(0, T - 2.5*dt)).
 * - Camera Shake: CamOffset = Random(-1, 1) * 16px * T^2.
 * - Victory banner elastic overshoot (1.4 -> 1.0).
 */

export class DrinkingDuelController {
  /**
   * @param {Object} [config]
   * @param {number} [config.round=1]
   * @param {number} [config.drainPerTap=0.085]
   * @param {number} [config.spamThresholdMs=90]
   * @param {number} [config.chokeLockoutMs=250]
   * @param {Function} [config.onStateChange]
   * @param {Function} [config.onClimax]
   */
  constructor(config = {}) {
    this.round = config.round ?? 1; // 1: Warmup Ale, 2: Docks Navy Rum, 3: Moon-Cask Spirit
    this.drainPerTap = config.drainPerTap ?? 0.085;
    this.spamThresholdMs = config.spamThresholdMs ?? 90;
    this.chokeLockoutMs = config.chokeLockoutMs ?? 250;

    this.onStateChange = config.onStateChange || null;
    this.onClimax = config.onClimax || null;

    // States: 'PRE_DUEL' | 'COUNTDOWN' | 'ACTIVE_DRINK' | 'CHOKE_REBOUND' | 'ROUND_SETTLE' | 'ROUND_3_CLIMAX' | 'POST_DUEL'
    this.state = 'PRE_DUEL';

    // Normalized Volume floats [0.000, 1.000]
    this.vBozog = 1.0;
    this.vAtreyu = 1.0;

    // Timing & spam guard
    this.lastTapTimestamp = -99999;
    this.lockoutRemainingMs = 0;
    this.countdownRemaining = 0; // seconds

    // Visual kinematics
    this.frothJitter = { x: 0, y: 0 };
    this.hitStopRemainingMs = 0;
    this.trauma = 0.0; // 0.0 to 1.0
    this.cameraShake = { x: 0, y: 0 };
    this.climaxElapsed = 0.0;
    this.bannerScale = 1.0;

    this.winner = null; // 'bozog' | 'atreyu'
  }

  setState(newState) {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      if (this.onStateChange) {
        this.onStateChange(newState, oldState);
      }
    }
  }

  /**
   * Hard reset duel state machine back to pristine Zero State (AU-04 / M1 Invariant)
   */
  reset() {
    this.round = 1;
    this.state = 'PRE_DUEL';
    this.vBozog = 1.0;
    this.vAtreyu = 1.0;
    this.lastTapTimestamp = -99999;
    this.lockoutRemainingMs = 0;
    this.countdownRemaining = 0;
    this.frothJitter = { x: 0, y: 0 };
    this.hitStopRemainingMs = 0;
    this.trauma = 0.0;
    this.cameraShake = { x: 0, y: 0 };
    this.climaxElapsed = 0.0;
    this.bannerScale = 1.0;
    this.winner = null;
  }

  /**
   * Start or restart a duel round
   * @param {number} [roundNumber] 1, 2, or 3
   */
  startRound(roundNumber = this.round) {
    this.round = roundNumber;
    this.vBozog = 1.0;
    this.vAtreyu = 1.0;
    this.lastTapTimestamp = -99999;
    this.lockoutRemainingMs = 0;
    this.frothJitter = { x: 0, y: 0 };
    this.hitStopRemainingMs = 0;
    this.trauma = 0.0;
    this.cameraShake = { x: 0, y: 0 };
    this.climaxElapsed = 0.0;
    this.bannerScale = 1.0;
    this.winner = null;

    this.countdownRemaining = 1.8; // 1.8s countdown (3... 2... 1... DRINK!)
    this.setState('COUNTDOWN');
  }

  /**
   * Register player drink tap event
   * @param {number} [nowMs] Timestamp in milliseconds (e.g. performance.now())
   * @returns {{ accepted: boolean, choked: boolean, vBozog: number }}
   */
  tap(nowMs = Date.now()) {
    if (this.state === 'COUNTDOWN') {
      return { accepted: false, choked: false, vBozog: this.vBozog };
    }

    if (this.state === 'CHOKE_REBOUND') {
      // Re-trigger visual froth agitation during lockout
      this.frothJitter.x = (Math.random() * 4 - 2);
      this.frothJitter.y = (Math.random() * 4 - 2);
      return { accepted: false, choked: true, vBozog: this.vBozog };
    }

    if (this.state !== 'ACTIVE_DRINK') {
      return { accepted: false, choked: false, vBozog: this.vBozog };
    }

    const deltaMs = nowMs - this.lastTapTimestamp;

    // Spam Abuse Guard: Tap frequency < 90ms (greater than ~11.1 taps/sec) triggers CHOKE_REBOUND
    if (deltaMs < this.spamThresholdMs) {
      this.lastTapTimestamp = nowMs;
      this.lockoutRemainingMs = this.chokeLockoutMs;
      this.frothJitter.x = (Math.random() * 4 - 2);
      this.frothJitter.y = (Math.random() * 4 - 2);
      this.setState('CHOKE_REBOUND');
      return { accepted: false, choked: true, vBozog: this.vBozog };
    }

    // Valid Tap
    this.lastTapTimestamp = nowMs;
    this.vBozog = Math.max(0.0, Math.min(1.0, this.vBozog - this.drainPerTap));

    if (this.vBozog <= 0.0001) {
      this.vBozog = 0.0;
      this.resolveRound('bozog');
    }

    return { accepted: true, choked: false, vBozog: this.vBozog };
  }

  /**
   * Settle round outcome and transition to settle or climax
   * @param {'bozog'|'atreyu'} winner
   */
  resolveRound(winner) {
    this.winner = winner;

    if (this.round === 3 && winner === 'bozog') {
      // Round 3 Climax Execution
      this.setState('ROUND_3_CLIMAX');
      this.hitStopRemainingMs = 120.0; // 120ms hit-stop freeze frame
      this.trauma = 1.0; // Table slam trauma scalar T = 1.0
      this.climaxElapsed = 0.0;
      this.bannerScale = 1.4; // Elastic overshoot starts at 1.4
      if (this.onClimax) {
        this.onClimax();
      }
    } else {
      this.setState('ROUND_SETTLE');
    }
  }

  /**
   * Core physics and kinematic update loop
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    const safeDt = Math.max(0.0, Math.min(0.1, dt));

    // 1. Hit-Stop Freeze Frame (dt = 0 for exactly 120ms)
    if (this.hitStopRemainingMs > 0) {
      const hitStopDecay = safeDt * 1000.0;
      this.hitStopRemainingMs = Math.max(0.0, this.hitStopRemainingMs - hitStopDecay);
      // Freeze simulation kinematics during hit-stop
      return;
    }

    // 2. Table Slam Trauma Decay: T = max(0.0, T - 2.5 * dt)
    // Decays linearly from 1.0 to 0.0 in exactly 400ms (1.0 / 2.5 = 0.4s)
    if (this.trauma > 0.0) {
      this.trauma = Math.max(0.0, this.trauma - 2.5 * safeDt);
      // Guard against NaN / undefined
      if (Number.isNaN(this.trauma) || !Number.isFinite(this.trauma)) {
        this.trauma = 0.0;
      }
      const intensity = this.trauma * this.trauma;
      this.cameraShake.x = (Math.random() * 2 - 1) * 16.0 * intensity;
      this.cameraShake.y = (Math.random() * 2 - 1) * 16.0 * intensity;
    } else {
      this.trauma = 0.0;
      this.cameraShake.x = 0.0;
      this.cameraShake.y = 0.0;
    }

    // 3. Victory Banner Elastic Overshoot Animation (1.4 -> 1.0)
    if (this.state === 'ROUND_3_CLIMAX' || this.state === 'POST_DUEL') {
      this.climaxElapsed += safeDt;
      const t = this.climaxElapsed;
      // Damped harmonic curve: 1.0 + 0.4 * exp(-8*t) * cos(16*t)
      const overshoot = 0.4 * Math.exp(-8.0 * t) * Math.cos(16.0 * t);
      this.bannerScale = Math.max(1.0, 1.0 + overshoot);
    }

    // 4. Countdown State Step
    if (this.state === 'COUNTDOWN') {
      this.countdownRemaining -= safeDt;
      if (this.countdownRemaining <= 0) {
        this.countdownRemaining = 0;
        this.setState('ACTIVE_DRINK');
      }
      return;
    }

    // 5. Choke Rebound Lockout Step
    if (this.state === 'CHOKE_REBOUND') {
      this.lockoutRemainingMs -= safeDt * 1000.0;
      this.frothJitter.x = (Math.random() * 4 - 2);
      this.frothJitter.y = (Math.random() * 4 - 2);

      if (this.lockoutRemainingMs <= 0) {
        this.lockoutRemainingMs = 0;
        this.frothJitter.x = 0;
        this.frothJitter.y = 0;
        this.setState('ACTIVE_DRINK');
      }
    }

    // 6. Dynamic AI Drain & Rubber-Banding
    // Active during ACTIVE_DRINK and CHOKE_REBOUND
    if (this.state === 'ACTIVE_DRINK' || this.state === 'CHOKE_REBOUND') {
      let rBase = 0.14;
      let rClutch = 0.05;

      if (this.round === 1) {
        rBase = 0.14;
        rClutch = 0.05;
      } else if (this.round === 2) {
        rBase = 0.22;
        rClutch = 0.12;
      } else if (this.round === 3) {
        // Round 3 Photo-Finish Rubber-Banding:
        // Keeps Atreyu neck-and-neck with Bozog
        rBase = 0.18;
        const bozogProgress = 1.0 - this.vBozog;
        const volumeLead = this.vAtreyu - this.vBozog; // positive if Bozog is winning
        // If Bozog is sprinting ahead, clutch ramps up proportionally
        const dynamicClutch = volumeLead > 0.04 ? 0.65 : 0.32;
        rClutch = dynamicClutch;
      }

      // Mathematical differential equation:
      // dV_atreyu / dt = -(r_base + r_clutch * (1.0 - V_bozog))
      const aiDrainRate = rBase + rClutch * (1.0 - this.vBozog);
      this.vAtreyu = Math.max(0.0, Math.min(1.0, this.vAtreyu - aiDrainRate * safeDt));

      // Invariant Clamp Check
      this.vBozog = Math.max(0.0, Math.min(1.0, this.vBozog));
      this.vAtreyu = Math.max(0.0, Math.min(1.0, this.vAtreyu));

      if (this.vAtreyu <= 0.0001 && this.vBozog > 0.0) {
        this.vAtreyu = 0.0;
        this.resolveRound('atreyu');
      }
    }
  }

  /**
   * Export serializable snapshot for telemetry and state reflection
   */
  toSnapshot() {
    return {
      round: this.round,
      state: this.state,
      vBozog: parseFloat(this.vBozog.toFixed(4)),
      vAtreyu: parseFloat(this.vAtreyu.toFixed(4)),
      trauma: parseFloat(this.trauma.toFixed(4)),
      hitStopRemainingMs: parseFloat(this.hitStopRemainingMs.toFixed(1)),
      lockoutRemainingMs: Math.max(0, Math.round(this.lockoutRemainingMs)),
      winner: this.winner,
      bannerScale: parseFloat(this.bannerScale.toFixed(3)),
    };
  }
}
