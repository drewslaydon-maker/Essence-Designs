# LAUNCH-001 REPORT — Ghost Hub launch tool + walk-through launch

**Planted:** 2026-09-22 by DOER (1-Stone, big-pickle) · **Package:** `WASH/LAUNCH-001_TASK.md`
**Status:** ⚠️ **PARTIAL — TOOL LANDED, WALK-THROUGH WINDOW NOT DELIVERED (flag for PLANNER)**

---

## 1. Restated scope

1. CREATE `WASH/launch-hub.js` (§3 content, character-exact, zero-dep).
2. EDIT `WASH/package.json` — add ONLY `"launch": "node launch-hub.js"` after `"native"`.
3. CREATE `.opencode/command/launch.md` (§4 content, character-exact).
4. RUN the tool: the walk-through launch of the native hub window (v0.3 shell,
   REPAIR-1 server deltas, full green suite set).
5. Plant this report + HALT. VCS HOLD — no commits. Live hub (4749, PID 35596)
   OFF-LIMITS.

## 2. Unit results

### Unit 0 — Baseline gate proof (recorded BEFORE editing)

| Check | Result |
|---|---|
| `node --version` | `v24.19.0` |
| `git status --short` | Pre-existing dirty tree recorded (Lotus workspace + ED docs + untracked `WASH/`, `.opencode/agents/`, themes, tui.json, CACHE-PATCH, WHEEL / FLOWER leaves, LEGACY + MUSIC — all OUT of leaf scope). **VCS HOLD.** |
| Ports 4748–4756 | **4749 LISTEN — PID 35596** (`node WASH/hub-server.js`, started 09/22 2:29:49 AM). No other listeners at baseline. |
| `WASH/node_modules/electron/dist/electron.exe` | **True** — 246,236,160 bytes |
| `package.json` + 002 test 6 | scripts `start` + `native` only; version `0.3.0`. 002 test-6 (lines 146–157) asserts ONLY `trustedDependencies` includes electron, `scripts.native === "electron ."`, electron.exe exists — **`launch` script cannot break it (verified statically).** |

### Unit 1 — CREATE `WASH/launch-hub.js` — ✅ PASS

- Wrote §3 content character-exact.
- `node --check WASH/launch-hub.js` → **clean**.
- Grep proof: contains `spawnSafe`, `4749`, `ELECTRON_EXE`; requires are ONLY
  the four module lines (`spawn-safe.js`, `http`, `path`, `fs`).

### Unit 2 — EDIT `WASH/package.json` — ✅ PASS

- Added only `"launch": "node launch-hub.js",` after `"native"`.
- `ConvertFrom-Json` parses cleanly; version stays `0.3.0`; `start` /
  `native` unchanged; `trustedDependencies` still `["electron"]`.

### Unit 3 — CREATE `.opencode/command/launch.md` — ✅ PASS

- Wrote §4 content character-exact.
- Grep proof: file exists; frontmatter `title: launch`; body contains
  `node WASH/launch-hub.js`.

### Unit 4 — Run the tool (the walk-through launch) — ⚠️ **WINDOW MISSING**

`node WASH/launch-hub.js` from repo root — full output:

```
[LAUNCH GHOST HUB]
[LAUNCH GHOST HUB] server already live on 127.0.0.1:4749 (reusing)
[LAUNCH GHOST HUB] launching native window (electron) …
[LAUNCH GHOST HUB] native window spawned (pid 20760)
[LAUNCH GHOST HUB] done — this launcher exits. The window is Drew's.
EXIT CODE: 0
```

- Required message (`server already live … (reusing)`) and exit 0 ✅.
- **BUT:** within ~7 s the spawned electron (pid 20760) was GONE —
  `Get-Process -Name electron` → empty; `Get-Process -Id 20760` → gone.
- No window titled **ESSENCE DESIGNS GHOST HUB** appeared.
- **Live hub 4749 untouched** — still PID 35596, still serving.
- `Invoke-WebRequest http://127.0.0.1:4749/` reachable (the pre-existing server).

**Evidence gathered (bounded, read-only diagnostic — no file changes):**

- Reproducing the spawn exactly as the launcher does (`spawnSafe` on the same
  absolute electron path, `cwd: WASH`, `timeoutMs: 0`) but KEEPING the parent
  alive: electron ran the full 30 s (4 processes: main + renderers/utility) and
  printed the known-cosmetic EADDRINUSE line from `electron-main.js`'s
  hub-server child — the app survives the EADDRINUSE (matches §3 note).
- **But even while alive (25 s observation), no process reported a
  `MainWindowTitle`** — the visible titled window did not present within that
  window under pipe-spawn.
- **Mechanism observed twice:** when the spawning parent exits
  (`process.exit(0)` — exactly the launcher's spec), the electron children die
  with it. The `launch-hub.js` contract line "children tolerate EPIPE on later
  writes" **does not hold on this Windows box** — pipe read-end close on parent
  exit takes the window down. This is the direct cause of the missing
  walk-through window.

**Guardrail trigger — STOP + record + flag:** `WASH/launch-hub.js` was written
character-exact per package §3 and was NOT deviated from. No adjacent fixes
were made (`electron-main.js` and `launch-hub.js` remain exactly as spec'd).
**FLAG FOR PLANNER:** the launcher as spec'd cannot survive its own
`process.exit(0)` on Windows; and the titled window did not present even with
the parent held alive. PLANNER to decide the fix leaf (e.g., keep parent alive
until a handshake / detach child / rely on Electron's own `app` lifecycle vs
`process.exit` order; verify window presentation under pipe-spawn with
`windowsHide: true`). DOER did not improvise.

### Unit 5 — Regression (non-colliding suites) — ✅ GREEN (spec'd skips honored)

| Suite | Port | Result |
|---|---|---|
| `wash.test.js` | 4748 | **8/8 PASS** |
| `GHOST-HUB-003.test.js` | 4750 | **6/6 PASS** |
| `GHOST-HUB-004.test.js` | 4751 | **6/6 PASS** |
| `GHOST-HUB-005.test.js` | 4752 | **6/6 PASS** |
| `GHOST-HUB-006.test.js` | 4753 | **6/6 PASS** |
| `GHOST-HUB-007.test.js` | 4754 | **6/6 PASS** |
| `GHOST-HUB-008.test.js` | 4755 | **9/9 PASS** |
| `GHOST-HUB-001.test.js` | 4749 | **SKIPPED-with-reason** — boots a server on 4749; the live hub this leaf DELIBERATELY leaves running holds it. |
| `GHOST-HUB-002.test.js` | 4749 | **SKIPPED-with-reason** — same port-hold; 002 test-6 verified STATICALLY instead: `trustedDependencies` includes electron ✓, `scripts.native === "electron ."` ✓, electron.exe exists ✓. |

No suite rebooted 4749; nothing killed.

### Unit 6 — Verification diagnostics

- Grep proofs: `launch-hub.js` (spawnSafe / 4749 / ELECTRON_EXE only) ✓;
  `launch.md` present + frontmatter ✓; `package.json` contains
  `"launch": "node launch-hub.js"` (line 9) ✓.
- Boundary (LastWriteTime): `hub-server.js`, `electron-main.js`, `hub.html`,
  `hub.css`, `app.js`, `style.css`, `index.html`, `hub-agents.json`, all test
  files, `opencode.json` — **all 09/20–09/21, NONE touched 09/22.** ✓
- `git status --short` leaf surface: `?? WASH/` (contains `launch-hub.js` +
  edited `package.json` + this report) and `?? .opencode/command/launch.md`
  plus the pre-existing dirty tree. **No commit made (VCS HOLD).** ✓
- Live hub: **4749 still LISTEN, PID 35596 — same process as Unit 0, never
  killed or restarted.** Electron processes: **NONE** at report time (no
  window up — see Unit 4 flag).

## 3. Known-cosmetic note (per §3, recorded, NOT fixed)

When the server is already live, `electron-main.js`'s own `spawnServer()`
spawns a hub-server → EADDRINUSE on 4749 → one logged `server spawn error`
line from electron-main, then `waitForServer()` succeeds against the existing
server. Observed exactly once per diagnostic run; did NOT take the app down.
`electron-main.js` is out of scope for this leaf — left untouched.

## 4. Definition of Done — honestly marked

1. ✅ `WASH/launch-hub.js` created, `node --check` clean, zero-dep.
2. ✅ `WASH/package.json` gains `launch` script; JSON valid; 002 test-6
   assertions statically satisfied.
3. ✅ `.opencode/command/launch.md` created, matching frontmatter pattern.
4. ⚠️ Tool executed (exit 0, correct server-reuse message) **but native window
   did NOT survive** — walk-through launch NOT delivered as intended.
5. ✅ Non-colliding suites green (wash 8/8, 003–007 6/6, 008 9/9); 001/002
   SKIPPED-with-reason.
6. ✅ Boundary + VCS HOLD honored; report planted; HALT.

## 5. NOT-DONE / FLAG list (masquerade forbidden)

- **Native walk-through window: NOT delivered.** The tool's spec'd
  `process.exit(0)`-immediately pattern kills the spawned electron on Windows
  (reproduced twice). Per guardrails, DOER stopped and did NOT alter the spec.
- **Window title verification: NOT achieved** — no electron process existed to
  present a title after the launcher run; while held alive, no
  `MainWindowTitle` presented either (second datum for PLANNER).
- **No commits** (VCS HOLD) — leaf surface left uncommitted.
- **Diagnostic artifacts:** one temp script `launch-001-diag.js` was written
  to `C:\Users\Andrew\AppData\Local\Temp\opencode\` (OUTSIDE the workspace) for
  evidence capture and left there; no workspace files beyond the 4 targets
  were created or modified.

## 6. Recommended next step (for PLANNER, per package sequencing)

After \- if the walk-through needs a window THIS session, PLANNER should decide
(not DOER): e.g., a LAUNCH-001-REPAIR leaf amending `launch-hub.js` to keep a
surrogate parent alive (or spawn detached / handshake) until the window is
confirmed, and/or investigating why the titled window did not present under
pipe-spawn while held alive. Then V-D-002 (already planted) → V1.0 seal pass.

---

**PLANTED 2026-09-22 by DOER (1-Stone) — HALT. Drew: window is NOT up for
walk-through; full evidence above. Route to PLANNER for the repair decision.**