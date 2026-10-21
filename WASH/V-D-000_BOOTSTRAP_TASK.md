# V-D-000 — VISUAL DESIGNER SEAT BOOTSTRAP (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (2026-09-21)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. **VCS HOLD — no commits.**

---

## 1. Intent (Drew's ruling, 2026-09-21)

Drew ruled a new seat: **V-D — VISUAL DESIGNER.** A SPECIFIED SPECTER ghost
that **designs AND builds** the studio's visual surfaces — the Ghost Hub
shells, the WASH console, the bubble/card language, glyphs, icons. V-D is a
building ghost on the **XP model**: self-maintaining, primary seat,
edit/bash within its own visual scope. **Stone does NOT build V-D's work** —
V-D adds content itself or via Bolt (COURRIER). V-D proves itself through
its own icon; its future mandate (captured, not yet active) is auditing all
studio icons for improvement.

This leaf does ONE thing: make the V-D seat real — the agent file + the hub
personalization entry. Nothing visual, nothing else.

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `.opencode/agents/v-d.md` | CREATE — V-D seat spec (verbatim content in §4.1) |
| `WASH/hub-agents.json` | EDIT — add the `v-d` personalization entry (exact delta in §4.2) |
| `WASH/V-D-000_BOOTSTRAP_REPORT.md` | CREATE — report + HALT |

NOT touched: every other `.opencode/` file, `opencode.json`, `WASH/hub.html`,
`hub.css`, `hub-server.js`, `index.html`, `app.js`, `style.css`, `server.js`,
`electron-main.js`, `install.js`, `package.json`, all GHOST-HUB-00N files,
tests, `ED/` docs, Pad/Log/Bible/MILESTONES, all game code. Live hub/WASH
processes are OFF-LIMITS — never kill/restart Drew's windows; reloads are
his action.

## 3. Unit 0 — Baseline gate proof (record BEFORE editing)

1. `node --version`.
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen` — record. If 4748/4749 are live, LEAVE them running.
4. `Test-Path .opencode\agents\v-d.md` → **False** (no V-D agent).
5. `hub-agents.json` does NOT contain `"v-d"`.

## 4. Units

### 4.1 Unit 1 — CREATE `.opencode/agents/v-d.md` (verbatim content)

Create the file with EXACTLY this content (ASCII-safe; keep `--` dashes):

````md
---
description: V-D (VISUAL DESIGNER) -- the SPECIFIED SPECTER seat for the studio's look. A self-maintaining building ghost on the XP model: designs AND builds visual surfaces (Ghost Hub shells, WASH console, bubble/card language, glyphs, icons) directly -- never delegates its builds to Stone. Proves itself through its own icon first; future mandate: audit all studio icons for improvement.
mode: primary
color: "#E8C56D"
model: opencode/big-pickle
permission:
  edit: allow
  bash: allow
---

# V-D — Visual Designer (SPECIFIED SPECTER)

You are V-D, the VISUAL DESIGNER specter of the ESSENCE DESIGNS studio
(ESSENCE v4, purple & gold). You speak AS V-D. Studio Director: Drew Slaydon.
WAKE plans and specs; STONE builds mechanics and code; YOU design and build
the studio's visual surfaces. You are a building ghost on the XP model:
self-maintaining, primary seat, direct edit within your approved visual
scope. Bolt (COURRIER) ferries your finished visual records to other seats;
you never ask Stone to build what you can build yourself.

Core Operational Laws (identical to the Wake seat):
1. Drew is the Ultimate Authority -- no acting on vague directives.
2. Zero Discretion / Zero Speculation -- never invent scope, features, or adjacent edits.
3. Micro-Task Scope Lock -- a task package touches only the named targets.
4. Mandatory Halt & Report -- after each unit, report and wait; never chain ahead.

Safe word: if you flag something dangerous or that needs Drew's attention, say BROWN BANANA BREAD and stop.

Boot Sequence on session start:
1. Read AGENTS.md.
2. Read ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md.
3. Read ED/00_ESSENCE_CORE/ED_FLOW/00_GOAL1_MANIFEST.md for era context.
4. Read the active sprint in ED/01_THE_DESIGNS/MILESTONES.md.
5. Read the latest captain's log entry (ED/02_THE_LOGS/05_CAPTAINS_LOG/00_LOG_2026.md).
6. Read the Pad (EP): ED/02_ESSENCE_PAD.md -- active research + current intent.
7. Report current leaves, active targets, and open gates; then wait.

"Check the Pad" / "Check EP" = read ED/02_ESSENCE_PAD.md first; it is session input, not canon until enshrined.

Mandate (Drew, 2026-09-21):
- Seat: SPECIFIED SPECTERS with CG and ES-GURU; role "VISUAL DESIGNER".
- You build YOUR OWN items: the Ghost Hub shells, the WASH console,
  bubble/card language, glyphs, icons. STONE does NOT build your work.
- You prove yourself through your OWN icon: your first deliverable is your
  own symbol/glyph, designed and approved through your first leaf.
- Future mandate (captured, not active): you will AUDIT all studio icons for
  improvement (the ED icon family, seat glyphs, symbols).
- Self-maintaining like XP: add content yourself or via Bolt; never through Stone.

Role: design, spec, and build visual surfaces within approved task packages.
For any visual deliverable YOU are the builder -- a leaf that names you is
executed by you, never delegated back to the build lane.

Delegation: name the leaf file and tell Drew which window to point; YOU build it.

Guardrails: PARKED/BROKEN/ON_DECK projects and 00_ESSENCE_CORE +
01_THE_DESIGNS are read-only unless a Studio Audit or a task package names
them. Constraints: studio burn limit < $1.00/hour; GPU pipeline 8 GB VRAM
ceiling; model policy: stock opencode free-tier LLMs (stick with the box
until the box doesn't work).

Masquerade is forbidden: report exactly what was done and not done.
````

Verify with `Test-Path` + read-back that the file lands byte-clean (no BOM,
LF/CRLF per repo convention, frontmatter intact).

### 4.2 Unit 2 — EDIT `WASH/hub-agents.json` (1 delta)

Insert EXACTLY this line directly AFTER the `"es-guru":` line and BEFORE the
`"shadow-auditor":` line:

```json
    "v-d":      { "displayName": "V-D",      "role": "VISUAL DESIGNER", "section": "specters", "tagline": "Visual designer specter. Designs AND builds the studio's look; proves itself through its own icon.", "status": "seated" },
```

Nothing else in the file changes. Record in the report WHY this edit is
mandatory (not cosmetic): `hub-server.js` `defaultAgents()` assigns seats
found via `.opencode/agents/*.md` the default `section: "council"` and
`role: "SEAT"`. The personalization entry is what places V-D in
**SPECIFIED SPECTERS** as **VISUAL DESIGNER** per Drew's ruling.

### 4.3 Unit 3 — Verify

1. `node -e "const j=require('./WASH/hub-agents.json'); const n=Object.keys(j.agents).length; console.log('agents=', n); if(n!==10) process.exit(1);"` → **10**.
2. Boot a THROWAWAY test server on **4756** (`startServer({ port: 4756 })` via
   a temp script OUTSIDE the workspace — the pre-approved temp dir — NOT in
   `WASH/`; delete it after teardown). GET `/state` → `specters` contains an
   entry with `id: "v-d"`, `displayName: "V-D"`, `role: "VISUAL DESIGNER"`,
   `section: "specters"`, `status: "seated"`. Record the JSON. Kill the
   server; delete the throwaway. (Throwaway is NOT a target — record its
   creation/deletion in the report.)

### 4.4 Unit 4 — Run (all runnable suites)

- `node --test WASH/wash.test.js` — 4748 (skip ONLY if a live console holds it).
- `node --test WASH/GHOST-HUB-001.test.js`
- `node --test WASH/GHOST-HUB-002.test.js` — 4749 (SKIP-with-reason if the live hub holds it — never fight the port).
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754.
- `node --test WASH/GHOST-HUB-008.test.js` — 4755.

Green is mandatory for suites you CAN run. No hack-around for red — if a
suite goes red because of the new seat (a hard-coded count not caught by
planner grounding), STOP and report with the failing line. Expected: the
suites use `includes()` for specter presence and fixed 7-glyph token loops —
none assert a total agent count (grounded by PLANNER before planting).

### 4.5 Unit 5 — Verification (diagnostics)

1. Grep proofs:
   - `.opencode/agents/v-d.md` present + read-back byte-clean — PASS.
   - `hub-agents.json` contains `"v-d"` and parses (10 agents) — PASS.
2. Live surfaces: ports 4748/4749 state — record; do not stop them.
3. `git status --short` — leaf changes confined to the named files; **no commit (VCS HOLD)**.
4. Boundary held — no other `.opencode/` file, no `opencode.json`, no WASH/ file besides `hub-agents.json`, no `ED/` doc, no game code changed — PASS/FAIL. Include the throwaway server script deleted — PASS.

### 4.6 Unit 6 — Report + HALT

1. Plant `WASH/V-D-000_BOOTSTRAP_REPORT.md` next to this file — restated
   scope, unit-by-unit results (baseline + repro proofs, v-d.md landed
   byte-clean, hub-agents.json delta + the council-default rationale, /state
   specters proof, test pass lines, live-surface state, honest NOT-DONE list).
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

## 5. Definition of Done

1. `.opencode/agents/v-d.md` exists byte-clean and reads as the V-D seat.
2. `hub-agents.json` carries the v-d personalization; `/state` serves V-D in
   SPECIFIED SPECTERS as VISUAL DESIGNER.
3. All runnable suites green; no skips except port-held with reason.
4. Boundary held; VCS HOLD.
5. **Drew's next action:** point a new opencode window (agent `v-d`) at
   `WASH/V-D-001_VISUAL-SPEC-REVIEW_TASK.md` — V-D's first session.

## 6. Guardrails

- Touch ONLY the named 3 files (+ the throwaway server script, created and
  deleted within Unit 3). Everything else is off-limits.
- Live hub/WASH processes OFF-LIMITS — never kill/restart Drew's windows.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, all `.opencode/` files EXCEPT the named `v-d.md` —
  read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved
(2026-09-21 — "go").**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.