# ESSENCE DESIGNS  Studio Milestones, Objectives & Decision Log

*Last updated: 2026-09-19 (ESSENCE v4 — PAD · ED FLOW 2.0, Founding Arc 17→19). Ground-truth record for studio milestones and operational objectives.*

---

## ?? PART 1: CURRENT ACTIVE SPRINT OBJECTIVE

### Active Era: ED FLOW 2.0 — The Lotus Adversity Focus (2026-09-17)
- **Primary Objective:** **Lotus Adversity (The Wheel + its codex)** is the
  active development and testing lab of the project — for **Game Dev,
  System Dev, AI research, and personal lore writing**. It is the focus
  objective refined and produced by OpenCode + Big Pickle.
- **Supporting:** **ES GURU** play sessions feed the LAG worldbuilding
  research (LAG = a **WoW/OSRS/Morrowind "New Classic"**).
- **Historical note:** The previous sprint (ESSENCE 2.0 → Prosis Playtest)
  was the Goal 1.0-era objective; Superseded 2026-09-17 — Prosis is parked
  in `BROKEN/` with Heaven's Nen. See PART 4 decision log.

### Founding Arc: 2026-09-17 → 09-19 (Goal 1.0 — the system made a game)
The first three days of ED FLOW 2.0 unified the previous ED systems into one
OpenCode-native studio and produced the three founding artifacts:
1. **The Pipeline (Goal 1.0 ED FLOW)** — boot contract, operating core, leaf
   lifecycle, ledger + seat roster (0-Wake / 1-Stone / B-Bolt / X-XP).
2. **The Guru (ES GURU Helper)** — play-session skill + self-improving
   knowledge base, accuracy-tagged and gated to Drew's approval.
3. **The Native Wheel (WHEEL-NATIVE-001)** — Lotus Adversity's static build
   wrapped in a native Electron window: golden Wheel icon, no Chrome tab,
   all 6/6 canon gates green. Drew's Architect walk passed with no notes —
   *"the best version it has ever been"*; the true Wheel's spoke-link lines
   render only in the native window. **Certified 100% the base of all LAG
   dev.** Proof the system can make the game.

---

## ?? PART 2: STUDIO MILESTONE REGISTRY

| ID | Milestone | Target System | Status | Key Deliverable / Exit Condition |
|---|---|---|---|---|
| **M0** | **Ground-Truth INFRA Setup** | Workspace / Docs | ?? **Complete** | Model config verified, MILESTONES.md & INFRA 1.0 established. |
| **M0.5** | **ESSENCE 2.0 Audit (Leaf 4)** | Workspace / Core | ?? **Complete** | Embargoes enforced, PARKED/BROKEN/ON_DECK folders created, WDT broken state acknowledged, Captain's Log initialized. |
| **M1** | **Prosis Engine & Playtest** | 03_THE_GAMES/BROKEN/02_PROSIS/ | ?? **Parked (BROKEN)** | Demoted from focus 2026-09-17 (stale-test fix parked; parked with Nen Arena). Demo with cool gameplay. |
| **M2** | **Cook Game (Kitchen Symphony)** | 03_THE_GAMES/ON_DECK/04_COOK_GAME/ | ? **On Deck 1** | Real-Time Rhythm & Kitchen Chaos web arcade game (Phase 1 Web Trinity). |
| **M3** | **Journeys Unto Refactor** | 03_THE_GAMES/ON_DECK/01_JOURNEYS/ | ? **On Deck 2** | Parked feature-complete (first room done); polish pass + combat next. Canonical spec + vertical slice + deterministic engine now live in `01_JOURNEYS/JOURNEYS UNTO/` (fl0w survivor port, 2026-09-17). |
| **M4** | **BtW Day 1 Vertical Slice** | 03_THE_GAMES/ON_DECK/00_BtW/ | ? **On Deck 3** | Playable Day 1 loop (Shop + Market + Foraging path + Weasel beat). |
| **M5** | **Heaven's Nen Arena Repair** | 03_THE_GAMES/BROKEN/12_HEAVENS_NEN/ | ?? **Broken** | WDT failed, missing UI bridge. Held in BROKEN/ until launch ready. |
| **M6** | **Creator Launch Setup** | ME/ | ? **Queued** | Late Sept Minecraft stream, Oct Halloween cosplay, Ep. 1 post-game release tie-in. |
| **M7** | **Goal 1.0 ED FLOW — Studio Systemization** | Workspace / Core | ?? **Complete (2026-09-17)** | ED FLOW 2.0 operating core codified in `ED/00_ESSENCE_CORE/ED_FLOW/`; opencode-native boot contract (AGENTS.md + opencode.json + ESSENCE agent); studio audit report + game catalog; legacy layers annotated. |
| **M8** | **Lotus Adversity — The Wheel & Codex (FLOW 2.0 focus)** | 03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/ | ?? **Active Target (MAIN)** | LAG = the active development + testing lab (Game Dev, System Dev, AI research, lore writing). ES GURU feeds LAG worldbuilding research. **Native Wheel live 2026-09-19** (WHEEL-NATIVE-001 — Electron window, no Chrome tab, 6/6 gates green; Architect walked, no notes). |
| **M9** | **The True Client (`EXPLORE/`) — EF 2.0 Gate** | `EXPLORE/` (root) | ⏸ **Parked (2026-09-17)** | v0.5 functional & verified (13/13; live at `:4747`) — read-only live map of the domain. LAG Sealing Gates wired to `bun run lab:verify` (deferred — needs `bun`). Framed as the **tapestry**: proven concepts slide in from standalone tests; the client **displays**, it is **not** the testing platform. |

---

## ? PART 3: STUDIO DEFINITION OF DONE (DoD)

Before any objective or milestone is marked **Complete**, it must satisfy all five conditions:

1. **Mechanical Skeleton Verified:** Mechanics, GTL logic, or structural builds are tested and verified via headless scripts, simulations, or unit checks ("Skeleton before flesh").
2. **Canonical Documents Updated:** 0_ESSENCE_BIBLE.md and 01_THE_DESIGNS/MILESTONES.md reflect the new ground truth.
3. **Console Synchronization:** Trello board lists, cards, tags, and checklists match local repository state ("Consoles answer questions, do not own truth").
4. **VCS Clean State:** Code and documentation changes are committed to Git with clear, structured commit messages (docs:, eat:, ix:, infra:).
5. **Capital Efficiency & Burn Compliance:** Cloud API usage operated within the studio burn limit (< $1.00 / hour), sticking to stock opencode free-tier LLMs (the box policy).

---

## ?? PART 4: DECISION LOG & OBJECTIVE SHIFTS

- **2026-09-17 (Seal the Beast — Leaf 7):** Folded in the v4 identity and
  closed the remaining ground-truth gaps. **(A) Icon system:** the approved
  purple/gold family for real Windows folders — zero-dep WPF generator
  (`ED/01_THE_DESIGNS/ICONS/`) → 32 multi-size `.ico`; applied to **57
  Tier-1 nodes** (`desktop.ini` + `icon.ico`, folder ReadOnly), with
  `remove-icons.ps1` revert. Folders only (Windows cannot icon individual
  files natively). **(B) Bible v4 refresh:** `00_ESSENCE_BIBLE.md` rewritten
  to ESSENCE v4 "PAD" / ED FLOW 2.0 — the stale 3.0 hub/cloud/Discord model
  removed; **DoD 2 now met.** **(C) Drift sync:** catalog + manifest + vault
  README corrected — the fl0w survivor port (Leaf 5) and the Journeys
  duplication are marked resolved. **(D) VCS:** `desktop.ini` un-ignored so
  icon styling is committed; single initial commit of the whole repo (all
  internal — nothing public yet). Client (M9) remains parked; focus is GURU.

- **2026-09-17 (True Client parked — the tapestry, not the test bench):**
  Drew parked the client ("parked for now; I'd rather focus on GURU"). v0.5
  confirmed as a working functional platform (launched at `:4747`). LAG gate
  test blocked only by `bun` not installed — cosmetic, fixable, not a defect.
  **Doctrine clarified:** the client is **the tapestry** — a surface where
  concepts **already proven by standalone tests** slide in for display. It is
  **not** built as the testing platform itself; tests stay standalone, and the
  client inherits their proofs. Focus returns to **ES GURU** (separate opencode
  window, per Buffer Stream Precaution).

- **2026-09-17 (True Client — Leaf 6, M9):** Built the first cut of the EF 2.0
  validation gate — `EXPLORE/` (The True Client). Rulings locked by Drew:
  home is its own root folder `EXPLORE/` (root `index.html` purged by audit);
  hand-rolled Canvas/SVG, **zero dependencies**; read the repo **on demand**
  with live (SSE) in-place updates — go live, no reload; watch scope = root +
  `ED/` (excl. `.git`, `node_modules`, deep `LEGACY/`); **read-only for v0.5**
  (confirm read + function before any write/plant/prune); Test-Ops reach =
  **LAG only**, every other parcel gets yellow UNDER CONSTRUCTION tape;
  LAG gates shell the game's own `bun run lab:verify` (single source of truth)
  and degrade to a clean `unavailable` state when `bun`/deps are absent.
  Delivered: `server.js` (Ledger — domain model, `fs.watch`+SSE, static,
  gate runner), `index.html`, `style.css`, `app.js` (icon language + map +
  dossier overlays), `ledger.test.js` (**13/13**), `README.md`. Milestone
  **M9** opened. Run: `node EXPLORE/server.js` → <http://localhost:4747>.

- **2026-09-17 (fl0w survivor port — Leaf 5):** Ported the layer-2 fl0w hub
  survivors out of the vault into live districts: Journeys' canonical spec
  (`JOURNEYS_LORE_BIBLE_V0.2.md`), deployable vertical slice
  (`VERTICAL_SLICE/`), and the deterministic runtime core (`ENGINE/`, JRN-204
  + M1 gate suites — 4/4 and 5/5 passing at port time) now live in
  `01_JOURNEYS/JOURNEYS UNTO/`; studio-wide patterns (Deterministic QA
  Ledger, fl0w Ticket/Spec Schema) landed in `01_THE_DESIGNS/FRAMEWORKS/`.
  Resolves the Goal 1.0 catalog duplication finding: the game folder now
  owns the canonical slice, `journeys-unto-demo/` re-labeled legacy.

- **2026-09-17 (Goal 1.0 ED FLOW focus shift):** Drew proclaimed
  **Lotus Adversity (The Wheel + codex) the active MAIN** — the dev/testing
  lab for Game Dev, System Dev, AI research, and lore writing. **PROSIS
  parked** in `BROKEN/02_PROSIS/` with Heaven's Nen (was the previous
  system's focus). Journeys Unto stays parked (first room feature-complete;
  polish + combat next; current build in the vault fl0w hub). ES GURU
  becomes supporting research for LAG worldbuilding (WoW/OSRS/Morrowind New
  Classic).

- **2026-09-17 (Goal 1.0 ED FLOW):** Completed the full studio audit and named ED FLOW 2.0. Canonical operating core consolidated into `ED/00_ESSENCE_CORE/ED_FLOW/` (manifest, operating core, game catalog, deep-dive charter). OpenCode is now the opencode-native operating core (AGENTS.md boot contract, ESSENCE agent, /boot + /leaf commands). Legacy layers archived-as-reference. Part 1's sprint objective is historical as of this date.

- **2026-08-29 (ESSENCE 2.0 / Leaf 4 Completed):** Executed a massive studio audit to lock down agent guardrails. Transferred 10 dormant projects to PARKED/. Created ON_DECK/ for Kitchen Symphony, Journeys Unto, and Brew the World. Moved 12_HEAVENS_NEN to BROKEN/ to acknowledge the reality that the WDT and UI bridge are failing. Created the Captain's Log to ritualize the daily grind. 
- **2026-08-26 (Prosis V2 Captain's Edition Feature Complete):** Completed major Prosis V2 overhaul with animated prOsis event horizon black hole logo, procedural Web Audio API synthesizer, and 33/33 passing unit tests. 
- **2026-08-26 (Phase 1 Web Trinity Finalized):** Locked in the Phase 1 Web Ecosystem Trinity: **Heaven's Nen Arena** (Turn-Based Tactical), **Prosis** (Emergent AI Sim), and **Cook Game** (Real-Time Audio & Kitchen Rhythm Chaos).
- **2026-08-26 (INFRA 1.0 Milestone Completion):** Officially completed **Milestone M0: Ground-Truth INFRA Setup**. Health check script added, .gitignore hardened, and documentation established.

- **2026-09-19 (Founding Arc closes — the system proved itself):** The 17→19
  arc unified the previous ED systems and produced the three founding
  artifacts: **(1) The Pipeline** — Goal 1.0 ED FLOW, live OpenCode-native
  layer (boot contract, operating core, leaf lifecycle, ledger + seat
  roster). **(2) The Guru** — ES GURU Helper, play-session skill + knowledge
  base, supporting research for LAG. **(3) The Native Wheel** —
  WHEEL-NATIVE-001 wrapped Lotus Adversity's static build in an Electron
  desktop window (golden Wheel icon, no Chrome tab, 6/6 gates green).
  Drew's Architect walk passed with no notes — verified as **100% the base
  of all LAG dev**, the proof the system can make the game (disciplined
  work + lesson learning). Same arc: 1-Stone permission-unlocked
  (edit/bash allow) → hands-free execution; WASH-001 (Ghost of Wake)
  scoped + planted, deferred; DISCOVERIES #17 enshrined; XP unlock queued
  at next boot.

---

**When in doubt, check 01_THE_DESIGNS/MILESTONES.md for active direction or ask Drew.**
