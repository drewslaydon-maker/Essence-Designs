# GHOST-HUB-002 — DOER (1-Stone) STOP REPORT (UNIT 4 GATE FAILURE)

**Plant:** 2026-09-20 · **Status:** **STOPPED AT UNIT 4 B.2 — native binary gate**
**Executor:** DOER (1-Stone) · **Approved by:** Drew Slaydon (Studio Director)

> Per the task's own gate: "Verify binary: `Test-Path
> WASH\node_modules\electron\dist\electron.exe` → must be **True** ... If False
> → **STOP and report** (the machine needs the Wheel treatment — do not
> improvise a third fix)." That check is **False**, so this leaf STOPS here.
> `bun install` exit code was 0; the named remedy (`trustedDependencies` +
> `bun install`) did NOT produce the Electron binary on this machine.

---

## Restated Scope

Repair the GHOST-HUB-001 skeleton (D1–D7): single `/spawn` response, native
spawn in electron-main, Wheel-pattern native wrapper, ground-truth roster +
`hub-agents.json` personalization, honest UI, behavioral tests, sharper WASH
symbol. Chat lanes are NOT this leaf (GHOST-HUB-003). VCS HOLD — no commits.

---

## Unit-by-Unit Results

### Unit 0 — Baseline gate proof — **PASS**
| Item | Output |
|------|--------|
| `node --version` | v24.19.0 |
| `git status --short` | pre-existing dirty tree recorded (WASH/ untracked); **VCS HOLD respected** |
| D1 repro | status 200, body `{"pid":19448,"agent":"t","spawned":true}` — immediate one-shot only; `exitCode`/`stdout` never reached the client (second `sendJson` swallowed as "headers already sent") — **defect reproduced** |
| `dist/` contents | 4 files only: `electron-main.js`, `hub-server.js`, `hub.css`, `hub.html` — no electron binary, no launch script |
| `hub-agents.json` | did **not** exist (as specified) |

### Unit 1 — `WASH/hub-agents.json` — **PASS (created)**
Exact seed shape per task §Unit 1: version 1, note, 9 agents
(0-wake/1-stone/b-bolt/x-xp/wash council, cg/es-guru specters,
shadow-auditor/timelord shadow). JSON parses (9 agents, version 1).

### Unit 2 — `WASH/hub-server.js` — **PASS (repaired + smoke verified)**
- **D1 fixed:** immediate `sendJson({spawned:true})` removed; ONE response on
  `child.on("close")` → `{ ok, pid, agent, exitCode, signal, stdout(≤5000),
  stderr(≤5000) }`. D1 repro re-run: `{"ok":true,"pid":10188,"agent":"t",
  "exitCode":0,"signal":null,"stdout":"one\n","stderr":""}` — single response
  with child-close shape. `error` path keeps 500-once; `spawnSafe`+
  `timeoutMs` unchanged.
- **D4 fixed:** `hubAgents()` loader (miss → empty config, server still
  boots); defaults derived read-only from `.opencode/agents/*.md` (4 seats,
  code = stem, status active; fallback codes if dir missing), WASH status
  `live`, specters CG (READ-ONLY) + ES-GURU (isolated chat), shadow
  COURRIER (RATIFIED/live via b-bolt) + SHADOW AUDITOR + TIMELORD (dormant).
  Merge rule: config override/extension by id. Roster walks
  `06_THE_LEDGER/<SEAT>/<date>/*-TASK.md + *-REPORT.md` (both `-`/`_` suffix
  styles) → per-seat seals; major milestones from MILESTONES Part 2 rows
  (status Complete / Active Target → `M0 M0.5 M7 M8`); `level = seals +
  milestones`.
- **Chat stub honored:** `/chat` → `{ ok: true, relayed: true, note: "chat
  lanes ship in GHOST-HUB-003" }`.
- `/state` smoke: council 5 (Wake/Stone/Bolt/XP/WASH), specters 2 (cg,
  es-guru), shadow 3 (COURRIER active, SHADOW AUDITOR dormant, TIMELORD
  dormant), roster 9 rows; 1-stone seals include `SANDTRAP-001`, `WASH-001`.

### Unit 3 — `WASH/electron-main.js` — **PASS (repaired, `node --check` OK)**
- **D2 fixed:** `spawnServer()` spawns `node hub-server.js` via
  `spawnSafe()` (`cwd: __dirname`, `timeoutMs: 0`) BEFORE `waitForServer()` →
  `createWindow()`; `killServerChild()` on `before-quit` AND
  `window-all-closed` (kill-point on quit). Kept sizing, icon.ico reference,
  `loadURL("http://127.0.0.1:4749")`, contextIsolation, nodeIntegration
  false, sandbox true, no menu bar.

### Unit 4 — Wheel-pattern native wrapper — **PARTIAL / STOPPED**
**A. `WASH/package.json` — PASS (created exact shape)** — name
`essence-ghost-hub`, private, 0.2.0, main `electron-main.js`, scripts
`start`/`native`, `trustedDependencies: ["electron"]`, devDependency
electron `^44.4.3`.

**B1. `bun install` — PASS (exit 0)** — `bun install v1.4.2`, resolved
electron@44.4.3, 13 packages installed.

**B2. Binary verification — FAIL (hard gate).**
```
Test-Path WASH\node_modules\electron\dist\electron.exe  → False
```
Evidence gathered (read-only):
- `node_modules/electron/` contains abi_version, checksums.json, cli.js,
  electron.d.ts, index.js, install.js, LICENSE, package.json, README.md —
  **no `dist/`**, **no `path.txt`**.
- Installed `node_modules/electron/package.json` has **no `scripts` field**
  (`scripts: undefined`; keys: name, version, repository, description,
  license, author, keywords, main, types, bin, files, engines,
  dependencies). Electron's normal `postinstall` (`node install.js`, which
  downloads the ~100 MB binary) was **not present to run** — bun 1.4.2
  stripped the scripts field on extraction, so the binary never downloaded.
- `install.js` exists in the package but was never invoked.

Per the task instruction at this exact check — **STOP and report; do not
improvise a third fix** — execution halts here.

**C. `install.js` successor + `dist/` removal — NOT DONE** (gated behind the
stop; `dist/` still present, 4 stale copied files, no electron binary, no
launch script).

### Units 5–8 — **NOT DONE (halted at the gate)**
- Unit 5 (`hub.html` + `hub.css` fixes) — not started
- Unit 6 (`GHOST-HUB-002.test.js` behavioral suite) — not started
- Unit 7 (verification) — not started
- Unit 8 (final report + HALT) — superseded by this STOP report

---

## Honest NOT-DONE list

1. **Electron binary not installed** — `node_modules/electron/dist/electron.exe`
   does not exist; native launch cannot be verified or demonstrated this window.
2. `install.js` not yet replaced with the slim successor; stale `WASH/dist/`
   not yet removed (gated).
3. `hub.html` / `hub.css` repairs (D5 fake-spawn removal, D7 symbol sharpen +
   shadow/roster styles) not started.
4. `GHOST-HUB-002.test.js` not created or run (tests 5–8 would fail today:
   binary absent).
5. No commit — VCS HOLD respected.
6. No Captain's Log / Bible / MILESTONES / Pad / `.opencode/` / game code
   touched.

## Pre-existing note (not a leaf defect, recorded honestly)

`WASH/icon.ico` — referenced by `electron-main.js` (kept per task: "Keep:
... icon icon.ico") and the static file map — does **not exist** in WASH/
today. Electron opening without the custom icon is non-fatal (falls back);
serving `/icon.ico` would 404. Not a named target, so not created/modified.

---

**Decision point for Drew:** the named Wheel treatment landed `electron@44.4.3`
in `node_modules` but bun stripped the package's `scripts` field, so the
postinstall never ran and the binary never downloaded. Options are Drew's to
route (e.g. Wheel-proven sequence on this machine, a bun flag/version change,
`npm` fallback, or a manual binary placement). DOER stands by for a fresh
package — nothing was improvised beyond the named remedy.

**HALTED.**