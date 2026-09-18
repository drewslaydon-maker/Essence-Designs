# 01 — CHARACTER CREATION

> Morrowind is a dice-roll RPG with fixed math. The right start is 50% of the
> difficulty. All data below is `[VERIFIED]` unless marked.

## The three choices

1. **Race** (10) — gives starting attributes, skill bonuses, abilities/powers.
2. **Class** — pick a preset or custom: 1 specialization, 2 favored attributes
   (+10 each), 5 Major skills, 5 Minor skills (9 remaining skills = misc).
3. **Birthsign** (13) — permanent abilities/powers/spells, no re-roll.

Max base attribute = 100 (leveling). Skills cap at their governing attribute
level for **training**, and effectively at 100 for gameplay.

## Races — key facts

Format: Start stats (M/F) · Signature abilities · Skill bonuses.

- **Argonian** — Str 40/40, Int 40/50, Will 30/40, Agi 50/40, Spe 50/40,
  End 30/30, Per 30/30. 75% Resist Common Disease, 100% Resist Poison,
  Water Breathing spell. Bonuses: Athletics +15, Alchemy +5, Illusion +5,
  Medium Armor +5, Mysticism +5, Spear +5, Unarmored +5.
  Default-tier; fast (Agility/Speed) and disease-proof. Good starter.
- **Breton** — Int 50, Will 50. **Fortify Max Magicka 0.5× INT** (i.e.
  magicka mult 1.5), 50% Resist Magicka. Bonuses: Conjuration +10,
  Mysticism +10, Restoration +10, Alteration +5, Alchemy +5, Illusion +5.
  Best cheap mage race (big magicka pool without Atronach downside).
- **Dunmer (Dark Elf)** — Str 40/40, Int 40, Will 30/30, Agi 40, Spe 50/50,
  End 40/30. 75% Resist Fire, Sanctuary 50 (power). Bonuses: Destruct 10,
  Short Blade +10, Athletics +5, Light Armor +5, Long Blade +5, Marksman +5,
  Mysticism +5. Resident race; balanced hybrid; yes-goes Dunmer.
- **Altmer (High Elf)** — Int 50. **Fortify Max Magicka 1.5× INT** (mult 2.5),
  50% Weakness to Magicka. Bonuses: Alchemy +10, Destruction +10, Enchant +10,
  Alteration +5, Conjuration +5, Illusion +5. Glass cannon mage; pairs with
  Apprentice sign for mult 4.0 or Atronach for mult 4.5.
- **Imperial** — Per 50, End 40. Charm spell, Absorb Fatigue 200 spell.
  Bonuses: Long Blade +10, Mercantile +10, Speechcraft +10, Blunt +5,
  Hand-to-Hand +5, Light Armor +5. Silver-tongued warrior; the Mercantile/
  Speechcraft edge helps money and the "speak your way through" style.
- **Khajiit** — Agi 50, Spe 40. Night Eye spell, Demoralize Humanoid power.
  Bonuses: Acrobatics +15, Athletics +5, Hand-to-Hand +5, Light Armor +5,
  Security +5, Short Blade +5, Sneak +5. Stealth/speed; Night Eye removes the
  "too dark to see" tax.
- **Nord** — Str 50/50, End 50/40. 100% Resist Frost, 50% Resist Shock.
  Bonuses: Axe +10, Blunt +10, Medium Armor +10, Heavy Armor +5,
  Long Blade +5, Spear +5. Tankiest melee start; low Magicka (Int 30).
- **Orc** — Str 45/45, End 50/50, Spd 30. 25% Resist Magicka, **Berserk**
  power (Fortify Health 20, Fatigue 200, Attack 100 for 60s + Drain Agility
  100 — use to burst, expect the drain). Bonuses: Armorer +10, Block +10,
  Heavy Armor +10, Medium Armor +10, Axe +5. Best raw early melee; Armorer
  keeps gear fresh.
- **Redguard** — Str 50/40, End 50/50. 75% Resist Poison, 75% Resist Common
  Disease, **Adrenaline Rush** power (Fortify Agi/Spe/Str/End 50 + Health 25
  for 60s). Bonuses: **Long Blade +15**, Athletics +5, Axe +5, Blunt +5,
  Heavy Armor +5, Medium Armor +5, Short Blade +5. Best starter weapon-skill
  in the game; highest early damage output.
- **Bosmer (Wood Elf)** — Agi 50, Spe 50/50. 75% Resist Common Disease,
  Command Creatures power. Bonuses (from manual-standard): Alchemy +5,
  Alteration +5, Light Armor +5, Long Blade +5, Marksman +10, Sneak +5,
  Speechcraft +5 `[VERIFY exact set]`. Best pure Marksman start.

## Birthsigns — exact effects (13)

| Sign | Effect | Grade |
|---|---|---|
| **Warrior** | Warwyrd: Fortify Attack +10 (permanent, +10% hit chance) | Good early |
| **Mage** | Fay: Fortify Max Magicka +0.5× INT | Solid |
| **Thief** | Akaviri Danger-Sense: Sanctuary +10 (harder to hit, permanent) | Solid |
| **Serpent** | Serpent's Touch spell: Damage Health over time on target, small self-damage (shared spell cost) | Weak |
| **Lady** | Lady's Favor: Personality +25. Lady's Grace: Endurance +25 (permanent) | Top tier |
| **Steed** | Charioteer: Speed +25 (permanent) | Good, running speed matters |
| **Lord** | Trollkin: 100% Weakness to Fire. Blood of the North spell: Restore Health ~2/30s on self | Weak (the fire weakness hurts) |
| **Apprentice** | Elfborn: Fortify Max Magicka +1.5× INT, **50% Weakness to Magicka** | Mage pick |
| **Atronach** | Wombburn: Fortify Max Magicka +2.0× INT, **Spell Absorption 50%**, **Stunted Magicka (no sleep regen)** | Top tier, awkward for new casters |
| **Ritual** | Power Mara's Gift: Restore Health 100 once/day. Spell Blessed Word: Turn Undead | Situational |
| **Lover** | Mooncalf: Agility +25 permanent. Power Lover's Kiss: Paralyze target 60s, also knocks YOU down (Damage Fatigue 200 on self) | Strong |
| **Tower** | Spell Tower Key: Open lock 50 pts on touch | Weak-ish |
| **Shadow** | Power Moonshadow: Invisibility 60s once/day | Situational |

Magicka multiplier math: total mult = 1.0 + race + sign bonuses.
Bretons: 1.5. Altmer: 2.5. Altmer+Apprentice: 4.0. Altmer+Atronach: 4.5
(= 450 Magicka at Int 100). `[VERIFIED]` — UESP Fortify Maximum Magicka.

## Class creation mechanics

- 5 Major skills start near/at 30, 5 Minor near/at 15, rest misc at 5 base.
  Specialization adds +5 to every skill in that specialization.
- Skills level at different speeds: Major = fastest, Minor = normal,
  Misc = slowest (~0.75× / 1.0× / 1.25× class factor). `[VERIFIED]`
- Favored attributes: +10 to each of two chosen attributes (each ≤ 100 base).

### Rules of thumb for an efficient custom class

1. **Keep leveling under control.** Major/Minor increases trigger level-ups
   (10 combined). Too many convenient "everyday" skills as Major = leveling too
   fast with weak multipliers. Put combat skills you actually use in
   Major/Minor deliberately, not all utility.
2. **Spread attributes.** Major skills should not all govern one attribute, or
   you'll level with no multipliers for your other targets.
3. **Luck is the trap.** Luck only gains +1/level (no skill governs it). If
   you want 100 in everything, you must take Luck almost every level or start
   high. Realistic goal: let Luck stay ~40-50 unless min-maxing.
4. **Endurance early.** Health-per-level = 10% of Endurance at level-up, so
   pump Endurance early for maximum total HP.

### Efficient starter builds (GOTY/OpenMW)

- **First-time, no exploits, low frustration:** Redguard, custom class
  (Combat spec; Strength/Endurance favored; Long Blade, Heavy Armor, Block,
  Spear, Armorer major; Alchemy isn't needed early), **Steed or Warrior**
  sign. Run faster, hit hard, tank up.
- **Money-focused:** Imperial (Mercantile/Speechcraft +10 each), Steed/Lady.
  Or any race + Mercantile as a Minor to train it.
- **Mage without Atronach frustration:** Breton or Altmer + **Apprentice** or
  **Mage** sign. Sleep to regen, no Stunted Magicka misery.
- **Mage with big pool (advanced):** Altmer + Atronach — take Alchemy major
  (restore magicka potions + the Drain-Intelligence recharge trick).
- **Assassin/stealth:** Khajiit or Bosmer; Short Blade/Light Armor/Sneak/
  Security/Speechcraft; Lover sign gives +25 Agility.
- **Daedric-curious warrior-mage:** Dunmer, Destruction + Long Blade +
  Mysticism; Atronach is viable since you don't need to regen.

### What to NOT do on a normal playthrough

- Race/sign combos that stack massive Weakness to Magicka (Apprentice + Altmer)
  without a plan — fire/paralysis/absorb from enemies hits noticeably harder.
- Taking both Atronach sign AND no Alchemy/Mysticism — you'll starve for
  magicka.
- Overlapping Major skills that all raise the same attribute unless you
  deliberately want that attribute speed-ran.