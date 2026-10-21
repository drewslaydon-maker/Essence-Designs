# GHOST-HUB-007 — WASH CHAT LANE COLLAPSE FIX (DOER REPORT)

**Clients:** PLANNER (0-Wake) task package, Drew-approved 2026-09-20
**Executor:** DOER (1-Stone) · **Executed:** 2026-09-21 · node v24.19.0
**VCS HOLD:** no commits, no amends — honored.

---

## Scope (as restated before work)

1. EDIT `WASH/hub.html` — 5 exact deltas (unique `data-lane`, capture/restore
   keyed by lane, mid-stream re-render guard, sessions keyed per lane).
2. CREATE `WASH/GHOST-HUB-007.test.js` — hub suite, port 4754.
3. CREATE `WASH/GHOST-HUB-007_REPORT.md` — this file — then HALT.
4. Touch NO other files. Do NOT kill/restart the live native hub (4749);
   reloads are Drew's.

---

## Unit 0 — Baseline gate proof (recorded BEFORE editing)

| Check | Result |
|---|---|
| `node --version` | **v24.19.0** (expect v24.x — PASS) |
| `git status --short` | Tree **pre-existing dirty** (many `M`/`??` entries incl. `WASH/` untracked, Lotus game files, ledger, shadow council, etc.). Recorded only — VCS HOLD. |
| Ports listening | **4749 only** — live native hub, OwningProcess **26600** (task named PID 5544; observed PID differs — recorded honestly; the process was NOT touched). 4748, 4750–4754 free. |

### Repro proofs (BEFORE any change — all 5 present in `hub.html`)

| # | Proof | Result |
|---|---|---|
| 1 | `.chat-lane` carries `data-agent="${escapeHtml(agentStem)}"` with NO `data-lane` | **PRESENT** (line 186 pre-edit) |
| 2 | Capture keys by `lane.dataset.agent`: `laneVisual[ag]` | **PRESENT** (pre-edit capture block) |
| 3 | Restore keys by `lane.dataset.agent`: `laneVisual[lane.dataset.agent]` | **PRESENT** (pre-edit line 172) |
| 4 | NO `.chat-lane.working` guard in `renderCouncil` | **PRESENT** (function began at line 118, no guard) |
| 5 | Sessions key by `sessionCache[agent]` (read line 209, write line 263) | **PRESENT** |

**Root-cause proof (duplicate `data-agent` collision):** `chatLane(a)` stamps
every lane `data-agent` with the network stem; WASH's stem is `0-wake` (WASH
is the ghost of Wake). The WAKE council card also stamps `data-agent="0-wake"`.
Both lanes share ONE `laneVisual` key. In `loadState()`'s capture, WASH (hero,
first in DOM) is stored, then WAKE (closed, empty) **overwrites** it; restore
then applies WAKE's closed/empty state to both lanes → `.chat-lane` collapsed
(`display:none`) → "shell would close"; output restored empty → "message would
vanish". Exact match for Drew's defect report.
**Secondary root cause:** 30s re-render during a stream detaches the live
`.chat-lane`; the in-flight `reader` keeps appending to the detached output →
reply tail lost.

---

## Unit 1 — hub.html: the 5 deltas (EDIT — all applied, then verified by read-back)

| Delta | Spec | Result |
|---|---|---|
| 5.1 | `.chat-lane` opening tag now `data-lane="${escapeHtml(a.id)}" data-agent="${escapeHtml(agentStem)}"` (unique UI key + network stem) | **APPLIED** (now line 190) |
| 5.2 | Capture block keys by `data-lane`: `const lid = lane.dataset.lane; laneVisual[lid] = {…}` | **APPLIED** (now lines 126–130) |
| 5.3 | Restore keys by lane: `const st = laneVisual[lane.dataset.lane];` | **APPLIED** (now line 176) |
| 5.4 | Guard at top of `renderCouncil(council)`, immediately after `const el = document.getElementById("council");`: `if (el.querySelector(".chat-lane.working")) return;` + GHOST-HUB-007 comment | **APPLIED** (now lines 121–123) |
| 5.5 | `wireChatLanes` sessions per lane: `const laneId = lane.dataset.lane;` beside `const agent = …`; `sessionCache[laneId]` on read (line 214) and write (line 268) | **APPLIED** |

No other line in any function was changed (verified by read-back of the
affected regions and by the boundary check below).

---

## Unit 2 — WASH/GHOST-HUB-007.test.js (CREATE, port 4754)

Pattern mirrors GHOST-HUB-003/004/005/006: `node --test`, boots
`startServer({ port: 4754 })`, shuts down in `after`, no real opencode chat
spawn, `/spawn` via Sandtrap sandbox.

- T1 boot/shell · T2 the 007 fix tokens (`data-lane="`, `data-agent="`,
  `laneVisual[lane.dataset.lane]`, `el.querySelector(".chat-lane.working")`,
  `sessionCache[laneId]`) · T3 006 ground truth (`era-stamp` ≥2,
  `council-split`, `xp-toggle`, `lane-head`, all 7 `sym-*`, working toggle) ·
  T4 005 crash fix · T5 hub.css `@keyframes hubWorking` + `.council-divider` ·
  T6 `/spawn` regression (`hub-spawn-ok`).
- **Created.** Port 4754 was free at baseline.

---

## Unit 3 — Run (all runnable suites)

| Suite | Port | Result |
|---|---|---|
| `node --test WASH/wash.test.js` | 4748 (was free) | **8/8 PASS** ✅ |
| `node --test WASH/GHOST-HUB-002.test.js` | 4749 | **SKIP-with-reason:** `EADDRINUSE address already in use 127.0.0.1:4749` — held by the LIVE native hub (PID 26600). Per 005/006 precedent: did NOT fight the port, did NOT kill the process. Suite could not bind. |
| `node --test WASH/GHOST-HUB-003.test.js` | 4750 | **6/6 PASS** ✅ |
| `node --test WASH/GHOST-HUB-004.test.js` | 4751 | **6/6 PASS** ✅ |
| `node --test WASH/GHOST-HUB-005.test.js` | 4752 | **6/6 PASS** ✅ |
| `node --test WASH/GHOST-HUB-006.test.js` | 4753 | **6/6 PASS** ✅ |
| `node --test WASH/GHOST-HUB-007.test.js` | 4754 (NEW) | **6/6 PASS** ✅ |

Totals: **44/44 pass across runnable suites** (8 + 6 + 6 + 6 + 6 + 6 + 6);
no hack-around; no red requiring STOP. 002 diagnosis: `EADDRINUSE` — recorded.

---

## Unit 4 — Verification (diagnostics)

1. Grep proofs in `hub.html`:
   - `data-lane="` … `data-agent="` — **PASS** (line 190: single `.chat-lane`
     tag carries both).
   - `laneVisual[lane.dataset.lane]` — **PASS** (line 176).
   - `el.querySelector(".chat-lane.working")` — **PASS** (line 123).
   - `sessionCache[laneId]` — **PASS** (lines 214, 268).
   - NO remaining `laneVisual[lane.dataset.agent]` in `hub.html` — **PASS**
     (replaced by the lane-keyed version; the only other matches are in
     GHOST-HUB-004_TASK.md — a historical task file, NOT touched).
   - 005 crash-fix regressions — **PASS** (`lane.parentElement.querySelector(".chat-toggle")` line 287, `if (!toggle) return;` line 288).
2. Live surface: **4749 listening (PID 26600) — untouched, still serving from
   disk** (files serve per request from `WASH/hub.html`); 4748 was free and
   was released after `wash.test.js`'s `after()` hook. Only a reload (Drew's
   Ctrl+R in the Electron window) is needed for the fix to reach the window.
3. `git status --short` — identical to baseline; leaf changes confined to the
   named 3 files inside `WASH/` (which remains a single untracked `?? WASH/`
   dir at repo level — no commit, **VCS HOLD honored**).
4. Boundary held — **PASS:** no change to `hub.css`, `hub-server.js`,
   `hub-agents.json`, `server.js`, `index.html`, `app.js`, `style.css`,
   `electron-main.js`, `package.json`, `.opencode/`, game code, Pad, Log,
   Bible, or MILESTONES. File-level proof: `Get-ChildItem WASH` timestamps
   show only `hub.html` (1:31:40 AM) + new `GHOST-HUB-007.test.js`
   (1:32:18 AM) from this leaf; every other WASH file's last-write is from
   09-20 (previous leafs).

---

## NOT-DONE / HONEST LIST

- **GHOST-HUB-002 suite did not run** (EADDRINUSE on 4749, live hub) —
  recorded SKIP-with-reason; nothing was killed or fought.
- **Drew's reload pass is NOT done by me** — per Definition of Done item 5,
  the leaf does NOT SEAL until Drew reloads the native hub window and
  confirms a WASH chat stays visible with its reply. That is Drew's action.
- **Seal-gate audit (GHOST-HUB-AUDIT-001)** NOT run — deferred to after
  Drew's reload pass.
- **No commits** (VCS HOLD) — honored.
- Comment lines 41–42 of `hub.html` still read `// agent -> …` for the cache
  semantics which are now keyed by lane id; not in the named delta set, so
  left untouched (zero-discretion scope lock).

## Behavior note (required by §5.5)

WASH lane and WAKE lane now hold **SEPARATE** sessions (`sessionCache` keyed
by `data-lane` = real agent id, `wash` vs `0-wake`), although both still run
the `0-wake` agent underneath via `/chat`. Splitting the key is the fix;
sharing it was the collision.

---

## Definition of Done status

| DoD | Status |
|---|---|
| WASH chat works: lane stays OPEN across 30s re-renders; reply streams in; message does not vanish | **Implemented client-side; final confirmation = Drew's reload pass (pending).** |
| Unique lane identity: every `.chat-lane` has `data-lane`; capture/restore key by it; sessions key per lane | **DONE (verified by grep + tests T2/T3/T4)** |
| Mid-stream guard: working lane never detached by 30s tick | **DONE (`el.querySelector(".chat-lane.working")` return guard, verified + tested)** |
| Regressions: 003–006 green (002 SKIP-with-reason), `wash.test.js` green | **DONE — 44/44 runnable tests pass** |
| Drew's reload pass | **PENDING — Drew's action, then Seal-gate audit + ferry** |

## HALT

Report planted. HALTING per package §9 — no Canon docs, Pad, Log, Bible,
MILESTONES, or other files touched; no commit (VCS HOLD). Next move is
Drew's: reload the native hub window and confirm the WASH chat stays
visible, then route the Seal-gate audit.