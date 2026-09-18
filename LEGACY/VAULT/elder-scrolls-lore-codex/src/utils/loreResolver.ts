import { LORE_ENTRIES } from '../data/loreData';
import { ARTIFACTS_DATA } from '../data/artifactsData';
import { LoreEntry } from '../types';

export interface UnifiedLoreEntity {
  id: string;
  title: string;
  subtitle: string;
  category: 'gods' | 'races' | 'artifacts' | 'characters' | 'vivec' | 'metaphysics' | 'cyrodiil_guide';
  summary: string;
  deepLore: string;
  beginnerNote?: string;
  oblivionLocation?: string;
  godOrCreator?: string;
  crossReferences: string[];
  tags: string[];
  viewTarget: 'vivec' | 'pantheon' | 'races' | 'artifacts' | 'morrowind' | 'oblivion' | 'deepLore' | 'codex';
}

// Build unified lookup map
const unifiedMap = new Map<string, UnifiedLoreEntity>();

// 1. Ingest Lore Entries
LORE_ENTRIES.forEach((entry) => {
  let viewTarget: UnifiedLoreEntity['viewTarget'] = 'codex';
  if (entry.category === 'vivec') viewTarget = 'vivec';
  else if (entry.category === 'gods') viewTarget = 'pantheon';
  else if (entry.category === 'races') viewTarget = 'races';
  else if (entry.category === 'metaphysics') viewTarget = 'deepLore';
  else if (entry.id.includes('pelinal') || entry.id.includes('alessia')) viewTarget = 'deepLore';

  unifiedMap.set(entry.id.toLowerCase(), {
    id: entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    category: entry.category,
    summary: entry.summary,
    deepLore: entry.deepLore,
    beginnerNote: entry.beginnerNote,
    crossReferences: entry.crossReferences || [],
    tags: entry.tags || [],
    viewTarget
  });
});

// 2. Ingest Artifacts
ARTIFACTS_DATA.forEach((art) => {
  unifiedMap.set(art.id.toLowerCase(), {
    id: art.id,
    title: art.name,
    subtitle: `${art.type} — ${art.subtitle}`,
    category: 'artifacts',
    summary: `${art.inGameEffect} | Associated with: ${art.godOrCreator}`,
    deepLore: art.kirkbrideStickyNoteLore + '\n\n' + art.canonicalContinuity,
    beginnerNote: art.whyItMatters,
    oblivionLocation: art.oblivionLocation,
    godOrCreator: art.godOrCreator,
    crossReferences: [art.godId, 'oblivion'],
    tags: art.tags,
    viewTarget: 'artifacts'
  });
});

export function resolveEntity(id: string): UnifiedLoreEntity | undefined {
  if (!id) return undefined;
  const cleanId = id.toLowerCase().trim();
  
  if (unifiedMap.has(cleanId)) {
    return unifiedMap.get(cleanId);
  }

  // Check aliases
  const aliasMap: Record<string, string> = {
    'vehk': 'vivec',
    'lord vivec': 'vivec',
    'shor': 'lorkhan',
    'shezarr': 'lorkhan',
    'heart of lorkhan': 'literal_cosmology',
    'moons': 'literal_cosmology',
    'masser': 'literal_cosmology',
    'secunda': 'literal_cosmology',
    'sun': 'literal_cosmology',
    'magnus': 'literal_cosmology',
    'orcs': 'orsimer',
    'dark elves': 'dunmer',
    'wood elves': 'bosmer',
    'high elves': 'altmer',
    'deep elves': 'dwemer',
    'dwarves': 'dwemer',
    'cats': 'khajiit',
    'lizardfolk': 'argonians',
    'trinimac': 'malacath',
    'mauloch': 'malacath',
    'madgod': 'sheogorath',
    'dagon': 'mehrunes_dagon',
    'deadlands': 'mehrunes_dagon',
    'star': 'azuras_star',
    "azura's star": 'azuras_star',
    'wabbajack': 'wabbajack',
    'skeleton key': 'skeleton_key',
    'hammer': 'volendrung',
    'volendrung': 'volendrung',
    'razor': 'mehrunes_razor',
    "mehrunes' razor": 'mehrunes_razor',
    'goldbrand': 'goldbrand',
    'eltonbrand': 'goldbrand',
    'gray cowl': 'gray_cowl_of_nocturnal',
    'gray fox': 'gray_cowl_of_nocturnal',
    'amulet of kings': 'amulet_of_kings',
    'chim-el adabal': 'amulet_of_kings',
    'keening': 'kagrenacs_tools',
    'sunder': 'kagrenacs_tools',
    'wraithguard': 'kagrenacs_tools',
    'umbra': 'umbra_sword',
    'spellbreaker': 'spellbreaker',
    'oghma infinium': 'oghma_infinium',
    'moon and star': 'moon_and_star',
    'moon-and-star': 'moon_and_star',
    'jiub': 'saint_jiub',
    'saint jiub': 'saint_jiub'
  };

  if (aliasMap[cleanId] && unifiedMap.has(aliasMap[cleanId])) {
    return unifiedMap.get(aliasMap[cleanId]);
  }

  // Fuzzy find by title or tag
  for (const entity of unifiedMap.values()) {
    if (entity.title.toLowerCase().includes(cleanId) || entity.id.toLowerCase().includes(cleanId)) {
      return entity;
    }
  }

  return undefined;
}

export function getAllUnifiedEntities(): UnifiedLoreEntity[] {
  return Array.from(unifiedMap.values());
}
