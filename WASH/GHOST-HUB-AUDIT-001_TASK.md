# GHOST-HUB-AUDIT-001 — SHADOW SEAL-GATE AUDIT (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** SHADOW AUDITOR (fresh
context, own window — per `LEGACY/VAULT/00_SHADOW_COUNCIL/02_SHADOW_AUDITOR.md`)
· **Approved by:** Drew Slaydon ("A first, then B", 2026-09-20)

> **READ-ONLY PASS. The auditor MUST NOT edit, move, annotate, or PLANT any
> file in the tree — including its own report.** The Auditor runs the pass and
> returns the Audit Findings **in its final output message**. PLANNER (0-Wake)
> plants the findings as `WASH/GHOST-HUB-AUDIT-001_REPORT.md`. Drew converts
> findings into rulings or leaves. (Drew ruling 2026-09-20: "why would an
> auditor plant that? thats your job".)

---

## 1. Charter (from the Shadow Auditor design)

- **MAY** read the whole tree and all documents (embargoes still apply:
  report-and-annotate only, never touch code).
- **MUST** produce an **Audit Findings** report: flags with severity
  (RED = stop / AMBER = drift / NOTED = curiosity), each citing `file:line`.
- **MUST NOT** edit anything, ever. An auditor that edits is auditing its own
  evidence base.
- Runs on a stock opencode free-tier LLM (burn-compliant by construction).

## 2. What this pass covers

The **GHOST-HUB-001→006 wave** — all seven leaves executed by DOER (1-Stone)
on 2026-09-20. The wave is up for the **Seal Gate** (operating core §6 / §10)
after Drew waived the eyeball reload pass ("i dont have it running or its not
open so we should be good" — deferred to next launch, NOT visually verified).

Leaves in scope:

| Leaf | Report | Package |
|---|---|---|
| GHOST-HUB-001 | `WASH/GHOST-HUB-001_REPORT.md` | `WASH/GHOST-HUB-001_TASK.md` |
| GHOST-HUB-002 | `WASH/GHOST-HUB-002_REPORT.md` (STOP at Unit 4 B.2) | `WASH/GHOST-HUB-002_TASK.md` |
| GHOST-HUB-002-CONT | `WASH/GHOST-HUB-002-CONT_REPORT.md` (resumption) | `WASH/GHOST-HUB-002-CONT_TASK.md` |
| GHOST-HUB-003 | `WASH/GHOST-HUB-003_REPORT.md` | `WASH/GHOST-HUB-003_TASK.md` |
| GHOST-HUB-004 | `WASH/GHOST-HUB-004_REPORT.md` | `WASH/GHOST-HUB-004_TASK.md` |
| GHOST-HUB-005 | `WASH/GHOST-HUB-005_REPORT.md` | `WASH/GHOST-HUB-005_TASK.md` |
| GHOST-HUB-006 | `WASH/GHOST-HUB-006_REPORT.md` | `WASH/GHOST-HUB-006_TASK.md` |

## 3. Units

### Unit 0 — Environment (record, nothing runs live)
- `node --version` (expect v24.x).
- `git status --short` — record the pre-existing dirty tree; confirm **no
  commits** were made by the wave (**VCS HOLD** per every leaf).
- Confirm no live surface on 4748 / 4749 / 4750 / 4751 / 4752 / 4753 (record
  whatever you find; do NOT kill or start anything).

### Unit 1 — Per-leaf audit (7 leaves)
For each leaf, compare **package scope → report claims → actual tree state**:
1. **Boundary compliance** — the report's named-files list vs actual diffs:
   does the tree show edits ONLY inside the named targets? (Cross-check
   `git status --short -- WASH/` + the leaf's own boundary claims.)
2. **Scope truth** — did the DO do MORE or LESS than the package specified?
   Flag any unrequested edits or missing mandatory units.
3. **Test claims** — for each leaf that ran suites, do the recorded pass
   lines match the files on disk (suites present, ground truths coherent)?
   Re-RUN nothing is required, but a read may spot-check assertions.
4. **Regression ground truths** — 005 required updates to 002/003/004 suites;
   006 required 005 tokens to stay present. Verify preserved.
5. **VCS HOLD** — no commits by the wave.

### Unit 2 — Known deviation: 006 GLYPH token (MUST surface; Drew's B is pending)
The 006 package §4.3 planted `"es-guru": "sym-guru"`; §5.2 CSS + §8.1 T5 say
`.sym-es-guru`. DOER aligned the map value to `sym-es-guru` (tree:
`WASH/hub.html` GLYPH map). Verify from disk:
- The map value actually in `hub.html` (`file:line`).
- The `.sym-es-guru` CSS rule exists (`hub.css`); no `.sym-guru` rule exists.
- The planted test asserts `sym-es-guru` (`GHOST-HUB-006.test.js` T5).
Report the 2-of-3-references consensus as fact, and flag the deviation for
Drew's ruling. Do NOT judge it sealed; Drew resolves.

### Unit 3 — State-tree drift (report-and-annotate)
- Does `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` still match ground
  truth for the Ghost Hub (it names WASH/hub-server.js + spawn-safe.js — read
  §9)? Flag any mismatch.
- Is there any canon doc claiming the hub wave sealed/filed that is not true?
  (Ledger has NO GHOST-HUB receipts yet — good; confirm.)
- Note (NOTED) that MILESTONES.md last-updated 2026-09-19 predates the hub
  wave — whether a hub milestone entry is needed is Drew's call, not the
  auditor's.
- Pad (`ED/02_ESSENCE_PAD.md`) is session input, not canon — no findings based
  on it unless it contradicts a canon claim.

### Unit 4 — Verdict
- Per-leaf: RED / AMBER / NOTED flags with `file:line` citations.
- Overall: does the wave clear the Seal Gate? A leaf does NOT seal while RED
  or unresolved findings stand.

## 4. Definition of Done

1. Audit Findings report planted at `WASH/GHOST-HUB-AUDIT-001_REPORT.md`
   (blank slate, findings with severity + `file:line`, per-leaf verdicts,
   overall seal recommendation).
2. HALT. Do NOT plant follow-up leaves. Do NOT edit docs. No commits —
   VCS HOLD.

## 5. Guardrails

- Read-only, always. Editing anything = mission failure.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `.opencode/`, `opencode.json` — read-only, report-and-annotate only.
- No game code touched. No live processes killed or started.
- Burn < $1.00/hr; stock opencode free-tier LLM.
- Masquerade forbidden: state exactly what was read and what was found.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle), Drew-approved ("A first").**
Drew: point a fresh opencode window (the Auditor) at this file to run the pass.