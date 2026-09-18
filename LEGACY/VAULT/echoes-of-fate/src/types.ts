export type Realm = 'physical' | 'interstice';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'relic';
  description: string;
  value: number; // atk bonus, def bonus, or heal amount
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  quantity?: number;
}

export interface Ability {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: 'arcane' | 'passive' | 'utility';
  damage?: number;
  effect?: string;
  icon: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  gold: number;
  lanternCharge: number; // 0 to 100
  unlockedAbilities: string[];
  equippedWeapon: Item | null;
  equippedArmor: Item | null;
  inventory: Item[];
}

export interface QuestObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  giver: string;
  description: string;
  status: 'not_started' | 'active' | 'completed';
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    gold: number;
    itemId?: string;
    unlockName?: string;
  };
}

export interface DialogueChoice {
  text: string;
  nextNodeId?: string;
  action?: 'start_combat' | 'open_shop' | 'grant_quest' | 'advance_quest' | 'heal' | 'close';
  questId?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  avatarText?: string;
  text: string;
  choices: DialogueChoice[];
}

export interface DialogueTree {
  id: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export interface MapEntity {
  id: string;
  type: 'npc' | 'enemy' | 'chest' | 'switch' | 'door' | 'portal' | 'shrine' | 'lore';
  name: string;
  x: number;
  y: number;
  realmVisibility?: 'both' | 'physical_only' | 'interstice_only';
  dialogueId?: string;
  enemyType?: string;
  isBoss?: boolean;
  isOpen?: boolean;
  isTriggered?: boolean;
  targetMap?: string;
  targetPos?: Position;
  requiredKeyId?: string;
  loot?: Item;
  loreText?: string;
}

export interface TileMapData {
  id: string;
  name: string;
  width: number;
  height: number;
  // 0: grass/dirt, 1: stone wall, 2: floor, 3: water/abyss (solid unless bridged), 
  // 4: interstice bridge (solid in physical, walkable in interstice),
  // 5: physical rubble (solid in physical, phased through in interstice),
  // 6: dungeon wall, 7: altar/throne tile
  physicalTiles: number[][];
  intersticeTiles: number[][];
  entities: MapEntity[];
  ambientColor: {
    physical: string;
    interstice: string;
  };
}

// Combat Types
export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  behavior?: 'linear' | 'homing' | 'wavy' | 'radial' | 'laser';
  age?: number;
  lifetime?: number;
}

export interface EnemyStats {
  id: string;
  name: string;
  title?: string;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  mercy: number; // 0 to 100 (when 100, can Spare/Subdue)
  isBoss?: boolean;
  color: string;
  spriteType: 'shade' | 'sentry' | 'weaver' | 'malakar';
  dialogueReactions: {
    inquire: string;
    taunt: string;
    parley: string;
    purify: string;
  };
  attackPatternDuration: number; // in seconds
  attackPhase: number;
}

export type CombatOutcome = 'slain' | 'subdued' | 'banished' | 'fled' | 'player_died';

export interface WorldFlags {
  bossOutcome?: 'slain' | 'subdued' | 'banished';
  elderSpokenWith: boolean;
  catacombsUnlocked: boolean;
  astralSanctumUnlocked: boolean;
  switchesActivated: Record<string, boolean>;
  openedChests: Record<string, boolean>;
  defeatedEnemies: Record<string, boolean>;
  riftStormActive: boolean;
  guardianAlliance: boolean;
}
