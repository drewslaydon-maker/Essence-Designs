# GHOST-HUB-005_REPORT — BOLT SEAT + HCG ARRANGEMENT + PRESENTATION LIFT

**Executed:** 2026-09-20 by DOER (1-Stone) · **Task:** `WASH/GHOST-HUB-005_TASK.md`
**Approved by:** Drew Slaydon ("go", 2026-09-20) · **Status:** DONE — HALTED (VCS HOLD)

---

## Restated scope

1. Fix the **blank-tabs defect** in `hub.html` (`wireChatLanes` sibling lookup + null guard).
2. **Bolt rename** — `b-bolt` displayName → `Bolt`; section `council` → `roster` (off HEAD COUNCIL).
3. **HCG arrangement** — server orders council `wash, 0-wake, 1-stone, x-xp`; page renders WASH hero card, Wake+Stone standard, XP compact + isolated divider.
4. **hub.css presentation lift** — hero/divider/compact/spacing, existing PAD tokens only.
5. Create `GHOST-HUB-005.test.js` (4752) + update 002/003/004 ground truths.
6. Plant report and **HALT**. Touch ONLY the 9 named files. No commits.

---

## Unit-by-unit results

### Unit 0 — Baseline gate (recorded BEFORE any edit)

| Check | Result |
|---|---|
| `node --version` | v24.19.0 (expects v24.x) — PASS |
| `git status --short` | Pre-existing dirty tree (ED/, LEGACY/, .opencode/, opencode.json, AGENTS.md...) + `?? WASH/` untracked — recorded, untouched |
| Ports 4749 / 4752 | **No listeners** at baseline (no live hub running) |
| Repro: `/state.council` order | `0-wake,1-stone,b-bolt,x-xp,wash` — WASH NOT first (wrong order) ✓ |
| Repro: `/state.council` has b-bolt | `true` — must leave council ✓ |
| Repro: `/state.roster` b-bolt | `{displayName: COURRIER, section: council}` — must become Bolt ✓ |
| Repro: served `hub.html` | contains `toggle.addEventListener("click"` (crash pattern), **no** sibling lookup ✓ |

Baseline probe teardown printed a Windows libuv `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` noise line **after** all probe data was captured — probe data complete; teardown noise only.

### Unit 1 — hub-server.js (EDIT, 2 deltas, nothing else)

- Section loop: `else council.push(a);` → `else if (a.section === "council") council.push(a);` (roster-section agents never land in council).
- `COUNCIL_ORDER = ["wash", "0-wake", "1-stone", "x-xp"]` constant added at module scope above `buildState()`; `council.sort(...)` added after the section loop (unknown/future ids append, stable).
- `seatMeta` defaults **NOT changed** — fallback truth stays COURRIER per package (§4.3). No other server behavior changes.
- `node --check WASH/hub-server.js` → **clean**.

### Unit 2 — hub-agents.json (EDIT)

- `b-bolt`: `displayName` `COURRIER` → **`Bolt`**, `section` `council` → **`roster`**. Nothing else changed.

### Unit 3 — hub.html (EDIT, 2 deltas)

- **Crash fix:** `wireChatLanes` toggle lookup is now `lane.parentElement.querySelector(".chat-toggle")` + `if (!toggle) return;` guard; `addEventListener`/aria-expanded/focus/open-state unchanged. (Toggle stays outside `.chat-lane` — the lane is `display:none` when collapsed.)
- **renderCouncil arrangement:** WASH → `cardShell(a, "council hero", chatLane(a))`; XP → `council-divider` (`THE EXPERIENCER — ISOLATED LANE`) + `cardShell(a, "council compact", chatLane(a))`; Wake/Stone → standard `"council"`. `<h2>HEAD COUNCIL GHOSTS</h2>` kept; lane-state capture/restore wrapper unchanged.
- `chatLane()`, `cardShell()`, all other renderers, tab router, SSE, 30s refresh, footer badge `v0.3 — Sandtrap-secured` — **untouched**.

### Unit 4 — hub.css (EDIT, added deltas only)

Added (existing PAD tokens only, no new colors): `.agent-card.council.hero` (+ header strong 1.35rem, `.status` gold-tint, border-left 3px gold, margin-bottom 1.5rem), `.council-divider`, `.agent-card.council.compact` (+ header strong 0.95rem, tagline 0.8rem, opacity 0.92), `#council .agent-card.council:not(.hero)` spacing, transition, hover lift. 004 tokens / palette / tabs / chat lane / responsive block untouched.

### Unit 5 — GHOST-HUB-005.test.js (CREATE, port 4752)

T1 boot/shell · T2 exact council order `wash, 0-wake, 1-stone, x-xp` (deepEqual on id array) · T3 b-bolt OFF council / IN roster displayName `Bolt` · T4 served HTML carries `council hero` + `council compact` + exact divider copy · T5 served HTML carries `lane.parentElement.querySelector(".chat-toggle")` + `if (!toggle) return;` · T6 `/spawn` single child-close regression (`node -e console.log('hub-spawn-ok')`).

### Unit 6 — prior suite ground-truth updates (EDIT, assertions only)

- `GHOST-HUB-002.test.js` test 3: council order deepEqual + `b-bolt` absent from council + present in roster with displayName **Bolt**; seals assertion kept.
- `GHOST-HUB-003.test.js` T2: renamed + council order + Bolt-off-council/roster-Bolt ground truth (shadow `[]` kept).
- `GHOST-HUB-004.test.js` T5: renamed + same Bolt/council ground-truth update (tkManifest kept).

---

## Diagnostics (Unit 5 of task §8)

| Check | Result |
|---|---|
| `node --check WASH/hub-server.js` | **clean** |
| `node --test WASH/GHOST-HUB-002.test.js` | **pass 8 / fail 0** (booted 4749 — free, no collision) |
| `node --test WASH/GHOST-HUB-003.test.js` | **pass 6 / fail 0** (4750) |
| `node --test WASH/GHOST-HUB-004.test.js` | **pass 6 / fail 0** (4751) |
| `node --test WASH/GHOST-HUB-005.test.js` | **pass 6 / fail 0** (4752) |
| HTTP probe (edited server): `/state.council` order | `wash,0-wake,1-stone,x-xp` — PASS |
| HTTP probe: `/state.roster` b-bolt displayName | `Bolt` — PASS |
| HTTP probe: council has b-bolt | `false` — PASS |
| `hub.html` grep | `council hero` (L119), divider copy (L121), `council compact` (L122) — PASS |
| `hub.html` grep (crash fix) | L233 sibling lookup → L234 null guard → L235 `toggle.addEventListener("click"` — fix in place, no unguarded old pattern — PASS |
| `hub.css` grep | `.agent-card.council.hero` (L488), `.council-divider` (L505), `.agent-card.council.compact` (L518), spacing rules (L532/536/540) — PASS |
| Live 4749 | **Not listening** at report time (no live hub started during this leaf; suites bind/shutdown their own ports) |
| `git status --short -- WASH/` | `?? WASH/` (whole dir untracked, pre-existing) — no granular diff possible; leaf edits confined to the 9 named files under WASH/ |
| Boundary | No `server.js` / `index.html` / `app.js` / `style.css` / `electron-main.js` / `package.json` / `.opencode/` / ED docs / Pad / Log / Bible / MILESTONES touched — **PASS** |

---

## NOT-DONE (honest list)

- **Drew's visual reload pass is NOT performed by this leaf** — DoD item 7 (leaf does not SEAL until the native window reloads and Drew confirms arrangement + presentation). Files serve from disk per request; Drew's window needs only a reload (Ctrl+R/Cmd+R), no restart.
- No commit made / will be made — **VCS HOLD** honored.
- No live server was running to leave alone; the live 4749 state at close-out is "not listening".
- Canon docs (Bible, MILESTONES, Pad, Log) intentionally untouched per package.

---

**HALTED.** Drew: reload the native hub window to confirm the HCG arrangement + presentation; route the next seat if desired.