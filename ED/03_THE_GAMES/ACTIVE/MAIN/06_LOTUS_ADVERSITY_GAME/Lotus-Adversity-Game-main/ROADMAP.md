# The Apparatus: Development Roadmap

This document serves as the "Orbiting Truth" of development for The Broken RingWheel / Warped Pantheon application. It tracks past achievements, current focus, and future technical or design milestones. **It lives at the repository root** — the app never reads it; humans and agents do.

**Agent Directive:** Read this document to understand the project's current context. Update this document upon completing major milestones, or when the user introduces new long-term ideas that should spur future development. Only mark a milestone *Verified* when an exit code proves it (`bun run lint`, `bun run lab:verify`).

---

## 🟢 What We've Worked On (Completed Milestones)

- **Heraldry Tab + Discipline Glyph Locking (BUILT, gates green, under Architect review):** Unified **Heraldry** tab delivers all three symbol families (Divine · Discipline · Armor) plus a live One-Heraldry-One-Primitive audit surface. The fixed `svgShapeType` switch is dead — replaced by the glyph registry (`src/symbols/glyphKeys.ts` closed 27-key set → `glyphRegistry.tsx` `renderGlyph`). All **15 discipline glyphs** authored; the `trapezoid`/`circle`/`wedge`/`horned-calyx`/`lotus` collision groups purified so **`KNOWN_COLLISIONS` is empty**. Wheel stamping law live in `RingWheel.tsx`: **True Form → the spoke's own discipline glyph; Broken Form → the consuming Ascendant's corrupted Godman's Mark.** `bun run lint` clean, `bun run lab:verify` AIRSEALED (52 forms / 20 heraldic identities, zero collisions), `bun run build` clean.
- **The Apparatus v2 Rebuild Completed (VERIFIED):** Fresh client — slim store, 6-surface shell, refined interactive `RingWheel` (labChecks geometry source), in-place dossier overlays, Git sync + single ZIP export, consolidated Chamber (Pipeline · Sealing Gates · Covenants). Verified via `bun run lint`, `bun run lab:verify`, `bun run build`. **Awaiting Architect execution review.**
- **RingWheel Perfection Pass (built, under Architect review):** Drag-settle bug fixed via `rotationRef` (wheel no longer "sticks" back to North); True Form now renders each spoke's own spirit-color with a cross-dominion chord lattice (connected `spokesData` web); every spoke carries its Ascendant's sigil (`PantheonSymbolSvg` — True Heraldry in True Form, Corrupted Mark when broken); the 5-Ascendants index uses real per-god sigils instead of generic diamonds.
- **Axis Seam-Guardian Decree (SEALED):** Architect ruled Soran's inner trio (13/14/15) must never ride an outer spoke's ray. `innerSpokeMatrix` reseated to 225/345/105 (seams between 8-Forestry/9-Masonry, 12-Stance/1-Bastion, 4-Inscription/5-Alchemy), each ray extending an outer partition seam. Enforced by `innerSeamAngles` in `labChecks.ts` + a new geometry gate — reverting the seating now fails `bun run lab:verify`.
- **RingWheel Opposing Gears (built, under Architect review):** The inner Axis now **counter-rotates against the outer discipline ring** (`innerRotation = -rotation`). Inner numerals, sigils, Sunyata veins, and the inner anchors of the true-form chord lattice all mirror; outer↔inner soul-connections visibly strain. Sells connection/disconnection in one motion.
- **Visual Design Master Doc + Heraldry Airseal Gate (SEALED):** Root `VISUAL_DESIGN_MASTER.md` inscribed (palette, typography, shape vocabulary, One-Form-One-Primitive Rule, registry + collision ledger). New `heraldryGate()` in `labChecks.ts` computes cross-entity primitive collisions and fails on any *new* one; the ledger of 5 known collisions may only shrink. `WHEEL_DESIGN_SPEC.md` refreshed (seam angles, counter-rotation, dead Engine-Sandbox refs removed).
- **Truth Freeze (VERIFIED):** Forever Flower `status` union (`RATIFIED`/`INVALIDATED`) + `revocationNote`; FLOWER 08 INVALIDATED; dead combat/alpha types and `engineStore.ts` pruned; ROADMAP rewrite.
- **Engine State Centralization:** Migrated state management from fragmented prop-drilling in `App.tsx` to a global Zustand store.
- **Data Hydration Lockdown:** Immutable lore now hydrates purely from static data files (no volatile storage caching).
- **Architectural Rules (AGENTS.md):** Formalized the Git "Truth Holder" workflow, 15-Spoke geometric law, and the strict Forever Flowers creation protocol.
- **Wheel Physics & Touch Controls:** `touch-action: none` on the wheel SVG solved mobile scroll-vs-drag conflicts.
- **Alden North Matrix Canonical Geometry:** Alden anchored at True North (#1 defining), flanked by #12 and #2, propagating clockwise; Axis spokes 13/14/15 inner. Single source of truth lives in `src/lab/labChecks.ts`.
- **Executable Airseal Gates (`bun run lab:verify`):** Census, numeric 1–15 integrity, Alden-North geometry, canonical SpokeId registry, and spoke data completeness gates + in-browser runner. Data-level invariants remain green. Label as **VERIFIED** (lint + lab both exit clean).
- **Phase 0.5 Lab Sealing Ratified (v1.0) — SUBSEQUENTLY REVOKED:** The Ratification Chamber and Forever Flower 08 were sealed — but the client they sealed did not hold under Architect execution (see below). The gate remains; the claim was revoked.

---

## 🟡 What We're Working On Now (Current Focus)

- **THE APPARATUS v2 — FRESH CLIENT REBUILD (rebuilt, awaiting Architect execution review):**
  - **Decree:** Architect inspection ruled the v1 client unfit. The interactive wheel renderer, the four-tier redundant navigation, and the scaffold of duplicated governance surfaces were "old design that is no longer part of what we need or want." Scraping-and-reordering the legacy client was rejected — **the view layer is razed and rebuilt fresh**.
  - **Immutable canon preserved untouched:** `server.ts` (Gemini proxy, git-sync, zip export, health), `src/data/*` (pantheon, armor symbols, chronicles, spokes/pillars, flowers), `src/types.ts` (pruned of dead combat types), `src/lab/labChecks.ts`, `verify-lab.ts`. The ring wheel survives as a **refined interactive centerpiece**, and its geometry reads ONLY from `labChecks` — never an inline matrix.
  - **Surfaces in v2 (ALL BUILT):** Pantheon (5 Ascendants + hub) · 15-Spoke Matrix · Heraldry (Divine · Discipline · Armor families + live audit) · Story Codex · Pillars Doctrine · Consolidated Chamber (Ratification gates + Covenants + Pipeline + single Git modal). No standalone Armor Symbols tab — that family lives inside Heraldry; nav is 6 tabs. Engine Sandbox, Combat/Frameworks labs (shelved), Share dock, AGENTS drawer, and all duplicate views are deleted.
  - **Wheel readiness:** drag-settle bug fixed, True-Form individuality + sigils + chord lattice live, Axis seated at the dominion seams (225/345/105, airseal-enforced). The centerpiece is now the strongest it has ever been — the candidate fundamental artifact for the leveling mechanic.
  - **Status:** `bun run lint` green, `bun run lab:verify` AIRSEALED, `bun run build` clean. The final verification step is the **Architect's execution review** — run `bun run dev`, walk the six surfaces, then decide re-ratification.
  - **FLOWER 08 INVALIDATED:** `foreverFlowersData.ts` carries a strict `status` union (`RATIFIED`/`INVALIDATED`). Flowers 01–07 remain ratified; **Flower 08 is revoked with note** pending re-ratification once v2 passes Architect inspection + green `lint`/`lab:verify`.
  - **Phase 0.5 status is UNSEALED** until v2 is verified and re-ratified by Architect decree. Phase 1 (combat) remains shelved.

---

## ⏸️ What Is Paused (Blocked Pending Architect Command)

- **PHASE 1: Tactical Core & Combat Engine:**
  - Combat slice prototyping is frozen/shelved. No downstream combat refinements or gameplay expansion occurs until the Architect explicitly resumes Phase 1. This was true under the seal and remains true after its revocation.

---

## 🔴 What We Will Work On Next (Future Work)

- **Re-ratification of FLOWER 08 (or a successor covenant):** Once the v2 client passes Architect review with `bun run lint` + `bun run lab:verify` green, propose re-ratification via the strict Forever Flower protocol. A rebuild that survives execution is the only path back to a sealed claim.
- *Pending direction from the Architect regarding gameplay/lore enhancements or new Pantheon functionality.*
- **To Be Determined:** Await user directives on the next core feature and log them here as they are discussed.