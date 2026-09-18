# The Apparatus: Visual Design Master Doc

> **Status:** Canonical. This document is the human-readable truth of the visual language of *The Apparatus* / *Adversity*. It supersedes ad-hoc or agent-invented styling. Where this document and the code disagree, the code is wrong until this document is amended by Architect decree.
>
> **Companions:**
> - `AGENTS.md` — system architecture + structural constraints (the 15-Spoke law, Forever Flowers, anti-slop).
> - `WHEEL_DESIGN_SPEC.md` — the wheel's physical anatomy and interaction math.
> - `src/lab/labChecks.ts` — the **executable** half of this document. The Heraldry gate enforces the One-Heraldry-One-Primitive Rule at build time. A rule not encoded there is a suggestion; a rule encoded there is law.

---

## 0. Precedence & Enforcement

1. Structural canon (`AGENTS.md`) outranks this document.
2. This document outranks any single component's styling choices.
3. The **Heraldry gate** (`bun run lab:verify`) is the machine enforcement of §4. It fails the build on any new primitive collision and forces the ledger (§6) to shrink as forms are purified. No visual milestone may mark *Verified* without it green.

---

## 1. Palette Law

The rainbow palette (stock blue/orange/purple) is **forbidden**. The dialect is esoteric dark mode.

| Role | Token | Use |
|---|---|---|
| Ground | `neutral-950` / `#0a0a0c` | App and panel beds |
| True / Uncorrupted | `amber-500` `#f59e0b` | Affirmed state, doctrine, forged gold |
| Corrupted / Imperial | `rose-500` `#e11d48` / `emerald-500` | Warped state, sickly magic |
| Dominion frames | Iron `#f59e0b` · Ether `#38bdf8` · Frontier `#10b981` · Earth `#fb923c` · Axis `#a855f7` | Dominion keylines only |
| **Spoke spirit-colors** | Per-spoke `Spoke.color` | **True Form only** — the ancient individuality of each discipline |

**Law:** Dominion colors keyline *structures*; a spoke's own `color` is the only thing permitted to fill its wedge in True Form. Never fill the True wheel with a single amber or with the consuming god's dominion hue — that erases individuality and is the exact failure the True Form rebuild corrected.

**Forbidden:** purple→blue SaaS gradients; generic card shadows; neon glow on non-interactive chrome; rainbow badge soup.

---

## 2. Typography Law

- `font-cinzel` (serif) — titles, ascendant names, divine decrees, prominent headers. The grimoire voice.
- `font-mono` — metadata, numerals, weights, mechanical/systemic tags (`Spoke #4`, `Iron Dominion`, phase names).
- `font-medieval` — in-world scripture, incantations, decrees.
- Uppercase labels carry `tracking-widest`. Weight and spacing are the hierarchy — not size alone.

---

## 3. Shape Vocabulary (the primitives)

The registry is **27 primitives**, defined once in `src/symbols/glyphKeys.ts` (`GLYPH_KEYS`) and rendered once in `src/symbols/glyphRegistry.tsx` (`renderGlyph(key, { stroke, corrupted })`). `PantheonSymbolGlyph` is a thin wrapper. A `SymbolForm` carries `glyph: GlyphKey` — never a bespoke inline path.

| Group | Primitives |
|---|---|
| Divine / Armor | `trapezoid`, `horned-calyx`, `diamond`, `crescents`, `diadem`, `circle`, `sextant`, `antler`, `caliper`, `chisel`, `wedge`, `lotus` |
| Discipline | `bulwark`, `blade`, `tripod`, `spiral`, `quill`, `alembic`, `snare`, `compass`, `bough`, `keystone`, `pick`, `hammer`, `bellows`, `chalice`, `footprint` |

Each key has a **reserved semantic**; reusing one across two different *heraldic identities* is a collision (§4).

### 3.1 Discipline Vocabulary (authored)

Every spoke now owns a unique discipline motif. The true form is the mortal craft; the corrupted form is the Ascendant's consumption of it:

| # | Discipline | True motif | Corrupted mutation |
|---|---|---|---|
| 1 | Bastion | `bulwark` | Rusted Bulwark |
| 2 | Edge | `blade` | Serrated Fang |
| 3 | Sorcery | `spiral` | Stasis Coil |
| 4 | Inscription | `quill` | Erasure Grid |
| 5 | Alchemy | `alembic` | Slag Retort |
| 6 | Trapping | `snare` | Gilded Cage |
| 7 | Wayfinding | `compass` | Compass Snare |
| 8 | Forestry | `bough` | Clear-Cut |
| 9 | Masonry | `keystone` | Crumbled Keystone |
| 10 | Quarrying | `pick` | Strip-Mine |
| 11 | Smithing | `hammer` | Drop-Hammer |
| 12 | Stance | `tripod` | Broken Pivot |
| 13 | Breath | `bellows` | Vacuum |
| 14 | Vessel | `chalice` | Petrified Tear |
| 15 | Unarmored | `footprint` | Iron Skin |

---

## 4. The One-Heraldry-One-Primitive Rule

> **One heraldic identity, one primitive. A primitive may echo only within a single identity; two different identities must never share.**

- A **heraldic identity** is one patron's body of work:
  - `divine:<dominion>` — a god and that patron's armor relics share an identity (the relic is an *echo* of its god, e.g. Alden's grounded mass across his envoy and his mark).
  - `disc:<spokeId>` — each of the 15 spoke disciplines is its own identity and must be globally unique.
- True and Corrupted forms of the *same* entity share an identity and therefore do **not** count as a collision.
- Every `SymbolForm.glyph` must be a registered key in `GLYPH_KEY_SET`.
- The gate (`src/lab/labChecks.ts` → `heraldryGate`) groups every form by identity and flags any glyph spanning more than one group, then compares to the ledger. The ledger may **only shrink**.

This rule exists because the original symbols were authored on a weaker stack and produced byte-identical glyphs across unrelated gods. **Heraldic echoes are canon** (a patron's relics echo the patron); **cross-patron sameness is corruption.**

---

## 5. Families

| Family | Source | Count today | Count target |
|---|---|---|---|
| **Divine** (Ascendant) | `warpedPantheonData.ts` | 5 entities / 10 forms | 5 / 10 |
| **Discipline** (Spoke) | `spokeSymbolsData.ts` | 15 entities / 30 forms | 15 / 30 |
| **Armor** | `armorSymbolsData.ts` | 6 entities / 12 forms | 6 / 12 |

Every symbol has **two forms** — True / Healthy and Corrupted Imperial. Rendering only one is forbidden (`AGENTS.md`).

---

## 6. Registry & Collision Ledger

### Registry (current — 27 primitives, 52 forms, 20 identities)

**Divine** (`divine:<dominion>`, echoes with that patron's Armor relics)

| Entity | True primitive | Corrupted primitive |
|---|---|---|
| alden-iron-dominion | `trapezoid` | `horned-calyx` |
| caelen-ether-dominion | `circle` | `sextant` |
| mera-frontier-dominion | `antler` | `caliper` |
| bram-earth-dominion | `chisel` | `wedge` |
| soran-axis-center | `lotus` | `lotus` |

**Armor** (shares its patron's `divine:<dominion>` identity — echoes allowed)

| Entity | True primitive | Corrupted primitive |
|---|---|---|
| alden-heavy-envoy | `trapezoid` | `trapezoid` |
| alden-medium-sheathed-verge | `diamond` | `diamond` |
| alden-light-severed-scabbard | `crescents` | `crescents` |
| alden-ascended-horned-calyx | `diadem` | `horned-calyx` |
| soran-zero-pierced-lotus | `lotus` | `lotus` |
| bram-heavy-crucible-wedge | `wedge` | `wedge` |

**Discipline** (one unique `disc:<spokeId>` identity each — see §3.1 for motifs)

| Spoke | Entity | True primitive | Corrupted primitive |
|---|---|---|---|
| #1 | spoke-1-bastion | `bulwark` | `bulwark` |
| #2 | spoke-2-edge | `blade` | `blade` |
| #3 | spoke-3-sorcery | `spiral` | `spiral` |
| #4 | spoke-4-inscription | `quill` | `quill` |
| #5 | spoke-5-alchemy | `alembic` | `alembic` |
| #6 | spoke-6-trapping | `snare` | `snare` |
| #7 | spoke-7-wayfinding | `compass` | `compass` |
| #8 | spoke-8-forestry | `bough` | `bough` |
| #9 | spoke-9-masonry | `keystone` | `keystone` |
| #10 | spoke-10-quarrying | `pick` | `pick` |
| #11 | spoke-11-smithing | `hammer` | `hammer` |
| #12 | spoke-12-stance | `tripod` | `tripod` |
| #13 | spoke-13-breath | `bellows` | `bellows` |
| #14 | spoke-14-vessel | `chalice` | `chalice` |
| #15 | spoke-15-unarmored | `footprint` | `footprint` |

### Collision Ledger — EMPTY

| Primitive | Colliding identities | Remediation |
|---|---|---|
| *(none)* | — | — |

All four legacy collisions were remediated this pass: Bram true `trapezoid`→`chisel`, Mera true `circle`→`antler`, Caelen corrupted `wedge`→`sextant`, Alden-ascended true `circle`→`diadem`. The ledger is now empty and may **never grow** — a new row means a redesigned form, not a ledger edit.

---

## 7. Motion & Sound Law

- Every interaction triggers `useAppStore().playSfx` (`click`, `shield`, `anvil`, `scribe`). Silence is a bug.
- The wheel's inner Axis **counter-rotates** against the outer discipline ring (true mirror). This is the visual thesis of soul connection/disconnection — do not break it.
- Ambient motion is slow and heavy (counter-rotating torque rings), never bouncy or playful.
- Dossiers render as in-place absolute overlays over the interacted element (the "Big Tooltip"), never as side columns.

---

## 8. Component Housing

- The unified **Heraldry** tab is the single canonical home for all symbol families (Divine · Discipline · Armor) and the audit surface. No symbol family gets a second, competing gallery.
- Glassmorphism overlays use `backdrop-blur-sm`, `bg-neutral-900/80`, and a single blurred radial orb mapped to the entity's accent.
