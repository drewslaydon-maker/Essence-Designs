// End-of-Run Post-Mortem Analytics and Milestone Unlocks for prOsis v2.0CE.

import type { LogicState, LogEntry, Front, CaptainProfile, HighScoreEntry } from "./types";
import { calculateRunScore, submitHighScore, unlockScoutBadge, unlockHullSkin } from "./persistence";

export interface RunAnalytics {
  totalDamageTaken: number;
  damageByFront: Record<Front, number>;
  barriersClaimed: number;
  barrierPayoutTotal: number;
  threatsMitigated: number;
  defianceEventsFired: number;
  finalScore: number;
}

export function calculateRunAnalytics(
  log: LogEntry[],
  rounds: number,
  sector: number,
  morale: number,
  entropy: number,
  runeCount: number
): RunAnalytics {
  let totalDamageTaken = 0;
  const damageByFront: Record<Front, number> = {
    entropy: 0,
    systems: 0,
    re: 0,
  };
  let barriersClaimed = 0;
  let barrierPayoutTotal = 0;
  let threatsMitigated = 0;
  let defianceEventsFired = 0;

  for (const entry of log) {
    if (entry.type === "threat" || entry.type === "loss" || entry.type === "event") {
      if (typeof entry.dmg === "number" && entry.dmg > 0) {
        totalDamageTaken += entry.dmg;
        if (entry.hits && damageByFront[entry.hits] !== undefined) {
          damageByFront[entry.hits] += entry.dmg;
        }
      } else if (typeof entry.dmg === "string") {
        const parsed = parseFloat(entry.dmg);
        if (!isNaN(parsed) && parsed > 0) {
          totalDamageTaken += parsed;
          if (entry.hits && damageByFront[entry.hits] !== undefined) {
            damageByFront[entry.hits] += parsed;
          }
        }
      }
      if ((entry.result && entry.result.includes("mitigated")) || entry.mitigated === true) {
        threatsMitigated++;
      }
    }
    if (entry.type === "bank_claimed") {
      barriersClaimed++;
      if (typeof entry.payout === "number") {
        barrierPayoutTotal += entry.payout;
      }
    }
    if (entry.type === "defiance") {
      defianceEventsFired++;
    }
  }

  const finalScore = calculateRunScore(rounds, sector, morale, entropy, runeCount);

  return {
    totalDamageTaken,
    damageByFront,
    barriersClaimed,
    barrierPayoutTotal,
    threatsMitigated,
    defianceEventsFired,
    finalScore,
  };
}

export function processRunCompletion(
  state: LogicState,
  shipName: string,
  captainProfile: CaptainProfile
): { analytics: RunAnalytics; highScore: HighScoreEntry; unlockedBadges: string[] } {
  const sector = Math.max(1, Math.floor((state.round - 1) / 10) + 1);
  const runeCount = state.equippedRunes ? state.equippedRunes.length : 0;
  const analytics = calculateRunAnalytics(
    state.log,
    state.round,
    sector,
    state.morale,
    state.entropy,
    runeCount
  );

  const highScore = submitHighScore({
    shipName,
    captainCallsign: captainProfile.captainCallsign,
    score: analytics.finalScore,
    rounds: state.round,
    sector,
    morale: state.morale,
    entropy: state.entropy,
    anchorPersona: state.anchorPersona,
    hullSkin: captainProfile.activeHullSkin,
    equippedRuneIds: state.equippedRunes ? state.equippedRunes.map((r) => r.id) : [],
  });

  const unlockedBadges: string[] = [];

  if (sector >= 2) {
    unlockScoutBadge(state.anchorPersona, "badge_sector_2_survivor");
    unlockedBadges.push("badge_sector_2_survivor");
    unlockHullSkin("chrome");
  }
  if (sector >= 3) {
    unlockScoutBadge(state.anchorPersona, "badge_sector_3_master");
    unlockedBadges.push("badge_sector_3_master");
    unlockHullSkin("gold");
  }
  if (state.morale >= 80) {
    unlockScoutBadge(state.anchorPersona, "badge_high_morale");
    unlockedBadges.push("badge_high_morale");
  }
  if (analytics.barriersClaimed >= 3) {
    unlockScoutBadge(state.anchorPersona, "badge_barrier_master");
    unlockedBadges.push("badge_barrier_master");
  }

  return {
    analytics,
    highScore,
    unlockedBadges,
  };
}
