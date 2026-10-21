# TIMEKEEPER-001 — STUDIO TIME TRACKING (TASK PACKAGE)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Purpose:** Drew's directive (2026-09-20): *"more accurate time tracking within
> the system, hourly and minute based tracking so we actually know what we spend
> time on, and how much we spend on it."*
> Scope: ONE new file. Nothing else touched. No operating-core edit.

---

## 1. What this leaf creates

A TIME register at the chamber of receipts:
`ED/02_THE_LOGS/06_THE_LEDGER/TIMEKEEPER.md`

- **Minute-based precision** in every entry (`Start` / `End` HH:MM, `Min`).
- **Hourly rollup** in the monthly totals (`Hrs`, 1 decimal).
- Append-only. The seat that does the work stamps its own entry at report
  time (own records — same rule as the ledger).
- Convention text lives in the file header (like the Ledger `README.md`),
  so no `01_OPERATING_CORE.md` edit is needed.

## 2. Mandatory pre-reads

1. `ED/02_THE_LOGS/06_THE_LEDGER/README.md` — the chamber charter (receipts
   are per-seat, sorted by date; agents write their own records).
2. Confirm `TIMEKEEPER.md` does NOT already exist (it should not).

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 1 — Create `ED/02_THE_LOGS/06_THE_LEDGER/TIMEKEEPER.md`

Exact structure (use this; you may tidy whitespace but keep every section):

```markdown
# TIMEKEEPER — Studio Time Register

> Chamber of the studio's actual time spend (per Drew, 2026-09-20).
> Minute-precision entries, hourly rollups. Append-only: the seat that did
> the work stamps its own entry at report time. Never invent clock times —
> if a session's clock times are not recorded, mark them `[not recorded]`
> rather than guessing (masquerade is forbidden).

## Convention

1. At session boot, the opening seat notes `Start` (HH:MM) in its report.
2. At session close, the closing seat notes `End` (HH:MM) and appends a row
   to this register for each unit/leaf it executed.
3. `Min` = exact minutes for the unit. `Hrs` = minutes ÷ 60 (1 decimal).
4. Monthly rollup: at the month's end, append `## ROLLUP YYYY-MM` totals by
   activity (sum Min, sum Hrs). Rollup is the only place hours lead.

## Register

| Date | Start | End | Min | Hrs | Seat(s) | Activity / Leaf |
|---|---|---|---|---|---|---|
| (rows appended below) |

## ROLLUP 2026-09

| Activity / Leaf | Total Min | Total Hrs |
|---|---|---|
| (totals) |
```

### Unit 2 — Seed today's honest entries ONLY

Append rows for the **2026-09-20** sessions actually executed, with no
invented minutes:

- The ENSHRINE-001 enshrinement + review + COURRIER ferry that closed it:
  clock times are `[not recorded]`; leave Min/Hrs as `—` and put the seat
  row(s) in. One row: `2026-09-20 | [not recorded] | [not recorded] | — | — | 0-Wake, 1-Stone, B-Bolt | ENSHRINE-001 enshrinement + ferry`.
- Do NOT add a rollup total row that implies hours that were never measured.
  If you keep the `## ROLLUP 2026-09` section, mark totals as `[not recorded]`.

No other rows. No past sessions (no invented times).

### Unit 3 — Verification

1. `TIMEKEEPER.md` exists at `ED/02_THE_LOGS/06_THE_LEDGER/` — PASS/FAIL.
2. File contains: `## Register`, `## Convention`, and the 2026-09-20 seeded
   row — PASS/FAIL.
3. `Min`-ticked entries contain NO invented numeric times — PASS/FAIL
   (inspect the seeded rows by eye).
4. `git status` shows the ONLY working-tree change from this leaf is the new
   file `ED/02_THE_LOGS/06_THE_LEDGER/TIMEKEEPER.md` — PASS/FAIL (note if
   other pre-existing dirty paths exist; cite them, don't touch them).

### Unit 4 — Report + HALT

1. Plant `TIMEKEEPER-001_REPORT.md` next to this task file — unit-by-unit
   results, verification table, honest NOT-DONE list.
2. HALT. Do NOT touch the Captain's Log, operating core, Bible, MILESTONES,
   or any other file.

---

## 4. Definition of Done (DoD)

1. `TIMEKEEPER.md` created with exact structure.
2. Seeded entries are honest — zero invented clock times.
3. Verification gates green (or honestly reported).
4. Report planted; no residue; HALT.

## 5. Guardrails

- Touch ONLY the one new file. No game code, no seat/config files, no Pad,
  no core docs, no Captain's Log.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); do NOT improvise adjacent fixes.
- Masquerade is forbidden: never state a time that was not actually
  measured.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone)
window at this file to execute. Executor: restate scope, run, HALT at every
unit gate.