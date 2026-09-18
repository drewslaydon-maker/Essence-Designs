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

// --- WATER DIVINATION TEST (WDT) DEFINITIONS ---
const WATER_DIVINATION_RESULTS = {
  [NEN_CATEGORIES.ENHANCER]: {
    category: NEN_CATEGORIES.ENHANCER,
    reaction: 'Water Overflows!',
    description: 'The volume of water increases rapidly and spills over the rim of the glass.',
    auraColor: '#f59e0b', // Golden Amber
    hisokaTrait: 'Simple, earnest, and determined.',
    statBonus: { hp: 20, baseAtk: 5, baseDef: 3 },
    cssClass: 'wdt-overflow'
  },
  [NEN_CATEGORIES.TRANSMUTER]: {
    category: NEN_CATEGORIES.TRANSMUTER,
    reaction: 'Taste of Water Changes!',
    description: 'The water changes flavor, becoming distinctly sweet, tart, or metallic.',
    auraColor: '#ec4899', // Bright Pink / Magenta
    hisokaTrait: 'Whimsical, deceptive, and prone to trickery.',
    statBonus: { hp: 10, maxAura: 25, speed: 4 },
    cssClass: 'wdt-taste'
  },
  [NEN_CATEGORIES.EMITTER]: {
    category: NEN_CATEGORIES.EMITTER,
    reaction: 'Color of Water Changes!',
    description: 'The water shifts in hue, glowing with a vibrant radiant energy.',
    auraColor: '#3b82f6', // Sapphire Blue
    hisokaTrait: 'Impatience, quick-tempered, but emotionally intense.',
    statBonus: { maxAura: 30, baseAtk: 4, speed: 2 },
    cssClass: 'wdt-color'
  },
  [NEN_CATEGORIES.CONJURER]: {
    category: NEN_CATEGORIES.CONJURER,
    reaction: 'Impurities Appear in Water!',
    description: 'Crystalline specks and delicate metallic flakes form in the water.',
    auraColor: '#10b981', // Emerald Green
    hisokaTrait: 'High-strung, stoic, cautious, and overly observant.',
    statBonus: { hp: 15, baseDef: 6, maxAura: 15 },
    cssClass: 'wdt-impurities'
  },
  [NEN_CATEGORIES.MANIPULATOR]: {
    category: NEN_CATEGORIES.MANIPULATOR,
    reaction: 'The Leaf Moves!',
    description: 'The leaf resting on top of the water begins to spin and glide smoothly across the surface.',
    auraColor: '#8b5cf6', // Deep Purple
    hisokaTrait: 'Logical, argumentative, and hyper-protective of loved ones.',
    statBonus: { maxAura: 20, speed: 5, baseDef: 3 },
    cssClass: 'wdt-leaf-move'
  },
  [NEN_CATEGORIES.SPECIALIST]: {
    category: NEN_CATEGORIES.SPECIALIST,
    reaction: 'Anomalous Reaction Occurs!',
    description: 'The leaf fractures into glowing fragments as the water defies gravity.',
    auraColor: '#ef4444', // Crimson Red
    hisokaTrait: 'Individualistic, charismatic, and enigmatic.',
    statBonus: { hp: 10, maxAura: 35, baseAtk: 3, baseDef: 3 },
    cssClass: 'wdt-specialist'
  }
};

/**
 * Conducts Water Divination Test based on player choices or direct category selection.
 * @param {Array<number>} answers - Array of option indices (0..5) from temperament evaluation
 */
function evaluateWaterDivination(answers = []) {
  if (!answers || answers.length === 0) {
    const categories = Object.values(NEN_CATEGORIES);
    const chosen = categories[Math.floor(Math.random() * categories.length)];
    return WATER_DIVINATION_RESULTS[chosen];
  }

  const counts = {
    [NEN_CATEGORIES.ENHANCER]: 0,
    [NEN_CATEGORIES.TRANSMUTER]: 0,
    [NEN_CATEGORIES.EMITTER]: 0,
    [NEN_CATEGORIES.CONJURER]: 0,
    [NEN_CATEGORIES.MANIPULATOR]: 0,
    [NEN_CATEGORIES.SPECIALIST]: 0
  };

  const categoriesOrder = [
    NEN_CATEGORIES.ENHANCER,
    NEN_CATEGORIES.TRANSMUTER,
    NEN_CATEGORIES.EMITTER,
    NEN_CATEGORIES.CONJURER,
    NEN_CATEGORIES.MANIPULATOR,
    NEN_CATEGORIES.SPECIALIST
  ];

  answers.forEach((ansIndex) => {
    const cat = categoriesOrder[ansIndex % 6];
    if (cat) counts[cat]++;
  });

  let winner = NEN_CATEGORIES.ENHANCER;
  let maxScore = -1;

  for (const cat of categoriesOrder) {
    if (counts[cat] > maxScore) {
      maxScore = counts[cat];
      winner = cat;
    }
  }

  return WATER_DIVINATION_RESULTS[winner];
}

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
    isGyoActive: false,
    statusEffects: [],
    isStunned: false,
    isForcedZetsu: false
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
  fighter.isStunned = fighter.statusEffects.some(e => e.type === 'STUN_SHOCK');
  fighter.isForcedZetsu = fighter.statusEffects.some(e => e.type === 'FORCE_ZETSU');

  if (fighter.isForcedZetsu) {
    chosenStance = STANCES.ZETSU;
  }

  fighter.previousStance = fighter.stance;
  fighter.stance = chosenStance;
  fighter.focus = chosenFocus;
  fighter.isGyoActive = (chosenFocus === FOCUS_STATES.GYO);

  // Process existing status effects AFTER checking active flags for this turn
  fighter.statusEffects.forEach(effect => {
    effect.duration -= 1;
  });
  fighter.statusEffects = fighter.statusEffects.filter(effect => effect.duration > 0);

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
  let logs = [];

  if (attacker.isStunned) {
    return {
      success: false,
      reason: 'Target is stunned!',
      damageDealt: 0,
      pointsAwarded: 0,
      logs: [`${attacker.name} is stunned and cannot act!`]
    };
  }

  let rawAtk = attacker.baseAtk;
  let rawDef = defender.baseDef;
  let attackType = action.type || 'STRIKE'; // STRIKE, GUARD, HATSU

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
  
    if (hatsu.effect === 'FORCE_ZETSU') {
      defender.statusEffects.push({ type: 'FORCE_ZETSU', duration: 1 });
      logs.push(`⛓️ ${defender.name} is forced into ZETSU!`);
    } else if (hatsu.effect === 'STUN_SHOCK') {
      defender.statusEffects.push({ type: 'STUN_SHOCK', duration: 1 });
      logs.push(`⚡ ${defender.name} is stunned!`);
    } else if (hatsu.effect === 'SPEED_BUFF') {
      attacker.statusEffects.push({ type: 'SPEED_BUFF', duration: 2 });
      logs.push(`💨 ${attacker.name} gained a speed buff!`);
    }
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

// --- CANONICAL SIGNATURE HATSU REGISTRY ---
const CANONICAL_HATSU = {
  // GON FREECSS
  JAJANKEN_ROCK: {
    id: 'JAJANKEN_ROCK',
    name: 'Jajanken: Rock',
    character: 'Gon Freecss',
    category: NEN_CATEGORIES.ENHANCER,
    baseDamage: 48,
    auraCost: 25,
    description: 'Devastating Enhancer fist strike requiring a chant charge.',
    effect: 'HEAVY_IMPACT'
  },
  JAJANKEN_PAPER: {
    id: 'JAJANKEN_PAPER',
    name: 'Jajanken: Paper',
    character: 'Gon Freecss',
    category: NEN_CATEGORIES.EMITTER,
    baseDamage: 36,
    auraCost: 20,
    description: 'Ranged Emitter aura blast projected from palm.',
    effect: 'PROJECTILE'
  },
  JAJANKEN_SCISSORS: {
    id: 'JAJANKEN_SCISSORS',
    name: 'Jajanken: Scissors',
    character: 'Gon Freecss',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 40,
    auraCost: 22,
    description: 'Transmuted aura blade extended from fingers for sharp piercing damage.',
    effect: 'PIERCING'
  },

  // KILLUA ZOLDYCK
  GODSPEED: {
    id: 'GODSPEED',
    name: 'Godspeed (Whirlwind)',
    character: 'Killua Zoldyck',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 30,
    auraCost: 20,
    description: 'Transmutes electricity into neural reflexes. Increases speed and deals lightning damage.',
    effect: 'SPEED_BUFF'
  },
  THUNDERBOLT: {
    id: 'THUNDERBOLT',
    name: 'Thunderbolt / Lightning Palm',
    character: 'Killua Zoldyck',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 42,
    auraCost: 24,
    description: 'High-voltage electric discharge that shocks and paralyzes the opponent.',
    effect: 'STUN_SHOCK'
  },

  // HISOKA MOROW
  BUNGEE_GUM: {
    id: 'BUNGEE_GUM',
    name: 'Bungee Gum (Elastic Attachment)',
    character: 'Hisoka Morow',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 38,
    auraCost: 22,
    description: 'Aura possesses properties of both rubber and gum. Traps and pulls opponents for heavy counters.',
    effect: 'PULL_COUNTER'
  },
  TEXTURE_SURPRISE: {
    id: 'TEXTURE_SURPRISE',
    name: 'Texture Surprise',
    character: 'Hisoka Morow',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 25,
    auraCost: 15,
    description: 'Applies texture to aura to deceive eyes and absorb physical impact.',
    effect: 'DECEPTION_GUARD'
  },

  // KURAPIKA
  CHAIN_JAIL: {
    id: 'CHAIN_JAIL',
    name: 'Chain Jail',
    character: 'Kurapika',
    category: NEN_CATEGORIES.CONJURER,
    baseDamage: 32,
    auraCost: 25,
    oaths: [{ type: 'RISK_SELF_STUN', bonusMultiplier: 0.6 }],
    description: 'Conjured chain that binds target and forces them into Zetsu state.',
    effect: 'FORCE_ZETSU'
  },
  JUDGEMENT_CHAIN: {
    id: 'JUDGEMENT_CHAIN',
    name: 'Judgement Chain',
    character: 'Kurapika',
    category: NEN_CATEGORIES.CONJURER,
    baseDamage: 55,
    auraCost: 35,
    oaths: [{ type: 'LOW_HP_THRESHOLD', threshold: 0.5, bonusMultiplier: 0.5 }],
    description: 'Wraps a blade around the target’s heart with strict conditional rules.',
    effect: 'LETHAL_OATH'
  },
  EMPEROR_TIME: {
    id: 'EMPEROR_TIME',
    name: 'Emperor Time',
    character: 'Kurapika',
    category: NEN_CATEGORIES.SPECIALIST,
    baseDamage: 40,
    auraCost: 30,
    description: 'Scarlet eyes shift category to Specialist, granting 100% efficiency in all Nen types.',
    effect: 'PERFECT_AFFINITY'
  },

  // LEORIO PARADINIGHT
  REMOTE_PUNCH: {
    id: 'REMOTE_PUNCH',
    name: 'Remote Punch (Warp Blast)',
    character: 'Leorio Paradinight',
    category: NEN_CATEGORIES.EMITTER,
    baseDamage: 36,
    auraCost: 20,
    description: 'Emits aura through surface terrain to punch opponent from an unpredictable angle.',
    effect: 'BYPASS_DEFENSE'
  },

  // GENTHRU (THE BOMBER)
  COUNTDOWN: {
    id: 'COUNTDOWN',
    name: 'Countdown Bomb',
    character: 'Genthru',
    category: NEN_CATEGORIES.CONJURER,
    baseDamage: 52,
    auraCost: 30,
    description: 'Plants an invisible aura bomb that detonates for colossal area damage.',
    effect: 'EXPLOSIVE_BOMB'
  },
  LITTLE_FLOWER: {
    id: 'LITTLE_FLOWER',
    name: 'Little Flower',
    character: 'Genthru',
    category: NEN_CATEGORIES.TRANSMUTER,
    baseDamage: 42,
    auraCost: 22,
    description: 'Wraps hands in explosive aura, blowing up whatever he grabs.',
    effect: 'CLOSE_EXPLOSION'
  },

  // KASTRO
  DOPPELGANGER: {
    id: 'DOPPELGANGER',
    name: 'Doppelganger (Tiger Bite Fist)',
    character: 'Kastro',
    category: NEN_CATEGORIES.CONJURER,
    baseDamage: 38,
    auraCost: 24,
    description: 'Conjures a duplicate body to execute a synchronous dual strike.',
    effect: 'DUAL_STRIKE'
  },

  // ZUSHI
  REN_PALM: {
    id: 'REN_PALM',
    name: 'Ren Palm Strike',
    character: 'Zushi',
    category: NEN_CATEGORIES.ENHANCER,
    baseDamage: 24,
    auraCost: 12,
    description: 'Fundamental martial arts palm strike infused with focused Ren.',
    effect: 'BASIC_REN'
  }
};

/**
 * Returns canonical Hatsu list for a given character or defaults to generic library.
 */
function getCharacterHatsu(characterName) {
  const name = (characterName || '').toLowerCase();
  const list = [];

  for (const key in CANONICAL_HATSU) {
    const h = CANONICAL_HATSU[key];
    if (name.includes(h.character.toLowerCase().split(' ')[0])) {
      list.push(h);
    }
  }

  if (list.length > 0) return list;

  // Fallback defaults
  return [
    {
      id: 'GENERIC_HATSU',
      name: 'Focused Aura Blast',
      category: NEN_CATEGORIES.EMITTER,
      baseDamage: 30,
      auraCost: 20,
      description: 'A concentrated release of Nen energy.'
    }
  ];
}

// Export for Node.js or Browser Global
const NenEngine = {
  NEN_CATEGORIES,
  AFFINITY_MATRIX,
  WATER_DIVINATION_RESULTS,
  evaluateWaterDivination,
  STANCES,
  FOCUS_STATES,
  CANONICAL_HATSU,
  getCharacterHatsu,
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
