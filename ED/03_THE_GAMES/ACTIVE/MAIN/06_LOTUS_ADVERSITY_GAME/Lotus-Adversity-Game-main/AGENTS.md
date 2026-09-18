# The Apparatus — Agent Instructions

Rules for agents working in the `Lotus-Adversity-Game` repository. Part 1 is hardened design doctrine (Architect covenants — violating them is a regression). Part 2 is the verified developer reference.

---

# Part 1 — Design Doctrine

## 0. Git is the Absolute Truth Holder
- Never rely on AI Studio Share/Export for versioning. Push meaningful progression to the GitHub repository; the repo is the sole truth (prevents agent fragmentation).
- **Read the root `ROADMAP.md` before any work.** It is the developmental focus tracker and the only canonical copy — never nest a duplicate inside the app. Don't force the Architect to restate plans already logged there.

## 1. Single-Context Focus
- **No side-by-side deep-inspection columns** (diagram on one side, dossier on the other — or stacked on mobile).
- Detailed dossiers (spoke, god, symbol) MUST render as **absolute-positioned, backdrop-blurred overlays floating in-place over the interactive node** (inside a relative container) — the "Big Tooltip". Focus stays where the user clicked.

## 2. Structural Canon: The 15-Spoke Matrix
- The Wheel of Adversity ALWAYS has exactly **15 Spokes + 1 Center Hub (Soran)**. Do not resize, shrink to 12 spokes, or add outer rings. Geometry is locked by executable gates (Part 2).

## 3. Esoteric "Dark" Visual Identity
- **Palette:** `neutral-950` beds; `amber-500` True/Uncorrupted; `rose-500`/`emerald-500` Corrupted Imperial. Dominion colors keyline *structures* only — never fill a True spoke with a single amber or the consuming god's hue.
- **Typography:** `font-cinzel` for titles/ascendant names/headers; `font-mono` for metadata, numerals, systemic tags (`Spoke #4`, `Iron Dominion`); `font-medieval` for in-world scripture. Uppercase labels carry `tracking-widest`.
- **Glassmorphism:** overlays use `backdrop-blur-sm`, `bg-neutral-900/80`, one `blur-3xl` radial orb keyed to the entity's accent.
- **The detailed visual law is the root `VISUAL_DESIGN_MASTER.md`** — palette law, shape vocabulary, the One-Heraldry-One-Primitive Rule, collision ledger. It outranks any component's styling. `Lotus_Adversity_Game/WHEEL_DESIGN_SPEC.md` is its wheel-geometry twin. Consult both before visual or geometry work.

## 4. Interaction & Sound
- Every interaction must fire `useAppStore().playSfx(type)` — `click`, `shield`, `anvil`, or `scribe`. Silence is a bug.

## 5. Forever Flowers Protocol
- Flowers are high-prestige covenants between Architect and Agent — not trivial achievements. Never create one via casual generation; a new Flower requires a hard-won canon lesson or a sealed systemic vulnerability, a strict Category, and exact schema compliance (no string-matching hacks).
- `foreverFlowersData.ts` enforces a strict `status` union (`RATIFIED` / `INVALIDATED`) plus `revocationNote`. New "safe" statuses must not be invented.

## 6. Anti-Slop (No Generic AI UI)
- No purple→blue gradients, no generic SaaS cards, no B2B-dashboard chrome. Containers must read as a dark-fantasy codex with meticulous spacing.

---

# Part 2 — Developer Reference

## Dev Commands

All commands run from the app directory `Lotus_Adversity_Game/` (the git repo root only holds docs/scripts).

| Command | What it does |
|---------|-------------|
| `bun install` | Install dependencies (npm also works) |
| `bun run dev` | Dev server — `tsx server.ts` on port 3000 (Express + Vite middleware) |
| `bun run build` | Production build — `vite build` + esbuild bundle → `dist/server.cjs` |
| `bun run start` | Run production — `node dist/server.cjs` |
| `bun run lint` | Type-check only — `tsc --noEmit` (no ESLint/Prettier configured) |
| `bun run lab:verify` | Executable Canon gates — `tsx verify-lab.ts`; exits non-zero on failure |
| `bun run clean` | Remove `dist/` and `server.js` |

**No test suite exists.** No runner, no test files.

Root `run.command` / `start.sh` are just convenience launchers for `bun run dev` — not part of the build.

## Project Layout

```
Lotus-Adversity-Game/                 ← Git repo root
├── ROADMAP.md                        ← THE sprint tracker — READ FIRST (canonical, no copies)
├── AGENTS.md                         ← This file
├── VISUAL_DESIGN_MASTER.md           ← Root: visual law (palette, primitives, One-Heraldry-One-Primitive)
└── Lotus_Adversity_Game/             ← The app (nested, not at root)
    ├── server.ts                     ← Express backend (Gemini proxy, git-sync, zip export)
    ├── WHEEL_DESIGN_SPEC.md          ← Wheel anatomy + interaction math (geometry twin)
    ├── src/
    │   ├── App.tsx                   ← Root: 6-tab nav via activeTab (NO router)
    │   ├── index.css                 ← Tailwind v4 import + font utilities + CRT overlay
    │   ├── types.ts                  ← Shared TS interfaces (SymbolForm carries glyph: GlyphKey)
    │   ├── store/useAppStore.ts      ← THE ONLY store: activeTab, crtEnabled, sound, playSfx
    │   ├── symbols/                  ← Glyph system (see constraints)
    │   │   ├── glyphKeys.ts          ← Closed key set (27 primitives) — single source of truth
    │   │   └── glyphRegistry.tsx     ← renderGlyph(key, {stroke, corrupted}) — all motifs
    │   ├── data/                     ← Immutable canonical lore
    │   │   ├── spokesAndPillarsData.ts  (spokes + pillars + phase dossiers)
    │   │   ├── warpedPantheonData.ts · armorSymbolsData.ts · loreChroniclesData.ts
    │   │   ├── spokeSymbolsData.ts      (15 discipline true/corrupted forms)
    │   │   └── foreverFlowersData.ts    (RATIFIED/INVALIDATED union)
    │   ├── lab/labChecks.ts          ← SINGLE canonical wheel matrices + executable airseal gates
    │   └── components/               ← Pantheon, Spokes, Heraldry, Codex, Pillars, Chamber +
    │                                  GitSyncModal, RingWheel, Header, PantheonSymbolGlyph
    ├── verify-lab.ts                 ← CLI gate (`bun run lab:verify`)
    └── repo_temp/                    ← Stale duplicate — ignore entirely
```

## Key Technical Constraints

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (NOT PostCSS). Config lives in `vite.config.ts`.
- **Path alias** `@/*` maps to the app root (`Lotus_Adversity_Game/`). Use `@/...` imports, not relative `../...` (except inside single components that already use relative imports consistently).
- **`DISABLE_HMR=true`** disables HMR + file watching (used in AI Studio to stop flicker during agent edits).
- **One Zustand store:** `useAppStore` — `activeTab`, `crtEnabled`, `soundEnabled`, `playSfx`. There is no `engineStore` and no combat/engine state (deleted during the v2 rebuild).
- **`RingWheel.tsx`** is the wheel centerpiece (largest component): SVG generation, drag-to-spin, counter-rotating inner Axis (`innerRotation = -rotation`), in-place dossier overlays. Its geometry reads ONLY from `labChecks` exports (`outerSpokeMatrix`, `innerSpokeMatrix`, `cardinalMainNumbers`, `innerSeamAngles`, `statusIdMap`) — NEVER inline a parallel matrix or the gates drift from rendered truth.
- **Glyph system:** a symbol's motif is a `glyph: GlyphKey` from `src/symbols/glyphKeys.ts`, rendered via `renderGlyph` from `glyphRegistry.tsx`. `PantheonSymbolGlyph` only adds the alignment ring + glow. Never draw a bespoke inline path where a registered glyph exists, and never add an unregistered key to data (the Heraldry gate fails).
- **`labChecks.ts`** is the single executable truth, run by BOTH `bun run lab:verify` AND the in-browser Chamber "Sealing Gates" tab. Gates: census (15), numeric (1–15 unique), geometry (Alden-North + Axis seam seats), ids (canonical SpokeId registry), data (inputs/outputs/milestones/dual-form lore), and **heraldry** (One-Heraldry-One-Primitive; the empty `KNOWN_COLLISIONS` ledger may only shrink).
- **Verification protocol:** after any code change run `bun run lint` then `bun run lab:verify`. Both green is the only currency for a *Verified* milestone (see Flower 08).
- **Gemini:** key from `.env` via dotenv — **not** `.env.local` (the AI Studio `README.md` is stale boilerplate). Placeholder `MY_GEMINI_API_KEY` counts as missing; the server falls back to procedural generators, so never assume Gemini. Models: `gemini-3.8-flash` with `gemini-3.1-flash-lite` fallback. Endpoints: `/api/health`, `/api/git-status`, `/api/git-sync` (PAT push), `/api/export-project-zip`, and `/api/gemini/*` (inscribe-god, inscribe-armor-symbol, generate-lore, oracle).
- **SFX** is synthesized with Web Audio oscillators (no audio files): `anvil`, `shield`, `scribe`, `click`.
- **Custom fonts** load via Google Fonts in `index.html`; utilities exposed in `index.css` (`font-cinzel`, `font-medieval`, `font-pixel`).

## Lore & Geometry Quick Reference

- **5 Dominions:** Iron (Alden) · Ether (Caelen) · Frontier (Mera) · Earth (Bram) · Axis (Soran)
- **Outer quadrants** (Alden at True North, clockwise, defining mains 1-4-7-10):
  - Iron (N): Spokes 12, 1, 2 @ 330°, 0°, 30°
  - Ether (E): Spokes 3, 4, 5 @ 60°, 90°, 120°
  - Frontier (S): Spokes 6, 7, 8 @ 150°, 180°, 210°
  - Earth (W): Spokes 9, 10, 11 @ 240°, 270°, 300°
- **Axis seam-guardian seats** (never an outer spoke's ray — airseal-enforced):
  - 13 Breath @ 225° (8/9 seam) · 14 Vessel @ 345° (12/1 seam) · 15 Unarmored @ 105° (4/5 seam)
- **Every symbol has two forms:** True/Healthy (`amber-500` or the spoke's own `color`) and Corrupted Imperial (`rose-500`/`emerald-500`). Never render only one.
- **Phase status:** Phase 0.5 stands **UNSEALED** and **FLOWER 08 is REVOKED** (`INVALIDATED` in `foreverFlowersData.ts`) pending re-ratification of the v2 rebuild. Phase 1 (combat) remains paused — never assume gameplay/combat is active.