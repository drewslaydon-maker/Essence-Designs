# COURRIER-GHOST-HUB-SEAL-FERRY-TASK — RECEIPT FERRY (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** COURRIER (B-Bolt) ·
**Approved by:** Drew Slaydon ("A first, then B", 2026-09-20)

> **GATED.** This ferry executes ONLY after (1) the Seal-gate audit
> (`WASH/GHOST-HUB-AUDIT-001_TASK.md`) runs and Drew resolves its findings,
> and (2) Drew confirms the GHOST-HUB-001→006 wave is sealed. If any RED or
> unresolved finding stands, STOP and report — do not move anything.

---

## 1. Scope

Move the completed-work receipts of the GHOST-HUB-001→006 wave from `WASH/`
into the Chamber (`ED/02_THE_LOGS/06_THE_LEDGER/`), under the executor code
sign **1-STONE**, dated **2026-09-20** (all seven leaves were executed by DOER
(1-Stone) per their reports).

Exact manifest — **14 files** (7 TASK + 7 REPORT pairs; tests stay with the
code in `WASH/`, they are not receipts):

| From `WASH/` | To `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-20/` |
|---|---|
| `GHOST-HUB-001_TASK.md` + `GHOST-HUB-001_REPORT.md` | same names |
| `GHOST-HUB-002_TASK.md` + `GHOST-HUB-002_REPORT.md` | same names |
| `GHOST-HUB-002-CONT_TASK.md` + `GHOST-HUB-002-CONT_REPORT.md` | same names |
| `GHOST-HUB-003_TASK.md` + `GHOST-HUB-003_REPORT.md` | same names |
| `GHOST-HUB-004_TASK.md` + `GHOST-HUB-004_REPORT.md` | same names |
| `GHOST-HUB-005_TASK.md` + `GHOST-HUB-005_REPORT.md` | same names |
| `GHOST-HUB-006_TASK.md` + `GHOST-HUB-006_REPORT.md` | same names |

NOT moved: audit package/report (`GHOST-HUB-AUDIT-001_*` stays in `WASH/` as
the audit record until Drew files it), test files (`GHOST-HUB-00*.test.js`,
`wash.test.js`), any code (`hub.html`, `hub.css`, `app.js`, `style.css`,
`hub-server.js`, `hub-agents.json`, `server.js`, `index.html`,
`electron-main.js`, `install.js`, `package.json`), `.gitignore`, `README.md`,
`bun.lock`.

## 2. Units

### Unit 0 — Baseline (verify the gate)
1. Confirm the gate is OPEN: `WASH/GHOST-HUB-AUDIT-001_REPORT.md` exists and
   Drew has ruled on its findings. If missing or unresolved → **STOP**, report
   the gate state, do not move a file.
2. Confirm all 14 source files exist in `WASH/` (record `Test-Path` lines).
3. Confirm destination dir `ED/02_THE_LOGS/06_THE_LEDGER/1-STONE/2026-09-20/`
   exists (seed record `2026-09-20` already holds WASH-001/SANDTRAP-001/
   ENSHRINE-001 pairs; create only if truly absent).

### Unit 1 — Move (MOVE, not copy)
For each of the 14 files: `Move-Item -LiteralPath <src> -Destination <dir>`.
No renames. No content edits. No other files.

### Unit 2 — Verify
1. Every source path now returns `False`; every destination path `True` —
   record per-file.
2. **Hash-match spot check (WASH-001 precedent):** compute
   `Get-FileHash` for at least the 006 pair and one earlier pair, source
   (pre-move, if still available) — if already moved, hash the destination
   file against the hash recorded in the DO's report if present; otherwise
   hash destination and record as the permanent hash.
3. `WASH/` residue: only the audit artifacts `GHOST-HUB-AUDIT-001_*` + the
   code/test files remain from the wave (staging cleared of receipts).

### Unit 3 — Report + HALT
Plant `ED/02_THE_LOGS/06_THE_LEDGER/B-BOLT/2026-09-20/COURRIER-GHOST-HUB-SEAL-FERRY-REPORT.md`
(following the COURRIER ferry report precedent) — manifest, gate state,
per-file move/verify lines, hashes, residue check. HALT. No commits (VCS HOLD).

## 3. Guardrails

- MOVED only the 14 named files; nothing else touched.
- No edits to any receipt content. No renames.
- No live processes killed or started.
- Embargoes hold: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/` —
  read-only.
- Burn < $1.00/hr; stock opencode free-tier LLM.
- Masquerade forbidden: report exactly what moved and what did not.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle), Drew-approved ("A first"),
STANDING-BY until the Seal Gate opens.**
Drew: after the audit resolves and you see the wave sealed, point COURRIER
(B-Bolt) at this file to execute the ferry.