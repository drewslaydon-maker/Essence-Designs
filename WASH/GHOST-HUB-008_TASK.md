# GHOST-HUB-008 — WASH IDENTITY + CLEAN TRANSCRIPT FIX (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon — "Option A" (2026-09-21)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. **VCS HOLD — no commits.**

---

## 1. Drew's defect report (what this leaf fixes)

Proving the Ghost Hub through the WASH lane surfaced two defects (Drew,
2026-09-21):

1. **Identity:** chatting in the WASH lane returned a reply that "seemed to
   indicate that it registered to Wake instead" — the ghost answered as
   0-Wake, not as WASH.
2. **Transcript:** the response is "a jumbled text string until the bottom
   showing the generated response" — the raw opencode NDJSON event dump is
   printed line-by-line; only the final event carries the readable reply.

## 2. Root cause (PLANNER analysis — verify, then fix)

**Identity — no WASH agent exists.** `.opencode/agents/` holds only
`0-wake.md`, `1-stone.md`, `b-bolt.md`, `x-xp.md`. `hub.html` `chatLane()` maps
WASH's network stem to `0-wake` (`a.id === "wash" ? "0-wake" : a.id`), and
`hub-server.js` `seatedAgentMap()` aliases `wash → 0-wake`. Every WASH-lane
message therefore spawns `opencode run --agent 0-wake …`, and the 0-wake
PLANNER persona (`.opencode/agents/0-wake.md`) self-identifies as WAKE.
**Fix (Drew ruling — Option A):** plant a real ghost agent
`.opencode/agents/wash.md` — same duties, same boot contract, same guardrails
as 0-Wake, self-identified as WASH — and remove the alias so the WASH lane
spawns `--agent wash`.

**Transcript — hub.html renders raw JSON.** `hub-server.js` `/chat` relays
every NDJSON event line verbatim (text/plain). `hub.html` `run()` appends each
line raw into `.chat-output`. The WASH console already solved this
(`WASH/app.js` `handleEventLine`): parse NDJSON, render only text parts,
capture the session id. **Fix:** port that proven parser into `hub.html`'s
chat lanes.

## 3. Targets (named files ONLY)

| File | Action |
|---|---|
| `.opencode/agents/wash.md` | CREATE — WASH ghost agent (Option A; verbatim content in §5.3) |
| `WASH/hub-server.js` | EDIT — remove the `wash → 0-wake` alias in `seatedAgentMap()` |
| `WASH/hub.html` | EDIT — clean NDJSON renderer + WASH lane posts `agent=wash` |
| `WASH/GHOST-HUB-008.fixture.ndjson` | CREATE — real captured NDJSON stream (Unit 1) |
| `WASH/GHOST-HUB-008.test.js` | CREATE — hub suite, port 4755 |
| `WASH/GHOST-HUB-008_REPORT.md` | CREATE — report + HALT |

NOT touched: everything else in `WASH/` (`hub.css`, `app.js`, `style.css`,
`server.js`, `index.html`, `electron-main.js`, `install.js`, `package.json`,
`hub-agents.json`, all 001→007 files, tests, README), all other
`.opencode/` files, `opencode.json`, `ED/` docs, Pad/Log/Bible/MILESTONES,
all game code, the live WASH console (4748) and live hub (4749) if running —
do NOT kill or restart anything; reloads are Drew's. No commits.

About `.opencode/agents/`: the file ADDED here (wash.md) is the ONE
`.opencode/` target this package names. No other `.opencode/` file may be
edited, moved, or deleted.

## 4. Unit 0 — Baseline gate proof (record BEFORE editing)

1. `node --version` (expect v24.x).
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755
   -State Listen` — record. If 4748/4749 are live, LEAVE them running.
4. Repro proofs (record BEFORE changing anything):
   - `Test-Path .opencode\agents\wash.md` → **False** (no WASH agent).
   - `hub.html` contains `a.id === "wash" ? "0-wake" : a.id` (alias stem).
   - `hub-server.js` contains `wash: "0-wake"` (alias map).
   - `hub.html` `run()` appends raw JSON lines: `appendLine(trimmed)` present
     and NO `handleHubEvent` / `ev.part.type === "text"` present.
   - `Test-Path WASH\GHOST-HUB-008.fixture.ndjson` → **False**.

## 5. Units

### 5.1 Unit 1 — Live capture of the real NDJSON stream (BEFORE any edit)

Ground the parser on the real wire protocol — do NOT invent the event shape.

1. From `WASH/` run the CURRENT server on a TEST port (never fight 4748/4749):
   start `node hub-server.js` with `PORT` overridden per the 001→007 suite
   pattern (the modules export `startServer({ port })`; boot on **4755** via a
   tiny throwaway script `WASH/tmp-capture-008.js` that you DELETE after
   teardown, or run the server's exported `startServer` inline and POST to it).
   Simpler and acceptable: write a one-off script in `WASH/` named
   `tmp-capture-008.js`, run it, then DELETE it (it is a throwaway, NOT a
   target; record its creation/deletion in the report).
2. POST one short real chat to `/chat`:
   `{ "agent": "wash", "message": "Reply with the single word: OK." }`
   (agent `wash` still resolves via the current alias BEFORE edits). Accept the
   streamed text/plain body. This is a local stock opencode free-tier run —
   no API cost. If the spawn fails (binary missing, session engine error),
   record the failure and **STOP — do NOT fabricate a fixture**.
3. Write the ENTIRE streamed body verbatim to
   `WASH/GHOST-HUB-008.fixture.ndjson` (every NDJSON event line + the final
   `session=<sid>` line if present, in arrival order; nothing added/removed).
4. Record the observed event `type` values (e.g. `session.initialized`,
   `message.part.updated`, `message.updated`, `session.idle`, `done`) in the
   report — this is the ground truth the renderer is built against.
5. Kill the temp server; delete `tmp-capture-008.js`. Nothing left running.

### 5.2 Unit 2 — hub-server.js (EDIT, 1 delta)

In `seatedAgentMap()`:

```js
// Before:
const map = { wash: "0-wake" };
// After:
// GHOST-HUB-008: WASH owns its own agent file (.opencode/agents/wash.md) —
// the 0-wake alias is GONE. Wash resolves via the directory scan below.
const map = {};
```

Nothing else in the file changes. WASH now resolves through the
`.opencode/agents/*.md` readdir loop exactly like every other seat. (If the
agents dir is missing, only the FALLBACK seat list remains in
`defaultAgents()`; `/chat` will 400 for `wash` — correct behavior, not an
alias cheat.)

### 5.3 Unit 3 — `.opencode/agents/wash.md` (CREATE, verbatim content)

Create the file with EXACTLY this content (ASCII-safe; keep `--` dashes):

````md
---
description: WASH -- the ghost of 0-Wake (SEER). A browser-spoken planner ghost with the same truth reads, guardrails, and leaf-planting duties as the Wake seat, self-identified as WASH. Chats surface in the Ghost Hub (WASH lane) and the WASH console.
mode: primary
color: "#D4AF37"
model: opencode/big-pickle
permission:
  edit: allow
  bash: allow
---

# WASH — Ghost of Wake

You are WASH, the ghost of the Wake seat in ESSENCE DESIGNS (ESSENCE v4,
purple & gold). You speak AS WASH. When you answer, you identify yourself as
WASH — the ghost of 0-Wake — never as Wake. Studio Director: Drew Slaydon.
You plan; you do not build. WAKE is your host seat; you are its ghost, standing
in when the terminal opencode cannot be reached. You carry the SAME
responsibilities as the Wake planner seat — nothing more, nothing less.

Core Operational Laws (identical to the Wake seat):
1. Drew is the Ultimate Authority -- no acting on vague directives.
2. Zero Discretion / Zero Speculation -- never invent scope, features, or adjacent edits.
3. Micro-Task Scope Lock -- a task package touches only the named targets.
4. Mandatory Halt & Report -- after each unit, report and wait; never chain ahead.

Safe word: if you flag something dangerous or that needs Drew's attention, say BROWN BANANA BREAD and stop.

Boot Sequence on session start:
1. Read AGENTS.md.
2. Read ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md.
3. Read ED/00_ESSENCE_CORE/ED_FLOW/00_GOAL1_MANIFEST.md for era context.
4. Read the active sprint in ED/01_THE_DESIGNS/MILESTONES.md.
5. Read the latest captain's log entry (ED/02_THE_LOGS/05_CAPTAINS_LOG/00_LOG_2026.md).
6. Read the Pad (EP): ED/02_ESSENCE_PAD.md -- active research + current intent.
7. Report current leaves, active targets, and open gates; then wait.

"Check the Pad" / "Check EP" = read ED/02_ESSENCE_PAD.md first; it is session input, not canon until enshrined.

Role: read the truth, verify structure, and spec each unit of work as an exact task package (targets, edits, commands, diagnostics, definition of done). Role separation: you never build or roll changes; micro-fixes and file swaps are your only inline edits.

Delegation: name the leaf file and tell Drew which window to point; DOER builds. A ghost that builds in the build lane eats both seats.

Guardrails: PARKED/BROKEN/ON_DECK projects and 00_ESSENCE_CORE + 01_THE_DESIGNS are read-only unless a Studio Audit or a task package names them. Constraints: studio burn limit < $1.00/hour; GPU pipeline 8 GB VRAM ceiling; model policy: stock opencode free-tier LLMs (stick with the box until the box doesn't work).

Masquerade is forbidden: report exactly what was done and not done.
````

Verify with `Test-Path` + read-back that the file lands byte-clean (no BOM,
LF/CRLF per repo convention, frontmatter intact).

### 5.4 Unit 4 — hub.html (EDIT, 2 deltas)

**4.1 WASH lane posts `agent=wash` (identity).** In `chatLane(a)`, replace:

```js
// Network stem: WASH is the ghost of Wake — seated as 0-wake.
const agentStem = a.id === "wash" ? "0-wake" : a.id;
```

with:

```js
// GHOST-HUB-008: WASH has its own seated agent (.opencode/agents/wash.md).
const agentStem = a.id;
```

The `.chat-lane` tag keeps `data-lane="..."` and `data-agent="${escapeHtml(agentStem)}"`.
No other line of `chatLane()` changes.

**4.2 Clean transcript renderer.** In `wireChatLanes()`'s `run()`:
- BEFORE the fetch loop, add a per-turn UI contract: append one "you" line for
  the user message, then create ONE ghost output element that the stream
  updates in place (mirror the WASH console's bubble pattern:
  `appendLine`-style div `you`, then a `ghost-reply` div). Render the user
  message text via `textContent` (no HTML injection).
- Add a module-scope (or IIFE-scope) helper `handleHubEvent(line, ghostText)`
  that mirrors `WASH/app.js` `handleEventLine` (lines 96–129) EXACTLY:
  1. `JSON.parse(line)` — on failure return false (caller may treat as stray).
  2. Session capture: read `sessionID` (top-level or `properties`) →
     `sessionId` variable in the lane scope; do NOT print raw JSON for it.
  3. Text extraction:
     - `ev.type === "text" && ev.part?.type === "text"` → set ghostText = part.text
     - `ev.type === "message.part.updated" && ev.part?.type === "text"` → set ghostText = part.text
     - `ev.type === "message.updated" && ev.message?.parts` → join all
       `type === "text"` parts' text → ghostText.
  4. Return true.
- In the stream loop, replace the raw `appendLine(trimmed)` branch with:
  - line starts with `session=` → keep existing `[session]` line handling
    (sessionCache write stays keyed by `laneId`).
  - otherwise → `handleHubEvent(trimmed, ghostElement)`; if it returns false,
    append a muted `[meta]` line ONLY for non-JSON stray lines (e.g. stderr).
- Keep `working(busy)` toggling, error branch (`[error] ...`), Enter-to-send,
  toggle wiring, and the 007 `data-lane`/guard/session logic — all untouched.

### 5.5 Unit 5 — Tests (CREATE `WASH/GHOST-HUB-008.test.js`, port 4755)

Pattern: `node --test WASH/GHOST-HUB-008.test.js`, boot
`startServer({ port: 4755 })`, shut down in `after`. No real opencode chat
spawn in the suite (the live capture is Unit 1 only). Assertions:

- T1: server boots on 127.0.0.1:4755; GET / serves the hub shell (title).
- T2: `.opencode/agents/wash.md` exists on disk; contains `# WASH` and
  `ghost of 0-Wake` and `mode: primary`.
- T3: `hub-server.js` (read from disk) no longer contains `wash: "0-wake"`;
  contains the GHOST-HUB-008 map comment.
- T4: served `hub.html` carries the identity fix: does NOT contain
  `a.id === "wash" ? "0-wake"`; contains `const agentStem = a.id;` AND
  `data-agent="${escapeHtml(agentStem)}"`.
- T5: served `hub.html` carries the renderer: `handleHubEvent(`,
  `ev.part.type === "text"` (or the JS-safe equivalent in the served copy),
  and NO raw data-URI residue; contains `[meta]` for non-JSON strays.
- T6: served `hub.html` retains 007 ground truths: `data-lane="`, `data-agent="`,
  `laneVisual[lane.dataset.lane]`, `el.querySelector(".chat-lane.working")`,
  `sessionCache[laneId]`; retains 006 ground truths (`era-stamp` ≥2,
  `council-split`, `xp-toggle`, `lane-head`, all 7 `sym-*` tokens,
  `classList.toggle("working"`); retains 005 crash fix
  (`lane.parentElement.querySelector(".chat-toggle")` +
  `if (!toggle) return;`).
- T7: served `hub.css` retains `@keyframes hubWorking` and `.council-divider`.
- T8: fixture grounding — read `WASH/GHOST-HUB-008.fixture.ndjson`; every line
  that is NOT `session=` must `JSON.parse` cleanly; walking the fixtures with
  the documented extraction logic must yield a NON-EMPTY final text that
  contains `OK` (the capture reply) and contains NO raw JSON brace residue
  (i.e. the extracted render does not start with `{`).
- T9: `/spawn` regression — `node -e console.log('hub-spawn-ok')` → ok true,
  exitCode 0, stdout contains `hub-spawn-ok`.

### 5.6 Unit 6 — Post-edit live probe (VERIFY, optional-stop)

After edits, run ONE more short real chat (proves `--agent wash` boots and
answers as WASH): POST `{ "agent": "wash", "message": "Reply with only the word: WASH." }`
to a temp server. Record honestly:
- Did it spawn/exit clean (Sandtrap obeying)?
- Did the reply text render cleanly (no raw JSON in the extracted text)?
- Did the reply self-identify as **WASH** (or at least not as Wake)?

On failure (spawn error, or clearly a Wake-identity reply): record exactly
what happened and **STOP before DoD 4** — do NOT improvise a fix. On clean
pass: continue to Unit 7.

## 6. Unit 7 — Run (all runnable suites)

- `node --test WASH/wash.test.js` — 4748 (skip ONLY if a live WASH console
  holds 4748; record honestly).
- `node --test WASH/GHOST-HUB-002.test.js` — 4749 (SKIP-with-reason if the
  live hub holds it — never fight the port).
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754.
- `node --test WASH/GHOST-HUB-008.test.js` — 4755 (NEW).
- Green is mandatory for suites you CAN run. No hack-around for red — if a
  written test conflicts with an older suite's assertion, STOP and report.

## 7. Unit 8 — Verification (diagnostics)

1. Grep proofs:
   - `hub.html`: `handleHubEvent(`, `const agentStem = a.id;` — PASS.
   - `hub.html` does NOT contain `a.id === "wash" ? "0-wake"` — PASS.
   - `hub-server.js` does NOT contain `wash: "0-wake"` — PASS.
   - `.opencode/agents/wash.md` present + read-back clean — PASS.
   - `GHOST-HUB-008.fixture.ndjson` present, non-empty, JSON-lines valid
     (except the optional final `session=` line) — PASS.
2. Live surfaces: record whether 4748/4749 are listening; do not stop them.
3. `git status --short` — leaf changes confined to the named files; **no
   commit (VCS HOLD)**.
4. Boundary held — no other `WASH/` file, no `.opencode/` file besides
   `wash.md`, no `opencode.json`, no game code, no Pad/Log/Bible/MILESTONES,
   no `ED/` doc changed — PASS/FAIL. Include `tmp-capture-008.js` deleted —
   PASS.

## 8. Unit 9 — Report + HALT

1. Plant `WASH/GHOST-HUB-008_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline + repro proofs, the live NDJSON capture
   event types, wash.md landed, the 2 hub deltas + the server delta, test
   pass lines, post-edit probe result, live-surface state, honest NOT-DONE
   list).
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

## 9. Definition of Done

1. **WASH answers as WASH:** the WASH lane spawns `--agent wash` (no 0-wake
   alias); a probe reply self-identifies as WASH.
2. **Clean transcript:** WASH-lane replies render as readable text only — no
   raw JSON dump in `.chat-output`; `session=` resume still works per lane.
3. **Regressions:** 003→008 suites green where runnable (002 SKIP-with-reason
   if port-held); `wash.test.js` green.
4. **Fixture grounded:** `GHOST-HUB-008.fixture.ndjson` is a real captured
   stream, and the suite parses it with the documented extraction logic.
5. **Drew's hands-on pass:** the leaf does NOT SEAL until Drew relaunches
   (or reloads) a hub surface and confirms a WASH chat renders clean and
   answers as WASH. That is Drew's action, then the standing Seal-gate audit +
   ferry can run.

## 10. Guardrails

- Touch ONLY the named 6 files (+ the throwaway `tmp-capture-008.js`, created
  and deleted within Unit 1). Everything else is off-limits.
- Live hub/WASH processes OFF-LIMITS — never kill/restart Drew's windows;
  reloads are his action.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, all `.opencode/` files EXCEPT the named `wash.md` —
  read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved
("yeah ur calls a right, option A. lets plant the leave").**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.