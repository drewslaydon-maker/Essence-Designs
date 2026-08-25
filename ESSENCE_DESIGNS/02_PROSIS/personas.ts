// Persona-driven mechanics: Ricky/Maude/Dez belief/trust stepping,
// Maude's friction tax, Dez's defiance override.

import type { BeliefStep, DezResult, Front, GtlResult, Level } from "./types";
import {
  BAD_CALL_THRESHOLD,
  DEZ_B,
  MAUDE_ACCEL_STEPS,
  MAUDE_BASE_TAX,
  MAUDE_GRACE_ROUNDS,
  MAUDE_TAX_CAP,
  MAUDE_B,
  RICKY_B,
} from "./constants";

const baseIncrement = (gtl: GtlResult) => (1 - gtl.gapMagnitude) * gtl.levelEfficiency;

const isBadCall = (gtl: GtlResult) => gtl.gapMagnitude > BAD_CALL_THRESHOLD;

export function stepRicky(prevBelief: number, gtl: GtlResult): BeliefStep {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  const belief = prevBelief + baseIncrement(gtl) * RICKY_B.buildMultiplier;
  return { belief, ready: belief >= RICKY_B.threshold };
}

export function stepMaude(
  prevBelief: number,
  gtl: GtlResult,
  currentFrictionTaxPct: number,
): BeliefStep {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  let belief = prevBelief + baseIncrement(gtl) * MAUDE_B.buildMultiplier;
  if (currentFrictionTaxPct > 0) belief -= currentFrictionTaxPct * MAUDE_B.erosionScale;
  belief = Math.max(0, belief);
  return { belief, ready: belief >= MAUDE_B.threshold };
}

export function stepDez(prevTrust: number, gtl: GtlResult): BeliefStep {
  const trust = isBadCall(gtl) ? prevTrust - 1 : prevTrust + baseIncrement(gtl);
  const belief = Math.max(0, trust);
  const distrust = Math.max(0, -trust);
  const readyToSpend = trust >= DEZ_B.beliefThreshold;
  const overThreshold = trust < DEZ_B.distrustThreshold;
  const defianceChance = overThreshold
    ? Math.min(DEZ_B.defianceCap, (DEZ_B.distrustThreshold - trust) * DEZ_B.defianceScale)
    : 0;
  return { trust, belief, distrust, readyToSpend, defianceChance };
}

/** Maude's friction tax: scales with consecutive off-front coverage rounds. */
export function maudeTax(n: number): number {
  if (n <= 0) return 0;
  if (n <= MAUDE_GRACE_ROUNDS) return MAUDE_BASE_TAX;
  let tax = MAUDE_BASE_TAX;
  for (let i = 0; i < n - MAUDE_GRACE_ROUNDS; i++) {
    tax += MAUDE_ACCEL_STEPS[Math.min(i, MAUDE_ACCEL_STEPS.length - 1)];
  }
  return Math.min(MAUDE_TAX_CAP, tax);
}

/**
 * Resolve Dez's round: decide if defiance fires, returning the (possibly
 * overridden) ability/level. Only fires when GTL's optimalFront is "re".
 */
export function resolveDezRound(
  prevTrust: number,
  gtl: GtlResult,
  dezChoice: { abilityId: string; level: Level },
  rollFn: () => number = Math.random,
): DezResult {
  const step = stepDez(prevTrust, gtl);
  const canDefy = gtl.optimalFront === "re";
  const alreadyCorrect = dezChoice.abilityId === "patch_job";
  const defianceFired = canDefy && !alreadyCorrect && rollFn() < step.defianceChance;
  if (!defianceFired) {
    return {
      ...step,
      defianceFired: false,
      overrideAbility: dezChoice.abilityId,
      overrideLevel: dezChoice.level,
    };
  }
  return {
    ...step,
    defianceFired: true,
    overrideAbility: "patch_job",
    overrideLevel: dezChoice.level,
  };
}
