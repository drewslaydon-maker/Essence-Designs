// Spacetime Rune definitions and logic for prOsis v2.0 Captain's Edition.

export type RuneRarity = "common" | "rare" | "exotic";

export interface RuneEffect {
  scoreMultiplier?: number;
  flatScore?: number;
  mitigationBoost?: number;
  bonusSalvage?: number;
  entropyDampening?: number;
  moraleShielding?: number;
  barrierGrowthMultiplier?: number;
}

export interface Rune {
  id: string;
  name: string;
  rarity: RuneRarity;
  description: string;
  effect: RuneEffect;
}

export const MAX_RUNES_PER_RUN = 3;

export const SPAGHETTI_RUNES: Rune[] = [
  {
    id: "chronos-anchor",
    name: "Chronos Anchor",
    rarity: "exotic",
    description: "Stabilizes temporal flow, boosting score and shielding crew morale.",
    effect: {
      scoreMultiplier: 1.25,
      moraleShielding: 5,
    },
  },
  {
    id: "singularity-catalyst",
    name: "Singularity Catalyst",
    rarity: "rare",
    description: "Channels gravitational energy into flat score gains and multiplier.",
    effect: {
      scoreMultiplier: 1.15,
      flatScore: 5000,
    },
  },
  {
    id: "aether-refractor",
    name: "Aether Refractor",
    rarity: "common",
    description: "Refracts system wear into improved mitigation and barrier growth.",
    effect: {
      mitigationBoost: 10,
      barrierGrowthMultiplier: 1.2,
    },
  },
  {
    id: "entropic-gyro",
    name: "Entropic Gyro",
    rarity: "rare",
    description: "Dampens ambient entropy build-up and grants bonus flat score.",
    effect: {
      entropyDampening: 15,
      flatScore: 2500,
    },
  },
  {
    id: "quantum-resonator",
    name: "Quantum Resonator",
    rarity: "exotic",
    description: "Resonates with salvage debris and significantly increases overall score.",
    effect: {
      bonusSalvage: 20,
      scoreMultiplier: 1.3,
    },
  },
  {
    id: "void-stabilizer",
    name: "Void Stabilizer",
    rarity: "common",
    description: "Protects ship integrity with morale shielding and mitigation boosts.",
    effect: {
      moraleShielding: 10,
      mitigationBoost: 5,
    },
  },
];

export function canEquipRune(currentRunes: Rune[], runeId: string): boolean {
  if (currentRunes.length >= MAX_RUNES_PER_RUN) {
    return false;
  }
  return !currentRunes.some((r) => r.id === runeId);
}

export function equipRune(currentRunes: Rune[], newRune: Rune): Rune[] {
  if (!canEquipRune(currentRunes, newRune.id)) {
    return currentRunes;
  }
  return [...currentRunes, newRune];
}

export function unequipRune(currentRunes: Rune[], runeId: string): Rune[] {
  return currentRunes.filter((r) => r.id !== runeId);
}

export function calculateCombinedRuneEffects(runes: Rune[]): Required<RuneEffect> {
  let scoreMultiplierBoost = 0;
  let flatScore = 0;
  let mitigationBoost = 0;
  let bonusSalvage = 0;
  let entropyDampening = 0;
  let moraleShielding = 0;
  let barrierGrowthMultiplierBoost = 0;

  for (const r of runes) {
    if (r.effect.scoreMultiplier !== undefined) {
      const val = r.effect.scoreMultiplier;
      scoreMultiplierBoost += val > 1 ? val - 1 : val;
    }
    if (r.effect.flatScore !== undefined) {
      flatScore += r.effect.flatScore;
    }
    if (r.effect.mitigationBoost !== undefined) {
      mitigationBoost += r.effect.mitigationBoost;
    }
    if (r.effect.bonusSalvage !== undefined) {
      bonusSalvage += r.effect.bonusSalvage;
    }
    if (r.effect.entropyDampening !== undefined) {
      entropyDampening += r.effect.entropyDampening;
    }
    if (r.effect.moraleShielding !== undefined) {
      moraleShielding += r.effect.moraleShielding;
    }
    if (r.effect.barrierGrowthMultiplier !== undefined) {
      const val = r.effect.barrierGrowthMultiplier;
      barrierGrowthMultiplierBoost += val > 1 ? val - 1 : val;
    }
  }

  return {
    scoreMultiplier: 1.0 + scoreMultiplierBoost,
    flatScore,
    mitigationBoost,
    bonusSalvage,
    entropyDampening,
    moraleShielding,
    barrierGrowthMultiplier: 1.0 + barrierGrowthMultiplierBoost,
  };
}

export function applyRuneScoreModifiers(baseScore: number, runes: Rune[]): number {
  const combined = calculateCombinedRuneEffects(runes);
  const calculated = Math.floor((baseScore + combined.flatScore) * combined.scoreMultiplier);
  return Math.max(0, calculated);
}
