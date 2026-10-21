> SUPERSEDED 2026-10-06 — CG-002 reset: split into CG-002-A (craft model), CG-002-B (loot log), CG-002-C (timers). This file is historical; do not execute.

# CG-002 — RESUME NOTE (PLANNER checkpoint review → continue)

**From:** PLANNER (0-Wake) · **To:** DOER (1-Stone) · **Date:** 2026-10-06
**Trigger:** Drew routed your Unit 0–3 checkpoint for review. **Accepted —
resume now.** The binding contract is unchanged: `CG/CG-002_TASK.md` remains
the package; this note only records what is DONE, what is NEXT, and three
findings to fold in.

---

## 1. Status at halt (verified by PLANNER against the tree)

| Unit | State |
|---|---|
| Unit 0 baseline + seed freeze (`dock.seed.json`, import-pure) | ✅ DONE |
| Unit 1 `console-server.js` + Unit 2 `--init` (idempotent, spec block exact) | ✅ DONE |
| Unit 2 build passthrough verified (bundles carry `lastSync`/`timers`) | ✅ DONE |
| Unit 3 FIELDS entries (`lastSync`, `bagScrub`, `skipCostPlat`, `endsAt` — labels/usables correct, zero new `usableAs:"price"`) | ⚠ DONE except **F1 below** |
| Unit 4 `dock.html` (timers panel + LAST SYNC + guarded fetch) | ❌ NOT STARTED (file still CG-001 bytes) |
| Unit 5 `dock.test.js` deltas (I13, I23) + L1–L8 | ❌ NOT STARTED |
| Unit 6 `console.test.js` | written, **not fully proven — F3** |
| Unit 7 full diagnostics + `CG-002_REPORT.md` | ❌ NOT DONE |

**Resume at Unit 4 (M4), in package order: M4 → M5 → F1/F2 → Unit 7 → report → HALT.**

## 2. Findings to fold in (from the checkpoint review)

**F1 — `_doc_count` is not the measured truth.** It currently reads
*"24 semantic entries under .fields + 58 structural keys under .structure = 82."*
Measured: **25 fields · 55 non-underscore structure keys · 80 total** (structure
holds 60 keys of which 5 are `_doc*` — P9's convention filters `_`-prefixed).
Fix the string to 25 / 55 / 80. Note the correction in the report.

**F2 — the WASH mtime baseline was not captured at Unit 0** (your note: "not
inspected by mtimes"). Git cannot cover it — `WASH/` is untracked, no HEAD
baseline. Recovery: **capture ALL WASH file mtimes NOW**, and state plainly in
the report that the baseline was recorded late, that every package target is
under `CG/`, and that no WASH file was opened for write. Honest, not omitted.

**F3 — "manual checks confirm C5" does not count as the suite passing.**
PLANNER's own run of `console.test.js` against the current server threw a real
timeout at `console.test.js:44` (the C5 persistence re-boot). Unit 7 requires
a **full, unfiltered run**. Diagnose the timeout (client request-timeout too
tight vs. the POST actually hanging — measure it, don't assume). If it cannot
pass as written, that is a FINDING to report — never an output to filter away.

## 3. Exit expectations (report measured numbers, never assumed)

- `node CG/dock.test.js` — all green. Expected total **60** (52 CG-001
  assertions with the TWO named deltas + 8 new L). Report the real count.
  Note honestly: between `--init` and DELTA 1 landing, I13 reads RED — that
  is the predicted pre-delta state, not a defect. At exit it must be green.
- `node CG/console.test.js` — **15/15**, unfiltered, C5–C15 visible.
- Both suites green twice consecutively; rebuild ×2 byte-identical;
  seed hash unchanged; xlsx `11030`/mtime unchanged; probe snapshots +
  `api-surface.md` + `probe.js` hashes unchanged; WASH mtimes (late
  baseline) unchanged between capture and exit; nothing staged; no commit.
- `CG/CG-002_REPORT.md` planted: what was built, exact counts, both deltas
  documented, F1–F3 dispositioned, findings reported-not-bent, NOT-done list
  (no chat, no probe, no timers/dates seeded by you, Drew's manual gate
  status — **render unverified is an honest state** until Drew runs it).
- Then **HALT.** No CG-003/CG-004/CG-005 work, no adjacent fixes.

## 4. Scope reminder

Unchanged from the package: two named deltas ONLY (I13, I23); any other
existing-assertion failure = STOP + report. Zero dependency. No `/chat`, no
LLM spawn, no Electron. Writes only under `CG/`. This note file and
`CG-002_TASK.md` are read-only while executing.
