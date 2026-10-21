# GHOST-HUB-001-REPAIR-2 — HARNESS POOL-STALE FIX (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (2026-09-21 — "lets do the micro repair")

> Scope-locked package. One-line test-harness delta, root-caused and
> empirically proven by PLANNER. Touch ONLY the named targets. Run, report,
> HALT. **VCS HOLD — no commits.**

---

## 1. Intent (what this leaf fixes)

GHOST-HUB-001 test 4 (`GET /events` SSE heartbeat) fails **only on full-suite
runs** with `read ECONNRESET` at ~15ms — NOT a server defect (heartbeat 2s,
server healthy, test 4 passes in isolation at 2431ms). PLANNER's probes proved
the exact trigger: **test 1 asserts `conn.status` but never consumes the
response body** → a mid-response socket stays in undici's keep-alive pool on
the shared port 4749 → when the next test boots a fresh server on the same
port, test 4's SSE fetch reuses that stale socket → ECONNRESET.

Proof (PLANNER, temp probes — logs in `GHOST-HUB-001-REPAIR_REPORT.md` §9
context and this package): exact suite preamble → 6/6 ECONNRESET; identical
preamble with the body consumed → 6/6 connected. The fix is one line and
changes **zero assertions**.

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/GHOST-HUB-001.test.js` | EDIT — ONE delta (test 1 consumes body) — §3 |
| `WASH/GHOST-HUB-001-REPAIR-2_REPORT.md` | CREATE — report + HALT |

NOT touched: `WASH/hub-server.js` (already repaired in GHOST-HUB-001-REPAIR —
do not touch again), every other WASH/ file, `.opencode/`, `opencode.json`,
`ED/` docs, game code. Live hub/WASH processes OFF-LIMITS.

## 3. The single delta (character-exact)

In `GHOST-HUB-001.test.js`, test 1 (lines ~32–37):

```js
// Before:
test("1 · server boots bound to 127.0.0.1 on port 4749", async () => {
  await withServer(async () => {
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);
  });
});

// After:
test("1 · server boots bound to 127.0.0.1 on port 4749", async () => {
  await withServer(async () => {
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);
    await conn.text(); // REPAIR-2: consume body so the pooled socket isn't mid-response when the server closes (SSE ECONNRESET)
  });
});
```

No other byte changes in the file. Do NOT touch test 4's heartbeat assertion,
do NOT touch the `PORT`/`BASE`/`withServer` scaffolding, do NOT weaken any
check.

## 4. Units

### 4.1 Unit 0 — Baseline gate proof (record BEFORE editing)
1. `node --version`.
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen` — record.
4. `node --test WASH/GHOST-HUB-001.test.js` on CURRENT code — record the
   expected `pass 9 / fail 1` + the test-4 ECONNRESET trace (must match stem).
   (Optional: also record that `--test-name-pattern "4 ·"` passes — proves the
   server-side heartbeat fix is intact.)

### 4.2 Unit 1 — Apply the delta
Apply the §3 delta precisely. Read the region first; match bytes exactly
(indentation: 4 spaces). Record the before/after in the report.

### 4.3 Unit 2 — Gold run: GHOST-HUB-001 full suite
`node --test WASH/GHOST-HUB-001.test.js` — expect **10/10 PASS**. Run it
**three times** to prove determinism (the race was run-order-dependent; all
three must be green). If ANY run still shows ECONNRESET on a full run:
STOP, record the trace, do NOT improvise — flag for PLANNER.

### 4.4 Unit 3 — Full regression (all runnable suites — no V-D running now, ports are yours)
Run and record each (green mandatory):
- `node --test WASH/wash.test.js` — 4748.
- `node --test WASH/GHOST-HUB-002.test.js` — 4749.
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751 (note: still asserts
  `v0.3 — Sandtrap-secured` — that's the V-D-002 named delta, NOT yours).
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- `node --test WASH/GHOST-HUB-007.test.js` — 4754.
- `node --test WASH/GHOST-HUB-008.test.js` — 4755.

No skips. Suite set must be **fully green** (001 10/10 + 002–008 + wash).

### 4.5 Unit 4 — Verification diagnostics
1. Grep proof: `GHOST-HUB-001.test.js` contains
   `await conn.text(); // REPAIR-2` — PASS. File contains NO other artifact of
   this leaf (no other new lines beyond the delta + comment).
2. `git status --short` — leaf changes confined to `GHOST-HUB-001.test.js` +
   this report (**VCS HOLD**, no commits).
3. Boundary held: `hub-server.js` untouched (its 3 deltas from
   GHOST-HUB-001-REPAIR still intact — verify grep: `}, 2000)`,
   `spawned: true`, `no seats resolve`); no other file changed — PASS/FAIL.
4. Live surfaces: record port state at start and end; never stop the live hub.

### 4.6 Unit 5 — Report + HALT
1. Plant `WASH/GHOST-HUB-001-REPAIR-2_REPORT.md` — restated scope, unit-by-unit
   results (baseline trace, the single delta before/after, 3×10/10 gold-run,
   full-regression table, boundary + VCS HOLD proofs, honest NOT-DONE list).
2. HALT. No canon docs, no commits.

## 5. Definition of Done

1. GHOST-HUB-001 **10/10 green three consecutive full runs** — deterministic.
2. All runnable suites green (001–008 + wash.test.js), no skips.
3. Only one file edited (`GHOST-HUB-001.test.js`, one delta + comment);
   `hub-server.js` repair deltas intact; VCS HOLD.
4. Drew's walk-through validation receives a fully green suite set + this
   report. (V-D-002 then ships after; do NOT touch 004's version assertion —
   V-D owns that named delta.)

## 6. Guardrails

- Touch ONLY `WASH/GHOST-HUB-001.test.js` (one delta) + this report. Nothing
  else. No cleanup of other test files, no "while I'm here" fixes.
- Live hub/WASH processes OFF-LIMITS — never kill/restart Drew's windows.
- Zero discretion: any surprise (esp. residual ECONNRESET in a full run) →
  STOP + report (BROWN BANANA BREAD for danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, all `.opencode/` — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute; validate on
walk-through; then route V-D (V-D-002 package already planted).