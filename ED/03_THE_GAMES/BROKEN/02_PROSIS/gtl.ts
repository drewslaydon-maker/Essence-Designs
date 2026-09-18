// Ground Truth Logic + the per-round reveal pipeline.
// All randomness is gated behind an injectable `rng` so Monte Carlo can seed.

import type {
  Axis,
  AxisCounts,
  Front,
  GtlResult,
  IncomingKind,
  RevealResult,
  ThreatCategory,
} from "./types";
import {
  AMBIENT_BASE,
  AMBIENT_GROWTH,
  CEILINGS,
  EVENT_SHARE,
  LULL_BASE,
  LULL_DECAY,
  LULL_MIN,
  RE_WEAR_BASE,
  RE_WEAR_GROWTH,
  REFERENCE_TTF,
  SYSTEMS_WEAR_BASE,
  SYSTEMS_WEAR_GROWTH,
  WEIGHT_DRAW_FLOOR,
  WEIGHT_DRAW_K,
} from "./constants";
import { CATEGORIES } from "./constants";
import { EVENTS } from "./events";
import { rand } from "./mechanics";

function gtlDecayRate(
  front: Front,
  round: number,
  activeModifiers: Partial<Record<Front, number>>,
): number {
  const base =
    front === "entropy"
      ? { base: AMBIENT_BASE, growth: AMBIENT_GROWTH }
      : front === "systems"
        ? { base: SYSTEMS_WEAR_BASE, growth: SYSTEMS_WEAR_GROWTH }
        : { base: RE_WEAR_BASE, growth: RE_WEAR_GROWTH };
  let rate = base.base + base.growth * round;
  rate += activeModifiers[front] ?? 0;
  return Math.max(rate, 0.0001);
}

function gtlDistance(front: Front, state?: { entropy?: number; systems?: number; re?: number }): number {
  const ent = state?.entropy ?? 0;
  return front === "entropy"
    ? Math.max(0, 100 - ent)
    : Math.max(0, state?.[front] ?? 0);
}

function gtlTTF(
  front: Front,
  round: number,
  state?: { entropy?: number; systems?: number; re?: number },
  activeModifiers: Partial<Record<Front, number>> = {},
): number {
  return gtlDistance(front, state) / gtlDecayRate(front, round, activeModifiers);
}

function resolveChosenFront(roundEffects: {
  entropy?: number;
  systems?: number;
  re?: number;
}): Front {
  const helpScore = {
    entropy: -(roundEffects?.entropy ?? 0),
    systems: roundEffects?.systems ?? 0,
    re: roundEffects?.re ?? 0,
  };
  const entries = Object.entries(helpScore) as [Front, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "entropy";
}

export function computeGTL(
  round: number,
  state?: { entropy?: number; systems?: number; re?: number },
  roundEffects?: { entropy?: number; systems?: number; re?: number },
  activeModifiers: Partial<Record<Front, number>> = {},
): GtlResult {
  const fronts: Front[] = ["entropy", "systems", "re"];
  const ttf: Record<Front, number> = {
    entropy: 0,
    systems: 0,
    re: 0,
  };
  for (const f of fronts) ttf[f] = gtlTTF(f, round, state, activeModifiers);
  const sortedFronts = [...fronts].sort((a, b) => ttf[a] - ttf[b]);
  const optimalFront: Front = sortedFronts[0] ?? "entropy";
  const chosenFront = resolveChosenFront(roundEffects ?? {});
  const rankOfChosen = fronts.filter((f) => ttf[f] < ttf[chosenFront]).length;
  const gapMagnitude = rankOfChosen / (fronts.length - 1);
  const severity = Math.max(0, Math.min(1, 1 - ttf[optimalFront] / REFERENCE_TTF));
  const helpMagnitude = Math.max(0, Math.abs(roundEffects?.[chosenFront] ?? 0));
  const levelEfficiency = 1 - Math.abs(severity - Math.min(1, helpMagnitude / 6.5));
  return {
    optimalFront,
    chosenFront,
    gapMagnitude: Number(gapMagnitude.toFixed(3)),
    levelEfficiency: Number(levelEfficiency.toFixed(3)),
  };
}

export function weightedDraw(
  axisCounts: AxisCounts,
  totalActions: number,
  rng: () => number = Math.random,
): ThreatCategory {
  const categoryKeys = Object.keys(CATEGORIES) as ThreatCategory[];
  if (totalActions === 0) {
    const picked = categoryKeys[Math.floor(rng() * categoryKeys.length)];
    return picked ?? "targeted";
  }
  const raw: Record<Axis, number> = {
    methodical: axisCounts.low / totalActions,
    ruthless: axisCounts.high / totalActions,
    desperate: axisCounts.desperate / totalActions,
  };
  const strength: Record<Axis, number> = {
    methodical: Math.min(1, raw.methodical / CEILINGS.methodical),
    ruthless: Math.min(1, raw.ruthless / CEILINGS.ruthless),
    desperate: Math.min(1, raw.desperate / CEILINGS.desperate),
  };
  const weights: Record<ThreatCategory, number> = {
    targeted: 0,
    telegraphed: 0,
    cascading: 0,
  };
  for (const c of categoryKeys) {
    weights[c] = 1 + WEIGHT_DRAW_K * strength[CATEGORIES[c].axis];
  }
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  const probs: Record<ThreatCategory, number> = {
    targeted: 0,
    telegraphed: 0,
    cascading: 0,
  };
  for (const c of categoryKeys) {
    probs[c] = weights[c] / totalW;
  }
  for (const c of categoryKeys) probs[c] = Math.max(probs[c], WEIGHT_DRAW_FLOOR);
  const totalP = Object.values(probs).reduce((a, b) => a + b, 0);
  for (const c of categoryKeys) probs[c] /= totalP;
  const r = rng();
  let cum = 0;
  for (const c of categoryKeys) {
    cum += probs[c];
    if (r <= cum) return c;
  }
  return categoryKeys[categoryKeys.length - 1] ?? "targeted";
}

export function computeReveal(
  round: number,
  entropy: number,
  axisCounts: AxisCounts,
  totalActions: number,
  usedEventIds: string[],
  rng: () => number = Math.random,
): RevealResult {
  const ambient = (AMBIENT_BASE + AMBIENT_GROWTH * round) * rand(0.85, 1.15, rng);
  const newEntropy = Math.max(0, entropy + ambient);
  const lullChance = Math.max(LULL_MIN, LULL_BASE - LULL_DECAY * newEntropy);

  let incoming: IncomingKind;
  let eventId: string | null = null;

  const roll = rng();
  if (roll < lullChance) {
    if (rng() < EVENT_SHARE) {
      incoming = "event";
      const seen = new Set(usedEventIds);
      let pool = EVENTS.filter((e) => !seen.has(e.id));
      if (pool.length === 0) pool = [...EVENTS];
      const picked = pool[Math.floor(rng() * pool.length)];
      eventId = picked ? picked.id : null;
    } else {
      incoming = "lull";
    }
  } else {
    incoming = weightedDraw(axisCounts, totalActions, rng);
  }

  return { entropy: newEntropy, ambient, incoming, eventId };
}
