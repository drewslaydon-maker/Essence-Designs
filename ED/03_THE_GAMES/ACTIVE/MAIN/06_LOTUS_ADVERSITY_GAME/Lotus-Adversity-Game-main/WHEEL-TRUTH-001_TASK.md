# WHEEL-TRUTH-001 — THE POST-STRIP TRUTH PASS (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Drew's ruling (2026-09-20):** "we shoot leaf A now, then native pack it with electron."
> Leaf A = this package (truth pass). Electron packaging = future leaf **WHEEL-NATIVE-001** — NOT here, do NOT chain.

---

## 1. Mandatory pre-reads (game-covenant compliance)

1. `AGENTS.md` (repo root `C:\Users\Andrew\Projects\AGENTS.md`) — studio boot contract.
2. `AGENTS.md` (this repo root) — Part 1 doctrine is UNTOUCHABLE; Part 2 is the leaf's target.
3. `ROADMAP.md` (this repo root) — read first; the only ROADMAP change allowed is the ONE appended entry (Unit 3).
4. `WHEEL-CODEX-001_TASK.md` + `WHEEL-CODEX-001-REPORT.md` (this repo root) — the strip's ground truth this leaf documents.
5. `WHEEL_DESIGN_SPEC.md` / `VISUAL_DESIGN_MASTER.md` — only if a wording question touches canon (should not).

**UNTOUCHABLE (embargo within the repo):** everything under `Lotus_Adversity_Game/src/` · `verify-lab.ts` · `vite.config.ts` · `index.html` · `bun.lock` · the **entire** Part 1 of this repo's `AGENTS.md` · `WHEEL-CODEX-001*` files · `tui.json` · all ROADMAP sections except the one appended entry · every other district in the studio repo. This is a **docs/script truth pass only** — no app code is edited or run beyond the named gates.

---

## 2. Why this leaf exists (restated from Drew's rulings + DOER's flags)

WHEEL-CODEX-001 stripped the backend, Chamber, GitSync, audit surface, and Google Fonts CDN. The app is now a **fully static Vite/React SPA, 5 surfaces, local fonts, no server**. But the repository's own developer-facing docs still describe the dead server era. DOER (1-Stone) flagged five stale surfaces in its report §5. Drew ruled: shoot this truth pass now. This leaf updates **exactly** those surfaces, nothing else.

---

## 3. Units (execute in order; HALT after each — do NOT chain)

### Unit 0 — Baseline gate proof (BEFORE any edit)
From the app dir `Lotus_Adversity_Game/`:
1. `bun run lint` — expect exit 0.
2. `bun run lab:verify` — expect exit 0 (all airseal gates green).
Record exact outputs. If either is NOT green, STOP and report (BROWN BANANA BREAD) — do not edit docs on a broken tree.

### Unit 1 — Named edits (exact targets, no adjacent files)

**A. `AGENTS.md` (this repo root) — Part 2 Developer Reference ONLY.** Part 1 untouched. Exact changes:
1. Dev Commands table:
   - `bun run dev` row: `Dev server — tsx server.ts on port 3000 (Express + Vite middleware)` → `Dev server — vite on http://localhost:5173 (static SPA, no backend)`.
   - `bun run build` row: `Production build — vite build + esbuild bundle → dist/server.cjs` → `Production build — vite build → static dist/`.
   - DELETE the entire `bun run start` row (`Run production — node dist/server.cjs`).
   - `bun run clean` row: `Remove dist/ and server.js` → `Remove dist/`.
   - `bun install` / `lint` / `lab:verify` rows unchanged.
2. Project Layout tree:
   - DELETE the `server.ts` line (`├── server.ts ← Express backend (Gemini proxy, git-sync, zip export)`).
   - `src/App.tsx` comment: `Root: 6-tab nav via activeTab (NO router)` → `Root: 5-tab nav via activeTab (NO router)`.
   - components comment: `Pantheon, Spokes, Heraldry, Codex, Pillars, Chamber + GitSyncModal, RingWheel, Header, PantheonSymbolGlyph` → `Pantheon, Spokes, Heraldry, Codex, Pillars, RingWheel, Header, PantheonSymbolGlyph`.
   - Everything else in the tree stays (including `repo_temp/ ← Stale duplicate — ignore entirely`).
3. Key Technical Constraints:
   - `labChecks.ts` bullet: `run by BOTH bun run lab:verify AND the in-browser Chamber "Sealing Gates" tab` → `run by bun run lab:verify`. Keep the rest of that bullet word-for-word.
   - DELETE the entire **Gemini** bullet (`Gemini: key from .env via dotenv … oracle.`).
   - Last bullet: `Custom fonts load via Google Fonts in index.html; utilities exposed in index.css (font-cinzel, font-medieval, font-pixel).` → `Custom fonts are local woff2 files in src/assets/fonts/ wired via @font-face in src/index.css (Cinzel 500/700/900 · MedievalSharp 400 · Press Start 2P 400); utilities exposed: .font-cinzel, .font-medieval, .font-pixel.`
   - All other constraints bullets unchanged.
4. No other lines in `AGENTS.md` change. (Confirm: header line, Part 1, `No test suite exists.`, launcher note, Lore & Geometry Quick Reference — all untouched.)

**B. `Lotus_Adversity_Game/README.md`** — REPLACE the entire file (stale AI Studio boilerplate) with a new accurate README:
- Title: `Wheel of Adversity — The Apparatus` (matches package name `wheel-of-adversity`).
- Short description: a fully static, offline-capable dark-fantasy codex/artifact — Pantheon · Spokes (RingWheel) · Heraldry · Codex · Pillars. No backend, no network fonts.
- Prereqs: `bun` (or `npm` — note npm also works).
- Commands table (exact, from current package.json):
  - `bun install` — install dependencies
  - `bun run dev` — Vite dev server → http://localhost:5173
  - `bun run lint` — type-check only (`tsc --noEmit`)
  - `bun run lab:verify` — executable canon gates (`tsx verify-lab.ts`)
  - `bun run build` — production build → `dist/`
  - `bun run preview` — preview the built `dist/`
  - `bun run clean` — remove `dist/`
- One line: canonical docs live at the repo root (`AGENTS.md`, `ROADMAP.md`, `VISUAL_DESIGN_MASTER.md`).
- Do NOT mention Electron (future work; zero speculation). No banner images, no links to any external service.

**C. `run.command`** — line 6 only:
`echo "Starting Adversity Server on http://localhost:3000..."` → `echo "Starting The Wheel — Vite dev server on http://localhost:5173..."`
All other lines unchanged (`set -e`, `cd`, install-check, PATH export, `exec bun run dev`).

**D. `start.sh`** — line 6 only, same exact replacement as C.
All other lines unchanged.

**E. `Lotus_Adversity_Game/package.json`** — the `clean` script ONLY:
`"clean": "rm -rf dist server.js"` → `"clean": "rm -rf dist"`
NO other key in package.json changes (name, scripts, deps, duplicate-vite — untouched).

### Unit 2 — Post-edit verification (the DoD gates)
From app dir `Lotus_Adversity_Game/`:
1. `bun run lint` — must exit 0.
2. `bun run lab:verify` — must exit 0 (canon untouched — proves the truth pass harmed nothing).
3. `bun run build` — must exit 0 and produce `dist/` (stone-cold proof the tree still assembles).
4. Grep diagnostics (record each, exact paths):
   - `AGENTS.md` (repo root): ZERO hits for `server.ts` · `GitSync` · `Chamber` · `port 3000` · `6-tab` · `gemini` (case-insensitive). HONEST allowance: the word `AI Studio` may remain once in Part 1 (line 10, Git-truth doctrine — legit, not strip residue); `express` may appear only inside `concreteGameplayExpressions`/`Concrete Gameplay Expressions` if any such mention was already present (Part 1 does not use it; confirm Part 2 has none).
   - `README.md` (app): ZERO hits for `AI Studio` · `GEMINI` · `.env` · `npm install`.
   - `run.command` + `start.sh`: ZERO hits for `3000` · `Server` (case-insensitive).
   - `package.json`: `clean` value is exactly `rm -rf dist`; no other script altered.
5. Optional smoke (if Drew's browser is not available, record closest proof as the Codex report did): `bun run dev`, confirm the app boots from the app dir. Do NOT require a visual walk.

### Unit 3 — Documentation + report + HALT
1. Append ONE milestone entry to `ROADMAP.md` (Completed section), verbatim:
   **"Truth Pass (WHEEL-TRUTH-001):** AGENTS.md Part 2, app README, `run.command`/`start.sh`, and the `clean` script corrected to post-strip ground truth — static Vite artifact (5 surfaces), local fonts, no server, no Gemini. Gates green post-pass; awaiting Architect walk and Electron packaging."
   Do NOT touch any other ROADMAP section/status (Phase 0.5 / Flower 08 / Current Focus still await the Architect walk).
2. Plant your completion report next to this task file: `WHEEL-TRUTH-001-REPORT.md` — restated scope, units, exact outputs (each gate exit code), grep diagnostics, any deviations, honest NOT-DONE list.
3. HALT. Report to Drew. Do NOT start Electron work (that is WHEEL-NATIVE-001, a separate leaf).

---

## 4. Definition of Done (DoD)

1. All five named edits done exactly (Unit 1 A–E), zero adjacent edits.
2. `bun run lint` exit 0 · `bun run lab:verify` exit 0 · `bun run build` exit 0 (Unit 2).
3. Grep diagnostics all clean per Unit 2.4, with only the stated honest allowances.
4. ROADMAP carries the single Truth Pass entry (Unit 3.1); report planted; no staging residue.
5. HALT — no chaining into Electron or any other work.

## 5. Guardrails

- Zero discretion: edit ONLY the named lines/files. Any surprise discovered (e.g., a doc line that references the server in a place not named, a missing launcher line) → STOP and report; do NOT improvise adjacent fixes. If a doc reveals a real drift not listed here, flag it in the report's NOT-DONE list for the Architect walk — do not fix it in this leaf.
- Never touch `src/`, `verify-lab.ts`, `vite.config.ts`, `index.html`, `bun.lock`, ROADMAP (except the one entry), or Part 1 of `AGENTS.md`.
- Do not announce Electron or any future work in README/AGENTS (zero speculation).
- Masquerade is forbidden: state exactly what ran, what passed, what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at this file to execute. Executor: restate scope, run, HALT at every unit gate.