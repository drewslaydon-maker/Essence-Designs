// Deferred-compounding barrier (formerly "bank") logic.
// Barriers compound while held and take a haircut if their front takes a hit.

import type { BankEntry, Front } from "./types";
import {
  BANK_EXPOSURE_HAIRCUT,
  BANK_GROWTH_CAP_ROUNDS,
  BANK_GROWTH_RATE,
  MORALE_ON_CLAIM,
} from "./constants";

/**
 * Tick barrier growth for one round. Growth locks after `BANK_GROWTH_CAP_ROUNDS`.
 * Returns a NEW entry — pure, safe to call inside React state updates.
 */
export function tickBankGrowth(entry: BankEntry): BankEntry {
  const roundsHeld = entry.roundsHeld + 1;
  if (roundsHeld > BANK_GROWTH_CAP_ROUNDS) return { ...entry, roundsHeld };
  return { ...entry, banked: entry.banked * (1 + BANK_GROWTH_RATE), roundsHeld };
}

/**
 * If the threat hit the front this barrier protects, apply the exposure haircut.
 * Otherwise return the entry unchanged.
 */
export function applyBankExposure(entry: BankEntry, threatHitsFront: Front): BankEntry {
  if (entry.front !== threatHitsFront) return entry;
  return { ...entry, banked: entry.banked * (1 - BANK_EXPOSURE_HAIRCUT) };
}

/**
 * Claim the barrier: returns the payout value and the morale lever gain.
 * The caller applies the payout to the appropriate front.
 */
export function claimBank(entry: BankEntry): {
  front: Front;
  payout: number;
  moraleGain: number;
} {
  return { front: entry.front, payout: entry.banked, moraleGain: MORALE_ON_CLAIM };
}