# GAME CATALOG — Accurate Roster & Placement

> Compiled by Big Pickle during the **Goal 1.0 audit** (2026-09-17).
> Report-only: no game code was modified. Names/placement per `AGENTS.md`
> numbering rule (immutable IDs; priority = placement district).

---

## 1. The Roster (by numeric ID)

| ID | Project | District | State | Stack / Notes |
|---|---|---|---|---|
| `00_` | **BtW** (Brew the World) | `03_THE_GAMES/ON_DECK/00_BtW/` | On Deck 3 | Genesis project of the studio's ambition. Concept docs. |
| `01_` | **Journeys Unto** | `03_THE_GAMES/ON_DECK/01_JOURNEYS/` + legacy demo in vault (`LEGACY/VAULT/journeys-unto-demo/`) | On Deck 2 | Campaign-prep → standalone baseline. **Parked feature-complete** (first room done); polish pass + combat are the next steps. Canonical spec (`JOURNEYS_LORE_BIBLE_V0.2.md`), vertical slice (`VERTICAL_SLICE/`), and deterministic engine (`ENGINE/`, JRN-204 4/4 + M1 5/5) now live in `ON_DECK/01_JOURNEYS/JOURNEYS UNTO/` (fl0w survivor port — Leaf 5, 2026-09-17). |
| `02_` | **PROSIS (The Fracture)** | `03_THE_GAMES/BROKEN/02_PROSIS/` | **BROKEN / Parked** | Demo with cool gameplay + 46/46 tests. Focus moved to LAG (FLOW 2.0); stale-test path fix **parked** (test hard-codes `ESSENCE_DESIGNS/GAME_DEV/02_PROSIS/index.html`). Builds `index.html` in-project. |
| `03_` | **ShipBattle** | `03_THE_GAMES/PARKED/03_SHIPBATTLE/` | Parked | — |
| `04_` | **Cook Game** (Kitchen Symphony) | `03_THE_GAMES/ON_DECK/04_COOK_GAME/` | On Deck 1 | Real-time rhythm & kitchen chaos web arcade (Phase 1 Web Trinity). |
| `05_` | **4500** | `03_THE_GAMES/PARKED/05_4500/` | Parked | — |
| `06_` | **Lotus Adversity** | `03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/` | **ACTIVE — MAIN** | **The ED FLOW 2.0 focus objective**: The Wheel + its codex. The active development + testing lab across Game Dev, System Dev, AI research, and Drew's lore writing. GOTY-era rhythm/combat — the studio's first platform, purged of GAIS-era errors. Real game nested under `Lotus-Adversity-Game-main/`. |
| `07_` | **My Zelda** | `03_THE_GAMES/PARKED/07_MY_ZELDA/` | Parked | — |
| `08_` | **Boardroom** | `03_THE_GAMES/PARKED/08_BOARDROOM/` | Parked | — |
| `09_` | **Metroid Soul Vania** | `03_THE_GAMES/PARKED/09_METROID_SOUL_VANIA/` | Parked | — |
| `10_` | **Stage 'n Saddle** | `03_THE_GAMES/PARKED/10_STAGEnSADDLE/` | Parked | — |
| `11_` | **Magic Hands** | `03_THE_GAMES/PARKED/11_MAGIC_HANDS/` | Parked | — |
| `12_` | **Heaven's Nen** | `03_THE_GAMES/BROKEN/12_HEAVENS_NEN/` | Broken | JS engine; WDT failed, missing UI bridge. Held in BROKEN/. |

## 2. Legacy-Vault roster (unnumbered, outside the game districts)

| Project | Path | State |
|---|---|---|
| **elder-scrolls-lore-codex** | `.../elder-scrolls-lore-codex/` | LIVE (knowledge app, Vite/React) |
| **ElderScrollsGuruHelper** | `.../ElderScrollsGuruHelper/` | ACTIVE (knowledge base, not a game) |
| echoes-of-fate | `.../echoes-of-fate/` | Concept — owns an individual Game Deep Dive pass |
| eva-066-fly-brain-mecha-pilot | `.../eva-066_-fly-brain-mecha-pilot/` | Concept — owns an individual Game Deep Dive pass |
| guardians-of-the-rift | `.../guardians-of-the-rift/` | Concept — owns an individual Game Deep Dive pass |
| minemore | `.../minemore/` | Concept — owns an individual Game Deep Dive pass |
| salem-&-spycraft | `.../salem-&-spycraft_-social-deduction-simulation/` | Concept — owns an individual Game Deep Dive pass |

## 3. Operational Districts in 03_THE_GAMES

- `ACTIVE/` — live projects: `MAIN/` holds the one true focus
  (`06_LOTUS_ADVERSITY_GAME`); `SUPPORTING/` holds what helps the MAIN
  (ES GURU LAG-worldbuilding research — see its `README.md`). An ACTIVE
  with no MAIN reads as broken intent.
- `TOOLKIT/` — **not games**: the shared workbench for the games.
  - `00_THE_ARMORY/` — game-design toolkit / shared assets (now defined by
    its `README.md`).
  - `OBSERVATORY/` — playtest telemetry + balance (now defined by its
    `README.md`). Relocated out of the ACTIVE/ON_DECK/BROKEN/PARKED chain
    per Drew (2026-09-17).
- Invariant (Drew, 2026-09-17): toolkit rooms must carry purpose files —
  no blank, empty, intent-less folders.

## 4. Audit Findings & Rulings

1. **Number gap `06_` — RESOLVED (Drew, 2026-09-17):** Lotus Adversity owns
   slot `06_` — the studio's first platform belongs up with the early games.
   Folder moved to `03_THE_GAMES/ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME/`
   (FLOW 2.0 placement, 2026-09-17).
2. **Clone/duplication risk (JOURNEYS) — RESOLVED (2026-09-17, Leaf 5):**
   Journeys' canonical spec, vertical slice, and deterministic engine were
   ported into `ON_DECK/01_JOURNEYS/JOURNEYS UNTO/`; `LEGACY/VAULT/journeys-unto-demo/`
   and `essence-fl0w-hub-v0.1/public/journeys/` remain legacy references only.
   The game folder now owns the canonical slice.
3. **Root `index.html` — RESOLVED (Drew, 2026-09-17):** purged from
   tracking. Root has had "indexes popping out of their own folders";
   flag the build-pipeline review for the 02_PROSIS Game Deep Dive pass.
4. **New-Project concept games — RESOLVED (Drew, 2026-09-17):** stay
   unnumbered concepts; each gets its own individual pass in the Game Deep
   Dive (`ED_FLOW/03_GAME_DEEP_DIVE.md`).
5. **VCS hygiene — RESOLVED (Drew, 2026-09-17):** fresh re-init + full
   stage executed (`git init`, `git add -A` → 439 files staged, junk-free
   index). VCS Clean State (DoD 4) now met by volume; a commit/policy
   decision belongs to Drew at the next VCS pass.
6. **FOCUS SHIFT — RESOLVED (Drew, 2026-09-17):** **Lotus Adversity is the
   active MAIN** (The Wheel + codex = the development/testing lab for Game
   Dev, System Dev, AI research, and lore writing). **PROSIS → parked in
   `BROKEN/`** with Heaven's Nen (stale-test fix parked; was the previous
   system's focus and is now just a demo). **ES GURU** (play skill + vault
   knowledge base) doubles as **supporting research** for LAG worldbuilding
   — LAG is designed as a **WoW/OSRS/Morrowind "New Classic"**. Journeys
   Unto stays parked (feature-complete first room; polish + combat next).

## 5. Honors

- **Game Deep Dive** is enshrined as a future task —
  see `ED_FLOW/03_GAME_DEEP_DIVE.md`.
- **Active MAIN (FLOW 2.0):** `ACTIVE/MAIN/06_LOTUS_ADVERSITY_GAME` — The
  Wheel + codex. Everything else in the game districts is parked/dormant
  until a leaf or Drew's direction promotes it.