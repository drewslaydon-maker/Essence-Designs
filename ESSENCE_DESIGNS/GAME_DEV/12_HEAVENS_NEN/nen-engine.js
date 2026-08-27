/**
 * HEAVEN'S NEN ARENA — Core Combat & Aura Engine
 * Ground-truth mathematical model for Nen combat, stances, affinities, oaths, and point scoring.
 */

// --- 1. NEN CATEGORIES & EFFICIENCY MATRIX ---
const NEN_CATEGORIES = {
  ENHANCER: 'Enhancer',
  TRANSMUTER: 'Transmuter',
  EMITTER: 'Emitter',
  CONJURER: 'Conjurer',
  MANIPULATOR: 'Manipulator',
  SPECIALIST: 'Specialist'
};

// Efficiency matrix according to the Nen Hexagon
const AFFINITY_MATRIX = {
  [NEN_CATEGORIES.ENHANCER]: {
    [NEN_CATEGORIES.ENHANCER]: 1.0,
    [NEN_CATEGORIES.TRANSMUTER]: 0.8,
    [NEN_CATEGORIES.EMITTER]: 0.8,
    [NEN_CATEGORIES.CONJURER]: 0.6,
    [NEN_CATEGORIES.MANIPULATOR]: 0.6,
    [NEN_CATEGORIES.SPECIALIST]: 0.0
  },
  [NEN_CATEGORIES.TRANSMUTER]: {
    [NEN_CATEGORIES.TRANSMUTER]: 1.0,
    [NEN_CATEGORIES.ENHANCER]: 0.8,
    [NEN_CATEGORIES.CONJURER]: 0.8,
    [NEN_CATEGORIES.EMITTER]: 0.6,
    [NEN_CATEGORIES.MANIPULATOR]: 0.4,
    [NEN_CATEGORIES.SPECIALIST]: 0.0
  },
  [NEN_CATEGORIES.EMITTER]: {
    [NEN_CATEGORIES.EMITTER]: 1.0,
    [NEN_CATEGORIES.ENHANCER]: 0.8,
    [NEN_CATEGORIES.MANIPULATOR]: 0.8,
    [NEN_CATEGORIES.TRANSMUTER]: 0.6,
    [NEN_CATEGORIES.CONJURER]: 0.4,
    [NEN_CATEGORIES.SPECIALIST]: 0.0
  },
  [NEN_CATEGORIES.CONJURER]: {
    [NEN_CATEGORIES.CONJURER]: 1.0,
    [NEN_CATEGORIES.TRANSMUTER]: 0.8,
    [NEN_CATEGORIES.SPECIALIST]: 0.6,
    [NEN_CATEGORIES.ENHANCER]: 0.6,
    [NEN_CATEGORIES.EMITTER]: 0.4,
    [NEN_CATEGORIES.MANIPULATOR]: 0.4
  },
  [NEN_CATEGORIES.MANIPULATOR]: {
    [NEN_CATEGORIES.MANIPULATOR]: 1.0,
    [NEN_CATEGORIES.EMITTER]: 0.8,
    [NEN_CATEGORIES.SPECIALIST]: 0.6,
    [NEN_CATEGORIES.ENHANCER]: 0.6,
    [NEN_CATEGORIES.TRANSMUTER]: 0.4,
    [NEN_CATEGORIES.CONJURER]: 0.4
  },
  [NEN_CATEGORIES.SPECIALIST]: {
    [NEN_CATEGORIES.SPECIALIST]: 1.0,
    [NEN_CATEGORIES.MANIPULATOR]: 0.8,
    [NEN_CATEGORIES.CONJURER]: 0.8,
    [NEN_CATEGORIES.EMITTER]: 0.6,
    [NEN_CATEGORIES.TRANSMUTER]: 0.6,
    [NEN_CATEGORIES.ENHANCER]: 0.4
  }
};

// --- 2. COMBAT STANCES & FOCUS STATES ---
const STANCES = {
  TEN: 'TEN',       // Defense 1.0x, Aura regen +5/turn, cost 0
  ZETSU: 'ZETSU',   // Defense 0.0x, Aura regen +25/turn, hides aura
  REN: 'REN'        // Atk +50%, unlocks Hatsu, aura cost -15/turn
};

const FOCUS_STATES = {
  NORMAL: 'NORMAL',
  KO: 'KO',         // 100% aura into attack (+100% damage), defense drops to 0 (Zetsu rest of body)
  GYO: 'GYO'        // Spends 10 aura to inspect hidden aura/stats
};

// --- 3. FIGHTER CREATION & MANAGEMENT ---
function createFighter(config) {
  return {
    id: config.id || `fighter_${Math.random().toString(36).substring(2, 7)}`,
    name: config.name || 'Anonymous Nen User',
    category: config.category || NEN_CATEGORIES.ENHANCER,
    maxHp: config.maxHp || 100,
    hp: config.maxHp || 100,
    maxAura: config.maxAura || 100,
    aura: config.maxAura || 100,
    baseAtk: config.baseAtk || 15,
    baseDef: config.baseDef || 10,
    speed: config.speed || 10,
    stance: STANCES.TEN,
    focus: FOCUS_STATES.NORMAL,
    points: 0,
    hatsuList: config.hatsuList || [],
    isGyoActive: false
  };
}

// Get category affinity efficiency multiplier (0.0 to 1.0)
function getCategoryEfficiency(userCategory, targetCategory) {
  return AFFINITY_MATRIX[userCategory]?.[targetCategory] ?? 0.4;
}

// Calculate Oath / Condition Multiplier for Hatsu
function calculateOathMultiplier(oaths = [], userState = {}) {
  let multiplier = 1.0;
  for (const oath of oaths) {
    switch (oath.type) {
      case 'LOW_HP_THRESHOLD': // e.g., HP < 30%
        if (userState.hp / userState.maxHp <= (oath.threshold || 0.3)) {
          multiplier += oath.bonusMultiplier || 0.8;
        }
        break;
      case 'ZETSU_PREP_TURNS': // Requires prior turn in Zetsu
        if (userState.previousStance === STANCES.ZETSU) {
          multiplier += oath.bonusMultiplier || 1.0;
        }
        break;
      case 'RISK_SELF_STUN': // High risk drawback
        multiplier += oath.bonusMultiplier || 0.5;
        break;
      default:
        break;
    }
  }
  return multiplier;
}

// --- 4. TURN STATE PROCESSING & STANCE EFFECTS ---
function applyStartOfTurn(fighter, chosenStance, chosenFocus) {
  fighter.previousStance = fighter.stance;
  fighter.stance = chosenStance;
  fighter.focus = chosenFocus;
  fighter.isGyoActive = (chosenFocus === FOCUS_STATES.GYO);

  // Aura costs and regeneration
  if (chosenStance === STANCES.ZETSU) {
    fighter.aura = Math.min(fighter.maxAura, fighter.aura + 25);
  } else if (chosenStance === STANCES.TEN) {
    fighter.aura = Math.min(fighter.maxAura, fighter.aura + 5);
  } else if (chosenStance === STANCES.REN) {
    if (fighter.aura >= 15) {
      fighter.aura -= 15;
    } else {
      // Ren forced to drop to Ten if out of aura
      fighter.stance = STANCES.TEN;
    }
  }

  // Gyo aura cost
  if (chosenFocus === FOCUS_STATES.GYO) {
    if (fighter.aura >= 10) {
      fighter.aura -= 10;
    } else {
      fighter.focus = FOCUS_STATES.NORMAL;
      fighter.isGyoActive = false;
    }
  }
}

// --- 5. DAMAGE & COMBAT RESOLUTION ---
function resolveAttack(attacker, defender, action) {
  let rawAtk = attacker.baseAtk;
  let rawDef = defender.baseDef;
  let attackType = action.type || 'STRIKE'; // STRIKE, GUARD, HATSU
  let logs = [];

  // Attacker Stance & Focus Modifiers
  if (attacker.stance === STANCES.REN) {
    rawAtk *= 1.5;
    logs.push(`${attacker.name} surges with Ren! (+50% Atk)`);
  } else if (attacker.stance === STANCES.ZETSU) {
    rawAtk *= 0.5; // Weak physical hit in Zetsu
    logs.push(`${attacker.name} strikes while suppressing aura in Zetsu. (Reduced Atk)`);
  }

  if (attacker.focus === FOCUS_STATES.KO) {
    rawAtk *= 2.0;
    logs.push(`⚡ ${attacker.name} concentrates ALL aura into KO strike! (+100% Atk)`);
  }

  // Defender Stance & Focus Modifiers
  if (defender.stance === STANCES.ZETSU || defender.focus === FOCUS_STATES.KO) {
    rawDef = 0; // Completely exposed
    logs.push(`⚠️ ${defender.name} has 0 Defense due to Zetsu/Ko exposure!`);
  } else if (defender.stance === STANCES.REN) {
    rawDef *= 1.2;
  }

  if (action.targetDefending) {
    rawDef *= 1.8;
    logs.push(`${defender.name} assumes a guarded position.`);
  }

  // Hatsu Special Calculation
  if (attackType === 'HATSU' && action.hatsu) {
    const hatsu = action.hatsu;
    const efficiency = getCategoryEfficiency(attacker.category, hatsu.category);
    const oathMult = calculateOathMultiplier(hatsu.oaths, attacker);
    
    // Check aura requirement
    if (attacker.aura < hatsu.auraCost) {
      return {
        success: false,
        reason: 'Insufficient Aura for Hatsu',
        damageDealt: 0,
        pointsAwarded: 0,
        logs: [`${attacker.name} failed to cast ${hatsu.name}: Not enough aura!`]
      };
    }

    attacker.aura -= hatsu.auraCost;
    rawAtk = hatsu.baseDamage * efficiency * oathMult;
    logs.push(`🔥 ${attacker.name} executes Hatsu: [${hatsu.name}]! (Efficiency: ${(efficiency * 100)}%, Oath Mult: ${oathMult.toFixed(2)}x)`);
  }

  // Final Damage Calculation
  const finalDamage = Math.max(1, Math.round(rawAtk - (rawDef * 0.5)));
  defender.hp = Math.max(0, defender.hp - finalDamage);

  // --- HEAVEN'S ARENA SCORING SYSTEM (Floor 200+ Rules) ---
  let pointsAwarded = 0;
  let scoreReason = '';

  if (defender.hp === 0) {
    pointsAwarded = 10; // KO = Instant Victory
    scoreReason = 'KNOCKOUT (KO)! Instant Match Victory!';
  } else if (attacker.focus === FOCUS_STATES.KO && (defender.stance === STANCES.ZETSU || defender.focus === FOCUS_STATES.KO)) {
    pointsAwarded = 2; // Critical Hit
    scoreReason = 'CRITICAL HIT (2 Points)! Ko strike landed on exposed target!';
  } else if (finalDamage >= (defender.maxHp * 0.25)) {
    pointsAwarded = 2; // Critical Hit / Down
    scoreReason = 'CRITICAL HIT & DOWN (2 Points)! Heavy blow delivered!';
  } else if (finalDamage >= (defender.maxHp * 0.12) || defender.stance === STANCES.ZETSU) {
    pointsAwarded = 1; // Clean Hit
    scoreReason = 'CLEAN HIT (1 Point)!';
  }

  attacker.points += pointsAwarded;

  logs.push(`💥 ${attacker.name} deals ${finalDamage} damage to ${defender.name}! (${defender.hp}/${defender.maxHp} HP remaining)`);
  if (pointsAwarded > 0) {
    logs.push(`🎯 JUDGE: ${scoreReason} (${attacker.name} total points: ${attacker.points}/10)`);
  }

  return {
    success: true,
    damageDealt: finalDamage,
    pointsAwarded,
    scoreReason,
    isKO: defender.hp === 0,
    isMatchOver: attacker.points >= 10 || defender.hp === 0,
    winner: (attacker.points >= 10 || defender.hp === 0) ? attacker.name : null,
    logs
  };
}

// Export for Node.js or Browser Global
const NenEngine = {
  NEN_CATEGORIES,
  AFFINITY_MATRIX,
  STANCES,
  FOCUS_STATES,
  createFighter,
  getCategoryEfficiency,
  calculateOathMultiplier,
  applyStartOfTurn,
  resolveAttack
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NenEngine;
}
if (typeof window !== 'undefined') {
  window.NenEngine = NenEngine;
}
