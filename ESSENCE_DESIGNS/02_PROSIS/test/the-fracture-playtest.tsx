import { useState, useRef, useEffect } from "react";
import { Zap, Flame, Sparkles, AlertTriangle, Skull, Eye, EyeOff, RotateCcw, HelpCircle, Trophy, Rocket, Heart, Radar, Compass } from "lucide-react";

// ============================================================
// THE FRACTURE — v5: 3 abilities x 3 levels per role, more events
// ============================================================
const LEVELS = { I: { cost: 1.0 }, II: { cost: 2.5 }, III: { cost: 5.5 } };

// Ability redesign — 3 cost-shapes x 3 roles. Every role gets exactly one of:
// different_front_now / same_front_later / deferred_compounding.
// Replaces the prior 9 (which mixed "clean free fixes" with costed abilities —
// the root cause of the "random toolbox" feedback; see 2026-08-19 handoff).
const ROLES = [
  { id: "helm", name: "Helm", personalName: "Helm", focus: "Entropy & Foresight",
    abilities: [
      { id: "force_correction", label: "Force the Correction", shape: "different_front_now",
        desc: "Entropy drops immediately. Systems takes the hit, same round.",
        levels: { I: { entropyDelta: -1.5, systemsDelta: -3 }, II: { entropyDelta: -3.5, systemsDelta: -6 }, III: { entropyDelta: -7, systemsDelta: -10 } } },
      { id: "suppress", label: "Suppress", shape: "same_front_later",
        desc: "Entropy drops now. Ambient Entropy growth runs hot for the next 2 rounds.",
        levels: { I: { entropyDelta: -1, ambientBump: 0.02, bumpRounds: 2 }, II: { entropyDelta: -2.5, ambientBump: 0.04, bumpRounds: 2 }, III: { entropyDelta: -5, ambientBump: 0.07, bumpRounds: 2 } } },
      { id: "threat_ledger", label: "Threat Ledger", shape: "deferred_compounding",
        desc: "Raises a barrier against Entropy. The longer it holds, the more it's worth — but an Entropy spike while it's up costs the barrier the same haircut Entropy itself would take.",
        levels: { I: { banked: 2 }, II: { banked: 5 }, III: { banked: 9 } },
        front: "entropy" },
      { id: "analyze", label: "Analyze", shape: "personal",
        desc: "Reads the incoming threat before it lands. Softens it for the whole crew this round. No front healed — this is foresight, not repair.",
        levels: { I: { mitigation: 0.35, morale: 2 }, II: { mitigation: 0.55, morale: 3 }, III: { mitigation: 0.75, morale: 4 } } },
    ] },
  { id: "engineer", name: "Engineer", personalName: "Gene", focus: "Systems Health",
    abilities: [
      { id: "overload", label: "Overload", shape: "different_front_now",
        desc: "Big Systems gain. Entropy takes the hit, same round.",
        levels: { I: { systemsDelta: 7, entropyDelta: 1 }, II: { systemsDelta: 15, entropyDelta: 2.5 }, III: { systemsDelta: 26, entropyDelta: 5 } } },
      { id: "overclock", label: "Overclock", shape: "same_front_later",
        desc: "Systems gain now. Systems' own wear rate runs hot for the next 2 rounds.",
        levels: { I: { systemsDelta: 6, wearBump: 0.02, bumpRounds: 2 }, II: { systemsDelta: 13, wearBump: 0.04, bumpRounds: 2 }, III: { systemsDelta: 23, wearBump: 0.07, bumpRounds: 2 } } },
      { id: "reserve_cache", label: "Reserve Cache", shape: "deferred_compounding",
        desc: "Raises a barrier around Systems. The longer it holds, the more it's worth — but a hit to Systems while it's up costs the barrier the same haircut Systems itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "systems" },
      { id: "dead_reckoning", label: "Dead Reckoning", shape: "personal",
        desc: "Charts a safer course through the incoming threat, softening it for the whole crew. Also buys any open barrier extra time to grow before exposure risk catches up. No front healed.",
        levels: { I: { mitigation: 0.2, extend: 1 }, II: { mitigation: 0.32, extend: 2 }, III: { mitigation: 0.45, extend: 3 } } },
    ] },
  { id: "aft", name: "Aft", personalName: "Sal", focus: "Reality Engine & Salvage",
    abilities: [
      { id: "force_extraction", label: "Force Extraction", shape: "different_front_now",
        desc: "Fast Salvage grab. The Reality Engine takes the hit, same round.",
        levels: { I: { salvageDelta: 5, reDelta: 0 }, II: { salvageDelta: 11, reDelta: -1 }, III: { salvageDelta: 20, reDelta: -3 } } },
      { id: "patch_job", label: "Patch Job", shape: "same_front_later",
        desc: "RE gain now. RE's own wear rate runs hot for the next 2 rounds.",
        levels: { I: { reDelta: 6, wearBump: 0.02, bumpRounds: 2 }, II: { reDelta: 13, wearBump: 0.04, bumpRounds: 2 }, III: { reDelta: 23, wearBump: 0.07, bumpRounds: 2 } } },
      { id: "stockpile", label: "Stockpile", shape: "deferred_compounding",
        // REDESIGNED 2026-08-20: previously banked Salvage, which left Aft as the
        // only role with no defensive tool for its own front (Force Extraction
        // actively drains RE for Salvage; old Stockpile didn't protect RE either).
        // A round-40 death from repeated Tier III Stockpile use draining RE over
        // time confirmed this structurally. Now mirrors Reserve Cache: banks RE.
        // Salvage generation stays fully on Force Extraction + passive income.
        desc: "Raises a barrier around the Reality Engine. The longer it holds, the more it's worth — but a hit to the Engine while it's up costs the barrier the same haircut the Engine itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "re" },
      { id: "ration_the_take", label: "Ration the Take", shape: "personal",
        desc: "Rations the crew's exposure to the incoming threat, softening it for everyone. Also shields any open barrier from this round's exposure haircut entirely. No front healed.",
        levels: { I: { mitigation: 0.2, shield: true }, II: { mitigation: 0.32, shield: true }, III: { mitigation: 0.45, shield: true } } },
    ] },
];

// ---- ANCHOR persona triad ----
// design law: every mechanic inherits persona/Fracture flavoring; universality
// is the exception, not the default (locked 2026-08-19/20).
const ANCHORS = {
  ricky: { id: "ricky", name: "Ricky", direction: "Risky", nativeFront: "entropy", color: "#FF4D6D",
    tag: "Different front, now — amplified.", blurb: "Proud. Arrogant. Mood-swingy. Makes the call, makes you live with it.",
    signature: "Kiss the gamble or curse it. Either way, you'll feel it.", pulseClass: "pulse-ricky" },
  maude: { id: "maude", name: "Maude", direction: "Moderate", nativeFront: "systems", color: "#6FA8FF",
    tag: "Same front, later — hers to carry.", blurb: "Overworked-manager energy. Holds it together through sheer, burning-out competence.",
    signature: "Someone has to hold the line. It's always her.", pulseClass: "pulse-maude" },
  dez: { id: "dez", name: "Dez", direction: "Desperate", nativeFront: "re", color: "#8B5CF6",
    tag: "Deferred, compounding — on your word.", blurb: "Hedges every order. Begs for authority without saying so. The crew is starting to notice.",
    signature: "I— I think this is right? If that's okay with everyone.", pulseClass: "pulse-dez" },
};
const SHAPE_PERSONA = { different_front_now: "ricky", same_front_later: "maude", deferred_compounding: "dez" };
const BASE_HEAL = 15; // Belief-spend base heal, before persona payout multiplier -- PLACEHOLDER, needs Drew's number

// ---- Ground Truth Logic (GTL) — bounded live version. Salvage excluded:
// it only grows/gets spent, doesn't decay toward failure like the other three. ----
function gtlDecayRate(front, round, activeModifiers) {
  const base = { entropy: { base: AMBIENT_BASE, growth: AMBIENT_GROWTH }, systems: { base: SYSTEMS_WEAR_BASE, growth: SYSTEMS_WEAR_GROWTH }, re: { base: RE_WEAR_BASE, growth: RE_WEAR_GROWTH } }[front];
  let rate = base.base + base.growth * round;
  if (activeModifiers[front]) rate += activeModifiers[front];
  return Math.max(rate, 0.0001);
}
function gtlDistance(front, state) { return front === "entropy" ? Math.max(0, 100 - state.entropy) : Math.max(0, state[front]); }
function gtlTTF(front, round, state, activeModifiers) { return gtlDistance(front, state) / gtlDecayRate(front, round, activeModifiers); }
function resolveChosenFront(roundEffects) {
  const helpScore = { entropy: -(roundEffects.entropy || 0), systems: roundEffects.systems || 0, re: roundEffects.re || 0 };
  return Object.entries(helpScore).sort((a, b) => b[1] - a[1])[0][0];
}
function computeGTL(round, state, roundEffects, activeModifiers = {}) {
  const fronts = ["entropy", "systems", "re"];
  const ttf = {}; fronts.forEach((f) => { ttf[f] = gtlTTF(f, round, state, activeModifiers); });
  const optimalFront = [...fronts].sort((a, b) => ttf[a] - ttf[b])[0];
  const chosenFront = resolveChosenFront(roundEffects);
  const rankOfChosen = fronts.filter((f) => ttf[f] < ttf[chosenFront]).length;
  const gapMagnitude = rankOfChosen / (fronts.length - 1);
  const REFERENCE_TTF = 30;
  const severity = Math.max(0, Math.min(1, 1 - ttf[optimalFront] / REFERENCE_TTF));
  const helpMagnitude = Math.max(0, Math.abs(roundEffects[chosenFront] || 0));
  const levelEfficiency = 1 - Math.abs(severity - Math.min(1, helpMagnitude / 6.5));
  return { optimalFront, chosenFront, gapMagnitude: Number(gapMagnitude.toFixed(3)), levelEfficiency: Number(levelEfficiency.toFixed(3)) };
}

// ---- Belief / Distrust — reads GTL, persona-flavored. Numbers first-pass. ----
const BAD_CALL_THRESHOLD = 0.5;
const baseIncrement = (gtl) => (1 - gtl.gapMagnitude) * gtl.levelEfficiency;
const isBadCall = (gtl) => gtl.gapMagnitude > BAD_CALL_THRESHOLD;
const RICKY_B = { buildMultiplier: 0.7, threshold: 6, spendPayoutMultiplier: 1.6 };
const MAUDE_B = { buildMultiplier: 1.0, threshold: 10, spendPayoutMultiplier: 1.0, erosionScale: 0.15 };
const DEZ_B = { beliefThreshold: 6, distrustThreshold: -3, spendPayoutMultiplier: 1.0, defianceScale: 0.15, defianceCap: 0.9, partialRepair: 1 };
function stepRicky(prevBelief, gtl) {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  const belief = prevBelief + baseIncrement(gtl) * RICKY_B.buildMultiplier;
  return { belief, ready: belief >= RICKY_B.threshold };
}
function stepMaude(prevBelief, gtl, currentFrictionTaxPct) {
  if (isBadCall(gtl)) return { belief: 0, ready: false };
  let belief = prevBelief + baseIncrement(gtl) * MAUDE_B.buildMultiplier;
  if (currentFrictionTaxPct > 0) belief -= currentFrictionTaxPct * MAUDE_B.erosionScale;
  belief = Math.max(0, belief);
  return { belief, ready: belief >= MAUDE_B.threshold };
}
function stepDez(prevTrust, gtl) {
  let trust = isBadCall(gtl) ? prevTrust - 1 : prevTrust + baseIncrement(gtl);
  const belief = Math.max(0, trust), distrust = Math.max(0, -trust);
  const readyToSpend = trust >= DEZ_B.beliefThreshold;
  const overThreshold = trust < DEZ_B.distrustThreshold;
  const defianceChance = overThreshold ? Math.min(DEZ_B.defianceCap, (DEZ_B.distrustThreshold - trust) * DEZ_B.defianceScale) : 0;
  return { trust, belief, distrust, readyToSpend, defianceChance };
}

// ---- Maude's friction tax — redirecting off her native front (Systems). ----
const MAUDE_GRACE_ROUNDS = 3, MAUDE_BASE_TAX = 0.25, MAUDE_TAX_CAP = 0.70;
const MAUDE_ACCEL_STEPS = [0.06, 0.09, 0.13, 0.18];
function maudeTax(n) {
  if (n <= 0) return 0;
  if (n <= MAUDE_GRACE_ROUNDS) return MAUDE_BASE_TAX;
  let tax = MAUDE_BASE_TAX;
  for (let i = 0; i < n - MAUDE_GRACE_ROUNDS; i++) tax += MAUDE_ACCEL_STEPS[Math.min(i, MAUDE_ACCEL_STEPS.length - 1)];
  return Math.min(MAUDE_TAX_CAP, tax);
}

// ---- Dez's defiance override. Only fires when GTL's optimalFront is "re" —
// Aft's kit doesn't map onto entropy/systems, so nothing sensible to override to. ----
function resolveDezRound(prevTrust, gtl, dezChoice, rollFn = Math.random) {
  const step = stepDez(prevTrust, gtl);
  const canDefy = gtl.optimalFront === "re";
  const alreadyCorrect = dezChoice.abilityId === "patch_job";
  const defianceFired = canDefy && !alreadyCorrect && rollFn() < step.defianceChance;
  if (!defianceFired) return { ...step, defianceFired: false, overrideAbility: dezChoice.abilityId, overrideLevel: dezChoice.level };
  return { ...step, defianceFired: true, overrideAbility: "patch_job", overrideLevel: dezChoice.level };
}

// ---- Deferred-compounding bank tracking (shared by Threat Ledger, Reserve Cache, Stockpile).
// REDESIGNED 2026-08-20 (session 3): old model was a flat 2-round claim window
// with a fixed bonus/penalty -- either free money or a shrug, no real decision.
// New model: banked value compounds while held (~8%/round, soft-caps after 5
// rounds), and takes a haircut if a threat hits the front it's protecting while
// still open. Holding is a bet, not a countdown. Banks never auto-expire --
// claim whenever, for whatever the bank is currently worth. Claiming also ties
// a flat morale gain to patient, premeditated play, since morale otherwise had
// no active lever after the ability redesign dropped Analyze/Share the Take. ----
const BANK_GROWTH_RATE = 0.08;    // per round, compounding -- FIRST PASS, flag for Monte Carlo
const BANK_GROWTH_CAP_ROUNDS = 5; // growth locks after this many rounds held
const BANK_EXPOSURE_HAIRCUT = 0.30; // FIRST PASS, flag for Monte Carlo
const MORALE_ON_CLAIM = 5;        // FIRST PASS -- new morale lever

function tickBankGrowth(entry) {
  const roundsHeld = entry.roundsHeld + 1;
  if (roundsHeld > BANK_GROWTH_CAP_ROUNDS) return { ...entry, roundsHeld }; // locked: no further growth
  return { ...entry, banked: entry.banked * (1 + BANK_GROWTH_RATE), roundsHeld };
}
function applyBankExposure(entry, threatHitsFront) {
  if (entry.front !== threatHitsFront) return entry;
  return { ...entry, banked: entry.banked * (1 - BANK_EXPOSURE_HAIRCUT) };
}
function claimBank(entry) { return { front: entry.front, payout: entry.banked, moraleGain: MORALE_ON_CLAIM }; }

const CATEGORIES = {
  targeted:    { axis: "ruthless",   dmgRange: [12, 24],  hits: "systems", label: "Targeted",    tag: "threatens Systems Health" },
  telegraphed: { axis: "methodical", dmgRange: [6, 12],  hits: "entropy", label: "Telegraphed",  tag: "threatens to spike Entropy" },
  cascading:   { axis: "desperate",  dmgRange: [15, 30], hits: "re",      label: "Cascading",    tag: "threatens the Reality Engine" },
};

const EVENTS = [
  { id: "debris", title: "Drift Debris", prompt: "Wreckage tumbles past — salvageable, if someone's willing to reach for it.",
    choices: [
      { label: "Log it and let it pass", level: "I", effects: { salvage: 3 }, result: "The crew notes another loss, quietly." },
      { label: "Send someone out for it", level: "III", effects: { salvage: 10, systems: -4 }, result: "They got it. The hull didn't love the maneuver." },
    ] },
  { id: "signal", title: "A Voice in the Static", prompt: "Comms catch a fragment — another crew, or nothing at all.",
    choices: [
      { label: "Investigate carefully", level: "I", effects: { morale: 5, entropy: 2 }, result: "Nothing conclusive. But it felt good to hope." },
      { label: "Push through, chase it", level: "III", effects: { salvage: 8, re: -5 }, result: "Whatever it was, it cost more to find than it gave back." },
    ] },
  { id: "argument", title: "Argument Below Decks", prompt: "Tension boils over between two of the crew.",
    choices: [
      { label: "Mediate, hear them out", level: "I", effects: { morale: 6, entropy: 2 }, result: "It took time. It was worth it." },
      { label: "Pull rank, shut it down", level: "III", effects: { morale: -6 }, result: "Efficient. They won't forget it, though." },
    ] },
  { id: "hum", title: "A Working System", prompt: "Something in the machine is humming smoother than it has any right to.",
    choices: [
      { label: "Leave it alone", level: "I", effects: {}, result: "For once, nothing needs fixing." },
      { label: "Push it further", level: "III", effects: { systems: 12, entropy: 6 }, result: "It gave more than it should have. It'll remember the strain." },
    ] },
  { id: "rationing", title: "Rationing", prompt: "Supplies read thinner than the log says they should.",
    choices: [
      { label: "Ration evenly", level: "I", effects: { salvage: 3, morale: -3 }, result: "Grim, but fair. Nobody complained out loud." },
      { label: "Break into reserve now", level: "III", effects: { salvage: 9, re: -4 }, result: "The reserve wasn't built to be accessed like that." },
    ] },
  { id: "quiet_hour", title: "A Quiet Hour", prompt: "A genuine lull. The crew has real time on their hands.",
    choices: [
      { label: "Let them rest", level: "I", effects: { morale: 8 }, result: "Sleep, mostly. It mattered more than it looked." },
      { label: "Put the time to work", level: "III", effects: { salvage: 6, entropy: 3 }, result: "Productive. Nobody rested." },
    ] },
  { id: "stowaway", title: "Something in the Walls", prompt: "A reading that shouldn't exist, somewhere it shouldn't be.",
    choices: [
      { label: "Seal it off, ignore it", level: "I", effects: { entropy: 3 }, result: "Out of sight. It doesn't feel out of mind." },
      { label: "Hunt it down", level: "III", effects: { morale: 6, systems: -6 }, result: "Found it. Cost more to catch than to have left alone." },
    ] },
  { id: "old_log", title: "An Old Log Entry", prompt: "A recording surfaces from whoever had this post before.",
    choices: [
      { label: "Play it for the crew", level: "I", effects: { morale: 4, entropy: 2 }, result: "Some comfort. Some weight, too." },
      { label: "Delete it, keep moving", level: "III", effects: { entropy: -3 }, result: "Efficient. Nobody asked what was in it." },
    ] },
  { id: "gift", title: "A Working Trade", prompt: "A chance to offload something for something else entirely.",
    choices: [
      { label: "Take the fair deal", level: "I", effects: { salvage: 4, morale: 2 }, result: "Simple. Nobody regrets simple." },
      { label: "Push for more", level: "III", effects: { salvage: 12, morale: -4 }, result: "Got more. It didn't feel like winning." },
    ] },
  { id: "malfunction", title: "A False Alarm", prompt: "Every light on the board goes red at once — then, nothing.",
    choices: [
      { label: "Stand down slowly", level: "I", effects: { morale: 3 }, result: "Nerves settle. Barely." },
      { label: "Force a full diagnostic", level: "III", effects: { entropy: -6, morale: -2 }, result: "Confirmed clean. The checking cost something too." },
    ] },
];

const CEILINGS = { ruthless: 0.553, methodical: 0.650, desperate: 0.421 };
const K = 8, FLOOR = 0.20;
const AMBIENT_BASE = 0.2, AMBIENT_GROWTH = 0.06;
const SYSTEMS_WEAR_BASE = 0.35, SYSTEMS_WEAR_GROWTH = 0.03;
const RE_WEAR_BASE = 0.35, RE_WEAR_GROWTH = 0.03;
const LULL_BASE = 0.46, LULL_DECAY = 0.005, LULL_MIN = 0.05;
const EVENT_SHARE = 0.8; // of the "no direct threat" branch, most of it is now an Event
const TELEGRAPH_MITIGATION = 0.5;
const SALVAGE_PASSIVE = 2.0, SALVAGE_SPEND_CAP = 4.0, SALVAGE_CONVERT_RATIO = 1.3;
const SALVAGE_EFF = { entropy: 0.85, systems: 0.935, re: 0.935 };
const METER_CAP = 130;
const BUFFER_DECAY = 8;
const LEVELS_SALVAGE = { I: 1.5, II: 3.5, III: 6.5 }; // Engineer pays Salvage, not Entropy -- Systems is the physical/material front

const MORALE_START = 100;
const MORALE_PRESSURE_DRAIN = 2;
const MORALE_RECKLESS_DRAIN = 3;
const MORALE_PRESSURE_THRESHOLD = 30;

const CREW_LINES = {
  targeted:    ["\"Direct hit. Coordinates confirmed — that wasn't luck.\"", "\"Clean strike. It knew exactly where to aim.\"", "\"Reading the impact now. Precise. Too precise.\""],
  telegraphed: ["\"It's building. We have time — not much.\"", "\"Still growing. If we leave it, it won't stay small.\"", "\"That's not resolved yet. Someone needs to watch it.\""],
  cascading:   ["\"That's not — that's not supposed to fold like that.\"", "\"Multiple signatures, overlapping. I can't isolate it.\"", "\"The Engine's reading itself wrong. I don't — I don't know.\""],
};

const EPITAPHS = {
  ruthless: (r) => `${r} rounds. You forced every outcome you could reach. It burned bright, and it burned fast.`,
  methodical: (r) => `${r} rounds. You never rushed. The end still came — just later, and on your terms.`,
  desperate: (r) => `${r} rounds. You were always one bad round from this one. Somehow it took this long.`,
};
const MORALE_EPITAPH = (r) => `${r} rounds. The ship held. The Engine held. They didn't. Not the ship — them.`;

const COLORS = {
  void: "#0A0B10", panel: "#14151C", panel2: "#181A22", panelBorder: "#23252F",
  bone: "#E9E6DC", muted: "#6B6E7A",
  ruthless: "#6FA8FF", methodical: "#E8A33D", desperate1: "#FF4D6D", desperate2: "#8B5CF6",
  salvage: "#35D68A", danger: "#FF4757", morale: "#F0A6C0", event: "#C9A6F0", neutral: "#8B93A8",
};
const METER_KEY_COLOR = { systems: COLORS.ruthless, entropy: COLORS.methodical, re: COLORS.desperate1 };
const LEVEL_COLOR = { I: COLORS.salvage, II: COLORS.neutral, III: COLORS.desperate1 };

function weightedDraw(axisCounts, totalActions) {
  if (totalActions === 0) { const cats = Object.keys(CATEGORIES); return cats[Math.floor(Math.random() * cats.length)]; }
  const raw = { methodical: axisCounts.low / totalActions, ruthless: axisCounts.high / totalActions, desperate: axisCounts.desperate / totalActions };
  const strength = {}; for (const a in raw) strength[a] = Math.min(1, raw[a] / CEILINGS[a]);
  const weights = {}; for (const cat in CATEGORIES) weights[cat] = 1 + K * strength[CATEGORIES[cat].axis];
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  let probs = {}; for (const cat in weights) probs[cat] = weights[cat] / totalW;
  for (const cat in probs) probs[cat] = Math.max(probs[cat], FLOOR);
  const totalP = Object.values(probs).reduce((a, b) => a + b, 0);
  for (const cat in probs) probs[cat] /= totalP;
  const r = Math.random(); let cum = 0;
  for (const cat in probs) { cum += probs[cat]; if (r <= cum) return cat; }
  return Object.keys(probs)[Object.keys(probs).length - 1];
}

const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function computeReveal(round, entropy, axisCounts, totalActions, usedEventIds, relief = 0, lullBonus = 0, ambientBump = 0) {
  const ambient = (AMBIENT_BASE + AMBIENT_GROWTH * round + ambientBump) * rand(0.85, 1.15);
  let newEntropy = Math.max(0, entropy + ambient - relief);
  const lullChance = Math.max(LULL_MIN, LULL_BASE - LULL_DECAY * newEntropy + lullBonus);
  let incoming, eventId = null;
  if (Math.random() > lullChance) {
    incoming = weightedDraw(axisCounts, totalActions);
  } else if (Math.random() < EVENT_SHARE) {
    incoming = "event";
    let pool = EVENTS.filter((e) => !usedEventIds.includes(e.id));
    if (pool.length === 0) pool = EVENTS;
    eventId = pool[Math.floor(Math.random() * pool.length)].id;
  } else {
    incoming = "lull";
  }
  return { entropy: newEntropy, ambient, incoming, eventId };
}

const initialState = (anchorPersona = "ricky") => ({
  started: false, round: 0,
  entropy: 0, systems: 100, re: 100, morale: MORALE_START,
  salvage: 5,
  axisCounts: { low: 0, high: 0, desperate: 0 }, totalActions: 0,
  log: [], gameOver: null, lossType: null,
  lastBreakdown: null,
  incomingThreat: null, incomingEventId: null, usedEventIds: [],
  pendingRelief: 0, pendingLullBonus: 0,
  players: [{ roleId: "helm", ability: null, level: null }, { roleId: "engineer", ability: null, level: null }, { roleId: "aft", ability: null, level: null }],
  salvageTarget: "auto",
  anchorPersona,
  beliefOrTrust: 0, beliefReady: false, distrust: 0, defianceChance: 0,
  maudeCoverTarget: null, maudeConsecutiveCoverage: 0,
  activeModifiers: {}, // front -> {bump, roundsRemaining}
  openBanks: [], // {abilityId, front, banked, roundsHeld} -- compounds while held, hairs cut on exposure, never auto-expires
  lastDefiance: null,
});

export default function TheFracturePlaytest() {
  const [state, setState] = useState(initialState());
  const [designerView, setDesignerView] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [flashCat, setFlashCat] = useState(null);
  const [meterFlash, setMeterFlash] = useState(null);
  const [toast, setToast] = useState(null);
  const [bestRound, setBestRound] = useState(null);
  const [runsPlayed, setRunsPlayed] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [anchorChoice, setAnchorChoice] = useState(null);
  const [claimFront, setClaimFront] = useState(null);
  const logEndRef = useRef(null);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [state.log]);
  useEffect(() => {
    (async () => {
      try { const best = await window.storage.get("prosis_best_round"); if (best) setBestRound(JSON.parse(best.value)); } catch (e) {}
      try { const runs = await window.storage.get("prosis_runs_played"); if (runs) setRunsPlayed(JSON.parse(runs.value)); } catch (e) {}
      setStatsLoaded(true);
    })();
  }, []);

  const recordRunEnd = async (finalRound) => {
    const newRuns = runsPlayed + 1;
    setRunsPlayed(newRuns);
    try { await window.storage.set("prosis_runs_played", JSON.stringify(newRuns)); } catch (e) {}
    if (bestRound === null || finalRound > bestRound) {
      setBestRound(finalRound);
      try { await window.storage.set("prosis_best_round", JSON.stringify(finalRound)); } catch (e) {}
    }
  };

  const dominantAxis = () => {
    const { low, high, desperate } = state.axisCounts;
    const total = state.totalActions || 1;
    const s = {
      methodical: Math.min(1, low / total / CEILINGS.methodical),
      ruthless: Math.min(1, high / total / CEILINGS.ruthless),
      desperate: Math.min(1, desperate / total / CEILINGS.desperate),
    };
    return Object.entries(s).sort((a, b) => b[1] - a[1])[0];
  };

  const setPlayerChoice = (idx, abilityId, level) => {
    if (state.gameOver) return;
    setState((s) => { const players = [...s.players]; players[idx] = { ...players[idx], ability: abilityId, level }; return { ...s, players }; });
  };

  const underPressureNow = state.entropy > 55 || state.systems < 40 || state.re < 40 || state.morale < MORALE_PRESSURE_THRESHOLD;

  const fireImpact = (catKey, hits, dmg) => {
    if (!catKey || catKey === "lull") return;
    const color = CATEGORIES[catKey].axis === "ruthless" ? COLORS.ruthless : CATEGORIES[catKey].axis === "methodical" ? COLORS.methodical : COLORS.desperate1;
    setToast({ text: `${CATEGORIES[catKey].label.toUpperCase()} — ${meterLabelStatic[hits]} -${dmg.toFixed(1)}`, color });
    setMeterFlash(hits); setFlashCat(catKey);
    setTimeout(() => setToast(null), 1800);
    setTimeout(() => setMeterFlash(null), 700);
    setTimeout(() => setFlashCat(null), 900);
  };

  const finalizeRound = (prev, mutated, breakdown, round) => {
    let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds, pendingRelief, pendingLullBonus,
      activeModifiers = prev.activeModifiers, openBanks = prev.openBanks, beliefOrTrust = prev.beliefOrTrust, beliefReady = prev.beliefReady,
      distrust = prev.distrust, defianceChance = prev.defianceChance, maudeConsecutiveCoverage = prev.maudeConsecutiveCoverage,
      lastDefiance = prev.lastDefiance } = mutated;
    entropy = Math.max(0, entropy); systems = clamp(systems, 0, METER_CAP); re = clamp(re, 0, METER_CAP); morale = clamp(morale, 0, 100);

    let gameOver = null, lossType = null;
    if (systems <= 0 || re <= 0) {
      gameOver = systems <= 0 ? "Systems failure. Nothing left holding the ship together." : "Reality Engine failure. The Engine gives out.";
      lossType = "mechanical"; log = [...log, { type: "loss", reason: gameOver }];
    }
    if (!gameOver && entropy >= 100) { gameOver = "Entropy reached maximum. The process completes itself."; lossType = "mechanical"; log = [...log, { type: "loss", reason: gameOver }]; }
    if (!gameOver && morale <= 0) { gameOver = "Crew Morale collapsed. The will to continue is gone."; lossType = "morale"; log = [...log, { type: "loss", reason: gameOver }]; }

    if (gameOver) setTimeout(() => recordRunEnd(round), 0);

    let nextRound = round, nextIncoming = null, nextEventId = null;
    if (!gameOver) {
      nextRound = round + 1;
      const ambientBump = (activeModifiers.entropy && activeModifiers.entropy.roundsRemaining > 0) ? activeModifiers.entropy.bump : 0;
      const reveal = computeReveal(nextRound, entropy, axisCounts, totalActions, usedEventIds, pendingRelief, pendingLullBonus, ambientBump);
      entropy = reveal.entropy; nextIncoming = reveal.incoming; nextEventId = reveal.eventId;
    }

    return {
      ...prev, round: nextRound, entropy, systems, re, morale, salvage,
      axisCounts, totalActions, log, gameOver, lossType, usedEventIds,
      pendingRelief: 0, pendingLullBonus: 0,
      activeModifiers, openBanks, beliefOrTrust, beliefReady, distrust, defianceChance, maudeConsecutiveCoverage, lastDefiance,
      lastBreakdown: breakdown, incomingThreat: gameOver ? prev.incomingThreat : nextIncoming,
      incomingEventId: gameOver ? prev.incomingEventId : nextEventId,
      players: prev.players.map((p) => ({ ...p, ability: null, level: null })),
    };
  };

  const applyLevelTax = (level, underPressure, axisCounts, breakdown, moraleRef, actionLabel) => {
    if (level === "I") axisCounts.low += 1;
    if (level === "III") {
      axisCounts.high += 1;
      if (underPressure) axisCounts.desperate += 1;
      else { moraleRef.v = Math.max(0, moraleRef.v - MORALE_RECKLESS_DRAIN); breakdown.moraleDelta -= MORALE_RECKLESS_DRAIN; breakdown.moraleNotes.push(`-${MORALE_RECKLESS_DRAIN} (${actionLabel} III, unforced risk)`); }
    }
    // level II is neutral -- costs Entropy like the others but doesn't feed the axis compounding system
  };

  const resolveRound = () => {
    if (state.gameOver) return;
    if (state.players.some((p) => !p.ability)) return;

    setState((prev) => {
      const round = prev.round;
      let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds, pendingRelief, pendingLullBonus } = prev;
      log = [...log, { type: "round", round }];

      const breakdown = { threat: null, actionsCost: 0, actionsTaken: [], salvageGained: 0, salvageSpent: 0, salvageTarget: null, salvageRestored: 0, moraleDelta: 0, moraleNotes: [], systemsDecay: 0, reDecay: 0 };

      if (systems > 100) { const d = Math.min(BUFFER_DECAY, systems - 100); systems -= d; breakdown.systemsDecay = d; }
      if (re > 100) { const d = Math.min(BUFFER_DECAY, re - 100); re -= d; breakdown.reDecay = d; }
      systems -= (SYSTEMS_WEAR_BASE + SYSTEMS_WEAR_GROWTH * round) * rand(0.85, 1.15);
      re -= (RE_WEAR_BASE + RE_WEAR_GROWTH * round) * rand(0.85, 1.15);

      const catKey = prev.incomingThreat;
      let dmg = 0, mitigated = false, hits = null;
      if (catKey !== "lull") {
        const catDef = CATEGORIES[catKey];
        hits = catDef.hits; dmg = rand(...catDef.dmgRange);
        if (catKey === "telegraphed" && Math.random() < TELEGRAPH_MITIGATION) { dmg *= 0.4; mitigated = true; }
      } else {
        morale = Math.min(100, morale + 2); breakdown.moraleDelta += 2; breakdown.moraleNotes.push("+2 (quiet round)");
      }

      const preActionUnderPressure = entropy > 55 || systems < 40 || re < 40 || morale < MORALE_PRESSURE_THRESHOLD;
      // BUG FIX 2026-08-20: pressure driving the morale DRAIN specifically must not
      // include morale itself, or low morale becomes a closed loop that drains
      // itself regardless of what the player does. Other fronts being critical
      // still legitimately cost morale; low morale should read as bad (the UI
      // banner and Level III framing above still use the full definition) but
      // shouldn't be able to bootstrap its own decline.
      const pressureForMoraleDrain = entropy > 55 || systems < 40 || re < 40;
      const newAxisCounts = { ...axisCounts };
      let roundEntropyCost = 0;
      const actionsTaken = [];
      const moraleRef = { v: morale };
      // Chart Ahead (pendingRelief/pendingLullBonus's old feeder) is retired -- Threat Ledger
      // replaces it via the bank/claim system below, not the ambient-reveal formula.
      const newPendingRelief = 0, newPendingLullBonus = 0;
      const anchorPersona = prev.anchorPersona;
      const frontLabel = { entropy: "Entropy", systems: "Systems", re: "Reality Engine" };

      // ---- Pass 1: resolve each role's chosen ability/level/params, no mutation yet ----
      const resolvePlayer = (roleId) => {
        const player = prev.players.find((p) => p.roleId === roleId);
        const role = ROLES.find((r) => r.id === roleId);
        const ability = role.abilities.find((a) => a.id === player.ability);
        return { role, ability, level: player.level, params: ability.levels[player.level] };
      };
      const h = resolvePlayer("helm");
      const e = resolvePlayer("engineer");
      const a = resolvePlayer("aft");

      const engCost = LEVELS_SALVAGE[e.level];
      const engActualFunded = Math.min(salvage, engCost);
      const engCostScale = engCost > 0 ? engActualFunded / engCost : 1.0;

      // Maude's redirect: her native front is Systems. If she's covering another front,
      // Engineer's immediate gain (if the ability has one) is taxed and rerouted.
      const isMaude = anchorPersona === "maude";
      const coverTarget = isMaude ? prev.maudeCoverTarget : null;
      const engineerHasImmediateGain = e.ability.shape !== "deferred_compounding" && typeof e.params.systemsDelta === "number";
      const engineerRedirecting = isMaude && coverTarget && coverTarget !== "systems" && engineerHasImmediateGain;
      const engineerTaxPct = engineerRedirecting ? maudeTax(prev.maudeConsecutiveCoverage + 1) : 0;

      // ---- Proposed per-front deltas this round, for GTL ----
      const proposed = { entropy: 0, systems: 0, re: 0 };
      if (h.ability.shape !== "deferred_compounding") { proposed.entropy += (h.params.entropyDelta || 0); proposed.systems += (h.params.systemsDelta || 0); }
      if (e.ability.shape !== "deferred_compounding") {
        const gain = (e.params.systemsDelta || 0) * engCostScale;
        if (engineerRedirecting) {
          if (coverTarget === "entropy") proposed.entropy += -gain * (1 - engineerTaxPct);
          if (coverTarget === "re") proposed.re += gain * (1 - engineerTaxPct);
        } else {
          proposed.systems += gain;
        }
        proposed.entropy += (e.params.entropyDelta || 0) * engCostScale;
      }
      if (a.ability.shape !== "deferred_compounding") proposed.re += (a.params.reDelta || 0);
      // BUG FIX 2026-08-20: deferred/banking picks previously counted as 0 immediate
      // help toward GTL, meaning GTL couldn't recognize "banking toward RE" as
      // helping RE at all this round -- a real gap when all three roles bank in
      // the same round (chosenFront would fall back to an arbitrary default).
      // Banking is a real prioritization decision even though the meter doesn't
      // move until claimed, so it earns partial credit toward the front it protects.
      const BANKING_GTL_CREDIT = 0.4; // FIRST PASS, flag for Monte Carlo tuning
      const addBankingCredit = (ability, params) => {
        if (ability.shape !== "deferred_compounding") return;
        const credit = params.banked * BANKING_GTL_CREDIT;
        if (ability.front === "entropy") proposed.entropy -= credit; // entropy: relief is a negative delta
        else proposed[ability.front] += credit; // systems/re: gain is a positive delta
      };
      addBankingCredit(h.ability, h.params);
      addBankingCredit(e.ability, e.params);
      addBankingCredit(a.ability, a.params);

      // ---- GTL, computed once against the proposed round (drives Dez's defiance AND Belief/Distrust for all three) ----
      const gtl = computeGTL(round, { entropy, systems, re }, proposed, prev.activeModifiers);

      // ---- Dez's defiance: decide before applying Aft's effect ----
      const isDez = anchorPersona === "dez";
      let aftUse = a; let lastDefiance = null;
      let beliefOrTrust = prev.beliefOrTrust, beliefReady = prev.beliefReady, distrust = prev.distrust, defianceChance = prev.defianceChance;
      if (isDez) {
        const step = resolveDezRound(prev.beliefOrTrust, gtl, { abilityId: a.ability.id, level: a.level });
        beliefOrTrust = step.trust; distrust = step.distrust; defianceChance = step.defianceChance; beliefReady = step.readyToSpend;
        if (step.defianceFired) {
          const patchAbility = ROLES.find((r) => r.id === "aft").abilities.find((ab) => ab.id === "patch_job");
          aftUse = { role: a.role, ability: patchAbility, level: a.level, params: patchAbility.levels[a.level] };
          lastDefiance = { from: a.ability.label, to: patchAbility.label, level: a.level };
          log = [...log, { type: "defiance", from: a.ability.label, to: patchAbility.label, level: a.level }];
        }
      } else if (anchorPersona === "ricky") {
        const step = stepRicky(prev.beliefOrTrust, gtl);
        beliefOrTrust = step.belief; beliefReady = step.ready;
      } else if (isMaude) {
        const step = stepMaude(prev.beliefOrTrust, gtl, engineerTaxPct);
        beliefOrTrust = step.belief; beliefReady = step.ready;
      }

      // ---- Pass 2: apply everything ----
      // Tick growth + exposure on barriers that existed BEFORE this round -- barriers
      // raised this round start fresh next round, not ticked the same round they're raised.
      // Gene's Dead Reckoning buys existing barriers extra rounds before the growth cap;
      // Sal's Ration the Take shields existing barriers from this round's exposure entirely.
      const deadReckoningExtend = e.ability.id === "dead_reckoning" ? (e.params.extend || 0) : 0;
      const rationShielded = aftUse.ability.id === "ration_the_take" && !!aftUse.params.shield;
      let newOpenBanks = prev.openBanks
        .map((b) => (deadReckoningExtend > 0 ? { ...b, roundsHeld: Math.max(0, b.roundsHeld - deadReckoningExtend) } : b))
        .map(tickBankGrowth);
      if (catKey !== "lull" && hits && !rationShielded) newOpenBanks = newOpenBanks.map((b) => applyBankExposure(b, hits));
      const newActiveModifiers = {};
      // carry forward + tick down modifiers already active entering this round; new ones (below) apply starting next round
      Object.entries(prev.activeModifiers).forEach(([front, m]) => {
        const roundsRemaining = m.roundsRemaining - 1;
        if (roundsRemaining > 0) newActiveModifiers[front] = { bump: m.bump, roundsRemaining };
      });

      // Helm
      applyLevelTax(h.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, h.ability.label);
      totalActions += 1; roundEntropyCost += LEVELS[h.level].cost;
      actionsTaken.push({ role: h.role.personalName, label: `${h.ability.label} ${h.level}` });
      if (h.ability.id === "analyze") {
        if (catKey !== "lull") { dmg *= (1 - h.params.mitigation); mitigated = true; }
        moraleRef.v = Math.min(100, moraleRef.v + h.params.morale);
        breakdown.moraleDelta += h.params.morale; breakdown.moraleNotes.push(`+${h.params.morale} (Analyze)`);
      }
      if (h.ability.shape === "deferred_compounding") {
        newOpenBanks.push({ abilityId: h.ability.id, front: h.ability.front, banked: h.params.banked, roundsHeld: 0 });
      } else {
        entropy = Math.max(0, entropy + (h.params.entropyDelta || 0));
        systems += (h.params.systemsDelta || 0);
        if (h.ability.shape === "same_front_later") newActiveModifiers.entropy = { bump: h.params.ambientBump, roundsRemaining: h.params.bumpRounds };
      }

      // Engineer
      applyLevelTax(e.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, e.ability.label);
      totalActions += 1; salvage -= engActualFunded;
      actionsTaken.push({ role: e.role.personalName, label: `${e.ability.label} ${e.level}${engineerRedirecting ? ` → ${frontLabel[coverTarget]} (${(engineerTaxPct * 100).toFixed(0)}% tax)` : ""}` });
      if (e.ability.id === "dead_reckoning" && catKey !== "lull") { dmg *= (1 - e.params.mitigation); mitigated = true; }
      if (e.ability.shape === "deferred_compounding") {
        newOpenBanks.push({ abilityId: e.ability.id, front: e.ability.front, banked: e.params.banked, roundsHeld: 0 });
      } else {
        const gain = (e.params.systemsDelta || 0) * engCostScale;
        if (engineerRedirecting) {
          if (coverTarget === "entropy") entropy = Math.max(0, entropy - gain * (1 - engineerTaxPct));
          if (coverTarget === "re") re += gain * (1 - engineerTaxPct);
        } else {
          systems += gain;
        }
        entropy += (e.params.entropyDelta || 0) * engCostScale;
        if (e.ability.shape === "same_front_later") newActiveModifiers.systems = { bump: e.params.wearBump, roundsRemaining: e.params.bumpRounds };
      }
      const newMaudeConsecutiveCoverage = engineerRedirecting ? prev.maudeConsecutiveCoverage + 1 : 0;

      // Aft (post-defiance-resolution)
      applyLevelTax(aftUse.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, aftUse.ability.label);
      totalActions += 1; roundEntropyCost += LEVELS[aftUse.level].cost;
      actionsTaken.push({ role: aftUse.role.personalName, label: `${aftUse.ability.label} ${aftUse.level}${lastDefiance ? " (crew override)" : ""}` });
      if (aftUse.ability.id === "ration_the_take" && catKey !== "lull") { dmg *= (1 - aftUse.params.mitigation); mitigated = true; }
      if (aftUse.ability.shape === "deferred_compounding") {
        newOpenBanks.push({ abilityId: aftUse.ability.id, front: aftUse.ability.front, banked: aftUse.params.banked, roundsHeld: 0 });
      } else {
        salvage += (aftUse.params.salvageDelta || 0);
        re += (aftUse.params.reDelta || 0);
        if (aftUse.ability.shape === "same_front_later") newActiveModifiers.re = { bump: aftUse.params.wearBump, roundsRemaining: aftUse.params.bumpRounds };
      }

      morale = moraleRef.v;

      if (catKey !== "lull") {
        if (hits === "systems") systems -= dmg;
        if (hits === "entropy") entropy += dmg;
        if (hits === "re") re -= dmg;
        const line = CREW_LINES[catKey][Math.floor(Math.random() * CREW_LINES[catKey].length)];
        breakdown.threat = { category: catKey, dmg, hits, mitigated };
        log = [...log, { type: "threat", category: catKey, dmg: dmg.toFixed(1), hits, line }];
        fireImpact(catKey, hits, dmg);
      } else {
        log = [...log, { type: "lull" }];
      }

      entropy += roundEntropyCost;
      breakdown.actionsCost = roundEntropyCost; breakdown.actionsTaken = actionsTaken;

      if (pressureForMoraleDrain) { morale = Math.max(0, morale - MORALE_PRESSURE_DRAIN); breakdown.moraleDelta -= MORALE_PRESSURE_DRAIN; breakdown.moraleNotes.push(`-${MORALE_PRESSURE_DRAIN} (sustained pressure)`); }

      salvage += SALVAGE_PASSIVE; breakdown.salvageGained = SALVAGE_PASSIVE;
      const spend = Math.min(salvage, SALVAGE_SPEND_CAP); salvage -= spend;
      const usable = spend * SALVAGE_CONVERT_RATIO;
      const deficits = { entropy: entropy / 100, systems: (100 - systems) / 100, re: (100 - re) / 100 };
      let target = prev.salvageTarget;
      if (target === "auto") target = Object.entries(deficits).sort((a, b) => b[1] - a[1])[0][0];
      let restored = 0;
      if (target === "entropy") { restored = usable * SALVAGE_EFF.entropy; entropy -= restored; }
      if (target === "systems") { restored = usable * SALVAGE_EFF.systems; systems += restored; }
      if (target === "re") { restored = usable * SALVAGE_EFF.re; re += restored; }
      breakdown.salvageSpent = spend; breakdown.salvageTarget = target; breakdown.salvageRestored = restored;

      return finalizeRound(prev, {
        entropy, systems, re, morale, salvage, axisCounts: newAxisCounts, totalActions, log, usedEventIds,
        pendingRelief: newPendingRelief, pendingLullBonus: newPendingLullBonus,
        activeModifiers: newActiveModifiers, openBanks: newOpenBanks, beliefOrTrust, beliefReady, distrust, defianceChance,
        maudeConsecutiveCoverage: newMaudeConsecutiveCoverage, lastDefiance,
      }, breakdown, round);
    });
  };

  const resolveEventChoice = (choice) => {
    if (state.gameOver) return;
    setState((prev) => {
      const round = prev.round;
      let { entropy, systems, re, morale, salvage, axisCounts, totalActions, log, usedEventIds } = prev;
      log = [...log, { type: "round", round }];

      const breakdown = { threat: null, actionsCost: 0, actionsTaken: [], salvageGained: 0, salvageSpent: 0, salvageTarget: null, salvageRestored: 0, moraleDelta: 0, moraleNotes: [], systemsDecay: 0, reDecay: 0 };
      if (systems > 100) { const d = Math.min(BUFFER_DECAY, systems - 100); systems -= d; breakdown.systemsDecay = d; }
      if (re > 100) { const d = Math.min(BUFFER_DECAY, re - 100); re -= d; breakdown.reDecay = d; }
      systems -= (SYSTEMS_WEAR_BASE + SYSTEMS_WEAR_GROWTH * round) * rand(0.85, 1.15);
      re -= (RE_WEAR_BASE + RE_WEAR_GROWTH * round) * rand(0.85, 1.15);

      const event = EVENTS.find((e) => e.id === prev.incomingEventId);
      const newAxisCounts = { ...axisCounts };
      const preActionUnderPressure = entropy > 55 || systems < 40 || re < 40 || morale < MORALE_PRESSURE_THRESHOLD;
      const pressureForMoraleDrain = entropy > 55 || systems < 40 || re < 40; // see resolveRound for why morale is excluded here
      const moraleRef = { v: morale };
      applyLevelTax(choice.level, preActionUnderPressure, newAxisCounts, breakdown, moraleRef, event.title);
      morale = moraleRef.v;
      totalActions += 1;

      const eff = choice.effects || {};
      if (eff.entropy) entropy = Math.max(0, entropy + eff.entropy);
      if (eff.systems) systems += eff.systems;
      if (eff.re) re += eff.re;
      if (eff.salvage) { salvage += eff.salvage; breakdown.salvageGained += eff.salvage; }
      if (eff.morale) { morale = clamp(morale + eff.morale, 0, 100); breakdown.moraleDelta += eff.morale; breakdown.moraleNotes.push(`${eff.morale >= 0 ? "+" : ""}${eff.morale} (${event.title})`); }

      if (pressureForMoraleDrain) { morale = Math.max(0, morale - MORALE_PRESSURE_DRAIN); breakdown.moraleDelta -= MORALE_PRESSURE_DRAIN; breakdown.moraleNotes.push(`-${MORALE_PRESSURE_DRAIN} (sustained pressure)`); }

      salvage += SALVAGE_PASSIVE; breakdown.salvageGained += SALVAGE_PASSIVE;
      const spend = Math.min(salvage, SALVAGE_SPEND_CAP); salvage -= spend;
      const usable = spend * SALVAGE_CONVERT_RATIO;
      const deficits = { entropy: entropy / 100, systems: (100 - systems) / 100, re: (100 - re) / 100 };
      let target = prev.salvageTarget;
      if (target === "auto") target = Object.entries(deficits).sort((a, b) => b[1] - a[1])[0][0];
      let restored = 0;
      if (target === "entropy") { restored = usable * SALVAGE_EFF.entropy; entropy -= restored; }
      if (target === "systems") { restored = usable * SALVAGE_EFF.systems; systems += restored; }
      if (target === "re") { restored = usable * SALVAGE_EFF.re; re += restored; }
      breakdown.salvageSpent = spend; breakdown.salvageTarget = target; breakdown.salvageRestored = restored;

      log = [...log, { type: "event", title: event.title, choice: choice.label, result: choice.result }];
      setToast({ text: `${event.title.toUpperCase()} — ${choice.label}`, color: COLORS.event });
      setTimeout(() => setToast(null), 1800);
      usedEventIds = [...usedEventIds, event.id];

      return finalizeRound(prev, { entropy, systems, re, morale, salvage, axisCounts: newAxisCounts, totalActions, log, usedEventIds, pendingRelief: 0, pendingLullBonus: 0 }, breakdown, round);
    });
  };

  const claimBankAction = (bankIdx) => {
    if (state.gameOver) return;
    setState((prev) => {
      const entry = prev.openBanks[bankIdx];
      if (!entry) return prev;
      const { front, payout, moraleGain } = claimBank(entry);
      let { entropy, systems, re, morale } = prev;
      if (front === "entropy") entropy = Math.max(0, entropy - payout);
      if (front === "systems") systems += payout;
      if (front === "re") re += payout;
      morale = clamp(morale + moraleGain, 0, 100);
      const openBanks = prev.openBanks.filter((_, i) => i !== bankIdx);
      setToast({ text: `CLAIMED — +${payout.toFixed(1)} ${front === "entropy" ? "Entropy relief" : front === "systems" ? "Systems" : "Reality Engine"}, +${moraleGain} Morale`, color: COLORS.salvage });
      setTimeout(() => setToast(null), 1800);
      return { ...prev, entropy, systems, re, morale, openBanks, log: [...prev.log, { type: "bank_claimed", front, payout, moraleGain }] };
    });
  };

  const spendBelief = (front) => {
    if (state.gameOver || !state.beliefReady) return;
    setState((prev) => {
      const persona = prev.anchorPersona;
      const multiplier = persona === "ricky" ? RICKY_B.spendPayoutMultiplier : persona === "maude" ? MAUDE_B.spendPayoutMultiplier : DEZ_B.spendPayoutMultiplier;
      const payout = BASE_HEAL * multiplier;
      let { entropy, systems, re } = prev;
      if (front === "entropy") entropy = Math.max(0, entropy - payout);
      if (front === "systems") systems += payout;
      if (front === "re") re += payout;
      setToast({ text: `BELIEF SPENT — +${payout.toFixed(1)} ${front === "entropy" ? "Entropy relief" : front === "systems" ? "Systems" : "Reality Engine"}`, color: ANCHORS[persona].color });
      setTimeout(() => setToast(null), 1800);
      return { ...prev, entropy, systems, re, beliefOrTrust: 0, beliefReady: false, log: [...prev.log, { type: "belief_spent", front, payout }] };
    });
  };

  const launchVoyage = () => {
    if (!anchorChoice) return;
    setState(() => {
      const base = initialState(anchorChoice);
      const reveal = computeReveal(1, 0, base.axisCounts, 0, []);
      return { ...base, started: true, round: 1, entropy: reveal.entropy, incomingThreat: reveal.incoming, incomingEventId: reveal.eventId, log: [{ type: "intro" }] };
    });
  };
  const launchNextVoyage = () => {
    setState((prev) => {
      const base = initialState(prev.anchorPersona);
      const reveal = computeReveal(1, 0, base.axisCounts, 0, []);
      return { ...base, started: true, round: 1, entropy: reveal.entropy, incomingThreat: reveal.incoming, incomingEventId: reveal.eventId, log: [{ type: "intro" }] };
    });
    setFlashCat(null); setToast(null); setMeterFlash(null);
  };
  const fullReset = () => { setState(initialState()); setAnchorChoice(null); setFlashCat(null); setToast(null); setMeterFlash(null); };

  const flashColor = flashCat === "targeted" ? COLORS.ruthless : flashCat === "telegraphed" ? COLORS.methodical : flashCat === "cascading" ? COLORS.desperate1 : "transparent";
  const dom = dominantAxis();
  const axisLabel = { ruthless: "Ruthless", methodical: "Methodical", desperate: "Desperate" };
  const axisColor = { ruthless: COLORS.ruthless, methodical: COLORS.methodical, desperate: COLORS.desperate1 };
  const meterLabelStatic = { entropy: "Entropy", systems: "Systems Health", re: "Reality Engine" };
  const meterLabel = meterLabelStatic;
  const meterColor = (val, invert = false) => { const danger = invert ? val < 25 : val > 75; return danger ? COLORS.danger : COLORS.bone; };
  const panelStyle = { background: `linear-gradient(180deg, ${COLORS.panel2}, ${COLORS.panel})`, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 12 };
  const iconBtnStyle = { background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, color: COLORS.muted, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12.5, letterSpacing: 0.2 };

  const CoreRing = ({ size = 130 }) => (
    <svg width={size} height={size} viewBox="0 0 140 140" className={flashCat === "cascading" ? "flash-cascading" : flashCat === "targeted" ? "flash-targeted" : flashCat === "telegraphed" ? "flash-telegraphed" : ""}>
      <circle cx="70" cy="70" r="60" fill="none" stroke={COLORS.panelBorder} strokeWidth="1" />
      <circle cx="70" cy="70" r="46" fill="none" stroke={flashCat ? flashColor : COLORS.muted} strokeWidth="1.5" strokeDasharray="4 6" className="core-ring" style={{ animation: state.gameOver || !state.started ? "none" : "pulseGlow 2.2s ease-in-out infinite" }} />
      {[...Array(8)].map((_, i) => { const angle = (i / 8) * Math.PI * 2; const x1 = 70 + 30 * Math.cos(angle), y1 = 70 + 30 * Math.sin(angle); const x2 = 70 + 58 * Math.cos(angle), y2 = 70 + 58 * Math.sin(angle); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.panelBorder} strokeWidth="1" />; })}
      <text x="70" y="66" textAnchor="middle" className="mono" fontSize="22" fill={COLORS.bone} fontWeight="600">{state.round}</text>
      <text x="70" y="82" textAnchor="middle" className="mono" fontSize="9" fill={COLORS.muted} letterSpacing="2">ROUND</text>
    </svg>
  );

  const sharedStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .mono { font-family: 'JetBrains Mono', monospace; }
      @keyframes pulseGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes glitchShift { 0%,100% { transform: translate(0,0); filter: hue-rotate(0deg); } 20% { transform: translate(-1px,1px); filter: hue-rotate(15deg); } 40% { transform: translate(1px,-1px); filter: hue-rotate(-10deg); } 60% { transform: translate(-1px,-1px); filter: hue-rotate(20deg); } 80% { transform: translate(1px,1px); filter: hue-rotate(-15deg); } }
      @keyframes ringPulseBurst { 0% { r: 46; opacity: 1; } 100% { r: 62; opacity: 0; } }
      @keyframes warmBuild { 0% { opacity: 0.4; } 100% { opacity: 1; filter: brightness(1.3); } }
      @keyframes toastIn { 0% { opacity: 0; transform: translate(-50%, -8px) scale(0.96); } 15% { opacity: 1; transform: translate(-50%, 0) scale(1); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -4px) scale(0.98); } }
      @keyframes meterShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-3px); } 40% { transform: translateX(3px); } 60% { transform: translateX(-2px); } 80% { transform: translateX(2px); } }
      .core-ring { transition: stroke 0.4s ease, opacity 0.4s ease; }
      .flash-cascading { animation: glitchShift 0.35s steps(2) 3; }
      .flash-targeted circle:nth-child(2) { animation: ringPulseBurst 0.6s ease-out; }
      .flash-telegraphed circle:nth-child(2) { animation: warmBuild 0.9s ease-in; }
      .action-btn { transition: all 0.15s ease; }
      .action-btn:hover:not(:disabled) { transform: translateY(-1px); border-color: #454858 !important; }
      .primary-btn:hover:not(:disabled) { filter: brightness(1.08); }
      .impact-toast { position: fixed; top: 18px; left: 50%; z-index: 50; animation: toastIn 1.8s ease forwards; }
      .meter-hit { animation: meterShake 0.5s ease; }
      .level-pill { transition: all 0.12s ease; }
      .level-pill:hover:not(:disabled) { transform: translateY(-1px); }
      /* Signature pulses -- each one embodies the persona's own mechanic, not decoration */
      @keyframes rickySpike { 0%,100% { transform: scaleY(0.3); opacity: 0.55; } 8% { transform: scaleY(1.4); opacity: 1; } 14% { transform: scaleY(0.25); opacity: 0.5; } 45% { transform: scaleY(0.35); opacity: 0.6; } 52% { transform: scaleY(1.15); opacity: 0.95; } 60% { transform: scaleY(0.2); opacity: 0.45; } }
      .pulse-ricky span { animation: rickySpike 2.6s ease-in-out infinite; animation-delay: calc(var(--i) * 0.09s); }
      @keyframes maudeBreathe { 0%,100% { transform: scaleY(0.55); opacity: 0.7; } 50% { transform: scaleY(0.85); opacity: 0.95; } }
      .pulse-maude span { animation: maudeBreathe 3.6s ease-in-out infinite; animation-delay: calc(var(--i) * 0.22s); }
      @keyframes dezStutter { 0%,100% { transform: scaleY(0.5); opacity: 0.5; } 10% { transform: scaleY(0.75); opacity: 0.85; } 18% { transform: scaleY(0.4); opacity: 0.4; } 30% { transform: scaleY(0.55); opacity: 0.5; } 55% { transform: scaleY(0.35); opacity: 0.35; } 70% { transform: scaleY(0.68); opacity: 0.8; } 78% { transform: scaleY(0.42); opacity: 0.45; } }
      .pulse-dez span { animation: dezStutter 2.9s ease-in-out infinite; animation-delay: calc(var(--i) * 0.31s); }
      @keyframes cardFloatIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      .anchor-card { animation: cardFloatIn 0.5s ease both; }
    `}</style>
  );

  if (!state.started) {
    return (
      <div style={{ background: COLORS.void, color: COLORS.bone, minHeight: "100%", fontFamily: "'Space Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {sharedStyles}
        <div style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: COLORS.muted, marginBottom: 6 }}>PROSIS · PLAYTEST BUILD</div>
          <h1 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 6px 0", letterSpacing: -1 }}>THE FRACTURE</h1>
          <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 28, lineHeight: 1.6 }}>
            You are not the last human aboard the Theseus.<br/>
            <span style={{ color: COLORS.bone }}>You are the intelligence deciding how it dies — again, and again, until it doesn't.</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, opacity: 0.85 }}><CoreRing size={110} /></div>

          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, marginBottom: 4 }}>CHOOSE YOUR ANCHOR</div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 16 }}>Three intelligences. Three ways to hold the line.</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {Object.values(ANCHORS).map((a, idx) => {
              const Icon = a.id === "ricky" ? Flame : a.id === "maude" ? Compass : EyeOff;
              const selected = anchorChoice === a.id;
              return (
                <button key={a.id} onClick={() => setAnchorChoice(a.id)} className="action-btn anchor-card"
                  style={{ animationDelay: `${idx * 0.08}s`, flex: 1, textAlign: "left", padding: "16px 14px", borderRadius: 14, cursor: "pointer",
                    border: `1.5px solid ${selected ? a.color : COLORS.panelBorder}`,
                    background: selected ? `linear-gradient(160deg, ${a.color}22, ${a.color}08)` : "#00000020",
                    boxShadow: selected ? `0 0 24px ${a.color}33` : "none",
                    display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Icon size={18} color={selected ? a.color : COLORS.muted} />
                    <div className={a.pulseClass} style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                      {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ "--i": i, width: 2.5, height: "100%", borderRadius: 2, background: selected ? a.color : COLORS.panelBorder, transformOrigin: "bottom" }} />)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: selected ? a.color : COLORS.bone, fontSize: 15 }}>{a.name}</div>
                    <div style={{ fontSize: 9.5, color: COLORS.muted, letterSpacing: 0.5 }}>{a.direction.toUpperCase()}</div>
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.45 }}>{a.blurb}</div>
                  <div style={{ fontSize: 9.5, fontStyle: "italic", color: selected ? a.color : COLORS.muted, lineHeight: 1.4, borderTop: `1px solid ${COLORS.panelBorder}`, paddingTop: 6, marginTop: 2 }}>&ldquo;{a.signature}&rdquo;</div>
                </button>
              );
            })}
          </div>

          <button onClick={launchVoyage} disabled={!anchorChoice} className="action-btn primary-btn" style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: anchorChoice ? "pointer" : "not-allowed", background: anchorChoice ? COLORS.bone : COLORS.panelBorder, color: anchorChoice ? COLORS.void : COLORS.muted, letterSpacing: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
            <Rocket size={16} /> LAUNCH VOYAGE
          </button>
          <button onClick={() => setRulesOpen((v) => !v)} className="action-btn" style={{ ...iconBtnStyle, margin: "0 auto 16px auto", justifyContent: "center" }}><HelpCircle size={14} /> How this works</button>
          {rulesOpen && (
            <div style={{ ...panelStyle, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 1.65, color: COLORS.muted, textAlign: "left" }}>
              <div style={{ color: COLORS.bone, fontWeight: 600, marginBottom: 6 }}>How this works</div>
              <div><b style={{ color: COLORS.bone }}>Three crew, three abilities each, three levels apiece.</b> Level I is cheap and safe, Level III is powerful and reckless, Level II is a real neutral middle — it doesn't feed the deck's read on how you play.</div>
              <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>You see what's coming before you act.</b> Threats, quiet lulls, and narrative Events — one-off choices that shape the run — are all possible each round.</div>
              <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>Four ways to lose:</b> Entropy maxes, Systems or the Reality Engine fail with no Fractures left, or Crew Morale hits zero.</div>
            </div>
          )}
          {statsLoaded && (bestRound !== null || runsPlayed > 0) && (
            <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 12, color: COLORS.muted }}>
              {bestRound !== null && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Trophy size={12} color={COLORS.salvage} /><span className="mono" style={{ color: COLORS.salvage, fontWeight: 700 }}>{bestRound}</span> best round</div>}
              <div>{runsPlayed} voyage{runsPlayed === 1 ? "" : "s"} logged</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const showingEvent = state.incomingThreat === "event";
  const event = showingEvent ? EVENTS.find((e) => e.id === state.incomingEventId) : null;

  return (
    <div style={{ background: COLORS.void, color: COLORS.bone, minHeight: "100%", fontFamily: "'Space Grotesk', sans-serif", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
      {sharedStyles}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(circle at 50% 20%, ${flashColor}22, transparent 55%)`, transition: "background 0.5s ease", zIndex: 0 }} />
      {toast && (
        <div className="impact-toast" style={{ padding: "10px 20px", borderRadius: 999, background: COLORS.panel2, border: `1.5px solid ${toast.color}`, boxShadow: `0 0 24px ${toast.color}55` }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: toast.color, letterSpacing: 0.5 }}>{toast.text}</span>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${COLORS.panelBorder}` }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.muted, marginBottom: 4 }}>PROSIS · PLAYTEST BUILD</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>THE FRACTURE</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setRulesOpen((v) => !v)} className="action-btn" style={iconBtnStyle}><HelpCircle size={14} /> Rules</button>
            <button onClick={() => setDesignerView((d) => !d)} className="action-btn" style={iconBtnStyle}>{designerView ? <EyeOff size={14} /> : <Eye size={14} />} Designer</button>
            <button onClick={fullReset} className="action-btn" style={iconBtnStyle}><RotateCcw size={14} /> Reset</button>
          </div>
        </div>

        <div style={{ ...panelStyle, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>Survive as long as you can. <span style={{ color: COLORS.bone }}>The ship can break, the Engine can break, or they can.</span></div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, flexWrap: "wrap" }}>
              {statsLoaded && bestRound !== null && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Trophy size={12} color={COLORS.salvage} /><span className="mono" style={{ color: COLORS.salvage, fontWeight: 700 }}>{bestRound}</span><span style={{ color: COLORS.muted }}>best</span></div>}
              {statsLoaded && <div style={{ color: COLORS.muted }}>{runsPlayed} voyage{runsPlayed === 1 ? "" : "s"}</div>}
              <div className="mono" style={{ color: COLORS.muted }}>I=+1.0 · II=+2.5 · III=+5.5 Entropy</div>
            </div>
          </div>
          <CoreRing size={92} />
        </div>

        {rulesOpen && (
          <div style={{ ...panelStyle, padding: 16, marginBottom: 18, fontSize: 13, lineHeight: 1.6, color: COLORS.muted }}>
            <div style={{ color: COLORS.bone, fontWeight: 600, marginBottom: 6 }}>How this works</div>
            <div><b style={{ color: COLORS.bone }}>Helm / Engineer / Aft</b> — 3 abilities each, 3 levels apiece. Level II is a genuine neutral middle path.</div>
            <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>Events</b> are one-off choices that shape the run — no crew picks that round, just one call.</div>
            <div style={{ marginTop: 4 }}><b style={{ color: COLORS.bone }}>Four ways to lose:</b> Entropy maxes, Systems/RE fail with no Fractures left, or Morale hits zero.</div>
          </div>
        )}

        {!showingEvent && state.incomingThreat && (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 14, border: `1px solid ${state.incomingThreat === "lull" ? COLORS.panelBorder : axisColor[CATEGORIES[state.incomingThreat].axis]}66` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Radar size={15} color={state.incomingThreat === "lull" ? COLORS.muted : axisColor[CATEGORIES[state.incomingThreat].axis]} />
              {state.incomingThreat === "lull" ? (
                <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>Quiet this round. No threat detected — a chance to get ahead of things.</div>
              ) : (
                <div style={{ fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: axisColor[CATEGORIES[state.incomingThreat].axis] }}>Incoming: {CATEGORIES[state.incomingThreat].label}</span>
                  <span style={{ color: COLORS.muted }}> — {CATEGORIES[state.incomingThreat].tag}. Decide how the crew responds.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {showingEvent && (
          <div style={{ ...panelStyle, padding: 16, marginBottom: 14, border: `1px solid ${COLORS.event}77`, background: `linear-gradient(180deg, #1c1826, ${COLORS.panel})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Compass size={16} color={COLORS.event} /><span style={{ fontWeight: 700, color: COLORS.event, fontSize: 14 }}>{event.title}</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.bone, marginBottom: 12, lineHeight: 1.5 }}>{event.prompt}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {event.choices.map((c, i) => (
                <button key={i} onClick={() => resolveEventChoice(c)} disabled={!!state.gameOver} className="action-btn"
                  style={{ textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: state.gameOver ? "default" : "pointer", border: `1px solid ${COLORS.panelBorder}`, background: "#00000030" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, color: COLORS.bone, fontWeight: 600 }}>{c.label}</span>
                    <span className="mono" style={{ fontSize: 9, color: LEVEL_COLOR[c.level], letterSpacing: 0.5 }}>LEVEL {c.level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {underPressureNow && !state.gameOver && (
          <div style={{ textAlign: "center", fontSize: 12, color: COLORS.danger, marginBottom: 14, letterSpacing: 0.5, fontWeight: 600 }}>⚠ UNDER PRESSURE — Level III choices now read as desperation, not control</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[{ key: "entropy", label: "Entropy", val: state.entropy, invert: false, buffer: false }, { key: "systems", label: "Systems Health", val: state.systems, invert: true, buffer: true }, { key: "re", label: "Reality Engine", val: state.re, invert: true, buffer: true }].map((m) => (
            <div key={m.label} className={meterFlash === m.key ? "meter-hit" : ""} style={{ ...panelStyle, padding: 13, border: meterFlash === m.key ? `1.5px solid ${METER_KEY_COLOR[m.key]}` : panelStyle.border, boxShadow: meterFlash === m.key ? `0 0 16px ${METER_KEY_COLOR[m.key]}66` : "none" }}>
              <div style={{ fontSize: 10.5, color: COLORS.muted, marginBottom: 6, letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
              <div className="mono" style={{ fontSize: 19, fontWeight: 700, color: meterColor(m.val, m.invert), marginBottom: 3 }}>{m.val.toFixed(1)}</div>
              {m.buffer && m.val > 100 && <div className="mono" style={{ fontSize: 9.5, color: COLORS.salvage, marginBottom: 4 }}>+{(m.val - 100).toFixed(1)} buffered — decays if unused</div>}
              <div style={{ height: 4, background: "#000", borderRadius: 2, overflow: "hidden", marginTop: m.buffer && m.val > 100 ? 0 : 7 }}><div style={{ height: "100%", width: `${clamp(m.val, 0, 100)}%`, background: meterColor(m.val, m.invert), transition: "width 0.4s ease" }} /></div>
            </div>
          ))}
        </div>

        <div style={{ ...panelStyle, padding: 13, marginBottom: 14, border: `1px solid ${state.morale < MORALE_PRESSURE_THRESHOLD ? COLORS.morale : COLORS.panelBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Heart size={12} color={COLORS.morale} /><span style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1 }}>CREW MORALE — THE HUMAN FRONT</span></div>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: state.morale < MORALE_PRESSURE_THRESHOLD ? COLORS.morale : COLORS.bone }}>{state.morale.toFixed(1)}</span>
          </div>
          <div style={{ height: 5, background: "#000", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${clamp(state.morale, 0, 100)}%`, background: COLORS.morale, transition: "width 0.4s ease" }} /></div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...panelStyle, padding: "7px 12px" }}><Sparkles size={13} color={COLORS.salvage} /><span className="mono" style={{ color: COLORS.salvage, fontWeight: 700, fontSize: 13 }}>{state.salvage.toFixed(1)}</span><span style={{ fontSize: 11.5, color: COLORS.muted }}>salvage</span></div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: COLORS.muted, ...panelStyle, padding: "7px 12px" }}>
            Spend on:
            <select value={state.salvageTarget} onChange={(e) => setState((s) => ({ ...s, salvageTarget: e.target.value }))} style={{ background: "transparent", color: COLORS.bone, border: "none", fontSize: 11.5, cursor: "pointer" }}>
              <option style={{ background: COLORS.panel }} value="auto">Auto (weakest)</option>
              <option style={{ background: COLORS.panel }} value="entropy">Entropy</option>
              <option style={{ background: COLORS.panel }} value="systems">Systems</option>
              <option style={{ background: COLORS.panel }} value="re">Reality Engine</option>
            </select>
          </div>
        </div>

        {designerView && (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 18, borderColor: "#33364a" }}>
            <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 8 }}>DESIGNER VIEW</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13 }}>
              <div>Dominant axis: <span className="mono" style={{ color: axisColor[dom[0]], fontWeight: 700 }}>{axisLabel[dom[0]]}</span> <span className="mono" style={{ color: COLORS.muted }}>({(dom[1] * 100).toFixed(0)}%)</span></div>
              <div className="mono" style={{ color: COLORS.muted, fontSize: 12 }}>pressure sources: {[state.entropy > 55 && "entropy", state.systems < 40 && "systems", state.re < 40 && "RE", state.morale < MORALE_PRESSURE_THRESHOLD && "morale"].filter(Boolean).join(", ") || "none"}</div>
            </div>
          </div>
        )}

        {state.lastBreakdown && (
          <div style={{ ...panelStyle, background: "#101116", padding: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 9 }}>WHAT JUST HAPPENED — ROUND {state.log.filter(l => l.type === "round").slice(-1)[0]?.round}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
              {state.lastBreakdown.threat ? (
                <div className="mono" style={{ color: COLORS.muted }}>
                  Threat: <span style={{ color: axisColor[CATEGORIES[state.lastBreakdown.threat.category].axis] }}>{CATEGORIES[state.lastBreakdown.threat.category].label}</span>
                  {" → "}<span style={{ color: COLORS.bone }}>-{state.lastBreakdown.threat.dmg.toFixed(1)} {meterLabel[state.lastBreakdown.threat.hits]}</span>
                  {state.lastBreakdown.threat.mitigated ? " (softened)" : ""}
                </div>
              ) : state.lastBreakdown.actionsTaken.length > 0 ? <div className="mono" style={{ color: COLORS.muted, fontStyle: "italic" }}>No threat — a lull.</div> : null}
              {state.lastBreakdown.actionsTaken.length > 0 && <div className="mono" style={{ color: COLORS.muted }}>Crew: {state.lastBreakdown.actionsTaken.map((a) => `${a.role}: ${a.label}`).join(", ")} → <span style={{ color: COLORS.bone }}>+{state.lastBreakdown.actionsCost.toFixed(1)} Entropy</span></div>}
              <div className="mono" style={{ color: COLORS.muted }}>Salvage <span style={{ color: COLORS.salvage }}>+{state.lastBreakdown.salvageGained.toFixed(1)}</span> gathered, {state.lastBreakdown.salvageSpent.toFixed(1)} spent on {meterLabel[state.lastBreakdown.salvageTarget]} → <span style={{ color: COLORS.bone }}>+{state.lastBreakdown.salvageRestored.toFixed(1)} restored</span></div>
              {state.lastBreakdown.moraleNotes.length > 0 && <div className="mono" style={{ color: COLORS.morale }}>Morale: {state.lastBreakdown.moraleNotes.join(", ")} → net {state.lastBreakdown.moraleDelta >= 0 ? "+" : ""}{state.lastBreakdown.moraleDelta.toFixed(1)}</div>}
              {(state.lastBreakdown.systemsDecay > 0 || state.lastBreakdown.reDecay > 0) && <div className="mono" style={{ color: COLORS.muted }}>Buffer decay: {state.lastBreakdown.systemsDecay > 0 ? `-${state.lastBreakdown.systemsDecay.toFixed(1)} Systems buffer` : ""}{state.lastBreakdown.systemsDecay > 0 && state.lastBreakdown.reDecay > 0 ? ", " : ""}{state.lastBreakdown.reDecay > 0 ? `-${state.lastBreakdown.reDecay.toFixed(1)} RE buffer` : ""}</div>}
            </div>
          </div>
        )}

        {(() => { const persona = ANCHORS[state.anchorPersona]; return (
          <div style={{ ...panelStyle, padding: 14, marginBottom: 14, border: `1px solid ${persona.color}55` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1 }}>ANCHOR</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: persona.color }}>{persona.name} <span style={{ fontSize: 10.5, color: COLORS.muted, fontWeight: 400 }}>— {persona.tag}</span></div>
              </div>
              {state.anchorPersona === "dez" ? (
                <div className="mono" style={{ fontSize: 12, color: state.distrust > 0 ? COLORS.danger : COLORS.muted }}>
                  {state.distrust > 0 ? `Distrust ${state.distrust.toFixed(1)} — defiance risk ${(state.defianceChance * 100).toFixed(0)}%` : `Trust ${state.beliefOrTrust.toFixed(1)}`}
                </div>
              ) : (
                <div className="mono" style={{ fontSize: 12, color: state.beliefReady ? persona.color : COLORS.muted }}>Belief {state.beliefOrTrust.toFixed(1)}{state.beliefReady ? " — ready" : ""}</div>
              )}
            </div>

            {state.beliefReady && !state.gameOver && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: COLORS.muted }}>Spend Belief — free heal to:</span>
                {["entropy", "systems", "re"].map((f) => (
                  <button key={f} onClick={() => spendBelief(f)} className="action-btn" style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${persona.color}`, background: `${persona.color}18`, color: persona.color, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{meterLabelStatic[f]}</button>
                ))}
              </div>
            )}

            {state.anchorPersona === "maude" && !showingEvent && !state.gameOver && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: COLORS.muted }}>Engineer covers:</span>
                {[{ id: null, label: "Systems (native)" }, { id: "entropy", label: "Entropy" }, { id: "re", label: "Reality Engine" }].map((opt) => (
                  <button key={opt.label} onClick={() => setState((s) => ({ ...s, maudeCoverTarget: opt.id }))} className="action-btn"
                    style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${(state.maudeCoverTarget || null) === opt.id ? persona.color : COLORS.panelBorder}`, background: (state.maudeCoverTarget || null) === opt.id ? `${persona.color}18` : "transparent", color: (state.maudeCoverTarget || null) === opt.id ? persona.color : COLORS.muted, fontSize: 11, cursor: "pointer" }}>{opt.label}</button>
                ))}
                {state.maudeCoverTarget && <span className="mono" style={{ fontSize: 10.5, color: COLORS.danger }}>{(maudeTax(state.maudeConsecutiveCoverage + 1) * 100).toFixed(0)}% friction tax next use</span>}
              </div>
            )}

            {state.openBanks.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 0.5 }}>OPEN BARRIERS</span>
                {state.openBanks.map((bank, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, background: "#00000030", borderRadius: 6, padding: "6px 10px" }}>
                    <span className="mono" style={{ color: COLORS.bone }}>{bank.banked.toFixed(1)} → {meterLabelStatic[bank.front] || bank.front} <span style={{ color: bank.roundsHeld >= BANK_GROWTH_CAP_ROUNDS ? COLORS.muted : COLORS.salvage }}>{bank.roundsHeld >= BANK_GROWTH_CAP_ROUNDS ? "(grown, holding steady — claim anytime)" : `(growing — held ${bank.roundsHeld} round${bank.roundsHeld === 1 ? "" : "s"}, exposed to a hit on this front)`}</span></span>
                    <button onClick={() => claimBankAction(i)} className="action-btn" style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${COLORS.salvage}`, background: `${COLORS.salvage}18`, color: COLORS.salvage, fontSize: 10.5, cursor: "pointer", fontWeight: 600 }}>CLAIM</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ); })()}

        {!showingEvent && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 10 }}>Pick one ability and a level for each crew member.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {state.players.map((p, idx) => {
                const role = ROLES.find((r) => r.id === p.roleId);
                return (
                  <div key={idx} style={{ ...panelStyle, padding: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.bone }}>{role.personalName}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 9 }}>{role.name} · {role.focus}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {role.abilities.map((ability) => (
                        <div key={ability.id}>
                          <div style={{ fontSize: 11, color: COLORS.bone, fontWeight: 600 }}>{ability.label}</div>
                          <div style={{ fontSize: 9.5, color: COLORS.muted, marginBottom: 4 }}>{ability.desc}</div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {["I", "II", "III"].map((lvl) => {
                              const selected = p.ability === ability.id && p.level === lvl;
                              const isSalvage = role.id === "engineer";
                              const costVal = isSalvage ? LEVELS_SALVAGE[lvl] : LEVELS[lvl].cost;
                              const costLabel = `${costVal.toFixed(1)} ${isSalvage ? "Salvage" : "Entropy"}`;
                              return (
                                <button key={lvl} onClick={() => setPlayerChoice(idx, ability.id, lvl)} disabled={!!state.gameOver} className="level-pill"
                                  title={costLabel}
                                  style={{ flex: 1, padding: "5px 0", borderRadius: 5, cursor: state.gameOver ? "default" : "pointer", border: `1px solid ${selected ? LEVEL_COLOR[lvl] : COLORS.panelBorder}`, background: selected ? `${LEVEL_COLOR[lvl]}22` : "#00000020", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                  <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: selected ? LEVEL_COLOR[lvl] : COLORS.muted }}>{lvl}</span>
                                  <span className="mono" style={{ fontSize: 7.5, fontWeight: 500, color: selected ? LEVEL_COLOR[lvl] : COLORS.muted, opacity: 0.75 }}>{costVal.toFixed(1)} {isSalvage ? "SLV" : "ENT"}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!state.gameOver ? (
          !showingEvent && (
            <button onClick={resolveRound} disabled={state.players.some((p) => !p.ability)} className="action-btn primary-btn"
              style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", fontSize: 13.5, fontWeight: 700, cursor: state.players.some((p) => !p.ability) ? "not-allowed" : "pointer", background: state.players.some((p) => !p.ability) ? COLORS.panelBorder : COLORS.bone, color: state.players.some((p) => !p.ability) ? COLORS.muted : COLORS.void, letterSpacing: 1.5, marginBottom: 22 }}>
              RESOLVE ROUND
            </button>
          )
        ) : (
          <div style={{ ...panelStyle, background: "#1a0f12", borderColor: `${COLORS.danger}55`, padding: 18, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Skull size={20} color={COLORS.danger} />
              <div><div style={{ fontWeight: 700, color: COLORS.danger, marginBottom: 2 }}>Run ended — round {state.round}</div><div style={{ fontSize: 12.5, color: COLORS.muted }}>{state.gameOver}</div></div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.bone, fontStyle: "italic", borderTop: `1px solid ${COLORS.panelBorder}`, paddingTop: 10, marginTop: 6 }}>{state.lossType === "morale" ? MORALE_EPITAPH(state.round) : EPITAPHS[dom[0]](state.round)}</div>
            {bestRound === state.round && runsPlayed > 1 && <div style={{ fontSize: 12, color: COLORS.salvage, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}><Trophy size={12} /> New best round.</div>}
            <button onClick={launchNextVoyage} className="action-btn primary-btn" style={{ marginTop: 14, background: COLORS.bone, color: COLORS.void, border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 12.5, cursor: "pointer", letterSpacing: 1, display: "flex", alignItems: "center", gap: 7 }}><Rocket size={14} /> LAUNCH NEXT VOYAGE</button>
          </div>
        )}

        <div style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: 1, marginBottom: 8 }}>SESSION LOG</div>
        <div style={{ ...panelStyle, padding: 12, maxHeight: 200, overflowY: "auto" }}>
          {state.log.length === 0 && <div style={{ color: COLORS.muted, fontSize: 12.5 }}>Respond to the first round to begin.</div>}
          {state.log.map((entry, i) => {
            if (entry.type === "intro") return <div key={i} style={{ fontSize: 12.5, color: COLORS.bone, fontStyle: "italic", padding: "2px 0" }}>The Fracture opens. The first threat is already visible. Answer it.</div>;
            if (entry.type === "round") return <div key={i} className="mono" style={{ fontSize: 10.5, color: COLORS.muted, marginTop: i > 0 ? 10 : 0, borderTop: i > 0 ? `1px solid ${COLORS.panelBorder}` : "none", paddingTop: i > 0 ? 8 : 0 }}>— ROUND {entry.round} —</div>;
            if (entry.type === "lull") return <div key={i} style={{ fontSize: 12.5, color: COLORS.muted, fontStyle: "italic", padding: "2px 0" }}>Quiet. Nothing surfaced this round.</div>;
            if (entry.type === "event") return (
              <div key={i} style={{ padding: "4px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Compass size={12} color={COLORS.event} /><span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.event }}>{entry.title}</span><span className="mono" style={{ fontSize: 11, color: COLORS.muted }}>— {entry.choice}</span></div>
                <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2, marginLeft: 18, fontStyle: "italic" }}>{entry.result}</div>
              </div>
            );
            if (entry.type === "threat") {
              const color = entry.category === "targeted" ? COLORS.ruthless : entry.category === "telegraphed" ? COLORS.methodical : COLORS.desperate1;
              return (
                <div key={i} style={{ padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {entry.category === "targeted" && <Zap size={12} color={color} />}{entry.category === "telegraphed" && <Flame size={12} color={color} />}{entry.category === "cascading" && <AlertTriangle size={12} color={color} />}
                    <span style={{ fontSize: 12.5, fontWeight: 600, color }}>{CATEGORIES[entry.category].label}</span>
                    <span className="mono" style={{ fontSize: 11.5, color: COLORS.muted }}>−{entry.dmg} {meterLabel[entry.hits]}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2, marginLeft: 18 }}>{entry.line}</div>
                </div>
              );
            }
            if (entry.type === "loss") return <div key={i} style={{ fontSize: 12.5, color: COLORS.danger, fontWeight: 700, padding: "4px 0" }}>{entry.reason}</div>;
            if (entry.type === "defiance") return <div key={i} style={{ fontSize: 12.5, color: ANCHORS.dez.color, fontStyle: "italic", padding: "4px 0" }}>⚡ The crew overrides Dez — {entry.from} → {entry.to} {entry.level}. Nobody asked permission.</div>;
            if (entry.type === "bank_expired") return <div key={i} style={{ fontSize: 12, color: COLORS.muted, fontStyle: "italic", padding: "2px 0" }}>Left standing too long: {entry.banked.toFixed(1)} on the {meterLabelStatic[entry.front] || entry.front} barrier. The debt came due.</div>;
            if (entry.type === "bank_claimed") return <div key={i} style={{ fontSize: 12, color: COLORS.salvage, padding: "2px 0" }}>Barrier claimed — +{entry.payout.toFixed(1)} to {meterLabelStatic[entry.front] || entry.front}{entry.moraleGain ? `, +${entry.moraleGain} Morale` : ""}.</div>;
            if (entry.type === "belief_spent") return <div key={i} style={{ fontSize: 12.5, color: ANCHORS[state.anchorPersona]?.color || COLORS.bone, fontWeight: 600, padding: "4px 0" }}>Belief spent — +{entry.payout.toFixed(1)} to {meterLabelStatic[entry.front] || entry.front}.</div>;
            return null;
          })}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
