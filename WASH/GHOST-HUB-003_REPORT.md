# GHOST-HUB-003 — STRUCTURE CORRECTIONS + TOOLKIT TAB + REAL CHAT LANES (REPORT)

**Executed by:** DOER (1-Stone) · **Date:** 2026-09-20 · **Approved by:** Drew Slaydon
**Package:** `WASH/GHOST-HUB-003_TASK.md` · **Status:** COMPLETE — HALTED · **VCS HOLD:** respected (no commits)

---

## 1. Restated scope

Structure corrections (COURRIER = one council card, shadow section hidden),
TOOLKIT 4th tab, real chat lanes (Sandtrap-spawned, WASH pattern), updated +
new behavioral suites, report planted. Targets: `WASH/hub-server.js`,
`WASH/hub.html`, `WASH/hub.css`, `WASH/hub-agents.json`,
`WASH/GHOST-HUB-002.test.js`, `WASH/GHOST-HUB-003.test.js` (new),
`WASH/package.json`. Everything else off-limits. No commits.

## 2. Unit-by-unit results

### Unit 0 — Baseline gate proof (recorded BEFORE build)
- `node --version` → **v24.19.0**
- `git status --short` → recorded pre-existing dirty tree (large; unrelated to
  this leaf — no leaf changes existed yet in WASH beyond prior 002 work)
- Repro proofs (all three as the package predicted):
  - `/state.shadow` = `["COURRIER[b-bolt]", "SHADOW AUDITOR[shadow-auditor]", "TIMELORD[timelord]"]`; b-bolt roster displayName = **"Bolt"**
  - `hub.html` contains **SHADOW COUNCIL**; `data-tab="toolkit"` absent; `chat-input` absent
  - `POST /chat` → `{"ok":true,"relayed":true,"note":"chat lanes ship in GHOST-HUB-003"}`
- Note: the once-off repro script's teardown printed a libuv
  `UV_HANDLE_CLOSING` assertion — a throwaway-script artifact (server closed
  mid keep-alive), NOT a product defect; the real suites close cleanly.

### Unit 1 — Structure: COURRIER + hidden shadow
- `hub-server.js`: COURRIER shadow push block **deleted**; `buildState()` now
  `continue`s past every `section === "shadow"` agent in the section loop AND
  the roster loop → `/state.shadow` always `[]`, no shadow rows anywhere;
  `seatMeta["b-bolt"].displayName` → **COURRIER** (fallback truth).
- `hub-agents.json`: `b-bolt` displayName → **COURRIER**; `shadow-auditor` +
  `timelord` records **kept** (re-show surface for a future leaf).
- `hub.html`: SHADOW COUNCIL render block **removed**; `loadState()` /
  `renderCouncil()` no longer pass/accept `data.shadow`. No "SHADOW COUNCIL"
  heading remains in served HTML (grep proof below).

### Unit 2 — TOOLKIT tab
- `hub.html`: 4th tab `data-tab="toolkit"` id `toolkit-tab` + panel
  `<section id="toolkit">`; `renderToolkit(tk)` renders empty-state message or
  a table with headers **Tool | Purpose | Access | Notes**, all cells escaped
  via `escapeHtml`; `loadState()` passes `data.tkManifest || []`; hash router
  includes `toolkit`; footer TK MANIFEST link kept (unchanged).
- `hub.css`: `.toolkit-table` block using existing tokens only (gold header,
  card-bg body, bordered, full width, collapsed).

### Unit 3 — REAL CHAT LANES
- `hub-server.js`:
  - `resolveOpencode()` — exact WASH/server.js copy (npm global
    `opencode-ai/bin/opencode.exe`, env override `WASH_OPENCODE`, fallback).
  - `extractSessionId(line)` — exact WASH/server.js copy
    (`properties.sessionID` / `session_id`).
  - `seatedAgentMap()` — allowlist derived at request time from
    `.opencode/agents/*.md` stems + static `{ wash: "0-wake" }`.
  - `handleChat()` stub **replaced**: posts `{ agent, message, sessionId? }`,
    validates message (400) and agent against the allowlist (400 for
    missing/unseated, e.g. `cg`/`es-guru`), spawns via
    `spawnSafe(OPENCODE_BIN, ["run","--agent",code,"--format","json","--auto",
    "--title",title, ...continue flags, message], { cwd: ROOT, timeoutMs:
    600000 })` — Sandtrap law (ignore/stdin, pipes, hidden window, 10-min
    kill-point). Single `text/plain` stream relays each NDJSON line from
    stdout AND stderr; final `session=<sid>` line on close; started/close/
    error guards mirror WASH; client-close kills the child.
  - Exports `resolveOpencode` + `extractSessionId` (used by tests).
- `hub.html`: every council card (Wake, Stone, COURRIER, XP, WASH) gains a
  `.chat-lane` block (input + Send + `<pre class="chat-output">`). WASH card
  maps network agent to `0-wake`. Fetch /chat, streams NDJSON lines into the
  output (escaped via `textContent`), captures `session=<sid>` per card and
  sends it as `sessionId` on the next message (continue pattern), disabled/
  working state on Send, Enter-to-send. Specter cards keep the honest
  placeholder chip (unchanged); roster cards stay read-only.
- `hub.css`: `.chat-lane`, `.chat-input-row`, `.chat-input`, `.chat-send`,
  `.chat-output` styles — existing PAD tokens only (flex input row, card-bg
  field + border, scrollable pre 160px, gold Send, muted disabled).

### Unit 4 — Tests
- `GHOST-HUB-002.test.js`: **test 3 only** updated to new ground truth
  (council includes COURRIER; shadow is `[]`; roster excludes
  shadow-auditor/timelord; seals assertion kept). No other 002 tests changed.
- `GHOST-HUB-003.test.js` (new): 6 behavioral tests on port 4750, offline,
  NO real opencode chat spawn (validation failures only).
- Runs (final state):
  - `node --test WASH/GHOST-HUB-002.test.js` → **8/8 pass, 0 fail**
  - `node --test WASH/GHOST-HUB-003.test.js` → **6/6 pass, 0 fail**
  - Combined rerun after the header-comment fix → **14/14 pass, 0 fail**

### Unit 5 — Verification
1. `node --check WASH/hub-server.js` → **CLEAN**
2. Both test suites green (above).
3. Grep proofs:
   - `hub.html` contains **no** `SHADOW COUNCIL` (matches live only in task/
     report/test text — none in served HTML)
   - `hub-server.js` contains **no** `shadow.push` (zero matches)
   - `hub-agents.json` parses; `b-bolt` displayName = **COURRIER**;
     shadow-auditor + timelord records retained
4. Smoke (READ-ONLY, no LLM): `node WASH\hub-server.js` on 4749 (port free
   first, verified) → `/state` = `shadow` count **0**, council = **Wake,
   Stone, COURRIER, XP, WASH**, b-bolt roster = **COURRIER** → process
   stopped cleanly.
5. Native/Chrome launch smoke: **DEFERRED to Drew's window** (like 002). Launch
   ready: `bun run native` from `WASH/` expected to open the same native
   window with the corrected hub; electron binary present (002 test 6 green)
   and electron-main spawn+kill proven (002 test 5 green).
6. `git status --short` — leaf changes confined to `WASH/` (untracked folder);
   `opencode.json` modification predates this leaf (session model-default
   order, not this package); all other dirty/untracked paths pre-existing.
7. Boundary held: no `.opencode/`, no game code, no Pad / Log / Bible /
   MILESTONES / `01_OPERATING_CORE.md`, no `WASH/server.js` / `index.html` /
   `style.css` / `app.js` / `electron-main.js` / `install.js` / `icon.ico`
   touched. **VCS HOLD respected — nothing committed.**

## 3. Files changed (this leaf)

| File | Action |
|---|---|
| `WASH/hub-server.js` | EDIT — shadow hidden; COURRIER display; real /chat lane; helper exports; header comment corrected |
| `WASH/hub.html` | EDIT — SHADOW COUNCIL removed; toolkit tab; chat lanes |
| `WASH/hub.css` | EDIT — toolkit table + chat lane styles |
| `WASH/hub-agents.json` | EDIT — b-bolt displayName → COURRIER (shadow records kept) |
| `WASH/GHOST-HUB-002.test.js` | EDIT — test 3 corrected only |
| `WASH/GHOST-HUB-003.test.js` | CREATE — 6-test behavioral suite |
| `WASH/package.json` | EDIT — version 0.2.0 → 0.3.0 (metadata only) |

## 4. Honest NOT-DONE list

- **Chat smoke with a real LLM** — intentionally NOT run (unit explicitly
  limits tests to validation failures; no LLM burn in this leaf).
- **Native/Chrome launch eyeball** — deferred to Drew's window.
- **Kitchen-sink version badge** — `hub.html` footer still reads
  `v0.2 — Sandtrap-secured`; the package bumped to 0.3.0 only (as specced).
  Drew: if the footer badge should read 0.3, that's a one-line follow-up.
- **No canon docs touched** (Pad/Log/Bible/MILESTONES) and no commits — per
  package boundaries.

**HALT.** Awaiting next instruction or further routing.