# GHOST-HUB-006 — CONSOLE SHELL PASS (REPORT)

**Executed:** 2026-09-20 by DOER (1-Stone, Big Pickle) · **HALT after report — VCS HOLD.**

---

## Scope restated

Client-side shell pass across the two live shell surfaces, per Drew's ruling
("WASH hero top, WAKE/STONE split below WASH, XP below as a toggle") and the
approved 7-glyph agent symbol set + working animation:

| File | Action |
|---|---|
| `WASH/hub.html` | EDIT — era stamps, glyph map, lane-head, council split + XP toggle, working wiring |
| `WASH/hub.css` | EDIT — glyphs (data-URI), split grid, XP toggle, lane-head, readability, keyframes |
| `WASH/app.js` | EDIT — `body.working` around the `/chat` fetch |
| `WASH/style.css` | EDIT — console readability + `washWorking` glow/pulse |
| `WASH/GHOST-HUB-006.test.js` | CREATE — hub suite, port 4753 |
| `WASH/wash.test.js` | EDIT — appended test 8 |
| `WASH/GHOST-HUB-006_REPORT.md` | CREATE — this file |

NOT touched: `hub-server.js`, `hub-agents.json`, `server.js`, `index.html`,
`electron-main.js`, `install.js`, `package.json`, `icon.ico`, `ED/` docs, the
Pad/Log/Bible/MILESTONES, `.opencode/`, all game code. No commits.

---

## Unit 0 — Baseline gate proof

1. `node --version` → **v24.19.0** (v24.x expected ✓)
2. `git status --short` → **pre-existing dirty tree recorded** (many modified
   `ED/` + legacy files; `WASH/` already untracked `??`). VCS HOLD — no commits
   this leaf.
3. Ports `Get-NetTCPConnection -LocalPort 4748,4749,4753 -State Listen` → **no
   listeners** (no live surfaces at baseline; none were touched).
4. Repro proofs (all confirmed ABSENT before any edit):
   - `hub.html`: NO `era-stamp`, `agent-symbol`, `council-split`, `xp-toggle`,
     `lane-head`, `classList.toggle("working")`.
   - `hub.css`: NO `.agent-symbol`, `.council-split`, `.xp-toggle`, `.lane-head`;
     only pre-existing `@keyframes fadeIn` (not a working animation).
   - `app.js`: NO `body.working`.
   - `style.css`: NO `body.working`.

---

## Unit 1 — hub.html (EDIT) — DONE

- **4.1 header era stamp** — `<div class="era-stamp">ESSENCE v4 · PAD · ED FLOW 2.0</div>`
  added inside `header` after `<h1>`; title + `hub-symbol` untouched.
- **4.2 footer stamp** — `<span class="era-stamp">ESSENCE v4 · PAD</span>` added
  inside `footer` BEFORE the TK MANIFEST link; link + version untouched.
- **4.3 agent symbols** — `GLYPH` map + `glyphSpan(a)` at module scope;
  `cardShell`, `renderSpecters`, `renderRoster` headers all render the symbol as
  the FIRST child of their `<header>` (before `<strong>`); strong/role order
  semantics preserved.
- **4.4 chat-lane header row** — `.lane-head` (symbol + name + role + status)
  added as FIRST child of `.chat-lane`, before `.chat-input-row`; `.chat-toggle`
  stays the sibling ABOVE the lane (005 crash fix intact). Rest of `chatLane()`
  identical.
- **4.5 council layout** — `renderCouncil` now: capture XP toggle state (survives
  the 30s re-render) → map three branches (wash hero / x-xp toggle+shell / rest)
  → assemble hero first, then `<div class="council-split">` with Wake+Stone,
  then XP toggle + `xp-shell` last → wire XP toggle (aria-expanded + `.open`,
  toggle next to `laneVisual`/`sessionCache` as `let xpOpen = false`). Output
  contract matches Drew's ruling exactly.
- **4.6 working wiring** — `wireChatLanes`: `const card = lane.closest(".agent-card")`
  added; `working(busy)` now toggles `lane.classList.toggle("working", busy)` and
  `card.classList.toggle("working", busy)`; streaming/session/toggle logic untouched.

---

## Unit 2 — hub.css (EDIT) — DONE

- `.era-stamp` (header + footer) per spec — existing tokens only.
- `.agent-symbol` 26px glyph slot + full 7-glyph set as inline SVG data-URIs:
  `sym-wash` (EXACT hub clover reuse — gold fill + red lining), `sym-wake`
  (pencil), `sym-stone` (anvil), `sym-bolt` (lightning), `sym-xp` (four
  streams), `sym-cg` (Cephalon core), `sym-es-guru` (open book); gold
  `%23d4a82a` stroke ≈1.6, round caps, fill none; `sym-none` empty.
- Card header: `.agent-card header strong` got `margin-right: auto`
  (`.agent-card header` already had `align-items: center` — no redundant edit).
- `.council-split` 2-up grid + `#council .council-split .agent-card.council { margin-top: 0 }`;
  split collapse folded into the existing `@media (max-width: 600px)` block.
- `.xp-toggle` + `.xp-toggle-mark` rotation + `.xp-shell`/`.xp-shell.open`.
  XP card keeps `.agent-card.council.compact` (005 classes intact).
- `.lane-head` + name/role/status rules.
- `.chat-output` readability lift: max-height 240px, bg-elevated, 0.8rem,
  line-height 1.55.
- `@keyframes hubWorking` breathing gold on `.chat-lane.working .chat-output`
  + `.chat-lane.working .chat-send`.
- `.council-divider` rule block KEPT (005 suite greps it), per guardrail #10;
  004 tokens/palette, tabs polish, 005 hero/compact, chat toggle, footer,
  `hub-symbol` untouched.

---

## Unit 3 — app.js (EDIT) — DONE

- `document.body.classList.add("working")` after the busy set in
  `sendMessage(message)`; `document.body.classList.remove("working")` in the
  `finally` block. Only those two lines changed. `node --check WASH/app.js` → clean.

---

## Unit 4 — style.css (EDIT) — DONE

- `.bubble` font-size 14px → 15px; `.bubble.ghost` keeps `color: var(--paper)`
  and gained `border-color: rgba(124, 92, 191, 0.55)`; `.bubble .meta` 9px → 10.5px.
- `.state-block pre` 10.5px → 11.5px + `color: var(--violet-text)` → `var(--paper)`;
  `.state-block h3` 10px → 11px.
- `@keyframes washWorking` + `body.working .bubble.ghost.run` / `body.working .chat-form button`.
- Palette, layout, panel structure, pills, footer, live-dot pulse, responsive
  block untouched.

---

## Unit 5 — Tests — ALL GREEN

| Suite | Port | Result |
|---|---|---|
| `node --test WASH/wash.test.js` | 4748 | **8 pass / 0 fail** (1–7 untouched + NEW test 8 green) |
| `node --test WASH/GHOST-HUB-002.test.js` | 4749 | **8 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-003.test.js` | 4750 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-004.test.js` | 4751 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-005.test.js` | 4752 | **6 pass / 0 fail** |
| `node --test WASH/GHOST-HUB-006.test.js` | 4753 | **6 pass / 0 fail** |

(GHOST-HUB-001 suite was NOT in the package's 8.3 run list — not run per scope.
No suite was skipped for port conflict.)

All runnable suites are green; no hack-around for red was needed — see the one
resolved inconsistency below (not an older-suite conflict).

---

## Unit 6 — Verification

1. `node --check WASH/app.js` → **clean**.
2. Grep proofs:
   - `hub.html`: `era-stamp` ×2 (header + footer), `council-split`, `xp-toggle`,
     `lane-head`, all 7 `sym-*` tokens, `classList.toggle("working"` (×2:
     lane + card) — **PASS**.
   - `hub.css`: `@keyframes hubWorking`, `.agent-symbol`, `.sym-wash`,
     `.sym-wake`, `.sym-stone`, `.sym-bolt`, `.sym-xp`, `.sym-cg`,
     `.sym-es-guru`, `.council-split`, `.xp-toggle`, `.lane-head` — **PASS**;
     005 `.council-divider` STILL present (line 592) — **PASS**.
   - `app.js`: `classList.add("working")` + `classList.remove("working")` — **PASS**.
   - `style.css`: `@keyframes washWorking` + `body.working` — **PASS**.
3. Live surfaces: **none listening** on 4748/4749/4753 at start or finish — no
   process was killed or restarted. Files serve from disk per request; only
   Drew's reload is needed (leaf does not SEAL until his reload pass).
4. `git status --short` — changes confined to the named 7 files inside `WASH/`
   (`WASH/` untracked dir as at baseline). **VCS HOLD — no commit.**
5. Boundary: NO `index.html` / `server.js` / `hub-server.js` / `hub-agents.json`
   / `electron-main.js` / `package.json` / `.opencode/` / game code / Pad / Log /
   Bible / MILESTONES touched — **PASS**.

---

## Deviations / notes (honest)

1. **One internal package inconsistency resolved on-site.** Package 4.3's exact
   GLYPH map read `"es-guru": "sym-guru"`, but 5.2 specifies the CSS glyph class
   `.sym-es-guru` and 8.1 T5 asserts served `hub.html` contains `sym-es-guru`.
   Keeping the 4.3 value verbatim would (a) fail T5 and (b) render the Guru glyph
   permanently invisible (no `.sym-guru` rule exists). Two of the three package
   references agree on `sym-es-guru`; per "green is mandatory for suites you CAN
   run", the map value was aligned to `sym-es-guru`. One token changed; CSS and
   test left exactly as planted. Flag for Drew's review.
2. `node --check` for hub.html's inline script is not a supported command
   (HTML file); inline script correctness is exercised by the serving suites
   (002→006 green) + grep proofs.
3. `@keyframes fadeIn` pre-existed in hub.css (004-era); the "no working
   keyframe" repro proof refers to no *working* animation, which held.

---

## Not done (per package contract)

- NO commit / VCS HOLD honored.
- NO live process killed, restarted, or reloaded — reloads are Drew's.
- No edits outside the named 7 files.
- Leaf is **NOT SEALED**: DoD #7 requires Drew's reload pass of the native hub
  window (4749) and the WASH console (4748) to confirm shells read well + the
  working animation plays.

---

## HALT

Report planted. Waiting for Drew to route the next action (reload pass +
confirm; no further steps executed without a fresh task package).

**PLANTED 2026-09-20 by DOER (1-Stone).**