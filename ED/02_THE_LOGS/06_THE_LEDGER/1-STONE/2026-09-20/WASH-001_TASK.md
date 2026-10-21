# WASH-001 — THE GHOST CONSOLE (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Drew's rulings (2026-09-20):**
> 1. **WASH = full ghost of 0-Wake** — boots the studio core (truth + Pad), reads state,
>    chats, plants leaves, and routes to DOER from the browser. It is the studio-drive
>    console when the terminal opencode can't be reached (the color-redesign crashout
>    lesson) — no more Google AI fallback.
> 2. **Form = a minimal custom console**, zero-dependency, in its own root folder — the
>    `EXPLORE/` proven pattern (Drew selected this over opencode's native web/serve mode).
> 3. **Same config/agents as the terminal** — the ghost IS 0-Wake speaking through a
>    browser, running the same `.opencode/` seats and project config.
> 4. **Permission engine:** ghost sessions run `opencode run --agent 0-wake --auto`
>    (browser chat can't show ask-prompts; non-interactive mode aborts on them). Auto-
>    approve non-denied; localhost-only + the planner prompt are the guardrails.
> 5. **Planting:** the ghost writes `*_TASK.md` files itself, exactly like 0-Wake in the
>    terminal. No extra approval dial in the UI for v0.1.
> 6. **Routing to DOER in v0.1 = the ghost names the file + tells Drew which window to
>    point.** Spawning a second opencode window from the browser is OUT of v0.1 scope.
> 7. **NOT in v0.1:** remote access, auth, TUI features, multi-agent control, window
>    spawning, file-management UI, any write endpoints in the server (the ghost writes
>    through its own `opencode run` tools — the server itself is read + relay only).

---

## 1. Mandatory pre-reads

1. `AGENTS.md` (repo root `C:\Users\Andrew\Projects\AGENTS.md`) — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` + `00_GOAL1_MANIFEST.md` + `ED/01_THE_DESIGNS/MILESTONES.md` + `ED/02_ESSENCE_PAD.md` — studio truth + the Pad (the ghost's read surface).
3. `EXPLORE/server.js` + `EXPLORE/ledger.test.js` + `EXPLORE/README.md` + `EXPLORE/index.html` + `EXPLORE/style.css` + `EXPLORE/app.js` — the proven zero-dep pattern to mirror (read-only; NOT to be copied verbatim or edited).
4. Verified facts (PLANNER, 2026-09-20, from opencode docs):
   - `opencode run [message..]` — non-interactive single-prompt mode; streams events to stdout; exits when idle.
   - Flags confirmed: `--agent` (use 0-wake) · `--format json` (raw JSON event lines) · `--continue` / `--session <id>` (resume a session — the proven resume-per-turn chat pattern) · `--title` · `--dir` (run in a different working directory; cwd for WASH = repo root so project config/agents resolve) · `--auto` (auto-approve permissions not explicitly denied) · `--attachment/file` (-f) not needed in v0.1.
   - `opencode serve` / `opencode web` exist — **NOT used** (Drew ruled a custom console).

**UNTOUCHABLE (embargo):** every existing file in the studio repo. This leaf is **additive-only**: it creates new files under `WASH/` and edits nothing else. No edits to `EXPLORE/`, `opencode.json`, `.opencode/agents/*`, truth docs, any game district. If a step reveals an existing file MUST change, STOP and report (BROWN BANANA BREAD) — do not improvise the edit.

---

## 2. Why this leaf exists

Drew wants a browser console — "the ghost of 0-Wake" — so he can drive the studio
(read truth, chat with the planner seat, plant leaves, get routing instructions) from
anywhere on his machine even when the OS-terminal opencode can't be reached. The
precedent pain: the color-redesign crashout forced a fall back to Google AI. WASH
closes that gap with the system's OWN box: it shells `opencode run` (same install,
same config, same 0-wake seat) behind a zero-dep Node console.

Architecture (one line): `WASH/server.js` (plain Node http) → static UI + a `/chat`
endpoint that spawns `opencode run --agent 0-wake --format json --auto` in the repo
root, streams the JSON events back to the browser as they arrive, captures the
session id, and resumes the next turn via `--continue --session <id>`.

---

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any build)
Record exact outputs:
1. `node --version` — record (Node's built-ins are the only dependencies).
2. `Get-Command opencode` — record the full path (the server must spawn opencode by
   path if it's not on the session PATH — same pattern as `bun` in prior leaves).
3. `Test-Path "C:\Users\Andrew\Projects\WASH\server.js"` etc. — confirm the leaf's
   build targets do NOT already exist (the `WASH/` folder already holds this task file
   and, later, the report — that's expected; the five build files must be absent).
4. Port probe: `Get-NetTCPConnection -LocalPort 4748 -ErrorAction SilentlyContinue` —
   expect no listener (EXPLORE owns 4747; WASH uses **4748**).

### Unit 1 — Create `WASH/server.js` (exact behavior spec; code is DOER's craft within it)
Zero-dep Node HTTP server (http + fs + child_process + path only — NO npm install).
Behavior (spec, not pseudocode):
- Listens on **`127.0.0.1:4748`** only (never `0.0.0.0`; no auth in v0.1 — localhost
  binding is the security boundary).
- Route whitelist (exact names only — any other path → 404):
  - `GET /` → `index.html`
  - `GET /style.css` → `style.css`
  - `GET /app.js` → `app.js`
  - `GET /state` → JSON snapshot: `{ ok, pad: <ED/02_ESSENCE_PAD.md raw text>, leaves: <lines
    starting with "- [" in the Pad's Leaves in Flight section>, logDate: <last entry date in
    ED/02_THE_LOGS/05_CAPTAINS_LOG/00_LOG_2026.md>, serverTime, port }`. Reads are direct
    file reads; keep it simple and deterministic. (The leaves extraction may be a simple
    filter — record the exact heuristic in the report.)
  - `POST /chat` → body JSON `{ message: string, sessionId?: string }`.
    - Validate: missing/empty `message` → 400 `{ error }`.
    - Spawn: `opencode run --agent 0-wake --format json --auto --title "WASH: <first 40 chars of message>"` + (if `sessionId` provided) `--continue --session <sessionId>` + the message.
    - `cwd` = `C:\Users\Andrew\Projects` (spawn with the repo root so project config,
      AGENTS.md, and seats resolve — same as terminal).
    - Pipe stdout/stderr → relay PROGRESSIVELY to the browser response as each JSON
      event line arrives (chunked writes; do not buffer the whole run). Client parses
      line-delimited JSON.
    - Capture the session id from the first event that carries it (opencode's event
      stream — e.g. the `step_start`/auth events carry `sessionID`; discover the exact
      field while building and record it in the report). Respond status text/HTML as
      the event body so the browser can read it.
    - Safety: kill the child after 10 minutes max; on spawn error return 500 `{ error }`.
- No write endpoints. No path traversal surface (route whitelist handles it).
- Console logging: minimal (`[WASH] listening on http://127.0.0.1:4748`, one line per
  /chat with exit code).

### Unit 2 — Create the UI (`WASH/index.html`, `WASH/style.css`, `WASH/app.js`)
Vanilla only — no framework, no CDN, no external assets (mirror of the zero-dep rule
and the PAD family from `EXPLORE/`):
- **Identity:** ESSENCE v4 PAD — purple & gold (reference `EXPLORE/style.css` for the
  family; the palette law is `#7C5CBF`-family purple + `#D4AF37` gold on dark beds).
  Do NOT copy EXPLORE verbatim; WASH is its own console with the studio's face.
- **Layout:** a chat panel (message history + input box + Send) and a state dashboard
  panel (fetches `GET /state` on load: Pad excerpt, leaves in flight, last log date).
  Header: "WASH — Ghost of Wake."
- **Chat behavior:** POST to `/chat` with the message + the last known sessionId;
  consume the streamed response and append the ghost's completion inline as it
  arrives; store the returned `sessionId` and reuse it for the next turn (resume).
  Handle non-200 (`{ error }`) with a visible error line; never silently fail.
- A clear banner line in the UI: "localhost-only console · same 0-Wake seat · see
  README for scope."

### Unit 3 — Create `WASH/wash.test.js` (deterministic; zero LLM calls in tests)
Mirror the `EXPLORE/ledger.test.js` spirit (plain script, assert-based, explicit
pass/fail lines, zero dependencies). Prefer Node's built-in `node --test` if the
installed `node --version` supports it; otherwise the plain-script pattern — record
which you used. Tests must cover, all offline:
1. Server boots on 127.0.0.1 (use 4748; if the port is taken in CI-like runs, report —
   do not guess a port).
2. `GET /` → 200 + HTML containing the WASH title.
3. `GET /style.css` → 200 · `GET /app.js` → 200.
4. `GET /state` → 200 + JSON with `pad` and `leaves` fields present.
5. Path traversal attempt (e.g. `GET /../opencode.json` resolved, `GET` on an
   out-of-whitelist name) → 404/denied, never a file leak.
6. Unknown route → 404.
7. `POST /chat` with missing/empty `message` → 400 `{ error }`.
(Each test starts a server instance and shuts it down; no /chat LLM call is executed
in the test suite.)

### Unit 4 — Create `WASH/README.md`
- What WASH is (ghost of 0-Wake; browser console; same seat/config as terminal).
- Launch: `node WASH/server.js` → http://127.0.0.1:4748 (Node built-ins only; no install).
- Capabilities v0.1: read truth + Pad, chat with the planner seat, the ghost plants
  leaves itself, routing = ghost names the file + tells you which window to point.
- Explicitly NOT in v0.1 (Drew's rulings): no remote access, no auth, no TUI features,
  no multi-agent control, no spawning windows, no server-side write endpoints.
- Security note: bound to localhost only; permission engine is `--auto` on ghost runs.
- Test: how to run `wash.test.js`.

### Unit 5 — Create `WASH/.gitignore` (one line)
Contents exactly:
```
node_modules/
```
(Dependency-free today; keeps the folder future-safe. Do NOT add more lines.)

### Unit 6 — Live end-to-end proof (ONE real ghost run; burn-compliant)
1. Start the server (background or second terminal; record PID).
2. `curl`/Invoke-WebRequest `GET /` → 200. `GET /state` → 200 + JSON. Record.
3. `POST /chat` once with message: "Read the Pad and list the leaves in flight in one
   short line." → verify streamed response arrives (record what the ghost returned),
   capture the returned `sessionId`.
4. `POST /chat` a second time WITH that `sessionId` — verify resume works (the ghost
   should answer as a continuing 0-Wake; record the answer).
5. Kill the server tree (only the spawned tree — never blanket-kill node).
6. Cleanup: no temp files, no stray processes, no appdata residue.
7. If the ghost fails to answer (spawn error, auth, config) → STOP, report honestly
   (BROWN BANANA BREAD if you suspect any dangerous state), do NOT improvise.

### Unit 7 — Report + HALT
1. Plant `WASH-001-REPORT.md` next to this task file — restated scope, unit-by-unit
   results (versions, paths, test pass lines, /state sample, the two live ghost
   answers verbatim, the discovered session-id event field, port confirmations), any
   deviations, honest NOT-DONE list.
2. HALT. Do NOT start auth, remote access, UI polish passes, window spawning, or any
   other work (future leaves only if Drew rules them).

---

## 4. Definition of Done (DoD)

1. `WASH/` holds exactly: `server.js` · `index.html` · `style.css` · `app.js` ·
   `wash.test.js` · `README.md` · `.gitignore` (this task file + report live there too).
2. Zero dependencies — no `node_modules`, no package.json, no install step. If any
   install becomes unavoidable → STOP and report (that is a scope change for Drew).
3. All offline tests green (the Unit 3 suite).
4. Live ghost proven once: chat streamed, `sessionId` captured, resume turn answered
   (Unit 6).
5. No existing file anywhere in the studio repo was edited (additive-only leaf).
6. Report planted; no staging/temp residue; HALT.

## 5. Guardrails

- **Additive-only:** create files under `WASH/`; edit NOTHING that already exists.
- **No new dependencies** — Node built-ins only (http, fs, child_process, path, assert).
- **Localhost only** — bind `127.0.0.1`; never `0.0.0.0`, never a public hostname.
- **No server write endpoints** — the ghost writes through its own `opencode run`
  tools; the server relays reads and chat.
- Never run `opencode web` or `opencode serve` as the console — WASH is its own console.
- Zero discretion: any surprise → STOP and report; do NOT improvise adjacent fixes.
- Masquerade is forbidden: state exactly what ran, what passed, what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone) window at this file
to execute. Stone's seat is already permission-unlocked (edit: allow · bash: allow) — this leaf
runs hands-free. Executor: restate scope, run, HALT at every unit gate.