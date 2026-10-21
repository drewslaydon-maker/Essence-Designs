# GHOST-HUB-004 — PRESENTATION PASS (TASK PACKAGE)

**Planted:** 2026-09-20 by PLANNER (0-Wake) · **Executor:** DOER (1-Stone) ·
**Approved by:** Drew Slaydon (Studio Director — "go ahead", 2026-09-20)

> Scope-locked package. Touch ONLY the named targets. Zero discretion, zero
> speculation. Run diagnostics, report, HALT. VCS HOLD — no commits.
> This is a CLIENT presentation pass: **NO server changes** (`hub-server.js`
> is NOT a target). Do NOT touch the live 4749 process (Drew's native window
> is open on the corrected 003 build — leave it alone).

---

## 1. Drew's Directive (what this leaf encodes)

Drew passed the native launch: **"it launches fine, visual design and ordering
of what's shown on the page, how its presented is the most important parts of
this pass... it could be left as is, but it is not satisfying."** Approved the
six-point presentation plan (depth/atmosphere, serif+mono typography, card
re-ordering, collapsed chat lanes behind a per-card toggle, tab+footer polish,
toolkit table polish). Section anatomy + tab ORDER stays exactly as the
mandate: **council → specters → roster → toolkit**. No new colors — existing
PAD tokens only (may derive rgba() from token channel values).

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub.css` | EDIT — presentation styles (deltas below) |
| `WASH/hub.html` | EDIT — card layout, chat toggle, footer badge, state persistence |
| `WASH/GHOST-HUB-004.test.js` | CREATE — new behavioral suite (port 4751) |
| `WASH/GHOST-HUB-004_REPORT.md` | CREATE — report + HALT |

NOT touched: `hub-server.js` (server unchanged — suites 002/003 already prove
it), `hub-agents.json`, `package.json` (stays 0.3.0 — badge will MATCH it),
`electron-main.js`, `install.js`, `server.js`, `index.html`, `style.css`,
`app.js`, `icon.ico`, `ED/` docs, Pad/Log/Bible/MILESTONES, `.opencode/`,
all game code. No commits. Do NOT kill or restart the live 4749 server.

---

## 3. Unit 0 — Baseline gate proof (run FIRST, record)

1. `node --version` (expect v24.x).
2. `git status --short` — record pre-existing dirty tree (**VCS HOLD**, nothing
   committed).
3. `Get-NetTCPConnection -LocalPort 4749 -State Listen` — record whether the
   live hub (Drew's window) is still up. **Leave it running.** (Sequencing note
   for Unit 3: if 4749 is occupied when the suites run, the 002 suite cannot
   bind its port — then run 003 + 004 only, record that, and note 002's green
   state is unaffected because NO server code changed in this leaf.)
4. Record baseline proof of the three presentation defects being fixed:
   - `hub.html` footer contains `v0.2 — Sandtrap-secured`.
   - `hub.css` body background is single flat `var(--bg)` (no gradient layering).
   - Council cards render `.chat-lane` always visible (no `chat-toggle`, no
     `.chat-lane.open`, no `meta-row` in `hub.html`).

---

## 4. Unit 1 — hub.css (EDIT, exact deltas)

Keep the `:root` palette unchanged. Keep ALL existing functional classes
(`.chat-input`, `.chat-send`, `.chat-output`, `.badge`, `.chip-placeholder`,
`.empty`, responsive block, WASH symbol classes). Apply ONLY these changes:

1. **Add two font-family tokens to `:root`** (same family values as the WASH
   console, `style.css`):
   - `--serif: "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;`
   - `--mono: "Cascadia Mono", Consolas, ui-monospace, monospace;`

2. **body background — depth layering** (token-derived rgba only; channels come
   from `--pad-purple-light` = `#6a4c9c` and `--pad-gold` = `#d4a82a`). Replace
   the single `background: var(--bg)` with:
   ```css
   background:
     radial-gradient(1200px 600px at 15% -10%, rgba(106, 76, 156, 0.30), transparent 60%),
     radial-gradient(900px 500px at 90% 110%, rgba(212, 168, 42, 0.08), transparent 55%),
     var(--bg);
   ```
   Keep `background-color: var(--bg)` as the fallback base (same token).

3. **header h1** — add `font-family: var(--serif);` and set
   `letter-spacing: 0.18em;` (replaces 0.05em). Keep gold color + glow,
   uppercase, 700.

4. **main h2 (section heads)** — add `font-family: var(--serif);` and
   `letter-spacing: 0.2em;` (replaces 0.12em). Keep gold color, size, border.

5. **Reader hierarchy — mono caps** (add `font-family: var(--mono);`):
   `.tabs button[role=tab]`, `.agent-card .role`, `.agent-card .status`,
   `.agent-card .access`, `.chip-placeholder`, `.badge`, `footer .version`,
   `.agent-card .level`.

6. **Tabs — active state polish.** Keep hover and the gold underline. REMOVE
   the pulsing `::after` block+keyframes (cleaner presence). Add to the
   `[aria-selected="true"]` rule:
   `box-shadow: inset 0 3px 0 var(--pad-gold);`

7. **.agent-card — surface upgrade:**
   - `background: linear-gradient(180deg, rgba(106, 76, 156, 0.16), var(--card-bg));`
   - `border-radius: 12px;`
   - `box-shadow: inset 0 0 30px rgba(212, 168, 42, 0.03), 0 6px 22px rgba(0, 0, 0, 0.25);`
   - Keep border, padding, margin, hover (gold border + glow).

8. **.agent-card header strong** — `font-family: var(--serif); font-size: 1.05rem;`

9. **.status — restyle as pill:** `border-radius: 999px;`
   (`padding: 0.15rem 0.7rem;`). Keep all status color classes unchanged.

10. **NEW `.meta-row`** — the horizontal ordering rail for card footers:
    ```css
    .agent-card .meta-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.45rem;
    }
    ```

11. **.agent-card .access — simplify** (was a dashed-top block; now inline
    mono text in the meta row): `margin-top: 0; padding-top: 0;
    border-top: none;` (mono already added in #5).

12. **.chat-lane — collapsed by default:**
    ```css
    .chat-lane { display: none; ... }
    .chat-lane.open { display: flex; }
    ```
    Keep the rest of the existing `.chat-lane` block (gap, padding-top, border
    etc.) but change the separator to the gold run-edge:
    `border-top: 1px solid rgba(212, 168, 42, 0.45);`

13. **NEW `.chat-toggle`** — the per-card reveal control (same family as Send):
    ```css
    .chat-toggle {
      margin-top: 0.75rem;
      background: transparent;
      border: 1px solid var(--pad-gold);
      border-radius: 6px;
      color: var(--pad-gold);
      font-family: var(--mono);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.35rem 0.9rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .chat-toggle:hover { background: rgba(212, 168, 42, 0.12); color: var(--pad-gold-light); }
    ```

14. **.toolkit-table tbody td:first-child (tool names)** —
    `font-family: var(--mono); color: var(--pad-gold-light); font-weight: 600;`
    Keep zebra + muted purpose/notes.

---

## 5. Unit 2 — hub.html (EDIT, exact deltas)

1. **Footer badge:** `<span class="version">v0.2 — Sandtrap-secured</span>` →
   `<span class="version">v0.3 — Sandtrap-secured</span>` (matches
   package.json 0.3.0). Nothing else in the footer changes.

2. **Module-scope persistence caches** (inside the IIFE top, near the tab
   router) — needed so the 30s `loadState()` re-render does not kill what
   Drew is looking at:
   ```js
   const laneVisual = {};      // agent -> { open: bool, output: string }
   const sessionCache = {};    // agent -> last sessionId
   ```

3. **cardShell(a, cls, extra)** — outputs the new ordering (top-down: name +
   role · tagline · meta row (status + access) · chat dock). Exact shape:
   ```js
   return `
     <article class="agent-card ${cls}">
       <header>
         <strong>${escapeHtml(a.displayName || a.id)}</strong>
         <span class="role">${escapeHtml(a.role)}</span>
       </header>
       <div class="tagline">${escapeHtml(a.tagline || "")}</div>
       <div class="meta-row">
         <span class="status ${escapeHtml(a.status)}">${escapeHtml(a.status)}</span>
         ${a.access ? `<span class="access">Access: ${escapeHtml(a.access)}</span>` : ""}
       </div>
       ${extra || ""}
     </article>
   `;
   ```

4. **chatLane(a)** — wraps the lane behind the toggle (chat dock):
   ```js
   function chatLane(a) {
     const agentStem = a.id === "wash" ? "0-wake" : a.id;
     return `
       <button class="chat-toggle" type="button" aria-expanded="false">Chat</button>
       <div class="chat-lane" data-agent="${escapeHtml(agentStem)}">
         <div class="chat-input-row">
           <input class="chat-input" placeholder="Message ${escapeHtml(a.displayName || a.id)}..." aria-label="Message ${escapeHtml(a.displayName || a.id)}">
           <button class="chat-send">Send</button>
         </div>
         <pre class="chat-output" aria-live="polite"></pre>
       </div>
     `;
   }
   ```

5. **renderCouncil(council)** — preserve lane state across the re-render:
   - BEFORE building new HTML: capture per agent from the current DOM:
     ```js
     document.querySelectorAll("#council .chat-lane").forEach(lane => {
       const ag = lane.dataset.agent;
       const out = lane.querySelector(".chat-output");
       laneVisual[ag] = { open: lane.classList.contains("open"), output: out ? out.textContent : "" };
     });
     ```
   - Render as before (cards now carry toggle + lane).
   - AFTER render + `wireChatLanes(el)`: restore captured state:
     ```js
     document.querySelectorAll("#council .chat-lane").forEach(lane => {
       const st = laneVisual[lane.dataset.agent];
       if (st && st.open) lane.classList.add("open");
       if (st && st.output) {
         const out = lane.querySelector(".chat-output");
         if (out) out.textContent = st.output;
       }
     });
     ```

6. **wireChatLanes(root)** — same stream/session logic as 003, plus:
   - `let sessionId = sessionCache[agent] || null;` (no longer resets to null
     on every re-render).
   - On a `session=<sid>` line: set `sessionCache[agent] = sid;` AND
     `sessionId = sid;`.
   - Wire the toggle:
     ```js
     const toggle = lane.querySelector(".chat-toggle");
     toggle.addEventListener("click", () => {
       lane.classList.toggle("open");
       toggle.setAttribute("aria-expanded", lane.classList.contains("open"));
       if (lane.classList.contains("open")) input.focus();
     });
     ```
   - Keep: Send → fetch `/chat`, disabled/working state, Enter-to-send, NDJSON
     streaming, `[error]` handling, appending via `textContent` (no HTML).

7. **Specter cards, roster cards, renderToolkit, tab router, SSE client, 30s
   refresh** — unchanged (specter placeholder chip stays honest; no chat for
   specters this leaf).

---

## 6. Unit 3 — Create `WASH/GHOST-HUB-004.test.js` (Node built-in, offline)

Pattern: `node --test WASH/GHOST-HUB-004.test.js`. Boot the server on its own
port **4751** via `startServer({ port: 4751 })`, shut down in `after`. NO real
opencode chat spawn (burn + nondeterminism) — mirror 003's approach. The hub
is a static client — the suite asserts served shell + CSS deltas + state
regression + spawn regression:

- T1: server boots on 127.0.0.1:4751; GET / serves shell with the hub title.
- T2: served `hub.html` footer contains `v0.3 — Sandtrap-secured` and does NOT
  contain `v0.2 — Sandtrap-secured`.
- T3: served `hub.html` contains `class="chat-toggle"`, `class="meta-row"`,
  and `.chat-lane` blocks.
- T4: served `hub.css` contains `.chat-lane.open`, `.chat-toggle`,
  `.meta-row`, and `--serif`/`--mono` tokens.
- T5: `/state` regression — `shadow` is `[]`, council includes COURRIER,
  tkManifest non-empty.
- T6: `/spawn` regression — `node -e console.log('hub-spawn-ok')` → ok true,
  exitCode 0, stdout contains `hub-spawn-ok` (single child-close response).

### Run (all suites)
- `node --test WASH/GHOST-HUB-002.test.js` — requires 4749 free; if the live
  hub still holds it, SKIP and record honestly (no server code changed; 002
  was green after 003 — same server).
- `node --test WASH/GHOST-HUB-003.test.js` — port 4750.
- `node --test WASH/GHOST-HUB-004.test.js` — port 4751.
- Green is mandatory for the suites you CAN run. No hack-around for a red
  test — if a written test conflicts, STOP and report.

---

## 7. Unit 4 — Verification (diagnostics)

1. `node --check WASH/hub-server.js` → clean (server untouched — regression
   check only).
2. Test suites green (Unit 3; record exact lines; note which you skipped and
   why).
3. Grep proofs:
   - `hub.html` contains `v0.3 — Sandtrap-secured`; contains NO `v0.2`.
   - `hub.html` contains NO `SHADOW COUNCIL` (003 regression held).
   - `hub.css` contains `.chat-lane.open`, `.chat-toggle`, `.meta-row`.
4. Live-server presence: record whether 4749 is still listening (Drew's
   window). **Do not stop it.**
5. Native reload eyeball is Drew's window — mark **DEFERRED to Drew**
   honestly. Note: the live server serves files from disk on every request, so
   Drew can simply reload the open native window (Ctrl+R / Cmd+R) to see this
   leaf — no restart needed, no server change.
6. `git status --short` — leaf changes confined to `WASH/` (record separately;
   **VCS HOLD — no commit**).
7. Boundary held: no `hub-server.js`, no `.opencode/`, no game code, no Pad /
   Log / Bible / MILESTONES / `01_OPERATING_CORE.md` changes — PASS/FAIL.

---

## 8. Unit 5 — Report + HALT

1. Plant `WASH/GHOST-HUB-004_REPORT.md` next to this file — restated scope,
   unit-by-unit results (baseline, CSS deltas, HTML deltas, test pass lines,
   live-server state, launch-reload note), honest NOT-DONE list.
2. HALT. Do NOT touch Canon docs, the Pad, Log, Bible, MILESTONES, or other
   files. Do NOT commit (VCS HOLD).

---

## 9. Definition of Done

1. Page presents with depth (layered gradient), serif/mono typography
   hierarchy, polished cards (gradient surface, radius, glow), and the
   re-ordered card layout (name+role · tagline · meta row · chat dock).
2. Council tab: chat lanes collapsed behind the per-card Chat toggle; opening
   expands inline; 30s refresh preserves open state, visible output, and the
   per-card session (continue pattern intact).
3. Footer badge `v0.3 — Sandtrap-secured` — matches package.json 0.3.0.
4. Tabs polished (steady gold top edge + underline on active; no pulse).
   Toolkit tool names mono/gold.
5. All existing behavior intact: /state, /spawn single-response, /chat lanes
   (Wake/Stone/COURRIER/XP/WASH→0-wake), specter honest placeholder, tab
   router, SSE, toolkit render.
6. Suites runnable green (002/003/004); report planted; HALT; VCS HOLD.
7. **Drew's presentation pass** — the leaf does not SEAL until Drew reloads
   the native window and says the presentation is satisfying (his words:
   "the most important part"). Report the reload state honestly.

---

## 10. Guardrails

- Touch ONLY: `WASH/hub.css`, `WASH/hub.html` (edits), `WASH/GHOST-HUB-004.test.js`
  (new), `WASH/GHOST-HUB-004_REPORT.md` (new).
- **`hub-server.js` is OFF-LIMITS this leaf** (presentation is pure client;
  server behavior already proven by 002/003 suites).
- **Live 4749 process OFF-LIMITS** — never kill/restart Drew's window; the
  reload is his action.
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