/**
 * HEAVEN'S NEN ARENA — Monte Carlo Combat Simulation
 * Runs N automated fights across floor encounters and builds to test mechanical balance.
 */

const {
  NEN_CATEGORIES,
  STANCES,
  FOCUS_STATES,
  createFighter,
  applyStartOfTurn,
  resolveAttack
} = require('./nen-engine.js');

function runSimulation(numMatches = 100) {
  let enhancerWins = 0;
  let transmuterWins = 0;
  let totalTurns = 0;
  let totalPointsScored = 0;

  for (let i = 0; i < numMatches; i++) {
    const f1 = createFighter({
      id: 'f1',
      name: 'Gon (Enhancer)',
      category: NEN_CATEGORIES.ENHANCER,
      maxHp: 100,
      maxAura: 100,
      baseAtk: 16,
      baseDef: 12
    });

    const f2 = createFighter({
      id: 'f2',
      name: 'Hisoka (Transmuter)',
      category: NEN_CATEGORIES.TRANSMUTER,
      maxHp: 100,
      maxAura: 110,
      baseAtk: 16,
      baseDef: 12
    });

    let turn = 0;
    let matchOver = false;

    while (!matchOver && turn < 50) {
      turn++;
      
      // Determine Turn Initiative based on Speed & Stance
      const f1Speed = f1.speed * (f1.stance === STANCES.REN ? 1.2 : 1.0);
      const f2Speed = f2.speed * (f2.stance === STANCES.REN ? 1.2 : 1.0);
      const first = f1Speed >= f2Speed ? f1 : f2;
      const second = f1Speed >= f2Speed ? f2 : f1;

      // AI Decision Logic
      let f1Stance = STANCES.TEN, f1Focus = FOCUS_STATES.NORMAL;
      let f2Stance = STANCES.TEN, f2Focus = FOCUS_STATES.NORMAL;

      if (f1.aura < 20) f1Stance = STANCES.ZETSU;
      else if (f1.aura >= 15 && Math.random() > 0.3) f1Stance = STANCES.REN;
      if (f1.aura >= 30 && Math.random() > 0.7) f1Focus = FOCUS_STATES.KO;

      if (f2.aura < 20) f2Stance = STANCES.ZETSU;
      else if (f2.aura >= 15 && Math.random() > 0.3) f2Stance = STANCES.REN;
      if (f2.aura >= 30 && Math.random() > 0.7) f2Focus = FOCUS_STATES.KO;

      applyStartOfTurn(f1, f1Stance, f1Focus);
      applyStartOfTurn(f2, f2Stance, f2Focus);

      // FirstAttacker turn
      const res1 = resolveAttack(first, second, { type: 'STRIKE' });
      totalPointsScored += res1.pointsAwarded;
      if (res1.isMatchOver) {
        if (first.id === 'f1') enhancerWins++;
        else transmuterWins++;
        matchOver = true;
        break;
      }

      // SecondAttacker turn
      const res2 = resolveAttack(second, first, { type: 'STRIKE' });
      totalPointsScored += res2.pointsAwarded;
      if (res2.isMatchOver) {
        if (second.id === 'f1') enhancerWins++;
        else transmuterWins++;
        matchOver = true;
        break;
      }
    }

    totalTurns += turn;
  }

  console.log('====================================================');
  console.log(`   NEN ARENA MONTE CARLO SIMULATION (${numMatches} MATCHES)   `);
  console.log('====================================================');
  console.log(`Gon (Enhancer) Win Rate:     ${((enhancerWins / numMatches) * 100).toFixed(1)}% (${enhancerWins} wins)`);
  console.log(`Hisoka (Transmuter) Win Rate: ${((transmuterWins / numMatches) * 100).toFixed(1)}% (${transmuterWins} wins)`);
  console.log(`Avg Match Duration:          ${(totalTurns / numMatches).toFixed(1)} turns`);
  console.log(`Avg Points per Match:        ${(totalPointsScored / numMatches).toFixed(1)} points`);
  console.log('====================================================\n');
}

runSimulation(100);
