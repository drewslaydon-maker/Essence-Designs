import { TileMapData, MapEntity, Item } from '../types';

// Sample Items
export const ITEMS: Record<string, Item> = {
  rusty_sword: {
    id: 'rusty_sword',
    name: 'Worn Broadsword',
    type: 'weapon',
    description: 'A standard steel sword with a balanced crossguard.',
    value: 6,
    rarity: 'common',
    icon: 'Sword',
  },
  rift_edge: {
    id: 'rift_edge',
    name: 'Rift Edge',
    type: 'weapon',
    description: 'Forged from solidified astral resonance. +14 Atk, phases through enemy armor.',
    value: 14,
    rarity: 'rare',
    icon: 'Sparkles',
  },
  void_slayer: {
    id: 'void_slayer',
    name: 'Malakar\'s Executioner',
    type: 'weapon',
    description: 'A colossal greatsword humming with raw rift calamity. +25 Atk.',
    value: 25,
    rarity: 'legendary',
    icon: 'Flame',
  },
  traveler_cloak: {
    id: 'traveler_cloak',
    name: 'Traveler\'s Cloak',
    type: 'armor',
    description: 'Weather-beaten cloth providing modest physical defense.',
    value: 3,
    rarity: 'common',
    icon: 'Shield',
  },
  astral_cuirass: {
    id: 'astral_cuirass',
    name: 'Aegis of the Rift',
    type: 'armor',
    description: 'Woven from interstice silk. +10 Def, softens spectral damage.',
    value: 10,
    rarity: 'rare',
    icon: 'ShieldCheck',
  },
  crimson_draught: {
    id: 'crimson_draught',
    name: 'Crimson Draught',
    type: 'consumable',
    description: 'Restores 45 Hit Points instantly.',
    value: 45,
    rarity: 'common',
    icon: 'Heart',
    quantity: 3,
  },
  aether_flask: {
    id: 'aether_flask',
    name: 'Aether Flask',
    type: 'consumable',
    description: 'Replenishes 35 Mana and charges the Interstice Lantern.',
    value: 35,
    rarity: 'common',
    icon: 'Droplet',
    quantity: 2,
  },
  crypt_key: {
    id: 'crypt_key',
    name: 'Sunken Crypt Key',
    type: 'key',
    description: 'An ornate brass key encrusted with petrified moss.',
    value: 0,
    rarity: 'rare',
    icon: 'Key',
  },
  sanctum_sigil: {
    id: 'sanctum_sigil',
    name: 'Astral Seal Sigil',
    type: 'key',
    description: 'A pulsating prism that unlocks the Throne of Malakar.',
    value: 0,
    rarity: 'epic',
    icon: 'Compass',
  },
};

// Helper to create grid filled with default value
function createGrid(w: number, h: number, fillVal: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      row.push(fillVal);
    }
    grid.push(row);
  }
  return grid;
}

// ----------------------------------------------------
// LEVEL 1: Ashen Hamlet (Overworld Village)
// ----------------------------------------------------
const hamletW = 16;
const hamletH = 16;
const hamletPhysical = createGrid(hamletW, hamletH, 0); // 0: grass
const hamletInterstice = createGrid(hamletW, hamletH, 0);

// Borders
for (let x = 0; x < hamletW; x++) {
  hamletPhysical[0][x] = 1;
  hamletPhysical[hamletH - 1][x] = 1;
  hamletInterstice[0][x] = 1;
  hamletInterstice[hamletH - 1][x] = 1;
}
for (let y = 0; y < hamletH; y++) {
  hamletPhysical[y][0] = 1;
  hamletPhysical[y][hamletW - 1] = 1;
  hamletInterstice[y][0] = 1;
  hamletInterstice[y][hamletW - 1] = 1;
}

// Stone paths
for (let x = 4; x <= 11; x++) {
  hamletPhysical[7][x] = 2;
  hamletInterstice[7][x] = 2;
}
for (let y = 3; y <= 12; y++) {
  hamletPhysical[y][8] = 2;
  hamletInterstice[y][8] = 2;
}

// Houses (walls)
for (let y = 2; y <= 4; y++) {
  for (let x = 2; x <= 5; x++) {
    hamletPhysical[y][x] = 1;
    hamletInterstice[y][x] = 1;
  }
}
hamletPhysical[4][3] = 2; // door
hamletInterstice[4][3] = 2;

// Chasm on the right (columns 12-13)
for (let y = 2; y <= 13; y++) {
  hamletPhysical[y][12] = 3; // deep water / abyss
  hamletInterstice[y][12] = 3;
}
// In physical: no bridge. In interstice: spectral bridge at y=7, y=8!
hamletPhysical[7][12] = 3;
hamletPhysical[8][12] = 3;
hamletInterstice[7][12] = 4; // Spectral bridge
hamletInterstice[8][12] = 4;

const hamletEntities: MapEntity[] = [
  {
    id: 'npc_elder',
    type: 'npc',
    name: 'Elder Ronald',
    x: 7,
    y: 6,
    dialogueId: 'elder_dialogue',
  },
  {
    id: 'npc_blacksmith',
    type: 'npc',
    name: 'Blacksmith Torvald',
    x: 4,
    y: 5,
    dialogueId: 'blacksmith_dialogue',
  },
  {
    id: 'chest_hidden_island',
    type: 'chest',
    name: 'Astral Chest',
    x: 14,
    y: 7,
    isOpen: false,
    loot: ITEMS.rift_edge,
    realmVisibility: 'interstice_only',
  },
  {
    id: 'portal_to_catacombs',
    type: 'portal',
    name: 'Sunken Catacombs Entrance',
    x: 8,
    y: 2,
    targetMap: 'sunken_catacombs',
    targetPos: { x: 9, y: 15 },
  },
  {
    id: 'lore_shrine_hamlet',
    type: 'lore',
    name: 'Ancient Obelisk',
    x: 11,
    y: 11,
    loreText: 'Inscription: "When the realm fractures, gaze between worlds. That which is broken in flesh remains bound in spirit."',
  },
];

// ----------------------------------------------------
// LEVEL 2: Sunken Catacombs (Dungeon Floor 1)
// ----------------------------------------------------
const catacombsW = 18;
const catacombsH = 18;
const catacombsPhysical = createGrid(catacombsW, catacombsH, 2); // stone floor
const catacombsInterstice = createGrid(catacombsW, catacombsH, 2);

// Borders
for (let x = 0; x < catacombsW; x++) {
  catacombsPhysical[0][x] = 6;
  catacombsPhysical[catacombsH - 1][x] = 6;
  catacombsInterstice[0][x] = 6;
  catacombsInterstice[catacombsH - 1][x] = 6;
}
for (let y = 0; y < catacombsH; y++) {
  catacombsPhysical[y][0] = 6;
  catacombsPhysical[y][catacombsW - 1] = 6;
  catacombsInterstice[y][0] = 6;
  catacombsInterstice[y][catacombsW - 1] = 6;
}

// Columns & maze walls
for (let y = 4; y <= 13; y += 3) {
  for (let x = 4; x <= 13; x += 3) {
    catacombsPhysical[y][x] = 6;
    catacombsInterstice[y][x] = 6;
  }
}

// Barrier separating north chamber (at y=5)
for (let x = 1; x < catacombsW - 1; x++) {
  if (x !== 9) {
    catacombsPhysical[5][x] = 6;
    catacombsInterstice[5][x] = 6;
  }
}

// Physical rubble blocking west passage (passable only when phased into interstice)
catacombsPhysical[9][3] = 5; // Rubble
catacombsPhysical[9][4] = 5;
catacombsInterstice[9][3] = 2;
catacombsInterstice[9][4] = 2;

const catacombsEntities: MapEntity[] = [
  {
    id: 'portal_back_to_hamlet',
    type: 'portal',
    name: 'Surface Exit',
    x: 9,
    y: 16,
    targetMap: 'ashen_hamlet',
    targetPos: { x: 8, y: 3 },
  },
  {
    id: 'switch_physical_1',
    type: 'switch',
    name: 'Rune Pressure Plate A',
    x: 2,
    y: 11,
    isTriggered: false,
    realmVisibility: 'physical_only',
  },
  {
    id: 'switch_interstice_2',
    type: 'switch',
    name: 'Spectral Pressure Plate B',
    x: 15,
    y: 11,
    isTriggered: false,
    realmVisibility: 'interstice_only',
  },
  {
    id: 'enemy_shade_1',
    type: 'enemy',
    name: 'Hollow Shade',
    enemyType: 'shade',
    x: 6,
    y: 10,
  },
  {
    id: 'enemy_shade_2',
    type: 'enemy',
    name: 'Crypt Sentry',
    enemyType: 'sentry',
    x: 12,
    y: 8,
  },
  {
    id: 'chest_crypt_key',
    type: 'chest',
    name: 'Forgotten Sarcophagus',
    x: 2,
    y: 8,
    isOpen: false,
    loot: ITEMS.crypt_key,
  },
  {
    id: 'door_north_chamber',
    type: 'door',
    name: 'Gate of the Crypt',
    x: 9,
    y: 5,
    isOpen: false,
    requiredKeyId: 'crypt_key',
  },
  {
    id: 'portal_to_astral_sanctum',
    type: 'portal',
    name: 'Descent to Astral Sanctum',
    x: 9,
    y: 2,
    targetMap: 'astral_sanctum',
    targetPos: { x: 9, y: 15 },
  },
];

// ----------------------------------------------------
// LEVEL 3: Astral Sanctum (Dungeon Floor 2)
// ----------------------------------------------------
const sanctumW = 18;
const sanctumH = 18;
const sanctumPhysical = createGrid(sanctumW, sanctumH, 2);
const sanctumInterstice = createGrid(sanctumW, sanctumH, 2);

// Borders
for (let x = 0; x < sanctumW; x++) {
  sanctumPhysical[0][x] = 6;
  sanctumPhysical[sanctumH - 1][x] = 6;
  sanctumInterstice[0][x] = 6;
  sanctumInterstice[sanctumH - 1][x] = 6;
}
for (let y = 0; y < sanctumH; y++) {
  sanctumPhysical[y][0] = 6;
  sanctumPhysical[y][sanctumW - 1] = 6;
  sanctumInterstice[y][0] = 6;
  sanctumInterstice[y][sanctumW - 1] = 6;
}

// Grand Void Chasm dividing middle (y = 8, 9)
for (let x = 1; x < sanctumW - 1; x++) {
  sanctumPhysical[8][x] = 3; // Void
  sanctumPhysical[9][x] = 3;
  sanctumInterstice[8][x] = 3;
  sanctumInterstice[9][x] = 3;
}
// Spectral crossing paths in Interstice
sanctumInterstice[8][9] = 4;
sanctumInterstice[9][9] = 4;
sanctumInterstice[8][5] = 4;
sanctumInterstice[9][5] = 4;
sanctumInterstice[8][13] = 4;
sanctumInterstice[9][13] = 4;

const sanctumEntities: MapEntity[] = [
  {
    id: 'portal_back_to_catacombs',
    type: 'portal',
    name: 'Stairs up to Catacombs',
    x: 9,
    y: 16,
    targetMap: 'sunken_catacombs',
    targetPos: { x: 9, y: 3 },
  },
  {
    id: 'shrine_west',
    type: 'shrine',
    name: 'Astral Beacon of Dawn',
    x: 4,
    y: 12,
    isTriggered: false,
    realmVisibility: 'interstice_only',
  },
  {
    id: 'shrine_east',
    type: 'shrine',
    name: 'Astral Beacon of Dusk',
    x: 14,
    y: 12,
    isTriggered: false,
    realmVisibility: 'interstice_only',
  },
  {
    id: 'enemy_void_weaver',
    type: 'enemy',
    name: 'Void Weaver',
    enemyType: 'weaver',
    x: 9,
    y: 6,
  },
  {
    id: 'chest_astral_cuirass',
    type: 'chest',
    name: 'Sanctum Vault',
    x: 5,
    y: 4,
    isOpen: false,
    loot: ITEMS.astral_cuirass,
  },
  {
    id: 'door_throne_seal',
    type: 'door',
    name: 'Seal of the Rift Throne',
    x: 9,
    y: 4,
    isOpen: false,
    requiredKeyId: 'sanctum_sigil',
  },
  {
    id: 'portal_to_rift_throne',
    type: 'portal',
    name: 'Portal to the Rift Throne',
    x: 9,
    y: 2,
    targetMap: 'rift_throne',
    targetPos: { x: 9, y: 15 },
  },
];

// ----------------------------------------------------
// LEVEL 4: The Rift Throne (Boss Chamber)
// ----------------------------------------------------
const throneW = 18;
const throneH = 18;
const thronePhysical = createGrid(throneW, throneH, 2);
const throneInterstice = createGrid(throneW, throneH, 2);

// Borders
for (let x = 0; x < throneW; x++) {
  thronePhysical[0][x] = 6;
  thronePhysical[throneH - 1][x] = 6;
  throneInterstice[0][x] = 6;
  throneInterstice[throneH - 1][x] = 6;
}
for (let y = 0; y < throneH; y++) {
  thronePhysical[y][0] = 6;
  thronePhysical[y][throneW - 1] = 6;
  throneInterstice[y][0] = 6;
  throneInterstice[y][throneW - 1] = 6;
}

// Grand Altar / Throne platform at top center
for (let y = 3; y <= 6; y++) {
  for (let x = 7; x <= 11; x++) {
    thronePhysical[y][x] = 7;
    throneInterstice[y][x] = 7;
  }
}

const throneEntities: MapEntity[] = [
  {
    id: 'portal_back_to_sanctum',
    type: 'portal',
    name: 'Retreat to Astral Sanctum',
    x: 9,
    y: 16,
    targetMap: 'astral_sanctum',
    targetPos: { x: 9, y: 3 },
  },
  {
    id: 'boss_malakar',
    type: 'enemy',
    name: 'Commander Malakar, Outcast Sentinel',
    enemyType: 'malakar',
    isBoss: true,
    x: 9,
    y: 5,
  },
];

// Map Registry
export const MAPS: Record<string, TileMapData> = {
  ashen_hamlet: {
    id: 'ashen_hamlet',
    name: 'The Ashen Hamlet',
    width: hamletW,
    height: hamletH,
    physicalTiles: hamletPhysical,
    intersticeTiles: hamletInterstice,
    entities: hamletEntities,
    ambientColor: {
      physical: '#3e5239', // verdant forest town
      interstice: '#20183b', // deep mystical violet
    },
  },
  sunken_catacombs: {
    id: 'sunken_catacombs',
    name: 'Sunken Catacombs',
    width: catacombsW,
    height: catacombsH,
    physicalTiles: catacombsPhysical,
    intersticeTiles: catacombsInterstice,
    entities: catacombsEntities,
    ambientColor: {
      physical: '#232931', // dark stone dungeon
      interstice: '#1a1836', // eerie glowing rift
    },
  },
  astral_sanctum: {
    id: 'astral_sanctum',
    name: 'Astral Sanctum',
    width: sanctumW,
    height: sanctumH,
    physicalTiles: sanctumPhysical,
    intersticeTiles: sanctumInterstice,
    entities: sanctumEntities,
    ambientColor: {
      physical: '#1d2a3a', // deep cobalt ruins
      interstice: '#2d143c', // radiant void purple
    },
  },
  rift_throne: {
    id: 'rift_throne',
    name: 'The Rift Throne',
    width: throneW,
    height: throneH,
    physicalTiles: thronePhysical,
    intersticeTiles: throneInterstice,
    entities: throneEntities,
    ambientColor: {
      physical: '#2c1926', // apocalyptic throne
      interstice: '#3e0e37', // blazing dimensional rift
    },
  },
};
