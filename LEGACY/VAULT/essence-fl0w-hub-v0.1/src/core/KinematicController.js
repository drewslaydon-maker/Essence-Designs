/**
 * KinematicController.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Feature JRN-204: AABB Spatial Boundaries & Axis-Separated Wall Sliding
 * Pure ES6 - Zero external physics/math dependencies. Zero DOM/Canvas in physics loop.
 */

import { SpatialWorld } from '../physics/SpatialWorld.js';

export class KinematicController {
  /**
   * @param {Object} [config]
   * @param {number} [config.mass=1.0]
   * @param {number} [config.gravity=0.0] - Zero default gravity for top-down RPG mode
   * @param {number} [config.ground_damping=0.05]
   * @param {number} [config.air_damping=0.00001] - Near-zero air damping for instant stop in top-down
   * @param {number} [config.terminal_velocity=1200.0]
   * @param {number} [config.max_dt=0.1]
   * @param {Object} [config.footprint] - Decoupled shadow-box footprint
   * @param {SpatialWorld} [config.spatialWorld]
   */
  constructor(config = {}) {
    this.config = {
      mass: config.mass ?? 1.0,
      gravity: config.gravity ?? 0.0,
      ground_damping: config.ground_damping ?? 0.05,
      air_damping: config.air_damping ?? 0.00001,
      terminal_velocity: config.terminal_velocity ?? 1200.0,
      max_dt: config.max_dt ?? 0.1,
    };

    /**
     * Footprint / shadow-box configuration decoupled from render offsets
     * Default: w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0
     */
    this.footprint = {
      w: config.footprint?.w ?? 24.0,
      h: config.footprint?.h ?? 12.0,
      offsetX: config.footprint?.offsetX ?? 0.0,
      offsetY: config.footprint?.offsetY ?? 0.0,
    };

    this.transform = { x: 0.0, y: 0.0 };
    this.velocity = { x: 0.0, y: 0.0 };
    this.acceleration = { x: 0.0, y: 0.0 };
    this.forces = { x: 0.0, y: 0.0 };

    this.flags = {
      is_grounded: false,
      is_frozen: false,
    };

    /** @type {SpatialWorld|null} */
    this.spatialWorld = config.spatialWorld || null;
  }

  setSpatialWorld(world) {
    this.spatialWorld = world;
  }

  setFootprint(footprint) {
    this.footprint = { ...this.footprint, ...footprint };
  }

  applyForce(fx, fy) {
    if (this.flags.is_frozen) return;
    this.forces.x += fx;
    this.forces.y += fy;
  }

  applyImpulse(ix, iy) {
    if (this.flags.is_frozen) return;
    const invMass = 1.0 / Math.max(0.0001, this.config.mass);
    this.velocity.x += ix * invMass;
    this.velocity.y += iy * invMass;
  }

  teleport(x, y) {
    this.transform.x = x;
    this.transform.y = y;
    this.velocity.x = 0.0;
    this.velocity.y = 0.0;
    this.forces.x = 0.0;
    this.forces.y = 0.0;
  }

  setGrounded(grounded) {
    this.flags.is_grounded = grounded;
    if (grounded && this.velocity.y > 0) {
      this.velocity.y = 0.0;
    }
  }

  /**
   * Sub-Step Integration Pipeline with Axis-Separated Euler Passes
   * @param {number} dt Delta time in seconds
   * @param {SpatialWorld} [overrideWorld] Optional world override
   */
  update(dt, overrideWorld = null) {
    if (this.flags.is_frozen) return;

    const safeDt = Math.min(Math.max(0, dt), this.config.max_dt);
    if (safeDt <= 0) return;

    const world = overrideWorld || this.spatialWorld;

    // 1. Accumulate net acceleration
    const invMass = 1.0 / Math.max(0.0001, this.config.mass);
    this.acceleration.x = this.forces.x * invMass;
    this.acceleration.y = this.forces.y * invMass;

    // Gravity applies to Y if not grounded and gravity > 0
    if (!this.flags.is_grounded && this.config.gravity > 0) {
      this.acceleration.y += this.config.gravity;
    }

    // 2. Velocity Integration
    this.velocity.x += this.acceleration.x * safeDt;
    this.velocity.y += this.acceleration.y * safeDt;

    // Clear accumulated forces
    this.forces.x = 0.0;
    this.forces.y = 0.0;

    // 3. Velocity Clamping
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > this.config.terminal_velocity && speed > 0) {
      const scale = this.config.terminal_velocity / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
    }

    // 4. Damping / Friction
    const friction = Math.pow(
      this.flags.is_grounded ? this.config.ground_damping : this.config.air_damping,
      safeDt
    );
    this.velocity.x *= friction;

    // In top-down / airborne mode, air damping applies to Y as well
    if (!this.flags.is_grounded) {
      this.velocity.y *= friction;
    }

    // Snap micro velocities to zero
    if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0.0;
    if (Math.abs(this.velocity.y) < 0.05) this.velocity.y = 0.0;

    // 5. SUB-STEP INTEGRATION PIPELINE (SEPARATED AXIS PASSES)
    // =========================================================

    // --- PHASE X ---
    this.transform.x += this.velocity.x * safeDt;

    if (world) {
      const candidateX = {
        x: this.transform.x + this.footprint.offsetX,
        y: this.transform.y + this.footprint.offsetY,
        w: this.footprint.w,
        h: this.footprint.h,
      };

      const boxBX = world.queryOverlap(candidateX);
      if (boxBX) {
        if (this.velocity.x > 0) {
          this.transform.x = boxBX.x - this.footprint.offsetX - this.footprint.w - 0.01;
        } else if (this.velocity.x < 0) {
          this.transform.x = boxBX.x + boxBX.w - this.footprint.offsetX + 0.01;
        }
        this.velocity.x = 0.0;
      }
    }

    // --- PHASE Y ---
    this.transform.y += this.velocity.y * safeDt;

    if (world) {
      const candidateY = {
        x: this.transform.x + this.footprint.offsetX,
        y: this.transform.y + this.footprint.offsetY,
        w: this.footprint.w,
        h: this.footprint.h,
      };

      const boxBY = world.queryOverlap(candidateY);
      if (boxBY) {
        if (this.velocity.y > 0) {
          this.transform.y = boxBY.y - this.footprint.offsetY - this.footprint.h - 0.01;
        } else if (this.velocity.y < 0) {
          this.transform.y = boxBY.y + boxBY.h - this.footprint.offsetY + 0.01;
        }
        this.velocity.y = 0.0;
      }
    }
  }
}
