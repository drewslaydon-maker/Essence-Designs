# ESSENCE DESIGNS GHOST HUB — MANDATE

> **Origin:** Drew Slaydon (Studio Director), 2026-09-20 · **Status:** MANDATE
> — the leaf AFTER SANDTRAP-001 (studio infra first: the hub spawns multiple
> agents and must run on an unlocked Sandtrap).
> **How to use this file:** Wake reads this at the leaf gate, restates the
> scope, specs the exact Stone-executable task package (targets, edits,
> commands, diagnostics, DoD), and routes it. This is the mandate — not the
> build package.

---

## 1. Intent (Drew's words, captured)

WASH has proven itself as the outside seer (read-only install walks,
artifact filing, live ghost). The natural next step: **the app becomes the
hub.** One page — **ESSENCE DESIGNS GHOST HUB** — with individual tabs for
the agents. CG comes next **in the same app as a tab**, not a separate
platform. And because "we're clearly going to be expanding this roster," the
hub carries the roster + leveling meta now.

## 2. The Hub Anatomy

- **Title:** `ESSENCE DESIGNS GHOST HUB` (the page top).
- **Section 1 — HEAD COUNCIL GHOSTS:** the main + default tab. Wake, WASH.
  (The council that runs the studio.)
- **Section 2 — SPECIFIED SPECTERS:** gamer/domain agents.
  - CG (Cephalon Ghost — Warframe helper; seated specter, READ-ONLY by
    default on game data/files).
  - ES-GURU (MW or OBL chat — connected to
    `.opencode/skills/elder-scrolls-guru`; the chat Drew talks to *while
    playing*, isolated from Wake/WASH, on its own terms).
  - Future specters possible (half-formed idea: a **life-track specter**
    for managing life outside the studio).
- **Section 3 — AGENT ROSTER:** every agent listed; **level-ups** with
  notifications on **major and minor milestones** (the studio meta: agents
  themselves have XP). Roster is the "who's on the board, who levelled"
  surface.
- **Link: TK MANIFEST** — the toolkit manifest (specific tools, reasons for
  each, who has access) surfaced on the hub for Drew's review. "The Machine
  makes itself READABLE to humans" phase.

## 3. The Spine It Hangs On (build truth)

- **Native = studio standard** (Drew, 2026-09-20): local/native, no Chrome
  — the Wheel precedent (WHEEL-NATIVE-001, Electron window over a local
  server). The hub ships native like the Wheel.
- **Sandtrap law applies** (SANDTRAP-001, `ED/00_ESSENCE_CORE/INFRA/`): the
  hub spawns agents → every spawn uses `spawn-safe.js` /
  `stdio: ["ignore","pipe","pipe"]` + `windowsHide` + kill-points.
- **Zero-dep pattern** held (WASH precedent): no package.json, no
  node_modules, no network, no install step; Node built-ins + Web API only.
- **Memory banks = framework** (home in ED main — unvaulted): Oblivion MB
  first (carries the Lau Kai magicka-240 correction; WASH acknowledges and
  self-fixes at reboot), then CG MB (Warframe facts).
- **WASH symbol (Drew spec):** purple smooth-edged box, golden 4-leaf clover
  with red lining — red lining on the box edges and on the clover.
  Reference for the hub identity.
- **Ordering:** SANDTRAP-001 → GHOST HUB (this mandate) → WASH-NATIVE →
  ES-GURU break-out → MB framework (Oblivion) → CG-001 as a hub tab.
  (Drew routes; Wake plants.)

## 4. Rulings Locked In (2026-09-20)

1. **Focus now = WASH.** The hub is WASH's expansion; outside-seer work
   continues.
2. **Sandtrap first** — studio-infra scope only; opencode config/agent-spawn
   layer is a follow-up leaf.
3. **CG = seated specter agent, own window, own chat** — READ-ONLY by
   default on all game data/files. Ships as a hub tab.
4. **ES-GURU = its own chat** (MW or OBL) — game-play lane, isolated.
5. **TK manifest lives on the hub** — tools, reasons, access.
6. **240 fix:** queued behind the Oblivion memory bank; WASH self-fixes at
   reboot — no manual patch.
7. **VCS HOLD** until Drew lifts it.

## 5. Guardrails (inherited)

- **Embargoed by default:** game repos (`PARKED/BROKEN/ON_DECK`),
  `00_ESSENCE_CORE/`, `01_THE_DESIGNS/` — read-only unless a task package
  names them.
- **No game code changes in audit/hub work.**
- **Burn < $1.00/hr; 8 GB VRAM ceiling; stock opencode free-tier LLMs.**
- **Masquerade forbidden** — report exact done/not-done.
- **Plant, don't paste** — every leaf as a `*_TASK.md` in its target folder;
  tools route by pointing at the file.

## 6. Open Items for the Wake Session (spec time)

1. Hub architecture detail: single-page tabs vs multi-page; which tab
   marker style (Section 1 vs Section 2); how the roster levels are
   recorded (major/minor milestone definitions).
2. TK manifest source of truth location (proposed: ED main, `INFRA/`-adjacent
   or THE DESIGNS per MB framework).
3. WASH-NATIVE sequence: hub-in-browser first, then native wrap (Wheel
   precedent), or native from the start? (Drew lean: native is the standard,
   but sequencing is his call.)
4. Which seat builds the hub — Stone (build lane) vs WASH ghost self-build.
   (Seat doctrine points at Stone; WASH's self-fix pattern is narrow — the
   hub is a full build.)

---

**MANDATE PLANTED 2026-09-20 by PLANNER (0-Wake).** Next action: Drew resets
this window → sends Stone on SANDTRAP-001 → on return, points the Wake
window at this mandate → Wake specs + plants the GHOST HUB leaf.