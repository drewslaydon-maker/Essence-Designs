# ROSTER CODIFICATION — TASK PACKAGE (VAL-002)

> **STATUS: RATIFIED + GO — 2026-09-19 (Drew).** Strings locked exactly as
> the table below. Seats stay PLANNER/DOER/COURRIER/EXPERIENCER in doctrine;
> only the **registry names** change. Executing seat: **DOER window** (see
> Units 1–4). Bolt's leg 1 flight is gated on this package completing.

**From:** PLANNER → **For:** Drew's ratification → **Executed by:** the
appointed executing seat (per doctrine: plant-don't-paste; nothing here is
live until Drew says GO). **GO was given 2026-09-19** — "gotta fix that
before we ship with Bolt."

**Rationale (Drew's doctrine):** the opencode seat roster sorts
**alphabetically** (verified: `agent list` → `courrier, doer, experiencer,
planner`; TUI is default-first + alpha). Roster order previous fixes did
not stick because seat names don't sort into flow order. Codify **registry
names** that ARE sorted in seat-flow order; keep the seat charters
(PLANNER/DOER/COURRIER/EXPERIENCER) as doctrine.

## The codification (ratified strings — Drew 2026)

| Seat (doctrine) | Registry name | Sort key | Notes |
|---|---|---|---|
| PLANNER | **0-Planner** | 0 | the zero of everything — first |
| DOER | **1-Doer** | 1 | the real mover |
| COURRIER | **B-Bolt** | B | Bolt — bolts info around (seat stays COURRIER) |
| EXPERIENCER | **X-Experiencer** | X | X for experience |
| (reserve) | **Y-Shadow** | Y | Shadow Auditor — future, dormant |
| (reserve) | **Z-Timelord** | Z | Timelord — future, dormant |

Resulting roster (alpha sort): **0-Planner → 1-Doer → B-Bolt →
X-Experiencer** = exactly seat flow. Correct by construction.

## Definition of Done (RATIFIED 2026-09-19) — execute in this order

**Unit 1 — rename live agents in `opencode.json`:**
   - `opencode.json` agents keys → `0-planner`, `1-doer`
     (all values/prompts byte-identical; only the keys change).
   - `default_agent` → `0-planner`.
   - Note: `experiencer` was de-duplicated 2026-09-19 (Drew inline) — its
     `03_experiencer` key was removed from `opencode.json`; it now lives
     ONLY as the agent file `.opencode/agents/03_experiencer.md` (Unit 2).
     Same for `courrier`/`B-Bolt` — not keyed in `opencode.json`. Do not
     add either here.

**Unit 2 — rename agent files (`.opencode/agents/`):**
   - `02_courrier.md` → `b-bolt.md` (registry name `b-bolt`; seat charter
     COURRIER unchanged in doctrine, and unchanged inside the file — only
     the filename + status line reference "courrier" get corrected to
     Bolt/B-Bolt where they name the agent's registration).
   - `03_experiencer.md` → `x-experiencer.md` (registry name
     `x-experiencer`; seat EXPERIENCER unchanged).

**Unit 3 — registry references (council docs only):**
   - `00_SHADOW_COUNCIL/00_README.md`: seat table `LIVE (agent
     courrier)` → `LIVE (agent b-bolt)`; the COURRIER ruling paragraph's
     `opencode agent ``courrier`` (``.opencode/agents/courrier.md``` → agent
     `b-bolt` (`.opencode/agents/b-bolt.md`).
   - `00_SHADOW_COUNCIL/01_COURRIER.md`: status block
     `opencode agent ``courrier`` (``.opencode/agents/courrier.md``` → agent
     `b-bolt` (`.opencode/agents/b-bolt.md`).
   - No other files. AGENTS.md seat line and seat charters stay doctrine.

**Unit 4 — verify:**
   - `Get-Content -Raw opencode.json | ConvertFrom-Json` parses; keys are
     `0-planner`, `1-doer`; `default_agent` = `0-planner`;
     no stale `00_planner` / `01_doer` / `03_experiencer` keys remain.
   - `.opencode/agents/` contains `b-bolt.md` + `x-experiencer.md`; no
     `02_courrier.md` / `03_experiencer.md` remain.
   - Report exact results. HALT.

**Unit 5 — Drew restarts opencode, confirms roster reads:**
   `0-Planner → 1-Doer → B-Bolt → X-Experiencer` = exactly seat flow.
   Then Bolt's leg 1 fires on `COURRIER-VAL-001-LEG1-TASK.md`.

> **Resolved inline by Drew 2026-09-19:** the duplicate `03_experiencer`
> registration is dead (Unit 1 note). Registry page / `00_README.md`
> seat-table codification row still awaits Drew's exact text — not a
> ship-gate.

## Guardrails

- **Every write needs Drew approval (edit: ask).** Nothing is executed by
  this plant.
- Frame: council validation is read/report unless a package names it.
- Halt & report after EACH rename unit; never chain.
- BROWN BANANA BREAD if anything drifts from the ratified strings above.

---

**RATIFIED + GO (2026-09-19).** Strings locked. Executing seat: DOER window
runs Units 1–4 on this file, reports, halts. Drew restarts to confirm the
roster, then Bolt's leg 1 fires.
