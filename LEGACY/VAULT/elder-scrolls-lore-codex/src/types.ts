export type LoreCategory = 
  | 'vivec'
  | 'gods'
  | 'characters'
  | 'races'
  | 'artifacts'
  | 'cyrodiil_guide'
  | 'metaphysics';

export interface LoreQuote {
  text: string;
  source: string;
  speaker?: string;
}

export interface ArtifactEntry {
  id: string;
  name: string;
  subtitle: string;
  godOrCreator: string;
  godId: string;
  type: 'Weapon' | 'Armor' | 'Cosmic Key / Relic' | 'Grimoire / Tome' | 'Divine Jewelry';
  iconName: string;
  gamesFeatured: ('Morrowind' | 'Oblivion' | 'Skyrim' | 'ESO')[];
  inGameEffect: string;
  canonicalContinuity: string; // The "Final Fantasy vs Elder Scrolls" canon explanation
  kirkbrideStickyNoteLore: string; // The bizarre deep metaphysical origins
  oblivionLocation: string; // Where his wife can find it right now in Cyrodiil
  whyItMatters: string;
  quotes?: LoreQuote[];
  tags: string[];
}

export interface LoreEntry {
  id: string;
  title: string;
  subtitle: string;
  category: LoreCategory;
  era?: string;
  alignment?: string;
  summary: string;
  deepLore: string;
  beginnerNote?: string; // Crafted for the wife's Oblivion exploration!
  quotes?: LoreQuote[];
  tags: string[];
  crossReferences?: string[]; // IDs of related entries
  affinity?: 'gold-chimer' | 'ash-dunmer' | 'aedric' | 'daedric' | 'imperial' | 'metaphysical' | 'beast';
  imageUrl?: string;
  kirkbrideScore?: number; // 1 to 5 scale of Kirkbride metaphysical weirdness
}

export interface DistrictInfo {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  lootingSpotlight: string;
  deepLoreSecret: string;
  charactersPresent: string[];
}

export interface DualityAspect {
  title: string;
  nature: string;
  skinTone: string;
  colorHex: string;
  symbol: string;
  philosophies: string[];
  keyAttributes: string[];
  historicalAct: string;
  quote: string;
}
