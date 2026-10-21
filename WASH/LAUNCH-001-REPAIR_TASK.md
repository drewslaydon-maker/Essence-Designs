# LAUNCH-001-REPAIR — GHOST HUB LAUNCHER WINDOW FIX + WALK-THROUGH LAUNCH (TASK PACKAGE)

**Planted:** 2026-09-22 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (2026-09-22 — "stone ran our last patch, but i
wasnt able to do a walkthru of our ghost hub. pls launch it for me")

> Scope-locked package. Root-cause fix for the LAUNCH-001 window-missing
> failure, then USE the fixed tool to deliver Drew's walk-through window.
> Touch ONLY the named target. Run, report, HALT. **VCS HOLD — no commits.**

---

## 1. Intent (what this leaf delivers)

Stone's LAUNCH-001 report (09-22) showed the tool landed but the native
window did not survive: the spawned electron died ~7s after the launcher's
`process.exit(0)`, and while the parent was held alive no
`MainWindowTitle` presented. PLANNER root-caused BOTH faults to the way
`WASH/launch-hub.js` spawns Electron **through `spawn-safe.js`**:

1. **Hidden window.** `spawn-safe.js` defaults `windowsHide: true` — so the
   Electron window was spawned HIDDEN. No titled window can present while
   hidden → explains the held-alive no-title observation.
2. **Pipe-death on parent exit.** `spawnSafe`'s
   `stdio: ["ignore","pipe","pipe"]` + no `detached` means the electron
   children die when the launcher's `process.exit(0)` closes the pipe
   read-ends on this Windows box ("children tolerate EPIPE" does not hold).
   Stone reproduced this twice.

**Fix:** spawn the Electron window from `launch-hub.js` directly (raw Node
`spawn`) with `detached: true` (own process group — survives launcher exit
on Windows), `windowsHide: false` (the window MUST show — it is the
deliverable, not a hidden harness child), `stdio: "ignore"` (no terminal
inherited — stronger than pipe; nothing to relay since the launcher exits
promptly), and `child.unref()` so the launcher can exit while the window
lives on. The kill-point is Electron's own lifecycle
(`window-all-closed → quit` in `electron-main.js` kills the hub-server
child) — the launcher never kills (original LAUNCH-001 contract unchanged).
This deviates from `spawn-safe.js` for THIS single GUI-window spawn only:
the Sandtrap discipline's own boundary says it covers the **studio infra
harness**, not the user-facing surface (Wheel precedent: WHEEL-NATIVE-001
runs Electron visibly from a terminal script, not through spawnSafe).
`spawn-safe.js` is **NOT touched** — it stays correct for server/agent
children (hub-server in `electron-main.js` still goes through it).

State at plant time (verified by PLANNER, 2026-09-22):

- **No listeners on 4748–4756; no `electron`/`node` processes** — the hub
  server (PID 35596 from LAUNCH-001 baseline) is DOWN. Ports are free.
- `WASH/launch-hub.js` exists exactly as LAUNCH-001 §3 (spawns via
  `spawnSafe`, pipes, `process.exit(0)`).
- `WASH/node_modules/electron/dist/electron.exe` exists (verified per
  LAUNCH-001 Unit 0).
- Server-down means THIS boot is the clean path: electron-main spawns the
  hub-server itself → NO EADDRINUSE noise (the known-cosmetic note only
  occurred when 4749 was already held).
- Launch naming convention: `LAUNCH GHOST HUB` (Pad, 2026-09-20).

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/launch-hub.js` | EDIT — REWRITE to the §3 content (character-exact) |
| `WASH/LAUNCH-001-REPAIR_REPORT.md` | CREATE — report + HALT |

NOT touched: `WASH/spawn-safe.js` (it lives at
`ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` and is **embargoed** — read-only
this leaf), `WASH/electron-main.js`, `WASH/hub-server.js`, `WASH/package.json`
(launch script already landed), `WASH/hub.html`, `WASH/hub.css`,
`WASH/app.js`, `WASH/style.css`, `WASH/index.html`, `WASH/hub-agents.json`,
every test file, `.opencode/` (incl. `command/launch.md`), `opencode.json`,
`ED/` docs, game code.

## 3. `WASH/launch-hub.js` — rewrite this file to EXACTLY this content

```js
"use strict";

/**
 * LAUNCH GHOST HUB — one-ask launcher for the ESSENCE DESIGNS GHOST HUB
 * native window (studio standard: native over http://127.0.0.1:4749).
 * Created under LAUNCH-001 (2026-09-22); window-fix under LAUNCH-001-REPAIR
 * (2026-09-22).
 *
 * Contract:
 *  - Detects whether the hub server is already live on 127.0.0.1:4749.
 *  - If not live, the native window's own electron-main.js spawns it as its
 *    Sandtrap child and kills it on quit (proven one-command boot).
 *  - Launches the native window via the verified electron binary.
 *  - Never kills existing processes. Exit 0 after spawning — the window and
 *    its server child outlive this launcher by design.
 *
 * REPAIR-001 (why this window spawn is raw, not spawnSafe):
 *  - spawnSafe defaults windowsHide:true — the window MUST be visible.
 *  - spawnSafe pipes die on this launcher's exit (Windows) — the window
 *    must live detached (own process group) and unref'd.
 *  - stdio "ignore" inherits NO terminal at all (Sandtrap spirit); the
 *    launcher exits promptly so there is nothing to relay.
 *  - Kill-point = Electron's own app lifecycle (window-all-closed -> quit
 *    kills the hub-server child). This launcher never kills.
 */

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const HUB_URL = "http://127.0.0.1:4749";
const WASH_DIR = __dirname;
const ELECTRON_EXE = path.join(WASH_DIR, "node_modules", "electron", "dist", "electron.exe");

function serverLive() {
  return new Promise((resolve) => {
    const req = http.get(HUB_URL, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForServer(retries = 20, interval = 500) {
  return new Promise((resolve) => {
    const check = async (attempt) => {
      if (await serverLive()) return resolve(true);
      if (attempt >= retries) return resolve(false);
      setTimeout(() => check(attempt + 1), interval);
    };
    check(0);
  });
}

async function main() {
  console.log("[LAUNCH GHOST HUB]");

  const wasLive = await serverLive();
  console.log(
    wasLive
      ? "[LAUNCH GHOST HUB] server already live on 127.0.0.1:4749 (reusing)"
      : "[LAUNCH GHOST HUB] server down — the native window will bring it up (electron-main spawn)"
  );

  if (!fs.existsSync(ELECTRON_EXE)) {
    console.error(
      "[LAUNCH GHOST HUB] electron binary missing — run the Wheel treatment first:\n" +
        '  node "WASH\\node_modules\\electron\\install.js"'
    );
    process.exit(1);
  }

  console.log("[LAUNCH GHOST HUB] launching native window (electron) …");
  const child = spawn(ELECTRON_EXE, ["."], {
    cwd: WASH_DIR,
    detached: true, // LAUNCH-001-REPAIR: own process group — survives this launcher's exit on Windows
    windowsHide: false, // LAUNCH-001-REPAIR: spawnSafe's default hides the window; the window MUST show
    stdio: "ignore", // LAUNCH-001-REPAIR: no terminal inherited, no pipes to die on parent exit
  });
  child.on("error", (err) => {
    console.error("[LAUNCH GHOST HUB] electron spawn error:", err.message);
    process.exit(1);
  });
  child.unref(); // LAUNCH-001-REPAIR: this launcher may exit; the window lives on
  console.log(`[LAUNCH GHOST HUB] native window spawned (pid ${child.pid})`);

  if (!wasLive) {
    const up = await waitForServer();
    console.log(
      up
        ? "[LAUNCH GHOST HUB] server reachable on 127.0.0.1:4749"
        : "[LAUNCH GHOST HUB] WARNING: server not reachable yet (check the window)"
    );
  }

  console.log("[LAUNCH GHOST HUB] done — this launcher exits. The window is Drew's.");
  process.exit(0);
}

main();
```

## 4. Units

### 4.1 Unit 0 — Baseline gate proof (record BEFORE editing)
1. `node --version`.
2. `git status --short` — record the pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen -ErrorAction SilentlyContinue` — expect **NO listeners** (PLANNER verified at plant time).
4. Processes: `Get-Process -Name electron,node -ErrorAction SilentlyContinue` — expect **none**.
5. `Test-Path WASH\node_modules\electron\dist\electron.exe` — expect True.
6. Read `WASH/launch-hub.js` — confirm current content matches LAUNCH-001 §3 (spawnSafe spawn to be replaced).

### 4.2 Unit 1 — Rewrite `WASH/launch-hub.js`
Write the §3 content character-exact (full file overwrite). Then:
- `node --check WASH/launch-hub.js` → clean.
- Grep proof: contains `detached: true`, `windowsHide: false`, `stdio: "ignore"`, `child.unref()`; does NOT contain `spawnSafe`; requires are ONLY the four module lines (`child_process`, `http`, `path`, `fs`).

### 4.3 Unit 2 — Full regression FIRST (ports are free — server down; NO skips; the launch in Unit 3 holds 4749 afterward)
Run and record each (green mandatory):
- `node --test WASH/wash.test.js` — 4748.
- `node --test WASH/GHOST-HUB-001.test.js` — 4749, expect **10/10** (REPAIR-2 delta proven; one full run suffices this leaf).
- `node --test WASH/GHOST-HUB-002.test.js` — 4749.
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751 (still asserts `v0.3 — Sandtrap-secured` — V-D-002's named delta, not yours).
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754.
- `node --test WASH/GHOST-HUB-008.test.js` — 4755.

### 4.4 Unit 3 — THE WALK-THROUGH LAUNCH (the deliverable)
1. `node WASH/launch-hub.js` from repo root — record full output. Expect:
   `server down — the native window will bring it up`, `native window
   spawned (pid …)`, `server reachable on 127.0.0.1:4749`, exit 0. This boot
   should be CLEAN — no EADDRINUSE line (server was down; nothing holds 4749).
2. **CRITICAL — post-exit survival proof** (the exact failure LAUNCH-001
   shipped): AFTER the launcher exits (~5 s later), verify the window is
   still alive:
   - `Get-Process -Name electron -ErrorAction SilentlyContinue | Select-Object Id,MainWindowTitle`
     — retry up to 3× over ~10 s; expect process(es) AND
     `MainWindowTitle` = **ESSENCE DESIGNS GHOST HUB**.
   - `Get-NetTCPConnection -LocalPort 4749 -State Listen -ErrorAction SilentlyContinue`
     — expect a listener (electron's hub-server child).
   - `Invoke-WebRequest http://127.0.0.1:4749/ -UseBasicParsing` → 200.
3. Leave it all running. This is the window Drew walks through.
4. Do NOT re-run GHOST-HUB-001/002 after this unit — the live server now
   holds 4749 by design (same reason LAUNCH-001 SKIPPED them).

### 4.5 Unit 4 — Verification diagnostics
1. Grep proofs per Unit 1; `node --check` clean (re-run post-edit).
2. `git status --short` — leaf surface = `WASH/launch-hub.js` +
   `WASH/LAUNCH-001-REPAIR_REPORT.md` (+ `WASH/` untracked as baseline).
   **No commit (VCS HOLD).**
3. Boundary held — `spawn-safe.js`, `electron-main.js`, `hub-server.js`,
   `package.json`, `.opencode/`, all test files untouched (timestamp/status
   check).
4. Post-exit state from Unit 3 still true at report time: electron window
   titled **ESSENCE DESIGNS GHOST HUB**, 4749 live. Nothing killed.

### 4.6 Unit 5 — Report + HALT
Plant `WASH/LAUNCH-001-REPAIR_REPORT.md` — restated scope, unit-by-unit
results (baseline, exact file rewrite, regression table, the FULL launcher
output block, the post-exit survival proof: electron pid + MainWindowTitle +
4749 listener + HTTP 200), honest NOT-DONE list, VCS HOLD proof. HALT. Tell
Drew the window is up for his walk-through.

## 5. Definition of Done

1. `WASH/launch-hub.js` rewritten per §3; `node --check` clean; zero-dep
   (node built-ins only: `child_process`, `http`, `path`, `fs`); no
   `spawnSafe` reference remains.
2. Full regression green BEFORE launch: 001 **10/10** + 002–008 + wash — no
   skips.
3. Fixed tool executed successfully: exit 0, launcher exits, **electron
   persists with the titled window — `ESSENCE DESIGNS GHOST HUB` —
   after launcher exit**, `http://127.0.0.1:4749` reachable. The walk-through
   launch is actually delivered.
4. Boundary + VCS HOLD honored; report planted; HALT.

## 6. Guardrails

- Touch ONLY `WASH/launch-hub.js` (full-file rewrite per §3) + this report.
  No `electron-main.js` edits, no `spawn-safe.js` edits (embargoed), no
  package/test/doc changes, no "while I'm here" fixes.
- **Once launched, the window and its 4749 server are OFF-LIMITS — never
  kill, restart, or re-run the launcher against a live server.**
- Zero discretion: any surprise (launcher exit ≠ 0, window missing/title
  wrong, post-exit death, suite red) → STOP + record + flag for PLANNER; no
  adjacent fixes, no alternate launch commands improvised.
- BROWN BANANA BREAD for anything dangerous.
- Embargoes: `00_ESSENCE_CORE/` (incl. `spawn-safe.js`), `01_THE_DESIGNS/`,
  `03_THE_GAMES/`, `opencode.json`, everything under `.opencode/` — read-only,
  untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-22 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute. After the
walk-through validates, the sequence resumes: V-D-002 (already planted) →
then the V1.0 seal pass.