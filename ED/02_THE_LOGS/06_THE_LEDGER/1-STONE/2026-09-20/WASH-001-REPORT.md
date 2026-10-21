# WASH-001-REPORT — THE GHOST CONSOLE

> **Executed by:** DOER (1-Stone) · **Date:** 2026-09-20 · **Seat unlocked:** edit/bash allow (hands-free per package)
> **Status:** COMPLETE — HALTED. Awaiting Drew's routing (recommend: point 0-Wake here).

---

## Restated scope

Build **WASH**, the ghost of 0-Wake: a zero-dependency custom Node console in
its own root folder (`WASH/`) that boots the studio core, reads truth + Pad,
chats with the `0-wake` seat via `opencode run --agent 0-wake --format json
--auto`, and resumes turns via `--continue --session <id>`. Server = read +
relay only. Additive-only leaf: created new files under `WASH/`, edited
nothing that existed.

---

## Unit-by-unit results

### Unit 0 — Baseline gate proof (recorded 2026-09-20)
1. `node --version` → **v24.19.0** (Node built-ins only; `node:test` + global `fetch` available).
2. `Get-Command opencode` → `C:\Users\Andrew\AppData\Roaming\npm\opencode.ps1` (PowerShell shim).
   The real spawnable exe (by path, per the "not on session PATH" plan) → **`C:\Users\Andrew\AppData\Roaming\npm\node_modules\opencode-ai\bin\opencode.exe`** (opencode v1.18.31). The server resolves this by path (env override `WASH_OPENCODE` supported).
3. `Test-Path` on all five build targets → **all False** before build (leaf was additive-clean).
4. Port probe `4748` → **no listener** (EXPLORE holds 4747; WASH = 4748 ✅).

### Unit 1 — `WASH/server.js`
Created. Zero-dep (`http`, `fs`, `path`, `child_process` only). Binds
`127.0.0.1:4748` only. Route whitelist exact: `GET /`, `/style.css`,
`/app.js`, `/state`, `POST /chat`. Everything else 404 (no traversal
surface — tests 5–6 prove it). No write endpoints.

`GET /state` shape: `{ ok, pad, leaves, logDate, serverTime, port }`.
- **Leaves heuristic (recorded):** read Pad raw; enter the `## Leaves in Flight`
  section after its heading; stop at the next `## ` heading; keep lines
  starting with `- ` followed by `[` (`- **[` matches the Pad's actual bold
  bullets). Captured **5** in the live sample.
- **logDate heuristic:** scan captain's log for the last line starting
  `### ` whose heading carries a `Month Day` date → `September 19` (the last
  log entry is 2026-09-19, "The Native Wheel").

`POST /chat`: validates `message` (400 `{ error }` otherwise), spawns
`opencode run --agent 0-wake --format json --auto --title "WASH: <first 40
chars>"` (+ `--continue --session <id>` on resume) with `cwd` =
repo root, streams stdout+stderr progressively (chunked, line-delimited),
captures session id from the event stream, kills child after 10 min max,
500 on spawn error. Console logs one line per /chat with exit code.

### Unit 2 — UI (`index.html`, `style.css`, `app.js`)
Created vanilla only (no framework/CDN). PAD palette: `#7C5CBF` purple
family + `#D4AF37` gold on dark beds (same family as EXPLORE, own design —
not a copy). Header **"WASH — Ghost of Wake."**, required banner
("localhost-only console · same 0-Wake seat · see README for scope").
Chat panel streams completion inline, stores returned `sessionId`, reuses
for the next turn, renders visible error lines on non-200. State dashboard
fetches `/state` on load (Pad excerpt, leaves in flight, last log date).

### Unit 3 — `WASH/wash.test.js`
Used **Node's built-in `node --test`** (recorded: supported at v24.19.0).
All offline, no LLM calls. Final run (post-fix, clean port):

```
✔ 1 · server boots bound to 127.0.0.1 on port 4748
✔ 2 · GET / serves the WASH shell with the title
✔ 3 · GET /style.css and /app.js serve 200
✔ 4 · GET /state serves JSON with pad and leaves present
✔ 5 · path traversal / out-of-whitelist never leaks files
✔ 6 · unknown route returns 404
✔ 7 · POST /chat with missing / empty message returns 400 { error }
ℹ tests 7  ℹ pass 7  ℹ fail 0
```

(Note: an intermediate run showed 7 fails `EADDRINUSE` because the Unit 6
live server held 4748 — that was expected sequencing, not a defect; the
clean final run above is green.)

### Unit 4 — `WASH/README.md`
Created per spec: what WASH is, launch cmd, v0.1 capabilities, the NOT-in-
v0.1 list (Drew's rulings), security note, test instructions.

### Unit 5 — `WASH/.gitignore`
Contains exactly the one line: `node_modules/`.

### Unit 6 — Live end-to-end proof (real ghost runs; burn-compliant)
1. Server started in background, PID recorded (final instance 6784).
2. `GET /` → **200** (1,889 bytes). `GET /state` → **200** JSON `{ ok:true, leaves:5, logDate:"September 19", port:4748 }`.
3. `POST /chat` #1 (message "Read the Pad and list the leaves in flight in one short line.") → **HTTP 200, ~19.9 KB streamed**. **Ghost answer (verbatim):**
   > Pad read. Leaves in flight, one line: **Seal the Beast (Leaf 7) done · True Client PARKED · WASH deferred for next session · Cephalon Ghost spec'd (after WASH) · XP hands-free unlock pending next XP boot · Founding Arc 17→19 ENSHRINED.**
   Captured `sessionId` → **`ses_f3fe2d64affeIlSa8h2BImi52s`**.
4. `POST /chat` #2 WITH that `sessionId` (message "Good. What routing instruction do you have for Drew right now?") → **HTTP 200, ~1.8 KB**, same session answered as continuing 0-Wake. **Ghost answer (verbatim):**
   > Routing instruction: **point Stone (DOER) at the Wheel-native work first - your own ruling ("get the Wheel native first") supersedes WASH-001's planted task, so WASH stays queued.** Two flags for that route:
   > - **XP hands-free unlock is the only current micro-task** - one-line config edit (`edit: allow` + `bash: allow` in `x-xp.md`), applies at next XP boot. Cheap enough to ride along with the Wheel session.
   > - **No Wheel task package is planted yet** - "the Wheel native" is intent on the Pad, not a scope-locked leaf. Under Core Law 2, Stone can't act on it until you approve a spec: targets, edits, commands, definition of done.
   > So the open gate is yours: **say "spec the Wheel leaf" and I'll plant the exact task package for your approval.**
5. Server tree killed (4748 listener verified gone). Only my spawned tree was
   killed — the two `opencode` processes alive at 11:20/12:58 (the studio's
   own seats) were left untouched.
6. Cleanup: diag temp files removed; no node_modules, no package.json, no
   staging residue in `WASH/` (file list below).

### Unit 7 — Report (this file)
Planted. **HALT** — no auth, remote access, UI polish, window spawning, or
further work begun.

---

## Discoveries recorded

- **Session-id event field:** opencode v1.18.31 `run --format json` places the
  session id at the **top-level `sessionID`** on event lines (e.g.
  `{"type":"step_start", "sessionID":"ses_…", ...}`). The server and client
  capture it from `ev.sessionID` (also tolerates `properties.sessionID` /
  `session_id` / older `message.part.updated` shapes).
- **Observed event types in v1.18.31:** `step_start`, `tool_use`, `text`,
  `step_finish`. Text completion arrives on `{"type":"text","part":{"type":"text","text":…}}`
  — the client renders that.
- **CRITICAL spawn discovery:** `opencode run` **stalls with zero stdout when
  spawned with a piped stdin** (Node's default `stdio`). It runs to completion
  only with stdin ignored: `stdio: ["ignore","pipe","pipe"]`. The server
  carries this fix. (Found during live proof — the first in-UI chat produced
  no response and had to be killed; direct `--version` spawns worked, which
  hid the issue until the run-mode test.)
- The ghost answers while "deferred WASH" is the Pad truth — the Pad entry
  still reads WASH as deferred for "next session"; this leaf's execution is
  that next session. No doc edits were made (additive-only); WAKE owns Pad/canon updates.

---

## Deviations (none scope-breaking)

1. `stdio: ["ignore","pipe","pipe"]` on the spawn (see discovery above) — a
   fix within the named `/chat` behavior, required for it to function.
2. The spidered leaves filter accepts `- **[` bold bullets (the Pad's actual
   format), not only `- [`. Heuristic recorded above.

## NOT-DONE (honest)

- No edits to any pre-existing file anywhere in the studio repo (additive-only held).
- No `node_modules` / package.json (no install step).
- No auth, remote access, TUI, multi-agent control, window spawning, write endpoints, UI polish — all ruled OUT of v0.1 and not started.
- `WASH-001_TASK.md` receipt not yet MOVED to the ledger (that's WAKE/Drew's routing step; the leaf does not self-file).
- Canonical docs (BIBLE / MILESTONES / Pad) NOT updated — additive-only leaf; those updates are WAKE's to make when it routes this in.

---

**DOER reports complete and HALTED.** Recommend routing: **point 0-Wake at `WASH/WASH-001-REPORT.md`** to file the receipt, refresh the Pad (WASH is now live, not deferred), and decide the next leaf.