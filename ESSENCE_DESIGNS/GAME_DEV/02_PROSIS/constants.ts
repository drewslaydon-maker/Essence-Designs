// All numeric / string constants organized by domain.
// Constants stay as-is (no tuning) until Monte Carlo validates the first-pass numbers.

import type { Axis, Front, Level, ThreatCategory, PersonaId } from "./types";

// ---- Level costs ----
export const LEVELS: Record<Level, { cost: number }> = {
  I: { cost: 1.0 },
  II: { cost: 2.5 },
  III: { cost: 5.5 },
};

// Engineer pays Salvage instead of Entropy (Systems is the physical/material front).
export const LEVELS_SALVAGE: Record<Level, number> = {
  I: 1.5,
  II: 3.5,
  III: 6.5,
};

// ---- Meters / buffers ----
export const METER_CAP = 130;
export const BUFFER_DECAY = 8;

// ---- Morale ----
export const MORALE_START = 100;
export const MORALE_PRESSURE_DRAIN = 2;
export const MORALE_RECKLESS_DRAIN = 3;
export const MORALE_PRESSURE_THRESHOLD = 30;

// ---- Salvage economy ----
export const SALVAGE_PASSIVE = 2.0;
export const SALVAGE_SPEND_CAP = 4.0;
export const SALVAGE_CONVERT_RATIO = 1.3;
export const SALVAGE_EFF: Record<Front, number> = {
  entropy: 0.85,
  systems: 0.935,
  re: 0.935,
};

// ---- Wear (per-round decay on entropy, systems, re) ----
export const AMBIENT_BASE = 0.2;
export const AMBIENT_GROWTH = 0.06;
export const SYSTEMS_WEAR_BASE = 0.35;
export const SYSTEMS_WEAR_GROWTH = 0.03;
export const RE_WEAR_BASE = 0.35;
export const RE_WEAR_GROWTH = 0.03;

// ---- Reveal (lull / event / threat mix) ----
export const LULL_BASE = 0.46;
export const LULL_DECAY = 0.005;
export const LULL_MIN = 0.05;
export const EVENT_SHARE = 0.8;
export const TELEGRAPH_MITIGATION = 0.5;

// ---- Threat category axis ceilings (used by weightedDraw) ----
export const CEILINGS: Record<Axis, number> = {
  ruthless: 0.553,
  methodical: 0.650,
  desperate: 0.421,
};
export const WEIGHT_DRAW_K = 8;
export const WEIGHT_DRAW_FLOOR = 0.20;

// ---- GTL ----
export const REFERENCE_TTF = 30;

// ---- Banking credit toward GTL (how much banking helps even before claim) ----
// FIRST PASS, flag for Monte Carlo tuning.
export const BANKING_GTL_CREDIT = 0.4;

// ---- Deferred-compounding bank tuning ----
// FIRST PASS, flag for Monte Carlo tuning.
export const BANK_GROWTH_RATE = 0.08;
export const BANK_GROWTH_CAP_ROUNDS = 5;
export const BANK_EXPOSURE_HAIRCUT = 0.30;

// ---- Morale lever: gain on barrier claim ----
// FIRST PASS — new morale lever.
export const MORALE_ON_CLAIM = 5;

// ---- Belief spend: base heal, before persona multiplier ----
// PLACEHOLDER, needs Drew's number.
export const BASE_HEAL = 15;

// ---- Belief / Distrust ----
export const BAD_CALL_THRESHOLD = 0.5;
export const RICKY_B = {
  buildMultiplier: 0.7,
  threshold: 6,
  spendPayoutMultiplier: 1.6,
};
export const MAUDE_B = {
  buildMultiplier: 1.0,
  threshold: 10,
  spendPayoutMultiplier: 1.0,
  erosionScale: 0.15,
};
export const DEZ_B = {
  beliefThreshold: 6,
  distrustThreshold: -3,
  spendPayoutMultiplier: 1.0,
  defianceScale: 0.15,
  defianceCap: 0.9,
  partialRepair: 1,
};

// ---- Maude's friction tax ----
export const MAUDE_GRACE_ROUNDS = 3;
export const MAUDE_BASE_TAX = 0.25;
export const MAUDE_TAX_CAP = 0.70;
export const MAUDE_ACCEL_STEPS: readonly number[] = [0.06, 0.09, 0.13, 0.18];

// ---- Threat category metadata ----
export const CATEGORIES: Record<
  ThreatCategory,
  { axis: Axis; dmgRange: readonly [number, number]; hits: Front; label: string; tag: string }
> = {
  targeted: {
    axis: "ruthless",
    dmgRange: [12, 24],
    hits: "systems",
    label: "Targeted",
    tag: "threatens Systems Health",
  },
  telegraphed: {
    axis: "methodical",
    dmgRange: [6, 12],
    hits: "entropy",
    label: "Telegraphed",
    tag: "threatens to spike Entropy",
  },
  cascading: {
    axis: "desperate",
    dmgRange: [15, 30],
    hits: "re",
    label: "Cascading",
    tag: "threatens the Reality Engine",
  },
};

// ---- Cost-shape to default persona mapping ----
export const SHAPE_PERSONA: Record<
  "different_front_now" | "same_front_later" | "deferred_compounding",
  PersonaId
> = {
  different_front_now: "ricky",
  same_front_later: "maude",
  deferred_compounding: "dez",
};