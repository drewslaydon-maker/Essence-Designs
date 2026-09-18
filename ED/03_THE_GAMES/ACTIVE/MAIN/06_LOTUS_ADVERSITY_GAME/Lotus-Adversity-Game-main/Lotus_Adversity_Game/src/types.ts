import type { GlyphKey } from "./symbols/glyphKeys";

export type ArmorWeightClass = "Heavy" | "Medium" | "Light" | "Zero";

export type ArmorSlot = "Helm" | "Cuirass" | "Pauldrons" | "Gauntlets" | "Greaves" | "Shield";

export type DominionType = "Iron" | "Ether" | "Frontier" | "Earth" | "Axis";

export type SpokeId =
  | "spoke-1-bastion" | "spoke-2-edge" | "spoke-12-stance"
  | "spoke-3-sorcery" | "spoke-4-inscription" | "spoke-5-alchemy"
  | "spoke-6-trapping" | "spoke-7-wayfinding" | "spoke-8-forestry"
  | "spoke-9-masonry" | "spoke-10-quarrying" | "spoke-11-smithing"
  | "spoke-13-breath" | "spoke-14-vessel" | "spoke-15-unarmored";

export interface SymbolForm {
  name: string;
  designation: "True / Healthy Form" | "Corrupted Imperial Form (Godman's Mark)";
  geometry: string;
  visualDescription: string;
  inUniverseMeaning: string;
  glyph: GlyphKey;
  accentColor: string;
}

export interface WarpedGod {
  id: string;
  mortalName: string;
  name: string; // The Ascended Name / Common Moniker
  publicTitle: string;
  folkWhisper: string;
  dominion: DominionType;
  dominionTitle: string;
  mortalVirtue: string;
  fracturedCorruption: string;
  warpedPhysiology: string;
  consumedSpokes: string[];
  armorWeightAffinity: ArmorWeightClass;
  armorSlotAffinity: ArmorSlot;
  divineDecree: string;
  relic: {
    name: string;
    description: string;
  };
  trueSymbol: SymbolForm;
  corruptedSymbol: SymbolForm;
  tacticalBlessing: {
    name: string;
    mechanic: string;
  };
  chronicleExcerpt: string;
  isCustom?: boolean;
}

export interface SvgGeometry {
  primaryShape: "circle" | "polygon" | "path";
  motif: string;
  accentColor: string;
}

export interface ArmorSymbol {
  id: string;
  name: string;
  chronologicalEra: "The First Era (The Anvil)" | "The Tension Era (The Sheathed Verge)" | "The Breaking Point (The Severed Scabbard)" | "The Ascended Corruption (The Horned Calyx)" | "The Axis Stance (The Pierced Lotus)" | "The Sacred Smelt (The Crucible Wedge)";
  weightClass: ArmorWeightClass;
  slot: ArmorSlot;
  godAffinity: string;
  dominion: DominionType;
  trueForm: SymbolForm;
  corruptedForm: SymbolForm;
  forgingIncantation: string;
  postureMitigation: string;
  weightSynergy: string;
  isCustom?: boolean;
}

export interface LoreChronicle {
  id: string;
  title: string;
  category: "The Fall of the Five" | "Chronicles of Alden" | "The Wheel of Adversity" | "Oral Tradition" | "Apocrypha";
  content: string;
  historicalContext: string;
  characters?: string[];
  dateInscribed?: string;
  isCustom?: boolean;
}

export interface SpokeMilestone {
  tier: string;
  title: string;
  unlock: string;
}

export interface Spoke {
  id: string;
  name: string;
  number: number; // 1 to 15
  dominion: DominionType;
  category: "Gathering" | "Production" | "Combat" | "Esoteric" | "Survival" | "Stillness";
  color: string;
  originalVirtue: string;
  corruptedDistortion: string;
  purpose: string;
  consumes: string[];
  produces: string[];
  milestones: SpokeMilestone[];
  connectedSpokes: string[];
}

export interface Pillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  designOrigin: string;
  coreRule: string;
  developmentReferencePoint: string;
  immutableGoldenRule: string;
  concreteGameplayExpressions: {
    title: string;
    description: string;
  }[];
  codebaseComplianceChecklist: string[];
}

export interface PhaseDeliverable {
  title: string;
  description: string;
  acceptanceCriteria: string;
  status: "COMPLETE" | "IN_PROGRESS" | "PLANNED";
}

export interface PhaseDossier {
  phase: string;
  codename: string;
  timeframe: string;
  status: "COMPLETED" | "ACTIVE SPRINT" | "SEALED" | "UPCOMING" | "PAUSED";
  title: string;
  subtitle: string;
  validationGate: string;
  deliverablesCompleted: number;
  totalDeliverables: number;
  deliverables: PhaseDeliverable[];
}
