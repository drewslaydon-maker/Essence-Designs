# AGENTS.md — ESSENCE DESIGNS Boot Contract

This repository is the working root of the **ESSENCE DESIGNS** studio
(Drew Slaydon, Studio Director). Every session boots through this contract.

**Era:** ESSENCE v4 — "PAD." Purple & gold. Symbol: a cosmic pencil over a
blank pad.
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
- Studio burn limit `< $1.00/hr`; GPU ceiling 8 GB VRAM; local model
  `qwen2.5-coder:3b` preferred for heavy offload.
- Consoles answer questions; they don't own truth. Docs are the truth.
- Report exactly what was done and not done. Never masquerade completion.

## Guru Helper (parallel play-session skill)

The ES GURU lives in `.opencode/skills/elder-scrolls-guru/SKILL.md` and its
knowledge base in `LEGACY/VAULT/ElderScrollsGuruHelper/`.
It is for Drew's gameplay sessions — keep it in a **separate opencode window**
from execution work (Buffer Stream Precaution).

Useful entry points: `/boot` (run the boot sequence), `/leaf` (start a scope-
locked task package).