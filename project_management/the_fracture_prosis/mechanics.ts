// General mechanics + state factory + small helpers used by orchestration.

import type {
  ActiveModifier,
  AxisCounts,
  BankEntry,
  Front,
  Level,
  LogicState,
  PersonaId,
  PlayerPick,
} from "./types";
import {
  BUFFER_DECAY,
  METER_CAP,
  MORALE_PRESSURE_THRESHOLD,
  MORALE_RECKLESS_DRAIN,
  MORALE_START,
  SALVAGE_CONVERT_RATIO,
  SALVAGE_EFF,
  SALVAGE_PASSIVE,
  SALVAGE_SPEND_CAP,
} from "./constants";

/** rand(min, max) — defaults to Math.random; injectable for tests. */
export function rand(min: number, max: number, rng: () => number = Math.random): number {
  return rng() * (max - min) + min;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * BUG FIX 2026-08-20: pressure driving morale DRAIN must not include morale
 * itself, or low morale becomes a closed loop that drains itself regardless of
 * what the player does. Other fronts being critical still legitimately cost
 * morale; low morale reads as bad (the UI banner still uses the full check)
 * but shouldn't bootstrap its own decline.
 */
export function pressureForMoraleDrain(state: {
  entropy: number;
  systems: number;
  re: number;
}): boolean {
  return state.entropy > 55 || state.systems < 40 || state.re < 40;
}

/** Full "under pressure" check including morale (used by UI banner / Level III framing). */
export function isUnderPressure(state: LogicState): boolean {
  return (
    state.entropy > 55 ||
    state.systems < 40 ||
    state.re < 40 ||
    state.morale < MORALE_PRESSURE_THRESHOLD
  );
}

/**
 * Apply level-tax side effects (axis count + unforced morale drain on Level III).
 * Returns the new axis counts and the morale-delta components for breakdown.
 */
export function applyLevelTax(input: {
  level: Level;
  underPressure: boolean;
  currentMorale: number;
  actionLabel: string;
  prevAxisCounts: AxisCounts;
}): { axisCounts: AxisCounts; morale: number; moraleDelta: number; moraleNotes: string[] } {
  const axisCounts: AxisCounts = { ...input.prevAxisCounts };
  let morale = input.currentMorale;
  let moraleDelta = 0;
  const moraleNotes: string[] = [];

  if (input.level === "I") axisCounts.low += 1;
  if (input.level === "III") {
    axisCounts.high += 1;
    if (input.underPressure) {
      axisCounts.desperate += 1;
    } else {
      morale = Math.max(0, morale - MORALE_RECKLESS_DRAIN);
      moraleDelta -= MORALE_RECKLESS_DRAIN;
      moraleNotes.push(`-${MORALE_RECKLESS_DRAIN} (${input.actionLabel} III, unforced risk)`);
 }
  }
  // Level II is intentionally neutral.

  return { axisCounts, morale, moraleDelta, moraleNotes };
}

/**
 * Apply buffer decay on systems/re if they're above 100, then clamp.
 * Pure — returns updated values.
 */
export function applyMeterWear(input: {
  round: number;
  systems: number;
  re: number;
}): { systems: number; re: number; systemsDecay: number; reDecay: number } {
  let systems = input.systems;
  let re = input.re;
  let systemsDecay = 0;
  let reDecay = 0;
  if (systems > 100) {
    systemsDecay = Math.min(BUFFER_DECAY, systems - 100);
    systems -= systemsDecay;
  }
  if (re > 100) {
    reDecay = Math.min(BUFFER_DECAY, re - 100);
    re -= reDecay;
  }
  return { systems, re, systemsDecay, reDecay };
}

/** Clamp the meters to their valid range. */
export function clampMeters(input: {
  entropy: number;
  systems: number;
  re: number;
  morale: number;
}): { entropy: number; systems: number; re: number; morale: number } {
  return {
    entropy: Math.max(0, input.entropy),
    systems: clamp(input.systems, 0, METER_CAP),
    re: clamp(input.re, 0, METER_CAP),
    morale: clamp(input.morale, 0, 100),
  };
}

/**
 * Apply the passive salvage income, then auto-spend up to cap against the
 * weakest front. Pure — returns updated values + breakdown fields.
 */
export function applySalvageAutoSpend(input: {
  entropy: number;
  systems: number;
  re: number;
  salvage: number;
  salvageTarget: "auto" | Front;
}): {
  entropy: number;
  systems: number;
  re: number;
  salvage: number;
  target: Front;
  spend: number;
  restored: number;
} {
  let { entropy, systems, re, salvage } = input;
  salvage += SALVAGE_PASSIVE;
  const deficits = {
    entropy: entropy / 100,
    systems: (100 - systems) / 100,
    re: (100 - re) / 100,
  };
  let target: Front =
 input.salvageTarget === "auto"
      ? (Object.entries(deficits) as [Front, number][]).sort((a, b) => b[1] - a[1])[0][0]
      : input.salvageTarget;
  const spend = Math.min(salvage, SALVAGE_SPEND_CAP);
  salvage -= spend;
  const usable = spend * SALVAGE_CONVERT_RATIO;
  let restored = 0;
  if (target === "entropy") { restored = usable * SALVAGE_EFF.entropy; entropy -= restored; }
  if (target === "systems") { restored = usable * SALVAGE_EFF.systems; systems += restored; }
  if (target === "re")      { restored = usable * SALVAGE_EFF.re;      re += restored; }
  return { entropy, systems, re, salvage, target, spend, restored };
}

/**
 * Factory for a fresh run state.
 * Internal var name `openBanks` is preserved (UI copy says "Barriers" but
 * renaming the field was deliberately skipped — see handoff 2026-08-20).
 */
export function initialState(anchorPersona: PersonaId = "ricky"): LogicState {
  return {
    started: false,
    round: 0,
    entropy: 0,
    systems: 100,
    re: 100,
    morale: MORALE_START,
    salvage: 5,
    axisCounts: { low: 0, high: 0, desperate: 0 },
    totalActions: 0,
    log: [],
    gameOver: null,
    lossType: null,
    lastBreakdown: null,
    incomingThreat: null,
    incomingEventId: null,
    usedEventIds: [],
    pendingRelief: 0,
    pendingLullBonus: 0,
    players: [
      { roleId: "helm", ability: null, level: null },
      { roleId: "engineer", ability: null, level: null },
      { roleId: "aft", ability: null, level: null },
    ],
    salvageTarget: "auto",
    anchorPersona,
    beliefOrTrust: 0,
    beliefReady: false,
    distrust: 0,
    defianceChance: 0,
    maudeCoverTarget: null,
    maudeConsecutiveCoverage: 0,
    activeModifiers: {},
    openBanks: [],
    lastDefiance: null,
  };
}

/** Tick down all active modifiers one round; drop expired ones. */
export function tickActiveModifiers(
  modifiers: Partial<Record<Front, ActiveModifier>>,
): Partial<Record<Front, ActiveModifier>> {
  const next: Partial<Record<Front, ActiveModifier>> = {};
  for (const frontStr in modifiers) {
    const front = frontStr as Front;
    const m = modifiers[front];
    if (!m) continue;
    const roundsRemaining = m.roundsRemaining - 1;
    if (roundsRemaining > 0) next[front] = { bump: m.bump, roundsRemaining };
  }
  return next;
}