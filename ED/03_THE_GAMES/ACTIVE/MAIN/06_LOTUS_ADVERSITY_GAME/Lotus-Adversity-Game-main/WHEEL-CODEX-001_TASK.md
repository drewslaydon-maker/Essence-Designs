# WHEEL-CODEX-001 — THE CODEX STRIP (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Product ruling (Drew, 2026-09-20):** the Wheel is **the article/codex live artifact**,
> not the jumbled dev dashboard it became. Strip the old-model residue and dev tooling.

---

## 1. Mandatory pre-reads (game-covenant compliance)

1. `AGENTS.md` (repo root) — Part 1 design doctrine + Part 2 developer reference.
2. `ROADMAP.md` (repo root) — THE sprint tracker; read first, never nest duplicates.
3. `VISUAL_DESIGN_MASTER.md` (repo root) — visual law (consult before the Heraldry edit).
4. `WHEEL_DESIGN_SPEC.md` (app dir) — wheel geometry twin.
5. `..` parent `00_SHADOW_COUNCIL` / `ED_FLOW` operating core only **if scope is unclear** — this
   package is self-contained; do not expand scope.

**UNTOUCHABLE (embargo within the repo):** `src/lab/labChecks.ts` · `src/data/*` ·
`src/symbols/*` · `verify-lab.ts` · the 15-spoke geometry · all canonical lore data.
These are the covenant's locked truth — zero edits.

---

## 2. Scope restated (verbatim from Drew's rulings)

"The Wheel is meant to be the article/codex live artifact, not the jumbled mess it
became." Ruled strips: old-model Gemini features (no client consumes them), git-sync /
zip-export dev tooling, the Ratification Chamber (governance surface), the Heraldry
runtime audit surface, Google Fonts CDN (fonts go local). Ruled keeps: Pantheon ·
Spokes (RingWheel) · Codex · Pillars · Heraldry **content** (families, dual forms,
deterministic test blow) · Pillars Doctrine. The artifact needs **no backend at all**.

---

## 3. Units (execute in order; HALT after each — do NOT chain)

### Unit 0 — Tooling check
- Install bun (once): `powershell -c "irm bun.sh/install.ps1 | iex"` — or report
  `bun --version` already present. Record output.
- Green: `bun --version` prints.

### Unit 1 — Baseline gate proof (BEFORE any edit)
Run from the app dir `Lotus_Adversity_Game/`:
1. `bun install`
2. `bun run lint` — expect exit 0.
3. `bun run lab:verify` — expect exit 0 (all airseal gates green).
Record exact outputs. This is the pre-strip baseline — if it is NOT green, STOP and
report (BROWN BANANA BREAD) — do not strip on a broken tree.

### Unit 2 — Named deletions (MOVE to `repo_temp/`? NO — DELETE, they are git-tracked dead code; git is the undo)
From app dir, delete exactly:
1. `server.ts` — the entire Express / Gemini / git / zip backend (no client consumes any of it).
2. `src/components/GitSyncModal.tsx`
3. `src/components/ChamberView.tsx`

Verify each `Test-Path` = False after deletion. Record.

### Unit 3 — Named edits (exact targets, no adjacent files)

**A. `src/App.tsx`**
- Remove the `ChamberView` import.
- Remove `{activeTab === "chamber" && <ChamberView />}`.
- Footer: remove the `FLOWER 08 REVOKED` line (governance residue; belongs to the
  Chamber era). KEEP the identity tags (`The Apparatus v2` · `Pillars I–IV` ·
  `15-Spoke Matrix`). Re-flow the footer line so nothing is orphaned.

**B. `src/components/Header.tsx`**
- Remove `GitSyncModal` import, the `gitModalOpen` state, the Git Sync button
  (Database icon), and the `<GitSyncModal … />` render.
- Remove the `chamber` entry from `NAV` (badge `Unratified`).
- Remove the "FLOWER 08 / REVOKED" pill (lines with `bg-rose-400 animate-pulse`).
- Prune lucide imports that become unused (`Database`, `Cpu`, `Milestone` if unused —
  check, then remove only the unused ones). Do not invent new icons or labels.

**C. `src/components/HeraldryView.tsx`**
- Remove the **audit surface only**: the `One-Heraldry-One-Primitive Audit` card
  (the block reading `collisions` / `ShieldCheck` / `computeCollisions`).
- Remove the now-unused `computeCollisions` import and `ShieldCheck` icon import;
  prune `useMemo` and any other import that becomes unused (tsc will flag).
- Update the file-header comment that references "plus the runtime audit surface".
- KEEP everything else: family switcher, Divine / Discipline / Armor content, dual
  forms, decrees, incantations, mitigation blocks, and the copied-out
  "Deterministic Test Blow" section. No content changes, no visual redesign.

**D. `package.json`**
- `name`: `"react-example"` → `"wheel-of-adversity"` (artifact identity; no functional change).
- Remove dependencies: `@google/genai`, `archiver`, `dotenv`, `express`.
- Remove devDependencies: `@types/archiver`, `@types/express`.
- Scripts:
  - `"dev": "tsx server.ts"` → `"dev": "vite"` (no server anymore)
  - `"build": "vite build && esbuild server.ts …"` → `"build": "vite build"`
  - `"start"` → remove (no server to start)
  - `"preview"`: keep as `"preview": "vite preview"`
  - `"clean"`, `"lint"`, `"lab:verify"`: unchanged
- Nothing else in package.json changes.

**E. `index.html`**
- Remove the 3 Google Fonts lines (preconnect ×2 + the stylesheet `<link>`).
- KEEP title/meta/OG tags as-is (`Adversity — The Apparatus` is canon).
- Note: `Plus Jakarta Sans` was in the CDN link but is NOT referenced by the app
  (no `font-jakarta` utility) — it is dropped, not ported. Do not add it locally.

**F. `src/index.css`**
- Append `@font-face` rules for the three families used by the app:
  `Cinzel` (weights 500 · 700 · 900), `MedievalSharp` (400), `Press Start 2P` (400),
  pointing at local files (see Unit 4). Do not alter existing utilities (leave
  `.font-cinzel`, `.font-medieval`, `.font-pixel`, CRT blocks untouched).

### Unit 4 — Local fonts (offline artifact)
1. Create `src/assets/fonts/` (or `public/fonts/` — pick one, document it).
2. Download, once (internet needed only during this unit), the woff2/ttf files for:
   - Cinzel 500 · 700 · 900
   - MedievalSharp 400
   - Press Start 2P 400
   Source: Google Fonts (e.g. `https://fonts.googleapis.com/css2?family=…` opened in a
   browser to resolve woff2 URLs, or the direct font file). Record the source URLs in
   the report for provenance.
3. Wire the `@font-face` rules (Unit 3F) to those local files with `src:` + `format()`,
   `font-display: swap` recommended.
4. Diagnostics: `src/` and `index.html` contain **zero** `http`/`https` font references;
   the three families load locally (test via `bun run dev` + devtools font panel, or
   report the closest available proof).

### Unit 5 — Post-strip verification (the DoD gates)
From app dir `Lotus_Adversity_Game/`:
1. `bun install` (regenerate lock with trimmed deps) — record resulting tree.
2. `bun run lint` — must exit 0.
3. `bun run lab:verify` — must exit 0 (canon untouched — this PROVES labChecks/data
   were not harmed by the strip).
4. `bun run build` — must exit 0 and produce `dist/`.
5. Grep diagnostics (record each):
   - `src/` + repo root docs: ZERO hits for `chamber` (case-insensitive) outside this
     task file · ZERO hits for `GitSync` · ZERO hits for `/api/` · ZERO hits for
     `gemini` (case-insensitive) · ZERO hits for `express` / `@google/genai` /
     `archiver` / `dotenv`.
   - `index.html` + `src/`: ZERO hits for `fonts.googleapis` / `fonts.gstatic`.
   - `package.json`: no server-era deps remain; scripts match Unit 3D.
6. Optional smoke: `bun run dev`, open the app, confirm 5 tabs render (Pantheon,
   Spokes, Heraldry, Codex, Pillars), no Chamber, no Git Sync, no FLOWER 08 pill.
   Report what you actually saw.

### Unit 6 — Documentation + report + HALT
1. Append ONE milestone entry to `ROADMAP.md` (Completed section):
   **"Codex Strip (WHEEL-CODEX-001):** server.ts (Gemini/git/zip backend),
   ChamberView, GitSyncModal, Heraldry audit surface, and Google Fonts CDN removed.
   App is now fully static (5 surfaces: Pantheon · Spokes · Heraldry · Codex ·
   Pillars) with local fonts. Gates green post-strip; awaiting Architect walk."
   Do NOT touch ROADMAP's other sections/statuses (Phase 0.5, Flower 08 — their
   rulings happen after the Architect walk, not now).
2. Plant your completion report next to this task file:
   `WHEEL-CODEX-001-REPORT.md` — restated scope, units, exact outputs (each gate
   exit code), grep diagnostics, any deviations, and honest NOT-DONE list.
3. HALT. Report to Drew. Do not start Electron work (that is a future leaf).

---

## 4. Definition of Done (DoD)

1. All named deletions done (Unit 2) and named edits done exactly (Unit 3).
2. Local fonts served from the bundle; zero external font references (Unit 4).
3. `bun run lint` exit 0 · `bun run lab:verify` exit 0 · `bun run build` exit 0
   (Unit 5) — the covenant gates hold on the stripped tree.
4. Grep diagnostics all clean (Unit 5.5).
5. `ROADMAP.md` carries the single strip entry (Unit 6.1); report planted; staging
   clean of residue.
6. HALT — no chaining into Electron or any other work.

## 5. Guardrails

- Every write requires Drew's approval path: he points the DO window at this file —
  nothing here is live before that.
- Zero discretion: delete/edit ONLY the named targets. Any surprise discovered
  (unexpected consumer, missing font, droppable > 50 prior expectations) → STOP and
  report (BROWN BANANA BREAD if it risks the covenant).
- Do not "improve" the nav, restyle surfaces, or touch canonical data.
- Never touch `src/lab/labChecks.ts`, `src/data/*`, `src/symbols/*`, `verify-lab.ts`.
- Masquerade is forbidden: state exactly what ran, what passed, what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at
this file to execute. Executor: restate scope, run, HALT at every unit gate.