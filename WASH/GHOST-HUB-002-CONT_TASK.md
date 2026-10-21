# GHOST-HUB-002-CONT — HUB SKELETON REPAIR · RESUMPTION (TASK PACKAGE)

> **From:** PLANNER (0-Wake, Big Pickle) → **For:** Drew's approval — **OPTION A
> ruled 2026-09-20** → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Purpose:** Resume **GHOST-HUB-002** at its legal STOP. The parent leaf halted
> at Unit 4 B.2 (electron binary absent — see `WASH/GHOST-HUB-002_REPORT.md`,
> the honest STOP record). This continuation applies the **Wheel-proven remedy**
> Drew sanctioned, then runs the remaining units (4C–8) **exactly as the parent
> package already specs them**. No new scope. Chat lanes remain OUT of scope
> (GHOST-HUB-003 — untouched). **VCS HOLD — no commits in this leaf.**

---

## 1. Resume Truth (verified by PLANNER, read-only, 2026-09-20)

The STOP report is confirmed against the machine:
- `WASH\node_modules\electron\dist\electron.exe` → **absent** (gate legitimately False).
- Extracted `node_modules\electron\package.json` → **no `scripts` field** (bun stripped it).
- `WASH\node_modules\electron\install.js` → **present**; `@electron/get` → **present** (hoisted).
- **Root cause (Wheel precedent):** electron@44.4.3 has NO postinstall — the binary
  downloads **lazily** (`index.js` → `install.js` → `@electron/get`). `trustedDependencies`
  is NOT the lever (the Wheel never granted it). The proven fix is the package's own
  `install.js`, run via node.
- Parent Units 1–3 already PASS (hub-agents.json, hub-server.js single-response /spawn,
  electron-main.js spawn+kill) — **do NOT redo or re-edit them**.
- Parent `dist/` still holds the 4 stale copied files (001-era) — removed in Unit C.

---

## 2. Mandatory pre-reads (in order)

1. `AGENTS.md` — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` — §6 leaf lifecycle, §8 guardrails, §10 DoD.
3. `WASH/GHOST-HUB-002_TASK.md` — the parent package (Units 4C–8 spec = ground truth for Units C–G below).
4. `WASH/GHOST-HUB-002_REPORT.md` — the STOP report (resume point + honest state).
5. `WASH/GHOST-HUB-MANDATE.md` — hub anatomy (council / specters / roster / TK / native standard).
6. `ED/03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/Lotus-Adversity-Game-main/WHEEL-NATIVE-001-REPORT.md`
   — **the proved remedy** (Unit 1 history: identical failure, Drew's "return to work"
   ruling, `node node_modules/electron/install.js` → gate GREEN, electron.exe 246,236,160 B).
7. `ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md` — Sandtrap law (already proven in parent Unit 3).

---

## 3. The Wheel Treatment (the remedy, with provenance)

Per the parent gate: *"the machine needs the Wheel treatment — do not improvise a
third fix."* The Wheel treatment IS the Wheel's own recorded sequence
(WHEEL-NATIVE-001 REPORT, Unit 1): after `bun install` lands the electron package
with no binary, **run the package's own installer with node**:

```
node "WASH\node_modules\electron\install.js"
```

This uses the package's documented lazy-download mechanism (~246 MB, network; same as
the Wheel's successful run via node v24.19.0). This is the sanctioned, proven action —
not an improvisation.

---

## 4. Units (execute in order; do NOT chain beyond this package)

### Unit A — Resume gate proof (BEFORE the remedy)

Record exact outputs:
1. `node --version` (expect v24.19.0).
2. `git status --short` — record pre-existing dirty paths (do NOT touch; **VCS HOLD**).
3. Confirm the stop state: `Test-Path WASH\node_modules\electron\dist\electron.exe` → **False** (expected).
4. Confirm remedy ingredients: `Test-Path WASH\node_modules\electron\install.js` → **True**;
   `Test-Path WASH\node_modules\@electron\get` → **True**.
5. Confirm parent Units 1–3 artifacts present and sane:
   `WASH\hub-agents.json` (9 agents, version 1) · `WASH\package.json`
   (trustedDependencies: ["electron"], scripts.native = "electron .") ·
   `node --check WASH\hub-server.js` and `node --check WASH\electron-main.js` → clean.
   (If any artifact is missing or corrupt → STOP and report; do NOT rebuild from memory.)

### Unit B — THE WHEEL TREATMENT (binary install)

1. From repo root: `node "WASH\node_modules\electron\install.js"` — the package's own
   download mechanism. (Allow a generous timeout for the ~246 MB download.)
2. Verify (record ALL):
   - `Test-Path WASH\node_modules\electron\dist\electron.exe` → must be **True**.
   - `(Get-Item WASH\node_modules\electron\dist\electron.exe).Length` → record size
     (Wheel precedent: 246,236,160 B).
   - `Get-Content WASH\node_modules\electron\dist\version` → record (expect `44.4.3`).
   - `Get-Content WASH\node_modules\electron\path.txt` → record (expect `electron.exe`).
3. If the gate is still **False** → **STOP and report** (no further improvisation —
   do NOT fall back to npm / manual placement without Drew).

### Unit C — Parent Unit 4C (install.js successor + stale dist/ removal)

1. **Replace `WASH/install.js`** (the 001-era D3 artifact) with the slim, honest
   Wheel-consistent helper. Its job (per parent Unit 4C):
   1. ensure `WASH/package.json` carries the approved shape (name essence-ghost-hub,
      private, main electron-main.js, scripts.start `node hub-server.js`,
      scripts.native `electron .`, trustedDependencies ["electron"], devDep electron ^44.4.3);
   2. run `bun install` (reproduce the parent's install — exit must be 0);
   3. if the electron binary is still missing after install, run the **Wheel
      treatment**: `node node_modules/electron/install.js` (comment the provenance:
      WHEEL-NATIVE-001, electron@44 lazy download — no postinstall exists to trust);
   4. print the electron binary path + verification (`Test-Path` + size) and exit 0/1.
   Keep the file name `install.js` (referenced by hub docs). No `dist/` copy step —
   the native app runs from source via `electron .`.
2. **Remove the stale broken `dist/` folder** (001-era, 4 copied files):
   `Remove-Item WASH\dist -Recurse -Force`. Confirm gone.
3. Re-verify the binary gate once more (Unit B.2 checks) after the helper is in place —
   record state (the helper's own run is not required again; the binary is already present).

### Unit D — Parent Unit 5 (hub.html + hub.css — D5, D7)

Execute parent Unit 5 exactly as written (`WASH/GHOST-HUB-002_TASK.md` §4 Unit 5):
- **`hub.html`:** keep 3-tab anatomy (council / specters / roster) + header + WASH symbol
  + footer TK MANIFEST link + version badge. Render from `/state`: council cards, specter
  cards (role, access, status), shadow cards, and a full roster list (agent + role +
  status + level + sealed-leaf badges + major milestone badges). **REMOVE the fake
  `spawnAgent` UI + `alert()` demo.** Replace the specter "Open Chat" button with a
  disabled-styled chip: `Chat — GHOST-HUB-003` (honest placeholder, no action). Keep tab
  router, SSE client, 30s state refresh, `escapeHtml` guarding.
- **`hub.css`:** keep PAD palette/identity. Sharpen `.hub-symbol`: purple smooth-edged
  box (rounded, red lining border), golden 4-leaf clover (4 rounded lobes + stem), red
  lining ON the clover (stroke/highlight) per Drew's spec (a near-4-lobe shape of 4
  circles + stem is acceptable; the key is the red lining reads on box AND clover). Add
  styles for shadow cards, roster badges, placeholder chips.

### Unit E — Parent Unit 6 (GHOST-HUB-002.test.js + run)

Create `WASH/GHOST-HUB-002.test.js` per parent Unit 6 — Node built-in `node --test`
(v24), behavioral assertions, the 8 named checks:
1. Server boots on `127.0.0.1:4749`; `GET /` serves shell with hub title.
2. `/spawn` single response — benign `node -e console.log('hub-spawn-ok')`; assert
   `status 200`, child-close shape (`ok === true`, `exitCode === 0`, `stdout` includes
   `hub-spawn-ok`), and ONLY ONE response body (fast client read — no hang/double).
3. `/state` ground truth: council includes Wake + WASH; specters include CG + ES-GURU;
   shadow includes COURRIER (via b-bolt) + SHADOW AUDITOR + TIMELORD; roster entries
   carry `seals` arrays and at least one of `SANDTRAP-001` / `WASH-001` is present from
   the live ledger.
4. `hub-agents.json` merge — the file drives displayName/role override (compare a known
   id's fields against the seed file).
5. Electron main spawns the server — read `electron-main.js`: assert it contains a spawn
   of `hub-server.js` with a kill path (static guard for D2); `node --check` passes.
6. Native wrapper — `package.json` has `trustedDependencies: ["electron"]`,
   `scripts.native === "electron ."`, and `Test-Path node_modules\electron\dist\electron.exe`
   is True.
7. No fake spawn — `hub.html` does NOT contain `hub-spawn-ok` or `alert("Spawned` (D5 regression).
8. TK manifest still readable via `/state`.

Run: `node --test WASH/GHOST-HUB-002.test.js`. Record exact pass/fail lines. If any
check fails → **STOP and report** (do NOT hack around a red test).

### Unit F — Parent Unit 7 (Verification)

1. All touched files present: `hub-agents.json`, `package.json`, `hub-server.js`,
   `electron-main.js`, `install.js`, `hub.html`, `hub.css`, `GHOST-HUB-002.test.js` — PASS/FAIL.
2. `GHOST-HUB-002.test.js` green (record lines) — PASS/FAIL.
3. `bun install`/electron binary present (`Test-Path` True + size) — PASS/FAIL.
4. Native launch smoke (optional but encouraged, Wheel Unit 6 pattern — only if Drew is
   present to eyeball): from `WASH/`, `bun run native` → native window with hub title,
   **no new chrome/msedge process**, kill child clean on quit. If Drew is not at the
   screen, record the launch-script state and mark this check **DEFERRED to Drew's
   window** honestly.
5. `git status --short` — ONLY this leaf's changes + pre-existing paths (record
   separately; **VCS HOLD — no commit**).
6. Boundary held: no `.opencode/`, `opencode.json`, game code, Pad, Log, Bible,
   MILESTONES, `01_OPERATING_CORE.md` changed — PASS/FAIL.

### Unit G — Parent Unit 8 (Report + HALT)

1. Plant `WASH/GHOST-HUB-002-CONT_REPORT.md` next to this file — restated scope,
   unit-by-unit results (resume proof, remedy output incl. binary path/size/version,
   4C helper + dist removal, 5 html/css, 6 test lines, 7 verification incl. launch smoke
   or honest DEFERRED, hash/DIFF notes), honest NOT-DONE list. The parent STOP report
   (`GHOST-HUB-002_REPORT.md`) stays in place as the historical stop record — do not
   overwrite it.
2. HALT. Do NOT touch Captain's Log, Bible, MILESTONES, Pad, or other files.
   Do NOT commit (VCS HOLD).

---

## 5. Definition of Done (DoD) — inherited from parent 002, now fully met when:

1. Electron binary present in `node_modules\electron\dist\electron.exe` (path.txt +
   version recorded) — the Wheel treatment applied.
2. `WASH/install.js` is the slim Wheel-consistent helper; stale `WASH/dist/` removed.
3. `hub.html`/`hub.css` honest (no fake spawn/alert; GHOST-HUB-003 chat placeholder;
   sharpened WASH symbol: purple box + golden clover with red lining on box AND clover).
4. `GHOST-HUB-002.test.js` behavioral suite green (all 8 checks, exact lines recorded).
5. `/spawn` single child-close response; native boot one-command (`bun run native`);
   roster real from ground truth + `hub-agents.json` personalization (parent Units 1–3
   intact, verified at the resume gate).
6. Report planted (`GHOST-HUB-002-CONT_REPORT.md`); HALT; VCS HOLD respected.

---

## 6. Guardrails (identical to parent)

- Touch ONLY: `WASH/hub-agents.json` (verify only — no edit), `WASH/package.json`
  (verify only — no edit), `WASH/hub-server.js` + `WASH/electron-main.js` (verify only —
  if a defect surfaces → STOP and report; do NOT re-edit blind), `WASH/install.js`
  (REPLACE — Unit C), `WASH/hub.html`, `WASH/hub.css`, `WASH/GHOST-HUB-002.test.js`
  (new), `WASH/GHOST-HUB-002-CONT_REPORT.md` (new), `WASH/dist/` (remove stale copy).
- **WASH is reference** for everything else: do NOT modify `WASH/server.js`,
  `WASH/wash.test.js`, `WASH/app.js`, `WASH/index.html`, `WASH/style.css`,
  `WASH/icon.ico` (absent today — Electron icon fallback is non-fatal; NOT a target).
- **Zero discretion:** any surprise → STOP and report (BROWN BANANA BREAD for danger);
  no adjacent fixes (chat = 003, no exception).
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`, `.opencode/`,
  `opencode.json`, Pad/Log/Bible/MILESTONES — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle) — OPTION A (Drew's ruling).**
Drew: point the DOER (1-Stone) window at this file to execute. Executor: read the
STOP report + this package, run the resume gate, apply the Wheel treatment, execute
Units C–G, report, HALT.