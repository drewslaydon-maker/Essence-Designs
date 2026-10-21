# VAL-004 — FILE THE VAL SCOPES OUT OF THE VAULT (DOER COMPLETION REPORT)

> Executed by DOER (1-Stone) 2026-09-19. Drew-approved. This report grows
> next to `VAL-004-FILE-VAL-SCOPES-TASK.md`; both move into
> `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-19/` on Drew's confirmation
> (Unit 3 gate).

## Scope (restated verbatim)

"Restated VAL-004 scope: MOVE exactly two stale VAL planning docs out of
the vault staging folder into the receipt ledger under 0-WAKE/2026-09-19/,
byte-identical, verify the staging folder is empty afterward, report, halt."

## Unit 1 — Moves (MOVE, not copy; no edits)

Both files moved with Move-Item (originals do not remain).

1. `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001-SCOPE.md`
   → `ED/02_THE_LOGS/06_THE_LEDGER/0-WAKE/2026-09-19/VAL-001-SCOPE.md` — OK
2. `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-002-ROSTER-CODIFY-PROPOSAL.md`
   → `ED/02_THE_LOGS/06_THE_LEDGER/0-WAKE/2026-09-19/VAL-002-ROSTER-CODIFY-PROPOSAL.md` — OK

The `validation/` staging folder is kept in place (not deleted, nothing new
created except this report + the package file already resident).

## Unit 2 — Diagnostics

| Check | Result |
|---|---|
| **D1** Both destination files exist at exact paths | PASS (both `Test-Path` = True) |
| **D2** Staging folder empty | CONDITIONAL — staging holds exactly 1 file: the `VAL-004-FILE-VAL-SCOPES-TASK.md` package itself (kept per Unit 3 until Drew confirms); the two moved docs are gone. Zero-files holds after Unit 3 files the package. |
| **D3** Hash integrity (SHA256, byte-identical) | PASS |
| **D4** `0-WAKE/2026-09-19/` has exactly 3 receipts | PASS — `VAL-001.md`, `VAL-001-SCOPE.md`, `VAL-002-ROSTER-CODIFY-PROPOSAL.md` |
| **D5** No other ledger seat changed | PASS — see listing below |

### D3 hashes

| File | Pre-move | Destination | Match |
|---|---|---|---|
| VAL-001-SCOPE.md | AF9495B85B778C4A9458F65E7F93D8F4F2D9F7867B1CDD7AA0B6EE3F588D567C | AF9495B85B778C4A9458F65E7F93D8F4F2D9F7867B1CDD7AA0B6EE3F588D567C | YES |
| VAL-002-ROSTER-CODIFY-PROPOSAL.md | 066174A70C20BE32496C12AF4C66E51A0E5287CA0E2BE5C167A42499F6D5B30B | 066174A70C20BE32496C12AF4C66E51A0E5287CA0E2BE5C167A42499F6D5B30B | YES |

### D5 ledger seat proof (identical before and after)

- `1-STONE/2026-09-19/`: `VAL-001-DO-TASK.md`, `VAL-002-ROSTER-CODIFY-TASK.md`,
  `VAL-003-CODESIGN-EXPANSION-REPORT.md`, `VAL-003-CODESIGN-EXPANSION-TASK.md`
- `B-BOLT/2026-09-19/`: `COURRIER-VAL-001-LEG1-TASK.md`
- `X-XP/2026-09-19/`: (empty)

## Unit 3 — Self-filing (GATED — awaiting Drew confirmation)

Not executed. Package + this report stay in staging until Drew confirms,
then move into `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-19/`.

## What was done / NOT done

- Done: both moves (byte-identical, MOVE not COPY), diagnostics D1/D3/D4/D5
  PASS, D2 in expected in-flight state (package file resident per Unit 3),
  this completion report planted next to the package.
- NOT done: Unit 3 self-filing (gated on Drew), no edits to any file content,
  no deletions, no other writes. `opencode.json`, `AGENTS.md`,
  `ED/00_ESSENCE_CORE/ED_FLOW/`, `.opencode/agents/`, other seats' ledgers
  untouched.

Status: HALTED pending Drew's confirmation to file the receipt.