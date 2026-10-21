# SANDTRAP-001 — UNLOCK THE SANDTRAP: STUDIO SPAWN DISCIPLINE (TASK PACKAGE)

> **From:** PLANNER (0-Wake) → **For:** Drew's approval (given 2026-09-20 —
> "sandtrap fix first, and just studio infra first") → **Executed by:** DOER
> (1-Stone)
> **Plant:** 2026-09-20 · **Status:** AWAITING EXECUTION (Drew points the DO
> window here)
> **Purpose:** Drew's directive (2026-09-20): the terminal/window gates — the
> **Sandtrap** — must be unlocked. Genesis ran agents in **safe mode** because
> of them; with process-level proof in hand (WASH's stdio fix), this leaf
> codifies the **SANDTRAP SPAWN LAW** as studio infra so multi-agent long-form
> dev can run without terminal locks.
> **Scope ruling (Drew):** studio-infra scope ONLY. The opencode
> config/agent-spawn layer (`.opencode/`, `opencode.json`, multi-window boot
> discipline) is a **follow-up leaf** — NOT this package.
>
> **THE PROVEN FIX (do not rediscover):** WASH discovered that a **piped
> stdin stalls `opencode run`** — the fix is `stdio: ["ignore", "pipe",
> "pipe"]` + `windowsHide: true`. Cited at `WASH/server.js:184-187` (read it,
> honor it, encode it).

---

## 1. What this leaf creates

Studio-infra spawn discipline in THE ENGINE (`ED/00_ESSENCE_CORE/INFRA/`):

1. `SANDTRAP_DISCIPLINE.md` — the **Sandtrap law** (doctrine).
2. `spawn-safe.js` — a **zero-dep reusable spawn helper** encoding the law.
3. `SANDTRAP-001.test.js` — offline proof (node built-ins only).
4. One-line constraining updates to `SYSTEM_ARCH.md` and
   `01_OPERATING_CORE.md` (exact text given — read-only otherwise).

Nothing else. No `.opencode/`, no `opencode.json`, no agent files, no game
code, no WASH (WASH already carries the fix; it is the reference, not a
target).

## 2. Mandatory pre-reads

1. `AGENTS.md` (repo root) — studio boot contract.
2. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md` — esp. §8 Guardrails,
   §9 Constraints, §10 DoD.
3. `ED/00_ESSENCE_CORE/INFRA/SYSTEM_ARCH.md` — the arch doc you will update.
4. `WASH/server.js` lines 180-200 — **the proven fix** (read + honor).
5. `ED/02_ESSENCE_PAD.md` — the Sandtrap directive entry (2026-09-20).

## 3. Units (execute in order; do NOT chain beyond this package)

### Unit 0 — Baseline gate proof (BEFORE any build)

Record exact outputs:

1. `node --version` (Node built-ins are the only runtime).
2. Confirm `ED/00_ESSENCE_CORE/INFRA/` currently contains ONLY:
   `desktop.ini`, `icon.ico`, `SYSTEM_ARCH.md` (cite what you find).
3. Read `WASH/server.js:180-200` — record the exact stdio line
   (`stdio: ["ignore", "pipe", "pipe"]`) as the reference.
4. `git status --short` — record pre-existing dirty paths (do NOT touch them;
   **VCS HOLD — no commits in this leaf**).

### Unit 1 — Create `ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md`

The **Sandtrap law**. Use this structure (tidy whitespace allowed, keep every
section):

```markdown
# SANDTRAP — Studio Spawn Discipline (the Law)

> Codified 2026-09-20 (SANDTRAP-001). Drew named the terminal/window gates
> the **Sandtrap**. Genesis ran agents in safe mode because a spawned child
> that inherits a live terminal can lock the window chain. WASH proved the
> fix in-process (2026-09-20): a **piped stdin stalls `opencode run`** —
> the child must spawn with stdin ignored and stdout/stderr piped.
> This law makes every studio spawn Sandtrap-safe.

## The Law (mandatory for every studio subprocess spawn)

1. **Never inherit a live terminal.** Every spawn of a subprocess from a
   studio server/agent/console MUST use
   `stdio: ["ignore", "pipe", "pipe"]` (stdin ignored; stdout/stderr piped
   for capture/relay).
2. **Hide the window.** Use `windowsHide: true` on Windows so a stray
   window cannot take focus from the terminal chain.
3. **Every spawn gets a kill-point.** Attach a timeout kill (WASH uses a
   10-minute safety kill) and a full kill on parent teardown/response close.
   No child outlives its context.
4. **Handle error surfaces.** Attach `error` (spawn failure) and `close`
   (cleanup) handlers on every child. Never treat spawn as fire-and-forget.
5. **Resolve real binaries by path.** npm `.ps1`/`.cmd` shims cannot be
   spawned directly by Node — resolve the real executable (WASH pattern:
   `resolveOpencode()` with an env override).
6. **Use the helper.** Studio servers/servers of ghost agents MUST use
   `spawn-safe.js` (this folder) or equivalently encode the law. Hand-rolled
   spawns that violate the law are Sandtrap risks.

## Boundaries (what this law is NOT)

- This discipline covers the **studio infra harness only**. The opencode
  config/agent-spawn layer (`.opencode/`, `opencode.json`, multi-window boot
  discipline) is a **follow-up leaf** (ruled by Drew 2026-09-20).

## Verification checklist (for any future spawn)

- [ ] `stdio` = `["ignore","pipe","pipe"]` (or explicitly justified)
- [ ] `windowsHide: true` on Windows
- [ ] kill-point (timeout + teardown) attached
- [ ] `error` + `close` handlers attached
- [ ] real binary resolved (no shim spawn)
- [ ] helper used where available
```

### Unit 2 — Create `ED/00_ESSENCE_CORE/INFRA/spawn-safe.js`

Zero-dep helper encoding the law. Use this exact implementation (tidy
whitespace allowed; do not change behavior):

```javascript
"use strict";

/**
 * spawn-safe — the SANDTRAP SPAWN LAW as code (see SANDTRAP_DISCIPLINE.md).
 * Zero-dependency child spawn that never inherits a live terminal:
 * stdin ignored, stdout/stderr piped, window hidden, kill-point attached.
 */

const { spawn } = require("child_process");

/**
 * @param {string} bin   resolved executable path (no shims)
 * @param {string[]} args
 * @param {object} [opts]
 *   cwd       working directory
 *   env       env override (default: process.env)
 *   timeoutMs safety kill (default 600000 = 10 min, WASH precedent)
 * @returns {ChildProcess} child with .stdout/.stderr pipes + kill-point
 */
function spawnSafe(bin, args, opts = {}) {
  const { cwd, env = process.env, timeoutMs = 600000, windowsHide = true } =
    opts;
  const child = spawn(bin, args, {
    cwd,
    env,
    windowsHide,
    stdio: ["ignore", "pipe", "pipe"], // THE LAW — never inherit a terminal
  });

  let killTimer = null;
  if (timeoutMs > 0) {
    killTimer = setTimeout(() => {
      try {
        child.kill();
      } catch (e) {
        /* already gone */
      }
    }, timeoutMs);
  }
  child.on("close", () => {
    if (killTimer) {
      clearTimeout(killTimer);
      killTimer = null;
    }
  });
  return child;
}

module.exports = { spawnSafe };
```

No package.json, no node_modules, no network, no install.

### Unit 3 — Create `ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001.test.js` + run it

Offline assert-based tests (node built-ins only, zero LLM calls). Runnable
via `node --test ED/00_ESSENCE_CORE/INFRA/SANDTRAP-001.test.js` or a plain
`node` assert script — record which you used. Tests:

1. **Spawn captures output without a terminal:** `spawnSafe(process.execPath,
   ["-e", "console.log('sandtrap-ok')"])` → collect stdout, assert it contains
   `sandtrap-ok`, assert exit code 0.
2. **Law config is non-inheriting:** assert the child's `stdio` does not
   include the parent's stdin/stdout (inspect `child.stdio` for `"ignore"`
   on the stdin arm).
3. **Kill-point fires:** `spawnSafe(process.execPath, ["-e",
   "setInterval(()=>{}, 1000)"], { timeoutMs: 300 })` → assert the child is
   killed within 2000 ms and `exitCode`/`signalCode` is set.
4. **Spawn error surfaces:** `spawnSafe("<definitely-missing-bin>", [])` →
   assert an `error` event fires (do NOT throw unhandled).

Record the exact pass/fail lines in the report.

### Unit 4 — Update the two constraint docs (exact target text)

**A. `ED/00_ESSENCE_CORE/INFRA/SYSTEM_ARCH.md`** — append a new part (after
PART 4, before the closing line):

```markdown
## PART 5: SANDTRAP — SPAWN DISCIPLINE (2026-09-20)

The terminal/window gates (the Sandtrap) are governed by the Sandtrap law:
every studio subprocess spawn uses `stdio: ["ignore","pipe","pipe"]`,
`windowsHide`, and a kill-point — see `SANDTRAP_DISCIPLINE.md` +
`spawn-safe.js` in this folder. Boundary: the opencode config/agent-spawn
layer is a follow-up leaf.
```

**B. `ED/00_ESSENCE_CORE/ED_FLOW/01_OPERATING_CORE.md`** — in §9 Constraints &
Environment, append one bullet (after the Layer 3 bullet):

```markdown
- **Sandtrap law (2026-09-20):** every studio subprocess spawn uses
  `stdio: ["ignore","pipe","pipe"]` + `windowsHide` + a kill-point
  (`ED/00_ESSENCE_CORE/INFRA/SANDTRAP_DISCIPLINE.md`, `spawn-safe.js`).
```

Do NOT touch any other line of either file.

### Unit 5 — Verification

1. All three new files exist under `ED/00_ESSENCE_CORE/INFRA/` — PASS/FAIL.
2. `SANDTRAP-001.test.js` passes (record exact lines) — PASS/FAIL.
3. `SYSTEM_ARCH.md` contains `PART 5: SANDTRAP` — PASS/FAIL.
4. `01_OPERATING_CORE.md` §9 contains the Sandtrap law bullet — PASS/FAIL.
5. `git status --short` — the ONLY changes from this leaf are the 3 new
   files + 2 appended docs (cite any pre-existing dirty paths separately,
   do NOT touch them; **VCS HOLD — no commit**).
6. Boundary held: no `.opencode/` or `opencode.json` file changed — PASS/FAIL.

### Unit 6 — Report + HALT

1. Plant `SANDTRAP-001_REPORT.md` next to this task file — restated scope,
   unit-by-unit results (baseline outputs, the files created, the stdio
   reference quote, test pass lines, the exact doc lines added), any
   deviations, honest NOT-DONE list.
2. HALT. Do NOT touch the Captain's Log, Bible, MILESTONES, Pad, or any
   other file. Do NOT commit (VCS HOLD).

---

## 4. Definition of Done (DoD)

1. `SANDTRAP_DISCIPLINE.md` + `spawn-safe.js` + `SANDTRAP-001.test.js`
   created under `ED/00_ESSENCE_CORE/INFRA/`, zero-dep.
2. Tests green (recorded honestly).
3. `SYSTEM_ARCH.md` + `01_OPERATING_CORE.md` carry the exact constraining
   lines (nothing else in those files changed).
4. Boundary held: `.opencode/` + `opencode.json` untouched.
5. Report planted; no staging residue; VCS HOLD respected; HALT.

## 5. Guardrails

- Touch ONLY the named targets: 3 new files under
  `ED/00_ESSENCE_CORE/INFRA/` + the 2 named doc lines. WASH is a reference,
  not a target. No game code, no agent files, no Pad, no Captain's Log.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); do NOT improvise adjacent fixes.
- Masquerade is forbidden: state exactly what ran, what passed, what did
  not. If a test cannot run in this environment, say so — do not fake it.
- **VCS HOLD:** do not commit or amend anything in this leaf.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake).** Drew ruled order: Sandtrap
first, studio-infra scope only. Drew: point the DOER (1-Stone) window at
this file to execute. Executor: restate scope, run, HALT at every unit gate.