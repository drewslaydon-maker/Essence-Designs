/**
 * MatchstickSpottingController.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module: Matchstick's Silver Mirror Recon (Black Knights Spotting Game)
 * 
 * Mechanics & Invariants:
 * - Normalized viewport space: [0.0, 1.0] across spyglass width and height.
 * - 3 Black Knight Scouts concealed in Delain Harbor pier fog:
 *     1. Crane Spotter: (0.22, 0.28), radius 0.15, high balustrade lookout
 *     2. Crate Halberdier: (0.78, 0.62), radius 0.15, crouching behind fish crates
 *     3. Skiff Outrider: (0.50, 0.78), radius 0.15, moored naval patrol barge
 * - Focus Mechanics:
 *     - Reticle distance d = hypot(rx - target.x, ry - target.y).
 *     - When d < target.radius, focus lock accumulates: focus += dt / 0.8s.
 *     - Manual snapshot via [Z] / [Space] / Click instantly snaps when focus >= 0.40.
 *     - Auto-snaps when focus reaches 1.0.
 * - Robust input:
 *     - setReticle(x, y), moveReticle(x, y), moveReticleDelta(dx, dy)
 * - Zero Heap Allocations in tick: Reusable telemetry structs.
 */

export class MatchstickSpottingController {
  /**
   * @param {Object} [config]
   * @param {number} [config.timeLimit=30] Time limit in seconds
   * @param {Function} [config.onTargetSpotted] Callback(targetIndex, target)
   * @param {Function} [config.onComplete] Callback(success, stats)
   */
  constructor(config = {}) {
    this.timeLimit = config.timeLimit ?? 30;
    this.onTargetSpotted = config.onTargetSpotted || null;
    this.onSpotTarget = config.onSpotTarget || null;
    this.onComplete = config.onComplete || null;

    // States: 'PRE_RECON' | 'ACTIVE_RECON' | 'RECON_SUCCESS' | 'RECON_TIMEOUT'
    this.state = 'PRE_RECON';

    // Reticle normalized position [0.0, 1.0], center starts at (0.5, 0.5)
    this.rx = 0.5;
    this.ry = 0.5;
    this.targetRx = 0.5;
    this.targetRy = 0.5;

    // Time & timer
    this.timeRemaining = this.timeLimit;

    // 3 Hidden Black Knight Scouts in harbor viewport coordinates [0.0, 1.0]
    this.targets = [
      {
        id: 'crane_spotter',
        label: 'Crane Marksman (Tower Balustrade)',
        x: 0.22,
        y: 0.28,
        radius: 0.15,
        spotted: false,
        glintPhase: 0,
        desc: 'Black Order sniper watching the tavern roof exits.'
      },
      {
        id: 'crate_halberdier',
        label: 'Crate Sentry (Fish Stacks)',
        x: 0.78,
        y: 0.62,
        radius: 0.15,
        spotted: false,
        glintPhase: 1.5,
        desc: 'Cold-iron sentry concealed behind salted herring barrels.'
      },
      {
        id: 'skiff_outrider',
        label: 'Skiff Signalman (Pier Mooring)',
        x: 0.50,
        y: 0.78,
        radius: 0.15,
        spotted: false,
        glintPhase: 3.0,
        desc: 'Naval outrider signaling the armada blockade with hooded lamp.'
      }
    ];

    this.spottedCount = 0;
    this.focusedTargetIndex = -1;
    this.focusCharge = 0.0; // 0.0 to 1.0
    this.snapshotFlash = 0.0; // 1.0 decays to 0.0 for camera flash
  }

  start() {
    this.state = 'ACTIVE_RECON';
    this.timeRemaining = this.timeLimit;
    this.spottedCount = 0;
    this.focusedTargetIndex = -1;
    this.focusCharge = 0.0;
    this.snapshotFlash = 0.0;
    this.rx = 0.5;
    this.ry = 0.5;
    this.targetRx = 0.5;
    this.targetRy = 0.5;

    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].spotted = false;
    }
  }

  setReticle(normX, normY) {
    this.targetRx = Math.max(0.05, Math.min(0.95, normX));
    this.targetRy = Math.max(0.05, Math.min(0.95, normY));
  }

  moveReticle(normX, normY) {
    this.setReticle(normX, normY);
  }

  moveReticleDelta(dx, dy) {
    this.targetRx = Math.max(0.05, Math.min(0.95, this.targetRx + dx));
    this.targetRy = Math.max(0.05, Math.min(0.95, this.targetRy + dy));
  }

  /**
   * Snapshot trigger (Player strikes [Z], [Space], or clicks Tag button)
   * Returns { accepted: boolean, target?: object, spottedCount?: number }
   */
  triggerSnapshot() {
    if (this.state !== 'ACTIVE_RECON') {
      return { accepted: false, reason: 'NOT_ACTIVE' };
    }

    this.snapshotFlash = 1.0;

    if (this.focusedTargetIndex >= 0 && this.focusCharge >= 0.40) {
      const target = this.targets[this.focusedTargetIndex];
      if (!target.spotted) {
        target.spotted = true;
        this.spottedCount++;
        this.focusCharge = 0.0;

        if (this.onTargetSpotted) {
          this.onTargetSpotted(this.focusedTargetIndex, target);
        }
        if (this.onSpotTarget) {
          this.onSpotTarget(target, this.focusedTargetIndex);
        }

        if (this.spottedCount >= this.targets.length) {
          this.state = 'RECON_SUCCESS';
          if (this.onComplete) {
            this.onComplete(true, {
              spottedCount: this.spottedCount,
              timeRemaining: this.timeRemaining
            });
          }
        }
        return { accepted: true, target, spottedCount: this.spottedCount };
      }
    }
    return { accepted: false, reason: 'NO_LOCK' };
  }

  update(dt) {
    if (this.state !== 'ACTIVE_RECON') {
      if (this.snapshotFlash > 0) {
        this.snapshotFlash = Math.max(0, this.snapshotFlash - dt * 4.0);
      }
      return;
    }

    // Responsive reticle lerp for tactile optical glide
    this.rx += (this.targetRx - this.rx) * Math.min(1.0, dt * 18.0);
    this.ry += (this.targetRy - this.ry) * Math.min(1.0, dt * 18.0);

    // Timer countdown
    this.timeRemaining = Math.max(0, this.timeRemaining - dt);
    if (this.timeRemaining <= 0) {
      this.state = 'RECON_TIMEOUT';
      if (this.onComplete) {
        this.onComplete(false, {
          spottedCount: this.spottedCount,
          timeRemaining: 0
        });
      }
      return;
    }

    // Decay snapshot flash
    if (this.snapshotFlash > 0) {
      this.snapshotFlash = Math.max(0, this.snapshotFlash - dt * 4.0);
    }

    // Proximity check to unspotted scouts
    let closestIndex = -1;
    let minDistance = 999;

    for (let i = 0; i < this.targets.length; i++) {
      const t = this.targets[i];
      t.glintPhase += dt * 3.0;

      if (t.spotted) continue;

      const dist = Math.hypot(this.rx - t.x, this.ry - t.y);
      if (dist < t.radius && dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    this.focusedTargetIndex = closestIndex;

    if (closestIndex >= 0) {
      const target = this.targets[closestIndex];
      const proximityFactor = Math.max(0, 1.0 - (minDistance / target.radius));
      // Focus charges rapidly when reticle is centered on scout
      this.focusCharge = Math.min(1.0, this.focusCharge + dt * (1.2 + proximityFactor * 1.8));

      // Auto-lock on complete focus charge
      if (this.focusCharge >= 1.0) {
        this.triggerSnapshot();
      }
    } else {
      // Focus decays smoothly when moving away from target
      this.focusCharge = Math.max(0.0, this.focusCharge - dt * 2.2);
    }
  }

  reset() {
    this.state = 'PRE_RECON';
    this.timeRemaining = this.timeLimit;
    this.spottedCount = 0;
    this.focusedTargetIndex = -1;
    this.focusCharge = 0.0;
    this.snapshotFlash = 0.0;
    this.rx = 0.5;
    this.ry = 0.5;
    this.targetRx = 0.5;
    this.targetRy = 0.5;
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].spotted = false;
    }
  }

  toSnapshot() {
    return {
      state: this.state,
      timeRemaining: Math.ceil(this.timeRemaining),
      spottedCount: this.spottedCount,
      focusedTargetIndex: this.focusedTargetIndex,
      focusedIndex: this.focusedTargetIndex,
      focusCharge: parseFloat(this.focusCharge.toFixed(3)),
      snapshotFlash: parseFloat(this.snapshotFlash.toFixed(2)),
      rx: parseFloat(this.rx.toFixed(3)),
      ry: parseFloat(this.ry.toFixed(3)),
      targets: this.targets.map(t => ({
        id: t.id,
        label: t.label,
        desc: t.desc,
        spotted: t.spotted,
        x: t.x,
        y: t.y,
        radius: t.radius,
        glint: Math.sin(t.glintPhase) > 0.6
      }))
    };
  }
}
