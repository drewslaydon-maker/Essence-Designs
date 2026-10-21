# COURRIER — ENSHRINE-001 FERRY (Ledger Filing) TASK PACKAGE

> Planted by PLANNER (0-Wake) 2026-09-20, Drew-routed as the session's
> closing task. Delegate named: **COURRIER (b-bolt)** — authorized call.
> This is routine ferry work (seat already validated — Seal #002, VAL-001,
> 2026-09-19). Execute exactly, then halt.

## Boot

1. Read this file.
2. Read your seat charter: `LEGACY/VAULT/00_SHADOW_COUNCIL/01_COURRIER.md`
3. Read the council registry: `LEGACY/VAULT/00_SHADOW_COUNCIL/00_README.md`
   (model policy + seal record).
4. Report present, state the routing received, then execute.

## Mission (Drew-routed: origin → payload → destination)

- **ORIGIN:** `ED/`
- **PAYLOAD (move BOTH files, byte-identical, no editorializing):**
  - `ED/ENSHRINE-001_TASK.md`
  - `ED/ENSHRINE-001-REPORT.md`
- **DESTINATION:** `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-20/`

This is a **ledger filing**: per the ledger rule (operating core §6,
`06_THE_LEDGER/README.md`) receipts are **MOVED** (not copied). After the
move, neither origin path may exist in `ED/`.

## Before you move (verify the payload)

- Both files exist at origin.
- Record `Get-FileHash` of each file BEFORE moving.

## Execute

1. Create the destination folder
   `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-20/` (it does not exist
   yet; leave the `1-STONE/` parent and every other ledger folder
   untouched).
2. MOVE both files byte-identical to the destination, keeping their exact
   filenames (`ENSHRINE-001_TASK.md`, `ENSHRINE-001-REPORT.md`).
3. Record `Get-FileHash` of each file AFTER the move. Each MUST equal its
   origin hash.
4. Confirm neither origin path exists anymore in `ED/`.
5. Do NOT edit, open-for-content, summarize, or re-document either payload.
   Do NOT write any other file anywhere (no receipt file at the
   destination — the handoff receipt goes in your report below).
6. Do NOT touch `0-WAKE/`, `B-BOLT/`, `X-XP/`, `1-STONE/2026-09-19/`, or
   any file other than the two named payloads + the destination folder.

## Report & halt (to Drew) — one-line receipt

- Tagged receipt:
  `[FERRY ED/ -> ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-20/] 2026-09-20`
- Report: origin hashes, destination hashes, equality verdicts,
  destination folder created (yes/no), confirmation both origin paths are
  gone, and the complete list of files touched (expect exactly two files
  moved, zero created/edited beyond the destination folder).
- Then **stop**. No routing decisions, no follow-on suggestions, no
  chaining.