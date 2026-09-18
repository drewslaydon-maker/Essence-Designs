# LEGACY LAYER — fl0w hub v0.1

> **STATUS: LEGACY (superseded by ED FLOW 2.0 / Goal 1.0)**
> Annotation added 2026-09-17 during the **Goal 1.0 Studio Audit**.

**This is layer 2 of the studio's evolution** (the Google AI Studio + FLOW
era). It is **kept readable as reference, NOT canonical.** Do not build new
studio operations on it.

- Canonical operating system now lives at:
  `ED/00_ESSENCE_CORE/ED_FLOW/` (see `00_GOAL1_MANIFEST.md`).
- Audit verdict + survivor list: `ED_FLOW/00_GOAL1_MANIFEST.md` (Layer 2
  findings) and `ED_FLOW/02_GAME_CATALOG.md`.

## What survives from this layer (port candidates, not yet moved)
- `docs/JOURNEYS_LORE_BIBLE_V0.2.md` — canonical Journeys Unto spec.
- `docs/WAVE_STATE_LOG.md` — deterministic QA/audit-ledger pattern.
- `public/journeys/index.html` — self-contained Journeys Vertical Slice
  (deployable GitHub Pages artifact).
- `src/types.ts` Ticket model + `src/data/initialData.ts` — spec schema.
- `tests/physics/JRN204_AABB_Sliding.test.js` +
  `tests/invariants/M1_MasterManifest.test.js` — deterministic test pattern.
- `src/physics/SpatialWorld.js`, `src/core/KinematicController.js`,
  `src/minigames/*`, `src/audio/TavernAudioGraph.js`,
  `src/ui/DialoguePacer.js`, `src/services/TavernHearthSaveService.js`.

## Known dead weight (do not port)
- Orphaned agent-UI suite (`AgentSanctumView`, `OracleDivinerView`,
  `WaveCleanroomView`, `LocalBridgeAndGitView`, `CommandDeckOverview`,
  `GitConfigModal`, `Pr0sisMobileInspectorModal`) — the OMEGA/Oracle
  pipeline is phased out.
- Fictional tooling strings (`npx essence-flow …`, `oracle-dispatch …`).
- Scaffold README/metadata.json (AI Studio template leftovers).
- Non-persisted kanban state (refresh resets it).

**Do not modify this project** without Drew's explicit direction.