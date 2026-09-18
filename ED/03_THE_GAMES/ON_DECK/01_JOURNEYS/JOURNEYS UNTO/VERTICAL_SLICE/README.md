# VERTICAL SLICE — Journeys Unto, Chapter 0

**Canonical deployable slice** of the Journeys Unto Chapter 0 vertical slice
(The Greedy Greens Tavern & Delain Piers). Self-contained single-file HTML —
open `index.html` in any browser; no build step, no server.

- **Source of port:** `LEGACY/VAULT/essence-fl0w-hub-v0.1/public/journeys/index.html`
  (fl0w hub v0.1, layer 2). Ported **2026-09-17** during the **fl0w survivor
  port** — byte-identical copy, verified by SHA-256.
- **This copy is canonical.** It supersedes the older React-based demo
  (`LEGACY/VAULT/journeys-unto-demo/`, re-labeled legacy) per the Goal 1.0
  audit's duplication finding.
- The deterministic-tested engine underneath (SpatialWorld, KinematicController,
  DialoguePacer, TavernAudioGraph, TavernHearthSaveService, JujuAnchorService,
  DrinkingDuelController + the JRN-204 and M1 gate suites) lives in the
  sibling `../ENGINE/`.