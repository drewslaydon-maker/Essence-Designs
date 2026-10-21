> SUPERSEDED 2026-10-06 — CG-002 reset: split into CG-002-A (craft model), CG-002-B (loot log), CG-002-C (timers). This file is historical; do not execute.

# CG-002 — THE CG WINDOW + TIMERS + LAST SYNC (TASK PACKAGE)

**Leaf:** CG-002 · **Executor:** DOER (1-Stone) · **Planted by:** PLANNER (0-Wake)
**Date:** 2026-10-06 · **Predecessor:** CG-001 (COMPLETE — 52/52, render verified by Drew)

**Rulings this package executes (Drew, 2026-10-06):**
1. **Window mechanism A** — CG gets its own window as a **zero-dep local console
   server** (WASH pattern), serving the LOOT/TRADE DOCK at `127.0.0.1:4760`.
   Browser window now; Electron-native is a future leaf, not this one.
2. **Timers ship NOW; chat is the LAST cut** (CG-005). No chat, no LLM spawn,
   no `/chat` endpoint in this leaf.
3. **LAST SYNC section ships now** — when Drew last personally scrubbed his bag
   and the market values, globally and per item. All values start `null`/empty;
   CG-003 seeds them from Drew's dictation. **Zero date invention.**

**Why 4760:** 4747 EXPLORE · 4748 WASH · 4749 Ghost Hub · 4750–4755 test servers.
4760 is the next free studio console port.

---

## 0. THE RULES (binding on this leaf)

- **HUB STAYS OUT (ruling 4, unchanged).** Zero writes to `WASH/**`. Read-only
  reference to `WASH/server.js` for the console pattern is allowed. Hub file
  mtimes recorded at Unit 0 must be byte-identical at exit.
- **VCS HOLD.** No `git add`, no `git commit`, no amend, no stash, no branch.
- **READ-ONLY on all game data/files.** Writes only under `CG/`, plus the
  Desktop xlsx which is NEVER written (ruling H).
- **CG-001 locked inputs are still locked:** `CG/probe.js`, `CG/baked/**`,
  `CG/baked/api-surface.md` — read-only, not re-run, not re-baked. The probe
  refresh is **CG-003**, not here.
- **Zero dependency.** Node built-ins only. No package.json, no node_modules,
  no npm, no CDN, no webfont. The dock must STILL open from `file://` with no
  server and no internet.
- **`CG/CG-002_TASK.md` (this file) is read-only while executing.**
- **`C:\Users\Andrew\Desktop\WF10_04-TRADEDOCK.xlsx`** — read-only. Record
  size `11030`, mtime `2026-10-05 18:46:03` at Unit 0; re-check at exit.
- **No bare `node CG/import-xlsx.js` and NO `--force` runs in this leaf.**
  Once state exists, a bare re-import correctly exits 2 (the CG-001 guard
  working as designed). Running it with `--force` would destroy state —
  banned here and forever without a diff-reviewing leaf.
- **TWO NAMED INTENTIONAL DELTAS ONLY** (§6): `I13` and `I23` in
  `CG/dock.test.js`. **If ANY OTHER existing assertion fails: STOP. Do not
  edit it. Report it as a FINDING.**

---

## 1. MANDATE

Give CG its own window — a local console that serves the LOOT/TRADE DOCK and
carries the two surfaces CG-001 could not: **live foundry/event TIMERS**
(Drew-seeded; his Wisp piece is the first entry he will add) and a
**LAST SYNC** record of his own market/bag scrubs. The dock keeps working
from `file://` exactly as before; the console adds liveness, not dependence.

---

## 2. SCOPE LOCK

| # | Target | Kind | Purpose |
|---|---|---|---|
| M1 | `CG/console-server.js` | CREATE | zero-dep HTTP console: statics + `/api/state` + `/api/timers` + `/api/lastsync` + `--init` |
| M2 | `CG/derived/dock.seed.json` | CREATE (frozen) | pristine copy of the import-pure `dock.json`, frozen at Unit 0 — the new I13 oracle |
| M3 | `CG/derived/dock.json` | EDIT (state only) | gains top-level `lastSync` block via `--init`; gains `timers.entries` only through the API |
| M4 | `CG/dock.html` | EDIT | LAST SYNC render + timers panel + guarded live fetch + file:// fallbacks |
| M5 | `CG/baked/FIELDS.json` | EDIT | declare every new key the page reads; recount `_doc_count` to measured truth |
| M6 | `CG/dock.test.js` | EDIT (2 named deltas + new L-block) | I13 reworked to the seed oracle; I23 schema-valid instead of count-0; new L1–L8 |
| M7 | `CG/console.test.js` | CREATE | server suite — boot, statics, traversal, CRUD, persistence, side-effect proof |
| M8 | `CG/CG-002_REPORT.md` | CREATE | the receipt |

### LOCKED OUT

- `WASH/**` (all of it) — mtimes must not move.
- `CG/CG-000_*`, `CG/probe.js`, `CG/baked/api-surface.md`, `CG/baked/probes/**`,
  `CG/import-xlsx.js`, `CG/build-dock.js`, `CG/relics.data.js` — **not edited**
  (see §4.2: build-dock needs NO change; verify, don't touch).
- `CG/drew/*.md`, the Desktop xlsx, `.opencode/agents/**`, `opencode.json`,
  `AGENTS.md`, `ED/**`, `03_THE_GAMES/**`, `LEGACY/**`, `MUSIC/**`, `EXPLORE/**`.
- **No chat, no `/chat` route, no `opencode run`, no LLM spawn anywhere.**
- **No Electron, no launch script** — CG-002 opens with
  `node CG/console-server.js` and a printed URL.

---

## 3. UNIT 0 — Baseline gate (record BEFORE any write)

1. `node --version` → record.
2. `git status --short` → record. **No commit, ever.**
3. Record hashes/mtimes: Desktop xlsx (`11030`, `2026-10-05 18:46:03`);
   `CG/baked/probes/**` (all), `CG/baked/api-surface.md`, `CG/probe.js`;
   **every file in `WASH/`** (hub must not move).
4. `netstat` / connection check: **port 4760 free.** If taken → STOP and report.
5. Run `node CG/dock.test.js` → must be **52/52 green** as the baseline. If not,
   STOP — the predecessor's suite is the floor.
6. **Purity check:** run the importer to a temp file
   (`node CG/import-xlsx.js "<xlsx>" --out <tempA>`), compare bytes with
   `CG/derived/dock.json`. Must be **identical** (dock.json is still the pure
   import product). **If not identical → BROWN BANANA BREAD, STOP, report** —
   state may already have diverged and freezing a dirty seed would be wrong.
7. **Freeze the seed:** copy the verified-pure `dock.json` →
   `CG/derived/dock.seed.json`. This file is written ONCE here and **never
   touched again** (not by the server, not by tests, not by build).
8. Confirm `Test-Path CG/console-server.js` → False; `CG/console.test.js` → False.

---

## 4. THE BUILD

### 4.1 UNIT 1 — `CG/console-server.js` (CREATE)

Zero-dep Node HTTP server. **Binds `127.0.0.1` only** (never `0.0.0.0`).

**CLI:**
```
node CG/console-server.js                 # port 4760, dock CG/derived/dock.json
node CG/console-server.js --port <n>      # 0 = ephemeral (tests); prints chosen port
node CG/console-server.js --dock <path>   # alternate dock.json (tests use a temp copy)
node CG/console-server.js --init          # ensure state keys exist, print "INIT OK", exit 0
```

On listen, print exactly (first stdout line, so tests can parse it):
```
CG-CONSOLE LISTENING http://127.0.0.1:<port>/
```
Port in use → clear one-line error, **exit 1** (no stack dump).

**Routes:**

| Method | Path | Behavior |
|---|---|---|
| GET | `/` | serve `CG/dock.html`, `text/html; charset=utf-8` |
| GET | `/dock.html`, `/dock.data.js`, `/relics.data.js` | allowlisted statics (`text/html` / `text/javascript; charset=utf-8`) |
| GET | anything else (incl. `/derived/*`, `/../*`, `/console-server.js`) | **404**, never a file outside the allowlist |
| GET | `/api/state` | `{ timers: <dock.timers>, lastSync: <dock.lastSync> }`, `Cache-Control: no-store` |
| POST | `/api/timers` | add / edit / remove (below), writes dock.json, returns updated `timers` |
| POST | `/api/lastsync` | setBag / clearBag / setItem / clearItem, writes dock.json, returns updated `lastSync` |
| other method on API paths | | **405**; invalid JSON body / failed validation → **400** `{ error }` |

**No CORS headers** (same-origin console). No other endpoints. JSON bodies
capped at 32 KB. Unknown routes → 404. The server reads + writes ONLY its
`--dock` file — nothing else, ever.

**`--init` (idempotent):** if `dock.json` lacks top-level `lastSync`, add:

```json
"lastSync": {
  "_doc": "When Drew last personally scrubbed his bag + market values. Global bag date + per-item dates. DREW_SOURCED — seeded only from Drew's word (CG-003). null everywhere until he says a date. Never derived, never guessed, never inferred from other fields.",
  "bagScrub": null,
  "perItem": {}
}
```
If present → no-op. **`--init` must not touch any other key** (stringify
matches the importer: `JSON.stringify(dock, null, 2) + "\n"`).

**`timers` shape (already reserved by CG-001 — keep its `_doc` verbatim):**
```json
"timers": { "_doc": "<unchanged CG-001 _doc>", "entries": [ <timer> ] }
```
`<timer>` = `{ "id": <crypto.randomUUID()>, "label": <string>,
"endsAt": <"YYYY-MM-DDTHH:mm" as submitted>, "skipCostPlat": <number|null>,
"notes": <string|null> }`.

**POST /api/timers ops:**
- `{ "op": "add", "timer": { "label", "endsAt", "skipCostPlat?", "notes?" } }`
  → server assigns `id`. Validation: `label` non-empty trimmed ≤120 chars;
  `endsAt` must parse (`Date.parse`), submitted as `YYYY-MM-DDTHH:mm`;
  `skipCostPlat` number ≥ 0 or absent → `null`; `notes` string ≤500 or absent
  → `null`. **Past endsAt is allowed** (it just renders TIME UP).
- `{ "op": "edit", "id", "timer": {…same fields as add…} }` → id must exist
- `{ "op": "remove", "id" }` → id must exist
- unknown id → 404 `{ error }`; unknown `op` → 400.

**POST /api/lastsync ops:**
- `{ "op": "setBag", "date": "YYYY-MM-DD" }` / `{ "op": "clearBag" }`
- `{ "op": "setItem", "item": "<exact dock item name>", "date": "YYYY-MM-DD" }`
  / `{ "op": "clearItem", "item": "…" }`
- `date` must match `/^\d{4}-\d{2}-\d{2}$/` and parse. `item` must match an
  entry in `dock.items[].item` **exactly** → otherwise 400 (guards typos).
- `clear*` sets the value to `null` / removes the perItem key.

**Write discipline:** read dock.json → mutate ONLY the target block → write
**atomically** (temp file in the same directory + `fs.renameSync`) → with
`JSON.stringify(dock, null, 2) + "\n"` (byte-format identical to import-xlsx).
A failed write must leave the previous file intact. **`lastSync` and `timers`
are the only keys the server ever mutates.**

### 4.2 UNIT 2 — run `--init`, verify build needs no change

1. `node CG/console-server.js --init` → `INIT OK`, exit 0.
   Re-run → no-op, exit 0, **byte-identical dock.json both times.**
2. **`CG/build-dock.js` requires NO edit** — it spreads the whole master into
   the bundle, so `lastSync`/`timers` pass through automatically. **Verify by
   running it; do not touch the file.** Two consecutive runs → byte-identical
   bundles (P11 still holds).
3. Note in the report: `dock.data.js` now carries `timers.entries` and
   `lastSync` as **stored state** (not build-clock — P11 unaffected), so the
   `file://` page shows timers read-only even without the server.

### 4.3 UNIT 3 — `CG/baked/FIELDS.json` (EDIT)

Declare every new key the page reads. **No `usableAs: "price"` anywhere.**

**`.fields` additions (semantic, with labels):**

| field | usableAs | semantics | label |
|---|---|---|---|
| `lastSync` | `reference` | `DREW_SOURCED` | `LAST SYNC` |
| `bagScrub` | `reference` | `DREW_SOURCED` | `BAG SCRUB` |
| `skipCostPlat` | `reference` | `DREW_SOURCED` | `SKIP COST` |
| `endsAt` | `reference` | `DREW_SOURCED` | `ENDS AT` |

Each entry carries the standard `_doc` / `meaning` / `evidence` (status
`DREW_SOURCED`, source `Drew dictation via CG console`) like CG-001's
Drew-sourced entries. `lastSync`/`bagScrub` `_doc` must state: **never
derived, never guessed; null until Drew says a date.**

**`.structure` additions (`{ usableAs: "none", meaning: "…" }` each):**
`perItem` · `timer` · `id` · `label` · `notes` · `entries` *(if not already
declared)* · any other key the page actually reads off the `st.` / `it.`
accessors (P9's oracle will name them — declare until P9 is green).

**`_doc_count`:** recount to the new measured truth (the string must match
the actual entry counts — CG-001's report shows a wrong count was caught once).

### 4.4 UNIT 4 — `CG/dock.html` (EDIT) — the window's face

**Data flow contract (this exact naming keeps P9's read-audit green):**
- On load, **only when `location.protocol !== "file:"`**, fetch
  `GET /api/state` and keep the result in a variable named **`st`** (P9 scans
  accessors on `st`, `it`, and the CG-001 prefixes — use `st` for the state
  object and `it` for loop variables; do not invent new single-letter
  prefixes, and do not read fetched data through unscanned names).
- If the fetch succeeds: `st` **overrides** the bundle's `timers`/`lastSync`.
  If it fails or is `file://`: use the bundle values (they are baked and
  honest — absolute `endsAt` still counts down correctly).
- **Every fetch is behind the protocol guard.** `file://` must never call
  `fetch()` — that is the CG-001 file:// trap, still banned.

**A. TIMERS panel** (a new section near the top of the page):
- Per timer, one line: **`<label> · <countdown> · SKIP <n>p`** + REMOVE
  button. Countdown format `Dd HH:MM:SS`; at ≤ 0 render **`TIME UP`** (never
  COMPLETE/FINISHED — P17 bans those strings). If `skipCostPlat` is null,
  render the segment without a SKIP figure (never `0`, never a fake price).
- Countdown ticking: **one `setTimeout` chain only** (1000ms re-schedule while
  the page is open). **`setInterval`, `WebSocket`, `EventSource`, `requestAnimationFrame`
  remain banned.**
- Empty state: **`NO TIMERS — ADD ONE`**.
- Add form: text label · `datetime-local` · number skip-cost · notes · ADD
  button → `POST /api/timers` `{op:"add", …}`, then re-render from the
  response (or re-GET `/api/state`). **No `alert()`, no `prompt()`** — inline
  status text for errors (`Enter a label`, `Pick a time`, `Saved`).
- **file:// mode:** the panel renders timers from the bundle **read-only**
  (countdowns work — absolute times) and the line
  **`ADD/EDIT NEEDS THE CG WINDOW — run: node CG/console-server.js`**;
  forms hidden.
- Editing rules: labels and notes are **Drew's words — stored verbatim, never
  rewritten, scored, or parsed.** The server is the only writer of dock.json;
  the page never writes files.

**B. LAST SYNC:**
- **Global badge** in the page header:
  **`BAG SCRUB: <YYYY-MM-DD>`** or **`BAG SCRUB: NO SYNC RECORDED`**, plus a
  date input + Set/Clear (http only; display-only under file://).
- **GLANCE verdict block**, after the existing order (after FLAGS/MISSING —
  do not reorder CG-001's mandated sequence):
  **`LAST SYNC: <YYYY-MM-DD>`** or **`LAST SYNC: NO SYNC RECORDED`**, plus a
  date input + Set for the matched item (http only). Sets `perItem` keyed by
  the **exact dock item name**.
- **DEEP table:** one new column **`LAST SYNC (CG)`** appended after
  `YOUR MARKET READ`; value = date, or `—` when unset (an em-dash is the
  established null rendering for non-price cells; never `0`, never `INACCESSIBLE`
  — this is not a price). Header marked as CG-tracked, not an xlsx column.
- **All dates render exactly as stored. Never inferred from snapshot age,
  file mtime, or anything else.**

**C. Non-negotiables carried from CG-001:** snapshot age on every price;
`AVG (UNDOC)` labelling; `YOUR PLAN` first and largest; `[INACCESSIBLE]`
never `0`; no undercut claims; HAVE/MISSING never NEED; his words verbatim;
no external asset, no CDN; page still fully functional from `file://`
(double-click, no server, no internet) with a clear hint message if
`dock.data.js` is absent.

**D. P17-safe strings (the banned tokens must appear NOWHERE in dock.html —
strings, comments, or attributes):** `YOU NEED`, `REQUIRED`, `NEEDED`,
`COMPLETE`, `FINISHED`, `READY TO BUILD`. Use bare HTML5 `required`
attributes only if needed (unquoted), or validate in JS with safe messages
(`Enter a label`, `Pick a time`). Safe vocabulary for this leaf:
`SAVED`, `TIME UP`, `NO SYNC RECORDED`, `NO TIMERS — ADD ONE`, `SET`, `CLEAR`,
`REMOVE`, `ADD`, `SKIP`.

### 4.5 UNIT 5 — `CG/dock.test.js` (EDIT: two named deltas + L-block)

**Run the suite after each step. Only these existing-assertion edits are
authorized:**

**DELTA 1 — `I13` (line ~226, "re-importing an unchanged xlsx yields a
byte-identical dock.json").** The oracle's third compare
(`temp import == shipped dock.json`) becomes false the moment dock.json
carries state — which ruling H makes permanent and by design. Rework to:
1. keep temp-vs-temp byte identity (import determinism) — unchanged;
2. compare the fresh import against **`CG/derived/dock.seed.json`** instead of
   the shipped file;
3. add in the same assertion: the shipped `dock.json` **deep-equals the seed
   for every xlsx-owned top-level key** (`schemaVersion`, `velocityTiers`,
   `items`, `scratchpad`, `provenance`, `source` — the import product), so
   server writes can never quietly alter import-owned data. State keys
   (`timers`, `lastSync`) are expected to differ and are excluded.

**DELTA 2 — `I23` (line ~371, `if (dock.timers.entries.length !== 0) return
'a timer was seeded';`).** Real timers are now legal data — the count check
must become a **schema check**: every entry has non-empty string `id` and
`label`, parseable `endsAt`, `skipCostPlat` number ≥0 or null, `notes` string
or null; **no count requirement**. The conflicts half of I23 (exactly 4, all
OPEN) stays exactly as-is.

**NEW BLOCK — L1…L8 (add; new assertions are always allowed):**

| # | Assertion |
|---|---|
| L1 | `dock.html` carries a timers panel: `id="timers"`, the strings `NO TIMERS — ADD ONE` and `node CG/console-server.js`, and **no** `setInterval` / `EventSource` / `WebSocket` / `requestAnimationFrame` token |
| L2 | `LAST SYNC` renders in the GLANCE verdict and as the DEEP column header `LAST SYNC (CG)`; null text is exactly `NO SYNC RECORDED` (verdict/global) and `—` (DEEP cell) |
| L3 | bundle carries `lastSync` = `{ bagScrub: null, perItem: {} }` at first build and `timers.entries` is an array; the `_doc` of both matches CG-002's spec strings |
| L4 | `FIELDS.json` declares every new key the page reads (lastSync, bagScrub, perItem, timer fields, and any key P9 names), `_doc_count` matches measured counts, and **nothing new is `usableAs: "price"`** |
| L5 | every fetch call in `dock.html` sits behind a `location.protocol` guard containing the `file:` check; the literal `fetch(` never runs unguarded |
| L6 | countdown uses a `setTimeout` chain; the page contains no `setInterval` |
| L7 | the new UI strings avoid all P17 tokens (belt-and-braces; P17 itself must stay green) |
| L8 | `console-server.js` source contains **no** `child_process` spawn of opencode, no `/chat` route, no `require(` outside Node built-ins (`node:` / core modules) |

### 4.6 UNIT 6 — `CG/console.test.js` (CREATE)

Zero-dep, offline, **no arguments**. `node CG/console.test.js` — all green.
Sandtrap law: spawn the server with `stdio: ["ignore","pipe","pipe"]` +
`windowsHide`, parse the `CG-CONSOLE LISTENING` line for the port, and
**guarantee kill in `finally`** (mirror the proven `WASH/GHOST-HUB-00x.test.js`
server-harness pattern, or use `ED/00_ESSENCE_CORE/INFRA/spawn-safe.js` if it
fits — either way the child dies with the suite).

**Every test runs against a TEMP COPY of dock.json (`--dock <temp>`), never
the real master.** Assertions:

| # | Assertion |
|---|---|
| C1 | boots with `--port 0` on 127.0.0.1; prints the exact LISTENING line; chosen port parsed |
| C2 | `GET /` → 200 `text/html`, body is `dock.html` |
| C3 | allowlisted statics 200 with correct types; **`/derived/dock.json`, `/console-server.js`, `/../AGENTS.md`, `/..%2f..%2fAGENTS.md` → 404** (no traversal, no source leak) |
| C4 | `GET /api/state` → `{ timers: {entries: array}, lastSync: {bagScrub, perItem} }`, `Cache-Control: no-store` |
| C5 | add timer → 200 with `id`; GET reflects it; **persists** (fresh process boot on the same temp file still shows it) |
| C6 | add validation: empty label / unparseable endsAt / negative skipCost / >32KB body / invalid JSON → **400**, nothing written |
| C7 | edit unknown id / remove unknown id → **404**; unknown op → **400** |
| C8 | remove timer → 200; GET reflects removal; persistence verified |
| C9 | `setBag` valid date → 200; `setItem` known item → 200; `setItem` unknown item → **400**; bad date format → **400**; `clearBag`/`clearItem` → null/removed |
| C10 | **the real `CG/derived/dock.json` hash is byte-identical before and after the entire run** (temp-copy isolation proven) |
| C11 | `--init` on a temp copy without `lastSync` adds exactly the spec block; second `--init` byte-identical no-op; no other key changed (deep-compare all other keys) |
| C12 | only `127.0.0.1` is bound (server config/source assert `127.0.0.1`, never `0.0.0.0`) |
| C13 | `POST` to unknown path → 404; wrong method on API paths → 405 |
| C14 | server writes only the `--dock` file: temp-dir file listing unchanged except dock.json (no `.tmp` residue after atomic rename) |
| C15 | no network egress in `console-server.js` (no `http.request`, no `fetch`, no `dns`) |

### 4.7 UNIT 7 — diagnostics (all must pass; run in this order)

1. `node --check CG/console-server.js` · `node --check CG/dock.html`'s inline
   script extracted (CG-001 pattern) · `node --check CG/console.test.js`
2. `node CG/dock.test.js` → **54/54** (52 with two deltas + 8 new L → count
   the real total; report the exact number, never a guessed one)
3. `node CG/console.test.js` → **15/15**
4. Both suites again, back-to-back → green both times (stability)
5. `node CG/build-dock.js` ×2 → byte-identical bundles; `dock.seed.json`
   hash unchanged
6. Re-check locked inputs: xlsx `11030` / mtime unchanged · probe snapshots +
   `api-surface.md` + `probe.js` hashes unchanged · **all `WASH/**` mtimes
   unchanged** · seed file written once at Unit 0, untouched since
7. Bare-import guard sanity (safe check): `node CG/import-xlsx.js` with NO
   `--out` is **NOT RUN** in this leaf (it would correctly exit 2 now) — note
   this in the report instead
8. `git status --short` → same pre-existing dirty set, **nothing staged**

**Manual gate for Drew (after the suite is green):**
- `node CG/console-server.js` → open the printed URL → dock renders, timers
  panel live, add a timer, reload, it persists.
- Double-click `CG/dock.html` → file:// render still works; timers read-only;
  hint line present.

---

## 5. DEFINITION OF DONE

1. All diagnostics in Unit 7 green, exact counts reported (no rounding, no
   "should be").
2. Drew's manual gate passed (or, if he has not run it yet, the report says
   so plainly — **render unverified** is an honest state, CG-001's §9 precedent).
3. Locked inputs byte-identical; WASH untouched; xlsx untouched; seed frozen.
4. VCS clean state = unchanged dirty set, nothing staged, no commit.
5. `CG/CG-002_REPORT.md` planted with: what was built, measured counts, the
   two deltas documented, **every finding reported not bent**, diagnostics
   table, NOT-done list, open questions for Drew.
6. **HALT.** No CG-003 work, no chat, no probe run, no adjacent fixes without
   a fresh package.

---

## 6. FINDINGS PROTOCOL

The two named deltas (I13, I23) are the ONLY existing-assertion edits
authorized. **Any other suite failure = STOP + report**, with the failing
assertion, the measured value, and why the package's premise did not
reproduce. Never edit an expectation to make it green. The `dock.test.js`
suite already contains precedent for honest NOT REPRODUCIBLE findings (I22) —
follow it.

## 7. NOT DONE (stated in the report)

No chat / no `/chat` · no probe re-run · no value refresh (CG-003) · no
memory bank (CG-004) · no Electron wrapper · no timer seeded by DOER (**Drew
adds his own Wisp foundry timer through the panel — DOER seeds zero timers;
zero date/label invention**) · no `lastSync` dates seeded (CG-003) · no hub
entry · no canonical doc updates · no commit.
