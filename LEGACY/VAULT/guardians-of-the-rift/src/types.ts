export type EquipmentSlot = 'head' | 'body' | 'tool' | 'offhand' | 'pet';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'mythic';

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  description: string;
  flavorText: string;
  iconName: string;
  stats: {
    miningSpeed?: number; // % bonus
    chiselSpeed?: number; // % bonus
    pocketCapacity?: number; // flat +essence capacity
    minionDamage?: number; // % bonus
    barrierShieldBonus?: number; // % bonus
    tokenBonus?: number; // % extra reward points
    critChiselChance?: number; // 0 to 1
  };
}

export type AltarType = 
  | 'air' | 'water' | 'earth' | 'fire' // Elemental
  | 'mind' | 'chaos' | 'cosmic' | 'death' | 'blood'; // Catalytic

export type AltarCategory = 'elemental' | 'catalytic';

export interface AltarInfo {
  id: AltarType;
  name: string;
  category: AltarCategory;
  tier: 1 | 2 | 3 | 4;
  cellTier: 'weak' | 'medium' | 'strong' | 'overcharged';
  color: string;
  bgColor: string;
  borderColor: string;
  durationSeconds: number;
}

export interface MinionBlueprint {
  id: string;
  name: string;
  description: string;
  recipeCost: {
    refinedEssence: number;
    elementalRunes: number;
    catalyticRunes: number;
  };
  maxHp: number;
  attackPower: number;
  attackSpeedSeconds: number;
  range: number;
  specialAbilityName: string;
  specialAbilityDesc: string;
  iconName: string;
  unlocked: boolean;
}

export interface EnemyType {
  id: string;
  name: string;
  maxHp: number;
  attackPower: number;
  speed: number; // units per second towards guardian
  pointsValue: number;
  iconName: string;
  color: string;
}

export interface ActiveEnemy {
  uid: string;
  typeId: string;
  name: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  speed: number;
  distanceToGuardian: number; // 100 (spawn) down to 0 (breach!)
  lane: 'west' | 'north' | 'east';
  color: string;
}

export interface ActiveMinion {
  uid: string;
  blueprintId: string;
  name: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  lane: 'west' | 'north' | 'east';
  lastAttackTime: number;
}

export interface LaneState {
  id: 'west' | 'north' | 'east';
  name: string;
  barrierHp: number;
  maxBarrierHp: number;
  turretCharge: number; // 0 to 100
  turretType?: 'flame' | 'frost' | 'shock';
}

export interface AcademyUpgrade {
  id: string;
  title: string;
  description: string;
  costStardust: number;
  level: number;
  maxLevel: number;
  bonusPerLevel: string;
}

export interface PlayerProfile {
  name: string;
  title: string;
  stardust: number;
  elementalTokens: number;
  catalyticTokens: number;
  matchesPlayed: number;
  matchesWon: number;
  riftsSealed: number;
  equipped: Record<EquipmentSlot, EquipmentItem | null>;
  inventory: EquipmentItem[];
  unlockedBlueprints: string[];
  upgrades: Record<string, number>;
}
