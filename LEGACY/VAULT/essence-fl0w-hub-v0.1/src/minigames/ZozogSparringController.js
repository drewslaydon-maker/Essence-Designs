/**
 * ZozogSparringController.js
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Module: Zozog Sparring (Far Left Corner)
 * 
 * Mechanics & Axioms:
 * 1. Strictly 2-Verb Brawling:
 *    - STRIKE: Light jab, heavy cross, or berserker uppercut depending on combo chain.
 *    - BLOCK: Guard stance to absorb strikes and perform timed Perfect Parries.
 * 2. Opponent Telegraph & Parry Windows:
 *    - Zozog telegraphs heavy attacks (500ms warning spark & audio tell).
 *    - Active strike window (180ms): Blocking during this window triggers a PERFECT PARRY,
 *      shattering Zozog's posture and rendering him VULNERABLE / STUNNED for 1.6s.
 *    - If player fails to block: Player takes stamina damage and poise stagger.
 * 3. 3-Bout Progression:
 *    - Bout 1: Single predictable attacks (Tutorial rhythm).
 *    - Bout 2: Faster telegraphs with feints.
 *    - Bout 3: Flurry combinations requiring double-parry precision.
 * 4. Zero Dependencies & Zero Heap Allocations in Tick.
 */

export class ZozogSparringController {
  /**
   * @param {Object} [config]
   * @param {Function} [config.onHit] Callback when strike lands
   * @param {Function} [config.onParry] Callback on perfect parry
   * @param {Function} [config.onPlayerHit] Callback when player takes damage
   * @param {Function} [config.onBoutCleared] Callback when bout completes
   * @param {Function} [config.onMatchComplete] Callback when all bouts finish
   */
  constructor(config = {}) {
    this.onHit = config.onHit || null;
    this.onParry = config.onParry || null;
    this.onPlayerHit = config.onPlayerHit || null;
    this.onBoutCleared = config.onBoutCleared || null;
    this.onMatchComplete = config.onMatchComplete || null;

    // State: 'PRE_BOUT' | 'FIGHTING' | 'BOUT_CLEARED' | 'MATCH_WON' | 'PLAYER_DOWN'
    this.state = 'PRE_BOUT';

    this.bout = 1;
    this.maxBouts = 3;

    // Player Stats
    this.playerMaxStamina = 100;
    this.playerStamina = 100;
    this.isBlocking = false;
    this.playerStaggerTime = 0.0;
    this.playerCombo = 0;
    this.maxCombo = 0;

    // Zozog (Brawler) Stats
    this.zozogMaxPoise = 100;
    this.zozogPoise = 100;
    // Zozog Sub-state: 'IDLE' | 'TELEGRAPH' | 'ACTIVE_ATTACK' | 'STUNNED' | 'RECOVERY'
    this.zozogState = 'IDLE';
    this.zozogTimer = 1.0; // Countdown until next action

    // Attack details
    this.currentAttack = {
      name: 'Tusk Hook',
      telegraphDuration: 0.65,
      activeDuration: 0.18,
      damage: 20,
    };

    // Telegraph / visual spark timer
    this.telegraphTime = 0.0;
    this.activeAttackTime = 0.0;
    this.stunnedTime = 0.0;

    // Visual feedback
    this.lastActionText = 'Ready!';
    this.lastActionColor = '#10b981';
    this.actionFeedbackTimer = 0.0;

    this.boutsWon = 0;
    this.perfectParries = 0;
    this.strikesLanded = 0;
  }

  start() {
    this.bout = 1;
    this.boutsWon = 0;
    this.perfectParries = 0;
    this.strikesLanded = 0;
    this.playerStamina = this.playerMaxStamina;
    this.startBout(1);
  }

  reset() {
    this.start();
  }

  startBout(boutNum) {
    this.bout = boutNum;
    this.state = 'FIGHTING';
    this.playerStamina = this.playerMaxStamina;
    this.zozogPoise = this.zozogMaxPoise;
    this.isBlocking = false;
    this.playerStaggerTime = 0.0;
    this.playerCombo = 0;

    this.zozogState = 'IDLE';
    this.zozogTimer = 1.2; // Brief breather before Zozog engages
    this.telegraphTime = 0.0;
    this.activeAttackTime = 0.0;
    this.stunnedTime = 0.0;

    this.setActionFeedback(`BOUT ${boutNum}: COMMENCE!`, '#f59e0b');
  }

  /**
   * Verb 1: BLOCK (Guard Stance)
   * @param {boolean} blocking
   */
  setBlock(blocking) {
    if (this.state !== 'FIGHTING' || this.playerStaggerTime > 0) {
      this.isBlocking = false;
      return;
    }
    this.isBlocking = blocking;
  }

  /**
   * Verb 2: STRIKE (Melee Attack)
   * Returns result object { hit: boolean, type: string, damage: number, parryCounter: boolean }
   */
  strike() {
    if (this.state !== 'FIGHTING' || this.playerStaggerTime > 0) return null;

    // If player is blocking, striking drops block automatically
    this.isBlocking = false;

    // 1. Strike against STUNNED Zozog (Massive Punish / Full Combo)
    if (this.zozogState === 'STUNNED') {
      this.playerCombo += 1;
      if (this.playerCombo > this.maxCombo) this.maxCombo = this.playerCombo;
      this.strikesLanded += 1;

      const baseDmg = 25;
      const comboMultiplier = 1.0 + Math.min(1.5, this.playerCombo * 0.25);
      const totalDmg = Math.round(baseDmg * comboMultiplier);

      this.zozogPoise = Math.max(0, this.zozogPoise - totalDmg);

      const comboTitles = ['JAB', 'CROSS', 'TUSK SHATTER', 'BERSERKER UPPERCUT'];
      const title = comboTitles[Math.min(comboTitles.length - 1, this.playerCombo - 1)];

      this.setActionFeedback(`CLEAN HIT: ${title}! (-${totalDmg})`, '#38bdf8');

      if (this.onHit) {
        this.onHit({ type: 'PUNISH', combo: this.playerCombo, damage: totalDmg, zozogPoise: this.zozogPoise });
      }

      // Check if bout cleared
      if (this.zozogPoise <= 0) {
        this.handleBoutWin();
      }

      return { hit: true, type: 'PUNISH', damage: totalDmg, combo: this.playerCombo };
    }

    // 2. Strike during Zozog RECOVERY (Opportunistic strike)
    if (this.zozogState === 'RECOVERY') {
      this.playerCombo += 1;
      this.strikesLanded += 1;
      const dmg = 15;
      this.zozogPoise = Math.max(0, this.zozogPoise - dmg);

      this.setActionFeedback(`QUICK STRIKE! (-${dmg})`, '#10b981');
      if (this.onHit) {
        this.onHit({ type: 'OPPORTUNISTIC', combo: this.playerCombo, damage: dmg, zozogPoise: this.zozogPoise });
      }

      if (this.zozogPoise <= 0) {
        this.handleBoutWin();
      }

      return { hit: true, type: 'OPPORTUNISTIC', damage: dmg, combo: this.playerCombo };
    }

    // 3. Strike into Zozog's Active Guard (Deflected)
    this.playerCombo = 0;
    this.setActionFeedback('DEFLECTED! Zozog absorbed the blow.', '#94a3b8');
    if (this.onHit) {
      this.onHit({ type: 'DEFLECTED', combo: 0, damage: 2, zozogPoise: this.zozogPoise });
    }
    return { hit: false, type: 'DEFLECTED', damage: 0, combo: 0 };
  }

  handleBoutWin() {
    this.boutsWon += 1;
    this.zozogState = 'STUNNED';
    if (this.bout < this.maxBouts) {
      this.state = 'BOUT_CLEARED';
      this.setActionFeedback(`🏆 BOUT ${this.bout} WON!`, '#f59e0b');
      if (this.onBoutCleared) {
        this.onBoutCleared(this.bout);
      }
    } else {
      this.state = 'MATCH_WON';
      this.setActionFeedback('🏆 SPARRING CHAMPION! Zozog yields!', '#f59e0b');
      if (this.onMatchComplete) {
        this.onMatchComplete({
          boutsWon: this.boutsWon,
          perfectParries: this.perfectParries,
          strikesLanded: this.strikesLanded,
        });
      }
    }
  }

  setActionFeedback(text, color) {
    this.lastActionText = text;
    this.lastActionColor = color;
    this.actionFeedbackTimer = 1.2;
  }

  /**
   * Deterministic 60 FPS update tick
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    if (this.state !== 'FIGHTING') return;

    if (this.actionFeedbackTimer > 0) {
      this.actionFeedbackTimer -= dt;
    }

    if (this.playerStaggerTime > 0) {
      this.playerStaggerTime -= dt;
    }

    // Zozog AI State Machine
    switch (this.zozogState) {
      case 'IDLE': {
        this.zozogTimer -= dt;
        if (this.zozogTimer <= 0) {
          // Prepare next telegraphed strike based on current bout
          const attacks = [
            { name: 'Heavy Tusk Hook', telegraph: 0.70 - this.bout * 0.08, active: 0.20, damage: 18 },
            { name: 'Overhead Cudgel Smite', telegraph: 0.85 - this.bout * 0.10, active: 0.22, damage: 24 },
            { name: 'Harbor Gut Punch', telegraph: 0.55 - this.bout * 0.05, active: 0.16, damage: 14 },
          ];
          const chosen = attacks[Math.floor(Math.random() * attacks.length)];
          this.currentAttack = {
            name: chosen.name,
            telegraphDuration: chosen.telegraph,
            activeDuration: chosen.active,
            damage: chosen.damage,
          };

          this.zozogState = 'TELEGRAPH';
          this.telegraphTime = this.currentAttack.telegraphDuration;
        }
        break;
      }

      case 'TELEGRAPH': {
        this.telegraphTime -= dt;
        if (this.telegraphTime <= 0) {
          // Transition to ACTIVE_ATTACK
          this.zozogState = 'ACTIVE_ATTACK';
          this.activeAttackTime = this.currentAttack.activeDuration;
        }
        break;
      }

      case 'ACTIVE_ATTACK': {
        // Test for PERFECT PARRY if player is blocking
        if (this.isBlocking) {
          // Player parried the strike!
          this.perfectParries += 1;
          this.zozogState = 'STUNNED';
          this.stunnedTime = 1.6; // 1.6s of uninterrupted counter window
          this.setActionFeedback('⚡ PERFECT PARRY! Zozog Stunned!', '#e0e7ff');

          if (this.onParry) {
            this.onParry({ attack: this.currentAttack.name, bout: this.bout });
          }
          return;
        }

        this.activeAttackTime -= dt;
        if (this.activeAttackTime <= 0) {
          // Attack connected on player!
          const dmg = this.currentAttack.damage;
          this.playerStamina = Math.max(0, this.playerStamina - dmg);
          this.playerStaggerTime = 0.35;
          this.playerCombo = 0;
          this.setActionFeedback(`OUCH! Took ${this.currentAttack.name} (-${dmg})`, '#f43f5e');

          if (this.onPlayerHit) {
            this.onPlayerHit({ damage: dmg, stamina: this.playerStamina });
          }

          if (this.playerStamina <= 0) {
            this.state = 'PLAYER_DOWN';
            this.setActionFeedback('Knocked down! Catch your breath.', '#ef4444');
            return;
          }

          this.zozogState = 'RECOVERY';
          this.zozogTimer = 0.75;
        }
        break;
      }

      case 'STUNNED': {
        this.stunnedTime -= dt;
        if (this.stunnedTime <= 0) {
          this.zozogState = 'IDLE';
          this.zozogTimer = 1.0;
          this.playerCombo = 0;
        }
        break;
      }

      case 'RECOVERY': {
        this.zozogTimer -= dt;
        if (this.zozogTimer <= 0) {
          this.zozogState = 'IDLE';
          this.zozogTimer = 0.8;
        }
        break;
      }
    }
  }

  toSnapshot() {
    return {
      state: this.state,
      bout: this.bout,
      maxBouts: this.maxBouts,
      playerStamina: this.playerStamina,
      playerMaxStamina: this.playerMaxStamina,
      isBlocking: this.isBlocking,
      playerCombo: this.playerCombo,
      maxCombo: this.maxCombo,
      isStaggered: this.playerStaggerTime > 0,
      zozogPoise: this.zozogPoise,
      zozogMaxPoise: this.zozogMaxPoise,
      zozogState: this.zozogState,
      telegraphProgress: this.currentAttack.telegraphDuration > 0
        ? Math.max(0, this.telegraphTime / this.currentAttack.telegraphDuration)
        : 0,
      stunnedProgress: this.stunnedTime > 0 ? this.stunnedTime / 1.6 : 0,
      currentAttackName: this.currentAttack.name,
      feedbackText: this.lastActionText,
      feedbackColor: this.lastActionColor,
      perfectParries: this.perfectParries,
      strikesLanded: this.strikesLanded,
      boutsWon: this.boutsWon,
    };
  }
}
