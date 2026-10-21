# V-D-001 — VISUAL SPEC REVIEW, FULL ASSESSMENT (REPORT)

**Planted:** 2026-09-21 by V-D (VISUAL DESIGNER — SPECIFIED SPECTER, first session, agent `v-d`)
**Package:** `WASH/V-D-001_VISUAL-SPEC-REVIEW_TASK.md` · **Approved by:** Drew Slaydon (2026-09-21)
**Leaf type:** READ-ONLY assessment — documentation + proposal + questions. NO code changes. **VCS HOLD.**

> This report is the gate for V-D-002. Drew's approval (or amendments) to the
> target spec in §6 and the answers to §7 are the build contract. Honest
> label discipline: every finding is tagged **[VERIFIED]** (read + line-grounded
> against the file on disk) or **[SUSPECTED]** (inference, flagged as such).

---

## 0. Scope restated (from the package)

| Surface | Files | Role in review |
|---|---|---|
| **Ghost Hub** | `WASH/hub.html`, `WASH/hub.css` | Review target |
| **WASH console (4748)** | `WASH/index.html`, `WASH/app.js`, `WASH/style.css` | Review target |
| Context (state semantics only) | `WASH/hub-server.js`, `WASH/server.js`, `WASH/hub-agents.json` | Read for behavior grounding, not to review markup |
| Context (history) | `WASH/GHOST-HUB-006_REPORT.md`, `WASH/GHOST-HUB-008_REPORT.md`, `WASH/README.md`, `ED/01_THE_DESIGNS/ICONS/*`, `.opencode/agents/` dir | Read for glyph style, renderer intent, seat state |
| Pad-captured WASH UI refinement scope | `ED/02_ESSENCE_PAD.md` (WASH entry — thinking-stream render + dashboard polish) | Known items, fold into §6 as targets, NOT implemented |

**Boundary held:** no object was created, edited, or deleted except this file.

---

## 1. SURFACE INVENTORY (Unit 1)

Every visual element in scope, with driver + reference.

### 1.1 Ghost Hub — `hub.html` (431 lines) + `hub.css` (708 lines)

| # | Element | Driver | Build: reference |
|---|---|---|---|
| 1 | Page shell | `<body>` flex column, radial purple/gold backgrounds, `--bg` base | hub.html:8–13; hub.css:29–45 |
| 2 | Header (serif gold h1 + red-lining ring + era stamp) | `header`, `header::before` | hub.html:9–13; hub.css:48–76 |
| 3 | Hub symbol (purple smooth box + golden clover w/ red lining) | `.hub-symbol::before/::after` (inline SVG data-URI) | hub.html:12; hub.css:79–112 |
| 4 | Era stamps (header + footer) | `.era-stamp` mono gold-light else footer muted | hub.html:11, 27; hub.css:115–124 |
| 5 | Tabs (4: council / specters / roster / toolkit) | `nav.tabs button[role=tab]`, hash router, `aria-selected` | hub.html:14–19, 54–74; hub.css:127–164 |
| 6 | Panel sections + section headings | `main section[role=tabpanel]`, `h2` serif gold | hub.html:20–25; hub.css:167–194 |
| 7 | Agent glyph system (7-glyph set + `sym-none`) | `GLYPH` map object + `glyphSpan()`, `.agent-symbol` bg data-URI SVGs | hub.html:45–52; hub.css:197–247 |
| 8 | Council cards (hero / split / compact XP) | `renderCouncil()` + `cardShell()`; hero WASH first, split Wake+Stone, XP toggle rail | hub.html:100–183; hub.css:575–664 |
| 9 | Specter cards + disabled chat chip | `renderSpecters()`; `.chip-placeholder` | hub.html:352–371; hub.css:352–368 |
| 10 | Roster cards + badges (seal / milestone / level pill) | `renderRoster()`; `.badges`, `.badge.seal/.milestone`, `.level` | hub.html:373–407; hub.css:298–306, 371–398 |
| 11 | Toolkit table | `renderToolkit()`; `.toolkit-table` | hub.html:413–422; hub.css:408–453 |
| 12 | Chat toggle + lane (head, input row, send, output, you/ghost-reply) | `chatLane()`, `wireChatLanes()`, `handleHubEvent()`, `appendLine()` | hub.html:185–350; hub.css:455–571 |
| 13 | Working state (gold breathing) | `.chat-lane.working .chat-output/.chat-send` + `@keyframes hubWorking` | hub.html:254–260; hub.css:566–571 |
| 14 | Footer (era stamp + TK MANIFEST + version) | `footer` | hub.html:26–30; hub.css:667–697 |
| 15 | Responsive | `@media (max-width: 600px)` only | hub.css:700–707 |

### 1.2 WASH console — `index.html` (52), `app.js` (213), `style.css` (314)

| # | Element | Driver | Build: reference |
|---|---|---|---|
| 1 | Topbar: brand (pencil SVG + serif gold title + mono sub) + banner pill | `.topbar`, `.brand`, `.pencil-mark`, `.banner` | index.html:10–22; style.css:35–86 |
| 2 | Chat panel + history region | `.chat-panel`, `.history` | index.html:25–34; style.css:99–129 |
| 3 | Hint line (removed on first send) | `#hint` `.hint` | index.html:28; style.css:131–136; app.js:137 |
| 4 | Bubble language (you / ghost run / done / error + meta) | `addBubble()` classes `bubble you`, `bubble ghost run\|done\|error`, `.meta` | app.js:26–41; style.css:138–178 |
| 5 | Chat form (input + send) | `.chat-form`, `#message-input`, `#send-btn` | index.html:30–33; style.css:180–216 |
| 6 | State dashboard blocks (PAD excerpt, leaves, captain's log) | `renderState()`; `.state-block`, `pre`, `.leaf`, `.hint` | index.html:36–41; app.js:45–69; style.css:218–259 |
| 7 | Footer pills (session / clock with live-dot / version) | `#session-pill`, `#clock-pill`, `.pill`, `.live-dot` | index.html:44–48; style.css:261–299 |
| 8 | Working state (gold glow while streaming) | `body.working` + `@keyframes washWorking` | app.js:136, 195; style.css:301–307 |
| 9 | Responsive | `@media (max-width: 900px)` | style.css:309–314 |

---

## 2. CURRENT SPEC, GROUNDED — GHOST HUB (A)

**Identity that holds:** header serif gold h1 + red-lining ring (hub.css:48–76),
era stamps (115–124), the WASH clover hub symbol (79–112), tabs with gold active
state (159–164), serif section h2s (183–192), the whole 7-glyph seat language
(197–247), card status pills (314–332), toolkit table with gold header (425–432),
XP isolation rail (619–642), hero card framing (575–589), council 2-up split
(658–664). The purple/gold PAD vocabulary is real and consistent **inside the hub.**

**Where the hub breaks down:** exclusively inside chat lanes. `hub.html:185–204`
builds the lane with no bubble styling hooks, and the `run()` renderer pushes
`you`/`ghost-reply` divs (275–281) and plain `appendLine()` divs (261–265) into a
muted mono `<pre>` (hub.css:516–529). All the polish stops at the lane border.

---

## 3. CURRENT SPEC, GROUNDED — WASH CONSOLE (A)

The console owns the studio's **only bubble language**: `.bubble` / `.bubble.you`
/ `.bubble.ghost` / `.bubble.ghost.run` / `.bubble.ghost.done` / `.bubble.error`
/ `.bubble .meta` (style.css:138–178) driven by `addBubble()` (app.js:26–41).
You-bubbles right-aligned gold-edged; ghost left-aligned purple-edged; error red;
working glow (301–307). Meta rows give every turn a mono label (you →
"you"; ghost → "ghost · 0-wake · streaming… / done · session …"). The dashboard
has three state blocks; pills carry session (short-id) + clock + version.

**Where the console breaks down:** it is a v0.1 shell. The dashboard is bare
(Pad-captured item: captain's log shows only the last date string; pad excerpt is
raw first-600-chars markdown; leaves are raw bullets). Brand mark is the **Wake
pencil** (index.html:12–15), not the WASH clover. No red-lining anywhere in
style.css. State panel loads once at boot (app.js:212), no 30s refresh like the hub.

---

## 4. DEFECTS & GAPS (B)

### 4.1 The 3 known defects — all [VERIFIED]

**D1. Micro chat boxes before a message is sent — [VERIFIED]**
`hub.css:516–529`: `.chat-output` declares `max-height: 240px` and NO
`min-height`. The element is an empty `<pre>` (hub.html:201) with `padding: 0.5rem`
until the first send; on an opened lane it renders as a ~18px sliver (padding +
border, zero text). The console has no such defect (its history is a flex column
with the hint filling it).

**D2. Replies read like a terminal wall — [VERIFIED]**
- Streamed replies go through `handleHubEvent()` → `ghostText.textContent` onto a
  bare `.ghost-reply` div (hub.html:279–281, 212–242). **Zero CSS selectors** for
  `.you` or `.ghost-reply` exist in hub.css (grepped — no matches except body
  `min-height: 100vh`). No bubble background, no border, no radius, no
  you-vs-ghost distinction, no meta label.
- The container is a `<pre>` in muted mono (`color: var(--fg-muted)`,
  hub.css:522–523) — long replies render as washed-out monospace walls, exactly
  Drew's "poorly formatted within a terminal."
- `appendLine()` (hub.html:261–265) creates bare `<div>` children inside a
  `<pre>` element — **invalid HTML content model** (pre permits phrasing content
  only; div is flow content). Browsers render it, but the children inherit
  pre-wrap styling with no class hooks.

**D3. Duplicate agent names on the main page — [VERIFIED]**
Card header renders glyph + displayName + role (hub.html:104–107); the opened
lane's `.lane-head` renders glyph + displayName + role + status AGAIN
(hub.html:191–195). Visually identical name+role in two places when a lane is
open.

### 4.2 Additional GHOST HUB findings

**D4. `v-d` has no glyph slot — [VERIFIED]** (Planner-flagged, confirmed)
- `GLYPH` map at hub.html:47–50 has exactly 7 entries (`wash`, `0-wake`,
  `1-stone`, `b-bolt`, `x-xp`, `cg`, `es-guru`).
- `hub-agents.json:12` serves `v-d` in SPECIFIED SPECTERS; `renderSpecters()`
  (hub.html:358–370) calls `glyphSpan(s)` (hub.html:361) → falls back to
  `sym-none` (hub.html:52; hub.css:247) → **V-D's own card renders an empty glyph
  slot on the hub today.**

**D5. Lane status is plain text, not a pill — [VERIFIED]**
Card status pills get color/bg from `.agent-card .status.*` rules
(hub.css:326–332). The lane status span carries class `lane-status live`
(hub.html:195), and the ONLY rule that touches it is `.lane-head .lane-status
{ margin-top: 0; margin-left: auto; }` (hub.css:563). No pill, no color — the
lane-head duplicates the status without the status's own visual language.

**D6. Full session-ids dumped into the transcript every turn — [VERIFIED]**
`hub-server.js:570` always ends a stream with `session=<sid>` when a session was
seen; hub.html:315–319 appends a `[session] <sid>` line **each turn**, showing
the full raw id. The console instead shortens ids into the pill/meta
(`shortId`, app.js:71–73) and never prints them into the transcript.

**D7. No system-line styling: `[session]` / `[meta]` / `[error]` are all identical
bare divs — [VERIFIED]**
`appendLine()` (hub.html:261–265) creates unstyled divs for error (299), session
(319), and meta (325). The console has a dedicated red `.bubble.error`
(style.css:164–168); the hub's error lines look exactly like session lines.

**D8. No empty-state hint for lanes — [VERIFIED]**
Opened lane with no transcript shows a blank sliver and no guidance. Console has
an `#hint` ("Send a message to wake the ghost…", index.html:28) removed on first
send.

**D9. Stale specter chip wording — [VERIFIED]**
`renderSpecters()` prints `Chat — GHOST-HUB-003` with title "Chat lanes ship in
GHOST-HUB-003" (hub.html:368). GHOST-HUB-003 shipped chat lanes; the label is
stale. It also applies to **V-D**, who now HAS a seated agent file
(`.opencode/agents/v-d.md`, 3398 bytes, V-D-000 receipt) — its chat would route
via `seatedAgentMap()` (hub-server.js:441–458), yet the card blocks it with the
disabled chip. CG and ES-GURU have no agent files, so their chips are accurate in
effect.

**D10. Version string "v0.3 — Sandtrap-secured" — [SUSPECTED]** (hub.html:29;
footer, hub.css:691–697). Eight GHOST-HUB leaves have shipped since Sandtrap; the
manual string appears stale. Not grounded against a version rule — flagging for
Drew.

**D11. Hub poll-only refresh despite an SSE endpoint — [VERIFIED behavior, minor]**
`new EventSource("/events")` at hub.html:77–83 only `console.log`s; the UI
depends on the 30s `setInterval(loadState)` (hub.html:427). Not a visual defect;
noted for the parity spec (console has no refresh at all).

**D12. Mid-breakpoint gap — [VERIFIED]**
Hub responsive = a single `@media (max-width: 600px)` (hub.css:700–707); the
council-split stays 2-up from 601px up, where cards can get cramped. Console
breaks at 900px.

### 4.3 Additional WASH console findings

**D13. Dashboard is bare per the Pad-captured scope — [VERIFIED]**
`renderState()` (app.js:45–69): CAPTAIN'S LOG block shows only the last date
string (`data.logDate`); PAD excerpt is raw 600-char markdown in a `<pre>`;
leaves are raw `- [` bullets. This is the captured WASH UI refinement item —
confirmed as known, NOT to be implemented in this leaf.

**D14. Console brand mark is the Wake pencil, not the WASH clover — [VERIFIED]
(identity question, not a code bug)**
index.html:12–15 draws the pencil; the clover exists only in the hub
(hub.css:79–112, 212–214). WASH's own symbol is the clover (Pad spec + hub.css:2).
Asked in §7.

**D15. Console has no red-lining accent — [VERIFIED]**
style.css has no `red` token; `--pad-red-lining` lives only in hub.css:12. The
clover identity carries red by Drew spec — console surfaces drift from it.

**D16. Palette token drift between the two shells — [VERIFIED]**
Same "PAD family," two duplicated token sets with DIFFERENT values:

| Token | Hub (hub.css:5–21) | Console (style.css:2–19) |
|---|---|---|
| Gold | `--pad-gold: #d4a82a` | `--gold: #d4af37` |
| Purple (deep) | `--pad-purple-dark: #2d1a4d` | `--ink: #140a24`, `--ink-2: #1d1033` |
| Purple (core) | `--pad-purple: #4b2a7a` | `--purple: #7c5cbf`, `--purple-dim: #4a3a78` |
| Gold light | `--pad-gold-light: #e8c56d` | `--gold-soft: #ecd495` |
| Red lining | `--pad-red-lining: #c0392b` | *(none)* |
| Mono / Serif | `--mono`, `--serif` (same stacks) | `--mono`, `--serif` (+ `--sans`) |

Also note the WASH agent's own color token is `#D4AF37` (frontmatter per
GHOST-HUB-008 report §Unit 3) — the console agrees with the agent, the hub drifts.
Drew's call in §7.

---

## 5. IDENTITY ALIGNMENT (C)

| Surface cue | Hub | Console | Verdict |
|---|---|---|---|
| Era stamps | header + footer, mono gold | title sub `ESSENCE v4 · PAD · 0-WAKE THROUGH THE BROWSER` | Holds both |
| Purple/gold palette | `--pad-*` canonical, rich | `--*` variant set, close but drifted | **Thin — drifted** (D16) |
| WASH clover w/ red lining | header symbol + seat glyph | **absent** | **Broken on console** (D14/D15) |
| 7-glyph seat language | full `sym-*` set | only the pencil inline | Console has no seat-glyph system (fine for a single-seat console) |
| Seat glyphs | 7 of 7 + none | n/a | **V-D slot missing** (D4) |
| Chat bubble language | **none** | full (`you`/`ghost`/`error`/`meta`) | **Broken on hub** (D2/D7) |
| Status pill language | cards yes; lanes no (D5) | n/a | Thin (D5) |
| Working states | hubWorking breathing | washWorking breathing | Holds both |

**Overall:** both shells wear PAD colors and era language; the **hub** lacks the
console's bubble language, the **console** lacks the hub's clover + red-lining and
uses a drifted palette. Parity = adopt one language, one token set, both surfaces.

---

## 6. PROPOSED TARGET SPEC (D) — build contract for V-D-002

> Every item below is deliberately exact. If Drew approves §6 + answers §7, V-D-002
> implements without re-interpretation. Items marked *(question)* wait on §7.

### 6.1 Shared token target (`*_SPEC.md`-backed; edit into hub.css `:root`, mirror-aliased in console)

- Canonical namespace: the hub's `--pad-*` naming.
- **Gold: one value** for `--pad-gold` across both shells — `#d4af37` *(question
  E2)* (matches the WASH agent token + console today).
- Purple core stays hub `--pad-purple: #4b2a7a` / `--pad-purple-dark: #2d1a4d`;
  console `--ink` maps to `--pad-purple-dark`-family.
- `--pad-red-lining: #c0392b` gains a console mirror (`--red-lining`) for parity
  accents (topbar ring + footer divider + error handling still separate).
- Fonts: `--serif` (headings/names), `--mono` (labels/roles/meta/system),
  `--sans` (body/replies everywhere). Hub body already uses sans; chat replies
  should too *(question E1)*.

### 6.2 Hub chat lane — bubble language (the core fix)

Replace the bare `<pre>` transcript with a **bubble-capable region**:

- `.chat-output`: keep the element but stop treating it as a mono box.
  `min-height: 120px; max-height: 320px;` padding `0.75rem 0.9rem; border-radius:
  10px; background: var(--bg-elevated); border: 1px solid var(--border);`
  `overflow-y: auto;` `font-family: var(--sans);` (swap from the current
  `ui-monospace` inherited wall — hub.css:523).
- Transcript children get one class family:
  - `.msg` base — `display: block; max-width: 92%; margin: 0.45rem 0; padding:
    0.55rem 0.8rem; border-radius: 10px; white-space: pre-wrap; word-break:
    break-word; font-size: 0.85rem; line-height: 1.5;`
  - `.msg.you` — `margin-left: auto; background: rgba(212,168,42,0.14); border:
    1px solid rgba(212,168,42,0.45);` *(round vs square — question E1; default
    round 10px to match console's 12px family)*
  - `.msg.ghost` — `margin-right: auto; background: var(--bg-elevated); border:
    1px solid var(--border); color: var(--fg);` + 3px gold left accent.
  - `.msg.meta` and `.msg.session` — `font-family: var(--mono); font-size:
    0.68rem; letter-spacing: 0.06em; color: var(--fg-muted); background:
    transparent; border: none; padding: 0.15rem 0.3rem;`
  - `.msg.error` — console parity: `color: #f0b9b9; background: rgba(90,30,30,
    0.25); border-color: rgba(210,90,90,0.55);`
  - Optional meta row inside `.you`/`.ghost` (tiny mono uppercase label) —
    `(question E1)`; default ON, mirroring the console's `.meta`.
- Renderer contract (hub.html `wireChatLanes`): `you` → `<div class="msg you">`;
  `ghost-reply` → `<div class="msg ghost">`; `appendLine` gains kind mapping —
  `[error]` → `.msg.error`, `[session]` → `.msg.session`, `[meta]` → `.msg.meta`.
- **D6 fix (default):** stop appending full session ids every turn. Fold session
  into a lane-level status text or shorten with the console's `shortId`
  *(question E3)*.
- **Empty state (default):** on open, show a muted hint line "Send a message to
  start the lane." (console `#hint` pattern), removed on first send.

### 6.3 Card vs lane hierarchy + duplicate-name rule (D3)

- Keep the **card header** as the full identity surface: glyph + name + role +
  status pill (+ tagline + access).
- `.lane-head` becomes a **compact in-lane context strip** — glyph + name only,
  plus a live status dot; **drop the repeated role text and status pill**
  *(question E4 — default)*. This kills the "same name+role twice" read.
- Lane stays inside its card (no floating new surface) — preserves the
  hero/split/XP architecture.

### 6.4 Working states + thinking surface

- Keep `hubWorking` breathing on the open lane; add visible "Working…" state text
  on the send button (exists today) and disable input (exists).
- **Thinking stream (Pad item):** add a muted, collapsible strip above the ghost
  reply when `message.part.updated` events carry non-text `thinking` parts —
  collapsed by default, monospace, `fg-muted`, labeled "ghost is thinking…" with
  an expand caret. Renders ONLY when such events arrive *(question E5 for taste;
  the fixture (GHOST-HUB-008) showed only step_start/text/step_finish, so the hub
  must tolerate absence gracefully — strip hidden when nothing to show)*.

### 6.5 Responsive

- Add `@media (max-width: 900px)` to hub: `council-split → 1fr`, matching the
  console's 900px breakpoint (style.css:309–314). Keep the 600px block.

### 6.6 WASH console parity targets

- Apply the unified gold/red tokens; optional red-lining accents on the topbar
  ring + footer divider *(question E6)*.
- Brand mark: console keeps the pencil if Drew prefers the 0-Wake ghost identity,
  or adopts the clover *(question E7 — default: keep pencil, it is the ghost of
  Wake; add clover only if Drew says so)*.
- **Dashboard polish (Pad item):** CAPTAIN'S LOG block → last entry date + a
  short snippet (first ~120 chars of the entry) instead of a bare date; PAD
  excerpt keeps but styled as a callout block; leaves stay a list. State panel
  gains a 30s auto-refresh to match the hub.

### 6.7 V-D specter card

- Spec F glyph → `sym-v-d` in hub.css, GLYPH map grows to 8 entries (hub.html:47–50).
- Specter chip: keep the disabled chip for **non-seated** specters (CG, ES-GURU —
  no agent files) with honest wording ("chat when seated"); give **V-D** a real
  chat lane (agent file exists) *(question E8)*.

### 6.8 Version string

- Bump footer version to the next real leaf version on V-D-002 *(SUSPECTED stale —
  D10; no action unless Drew approves)*.

---

## 7. PREFERENCE QUESTIONS FOR DREW (E)

1. **Bubble shape:** round (radius 10–12, console-family) or square (radius 6,
   hub-input-family)? Default: round.
2. **Canonical gold:** `#d4af37` (console + WASH agent token) or `#d4a82a`
   (hub today)? Default: `#d4af37`, both shells.
3. **Session lines in the transcript:** keep visible full-ids, shorten with
   `shortId`, or hide from transcript (status-only)? Default: hide / status-only.
4. **Duplicate-name fix direction:** compact lane-head (glyph + name + dot only)
   or hide the card header while the lane is open (keep full lane-head)? Default:
   compact lane-head.
5. **Thinking-stream surface:** muted collapsible strip above the ghost reply
   (recommended), tiny pulsing "…" indicator only, or full text inline? Default:
   collapsible strip, collapsed, hidden when no thinking events arrive.
6. **Console red-lining:** add red-lining accents to the console for
   clover-identity parity, or leave the console accent-free? Default: minimal
   topbar ring + footer divider.
7. **Console brand mark:** keep the Wake pencil (ghost-of-Wake identity) or adopt
   the WASH clover? Default: keep pencil.
8. **V-D lane:** should V-D's specter card get a real chat lane in V-D-002 (it has
   a seated agent), with the chip reserved for unseated specters? Default: yes.
9. **Empty-state hint in hub lanes:** adopt the console-style hint line?
   Default: yes.
10. **Text markup in replies:** plain text (current, safest) or minimal
    formatting pass (bold/headers/code) on ghost replies? Default: plain text for
    V1.0; a formatting pass is a future leaf.
11. **Roster/toolkit polish:** leave as-is this pass (they read clean) or also
    retouch? Default: as-is — V-D-002 is chat-lane + parity + V-D glyph focused.

---

## 8. V-D'S OWN ICON PROPOSAL (F) — sym-v-d, 2 candidates

Style contract (from the existing 7-glyph set — hub.css:212–247 and the ED icon
family grid, `icons.json`): gold stroke, purple-family feel, `viewBox` 24,
`fill="none"`, `stroke-width="1.6"`, round caps/joins, data-URI-ready.

### Candidate A — "The Spec Sheet" (recommended)

The design surface (the card/panel V-D builds) with a hand-drawn design line —
the mark of the designer on the spec. Echoes the v4 PAD symbol (cosmic pencil
over a blank pad) without stealing Wake's pencil (sym-wake). Distinct at 26px.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23d4a82a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M6.5 15.2l3.6-4.1 2.9 2.9 4.5-5.2"/></svg>
```

**Rationale:** two strokes, reads at glyph size; the sheet = the surfaces V-D
builds; the line = the crafter's hand. Transfers cleanly to the ED icon family
(tone `plum`, gold-on-dark `#F2C75C`).

### Candidate B — "The Frame & Nib"

Designer's framing brackets (the studio frame) around a pen nib (the instrument).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23d4a82a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9V5.5A2 2 0 0 1 5.5 3.5H9"/><path d="M15 20.5h3.5a2 2 0 0 0 2-2V15"/><path d="M12 8.8l3.6 7.6-3.6 1.8L8.4 16.4z"/><path d="M12 13.6V10"/></svg>
```

**Rationale:** reads "design tool inside the studio frame"; has more personality
but is busier (4 path elements) at 26px — risk of mush at tiny sizes.

**Recommendation: Candidate A** for V-D's proof-of-seat glyph → becomes hub.css
`sym-v-d` (data-URI), GLYPH map grows to 8, and the same mark seeds the future ED
icon-family seat entry.

---

## 9. FUTURE MANDATE NOTE (G)

Captured for the future mandate (Drew, 2026-09-21): **audit all studio icons for
improvement** — the ED icon family (`ED/01_THE_DESIGNS/ICONS/`: `icons.json` 32
glyphs, `assignments.json`, applied 57 folder icons), the hub's `sym-*` seat
glyphs, WASH console marks, and any new V-D glyphs. **NOT touched in this leaf** —
no icon file, no `icons.json`, no `sym-*` CSS was edited. V-D-002 is scoped to
the spec above; the audit is a separate future leaf.

---

## 10. HONEST NOT-DONE + BOUNDARY + HALT

- **Not done:** no code/markup/style edits anywhere; no icon file touched; no
  commits (VCS HOLD); no surfaces launched or stopped; no Pad/Log/Bible/
  MILESTONES edits.
- **Evidence discipline:** every defect is [VERIFIED] via reads + greps quoted
  above except D10 ([SUSPECTED] version string) and D16 token-drift (values read
  directly, drift is factual — the *impact* is judgment).
- **Known pre-existing:** GHOST-HUB-001 tests 4+5 are red (SSE ECONNRESET +
  missing `spawned` field) — recorded in V-D-000 receipt, NOT this leaf's scope.
- **BROWN BANANA BREAD:** nothing dangerous encountered; no stop needed.

**Gate for V-D-002:** Drew approves §6 (+answers §7), then V-D builds the first
visual pass — chat-lane bubble language, lane-head dedupe, empty/min-heights,
glyph slot + `sym-v-d`, token unification, hub/console parity items, V-D lane —
as its own approved leaf package.

---

**REPORTED 2026-09-21 by V-D (VISUAL DESIGNER). HALTED per package — awaiting
Drew's spec approval + §7 answers before V-D-002. VCS HOLD.**