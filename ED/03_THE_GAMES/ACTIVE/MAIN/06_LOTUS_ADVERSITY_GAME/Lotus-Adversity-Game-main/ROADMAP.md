# The Apparatus: Development Roadmap

This document serves as the "Orbiting Truth" of development for The Broken RingWheel / Warped Pantheon application. It tracks past achievements, current focus, and future technical or design milestones. **It lives at the repository root** — the app never reads it; humans and agents do.

**Agent Directive:** Read this document to understand the project's current context. Update this document upon completing major milestones, or when the user introduces new long-term ideas that should spur future development. Only mark a milestone *Verified* when an exit code proves it (`bun run lint`, `bun run lab:verify`).

---

## 🟢 What We've Worked On (Completed Milestones)

- **Heraldry Tab + Discipline Glyph Locking (BUILT, gates green, reviewed — no notes, 2026-09-19 walk):** Unified **Heraldry** tab delivers all three symbol families (Divine · Discipline · Armor) plus a live One-Heraldry-One-Primitive audit surface. The fixed `svgShapeType` switch is dead — replaced by the glyph registry (`src/symbols/glyphKeys.ts` closed 27-key set → `glyphRegistry.tsx` `renderGlyph`). All **15 discipline glyphs** authored; the `trapezoid`/`circle`/`wedge`/`horned-calyx`/`lotus` collision groups purified so **`KNOWN_COLLISIONS` is empty**. Wheel stamping law live in `RingWheel.tsx`: **True Form → the spoke's own discipline glyph; Broken Form → the consuming Ascendant's corrupted Godman's Mark.** `bun run lint` clean, `bun run lab:verify` AIRSEALED (52 forms / 20 heraldic identities, zero collisions), `bun run build` clean.
- **The Apparatus v2 Rebuild Completed (VERIFIED):** Fresh client — slim store, 6-surface shell, refined interactive `RingWheel` (labChecks geometry source), in-place dossier overlays, Git sync + single ZIP export, consolidated Chamber (Pipeline · Sealing Gates · Covenants). Verified via `bun run lint`, `bun run lab:verify`, `bun run build`. **Architect execution review PASSED (2026-09-19 native Wheel walk, no notes).**
- **RingWheel Perfection Pass (built, reviewed — no notes, 2026-09-19 walk):** Drag-settle bug fixed via `rotationRef` (wheel no longer "sticks" back to North); True Form now renders each spoke's own spirit-color with a cross-dominion chord lattice (connected `spokesData` web); every spoke carries its Ascendant's sigil (`PantheonSymbolSvg` — True Heraldry in True Form, Corrupted Mark when broken); the 5-Ascendants index uses real per-god sigils instead of generic diamonds.
- **Axis Seam-Guardian Decree (SEALED):** Architect ruled Soran's inner trio (13/14/15) must never ride an outer spoke's ray. `innerSpokeMatrix` reseated to 225/345/105 (seams between 8-Forestry/9-Masonry, 12-Stance/1-Bastion, 4-Inscription/5-Alchemy), each ray extending an outer partition seam. Enforced by `innerSeamAngles` in `labChecks.ts` + a new geometry gate — reverting the seating now fails `bun run lab:verify`.
- **RingWheel Opposing Gears (built, reviewed — no notes, 2026-09-19 walk):** The inner Axis now **counter-rotates against the outer discipline ring** (`innerRotation = -rotation`). Inner numerals, sigils, Sunyata veins, and the inner anchors of the true-form chord lattice all mirror; outer↔inner soul-connections visibly strain. Sells connection/disconnection in one motion.
- **Visual Design Master Doc + Heraldry Airseal Gate (SEALED):** Root `VISUAL_DESIGN_MASTER.md` inscribed (palette, typography, shape vocabulary, One-Form-One-Primitive Rule, registry + collision ledger). New `heraldryGate()` in `labChecks.ts` computes cross-entity primitive collisions and fails on any *new* one; the ledger of 5 known collisions may only shrink. `WHEEL_DESIGN_SPEC.md` refreshed (seam angles, counter-rotation, dead Engine-Sandbox refs removed).
- **Truth Freeze (VERIFIED):** Forever Flower `status` union (`RATIFIED`/`INVALIDATED`) + `revocationNote`; FLOWER 08 INVALIDATED; dead combat/alpha types and `engineStore.ts` pruned; ROADMAP rewrite.
- **Engine State Centralization:** Migrated state management from fragmented prop-drilling in `App.tsx` to a global Zustand store.
- **Data Hydration Lockdown:** Immutable lore now hydrates purely from static data files (no volatile storage caching).
- **Architectural Rules (AGENTS.md):** Formalized the Git "Truth Holder" workflow, 15-Spoke geometric law, and the strict Forever Flowers creation protocol.
- **Wheel Physics & Touch Controls:** `touch-action: none` on the wheel SVG solved mobile scroll-vs-drag conflicts.
- **Alden North Matrix Canonical Geometry:** Alden anchored at True North (#1 defining), flanked by #12 and #2, propagating clockwise; Axis spokes 13/14/15 inner. Single source of truth lives in `src/lab/labChecks.ts`.
- **Executable Airseal Gates (`bun run lab:verify`):** Census, numeric 1–15 integrity, Alden-North geometry, canonical SpokeId registry, and spoke data completeness gates + in-browser runner. Data-level invariants remain green. Label as **VERIFIED** (lint + lab both exit clean).
- **Phase 0.5 Lab Sealing Ratified (v1.0) — SUBSEQUENTLY REVOKED:** The Ratification Chamber and Forever Flower 08 were sealed — but the client they sealed did not hold under Architect execution (see below). The gate remains; the claim was revoked.
- **Codex Strip (WHEEL-CODEX-001):** server.ts (Gemini/git/zip backend), ChamberView, GitSyncModal, Heraldry audit surface, and Google Fonts CDN removed. App is now fully static (5 surfaces: Pantheon · Spokes · Heraldry · Codex · Pillars) with local fonts. Gates green post-strip; Architect walk passed (2026-09-19, no notes).
- **Truth Pass (WHEEL-TRUTH-001):** AGENTS.md Part 2, app README, `run.command`/`start.sh`, and the `clean` script corrected to post-strip ground truth — static Vite artifact (5 surfaces), local fonts, no server, no Gemini. Gates green post-pass; Architect walk passed (2026-09-19, no notes); Electron packaging executed (WHEEL-NATIVE-001).
- **Native Wrapper (WHEEL-NATIVE-001):** Electron wrapper (`electron/main.cjs` + `bun run native`) opens the static build as a native desktop window — golden Wheel icon (wheel.ico), no backend, no browser tab, no network fonts. Vite `base: './'` added so the file:// asset load resolves. Gates green post-wrap; Architect walk PASSED (2026-09-19, no notes — "the best version it has ever been").
- **Flower 08 Re-ratified (FLOWER-08-RERATIFICATION-001):** FLOWER 08 — The Self-Proving Gate — restored to RATIFIED after the Apparatus v2 fresh client survived execution: the native Wheel (WHEEL-NATIVE-001) passed the Architect walk with no notes and all canon gates green (lint exit 0, lab:verify 6/6, build exit 0). Covenant data flipped schema-exact; the revocation-note records the 2026-09-20 re-ratification decree. Shadow Seal Gate reserved as its own later leaf.

---

## 🟡 What We're Working On Now (Current Focus)

- **THE APPARATUS v2 — FRESH CLIENT REBUILD (rebuilt, Architect execution review PASSED — no notes):**
  - **Decree:** Architect inspection ruled the v1 client unfit. The interactive wheel renderer, the four-tier redundant navigation, and the scaffold of duplicated governance surfaces were "old design that is no longer part of what we need or want." Scraping-and-reordering the legacy client was rejected — **the view layer is razed and rebuilt fresh**.
  - **Immutable canon preserved untouched:** `src/data/*` (pantheon, armor symbols, chronicles, spokes/pillars, flowers), `src/types.ts` (pruned of dead combat types), `src/lab/labChecks.ts`, `verify-lab.ts`. (The old `server.ts` Gemini/git/zip backend was stripped by WHEEL-CODEX-001 — no longer present.) The ring wheel survives as a **refined interactive centerpiece**, and its geometry reads ONLY from `labChecks` — never an inline matrix.
  - **Surfaces in v2 (ALL BUILT):** Pantheon (5 Ascendants + hub) · 15-Spoke Matrix · Heraldry (Divine · Discipline · Armor families + live audit) · Story Codex · Pillars Doctrine. No standalone Armor Symbols tab — that family lives inside Heraldry; nav is 5 tabs (post-strip: Chamber/Git-sync surfaces removed by WHEEL-CODEX-001). Engine Sandbox, Combat/Frameworks labs (shelved), Share dock, AGENTS drawer, and all duplicate views are deleted.
  - **Wheel readiness:** drag-settle bug fixed, True-Form individuality + sigils + chord lattice live, Axis seated at the dominion seams (225/345/105, airseal-enforced). The centerpiece is now the strongest it has ever been — the candidate fundamental artifact for the leveling mechanic.
  - **Status:** `bun run lint` green, `bun run lab:verify` AIRSEALED, `bun run build` clean. **Architect's execution review DONE** (native Wheel walk 2026-09-19, no notes); **FLOWER 08 re-ratified** (2026-09-20, FLOWER-08-RERATIFICATION-001).
  - **FLOWER 08 RATIFIED:** `foreverFlowersData.ts` carries a strict `status` union (`RATIFIED`/`INVALIDATED`). Flowers 01–08 are ratified; **Flower 08 was restored to `RATIFIED` on 2026-09-20** (FLOWER-08-RERATIFICATION-001) after the v2 client passed Architect inspection with green `lint`/`lab:verify` — the Self-Proving Gate sealed again.
  - **Phase 0.5 status is UNSEALED** until v2 is verified and re-ratified by Architect decree. Phase 1 (combat) remains shelved.

---

## ⏸️ What Is Paused (Blocked Pending Architect Command)

- **PHASE 1: Tactical Core & Combat Engine:**
  - Combat slice prototyping is frozen/shelved. No downstream combat refinements or gameplay expansion occurs until the Architect explicitly resumes Phase 1. This was true under the seal and remains true after its revocation.

---

## 🔴 What We Will Work On Next (Future Work)

- **Wheel Readability Pass — FUTURE (Drew's notes, 2026-09-20):** The environment is live now (native window + dev server), so the wheel itself can be iterated in place. Planned repass:
  - **Numerals north-locked:** numbers currently rotate with the ring — make them stay upright (locked to North) so they read clearly at any rotation.
  - **Broken-Form icons north-locked:** they currently rotate with the numbers; should be locked upright with them.
  - **True-Form icons north-locked:** same treatment as the broken forms.
  - **Icon legibility repass:** icons are hard to read — repass the icon set/craft for clarity at a glance.
  - **Wheel code repass:** revisit how the wheel itself is coded while we can work with it live.
  - **Lore is LOCKED:** lore is good and will not be touched until the Architect calls for it.
- *Pending direction from the Architect regarding gameplay/lore enhancements or new Pantheon functionality.*
- **To Be Determined:** Await user directives on the next core feature and log them here as they are discussed.