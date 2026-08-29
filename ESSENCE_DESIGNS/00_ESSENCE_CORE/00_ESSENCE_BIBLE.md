# ESSENCE DESIGNS — Master Index \& Machine Bible

*Last refreshed: 2026-08-29 (ESSENCE 2.0 Audit).*

\---

## ??? PART 1: WHO DREW IS \& WORKING DOCTRINE

### The Profile

Independent developer and content creator running several long-term, interconnected creative/technical projects in parallel. Treats side projects as scoped R\&D sprints with explicit learning goals, not distractions. **Prefers direct pushback over validation** - wants AI collaborators to hold positions under pressure, not fold.

### Core Working Philosophy

> \\\*\\\*"Simple + Creative + Tested = Good."\\\*\\\*  
> \\\*\\\*"Skeleton before flesh."\\\*\\\* Validate mechanical and structural integrity before layering narrative, numbers, or polish.

* **Name root causes before coding:** Diagnose structural causes rather than patching symptoms.
* **Strict build order:** Flag and ask on unsettled design decisions rather than guessing.
* **Simulation/testing before tuning:** Use diagnostic passes to surface exploits before hand-tuning parameters.
* **Validate before spending:** Prove a design/system works for free before committing infrastructure or cost.
* **Proven \& solid over clever \& split:** Favor predictable, unified systems over hybrid/fragmented architectures.

### Discoveries (Locked Operating Principles)

* **Reality has the final vote.**
* **Templates preserve thinking, not formatting.**
* **Systems should be organized around verbs, not nouns.**
* **A console should answer a question, not own a truth:** Consoles facilitate decisions; they are not sources of truth. Every live datum has exactly one owner.
* **Context reset purges drift:** Clearing continued chat history clears out accumulated bad data and prompt drift; local repository files are the single absolute truth for direction and state.
* **The Buffer Stream Precaution (The Finger in the Machine):** Typing into an execution agent's chat window during active file edits or terminal runs can cause token leaks directly into code files. Execution agents must operate uninterrupted. Every file edit must be verified by the Planner and diagnostic test suite before proceeding.

### People \& Core Network

* **Julia ("JuJu") (@jthimeg):** Drew's partner and primary live playtester. Tag @jthimeg on GitHub for major updates to Heaven's Nen Arena (HNA). In-session reactions carry design weight equivalent to simulation data.
* **Phil / Step-Dad:** Playtested Prosis with Drew and Julia; treated as a live player for session pacing. OG Gamer, opinion is invaluable.
* **Aaron (brother):** Viewer of Prosis sessions.

\---

## ??? PART 2: SYSTEM, TOOLING \& LOCAL ENVIRONMENT

### Hardware Profile \& Cost Constraints

* **GPU VRAM:** 8 GB
* **System Limitation:** Parameter sizes > 7B overflow into system RAM, causing pipeline bottlenecks and latency. Do not load large cuts/MoEs directly into VRAM.
* **Financial Floor \& Burn Pace:** Maximum target burn rate < .00 / hour across all cloud API operations.
* **Hybrid Cost Architecture:** Free local offload (qwen2.5-coder:3b /
ast-coder @ 8k context) for single-file edits, health checks, and ambient tasks; cloud endpoints reserved for deep architectural synthesis and multi-file refactors.
* **Capital Discipline:** Julia's income supports operations; Drew controls studio burn; zero financial burden on family network (Mom \& Phil). Scope must be cut aggressively to preserve runway.

### Approved Local Engine Specs

* **Primary Coding Model:** qwen2.5-coder:3b (Active \& Verified, 100% GPU offloading).
* **Custom Modelfile Config:** Context window expanded to 8k tokens (PARAMETER num\_ctx 8192).

\---

## ?? PART 3: THE STUDIO MASTER PROJECT INDEX

> \\\*\\\*Machine Directive:\\\*\\\* Projects in PARKED/ or BROKEN/ must not be altered. Only  2\\\_PROSIS is currently active.

|#|Project|Local Folder|Status|Next Concrete Step / Core Concept|
|-|-|-|-|-|
|0|**System Infrastructure (INFRA)**|DOCS/ \& 00\_ESSENCE\_CORE/|**Complete (ESSENCE 2.0)**|System architecture, Trello sync, local engine/tooling configuration baseline established.|
|1|**The Fracture / Prosis**|GAME\_DEV/02\_PROSIS/|**Active Target**|Modularize UI to escape Token Wall. Prep for Phil's Playtest.|
|2|**Cook Game**|GAME\_DEV/ON\_DECK/04\_COOK\_GAME/|**Queued (On Deck 1)**|Real-Time Rhythm \& Kitchen Chaos web arcade game. Next priority.|
|3|**Journeys Unto**|GAME\_DEV/ON\_DECK/06\_JOURNEYS/|**Queued (On Deck 2)**|Worldbuilding sandbox and tabletop campaign prep hub.|
|4|**Brew the World (BtW)**|GAME\_DEV/ON\_DECK/01\_BtW/|**Queued (On Deck 3)**|Narrative shopkeeping game. Held until Kitchen/Journeys stable.|
|5|**Heaven's Nen**|GAME\_DEV/BROKEN/12\_HEAVENS\_NEN/|**Broken (WDT Failed/No UI)**|Mechanics exist, but UI bridge is missing and WDT logic fails. Parked until ready for launch.|
|6|**Legend of the Source**|GAME\_DEV/PARKED/07\_MY\_ZELDA/|**Design Draft**|Top-down Zelda-inspired Action-RPG overworld \& puzzle dungeons.|
|7|**The Boardroom**|GAME\_DEV/PARKED/08\_BOARDROOM/|**Design Draft**|Asymmetric 2-8 player party tactics (Jackbox x Chess x Balatro).|
|8|**Ashen \& Ink**|GAME\_DEV/PARKED/09\_METROID\_SOUL\_VANIA/|**Design Draft**|2D side-scrolling Metroidvania / Souls-lite with custom velocity movement.|
|9|**Stage \& Saddle**|GAME\_DEV/PARKED/10\_STAGEnSADDLE/|**Narrative Draft**|Psychological Western thriller (Kojima x David Lynch surrealism).|
|10|**Arcane Trigger**|GAME\_DEV/PARKED/11\_MAGIC\_HANDS/|**Engine R\&D**|Retro boomer shooter replacing guns with hand-cast kinetic magic.|
|11|**4500**|GAME\_DEV/PARKED/05\_4500/|**\[Parked]**|Post-nuclear rebuilding game (final studio release vision).|
|12|**Ship Battle**|GAME\_DEV/PARKED/03\_SHIPBATTLE/|**\[Parked]**|2D PvP naval/space battler (post-BtW target).|
|13|**Video Essay Series**|ME/01\_VIDEOS/|**Active**|Ep. 1 script complete, waiting for post-game release tie-in. AI/prediction markets capstone, ProjectB2E2, and Asmongold pieces queued.|
|14|**Stream Marathon**|ME/02\_STREAM/|**Active Setup**|Late Sept: Post-grind launch & Minecraft with Julia. Oct: Halloween (Reigen/Mob/Dimple cosplay). Nov: BtW dev focus. Dec: Rest.|

\---

## ??? PART 4: CANONICAL FOLDER MAP

`	ext ESSENCE\\\_DESIGNS/ +-- 00\\\_ESSENCE\\\_CORE/            # Operating philosophy \\\& Master Engine +-- 00\\\_ESSENCE\\\_BIBLE.md     # Studio Bible \\\& canonical repository index +-- 01\\\_THE\\\_GARDEN.md        # The Bedrock Tree / Ecosystem overview +-- 02\\\_ESSENCE\\\_PAD.md       # Operational engine \\\& active notes (git-ignored) +-- 03\\\_CLINERULES.md        # DOER Execution Guardrails +-- INFRA/                  # System tests and monorepo roots +-- DOCS/                       # System architecture \\\& documentation +-- GAME\\\_DEV/                   # Studio game projects +-- 02\\\_PROSIS/              # ACTIVE: The Fracture / Prosis +-- ON\\\_DECK/                # Queued for development +-- 04\\\_COOK\\\_GAME/        +-- 06\\\_JOURNEYS/         +-- 01\\\_BtW/              +-- BROKEN/                 # Dormant projects requiring repair +-- 12\\\_HEAVENS\\\_NEN/     # WDT failed, missing UI bridge +-- PARKED/                 # Strictly off-limits design drafts +-- ME/                         # Creator profile, media, \\\& personal plans `

\---

## WHAT THIS INDEX IS NOT

* Not a transcript or past chat log.
* Not a todo list (task tracking lives in task tools/Trello).
* Not a replacement for deep project seed docs.

**When in doubt, ask Drew.**

