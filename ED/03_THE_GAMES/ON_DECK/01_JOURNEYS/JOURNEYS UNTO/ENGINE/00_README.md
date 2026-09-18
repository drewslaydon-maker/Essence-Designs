# ENGINE — Journeys Unto Deterministic Runtime Core

The fl0w-hub survivor runtime for Journeys Unto: pure ES6 / zero-dependency
modules plus their deterministic verification suites.

- **Source of port:** `LEGACY/VAULT/essence-fl0w-hub-v0.1/` (fl0w hub v0.1,
  layer 2). Ported **2026-09-17** during the **fl0w survivor port** —
  byte-identical copies, verified by SHA-256. Relative structure preserved
  so module imports resolve exactly as they did upstream.
- **Modules:** `src/physics/SpatialWorld.js` (AABB world),
  `src/core/KinematicController.js` (axis-separated wall sliding),
  `src/audio/TavernAudioGraph.js`, `src/ui/DialoguePacer.js`,
  `src/services/TavernHearthSaveService.ts`, `src/services/JujuAnchorService.js`,
  `src/minigames/DrinkingDuelController.js`.
- **Tests (run from this folder):**
  - `tests/physics/JRN204_AABB_Sliding.test.js` — 4 wall/slide gates.
  - `tests/invariants/M1_MasterManifest.test.js` — auditor invariants
    AU-01..AU-04 + AU-Telemetry.

```
node tests/physics/JRN204_AABB_Sliding.test.js
node tests/invariants/M1_MasterManifest.test.js
```

Both suites are deterministic (zero external deps) and pass cleanly:
JRN-204 (4/4) and M1 (5/5) at port time.