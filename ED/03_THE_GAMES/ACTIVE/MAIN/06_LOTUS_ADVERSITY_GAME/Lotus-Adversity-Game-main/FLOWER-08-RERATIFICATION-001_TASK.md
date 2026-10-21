# FLOWER-08-RERATIFICATION-001 — RE-RATIFY THE SELF-PROVING GATE (Task Package)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval → **Executed by:** DOER (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO window here)
> **Drew's rulings (2026-09-20):**
> 1. **The Wheel is good enough now to stamp.** Drew confirmed the Architect
>    verdict stands: the native Wheel walk passed with no notes — "the best
>    version it has ever been," 100% the base of all LAG dev. The ROADMAP
>    re-ratification trigger ("v2 client passes Architect review with
>    `bun run lint` + `bun run lab:verify` green") is satisfied.
> 2. **Shadow Seal Gate is a LATER leaf** — unrelated to this act. It is NOT
>    part of this package; it stays its own separate leaf (per the
>    2026-09-20 worksheet queue). Do not run or reference it as a gate here.
> 3. **Covenant shape = straight flip of Flower 08** (not a successor
>    covenant). Re-ratification is the act: `status` back to `RATIFIED`
>    with a dated re-ratification note, schema-exact.
> 4. **VCS: HOLD** (Drew, 2026-09-20). No commit, no push.
>
> **Sequencing:** this leaf plants into the queue. It runs when Drew routes
> the DOER window — after WASH-001 unless Drew orders otherwise.

---

## 1. Mandatory pre-reads (game-covenant compliance)

1. `AGENTS.md` (repo root `C:\Users\Andrew\Projects\AGENTS.md`) — studio boot contract.
2. `AGENTS.md` (this repo root) — **Part 1 doctrine is UNTOUCHABLE**; Part 2 is the dev reference.
3. `ROADMAP.md` (this repo root) — the ONLY ROADMAP change allowed is the ONE bullet move (Unit 2).
4. `WHEEL-NATIVE-001_TASK.md` + `WHEEL-NATIVE-001-REPORT.md` (this repo root) — the surviving-execution proof this leaf cites.
5. `Lotus_Adversity_Game/src/data/foreverFlowersData.ts` — the ONE code target (Flower 08 entry only).

**UNTOUCHABLE (embargo within the repo):** everything under
`Lotus_Adversity_Game/src/` EXCEPT the single `flower-8-self-proving-gate`
entry in `foreverFlowersData.ts` · `verify-lab.ts` · `index.html` ·
`bun.lock` · the **entire** Part 1 of this repo's `AGENTS.md` ·
`WHEEL-CODEX-001*` · `WHEEL-TRUTH-001*` · `WHEEL-NATIVE-001*` (read-only) ·
`tui.json` · every OTHER ROADMAP bullet/section (only the ONE named bullet
moves) · every other district in the studio repo. No new files, no new
fields, no new statuses. The `revocationNote` field name stays (it is
optional in the schema and may carry the re-ratification record).

---

## 2. Why this leaf exists (restated from Drew's ruling + the covenant ground truth)

The ROADMAP's Future Work held: *"Re-ratification of FLOWER 08 … once the v2
client passes Architect review with `bun run lint` + `bun run lab:verify`
green."* Both halves are on the record: the Architect's native-Wheel walk
passed with **no notes** (Captain's Log, 2026-09-19), and WHEEL-NATIVE-001
recorded `lint` exit 0, `lab:verify` exit 0 (6/6 airseal), `build` exit 0.
The fresh client survived execution — the exact path back to a sealed claim.
Drew ruled the trigger satisfied and the stamp happens NOW. The covenant
itself still reads `INVALIDATED` with a *"Pending re-ratification"* note —
this leaf performs the flip, schema-exact, and moves the ROADMAP bullet to
Completed. Shadow Seal Gate is explicitly a separate later leaf, NOT part of
this act.

---

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any edit)
From the app dir `Lotus_Adversity_Game/`:
1. `bun run lint` — expect exit 0.
2. `bun run lab:verify` — expect exit 0 (all airseal gates green, 6/6).
3. Read the `flower-8-self-proving-gate` entry in
   `src/data/foreverFlowersData.ts` — record the exact current `status` and
   the full `revocationNote` text.
If any is NOT green, STOP and report (BROWN BANANA BREAD) — do not re-ratify
on an unproven tree.

### Unit 1 — The covenant flip (ONE entry, exact)
In `src/data/foreverFlowersData.ts`, edit ONLY the `flower-8-self-proving-gate` object:
1. `status: "INVALIDATED"` → `status: "RATIFIED"`
2. Replace the `revocationNote` VALUE with a dated re-ratification record
   (the field KEEPS its name — schema-exact; content documents history):
   ```
   revocationNote: "Re-ratified by Architect decree 2026-09-20 after the
   Apparatus v2 fresh client survived execution: the native Wheel
   (WHEEL-NATIVE-001) passed the Architect walk with no notes and all canon
   gates green (lint exit 0, lab:verify 6/6, build exit 0). A self-proving
   gate seals only what holds under fire — the wheel held.",
   ```
   Nothing else in the object changes: `id`, `number`, `title`, `subtitle`,
   `category`, `lessonLearned`, `corePrinciple`, `userPractice`,
   `agentPractice`, `goldenQuote` — all untouched. No other entries in the
   file change. Verify on re-read: object shape identical to before except
   `status` value + `revocationNote` content.

### Unit 2 — ROADMAP bullet move (ONE bullet, exact)
In `ROADMAP.md`:
1. DELETE the Future Work bullet verbatim:
   `- **Re-ratification of FLOWER 08 (or a successor covenant):** Once the v2 client passes Architect review with `bun run lint` + `bun run lab:verify` green, propose re-ratification via the strict Forever Flower protocol. A rebuild that survives execution is the only path back to a sealed claim.`
2. APPEND to the Completed (🟢) section, right after the WHEEL-NATIVE-001
   entry, this exact entry:
   `- **Flower 08 Re-ratified (FLOWER-08-RERATIFICATION-001):** FLOWER 08 — The Self-Proving Gate — restored to RATIFIED after the Apparatus v2 fresh client survived execution: the native Wheel (WHEEL-NATIVE-001) passed the Architect walk with no notes and all canon gates green (lint exit 0, lab:verify 6/6, build exit 0). Covenant data flipped schema-exact; the revocation-note records the 2026-09-20 re-ratification decree. Shadow Seal Gate reserved as its own later leaf.`
Do NOT touch any other ROADMAP section/status.

### Unit 3 — Gate proof AFTER the edits (the DoD gates)
From the app dir `Lotus_Adversity_Game/`:
1. `bun run lint` — must exit 0.
2. `bun run lab:verify` — must exit 0 (6/6) — proves census/heraldry/data
   canon unaffected by the covenant flip.
3. Read-back proof: grep `foreverFlowersData.ts` for
   `flower-8-self-proving-gate` — record its `status:` line (must read
   `"RATIFIED"`) and that exactly one `"INVALIDATED"` remains in the file or
   zero remain (Flowers 01-07 were already RATIFIED; the union stays intact).
4. `ROADMAP.md` read-back: Future Work no longer contains the re-ratification
   bullet; Completed contains the new entry.

### Unit 4 — Report + HALT
1. Plant `FLOWER-08-RERATIFICATION-001-REPORT.md` next to this task file —
   restated scope, unit-by-unit results (each gate exit code, the exact
   before/after status + note text, the ROADMAP before/after bullet), any
   deviations, honest NOT-DONE list.
2. HALT. Do NOT run the Shadow Seal Gate, do NOT commit/push (VCS HOLD),
   do NOT touch any other covenant or game file.

---

## 4. Definition of Done (DoD)

1. `foreverFlowersData.ts` — flower-8 `status` = `"RATIFIED"`, `revocationNote`
   = the dated 2026-09-20 re-ratification record; object shape schema-exact;
   no other entry changed.
2. `ROADMAP.md` — Future Work re-ratification bullet removed; Completed entry
   appended verbatim per Unit 2; no other section touched.
3. `bun run lint` exit 0 · `bun run lab:verify` exit 0 (6/6) — post-edit.
4. Report planted; no staging/temp residue; HALT — no chaining, no Shadow
   Seal Gate, no VCS.

## 5. Guardrails

- Zero discretion: touch ONLY the named targets with the exact content.
  Any surprise → STOP and report; do NOT improvise adjacent fixes.
- Never touch any other covenant, any other data file, Part 1 of
  `AGENTS.md`, `verify-lab.ts`, `index.html`, or any other district.
- No new fields, no new statuses — schema-exact only
  (`"RATIFIED" | "INVALIDATED"` union stays canonical).
- The Shadow Seal Gate for WHEEL-NATIVE-001 is a SEPARATE LATER LEAF —
  out of scope, do not run, do not mention as done.
- Masquerade is forbidden: state exactly what ran, what passed, what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew: point the DOER (1-Stone)
window at this file to execute. Executor: restate scope, run, HALT at every
unit gate.