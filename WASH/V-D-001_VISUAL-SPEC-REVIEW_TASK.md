# V-D-001 — VISUAL SPEC REVIEW, FULL ASSESSMENT (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** V-D (first session —
own opencode window, agent `v-d`) · **Approved by:** Drew Slaydon (2026-09-21)

> This is V-D's FIRST leaf and your proof-of-seat. Scope-locked, **READ-ONLY
> assessment** — documentation + proposal + questions, NO code/style/markup
> changes. Build happens in V-D-002 after Drew approves this spec.
> **VCS HOLD — no commits.**

---

## 1. Intent (Drew's words, captured)

"We should have a formal review of what the visual specs for each shell are,
so we can actually align them with what i want. Major issue is the actual
chat response boxes being micro before a message is sent, then being a long
response poorly formatted within a terminal. there's also duplicate names for
agents on the main page." + "i would want the console in first review too.
i want a full assessment so we can act properly."

## 2. Scope (review targets — READ ONLY, no edits)

**Ghost Hub** (WASH/hub.html, WASH/hub.css):
header + hub symbol (clover) + era stamps · tabs (council / specters /
roster / toolkit) · council cards (hero + split + XP shell + xp-toggle) ·
specter cards · roster cards + badges · toolkit table · chat lanes
(lane-head, chat-input-row, chat-output, `you` / `ghost-reply` /
`[session]` / `[meta]`, working states) · footer · responsive behavior.

**WASH console** (WASH/index.html, WASH/app.js, WASH/style.css):
the standalone 4748 console shell — message flow, bubble rendering,
dashboard state, session handling visuals.

**Context reads** (not review targets): WASH/server.js + WASH/hub-server.js
(state semantics only, no chat/route code), and the Pad's captured WASH UI
refinement scope (thinking-stream render + state dashboard polish — fold in
as known items to address, do NOT implement).

## 3. Known defects (Drew-reported, PLANNER-grounded — include and verify)

1. **Micro chat boxes before a message is sent:** `hub.css` `.chat-output`
   declares `max-height: 240px` but NO `min-height` — an empty `<pre>`
   collapses to a ~16px sliver.
2. **Replies read like a terminal wall:** `.chat-output` is styled mono /
   `pre-wrap` / `fg-muted`, and the GHOST-HUB-008 renderer's `you` and
   `ghost-reply` elements have NO CSS classes in hub.css — unstyled blocks
   dumped into the mono box, no bubble language, no you-vs-ghost
   distinction.
3. **Duplicate agent names on the main page:** council cards render
   displayName+role in the card header AND again in the lane-head
   (`lane-name` + `lane-role`) when a lane is open.

PLANNER also flagged (verify): V-D's own glyph slot is missing — hub.html
`GLYPH` map has 7 entries; `v-d` currently falls to `sym-none`.

## 4. Deliverable — CREATE `WASH/V-D-001_VISUAL-SPEC-REVIEW_REPORT.md`

For EVERY shell/surface in scope, document:

**A. Current spec (grounded):** what renders today — the markup/CSS/JS
drivers and the tokens in use, with file+line references.

**B. Defects:** the 3 known above + anything YOU find (each with
file+line references, honestly labeled [VERIFIED] vs [SUSPECTED]).

**C. Identity alignment:** purple & gold / WASH clover / era-stamp language
per surface — where it holds, where it is thin or broken (including console
parity: does the 4748 console match the hub's PAD identity, or drift?).

**D. Proposed target spec:** a concrete design language per surface —
bubble language (you vs ghost), typography hierarchy (serif vs mono usage),
spacing, min-heights + empty states, card vs lane hierarchy, working states,
responsive behavior, console↔hub parity. Make it exact enough that V-D-002
can implement it without re-interpretation.

**E. Open preference questions for Drew** — his taste calls, consolidated in
one section (do NOT assume the answer): e.g. round vs square bubbles, mono
vs serif in replies, density, whether [session]/[meta] lines stay visible,
what the thinking-stream surface should look like.

Plus two seat-specific deliverables:

**F. V-D's own icon proposal** — 1-2 candidate SVG glyphs in the existing
7-glyph style (gold stroke, purple-family feel, `viewBox` 24 or 32,
consistent stroke width ~1.6) ready to become hub.css `sym-v-d` + a future
ED icon family seat. This is how V-D proves itself through its own icon
(Drew, 2026-09-21).

**G. Future mandate note** — the studio-wide icon audit (the ED icon family,
seat glyphs, symbols) captured as a future scope item. DO NOT touch or edit
any icon file in this leaf.

## 5. Units

1. **Unit 1 — Inventory:** read every surface in scope; build the surface
   inventory (every visual element + file + line).
2. **Unit 2 — Assessment:** complete §4 A–E per shell/surface; verify the
   3 known defects and the sym-none flag; find what else is off.
3. **Unit 3 — Icon proposal:** develop §4 F (show your work — the SVG
   source + a short rationale per candidate).
4. **Unit 4 — Questions:** consolidate §4 E into a numbered question list
   for Drew.
5. **Unit 5 — Report + HALT:** plant
   `WASH/V-D-001_VISUAL-SPEC-REVIEW_REPORT.md`; HALT. NO code changes
   anywhere.

## 6. Definition of Done

1. Report planted — every surface documented (A–E).
2. The 3 known defects grounded (or refuted with evidence) + any new
   defects found; sym-none flag addressed in the spec.
3. V-D's own icon proposal present (F).
4. Preference questions consolidated for Drew (E).
5. NO code/HTML/CSS/JS changes anywhere; boundary held; VCS HOLD.
6. Drew's approval (or amendments) to the spec = the gate for V-D-002.

## 7. Guardrails

- **READ-ONLY leaf.** You may read `WASH/` and context files. You may NOT
  edit: hub files, console files, `hub-server.js`, `server.js`, `ED/` docs,
  game code, icon files, `opencode.json`. The ONLY file you create is the
  report.
- Zero discretion: any surprise → STOP and report (BROWN BANANA BREAD for
  danger); no adjacent fixes.
- Embargoes hold: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`.
- Masquerade forbidden: label every finding [VERIFIED] or [SUSPECTED] and
  say exactly what was documented vs assumed.
- **VCS HOLD:** no commits or amends in this leaf.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved
(2026-09-21 — "full assessment so we can act properly").**
Drew: after V-D-000 lands, point a new opencode window (agent `v-d`) at this
file. Executor (V-D): restate scope, run, HALT at every unit gate.