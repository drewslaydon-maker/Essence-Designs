// Smoke tests — one of each ability cost-shape, plus module-level unit checks.
// Run with: npm test

import { test } from "node:test";
import assert from "node:assert/strict";

import { ANCHORS, ROLES } from "../data";
import { EVENTS } from "../events";
import {
  BAD_CALL_THRESHOLD,
  BANK_EXPOSURE_HAIRCUT,
  BANK_GROWTH_CAP_ROUNDS,
  BANK_GROWTH_RATE,
  CATEGORIES,
  MORALE_ON_CLAIM,
} from "../constants";
import { computeGTL, computeReveal, weightedDraw } from "../gtl";
import {
  maudeTax,
  resolveDezRound,
  stepDez,
  stepMaude,
  stepRicky,
} from "../personas";
import { applyBankExposure, claimBank, tickBankGrowth } from "../barriers";
import {
  applyLevelTax,
  applySalvageAutoSpend,
  initialState,
  isUnderPressure,
  pressureForMoraleDrain,
} from "../mechanics";

// ---- ROLES data ----

test("ROLES exposes 12 abilities across 4 cost-shapes", () => {
  const all = ROLES.flatMap((r) => r.abilities);
  assert.strictEqual(all.length, 12);
  const shapes = new Set(all.map((a) => a.shape));
  assert.strictEqual(shapes.size, 4);
});

test("ANCHORS exposes ricky/maude/dez with distinct nativeFront", () => {
  assert.strictEqual(Object.keys(ANCHORS).length, 3);
  assert.strictEqual(ANCHORS.ricky.nativeFront, "entropy");
  assert.strictEqual(ANCHORS.maude.nativeFront, "systems");
  assert.strictEqual(ANCHORS.dez.nativeFront, "re");
});

// ---- GTL ----

test("computeGTL: optimalFront is the front with smallest TTF", () => {
  const gtl = computeGTL(
    1,
    { entropy: 90, systems: 100, re: 100 },
    { entropy: 0, systems: 0, re: 0 },
  );
  // entropy at 90 means only 10 distance to failure → smallest TTF
  assert.strictEqual(gtl.optimalFront, "entropy");
});

test("computeGTL: BANKING_GTL_CREDIT flows into chosenFront", () => {
  const state = { entropy: 50, systems: 100, re: 100 };
  const without = computeGTL(1, state, { entropy: 0, systems: 0, re: 0 });
  const withBanking = computeGTL(1, state, { entropy: 0, systems: 0, re: 16 * 0.4 });
  // RE banking credit pulls chosenFront toward re.
  assert.strictEqual(without.chosenFront, "systems");
  assert.strictEqual(withBanking.chosenFront, "re");
});

// ---- Reveal ----

test("computeReveal: rng returning a low value produces a lull (rng < lullChance)", () => {
  const lowRng = () => 0.05;
  const reveal = computeReveal(1, 0, { low: 0, high: 0, desperate: 0 }, 0, [], lowRng);
  assert.strictEqual(reveal.incoming, "lull");
  assert.strictEqual(reveal.eventId, null);
});

test("weightedDraw: totalActions === 0 returns any valid category", () => {
  const cat = weightedDraw({ low: 0, high: 0, desperate: 0 }, 0);
  assert.ok(cat === "targeted" || cat === "telegraphed" || cat === "cascading");
});

// ---- Belief / Distrust ----

test("stepRicky: zeros belief on bad call (gapMagnitude > BAD_CALL_THRESHOLD)", () => {
  const forceBad = {
    optimalFront: "entropy",
    chosenFront: "entropy",
    gapMagnitude: BAD_CALL_THRESHOLD + 0.1,
    levelEfficiency: 0.5,
  };
  const result = stepRicky(5, forceBad);
  assert.strictEqual(result.belief, 0);
  assert.strictEqual(result.ready, false);
});

test("stepRicky: builds belief on a good call", () => {
  const good = {
    optimalFront: "entropy",
    chosenFront: "entropy",
    gapMagnitude: 0,
    levelEfficiency: 1,
  };
  const result = stepRicky(0, good);
  assert.ok((result.belief ?? 0) > 0);
});

test("stepMaude: erosion subtracts belief proportional to tax", () => {
  const good = {
    optimalFront: "systems",
    chosenFront: "systems",
    gapMagnitude: 0,
    levelEfficiency: 1,
  };
  const noTax = stepMaude(0, good, 0);
  const withTax = stepMaude(0, good, 0.5);
  assert.ok((noTax.belief ?? 0) > (withTax.belief ?? 0));
});

test("stepDez: returns defianceChance > 0 when trust < distrustThreshold", () => {
  const gtl = {
    optimalFront: "entropy",
    chosenFront: "entropy",
    gapMagnitude: 0.3,
    levelEfficiency: 0.7,
  };
  const result = stepDez(-5, gtl);
  assert.ok((result.defianceChance ?? 0) > 0);
});

// ---- Maude's friction tax ----

test("maudeTax: 0 → 0, grace rounds → base tax, beyond grace → scales", () => {
  assert.strictEqual(maudeTax(0), 0);
  assert.strictEqual(maudeTax(3), 0.25);
  assert.ok(maudeTax(10) > 0.25);
  assert.ok(maudeTax(100) <= 0.70);
});

// ---- Dez defiance ----

test("resolveDezRound: never fires when optimalFront !== 're'", () => {
  const gtl = {
    optimalFront: "systems",
    chosenFront: "entropy",
    gapMagnitude: 0.6,
    levelEfficiency: 0.4,
  };
  const result = resolveDezRound(
    -5,
    gtl,
    { abilityId: "force_extraction", level: "I" },
    () => 0.5,
  );
  assert.strictEqual(result.defianceFired, false);
});

test("resolveDezRound: fires when optimalFront === 're' and roll < defianceChance", () => {
  const gtl = {
    optimalFront: "re",
    chosenFront: "entropy",
    gapMagnitude: 0.6,
    levelEfficiency: 0.4,
  };
  const result = resolveDezRound(
    -5,
    gtl,
    { abilityId: "force_extraction", level: "I" },
    () => 0,
  );
  assert.strictEqual(result.defianceFired, true);
  assert.strictEqual(result.overrideAbility, "patch_job");
});

// ---- Barriers ----

test("tickBankGrowth: compounds banked value under cap", () => {
  const entry = { abilityId: "x", front: "re" as const, banked: 4, roundsHeld: 0 };
  const ticked = tickBankGrowth(entry);
  assert.strictEqual(ticked.roundsHeld, 1);
  assert.ok(Math.abs(ticked.banked - 4 * (1 + BANK_GROWTH_RATE)) < 1e-9);
});

test("tickBankGrowth: locks growth after BANK_GROWTH_CAP_ROUNDS", () => {
  let entry = { abilityId: "x", front: "re" as const, banked: 4, roundsHeld: 0 };
  for (let i = 0; i < BANK_GROWTH_CAP_ROUNDS + 2; i++) entry = tickBankGrowth(entry);
  assert.strictEqual(entry.roundsHeld, BANK_GROWTH_CAP_ROUNDS + 2);
  const locked = tickBankGrowth(entry);
  assert.strictEqual(locked.banked, entry.banked);
});

test("applyBankExposure: matching front gets haircut", () => {
  const entry = { abilityId: "x", front: "re" as const, banked: 10, roundsHeld: 2 };
  const exposed = applyBankExposure(entry, "re");
  assert.ok(Math.abs(exposed.banked - 10 * (1 - BANK_EXPOSURE_HAIRCUT)) < 1e-9);
});

test("applyBankExposure: non-matching front unchanged", () => {
  const entry = { abilityId: "x", front: "re" as const, banked: 10, roundsHeld: 2 };
  const exposed = applyBankExposure(entry, "systems");
  assert.strictEqual(exposed.banked, 10);
});

test("claimBank: returns payout + morale gain", () => {
  const entry = { abilityId: "x", front: "re" as const, banked: 5, roundsHeld: 1 };
  const claimed = claimBank(entry);
  assert.strictEqual(claimed.payout, 5);
  assert.strictEqual(claimed.moraleGain, MORALE_ON_CLAIM);
});

// ---- Mechanics ----

test("initialState: defaults to ricky, entropy 0, systems/re 100", () => {
  const s = initialState();
  assert.strictEqual(s.anchorPersona, "ricky");
  assert.strictEqual(s.entropy, 0);
  assert.strictEqual(s.systems, 100);
  assert.strictEqual(s.re, 100);
  assert.strictEqual(s.openBanks.length, 0);
});

test("pressureForMoraleDrain: morale low alone does NOT trigger drain", () => {
  assert.strictEqual(
    pressureForMoraleDrain({ entropy: 0, systems: 100, re: 100 }),
    false,
  );
});

test("isUnderPressure: low morale DOES trigger the UI banner", () => {
  const s = initialState();
  s.morale = 10;
  assert.strictEqual(isUnderPressure(s), true);
});

test("applyLevelTax: Level III unforced drains morale", () => {
  const prev = { low: 0, high: 0, desperate: 0 };
  const out = applyLevelTax({
    level: "III",
    underPressure: false,
    currentMorale: 50,
    actionLabel: "Overload",
    prevAxisCounts: prev,
  });
  assert.ok(out.morale < 50);
  assert.strictEqual(out.axisCounts.high, 1);
  assert.strictEqual(out.axisCounts.desperate, 0);
});

test("applyLevelTax: Level III under pressure does NOT drain morale", () => {
  const prev = { low: 0, high: 0, desperate: 0 };
  const out = applyLevelTax({
    level: "III",
    underPressure: true,
    currentMorale: 50,
    actionLabel: "Overload",
    prevAxisCounts: prev,
  });
  assert.strictEqual(out.morale, 50);
  assert.strictEqual(out.axisCounts.high, 1);
  assert.strictEqual(out.axisCounts.desperate, 1);
});

test("applyLevelTax: Level II is neutral", () => {
  const prev = { low: 0, high: 0, desperate: 0 };
  const out = applyLevelTax({
    level: "II",
    underPressure: false,
    currentMorale: 50,
    actionLabel: "X",
    prevAxisCounts: prev,
  });
  assert.strictEqual(out.axisCounts.low, 0);
  assert.strictEqual(out.axisCounts.high, 0);
  assert.strictEqual(out.morale, 50);
});

test("applySalvageAutoSpend: weak front gets the restoration", () => {
  const out = applySalvageAutoSpend({
    entropy: 80,
    systems: 100,
    re: 50,
    salvage: 10,
    salvageTarget: "auto",
  });
  assert.strictEqual(out.target, "re");
  assert.ok(out.re > 50);
});

test("applySalvageAutoSpend: explicit target respected", () => {
  const out = applySalvageAutoSpend({
    entropy: 50,
    systems: 50,
    re: 100,
    salvage: 10,
    salvageTarget: "entropy",
  });
  assert.strictEqual(out.target, "entropy");
});

// ---- One-of-each-shape integration sanity check ----

test("integration: different-front + same-front-later + banking in one round produces expected state shape", () => {
  const helmAbility = ROLES[0].abilities.find((a) => a.shape === "different_front_now");
  const engAbility = ROLES[1].abilities.find((a) => a.shape === "same_front_later");
  const aftAbility = ROLES[2].abilities.find((a) => a.shape === "deferred_compounding");
  assert.ok(helmAbility && engAbility && aftAbility);
  assert.strictEqual(helmAbility.levels.I.entropyDelta, -1.5);
  assert.strictEqual(helmAbility.levels.I.systemsDelta, -3);
  assert.strictEqual(engAbility.levels.I.systemsDelta, 6);
  assert.strictEqual(engAbility.levels.I.wearBump, 0.02);
  assert.strictEqual(aftAbility.levels.I.banked, 4);
  assert.strictEqual(aftAbility.front, "re");
});

// ---- EVENTS ----

test("EVENTS: each event has two choices at levels I and III", () => {
  for (const ev of EVENTS) {
    assert.strictEqual(ev.choices.length, 2);
    assert.strictEqual(ev.choices[0].level, "I");
    assert.strictEqual(ev.choices[1].level, "III");
  }
});

// ---- CATEGORIES ----

test("CATEGORIES: each category has axis, dmgRange, hits, label, tag", () => {
  for (const cat of Object.values(CATEGORIES)) {
    assert.ok(["ruthless", "methodical", "desperate"].includes(cat.axis));
    assert.strictEqual(cat.dmgRange.length, 2);
    assert.ok(cat.dmgRange[1] > cat.dmgRange[0]);
    assert.ok(["entropy", "systems", "re"].includes(cat.hits));
    assert.ok(typeof cat.label === "string" && cat.label.length > 0);
    assert.ok(typeof cat.tag === "string" && cat.tag.length > 0);
  }
});
