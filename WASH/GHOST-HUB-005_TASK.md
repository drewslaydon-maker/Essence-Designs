# GHOST-HUB-005 — BOLT SEAT + HCG ARRANGEMENT + PRESENTATION LIFT (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (Studio Director — "go", 2026-09-20)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. VCS HOLD — no commits.

---

## 1. Drew's Directive (what this leaf encodes)

From Drew's review of the GHOST-HUB-004 presentation (2026-09-20, live hub):
- **Blank tabs defect** — only HEAD COUNCIL shows; specters/roster/toolkit are
  blank. Root cause (PLANNER-verified, read-only): `chatLane()` renders the
  `.chat-toggle` button as a SIBLING OUTSIDE `.chat-lane`, but
  `wireChatLanes()` looks it up INSIDE the lane via
  `lane.querySelector(".chat-toggle")` → null → TypeError → `loadState()`
  catches and aborts → subsequent panels never render. **Must fix.**
- **COURRIER → Bolt.** b-bolt displayName becomes **Bolt** (in line with Wake,
  Stone, XP, WASH).
- **Bolt off the HEAD COUNCIL section** — Drew almost never calls it directly.
  Bolt stays in the AGENT ROSTER only.
- **HCG arrangement:** WASH **at the top** (the main seat for this platform),
  then **Wake** (direct format driver), then **Stone** (shoots after Wake's
  plan). **XP last, smaller, isolated** below the others (its self-guided
  style).
- **Presentation still falls flat** — the leaf carries a presentation lift
  (exact deltas below). Tabs keep the 004 polish (gold top edge, no pulse).
- ~30 minutes budget. Keep the leaf tight and single-pass.

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub-server.js` | EDIT — council routing (explicit `section === "council"`) + `COUNCIL_ORDER` array (wash, 0-wake, 1-stone, x-xp) |
| `WASH/hub-agents.json` | EDIT — b-bolt displayName → Bolt; b-bolt section → `roster` |
| `WASH/hub.html` | EDIT — crash fix in `wireChatLanes`; renderCouncil arrangement (hero WASH, compact XP); keep everything else |
| `WASH/hub.css` | EDIT — hero card, compact/isolated XP card, spacing lift (exact deltas) |
| `WASH/GHOST-HUB-005.test.js` | CREATE — new suite, port 4752 |
| `WASH/GHOST-HUB-002.test.js` | EDIT — test 3 ground truth (Bolt off council, in roster) |
| `WASH/GHOST-HUB-003.test.js` | EDIT — T2 ground truth (council no longer shows COURRIER) |
| `WASH/GHOST-HUB-004.test.js` | EDIT — T5 ground truth (council no longer shows COURRIER) |
| `WASH/GHOST-HUB-005_REPORT.md` | CREATE — report + HALT |

NOT touched: `server.js`, `index.html`, `style.css`, `app.js`,
`electron-main.js`, `install.js`, `icon.ico`, `package.json` (stays 0.3.0),
`ED/` docs, Pad/Log/Bible/MILESTONES, `.opencode/`, all game code. No commits.
Do NOT kill the live hub if one is running; the native reload is Drew's.

---

## 3. Unit 0 — Baseline gate proof (run FIRST, record)

1. `node --version` (expect v24.x).
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4749,4752 -State Listen` — record.
   If a live hub holds 4749, **leave it running**; run suites on 4752 only and
   note any port collision honestly.
4. Repro proofs (record BEFORE changing anything):
   - `/state.council` id order is `0-wake, 1-stone, b-bolt, x-xp, wash`
     (wrong order — WASH not first).
   - `/state.council` contains `b-bolt` (must leave council).
   - `/state.roster` contains `b-bolt` displayName `COURRIER` (must become
     `Bolt`).
   - Served `hub.html` contains the crash pattern:
     `toggle.addEventListener("click"` (see §5 — the fix replaces the lookup
     feeding it).

## 4. Unit 1 — hub-server.js (EDIT, exact deltas)

1. In `buildState()`, replace the section loop's final `else council.push(a);`
   with an explicit council-only branch so agents whose section is neither
   `specters` nor `council` (e.g. Bolt's new `roster` section) never land in
   the council array (roster loop already includes every non-shadow agent):
   ```js
   for (const a of Object.values(agents)) {
     if (a.section === "shadow") continue; // dormant roles hidden (Drew ruling 2026-09-20)
     if (a.section === "specters") specters.push(a);
     else if (a.section === "council") council.push(a);
   }
   ```
2. Add a `COUNCIL_ORDER` constant near the top of `buildState()` (or module
   scope above it) — Drew's arrangement:
   ```js
   const COUNCIL_ORDER = ["wash", "0-wake", "1-stone", "x-xp"];
   ```
   Then, before returning, order the council array by that list
   (unknown/future ids append at the end, stable):
   ```js
   council.sort((a, b) => {
     const ia = COUNCIL_ORDER.indexOf(a.id);
     const ib = COUNCIL_ORDER.indexOf(b.id);
     return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
   });
   ```
3. Do NOT change `seatMeta` defaults (the personalization surface owns the
   Bolt override; fallback truth stays COURRIER for the no-config boot).
4. No other server behavior changes. `node --check` must stay clean.

## 5. Unit 2 — hub.html (EDIT, exact deltas)

### 5.1 The crash fix (mandatory)
In `wireChatLanes()`, the toggle is a SIBLING of the lane, not a child.
Replace the inner lookup with a sibling/ancestor lookup AND a null guard:
```js
const toggle = lane.parentElement.querySelector(".chat-toggle");
if (!toggle) return; // never let a missing toggle blank the whole page
```
Keep the rest of the handler identical (aria-expanded, focus, open-state).
This is the blank-tabs fix — the toggle must stay outside `.chat-lane`
because `.chat-lane` is `display: none` when collapsed (004 CSS).

### 5.2 HCG arrangement in renderCouncil()
Server now sends council in order `wash, 0-wake, 1-stone, x-xp`. Split the
render by id so the arrangement reads as Drew specified:
- **WASH → hero card** — render as the first, featured card:
  `cardShell(a, "council hero", chatLane(a))` (class `council hero`).
- **Wake + Stone → standard `council` cards** in order.
- **XP → compact isolated card**: `cardShell(a, "council compact", chatLane(a))`
  PLUS a small section divider above it:
  `'<div class="council-divider">THE EXPERIENCER — ISOLATED LANE</div>'`
  (heading text is presentation copy; keep it exact).
Implementation: iterate `council` in order and branch:
```js
council.map(a => {
  if (a.id === "wash") return cardShell(a, "council hero", chatLane(a));
  if (a.id === "x-xp") return (
    '<div class="council-divider">THE EXPERIENCER — ISOLATED LANE</div>' +
    cardShell(a, "council compact", chatLane(a))
  );
  return cardShell(a, "council", chatLane(a));
}).join("")
```
- The `<h2>HEAD COUNCIL GHOSTS</h2>` heading stays.
- Lane state capture/restore (004) must still wrap the whole render —
  unchanged logic.
- Chat lane wiring: hero/compact cards keep the same `.chat-lane` +
  `.chat-toggle` markup from `chatLane(a)` (unchanged function).

### 5.3 Everything else in hub.html — UNCHANGED
- `chatLane()`, `cardShell()`, `renderSpecters`, `renderRoster`,
  `renderToolkit`, tab router, SSE client, 30s refresh, footer badge
  `v0.3 — Sandtrap-secured` — untouched.

## 6. Unit 3 — hub.css (EDIT, exact deltas)

Add ONLY these presentation styles (existing PAD tokens; no new colors):

1. **.agent-card.council.hero** — the WASH feature card:
   - `border-color: var(--pad-gold);`
   - stronger surface: keep the 004 gradient, bump the gold inset glow:
     `box-shadow: inset 0 0 40px rgba(212, 168, 42, 0.08), 0 8px 30px rgba(0, 0, 0, 0.35);`
   - `padding: 1.25rem 1.5rem;` (slightly larger than card default)
   - a gold left-edge run: `border-left: 3px solid var(--pad-gold);`
   - `.agent-card.council.hero header strong` — `font-size: 1.35rem;`
   - `.agent-card.council.hero .status` — `background: rgba(212, 168, 42, 0.15);`
   - `margin-bottom: 1.5rem;`

2. **.council-divider** — the XP isolation rail:
   ```css
   .council-divider {
     margin: 1.5rem 0 0.9rem;
     padding-top: 1rem;
     border-top: 1px solid rgba(212, 168, 42, 0.25);
     color: var(--pad-gold);
     font-family: var(--mono);
     font-size: 0.65rem;
     font-weight: 700;
     letter-spacing: 0.18em;
     text-transform: uppercase;
   }
   ```

3. **.agent-card.council.compact** — the XP card:
   - `padding: 0.85rem 1rem;`
   - `opacity: 0.92;`
   - `.agent-card.council.compact header strong` — `font-size: 0.95rem;`
   - `.agent-card.council.compact .tagline` — `font-size: 0.8rem;`
   - Keep the card surface/border family; no new colors.

4. **Council spacing lift** (help the "flat" feel):
   - `#council .agent-card.council:not(.hero) { margin-top: 0.9rem; }`
   - `#council .agent-card.council { transition: transform 0.15s ease, box-shadow 0.15s ease; }`
   - `#council .agent-card.council:hover { transform: translateY(-2px); }` (keep
     the 004 gold-border hover too)

5. Do NOT touch the 004 tokens, palette, tabs polish, chat lane styles, or the
   responsive block. No new colors anywhere — rgba() from existing token
   channels only.

## 7. Unit 4 — Create/Edit test suites (Node built-in, offline)

Pattern: `node --test WASH/GHOST-HUB-005.test.js` on **port 4752**
(`startServer({ port: 4752 })`), shut down in `after`. NO real opencode chat
spawn. New suite:

- T1: server boots on 127.0.0.1:4752; GET / serves the hub shell.
- T2: `/state.council` id order is EXACTLY `wash, 0-wake, 1-stone, x-xp`
  (assert the array string or join — the arrangement is server-side truth).
- T3: `/state.council` contains NO `b-bolt`; `/state.roster` contains a
  `b-bolt` record with displayName **Bolt**.
- T4: served `hub.html` contains `council hero` AND `council compact` AND
  the divider copy `THE EXPERIENCER — ISOLATED LANE`.
- T5: served `hub.html` contains the crash-fix pattern
  `lane.parentElement.querySelector(".chat-toggle")` AND
  `if (!toggle) return;` (regression lock on the blank-tabs fix).
- T6: `/spawn` regression — `node -e console.log('hub-spawn-ok')` → ok true,
  exitCode 0, stdout contains `hub-spawn-ok` (single child-close response).

**Suite updates (edit the PRIOR assertions, nothing else):**
- `GHOST-HUB-002.test.js` test 3: council now `wash, 0-wake, 1-stone, x-xp`,
  shadow `[]`, `b-bolt` absent from council + present in roster with
  displayName **Bolt** (seals assertion kept).
- `GHOST-HUB-003.test.js` T2: "council shows COURRIER" → council order +
  Bolt-off-council ground truth (equivalent to 005 T2/T3).
- `GHOST-HUB-004.test.js` T5: "/state regression" — same Bolt/council
  ground-truth update.

### Run (all suites)
- `node --test WASH/GHOST-HUB-002.test.js` (may need a free port; if the live
  hub holds 4749, note honestly and rely on 005 — only 002's port may
  collide, same as 004 did).
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- Green is mandatory for suites you CAN run. No hack-around for red.

## 8. Unit 5 — Verification (diagnostics)

1. `node --check WASH/hub-server.js` → clean.
2. All runnable suites green (record exact per-suite lines).
3. Grep proofs:
   - `/state.council` order = `wash, 0-wake, 1-stone, x-xp` (Invoke-RestMethod).
   - `/state.roster` b-bolt displayName = `Bolt`.
   - `hub.html` contains `council hero`, `council compact`,
     `THE EXPERIENCER — ISOLATED LANE`, the fix pattern, NO old
     `toggle.addEventListener("click"` without the sibling lookup above it
     (i.e. the new `wireChatLanes` guard exists).
   - `hub.css` contains `.agent-card.council.hero`, `.council-divider`,
     `.agent-card.council.compact`.
4. Live-server presence: record whether 4749 is listening (user's window);
   **do not stop it**; note that files serve from disk per request so the
   native window only needs a reload (Ctrl+R/Cmd+R) — no restart needed.
5. `git status --short` — leaf changes confined to the named files in `WASH/`;
   **VCS HOLD — no commit**.
6. Boundary held: no `server.js` / `index.html` / `app.js` / `style.css` /
   `electron-main.js` / `package.json` / `.opencode/` / game code / Pad / Log /
   Bible / MILESTONES / core docs changed — PASS/FAIL.

## 9. Unit 6 — Report + HALT

1. Plant `WASH/GHOST-HUB-005_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline, server deltas, HTML fix+arrangement, CSS
   deltas, test pass lines, live-server state), honest NOT-DONE list.
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

## 10. Definition of Done

1. Blank-tabs defect fixed: `wireChatLanes` uses the sibling lookup + null
   guard; the page renders specters/roster/toolkit after the fix (verified by
   test-string regression; Drew's reload is the visual confirmation).
2. Bolt: b-bolt displayName `Bolt`; absent from `/state.council`; present in
   roster.
3. HCG order on the page: **WASH hero → Wake → Stone → XP compact (isolated,
   below)** — server orders, client styles.
4. Presentation lift live: hero card, divider, compact card, hover/spacing.
5. All existing behavior intact: /state, /spawn single-response, /chat lanes,
   tab router (now actually reachable after the crash fix), SSE, toolkit,
   specters, roster, footer badge.
6. Suites runnable green; report planted; HALT; VCS HOLD.
7. **Drew's reload pass** — the leaf does not SEAL until Drew reloads the
   native window and confirms the arrangement + presentation are satisfying
   (his words: "the most important part").

## 11. Guardrails

- Touch ONLY the named 9 files. Everything else off-limits.
- `hub-server.js` edits are the 3 exact deltas in §4 — nothing else.
- Live 4749 process OFF-LIMITS — never kill/restart Drew's window.
- Zero discretion: any surprise → STOP and report; BROWN BANANA BREAD for
  danger; no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `.opencode/`, `opencode.json`, Pad/Log/Bible/MILESTONES — read-only.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.