# GHOST-HUB-001-REPAIR-2 — PROGRESS CHECKPOINT (paused mid-leaf)

**Paused:** 2026-09-21 by Drew (walk-away) · **Executor:** DOER (1-Stone, big-pickle)
**Package:** `WASH/GHOST-HUB-001-REPAIR-2_TASK.md` · **Status:** IN PROGRESS — core fix DONE + PROVEN; final steps PENDING.

> Resume pointer: finish Unit 3 (007 + 008), Unit 4 verification, Unit 5 report
> (`WASH/GHOST-HUB-001-REPAIR-2_REPORT.md`), then HALT. VCS HOLD throughout.

---

## Done (recorded with real output)

### Unit 0 — Baseline (pre-edit)
- `node --version` → `v24.19.0`
- `git status --short` → `?? WASH/` (untracked); 58-line pre-existing dirty tree; **VCS HOLD** (no commits).
- Ports 4748–4756: **no listeners** at start.
- Current code `node --test WASH/GHOST-HUB-001.test.js` →
  **pass 9 / fail 1**; test 4 trace:
  ```
  ✖ 4 · GET /events ... (19.8424ms)
    [TypeError: fetch failed] { [cause]: Error: read ECONNRESET
        at TCP.onStreamRead (...) { errno: -4077, code: 'ECONNRESET', syscall: 'read' } }
  ```
- Isolated `--test-name-pattern "4 ·"` → **✔ PASS @2359.3656ms** (server heartbeat fix intact).
- NOTE: one parallel-run mishap (EADDRINUSE on 4749) when the isolated probe ran concurrently with the full suite — re-run sequentially gave the clean trace above. No code impact.

### Unit 1 — The single delta (applied, character-exact)
`WASH/GHOST-HUB-001.test.js`, test 1:
```js
// Before:
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);

// After:
    const conn = await fetch(`${BASE}/`);
    assert.strictEqual(conn.status, 200);
    await conn.text(); // REPAIR-2: consume body so the pooled socket isn't mid-response when the server closes (SSE ECONNRESET)
```
No other byte changes in the file. Test 4's heartbeat assertion untouched; scaffolding untouched.

### Unit 2 — Gold run: GHOST-HUB-001 full suite ×3 (determinism)
| Run | Result | Test 4 timing |
|---|---|---|
| 1 | **10/10 PASS** | ✔ 2149.8853ms |
| 2 | **10/10 PASS** | ✔ 2151.0978ms |
| 3 | **10/10 PASS** | ✔ 2170.0024ms |

Three consecutive green full runs — **the pool-stale race is fixed and deterministic.**

### Unit 3 — Full regression (so far: 6 of 8 suites)
| Suite | Result |
|---|---|
| wash.test.js (4748) | **8/8 PASS** |
| GHOST-HUB-002 (4749) | **8/8 PASS** |
| GHOST-HUB-003 (4750) | **6/6 PASS** |
| GHOST-HUB-004 (4751) | **6/6 PASS** (still asserts v0.3 — V-D owns that named delta, not this leaf) |
| GHOST-HUB-005 (4752) | **6/6 PASS** |
| GHOST-HUB-006 (4753) | **6/6 PASS** |

---

## PENDING (resume here)

1. **Unit 3 remainder:** `node --test WASH/GHOST-HUB-007.test.js` (4754) and `node --test WASH/GHOST-HUB-008.test.js` (4755) — expect green.
2. **Unit 4 verification:**
   - Grep `GHOST-HUB-001.test.js` contains `await conn.text(); // REPAIR-2` — PASS expected; and NO other leaf artifacts.
   - `git status --short` — leaf changes confined to `GHOST-HUB-001.test.js` + reports.
   - Boundary: `hub-server.js` untouched — grep intact: `}, 2000)`, `spawned: true`, `no seats resolve`.
   - Port end-state record (4748–4756).
3. **Unit 5:** plant `WASH/GHOST-HUB-001-REPAIR-2_REPORT.md` (restated scope, unit-by-unit, 3×10/10 gold runs, full-regression table, boundary + VCS HOLD proofs, honest NOT-DONE list). HALT.

## Guardrails still in force for resume
- Touch ONLY `WASH/GHOST-HUB-001.test.js` (delta ALREADY applied — do not re-edit) + the two report files.
- `hub-server.js` OFF-LIMITS (repair-1 deltas stay).
- Live hub/WASH processes OFF-LIMITS; stop at any ECONNRESET surprise (STOP + report to PLANNER, BROWN BANANA BREAD for danger).
- **VCS HOLD — no commits.**

---

**PLANTED 2026-09-21 by DOER (1-Stone) at Drew's direction (progress checkpoint).**
Drew: point DOER back at this file (or the TASK) to resume — ~3 commands from green.