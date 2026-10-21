# MD-001 — MUSIC DESIGNER (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Drew's rulings (2026-09-20):**
> 1. **MD = the studio's Music Designer seat.** Long-term vision, in Drew's words: *"make it
>    its own music making engine, teach it with music to learn from, then make music with it
>    for our games."* Music Designer is the agent idea that specifically interests him.
> 2. **Validation = design the NEW MUSIC for the WHEEL DEMO** (the LOTUS ADVERSITY Wheel —
>    native Electron/Web-Audio app; see pre-reads). The theme proves the seat.
> 3. **Execution timing:** Drew will likely run this leaf tomorrow (2026-09-21) as part of the
>    desktop worksheet queue.
> 4. **Studio constraints apply:** zero new dependencies; no audio files; no external models,
>    APIs, CDNs, or generation services; burn < $1.00/hr; stick with the box until it doesn't
>    work. Music is CODE (Web Audio synthesis) — the studio's proven synth pattern, not files.

---

## 1. Mandatory pre-reads

1. `AGENTS.md` (repo root `C:\Users\Andrew\Projects\AGENTS.md`) — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` + `00_GOAL1_MANIFEST.md` + `ED/01_THE_DESIGNS/MILESTONES.md` + `ED/02_ESSENCE_PAD.md` — studio truth + the Pad.
3. **The wheel demo's design doctrine (READ-ONLY, the music must honor it):**
   - `ED/03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/Lotus-Adversity-Game-main/AGENTS.md`
     — Part 1 design doctrine (dark-fantasy codex; palette law; no generic AI UI) + Part 2
     dev reference (Web Audio SFX pattern: `playSfx` click/shield/anvil/scribe, synthesized
     oscillators, NO audio files; custom local fonts; lab gates `bun run lint` + `bun run lab:verify`).
   - `.../Lotus_Adversity_Game/WHEEL_DESIGN_SPEC.md` — wheel anatomy (15 Spokes + Hub Soran,
     Alden at True North, 4 Outer Quadrants + Axis, radii ladder, spin math). The music's
     structure should mirror this anatomy where musical (15-part rotation / hub-chord / drone bed).
   - `.../VISUAL_DESIGN_MASTER.md` (game-repo root) — the palette law: `neutral-950` beds,
     `amber-500` True/healthy, `rose-500`/`emerald-500` corrupted; keylines, glassmorphism,
     rotation. Translate these to a musical identity (see Unit 3).
   - `Lotus_Adversity_Game/src/store/useAppStore.ts` — READ the `playSfx` synth voices to
     learn the studio's synth voice precedent (record the shape in the report; do NOT edit).
4. **Studio music precedent (READ-ONLY):** `ED/03_THE_GAMES/ON_DECK/01_JOURNEYS/JOURNEYS UNTO`
   — the `TavernAudioGraph` service (audio graph precedent) + the lore bible for musical mood
   language. Reference only; it is another district, NOT a target.
5. `WASH/WASH-001_TASK.md` — the leaf-format/precedent mirror (this package follows its shape;
   also read `WASH/WASH-001-REPORT.md` if it exists by execution time for the zero-dep pattern).

**UNTOUCHABLE (embargo):** every existing file in the studio repo, the Lotus Adversity Game
repo (including the Electron wrapper), `.opencode/agents/*`, `ED/` truth/docs, the JOURNEYS
district. This leaf is **additive-only**: it creates new files under `C:\Users\Andrew\Projects\MUSIC\`
and edits nothing else. If a step reveals an existing file MUST change → STOP and report
(BROWN BANANA BREAD) — do not improvise the edit. Wiring the theme INTO the game is NOT this leaf
(future leaf, explicitly named files only).

---

## 2. Why this leaf exists

The studio is days from LAG/game-dev as the next major task and needs a music arm. Drew wants a
Music Designer seat: a **knowledge base** it learns music from (Guru pattern, tagged facts) + a
**composition engine** (music as code) so it can compose for the studio's games for $0. This leaf
plants the seat skeleton AND proves it by composing the Wheel demo's theme — a dark-fantasy codex
ambient loop rendered entirely with Web Audio synthesis, honoring the game's design doctrine.

Architecture (one line): `MUSIC/` seat folder → `KNOWLEDGE/` (tagged music theory + wheel musical
identity) + `engine/` (zero-dep Web Audio score player, music-as-code) + `compositions/`
(themes) + `demo/` (self-contained play page) + tests. Zero dependencies, zero audio files.

---

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any build)
Record exact outputs:
1. `node --version` — record (Node built-ins are the only runtime).
2. `Test-Path "C:\Users\Andrew\Projects\MUSIC\"` — confirm what already exists there (should be
   only this task file after planting).
3. Confirm the build targets below do NOT exist yet (folder is fresh).
4. Read `useAppStore.ts` playSfx voices — record the synth voice shapes (oscillator types, gain
   envelopes, timings) as the studio's voice precedent. Do NOT edit the file.

### Unit 1 — Seed the Music Designer seat files (additive-only, under `MUSIC/`)
1. `MUSIC/MD_AGENT.md` — the seat charter:
   - What MD is (studio composer seat), its mission, and the long-term engine vision
     (teach → compose → ship tunes into the games).
   - Hard rules: music is CODE (Web Audio); no audio files, no streaming, no external
     generation; no CDN/network; burn-compliant; tag knowledge `[VERIFIED]` / `[VERIFY]`
     (Guru pattern); output gated to Drew's approval.
   - Scope boundary: MD composes in `MUSIC/`; game integration happens only via future
     task packages naming the exact files.
2. `MUSIC/KNOWLEDGE/00_MUSIC_THEORY.md` — skeletal-but-real seed: scales/modes, chord
   functions, common progressions, rhythm/meter, timbre vocabulary. Facts tagged
   `[VERIFIED]` / `[VERIFY]`. Skeleton before flesh — the KB accretes via future leaves.
3. `MUSIC/KNOWLEDGE/01_WHEEL_MUSICAL_IDENTITY.md` — the wheel demo's musical identity
   derived from the game doctrine (Unit 1.md pre-reads). Map the palette/tactile language
   to musical language (e.g. neutral-950 bed → low drone bed; amber-500 True → warm mid
   voices; rose/emerald corruption → tense/detuned undercurrent; 15 spokes + Hub → a
   15-note rotated voice + hub drone). Tag claims `[VERIFIED]` (read from doctrine) vs
   `[VERIFY]` (plausible, needs Drew).
4. `MUSIC/KNOWLEDGE/02_REFERENCE.md` — how reference music gets recorded/analyzed: column
   layout for future annotated references + placeholders. This is the "teach it with
   music" intake pattern.

### Unit 2 — Composition engine (zero-dep Web Audio, music as code)
1. `MUSIC/engine/md-score.js` — the score schema (a plain JS object: `tempo`, `bpm`,
   `radix` <base drone>, `voices[]` with `type`, `freqRatio`, `gain`, `pattern[]`,
   `muted`, `pan`; `loopBars`). Deterministic, documented schema.
2. `MUSIC/engine/md-player.js` — zero-dep Web Audio player: reads a score object, schedules
   voices through a master gain bus (room tone + reverb-ish tail via simple delay/gain,
   no external impulses), starts/stops, loops. Uses ONLY the Web Audio API + a tiny
   scheduler. No audio files, no network.
3. `MUSIC/engine/md.test.js` — offline assert-based tests (zero LLM calls): score schema
   validates; player builds a context (document/window guards for Node runs); loop length
   matches tempo × beats; known score renders N voices; malformed score throws. Plain
   `node >= 18` runnable via `node --test` or plain assert script — record which.

### Unit 3 — Compose THE wheel demo theme (the validation)
1. Deliverable: `MUSIC/compositions/wheel-of-adversity/theme.js` — a score object expressing
   the Wheel musical identity, written by DOER as the Music Designer's first act. Requirements:
   - **~60–80 seconds loopable** at a meditative codex pace (50–70 BPM feel).
   - **Drone bed** (neutral) — low sustained voices, dark bed, slow swell.
   - **15-spoke rotation voice** — a melodic/rhythmic voice cycling 15 steps (15 spokes);
     counter-rotation/tension evoking the Wheel's inner/outer spin.
   - **Hub voice** — a stable center (Soran) anchoring the bed (rarely moving).
   - **True amber voice** — warm mid voice that blooms (restoration theme; the True/amber-500
     spirit of the Wheel) layered over the corruption.
   - **Corrupted undercurrent** — subtle tense/detuned color (rose/emerald) so the piece
     starts distorted-dark and lets the True voice grow — the Wheel's story.
   - No genre-generic "epic trailer" stuff. Dark-fantasy codex. Restraint is the rule.
2. `MUSIC/demo/wheel-demo.html` — a self-contained play page (single HTML file: inline
   minimal CSS/JS; loads the engine + theme via relative script tags): neutral-950 bed,
   subtle gold/purple accents, page title "Wheel of Adversity — Theme" with a Play/Stop
   button and a one-line identity readout. NO external fonts/assets (system serif family is
   enough). This is the page DOER/Drew run to hear the theme.
3. Self-proof: run the demo page (open it; record that audio schedules and loops — in a
   browser context). Run the offline tests (Unit 4). Record exact evidence.

### Unit 4 — Offline verification
1. `node MUSIC/engine/md.test.js` (or `node --test`) → all assertions pass. Record lines.
2. Score sanity: log `theme.js` loop length and voice count from Node (no browser needed).
3. No network, no install, no files created outside `MUSIC/`.

### Unit 5 — Report + HALT
1. Plant `MUSIC/MD-001-REPORT.md` next to this task file — restated scope, unit-by-unit
   results (pre-read evidence incl. the playSfx voice shapes, score schema, theme structure
   explanation, test pass lines, demo-run evidence, any deviations, honest NOT-DONE list).
   Include the **musical identity mapping table** (doctrine → score choice).
2. HALT. Do NOT wire the theme into the game repo, do NOT register an agent file in
   `.opencode/agents/`, do NOT create more compositions, do NOT start the VD/Lorekeeper
   seats. Future leaves only if Drew rules them.

---

## 4. Definition of Done (DoD)

1. `MUSIC/` holds: `MD_AGENT.md` · `KNOWLEDGE/00..01..02` · `engine/md-score.js` ·
   `engine/md-player.js` · `engine/md.test.js` · `compositions/wheel-of-adversity/theme.js` ·
   `demo/wheel-demo.html` (this task + report live there too).
2. Zero dependencies — no `node_modules`, no package.json, no install step, no network.
3. The theme is complete, loopable, and honor the Wheel doctrine (identity table in report)
   — and DOER actually heard it render in the demo page (or honestly records why not).
4. Offline tests green (Unit 4).
5. No existing file anywhere (studio repo, game repo, `.opencode/agents`, JOURNEYS district)
   was edited — additive-only leaf in `MUSIC/` only.
6. Report planted; no staging/temp residue; HALT.

## 5. Guardrails

- **Additive-only:** create files under `C:\Users\Andrew\Projects\MUSIC\`; edit NOTHING that
  already exists. The game repo is READ-ONLY for this leaf — the theme is delivered as the
  MUSIC-side artifact + play page; integration is a separate future leaf.
- **No audio files, no external generation** — Web Audio synthesis only; music as code.
- **No new dependencies** — plain JS/Web Audio; Node built-ins for tests (assert/fs).
- **Burn-compliant** — no LLM calls in tests; one short manual demo run suffices.
- Zero discretion: any surprise → STOP and report; do NOT improvise adjacent fixes.
- Masquerade is forbidden: state exactly what ran, what passed, what did not.
- This is the Music Designer only. VD + Lorekeeper are future leaves — not now.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at this file
to execute (likely tomorrow, per the desktop worksheet). Stone's seat is permission-unlocked
(edit: allow · bash: allow) — this leaf runs hands-free. Executor: restate scope, run, HALT at
every unit gate.