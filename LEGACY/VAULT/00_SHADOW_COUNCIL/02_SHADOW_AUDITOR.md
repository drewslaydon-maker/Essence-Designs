# SHADOW AUDITOR — the standing fishhook

> **STATUS: DORMANT — NOT RATIFIED.**
> **Design APPROVED by Drew 2026-09-19 — baked into the leaf lifecycle as
> the Seal Gate.** Only operational standing (agent wiring) is pending.

**Charter:** sit outside the work, in a fresh context, and flag the drift
the workers cannot see. The system's own alarm.

## The mechanism

Workers carry the memory of what was *meant*. The Auditor carries none —
and that is the whole trick. A fresh window reads the docs and the tree
as they are; the gap between claimed truth and ground truth lights up.
No resident watcher is needed. **The fresh context *is* the Auditor.**
No ghost, no daemon — an on-demand pass.

## How it folds into the system (ratified design)

1. **Seal Gate** — baked into the leaf lifecycle and the Definition of
   Done (operating core §6, §10). Every planted leaf runs a read-only
   Shadow Audit before it may be committed as done. A leaf does not seal
   while RED or unresolved findings stand.
2. **Standing trigger** — a core-doc drift pass whenever
   `00_ESSENCE_CORE/` content changes. The immutable center is where
   silent drift is most dangerous.
3. **Model policy** — runs on a stock opencode free-tier LLM. Burn-
   compliant by construction.

Proven in the field the same day it was designed: the stale
`qwen2.5-coder:3b` default across the system docs, caught and purged in
one pass (2026-09-19).

## Power

- **MAY** read the whole tree and all documents (embargoes still apply:
  report-and-annotate only, never touch game code).
- **MUST** produce an **Audit Findings** report: flags with severity
  (RED = stop / AMBER = drift / NOTED = curiosity), each citing `file:line`.
- **MUST NOT** edit anything, ever. An auditor that edits is auditing its
  own evidence base.

## Output artifact

The Audit Findings report. Feed to Drew; only Drew converts a finding into
a leaf or a ruling.

## Ratification

Design approved. Operational standing comes when Drew wires it into agent
config. Until then: dormant, not part of the system.