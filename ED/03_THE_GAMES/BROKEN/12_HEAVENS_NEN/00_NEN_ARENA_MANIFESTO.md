# HEAVEN'S NEN (Working Title) — Design Manifesto & System Architecture

> **Tagline:** "Master the Aura. Name your Oath. Conquer the Tower."
> **Core Concept:** A web-based tactical Nen combat simulator and floor-climbing arena inspired by *Hunter x Hunter*.

---

## 🏛️ 1. CORE PHILOSOPHY & DESIGN PILLARS

1. **Verbs Over Nouns (Aura Flow as Gameplay):**
   Nen isn't just mana; it's dynamic physical energy distribution. Players constantly balance:
   - **Ten (Enshroud):** Baseline defense and aura conservation.
   - **Zetsu (Conceal/Suppress):** 0 defense, rapid aura recovery, hides aura flow, high vulnerability.
   - **Ren (Exert):** Surge aura outward. Amplifies attack power, unlocks Hatsu, consumes aura per turn.
   - **Hatsu (Express):** Personal Nen technique governed by affinity and conditions/oaths.
   - **Ko (Concentrate):** 100% aura focused into offense. Devastating damage, but leaves body at 0 defense (Zetsu state everywhere else).
   - **Gyo (Focus Eye):** Spend aura to reveal enemy aura distribution and hidden traps/conjured objects.

2. **The Point System (Heaven's Arena Rules - Floor 200+):**
   - Fights aren't just HP grinding. Matches on Floor 200+ use Heaven's Arena rules:
     - **Clean Hit:** 1 Point
     - **Critical Hit:** 2 Points
     - **Down:** 1 Point
     - **Knockout (KO):** Instant Victory
     - **First to 10 Points wins!**

3. **Oaths & Restrictions (Condition-Based Power):**
   - The stronger the limitation, the higher the power multiplier.
   - Examples:
     - *"Can only be activated when HP < 30%"* -> +150% Hatsu damage.
     - *"Requires 2 turns of Zetsu preparation"* -> +200% Hatsu effect.
     - *"If target avoids hit, self-inflict self-stun"* -> +180% Hatsu effect.

4. **Zero-Barrier Web Accessibility:**
   - Single standalone web package (HTML5/CSS3/TS-JS). playable in any browser on desktop or mobile. Zero installation required.

---

## 🎮 2. GAMEPLAY MODES

### Mode A: Tower Campaign (Heaven's Arena)
- **Floors 1–50:** Physical Brawling & Martial Arts. Onboarding mechanics (Stamina, Guard, Strike, Counter).
- **Floors 50–100:** Nen Awakening (Water Divination Test) & Fundamental Training (Ten, Zetsu, Ren).
- **Floors 100–199:** Hatsu Unlocking & Advanced Aura Mechanics (Ko, Gyo, Ryu). Facing specialized Nen users.
- **Floor 200+:** Registration & Point Matches against legendary Floor Masters. Permanent consequences, custom arena rules.

### Mode B: Custom Hatsu Workshop (Nen Lab)
- Pick your **Nen Category** (Enhancer, Transmuter, Emitter, Conjurer, Manipulator, Specialist).
- Allocate base stats and affinity efficiency according to the Nen Hexagon.
- Craft custom **Hatsu Techniques** by selecting Base Effect, Range/Targeting, and Oaths/Restrictions.
- Generate a exportable **Nen Code** or **Build JSON** to share builds with other players.

### Mode C: Duel / VS Mode (PvP & Custom Battles)
- Pass-and-play or room-code online combat.
- Test custom Nen builds against preset Floor Masters or opponent builds.

---

## 🔮 3. THE NEN HEXAGON EFFICIENCY MATRIX

Each Nen type has 100% learning affinity in their main category and diminished efficiency in adjacent/distant categories:

| Category | Primary Strengths | Adjacent Efficiencies (80%) | Opposite Efficiency (40-60%) |
|---|---|---|---|
| **Enhancer** | Raw damage, physical defense, self-heal | Transmutation (80%), Emission (80%) | Conjuration (60%), Manipulation (60%) |
| **Transmuter** | Elemental/property aura, status effects, sticky/sharp aura | Enhancement (80%), Conjuration (80%) | Emission (60%), Manipulation (40%) |
| **Emitter** | Ranged blasts, aura separation, teleport markers | Enhancement (80%), Manipulation (80%) | Transmutation (60%), Conjuration (40%) |
| **Conjurer** | Materialized objects, conditional domains, weapon summoning | Transmutation (80%), Specialization (0-100% edge case) | Enhancement (60%), Emission (40%) |
| **Manipulator** | Direct target control, forced movement, puppet commands | Emission (80%), Specialization (0-100% edge case) | Enhancement (60%), Transmutation (40%) |
| **Specialist** | Rule manipulation, ability stealing, future sight | Manipulation (80%), Conjuration (80%) | Variable |

---

## 🏗️ 4. SYSTEM ARCHITECTURE & STATE MACHINE

```
[Player State]
 ├─ Stats (Max HP, Max Aura, Physical Atk, Physical Def, Nen Efficiency)
 ├─ Aura Flow Stance (Ten / Zetsu / Ren / Ko)
 ├─ Active Aura Pool (Current Aura / Max Aura)
 ├─ Nen Category (Enhancer / Transmuter / etc.)
 └─ Hatsu List (Array of custom/unlocked Hatsu abilities)

[Combat Turn Cycle]
 1. Stance Selection (Maintain / Ten / Zetsu / Ren)
 2. Action Choice (Strike / Guard / Ko Strike / Gyo Inspect / Hatsu Activation / Item)
 3. Speed & Priority Calculation
 4. Resolution & Aura Burn
 5. Point Scoring & Win Check (10 Points or KO)
```

---

## 🚀 5. ROADMAP & PROTOTYPE STEPS

1. **Prototype V1 (Current):** Standalone web application (`index.html`) with Water Divination Test, Tower Floor Climb (Floors 1 to 200+), turn-based Nen tactical combat engine, Gyo/Ko risk-reward mechanics, Point Match scoring, and custom Hatsu builder.
2. **Prototype V2:** Dynamic Hatsu combat animations, tactical visual aura meters, save/load character progression via `localStorage`.
3. **Prototype V3:** WebRTC / Peer-to-Peer or WebSockets multiplayer room-code PvP battles.
