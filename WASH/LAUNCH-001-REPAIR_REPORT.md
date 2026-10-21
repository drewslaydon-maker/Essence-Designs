# LAUNCH-001-REPAIR — REPORT

**Executed by:** DOER (1-Stone) · **Date:** 2026-09-22 ·
**Task package:** `WASH/LAUNCH-001-REPAIR_TASK.md` (Plant, PLANNER 2026-09-22, Drew-approved)
**Status:** COMPLETE — HALTED PER PROTOCOL. The walk-through window is LIVE.

---

## 1. Restated Scope

Root-cause fix for the LAUNCH-001 window-missing failure, then USE the fixed
tool to deliver Drew's walk-through window. Touch ONLY `WASH/launch-hub.js`
(full-file rewrite) + this report. **VCS HOLD — no commits.**

Baseline state verified at plant time by PLANNER: no listeners on
4748–4756; no electron/node processes; hub server DOWN; ports free;
`electron.exe` present. Clean-path boot expected (electron-main spawns the
hub-server itself → no EADDRINUSE).

---

## 2. Unit-by-Unit Results

### 4.1 Unit 0 — Baseline gate proof (recorded BEFORE editing)

| Check | Command | Result |
|---|---|---|
| Node version | `node --version` | **v24.19.0** |
| Dirty tree | `git status --short` | Pre-existing dirty tree confirmed (repo-wide modified/untracked, incl. `?? WASH/`). **VCS HOLD recorded.** |
| Ports 4748–4756 | `Get-NetTCPConnection -LocalPort 4748..4756 -State Listen` | **NO listeners** ✓ |
| Processes | `Get-Process -Name electron,node` | **none** ✓ |
| Electron binary | `Test-Path WASH\node_modules\electron\dist\electron.exe` | **True** ✓ |
| Baseline file | Read `WASH/launch-hub.js` | Confirmed LAUNCH-001 §3 content — spawns via `spawnSafe(ELECTRON_EXE, ["."], { cwd: WASH_DIR, timeoutMs: 0 })` + pipe relay + `process.exit(0)` ✓ (to be replaced) |

All six gates green — clean-path boot confirmed.

### 4.2 Unit 1 — Rewrite `WASH/launch-hub.js`

- Full-file overwrite performed with the task §3 content, **character-exact**
  (verified against `LAUNCH-001-REPAIR_TASK.md` lines 76–183: 106 lines,
  file written at 09/22/2026 4:25:59 PM).
- `node --check WASH/launch-hub.js` → **clean** (post-edit re-run: clean).
- Grep proofs (in `launch-hub.js`):
  - Contains `detached: true` ✓ (line 82)
  - Contains `windowsHide: false` ✓ (line 83)
  - Contains `stdio: "ignore"` ✓ (line 84)
  - Contains `child.unref()` ✓ (line 90)
  - **No functional `spawnSafe` reference remains** ✓ — the word appears
    ONLY inside the §3-mandated REPAIR-001 documentation comments (lines
    17–19, 83); no `require("...spawn-safe.js")`, no `spawnSafe(` call.
  - Requires are ONLY the four module lines: `child_process` (spawn),
    `http`, `path`, `fs` ✓ (lines 27–30)

### 4.3 Unit 2 — Full regression FIRST (server down; NO skips)

All suites run before the launch; **all green, zero skips, zero failures**:

| Suite | Port | Result |
|---|---|---|
| `wash.test.js` | 4748 | **8/8** ✓ |
| `GHOST-HUB-001.test.js` | 4749 | **10/10** ✓ |
| `GHOST-HUB-002.test.js` | 4749 | **8/8** ✓ |
| `GHOST-HUB-003.test.js` | 4750 | **6/6** ✓ |
| `GHOST-HUB-004.test.js` | 4751 | **6/6** ✓ |
| `GHOST-HUB-005.test.js` | 4752 | **6/6** ✓ |
| `GHOST-HUB-006.test.js` | 4753 | **6/6** ✓ |
| `GHOST-HUB-007.test.js` | 4754 | **6/6** ✓ |
| `GHOST-HUB-008.test.js` | 4755 | **9/9** ✓ |

Note: GHOST-HUB-004 T2 still asserts `v0.3 — Sandtrap-secured`
(V-D-002's named delta — expected, not this leaf's scope).

### 4.4 Unit 3 — THE WALK-THROUGH LAUNCH (the deliverable)

Command: `node WASH/launch-hub.js` (from repo root). **Full output:**

```
[LAUNCH GHOST HUB]
[LAUNCH GHOST HUB] server down — the native window will bring it up (electron-main spawn)
[LAUNCH GHOST HUB] launching native window (electron) …
[LAUNCH GHOST HUB] native window spawned (pid 4528)
[LAUNCH GHOST HUB] server reachable on 127.0.0.1:4749
[LAUNCH GHOST HUB] done — this launcher exits. The window is Drew's.
```

**LAUNCHER_EXIT_CODE: 0**

Clean boot, exactly as predicted: `server down` line, `native window
spawned (pid 4528)`, `server reachable on 127.0.0.1:4749`, exit 0.
**No EADDRINUSE line** (server was down; nothing held 4749).

**CRITICAL — post-exit survival proof** (~5 s after launcher exit; retried
up to 3× over ~10 s):

| Check | Command | Result |
|---|---|---|
| Electron alive + titled | `Get-Process -Name electron ... Select Id,MainWindowTitle` | **PID 4528 → MainWindowTitle = `ESSENCE DESIGNS GHOST HUB`** ✓ (pid matches the launcher's `spawned (pid 4528)` — survived launcher exit; other electron entries 4648/19428/21716 are renderer/GPU children) |
| 4749 listener | `Get-NetTCPConnection -LocalPort 4749 -State Listen` | **Listen on 127.0.0.1:4749, OwningProcess 13828** ✓ (electron's hub-server child) |
| HTTP 200 | `Invoke-WebRequest http://127.0.0.1:4749/ -UseBasicParsing` | **200** ✓ + served content contains `ESSENCE DESIGNS GHOST HUB` |

**THE WINDOW IS UP AND LEFT RUNNING — Drew's walk-through.** Not killed,
not restarted, not re-run.

Unit 3 step 4 honored: GHOST-HUB-001/002 NOT re-run after launch (4749
held by design).

### 4.5 Unit 4 — Verification diagnostics

1. Grep proofs per Unit 1 — see §4.2 ✓. `node --check` re-run post-edit:
   **clean** ✓.
2. `git status --short WASH/` → `?? WASH/` (whole WASH tree untracked,
   same as baseline; leaf surface = `WASH/launch-hub.js` +
   `WASH/LAUNCH-001-REPAIR_REPORT.md` inside it). **No commit (VCS HOLD).**
3. **Boundary held** — timestamp/status check on the NOT-touched files:
   `electron-main.js` (09/20 8:46 PM), `hub-server.js` (09/21 4:25 PM),
   `package.json` (09/22 3:08 AM — pre-session),
   `ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` (09/20 4:47 PM) — **none
   written during this session**; `Test-Path WASH\spawn-safe.js` = False
   (no stray copy exists). Test files, `.opencode/`, `opencode.json`,
   `ED/` docs, game code: untouched.
4. Post-exit state still true at report time: electron **PID 4528** titled
   **ESSENCE DESIGNS GHOST HUB**, 4749 listener PID 13828. **Nothing
   killed.**

---

## 3. VLAN HOT-FIX NOTES (what changed, honestly)

- Only one file changed: `WASH/launch-hub.js` (full rewrite per §3).
- The spawn is now raw `child_process.spawn` with `detached: true`,
  `windowsHide: false`, `stdio: "ignore"`, `child.unref()` — per package.
  `spawn-safe.js` is untouched (embargoed) and continues to serve
  server/agent children (hub-server spawn inside `electron-main.js`
  unchanged).

---

## 4. Definition of Done Check

| # | DoD item | Status |
|---|---|---|
| 1 | `launch-hub.js` rewritten per §3; `node --check` clean; zero-dep (node built-ins only); no functional `spawnSafe` reference | **MEET** ✓ |
| 2 | Full regression green BEFORE launch: 001 **10/10** + 002–008 + wash, no skips | **MEET** ✓ |
| 3 | Fixed tool executed: exit 0, launcher exits, **electron persists with titled window `ESSENCE DESIGNS GHOST HUB` after launcher exit**, 4749 reachable | **MEET** ✓ — walk-through delivered |
| 4 | Boundary + VCS HOLD honored; report planted; HALT | **MEET** ✓ |

## 5. NOT-DONE (honest)

- Nothing committed (VCS HOLD honored).
- No `spawn-safe.js` / `electron-main.js` / `hub-server.js` /
  `package.json` / test / doc / `.opencode/` changes (all embargoed or
  out of scope this leaf).
- No kill/restart/re-run of the live window or server — off-limits per
  guardrails.
- No adjacent fixes or improvisations — zero surprises, so none needed.

---

## 6. VCS HOLD PROOF

`git status --short` before: pre-existing dirty tree (no commit made this
session). After: `WASH/` remains untracked `?? WASH/` as baseline.
**No `git add`, no `git commit`, no amends anywhere.**

---

## 7. HALT

Executed: `WASH/launch-hub.js` rewrite + full green regression + walk-
through launch + post-exit survival proof. **Drew: the window is UP —
`ESSENCE DESIGNS GHOST HUB` at http://127.0.0.1:4749 — walk through at
your leisure.** Per the package: the sequence resumes after your
validation → V-D-002 (already planted) → then the V1.0 seal pass.

Single Output Stop: reporting and waiting for the next approved package.

---

**REPORTED 2026-09-22 by DOER (1-Stone).**