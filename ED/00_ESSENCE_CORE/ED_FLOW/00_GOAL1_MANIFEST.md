# GOAL 1.0 ED FLOW — STUDIO AUDIT MANIFEST

> Annotated **2026-09-17** by Big Pickle (opencode) under explicit direction
> from Drew Slaydon. This is the canonical record of the Goal 1.0 audit and
> the naming of **ED FLOW 2.0**.

---

## 1. What Goal 1.0 ED FLOW is

Goal 1.0 ED FLOW is the first **systemized, opencode-native operating core**
for ESSENCE DESIGNS. One codified primary agent (**ESSENCE**) drives all
studio operations through OpenCode, with the Guru Helper as a parallel
play-session skill. The former **ESSENCE_HUB** (port 5555, Thinker/Doer) was
**retired 2026-09-17** to `LEGACY/VAULT/essence-hub-v0.1/`; there is no remote
orchestration tier.

It replaces reactive, context-sensitive operation ("what does the agent
bother to read?") with a **boot contract** every session must load.

## 2. The Four Layers (audit verdicts)

| Layer | Form | Era verdict | Ruling |
|---|---|---|---|
| **0** | Notion manual build | Hyper-limiting | **DEAD** |
| **1** | File-structure VCS + Cline/Continue | Too expensive / error-prone | **DEAD** |
| **2** | Google AI Studio + fl0w hub + GitHub Pages | Productive/efficient, but could not handle bugfixing/error-detection from a coding agent | **LEGACY** (archived-as-reference) |
| **3** | OpenCode + Big Pickle | Most trajectory-altering | **LIVE = Goal 1.0** |

The audit confirms no further layering is needed for the core loop. Evolution
now happens *inside* layer 3 (systemizing what already works, retiring what
does not).

## 3. ED FLOW 2.0 deliverables (this audit)

1. **Boot contract** — root `AGENTS.md` (auto-loaded by every session).
2. **opencode wiring** — `opencode.json` (ESSENCE primary agent, /boot,
   /leaf, permission guardrails).
3. **ED_FLOW district** — these four docs (manifest, operating core, game
   catalog, deep-dive charter).
4. **Legacy annotations** — `essence-fl0w-hub-v0.1/00_LEGACY.md`,
   `LEGACY/VAULT/00_README.md`. Nothing deleted, nothing rewritten.
5. **Encoding hygiene** — `MILESTONES.md`, `01_THE_GARDEN.md`,
   `01_THE_DESIGNS/AGENT_BOOT_PROMPT.md` re-encoded to clean UTF-8 (previously
   flagged binary by tooling; content preserved).
6. **Game catalog + numbering recommendations** — `02_GAME_CATALOG.md`.

## 4. Layer 2 → Layer 3 survivors (ported — Leaf 5, 2026-09-17)

From `essence-fl0w-hub-v0.1/` (full list in its `00_LEGACY.md`). **All
non-dead survivors below were ported into the live tree on 2026-09-17
(Leaf 5), byte-identical and verified:**
- `docs/JOURNEYS_LORE_BIBLE_V0.2.md` — canonical Journeys Unto spec.
- `docs/WAVE_STATE_LOG.md` — deterministic QA/audit-ledger pattern.
- `public/journeys/index.html` — self-contained Journeys Vertical Slice.
- `src/types.ts` Ticket model + `src/data/initialData.ts` — spec schema.
- Deterministic test pattern (`tests/physics/JRN204_...`,
  `tests/invariants/M1_MasterManifest.test.js`) — 4/4 and 5/5 gates passing.
- Selected core modules (`SpatialWorld.js`, `KinematicController.js`,
  `TavernAudioGraph.js`, `DialoguePacer.js`, `TavernHearthSaveService.js`).

Destination: game survivors → `03_THE_GAMES/ON_DECK/01_JOURNEYS/JOURNEYS UNTO/`;
studio-wide patterns → `01_THE_DESIGNS/FRAMEWORKS/`. The source stays in the
vault, unchanged, as reference.

Dead from layer 2 (do not port): OMEGA/Oracle agent-UI suite, fictional
`npx` tooling strings, AI Studio scaffold leftovers, non-persisted kanban.

## 5. What the Guru Helper is in this system

The ES GURU is a **parallel-play skill**. It lives in
`.opencode/skills/elder-scrolls-guru/SKILL.md` and its knowledge base in
`LEGACY/VAULT/ElderScrollsGuruHelper/`. It loads
into a separate opencode window from execution work (Buffer Stream
Precaution). It is self-improving but gated: knowledge edits require Drew's
approval; playthrough notes append with `[USER-CONFIRMED]` stamps.

## 6. Ruled & still-open items (2026-09-17)

**Ruled by Drew (2026-09-17, second audit repass — lock-down):**
1. **`06_` → Lotus Adversity owns `06_`.** Slots in with the first few
   games. Folder moved to `03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/`.
2. **New-Project games →** stay concepts; each gets its own individual pass
   during the **Game Deep Dive** (`03_GAME_DEEP_DIVE.md`).
3. **Root `index.html` →** **purged.** Root indexes popping out of their own
   folders was the reason.
4. **ESSENCE_HUB → RETIRED.** Archived at `LEGACY/VAULT/essence-hub-v0.1/`.
   Layer 3 is OpenCode-native only.
5. **CORTEX → SWEPT** (empty placeholder, no consumer).
6. **WORKSHOP → RETIRED.** `Legacy_2.0_Dash/` and
   `03_AGENT_PROTOCOLS.md` archived in `LEGACY/VAULT/00_ESSENCE_3.0/`;
   empty TEMPLATES/TEST_BENCH swept to GRAVEYARD.
7. **INFRA/SYSTEM_ARCH.md → KEPT + REWRITTEN** as the ED FLOW 2.0
   architecture truth (system interactions / outside elements).
8. **LOTUS ADVERSITY = THE ACTIVE MAIN (FLOW 2.0 FOCUS).** The Wheel + its
   codex is the active development and testing lab of the project — Game
   Dev, System Dev, AI research, and Drew's personal lore writing. It is
   the focus objective refined and produced by OpenCode + Big Pickle.
9. **PROSIS → PARKED IN `BROKEN/`.** Focus shift: Prosis was the previous
   system's objective; it is now a demo and sits in `BROKEN/02_PROSIS/`
   with Heaven's Nen. Stale-test path fix parked (test hard-codes
   `ESSENCE_DESIGNS/GAME_DEV/02_PROSIS/index.html`).
10. **ES GURU → SUPPORTING RESEARCH for LAG.** Play sessions feed LAG
    worldbuilding (LAG = WoW/OSRS/Morrowind "New Classic"). Journeys Unto
    stays parked — feature-complete first room, polish + combat next.

**Still open:**
*(none — the fl0w hub JDocs/Codex port plan was executed as its own leaf:
**Leaf 5**, 2026-09-17; see §4.)*