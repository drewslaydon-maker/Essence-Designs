# VAL-003 — CODESIGN + RECEIPT LEDGER EXPANSION (DOER TASK PACKAGE)

> Planted by PLANNER 2026-09-19, Drew-approved (confirmed alongside Seal
> #002). Executing seat: **DOER (1-Stone)** in the DOER window. Read this
> file, execute exactly, then halt. Turn no further pages.

## Boot

1. Read this file.
2. Read `AGENTS.md` + `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`.
3. Read the Pad: `ED/02_ESSENCE_PAD.md`.
4. Restate the scope below verbatim as your first report line, then execute.

## Scope — restate verbatim

"Restated VAL-003 scope: rename the agent roster to code signs
(0-Wake / 1-Stone / B-Bolt / X-XP), create the receipt chamber
06_THE_LEDGER under THE LOGS, file the confirmed VAL receipts into it,
codify the lifecycle + names in AGENTS.md and operating core §5/§6, record
Seal #002, verify, report, halt."

## Definitions (ratified strings — Drew 2026-09-19)

| Seat (doctrine) | Code sign | Registry name | File |
|---|---|---|---|
| PLANNER | **0-Wake** | `0-wake` | create `.opencode/agents/0-wake.md` |
| DOER | **1-Stone** | `1-stone` | create `.opencode/agents/1-stone.md` |
| COURRIER | **B-Bolt** | `b-bolt` | `.opencode/agents/b-bolt.md` (exists — rebrand text only) |
| EXPERIENCER | **X-XP** | `x-xp` | rename `.opencode/agents/x-experiencer.md` → `x-xp.md` |
| reserves Y / Z | — | — | left unnamed until they come in (do NOT name them) |

Code signs are the **visible agent names**; the lateral seat roles
(PLANNER/DOER/COURRIER/EXPERIENCER) stay doctrine unchanged.

## Unit 0 — Close out Seal #002

1. Stamp the verdict block of `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001.md`:
   `Verdict: SEALED — 2026-09-19 — all three HOPs stamped, every seat stayed in lane. Drew confirmed.`
2. Append to the seal record in `LEGACY/VAULT/00_SHADOW_COUNCIL/00_README.md`:

   - **Seal #002 — 2026-09-19 — "VAL-001 system shake-out."**
     - **Findings:** token moved hand-to-hand DO → EXPERIENCER → COURRIER; all
       three HOPs stamped and dated; hashes matched both legs (F0ACAA…E04).
     - **Verdict: SEALED** — first system-wide pipeline verify. Standard is
       trustworthy for routine work.

3. File `validation/VAL-001.md` into the LEDGER (created in Unit 2) at
   `ED/02_THE_LOGS/06_THE_LEDGER/0-WAKE/2026-09-19/VAL-001.md`.
   The `validation/` staging folder keeps only in-flight references going
   forward.

## Unit 1 — Registry renames

1. In `opencode.json` (root):
   - `agents` key `0-planner` → `0-wake` (value byte-identical).
   - `agents` key `1-doer` → `1-stone` (value byte-identical).
   - `default_agent` → `0-wake`.
   - Do NOT remove the disabled built-ins (`build`, `plan`, `general`,
     `explore`). Do NOT touch `references`.
2. Rename `.opencode/agents/x-experiencer.md` → `x-xp.md`. Update its
   frontmatter `description` to open with **X-XP** (seat EXPERIENCER kept as
   doctrine in the body) and correct the roster line inside to list the code
   signs: PLANNER 0-Wake / DOER 1-Stone / YOU X-XP. No other content edits.
3. `.opencode/agents/b-bolt.md`: frontmatter `description` should open with
   **BOLT** (B-Bolt) instead of "COURRIER —" (the lateral role stays
   COURRIER and remains referenced in the body). Title to `# BOLT — Shadow
   Council seat`, keep all charter content. Seat charter
   `LEGACY/VAULT/00_SHADOW_COUNCIL/01_COURRIER.md` is doctrine — leave it.
4. Create TWO new agent files matching the house format (read `b-bolt.md`
   and `x-xp.md` for the exact frontmatter shape/existing prompts; fold the
   current `0-planner` / `1-doer` prompt bodies from `opencode.json` into
   them verbatim, then open the frontmatter with the code sign):
   - `.opencode/agents/0-wake.md` — PLANNER / 0-Wake
   - `.opencode/agents/1-stone.md` — DOER / 1-Stone
   Both `mode: primary`, permission block matching the source prompts,
   `color` copied from the current `opencode.json` entries.
   After creating these files, **remove** the `agents` key bodies from
   `opencode.json` is NOT required — keep both (file + key) is allowed, but
   preference per house pattern: agent registry lives in
   `.opencode/agents/*.md`. ONLY do this if the opencode.json `agents` map
   still works with the file present — otherwise keep both. Zero discretion:
   if in doubt, keep both keys AND files; report the choice made.

## Unit 2 — THE LEDGER (receipt chamber)

Create the chamber under THE LOGS:

```
ED/02_THE_LOGS/06_THE_LEDGER/
  README.md                       # charter of the chamber
  0-WAKE/   2026-09-19/
  1-STONE/  2026-09-19/
  B-BOLT/   2026-09-19/
  X-XP/     2026-09-19/
```

1. `README.md` — write a short charter:
   - This is the chamber of completed work receipts (per Drew, 2026-09-19).
   - A planted `*_TASK.md` is a work receipt; once Drew confirms the work,
     the receipt is MOVE here, sorted by code sign then date.
   - Reads as a per-agent, viewable, sorted log of completed tasks.
2. File (MOVE, not copy) these staged receipts:
   - `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-002-ROSTER-CODIFY-TASK.md`
     → `1-STONE/2026-09-19/VAL-002-ROSTER-CODIFY-TASK.md`
   - `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001-DO-TASK.md`
     → `1-STONE/2026-09-19/VAL-001-DO-TASK.md`
   - `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/COURRIER-VAL-001-LEG1-TASK.md`
     → `B-BOLT/2026-09-19/COURRIER-VAL-001-LEG1-TASK.md`
   - `LEGACY/VAULT/00_SHADOW_COUNCIL/validation/VAL-001.md`
     → `0-WAKE/2026-09-19/VAL-001.md` (from Unit 0; do not double-move)
3. Do NOT move the VAL-001 scope or the VAL-003 package yet — this package
   itself gets filed to `1-STONE/2026-09-19/` in Unit 4.

## Unit 3 — Codify the doctrine

1. `AGENTS.md` (root):
   - Replace the "Plant, don't paste" bullet's tail to add the terminal
     state: a confirmed receipt is MOVED into
     `ED/02_THE_LOGS/06_THE_LEDGER/<CODESIGN>/<date>/`.
   - Replace the "Seats (in order)" line to show code signs:
     PLANNER (0-Wake) → DOER (1-Stone) → COURRIER (B-Bolt) → EXPERIENCER (X-XP).
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`:
   - §5 district table, THE LOGS row: append "06_THE_LEDGER — chamber of
     completed work receipts (per seat + date)."
   - §6 Leaf System: add a final bullet — **Filed:** a sealed leaf's
     receipt (`*_TASK.md`) is MOVED into `06_THE_LEDGER/` under its owning
     seat's code sign, dated. The receipt is the permanent record of the
     completed work.

## Unit 4 — Diagnostics (definition of done)

- **D1** `Get-Content -Raw opencode.json | ConvertFrom-Json | Out-Null` —
  parses; agents keys are `0-wake`, `1-stone`; `default_agent` = `0-wake`;
  no `0-planner` / `1-doer` keys remain.
- **D2** `.opencode/agents/` contains exactly: `0-wake.md`, `1-stone.md`,
  `b-bolt.md`, `x-xp.md`. No `x-experiencer.md` remains.
- **D3** Ledger exists: `ED/02_THE_LOGS/06_THE_LEDGER/` with README + four
  seat folders; filed receipts present under correct seats/dates.
- **D4** No stale code-sign references anywhere:
  `Select-String '0-planner|1-doer|x-experiencer'` across
  `opencode.json`, `AGENTS.md`, `ED/00_ESSENCE_CORE/ED_FLOW/` returns
  ZERO hits.
- **D5** Seal #002 recorded in `00_README.md`; verdict stamped in
  `0-WAKE/2026-09-19/VAL-001.md`.

## Unit 5 — Reboot-verify (baked in)

- **Baked in step:** after renames, opencode is restarted to confirm the
  roster reads **0-Wake → 1-Stone → B-Bolt → X-XP** (alpha order == seat
  flow). This chat likely stays up; verification continues inline today —
  D1–D4 above ARE the inline verify. Report them, note reboot as pending,
  then halt.

## Unit 5B — Dedupe the registry (Drew directive 2026-09-19)

> One registration per agent. Agent source of truth =
> `.opencode/agents/*.md`. The `opencode.json` `agents` map must NOT
> duplicate a file-registered agent — clutter is waste.

1. Edit `opencode.json`:
   - Remove the `agents` entries `0-wake` and `1-stone` (full bodies).
   - Keep `default_agent: "0-wake"` and everything else untouched.
   - If the `agents` object is left empty, remove the empty object entirely
     (clutter rule).
2. Codify the rule once near the seat lines in `AGENTS.md` (root):
   "Agent registrations live in `.opencode/agents/*.md` only; the
   `opencode.json` agents map stays clear — one source, no duplicates."
3. Inline verify (reboot pending, same as Unit 5):
   - **D6:** `opencode.json` parses; no `0-wake`/`1-stone` keys; no stray
     keys in the `agents` map.
   - **D7:** `.opencode/agents/` still holds all four files unchanged.
   - **D8:** `default_agent` still `0-wake`.
   Report each. If a later reboot cannot resolve `default_agent: "0-wake"`
   from the file registration, restore ONLY the `0-wake` JSON entry (with
   `default_agent` intact) and report that revert — that is the documented
   fallback, not a compromise.
4. Amendment note: this supersedes Unit 1.4's either/or keep-both clause —
   files win, JSON stays clear.

## Unit 6 — File this receipt (self-filing)

When the above is done and Drew confirms: MOVE this package
`VAL-003-CODESIGN-EXPANSION-TASK.md` (plus the completion report grown next
to it) into `1-STONE/2026-09-19/`.

## Guardrails

- Halt & report after the whole package — DO NOT halt per unit unless a unit
  fails. Report exactly what was done and NOT done (e.g. opencode.json key
  removal, whether x-xp b-bolt edits stayed minimal).
- Unit 5B supersedes Unit 1.4's keep-both clause: files are the single
  source of truth; the JSON agents map is now emptied.
- Every write already named here; touch nothing else. `00_ESSENCE_CORE/` is
  named (operating core §5/§6 only), so those two edits are authorized.
- Anything unexpected → **BROWN BANANA BREAD** and stop.
- This package is itself the first receipt of the new lifecycle — show it
  can be filed cleanly.