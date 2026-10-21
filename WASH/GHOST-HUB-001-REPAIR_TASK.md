# GHOST-HUB-001-REPAIR — PRE-EXISTING SUITE DEFECTS + STALE ALIAS DOCS (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (2026-09-21 — "yes" to the repair, "yes" to the JSDoc kill)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. **VCS HOLD — no commits.**

---

## 1. Intent (what this leaf fixes)

Three pre-existing defects surfaced by the V-D-000 suite run (reported by
Stone in `WASH/V-D-000_BOOTSTRAP_REPORT.md`, §Unit 4). All are server-side or
doc-only; NO test-file edits are needed — the fixes honor the ORIGINAL test
contracts:

1. **SSE heartbeat no-show.** `hub-server.js` `handleSSE()` sends a keepalive
   every **15000ms**; GHOST-HUB-001 test 4 only waits ~**5000ms** (50 × 100ms) →
   the test can never observe a heartbeat as written. (A `read ECONNRESET`
   around 25–40ms was also observed once — see the STOP rule in Unit 2.)
2. **Missing `spawned` field.** GHOST-HUB-001 test 5 asserts `data.spawned ===
   true` — the ORIGINAL 001-contract field — but `handleSpawn()`'s close
   response never emits it. Other suites assert the newer `ok` field via
   individual assertions (not deep-equality), so adding `spawned: true` is
   additive and safe.
3. **Stale alias documentation (Drew ruling: kill).** `seatedAgentMap()`'s
   JSDoc still claims "the static wash → 0-wake alias (proven pattern)" and
   the catch comment claims "only the wash alias remains". Both died in
   GHOST-HUB-008; the docs must die with them.

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub-server.js` | EDIT — 3 deltas (§4.2–4.4) |
| `WASH/GHOST-HUB-001-REPAIR_REPORT.md` | CREATE — report + HALT |

NOT touched: `WASH/GHOST-HUB-001.test.js` (no test edits), every other WASH/
file, `.opencode/`, `opencode.json`, `ED/` docs, Pad/Log/Bible/MILESTONES,
game code. Live hub/WASH processes OFF-LIMITS.

## 3. Unit 0 — Baseline gate proof (record BEFORE editing)

1. `node --version`.
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen` — record.
4. **Reproduce:** run `node --test WASH/GHOST-HUB-001.test.js` on the CURRENT
   code. Record the exact failures + full error traces (must match the
   V-D-000 report: test 4 SSE fail, test 5 `spawned` fail; everything else
   green).

## 4. Units

### 4.1 Unit 1 — Read-before-edit

Read the three regions in `hub-server.js`:
- `handleSSE()` (~lines 388–408) — the heartbeat block.
- `handleSpawn()` close handler (~lines 634–648) — the response object.
- `seatedAgentMap()` JSDoc + catch (~lines 437–454) — the stale alias doc.
Record the exact on-disk bytes of every oldString (include the `→` arrow and
`—` em-dash verbatim where present).

### 4.2 Unit 2 — Delta A: heartbeat 15000 → 2000

In `handleSSE()`, change the interval from 15000 to 2000, keeping the comment
shape intact:

```js
// Before:
    }, 15000);
// After:
    }, 2000); // GHOST-HUB-001-REPAIR: 2s keepalive — 15s outran the suite's 5s window
```

Nothing else in `handleSSE()` changes (`: connected\n\n`, the try/catch, the
`req.on("close")` cleanup all stay).

**STOP rule:** after this delta, re-run ONLY test 4
(`node --test --test-name-pattern "4 ·" WASH/GHOST-HUB-001.test.js`). If test 4
passes, continue. If it STILL fails with `read ECONNRESET` (a genuine
connection reset, not a timing artifact), STOP — do NOT improvise. Record the
full trace in the report and flag for PLANNER (BROWN BANANA BREAD if anything
looks dangerous); a follow-up package will be planted with the trace.

### 4.3 Unit 3 — Delta B: add `spawned: true`

In `handleSpawn()`'s close handler response object, add the original-contract
field immediately after `ok: true,`:

```js
// Before:
        sendJson(res, 200, {
          ok: true,
          pid: child.pid,
// After:
        sendJson(res, 200, {
          ok: true,
          spawned: true, // GHOST-HUB-001-REPAIR: original 001 test contract
          pid: child.pid,
```

Nothing else in the response object changes. (Verified safe: no suite
deep-equals the spawn response; 002/008 assert fields individually.)

### 4.4 Unit 4 — Delta C: kill the stale alias documentation (2 spots)

**C1 — the JSDoc.** Replace the alias-mentioning JSDoc with the accurate one:

```js
// Before:
/**
 * Seated opencode agent map, derived at request time from .opencode/agents/*.md
 * stems, PLUS the static wash → 0-wake alias (WASH is the ghost of Wake —
 * proven pattern). Unknown/seated-specter codes are NOT on the map → 400.
 */
// After:
/**
 * Seated opencode agent map, derived at request time from .opencode/agents/*.md
 * stems. Unknown/seated-specter codes are NOT on the map → 400.
 */
```

**C2 — the catch comment.** Replace the same-class stale line:

```js
// Before:
    /* agents dir missing — only the wash alias remains */
// After:
    /* agents dir missing — no seats resolve */
```

Match `→` / `—` characters verbatim from the on-disk bytes (record in the
report what you matched).

### 4.5 Unit 5 — Run (all runnable suites)

- `node --test WASH/GHOST-HUB-001.test.js` — expect **10/10** (the repair's
  DoD is a fully green 001).
- `node --test WASH/wash.test.js` — 4748 (skip ONLY if a live console holds it).
- `node --test WASH/GHOST-HUB-002.test.js` — 4749 (SKIP-with-reason if the live hub holds it).
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754.
- `node --test WASH/GHOST-HUB-008.test.js` — 4755.

Green is mandatory for suites you CAN run. No hack-around for red — STOP and
report. This run should close the "8/9 green" gap from V-D-000.

### 4.6 Unit 6 — Verification (diagnostics)

1. Grep proofs:
   - `hub-server.js` contains `}, 2000)` + the 2s comment — PASS.
   - `hub-server.js` contains `spawned: true` — PASS.
   - `hub-server.js` does NOT contain `wash → 0-wake alias` and does NOT
     contain `only the wash alias remains` — PASS.
2. Live surfaces: ports 4748/4749 state — record; do not stop them.
3. `git status --short` — leaf changes confined to `hub-server.js` (+ this
   report); **no commit (VCS HOLD)**.
4. Boundary held — GHOST-HUB-001.test.js untouched, no other file changed —
   PASS/FAIL.

### 4.7 Unit 7 — Report + HALT

1. Plant `WASH/GHOST-HUB-001-REPAIR_REPORT.md` — restated scope, unit-by-unit
   results (baseline repro traces, the three deltas with matched bytes, test
   pass lines, honest NOT-DONE list, any STOP traces).
2. HALT. No canon docs, no commits.

## 5. Definition of Done

1. GHOST-HUB-001 suite **10/10 green** on the current code (no test edits).
2. `spawned: true` present; heartbeat 2000ms; stale alias docs gone.
3. All runnable suites green (002–008 + wash.test.js), no skips except
   port-held with reason.
4. Boundary held; VCS HOLD.
5. Drew's hands-on maintained: this leaf changes NO UI surface — the hub will
   look identical after, just with the suite truthfully green.

## 6. Guardrails

- Touch ONLY `WASH/hub-server.js` + this report (+ throwaway run helpers if
  needed for repro, created and deleted inside the leaf; record them).
- Live hub/WASH processes OFF-LIMITS — never kill/restart Drew's windows.
- Zero discretion: any surprise (esp. SSE ECONNRESET persistence) → STOP and
  report (BROWN BANANA BREAD for danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, all `.opencode/` — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.