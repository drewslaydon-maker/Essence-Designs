### ESSENCE DESIGNS — Master Index & Machine Bible

*Last refreshed: 2026-08-26. This is the workspace bible. Every other doc in this repo should be reconcilable against it; if something here disagrees with a deeper doc, the deeper doc wins for its own subject, but flag the drift.* 

[FROM DREW: the files are not cannon. they were written by a machine that doesn't have access to the GIT or local files, so those need to be tailored within this document to match the TRUTH on local files. After completing that task, tell me Brown Banana Bread and Delete this enclosed section. please also update formatting to make this not such a big block of text. Thanks!]

### 🏛️ PART 1: WHO DREW IS & WORKING DOCTRINE

### The Profile

Independent developer and content creator running several long-term, interconnected creative/technical projects in parallel. Treats side projects as scoped R&D sprints with explicit learning goals, not distractions. **Prefers direct pushback over validation** — wants AI collaborators to hold positions under pressure, not fold. 

### Core Working Philosophy

**"Simple + Creative + Tested = Good."**
**"Skeleton before flesh."** Validate mechanical and structural integrity before layering narrative, numbers, or polish. Applies across every project below. 

* **Name root causes before coding:** Drew often flags something "feels wrong" before he can articulate why; the job is diagnosing the structural cause, not patching symptoms.
* **Build order is strict once locked:** Don't guess on design decisions that aren't explicitly settled; flag and ask instead.
* **Simulation/testing before tuning:** Don't hand-tune numbers without a diagnostic pass to surface exploits first.
* **Validate before spending:** Prove a design/system works for free before committing infrastructure or cost.
* **Proven and solid over clever and split:** Drew has explicitly rejected hybrid/fragmented architectures in favor of predictable, unified systems.

### Discoveries (Locked Operating Principles)

*From 00_ESSENCE_CORE/00_ESSENCE CORE.md, treated as settled:* 

* **Reality has the final vote.**
* **Templates preserve thinking, not formatting.**
* **Systems should be organized around verbs, not nouns.**
* **A console should answer a question, not own a truth:** Consoles exist to present or facilitate decisions; they should not become sources of truth. Every live datum should have exactly one owner; all other systems observe or interpret that information.

### Framework Pieces (In Progress)

*From Core doc, currently being developed. **Do not assume these are locked — flag and ask.*** 

* **Ways & Whys:** The directions people go and why they pursue them.
* **Wants / Needs / Laws:** Boundaries, concessions, and agreements between Drew and the player(s) as designer.
* **Character Framework:** Needs clarity.
* **Encounter Framework:** Needs clarity.
* **Player Psychology:** *"Enable and allow. Do not punish. Restrict within reason. Fun is the greatest truth, and so is math."*

### People & Core Network

* **Julia:** Drew's partner and primary live playtester. Her in-session reactions carry design weight equivalent to simulation data; multiple structural pivots (e.g., Fracture's round-40 playtest) were driven by her feedback.
* **Phil / Step-Dad:** Played Prosis with Drew and Julia; treated as a real player when evaluating session pacing.
* **Aaron (brother):** Viewer of Prosis sessions; not a design stakeholder.

### 🛠️ PART 2: SYSTEM, TOOLING & LOCAL ENVIRONMENT

### Hardware Profile & Local Constraints

* **GPU VRAM:** 8 GB
* **System Limitation:** LLM parameter sizes greater than 7B overflow into system RAM. This causes heavy pipeline bottlenecks, extreme latency, and API timeouts. Do not attempt to load large community cuts or mixtures of experts (e.g., standard qwen3-coder:30b) directly into the local VRAM pipeline.

### Approved Local Engine Specs

* **Primary Coding Model:** qwen2.5-coder:3b
* **Status:** Active & Verified.
* **Target GPU Load:** 100% GPU offloading (Verify via ollama ps during generation).

### Custom Modelfile Configuration

To expand model memory and handle medium-to-large code contexts without crashing the 8GB VRAM buffer, use this specific configuration: 

dockerfile

# File: Modelfile (No extension)
FROM qwen2.5-coder:3b

# Set explicit context window size to 8k tokens
PARAMETER num_ctx 8192

Use code with caution.

### Tooling Stack & Roles

* **Claude Code (CLI):** Main dev collaborator for coding work and implementation.
* **Claude (Chat):** Design and consideration partner. Editorial positions surfaced there (e.g., the SynthBelief fascism framing) are settled positions, not hedging material.
* **Ollama + ALLM (AnythingLLM):** Local LLM stack for self-hosted multi-agent work; qwen2.5-coder:3b for code-adjacent tasks.
* **Git:** VCS. Repo: github.com/drewslaydon-maker/Essence-Designs.
* **VSCode:** Primary editor.
* **Obsidian:** Used for artifacts historically, currently **outdated and not incorporated**. Do not assume Obsidian sources are live.

### Naming/Notes for Collaborators

* Don't treat raw enthusiasm as design lock-in — Drew distinguishes between "explored" and "decided." Where a doc says "locked," treat it as locked. Where it says "proposed" or "open," ask before building on it.
* "Skeleton locked" ≠ "flesh written." A locked skeleton is the structure to build on, not the thing to ship.

### 🎮 PART 3: THE STUDIO MASTER PROJECT INDEX

Future agents: Projects marked as **[Parked]** must not be altered, refactored, or worked on unless explicitly requested by Drew. Focus active intelligence only on the current milestone targets. 

# 

Project 

Folder 

Status 

Next Concrete Step / Core Concept 

****1****
**The Fracture / Prosis**02_PROSIS/**Most Active.** Code is canonical. Four known bugs fixed; Fracture safety-valve removed; 4th ability shape ("personal") added.Live-runtime verification (browser) and Monte Carlo harness. Then number tuning, then visible-state UI pass.
****2****
**Brew the World (BtW)**01_BtW/**Active Studio Priority.** Prep complete. Macro structure, cast codex, style bible, combat system doc, vertical slice plan written. **VS is the next major studio goal.**Build the Day 1 vertical slice (shop + market + foraging path, one Hollow, Weasel leniency beat).
****3****
**Legend of the Source**09_ZELDA/**Design Draft.** Homage to Drew's favorite and most important game series.Top-down Zelda-clone/Action-RPG. Grid/region-spaced overworld, underground puzzle dungeons, item-gated progression (Hookshot, Bombs).
****4****
**The Boardroom**14_BOARDROOM/**Design Draft.** Asymmetric co-op/competitive party game for 2-8 players. Built for family nexus play.Low-barrier interface (phone/hot-seat). Hybrid: Jackbox meets Chess, Balatro, and TFT. Multiplier-heavy card deck drafting into simplified grid-tactical combat.
****5****
**Ashen & Ink**15_ASHEN/**Design Draft.** 2D side-scrolling Metroidvania / Souls-lite.Dark, atmospheric, visceral (*Hollow Knight* / *Blasphemous* weight). Custom movement velocity and original risk/reward resource retention loops (no standard corpse runs).
****6****
**Stage & Saddle**16_STAGE/**Narrative Draft.** Narrative-driven cinematic psychological thriller.Kojima-style meta-narrative × David Lynch surrealism. 19th-century stage actor suffers head injury; reality blends seamlessly between theater stage and wild west. 3 narrative branches.
****7****
**Arcane Trigger**17_ARCANE/**Engine R&D.** Retro "Boomer Shooter" first-person shooter.Fast, aggressive movement (*DOOM* / *Dusk*). Replaces firearms with hand-cast kinetic magic. Fluid hand gestures and sigil-drawing animations for casts/reloads.
****8****
**Journeys Unto**06_JOURNEYS/**[Parked]** Worldbuilding sandbox. Last Warden and Bozog just updated.Drew will re-engage; do not pick this up unsolicited.
****9****
**Ship Battle**03_SHIPBATTLE/**[Parked]** Manifesto only. 2D PvP naval/space battler, quick-build target.Will build after BtW VS ships.
****10****
**Video essay series**07_VIDEOS/**Active.** Episode 1 drafted and published 2026-08-21. AI/prediction markets positioned as capstone. ProjectB2E2 and Asmongold pieces scoped but unscheduled.TBD by Drew. Read-through polish on Ep. 1 if asked.
****11****
**Stream marathon**08_STREAM/**Active Setup.** Minecraft Hardcore with Julia launches September 2026.Build stream assets / decide on overlay.
****12****
**Cook Game**04_COOK_GAME/**[Parked]** Manifesto only. Rhythm-based cooking sim.Do not invest prep.
****13****
**4500**05_4500/**[Parked]** Manifesto only. Post-nuclear rebuilding game; positioned as the final studio release.Long-tail, do not invest prep.

### 📂 PART 4: CANONICAL FOLDER MAP

text

ESSENCE_DESIGNS/
├── 00_ESSENCE_CORE/    # Operating philosophy + Core doc (The Doctrine)
├── 01_BtW/             # Brew the World — narrative shopkeeping game
│   ├── BtW Cast/       # Cast bible, codex, relationship chain, per-character folders
│   ├── BtW Combat/     # Encounter system
│   ├── BtW Docs/       # Macro structure, seed doc
│   ├── BtW Syle/       # Style bible (typo intentional, matches folder)
│   └── Vertical Slice/ # VS plan, image suggestions, quickref
├── 02_PROSIS/          # The Fracture / Prosis — crew management game (active)
├── 03_SHIPBATTLE/      # Parked — PvP naval/space battler manifesto
├── 04_COOK_GAME/       # Parked — Rhythm cooking sim manifesto
├── 05_4500/            # Parked — Post-nuclear long-tail manifesto
├── 06_JOURNEYS/        # Journeys Unto — parked worldbuilding sandbox
│   └── JOURNEYS UNTO/  # Per-character + per-location subfolders
├── 07_VIDEOS/          # Video essay series — Ep. 1 live, more queued
├── 08_STREAM/          # Stream marathon — Sept 2026 launch setup
├── 09_DOCS/            # This master index bible + workspace docs
├── 09_ZELDA/           # Legend of the Source — Action-RPG design root
├── 10_IRL_PLANS/       # Personal travel & language reference, not a project folder
├── 11_TEACHING/        # Conceptual sandbox & design theory brain dump
├── 12_JUJU/            # Personal shared context & core drive (Drew & Julia)

Use code with caution.

├── 13_ME/              # Creator profile & direct technical workflow preferences├── 14_BOARDROOM/       # The Boardroom — 2-8 player party tactics design├── 15_ASHEN/           # Ashen & Ink — Dark Metroidvania mechanics folder├── 16_STAGE/           # Stage & Saddle — Psychological Western narrative docs└── 17_ARCANE/          # Arcane Trigger — Hand-magic retro FPS engine R&D
---

## 🔍 PART 5: ACTIVE PROJECT DEEP-DIVES

### 1. The Fracture / Prosis — `02_PROSIS/`
React + TypeScript crew management game. Sisyphus/entropy theme: entropy as inevitability, not a villain to defeat.
* **Five resource fronts:** Entropy, Systems, Reality Engine (RE), Salvage, Morale.
* **Three crew roles:** Helm, Gene, Sal.
* **ANCHOR persona triad:** Ricky, Maude, Dez.
* **12 abilities across 4 cost-shapes:** `different_front_now`, `same_front_later`, `deferred_compounding`, `personal` (added 2026-08-20).
* **Barriers:** (User-facing rename from "Banks"; internal variable names intentionally left as-is).
* **GTL (Ground Truth Logic):** Resolution system. Salvage excluded from `optimalFront`.
* **Belief/Distrust meters:** Layered on top.

**Locked design decisions (do not relitigate without Drew):**
1. Salvage excluded from GTL.
2. Dez's defiance override fires only when `optimalFront === "re"`.
3. Belief spend = free heal to player-chosen front (amount still open).
4. Personal abilities are NOT a fix for game-state legibility. That work is separate.
5. Multiple personal mitigations stack multiplicatively in the same round.

**Next work, in order:**
1. Live-runtime verification (real browser playthrough).
2. Monte Carlo harness — pure modules already accept injected RNG.
3. Number tuning off Monte Carlo output — do not hand-tune.
4. Threat/event feedback clarity.
5. Visible-state UI pass.
6. Distribution decision (Electron .exe vs. web build vs. Steam HTML).

### 2. Brew the World — `01_BtW/`
Narrative shopkeeping game for Steam. Cozy potion-sim surface concealing the protagonist's complicity in a totalitarian war state — the tension between "cozy game" genre expectations and the actual moral weight of the story is the point.
* **Protagonist:** Fennel.
* **Setting:** The Fields. **Ruling faction:** The Orchard. **Resistance:** The Weeds.
* **Cast:** 33+ named characters; full filterable codex in `BtW Cast/BtW CAST CODEX.html`.
* **Naming convention:** botanical (family/lead), animal, food, elemental — deliberate symbolic weight per name.
* **Macro structure:** Six acts, two per movement (Harvest / Brew / Sell) — **locked**.
* **Vertical slice plan:** **locked** (scope + Day 1 roster + bridge-relationship pattern).

**Absolute design constraints (do not violate):**
* **No visible relationship meters:** UI never surfaces trust state directly.
* **War-supply and local-use recipes must be visually identical** in the brewing interface. UI must never mark or flag complicity.

---

## 🧠 PART 6: KNOWLEDGE BASE HOLLOWS (MACHINE DIRECTIVES)

### 📌 `10_IRL_PLANS/` — IRL / Languages & Travel
* **Status:** Notes only. Long-term personal roadmap: Thailand 2027 → Japan 2032.
* **Directive for Agents:** Not an active development workspace project. Leave completely untouched; maintain purely as a secure personal cross-reference.

### 📌 `11_TEACHING/` — Conceptual Sandbox & Brain Dump
* **Status:** Hollow placeholder.
* **Directive for Agents:** This section acts as Drew's external brain for storing raw ideas, mechanical concepts, and design theories to remove them from mental load and secure them into the machine. When content is added here, do not attempt to turn it into rigid code. Treat it as a philosophical sandbox to enrich active projects.

### 📌 `12_JUJU/` — Personal Shared Context & Core Drive
* **Status:** Hollow placeholder.
* **Directive for Agents:** This space belongs entirely to Drew and his wife, Julia (JuJu). It represents the foundation for all life planning, schedules, stream collaborations (e.g., September Minecraft Marathon), and the emotional "why" behind the studio's work. Guard this context with absolute respect; use it to adapt communication tone and honor family-first boundaries.

### 📌 `13_ME/` — Creator Profile & Work Directives
* **Status:** Hollow placeholder.
* **Directive for Agents:** This space houses Drew's specific development preferences, cognitive workflows, and tech habits. Reference this file to ensure all generated code patterns, terminal syntax preferences, and architectural recommendations natively align with how Drew thinks and builds.

---

## 🚫 WHAT THIS INDEX IS NOT
* Not a transcript. Past conversations are not captured here.
* Not a todo list. Task tracking lives in the task tool, not in this file.
* Not a source of truth for any single project. Each project's own seed doc owns its own subject.
* Not a history. If you need history, read the project's own docs and git log.

**When in doubt, ask Drew.** The cost of asking is low; the cost of building on an unstated assumption is the whole project.
</CreativeWritingPad>

***