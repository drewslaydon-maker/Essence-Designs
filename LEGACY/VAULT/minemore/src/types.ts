export interface Gem {
  id: string;
  name: string;
  color: string;
  freq: number;
  pitchNote: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  description: string;
  baseXp: number;
  cavernThemeId?: string; // Optional affinity to specific cavern
}

export type RockType = 'SLAG' | 'GEM' | 'GEODE';

export interface Vertex {
  x: number;
  y: number;
}

export interface FissureLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Rock {
  id: string;
  x: number;
  y: number;
  radius: number;
  vertices: Vertex[];
  fissures: FissureLine[];
  type: RockType;
  gem: Gem | null;
  hitsTaken: number; // 0 = undamaged, 1 = chipped, 2 = fractured, 3 = shattered
  hitsNeeded: number; // Always 3
  broken: boolean;
  rockColor: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vRot: number;
  alpha: number;
  gravity: number;
  isSpark?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale?: number;
}

export type MinerClassType =
  | 'deep_delver'
  | 'gemologist'
  | 'resonance_mystic'
  | 'tunnel_scavenger';

export interface MinerAppearance {
  helmet: 'classic' | 'horned' | 'goggles' | 'circlet';
  accentColor: string;
  beardStyle: 'clean' | 'stout' | 'braided' | 'visor';
  pickaxeStyle: 'iron' | 'obsidian' | 'dwarven' | 'crystal';
}

export interface CharacterProfile {
  id: string;
  name: string;
  minerClass: MinerClassType;
  appearance: MinerAppearance;
  createdAt: number;
}

export interface MinerPerk {
  id: string;
  name: string;
  branch: 'Striking' | 'Stamina' | 'Fortune' | 'Resonance' | 'Alchemy';
  description: string;
  iconName: string;
  effectType:
    | 'sledgehammer'     // 25% chance of double damage hit
    | 'iron_stamina'     // +4 base strikes
    | 'slag_salvager'    // 40% chance slag refunds 1 strike
    | 'precision_chisel' // +40% gem XP
    | 'echo_resonance'   // Geodes grant +3 extra strikes & shockwave adjacent rocks
    | 'vein_mastery'     // +1 guaranteed gem per wall
    | 'tremor_pick'      // Every 4th tap damages adjacent rocks
    | 'crystal_affinity' // Higher chance of rare/legendary gems
    | 'keen_instinct';   // Hit 1 instantly reveals full interior silhouette
}

export interface CavernTheme {
  id: string;
  name: string;
  title: string;
  description: string;
  strataName: string;
  bgGradStart: string;
  bgGradMid: string;
  bgGradEnd: string;
  rockColors: string[];
  fissureColor: string;
  accentColor: string;
  particleColor: string;
  modifierName: string;
  modifierDescription: string;
  uniqueGemIds: string[];
  musicalScale: number[];
  musicTone: 'deep_drone' | 'volcanic' | 'aquatic' | 'crystal' | 'earth';
}

export interface PlayerStats {
  totalGemsMined: number;
  totalSlagMined: number;
  totalGeodesMined: number;
  totalExpeditions: number;
  totalWallsCleared: number;
  deepestStratum: number;
  totalXpEarned: number;
}

export interface PlayerProgression {
  level: number;
  xp: number;
  xpToNextLevel: number;
  selectedPerkIds: string[]; // Player-chosen RPG perks
  pendingPerkChoices: number; // Queued level-up perk selections
  stats: PlayerStats;
}

export interface VaultState {
  discoveredGems: string[]; // Gem IDs
  gemCounts: Record<string, number>;
  totalExpeditions: number;
  totalStrikesUsed: number;
  deepestStratum: number;
}

export interface ExpeditionState {
  sector: number; // e.g. 1, 2, 3...
  shaftInSector: number; // 1, 2, or 3 (x-1, x-2, x-3)
  currentTheme: CavernTheme;
  expeditionGems: Gem[];
  expeditionGeodes: number;
  expeditionSlag: number;
  expeditionWallsCleared: number;
  expeditionXpGained: number;
}

export type PartyMemberId = 'mage' | 'rogue' | 'warrior';

export interface PartyMember {
  id: PartyMemberId;
  name: string;
  classTitle: string;
  color: string;
  portraitIcon: string;
  rescued: boolean;
  rescueVein: number;
  rescueStory: string;
  sanity: number;
  hunger: number;
  veinUnlocks: number; // e.g. 2 for mage, 3 for rogue, 4 for warrior
  veinUnlockTitle: string;
  perkDescription: string;
  favoriteFoodNote: string;
  currentThought: string;
}

export interface MonsterPart {
  id: string;
  name: string;
  category: 'fauna' | 'fungus' | 'seasoning';
  description: string;
  flavorProfile: string;
  color: string;
  icon: string;
}

export interface CulinaryRecipe {
  id: string;
  name: string;
  mineralIngredient: string; // Gem name or id
  faunaIngredient: string;   // Monster part name or id
  optionalSeasoning?: string;
  dishType: 'Roast' | 'Broth' | 'Stew' | 'Skewers' | 'Fritters' | 'Confection';
  visualColor: string;
  description: string;
  tasteNotes: string;
  sanityRestore: number;
  fatigueRestore: number;
  buffTitle: string;
  buffDescription: string;
  buffType: 'extra_strikes' | 'crit_fracture' | 'sanity_shield' | 'fault_vision' | 'greed_ward';
  buffValue: number;
  buffDurationShafts: number;
  discovered: boolean;
}

export interface ActiveCulinaryBuff {
  id?: string;
  recipeId: string;
  name: string;
  buffTitle: string;
  buffDescription?: string;
  buffType: string;
  buffValue: number;
  shaftsRemaining: number;
}

export interface NewspaperArticle {
  id: string;
  issueNumber: number;
  dateStr: string;
  headline: string;
  subheadline: string;
  bodyParagraphs: string[];
  editorialColumn: string;
  culinaryRumor: string;
  unlockedByDefault: boolean;
  unlockedConditionText: string;
}

export interface DiggerDecoration {
  id: string;
  name: string;
  category: 'bedding' | 'lighting' | 'wall' | 'tabletop';
  description: string;
  cozyBonus: string;
  unlocked: boolean;
  equipped: boolean;
  costGems?: number;
}
