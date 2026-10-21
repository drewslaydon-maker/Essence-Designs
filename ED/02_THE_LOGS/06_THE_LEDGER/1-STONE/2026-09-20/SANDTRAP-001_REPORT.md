# SANDTRAP-001 REPORT — UNLOCK THE SANDTRAP: STUDIO SPAWN DISCIPLINE

> **From:** DOER (1-Stone) → **For:** Drew / PLANNER
> **Executed:** 2026-09-20 · **Status:** EXECUTED — HALTED per package
> **Package:** `ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001_TASK.md`

## Restated scope (as executed)

Create exactly 3 new zero-dep files under `ED/00_ESSENCE_CORE/INFRA/`
(`SANDTRAP_DISCIPLINE.md`, `spawn-safe.js`, `SANDTRAP-001.test.js`), append
the exact constraining text to `SYSTEM_ARCH.md` (PART 5) and
`01_OPERATING_CORE.md` (§9 bullet), run the offline tests, plant this report,
HALT. VCS HOLD — no commit. Studio-infra scope only; opencode config /
agent-spawn layer is a follow-up leaf, not touched. WASH is a reference, not
a target.

## Unit 0 — Baseline gate proof (BEFORE build)

1. `node --version` → **v24.19.0** (Node built-ins are the only runtime).
2. `ED/00_ESSENCE_CORE/INFRA/` at baseline contained ONLY: `desktop.ini`,
   `icon.ico`, `SANDTRAP-001_TASK.md` (the planted package itself), and
   `SYSTEM_ARCH.md`. Nothing else.
3. **Proven fix reference read** — `WASH/server.js:183-187`. Exact stdio line
   (line 186):
   > `stdio: ["ignore", "pipe", "pipe"], // stdin must be ignored: a piped stdin stalls opencode run (WASH-001 discovery)`
   Plus `windowsHide: true` (line 185) and `cwd: ROOT` (line 184). The
   `resolveOpencode()` env-override pattern was honored in the law text
   (Law #5).
4. `git status --short` baseline recorded — heavy pre-existing dirty state
   (AGENTS.md, BIBLE, 01_OPERATING_CORE.md [already M], GAME_CATALOG, DESIGNS/
   AGENT_BOOT_PROMPT, DISCOVERIES, MILESTONES, CAPTAIN LOG, LAG game dir tree,
   Guru helper files, opencode.json M, untracked `.opencode/*`, `WASH/`,
   `06_THE_LEDGER/`, etc.). None touched.

## Unit 1 — `SANDTRAP_DISCIPLINE.md` (the Law)

- Created: `ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md`.
- Structure kept exactly per package (header blockquote, 6 laws, Boundaries,
  Verification checklist). Tidy whitespace only.

## Unit 2 — `spawn-safe.js` (the helper)

- Created: `ED/00_ESSENCE_CORE/INFRA/spawn-safe.js`.
- Implementation = the package's exact code (zero-dep, `child_process` only).
  Returns child with `stdio: ["ignore","pipe","pipe"]`, `windowsHide: true`,
  10-minute timeout kill cleared on `close`.

## Unit 3 — `SANDTRAP-001.test.js` + run

- Created: `ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001.test.js`.
- **Runner used: plain `node` assert script** →
  `node ED\00_ESSENCE_CORE\INFRA\SANDTRAP-001.test.js`
  (works standalone; also runnable via `node --test`).
- Exact output (4 passed, 0 failed):

```
[SANDTRAP-001.test] proving the Sandtrap law offline (node v24.19.0)...
PASS  1. spawn captures stdout without a terminal, exit 0 (sandtrap-ok)
PASS  2. law config is non-inheriting (stdin=null, stdio[0]=null, pipes on 1/2)
PASS  3. kill-point fires (runaway child killed within 2000ms)
PASS  4. spawn error surfaces (missing bin -> 'error' event)
[SANDTRAP-001.test] 4 passed, 0 failed
[SANDTRAP-001.test] ALL TESTS PASSED — Sandtrap law proven offline.
```

- Empirical note: on Node v24.19.0 (Windows), the ignored stdin arm surfaces
  as `child.stdin === null` and `child.stdio[0] === null`; the piped arms are
  real streams distinct from `process.stdout`/`process.stderr`. Test 2 asserts
  these facts.

## Unit 4 — Constraint doc updates (exact text)

**A. `ED/00_ESSENCE_CORE/INFRA/SYSTEM_ARCH.md`** — appended after PART 4,
before the closing line (verified via `git diff`: **this is the ONLY change
to the file** — 10 added lines):

```markdown
## PART 5: SANDTRAP — SPAWN DISCIPLINE (2026-09-20)

The terminal/window gates (the Sandtrap) are governed by the Sandtrap law:
every studio subprocess spawn uses `stdio: ["ignore","pipe","pipe"]`,
`windowsHide`, and a kill-point — see `SANDTRAP_DISCIPLINE.md` +
`spawn-safe.js` in this folder. Boundary: the opencode config/agent-spawn
layer is a follow-up leaf.
```

**B. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`** — appended in §9
Constraints & Environment, directly after the Layer 3 bullet (line 111):

```markdown
- **Sandtrap law (2026-09-20):** every studio subprocess spawn uses
  `stdio: ["ignore","pipe","pipe"]` + `windowsHide` + a kill-point
  (`ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md`, `spawn-safe.js`).
```

No other line of either file touched.

## Unit 5 — Verification

| Check | Result |
|---|---|
| 1. Three new files exist under `INFRA/` | **PASS** (`SANDTRAP_DISCIPLINE.md`, `spawn-safe.js`, `SANDTRAP-001.test.js`; listing verified) |
| 2. `SANDTRAP-001.test.js` passes | **PASS** — 4/4, exact lines above |
| 3. `SYSTEM_ARCH.md` contains `PART 5: SANDTRAP` | **PASS** — line 71; `git diff` shows only PART 5 added |
| 4. `01_OPERATING_CORE.md` §9 contains the Sandtrap law bullet | **PASS** — line 111, exactly after the Layer 3 bullet |
| 5. `git status --short` — leaf changes only | **PASS** — leaf changes = 3 new untracked files + `SYSTEM_ARCH.md` (M, diff = only PART 5) + `01_OPERATING_CORE.md` (M: pre-existing modifications cited at baseline + the single tasked append). All other dirty paths are pre-existing baseline state, untouched. |
| 6. Boundary held: no `.opencode/` or `opencode.json` change | **PASS** — both were already dirty/untracked at baseline; this leaf made no changes there |

## Deviations / notes

- **None in scoped work.** Zero-discretion kept: no extra files, no
  improvisations, WASH untouched, no game code, no Pad/Log/Bible/MILESTONES.
- Diagnostic probe run before tests: a read-only `node -e` child spawn
  (Node built-ins) to empirically record the `child.stdio` shape for the
  ignored stdin arm — no repo files changed by it.
- `01_OPERATING_CORE.md` carried pre-existing uncommitted worktree changes at
  baseline; only the tasked bullet was appended by this leaf.

## NOT-DONE list (honest)

- **No commit / no staging** (VCS HOLD respected).
- `.opencode/` config/agent-spawn layer — explicitly out of scope (follow-up
  leaf per Drew's ruling).
- No WASH modifications (reference only).
- No Captain's Log / Bible / MILESTONES / Pad updates (package forbade).

## DoD Check

1. 3 files created, zero-dep — **MET**
2. Tests green, recorded honestly — **MET** (4/4)
3. Both docs carry the exact constraining lines, nothing else changed — **MET**
4. Boundary held (`.opencode/` + `opencode.json` untouched) — **MET**
5. Report planted; no staging residue created; VCS HOLD respected — **MET**
6. **HALTED** — awaiting routing for the follow-up leaf (GHOST HUB mandate) or
   Drew's next package.

---

**EXECUTED 2026-09-20 by DOER (1-Stone). Single Output Stop observed.**