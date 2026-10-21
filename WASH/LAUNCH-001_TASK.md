# LAUNCH-001 — GHOST HUB LAUNCH TOOL + WALK-THROUGH LAUNCH (TASK PACKAGE)

**Planted:** 2026-09-22 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (2026-09-22 — "we need to launch so i can walk
through. we should also make a tool for this, so its able to be done within
just a few seconds of an ask for it")

> Scope-locked package. Build a one-ask Ghost Hub launcher, then USE it to
> launch the native window for Drew's walk-through. Touch ONLY the named
> targets. Run, report, HALT. **VCS HOLD — no commits.**

---

## 1. Intent (what lands)

1. **The tool:** a deterministic launcher (`WASH/launch-hub.js`) + an opencode
   slash command (`.opencode/command/launch.md`) + an npm script
   (`launch`) — so "launch ghost hub" is a few seconds from ask to native
   window, every time, no terminal knowledge required.
2. **The walk-through launch:** run the tool NOW so Drew can walk through the
   current hub (v0.3 shell, REPAIR-1 server deltas, full green suite set).

State at plant time (verified by PLANNER):

- **The hub server is ALREADY LIVE on `127.0.0.1:4749`** (node `WASH/hub-server.js`,
  PID 35596, started 09/22 2:29 AM, parent gone). Do NOT kill it — the tool
  must detect and reuse it.
- No native Electron window is up (no electron process).
- `WASH/node_modules/electron/dist/electron.exe` exists (verified 44.4.3,
  GHOST-HUB-002-CONT).
- `WASH/package.json` = v0.3.0; scripts `start` + `native`; GHOST-HUB-002 test 6
  asserts ONLY `trustedDependencies` includes electron, `scripts.native ===
  "electron ."`, and the electron.exe exists — so adding a `launch` script is
  SAFE (checked by PLANNER).
- Launch naming convention: `LAUNCH GHOST HUB` (Pad, 2026-09-20).

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/launch-hub.js` | CREATE — the idempotent launcher (content in §3) |
| `WASH/package.json` | EDIT — add `"launch": "node launch-hub.js"` to `scripts` (nothing else) |
| `.opencode/command/launch.md` | CREATE — `/launch` command (content in §4) |
| `WASH/LAUNCH-001_REPORT.md` | CREATE — report + HALT |

NOT touched: `WASH/hub-server.js`, `WASH/electron-main.js`, `WASH/hub.html`,
`WASH/hub.css`, `WASH/app.js`, `WASH/style.css`, `WASH/index.html`,
`WASH/hub-agents.json`, every test file, `opencode.json`, `ED/` docs, game
code. Live hub process (PID 35596 on 4749) **OFF-LIMITS — never kill or
restart it.**

## 3. `WASH/launch-hub.js` — the launcher (write exactly this)

Zero-dep (node built-ins + the studio `spawn-safe.js`, same require pattern
as `electron-main.js`). It never kills anything. It exits promptly after
spawning (the native window and its Sandtrap server child outlive it).

```js
"use strict";

/**
 * LAUNCH GHOST HUB — one-ask launcher for the ESSENCE DESIGNS GHOST HUB
 * native window (studio standard: native over http://127.0.0.1:4749).
 * Created under LAUNCH-001 (2026-09-22).
 *
 * Contract:
 *  - Detects whether the hub server is already live on 127.0.0.1:4749.
 *  - If not live, the native window's own electron-main.js spawns it as its
 *    Sandtrap child and kills it on quit (proven one-command boot).
 *  - Launches the native window via the verified electron binary.
 *  - Never kills existing processes. Exit 0 after spawning — children live on.
 */

const { spawnSafe } = require("../ED/00_ESSENCE_CORE/INFRA/spawn-safe.js");
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
  const child = spawnSafe(ELECTRON_EXE, ["."], { cwd: WASH_DIR, timeoutMs: 0 });
  child.stdout.on("data", (d) => process.stdout.write(String(d)));
  child.stderr.on("data", (d) => process.stderr.write(String(d)));
  child.on("error", (err) => {
    console.error("[LAUNCH GHOST HUB] electron spawn error:", err.message);
    process.exit(1);
  });
  console.log(`[LAUNCH GHOST HUB] native window spawned (pid ${child.pid})`);

  if (!wasLive) {
    const up = await waitForServer();
    console.log(
      up
        ? "[LAUNCH GHOST HUB] server reachable on 127.0.0.1:4749"
        : "[LAUNCH GHOST HUB] WARNING: server not reachable yet (check the window)"
    );
  }

  // Drain handlers die with this process; children tolerate EPIPE on later
  // writes (low log volume). The window owns its server child's lifecycle.
  console.log("[LAUNCH GHOST HUB] done — this launcher exits. The window is Drew's.");
  process.exit(0);
}

main();
```

Known-cosmetic note (record in report, do NOT fix): when the server is already
live, electron-main's own `spawnServer()` also tries to spawn a hub-server →
EADDRINUSE on 4749 → one logged `server spawn error` line from electron-main,
then `waitForServer()` succeeds against the existing server and the window
loads fine. Acceptable; `electron-main.js` is out of scope for this leaf.

## 4. `.opencode/command/launch.md` — the ask-level tool (write exactly this)

```md
---
title: launch
description: Launch the ESSENCE DESIGNS GHOST HUB native window (127.0.0.1:4749) in seconds.
agent: essence
---

# /launch — ESSENCE DESIGNS GHOST HUB

Bring the Ghost Hub up for Drew — native window over `http://127.0.0.1:4749`
(studio standard, Wheel precedent). One ask, seconds to window.

1. Run `node WASH/launch-hub.js` from the repo root.
2. Report: server state (already-live or brought up), electron pid,
   reachability of 127.0.0.1:4749. HALT.

Seat rule: PLANNER (0-Wake) does NOT execute launches itself — if your seat is
PLANNER, route to DOER (point the 1-Stone window at `WASH/LAUNCH-001_TASK.md`)
and HALT. DOER (or a builder seat) runs it directly.
```

## 5. Units

### 5.1 Unit 0 — Baseline gate proof (record BEFORE editing)
1. `node --version`.
2. `git status --short` — record the pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen`
   — expect **4749 LIVE** (record PID + command line + start time via
   `Get-CimInstance Win32_Process`). Do NOT stop it.
4. `Test-Path WASH\node_modules\electron\dist\electron.exe` — expect True
   (record size/version from GHOST-HUB-002-CONT if helpful).
5. Read `WASH/package.json` + `GHOST-HUB-002.test.js` test 6 (lines ~146–157)
   — confirm the added `launch` script cannot break it (it only asserts
   `trustedDependencies`, `scripts.native === "electron ."`, binary presence).

### 5.2 Unit 1 — Create `WASH/launch-hub.js`
Write the §3 content character-exact. `node --check WASH/launch-hub.js` →
clean. Grep proof: contains `spawnSafe`, `4749`, `ELECTRON_EXE`, no other
requires besides the four module lines.

### 5.3 Unit 2 — Edit `WASH/package.json`
Add ONLY `"launch": "node launch-hub.js",` to `scripts` (place it AFTER
`"native"`). `scripts.start` and `scripts.native` unchanged. Validate:
`Get-Content WASH/package.json | ConvertFrom-Json` parses cleanly; version
stays `0.3.0`.

### 5.4 Unit 3 — Create `.opencode/command/launch.md`
Write the §4 content character-exact. Grep proof: file exists, frontmatter
`title: launch`, body contains `node WASH/launch-hub.js`.

### 5.5 Unit 4 — Run the tool (the walk-through launch)
1. `node WASH/launch-hub.js` from repo root — record full output. Given
   baseline state it MUST print `server already live on 127.0.0.1:4749
   (reusing)` and `native window spawned (pid …)`, exit 0.
2. Verify the window: `Get-Process -Name electron | Select-Object Id,
   MainWindowTitle` — expect a window titled **ESSENCE DESIGNS GHOST HUB**
   (may take a few seconds to appear).
3. Verify reachability: `Invoke-WebRequest http://127.0.0.1:4749/ -UseBasicParsing`
   → 200.
4. Leave it running. This is the launch Drew walks through.

### 5.6 Unit 5 — Regression (non-colliding suites only)
`node --test WASH/wash.test.js` (4748) — green mandatory.
`node --test WASH/GHOST-HUB-003.test.js` (4750) · `-004` (4751) · `-005` (4752)
· `-006` (4753) · `-007` (4754) · `-008` (4755) — green mandatory.
**SKIP-with-reason:** `GHOST-HUB-001` + `GHOST-HUB-002` — they boot servers on
port 4749 and the live hub this leaf DELIBERATELY leaves running holds it.
Record the skip honestly. Then verify 002 test 6's assertions statically
(package.json: trustedDependencies ✓, scripts.native ✓, electron.exe ✓).

### 5.7 Unit 6 — Verification diagnostics
1. Grep proofs: `launch-hub.js` (spawnSafe/4749/ELECTRON_EXE only), `launch.md`
   present + frontmatter, `package.json` contains `"launch": "node launch-hub.js"`.
2. `git status --short` — leaf surface = `WASH/launch-hub.js`,
   `WASH/package.json`, `.opencode/command/launch.md`, `WASH/LAUNCH-001_REPORT.md`
   (+ WASH/ untracked as baseline). **No commit (VCS HOLD).**
3. Boundary held: `hub-server.js`, `electron-main.js`, `hub.html`, `hub.css`,
   `app.js`, `style.css`, `index.html`, `hub-agents.json`, all test files,
   `opencode.json` — untouched (timestamp/status check).
4. Live hub still running on 4749 (same PID as Unit 0), now with an electron
   window on top. Nothing killed.

### 5.8 Unit 7 — Report + HALT
Plant `WASH/LAUNCH-001_REPORT.md` — restated scope, unit results, the full
launcher output block, window title/PID proof, the SKIP-with-reason record,
the known-cosmetic EADDRINUSE note, honest NOT-DONE list, VCS HOLD proof.
HALT. Tell Drew the window is up for his walk-through.

## 6. Definition of Done

1. `WASH/launch-hub.js` created, `node --check` clean, zero-dep (node
   built-ins + `spawn-safe.js` only).
2. `WASH/package.json` gains `launch` script; JSON valid; 002 test-6
   assertions still satisfied (verified statically).
3. `.opencode/command/launch.md` created, matching the `boot.md`/`leaf.md`
   frontmatter pattern.
4. Tool executed successfully: native window **ESSENCE DESIGNS GHOST HUB**
   visible, `http://127.0.0.1:4749` reachable — the walk-through launch
   delivered.
5. Non-colliding suites green (wash 8/8, 003 6/6, 004 6/6, 005 6/6, 006 6/6,
   007 6/6, 008 9/9); 001/002 SKIPPED-with-reason (4749 live-held by design).
6. Boundary + VCS HOLD honored; report planted; HALT.

## 7. Guardrails

- Touch ONLY the 4 named targets + this report. No `electron-main.js` edits
  (the EADDRINUSE redundancy is accepted + recorded, NOT fixed here).
- Live hub process (4749, PID 35596) **OFF-LIMITS** — never kill/restart it;
  the launcher only ever adds the window.
- Zero discretion: any surprise (launcher exit ≠ 0, window missing, suite
  red) → STOP + record + flag for PLANNER; no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, everything under `.opencode/` EXCEPT the named
  `launch.md` create — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what was skipped
  and why.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-22 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute. After the
walk-through validates REPAIR-2, the next in sequence is V-D-002 (already
planted) → then the V1.0 seal pass.