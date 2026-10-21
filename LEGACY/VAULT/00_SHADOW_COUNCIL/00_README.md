# SHADOW COUNCIL — Dormant Role Registry

> **STATUS: DORMANT — NOT RATIFIED.**
> The Shadow Council is a set of proposed roles, held in the vault on
> purpose. Nothing here is part of the operating system until Drew ratifies
> a member (see Ratification Gate). Founded **2026-09-19** at Drew's
> direction (session with Big Pickle).

## Why the council exists

Three real gaps in the live system (PLANNER, DOER,
EXPERIENCER, ES GURU):

1. **Information silos** — every session lives in its own window and never
   crosses its walls. Findings rot where they were born.
2. **Drift blindness** — the workers who cause drift cannot see it;
   nobody sits outside the work.
3. **Memory impermanence** — validated work has no enforced permanent
   record; "forever" has no mechanism.

## Council members

| Role | File | Gap it fills | Slot-in |
|---|---|---|---|
| **COURRIER** | `01_COURRIER.md` | silo gap | **LIVE** (agent `b-bolt`) — validation pending |
| **SHADOW AUDITOR** | `02_SHADOW_AUDITOR.md` | drift blindness | On demand — observer today |
| **TIMELORD** | `03_TIMELORD.md` | permanence gap | On demand — after a first seal-worthy wave |

## Dormancy rule

- Council members are **roles + invocation protocols, not resident
  processes**. They exist as documents. They run only when Drew invokes
  them, one at a time, in a window of their own (Buffer Stream
  Precaution).
- Read-only by charter. No council member may touch `00_ESSENCE_CORE/`,
  `01_THE_DESIGNS/`, or any game code. Ratification changes **standing**,
  never **power**.
- Burn constraint still applies: council members run on **stock opencode
  free-tier LLMs** (studio model policy — stick with the box until it
  doesn't work).

## Rulings (2026-09-19)

- **SHADOW AUDITOR — design approved, baked into the leaf lifecycle as the
  Seal Gate** (see `02_SHADOW_AUDITOR.md`). Operational standing still
  dormant until Drew wires it in.
- **COURRIER — RATIFIED (promoted into the working system) 2026-09-19.**
  Live as opencode agent `b-bolt` (`.opencode/agents/b-bolt.md`,
  mode: `all` — selectable by Drew and spawnable by another agent only when
  the active task package names it as delegate). The original pilot mission
  stood dissolved — every payload was already homed — but the seat was
  enabled anyway as the council's first bridge role. **Validation duty is
  next session's mission:** Drew routes one real movement, the seat
  executes it per charter, and the run is reviewed before routine trust.
  Mishandling revokes the seat (see `01_COURRIER.md`).
- **TIMELORD** — unchanged; skeleton now, powers later.
- **Model policy:** council invocations use stock opencode free-tier LLMs.
  The former `qwen2.5-coder:3b` default was purged across the system docs
  2026-09-19 (drift correction pass).

## Seal record

The Seal Gate's ledger. Append-only — sealed means resolved.

- **Seal #001 — 2026-09-19 — "Drift purge + first Seal Gate."**
  - **Findings:** (RED) stale `qwen2.5-coder:3b` model policy across the
    system docs; (AMBER) roster naming drift — `PLAN / BUILD / EXPERIENCE`
    vs the configured `ESSENCE/DO`.
  - **Resolution:** model policy corrected to **stock opencode free-tier
    LLMs** in AGENTS.md, opencode.json, operating core, BIBLE, MILESTONES,
    AGENT_BOOT_PROMPT, Experiencer config + charter. Roster naming aligned
    to `PLAN / DO / EXPERIENCE` across Experiencer docs. Seal Gate baked
    into operating core §6 / §10.
  - **Verdict: SEALED** — RED none, AMBER resolved, NOTED carried.

- **Seal #002 — 2026-09-19 — "VAL-001 system shake-out."**
  - **Findings:** token moved hand-to-hand DO → EXPERIENCER → COURRIER; all
    three HOPs stamped and dated; hashes matched both legs (F0ACAA…E04).
  - **Verdict: SEALED** — first system-wide pipeline verify. Standard is
    trustworthy for routine work.

## Ratification gate

A member is **RATIFIED** only when Drew says so explicitly and the role is
promoted from this registry into the working system (e.g. an opencode
agent or skill config). Until then: draft, dormant, **not part of the
system** — exactly where a proposal belongs.