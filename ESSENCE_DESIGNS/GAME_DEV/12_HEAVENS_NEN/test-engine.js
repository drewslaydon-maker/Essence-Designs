/**
 * HEAVEN'S NEN ARENA — Engine Test Suite & Simulation
 */

const {
  NEN_CATEGORIES,
  STANCES,
  FOCUS_STATES,
  createFighter,
  getCategoryEfficiency,
  applyStartOfTurn,
  resolveAttack
} = require('./nen-engine.js');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[✔ PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[✖ FAIL] ${testName}`);
    failCount++;
  }
}

console.log('====================================================');
console.log("   HEAVEN'S NEN ARENA — Core Engine Diagnostic Run   ");
console.log('====================================================\n');

// Test 1: Category Affinity Calculation & Water Divination
const { evaluateWaterDivination, WATER_DIVINATION_RESULTS } = require('./nen-engine.js');
const wdtResult = evaluateWaterDivination([0, 0, 1]); // Enhancer lean
assert(wdtResult.category === NEN_CATEGORIES.ENHANCER, 'Water Divination evaluation identifies Enhancer affinity');
assert(WATER_DIVINATION_RESULTS.Enhancer.reaction === 'Water Overflows!', 'Water Divination has correct Enhancer reaction');

const enhancerToTransmuter = getCategoryEfficiency(NEN_CATEGORIES.ENHANCER, NEN_CATEGORIES.TRANSMUTER);
assert(enhancerToTransmuter === 0.8, 'Enhancer learning Transmutation at 80% efficiency');

const enhancerToSpecialist = getCategoryEfficiency(NEN_CATEGORIES.ENHANCER, NEN_CATEGORIES.SPECIALIST);
assert(enhancerToSpecialist === 0.0, 'Enhancer has 0% natural Specialist efficiency');

// Test 2: Fighter Creation
const gon = createFighter({ name: 'Gon Freecss', category: NEN_CATEGORIES.ENHANCER, maxHp: 100, maxAura: 100, baseAtk: 20, baseDef: 10 });
const hisoka = createFighter({ name: 'Hisoka Morow', category: NEN_CATEGORIES.TRANSMUTER, maxHp: 120, maxAura: 120, baseAtk: 22, baseDef: 12 });

assert(gon.hp === 100 && gon.stance === STANCES.TEN, 'Gon created with 100 HP and default TEN stance');

// Test 3: Stance Aura Recovery & Costs
applyStartOfTurn(gon, STANCES.ZETSU, FOCUS_STATES.NORMAL);
assert(gon.stance === STANCES.ZETSU, 'Gon switches to ZETSU stance');

applyStartOfTurn(hisoka, STANCES.REN, FOCUS_STATES.NORMAL);
assert(hisoka.aura === 105, 'Hisoka spends 15 Aura for REN (120 - 15 = 105)');

// Test 4: Ko Strike on Zetsu Target (Devastating & Points)
const resultKo = resolveAttack(hisoka, gon, { type: 'STRIKE' });
assert(gon.hp < 100, 'Gon takes damage');
assert(resultKo.pointsAwarded >= 1, 'Point awarded for Clean/Critical Hit against Zetsu target');

// Test 5: Point System & KO Instant Win
const dummyDef = createFighter({ name: 'Dummy Target', maxHp: 20, baseDef: 0 });
const resultKoWin = resolveAttack(hisoka, dummyDef, { type: 'STRIKE' });
assert(resultKoWin.isKO === true, 'Target KO reached when HP hits 0');
assert(resultKoWin.pointsAwarded === 10, '10 Points awarded for KO');
assert(resultKoWin.isMatchOver === true, 'Match triggers Instant Victory on KO');

// Test 6: Status Effects
function testStatusEffects() {
  const f1 = createFighter({ name: 'Kurapika', category: NEN_CATEGORIES.CONJURER });
  const f2 = createFighter({ name: 'Uvogin', category: NEN_CATEGORIES.ENHANCER });
  
  f1.stance = STANCES.REN;
  const payload = {
    type: 'HATSU',
    hatsu: {
      name: 'Chain Jail',
      category: 'Conjurer',
      baseDamage: 10,
      auraCost: 10,
      effect: 'FORCE_ZETSU'
    }
  };

  resolveAttack(f1, f2, payload);
  assert(f2.statusEffects.some(e => e.type === 'FORCE_ZETSU'), 'FORCE_ZETSU effect applied to defender');
  
  applyStartOfTurn(f2, STANCES.TEN, FOCUS_STATES.NORMAL);
  assert(f2.isForcedZetsu === true, 'isForcedZetsu flag is true');
  assert(f2.stance === STANCES.ZETSU, 'Fighter forced into ZETSU stance');

  const f3 = createFighter({ name: 'Killua', category: NEN_CATEGORIES.TRANSMUTER });
  const f4 = createFighter({ name: 'Youpi', category: NEN_CATEGORIES.ENHANCER });
  f3.stance = STANCES.REN;
  const stunPayload = {
    type: 'HATSU',
    hatsu: {
      name: 'Thunderbolt',
      category: 'Transmuter',
      baseDamage: 10,
      auraCost: 10,
      effect: 'STUN_SHOCK'
    }
  };
  resolveAttack(f3, f4, stunPayload);
  applyStartOfTurn(f4, STANCES.TEN, FOCUS_STATES.NORMAL);
  assert(f4.isStunned === true, 'isStunned flag is true');
  
  const stunRes = resolveAttack(f4, f3, { type: 'STRIKE' });
  assert(stunRes.success === false, 'Stunned fighter fails to attack');

  const f5 = createFighter({ name: 'Test' });
  f5.statusEffects.push({ type: 'SPEED_BUFF', duration: 2 });
  applyStartOfTurn(f5, STANCES.TEN, FOCUS_STATES.NORMAL);
  assert(f5.statusEffects.find(e => e.type === 'SPEED_BUFF').duration === 1, 'Duration decremented to 1');
  applyStartOfTurn(f5, STANCES.TEN, FOCUS_STATES.NORMAL);
  assert(f5.statusEffects.find(e => e.type === 'SPEED_BUFF') === undefined, 'Effect expired and removed from array');
}

testStatusEffects();

// Test 7: Tower Ascent Logic
const { getFloorOpponent, createPlayerCampaignState, resolveFloorVictory } = require('./tower-engine.js');

const oppF1 = getFloorOpponent(1);
assert(oppF1.name === 'Floor 1 Brawler', 'getFloorOpponent(1) returns Floor 1 Brawler');

const oppF220 = getFloorOpponent(220);
assert(oppF220.name === 'Hisoka Morow', 'getFloorOpponent(220) returns Hisoka Morow');

const mockPlayer = createFighter({ name: 'Player' });
const campState = createPlayerCampaignState(mockPlayer);
assert(campState.currentFloor === 1 && campState.trainingPoints === 0, 'Campaign state initializes on Floor 1 with 0 training points');

const winSummary = resolveFloorVictory(campState);
assert(campState.currentFloor === 2 && campState.trainingPoints === 3, 'Floor victory increments floor to 2 and awards 3 training points');

console.log('\n----------------------------------------------------');
console.log(`Results: ${passCount} Passed, ${failCount} Failed.`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
