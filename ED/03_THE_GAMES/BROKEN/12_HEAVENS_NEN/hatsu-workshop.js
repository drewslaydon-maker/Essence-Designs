const NE = typeof NenEngine !== 'undefined' ? NenEngine : (typeof require !== 'undefined' ? require('./nen-engine.js') : null);

function getCategoryEfficiency(userCat, targetCat) {
  return NE ? NE.getCategoryEfficiency(userCat, targetCat) : 1.0;
}

function calculateOathMultiplier(oaths, fighterState) {
  return NE ? NE.calculateOathMultiplier(oaths, fighterState) : 1.0;
}

const OATH_PRESETS = {
  LOW_HP_THRESHOLD: {
    type: 'LOW_HP_THRESHOLD',
    id: 'LOW_HP_THRESHOLD',
    name: 'Low HP Threshold',
    description: 'Trigger when HP <= 30%',
    bonusMultiplier: 0.8
  },
  ZETSU_PREP_TURNS: {
    type: 'ZETSU_PREP_TURNS',
    id: 'ZETSU_PREP_TURNS',
    name: 'Zetsu Prep Turns',
    description: 'Require prior turn in ZETSU',
    bonusMultiplier: 1.0
  },
  RISK_SELF_STUN: {
    type: 'RISK_SELF_STUN',
    id: 'RISK_SELF_STUN',
    name: 'Risk Self Stun',
    description: 'Self-stun risk on execution',
    bonusMultiplier: 0.5
  },
  SINGLE_TARGET_ONLY: {
    type: 'SINGLE_TARGET_ONLY',
    id: 'SINGLE_TARGET_ONLY',
    name: 'Single Target Only',
    description: 'Strict target limitation',
    bonusMultiplier: 0.3
  }
};

function validateHatsu(config) {
  const errors = [];
  
  if (!config.name || typeof config.name !== 'string' || config.name.trim() === '') {
    errors.push('Hatsu must have a non-empty name string.');
  }
  
  if (!config.category) {
    errors.push('Hatsu must specify a category.');
  }
  
  if (typeof config.baseDamage !== 'number' || config.baseDamage <= 0) {
    errors.push('Hatsu must have baseDamage > 0.');
  }
  
  if (typeof config.auraCost !== 'number' || config.auraCost < 5) {
    errors.push('Hatsu must have auraCost >= 5.');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function calculateHatsuPower(config, userCategory) {
  const efficiency = getCategoryEfficiency(userCategory, config.category);
  
  // calculateOathMultiplier in nen-engine calculates multipliers based on active fighter state during combat.
  // For the static workshop calculation, we compute the prospective multiplier assuming oath condition is met.
  let oathBonus = 1.0;
  if (Array.isArray(config.oaths)) {
    config.oaths.forEach(oath => {
      if (typeof oath === 'object') {
        if (oath.bonusMultiplier) {
          oathBonus += oath.bonusMultiplier;
        } else if (oath.type === 'LOW_HP_THRESHOLD') {
          oathBonus += 0.8;
        } else if (oath.type === 'ZETSU_PREP_TURNS') {
          oathBonus += 1.0;
        } else if (oath.type === 'RISK_SELF_STUN') {
          oathBonus += 0.5;
        } else if (oath.type === 'SINGLE_TARGET_ONLY') {
          oathBonus += 0.3;
        }
      }
    });
  }
  
  const finalEffectiveDamage = config.baseDamage * efficiency * oathBonus;
  
  return {
    effectiveDamage: finalEffectiveDamage,
    auraCost: config.auraCost,
    efficiency: efficiency,
    oathMultiplier: oathBonus
  };
}

function createCustomHatsu(config, userCategory) {
  const validation = validateHatsu(config);
  if (!validation.valid) {
    throw new Error(`Invalid Hatsu configuration: ${validation.errors.join(' ')}`);
  }
  
  const powerStats = calculateHatsuPower(config, userCategory);
  
  return {
    name: config.name,
    category: config.category,
    baseDamage: config.baseDamage,
    auraCost: config.auraCost,
    effect: config.effect || null,
    oaths: config.oaths || [],
    powerStats: powerStats
  };
}

const HatsuWorkshop = {
  OATH_PRESETS,
  validateHatsu,
  calculateHatsuPower,
  createCustomHatsu
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HatsuWorkshop;
}
if (typeof window !== 'undefined') {
  window.HatsuWorkshop = HatsuWorkshop;
}
