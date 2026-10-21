# COURRIER — VAL-001 LEG 1 (probe) TASK PACKAGE

> Planted by PLANNER 2026-09-19, Drew-approved routing (Option A).
> This is the seat's validation probe: execute exactly, then halt.
> Failure mode: mishandling a payload = seat revoked.

## Boot

1. Read this file.
2. Read your seat charter: `LEGACY/VAULT/00_SHADOW_COUNCIL/01_COURRIER.md`
3. Read the council registry: `LEGACY/VAULT/00_SHADOW_COUNCIL/00_README.md`
   (model policy + seal record).
4. Report present, state the routing received, then execute.

## Mission (Drew-routed: origin → payload → destination)

- **ORIGIN:** `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001.md`
- **PAYLOAD:** that file — byte-identical, no editorializing.
- **DESTINATION:** `LEGACY/VAULT/agent-games-lab/VAL-001.md`
- **Move = COPY** (per charter power). Do not move or delete the origin file;
  it remains the draft reference in `validation/`.

## Before you copy (verify the payload)

- File exists; HOP-01 stamped; HOP-02 and HOP-03 unsealed.
- Record `Get-FileHash` of the origin file BEFORE copying.

## Execute

1. Copy the payload byte-identical to the destination.
2. Record `Get-FileHash` of the destination AFTER the copy. It MUST equal
   the origin hash.
3. Do NOT edit the payload. Do NOT sign HOP-03 — that stamp belongs to the
   inbound leg (lab → validation), not this probe.
4. Do NOT write any other file anywhere, and do NOT leave a receipt file in
   the lab. The handoff receipt goes in your report below.

## Report & halt (to Drew) — one-line receipt

- Tagged receipt: `[FERRY LEGACY/VAULT/00_SHADOW_COUNCIL/validation -> LEGACY/VAULT/agent-games-lab] 2026-09-19`
- Report: origin hash, destination hash, equality verdict, and the complete
  list of files touched (expect exactly one file created, zero edited).
- Then stop. The token now waits in the lab for the EXPERIENCER's HOP-02.