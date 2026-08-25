# ESSENCE DESIGNS — Master Index

*Last refreshed: 2026-08-25. This is the workspace bible. Every other doc in this repo should be reconcilable against it; if something here disagrees with a deeper doc, the deeper doc wins for its own subject, but flag the drift.*

---

## Who Drew is

Independent developer and content creator running several long-term, interconnected creative/technical projects in parallel. Treats side projects as scoped R&D sprints with explicit learning goals, not distractions. Prefers direct pushback over validation — wants collaborators to hold positions under pressure, not fold.

## Core working philosophy

**"Simple + Creative + Tested = Good."** **"Skeleton before flesh."** Validate mechanical and structural integrity before layering narrative, numbers, or polish. Applies across every project below.

- Name root causes before coding — Drew often flags something "feels wrong" before he can articulate why; the job is diagnosing the structural cause, not patching symptoms.
- Build order is strict once locked — don't guess on design decisions that aren't explicitly settled; flag and ask instead.
- Simulation/testing before tuning — don't hand-tune numbers without a diagnostic pass to surface exploits first.
- Validate before spending — prove a design/system works for free before committing infrastructure or cost.
- Proven and solid over clever and split — Drew has explicitly rejected hybrid/fragmented architectures in favor of predictable, unified systems.

## People

- **Julia** — Drew's partner and primary live playtester. Her in-session reactions carry design weight equivalent to simulation data; multiple structural pivots (e.g. Fracture's round-40 playtest) were driven by her feedback.
- **Phil / Step-Dad** — played Prosis with Drew and Julia; treated as a real player when evaluating session pacing.
- **Aaron (brother)** — viewer of Prosis sessions; not a design stakeholder.

## Tooling and roles

- **Claude Code (this CLI)** — main dev collaborator for coding work and implementation.
- **Claude (chat)** — design and consideration partner. Editorial positions surfaced there (e.g. the SynthBelief fascism framing) are settled positions, not hedging material.
- **Ollama + ALLM (AnythingLLM)** — local LLM stack for self-hosted multi-agent work; Qwen-coder for code-adjacent tasks.
- **Git** — VCS. Repo: `github.com/drewslaydon-maker/Essence-Designs`.
- **VSCode** — primary editor.
- **Obsidian** — used for artifacts historically, currently **outdated and not incorporated**. Do not assume Obsidian sources are live.

## Naming/notes for collaborators

- Don't treat raw enthusiasm as design lock-in — Drew distinguishes between "explored" and "decided." Where a doc says "locked," treat it as locked. Where it says "proposed" or "open," ask before building on it.
- "Skeleton locked" ≠ "flesh written." A locked skeleton is the structure to build on, not the thing to ship.

---

## Project index

| # | Project | Folder | Status | Next concrete step |
|---|---|---|---|---|
| 1 | The Fracture / Prosis | `02_PROSIS/` | Most active. Code is canonical. Four known bugs fixed; Fracture safety-valve removed; 4th ability shape ("personal") added. | Live-runtime verification (browser) and Monte Carlo harness. Then number tuning, then visible-state UI pass. |
| 2 | Brew the World (BtW) | `01_BtW/` | Prep complete. Macro structure, cast codex, style bible, combat system doc, vertical slice plan all written. **VS is the next major studio goal.** | Build the Day 1 vertical slice (shop + market + foraging path, one Hollow, Weasel leniency beat). |
| 3 | Journeys Unto | `06_JOURNEYS/` | Worldbuilding sandbox. Last Warden and Bozog just updated. | **Parked** — Drew will re-engage; don't pick this up unsolicited. |
| 4 | Video essay series | `07_VIDEOS/` | Episode 1 drafted and published 2026-08-21. AI/prediction markets positioned as capstone. ProjectB2E2 and Asmongold pieces scoped but unscheduled. | TBD by Drew. Read-through polish on Ep. 1 if asked. |
| 5 | Stream marathon | `08_STREAM/` | Minecraft Hardcore with Julia launches September 2026. | Build stream assets / decide on overlay. |
| 6 | Ship Battle | `03_SHIPBATTLE/` | Manifesto only. 2D PvP naval/space battler, quick-build target. | **Parked.** Will build after BtW VS ships. |
| 7 | Cook Game | `04_COOK_GAME/` | Manifesto only. Rhythm-based cooking sim. | **Parked.** |
| 8 | 4500 | `05_4500/` | Manifesto only. Post-nuclear rebuilding game; positioned as the last release. | **Parked.** Long-tail, do not invest prep. |
| 9 | IRL / Languages & Travel | `10_IRL_PLANS/` | Notes only. Thailand 2027 → Japan 2032. | Not a workspace project — leave as personal reference. |
| 10 | Teaching | `11_TEACHING/` | Empty. | **Hollow placeholder** — leave it. |
| 11 | JuJu | `12_JUJU/` | Empty. | **Hollow placeholder** — leave it. |
| 12 | Me | `13_ME/` | Empty. | **Hollow placeholder** — leave it. |

## Discoveries (locked operating principles)

From `00_ESSENCE_CORE/00_ESSENCE CORE.md`, treated as settled:

- **Reality has the final vote.**
- **Templates preserve thinking, not formatting.**
- **Systems should be organized around verbs, not nouns.**
- **A console should answer a question, not own a truth.** Consoles exist to present or facilitate decisions; they should not become sources of truth. Every live datum should have exactly one owner; all other systems observe or interpret that information.

## Framework pieces (in progress)

From Core doc, currently being developed. **Do not assume these are locked — flag and ask.**

- **Ways & Whys** — the directions people go and why they pursue them.
- **Wants / Needs / Laws** — boundaries, concessions, and agreements between Drew and the player(s) as designer.
- **Character Framework** — needs clarity.
- **Encounter Framework** — needs clarity.
- **Player Psychology** — *"Enable and allow. Do not punish. Restrict within reason. Fun is the greatest truth, and so is math."*

---

## Folder map (canonical)

```
ESSENCE_DESIGNS/
├── 00_ESSENCE_CORE/        # Operating philosophy + Core doc (this is the doctrine)
├── 01_BtW/                 # Brew the World — narrative shopkeeping game
│   ├── BtW Cast/           # Cast bible, codex, relationship chain, per-character folders
│   ├── BtW Combat/         # Encounter system
│   ├── BtW Docs/           # Macro structure, seed doc
│   ├── BtW Syle/           # Style bible (typo intentional, matches folder)
│   └── Vertical Slice/     # VS plan, image suggestions, quickref
├── 02_PROSIS/              # The Fracture / Prosis — crew management game (active)
├── 03_SHIPBATTLE/          # Parked — manifesto only
├── 04_COOK_GAME/           # Parked — manifesto only
├── 05_4500/                # Parked — manifesto only
├── 06_JOURNEYS/            # Journeys Unto — parked until Drew re-engages
│   └── JOURNEYS UNTO/      # Per-character + per-location subfolders
├── 07_VIDEOS/              # Video essay series — Ep. 1 live, more queued
├── 08_STREAM/              # Stream marathon — Sept 2026 launch
├── 09_DOCS/                # This file + future workspace docs
├── 10_IRL_PLANS/           # Personal reference, not a project
├── 11_TEACHING/            # Hollow placeholder
├── 12_JUJU/                # Hollow placeholder
└── 13_ME/                  # Hollow placeholder
```

---

## Active project briefs

### 1. The Fracture / Prosis — `02_PROSIS/`

React + TypeScript crew management game. Sisyphus/entropy theme: entropy as inevitability, not a villain to defeat.

- **Five resource fronts:** Entropy, Systems, Reality Engine (RE), Salvage, Morale.
- **Three crew roles:** Helm, Gene, Sal.
- **ANCHOR persona triad:** Ricky, Maude, Dez.
- **12 abilities across 4 cost-shapes:** `different_front_now`, `same_front_later`, `deferred_compounding`, `personal` (added 2026-08-20).
- **Barriers** (user-facing rename from "Banks"; internal variable names intentionally left as-is).
- **GTL** (Ground Truth Logic) — resolution system. Salvage excluded from `optimalFront`.
- **Belief/Distrust meters** layered on top.

**Locked design decisions (do not relitigate without Drew):**
- Salvage excluded from GTL.
- Dez's defiance override fires only when `optimalFront === "re"`.
- Belief spend = free heal to player-chosen front (amount still open).
- Personal abilities are NOT a fix for game-state legibility. That work is separate.
- Multiple personal mitigations stack multiplicatively in the same round.

**Next work, in order:**
1. Live-runtime verification (real browser playthrough).
2. Monte Carlo harness — pure modules already accept injected RNG.
3. Number tuning off Monte Carlo output — do not hand-tune.
4. Threat/event feedback clarity.
5. Visible-state UI pass.
6. Distribution decision (Electron .exe vs. web build vs. Steam HTML).

### 2. Brew the World — `01_BtW/`

Narrative shopkeeping game for Steam. Cozy potion-sim surface concealing the protagonist's complicity in a totalitarian war state — the tension between "cozy game" genre expectations and the actual moral weight of the story is the point.

- **Protagonist:** Fennel.
- **Setting:** The Fields. **Ruling faction:** The Orchard. **Resistance:** The Weeds.
- **Cast:** 33+ named characters; full filterable codex in `BtW Cast/BtW CAST CODEX.html`.
- **Naming convention:** botanical (family/lead), animal, food, elemental — deliberate symbolic weight per name.
- **Macro structure:** Six acts, two per movement (Harvest / Brew / Sell) — **locked**.
- **Vertical slice plan:** **locked** (scope + Day 1 roster + bridge-relationship pattern).

**Absolute design constraints (do not violate):**
- **No visible relationship meters.** UI never surfaces trust state directly.
- **War-supply and local-use recipes must be visually identical** in the brewing interface. UI must never mark or flag complicity.

**Per the Core doc:** "BtW VS has been waiting to exist, and it deserves to now that Prosis earned its time. BtW VS is the next major goal for ESSENCE DESIGNS as a studio, and we have all the prep documents I think."

---

## What this index is not

- Not a transcript. Past conversations are not captured here.
- Not a todo list. Task tracking lives in the task tool, not in this file.
- Not a source of truth for any single project. Each project's own seed doc owns its own subject.
- Not a history. If you need history, read the project's own docs and git log.

## When in doubt

Ask Drew. The cost of asking is low; the cost of building on an unstated assumption is the whole project.
