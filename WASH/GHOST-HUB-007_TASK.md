# GHOST-HUB-007 — WASH CHAT LANE COLLAPSE FIX (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon — "needs fixing" after his native-window chat test
(2026-09-20)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. **VCS HOLD — no commits.**

---

## 1. Drew's defect report (what this leaf fixes)

In the native hub window, chatting with **WASH** fails visibly:

> "when i tried to chat with wash, the shell would close and the message would
> vanish. i cant see the message it returned, or if it did at all."

## 2. Root cause (PLANNER analysis — verify, then fix)

**Primary — duplicate lane-state key collision (data-agent).**
`chatLane(a)` stamps every lane with `data-agent`, and WASH uses the network
stem `0-wake` ("WASH is the ghost of Wake"). The WAKE council card ALSO stamps
its lane `data-agent="0-wake"`. Both lanes therefore share ONE key in
`laneVisual`, the per-lane presentation cache (`hub.html`, GHOST-HUB-004 era).

The 30-second `loadState()` re-render captures lane state keyed by
`lane.dataset.agent`:
- WASH lane captured first (hero card is first in DOM): `laneVisual["0-wake"] = {open:true, output:"…stream…"}`.
- WAKE lane captured second (closed, empty): `laneVisual["0-wake"] = {open:false, output:""}` — **overwrites WASH**.

Restore then applies WAKE's state to BOTH lanes: WASH loses `.open` →
`.chat-lane { display:none }` (004 CSS) → **"the shell would close"**; output
restores empty → **"the message would vanish"**. Exact match for Drew's report.

**Secondary — mid-stream re-render detaches the live lane.**
Even without the collision, a 30s tick during a stream wipes `.chat-lane` out
of the DOM; the in-flight `reader` keeps appending to the detached
`.chat-output` node, so the reply tail is lost.

**Fix = client-side only (`hub.html`):** give every lane a UNIQUE `data-lane`
id (the card's real id) for UI-state keys, keep `data-agent` for the network
stem, and guard the re-render while a lane is working.

## 3. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub.html` | EDIT — 5 deltas (below) |
| `WASH/GHOST-HUB-007.test.js` | CREATE — hub suite, port 4754 |
| `WASH/GHOST-HUB-007_REPORT.md` | CREATE — report + HALT |

NOT touched: `hub.css`, `app.js`, `style.css`, `hub-server.js`, `server.js`,
`index.html`, `electron-main.js`, `install.js`, `package.json`,
`hub-agents.json`, `ED/` docs, Pad/Log/Bible/MILESTONES, `.opencode/`, all game
code. No commits. **Do NOT kill or restart the live native hub** (electron PID
5544 / server child on 4749 — LAUNCH HUB-NATIVE); reloads are Drew's.

## 4. Unit 0 — Baseline gate proof (record BEFORE editing)

1. `node --version` (expect v24.x).
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754
   -State Listen` — record. The live hub on 4749 is EXPECTED (LAUNCH
   HUB-NATIVE). Leave it running.
4. Repro proofs (record BEFORE changing anything):
   - `hub.html` contains `data-agent="${escapeHtml(agentStem)}"` with NO
     `data-lane` on `.chat-lane` (collision present).
   - `hub.html` capture keys by `lane.dataset.agent`: find `laneVisual[ag]`.
   - `hub.html` restore keys by `lane.dataset.agent`:
     `laneVisual[lane.dataset.agent]`.
   - `hub.html` has NO `.chat-lane.working` guard in `renderCouncil`.
   - `hub.html` sessionCache keys by `sessionCache[agent]`.

## 5. Unit 1 — hub.html (EDIT, 5 exact deltas)

### 5.1 Unique lane id
In `chatLane(a)`, change the `.chat-lane` opening tag:
```js
<div class="chat-lane" data-lane="${escapeHtml(a.id)}" data-agent="${escapeHtml(agentStem)}">
```
(`data-lane` = the card's real id — `wash`, `0-wake`, `1-stone`, `x-xp` — the
UNIQUE UI key. `data-agent` = network stem stays for `/chat`.) Nothing else in
`chatLane()` changes.

### 5.2 Capture keyed by unique lane
In `renderCouncil()`'s capture block, key by `data-lane` instead of
`data-agent`:
```js
document.querySelectorAll("#council .chat-lane").forEach(lane => {
  const lid = lane.dataset.lane;
  const out = lane.querySelector(".chat-output");
  laneVisual[lid] = { open: lane.classList.contains("open"), output: out ? out.textContent : "" };
});
```

### 5.3 Restore keyed by unique lane
In `renderCouncil()`'s restore block:
```js
const st = laneVisual[lane.dataset.lane];
```
(one line — `lane.dataset.agent` → `lane.dataset.lane`).

### 5.4 Re-render guard (mid-stream protection)
At the TOP of `renderCouncil(council)` (immediately after
`const el = document.getElementById("council");`), add:
```js
// GHOST-HUB-007: never re-render mid-stream — a live lane would be detached
// and its reply tail lost. Skip this tick; the next 30s tick renders fresh.
if (el.querySelector(".chat-lane.working")) return;
```
(Nothing else in the function changes. Specters/roster/toolkit render
separately in `loadState()` and are unaffected.)

### 5.5 Sessions keyed per lane
In `wireChatLanes()`:
- Next to `const agent = lane.dataset.agent;` add:
  ```js
  const laneId = lane.dataset.lane;
  ```
- `let sessionId = sessionCache[agent] || null;` →
  `let sessionId = sessionCache[laneId] || null;`
- In the stream handler, `sessionCache[agent] = sid;` →
  `sessionCache[laneId] = sid;`

**Behavior note (record in report):** WASH lane and WAKE lane now hold SEPARATE
sessions, although both still run the `0-wake` agent underneath. Splitting the
key is the fix; sharing it was the collision.

## 6. Unit 2 — Tests (CREATE `WASH/GHOST-HUB-007.test.js`, port 4754)

Pattern: `node --test WASH/GHOST-HUB-007.test.js`, boot on 4754
(`startServer({ port: 4754 })`), shut down in `after`. No real opencode chat
spawn. Assertions (served shell + fix + regressions):

- T1: server boots on 127.0.0.1:4754; GET / serves the hub shell (title).
- T2: served `hub.html` carries the fix: `data-lane="`, `data-agent="`,
  `laneVisual[lane.dataset.lane]`, `el.querySelector(".chat-lane.working")`,
  `sessionCache[laneId]`.
- T3: served `hub.html` retains 006 ground truth: `era-stamp` (≥2),
  `council-split`, `xp-toggle`, `lane-head`, all 7 `sym-*` tokens,
  `lane.classList.toggle("working"`.
- T4: served `hub.html` retains 005 crash-fix:
  `lane.parentElement.querySelector(".chat-toggle")` +
  `if (!toggle) return;`.
- T5: served `hub.css` retains `@keyframes hubWorking` and `.council-divider`.
- T6: `/spawn` regression — `node -e console.log('hub-spawn-ok')` → ok true,
  exitCode 0, stdout contains `hub-spawn-ok`.

## 7. Unit 3 — Run (all runnable suites)

- `node --test WASH/wash.test.js` — 4748 (skip ONLY if a live WASH console
  holds 4748; record honestly).
- `node --test WASH/GHOST-HUB-002.test.js` — 4749 (**4749 is held by the live
  hub (LAUNCH HUB-NATIVE). Do NOT kill it. If the suite cannot bind, record
  SKIP-with-reason per 005/006 precedent — do not fight the port.**)
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754 (NEW).
- Green is mandatory for suites you CAN run. No hack-around for red — if a
  written test conflicts with an older suite's assertion, STOP and report.

## 8. Unit 4 — Verification (diagnostics)

1. Grep proofs:
   - `hub.html`: `data-lane="`, `data-agent="`, `laneVisual[lane.dataset.lane]`,
     `el.querySelector(".chat-lane.working")`, `sessionCache[laneId]` — PASS.
   - `hub.html` NO remaining `laneVisual[lane.dataset.agent]` —
     `laneVisual[lane.dataset.lane]` replaced it — PASS/FAIL.
   - Regressions: 005 crash-fix lines still present — PASS.
2. Live-surface presence: record whether 4749 / 4748 are listening; **do not
   stop them**; files serve from disk per request — only a reload is needed.
3. `git status --short` — leaf changes confined to the named 3 files in
   `WASH/`; **VCS HOLD — no commit**.
4. Boundary held: no `hub.css` / `hub-server.js` / `hub-agents.json` /
   `server.js` / `index.html` / `app.js` / `style.css` / `electron-main.js` /
   `package.json` / `.opencode/` / game code / Pad / Log / Bible / MILESTONES
   changed — PASS/FAIL.

## 9. Unit 5 — Report + HALT

1. Plant `WASH/GHOST-HUB-007_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline + repro proofs, the 5 deltas, test pass
   lines, live-surface state, honest NOT-DONE list, the session-split behavior
   note). Include the root-cause proof (duplicate `data-agent` collision).
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

## 10. Definition of Done

1. **WASH chat works:** the lane stays OPEN while chatting and across 30s
   re-renders; the reply streams into view; the message does NOT vanish.
2. **Unique lane identity:** every `.chat-lane` carries `data-lane`; capture
   and restore key by it; sessions key per lane.
3. **Mid-stream guard:** a working lane is never detached by the 30s tick.
4. **Regressions:** 002→006 suites unchanged-green where runnable (crash fix +
   ground truths retained); `wash.test.js` untouched-green.
5. **Drew's reload pass** — the leaf does NOT SEAL until Drew reloads the
   native hub window (Ctrl+R in the Electron window — the running process is
   untouched) and confirms a WASH chat stays visible with its reply. Then the
   standing Seal-gate audit (`GHOST-HUB-AUDIT-001`) can run and the wave ferry.

## 11. Guardrails

- Touch ONLY the named 3 files. Everything else off-limits.
- Live hub process (4749) OFF-LIMITS — never kill/restart Drew's window;
  reloads are his action.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `.opencode/`, `opencode.json`, Pad/Log/Bible/MILESTONES — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.