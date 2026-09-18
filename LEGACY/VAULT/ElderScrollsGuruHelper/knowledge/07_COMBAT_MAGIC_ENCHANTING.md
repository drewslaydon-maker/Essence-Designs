# 07 — COMBAT, MAGIC, ENCHANTING & ALCHEMY (FIELD CRAFT)

> Operational knowledge so the guru can solve "how do I actually win a
> fight / make gear" questions. Tagged per the accuracy doctrine.

## Combat fundamentals

- Hit chance scales with weapon skill + the **Attack** bonus + **Fatigue**
  state. Low Fatigue = whiffs everywhere; full Fatigue = clean strikes.
  `[VERIFIED]`-level truth for all of Morrowind.
- Weapons roll a damage range per class (e.g., a Longsword's slash/thrust
  values). **Skill level decides how often the top of that range lands.** A
  skill-20 long blade misses a lot even vs. mudcrabs.
- **Silver/enchanted/daedric weapons** are required to damage spectral
  undead (ghosts, wraiths, lich). Carry a silver weapon/arrows until your
  main weapon is enchanted. `[VERIFY]` exact enemy-behavior edge cases
  (what about curses etc.) — check one in-game.
- **Block** reduces incoming by parrying (requires a shield or block skill);
  **Armorer** keeps gear at high condition — low-condition armor gives less
  protection, battered weapons hit for less. Repair often.
- Positioning: Morrowind melee has no active dodge stat beyond Agility-based
  evasion. Kiting with a long weapon (spear/long blade) while backing off and
  staying full-Fatigue is a legitimate low-level strategy.
- Crowd rule: never let two enemies flank you at once. Back into a choke
  (doorway / hallway) — DW intended this.

## Magic system

- Casting chance depends on skill in the school, Willpower, Fatigue, Luck
  (and spell cost vs. intelligence affects only cost, not success). `[VERIFIED]`
- **Spellmaking/Enchanting services** exist in Mages Guild halls (and the
  tribunal interest aside) — you can craft custom spells. Name craft:
  "custom-mark-recall-spells" (Potent Mark/Recall with as long a duration as
  you can afford) pay off hugely.
- Recommended always-have spells (any build buys these):
  - `Mark` + `Recall` (Mysticism) — home anchor.
  - `Divine Intervention` + `Almsivi Intervention` (Mysticism) — emergency
    escape to nearest shrine/temple.
  - `Water Walking` (Alteration) — trivial-land travel.
  - `Levitate` (Alteration) — the big one. Some quests/gates need it.
  - `Open` (Alteration) or pick/scroll opens vs Security skill for locks.
  - `Soul Trap` (Mysticism) for the enchant loop (below).
- **Weakness stacking on cast spells** was a famous cheese; `[OPENMW DIFF]`
  mostly dead in OpenMW — skip.

## Enchanting — the reliable path

- Self-enchant chance formula `[VERIFIED]` (OpenMW forum, same as vanilla):
  base = Skill + (1/4 × Intelligence) + (1/8 × Luck); modifiers subtracted
  scale with the enchantment's magnitude/type (constant-effect lower).
- **Fortify-Enchant self-buff trick `[VERIFIED]`:** cast
  `Fortify Enchant 100 for 1s on self` (stack several — up to 800) right
  before enchanting to guarantee near-100% success. Acceptable, documented.
- **Soul sizes** (small→large): Petty, Lesser, Common, Greater, Grand.
  **Golden Saints and Ascended Sleepers are Grand souls**
  `[VERIFY]` full standard soul-value list per summon — but these two are
  the reliable farms for big enchants. **Azura's Star** (from the Azura
  quest, shrine north of Molag Mar `[VERIFY]` exact location) is a reusable
  Grand soul gem — get it before serious enchanting.
- Enchantment slots: cast-on-use (weapons reload from soul gems/charge),
  cast-when-used, constant-effect (armor/clothing, needs the charge/soul
  cap). Constant-effect Fortify Strength/Endurance/Chameleon etc. = the
  endgame power base.
- **Chameleon stacking** (100%+ chameleon via enchanted items) is the
  documented "walk past everything" tool — `[VERIFIED]` it works, game
  doesn't punish it via OpenMW either. It trivializes much of combat; purists
  skip voluntarily.

## Alchemy

- Potion strength scales with Alchemy skill + Intelligence; success chance
  is also governed by skill — `[VERIFY]` exact curve, but skill+INT+full-fatigue
  is the recipe for potent brews.
- Discover ingredient effects by eating ingredients (slow) or by success on
  brews; the "four-effect pipeline" means an ingredient's first known effect
  shows up first at low familiarity. The usual sweeps: health restore, fortify
  INT, drain/restore magicka, cure disease/blight categories.
- Stamina potions (restore fatigue) are the sleeper-best cheap potions in the
  game for melee (full-Fatigue = hit hard again). `[VERIFIED]`
- Regret-preen: never sell restore-health/restore-fatigue stacks you craft;
  they're worth more than their gold on an expedition.

## Inventory & fieldcraft micro

- **Potion/scroll hotkeys** > shuffled magic menu mid-fight. Pre-assign heal,
  fatigue, damage spells.
- **Torch/Night Eye** overhauls dark-dungeon play (khajiit night-eye or a
  cheap enchant-cast torch is cheap).
- **Light armor beaters** vs glass/bonemold progression see 03. Keep the
  armor class you spec'd — mismatched armor = skill doesn't defend you.