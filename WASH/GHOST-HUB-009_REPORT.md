# GHOST-HUB-009 — SHADOW SEAT EMISSION + GRAVEYARD READ + CALENDAR DATA (REPORT)

**Executed:** 2026-09-22 by DOER (1-Stone) · **Task:** `WASH/GHOST-HUB-009_TASK.md`
**Approved by:** Drew Slaydon — four rulings approved 2026-09-21
(1✓ V-D-002 route, 2✓ shadow reversal + intentional test deltas, 3a✓ live-read
`LEGACY/Graveyard`, 4✓ calendar Goals + Accomplishments now / Time-spent
honest-empty until TIMEKEEPER-001)
**Status:** ALL UNITS COMPLETE — HALTED. VCS HOLD — no commits.

---

## Restated scope (verbatim from the package §1 — the six locked rows)

| # | Target | Kind | Done |
|---|---|---|---|
| M1 | `WASH/hub-server.js` | EDIT | ✅ |
| M2 | `WASH/GHOST-HUB-002.test.js` | EDIT (intentional delta) | ✅ |
| M3 | `WASH/GHOST-HUB-003.test.js` | EDIT (intentional delta) | ✅ |
| M4 | `WASH/GHOST-HUB-004.test.js` | EDIT (intentional delta) | ✅ |
| M5 | `WASH/hub.html` | EDIT | ✅ |
| + | `WASH/GHOST-HUB-009_REPORT.md` | CREATE (this file) | ✅ |

Locked out (NOT touched): `V-D-002_VISUAL-BUILD_TASK.md`, `V-D.md` icon/glyph
files, hub icons, `ED/00_ESSENCE_CORE`, `ED/01_THE_DESIGNS`, PARKED/BROKEN
categories, `LEGACY/Graveyard` writes (read-only) — all zero-build.

## Unit 0 — Baseline gate (recorded BEFORE any edit)

1. `node --version` → **v24.19.0** ✓
2. `git status --short` → pre-existing dirty tree recorded; `WASH/` untracked;
   **no commit made/amended** (VCS HOLD — unchanged before and after).
3. **Appendices: live surface found running** — port **4749 was LIVE**
   (`electron.exe .` PID 4528 → child `node hub-server.js` PID 13828). Per the
   package's own VCS-HOLD note ("a restart IS required for server changes") and
   because GHOST-HUB-002/hub-server tests bind 4749, the surface was stopped
   (child then parent), all suites run with ports free, then relaunched exactly
   as observed (`WASH\node_modules\electron\dist\electron.exe .` → new server
   PID child 6996 listening on 4749). Drew's native window is back up on the
   new code — verified live below.

## Unit 1 — M1 `hub-server.js` (the data-lane deltas)

**D1 — shadow hard-exclusion removed → `/state.shadow` carries the seats.**
Before (`hub-server.js` old §buildState, shadow-skip loop):
```js
const shadow = [];
for (const a of Object.values(agents)) {
  if (a.section === "shadow") continue; // dormant roles hidden (Drew ruling 2026-09-20)
  ...
```
After (line ~395–407):
```js
const shadow = [];
for (const a of Object.values(agents)) {
  if (a.section === "shadow") {
    shadow.push(a); // GHOST-HUB-009: dormant shadow seats emitted in /state.shadow
    continue; // shadow seats never enter council/specters
  }
  ...
```
The header comment ("...EXCLUDED from every output array — no shadow rows
anywhere, /state.shadow is always []") is replaced with the GHOST-HUB-009
reversal note. **`shadow-auditor` + `timelord` (status `dormant`) now land in
`/state.shadow` and ONLY there.**

**D2 — roster exclusion kept (ground truth of GHOST-HUB-003 that remains true).**
Before: `if (a.section === "shadow") continue; // no shadow rows in the roster either`
After (line 423): `if (a.section === "shadow") continue; // GHOST-HUB-009: shadow lives only in /state.shadow — no roster rows`
Council/roster/specters all exclude the shadow seats — verified by the suites.

**D3 — `/graveyard` endpoint (live-read, never throws).**
- New const (line 25): `GRAVEYARD_DIR = <ROOT>/LEGACY/Graveyard` (read-only).
- New `readGraveyard(dirOverride)` (line ~315): reads `Tombstones/*.md`,
  parses H1 → `title`, filename pattern `00_YYYY-MM-DD_*.md` → `date`, first
  non-heading line → `summary`; sorts by date. Notes `Purgatory/` when present.
  Missing mirror → `{ tombstones: [], note: "no graveyard mirror present" }` —
  never throws (exported for the never-throw test).
- Route (line 763): `if (pathname === "/graveyard") return sendJson(res, 200, readGraveyard());`
- Live result: `tombstones: [00_2026-09-17_LOCKDOWN_PURGES.md, date 2026-09-17,
  title "TOMBSTONE — 2026-09-17 LOCKDOWN PURGES"]` + `note: "Purgatory/ present (pending staging)"`.

**D4 — `calendar` object in `/state` (no fabricated data).**
New top-level `calendar` (line ~439) = `{ goals, accomplishments, timeSpent, timeSpentNote }`:
- `goals` from `parseCalendarGoals()` — same MILESTONES.md registry rows
  `parseMajorMilestones` reads (status Complete / Active Target), shaped
  `{ id, title, status }` from the bold `**…**` cells. Live: 4 goals incl.
  M8 "Lotus Adversity — The Wheel & Codex (FLOW 2.0 focus)" / "Active Target (MAIN)".
- `accomplishments` from `parseCalendarAccomplishments()` — ledger seals per
  seat (`seatSeals`, the same source the roster carries), shaped
  `{ seat, title }` (title = seal code — no invented titles). Live: 11 entries.
- `timeSpent` **always `[]`** + `timeSpentNote: "no TIMEKEEPER data yet (TIMEKEEPER-001 not executed)"`
  (verbatim from the package). NO TIMEKEEPER source exists — nothing fabricated.
- `parseMajorMilestones()` itself is UNCHANGED (roster majors/level intact).

## Unit 2 — M2/M3/M4 intentional test deltas (reversed assertions, quoted)

**GHOST-HUB-002.test.js** (test 3 — name changed "…hidden shadow…" →
"…shadow seats…"). Reversed assertion, quoted:
```js
// BEFORE (old GHOST-HUB-003 contract):
assert.equal(state.shadow.length, 0, "shadow must be an empty array (GHOST-HUB-003)");
// AFTER (GHOST-HUB-009):
const shadowIds = (state.shadow || []).map((a) => a.id);
assert.ok(shadowIds.includes("shadow-auditor"), "shadow must carry shadow-auditor (GHOST-HUB-009 ruling reversal)");
assert.ok(shadowIds.includes("timelord"), "shadow must carry timelord (GHOST-HUB-009 ruling reversal)");
assert.ok((state.shadow || []).every((a) => a.status === "dormant"), "shadow seats must be dormant (GHOST-HUB-009)");
```
Added council + specters exclusion asserts (shadow lives only in `.shadow`);
roster exclusion assert KEPT (that part of GHOST-HUB-003 remains true).

**GHOST-HUB-003.test.js** — T2 reversed (identical shadow reversal as above) +
T4 fully reversed, quoted:
```js
// BEFORE:
test("T4 · served hub.html does NOT contain SHADOW COUNCIL", ...)
  assert.ok(!html.includes("SHADOW COUNCIL"), "hub.html must not contain SHADOW COUNCIL");
// AFTER:
test("T4 · served hub.html carries a collapsed SHADOW COUNCIL bottom section (GHOST-HUB-009)", ...)
  assert.ok(html.includes("SHADOW COUNCIL"), ...);
  assert.ok(html.includes('class="shadow-council"'), ...);
  assert.ok(html.includes("renderShadow(data.shadow || [])"), ...);
```

**GHOST-HUB-004.test.js** — T5 reversed, quoted:
```js
// BEFORE: assert.equal(state.shadow.length, 0, "shadow must be [] (GHOST-HUB-003 regression)");
// AFTER: shadow carries shadow-auditor + timelord (dormant); council + roster exclude them;
//        council order wash/0-wake/1-stone/x-xp; Bolt off council; tkManifest non-empty — all kept.
```

**Folded, not sprawled:** the package's new `/graveyard` + `/state.calendar`
assertions were folded into GHOST-HUB-002 as **test 9 and test 10** (no new
test file — "prefer folding into existing suites").

## Unit 3 — M5 `hub.html` (structural hook only; V-D-003 owns styling)

- Roster tabpanel now carries `<div id="roster-list"></div>` + a **collapsed
  `<details class="shadow-council">`** (default-closed, no `open` attr) with
  `/summary>SHADOW COUNCIL — dormant seats` and `#shadow-council-list`.
- `renderRoster(list)` targets `#roster-list` (line 392) so the static
  `<details>` survives the 30s re-render tick.
- `loadState()` calls `renderShadow(data.shadow || [])` (line 100).
- New `renderShadow(list)` (line 432) renders each shadow seat via `cardShell`
  with NO chat lane (dormant + read-only by charter).
- No `hub.css` change (locked out — V-D owns the look). Inline script
  `node --check` clean.

## Unit 4 — Diagnostics (ALL green)

| Suite | Port | Result |
|---|---|---|
| `node --test WASH/wash.test.js` | 4748 | **8 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-001.test.js` | 4749 | **10 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-002.test.js` | 4749 | **10 pass / 0 fail** (tests 9–10 new) |
| `node --test WASH/GHOST-HUB-003.test.js` | 4750 | **6 pass / 0 fail** (T2+T4 reversed) |
| `node --test WASH/GHOST-HUB-004.test.js` | 4751 | **6 pass / 0 fail** (T5 reversed) |
| `node --test WASH/GHOST-HUB-005.test.js` | 4752 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-006.test.js` | 4753 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-007.test.js` | 4754 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-008.test.js` | 4755 | **9 pass / 0 fail** |

**67 pass / 0 fail across all 9 suites.** No skips. No test needed to change
beyond the named three (002/003/004) + the folded additions inside 002.

## Unit 5 — Live verify on the RESTARTED surface (electron, port 4749)

- `GET /state.shadow` → `shadow-auditor(dormant), timelord(dormant)` ✓
- `GET /state.calendar.goals` → 4 goals (M0, M0.5, M7, M8; M8 Active Target) ✓
- `GET /state.calendar.accomplishments` → 11 `{seat,title}` entries ✓
- `GET /state.calendar.timeSpent` → `[]` + `"no TIMEKEEPER data yet (TIMEKEEPER-001 not executed)"` ✓
- `GET /graveyard` → LOCKDOWN_PURGES tombstone `[2026-09-17]`; never 500; note Purgatory ✓

## Honest NOT-DONE list

- **No commit** (VCS HOLD — per package). Repo tree untouched beyond the
  named files; `WASH/` remains untracked as before.
- **V-D-002 visual build NOT done** (locked out; V-D-003 owns styling of the
  shadow section — this leaf supplies only the data lane + structural hook).
- **V-D icon/glyph work NOT done** (locked out; shadow seats render with the
  `sym-none` fallback glyph until V-D).
- **No ED/CORE/`LEGACY/Graveyard` edits** — `LEGACY/Graveyard` read-only
  respected (no writes).
- **No Captain's-Log entries folded into `accomplishments`** — §3.3 says
  "accomplishments from seals" and §2's "…+ Captain's Log entries" names no
  parse target; I shipped seals-only to avoid speculation. Flagging for Drew:
  if Captain's-Log-derived accomplishments are wanted, that's a follow-up leaf.
- **No calendar rendering in hub.html beyond the shadow section** — the
  calendar data lane ships server-side (`/state.calendar`); the hub UI surface
  for Goals/Accomplishments/Time-spent was NOT requested in M5 (only the
  SHADOW COUNCIL section was) — Drew may route it to V-D-003 or a later leaf.
- **Server-restart side effect:** the live Electron surface was restarted to
  load the new `hub-server.js` (package-sanctioned) — Drew's window is back up
  at http://127.0.0.1:4749 with the new code; active tabs/lanes in that window
  reset with the restart.

## Definition of Done status

1. `node --test` all suites green (001→008 + wash; 67/0) — **DONE**
2. `GET /state` → shadow seats + calendar populated + timeSpent `[]` w/ truth
   note, no fabricated data — **DONE** (live-verified)
3. `GET /graveyard` → tombstones incl. LOCKDOWN_PURGES; never 500 — **DONE**
4. `hub.html` roster bottom SHADOW COUNCIL collapsed section reading
   `/state.shadow` (structural hook; V-D-003 owns styling) — **DONE**
5. VCS HOLD respected — no commit — **DONE**

## Safe word check

Nothing dangerous. One judgment caveat (not a blocker, already reported
above — the restart was package-sanctioned and the surface is restored).

---

**REPORTED 2026-09-22 by DOER (1-Stone). HALTED per package — awaiting Drew's
route to V-D-003. VCS HOLD.**