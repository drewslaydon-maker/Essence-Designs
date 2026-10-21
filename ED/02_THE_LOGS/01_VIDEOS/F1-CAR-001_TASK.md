# F1-CAR-001 — VIDEO LANE PLANT (TASK PACKAGE)

**Leaf:** F1-CAR-001 · **Executor:** DOER (1-Stone, build lane) · **Planted by:** PLANNER (0-Wake)
**Date:** 2026-09-22 · **Approved by:** Drew Slaydon ("2 ok")
**VCS HOLD:** no commits. Scope-locked package — touch ONLY the named targets.

---

## 0. MANDATE — why this package exists

The Invisible F1 Car (Part 1 script, Claude v1) is verified against the
in-house context port (`ED/02_THE_LOGS/GOOGLE_AI_SYNC.md`) and confirmed by
Drew. The script must now live in the videos lane, and the lane's seed doc
must carry the project so the video series is tracked in canon.

## 1. SCOPE LOCK (only these named targets)

| # | Target | Kind | Delta |
|---|---|---|---|
| M1 | `ED/02_THE_LOGS/invisible-f1-car-part1.md` | MOVE + RENAME | Move to `ED/02_THE_LOGS/01_VIDEOS/invisible-f1-car-part1_v1.md` — no duplicate left at the LOGS-root path |
| M2 | `ED/02_THE_LOGS/01_VIDEOS/00_VIDEO_ESSAYS.md` | EDIT | Add ONE queued-topic entry (content specified in §2) to the "## Queued topics" list |
| M3 | `ED/02_THE_LOGS/01_VIDEOS/F1-CAR-001_REPORT.md` | CREATE | Report + HALT |

**Locked out:** `GOOGLE_AI_SYNC.md`, the script's body content (NO editing of
the Claude script text — the v1 draft is treated as immutable input), every
other file in `01_VIDEOS/` (do not touch `SynthBelief.md`), every other
WASH/ED/LEGACY file, `.opencode/`, `opencode.json`, game code.

## 2. M2 CONTENT — the seed-doc entry (append to "## Queued topics," verbatim block)

```markdown
- **The Invisible F1 Car** — 3-part Warframe critique/redesign series, a
  connected STANDALONE (not part of the numbered spine), target audience:
  Digital Extremes (submission piece). Part 1 script filed:
  `invisible-f1-car-part1_v1.md`. Canon concept name: **Resonance** (Drew
  ruling 2026-09-22 — the end-of-mission honor bow protocol; tag taxonomy
  still open, carried to the Part 1 v2 script review). Production notes:
  fresh-account capture from Julia's PS5 account (real noob arc, Mag +
  Braton/Furis/Bo) + optional PC alt with an Excalibur pick for the
  noobtrap experience. Co-op capture limited by the pending P2P fix —
  solo capture unaffected.
```

Keep the existing bullets untouched; insert this as a new bullet after the
"**Asmongold piece**" bullet (end of the Queued topics list). No other edits
to the file.

## 3. UNITS

### 3.1 Unit 1 — Verify baseline BEFORE any edit
1. Confirm `ED/02_THE_LOGS/invisible-f1-car-part1.md` exists at the LOGS-root
   path (record file size + LastWriteTime).
2. Confirm `ED/02_THE_LOGS/01_VIDEOS/00_VIDEO_ESSAYS.md` does NOT yet contain
   "The Invisible F1 Car".
3. `git status --short` — record the pre-existing tree (**VCS HOLD**, no
   commits before or after).

### 3.2 Unit 2 — M1 (move + rename)
Move `invisible-f1-car-part1.md` → `01_VIDEOS/invisible-f1-car-part1_v1.md`.
Verify the file exists at the new path with identical size/bytes and does NOT
exist at the old path (no duplicate).

### 3.3 Unit 3 — M2 (seed-doc entry)
Append the §2 block to "## Queued topics" after the Asmongold bullet, exactly
as specified. No other changes to the file.

### 3.4 Unit 4 — Diagnostics + report + HALT
1. Grep `01_VIDEOS/00_VIDEO_ESSAYS.md` → contains "The Invisible F1 Car",
   "Resonance", "invisible-f1-car-part1_v1.md".
2. Grep LOGS root → `invisible-f1-car-part1.md` ABSENT (move, not copy).
3. Confirm body of `invisible-f1-car-part1_v1.md` byte-match unchanged vs the
   pre-move record (content untouched — the v1 draft is immutable input).
4. `git status --short` — record leaf surface (only the named targets).
5. Plant `ED/02_THE_LOGS/01_VIDEOS/F1-CAR-001_REPORT.md`: restated scope,
   unit results, honest NOT-DONE list. HALT.

## 4. DEFINITION OF DONE

- [ ] Script lives ONLY at `01_VIDEOS/invisible-f1-car-part1_v1.md`, bytes
      identical to the source.
- [ ] Seed doc has the single §2 entry; Queued-topics structure intact.
- [ ] Zero edits to the script body, `SynthBelief.md`, `GOOGLE_AI_SYNC.md`,
      or any other file.
- [ ] VCS HOLD honored — no commit.
- [ ] Report planted + HALT.

## 5. HALT

Report exactly what was done and not done; masquerade is forbidden. Do NOT
self-forward — Drew routes the next seat (likely COURRIER for the ledger
ferry, or back to production planning for Part 1 v2).