# GHOST-HUB-003 — STRUCTURE CORRECTIONS + TOOLKIT TAB + REAL CHAT LANES

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (Studio Director — 5 rulings, 2026-09-20)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. VCS HOLD — no commits.
> Chat behavior is interactive: use the exact spawn pattern below; do NOT
> improvise a second chat mechanism.

---

## 1. Drew's Rulings (what this leaf encodes)

1. **COURRIER** = one card, in HEAD COUNCIL GHOSTS, displayName **COURRIER**
   (not "Bolt"). No shadow duplicate.
2. **Dormant shadow roles (SHADOW AUDITOR, TIMELORD)** = hidden for now.
   No shadow section renders; no shadow rows in roster; `/state.shadow` is `[]`.
   Keep their records in `hub-agents.json` (personalization surface) so a
   future leaf can re-show them with one edit — do not delete the records.
3. **TOOLKIT** = a 4th tab rendering the parsed TK manifest table.
4. **Structure only.** No visual redesign pass. Existing PAD palette/CSS
   tokens only; no new identity work, no layout overhaul.
5. **Chat lanes come in now** (GHOST-HUB-003 includes chat; no separate 004).

---

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub-server.js` | EDIT — shadow/COURRIER structure + real `/chat` lane |
| `WASH/hub.html` | EDIT — drop SHADOW COUNCIL block, add TOOLKIT tab, add chat lanes |
| `WASH/hub.css` | EDIT — styles for toolkit table + chat lane (existing tokens only) |
| `WASH/hub-agents.json` | EDIT — b-bolt displayName → `COURRIER`; keep shadow records |
| `WASH/GHOST-HUB-002.test.js` | EDIT — test 3 corrected to new ground truth |
| `WASH/GHOST-HUB-003.test.js` | CREATE — new behavioral suite |
| `WASH/package.json` | EDIT — version `0.2.0` → `0.3.0` (metadata only) |

NOT touched: `electron-main.js`, `install.js`, `server.js`, `index.html`,
`style.css`, `app.js` (WASH ghost console — out of scope), `ED/` docs, Pad,
Log, MILESTONES, `.opencode/` agents, all game code. No commits.

---

## 3. Unit 0 — Baseline gate proof (run FIRST, record)

- `node --version` (expect v24.x) · `git status --short` (record pre-existing
  dirty tree — **VCS HOLD respected, nothing committed**).
- Repro proof (record honestly):
  - `GET /state` → `shadow` currently contains COURRIER + SHADOW AUDITOR +
    TIMELORD; b-bolt displays as "Bolt".
  - `hub.html` contains a "SHADOW COUNCIL" section; no toolkit tab; no chat UI.
  - `POST /chat` currently returns the stub `{ ok, relayed, note: "chat lanes
    ship in GHOST-HUB-003" }`.

---

## 4. Unit 1 — Structure: COURRIER + hidden shadow (hub-server.js, hub-agents.json, hub.html)

### hub-server.js
1. **Remove the forced COURRIER shadow push** — the block in `buildState()`
   that constructs `courrier` from `agents["b-bolt"]` and pushes it into the
   `shadow` array. Delete that block entirely.
2. **Hide dormant shadow roles** — `defaultAgents()` KEEPS defining
   `shadow-auditor` + `timelord` (record retained), but `buildState()` must
   exclude every agent with `section === "shadow"` from ALL four output
   arrays: `council`, `specters`, `shadow` (emit `[]`), and `roster`. Do not
   leak a shadow-section row into the roster.
3. **Display name**: in `seatMeta`, change `b-bolt` displayName from `"Bolt"`
   to `"COURRIER"`. Tagline stays. (Personalization merge still applies.)

### hub-agents.json
4. Change the `b-bolt` entry displayName: `"Bolt"` → `"COURRIER"`. Leave
   `shadow-auditor` + `timelord` entries in the file (hidden by the server
   filter — this is the re-show surface for a future leaf).

### hub.html
5. **Remove the SHADOW COUNCIL render block** from `renderCouncil()` — delete
   the `if (shadow.length) { ... "SHADOW COUNCIL" ... }` section. Adjust
   `loadState()` so it no longer passes `data.shadow` into the council
   renderer (drop the parameter). No "SHADOW COUNCIL" heading may remain in
   the served HTML.

---

## 5. Unit 2 — TOOLKIT tab (hub.html, hub.css)

### hub.html
1. Add a 4th tab button: `data-tab="toolkit"`, label **TOOLKIT**, in the
   existing `.tabs` role=tablist (after `roster`). Add a 4th panel
   `<section id="toolkit" role="tabpanel" aria-labelledby="toolkit-tab"
   hidden></section>` (create the id `toolkit-tab` on the button).
2. Add `renderToolkit(tk)`:
   - If `tk` is empty → `<p class="empty">Toolkit manifest empty.</p>`.
   - Else build a table: headers **Tool | Purpose | Access | Notes**, one row
     per entry from `tkManifest` (fields `tool, purpose, access, notes`).
     Escape ALL cell text with the existing `escapeHtml`.
3. `loadState()`: pass `data.tkManifest || []` to `renderToolkit`.
4. Keep the footer TK MANIFEST link (unchanged).

### hub.css
5. Add a `.toolkit-table` style block using EXISTING tokens
   (`--border`, `--card-bg`, `--pad-gold`, `--fg-muted`, etc.): bordered
   table, header row styled with `--pad-gold`, cell text `--fg`/`--fg-muted`,
   padding, full width, `border-collapse: collapse`. No new colors.

---

## 6. Unit 3 — REAL CHAT LANES (hub-server.js, hub.html, hub.css)

Mirror the WASH ghost chat pattern (`WASH/server.js` `handleChat` — proven),
THROUGH the Sandtrap spawn discipline (`spawnSafe` — the law).

### hub-server.js
1. **Add `resolveOpencode()`** — copy the exact resolver from
   `WASH/server.js` (npm global `opencode-ai/bin/opencode.exe`, env override
   `WASH_OPENCODE`, fallback `"opencode"`).
2. **Add `extractSessionId(line)`** — copy the exact helper from
   `WASH/server.js` (`properties.sessionID` / `session_id`).
3. **Replace `handleChat()` stub** with a real lane:
   - Body: `{ agent, message, sessionId? }` (reuse `drainBody`, 1 MB cap).
   - Validate: `message` non-empty string → else 400
     `{ error: "message must be a non-empty string" }`.
   - **Agent allowlist** — derive at request time from `.opencode/agents/*.md`
     stems (`fs.readdirSync(AGENTS_DIR)` filters `.md` → stem) PLUS the static
     map `{ "wash": "0-wake" }` (WASH is the ghost of Wake — proven pattern).
     Unknown/unseated agent (e.g. `cg`, `es-guru`, anything not on the
     allowlist) → **400** `{ error: "agent <x> has no seated opencode agent
     file" }`. Do NOT spawn for unseated agents.
   - Spawn — **exact flags from WASH precedent**:
     `spawnSafe(OPENCODE_BIN, ["run", "--agent", agentCode, "--format",
     "json", "--auto", "--title", title, ...(sessionId ?
     ["--continue", "--session", sessionId] : []), message], { cwd: ROOT,
     timeoutMs: 600000 })` where `title = "<AGENTCODE>: " + message.slice(0,
     40)` and `agentCode` is the resolved opencode agent stem (wash→0-wake).
   - Response: on spawn, `res.writeHead(200, { "Content-Type":
     "text/plain; charset=utf-8", "Cache-Control": "no-store" })`; relay each
     NDJSON line from stdout AND stderr as `line + "\n"`; write `sessionId`
     on the response body as a final `session=<sid>` line when a session is
     seen (`extractSessionId` over streamed lines). Safe 10-min kill timer;
     kill child if the client closes; close cleanly on child close (mirror
     WASH's started/close/error guards). Single logical stream, no double
     response.
4. Export `resolveOpencode` + `extractSessionId` from the module (tests).

### hub.html
5. **Chat lane on every council card** (the 5 council cards: Wake, Stone,
   COURRIER, XP, WASH):
   - `cardShell` for council cards appends a `.chat-lane` block:
     `<input class="chat-input" placeholder="Message ...">` +
     `<button class="chat-send">Send</button>` +
     `<pre class="chat-output" aria-live="polite"></pre>`.
   - Wire per-card: Send → `fetch("/chat", { method: "POST", body: JSON
     stringify({ agent: <opencode agent stem>, message }) })` where the stem
     comes from the card's `a.id` — BUT `wash` maps to `"0-wake"` for the
     network call. Read the response stream (NDJSON), append each line to the
     `.chat-output`. When a `session=<sid>` line arrives, store it per card
     and send `sessionId` on the NEXT message from that card (continue
     pattern). Add a disabled/working state on Send while a lane is live.
   - Specter cards: keep the existing honest placeholder chip (unchanged) —
     they have no seated agent file this leaf.
   - Roster cards: unchanged (read-only).
6. All agent/message text escaped into the DOM.

### hub.css
7. `.chat-lane` styles with existing tokens: input row (flex, `--card-bg`
   field, `--border`), `.chat-output` as a scrollable `pre`
   (`max-height: 160px; overflow-y: auto; background: var(--bg);
   border: 1px solid var(--border); color: var(--fg-muted); font-size:
   0.75rem`), Send button using `--pad-gold`. Disabled state muted. No new
   palette colors.

---

## 7. Unit 4 — TESTS

### Update `WASH/GHOST-HUB-002.test.js`
- **Test 3 — correct to new ground truth:**
  - `council` includes Wake, WASH, **COURRIER** (displayName).
  - `shadow` is an **empty array**.
  - `roster` contains NO entry with id `shadow-auditor` or `timelord`.
  - Keep the seals assertion (SANDTRAP-001 / WASH-001 on 1-stone).
  - No other 002 tests change.

### Create `WASH/GHOST-HUB-003.test.js` (Node built-in runner, offline ONLY)
Pattern: `node --test WASH/GHOST-HUB-003.test.js`. Boot the server on its own
port via `startServer({ port: 4750 })` and shut down in after. **NO real
opencode chat spawn in tests** (burn + nondeterminism) — validation failures
only, mirroring `wash.test.js`.
- T1: server boots on 127.0.0.1:4750 and GET / serves the hub shell.
- T2: `/state` — `shadow` is `[]`; `council` displayNames include COURRIER;
  roster excludes `shadow-auditor` / `timelord`.
- T3: `/state.tkManifest` is a non-empty array; served `hub.html` contains
  `data-tab="toolkit"` and `<section id="toolkit"`.
- T4: served `hub.html` does NOT contain `SHADOW COUNCIL`.
- T5: `POST /chat` with missing `message` → 400 `{ error }`; with missing
  `agent` → 400; with unseated agent `"cg"` → 400 `{ error }` (no spawn).
- T6: `/spawn` regression — single child-close response (`node -e
  console.log('hub-spawn-ok')` → ok true, exitCode 0, stdout contains
  `hub-spawn-ok`).

### Run (both)
- `node --test WASH/GHOST-HUB-002.test.js`
- `node --test WASH/GHOST-HUB-003.test.js`
- Both must be 100% green. No hack-around for a red test — if a written test
  conflicts with this package, STOP and report.

---

## 8. Unit 5 — Verification (diagnostics)

1. `node --check WASH/hub-server.js` → clean (also `--check hub.html` is not
   a thing — static grep checks only for html).
2. Both test suites green (Unit 4).
3. Grep proofs:
   - `hub.html` contains **no** `SHADOW COUNCIL`.
   - `hub-server.js` `buildState()` contains **no** COURRIER shadow push
     (search `shadow.push` — only allowed via the section loop, which emits
     `[]`).
   - `hub-agents.json` parses; `b-bolt` displayName = `COURRIER`.
4. Smoke (READ-ONLY, no LLM): `node WASH\hub-server.js` → hit `/state` →
   confirm shadow `[]`, COURRIER present; then stop the process.
5. Native/Chrome launch smoke: **DEFERRED to Drew's window** (like 002). Note
   launch-ready state: `bun run native` from `WASH/` expected to show the
   same native window with the corrected hub.

---

## 9. Definition of Done (all five)

1. **Structure corrected:** COURRIER = one card, in council, displayName
   COURRIER; `/state.shadow` = `[]`; no shadow rows in roster; no SHADOW
   COUNCIL UI.
2. **TOOLKIT renders** as a 4th tab (Tool | Purpose | Access | Notes from
   `/state.tkManifest`).
3. **Chat lanes live** for every seated council agent (Wake/Stone/COURRIER/
   XP via seat stems, WASH via `0-wake`) — Sandtrap-spawned, NDJSON-streamed,
   session-continue, honest 400 for unseated agents.
4. **Tests green:** GHOST-HUB-002 (updated) + GHOST-HUB-003 (new) 100% pass.
5. **HALT + masquerade-free report:** exact done/not-done, `WASH/` targets
   only, VCS HOLD respected, no canon docs touched. Report as
   `WASH/GHOST-HUB-003_REPORT.md` next to this task.

---

**Boundaries re-stated:** chat validation FAILURES only in tests; one chat
mechanism (the WASH pattern) — no second mechanism; no `.opencode/` edits; no
specter seating this leaf (CG/ES-GURU stay placeholders); no visual redesign;
no commits.