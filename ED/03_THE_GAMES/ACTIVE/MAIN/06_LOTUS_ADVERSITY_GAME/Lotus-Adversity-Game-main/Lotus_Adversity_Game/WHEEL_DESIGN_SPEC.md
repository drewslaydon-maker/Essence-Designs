# The Apparatus: Wheel of Adversity Design Specification

> Companion to [`VISUAL_DESIGN_MASTER.md`](../VISUAL_DESIGN_MASTER.md) (visual law) and [`AGENTS.md`](../AGENTS.md) (structural canon). The wheel's geometry is enforced by `src/lab/labChecks.ts`; this document is its human-readable twin.

## Overview
The Wheel of Adversity is the central physical artifact and progression engine of the game. It is not a flat UI menu; it is a tangible, interactable mechanism (like an astrolabe or codex dial) that the player meditates upon to unlock skills, manage their path, and observe the world's corruption.

## 1. Structural Anatomy (15 Spokes + 1 Hub)
The wheel consists of **4 Outer Quadrants**, **1 Inner Axis**, and the **Hub**. Quadrants begin with **Alden at True North** and advance clockwise by 30°:

- **Iron (North - Alden):** Spokes 12, 1, 2 (Stance, Bastion, Edge) @ 330°, 0°, 30°
- **Ether (East - Caelen):** Spokes 3, 4, 5 (Sorcery, Inscription, Alchemy) @ 60°, 90°, 120°
- **Frontier (South - Mera):** Spokes 6, 7, 8 (Trapping, Wayfinding, Forestry) @ 150°, 180°, 210°
- **Earth (West - Bram):** Spokes 9, 10, 11 (Masonry, Quarrying, Smithing) @ 240°, 270°, 300°
  *The cardinal defining mains are Spokes 1 (North), 4 (East), 7 (South), 10 (West).*
- **Axis (Center - Soran):** Spokes 13, 14, 15 (Breath, Vessel, Unarmored Stance) orbit the Hub.

### 1.1 Axis Seam-Guardian Decree
The Axis **guards the seams between dominions; it never rides an outer spoke's ray.** Sealed seating:

| Spoke | Angle | Seam | Reading |
|---|---|---|---|
| 13 Breath | 225° | between #8 Forestry and #9 Masonry | stillness at the habitation boundary |
| 14 Vessel | 345° | between #12 Stance and #1 Bastion | the composed cup flanked by poise and armor |
| 15 Unarmored | 105° | between #4 Inscription and #5 Alchemy | the naked blade inside the cold mind's workshop |

This matrix is enforced by `src/lab/labChecks.ts` (`innerSpokeMatrix` + `innerSeamAngles` gate) — the wheel view and `bun run lab:verify` both read the same invariant. Reverting the seating fails the gate.

## 2. Color Language & States
The rainbow palette (blue, orange, purple) is discarded in favor of the strict dialect in `VISUAL_DESIGN_MASTER.md`.

- **Locked / Unknown:** `neutral-800` (dark, dormant, ash-like).
- **Broken / Corrupted (default world state):** the consuming Ascendant's dominion hue keylines the spoke (`rose-500` violence, `emerald-500` sickly warped magic). The wedge bed stays near-black. This is the "Godman's Mark" state.
- **True / Restored:** each spoke fills with **its own spirit-color** (`Spoke.color`), never a single amber wash and never the consuming god's hue. Dominion colors keyline *structures* only. The cross-dominion chord lattice appears, showing the living web that corruption severed.

## 3. Physical Interaction
- **Touch & Mobile:** the SVG container MUST keep `touch-action: none` so the page does not scroll while dragging the astrolabe.
- The wheel is fully spinnable via drag; the mechanical settle damps it to rest from the true release angle.
- Text perfectly counter-rotates to remain legible.
- **Opposing gears:** the inner Axis mirrors the outer rotation (`innerRotation = -rotation`). Spinning the discipline ring rolls the soul the other way — the visual thesis of connection/disconnection. Inner numerals, sigils, Sunyata veins, and the inner anchors of the chord lattice all counter-rotate; outer↔inner chords visibly strain.
- Clicking any spoke, dominion, or the Hub summons an absolute-positioned glassmorphic overlay **in-place** over the wheel (the "Big Tooltip"). Never a side column.

## 4. Immutable SVG Math
- Agents are STRICTLY FORBIDDEN from arbitrarily modifying the geometry. Any SVG alteration must explicitly account for exactly **15 nodes** (12 outer + 3 inner) plus the Hub.
- Geometry is read ONLY from `labChecks` exports (`outerSpokeMatrix`, `innerSpokeMatrix`, `cardinalMainNumbers`, `innerSeamAngles`). Inlining a parallel matrix is forbidden — it drifts from the sealed truth and trips the gates.
- Radii ladder (reference): HUB 60 · Sunyata in/out 72/180 · spoke ring 184/274 · outer numerals 212 · inner numerals 126 · dominion ring 258 · rim 282.
