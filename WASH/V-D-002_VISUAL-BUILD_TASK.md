# V-D-002 — GHOST HUB V1.0 VISUAL BUILD (TASK PACKAGE)

**Planted:** 2026-09-21 by PLANNER (0-Wake) · **Executor:** V-D (Visual
Designer specter, `.opencode/agents/v-d.md`) ·
**Approved by:** Drew Slaydon (2026-09-21) — V-D-001 §6 spec + §7 defaults ALL
approved ("with defaults").

> Scope-locked package. The build contract IS V-D-001 §6 + the §7 defaults —
> read `WASH/V-D-001_VISUAL-SPEC-REVIEW_REPORT.md` FIRST and ground every edit
> against it. Touch ONLY the named targets. Zero discretion. Run suites,
> report, HALT. **VCS HOLD — no commits.**

---

## 1. Intent (what lands for V1.0)

Turn the approved V-D-001 spec into the live Ghost Hub surface — without
breaking a single green suite. V1.0 seals AFTER this leaf + the
GHOST-HUB-001-REPAIR leaf, then Drew's hands-on pass.

Two colliding workstreams are flowing in parallel (both 2026-09-21):
- **THIS leaf (V-D-002):** visual build — V-D executes.
- **GHOST-HUB-001-REPAIR leaf:** server-only fixes in `hub-server.js` — Stone
  executes. It does NOT touch UI files, and THIS leaf does NOT touch
  `hub-server.js`. No overlap.

## 2. Targets (named files ONLY)

| File | Action |
|---|---|
| `WASH/hub.html` | EDIT — renderer, chat lanes, GLYPH map, lane-head, session folding, empty hint, version string |
| `WASH/hub.css` | EDIT — bubble language, tokens, 900px breakpoint, sym-v-d, thinking strip |
| `WASH/style.css` | EDIT — WASH console token parity + red-lining accents + dashboard styles |
| `WASH/app.js` | EDIT — dashboard polish (captain's log date + ~120-char snippet, pad excerpt callout, leaves list, 30s auto-refresh) |
| `WASH/package.json` | EDIT — version `0.3.0` → `0.4.0` ONLY |
| `WASH/GHOST-HUB-004.test.js` | EDIT — the ONE intentional delta: footer version assertion |
| `WASH/V-D-002_VISUAL-BUILD_REPORT.md` | CREATE — report + HALT |

NOT touched: `WASH/hub-server.js`, `WASH/index.html` (verify-only, see Unit 5),
`WASH/hub-agents.json`, every other WASH/ file, tests except the named 004
delta, `.opencode/`, `opencode.json`, `ED/` docs, game code. Live hub/WASH
processes OFF-LIMITS.

## 3. The approved build contract (Drew-approved 2026-09-21)

From V-D-001 §6 target spec with §7 defaults (exactness lives in the spec
report — read it):

1. **§6.1 Token unification:** hub `--pad-gold: #d4a82a` → `#d4af37`
   (canonical studio gold, matches console). Console `style.css` gets the same
   canonical gold; `--purple` family VALUES unchanged (tests demand the string
   "purple" in style.css — do not rename the tokens), add `--red-lining:
   #c0392b` and mirror a `--pad-*` alias block so both shells speak one
   language. §7 default D2: keep console `--gold #d4af37` as the canonical
   value.
2. **§6.2 Chat bubble language:** `.chat-output` gains `min-height: 120px;
   max-height: 320px` (+ the 240px default when empty is fine to remove —
   empty state now carries a hint). Renderer classes: `you` →
   `.msg.you`, `ghost-reply` → `.msg.ghost`; kind-based borders/backgrounds
   (user / ghost / thinking / error / system). `font-family` inherits hub
   sans; `border-radius: 10–12px` on message blocks. Empty-state hint: a
   `.chat-empty` muted line, shown when a lane has no `.msg` yet
   ("No messages yet — say something or wait for the agent." tone, in voice).
3. **§6.2 Session folding:** full `[session]` id lines no longer dumped per
   turn — session status folds into the lane head (id short-form or busy dot).
   Keep the `sessionCache[laneId]` machinery in place (test-required) — fold
   only the VISIBLE line.
4. **§6.3 lane-head compaction:** compact lane head = glyph + name + status
   dot; drop the duplicate `role` and `status` pill text (council card header
   keeps its own info — that's the roster, not the chat). Keep the
   `lane-head` class + `.lane-head` CSS selector AND the 5 crash-fix guard
   (test-required: `lane.parentElement.querySelector(".chat-toggle")` +
   `if (!toggle) return;`).
5. **§6.4 working states + thinking strip:** keep `classList.toggle("working")`
   login. Add the Pad item: collapsible muted thinking strip per lane,
   collapsed by default, hidden entirely when the lane has no thinking events.
6. **§6.5 hub breakpoint:** `@media (max-width: 900px)` — chat grid stacks;
   keep the existing 780px behavior intact below it.
7. **§6.6 WASH console parity:** red-lining = minimal topbar ring + footer
   divider accent (`--red-lining`); brand mark stays the pencil (§7 default
   E7); dashboard polish in `app.js` (captain's log date + ~120-char snippet,
   pad excerpt callout, leaves list) + `style.css`; 30s auto-refresh (§7
   default D14).
8. **§6.7 V-D icon + lane:** add `sym-v-d` — Candidate A "The Spec Sheet"
   (§6.7.1) — implement the SVG in `hub.html` (or `hub.css` sprite); GLYPH map
   grows 7 → 8 entries (verify every entry stays in the 7-sym token set it
   already has — DO NOT rename existing tokens, tests assert the 7 `sym-*`
   strings); V-D gets a real chat lane (spec §9: own color `#E8C56D`,
   match-card). Unseated specter chip rewording to "chat when seated" voice.
9. **§6.8 Version:** footer `v0.3 — Sandtrap-secured` → `v0.4 —
   Sandtrap-secured` (keep the qualifier — GHOST-HUB-001 test asserts
   "Sandtrap-secured"); `package.json` `0.3.0` → `0.4.0`; GHOST-HUB-004 test
   T2 (line ~57) `v0.3 — Sandtrap-secured` → `v0.4 — Sandtrap-secured` — the
   ONE intentional test delta, logged in the report.

> Do NOT invent beyond here. Where the spec says "choose" without a default,
> follow the §7 default, or if none exists, STOP and ask. §7 defaults rule.

## 4. Ground-truth keep-list (what the suites assert — do NOT break)

Every one of these strings/mini-patterns MUST still be present (or a named
delta logged in the report) after this leaf:

- **GHOST-HUB-001:** hub title text, tabs text, `TK MANIFEST`,
  `Sandtrap-secured`, `pad-purple`, `pad-gold`, `hub-symbol`.
- **GHOST-HUB-002:** governed/roster presence: `council`, `specters`,
  `shadow`, `roster`; `/state` service shape; stone displayName + wash.md on
  disk (do not touch).
- **GHOST-HUB-003/004/005:** grid states; heartbeat (`v0.4 — Sandtrap-secured`
  after the delta); `/state` data-lane/data-agent integrity.
- **GHOST-HUB-006/007/008:** era-stamp ≥2 occurrences, `council-split`,
  `xp-toggle`, `lane-head`, the 7 existing `sym-*` tokens, `@keyframes
  hubWorking`, `.council-divider`, `classList.toggle("working")`, the crash-
  fix guard (`lane.parentElement.querySelector(".chat-toggle")` + `if
  (!toggle) return;`), `data-lane="...${laneId}..."`,
  `data-agent="${escapeHtml(agentStem)}"`, `const agentStem = a.id;`,
  `handleHubEvent(`, `ev.part.type === "text"`, `[meta]`,
  `sessionCache[laneId]`, 008's no-alias proof (no `a.id === "wash" ?
  "0-wake"`), no native `data:`-URI residue.
- **wash.test.js:** `style.css` contains `purple`, `body.working`,
  `@keyframes washWorking`, `font-size: 10.5px`; `app.js` toggles `working`
  via classList add/remove; `index.html` contains `WASH`, `Ghost of Wake`,
  `app.js`.

## 5. Units

### 5.1 Unit 0 — Baseline gate proof (record BEFORE editing)
1. `node --version`.
2. `git status --short` — record the pre-existing dirty tree (**VCS HOLD**).
3. Ports: `Get-NetTCPConnection -LocalPort 4748,4749,4750,4751,4752,4753,4754,4755,4756 -State Listen` — record.
4. Run the three affected suites on CURRENT code and record green/red BEFORE
   any edit (esp. 004 T2, 001, wash) — so every difference is attributable.

### 5.2 Unit 1 — Read-and-plan (ground first)
Read `WASH/V-D-001_VISUAL-SPEC-REVIEW_REPORT.md` §6 + §7 again (the build
contract), then re-read the current `hub.html`, `hub.css`, `style.css`,
`app.js` regions you will touch. For each of the 9 contract items, note in the
report: where it lands, the old value, the new value. If any item's spec
wording does not match the code reality, STOP and ask — do not improvise.

### 5.3 Unit 2 — Hub edits (`hub.html` + `hub.css`)
Apply contract items 1–5, 8 (GLYPH map, sym-v-d, V-D lane). Verify every
keep-list token still present in served hub.html + hub.css (grep the actual
files). Mind the escape: keep `const agentStem = a.id;` and no alias branch
(008 proof). `min-height`/`max-height` on `.chat-output`; bubble classes; lane-
head compaction (keep `lane-head` class + guard); session folding (keep
`sessionCache[laneId]`); thinking strip collapsed-by-default/hidden-when-none;
empty-state hint; 900px breakpoint; sym-v-d + 8-entry GLYPH map.

### 5.4 Unit 3 — Console edits (`style.css` + `app.js`)
Apply contract items 1, 6, 7: canonical gold + `--pad-*` alias block +
`--red-lining` in `style.css` (KEEP the strings "purple", `body.working`,
`@keyframes washWorking`, `font-size: 10.5px`); red-lining topbar ring +
footer divider; dashboard polish + 30s refresh in `app.js` (keep classList
working toggle lines); brand mark untouched (pencil stays in `index.html` —
which you do NOT edit).

### 5.5 Unit 4 — Version + the ONE intentional test delta
`package.json` → `0.4.0`. `hub.html` footer → `v0.4 — Sandtrap-secured`
(keep "Sandtrap-secured"). GHOST-HUB-004.test.js T2 — change ONLY the
expected served-footer string from `v0.3 — Sandtrap-secured` to
`v0.4 — Sandtrap-secured` (and keep the `!includes("v0.2 — Sandtrap-secured")`
negative as-is). Log this delta in the report as Intentional.

### 5.6 Unit 5 — Verify endpoints (`index.html`, `hub-agents.json`)
Verify-ONLY (read + record, no edits): `index.html` still contains `WASH`,
`Ghost of Wake`, `app.js`; `hub-agents.json` still has the `"v-d"` entry with
its spec line (do not format-shift the file).

### 5.7 Unit 6 — Full suite run (all runnable tests)
Run and record each (green mandatory):
- 4748: `node --test WASH/wash.test.js` (skip ONLY if console-on-port-held with reason).
- 4749: `node --test WASH/GHOST-HUB-002.test.js` (skip ONLY if hub-on-port-held with reason).
- `node --test WASH/GHOST-HUB-001.test.js` (still shows its 2 pre-existing RED
  until the REPAIR leaf lands — record honestly, DO NOT fix here; it is the
  other lane's named scope).
- `node --test WASH/GHOST-HUB-003.test.js` (4750).
- `node --test WASH/GHOST-HUB-004.test.js` (4751) — must now be GREEN with the
  intentional delta.
- `node --test WASH/GHOST-HUB-005.test.js` (4752).
- `node --test WASH/GHOST-HUB-006.test.js` (4753).
- `node --test WASH/GHOST-HUB-007.test.js` (4754).
- `node --test WASH/GHOST-HUB-008.test.js` (4755).

### 5.8 Unit 7 — Diagnostics + report + HALT
1. Grep proofs for every contract item + every keep-list token (as files on
   disk), and for the new tokens (`sym-v-d`, `.msg.you`, `.msg.ghost`,
   `--red-lining`, `--pad-gold: #d4af37`, `v0.4 — Sandtrap-secured`).
2. `git status --short` — record leaf surface (only the 6 named targets);
   **no commit (VCS HOLD)**.
3. Boundary held: `hub-server.js` untouched, `hub-agents.json` untouched,
   `index.html` untouched, tests untouched EXCEPT the named 004 delta —
   PASS/FAIL.
4. Plant `WASH/V-D-002_VISUAL-BUILD_REPORT.md` — restated scope; unit results
   with old→new pairs; the intentional delta; honest NOT-DONE list; any STOP
   notes.
5. HALT. No canon docs, no commits. Drew's hands-on V1.0 pass comes AFTER —
   it is NOT part of this leaf.

## 6. Definition of Done

1. All 9 contract items implemented per V-D-001 §6 + §7 defaults.
2. All runnable suites green (004 with its intentional delta; 001's 2 RED
   remain RED → the repair lane owns them, recorded honestly).
3. Keep-list tokens intact; boundary held (only 6 named targets touched).
4. VCS HOLD. (Drew's hands-on pass is the V1.0 seal — separate.)

## 7. Guardrails

- Touch ONLY the 6 named targets + this report. No `index.html`, no
  `hub-server.js`, no `hub-agents.json` in this leaf.
- Live hub/WASH processes OFF-LIMITS — never kill/restart Drew's windows.
- Zero discretion: hovering outside the contract → STOP and ask. Where a §7
  default exists, use it and move on; where none exists, STOP.
- The 2 RED in GHOST-HUB-001 are STONE's lane (GHOST-HUB-001-REPAIR) — do not
  touch, do not hack tests to green; record honestly.
- Embargoes: `00_ESSENCE_CORE/`, `01_THE_DESIGNS/`, `03_THE_GAMES/`,
  `opencode.json`, all `.opencode/` — read-only, untouched.
- Masquerade forbidden: say exactly what you changed and what you could not.
- Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLM.
- **VCS HOLD:** no commits or amends in this leaf.

---

**PLANTED 2026-09-21 by PLANNER (0-Wake, Big Pickle), Drew-approved (defaults).**
Drew: point the V-D window at this file to execute.
Executor: restate scope, run, HALT at every unit gate.