# GHOST-HUB-001-REPAIR — EXECUTION REPORT

**Executed:** 2026-09-21 by DOER (1-Stone, big-pickle) · **Package:** `WASH/GHOST-HUB-001-REPAIR_TASK.md`
**Approved by:** Drew Slaydon (2026-09-21) · **Status:** DONE-with-STOP (reported; one DoD item NOT met — see §9)

---

## 1. Restated scope (honest)

Three pre-existing defects in the WASH / GHOST HUB leaf, server-side + doc-only:

| # | Defect | Fix |
|---|---|---|
| A | SSE heartbeat every 15000ms outran the suite's ~5s window | `15000` → `2000` + inline comment |
| B | `handleSpawn()` close response missing original-contract `spawned: true` | add field after `ok: true,` |
| C | `seatedAgentMap()` JSDoc + catch comment still cite the dead wash → 0-wake alias | kill stale alias docs (2 spots) |

Targets (named files ONLY): `WASH/hub-server.js` (EDIT), `WASH/GHOST-HUB-001-REPAIR_REPORT.md` (CREATE).
**VCS HOLD — no commits.** Live hub/WASH processes OFF-LIMITS. Test files untouched.

---

## 2. Unit 0 — Baseline gate proof (recorded BEFORE any edit)

| Check | Result |
|---|---|
| `node --version` | `v24.19.0` |
| `git status --short` | Pre-existing dirty tree across ED/, Lotus, LEGACY, opencode.json, `.opencode/` etc. `WASH/` itself is **untracked** (`?? WASH/`) — hub-server.js has no committed baseline; file-level timestamps used as boundary proof. No commits made. |
| Ports `Get-NetTCPConnection -LocalPort 4748..4756 -State Listen` | **No listeners** on any port — no live window was holding a port; all suites runnable; nothing stopped or restarted. |
| Repro: `node --test WASH/GHOST-HUB-001.test.js` (pre-edit) | `pass 8 / fail 2` — matches V-D-000 §Unit 4 exactly. Traces below. |

Baseline failing traces (pre-edit):

```
✖ 4 · GET /events returns text/event-stream and emits heartbeat (25.243ms)
  [TypeError: fetch failed] {
    [cause]: Error: read ECONNRESET
        at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
      errno: -4077,
      code: 'ECONNRESET',
      syscall: 'read'
    }
  }

✖ 5 · POST /spawn ... (655.0836ms)
  AssertionError [ERR_ASSERTION]: must indicate spawned
  + actual - expected
  + undefined
  - true
      at C:\Users\Andrew\Projects\WASH\GHOST-HUB-001.test.js:117:12
```

---

## 3. Unit 1 — Read-before-edit (on-disk bytes matched, verbatim)

Regions read via Read tool before editing. Unicode matched verbatim: `→` = U+2192, `—` = U+2014.

- Region A — `handleSSE()` lines 388–408: heartbeat `setInterval` block; target line was `  }, 15000);` (line 403). `: connected\n\n` write, try/catch, and `req.on("close")` cleanup unchanged.
- Region B — `handleSpawn()` close handler lines 634–648: response object began `ok: true,` / `pid: child.pid,` / `agent: parsed.agent || "unknown",` (lines 639–641). Other spawn-path `ok: true` (line 356, POST /spawn start) confirmed distinct — anchor extended with `pid: child.pid,` for uniqueness.
- Region C — `seatedAgentMap()` lines 437–458: JSDoc lines 437–441 contained `stems, PLUS the static wash → 0-wake alias (WASH is the ghost of Wake — proven pattern).`; catch comment line 452 was `/* agents dir missing — only the wash alias remains */`. (Inline `// GHOST-HUB-008:` comment, lines 443–444, retained — it is accurate.)

---

## 4. Unit 2 — Delta A: heartbeat 15000 → 2000 — **PASS, STOP gate cleared**

Before: `  }, 15000);`
After:  `  }, 2000); // GHOST-HUB-001-REPAIR: 2s keepalive — 15s outran the suite's 5s window`

**STOP rule executed:** `node --test --test-name-pattern "4 ·" WASH/GHOST-HUB-001.test.js`
→ **✔ 4 · PASS (2431.3437ms)** — heartbeat observed in-window (2s cadence), no ECONNRESET in isolation. Gate cleared; continued to Delta B.

Nothing else in `handleSSE()` changed (verified on disk: lines 397–402, 405–408 verbatim).

---

## 5. Unit 3 — Delta B: add `spawned: true` — **PASS**

Before:
```js
        sendJson(res, 200, {
          ok: true,
          pid: child.pid,
```
After:
```js
        sendJson(res, 200, {
          ok: true,
          spawned: true, // GHOST-HUB-001-REPAIR: original 001 test contract
          pid: child.pid,
```
Field added immediately after `ok: true,` — nothing else in the response object changed. Safe (no suite deep-equals the spawn response; 002/008 assert fields individually — both stayed green, §7).

---

## 6. Unit 4 — Delta C: kill stale alias docs (2 spots) — **PASS**

**C1 — JSDoc:**
```js
/**
 * Seated opencode agent map, derived at request time from .opencode/agents/*.md
 * stems. Unknown/seated-specter codes are NOT on the map → 400.
 */
```
**C2 — catch comment:** `/* agents dir missing — no seats resolve */`
(was: `/* agents dir missing — only the wash alias remains */`)

Both stale strings verified ABSENT (§8 grep proof).

---

## 7. Unit 5 — Suite runs (all runnable; ports were free)

| Suite | Result | Notes |
|---|---|---|
| `GHOST-HUB-001.test.js` | **pass 9 / fail 1** | Test 4 still fails on FULL run — see §9 STOP trace. Test 5 **now passes** (`spawned: true` proof). |
| `wash.test.js` | **8/8 PASS** | 4748 |
| `GHOST-HUB-002.test.js` | **8/8 PASS** | 4749 |
| `GHOST-HUB-003.test.js` | **6/6 PASS** | 4750 |
| `GHOST-HUB-004.test.js` | **6/6 PASS** | 4751 |
| `GHOST-HUB-005.test.js` | **6/6 PASS** | 4752 |
| `GHOST-HUB-006.test.js` | **6/6 PASS** | 4753 |
| `GHOST-HUB-007.test.js` | **6/6 PASS** | 4754 |
| `GHOST-HUB-008.test.js` | **9/9 PASS** | 4755 — incl. T3 "no alias; carries the 008 map comment" (still green with Delta C in place) |

No skips. Every runnable suite green **except** the 001 test-4 full-run case below.

---

## 8. Unit 6 — Verification diagnostics — PASS (except DoD #1, §9)

1. Grep proofs:
   - `hub-server.js` contains `}, 2000)` + 2s comment → **PASS** (line 403)
   - `hub-server.js` contains `spawned: true` → **PASS** (line 639)
   - `hub-server.js` does NOT contain `wash → 0-wake alias`, does NOT contain `only the wash alias remains` → **PASS** (0 matches)
2. Live surfaces: ports 4748/4749 (and 4750–4756) — **no listeners** at start and end; nothing stopped; live windows unaffected.
3. `git status --short` — `?? WASH/` before and after (WASH/ untracked — no committed baseline exists). **No commit (VCS HOLD) honored.**
4. Boundary held:
   - `hub-server.js` LastWriteTime 09/21 4:25 PM (this leaf); `GHOST-HUB-001.test.js` LastWriteTime 09/20 7:25 PM — **untouched** (read-only, never written).
   - No other file edited; no throwaway helper files created. Other WASH/ file timestamps all pre-date this leaf.

---

## 9. §6 STOP trace — the one thing NOT fixed (flag for PLANNER)

**GHOST-HUB-001 test 4 STILL fails on the FULL-suite run — deterministic.**

Full run #1 (post-delta): `✖ 4 · ... (15.0774ms)` — `TypeError: fetch failed` / `[cause]: Error: read ECONNRESET` / `errno: -4077, code: 'ECONNRESET'` at `TCP.onStreamRead`.
Full run #2 (re-run, same named command): `✖ 4 · ... (18.0322ms)` — identical ECONNRESET trace.

Counter-evidence (isolated runs, same code): `--test-name-pattern "4 ·"` → **PASS at 2431ms** with the 2s heartbeat observed.

**Analysis (recorded, NOT acted on):** this is a **pre-existing harness socket-reuse race**, not a heartbeat defect, and NOT introduced by Delta A:
- The failure fires at ~15–25ms — before a 2s heartbeat could even exist. The baseline failure (pre-edit) was the same signature at 25ms, which the original "15s outran the 5s window" theory never explained (a window timeout would fail at ~5s, not 25ms).
- The harness boots a fresh server per test on the **same port 4749** (`withServer`, GHOST-HUB-001.test.js lines 20–29), back-to-back. Node's global `fetch` (undici) keep-alive pool can reuse a socket that belonged to the just-closed prior test server (tests 1–3 fetch this port) → server accepts then resets → `read ECONNRESET`.
- Delta A is still correct and worth keeping: a 2s keepalive is a sane SSE console cadence and guarantees in-window heartbeats; it fixes the original suite-contract intent.

**Why no fix here (zero discretion):** the task forbids test-file edits, forbids adjacent fixes, and its own STOP rule (§4.2 + §6) triggers on SSE ECONNRESET persistence — "do NOT improvise; record the full trace and flag for PLANNER." No server-side workaround, no test change, no port/socket hacks were attempted.

**Suggested follow-up for PLANNER (decision: plant a new package; none planted by me):** consider a dedicated `/health/heartbeat` check or per-test port isolation in the harness (e.g., unique ephemeral port per `withServer` call), or an explicit agent-socket disable for the 001 fetch calls. The server itself is healthy when not racing harness port churn.

---

## 10. Definition of Done — honest scorecard

| DoD | Result |
|---|---|
| 1. GHOST-HUB-001 10/10 green on current code (no test edits) | **NOT MET** — 9/10 on full run; test 4 fails full-run only (harness race, §9). |
| 2. `spawned: true` present; heartbeat 2000ms; stale alias docs gone | **MET** (grep + byte proofs). |
| 3. All runnable suites green (002–008 + wash.test.js), no skips except port-held | **MET** — 002–008 + wash all green; no skips; ports were free, nothing held. |
| 4. Boundary held; VCS HOLD | **MET** — only `hub-server.js` + this report; no commits. |
| 5. No UI surface changed — hub looks identical | **MET** — server internals + docs only; verified by V-D-001 visual specs staying green (004/005/006/007 hold). |

---

## 11. NOT-DONE / known-gaps (masquerade-guard)

- Full-suite 001 10/10: **not achieved** — test 4 full-run ECONNRESET (§9) is the leaf's honest red. Flagged for PLANNER; awaiting a follow-up package.
- Commits: none (VCS HOLD).
- Canon docs (Bible / MILESTONES / Pad / Log): untouched per VCS HOLD + §6 embargoes.
- Game code, `.opencode/`, `opencode.json`: untouched.
- Live hub/WASH processes: none touched; no listeners existed at start or end.

---

**HALT — executing seat stops here.** DOER (1-Stone) holds at the unit gate. Drew: route PLANNER (0-Wake) to this report for the §9 follow-up package.

**PLANTED 2026-09-21 by DOER (1-Stone), Drew-approved task.**