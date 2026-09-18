import { Gem, CavernTheme, MinerPerk, MinerClassType, PlayerProgression } from '../types';

export const GEM_CATALOG: Gem[] = [
  // Common Minerals
  {
    id: 'ruby',
    name: 'Pyre Ruby',
    color: '#ef4444',
    freq: 523.25,
    pitchNote: 'C5',
    rarity: 'Common',
    description: 'Blazing corundum formed under volcanic heat in deep thermal chimneys.',
    baseXp: 60,
    cavernThemeId: 'magma',
  },
  {
    id: 'topaz',
    name: 'Sun Citrine',
    color: '#f59e0b',
    freq: 783.99,
    pitchNote: 'G5',
    rarity: 'Common',
    description: 'Golden quartz crystals that capture and refract cavern luminescence with solar warmth.',
    baseXp: 75,
    cavernThemeId: 'verdant',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    color: '#fbbf24',
    freq: 622.25,
    pitchNote: 'D#5',
    rarity: 'Common',
    description: 'Fossilized subterranean resin holding ancient luminous spores.',
    baseXp: 85,
    cavernThemeId: 'magma',
  },

  // Uncommon Minerals
  {
    id: 'emerald',
    name: 'Verdant Emerald',
    color: '#10b981',
    freq: 659.25,
    pitchNote: 'E5',
    rarity: 'Uncommon',
    description: 'A deep forest green beryl specimen vibrating with organic mineral harmonics.',
    baseXp: 120,
    cavernThemeId: 'verdant',
  },
  {
    id: 'sapphire',
    name: 'Abyssal Sapphire',
    color: '#3b82f6',
    freq: 587.33,
    pitchNote: 'D5',
    rarity: 'Uncommon',
    description: 'Lustrous azure gemstone dredged from subterranean aquatic rift beds.',
    baseXp: 140,
    cavernThemeId: 'abyssal',
  },
  {
    id: 'pearl',
    name: 'Moonstone Pearl',
    color: '#38bdf8',
    freq: 739.99,
    pitchNote: 'F#5',
    rarity: 'Uncommon',
    description: 'Opalescent mineral orb harvested from subterranean tidal limestone pools.',
    baseXp: 155,
    cavernThemeId: 'abyssal',
  },

  // Rare Minerals
  {
    id: 'amethyst',
    name: 'Starlight Amethyst',
    color: '#8b5cf6',
    freq: 880.00,
    pitchNote: 'A5',
    rarity: 'Rare',
    description: 'Translucent violet druzy attuned to subterranean magnetic ley lines.',
    baseXp: 220,
    cavernThemeId: 'prismatic',
  },
  {
    id: 'heliodor',
    name: 'Infernal Heliodor',
    color: '#ea580c',
    freq: 932.33,
    pitchNote: 'A#5',
    rarity: 'Rare',
    description: 'Radiant golden beryl forged in magma cauldrons that warms the hands.',
    baseXp: 240,
    cavernThemeId: 'magma',
  },
  {
    id: 'jade',
    name: 'Jade Monolith',
    color: '#059669',
    freq: 698.46,
    pitchNote: 'F5',
    rarity: 'Rare',
    description: 'Ancient imperial jade preserved inside petrified roots beneath the earth.',
    baseXp: 260,
    cavernThemeId: 'verdant',
  },

  // Legendary Minerals
  {
    id: 'diamond',
    name: 'Prismatic Diamond',
    color: '#f8fafc',
    freq: 1046.50,
    pitchNote: 'C6',
    rarity: 'Legendary',
    description: 'The crowning jewel of the deep earth: an octahedron diamond of flawless clarity.',
    baseXp: 420,
    cavernThemeId: 'prismatic',
  },
  {
    id: 'bismuth',
    name: 'Rainbow Bismuth',
    color: '#ec4899',
    freq: 1174.66,
    pitchNote: 'D6',
    rarity: 'Legendary',
    description: 'Geometric stepped hopper crystal displaying an iridescent spectrum of iridescent hues.',
    baseXp: 450,
    cavernThemeId: 'prismatic',
  },
  {
    id: 'abyssal_tear',
    name: 'Tears of the Deep',
    color: '#06b6d4',
    freq: 1318.51,
    pitchNote: 'E6',
    rarity: 'Legendary',
    description: 'Mythical liquid-core crystal found only at the oceanic subterranean trench bottom.',
    baseXp: 480,
    cavernThemeId: 'abyssal',
  },
];

// Cavern Themes
export const CAVERN_THEMES: Record<string, CavernTheme> = {
  granite: {
    id: 'granite',
    name: 'Granite Shallows',
    title: 'Strata 1: Subterranean Granite',
    description: 'Dense sedimentary bedrock with interspersed quartz veins and mineral deposits.',
    strataName: 'Shallow Bedrock',
    bgGradStart: '#211e1d',
    bgGradMid: '#161413',
    bgGradEnd: '#0d0c0b',
    rockColors: ['#292524', '#262322', '#211e1d', '#2c2826'],
    fissureColor: '#44403c',
    accentColor: '#f59e0b',
    particleColor: '#a8a29e',
    modifierName: 'Stable Bedrock',
    modifierDescription: 'Standard geological conditions with balanced mineral distributions.',
    uniqueGemIds: ['ruby', 'topaz', 'emerald', 'sapphire'],
    musicalScale: [220, 261.63, 293.66, 329.63, 392.00, 440], // A minor pentatonic
    musicTone: 'deep_drone',
  },
  magma: {
    id: 'magma',
    name: 'Molten Magma Fissure',
    title: 'Thermal Core: Magma Fissure',
    description: 'A scorching chasm coursing with basalt shelves, glowing sulfur, and molten obsidian.',
    strataName: 'Thermal Caldera',
    bgGradStart: '#2a110b',
    bgGradMid: '#1c0b07',
    bgGradEnd: '#0f0504',
    rockColors: ['#2e1f1d', '#281714', '#20110e', '#361e18'],
    fissureColor: '#ef4444',
    accentColor: '#f97316',
    particleColor: '#f97316',
    modifierName: 'Volcanic Brittleness',
    modifierDescription: 'Intense subterranean thermal pressure causes rocks to crack 20% faster.',
    uniqueGemIds: ['ruby', 'amber', 'heliodor'],
    musicalScale: [146.83, 174.61, 196.00, 220.00, 261.63, 293.66], // D Phrygian/Minor
    musicTone: 'volcanic',
  },
  abyssal: {
    id: 'abyssal',
    name: 'Luminescent Abyssal Grotto',
    title: 'Sunken Vault: Abyssal Grotto',
    description: 'Flooded subterranean cavern lit by cyan bioluminescence, dripping stalactites, and azure minerals.',
    strataName: 'Aquatic Trench',
    bgGradStart: '#081e28',
    bgGradMid: '#05141c',
    bgGradEnd: '#020a0f',
    rockColors: ['#132832', '#0e1f28', '#162e3a', '#10222d'],
    fissureColor: '#06b6d4',
    accentColor: '#38bdf8',
    particleColor: '#38bdf8',
    modifierName: 'Hydro-Resonance',
    modifierDescription: 'Echo Geodes resonate with tidal pressure, granting +2 additional cascade strikes.',
    uniqueGemIds: ['sapphire', 'pearl', 'abyssal_tear'],
    musicalScale: [164.81, 196.00, 220.00, 246.94, 293.66, 329.63], // E minor aquatic
    musicTone: 'aquatic',
  },
  prismatic: {
    id: 'prismatic',
    name: 'Prismatic Crystal Chasm',
    title: 'Crystalline Spire: Prismatic Chasm',
    description: 'An ethereal vault lined with geometric crystal pillars and iridescent light refractions.',
    strataName: 'Leyline Geode',
    bgGradStart: '#1d122b',
    bgGradMid: '#120b1c',
    bgGradEnd: '#0a0610',
    rockColors: ['#281e38', '#211830', '#2d223f', '#1b1427'],
    fissureColor: '#a855f7',
    accentColor: '#ec4899',
    particleColor: '#c084fc',
    modifierName: 'Harmonic Amplification',
    modifierDescription: 'High harmonic resonance boosts all recovered gemstone XP by +50%.',
    uniqueGemIds: ['amethyst', 'diamond', 'bismuth'],
    musicalScale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C Major pentatonic celestial
    musicTone: 'crystal',
  },
  verdant: {
    id: 'verdant',
    name: 'Verdant Overgrowth Hollows',
    title: 'Deep Roots: Verdant Hollows',
    description: 'Ancient cavern intertwined with petrified roots, mossy boulders, and jade-veined rock.',
    strataName: 'Primordial Rootvault',
    bgGradStart: '#102316',
    bgGradMid: '#0a170f',
    bgGradEnd: '#040b07',
    rockColors: ['#1b2d20', '#15251a', '#1e3324', '#111f15'],
    fissureColor: '#10b981',
    accentColor: '#34d399',
    particleColor: '#34d399',
    modifierName: 'Mineral Rich Rootsoil',
    modifierDescription: 'Fertile subterranean strata guarantees at least 1 additional precious gem per wall.',
    uniqueGemIds: ['emerald', 'topaz', 'jade'],
    musicalScale: [196.00, 220.00, 246.94, 293.66, 329.63, 392.00], // G Major earthy
    musicTone: 'earth',
  },
};

// RPG Miner Perks (Build your own miner!)
export const MINER_PERKS: MinerPerk[] = [
  {
    id: 'sledgehammer',
    name: 'Sledgehammer Blow',
    branch: 'Striking',
    description: 'Your heavy swing has a 25% chance to deal 2 hits with a single tap, cracking stone instantly.',
    iconName: 'Hammer',
    effectType: 'sledgehammer',
  },
  {
    id: 'iron_stamina',
    name: 'Iron Lungs',
    branch: 'Stamina',
    description: 'Grants +4 permanent base strikes to your stamina pool for every cavern shaft.',
    iconName: 'Shield',
    effectType: 'iron_stamina',
  },
  {
    id: 'slag_salvager',
    name: 'Slag Refiner',
    branch: 'Stamina',
    description: 'Shattering dull slag has a 40% chance to immediately refund 1 strike.',
    iconName: 'RefreshCw',
    effectType: 'slag_salvager',
  },
  {
    id: 'precision_chisel',
    name: 'Precision Lapidary',
    branch: 'Fortune',
    description: 'Masterful gem recovery technique boosts all gemstone XP rewards by +40%.',
    iconName: 'Sparkles',
    effectType: 'precision_chisel',
  },
  {
    id: 'echo_resonance',
    name: 'Acoustic Harmonic',
    branch: 'Resonance',
    description: 'Echo Geodes award +3 extra strikes and send a shockwave dealing 1 hit to adjacent rocks.',
    iconName: 'Zap',
    effectType: 'echo_resonance',
  },
  {
    id: 'vein_mastery',
    name: 'Deep Vein Sense',
    branch: 'Fortune',
    description: 'Geological instincts guarantee at least +1 additional gemstone embedded in every cavern wall.',
    iconName: 'Gem',
    effectType: 'vein_mastery',
  },
  {
    id: 'tremor_pick',
    name: 'Tremor Strike',
    branch: 'Striking',
    description: 'Every 4th strike releases a subterranean shockwave that cracks all neighboring rocks by 1 hit.',
    iconName: 'Radio',
    effectType: 'tremor_pick',
  },
  {
    id: 'crystal_affinity',
    name: 'Mineral Affinity',
    branch: 'Alchemy',
    description: 'Drastically increases the occurrence rate of Rare and Legendary crystals in all cavern strata.',
    iconName: 'Eye',
    effectType: 'crystal_affinity',
  },
  {
    id: 'keen_instinct',
    name: 'Keen Geologist',
    branch: 'Alchemy',
    description: 'The very first chip (hit 1) immediately reveals the full interior silhouette of any stone.',
    iconName: 'Search',
    effectType: 'keen_instinct',
  },
];

export const CHARACTER_SAVE_KEY = 'minemore_character_v1';
export const INITIAL_VAULT_KEY = 'minemore_vault_v1';
export const DETAILED_VAULT_KEY = 'minemore_vault_detailed_v2';
export const PROGRESSION_SAVE_KEY = 'minemore_rpg_progression_v2';

export const PROSPECTOR_RANKS = [
  'Apprentice Digger',     // Lv 1
  'Vein Tracker',          // Lv 2
  'Rock Cracker',          // Lv 3
  'Geode Resonance Scout', // Lv 4
  'Deep Spelunker',        // Lv 5
  'Master Prospector',     // Lv 6
  'Gemologist Artisan',    // Lv 7
  'Mythic Earth Delver',   // Lv 8+
];

export function getRankTitle(level: number): string {
  if (level <= PROSPECTOR_RANKS.length) {
    return PROSPECTOR_RANKS[level - 1];
  }
  return `Mythic Earth Delver ${level - PROSPECTOR_RANKS.length + 1}`;
}

export function getXpRequiredForLevel(level: number): number {
  return Math.round(120 * Math.pow(1.28, level - 1));
}

export const INITIAL_PROGRESSION: PlayerProgression = {
  level: 1,
  xp: 0,
  xpToNextLevel: getXpRequiredForLevel(1),
  selectedPerkIds: [],
  pendingPerkChoices: 0,
  stats: {
    totalGemsMined: 0,
    totalSlagMined: 0,
    totalGeodesMined: 0,
    totalExpeditions: 0,
    totalWallsCleared: 0,
    deepestStratum: 1,
    totalXpEarned: 0,
  },
};
