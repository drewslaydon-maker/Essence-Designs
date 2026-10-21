# GHOST-HUB-006 — CONSOLE SHELL PASS (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (Studio Director — "go, also the console shells on
the main page, so WAKE/STONE split below WASH, then XP below it as a toggle",
2026-09-20)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. VCS HOLD — no commits.

---

## 1. Drew's Directive (what this leaf encodes)

The hub's pages all pass functionally, but the shells are not readable when
opened and lack intuitive design — "specifically in the main council consoles."
This leaf is a **client-side shell pass** across the two live shell surfaces:

1. **GHOST HUB** (`hub.html` / `hub.css`, native 4749) — identity + readability +
   agent symbols + working animation.
2. **WASH console** (`style.css` / `app.js`, 4748) — readability + working
   animation.

Drew's layout ruling for the main (council) page, folded in:
- **WASH hero** stays on top (featured, full-width).
- **WAKE + STONE split** side-by-side below WASH (two columns).
- **XP below that as a toggle** — a collapsed toggle bar expands/collapses the
  XP console shell.

Also approved (no swaps): the 7-glyph agent symbol set — WASH clover · Wake
pencil · Stone anvil · Bolt lightning · XP four-streams · CG Cephalon core ·
ES-GURU open book. And a **working animation** while an agent is working, on
both surfaces.

---

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub.html` | EDIT — era stamp, agent-symbol render (council + specters + roster), chat-lane header row, WAKE/STONE split + XP toggle render, working-state wiring |
| `WASH/hub.css` | EDIT — symbol glyphs (data-URI), split grid, XP toggle, lane header, output readability, working animation keyframes |
| `WASH/app.js` | EDIT — `body.working` toggle around the `/chat` fetch |
| `WASH/style.css` | EDIT — WASH console readability + working glow/pulse |
| `WASH/GHOST-HUB-006.test.js` | CREATE — new hub suite, port 4753 |
| `WASH/wash.test.js` | EDIT — add deltas assertions for the WASH shell pass |
| `WASH/GHOST-HUB-006_REPORT.md` | CREATE — report + HALT |

NOT touched: `hub-server.js` (client-only — 004 precedent), `hub-agents.json`,
`server.js`, `index.html` (WASH shell gets NO structural change — readability is
CSS-only there), `electron-main.js`, `install.js`, `package.json` (stays 0.3.0),
`icon.ico`, `ED/` docs, Pad/Log/Bible/MILESTONES, `.opencode/`, all game code.
No commits. Do NOT kill or restart a live 4749/4748 process if one is running;
reloads are Drew's.

---

## 3. Unit 0 — Baseline gate proof (run FIRST, record)

1. `node --version` (expect v24.x).
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4753 -State Listen` —
   record. Leave any live surface running.
4. Repro proofs (record BEFORE changing anything):
   - `hub.html` has NO `era-stamp`, NO `agent-symbol`, NO `council-split`, NO
     `xp-toggle`, NO `.chat-lane .lane-head`, and `renderCouncil` does not
     toggle a `working` class.
   - `hub.css` has NO `.agent-symbol`, NO `@keyframes` for working, NO
     `.council-split`, NO `.xp-toggle`.
   - `app.js` has NO `body.working`.
   - `style.css` has NO `body.working`.

---

## 4. Unit 1 — hub.html (EDIT, exact deltas)

### 4.1 Header era stamp
Inside `header`, after the `<h1>`, add one line:
```html
<div class="era-stamp">ESSENCE v4 · PAD · ED FLOW 2.0</div>
```
Header otherwise unchanged (title, `hub-symbol`).

### 4.2 Footer stamp
Inside `footer`, BEFORE the TK MANIFEST link, add:
```html
<span class="era-stamp">ESSENCE v4 · PAD</span>
```
Footer otherwise unchanged (link + version `v0.3 — Sandtrap-secured`).

### 4.3 Agent symbols
Add a module-scope glyph map (id → symbol class token; alnum-safe ids only):
```js
const GLYPH = {
  wash: "sym-wash", "0-wake": "sym-wake", "1-stone": "sym-stone",
  "b-bolt": "sym-bolt", "x-xp": "sym-xp", cg: "sym-cg", "es-guru": "sym-guru",
};
const glyphSpan = (a) =>
  `<span class="agent-symbol ${GLYPH[a.id] || "sym-none"}" aria-hidden="true"></span>`;
```

1. **`cardShell(a, cls, extra)`** — add the symbol as the first element inside
   `<header>` (before `<strong>`):
   ```js
   <header>
     ${glyphSpan(a)}
     <strong>${escapeHtml(a.displayName || a.id)}</strong>
     <span class="role">${escapeHtml(a.role)}</span>
   </header>
   ```
   Note: `header` is already `display:flex; justify-content:space-between` —
   with three children, keep justify-content but add `align-items:center` via
   CSS (Unit 2). Do NOT restructure the strong/role order semantics.
2. **`renderSpecters(list)`** — its inline template gets the same symbol span
   as the first element in its `<header>` (same `glyphSpan(s)`).
3. **`renderRoster(list)`** — its inline template gets the same symbol span as
   the first element in its `<header>` (same `glyphSpan(a)`).

### 4.4 Chat-lane header row (readability — the council console)
In `chatLane(a)`, add a lane header row as the FIRST child of `.chat-lane`
(before `.chat-input-row`):
```js
<div class="lane-head">
  ${glyphSpan(a)}
  <span class="lane-name">${escapeHtml(a.displayName || a.id)}</span>
  <span class="lane-role">${escapeHtml(a.role)}</span>
  <span class="lane-status ${escapeHtml(a.status)}">${escapeHtml(a.status)}</span>
</div>
```
Keep `.chat-toggle` ABOVE the lane (it stays a sibling — the 005 crash fix
depends on that), and keep the rest of `chatLane()` identical.

### 4.5 Council layout — WAKE/STONE split + XP toggle (Drew's ruling)
Replace the `council.map(...)` body in `renderCouncil()` with:
```js
html += council.map(a => {
  if (a.id === "wash") return cardShell(a, "council hero", chatLane(a));
  if (a.id === "x-xp") return (
    '<button class="xp-toggle" type="button" aria-expanded="false">' +
      '<span class="xp-toggle-label">THE EXPERIENCER — ISOLATED LANE</span>' +
      '<span class="xp-toggle-mark" aria-hidden="true">◆</span>' +
    '</button>' +
    '<div class="xp-shell">' + cardShell(a, "council compact", chatLane(a)) + '</div>'
  );
  return cardShell(a, "council", chatLane(a));
}).join("");
```
Then wrap the Wake/Stone (non-hero, non-XP) cards in a split container. Because
`map` returns a flat array, split it: after the map, group by role:

- Build the map result into a string, then extract the non-hero/non-XP cards
  into a `<div class="council-split">…</div>`. Exact approach:
  ```js
  const parts = council.map(a => { /* the three branches above */ });
  const hero = parts.find(p => typeof p === "string" && p.includes("council hero"));
  const xp = parts.find(p => typeof p === "string" && p.includes("xp-toggle"));
  const rest = parts.filter(p => p !== hero && p !== xp);
  html += (hero || "");
  html += rest.length ? '<div class="council-split">' + rest.join("") + '</div>' : "";
  html += (xp || "");
  ```
  (Implementation freedom on grouping — the OUTPUT contract is: hero first,
  split container with Wake+Stone in the middle, XP toggle + shell last.)

XP toggle wiring — in `renderCouncil()` after `wireChatLanes(el)`:
```js
const xpToggle = el.querySelector(".xp-toggle");
const xpShell = el.querySelector(".xp-shell");
if (xpToggle && xpShell) {
  xpToggle.setAttribute("aria-expanded", String(xpOpen));
  xpShell.classList.toggle("open", xpOpen);
  xpToggle.addEventListener("click", () => {
    xpOpen = !xpOpen;
    xpToggle.setAttribute("aria-expanded", String(xpOpen));
    xpShell.classList.toggle("open", xpOpen);
  });
}
```
Add `let xpOpen = false;` at module scope next to `laneVisual`/`sessionCache`.
State persistence: in the pre-render capture block (where lane state is
captured), also read current XP toggle state:
```js
const xpEl = document.getElementById("council");
const curToggle = xpEl ? xpEl.querySelector(".xp-toggle") : null;
if (curToggle) xpOpen = curToggle.getAttribute("aria-expanded") === "true";
```
(Place this capture at the top of `renderCouncil`, alongside the lane capture.)

### 4.6 Working-state wiring (hub)
In `wireChatLanes()`:
1. Give the lane reference at the top: the existing `lane` const (the
   `.chat-lane` element) stays — add `const card = lane.closest(".agent-card");`.
2. In `working(busy)`:
   ```js
   send.disabled = busy;
   input.disabled = busy;
   send.textContent = busy ? "Working..." : "Send";
   lane.classList.toggle("working", busy);
   if (card) card.classList.toggle("working", busy);
   ```
3. Nothing else in `wireChatLanes` changes (streaming, session, toggle logic).

---

## 5. Unit 2 — hub.css (EDIT, exact deltas)

Existing PAD tokens only; token-derived rgba channels allowed. No new palette.

1. **`.era-stamp`** (header + footer):
   ```css
   .era-stamp {
     font-family: var(--mono);
     font-size: 0.62rem;
     letter-spacing: 0.22em;
     text-transform: uppercase;
     color: var(--pad-gold-light);
     opacity: 0.85;
   }
   header .era-stamp { margin-top: 0.25rem; z-index: 1; }
   footer .era-stamp { color: var(--fg-muted); }
   ```

2. **`.agent-symbol`** — fixed 26px square glyph slot:
   ```css
   .agent-symbol {
     width: 26px;
     height: 26px;
     flex-shrink: 0;
     background-repeat: no-repeat;
     background-position: center;
     background-size: contain;
   }
   ```
   Then one glyph per agent, inline SVG data-URI, gold `%23d4a82a` stroke
   (WASH ONLY keeps the red lining `%23c0392b`, per Drew's spec). Approved
   glyph sketches (stroke-width ~1.6, round caps, fill none unless stated):
   - `.agent-card header .agent-symbol, .chat-lane .lane-head .agent-symbol { margin-right: 0.6rem; }` (spacing within flex rows)
   - `.sym-wash` — reuse the EXACT clover SVG already in `hub.css` (`%23d4a82a` fill + `%23c0392b` stroke, four circles + stem; same data-URI).
   - `.sym-wake` — pencil (reuse WASH console mark): `M4 20l.9-4.4L16.2 4.3a2.2 2.2 0 0 1 3.1 0l.4.4a2.2 2.2 0 0 1 0 3.1L8.4 19.1 4 20z` + `M13.5 7l3.5 3.5`.
   - `.sym-stone` — anvil: `M3 6h18M5 6l3 7h8l3-7M6 13h12l2 3H4z`.
   - `.sym-bolt` — lightning: `M13 2L5 13h5l-2 9 9-12h-5z`.
   - `.sym-xp` — four streams: `M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z`.
   - `.sym-cg` — Cephalon core: outer `M12 3l7 9-7 9-7-9z` + inner droplet `M12 9l3 3-3 3-3-3z`.
   - `.sym-es-guru` — open book: `M12 6c-2-2-5-2-9-1v13c4-1 7-1 9 1 2-2 5-2 9-1V5c-4-1-7-1-9 1z` + `M12 6v13`.
   - `.sym-none` — empty (no glyph).

3. **Card header layout** — with three children now (symbol, strong, role):
   add `align-items: center;` to `.agent-card header` (keep
   `justify-content: space-between`), and give `.agent-card header strong` a
   `margin-right: auto;` so the role stays right-aligned.

4. **`.council-split`** — the WAKE/STONE split:
   ```css
   .council-split {
     display: grid;
     grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
     gap: 0.9rem;
     margin-bottom: 0.9rem;
   }
   #council .council-split .agent-card.council { margin-top: 0; }
   @media (max-width: 760px) { .council-split { grid-template-columns: 1fr; } }
   ```
   (Fold the split responsive rule into the existing responsive block.)

5. **`.xp-toggle` + `.xp-shell`**:
   ```css
   .xp-toggle {
     display: flex;
     align-items: center;
     justify-content: space-between;
     width: 100%;
     margin: 1.5rem 0 0.9rem;
     padding: 0.8rem 1rem;
     background: var(--bg-elevated);
     border: 1px solid rgba(212, 168, 42, 0.25);
     border-radius: 8px;
     color: var(--pad-gold);
     font-family: var(--mono);
     font-size: 0.65rem;
     font-weight: 700;
     letter-spacing: 0.18em;
     text-transform: uppercase;
     cursor: pointer;
     transition: border-color 0.2s, background 0.2s;
   }
   .xp-toggle:hover { border-color: var(--pad-gold); background: rgba(212, 168, 42, 0.08); }
   .xp-toggle[aria-expanded="true"] .xp-toggle-mark { transform: rotate(180deg); }
   .xp-toggle-mark { transition: transform 0.2s ease; }
   .xp-shell { display: none; }
   .xp-shell.open { display: block; }
   ```
   The XP card inside keeps `.agent-card.council.compact` (005 classes intact —
   005's suite T4 still finds `council compact` and the divider copy text).

6. **`.lane-head`** (chat console header row):
   ```css
   .lane-head {
     display: flex;
     align-items: center;
     flex-wrap: wrap;
     gap: 0.5rem;
     padding-bottom: 0.5rem;
     border-bottom: 1px solid rgba(212, 168, 42, 0.3);
   }
   .lane-head .lane-name { font-family: var(--serif); font-size: 0.9rem; font-weight: 700; color: var(--fg); }
   .lane-head .lane-role { font-family: var(--mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pad-gold-light); }
   .lane-head .lane-status { margin-top: 0; margin-left: auto; }
   ```

7. **`.chat-output` readability lift**:
   - `font-size: 0.75rem;` → `0.8rem;`
   - `line-height: 1.4;` → `1.55;`
   - `background: var(--bg);` → `var(--bg-elevated);`
   - `max-height: 160px;` → `240px;`
   - keep border/radius/padding/mono family.

8. **Working animation (hub)** — gold breathing on an open working lane:
   ```css
   @keyframes hubWorking {
     0%, 100% { border-color: var(--pad-gold); box-shadow: inset 0 0 18px rgba(212, 168, 42, 0.08); }
     50% { border-color: var(--pad-gold-light); box-shadow: inset 0 0 30px rgba(212, 168, 42, 0.18); }
   }
   .chat-lane.working .chat-output { animation: hubWorking 1.6s ease-in-out infinite; }
   .chat-lane.working .chat-send { animation: hubWorking 1.6s ease-in-out infinite; }
   ```
   (Only the output + send breathe; the lane layout is untouched.)

9. **Responsive block** — extend as in #4 (split collapse). Existing
   `@media (max-width: 600px)` rules unchanged.

10. Do NOT touch: 004 tokens/palette, tabs polish, 005 hero/divider/compact
    styles (keep `.council-divider` rule block even if unused — 005 suite
    greps it), chat toggle, footer link/version, `hub-symbol`.

---

## 6. Unit 3 — app.js (EDIT, exact delta)

WASH console — drive `body.working` around the `/chat` fetch in
`sendMessage(message)`:
```js
async function sendMessage(message) {
  if (busy) return;
  busy = true;
  sendBtn.disabled = true;
  input.value = "";
  document.body.classList.add("working");
  history.querySelector(".hint")?.remove();
  ...
  } finally {
    busy = false;
    sendBtn.disabled = false;
    document.body.classList.remove("working");
    input.focus();
  }
}
```
(One `classList.add` after the busy set, one `classList.remove` in `finally` —
no other logic changes.)

---

## 7. Unit 4 — style.css (EDIT, exact deltas)

1. **Ghost bubble contrast + meta readability:**
   - `.bubble` `font-size: 14px` → `15px`.
   - `.bubble.ghost` `color: var(--paper);` keep, plus
     `border-color: rgba(124, 92, 191, 0.55);` (stronger purple edge).
   - `.bubble .meta` `font-size: 9px` → `10.5px`.
2. **State-block readability:**
   - `.state-block pre` `font-size: 10.5px` → `11.5px`, `color: var(--violet-text)` → `var(--paper)`.
   - `.state-block h3` `font-size: 10px` → `11px`.
3. **Working animation (WASH console):**
   ```css
   @keyframes washWorking {
     0%, 100% { border-color: rgba(212, 175, 55, 0.5); box-shadow: inset 0 0 16px rgba(212, 175, 55, 0.10); }
     50% { border-color: rgba(212, 175, 55, 0.9); box-shadow: inset 0 0 28px rgba(212, 175, 55, 0.22); }
   }
   body.working .bubble.ghost.run { animation: washWorking 1.6s ease-in-out infinite; }
   body.working .chat-form button { animation: washWorking 1.6s ease-in-out infinite; }
   ```
4. Do NOT touch: palette, layout grid, panel structure, pills, footer, the
   live-dot pulse, responsive block.

---

## 8. Unit 5 — Tests

### 8.1 CREATE `WASH/GHOST-HUB-006.test.js` (port 4753)
Pattern: `node --test WASH/GHOST-HUB-006.test.js`, boot on 4753
(`startServer({ port: 4753 })`), shut down in `after`. No real opencode chat
spawn. Assertions (served shell + deltas + regressions):

- T1: server boots on 127.0.0.1:4753; GET / serves the hub shell (title).
- T2: served `hub.html` contains `era-stamp` (header + footer), `agent-symbol`,
  `council-split`, `xp-toggle`, `xp-shell`, `lane-head`, and `lane.classList.toggle("working"`.
- T3: served `hub.css` contains `.agent-symbol`, `.council-split`, `.xp-toggle`,
  `.xp-shell`, `.lane-head`, and `@keyframes hubWorking`.
- T4: served `hub.html` retains 005 ground truth: `council hero` + `council
  compact` + `THE EXPERIENCER — ISOLATED LANE` + `council-divider` text in CSS
  (served hub.css check) + crash-fix pattern
  `lane.parentElement.querySelector(".chat-toggle")` + `if (!toggle) return;`.
- T5: glyph map present: served `hub.html` contains `sym-wash`, `sym-wake`,
  `sym-stone`, `sym-bolt`, `sym-xp`, `sym-cg`, `sym-es-guru`.
- T6: `/spawn` regression — `node -e console.log('hub-spawn-ok')` → ok true,
  exitCode 0, stdout contains `hub-spawn-ok`.

### 8.2 EDIT `WASH/wash.test.js` (add assertions ONLY)
Append a new test (keeps existing 1–7 untouched):

- test "8 · shell pass deltas — working animation + readability":
  - GET `/style.css` → contains `body.working`, `@keyframes washWorking`,
    `.bubble .meta` font-size `10.5px`.
  - GET `/app.js` → contains `classList.add("working")` and
    `classList.remove("working")`.
  - GET `/` still serves the WASH title (regression).

### 8.3 Run (all suites)
- `node --test WASH/wash.test.js` — 4748 (skip ONLY if a live WASH console
  holds 4748; then record honestly).
- `node --test WASH/GHOST-HUB-002.test.js` — 4749 (skip if live hub holds it;
  same 004 precedent — no server code changed).
- `node --test WASH/GHOST-HUB-003.test.js` — 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — 4751.
- `node --test WASH/GHOST-HUB-005.test.js` — 4752.
- `node --test WASH/GHOST-HUB-006.test.js` — 4753.
- Green is mandatory for suites you CAN run. No hack-around for red — if a
  written test conflicts with an older suite's assertion, STOP and report.

---

## 9. Unit 6 — Verification (diagnostics)

1. `node --check WASH/hub.html`? — not applicable (HTML). Instead:
   `node --check WASH/app.js` → clean.
2. All runnable suites green (record per-suite lines).
3. Grep proofs:
   - `hub.html`: `era-stamp` ×2, `council-split`, `xp-toggle`, `lane-head`,
     all 7 `sym-*` tokens, `classList.toggle("working"`.
   - `hub.css`: `@keyframes hubWorking`, `.agent-symbol`, `.sym-wash`,
     `.sym-wake`, `.sym-stone`, `.sym-bolt`, `.sym-xp`, `.sym-cg`,
     `.sym-es-guru`, `.council-split`, `.xp-toggle`, `.lane-head`; 005
     `.council-divider` STILL present (suite regression).
   - `app.js`: `classList.add("working")` + `classList.remove("working")`.
   - `style.css`: `@keyframes washWorking`, `body.working`.
4. Live-surface presence: record whether 4748 / 4749 are listening; **do not
   stop them**; files serve from disk per request — only a reload is needed.
5. `git status --short` — leaf changes confined to the named 7 files in `WASH/`;
   **VCS HOLD — no commit**.
6. Boundary held: no `index.html` / `server.js` / `hub-server.js` /
   `hub-agents.json` / `electron-main.js` / `package.json` / `.opencode/` /
   game code / Pad / Log / Bible / MILESTONES changed — PASS/FAIL.

---

## 10. Unit 7 — Report + HALT

1. Plant `WASH/GHOST-HUB-006_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline, hub HTML deltas, hub CSS deltas, app.js
   delta, style.css deltas, test pass lines, live-surface state), honest
   NOT-DONE list.
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

---

## 11. Definition of Done

1. **Identity:** era stamp in header + footer; agent symbols render on council,
   specters, and roster cards; chat lanes show the agent's symbol + name + role
   + status header row.
2. **Council layout (Drew's ruling):** WASH hero → WAKE/STONE split (two
   columns) → XP toggle + shell (collapsed by default; opens closes; state
   survives the 30s re-render).
3. **Readability:** `.chat-output` larger/higher-contrast (240px, bg-elevated,
   1.55 line-height); WASH console bubble + meta + state-block sizes lifted.
4. **Working animation:** hub lanes/cards breathe gold while working; WASH
   console body-class drives glow + button pulse while streaming; both revert
   cleanly when done.
5. **Regressions:** crash fix intact (005), 002→005 suites unchanged-gold where
   runnable; `wash.test.js` 1–7 untouched + new test 8 green.
6. Suites runnable green; report planted; HALT; VCS HOLD.
7. **Drew's reload pass** — the leaf does not SEAL until Drew reloads BOTH the
   native hub window (4749) and the WASH console (4748) and confirms the shells
   read well + the working animation plays (his words: the shells "aren't
   really readable when opened, and lack intuitive design" — this is the fix).

---

## 12. Guardrails

- Touch ONLY the named 7 files. Everything else off-limits.
- `hub-server.js` / `server.js` are OFF-LIMITS this leaf (presentation is pure
  client; behavior already proven by 002→005 suites + wash.test.js).
- Live 4748 / 4749 processes OFF-LIMITS — never kill/restart Drew's windows;
  reloads are his action.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); no adjacent fixes.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `.opencode/`, `opencode.json`, Pad/Log/Bible/MILESTONES — read-only, untouched.
- Masquerade forbidden: state exactly what ran, what passed, what did not.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.

---

**PLANTED 2026-09-20 by PLANNER (0-Wake, Big Pickle), Drew-approved.**
Drew: point the DOER (1-Stone) window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.