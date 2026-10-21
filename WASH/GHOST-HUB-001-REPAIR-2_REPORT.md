# GHOST-HUB-001-REPAIR-2 — EXECUTION REPORT

**Executed:** 2026-09-21 by DOER (1-Stone, big-pickle) · **Package:** `WASH/GHOST-HUB-001-REPAIR-2_TASK.md`
**Approved by:** Drew Slaydon (2026-09-21 — "lets do the micro repair")
**Status:** **DONE — HALTED** (all DoD met; VCS HOLD honored)
**Resume context:** paused mid-leaf 2026-09-21 (progress checkpoint
`WASH/GHOST-HUB-001-REPAIR-2_PROGRESS.md`); resumed same day from that file's
PENDING list (Unit 3 remainder → Unit 4 → Unit 5).

---

## 1. Restated scope (honest)

GHOST-HUB-001 test 4 (`GET /events` SSE heartbeat) failed **only on full-suite
runs** with `read ECONNRESET` at ~15ms. PLANNER root-caused it as a **test-
harness pool-stale race**: test 1 asserted `conn.status` but never consumed
the response body → a mid-response socket stayed in undici's keep-alive pool
on shared port 4749 → test 4's SSE fetch reused the stale socket →
ECONNRESET. Proven 6/6 fail (unconsumed) vs 6/6 pass (consumed); the server
itself was healthy (heartbeat 2s, isolation pass).

This leaf = **ONE line** in `GHOST-HUB-001.test.js` (test 1 consumes the body).
Zero assertion changes. **VCS HOLD — no commits.**

Targets (named files ONLY):

| File | Action |
|---|---|
| `WASH/GHOST-HUB-001.test.js` | EDIT — ONE delta (test 1 consumes body, §3) |
| `WASH/GHOST-HUB-001-REPAIR-2_REPORT.md` | CREATE — this report + HALT |

NOT touched: `WASH/hub-server.js` (REPAIR-1's file), every other WASH/ file,
`.opencode/`, `opencode.json`, `ED/` docs, game code. Live hub/WASH processes
OFF-LIMITS.

---

## 2. Unit 0 — Baseline gate proof (recorded BEFORE the edit, prior session)

| Check | Result |
|---|---|
| `node --version` | `v24.19.0` |
| `git status --short` | `?? WASH/` (untracked); 58-line pre-existing dirty tree — **VCS HOLD** (no commits). |
| Ports 4748–4756 | **No listeners** at start. |
| `node --test WASH/GHOST-HUB-001.test.js` (pre-edit) | **pass 9 / fail 1** — full-run test-4 trace: |
| Isolated test 4 | `--test-name-pattern "4 ·"` → **✔ PASS @2359.3656ms** (server heartbeat fix intact) |

Pre-edit full-run trace (the stem this leaf fixes):

```
✖ 4 · GET /events ... (19.8424ms)
  [TypeError: fetch failed] { [cause]: Error: read ECONNRESET
      at TCP.onStreamRead (...) { errno: -4077, code: 'ECONNRESET', syscall: 'read' } }
```

NOTE: one parallel-run mishap (EADDRINUSE on 4749) occurred when the isolated
probe ran concurrently with the full suite — re-run sequentially gave the clean
trace above. No code impact.

---

## 3. Unit 1 — The single delta (applied, character-exact)

`WASH/GHOST-HUB-001.test.js`, test 1 — before/after:

```js
// Before:
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);

// After:
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);
    await conn.text(); // REPAIR-2: consume body so the pooled socket isn't mid-response when the server closes (SSE ECONNRESET)
```

No other byte changes in the file. Test 4's heartbeat assertion untouched;
`PORT`/`BASE`/`withServer` scaffolding untouched; no assertion weakened.
(Delta applied in the prior session; verified on disk at resume — one and only
one REPAIR-2 line present, §6.)

---

## 4. Unit 2 — Gold run: GHOST-HUB-001 full suite ×3 (determinism)

| Run | Result | Test 4 timing |
|---|---|---|
| 1 | **10/10 PASS** | ✔ 2149.8853ms |
| 2 | **10/10 PASS** | ✔ 2151.0978ms |
| 3 | **10/10 PASS** | ✔ 2170.0024ms |

Three consecutive green full runs — **the pool-stale race is fixed and
deterministic.** No residual ECONNRESET in any full run.

---

## 5. Unit 3 — Full regression (all runnable suites; no skips)

| Suite | Port | Result |
|---|---|---|
| wash.test.js | 4748 | **8/8 PASS** |
| GHOST-HUB-001 | 4749 | **10/10 PASS ×3** (Unit 2) |
| GHOST-HUB-002 | 4749 | **8/8 PASS** |
| GHOST-HUB-003 | 4750 | **6/6 PASS** |
| GHOST-HUB-004 | 4751 | **6/6 PASS** (still asserts `v0.3 — Sandtrap-secured` — the V-D-002 named delta, NOT this leaf) |
| GHOST-HUB-005 | 4752 | **6/6 PASS** |
| GHOST-HUB-006 | 4753 | **6/6 PASS** |
| GHOST-HUB-007 | 4754 | **6/6 PASS** (resume run) |
| GHOST-HUB-008 | 4755 | **9/9 PASS** (resume run) |

**Suite set fully green: 001 10/10 + 002–008 + wash. No skips.**

---

## 6. Unit 4 — Verification diagnostics — **ALL PASS**

1. **Delta grep:** `GHOST-HUB-001.test.js` contains
   `await conn.text(); // REPAIR-2` → **PASS** (line 36). The test file
   contains NO other artifact of this leaf (single match for `REPAIR-2` /
   `conn.text` within the file).
2. **VCS state:** `git status --short` — `?? WASH/` untracked before and
   after; leaf changes confined to `WASH/` (test file + progress + task +
   this report inside the untracked folder). **No commit (VCS HOLD) honored.**
3. **Boundary — `hub-server.js` untouched** (its 3 REPAIR-1 deltas intact):
   - `}, 2000); // GHOST-HUB-001-REPAIR: 2s keepalive...` → **PASS** (line 403)
   - `spawned: true, // GHOST-HUB-001-REPAIR: original 001 test contract` → **PASS** (line 639)
   - `/* agents dir missing — no seats resolve */` → **PASS** (line 451)
   - Timestamp proof: `hub-server.js` LastWriteTime **09/21 4:25 PM** (REPAIR-1);
     `GHOST-HUB-001.test.js` LastWriteTime **09/21 6:06 PM** (this leaf's single
     edit). No other file changed by this leaf.
4. **Live surfaces:** ports 4748–4756 — **no listeners at start and end**;
   nothing stopped; live windows unaffected.

---

## 7. Definition of Done — scorecard

| DoD | Result |
|---|---|
| 1. GHOST-HUB-001 **10/10 green three consecutive full runs** — deterministic | **MET** (3×10/10, Unit 2) |
| 2. All runnable suites green (001–008 + wash.test.js), no skips | **MET** (Unit 3) |
| 3. Only one file edited (`GHOST-HUB-001.test.js`, one delta + comment); `hub-server.js` repair deltas intact; VCS HOLD | **MET** (Unit 4) |
| 4. Drew's walk-through validation receives fully green suite set + this report | **HANDED OFF** — V-D-002 ships after Drew validates; 004's version assertion untouched (V-D owns that named delta) |

---

## 8. NOT-DONE / known-gaps (masquerade-guard)

- **Commits:** none — VCS HOLD throughout.
- **Canon docs** (Bible / MILESTONES / Pad / Log): untouched per VCS HOLD +
  §6 embargoes.
- **`hub-server.js`:** untouched by this leaf (REPAIR-1's 3 deltas preserved,
  §6).
- **GHOST-HUB-004 version assertion** (`v0.3 — Sandtrap-secured`): intentionally
  left as-is — the V-D-002 named delta, not this leaf's scope.
- **No V-D work, no game code, no `.opencode/`, no `opencode.json`:** untouched.
- **Live hub/WASH processes:** none touched; no listeners existed at start or
  end of this leaf.

---

**HALT — executing seat stops here.** DOER (1-Stone) holds at the unit gate.
Drew: walk-through validation on the fully green suite set (gold run command:
`node --test WASH/GHOST-HUB-001.test.js`), then route V-D (V-D-002 package
already planted).

**PLANTED 2026-09-21 by DOER (1-Stone), Drew-approved task.**