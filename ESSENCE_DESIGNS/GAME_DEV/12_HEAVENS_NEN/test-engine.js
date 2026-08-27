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

// Test 1: Category Affinity Calculation
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

console.log('\n----------------------------------------------------');
console.log(`Results: ${passCount} Passed, ${failCount} Failed.`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
