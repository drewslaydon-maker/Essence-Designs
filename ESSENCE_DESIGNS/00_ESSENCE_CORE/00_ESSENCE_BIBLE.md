# ESSENCE DESIGNS — Master Index & Machine Bible

*Last refreshed: 2026-08-26 (INFRA update). Workspace master bible for ESSENCE DESIGNS.*

---

##  PART 1: WHO DREW IS & WORKING DOCTRINE

### The Profile
Independent developer and content creator running several long-term, interconnected creative/technical projects in parallel. Treats side projects as scoped R&D sprints with explicit learning goals, not distractions. **Prefers direct pushback over validation** — wants AI collaborators to hold positions under pressure, not fold.

### Core Working Philosophy
> **"Simple + Creative + Tested = Good."**  
> **"Skeleton before flesh."** Validate mechanical and structural integrity before layering narrative, numbers, or polish.

- **Name root causes before coding:** Diagnose structural causes rather than patching symptoms.
- **Strict build order:** Flag and ask on unsettled design decisions rather than guessing.
- **Simulation/testing before tuning:** Use diagnostic passes to surface exploits before hand-tuning parameters.
- **Validate before spending:** Prove a design/system works for free before committing infrastructure or cost.
- **Proven & solid over clever & split:** Favor predictable, unified systems over hybrid/fragmented architectures.

### Discoveries (Locked Operating Principles)
- **Reality has the final vote.**
- **Templates preserve thinking, not formatting.**
- **Systems should be organized around verbs, not nouns.**
- **A console should answer a question, not own a truth:** Consoles facilitate decisions; they are not sources of truth. Every live datum has exactly one owner.

### Framework Pieces (In Progress)
- **Ways & Whys:** The directions people go and why they pursue them.
- **Wants / Needs / Laws:** Boundaries, concessions, and agreements between designer and players.
- **Character Framework:** Needs clarity.
- **Encounter Framework:** Needs clarity.
- **Player Psychology:** *"Enable and allow. Do not punish. Restrict within reason. Fun is the greatest truth, and so is math."*

### People & Core Network
- **Julia ("JuJu"):** Drew's partner and primary live playtester. In-session reactions carry design weight equivalent to simulation data.
- **Phil / Step-Dad:** Playtested Prosis with Drew and Julia; treated as a live player for session pacing.
- **Aaron (brother):** Viewer of Prosis sessions.

---

##  PART 2: SYSTEM, TOOLING & LOCAL ENVIRONMENT

### Hardware Profile & Cost Constraints
- **GPU VRAM:** 8 GB
- **System Limitation:** Parameter sizes > 7B overflow into system RAM, causing pipeline bottlenecks and latency. Do not load large cuts/MoEs directly into VRAM.
- **Financial Floor & Burn Pace:** Maximum target burn rate `< $1.00 / hour` across all cloud API operations.
- **Hybrid Cost Architecture:** Free local offload (`qwen2.5-coder:3b` / `fast-coder` @ 8k context) for single-file edits, health checks, and ambient tasks; cloud endpoints reserved for deep architectural synthesis and multi-file refactors.
- **Capital Discipline:** Julia's income supports operations; Drew controls studio burn; zero financial burden on family network (Mom & Phil). Scope must be cut aggressively to preserve runway.

### Approved Local Engine Specs
- **Primary Coding Model:** qwen2.5-coder:3b (Active & Verified, 100% GPU offloading).
- **Custom Modelfile Config:** Context window expanded to 8k tokens (PARAMETER num_ctx 8192).

### Tooling Stack & Roles
- **Claude Code (CLI):** Primary dev collaborator for coding and implementation.
- **Claude (Chat):** Design and consideration partner. Editorial positions surfaced here are settled stances.
- **Ollama + AnythingLLM:** Local LLM stack for multi-agent workflows.
- **Git:** VCS (github.com/drewslaydon-maker/Essence-Designs).
- **VSCode:** Primary IDE.

---

##  PART 3: THE STUDIO MASTER PROJECT INDEX

> **Machine Directive:** Projects marked as **[Parked]** must not be altered, refactored, or worked on unless explicitly requested by Drew.

| # | Project | Local Folder | Status | Next Concrete Step / Core Concept |
|---|---|---|---|---|
| 0 | **System Infrastructure (INFRA)** | DOCS/ & 00_ESSENCE_CORE/ | **Most Active** | Complete system architecture alignment, Trello sync, local engine/tooling configuration. Next game dev target decided post-INFRA. |
| 1 | **The Fracture / Prosis** | GAME_DEV/02_PROSIS/ | **[Parked]** | Paused. Engine test baseline verified (26/29 passing). Held until post-INFRA decision. |
| 2 | **Brew the World (BtW)** | GAME_DEV/01_BtW/ | **[Parked]** | Paused. Day 1 Vertical Slice plan documented and ready. Held until post-INFRA decision. |
| 3 | **Legend of the Source** | GAME_DEV/07_MY_ZELDA/ | **Design Draft** | Top-down Zelda-inspired Action-RPG overworld & puzzle dungeons. |
| 4 | **The Boardroom** | GAME_DEV/08_BOARDROOM/ | **Design Draft** | Asymmetric 2-8 player party tactics (Jackbox × Chess × Balatro). |
| 5 | **Ashen & Ink** | GAME_DEV/09_METROID_SOUL_VANIA/ | **Design Draft** | 2D side-scrolling Metroidvania / Souls-lite with custom velocity movement. |
| 6 | **Stage & Saddle** | GAME_DEV/10_STAGEnSADDLE/ | **Narrative Draft** | Psychological Western thriller (Kojima × David Lynch surrealism). |
| 7 | **Arcane Trigger** | GAME_DEV/11_MAGIC_HANDS/ | **Engine R&D** | Retro boomer shooter replacing guns with hand-cast kinetic magic. |
| 8 | **Journeys Unto** | GAME_DEV/06_JOURNEYS/ | **[Parked]** | Worldbuilding sandbox and tabletop campaign prep hub. |
| 9 | **Ship Battle** | GAME_DEV/03_SHIPBATTLE/ | **[Parked]** | 2D PvP naval/space battler (post-BtW target). |
| 10 | **Video Essay Series** | ME/01_VIDEOS/ | **Active** | Ep. 1 published. AI/prediction markets capstone, ProjectB2E2, and Asmongold pieces queued. |
| 11 | **Stream Marathon** | ME/02_STREAM/ | **Active Setup** | Minecraft Hardcore with Julia (Sept 2026 launch setup). |
| 12 | **Cook Game** | GAME_DEV/04_COOK_GAME/ | **[Parked]** | Rhythm-based cooking sim manifesto. |
| 13 | **4500** | GAME_DEV/05_4500/ | **[Parked]** | Post-nuclear rebuilding game (final studio release vision). |

---

## PART 4: CANONICAL FOLDER MAP

`	ext
ESSENCE_DESIGNS/
├── 00_ESSENCE_CORE/            # Operating philosophy & Master Bible
│   ├── 00_ESSENCE_BIBLE.md     # Studio Bible & canonical repository index
│   └── 00_ESSENCE_PAD.md       # Operational engine & active notes
├── DOCS/                       # System architecture & documentation
│   ├── AGENT_BOOT_PROMPT.md    # Universal initialization directive for AI agents
│   ├── MILESTONES.md           # Studio milestones, sprint objectives, & decision log
│   ├── SYSTEM_ARCH.md
│   └── placeholder.md
├── GAME_DEV/                   # Studio game projects
│   ├── 01_BtW/                 # Brew the World - narrative shopkeeping game
│   │   ├── BtW Cast/           # Cast bible, codex, relationship chain, character folders
│   │   ├── BtW Combat/         # Encounter system
│   │   ├── BtW Docs/           # Macro structure, seed doc
│   │   ├── BtW Syle/           # Style bible (typo intentional, matches folder)
│   │   └── Vertical Slice/     # VS plan, image suggestions, quickref
│   ├── 02_PROSIS/              # The Fracture / Prosis - crew management game (active code)
│   ├── 03_SHIPBATTLE/          # PvP naval/space battler manifesto
│   ├── 04_COOK_GAME/           # Rhythm cooking sim manifesto
│   ├── 05_4500/                # Post-nuclear long-tail manifesto
│   ├── 06_JOURNEYS/            # Worldbuilding sandbox & session prep
│   │   └── JOURNEYS UNTO/      # Character, moment, & location subfolders
│   ├── 07_MY_ZELDA/            # Legend of the Source - Action-RPG design root
│   ├── 08_BOARDROOM/           # The Boardroom - 2-8 player party tactics design
│   ├── 09_METROID_SOUL_VANIA/  # Ashen & Ink - Dark Metroidvania mechanics folder
│   ├── 10_STAGEnSADDLE/        # Stage & Saddle - Psychological Western narrative docs
│   └── 11_MAGIC_HANDS/         # Arcane Trigger - Hand-magic retro FPS engine R&D
└── ME/                         # Creator profile, media, & personal plans
    ├── 00_IRL_PLANS/           # Personal travel & language reference
    ├── 01_VIDEOS/              # Video essay series & scripts
    ├── 02_STREAM/              # Stream marathon setup & notes
    ├── 03_JUJU/                # Shared context & core drive (Drew & Julia)
    ├── 04_MaMa/                # Mama Jo's Cookbook system plans
    └── TEACHING/               # Conceptual sandbox & design theory brain dump
`

---

##  PART 5: ACTIVE PROJECT DEEP-DIVES

### 1. The Fracture / Prosis — GAME_DEV/02_PROSIS/
React + TypeScript crew management game. Sisyphus/entropy theme: entropy as inevitability, not a villain to defeat.
- **Five resource fronts:** Entropy, Systems, Reality Engine (RE), Salvage, Morale.
- **Three crew roles:** Helm, Gene, Sal.
- **ANCHOR persona triad:** Ricky, Maude, Dez.
- **12 abilities across 4 cost-shapes:** different_front_now, same_front_later, deferred_compounding, personal.
- **Barriers:** User-facing rename from "Banks".
- **GTL (Ground Truth Logic):** Resolution system. Salvage excluded from optimalFront.

**Locked Design Decisions:**
1. Salvage excluded from GTL.
2. Dez's defiance override fires only when optimalFront === "re".
3. Belief spend = free heal to player-chosen front.
4. Personal mitigations stack multiplicatively in the same round.

### 2. Brew the World — GAME_DEV/01_BtW/
Narrative shopkeeping game for Steam. Cozy potion-sim surface concealing the protagonist's complicity in a totalitarian war state.
- **Protagonist:** Fennel | **Setting:** The Fields | **Ruling Faction:** The Orchard | **Resistance:** The Weeds.
- **Cast:** 33+ named characters with filterable codex (BtW Cast/BtW CAST CODEX.html).
- **Macro Structure:** Six acts across Harvest / Brew / Sell (Locked).

**Absolute Design Constraints:**
- **No visible relationship meters:** UI never surfaces trust state directly.
- **War-supply and local recipes must be visually identical** in brewing interface.

---

##  PART 6: KNOWLEDGE BASE HOLLOWS (MACHINE DIRECTIVES)

- **ME/00_IRL_PLANS/:** Personal travel & language reference (Thailand 2027 ? Japan 2032). Untouched by agents.
- **ME/TEACHING/:** Conceptual sandbox & design theory brain dump.
- **ME/03_JUJU/:** Personal shared context & core drive (Drew & Julia). Guarded with absolute respect.
- **ME/:** Creator profile & workflow preferences.

---

##  WHAT THIS INDEX IS NOT
- Not a transcript or past chat log.
- Not a todo list (task tracking lives in task tools/Trello).
- Not a replacement for deep project seed docs.

**When in doubt, ask Drew.**
