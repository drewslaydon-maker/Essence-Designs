# CG-002-A — CRAFT MODEL GENERALIZATION (micro-toss 1 of the CG-002 reset)

- Date: 2026-10-06
- Planner: 0-Wake (PLANNER seat)
- Builder: 1-Stone (DOER seat) — the only seat that builds
- Status: PLANTED — awaiting Drew to point the DO window at this file
- Supersedes: the monolithic CG-002 plan (banner added to CG-002_TASK.md in Unit 0)

## Why this toss exists

Drew's ruling (2026-10-06): Corufell Prime's craft is **4+1 BP**
(Blueprint + 4 parts: Blade, Handle, Receiver, Stock), not the typical 3+1 BP
that the whole CG-001 model assumes. The page is honest today — it shows
`Blade [INACCESSIBLE]` and `Stock PART LIST CONFLICT` — but the *model* is
wrong: exactly one part slot is missing and the feed-only Stock is not counted
in partsSum. Loot logging (next toss) writes into part slots; slots must be
true before any loot can be logged. **Craft model fix first.**

## Scope lock (targets ONLY)

Touched:
1. `CG/drew/CRAFT_OVERRIDES.json` (NEW — Drew-sourced craft override table)
2. `CG/import-xlsx.js`
3. `CG/derived/dock.json` (regenerated via `--force`; divergent on purpose)
4. `CG/dock.data.js` + `CG/relics.data.js` (regenerated via `build-dock.js`)
5. `CG/dock.html` (DEEP table: fixed 3-part columns -> dynamic N-part columns)
6. `CG/dock.test.js` (oracle updates traceable to the craft ruling)
7. `CG/CG-002_TASK.md` + `CG/CG-002_RESUME.md` (add SUPERSEDED banner ONLY)

FORBIDDEN (unless a later tossed package names them):
- `CG/baked/FIELDS.json` — _doc_count (24+58=82) is CG-002's open finding F1; **NOT this toss**. Do not touch.
- probe files, xlsx, `console-server.js`, `console.test.js`
- CG-003 (market refresh), CG-004 (memory bank), CG-005 (chat)
- No git commands. No adjacent fixes. No `/chat`. No web calls.

## The model change (exact)

- Generalize the importer's part reading from a fixed 3 part-cell scan to:
  - Default: keep the exact CG-001 behavior — read the 3 part cells (columns E/F, G/H, I/J) verbatim, `N/A` preserved.
  - Override: if `craft-overrides.json` names the item, its `parts` list is authoritative for the SLOT LIST; xlsx qty is used where a cell exists, `null` where the part has no cell.
- Corufell Prime override (Drew's word, 2026-10-06):
  - parts: `["Blade", "Handle", "Receiver", "Stock"]`, slot 4 = Stock.
  - Stock qty: NOT in the xlsx -> qty `null`, `have` `false` (Drew hasn't owned it yet; he's grinding it).
- Resulting Corufell segments (5 slots): `BP/Main`, `Blade`, `Handle`, `Receiver`, `Stock`.
- Resulting Corufell partsSum (must match EXACTLY):
  - `value` = 6.3 (BP/Main) + 6.9 (Handle) + 24.1 (Receiver) + 7.9 (Stock) = **45.2**
  - `pricedSegments` = **4**, `totalSegments` = **5**, `complete` = **false** (Blade has no feed row -> [INACCESSIBLE])
- `segmentCoverage` rollup changes: pricedSegments 115 -> **116**, totalSegments 122 -> **123**, pct 116/123 = **94.3**.
- The Corufell `PART_LIST_CONFLICT` entry is RESOLVED by Drew's ruling. Carry it forward with `status: "RESOLVED — DREW 2026-10-06 (4+1 BP)"` and a note that Stock is now a counted slot. Do NOT silently delete history.
- `missing[]` for Corufell: `["BP/Main", "Blade", "Receiver", "Stock"]` (Handle is had).

## Unit 0 — reset banner (no build)

- Read `CG/CG-002_TASK.md` and `CG/CG-002_RESUME.md`.
- At the very top of each, insert ONE line:
  `> SUPERSEDED 2026-10-06 — CG-002 reset: split into CG-002-A (craft model), CG-002-B (loot log), CG-002-C (timers). This file is historical; do not execute.`
- Also record the same banner in `CG/CG-002_REPORT.md` if that file appears (it does not exist today; if it appears, banner it, else skip silently).
- Capture baseline hashes of the three artifacts you will regenerate: `dock.json`, `dock.data.js`, `relics.data.js` (record in the report).
- Do NOT regenerate anything in Unit 0.

## Unit 1 — override table (NEW file, Drew-sourced)

Create `CG/drew/CRAFT_OVERRIDES.json`:

```json
{
  "_doc": "DREW_SOURCED craft overrides. Drew 2026-10-06: Corufell Prime craft is 4+1 BP (Blade, Handle, Receiver, Stock) rather than the typical 3+1 BP of every other docked set.",
  "Corufell Prime": {
    "parts": ["Blade", "Handle", "Receiver", "Stock"],
    "slot4": {
      "name": "Stock",
      "xlsxCell": null,
      "note": "Stock is absent from the xlsx. qty null / have false until Drew logs a pickup (CG-002-B) or updates the sheet."
    }
  }
}
```

Constraints: table holds ONLY Corufell Prime. No inferred entries for other items.

## Unit 2 — importer generalization (`CG/import-xlsx.js`)

- Add a read of `CG/drew/CRAFT_OVERRIDES.json` (keep the "READS/WRITES" header comment truthful: it now also reads the drew override table; it still writes only `dock.json`).
- Slot list builder (currently `segmentSlots` loop over `item.parts`): unchanged in spirit — still `['BP/Main', ...part names != N/A]`. The change is that `item.parts` can now be 4 entries when the override says so.
- Part/qty reading: keep columns E/F, G/H, I/J for xlsx parts (CG-001 exact behavior). When the override adds a 4th part with no cell, push `{ slot: 4, name: 'Stock', qty: null }` and the existing `have`/`missing`/`partsSum` arithmetic handles it (qty null -> have false).
- Overflow safety: validate the override list — at least 1 name, max 8 names, no duplicates; refuse loudly if violated. (8 is a cap, not a feature; no item uses it. Zero invention.)
- Re-import guard keeps working: after the first `--force` regen, a bare re-import must be byte-identical and exit 0.
- Do NOT touch `timers`/`lastSync`/`inventory`/`lifecycle` blocks.

## Unit 3 — regenerate derived + baked

Commands (in this order, from repo root):
- `node CG/import-xlsx.js --force`               (expected: DIVERGENT -> replaced)
- `node CG/import-xlsx.js`                       (expected: byte-identical, exit 0)
- `node CG/build-dock.js`                        (regenerates `dock.data.js` + `relics.data.js`)
- `node --check CG/import-xlsx.js CG/dock.html CG/dock.test.js`  (syntax gate; html gives no output, ok)

## Unit 4 — page generalization (`CG/dock.html`)

- DEEP table (currently `COLS` + `rowVals` with hardcoded `p1/q1 … p3/q3`):
  - Build the part name/qty columns dynamically from the page's own data — for each item row, render ALL of its parts (name + qty). Corufell gets Stock as its 4th part pair; every other set keeps its CG-001 layout.
  - Maintain the existing 15th "YOUR MARKET READ" column and all static columns/sort/filter behavior. Part columns are display + filterable; sorting keeps static keys only.
- SEGMENTS block / GLANCE verdict: logic already iterates `it.segments` and `it.partsSum` dynamically — verify no hardcoded 3 anywhere else in the HTML/JS; if you find one, generalize it the same way.
- The page must still open from `file://` with zero server.

## Unit 5 — tests (`CG/dock.test.js`)

- Update ONLY oracles whose expectation changed because of the craft ruling. Every update gets an inline comment: `// CRAFT RULING 2026-10-06: Corufell 4+1 BP`.
  - segmentCoverage: 115/122 -> **116/123** (pct still 94.3)
  - Any other count that shifts (search the file for 122/115/94.3 and re-derive from the regenerated `dock.json`).
- ADD new oracles:
  - Corufell `parts.length === 4` and slot 4 name `Stock`.
  - Corufell `segments` includes `Stock` with `feedAvg === 7.9`, `have === false`.
  - Corufell `partsSum`: `value === 45.2`, `pricedSegments === 4`, `totalSegments === 5`, `complete === false`.
  - Corufell `missing` includes `Stock`.
  - `PART_LIST_CONFLICT` Corufell entry `status` contains `RESOLVED`.
  - The 34 other items still have exactly 3 parts (regression oracle).
- Pass/fail rule: a failing oracle is a FINDING to report — never bend the test to match. If the measured dock.json disagrees with this package, STOP, report, and return to Drew before editing anything else.

## Definition of done

1. `node CG/dock.test.js` — all assertions green (52 baseline +/- additions, none silently removed).
2. Corufell renders in the DEEP table with 4 part pairs incl. **Stock**, and in SEGMENTS as 5 slots with `Stock` AVG 7.9 and counted in PARTS SUM (45.2, 4 of 5).
3. `Blade` still renders `[INACCESSIBLE]` with its reason — never a fabricated number.
4. The 34 other items render byte-for-byte the same as the CG-001 seal (verified by a regression oracle + your own diff read of the page).
5. `CG/drew/CRAFT_OVERRIDES.json` exists with ONLY the Corufell entry.
6. No FORBIDDEN paths were touched.

## HALT — report

Plant `CG/CG-002-A_REPORT.md` next to this file, in this format:
- What was done (each unit), what was NOT done.
- Command outputs for the four Unit 3 commands.
- Exact before/after for `segmentCoverage` + Corufell partsSum.
- Any findings, unexpected divergence, or refusal (state it plainly — masquerade is forbidden).
Then STOP. Do not start CG-002-B. Flag Drew: "point DOER at CG-002-A_REPORT.md".