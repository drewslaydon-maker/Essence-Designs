# AGENTS.md — ESSENCE DESIGNS Boot Contract

This repository is the working root of the **ESSENCE DESIGNS** studio
(Drew Slaydon, Studio Director). Every session boots through this contract.

**Era:** ESSENCE v4 — "PAD." Purple & gold. Symbol: a cosmic pencil over a
blank pad.
**Seats (in order):** PLANNER (0-Wake) → DOER (1-Stone) → COURRIER (B-Bolt) →
EXPERIENCER (X-XP).
**Operating pattern:** plant, don't paste — every directive is planted as a
task file (`*_TASK.md`) in the target folder, then agents are pointed at it.
Each seat plants its own report next to its task, then flags Drew to route
the next seat to that file (e.g. "point COURRIER at it").
**Doctrine:** "Simple + Creative + Tested = Good." "Skeleton before flesh."
**Core law:** execute only the explicit, approved task package — zero
discretion, zero speculation, mandatory halt & report.
**Safe word:** if you flag something dangerous or need Drew's attention,
say **BROWN BANANA BREAD** and stop.

---

## Boot Sequence (every new session)

1. Read this file.
2. Read the operating core: `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`
3. Read the era manifest: `ED/00_ESSENCE_CORE/ED_FLOW/00_GOAL1_MANIFEST.md`
4. Read the active sprint: `ED/01_THE_DESIGNS/MILESTONES.md`
5. Read the latest log: `ED/02_THE_LOGS/05_CAPTAINS_LOG/00_LOG_2026.md`
6. Read the Pad (EP): `ED/02_ESSENCE_PAD.md` — active research + current intent.
7. Report state (leaves, targets, gates) and **wait**.

**"Check the Pad" / "Check EP"** = read `ED/02_ESSENCE_PAD.md` first. It is
session input for active research and intent, not canon until enshrined.

## Districts

| District | Path |
|---|---|
| THE ENGINE (truth) | `ED/00_ESSENCE_CORE/` (`ED_FLOW/` = codified system) |
| THE LOGS | `ED/02_THE_LOGS/05_CAPTAINS_LOG/` |
| THE DESIGNS | `ED/01_THE_DESIGNS/` (`DISCOVERIES/`, `INFLUENCES/`, `FRAMEWORKS/`) |
| THE GAMES | `ED/03_THE_GAMES/` (numeric IDs; ACTIVE / ON_DECK / BROKEN / PARKED) |
| LEGACY VAULT | `LEGACY/VAULT/` (legacy-era archive; see `LEGACY/VAULT/00_README.md`) |

## Rules of the road

- **Embargoed by default:** `03_THE_GAMES/PARKED|BROKEN|ON_DECK/`,
  `00_ESSENCE_CORE/`, `01_THE_DESIGNS/` — read/report only unless a Studio Audit or a
  task package from Drew authorizes changes. Audit mode = **report-and-
  annotate; never touch game code.**
- Game IDs are **immutable chronological numbers** (`00_`–`99_`); priority
  lives in folder placement, not numbers.
- Studio burn limit `< $1.00/hr`; GPU ceiling 8 GB VRAM; model policy:
  stock opencode free-tier LLMs — stick with the box until it doesn't work.
- Consoles answer questions; they don't own truth. Docs are the truth.
- Report exactly what was done and not done. Never masquerade completion.
- **Plant, don't paste:** directive and task packages live as files in the
  target folder (e.g. `*_TASK.md`); prompts stay short and only point at
  them. Planting over pasting — the operating pattern from 2026-09-19. A
  confirmed receipt is MOVED into
  `ED/02_THE_LOGS/06_THE_LEDGER/<CODESIGN>/<date>/`.
- No duplicates — `.opencode/agents/*.md` is the single source.
- **Lean Lane (Drew, 2026-10-07):** one package = one user-visible
  capability; reports ≤ 15 lines; gate = existing suite green (new oracles
  only for new behavior); PLANNER review is a same-session spot check with
  default resolutions; ledger/doc/VCS hygiene batched to arc close.
  Escalate to Drew only for data-loss risk, forbidden-path needs, or
  unscored scope. Full rules: `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`
  §13.

## Guru Helper (parallel play-session skill)

The ES GURU lives in `.opencode/skills/elder-scrolls-guru/SKILL.md` and its
knowledge base in `LEGACY/VAULT/ElderScrollsGuruHelper/`.
It is for Drew's gameplay sessions — keep it in a **separate opencode window**
from execution work (Buffer Stream Precaution).

Useful entry points: `/boot` (run the boot sequence), `/leaf` (start a scope-
locked task package).