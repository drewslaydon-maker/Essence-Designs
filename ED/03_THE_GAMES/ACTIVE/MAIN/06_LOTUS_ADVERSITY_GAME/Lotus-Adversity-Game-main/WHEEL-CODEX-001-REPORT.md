# WHEEL-CODEX-001 — COMPLETION REPORT (DOER / 1-Stone)

> **Leaf:** WHEEL-CODEX-001 — THE CODEX STRIP
> **Executed:** 2026-09-20 by DOER (1-Stone) · **Status:** EXECUTED — GATES GREEN — AWAITING ARCHITECT WALK
> **Pre-reads completed:** AGENTS.md (repo root + game), ROADMAP.md, VISUAL_DESIGN_MASTER.md,
> WHEEL_DESIGN_SPEC.md, boot contract (operating core, manifest, milestones, log, Pad).

---

## 1. Restated scope (verbatim from task package)

The Wheel becomes **the article/codex live artifact**, not the dev dashboard. Stripped:
old-model Gemini features, git-sync / zip-export dev tooling, the Ratification Chamber,
the Heraldry runtime audit surface, the Google Fonts CDN. Kept: Pantheon · Spokes
(RingWheel) · Codex · Pillars · Heraldry **content** · Pillars Doctrine. The artifact
needs **no backend at all**. **UNTOUCHABLE:** `src/lab/labChecks.ts` · `src/data/*` ·
`src/symbols/*` · `verify-lab.ts` · the 15-spoke geometry · all canonical lore data.

---

## 2. Unit-by-unit results (exact outputs)

### Unit 0 — Tooling check — GREEN
- `bun --version` was **not** present → installed via the package's named command `irm bun.sh/install.ps1 | iex`.
- Result: **Bun 1.4.2** installed to `C:\Users\Andrew\.bun\bin\bun.exe`. `bun --version` prints `1.4.2`.
- Note: installer requires a new process for PATH; this session prepended `C:\Users\Andrew\.bun\bin` to `$env:Path` for every `bun` invocation. All subsequent bun commands resolved correctly.

### Unit 1 — Baseline gate proof (BEFORE any edit) — GREEN
Ran from app dir `Lotus_Adversity_Game/`:
1. `bun install` → **exit 0** · 252 packages installed (120.63s). Pre-existing warning: duplicate `vite` in package.json (dependencies + devDependencies) — recorded, out of scope.
2. `bun run lint` → **exit 0** (`tsc --noEmit`, clean).
3. `bun run lab:verify` → **exit 0** — AIRSEALED. All 6 gates PASS (Census · Numeric · Alden-North Geometry · SpokeId Registry · Data Integrity · Heraldry Uniqueness).

### Unit 2 — Named deletions — GREEN
Deleted exactly (git-tracked dead code; git is the undo):
1. `server.ts` → `Test-Path` = **False**
2. `src/components/GitSyncModal.tsx` → `Test-Path` = **False**
3. `src/components/ChamberView.tsx` → `Test-Path` = **False**

### Unit 3 — Named edits — DONE, exact targets only

**A. `src/App.tsx`** — ChamberView import removed; `{activeTab === "chamber" && <ChamberView />}` removed; footer right side re-flowed to `Pillars I–IV · 15-Spoke Matrix` (FLOWER 08 REVOKED line + its separator removed). Identity tags kept (`The Apparatus v2` · `Pillars I–IV` · `15-Spoke Matrix`).

**B. `src/components/Header.tsx`** — GitSyncModal import/`gitModalOpen` state/Git Sync button/`<GitSyncModal … />` render all removed; `chamber` NAV entry (badge `Unratified`) removed; FLOWER 08 / REVOKED pill (`bg-rose-400 animate-pulse`) removed. Lucide imports pruned: `Database`, `Cpu`, `Milestone` (Milestone was already unused — verified) → removed; `useState` also pruned (became unused). 5 nav tabs remain: Pantheon · Spokes · Heraldry · Codex · Pillars.

**C. `src/components/HeraldryView.tsx`** — audit surface card (One-Heraldry-One-Primitive Audit / `collisions` / `ShieldCheck`) removed; `computeCollisions` import, `ShieldCheck` import, `useMemo` + `const collisions` all removed; file-header comment updated (no longer references "the runtime audit surface"). Everything else kept verbatim: family switcher, Divine/Discipline/Armor content, dual forms, decrees, incantations, mitigation blocks, Deterministic Test Blow.

**D. `package.json`** — `name` → `"wheel-of-adversity"`; removed deps `@google/genai`, `archiver`, `dotenv`, `express`; removed devDeps `@types/archiver`, `@types/express`; scripts: `dev` → `vite`, `build` → `vite build`, `start` removed, `preview`/`clean`/`lint`/`lab:verify` unchanged. Nothing else changed (pre-existing duplicate `vite` left as-is).

**E. `index.html`** — 3 Google Fonts lines (preconnect ×2 + stylesheet `<link>`) removed. Title/meta/OG canon untouched (`Adversity — The Apparatus`). `Plus Jakarta Sans` dropped, not ported (was unreferenced in app).

**F. `src/index.css`** — appended 5 local `@font-face` blocks (Cinzel 500/700/900, MedievalSharp 400, Press Start 2P 400) at `./assets/fonts/*.woff2`, `font-display: swap`. Existing utilities, CRT blocks, `.font-cinzel/.font-medieval/.font-pixel` untouched.

### Unit 4 — Local fonts — GREEN
- Chose **`src/assets/fonts/`** (Vite-processed asset convention; `src/index.css` references `./assets/fonts/…`, relative to the CSS file).
- Downloaded once from Google Fonts (resolved woff2 URLs via the CSS2 API with a Chrome UA), **provenance**:
  - `https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=MedievalSharp&family=Press+Start+2P&display=swap` → resolved latin-subset woff2 URLs:
  - Cinzel 500/700/900 → `https://fonts.gstatic.com/s/cinzel/v26/8vIJ7ww63mVu7gt79mT7.woff2` (all three weights serve the SAME variable-font file; placed under three weight names)
  - MedievalSharp 400 → `https://fonts.gstatic.com/s/medievalsharp/v28/EvOJzAlL3oU5AQl2mP5KdgptMqhwMg.woff2`
  - Press Start 2P 400 → `https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2`
- Files: `Cinzel-500.woff2` (25,904 B) · `Cinzel-700.woff2` (25,904 B) · `Cinzel-900.woff2` (25,904 B) · `MedievalSharp-400.woff2` (38,788 B) · `PressStart2P-400.woff2` (12,512 B) — **all verified woff2 magic bytes (`77 4F 46 32`)**.
- Diagnostics: **zero** `fonts.googleapis`/`fonts.gstatic` references across the app dir; `index.html` has zero `http`/`https`; `src/` has zero `url(https://…)`. Closest proof of local loading: production build emits all fonts as local `dist/assets/*.woff2` (see Unit 5).

### Unit 5 — Post-strip verification — ALL GATES GREEN
1. `bun install` → **exit 0** — lockfile saved, **6 packages removed** (the server-era deps). Duplicate-`vite` warning persists (pre-existing; untouched).
2. `bun run lint` → **exit 0**
3. `bun run lab:verify` → **exit 0** — AIRSEALED (6/6 PASS). This proves `labChecks`/`data`/`symbols` were not harmed by the strip.
4. `bun run build` → **exit 0** — 1,693 modules transformed; `dist/` produced (~28.3s). Output includes only `index.html` + `assets/` (JS, CSS, local woff2). No `server.cjs`.
   - Note: Vite emitted **one** Cinzel woff2 (`Cinzel-500-DMUuCU8H.woff2`) because the three weight files are byte-identical (same served variable-font instance) — content-hash dedup; all three @font-face rules resolve to it. Expected/correct.
5. Grep diagnostics — recorded honestly (see §3 below).
6. Smoke (closest available proof — no browser automation available):
   - `bun run dev` (vite) booted: **ready in 6,388ms** on port 5199.
   - `GET /` → **200**, served HTML contains canonical title/meta, no font links, no server-era tags.
   - `GET /src/main.tsx` → **200** (2,196 B) — module transforms without error.
   - Server stopped cleanly after the probe. **Visual 5-tab walk NOT performed** (requires Drew's browser — see NOT-DONE).

### Unit 6 — Documentation + report
- ROADMAP.md: **one** milestone entry appended to the Completed section verbatim per package. **No other ROADMAP section/status touched** (Phase 0.5 / Flower 08 rulings deferred to the Architect walk per package).
- This report planted next to the task file. **HALT** after this report.

---

## 3. Grep diagnostics (exact record)

**`src/` (all strip-era patterns, case-insensitive where specified):**
- `chamber` — 6 hits, ALL benign + untouchable: `labChecks.ts:11` comment "Ratification Chamber" (**embargoed file**), `warpedPantheonData.ts:63` "Salt-Chamber Astrolabe" (canonical lore), `foreverFlowersData.ts:117` "Ratification Chamber" (canonical flower text, **embargoed**), `spokesAndPillarsData.ts:497` "hollow chambers" (in-world geology lore). **Zero code references to the deleted ChamberView/surface.**
- `GitSync` — **0 hits**.
- `/api/` — **0 hits**.
- `gemini` — **0 hits**.
- `express` — 5 hits, ALL the substring "express" inside "concreteGameplayExpressions" (`types.ts:119`, `spokesAndPillarsData.ts:464/494/524/554`) and "Concrete Gameplay Expressions" (`PillarsView.tsx:97/99`) — **canonical type/lore names, not the npm package/Express**.
- `@google/genai` · `archiver` · `dotenv` — **0 hits**.

**Repo-root docs:** hits confined to
- `WHEEL-CODEX-001_TASK.md` — the task file itself (excluded by package).
- `ROADMAP.md` (lines 12/24/32/33) — historical + current-focus narrative still describing the stripped v2 surfaces — **pre-existing; package explicitly froze all ROADMAP sections except the one appended entry.**
- `AGENTS.md` (lines 47/66/82–83/96/98) — Part 2 developer reference still documents `server.ts`, Express/Gemini endpoints, Chamber, GitSyncModal — **AGENTS.md was NOT a named target of this leaf; now stale vs ground truth — flagging for Architect walk / future leaf.**
- `README.md` (app dir, line 18: `GEMINI_API_KEY`/`.env.local`) — stale AI Studio boilerplate (AGENTS.md itself calls it stale); not a named target, untouched.
- `run.command` · `start.sh` · `tui.json` — **0 hits**.

**Font references:** `index.html` + `src/` → **zero** `fonts.googleapis`/`fonts.gstatic`; `index.html` zero `http`.

**`package.json`:** zero occurrences of `@google/genai`/`archiver`/`dotenv`/`express`/`tsx server`/`esbuild server` — scripts match Unit 3D exactly.

---

## 4. Deviations (all within package authority, none silent)
1. bun was not pre-installed → installed (Unit 0's named command). PATH prepend used for this session.
2. On one download attempt I anchored the path at the wrong directory (my error, no `workdir`); the command failed cleanly with **no side effects** (`Test-Path C:\Users\Andrew\Projects\src` = False afterward) and the re-run landed all 5 font files in the correct location.
3. Vite dedup emitted a single Cinzel woff2 in `dist/` (byte-identical 500/700/900 files) — noted above; no functional impact.

## 5. NOT-DONE / flagged for Architect walk (honest list)
1. **Visual browser walk** (5 tabs render: Pantheon · Spokes · Heraldry · Codex · Pillars; no Chamber, no Git Sync, no FLOWER 08 pill) — NOT performed; no browser automation in this environment. Closest proof recorded in Unit 5.6. **Drew/Architect should run `bun run dev` and confirm.**
2. **`AGENTS.md` Part 2 developer reference** still describes the removed backend/layout — NOT edited (not a named target; game-repo doctrine). Needs a follow-up leaf or Architect ruling.
3. **`ROADMAP.md` other sections** still narrate the 6-surface/Chamber-era v2 — NOT touched per explicit package instruction (rulings after the Architect walk).
4. **`README.md`** (app dir) stale AI Studio boilerplate (Gemini `.env.local`) — NOT touched.
5. **Stale "Ratification Chamber" mentions** inside embargoed canon (`labChecks.ts:11`, `foreverFlowersData.ts:117`) — UNTOUCHABLE per package; now historically stale.
6. Pre-existing duplicate `vite` in package.json — left as-is (package forbade any other package.json change); benign warning on every install.
7. `clean` script still references `server.js` (unchanged per package) — vestigial; awaiting Architect call (no `server.js` exists in the repo).

## 6. Definition of Done status
1. All named deletions (Unit 2) + named edits (Unit 3) done exactly — **MET** (git status shows exactly the intended M/D/?? set; all UNTOUCHABLE paths unmodified).
2. Local fonts served from the bundle; zero external font references (Unit 4) — **MET** (proved by build emitting local woff2 + greps).
3. `lint` 0 · `lab:verify` 0 · `build` 0 (Unit 5) — **MET** (exit codes recorded above).
4. Grep diagnostics — **CLEAN for code** (`src/` zero genuine residue); doc narrative drift flagged (AGENTS.md/ROADMAP.md/README.md + embargoed comments) awaiting Architect rulings.
5. ROADMAP single strip entry — **MET**; report planted; no staging residue.
6. HALT — **OBEYED.** No chaining into Electron or any other work.

---

**EXECUTED 2026-09-20 by DOER (1-Stone).** Drew: report submitted — HALT. Ready for the Architect walk.