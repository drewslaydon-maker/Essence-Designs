import { EquipmentItem } from '../types';

export const STARTER_ITEMS: EquipmentItem[] = [
  {
    id: 'starter_head',
    name: 'Dented Pot Helm',
    slot: 'head',
    rarity: 'common',
    description: 'A cooking pot with eyeholes gouged out with a rusty butter knife.',
    flavorText: '"Smells faintly of old stew and questionable decisions."',
    iconName: 'Shield',
    stats: {
      barrierShieldBonus: 5,
    },
  },
  {
    id: 'starter_body',
    name: 'Moth-Eaten Robe',
    slot: 'body',
    rarity: 'common',
    description: 'Passed down through 12 generations of failed apprentices.',
    flavorText: '"Has deep pockets, mostly because the lining ripped open."',
    iconName: 'Shirt',
    stats: {
      pocketCapacity: 4,
    },
  },
  {
    id: 'starter_tool',
    name: 'Butter Knife Chisel',
    slot: 'tool',
    rarity: 'common',
    description: 'Strictly not intended for celestial essence transmutation.',
    flavorText: '"It bends if you look at it too firmly."',
    iconName: 'Hammer',
    stats: {
      chiselSpeed: 10,
    },
  },
  {
    id: 'starter_offhand',
    name: 'Cracked Oil Lamp',
    slot: 'offhand',
    rarity: 'common',
    description: 'Flickers violently when abyssal fiends are within 10 paces.',
    flavorText: '"Technically runs on pure hope and stale vegetable oil."',
    iconName: 'Flame',
    stats: {
      minionDamage: 5,
    },
  },
  {
    id: 'starter_pet',
    name: 'Pebble of Encouragement',
    slot: 'pet',
    rarity: 'common',
    description: 'A smooth gray stone with two googly eyes glued on.',
    flavorText: '"It doesn\'t do much, but it believes in you."',
    iconName: 'Smile',
    stats: {
      miningSpeed: 5,
    },
  },
];

export const VENDING_MACHINE_LOOT_POOL: EquipmentItem[] = [
  // HEAD
  {
    id: 'head_bucket_astral',
    name: 'Bucket of Astral Wisdom',
    slot: 'head',
    rarity: 'rare',
    description: 'Upside-down metal bucket that channels celestial frequencies.',
    flavorText: '"You hear the whispering of stars, or maybe just ringing in your ears."',
    iconName: 'Sparkles',
    stats: {
      miningSpeed: 20,
      tokenBonus: 10,
    },
  },
  {
    id: 'head_wizard_sombrero',
    name: 'Grand Sombrero of the Eye',
    slot: 'head',
    rarity: 'epic',
    description: 'Massive embroidered brim provides shade and cosmic clarity.',
    flavorText: '"Abyssal creatures respect the sheer aerodynamic silhouette."',
    iconName: 'Sun',
    stats: {
      chiselSpeed: 25,
      barrierShieldBonus: 15,
      tokenBonus: 15,
    },
  },
  {
    id: 'head_crown_of_anxiety',
    name: 'Tiara of Mild Panic',
    slot: 'head',
    rarity: 'mythic',
    description: 'Glows whenever the Great Guardian takes damage, driving you to peak APM.',
    flavorText: '"Adrenaline is just free haste in a fancy hat."',
    iconName: 'Zap',
    stats: {
      miningSpeed: 35,
      chiselSpeed: 35,
      pocketCapacity: 10,
    },
  },

  // BODY
  {
    id: 'body_bathrobe_eye',
    name: 'Terrycloth Bathrobe of the Eye',
    slot: 'body',
    rarity: 'rare',
    description: 'Ultra-absorbent celestial loungewear with woven arcane eyes.',
    flavorText: '"Peak comfort while standing on the brink of dimensional collapse."',
    iconName: 'Shirt',
    stats: {
      pocketCapacity: 8,
      barrierShieldBonus: 10,
    },
  },
  {
    id: 'body_bubblewrap_armor',
    name: 'Enchanted Bubblewrap Vest',
    slot: 'body',
    rarity: 'epic',
    description: 'Every abyssal blow pops a satisfying pocket of concentrated air runes.',
    flavorText: '"Pop-pop-pop goes the void."',
    iconName: 'ShieldAlert',
    stats: {
      barrierShieldBonus: 25,
      pocketCapacity: 12,
    },
  },
  {
    id: 'body_trenchcoat_contraband',
    name: 'Smuggler\'s Infinite Trenchcoat',
    slot: 'body',
    rarity: 'mythic',
    description: 'Lined with pockets that lead to tiny pocket dimensions.',
    flavorText: '"Hey kid, wanna buy some illicit catalytic runes?"',
    iconName: 'ShoppingBag',
    stats: {
      pocketCapacity: 24,
      critChiselChance: 0.25,
    },
  },

  // TOOL
  {
    id: 'tool_overclocked_chisel',
    name: 'Overclocked Chisel 3000',
    slot: 'tool',
    rarity: 'rare',
    description: 'Fitted with a tiny steam turbine and a confetti launcher on crit.',
    flavorText: '"Safety goggles not included or recommended."',
    iconName: 'Wrench',
    stats: {
      chiselSpeed: 30,
      critChiselChance: 0.15,
    },
  },
  {
    id: 'tool_tactical_spork',
    name: 'Tactical Obsidian Spork',
    slot: 'tool',
    rarity: 'epic',
    description: 'Mines fragments, chisels essence, and stirs lukewarm noodle broth.',
    flavorText: '"Peak multipurpose military-grade utensil."',
    iconName: 'Crosshair',
    stats: {
      miningSpeed: 30,
      chiselSpeed: 30,
      critChiselChance: 0.2,
    },
  },
  {
    id: 'tool_jackhammer_celestial',
    name: 'The Great Guardian\'s Jackhammer',
    slot: 'tool',
    rarity: 'mythic',
    description: 'Vibrates at the exact resonant frequency of the rift stone quarry.',
    flavorText: '"The quarry practically mines itself in terror."',
    iconName: 'Flame',
    stats: {
      miningSpeed: 50,
      chiselSpeed: 45,
      critChiselChance: 0.35,
    },
  },

  // OFFHAND
  {
    id: 'offhand_lantern_excuses',
    name: 'Lantern of Bad Excuses',
    slot: 'offhand',
    rarity: 'rare',
    description: 'Emits a warm bureaucratic light that confuses abyssal walkers.',
    flavorText: '"It politely informs creatures that today is a celestial bank holiday."',
    iconName: 'Lamp',
    stats: {
      minionDamage: 20,
      barrierShieldBonus: 15,
    },
  },
  {
    id: 'offhand_rubber_duck',
    name: 'Debugging Rubber Duck of the Void',
    slot: 'offhand',
    rarity: 'epic',
    description: 'Explaining your crafting rotation to it immediately optimizes minion DPS.',
    flavorText: '"Squeaks with the acoustic frequency of absolute victory."',
    iconName: 'Smile',
    stats: {
      minionDamage: 35,
      tokenBonus: 20,
    },
  },
  {
    id: 'offhand_disco_orb',
    name: 'Celestial Party Beacon',
    slot: 'offhand',
    rarity: 'mythic',
    description: 'Pulses with groovy cosmic lasers that overdrive all summoned guardians.',
    flavorText: '"Ain\'t no party like a Rift sealing party."',
    iconName: 'Music',
    stats: {
      minionDamage: 50,
      barrierShieldBonus: 30,
      tokenBonus: 30,
    },
  },

  // PET
  {
    id: 'pet_sentient_cube',
    name: 'Sentient Essence Cube',
    slot: 'pet',
    rarity: 'rare',
    description: 'A wobbly square of gelatinous astral energy that bounces alongside you.',
    flavorText: '"Purrs whenever you mine an elemental fragment."',
    iconName: 'Box',
    stats: {
      miningSpeed: 20,
      pocketCapacity: 6,
    },
  },
  {
    id: 'pet_mini_golem_tophat',
    name: 'Sir Reginald the Pocket Golem',
    slot: 'pet',
    rarity: 'epic',
    description: 'A 6-inch tall stone guardian wearing a dapper felt top hat and monocle.',
    flavorText: '"He gives hostile abyssals very stern, disapproving looks."',
    iconName: 'Crown',
    stats: {
      minionDamage: 30,
      tokenBonus: 25,
    },
  },
  {
    id: 'pet_void_kitten',
    name: 'Cosmic Abyssal Kitten',
    slot: 'pet',
    rarity: 'mythic',
    description: 'Born from a rift anomaly. Loves chin scratches and swatting void rifts.',
    flavorText: '"If it fits in a celestial portal, it sits."',
    iconName: 'Heart',
    stats: {
      miningSpeed: 35,
      chiselSpeed: 35,
      minionDamage: 35,
      tokenBonus: 35,
    },
  },
];
