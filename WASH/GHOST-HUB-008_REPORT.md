# GHOST-HUB-008 — WASH IDENTITY + CLEAN TRANSCRIPT FIX (REPORT)

**Executed:** 2026-09-21 by DOER (1-Stone) · **Task:** `WASH/GHOST-HUB-008_TASK.md`
**Approved by:** Drew Slaydon — "Option A" (2026-09-21)
**Status:** ALL UNITS COMPLETE — HALTED. VCS HOLD — no commits.

---

## Restated scope (verbatim from the package)

Touch ONLY the named files: CREATE `.opencode/agents/wash.md`,
EDIT `WASH/hub-server.js` (remove the wash→0-wake alias),
EDIT `WASH/hub.html` (clean NDJSON renderer + WASH lane posts `agent=wash`),
CREATE `WASH/GHOST-HUB-008.fixture.ndjson`, CREATE `WASH/GHOST-HUB-008.test.js`,
CREATE `WASH/GHOST-HUB-008_REPORT.md` (+ the throwaway `tmp-capture-008.js`,
created and deleted inside Unit 1). Run diagnostics, report, HALT. No commits.

## Unit 0 — Baseline gate proof (recorded BEFORE any edit)

1. `node --version` → **v24.19.0** (expect v24.x — PASS).
2. `git status --short` → pre-existing dirty tree recorded (VCS HOLD; no
   commits made/amended). WASH/ is an untracked dir (`?? WASH/`) — unchanged
   status before and after.
3. Ports 4748–4755: **none listening** (baseline). No live surfaces to avoid;
   no processes were killed or restarted.
4. Repro proofs (BEFORE edits):
   - `Test-Path .opencode\agents\wash.md` → **False** (no WASH agent).
   - `hub.html` line 187 contained `const agentStem = a.id === "wash" ? "0-wake" : a.id;` (alias stem present).
   - `hub-server.js` line 443 contained `const map = { wash: "0-wake" };` (alias map present).
   - `hub.html` `run()` contained raw `appendLine(trimmed)` (261/271) and NO `handleHubEvent` / `ev.part.type === "text"`.
   - `Test-Path WASH\GHOST-HUB-008.fixture.ndjson` → **False**.

## Unit 1 — Live NDJSON capture (BEFORE any edit)

- Created throwaway `WASH/tmp-capture-008.js`; booted the CURRENT server on
  **4755**; POSTed `{ "agent": "wash", "message": "Reply with the single word: OK." }`.
- Spawn resolved via the pre-edit alias (`agent=0-wake`), exited 0, 32.6s.
- Entire streamed body written verbatim to `WASH/GHOST-HUB-008.fixture.ndjson`
  (1068 bytes; 3 JSON lines + final `session=` line).
- **Observed event types (ground truth for the renderer):**
  `step_start`, `text`, `step_finish` — all carrying TOP-LEVEL `sessionID`.
  The `text` event carried `part.type === "text"` and `part.text = "OK"`.
- Teardown: temp server closed; `tmp-capture-008.js` DELETED (verified absent).
- The fixture therefore grounds the parser: session id is top-level, reply text
  rides `part.text` on `type === "text"` events.

## Unit 2 — hub-server.js (1 delta, done)

`seatedAgentMap()`: `const map = { wash: "0-wake" };` →
```js
// GHOST-HUB-008: WASH owns its own agent file (.opencode/agents/wash.md) —
// the 0-wake alias is GONE. Wash resolves via the directory scan below.
const map = {};
```
Nothing else in the file changed. WASH now resolves through the
`.opencode/agents/*.md` readdir loop like every other seat.

## Unit 3 — .opencode/agents/wash.md (CREATE, verbatim)

- Created with EXACTLY the §5.3 content — verified **byte-exact** against the
  verbatim block extracted from the task file (2682 chars, EXACT MATCH).
- Byte-clean read-back: **no BOM**, LF-only (45 lines, no CRLF), frontmatter
  intact (`mode: primary`, `color: "#D4AF37"`, `model: opencode/big-pickle`,
  permissions). Contains `# WASH`, `ghost of 0-Wake`, BROWN BANANA BREAD, etc.
- Agents dir now: `0-wake.md`, `1-stone.md`, `b-bolt.md`, `x-xp.md`, `wash.md`.

## Unit 4 — hub.html (2 deltas, done)

**4.1 Identity** — `chatLane(a)`:
`const agentStem = a.id === "wash" ? "0-wake" : a.id;` →
```js
// GHOST-HUB-008: WASH has its own seated agent (.opencode/agents/wash.md).
const agentStem = a.id;
```
`.chat-lane` still carries `data-lane="${escapeHtml(a.id)}"` and
`data-agent="${escapeHtml(agentStem)}"`.

**4.2 Clean transcript renderer** — `wireChatLanes()`:
- Added an IIFE-scope `handleHubEvent(line, ghostText, sessionRef)` helper that
  mirrors `WASH/app.js` `handleEventLine` (lines 96–129): JSON.parse → false on
  fail; session capture from top-level/properties `sessionID` funneled into the
  lane-scope `sessionRef`; text extraction on `type === "text"` /
  `message.part.updated` / `message.updated`; returns true.
- `run()` now appends a per-turn "you" line (textContent) + ONE `ghost-reply`
  element updated in place (WASH console bubble pattern) BEFORE the fetch.
- Stream loop: `session=` lines keep the existing `[session]` handling
  (`sessionCache[laneId]` stays keyed by lane); all other lines go through
  `handleHubEvent` — JSON events update the ghost reply only, non-JSON strays
  become muted `[meta]` lines. Raw `appendLine(trimmed)` for event lines is GONE.
- `working()` toggling, `[error]` branch, Enter-to-send, toggle wiring, and the
  007 `data-lane`/guard/session logic untouched. Inline script compiles clean.

## Unit 5 — WASH/GHOST-HUB-008.test.js (CREATE, port 4755)

- Suite boots `startServer({ port: 4755 })`, shuts down in `after`. No real
  opencode spawn in tests (Unit 1 is the only live capture).
- T1–T9 implemented exactly per the package (boot/shell, wash.md on disk,
  no server alias + 008 comment, hub identity fix, hub renderer incl. no
  `data:` residue + `[meta]`, 007/006/005 ground-truth retention, hub.css,
  fixture grounding walk, /spawn regression).

## Unit 6 — Post-edit live probe (VERIFY — clean pass)

- Booted the EDITED server on 4755; POSTed `{ "agent": "wash", "message": "Reply with only the word: WASH." }`.
- **Spawned `agent=wash`** (alias gone — `--agent wash` resolved to
  `.opencode/agents/wash.md`), exit 0, 31.0s, Sandtrap clean.
- Extracted reply rendered cleanly: **`"WASH."`** — no raw JSON, does not start
  with `{`, no raw brace residue.
- Reply **self-identifies as WASH** (exactly "WASH.", NOT Wake).
- Probe throwaway lived in the pre-approved temp dir (outside the workspace —
  no extra WASH/ file created) and was deleted after.

## Unit 7 — Run (all runnable suites)

| Suite | Port | Result |
|---|---|---|
| `node --test WASH/wash.test.js` | 4748 | **8 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-002.test.js` | 4749 | **8 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-003.test.js` | 4750 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-004.test.js` | 4751 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-005.test.js` | 4752 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-006.test.js` | 4753 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-007.test.js` | 4754 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-008.test.js` | 4755 | **9 pass / 0 fail** |

No skips were needed (no live process held any port). Green everywhere —
no test conflicts.

## Unit 8 — Verification (diagnostics)

1. Grep proofs — **PASS**:
   - `hub.html` contains `handleHubEvent(` and `const agentStem = a.id;`.
   - `hub.html` does NOT contain `a.id === "wash" ? "0-wake"`.
   - `hub-server.js` does NOT contain `wash: "0-wake"`.
   - `.opencode/agents/wash.md` present + byte-clean read-back.
   - `GHOST-HUB-008.fixture.ndjson` present, non-empty; 3 JSON lines all
     `JSON.parse` clean + final `session=` line.
2. Live surfaces: ports 4748–4755 **none listening** during and after the
   leaf; nothing was stopped or restarted (reloads are Drew's).
3. `git status --short` — identical to the pre-existing dirty tree; leaf
   changes live inside already-untracked paths (`?? WASH/`, `?? .opencode/agents/`);
   **no commit made (VCS HOLD)**.
4. Boundary held — **PASS**: WASH/ contains ONLY the named additions
   (`GHOST-HUB-008.fixture.ndjson`, `GHOST-HUB-008.test.js`, this report);
   the two named edits (`hub.html`, `hub-server.js`); `tmp-capture-008.js`
   deleted; no other `.opencode/` file beside `wash.md`; no `opencode.json`,
   no game code, no Pad/Log/Bible/MILESTONES, no `ED/` doc changed.

## Honest NOT-DONE list

- **No commit** (VCS HOLD — per package).
- **No Drew hands-on pass** — DoD 5 requires Drew to relaunch/reload a hub
  surface and confirm a WASH chat renders clean + answers as WASH. That is
  Drew's action; not executed by this seat.
- **No canon docs touched** (BIBLE / MILESTONES / Pad / Log untouched by
  design; enshrinement is not part of this package).
- **No suite skipped** — no live process held any test port.
- **Stale doc comment**: `hub-server.js`'s function JSDoc (lines ~437–441)
  still describes the old "wash → 0-wake alias" pattern; per the package's
  "Nothing else in the file changes", it was left untouched. Flagging for
  Drew — do NOT seal until you decide whether that comment should die with
  the alias.

## Definition of Done status

1. **WASH answers as WASH** — DONE (probe reply "WASH.", spawned `--agent wash`).
2. **Clean transcript** — DONE (extracted reply is readable text only; no raw
   JSON dump; `session=` resume keyed per lane intact).
3. **Regressions** — DONE (003→008 + wash.test.js all green, 0 fails).
4. **Fixture grounded** — DONE (real captured stream; T8 parses it with the
   documented extraction logic; reply "OK").
5. **Drew's hands-on pass** — **NOT DONE — Drew's action.** Reload/relaunch a
   hub surface, chat WASH, confirm clean render + WASH identity, then the
   standing Seal-gate audit + ferry can run (COURRIER).

## Safe word check

Nothing dangerous encountered. One judgment caveat (not a blocker): the
session-capture funnel in `handleHubEvent` uses a `sessionRef` object passed
from the lane scope (the helper is IIFE-scope per the package; only the lane
closure may mutate its `sessionId`). This mirrors the app.js contract while
keeping per-lane session isolation — if Drew prefers a per-lane nested helper
instead, that's a future leaf, not this one.

---

**REPORTED 2026-09-21 by DOER (1-Stone). HALTED per package — awaiting next
task package. VCS HOLD.**