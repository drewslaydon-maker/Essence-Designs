# 02 — ATTRIBUTES, SKILLS & LEVELING

> Numbers `[VERIFIED]` against UESP and the OpenMW research wiki.

## The 8 primary attributes & what they govern

| Attribute | Governs skills | Effects |
|---|---|---|
| **Strength** | Axe, Long Blade, Blunt Weapon, Spear | Melee damage, carry capacity, starting HP, max Fatigue |
| **Intelligence** | Alchemy, Enchant, Conjuration, Security | Max Magicka, potion potency, enchant success |
| **Willpower** | Destruction, Alteration, Mysticism, Restoration | Spell success, resistance to Paralyze/Silence, max Fatigue |
| **Agility** | Sneak, Light Armor, Marksman, Block | Hit/dodge chance, stagger resistance, max Fatigue |
| **Speed** | Athletics, Acrobatics, Unarmored | Movement speed |
| **Endurance** | Medium Armor, Heavy Armor, Armorer | Max Fatigue, starting HP, HP-per-level |
| **Personality** | Speechcraft, Mercantile, Hand-to-Hand | Disposition, prices |
| **Luck** | (none) | Subtle chance modifier everywhere; +1/level only |

(Each attribute governs 3-5 skills; the above lists them grouped.)

## Derived stats — the math (GOTY, incl. OpenMW defaults)

- **Health**: starts at `(Strength + Endurance) / 2`. Every level-up adds
  `10% of Endurance` (only base Endurance + the Lady birthsign's +25 count;
  Fortify Attribute effects do NOT). `[VERIFIED]` UESP:Health
- **Fatigue**: maximum = `Strength + Willpower + Agility + Endurance`
  (max 400 without magic). Fatigue is the stealth-meta stat: low fatigue
  makes you miss attacks, fail spells, fail speechcraft, fail quietly.
  `[VERIFIED]` UESP:Fatigue
- **Magicka**: maximum = `Intelligence × magicka multiplier`
  (mult = 1.0 + Fortify Maximum Magicka bonuses from race/sign/Mantle of Woe).
  `[VERIFIED]` UESP:Fortify Maximum Magicka
- **Encumbrance**: maximum = `5 × Strength`. At/over 50%? No — over 100%
  encumbrance = can't run; heavy load = slower + more Fatigue drain.
  `[VERIFIED]` UESP (fEncumbranceStrMult = 5)
- **Resting restores** ~10% of Endurance in Health per hour, Magicka per hour
  (unless Atronach/Stunted Magicka), Fatigue quickly. Waiting (1h) restores
  fatigue but not health/magicka. Sleeping outside can be interrupted by
  creatures.

## The 27 skills (specialization)

- **Combat**: Axe, Blunt Weapon, Long Blade, Spear, Marksman, Heavy Armor,
  Medium Armor, Block, Armorer
- **Magic**: Alteration, Conjuration, Destruction, Illusion, Mysticism,
  Restoration, Alchemy, Enchant, Unarmored
- **Stealth**: Acrobatics, Athletics, Light Armor, Security, Short Blade,
  Sneak, Speechcraft, Mercantile, Hand-to-Hand

Three magic-relevant detail: Enchant & Alchemy key off Intelligence;
Security is Intelligence (not Agility) in Morrowind. `[VERIFIED]`

## LEVELING — exact rules

1. Every **10 combined Major/Minor skill increases** → you become eligible to
   level. Resting (sleeping) banked the level. Skill books and paid training
   count toward the 10. Misc skills do NOT count toward the 10.
   `[VERIFIED]` UESP:Level
2. At level-up you raise **3 attributes**. Each attribute's increase is a
   multiplier based on total skill increases (Major + Minor + Misc ALL count)
   in the skills it governs **since the previous level-up**:
   - 0 increases → +1
   - 1-4 → +2
   - 5-7 → +3
   - 8-9 → +4
   - 10+ → +5
   `[VERIFIED]` UESP:Level
3. **Trainers count** toward multipliers (paying a trainer to raise a skill
   contributes to that attribute's multiplier). Books also count.
   `[VERIFIED]` UESP:Level (+ a caveat below)
4. **The frozen-bonus bug/quirk (vanilla AND OpenMW):** once you hit 10/10
   (eligible to level), further skill increases stop feeding the current
   level-up's multipliers — they roll to the next level (excess 10-count
   carries into "already eligible" but multipliers reset). Practical rule:
   **do your multiplier-farming BEFORE you bank the level-up**, then rest to
   bank it. `[VERIFIED]` via UESP:Level & community testing
5. **Luck**: no skill governs it, so it can only ever increase +1 per level.
   `[VERIFIED]`
6. **Max level ~78** (without cheats), driven by 775 possible
   Major/Minor increases. `[VERIFIED]` UESP:Level

### Efficient-leveling strategy (the "30-skill level")

- Perfect level-up: three DIFFERENT attributes each with 10+ increases
  (30 total counted, incl. 20 misc). Practical approach each level:
  1. Play normally, but *before* reaching 10/10 in Major/Minor, do the math
     for the 3 attributes you want to raise this level.
  2. Use the governing skills on purpose: e.g., want Strength? swing Long
     Blade; want Speed? run/jump (Athletics/Acrobatics are governed by
     Speed); want Endurance? take hits in armor / Armorer repair.
  3. Rest only when those 3 target multipliers are 5× (or 4× if close).
  4. Put the third point into Luck when you have only 2 real +5s to claim.
- Don't obsess. Morrowind is beatable at +3s. Efficiency for its own sake
  beats perfection when it costs play-flow.

### Training rules

- No per-level training cap in Morrowind (unlike Oblivion). `[VERIFIED]`
- A trainer can raise any skill up to the trainer's own skill level; a skill
  can't be *trained* above its governing attribute. `[VERIFIED]`
- **Drain Skill / Drain Attribute trick** `[VERIFIED]`: cast
  `Drain Skill 100 for 1s on self` (or Drain the governing attribute) so your
  skill drops below the trainer's, then buy training — each trained point
  costs based on the *drained* (low) level. Cheap high-level training.
- **Athletics cheese** `[VERIFIED]`: toggle Auto-Walk into a wall to raise
  Athletics passively. Also great for the Speed multiplier.
- Training a skill counts toward both the level-10 counter AND multipliers
  (see rule 3) — that's how you control multipliers precisely.

## Version notes

- `[OPENMW DIFF]` OpenMW recalculates current Magicka when Intelligence
  changes as a *flat add* rather than vanilla's proportional rescale
  (OpenMW issue #2604). Net effect: with Fortify Intelligence items, OpenMW
  partially refills magicka; on vanilla, fortifying INT preserves your
  percentage. Plan magicka trickle accordingly.
- `[OPENMW DIFF]` OpenMW and MCP fix the vanilla "permanent spell effect"
  bugs and several enchant-dialog glitches — those exploits (later file) are
  dead on this setup.