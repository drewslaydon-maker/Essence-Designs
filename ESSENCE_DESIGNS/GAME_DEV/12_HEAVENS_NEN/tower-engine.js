const NE = require('./nen-engine.js');

function getFloorOpponent(floorNumber) {
  if (floorNumber < 50) {
    return NE.createFighter({
      name: `Floor ${floorNumber} Brawler`,
      category: NE.NEN_CATEGORIES.ENHANCER,
      maxHp: 80 + floorNumber,
      maxAura: 50,
      baseAtk: 12 + Math.floor(floorNumber / 5),
      baseDef: 8 + Math.floor(floorNumber / 5),
      speed: 8
    });
  } else if (floorNumber < 100) {
    return NE.createFighter({
      name: `Floor ${floorNumber} Initiate`,
      category: NE.NEN_CATEGORIES.ENHANCER,
      maxHp: 90 + floorNumber,
      maxAura: 80,
      baseAtk: 15 + Math.floor(floorNumber / 5),
      baseDef: 10 + Math.floor(floorNumber / 5),
      speed: 10
    });
  } else if (floorNumber < 200) {
    return NE.createFighter({
      name: `Floor ${floorNumber} Specialist`,
      category: NE.NEN_CATEGORIES.EMITTER,
      maxHp: 100 + floorNumber,
      maxAura: 100,
      baseAtk: 18 + Math.floor(floorNumber / 5),
      baseDef: 12 + Math.floor(floorNumber / 5),
      speed: 12
    });
  } else {
    // Floor Masters (200+)
    if (floorNumber === 200) {
      return NE.createFighter({ name: 'Zushi', category: NE.NEN_CATEGORIES.ENHANCER, maxHp: 85, maxAura: 85, baseAtk: 14, baseDef: 14, speed: 10 });
    } else if (floorNumber === 205) {
      return NE.createFighter({ name: 'Kastro', category: NE.NEN_CATEGORIES.CONJURER, maxHp: 95, maxAura: 95, baseAtk: 17, baseDef: 11, speed: 12 });
    } else if (floorNumber === 220) {
      return NE.createFighter({ name: 'Hisoka Morow', category: NE.NEN_CATEGORIES.TRANSMUTER, maxHp: 100, maxAura: 110, baseAtk: 18, baseDef: 12, speed: 13 });
    } else if (floorNumber === 230) {
      return NE.createFighter({ name: 'Genthru', category: NE.NEN_CATEGORIES.CONJURER, maxHp: 105, maxAura: 100, baseAtk: 19, baseDef: 12, speed: 14 });
    } else if (floorNumber === 250) {
      return NE.createFighter({ name: 'Chrollo Lucilfer', category: NE.NEN_CATEGORIES.SPECIALIST, maxHp: 110, maxAura: 120, baseAtk: 20, baseDef: 13, speed: 15 });
    } else {
      return NE.createFighter({ name: `Floor Master ${floorNumber}`, category: NE.NEN_CATEGORIES.SPECIALIST, maxHp: 120, maxAura: 120, baseAtk: 20, baseDef: 15, speed: 14 });
    }
  }
}

function createPlayerCampaignState(fighter) {
  return {
    currentFloor: 1,
    unlockedFloor: 1,
    wins: 0,
    losses: 0,
    trainingPoints: 0,
    fighter
  };
}

function resolveFloorVictory(campaignState) {
  campaignState.currentFloor++;
  if (campaignState.currentFloor > campaignState.unlockedFloor) {
    campaignState.unlockedFloor = campaignState.currentFloor;
  }
  campaignState.wins++;
  campaignState.trainingPoints += 3;
  return {
    success: true,
    newFloor: campaignState.currentFloor,
    totalWins: campaignState.wins,
    trainingPointsEarned: 3
  };
}

module.exports = {
  getFloorOpponent,
  createPlayerCampaignState,
  resolveFloorVictory
};
