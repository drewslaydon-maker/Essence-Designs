// Shared types for The Fracture / Prosis game logic.
// All modules import from here so the type graph stays consistent.

import type { Rune } from "./runes";

export type Front = "entropy" | "systems" | "re";
export type Level = "I" | "II" | "III";
export type PersonaId = "ricky" | "maude" | "dez";
export type Axis = "methodical" | "ruthless" | "desperate";
export type Shape =
  | "different_front_now"
  | "same_front_later"
  | "deferred_compounding"
  | "personal";
export type ThreatCategory = "targeted" | "telegraphed" | "cascading";
export type LossType = "mechanical" | "morale";
export type IncomingKind = ThreatCategory | "event" | "lull";

export type HullSkin = "titanium" | "chrome" | "gold" | "singularity";

export interface CosmeticsProfile {
  unlockedHullSkins: HullSkin[];
  activeHullSkin: HullSkin;
  unlockedBadges: Record<PersonaId, string[]>;
  helmName: string;
  geneName: string;
  salName: string;
}

export interface CaptainProfile {
  captainCallsign: string;
  helmName: string;
  geneName: string;
  salName: string;
  activeHullSkin: HullSkin;
}

export interface HighScoreEntry {
  id: string;
  shipName: string;
  captainCallsign: string;
  score: number;
  rounds: number;
  sector: number;
  morale: number;
  entropy: number;
  anchorPersona: PersonaId;
  hullSkin: HullSkin;
  equippedRuneIds: string[];
  timestamp: string;
}

export interface AbilityLevelParams {
  entropyDelta?: number;
  systemsDelta?: number;
  reDelta?: number;
  salvageDelta?: number;
  ambientBump?: number;
  bumpRounds?: number;
  wearBump?: number;
  banked?: number;
  mitigation?: number;
  morale?: number;
  extend?: number;
  shield?: boolean;
}

export interface Ability {
  id: string;
  label: string;
  shape: Shape;
  desc: string;
  levels: Record<Level, AbilityLevelParams>;
  /** Only meaningful for `deferred_compounding` shape. */
  front?: Front;
}

export interface Role {
  id: "helm" | "engineer" | "aft";
  name: string;
  personalName: string;
  focus: string;
  abilities: Ability[];
}

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  direction: string;
  nativeFront: Front;
  color: string;
  tag: string;
  blurb: string;
  signature: string;
  pulseClass: string;
}

export interface AxisCounts {
  low: number;
  high: number;
  desperate: number;
}

export interface ActiveModifier {
  bump: number;
  roundsRemaining: number;
}

export interface BankEntry {
  abilityId: string;
  front: Front;
  banked: number;
  roundsHeld: number;
}

export interface PlayerPick {
  roleId: "helm" | "engineer" | "aft";
  ability: string | null;
  level: Level | null;
}

export interface GtlResult {
  optimalFront: Front;
  chosenFront: Front;
  gapMagnitude: number;
  levelEfficiency: number;
}

export interface RevealResult {
  entropy: number;
  ambient: number;
  incoming: IncomingKind;
  eventId: string | null;
}

export interface BeliefStep {
  belief?: number;
  trust?: number;
  ready?: boolean;
  readyToSpend?: boolean;
  distrust?: number;
  defianceChance?: number;
}

export interface DezResult extends BeliefStep {
  defianceFired: boolean;
  overrideAbility: string;
  overrideLevel: Level | null;
}

export interface LogEntry {
  type:
    | "intro"
    | "round"
    | "lull"
    | "event"
    | "threat"
    | "loss"
    | "defiance"
    | "bank_claimed"
    | "bank_expired"
    | "belief_spent";
  round?: number;
    category?: ThreatCategory;
  dmg?: string | number;
  hits?: Front;
  mitigated?: boolean;
  line?: string;
  title?: string;
  choice?: string;
  result?: string;
  reason?: string;
  from?: string;
  to?: string;
  level?: Level;
  front?: Front;
  payout?: number;
  moraleGain?: number;
  banked?: number;
}

/**
 * The shape of state values that matter to game logic. The JSX keeps this
 * wrapped in a `useState` object with extra display-only fields.
 */
export interface LogicState {
  started: boolean;
  round: number;
  entropy: number;
  systems: number;
  re: number;
  morale: number;
  salvage: number;
  axisCounts: AxisCounts;
  totalActions: number;
  log: LogEntry[];
  gameOver: string | null;
  lossType: LossType | null;
  lastBreakdown: RoundBreakdown | null;
  incomingThreat: IncomingKind | null;
  incomingEventId: string | null;
  usedEventIds: string[];
  pendingRelief: number;
  pendingLullBonus: number;
  players: PlayerPick[];
  salvageTarget: "auto" | Front;
  anchorPersona: PersonaId;
  beliefOrTrust: number;
  beliefReady: boolean;
  distrust: number;
  defianceChance: number;
  maudeCoverTarget: Front | null;
  maudeConsecutiveCoverage: number;
  activeModifiers: Partial<Record<Front, ActiveModifier>>;
  openBanks: BankEntry[];
  lastDefiance: { from: string; to: string; level: Level } | null;
  equippedRunes?: Rune[];
  helmName?: string;
  geneName?: string;
  salName?: string;
  hullSkin?: HullSkin;
}

export interface RoundBreakdown {
  threat:
    | { category: ThreatCategory; dmg: number; hits: Front; mitigated: boolean }
    | null;
  actionsCost: number;
  actionsTaken: Array<{ role: string; label: string }>;
  salvageGained: number;
  salvageSpent: number;
  salvageTarget: Front | "auto";
  salvageRestored: number;
  moraleDelta: number;
  moraleNotes: string[];
  systemsDecay: number;
  reDecay: number;
}