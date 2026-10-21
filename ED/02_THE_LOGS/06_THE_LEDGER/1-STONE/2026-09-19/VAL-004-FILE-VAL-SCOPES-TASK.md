# VAL-004 — FILE THE VAL SCOPES OUT OF THE VAULT (DOER TASK PACKAGE)

> Planted by PLANNER (0-Wake) 2026-09-19, Drew-approved ("we can move the
> VALs because those dont belong in vault"). Executing seat: **DOER
> (1-Stone)** in the DOER window. Read this file, execute exactly, then
> halt. Turn no further pages.

## Boot

1. Read this file.
2. Read `AGENTS.md` + `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`.
3. Read the Pad: `ED/02_ESSENCE_PAD.md`.
4. Restate the scope below verbatim as your first report line, then execute.

## Scope — restate verbatim

"Restated VAL-004 scope: MOVE exactly two stale VAL planning docs out of
the vault staging folder into the receipt ledger under 0-WAKE/2026-09-19/,
byte-identical, verify the staging folder is empty afterward, report, halt."

## Why

`VAL-001-SCOPE.md` (VAL-001 is SEALED) and
`VAL-002-ROSTER-CODIFY-PROPOSAL.md` (ratified, exact strings now live) are
no longer in-flight references. The ledger README rule says the staging
folder keeps only in-flight references going forward. These are PLANNER
(0-Wake) planning artifacts — they belong in the 0-WAKE receipt chamber,
not the vault.

## Unit 1 — The moves (MOVE, not copy; edit nothing)

Move exactly these two files, byte-identical, from the vault staging folder
into the ledger under the PLANNER seat:

1. Source: `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001-SCOPE.md`
   Destination: `ED/02_THE_LOGS/06_THE_LEDGER/0-WAKE/2026-09-19/VAL-001-SCOPE.md`
2. Source: `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-002-ROSTER-CODIFY-PROPOSAL.md`
   Destination: `ED/02_THE_LOGS/06_THE_LEDGER/0-WAKE/2026-09-19/VAL-002-ROSTER-CODIFY-PROPOSAL.md`

- MOVE = Move-Item. The originals must NOT remain behind.
- Byte-identical: no content edits, no re-encoding, no line-ending changes.
- Keep the (now empty) `validation/` staging folder in place — do not delete
  it; do not create any new files inside it.

## Unit 2 — Diagnostics (definition of done)

Run in `C:\Users\Andrew\Projects`:

- **D1** Both destination files exist at the exact paths above
  (`Test-Path -LiteralPath` on each).
- **D2** Staging folder is empty: `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/`
  contains ZERO files (`Get-ChildItem` returns nothing).
- **D3** Hash integrity: for each pair, compute `Get-FileHash` on the
  destination; confirm the ledger copy hashes match the pre-move origin
  hashes recorded in your report (record both, and the equality verdict).
- **D4** `0-WAKE/2026-09-19/` contains EXACTLY three receipts:
  `VAL-001.md`, `VAL-001-SCOPE.md`, `VAL-002-ROSTER-CODIFY-PROPOSAL.md`.
- **D5** No other ledger seat changed: `1-STONE/`, `B-BOLT/`, `X-XP/`
  still hold exactly what was filed before this package (list them in your
  report for proof).

## Unit 3 — File this receipt (self-filing, gated)

When the above is done AND Drew confirms: MOVE this package
`VAL-004-FILE-VAL-SCOPES-TASK.md` (plus the completion report grown next
to it) into `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-19/`. Until Drew
confirms, this package stays in staging.

## Guardrails

- Halt & report after the whole package — do not halt per unit unless a
  unit fails. Report exactly what was done and NOT done.
- Every write is named here. Touch nothing else:
  `opencode.json`, `AGENTS.md`, `ED/00_ESSENCE_CORE/ED_FLOW/`,
  `.opencode/agents/`, and the ledgers of the other seats are OFF-LIMITS.
- Anything unexpected → **BROWN BANANA BREAD** and stop.
- This package is the second receipt of the new lifecycle — file it cleanly
  like VAL-003 did.