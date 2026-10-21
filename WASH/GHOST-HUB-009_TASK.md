# GHOST-HUB-009 — SHADOW SEAT EMISSION + GRAVEYARD READ + CALENDAR DATA (TASK PACKAGE)

**Leaf:** GHOST-HUB-009 · **Executor:** STONE (DOER, build lane) · **Plant:** PLANNER (0-Wake)
**Rulings:** all four approved by DREW 2026-09-21 (1✓ route V-D-002, 2✓ shadow mech +
intentional test deltas, 3a✓ live-read `LEGACY/Graveyard`, 4✓ calendar Goals +
Accomplishments now / Time-spent honest-empty until TIMEKEEPER-001)
**VCS HOLD:** do NOT commit. Do NOT restart the live server unless the package requires it
(the server reads `hub-server.js` — a restart IS required for server changes; see Unit 表面).

---

## 0. MANDATE — why this package exists

Drew wants the hub to carry three real surfaces that currently have NO data path:

1. **SHADOW COUNCIL** — hidden **bottom** section of the agent roster. Currently the
   server *hard-excludes* the entire shadow section (buildState skips
   `section === "shadow"` → `/state.shadow` is always `[]`), and tests
   GHOST-HUB-002/-003/-004 **assert `shadow=[]`** + "hub must NOT contain
   SHADOW COUNCIL". **This REVERSES the GHOST-HUB-003 ruling of 2026-09-20.**
   Drew approved the reversal (#2). Shadow agents ALREADY exist as dormant records
   in `hub-agents.json` (`shadow-auditor`, `timelord`, `section: "shadow"`).
2. **GRAVEYARD** — live-read of the local graveyard mirror. Drew chose **(a) live-read**
   the `LEGACY/Graveyard` tree, not a static V-D panel copy.
3. **CALENDAR** — GOALS (MILESTONES registry — already parsed server-side as
   `majorMilestones`), ACCOMPLISHMENTS (ledger seals + captain's log — already
   computed as `seals`/`level`), TIME-SPENT (**NO DATA SOURCE** — TIMEKEEPER.md does
   not exist, TIMEKEEPER-001 never executed). Per ruling #4, ship Goals +
   Accomplishments now; render Time-spent as honest-empty (e.g. `[]` fields or an
   `NA` marker + `"no TIMEKEEPER data yet"` note). **Do NOT fabricate time data.**

---

## 1. MICRO-TASK SCOPE LOCK (only these named targets)

| # | Target | Kind | Delta |
|---|---|---|---|
| M1 | `WASH/hub-server.js` | EDIT | Emit shadow seats from `/state`; add `/graveyard` + calendar data to buildState; honor "no shadow in council/roster, only in a true `.shadow` array" |
| M2 | `WASH/GHOST-HUB-002.test.js` | EDIT (intentional delta) | Reverse the `shadow=[]` + "no SHADOW COUNCIL" assertions — shadow now CARRIES the dormant shadow seats |
| M3 | `WASH/GHOST-HUB-003.test.js` | EDIT (intentional delta) | Same reversal, aligned to 009 contract |
| M4 | `WASH/GHOST-HUB-004.test.js` | EDIT (intentional delta) | Same reversal (T5 `/state` regression) |
| M5 | `WASH/hub.html` | EDIT | Roster bottom: render a **hidden/collapsed** SHADOW COUNCIL section fed by `/state.shadow` (V-D-003 owns the styling; 009 only supplies the data lane + minimal structural hook) |

**Locked out (NOT this leaf, do NOT touch):** `V-D-002_VISUAL-BUILD_TASK.md`,
`V-D.md` icon/glyph files, hub icons, ED/00_ESSENCE_CORE, ED/01_THE_DESIGNS,
PARKED/BROKEN categories, `LEGACY/Graveyard` writes (read-only). Zero build beyond
the named targets.

---

## 2. CONTRACT — GROUND TRUTH (verify first, then build)

- `/state` keys today: `ok, council, specters, shadow, roster, tkManifest,
  serverTime, port` (+ `CtR`, `UT` etc. per topology). `shadow` must remain an array
  (was `[]`).
- Shadow seats exist in `hub-agents.json`: `shadow-auditor` (SHADOW AUDITOR,
  Shadow Council), `timelord` (TIMELORD, Shadow Council), both `section: "shadow"`,
  `status: "dormant"`.
- Graveyard mirror on disk at `C:\Users\Andrew\Projects\LEGACY\Graveyard\`
  (`Tombstones\` + `Purgatory\`, e.g. `00_2026-09-17_LOCKDOWN_PURGES.md`).
  **Read-only.**
- Calendar data sources:
  - GOALS → `ED/01_THE_DESIGNS/MILESTONES.md` (parseMajorMilestones already
    reads it server-side → `majorMilestones`).
  - ACCOMPLISHMENTS → ledger seals per seat (`seals`/`level` already in
    buildState) + Captain's Log entries.
  - TIME-SPENT → **absent.** Render empty/NA + honest note. NO TIMEKEEPER source.

---

## 3. UNIT 1 — SERVER: emit shadow + graveyard + calendar (`hub-server.js`)

1. **Stop hard-excluding shadow.** Find the `buildState()` shadow-skip (the
   `if (... self.section === "shadow") continue;` / "no shadow rows" carve-out).
   Change so `/state.shadow` becomes an **array of the shadow-section seats**
   (shadow-auditor + timelord) with their ground-truth fields (id, displayName,
   role, tagline, status: "dormant"). Keep them OUT of `council`, OUT of `roster`
   (specter/roster rows) — they live ONLY in the `.shadow` array. Minor: update the
   header/broken comment that still says shadow is "hidden by design".
2. **Add `/graveyard` endpoint** — live-read `LEGACY/Graveyard/Tombstones/*` (+
   note Purgatory/ exists) and return a JSON list: `{ tombstones: [ {file, title,
   date, summary} ] }`. Parse the markdown first-line (H1) as title + date from the
   filename (pattern `00_YYYY-MM-DD_*.md`). If the dir is missing, return
   `{ tombstones: [], note: "no graveyard mirror present" }` — never throw.
3. **Calendar data in `/state`:** add a top-level `calendar` object:
   `{ goals: [ {id, title, status} ], accomplishments: [ {seat, title} ],
   timeSpent: [] }` — goals from `majorMilestones`, accomplishments from seals,
   timeSpent **always `[]`** + carry `timeSpentNote: "no TIMEKEEPER data yet
   (TIMEKEEPER-001 not executed)"`.
4. Index new endpoints in any route table / README if the repo keeps one (light).

---

## 4. UNIT 2 — INTENTIONAL TEST DELTAS (this is a RULING REVERSAL, not a regression)

The GHOST-HUB-003 ruling ("shadow hidden, `/state.shadow = []`, hub must NOT contain
SHADOW COUNCIL") is deliberately reversed by Drew (#2). Update the THREE suites that
assert the old contract:

- **GHOST-HUB-002.test.js:** change `assert.equal(state.shadow.length, 0)` and
  "shadow must be an empty array" → assert shadow carries BOTH
  `shadow-auditor` + `timelord`; change the "no SHADOW COUNCIL in hub.html" check →
  allow a collapsed SHADOW COUNCIL bottom section; keep council/roster exclusion
  (`shadow-auditor` NOT in roster/council rows) — that part of GHOST-HUB-003
  remains true.
- **GHOST-HUB-003.test.js:** same reversal (T2 `/state.shadow`; the "roster must
  exclude SHADOW AUDITOR / TIMELORD" assertion stays — they must be in `.shadow`,
  not in roster rows).
- **GHOST-HUB-004.test.js:** reverse T5 `/state` regression (`shadow` non-empty,
  still absent from council/roster).
- Keep ALL multi-suite "ground truth" invariants that are NOT about hiding:
  council order wash/0-wake/1-stone/x-xp, Bolt off council, roster seals, CtR/UT.

Add new assertions for `/graveyard` (returns array, never throws, contains the
LOCKDOWN_PURGES tombstone) and `/state.calendar` (goals non-empty, accommodations
array present, timeSpent = [] + note present) if a new test file is warranted —
prefer folding into existing suites to avoid leaf sprawl.

---

## 5. DEFINITION OF DONE (all must pass)

- [ ] `node --test` (or repo test runner) — ALL suites green: GHOST-HUB-001→009
      passing (001 known-seal-gate leaf excepted), including the reversed shadow
      assertions and new graveyard+calendar assertions.
- [ ] `GET /state` (live or unit-attached) → `shadow` = [shadow-auditor, timelord];
      `calendar.goals` populated; `calendar.accomplishments` array; `calendar.timeSpent = []`
      with truth note; `calendar` absent of fabricated data.
- [ ] `GET /graveyard` → tombstones list incl. LOCKDOWN_PURGES tombstone; never 500.
- [ ] `hub.html` roster bottom has the SHADOW COUNCIL collapsed section reading
      from `/state.shadow` (structural hook only; V-D-003 owns styling).
- [ ] VCS HOLD respected — no commit.

---

## 6. HALT & REPORT

Report alongside the task here (`GHOST-HUB-009_REPORT.md`): list each delta with the
exact before/after line, quote the reversed assertion, note any test that had to
change beyond the named three, and state explicitly what is NOT done (V-D-002 visual
build, V-D icon work, ED/CORE edits). Then HALT for Drew to route V-D-003.

Powered by the box. Zero discretion. Scope-locked to the six rows in §1.
