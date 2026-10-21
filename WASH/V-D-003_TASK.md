# V-D-003 — VISUAL LEAF: SHADOW COUNCIL BOTTOM SECTION + GRAVEYARD PANEL + CALENDAR (TASK PACKAGE)

**Leaf:** V-D-003 · **Executor:** V-D (VISUAL DESIGNER seat, visual lane) ·
**Planted by:** PLANNER (0-Wake) · **Date:** 2026-09-22
**Rulings for #1-#4:** Drew approved ✓ 2026-09-22 (1 route V-D-002 ✓, 2 shadow mech
+ test deltas ✓, 3 graveyard = live-read LEGACY/Graveyard ✓ (a), 4 calendar Goals +
Accomplishments now, Time-spent honest-ambiguous ✓)
**GATE:** This leaf is **GATED on GHOST-HUB-009** landing first (Stone's mechanical
package: `/state.shadow` populated, `/graveyard` live-read endpoint, `/state` calendar
data). **Do NOT start V-D-003 until GHOST-HUB-009 is green and Drew routes you here.**
V-D-002 (visual base pass) may run in parallel — V-D-003 builds ON TOP of V-D-002.

---

## 1. SCOPE LOCK (only these named targets — zero discretionary additions)

Visual-only edits in: `WASH/hub.html`, `WASH/hub.css`. **NOT allowed:** edit
`hub-server.js`, `hub-agents.json`, any test file, any report from another seat.
No shadow-agent creation. No icon-family changes beyond the existing sym set.

## 2. MANDATE — three visual surfaces the hub must present

**A. SHADOW COUNCIL — hidden bottom section of the agent roster.**

Render a **bottom, hidden-by-default, expandable** SHADOW COUNCIL section in the
agent roster area (the "roster above, shadow below" architecture). Collapsed by
default (a faded header row + a disclosure caret or "expand to reveal" hint).
When expanded, it lists the shadow seats that `/state.shadow` now carries —
`SHADOW AUDITOR` + `TIMELORD` — as **dormant** cards: muted, engraved/anomalous
styling (Drew: "shadow for future things that are built but not seated" — these are
standing, dormant). They must read visually DIFFERENT from council/specter cards:
dimmer, greyscale/tombstone-toned, smaller, with a `dormant` tag. They are NOT
active council — status `dormant`, no chat lane, no bolt action.

**B. GRAVEYARD — bottom panel mirroring the local LEGACY/Graveyard.**

Render a GRAVEYARD panel (a sibling bottom section, or a tab on the calendar
surface — Drew ruling choice) fed by the `/graveyard` live-read endpoint that
GHOST-HUB-009 adds. Panel shows tombstone cards: title + date + a one-line summary
per tombstone (e.g. `00_2026-09-17_LOCKDOWN_PURGES` — lockdown purges record).
**Real, honest:** if `/graveyard` returns `{ tombstones: [] }` or a "no graveyard
mirror present" note, the panel renders that honest empty/note — it does NOT invent
tombstones. Style: tombstones get gravestone visuals (dusk/charcoal tones, chiseled
serif headers, muted borders) — visually consistent with the shadow section's
dormant language.

**C. CALENDAR — goals, time spent, and accomplishments surface.**

Render a calendar surface next to the goals/accomplishments view with:
- **GOALS** — from `/state.calendar.goals` (major milestones: M0-M9 registry, their
  objectives, deadlines, seal status per MILESTONES.md).
- **ACCOMPLISHMENTS** — from `/state.calendar.accomplishments` (ledger seals +
  Captain's Log receipts, date-stamped).
- **TIME SPENT** — `/state.calendar.timeSpent` is **honest-ambiguous (empty array
  until TIMEKEEPER-001 executes)**. Render the time column honestly: show it as
  `timeSpent: []` / "no time-tracking data yet (TIMEKEEPER-001 not executed)" — NOT
  a fabricated number. If the field exists with data, render it; if absent, render
  the honest empty/NA. **Do not invent time-spent values.**

## 3. SPEC CONTRACT (visual language — inherits V-D-002 design tokens)

- Use the established CSS variables (`--pad-*`, `--council-*`, hub.css token family
  from GHOST-HUB-004/006 presentation pass) — no new color system.
- Shadow cards: `opacity ~0.55`, desaturated, dashed borders, `dormant` pill.
- Tombstones: near-charcoal fill, serif name headers, thin gold-pencil divider.
- Section visibility transition ~200ms ease; collapsed arrows rotate.
- Mobile-first: sections stack on the 600px breakpoint; no horizontal overflow.
- Keep the existing head/cards/lane height contract: the roster stays flush, shadow
  + graveyard + calendar are BELOW the roster lane, not above it.

## 4. DEFINITION OF DONE

- [ ] SHADOW COUNCIL bottom section renders, collapsed, reading live from
      `/state.shadow` (NO hardcoded seat list in hub.html).
- [ ] Shadow cards visually distinct (dormant/darker) from council + specter rows;
      status `dormant` present; no chat lane on dormant seats.
- [ ] GRAVEYARD panel renders tombstone cards from `/graveyard` (or honest empty/
      note); live-read only, zero invented tombstones.
- [ ] CALENDAR renders GOALS (M0-M9 registry) + ACCOMPLISHMENTS (dated seals) +
      honest TIME SPENT column (`[]`/NA until TIMEKEEPER-001).
- [ ] Zero edits to hub-server.js / hub-agents.json / tests / other-seat reports.
- [ ] **VCS HOLD** — no commits. Report (V-D-003_REPORT.md) next to this task.

## 5. HALT

When V-D-003 is green per §4, plant `V-D-003_REPORT.md` beside this task and HALT
for Drew to route COURRIER (seal ferry) — do NOT self-forward. Report exactly what
was built and not-built; masquerade is forbidden.
