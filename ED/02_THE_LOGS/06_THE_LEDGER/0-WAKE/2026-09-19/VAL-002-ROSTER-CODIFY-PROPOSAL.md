# ROSTER CODIFICATION — PROPOSAL (Seal Gate freeze)

**Task package:** `STOP-COURRIER-ROSTER-CODIFY`
**Plant:** 2026-09-19 — PLANNER seat, per Drew Slaydon (directive:
"lock this stuff now before flowing long term ... intentionally
codified, hence stopping the pipeline verify process").

**Status: UNRATIFIED — awaiting Drew's explicit go on exact strings.**

---

## The problem being codified

opencode's TUI sorts the seat roster **by name**. Current seat names
(`planner / doer / courrier / experiencer`) come out as:

```
Planner, Courrier, Doer, Experiencer   <- observed, wrong order
```

Rename-with-prefix is the only lever that survives the sort. If we lock
names so alphabetical order == the intended seat flow, the roster is
self-ordering forever.

## Proposed codified roster (alpha order == seat flow)

| Seat | Proposed name | Rationale (Drew's) |
|---|---|---|
| PLANNER | **0-Planer** | zero of everything — the plan is the nothing before the something |
| DOER | **1-Doer** | the real mover / progress index |
| COURRIER | **B-Bolt** | "i'm naming it Bolt in my head, since thats what it does, bolt around info" — prefix B breaks the 0/1 numeric run so it sorts **between** the seats, not beside them |
| EXPERIENCER | **X-Experiencer** | the X for experience |
| (reserved) | **Y-Shadow** | Shadow Auditor seat (future) |
| (reserved) | **Z-Timelord** | Timelord seat (future) |

Sorted alphabetically: `0-Planer < 1-Doer < B-Bolt < X-Experiencer <
Y-Shadow < Z-Timelord` — which is **exactly** the seat flow order Drew
wants. The prefix scheme doubles as the ordering contract.

## Open items for Drew — need explicit answers (zero speculation)

1. **"0-Planer" spelling** — you wrote `Planer` (one n). Seat charter /
   AGENTS.md say PLANNER (two n). Which do we enshrine?
2. **"B-Bolt" vs staying "courrier"** — you said "maybe Courrier as B
   cause I'm naming it Bolt in my head." Lock: seat stays **COURRIER**
   (doctrine/charter unchanged), but the **live agent** gets display name
   `B-Bolt`? Or fully rename the seat itself?
3. Confirm **Y-Shadow / Z-Timelord** as the reserved tail (they become
   the future roster the moment those seats are planted).
4. Do you want the seat charter/README seat table updated to reflect the
   codified names, or keep seat names PLANNER/DOER/COURRIER/EXPERIENCER
   in doctrine and use codified names only for agent registration?

## Under no circumstance

- No renaming until Drew says the exact final strings (safe word applies:
  renaming a ratified seat's charter without explicit approval is a
  BROWN BANANA BREAD event — this touches ratified roster/charter).
- No edits to opencode.json `agents` keys, `.opencode/agents/*.md`
  filenames, `00_README.md` seat table, or AGENTS.md seat line until this
  package is ratified.

Plant location: `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/`.
This is a proposal, not canon. Awaiting Drew's ratify reply → DOER runs
the rename package.
