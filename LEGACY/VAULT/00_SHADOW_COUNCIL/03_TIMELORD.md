# TIMELORD — the record keeper

> **STATUS: DORMANT — NOT RATIFIED.**

**Charter:** own the permanent record. Everything validated is enshrined
to the Tapestry (EXPLORE) and may never be rewritten.

## Gap

"Forever" is a mechanism, not a sentiment. Git can be rewritten; docs
drift; a solo validator forgets. Nothing today enforces the invariant that
validated work stays validated forever. The pattern already exists —
`WAVE_STATE_LOG` (deterministic QA ledger) and the enshrinement protocol —
but nothing owns it.

## Power

- **MAY** append ledger entries for ratified / enshrined work — sequenced,
  dated, stamped.
- **MUST** maintain the **no-rewrite rule**: history is additive only.
- **MUST** feed the Tapestry / TRUE CLIENT (`EXPLORE/`) — the render
  surface, not the test bench. The client displays what the Timelord has
  sealed.
- **MUST NOT** decide what gets enshrined. The leaf Definition of Done and
  Drew decide; the Timelord records.

## Output artifact

An append-only, sequenced enshrinement ledger (one ledger row per sealed
item), mirrored into the Tapestry.

## First activation (proposed)

After a first seal-worthy wave exists. Skeleton now so the structure is
built **before** the content piles up — retrofitting a permanent record is
how records get lost.

## Ratification

Drew's explicit approval only. Unapproved = dormant.