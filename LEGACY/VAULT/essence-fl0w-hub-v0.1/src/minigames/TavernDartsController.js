/**
 * TavernDartsController.js
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Module: Tavern Darts (Far Right Wall)
 * 
 * Mechanics & Axioms:
 * 1. Lissajous Curve Sway: Hand tremor simulating tavern tension and beer sway.
 *    x(t) = A_x * sin(w_x * t + phi_x)
 *    y(t) = A_y * cos(w_y * t + phi_y)
 * 2. Polar Coordinate Dartboard Mapping:
 *    Calculates exact wedge sector [1..20], Inner Bull (50), Outer Bull (25),
 *    Triple Ring (3x), Double Ring (2x), and Single beds.
 * 3. Mobile Dual-Thumb Support:
 *    - Left Thumb / Drag: Aim compensation & focus breathing (reduces Lissajous amplitude).
 *    - Right Thumb / Tension: Pull-back tension meter (0.0 -> 1.0).
 *    - Release: Dart trajectory physics calculation.
 * 4. Zero Dependencies & Zero Heap Allocations in Tick: Reusable state telemetry.
 */

// 20 Standard Dartboard wedges in counter-clockwise order starting from top (20)
// Top is at angle PI/2 in standard trigonometry (or 90 deg)
const DART_SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

export class TavernDartsController {
  /**
   * @param {Object} [config]
   * @param {number} [config.dartsPerLeg=3]
   * @param {Function} [config.onDartThrown]
   * @param {Function} [config.onLegComplete]
   */
  constructor(config = {}) {
    this.dartsPerLeg = config.dartsPerLeg ?? 3;
    this.onDartThrown = config.onDartThrown || null;
    this.onLegComplete = config.onLegComplete || null;

    // State: 'PRE_GAME' | 'AIMING' | 'IN_FLIGHT' | 'LEG_COMPLETE'
    this.state = 'PRE_GAME';

    // Normalized board dimensions & radial boundaries [0.0, 1.0] where 1.0 is board outer ring
    this.radii = {
      innerBull: 0.045,  // 50 pts (Double bull)
      outerBull: 0.110,  // 25 pts (Single bull)
      tripleInner: 0.520,
      tripleOuter: 0.580, // 3x
      doubleInner: 0.880,
      doubleOuter: 0.960, // 2x
      boardEdge: 1.000,
    };

    // Lissajous sway parameters (radians / sec and amplitudes)
    this.lissajous = {
      wx: 2.1,
      wy: 1.6,
      phaseX: 0.4,
      phaseY: 1.2,
      baseAmpX: 0.08,
      baseAmpY: 0.06,
      currentAmpX: 0.08,
      currentAmpY: 0.06,
      swayX: 0,
      swayY: 0,
      focusFactor: 1.0, // 1.0 = normal sway, 0.25 = holding breath / steadying thumb
    };

    // Aim position in normalized board space [-1.2, 1.2], (0, 0) is dead center bullseye
    this.aimX = 0.0;
    this.aimY = 0.0;
    this.targetAimX = 0.0;
    this.targetAimY = 0.0;

    // Tension pull-back [0.0 to 1.0]
    this.tension = 0.0;
    this.isTensioning = false;
    this.isHoldingBreath = false;

    // Dart throw history
    this.dartsRemaining = this.dartsPerLeg;
    this.dartsThrown = [];
    this.totalScore = 0;
    this.bullsEyes = 0;

    // Active in-flight dart
    this.flightTime = 0.0;
    this.flightDuration = 0.24; // 240ms aerodynamic travel
    this.flightStart = { x: 0, y: 0 };
    this.flightTarget = { x: 0, y: 0 };
    this.currentFlightPos = { x: 0, y: 0 };
    this.flightScale = 1.0;

    // Internal time accumulator for Lissajous
    this.t = 0.0;
  }

  start() {
    this.state = 'AIMING';
    this.dartsRemaining = this.dartsPerLeg;
    this.dartsThrown = [];
    this.totalScore = 0;
    this.bullsEyes = 0;
    this.tension = 0.0;
    this.isTensioning = false;
    this.isHoldingBreath = false;
    this.aimX = 0.0;
    this.aimY = 0.0;
    this.targetAimX = 0.0;
    this.targetAimY = 0.0;
    this.t = 0.0;
  }

  reset() {
    this.start();
  }

  /**
   * Set aim in normalized board coordinates [-1.0, 1.0]
   */
  setAim(normX, normY) {
    this.targetAimX = Math.max(-1.15, Math.min(1.15, normX));
    this.targetAimY = Math.max(-1.15, Math.min(1.15, normY));
  }

  moveAimDelta(dx, dy) {
    this.setAim(this.targetAimX + dx, this.targetAimY + dy);
  }

  /**
   * Left thumb focus / hold breath: drastically damps Lissajous sway
   */
  setHoldBreath(holding) {
    this.isHoldingBreath = holding;
  }

  /**
   * Right thumb pull-back: charge throw tension (0.0 to 1.0)
   */
  startTension() {
    if (this.state !== 'AIMING' || this.dartsRemaining <= 0) return;
    this.isTensioning = true;
    this.tension = 0.15;
  }

  setTension(val) {
    if (!this.isTensioning) return;
    this.tension = Math.max(0.0, Math.min(1.0, val));
  }

  /**
   * Release tension: throw the dart!
   */
  releaseThrow() {
    if (this.state !== 'AIMING' || this.dartsRemaining <= 0) return null;

    const tensionPower = Math.max(0.25, this.tension);
    this.isTensioning = false;
    this.tension = 0.0;

    // Calculate final impact point:
    // Ideal landing = aim position + Lissajous sway offset
    // Under-tension causes dart to drop slightly (gravity compensation)
    // Over-tension/under-tension adds minor dispersion
    const dropY = (1.0 - tensionPower) * 0.18;
    const finalX = this.aimX + this.lissajous.swayX;
    const finalY = this.aimY + this.lissajous.swayY + dropY;

    // Begin flight animation
    this.state = 'IN_FLIGHT';
    this.flightTime = 0.0;
    this.flightStart.x = finalX * 0.4;
    this.flightStart.y = 1.3; // Thrown from bottom of viewport
    this.flightTarget.x = finalX;
    this.flightTarget.y = finalY;
    this.currentFlightPos.x = this.flightStart.x;
    this.currentFlightPos.y = this.flightStart.y;
    this.flightScale = 1.8;

    return {
      targetX: finalX,
      targetY: finalY,
      tension: tensionPower,
    };
  }

  /**
   * Evaluate Polar Coordinate score for a dart landing at (x, y)
   * where (0, 0) is center bullseye and 1.0 is the board outer wire.
   */
  evaluatePolarHit(x, y) {
    const r = Math.hypot(x, y);
    // Angle in radians (-PI to PI)
    // Math.atan2(y, x): 0 is right, PI/2 is down, -PI/2 is up
    // In our coordinate system, top is negative Y (standard canvas), so flip dy
    let angle = Math.atan2(-y, x); // angle in standard math: 0 = East, PI/2 = North (Top)
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // 1. Double Bull (Inner Bull: 50 pts)
    if (r <= this.radii.innerBull) {
      return {
        r,
        sector: 50,
        multiplier: 2,
        points: 50,
        label: 'DOUBLE BULLSEYE! (50 pts)',
        ring: 'inner_bull',
        x,
        y,
      };
    }

    // 2. Single Bull (Outer Bull: 25 pts)
    if (r <= this.radii.outerBull) {
      return {
        r,
        sector: 25,
        multiplier: 1,
        points: 25,
        label: 'BULLSEYE! (25 pts)',
        ring: 'outer_bull',
        x,
        y,
      };
    }

    // 3. Off-board (Miss)
    if (r > this.radii.boardEdge) {
      return {
        r,
        sector: 0,
        multiplier: 0,
        points: 0,
        label: 'OFF BOARD (0 pts)',
        ring: 'miss',
        x,
        y,
      };
    }

    // Calculate wedge sector [1..20]
    // Top center (20) is centered around PI/2 (90 degrees).
    // Each wedge spans (2 * PI / 20) = 18 degrees (PI / 10).
    // Sector 20 spans from (90 - 9) deg to (90 + 9) deg.
    const wedgeAngle = (2 * Math.PI) / 20;
    // Rotate so that Sector 20 starts at index 0:
    // Angle offset = angle - (PI/2 - wedgeAngle/2)
    let shifted = angle - (Math.PI / 2 - wedgeAngle / 2);
    while (shifted < 0) shifted += 2 * Math.PI;
    while (shifted >= 2 * Math.PI) shifted -= 2 * Math.PI;

    const sectorIdx = Math.floor(shifted / wedgeAngle) % 20;
    const sectorValue = DART_SECTORS[sectorIdx];

    // Check Multiplier Rings
    if (r >= this.radii.tripleInner && r <= this.radii.tripleOuter) {
      return {
        r,
        sector: sectorValue,
        multiplier: 3,
        points: sectorValue * 3,
        label: `TRIPLE ${sectorValue}! (${sectorValue * 3} pts)`,
        ring: 'triple',
        x,
        y,
      };
    }

    if (r >= this.radii.doubleInner && r <= this.radii.doubleOuter) {
      return {
        r,
        sector: sectorValue,
        multiplier: 2,
        points: sectorValue * 2,
        label: `DOUBLE ${sectorValue}! (${sectorValue * 2} pts)`,
        ring: 'double',
        x,
        y,
      };
    }

    // Single Bed
    const bed = r < this.radii.tripleInner ? 'inner_single' : 'outer_single';
    return {
      r,
      sector: sectorValue,
      multiplier: 1,
      points: sectorValue,
      label: `Single ${sectorValue} (${sectorValue} pts)`,
      ring: bed,
      x,
      y,
    };
  }

  /**
   * Deterministic 60 FPS update tick
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    this.t += dt;

    // 1. Smooth aim position towards target
    this.aimX += (this.targetAimX - this.aimX) * Math.min(1.0, dt * 14.0);
    this.aimY += (this.targetAimY - this.aimY) * Math.min(1.0, dt * 14.0);

    // 2. Compute Lissajous Hand Sway
    // Holding breath / steady thumb reduces amplitude by 70%
    const targetFocus = this.isHoldingBreath ? 0.25 : 1.0;
    this.lissajous.focusFactor += (targetFocus - this.lissajous.focusFactor) * Math.min(1.0, dt * 6.0);

    this.lissajous.currentAmpX = this.lissajous.baseAmpX * this.lissajous.focusFactor;
    this.lissajous.currentAmpY = this.lissajous.baseAmpY * this.lissajous.focusFactor;

    this.lissajous.swayX = this.lissajous.currentAmpX * Math.sin(this.t * this.lissajous.wx + this.lissajous.phaseX);
    this.lissajous.swayY = this.lissajous.currentAmpY * Math.cos(this.t * this.lissajous.wy + this.lissajous.phaseY);

    // 3. Tension Auto-charge if tensioning
    if (this.isTensioning && this.state === 'AIMING') {
      this.tension = Math.min(1.0, this.tension + dt * 0.85);
    }

    // 4. In-flight projectile animation
    if (this.state === 'IN_FLIGHT') {
      this.flightTime += dt;
      const progress = Math.min(1.0, this.flightTime / this.flightDuration);

      // Parabolic flight arc
      this.currentFlightPos.x = this.flightStart.x + (this.flightTarget.x - this.flightStart.x) * progress;
      this.currentFlightPos.y = this.flightStart.y + (this.flightTarget.y - this.flightStart.y) * progress;
      this.flightScale = 1.8 - progress * 0.8; // Scales down as dart hits the board

      if (progress >= 1.0) {
        // Impact!
        const hit = this.evaluatePolarHit(this.flightTarget.x, this.flightTarget.y);
        this.dartsThrown.push(hit);
        this.totalScore += hit.points;
        if (hit.ring === 'inner_bull' || hit.ring === 'outer_bull') {
          this.bullsEyes += 1;
        }

        this.dartsRemaining -= 1;
        if (this.onDartThrown) {
          this.onDartThrown(hit);
        }

        if (this.dartsRemaining <= 0) {
          this.state = 'LEG_COMPLETE';
          if (this.onLegComplete) {
            this.onLegComplete({
              totalScore: this.totalScore,
              bullsEyes: this.bullsEyes,
              darts: this.dartsThrown,
            });
          }
        } else {
          this.state = 'AIMING';
        }
      }
    }
  }

  /**
   * Returns reusable telemetry snapshot
   */
  toSnapshot() {
    return {
      state: this.state,
      dartsRemaining: this.dartsRemaining,
      totalScore: this.totalScore,
      bullsEyes: this.bullsEyes,
      aimX: this.aimX,
      aimY: this.aimY,
      swayX: this.lissajous.swayX,
      swayY: this.lissajous.swayY,
      reticleX: this.aimX + this.lissajous.swayX,
      reticleY: this.aimY + this.lissajous.swayY,
      tension: this.tension,
      isTensioning: this.isTensioning,
      isHoldingBreath: this.isHoldingBreath,
      flightPos: this.currentFlightPos,
      flightScale: this.flightScale,
      dartsThrown: this.dartsThrown,
    };
  }
}
