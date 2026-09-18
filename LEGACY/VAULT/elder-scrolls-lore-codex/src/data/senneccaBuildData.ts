export interface SpellbladeMilestone {
  stage: string;
  levelRange: string;
  title: string;
  subtitle: string;
  priorityQuest: string;
  keyGear: string[];
  spellsToAcquire: string[];
  tacticalObjective: string;
  atronachTips: string;
  reVillageComparison: string;
}

export interface ActionableStep {
  stepNumber: number;
  location: string;
  objective: string;
  actionableDetail: string;
  proTip?: string;
}

export interface ActionableQuestGuide {
  id: string;
  title: string;
  subtitle: string;
  whyDoThisNow: string;
  rewardBreakdown: string;
  recommendedLevel: string;
  criticalExploitOrWarning?: string;
  steps: ActionableStep[];
}

export interface ImperialCityTask {
  id: string;
  district: string;
  merchantOrPlace: string;
  budgetCostOrGain: string;
  goal: string;
  detailedAction: string;
  priority: 'Immediate (0 Gold)' | 'Under 50 Gold' | 'Under 150 Gold' | 'Free Profit';
}

export interface MagesRecommendationStep {
  city: string;
  stewardName: string;
  questName: string;
  objective: string;
  walkthrough: string;
  lootOrSpellReward: string;
  warningOrTrick: string;
}

export interface ArenaMatchGuide {
  rank: string;
  matchName: string;
  opponentType: string;
  levelBracket: string;
  tactic: string;
  hazardOrPerk: string;
  goldReward: number;
}

export interface CustomSpellRecipe {
  name: string;
  school: 'Destruction' | 'Restoration' | 'Mysticism' | 'Alteration' | 'Conjuration';
  magickaCost: string;
  levelRequired: string;
  effects: string[];
  tacticalApplication: string;
  loreFlavor: string;
}

export interface AtronachFuelSource {
  name: string;
  type: 'Chapel' | 'Alchemy' | 'Ayleid Well' | 'Item' | 'Combat Loop';
  location: string;
  mechanic: string;
  convenienceRating: 'Easy / Everyday' | 'Field Emergency' | 'Infinite Loop';
  instructions: string;
}

export const SENNECCA_BUILD_SPECS = {
  characterName: 'Sennecca',
  classTitle: 'Atronach Spellblade',
  currentLevel: 1,
  birthsign: 'The Atronach (The Golem)',
  birthsignBenefits: [
    '+150 Maximum Magicka bonus pool',
    '50% Wombburn Spell Absorption (50% chance any enemy spell deals 0 damage and refills your Magicka pool instead)'
  ],
  birthsignPenalty: 'Stunted Magicka: Natural Magicka regeneration is 100% halted. Sleeping, waiting, or resting does NOT refill blue juice.',
  primaryAttributes: ['Intelligence (Governs Max Magicka)', 'Willpower (Governs Fatigue & Spell Resist)'],
  specialization: 'Magic (Gives bonus skill levels and faster leveling for all 6 magic schools)',
  majorSkills: [
    {
      name: 'Blade',
      governing: 'Strength',
      role: 'Primary physical damage dealer. Complements touch spells with quick strikes.'
    },
    {
      name: 'Destruction',
      governing: 'Willpower',
      role: 'Elemental burst damage. Touch spells cost significantly less Magicka than ranged ball spells.'
    },
    {
      name: 'Mysticism',
      governing: 'Intelligence',
      role: 'Detect Life, Soul Trap, Telekinesis, Dispel, and the legendary Spell Absorption loop.'
    },
    {
      name: 'Restoration',
      governing: 'Willpower',
      role: 'Self-healing, curing poison/diseases, and fortifying attributes or blade damage.'
    },
    {
      name: 'Alchemy',
      governing: 'Intelligence',
      role: 'The lifeblood of the Atronach. Instantly brews weightless Restore Magicka potions from wild flowers.'
    },
    {
      name: 'Athletics',
      governing: 'Speed',
      role: 'Sprinting speed and in-combat positioning. Run circles around slow heavy armor bandits.'
    },
    {
      name: 'Acrobatics',
      governing: 'Speed',
      role: 'Vertical traversal. Jump onto arena pillars, church roofs, and boulders where melee enemies cannot hit you.'
    }
  ]
};

export const BOZOG_CHRONICLE = {
  characterName: 'Bozog the Skullcrusher',
  race: 'Orsimer (Orc)',
  currentLevel: 12,
  playstyle: 'Blunt Weapon Berserker & High-Speed Chaos Tank',
  status: 'Reigning Grand Champion of the Imperial City Arena',
  currentMission: 'Acquiring Azura\'s Star to make his Absorb Health Warhammer an infinite soul-crushing engine.',
  buildMechanics: [
    'Berserk Power: Once per day, gains +20 Strength, +200 Health, +100 Fatigue, but loses Agility—turns into an unstoppable battering ram.',
    'Heavy Blunt Weapons: Massive stagger chance and knockdown hits that leave Daedra lying flat on their backs.',
    'Fatigue Suppression Engine: Spamming Absorb Fatigue + Fortify Fatigue potions so Bozog never tires, while knocking enemies to 0 Fatigue so they collapse on the floor.',
    'Azura\'s Star Loop: Captures grand souls continually to recharge his enchanted weapon without spending 4,000 gold at guild recharge merchants.'
  ],
  quote: '"Why dodge a fireball when you can walk through it and turn their spine into chalk?"'
};

export const ATRONACH_FUEL_INDEX: AtronachFuelSource[] = [
  {
    name: 'County Great Chapel Altars (Chorrol, Cheydinhal, Bruma, etc.)',
    type: 'Chapel',
    location: 'Every County City (e.g. Great Chapel of Stendarr in Chorrol, Great Chapel of Arkay in Cheydinhal)',
    mechanic: 'Clicking the large central Nine Divines altar instantly cures all diseases, repairs damaged attributes, and 100% REFILLS YOUR ENTIRE MAGICKA POOL for 0 gold.',
    convenienceRating: 'Easy / Everyday',
    instructions: 'IMPORTANT IC QUIRK: The Imperial City is the ONLY city in Cyrodiil with no Great Chapel! (The Temple of the One in IC is an empty ceremonial dome for the Emperor and Dragonfires, not an altar chapel). Whenever in need of a free 100% refill, simply fast-travel to Chorrol, Cheydinhal, or Bruma—the Great Chapel is right inside the front gates!'
  },
  {
    name: 'Wilderness Wayshrines (Red Ring Road & Across IC Bridges)',
    type: 'Chapel',
    location: 'Dotted along roads right outside the Imperial City walls (e.g., Wayshrine of Stendarr across Talos bridge, Wayshrine of Akatosh near Weye)',
    mechanic: 'Small open-air stone canopies dedicated to the Nine Divines. Activating the altar grants a divine blessing, cures diseases, and refills your Magicka pool.',
    convenienceRating: 'Easy / Everyday',
    instructions: 'If you want to stay near the Imperial City without fast traveling to another city, step outside the gates onto the Red Ring Road. Look for circular stone altars surrounded by stone pillars glowing with starlight.'
  },
  {
    name: 'The Roadside Flax & Entoloma Brew (Alchemy 101)',
    type: 'Alchemy',
    location: 'Between Skingrad and Chorrol (West Weald fields & Great Forest)',
    mechanic: 'Flax Seeds (blue flower) + Steel-Blue Entoloma (blue tree mushroom) = Restore Magicka Potion.',
    convenienceRating: 'Easy / Everyday',
    instructions: 'Pick every blue flax flower on the roadside. In your mortar & pestle, combine 1 Flax Seed + 1 Steel-Blue Entoloma (or Bog Beacon Cap). You will instantly craft 15-20 weightless Restore Magicka potions without spending a single septim.'
  },
  {
    name: 'Ayleid Wells (Cosmic Starlight Batteries)',
    type: 'Ayleid Well',
    location: 'Glowing blue stone structures dotting Cyrodiil\'s wilderness (over 40 across the province)',
    mechanic: 'Activates once every 24 hours. Instantly restores 400 points of Magicka and gives a +50 Fortify Magicka buff for 120 seconds.',
    convenienceRating: 'Field Emergency',
    instructions: 'Whenever travelling between cities on horseback or foot, look for circular ancient elven stone wells glowing bright sapphire. Walk up, press activate, and your entire mana bar overflows.'
  },
  {
    name: 'Welkynd Stones (Dungeon Batteries)',
    type: 'Item',
    location: 'Plentiful inside any Ayleid ruin (like Vilverin across from the sewer exit)',
    mechanic: 'Glowing teal crystal. Consuming one from your inventory immediately restores 100% of your Magicka bar.',
    convenienceRating: 'Field Emergency',
    instructions: 'Keep 3 to 5 Welkynd Stones in your quick inventory strictly for boss fights or desperate dungeon scrapes. Sell the excess for 50 gold each.'
  },
  {
    name: 'The Self-Absorption / Telekinesis Loop',
    type: 'Combat Loop',
    location: 'Anywhere once you acquire Telekinesis or target Mysticism',
    mechanic: 'Your innate 50% Spell Absorption roll triggers on incoming magical effects. Casting certain targeted Mysticism spells or triggering trap spells directly feeds your Magicka pool.',
    convenienceRating: 'Infinite Loop',
    instructions: 'Intentionally stepping on low-damage magic dart wall traps in ruins will literally recharge your mana while you stand there and absorb the blasts.'
  }
];

export const SENNECCA_PROGRESSION_ROADMAP: SpellbladeMilestone[] = [
  {
    stage: 'Act I: Surviving the Wilderness & Escorting Martin',
    levelRange: 'Level 1 – 4',
    title: 'The Road to Cloud Ruler Temple',
    subtitle: 'Securing the Empire\'s Last Hope & Unlocking Free Blades Gear',
    priorityQuest: 'Kvatch Siege -> Deliver Martin to Jauffre -> Ride to Cloud Ruler Temple in Bruma',
    keyGear: [
      'Honorblade of Chorrol (Free 23-damage Ebony weapon that weighs 0 lbs if you delay turning it in)',
      'Akaviri Katana (Free from Cloud Ruler Temple weapon racks)',
      'Fine Iron or Steel Longsword with Edgar\'s poison coats'
    ],
    spellsToAcquire: [
      'Shocking Touch (Edgar\'s Discount Spells, Imperial City Market District)',
      'Minor Heal / Convalescence (Edgar\'s or Chapel of the One)',
      'Detect Life / Minor Life Detection (Mysticism vendor in Bravil Mages Guild)'
    ],
    tacticalObjective: 'Clear Kvatch to close your first Oblivion gate. Keep Martin alive by riding ahead on horses. Once Martin is safe behind the walls of Cloud Ruler Temple, the main story will pause safely until you decide to return, leaving Cyrodiil open for pure sandbox freedom.',
    atronachTips: 'Do NOT rely on ranged fireballs! Ranged spells cost 2x more Magicka. Close the distance, cast Shocking Touch, then immediately slash with your blade. Use Chapel altars before and after the Kvatch gate.',
    reVillageComparison: 'Think of Kvatch like the Lycan siege in RE Village: conserve your resources, let the NPC guards (Savlian Matius) take the front-line aggro, and pick off stragglers with quick blade jabs.'
  },
  {
    stage: 'Act II: Blood in the Sands & The Mages Recommendation Tour',
    levelRange: 'Level 5 – 9',
    title: 'The Arena Champion & Arcane Scholar',
    subtitle: 'Raking in 3,000+ Gold and Unlocking the Spellmaking Altar',
    priorityQuest: 'Imperial City Arena (Pit Dog to Grand Champion) & The 7 Mages Guild Recommendations',
    keyGear: [
      'Raiment of Valor (Heavy or Light armor awarding +10 Personality and +10 Athletics from Arena)',
      'Mages Guild Robes of Willpower',
      'Silver Longsword (Required to damage ghosts in dungeons)'
    ],
    spellsToAcquire: [
      'Weakness to Shock 100% for 3 seconds (Self-crafted at Arcane University)',
      'Telekinesis (Bravil Mages Guild)',
      'Soul Trap (Mysticism at Chorrol Mages Guild)'
    ],
    tacticalObjective: 'Complete the Arena matches to fund all your spell purchases. Once you have the 7 Mages Guild recommendations, the Arcane University gates open in the Imperial City, unlocking Spellmaking and Enchanting altars.',
    atronachTips: 'The Arena is a goldmine for an Atronach. Every match starts with both combatants at full health and mana. You can blow your entire mana pool on touch damage in seconds, collect your gold, and refill for free at the nearby Arboretum chapel!',
    reVillageComparison: 'The Arena is like The Mercenaries mode in RE Village: small arenas, predictable spawns, and rewarding crisp positioning and fast burst execution.'
  },
  {
    stage: 'Act III: The Metaphysical Spellblade',
    levelRange: 'Level 10 – 16',
    title: 'The 100% Magic Immunity Engine',
    subtitle: 'Turning Enemy Sorcerers into Personal Batteries',
    priorityQuest: 'Azura\'s Shrine Quest (Get Azura\'s Star) & The Hunt for Umbra in Vindasel',
    keyGear: [
      'Umbra (Base 28 damage Longsword with 120-second Soul Trap, looted from Vindasel)',
      'Spelldrinker Amulet (Awarded at level 10+ in the Mages Guild questline, grants +18% to +26% Spell Absorption)',
      'Sorcerer\'s Ring or Atronach Sigil Stones'
    ],
    spellsToAcquire: [
      '"The Stinging Edge" (Custom Touch Combo: 100% Weakness to Shock + 35 Shock Damage on Touch)',
      'Shield 20% for 30 seconds (Alteration / Restoration)',
      'Absorb Magicka on Strike (Enchanted onto your Katana)'
    ],
    tacticalObjective: 'Stack your Spell Absorption from 50% toward 100%. At 100% Spell Absorption, Sennecca becomes 100% immune to all magic in the game—enemy spells, dragonfires, and liches will literally heal her mana to full.',
    atronachTips: 'Vindasel is directly southwest of the Imperial City Waterfront. Umbra is deadly in melee, so use your high Acrobatics to jump on the ruins\' pillars and blast her with touch spells or poison arrows!',
    reVillageComparison: 'This is the equivalent of getting the Wolfsbane Magnum in RE Village: suddenly, you are no longer the one hiding in the dark; you are the apex predator.'
  },
  {
    stage: 'Act IV: Ascendant Demigod',
    levelRange: 'Level 17 – 25+',
    title: 'The Master of Cyrodiil',
    subtitle: 'Infinite Soul Captures & Sovereign Reality Warping',
    priorityQuest: 'Close High-Level Oblivion Gates for Transcendent Sigil Stones & Mages Guild Arch-Mage',
    keyGear: [
      'Transcendent Sigil Stone Enchanted Glass / Daedric / Robes',
      'Azura\'s Star with Soul Trap Longsword',
      'Ring of the Iron Fist or Mundane Ring'
    ],
    spellsToAcquire: [
      'Custom Apocalypse Touch: 100% Weakness to Magic + 100% Weakness to Shock + 50 Shock Damage in 10ft radius',
      'Grand Invisibility on Target / Self for 20 seconds'
    ],
    tacticalObjective: 'Close Oblivion gates, collect Transcendent Sigil Stones (which grant effects 3x stronger than normal enchanting altars), and lead the Mages Guild as Arch-Mage.',
    atronachTips: 'Daedric Lords and Xivilai in high-level Oblivion gates will constantly cast high-tier fireballs at you, which your 100% absorption completely eats. They are literally infinite power sockets for you.',
    reVillageComparison: 'Full Heisenberg / Miranda showdown mode. You glide across the battlefield faster than horses, leaping over castle gates with 100 Acrobatics.'
  }
];

export const SENNECCA_SPELL_RECIPES: CustomSpellRecipe[] = [
  {
    name: 'Sennecca\'s Needle (Early Touch Combo)',
    school: 'Destruction',
    magickaCost: '22 Magicka',
    levelRequired: 'Apprentice (Destruction 25+)',
    effects: [
      'Shock Damage 25 pts on Touch',
      'Weakness to Shock 100% for 3 seconds on Touch'
    ],
    tacticalApplication: 'Cast this point-blank on an opponent, then immediately swing your blade. The next cast deals 50 Shock damage, doubling in power with each rapid touch.',
    loreFlavor: 'A concentrated spark drawn directly from Aetherial starlight through the Atronach stone.'
  },
  {
    name: 'Blade-Dancer\'s Aegis',
    school: 'Restoration',
    magickaCost: '35 Magicka',
    levelRequired: 'Apprentice (Restoration 25+)',
    effects: [
      'Shield 15 pts on Self for 20 seconds',
      'Fortify Blade 10 pts on Self for 20 seconds'
    ],
    tacticalApplication: 'Pre-cast before charging into an Arena match or closing distance with a bandit chieftain. Softens physical blowback while boosting sword lethality.',
    loreFlavor: 'An imperial battlemage ward that strengthens muscle fibers and hardens leather cuirasses.'
  },
  {
    name: 'Atronach\'s Harvest (Siphoning Jolt)',
    school: 'Destruction',
    magickaCost: '45 Magicka',
    levelRequired: 'Journeyman (Destruction 50+)',
    effects: [
      'Damage Health 30 pts on Touch',
      'Absorb Fatigue 20 pts on Touch',
      'Soul Trap for 5 seconds on Touch'
    ],
    tacticalApplication: 'Your execution spell. When an enemy is low, touch them with this: they die, fill Azura\'s Star with their soul, and their stamina refills your stamina bar so you can sprint to the next foe.',
    loreFlavor: 'Channeling the cold hunger of Oblivion through steel and fingertips.'
  },
  {
    name: 'The Ghost-Walker\'s Blink',
    school: 'Mysticism',
    magickaCost: '28 Magicka',
    levelRequired: 'Journeyman (Mysticism 50+)',
    effects: [
      'Detect Life 80 ft on Self for 30 seconds',
      'Fortify Acrobatics 20 pts on Self for 15 seconds'
    ],
    tacticalApplication: 'Allows Sennecca to see enemies through dungeon walls and instantly leap up onto ruins, cliffs, or chandelier platforms where enemies cannot reach.',
    loreFlavor: 'Tuning the inner ear to the vibrational frequency of mortal heartbeats.'
  }
];

export const ARENA_SURVIVAL_WALKTHROUGH: ArenaMatchGuide[] = [
  {
    rank: 'Pit Dog -> Brawler',
    matchName: 'First Blood (Matches 1 to 6)',
    opponentType: 'Single melee fighters (Swords, Axes, Maces)',
    levelBracket: 'Level 1 – 3',
    tactic: 'Stay at the center pillar. Cast Shocking Touch right as they swing, then side-step and execute two quick blade strikes. Do NOT trade hits directly.',
    hazardOrPerk: 'Easy gold! Use the Arena basin in the bloodworks between fights to wash up and heal.',
    goldReward: 50
  },
  {
    rank: 'Bloodletter -> Myrmidon',
    matchName: 'The Double Trouble (Matches 7 to 12)',
    opponentType: 'Paired opponents (Archer + Melee or Mage + Melee)',
    levelBracket: 'Level 3 – 5',
    tactic: 'Rush the archer or mage FIRST. Your Atronach stone will absorb the mage\'s fire spells while you cut them down, then 1v1 the remaining melee brute.',
    hazardOrPerk: 'Pillars break enemy sightlines—use your Acrobatics to dodge arrows.',
    goldReward: 100
  },
  {
    rank: 'Warrior -> Gladiator',
    matchName: 'Heavy Armored Veterans (Matches 13 to 18)',
    opponentType: 'Orc and Nord Berserkers with Heavy Shields',
    levelBracket: 'Level 6 – 8',
    tactic: 'They have massive physical block chance. Do NOT strike their shields! Cast Shock Touch right when their shield is raised—spells bypass shields completely!',
    hazardOrPerk: 'Shock damage deals full damage through metal plate armor.',
    goldReward: 150
  },
  {
    rank: 'Champion -> Grand Champion',
    matchName: 'Agronak gro-Malog (The Gray Prince)',
    opponentType: 'The undefeated Half-Vampire Orc Champion',
    levelBracket: 'Level 8+',
    tactic: 'Pro-Tip: If Sennecca completes his personal quest in Crowhaven ("Origin of the Gray Prince") beforehand, Agronak will be so heartbroken by his vampire heritage that he refuses to fight and lets her strike him down peacefully without landing a single blow!',
    hazardOrPerk: 'Grants the Raiment of Valor, the Grand Champion title, and fans screaming your name!',
    goldReward: 1000
  }
];

export const IMPERIAL_CITY_DAY_ONE_TASKS: ImperialCityTask[] = [
  {
    id: 'edgars_spells',
    district: 'Market District',
    merchantOrPlace: "Edgar's Discount Spells (Opposite The Gilded Carafe)",
    budgetCostOrGain: 'Costs ~35 - 50 Gold',
    goal: 'Buy Shocking Touch (Destruction) and/or Minor Heal',
    detailedAction: 'Walk into Edgar Vautrine\'s shop in the Market District. Do NOT buy expensive ball spells (like Flare or Fireball)—they cost double the Magicka! Buy "Shocking Touch" (or Spark). Touch spells cost almost no Magicka and deal rapid burst damage that pairs right into a sword strike.',
    priority: 'Under 50 Gold'
  },
  {
    id: 'alchemy_mortar',
    district: 'Market District & Guildhalls',
    merchantOrPlace: 'The Gilded Carafe / Free in any Mages Guild',
    budgetCostOrGain: '10 Gold (or 0 Gold if stolen/picked up)',
    goal: 'Acquire a Novice Mortar & Pestle',
    detailedAction: 'Check Claudette Perrick at The Gilded Carafe for a cheap Novice Mortar & Pestle (~10g). Alternatively, visit the Arcane University lobby or the Chorrol Mages Guild and pick one off the desks. Having this in your inventory lets you brew potions anywhere in the world on the fly.',
    priority: 'Under 50 Gold'
  },
  {
    id: 'repair_hammers',
    district: 'Market District',
    merchantOrPlace: 'A Fighting Chance (Rohssan the Redguard)',
    budgetCostOrGain: 'Costs ~18 Gold (3 hammers @ 6g each)',
    goal: 'Buy 3-4 Repair Hammers to keep blade at 100% condition',
    detailedAction: 'In Oblivion, a damaged sword deals significantly less damage! When your weapon health drops to 50%, you hit like a wet noodle. Keeping 3 repair hammers in your bag lets you tap your weapon back to 100% after every skirmish, which also quietly levels your Armorer skill toward +Endurance.',
    priority: 'Under 50 Gold'
  },
  {
    id: 'pawn_sewer_clutter',
    district: 'Market District',
    merchantOrPlace: 'The Copious Coinpurse (Thoronir) or The Best Defense',
    budgetCostOrGain: 'Free Profit (+40 to 80 Gold)',
    goal: 'Pawn all sewer goblin shields, iron daggers & pewter tableware',
    detailedAction: 'Sell everything you picked up in the opening sewers except your lockpicks, torch, mortar, and best longsword. Goblin leather shields, blunt iron maces, and heavy iron boots will only encumber you and slow down your Athletics sprint speed.',
    priority: 'Free Profit'
  },
  {
    id: 'arena_registration',
    district: 'Arena District',
    merchantOrPlace: 'The Bloodworks (Owyn the Blademaster)',
    budgetCostOrGain: 'Free Equipment (+0 Gold)',
    goal: 'Join the Arena & claim the Raiment of Strife (Light Armor)',
    detailedAction: 'Walk down the ramp into the Arena Bloodworks. Speak with Owyn. Ask to join. Pick the LIGHT Raiment of Strife (do not pick Heavy; it will overburden your speed and drain fatigue). This gives you a full combat uniform with zero repair cost needed right now.',
    priority: 'Immediate (0 Gold)'
  },
  {
    id: 'arena_basin_heal',
    district: 'Arena District',
    merchantOrPlace: 'The Bloodworks Salt Water Basin',
    budgetCostOrGain: '0 Gold (Infinite Free Use)',
    goal: 'Use the magical wash basin for instant 100% Health restoration',
    detailedAction: 'In the corner of the Arena Bloodworks stands a stone basin with steaming water. Clicking this basin completely refills your Health bar to 100% without using potions or resting. Between Arena matches, step over and click it!',
    priority: 'Immediate (0 Gold)'
  },
  {
    id: 'chapel_fast_travel_refuel',
    district: 'Any County City (Chorrol, Cheydinhal, Bruma)',
    merchantOrPlace: 'Great Chapels (e.g., Great Chapel of Stendarr in Chorrol)',
    budgetCostOrGain: '0 Gold (Instant 100% Mana Refill)',
    goal: 'Fast-Travel to Chorrol/Cheydinhal Chapel for 100% Free Magicka Refill',
    detailedAction: 'THE IMPERIAL CITY TRAP: The Temple of the One in the Imperial City is an empty ceremonial dome for the Emperor and Dragonfires—it has NO blessing altars! The Imperial City is the only city without a Great Chapel. Whenever Julia needs full mana, open the map and fast-travel to Chorrol, Cheydinhal, or Bruma. The Great Chapel is 10 steps inside the gate. Click the central altar: instant 100% Magicka refuel, attribute repair, and disease cure for 0 gold!',
    priority: 'Immediate (0 Gold)'
  },
  {
    id: 'ayleid_well_or_wayshrine',
    district: 'Red Ring Road (Just outside IC walls)',
    merchantOrPlace: 'Wilderness Wayshrines & Ayleid Wells (e.g. outside Talos Bridge / Weye)',
    budgetCostOrGain: '0 Gold (Field Refuel)',
    goal: 'Use glowing blue Ayleid Wells & roadside Wayshrines outside city gates',
    detailedAction: 'If you don\'t want to fast-travel to another city, walk outside the IC bridge onto the Red Ring Road. Look for the circular Wayshrines of the Nine (like Stendarr or Akatosh near Weye), or glowing blue Ayleid Wells (like near the sewer exit/Vilverin). Ayleid Wells restore 400 Magicka instantly and grant +50 Fortify Magicka for 2 minutes!',
    priority: 'Immediate (0 Gold)'
  },
  {
    id: 'gray_prince_hook',
    district: 'Arena District',
    merchantOrPlace: 'Agronak gro-Malog (The Gray Prince) in the Bloodworks',
    budgetCostOrGain: 'Quest Hook (Free 1000 Gold Endgame Setup)',
    goal: 'Speak with Agronak to trigger the "Origin of the Gray Prince" quest',
    detailedAction: 'Find the giant pale Orc training against a practice dummy. Ask him about his noble heritage. He gives you the key to Crowhaven (a ruined vampire estate west of Anvil). Do not go to Crowhaven immediately, but accept the quest now so you have the key ready when exploring the Gold Coast!',
    priority: 'Immediate (0 Gold)'
  }
];

export const ACTIONABLE_QUEST_GUIDES: ActionableQuestGuide[] = [
  {
    id: 'honorblade_of_chorrol',
    title: 'The Honorblade of Chorrol (Free Ebony 0-Weight Longsword)',
    subtitle: 'How to claim a 23-damage endgame weapon at Level 1 without spending a coin',
    recommendedLevel: 'Level 1 – 3 (Can be done immediately!)',
    whyDoThisNow: 'Normally at Level 1, enemies drop rusty Iron Longswords (base 6 damage). The Honorblade deals 23 base damage—equivalent to an Ebony Claymore! Best of all: because it is flagged as an active quest item, it weighs 0 lbs in your inventory and CANNOT break in combat.',
    rewardBreakdown: 'Honorblade of Chorrol (Base Damage 23, Weight 0, Indestructible) + ~300 Gold from Jemane brothers.',
    criticalExploitOrWarning: 'CRITICAL WARNING: When you obtain the sword from Redguard Valley Cave, DO NOT RETURN IT to Countess Arriana Valga or Fathis Ules! As long as you leave the quest open, the sword remains a 0-weight, unbreakable god-tier weapon that Julia can wield for the next 15 levels.',
    steps: [
      {
        stepNumber: 1,
        location: 'Chorrol (The Grey Mare Tavern or Great Oak Tree)',
        objective: 'Speak with Guillbert Jemane to start "Separated at Birth"',
        actionableDetail: 'Fast travel to Chorrol (or walk northwest from the Imperial City). In the town square by the massive oak tree, enter The Grey Mare tavern. Talk to an Imperial commoner named Guillbert Jemane. He mentions that people keep mistaking him for a drunk in Cheydinhal.',
        proTip: 'While in Chorrol, harvest blue flax seeds outside the south gate.'
      },
      {
        stepNumber: 2,
        location: 'Cheydinhal (Newlands Lodge or The Cheydinhal Bridge)',
        objective: 'Locate Reynald Jemane in Cheydinhal',
        actionableDetail: 'Fast travel across to Cheydinhal on the eastern side of Cyrodiil. Go to Newlands Lodge (or the local tavern). Speak to Reynald Jemane. Give him 50 gold to clear his tab, then inform him that his long-lost twin brother Guillbert is living in Chorrol.',
        proTip: 'Use a Beguile scroll or Charm spell if your Speechcraft minigame isn\'t high enough.'
      },
      {
        stepNumber: 3,
        location: 'Chorrol -> Weatherleah (South of Chorrol)',
        objective: 'Reunite the twins and accept "Legacy Lost"',
        actionableDetail: 'Return to Chorrol. Watch the brothers joyfully reunite in the town square. Talk to Guillbert again to receive "Legacy Lost". He asks you to travel south into the Great Forest to reclaim their family estate, Weatherleah, which has been overrun by "monsters".',
        proTip: 'The "monsters" are 3 ogres. Ogres hit very hard in melee, but move slowly.'
      },
      {
        stepNumber: 4,
        location: 'Weatherleah Estate Ruins',
        objective: 'Slay the 3 Weatherleah Ogres (Kiting Strategy)',
        actionableDetail: 'Approach Weatherleah. You will spot 3 Redguard Valley Ogres wandering the ruins. Do NOT run up and trade sword swings! Use your high Acrobatics: jump on top of the ruined stone foundation walls or boulders where the ogres cannot climb. Cast Shocking Touch or poison arrows until all three collapse.',
        proTip: 'Ogres have weakness to Shock damage—Sennecca\'s shock spells will melt them in seconds!'
      },
      {
        stepNumber: 5,
        location: 'Chorrol (Oak and Crosier Tavern)',
        objective: 'Complete Legacy Lost & Meet Fathis Ules for "Sins of the Father"',
        actionableDetail: 'Return to Chorrol and tell Guillbert the estate is cleared. He rewards you with gold. Immediately step over to the Oak and Crosier tavern. An Imperial gentleman in expensive robes named Fathis Ules will flag you down and tell you about the Jemane father\'s stolen relic: the Honorblade of Chorrol.',
        proTip: 'Fathis marks Redguard Valley Cave directly on your map.'
      },
      {
        stepNumber: 6,
        location: 'Redguard Valley Cave (Just south of Chorrol)',
        objective: 'Retrieve the Honorblade from the Ogre Chieftain',
        actionableDetail: 'Enter Redguard Valley Cave. Slay 2 small ogres inside the first chamber. In the back cavern sits the Ogre Chieftain. Bait him into swinging, back-step, and cast Shocking Touch while slashing with your blade. Search his corpse to loot the glowing Honorblade of Chorrol!',
        proTip: 'Make sure your health is topped off before entering the chieftain\'s chamber.'
      },
      {
        stepNumber: 7,
        location: 'YOUR INVENTORY (Forever)',
        objective: 'KEEP THE SWORD! DO NOT TURN IN THE QUEST!',
        actionableDetail: 'Walk out of the cave. Notice in your inventory: the Honorblade has a purple quest icon next to it. Its weight shows 0 lbs! It has 23 base damage! Do NOT talk to the Countess or Fathis Ules. Equip it on Sennecca—you now wield the strongest early-game weapon in Cyrodiil.',
        proTip: 'If you ever get sent to jail, quest items are NEVER confiscated by guards!'
      }
    ]
  },
  {
    id: 'kvatch_siege_level_1',
    title: 'The Siege of Kvatch & Escape to Cloud Ruler Temple',
    subtitle: 'Why clearing Kvatch at Level 1 is a genius move, and how to execute it effortlessly',
    recommendedLevel: 'Level 1 – 2 (The golden window)',
    whyDoThisNow: 'Enemy leveling in Oblivion is notorious: if you wait until Level 10 to visit Kvatch, the gates swarm with high-tier Daedroth, Spider Daedra, and Dremora Valkynaz that can kill Martin in two hits. At Level 1, the gate ONLY spawns low-tier Scamps and Stunted Scamps with 30-45 HP. It is an absolute breeze.',
    rewardBreakdown: 'First Sigil Stone (Enchantment) + Brother Martin Escort + Free Blades Akaviri Katanas & Armor at Cloud Ruler Temple + Pausing all random Oblivion Gate spawns.',
    criticalExploitOrWarning: 'Once Martin is inside Cloud Ruler Temple, the main story safely pauses! No random Oblivion Gates will clutter Cyrodiil\'s landscape until you choose to report back to Jauffre.',
    steps: [
      {
        stepNumber: 1,
        location: 'Kvatch Camp (Base of the Hill)',
        objective: 'Fast travel to Kvatch and sprint up to the burning gates',
        actionableDetail: 'Open your world map, select the Kvatch marker in southwest Cyrodiil, and fast travel. You will arrive at a refugee camp. Speak to Hirtel running down the hill if you wish, then follow the winding stone road up to the flaming city entrance.',
        proTip: 'Pick any Flax and Nightshade along the winding road for alchemy.'
      },
      {
        stepNumber: 2,
        location: 'Kvatch Gate Barricade',
        objective: 'Meet Captain Savlian Matius & Volunteer to close the Gate',
        actionableDetail: 'Speak with Captain Savlian Matius standing behind the barricade in Imperial Watch armor. He explains that Daedra pour out of a giant fiery portal blocking the city gates. Volunteer to enter the Oblivion Gate.',
        proTip: 'Before jumping in, cast any Shield buff or drink a Restore Fatigue potion.'
      },
      {
        stepNumber: 3,
        location: 'The Realm of Oblivion (The Deadlands)',
        objective: 'Sprint through the Deadlands to the Great Tower (The Blood Feast)',
        actionableDetail: 'Step through the gate into Mehrunes Dagon\'s realm. At Level 1, only small red Scamps wander the lava fields. Do NOT waste time fighting every scamp in the field! Use Sennecca\'s high Athletics to sprint along the stone road towards the towering central citadel (The Blood Feast).',
        proTip: 'Scamps cast weak fireballs. Because of your Atronach stone, 50% of their fireballs will heal your Magicka bar to full!'
      },
      {
        stepNumber: 4,
        location: 'The Blood Feast Tower -> Sigillum Sanguis',
        objective: 'Climb the spiral ramps, slay the Sigil Keeper & Claim the Sigil Stone',
        actionableDetail: 'Enter the main tower doors. Follow the winding ramp up through the Corridors of Dark Salvation. Enter the top chamber: Sigillum Sanguis. Slay the Dremora Sigil Keeper. Walk up to the blinding pillar of cosmic fire in the center and click "Activate Sigil Stone". The realm collapses in white light!',
        proTip: 'Save your game right before clicking the Sigil Stone; you can reload to get a Shock or Feather enchantment roll!'
      },
      {
        stepNumber: 5,
        location: 'Kvatch Courtyard -> Chapel of Akatosh',
        objective: 'Help Savlian breach the city and rescue Brother Martin',
        actionableDetail: 'You materialize back in Cyrodiil with the closed gate smoking behind you. Talk to Savlian Matius. Charge into the city with the guards. Defeat 3 Scamps, enter the Great Chapel of Akatosh, and find Brother Martin (the priest in brown robes with the voice of Sean Bean).',
        proTip: 'Talk to Martin, choose "I am here to rescue you", and ask him to follow.'
      },
      {
        stepNumber: 6,
        location: 'Weynon Priory (Chorrol)',
        objective: 'Escort Martin to Jauffre & survive the Mythic Dawn ambush',
        actionableDetail: 'Fast travel with Martin back to Weynon Priory near Chorrol. The Priory is being attacked by Mythic Dawn cultists in red bound armor! Run into the chapel, help Jauffre kill the two assassins, and loot their Mythic Dawn Commentaries books (worth 100 gold each).',
        proTip: 'Martin is an "Essential" NPC: if his health hits zero, he only falls unconscious and gets back up after 10 seconds. He cannot die permanently!'
      },
      {
        stepNumber: 7,
        location: 'Cloud Ruler Temple (Bruma Jerall Mountains)',
        objective: 'Arrive at Cloud Ruler Temple & claim the Blades Free Armory',
        actionableDetail: 'Ride north with Jauffre and Martin to Cloud Ruler Temple, the ancient Akaviri fortress nestled in the snowy mountains above Bruma. Once inside, Martin is crowned Emperor by the Blades. You are now free to raid the fortress!',
        proTip: 'Head to the East Wing Armory: loot multiple Akaviri Katanas (0 gold, high attack speed) and a full set of Blades Armor from the weapon racks.'
      }
    ]
  },
  {
    id: 'agronak_gray_prince_hack',
    title: 'The Gray Prince Pacifist Arena Championship',
    subtitle: 'How to claim 1,000 Gold, the Raiment of Valor, and Grand Champion without a scratch',
    recommendedLevel: 'Level 5 – 8 (Once ready to finish the Arena)',
    whyDoThisNow: 'Agronak gro-Malog is the toughest melee boss in the entire Arena with massive physical resistance and a heavy warhammer. By discovering the truth about his father before your title match, he completely surrenders in the sands, handing you an effortless victory.',
    rewardBreakdown: '1,000 Gold + Raiment of Valor (Heavy or Light, +10 Personality & Athletics) + "Gray Prince\'s Training" (+3 Blade, Athletics, and Block permanently!).',
    criticalExploitOrWarning: 'Make sure to finish his Crowhaven quest BEFORE challenging him to the Grand Champion match. If you fight him without giving him the journal, he fights at 100% ferocious strength.',
    steps: [
      {
        stepNumber: 1,
        location: 'Imperial City Arena Bloodworks',
        objective: 'Speak with Agronak gro-Malog about his heritage',
        actionableDetail: 'Approach Agronak while he is practicing against his training dummy. Select the dialogue option "Agronak gro-Malog" and then "Heritage". He explains he is of noble blood and gives you the key to his father\'s old castle, Crowhaven.',
        proTip: 'Boost his disposition with a Beguile scroll or persuasion minigame if he refuses to talk.'
      },
      {
        stepNumber: 2,
        location: 'Crowhaven (West of Anvil, on the Gold Coast)',
        objective: 'Travel to Crowhaven and enter the ruined halls',
        actionableDetail: 'Fast travel to Anvil, then ride west along the coastline until you reach the crumbling stone fortress of Crowhaven. Unlock the front iron door with Agronak\'s key. Inside you will find wolves and skeletons.',
        proTip: 'Cast Detect Life to spot enemies around blind corners.'
      },
      {
        stepNumber: 3,
        location: 'Crowhaven Burial Chambers',
        objective: 'Find Lord Lovidicus and retrieve his journal',
        actionableDetail: 'Descend into the burial chambers. You will encounter Lord Lovidicus—who is not a noble hero, but an ancient, starved vampire! Slay him with Shock spells (he is fragile), then search the wooden desk in his private alcove to pick up "Journal of the Lord Lovidicus".',
        proTip: 'Check the wooden chests in his chamber for rare gemstones and potions.'
      },
      {
        stepNumber: 4,
        location: 'Arena Bloodworks (Imperial City)',
        objective: 'Deliver the tragic journal to Agronak',
        actionableDetail: 'Return to the Imperial City. Hand the journal to Agronak. He reads it in horror, discovering that he is the son of an undead vampire monster. He gives you "Gray Prince\'s Training" (+3 to Blade, Athletics, and Block permanently!) and falls into deep despair.',
        proTip: 'These +3 skill points count as permanent buffs and do not mess up your leveling multiplier!'
      },
      {
        stepNumber: 5,
        location: 'The Arena Sands (Grand Champion Title Match)',
        objective: 'Challenge Agronak for the Grand Championship',
        actionableDetail: 'Speak to Ysabel Andronicus to schedule the Grand Champion match. Pick your arena name. Walk out onto the bloody sands. Agronak approaches you, refuses to draw his weapon, and weeps: "Please, end my life. I cannot live knowing what I am."',
        proTip: 'You can strike him with your sword or spells without taking a single point of damage.'
      },
      {
        stepNumber: 6,
        location: 'Arena Bloodworks -> Freedom',
        objective: 'Collect 1,000 Gold, the Raiment of Valor, and Your Adoring Fan',
        actionableDetail: 'Collect your 1,000 Gold purse from Ysabel. Equip the Raiment of Valor. As you walk out of the Arena gate, an enthusiastic blond Wood Elf with a yellow bowl cut will run up: "By Azura, by Azura, by Azura! It\'s the Grand Champion!" Your journey as Cyrodiil\'s greatest gladiator is complete!',
        proTip: 'You can tell the Adoring Fan to "Wait here" at the arena entrance so he doesn\'t follow you into monster dungeons.'
      }
    ]
  }
];

export const MAGES_RECOMMENDATION_GUIDES: MagesRecommendationStep[] = [
  {
    city: 'Chorrol',
    stewardName: 'Teekeeus (Argonian)',
    questName: 'Fingers of the Mountain',
    objective: 'Retrieve the rare ancient spellbook from Cloud Top mountain',
    walkthrough: 'Speak to Teekeeus, then speak to his rival Earana outside the Great Oak tree. Head to Cloud Top mountain, loot the charred corpse for the book "Fingers of the Mountain". Give the book to Teekeeus first for the recommendation! Then steal it back from his desk and give it to Earana with a Welkynd Stone to learn the powerful shock spell.',
    lootOrSpellReward: 'Fingers of the Mountain Shock Spell (Scales with level)',
    warningOrTrick: 'Do NOT give the book to Earana first, or Teekeeus will delay your recommendation until you steal it back!'
  },
  {
    city: 'Cheydinhal',
    stewardName: 'Falcar (Altmer / Secret Necromancer)',
    questName: 'Cheydinhal Recommendation (The Well)',
    objective: 'Retrieve the lost Ring of Burden from the Mages Guild well',
    walkthrough: 'Falcar orders you to retrieve a ring from the well in the courtyard. Speak to Deetsan first—she secretly hands you a Buoyancy spell (Water Breathing + Feather). Unlock the well. The Ring of Burden weighs 150 lbs! If you are carrying too much loot, picking it up will pin you to the bottom of the well. Drop heavy weapons before grabbing it.',
    lootOrSpellReward: 'Buoyancy Spell (Water Breathing)',
    warningOrTrick: 'Falcar flees when discovered to be a necromancer; check his basement dresser for Black Soul Gems to finish the quest with Deetsan!'
  },
  {
    city: 'Anvil',
    stewardName: 'Carahil (Altmer)',
    questName: 'Anvil Recommendation (Rogue Mage)',
    objective: 'Investigate merchant murders along the Gold Road',
    walkthrough: 'Carahil asks you to investigate killings on the road to Kvatch. Travel to the Brina Cross Inn. Speak with Arielle Jurard. Pose as an unarmed merchant and sleep in the inn. Next morning, walk along the road toward Kvatch. Caminalda, the rogue mage, ambushes you. Carahil\'s battlemages will jump out of the bushes and help you kill her.',
    lootOrSpellReward: 'Frost Shell Scroll & 3 Frost Potions',
    warningOrTrick: 'Caminalda uses frost magic—your Atronach stone will absorb her frost bolts with a 50% chance!'
  },
  {
    city: 'Bruma',
    stewardName: 'Jeanne Frasoric',
    questName: 'Bruma Recommendation (The Invisible Khajiit)',
    objective: 'Find the "missing" guild member J\'skar',
    walkthrough: 'Jeanne Frasoric is incompetent and complains that J\'skar has vanished. Speak with Volanaro. He admits it is an ongoing guild prank! Agree to play along: steal Jeanne\'s book "Manual of Spellcraft" from her private desk. Hand it to Volanaro. He dispels J\'skar\'s permanent invisibility in front of Jeanne.',
    lootOrSpellReward: 'Dispel & Minor Invisibility Scrolls',
    warningOrTrick: 'Do NOT attack J\'skar while he is invisible! He is marked as an ally.'
  },
  {
    city: 'Bravil',
    stewardName: 'Kud-Ei (Argonian)',
    questName: 'Bravil Recommendation (Ardaline\'s Staff)',
    objective: 'Retrieve Ardaline\'s stolen Mages Staff from Varon Vamori',
    walkthrough: 'Kud-Ei hands you a Beguile scroll to charm Varon Vamori. Find Varon in the Bravil guildhall or Silverhome on the Water. Cast Beguile to boost his disposition to 70+. He confesses he sold the staff to Soris Arenim in the Imperial City Talos Plaza. Travel to the Imperial City, buy the staff back for 200g (or charm Soris\'s wife to get the basement key for free), and return it to Kud-Ei.',
    lootOrSpellReward: 'Beguile Charm Scroll & Kud-Ei\'s Recommendation',
    warningOrTrick: 'Do NOT strike Varon Vamori; speechcraft and charm spells make this 100% non-violent.'
  },
  {
    city: 'Leyawiin',
    stewardName: 'Dagail (Elder Altmer)',
    questName: 'Leyawiin Recommendation (The Seer\'s Stone)',
    objective: 'Restore Dagail\'s psychic visions by recovering her father\'s stone',
    walkthrough: 'Dagail suffers from migraine visions because her Seer\'s Stone is missing. Speak with Agata. Talk to Kalthar, who acts suspicious. Travel to Fort Carmala (south of Leyawiin). Slay the scamps/rats inside to find the coffin of Dagail\'s father. Loot the Seer\'s Stone. Kalthar ambushes you at the door—kill him and return the stone to Dagail.',
    lootOrSpellReward: 'Seer\'s Stone Vision Buff',
    warningOrTrick: 'Kalthar is a necromancer traitor who casts lightning spells; cast Shocking Touch before he charges his staff!'
  },
  {
    city: 'Skingrad',
    stewardName: 'Adrienne Berene',
    questName: 'Skingrad Recommendation (Bleak Flats Cave)',
    objective: 'Rescue Erthor from Bleak Flats Cave',
    walkthrough: 'Adrienne Berene needs Erthor back before she will write your recommendation. Speak with Druja or Sulinus Vassinus to get Erthor\'s location: Bleak Flats Cave (northwest of Skingrad). Inside, kill 7 Deranged Zombies. Speak with Erthor in the back room and escort him out to the Skingrad guildhall.',
    lootOrSpellReward: 'Access to Arcane University (Once all 7 are done!)',
    warningOrTrick: 'Zombies are weak to Fire and resist Frost. Use basic fire spells or your torch to stagger them.'
  }
];

export const WHY_THIS_CODEX_EXISTS = {

  dedicationTitle: 'To Sennecca: The Golden Bridge to Tamriel',
  authorNote: 'Written by Drew — 15-Year Lore Keeper, Bozog the Skullcrusher, and Devoted Husband',
  lorePhilosophy: `When you step out of the Imperial Prison sewers into the warm Cyrodiil sunlight, 
something quietly magical happens. Unlike newer games that flatten speed, strip out schools of magic, 
and paint every mountain in desaturated steel-grey, Oblivion is a lush, painterly watercolor dream. 
It is a true sandbox: a world where you can pick wildflowers along the West Weald, jump across rooftops in the Waterfront, 
charm guards with sweet-talk minigames, and craft spells that can literally break the laws of physics.

This Codex was built as a bridge into my greatest gaming passion. For 15 years, I have studied the metaphysical sermons 
of Lord Vivec, debated the cyborg origins of Pelinal Whitestrake, and chronicled the tragic betrayal of Lord Nerevar. 
Watching you fall in love with the Imperial City, looting every chest with that same sharp survival instinct 
you mastered in Resident Evil Village, showed me that you don't just play games—you inhabit them.

You picked the Atronach stone all on your own: a sign reserved only for the boldest sorcerers in Tamriel history. 
This grimoire is your personal roadmap from a penniless sewer survivor to an invincible, spell-absorbing demigod. 
Take your time, explore every stone, and remember: when the world feels too big, the chapel altars are always free.`,
  coreTenets: [
    'The Freedom of the Sandbox: There is no "wrong" way to play. If you want to spend 3 hours picking blue Flax seeds and brewing potions, you are becoming a master alchemist.',
    'A World with Real Physics: Acrobatics and Athletics matter. You can jump over enemies\' heads, sprint across water, and turn combat into a dance.',
    'Magic Without Training Wheels: You aren\'t locked into pre-made classes. Your blade and your spells work as one harmonized engine.',
    'A Shared Universe: In Oblivion you walk among the Septims; in Skyrim you walk among their ruins; in Morrowind you become a living god.'
  ]
};
