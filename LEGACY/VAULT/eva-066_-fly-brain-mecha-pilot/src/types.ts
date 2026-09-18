/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'BATTLE' | 'CONNECTOME_LAB' | 'BASEBALL_DRILL' | 'HANGAR_ARMORY';

export type PilotId = 'SHIN_FLY' | 'ASU_MAG' | 'REI_VA';

export interface PilotProfile {
  id: PilotId;
  name: string;
  callsign: string;
  unitName: string;
  evaUnit: string;
  tagline: string;
  quote: string;
  trait: string;
  bioArchetype: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  stats: {
    gfAgility: number; // Evasion window & speed multiplier
    attackPower: number; // Weapon damage multiplier
    atFieldPower: number; // Shield absorption & regen
    energyCap: number; // Max battery & thruster recharge
  };
}

export type PaintjobId = 'TEST_TYPE_01' | 'PRODUCTION_02' | 'PROTOTYPE_00' | 'GOLDEN_CHRYSALIS';
export type VisorStyleId = 'COMPOUND_HEX' | 'BERSERK_RED' | 'CYAN_OPTIC';

export interface MechaCustomization {
  activePilotId: PilotId;
  paintjob: PaintjobId;
  visorStyle: VisorStyleId;
  upgrades: {
    ommatidiaLevel: number; // 0-3 (+targeting cone width)
    giantFiberLevel: number; // 0-3 (+looming reflex response)
    octopamineLevel: number; // 0-3 (+energy capacity & battery recharge)
    needleLevel: number; // 0-3 (+positron and melee damage)
  };
  synchroCredits: number;
}

export interface Ommatidium {
  id: number;
  x: number; // Normalized -1 to 1 across visual field
  y: number;
  intensity: number;
  motionLeft: number;
  motionRight: number;
  motionLooming: number;
}

export interface Neuron {
  id: string;
  name: string;
  cluster: 'OPTIC_LOBE' | 'CENTRAL_COMPLEX' | 'GIANT_FIBER' | 'DESCENDING_MOTOR' | 'ANTENNAL_LOBE';
  subType: string; // e.g., 'T4_LEFT', 'T5_RIGHT', 'E_PG_RING', 'GF', 'DNa01'
  x: number; // 0-100 for canvas visualization
  y: number;
  voltage: number; // -70mV to +40mV
  threshold: number; // e.g. -50mV
  restingVoltage: number; // -70mV
  lastSpikeTime: number;
  isSpiking: boolean;
  spikeHistory: number[]; // timestamps of spikes in the last few seconds
}

export interface Synapse {
  sourceId: string;
  targetId: string;
  weight: number; // Positive for excitatory (acetylcholine/glutamate), negative for inhibitory (GABA)
  transmitter: 'ACh' | 'GABA' | 'Glutamate' | 'Octopamine';
  lastActivity: number;
}

export interface ConnectomeState {
  neurons: Record<string, Neuron>;
  synapses: Synapse[];
  centralRingHeading: number; // Heading angle deduced from Central Complex ring bump (radians 0 to 2PI)
  syncRatio: number; // 0% to 400% (Berserk mode > 100%)
  octopamineLevel: number; // 0 to 100 (adrenaline/stress)
  sugarSatiety: number; // 0 to 100 (dopaminergic reward)
  loomingThreatLevel: number; // 0 to 1.0 (Giant Fiber drive)
  wingbeatFrequency: number; // ~180-240 Hz
  motorOutputs: {
    yawRate: number; // -1 to +1 (left to right turn)
    pitchRate: number; // -1 to +1 (climb / dive)
    forwardThrust: number; // 0 to 1
    evasiveBurst: boolean; // Giant Fiber triggered sudden dash / AT field blast
  };
}

export type AngelType = 'SACHIEL_SPIDER' | 'RAMIEL_SWAT' | 'MANTIS_IEL' | 'FROG_IEL';

export interface Angel {
  id: string;
  type: AngelType;
  name: string;
  title: string;
  codeName: string;
  description: string;
  predatorTrait: string;
  health: number;
  maxHealth: number;
  position: { x: number; y: number; z: number }; // z is distance (10 to 600)
  velocity: { x: number; y: number; z: number };
  state: 'APPROACHING' | 'ATTACKING' | 'CHARGING_BEAM' | 'STUNNED' | 'DEFEATED';
  attackCooldown: number;
  maxAttackCooldown: number;
  phase: number;
  atFieldIntegrity: number; // 0 to 100
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  isHostile: boolean;
  type: 'ANGEL_WEB' | 'ANGEL_BEAT' | 'ANGEL_SCYTHE' | 'EVA_POSITRON' | 'EVA_PALETTE';
}

export interface BattleState {
  evaHealth: number;
  evaMaxHealth: number;
  evaAtField: number;
  evaEnergy: number; // Battery reserves
  pilotSyncRatio: number;
  evaPosition: { x: number; y: number };
  evaVelocity: { x: number; y: number };
  activeAngel: Angel | null;
  defeatedAngelsCount: number;
  projectiles: Projectile[];
  score: number;
  pilotMode: 'AUTO_FLY' | 'BIO_SYNC' | 'BERSERK';
  alerts: string[];
  sugarLureActive: boolean;
  sugarLurePos: { x: number; y: number } | null;
  lightStrobeActive: boolean;
}

export interface BaseballPitch {
  id: string;
  ballType: 'FASTBALL' | 'CURVEBALL' | 'CHANGEUP' | 'ANGEL_SINKER';
  speedMph: number;
  position: { x: number; y: number; z: number }; // z from 60ft to 0ft (home plate)
  targetLocation: { x: number; y: number }; // Strike zone coordinates
  isSwung: boolean;
  swingTiming: number | null; // ms relative to optimal strike contact
  result: 'PENDING' | 'HOME_RUN' | 'TRIPLE' | 'DOUBLE' | 'SINGLE' | 'FOUL' | 'STRIKE' | 'BALL' | null;
  exitVelocityMph: number;
  distanceFt: number;
}

export interface BaseballState {
  drillMode: 'BATTING' | 'PITCHING';
  strikes: number;
  balls: number;
  outs: number;
  runs: number;
  score: number;
  currentPitch: BaseballPitch | null;
  pitchHistory: BaseballPitch[];
  flyPilotPrediction: {
    loomingExpansionRate: number;
    estimatedArrivalTimeMs: number;
    confidence: number;
  };
  pitchingStats: {
    strikeouts: number;
    walks: number;
    hitsAllowed: number;
    pitchesThrown: number;
  };
}

export type FlyPitchType = 'SACCADE_FASTBALL' | 'HALTERE_CURVE' | 'SUCROSE_SINKER' | 'COMPOUND_SPLITTER';

export interface UserPitchThrow {
  id: string;
  type: FlyPitchType;
  speedMph: number;
  targetZone: { x: number; y: number }; // -1 to 1 in strike zone
  actualBreak: { x: number; y: number };
  z: number;
  batterSwung: boolean;
  batterContact: 'WHIFF' | 'FOUL' | 'FLYOUT' | 'HIT' | 'LOOKING';
  result: 'STRIKE' | 'BALL' | 'OUT' | 'HIT';
  pitcherPilotId?: PilotId;
  pitcherQuote?: string;
  neuralTrigger?: string;
}

