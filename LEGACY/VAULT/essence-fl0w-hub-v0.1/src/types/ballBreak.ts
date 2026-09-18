export type MaterialType = 'glass' | 'wood' | 'stone';

export type MomentumTier = 0 | 1 | 2 | 3;

export interface MaterialTierInfo {
  tier: MomentumTier;
  minSpeed: number;
  name: string;
  color: string;
  glowColor: string;
  tailColor: string;
  breaks: MaterialType | 'none';
  description: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  material: MaterialType;
  maxHealth: number;
  currentHealth: number;
  cracks: number; // 0 to 4 hits
  maxCracks: number; // 4 hits for sub-tier breaking
  points: number;
  destroyed: boolean;
  angle?: number;
  crackPoints?: { x: number; y: number }[]; // procedural fracture seeds
}

export type PinballElementType = 'bumper' | 'boost_pad' | 'guide_wall' | 'spinner';

export interface PinballElement {
  id: string;
  type: PinballElementType;
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  angle?: number; // degrees
  impulse?: number;
  pulseTimer?: number; // for visual spring bounce
}

export interface ShardParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  color: string;
  alpha: number;
  size: number;
  material: MaterialType;
  points: { x: number; y: number }[]; // polygon vertices
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  scale: number;
  life: number;
}

export interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  tier: MomentumTier;
  inSlingshot: boolean;
  stretchX: number;
  stretchY: number;
  trail: { x: number; y: number; alpha: number; radius: number; color: string }[];
}

export interface StageDefinition {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  parTime: number; // seconds for 3 stars
  starScoreThresholds: [number, number, number];
  obstacles: Omit<Obstacle, 'currentHealth' | 'cracks' | 'destroyed' | 'crackPoints'>[];
  pinballElements: PinballElement[];
}

export interface StageRecord {
  stageId: number;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
  bestTime: number; // seconds
}

export interface BallBreakProgress {
  unlockedStageMax: number;
  stageRecords: Record<number, StageRecord>;
  totalGlassSmashed: number;
  totalWoodSmashed: number;
  totalStoneSmashed: number;
  lifetimeScore: number;
  highestSpeed: number;
  highestCombo: number;
}
