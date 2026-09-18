/**
 * JRN204_AABB_Sliding.test.js
 * Verification Test Suite for Feature JRN-204
 * AABB Spatial Boundaries & Axis-Separated Wall Sliding
 * Pure ES6 - Zero External Dependencies.
 */

import { SpatialWorld } from '../../src/physics/SpatialWorld.js';
import { KinematicController } from '../../src/core/KinematicController.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

function assertApprox(a, b, epsilon = 0.001, message = '') {
  if (Math.abs(a - b) > epsilon) {
    throw new Error(`[APPROX ASSERTION FAILED]: Expected ${b} but got ${a} (diff ${Math.abs(a - b)} > ${epsilon}). ${message}`);
  }
}

export function runAllGates() {
  const results = [];

  // ============================================================================
  // Gate 2.1 (45° Wall-Slide)
  // Diagonal entry (vx: 300, vy: 300) into a vertical wall at X = 100.
  // Assert: vx drops immediately to 0.0; vy remains exactly 300.0.
  // Snaps flush to (100 - footprint.w - 0.01).
  // ============================================================================
  {
    const world = new SpatialWorld();
    // Vertical wall at X = 100, spanning Y = -200 to +800
    world.addCollider({ id: 'vertical_wall', x: 100, y: -200, w: 40, h: 1000 });

    const controller = new KinematicController({
      air_damping: 1.0, // test raw collision momentum conservation
      footprint: { w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0 },
      spatialWorld: world,
    });

    // Start 2px before wall contact: x = 100 - 24 - 2 = 74, y = 50
    controller.teleport(74.0, 50.0);
    controller.velocity.x = 300.0;
    controller.velocity.y = 300.0;

    const dt = 0.016; // 1 frame
    controller.update(dt);

    const expectedX = 100.0 - 24.0 - 0.01; // 75.99
    assertApprox(controller.transform.x, expectedX, 0.001, 'Gate 2.1: Must snap flush to (100 - footprint.w - 0.01)');
    assertApprox(controller.velocity.x, 0.0, 0.0001, 'Gate 2.1: vx must drop immediately to 0.0 upon wall contact');
    assertApprox(controller.velocity.y, 300.0, 0.0001, 'Gate 2.1: vy must remain conserved at 300.0 (frictionless wall slide)');

    results.push({
      gate: 'Gate 2.1 (45° Wall-Slide)',
      passed: true,
      details: `Snapped flush to ${controller.transform.x.toFixed(2)} (expected ${expectedX.toFixed(2)}), vx=0.0, vy=300.0 conserved.`,
    });
  }

  // ============================================================================
  // Gate 2.2 (90° Concave Corner Pinning)
  // Drive entity diagonally into an internal corner for 60 consecutive frames (dt = 0.016).
  // Assert: Position delta over frames 2–60 is identically (0.0, 0.0). Zero jitter, zero sign flips.
  // ============================================================================
  {
    const world = new SpatialWorld();
    // Internal corner made of vertical wall at X = 100 and horizontal wall at Y = 100
    world.addCollider({ id: 'vert_wall', x: 100, y: 0, w: 40, h: 200 });
    world.addCollider({ id: 'horiz_wall', x: 0, y: 100, w: 200, h: 40 });

    const controller = new KinematicController({
      air_damping: 1.0,
      footprint: { w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0 },
      spatialWorld: world,
    });

    // Start 1 frame before corner contact so frame 1 pins both axes
    const pinnedX = 100.0 - 24.0 - 0.01; // 75.99
    const pinnedY = 100.0 - 12.0 - 0.01; // 87.99
    controller.teleport(pinnedX - 1.0, pinnedY - 1.0);

    let frame2Pos = null;
    let jitterDetected = false;

    const dt = 0.016;
    for (let frame = 1; frame <= 60; frame++) {
      // Continuous diagonal drive into corner
      controller.velocity.x = 250.0;
      controller.velocity.y = 250.0;
      controller.update(dt);

      if (frame === 2) {
        frame2Pos = { x: controller.transform.x, y: controller.transform.y };
      } else if (frame > 2) {
        const dx = Math.abs(controller.transform.x - frame2Pos.x);
        const dy = Math.abs(controller.transform.y - frame2Pos.y);
        if (dx > 0.00001 || dy > 0.00001) {
          jitterDetected = true;
          throw new Error(`Gate 2.2 Jitter detected at frame ${frame}: dx=${dx}, dy=${dy}`);
        }
      }
    }

    assertApprox(frame2Pos.x, pinnedX, 0.001, 'Gate 2.2 Corner X position flush');
    assertApprox(frame2Pos.y, pinnedY, 0.001, 'Gate 2.2 Corner Y position flush');
    assert(!jitterDetected, 'Gate 2.2: Position delta over frames 2-60 must be identically (0.0, 0.0)');

    results.push({
      gate: 'Gate 2.2 (90° Concave Corner Pinning)',
      passed: true,
      details: `Zero jitter across 60 frames. Pinned firmly at (${frame2Pos.x.toFixed(2)}, ${frame2Pos.y.toFixed(2)}). Delta=(0,0).`,
    });
  }

  // ============================================================================
  // Gate 2.3 (Zero-Epsilon Breakaway)
  // Pinned against wall with 0.01 offset. Apply reverse input vector.
  // Assert: Collision is false on tick 1; avatar disengages with zero sticky delay.
  // ============================================================================
  {
    const world = new SpatialWorld();
    world.addCollider({ id: 'wall', x: 100, y: 0, w: 40, h: 200 });

    const controller = new KinematicController({
      air_damping: 1.0,
      footprint: { w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0 },
      spatialWorld: world,
    });

    // Pinned against wall: x = 100 - 24 - 0.01 = 75.99
    const pinnedX = 75.99;
    controller.teleport(pinnedX, 50.0);

    // Prior to update, verify footprint is strictly NOT overlapping (edge-flush with 0.01 gap)
    const initialOverlap = world.queryOverlap({
      x: controller.transform.x,
      y: controller.transform.y,
      w: controller.footprint.w,
      h: controller.footprint.h,
    });
    assert(initialOverlap === null, 'Gate 2.3: Pinned position with 0.01 offset must have zero initial overlap');

    // Apply reverse input vector away from wall (West: vx = -200)
    controller.velocity.x = -200.0;
    const dt = 0.016;
    controller.update(dt);

    const expectedX = pinnedX + (-200.0 * 0.016); // 75.99 - 3.2 = 72.79
    assertApprox(controller.transform.x, expectedX, 0.001, 'Gate 2.3: Disengages on tick 1 with zero sticky delay');
    assertApprox(controller.velocity.x, -200.0, 0.001, 'Gate 2.3: Reverse velocity preserved without damping lock');

    results.push({
      gate: 'Gate 2.3 (Zero-Epsilon Breakaway)',
      passed: true,
      details: `Disengaged on tick 1: moved from ${pinnedX.toFixed(2)} to ${controller.transform.x.toFixed(2)} without sticky delay.`,
    });
  }

  // ============================================================================
  // Gate 2.4 (Flush-Seam Traversal)
  // Slide entity across two abutting boxes (seam at Y = 50).
  // Assert: Zero snagging or X-displacement as candidate crosses Y = 50.
  // ============================================================================
  {
    const world = new SpatialWorld();
    // Two abutting vertical wall boxes with seam exactly at Y = 50
    world.addCollider({ id: 'upper_wall', x: 100, y: 0, w: 40, h: 50 });
    world.addCollider({ id: 'lower_wall', x: 100, y: 50, w: 40, h: 150 });

    const controller = new KinematicController({
      air_damping: 1.0,
      footprint: { w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0 },
      spatialWorld: world,
    });

    // Start flush against upper wall at Y = 30, sliding South (vy = 200, pressing into wall vx = 50)
    const flushX = 100.0 - 24.0 - 0.01; // 75.99
    controller.teleport(flushX, 30.0);

    const dt = 0.016;
    let crossedSeam = false;

    for (let frame = 1; frame <= 25; frame++) {
      // Continuously slide South while pressing East into the wall
      controller.velocity.x = 50.0;
      controller.velocity.y = 200.0;
      controller.update(dt);

      // Verify X remains flush at 75.99 without snagging, shifting, or falling inside
      assertApprox(controller.transform.x, flushX, 0.001, `Gate 2.4 Snag detected at frame ${frame}, y=${controller.transform.y}`);

      // Check when footprint spans across Y = 50 seam
      const footBottom = controller.transform.y + controller.footprint.h;
      if (controller.transform.y < 50 && footBottom > 50) {
        crossedSeam = true;
      }
    }

    assert(crossedSeam, 'Gate 2.4: Entity must have traversed across the Y=50 seam during simulation');
    assertApprox(controller.transform.x, flushX, 0.001, 'Gate 2.4: X position stayed perfectly flush across seam traversal');

    results.push({
      gate: 'Gate 2.4 (Flush-Seam Traversal)',
      passed: true,
      details: `Smooth traversal across abutting boxes at Y=50 seam with 0.0 snagging and consistent flush position ${flushX.toFixed(2)}.`,
    });
  }

  return results;
}

// Direct CLI Execution
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('JRN204')) {
  console.log('--- RUNNING FEATURE JRN-204 VERIFICATION GATES ---');
  try {
    const results = runAllGates();
    results.forEach((r) => {
      console.log(`✅ [PASS] ${r.gate}: ${r.details}`);
    });
    console.log('\n🌟 ALL 4 VERIFICATION GATES PASSED DETERMINISTICALLY.');
  } catch (err) {
    console.error('❌ [GATE FAILURE]:', err.message);
    process.exit(1);
  }
}
