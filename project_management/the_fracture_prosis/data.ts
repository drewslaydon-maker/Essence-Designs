import type { Ability, PersonaConfig, Role } from "./types";

export const ROLES: Role[] = [
  {
    id: "helm",
    name: "Helm",
    personalName: "Helm",
    focus: "Entropy & Foresight",
    abilities: [
      {
        id: "force_correction",
        label: "Force the Correction",
        shape: "different_front_now",
        desc: "Entropy drops immediately. Systems takes the hit, same round.",
        levels: {
          I: { entropyDelta: -1.5, systemsDelta: -3 },
          II: { entropyDelta: -3.5, systemsDelta: -6 },
          III: { entropyDelta: -7, systemsDelta: -10 },
        },
      },
      {
        id: "suppress",
        label: "Suppress",
        shape: "same_front_later",
        desc: "Entropy drops now. Ambient Entropy growth runs hot for the next 2 rounds.",
        levels: {
          I: { entropyDelta: -1, ambientBump: 0.02, bumpRounds: 2 },
          II: { entropyDelta: -2.5, ambientBump: 0.04, bumpRounds: 2 },
          III: { entropyDelta: -5, ambientBump: 0.07, bumpRounds: 2 },
        },
      },
      {
        id: "threat_ledger",
        label: "Threat Ledger",
        shape: "deferred_compounding",
        desc: "Raises a barrier against Entropy. The longer it holds, the more it's worth — but an Entropy spike while it's up costs the barrier the same haircut Entropy itself would take.",
        levels: { I: { banked: 2 }, II: { banked: 5 }, III: { banked: 9 } },
        front: "entropy",
      },
      {
        id: "analyze",
        label: "Analyze",
        shape: "personal",
        desc: "Reads the incoming threat before it lands. Softens it for the whole crew this round. No front healed — this is foresight, not repair.",
        levels: {
          I: { mitigation: 0.35, morale: 2 },
          II: { mitigation: 0.55, morale: 3 },
          III: { mitigation: 0.75, morale: 4 },
        },
      },
    ],
  },
  {
    id: "engineer",
    name: "Engineer",
    personalName: "Gene",
    focus: "Systems Health",
    abilities: [
      {
        id: "overload",
        label: "Overload",
        shape: "different_front_now",
        desc: "Big Systems gain. Entropy takes the hit, same round.",
        levels: {
          I: { systemsDelta: 7, entropyDelta: 1 },
          II: { systemsDelta: 15, entropyDelta: 2.5 },
          III: { systemsDelta: 26, entropyDelta: 5 },
        },
      },
      {
        id: "overclock",
        label: "Overclock",
        shape: "same_front_later",
        desc: "Systems gain now. Systems' own wear rate runs hot for the next 2 rounds.",
        levels: {
          I: { systemsDelta: 6, wearBump: 0.02, bumpRounds: 2 },
          II: { systemsDelta: 13, wearBump: 0.04, bumpRounds: 2 },
          III: { systemsDelta: 23, wearBump: 0.07, bumpRounds: 2 },
        },
      },
      {
        id: "reserve_cache",
        label: "Reserve Cache",
        shape: "deferred_compounding",
        desc: "Raises a barrier around Systems. The longer it holds, the more it's worth — but a hit to Systems while it's up costs the barrier the same haircut Systems itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "systems",
      },
      {
        id: "dead_reckoning",
        label: "Dead Reckoning",
        shape: "personal",
        desc: "Charts a safer course through the incoming threat, softening it for the whole crew. Also buys any open barrier extra time to grow before exposure risk catches up. No front healed.",
        levels: {
          I: { mitigation: 0.2, extend: 1 },
          II: { mitigation: 0.32, extend: 2 },
          III: { mitigation: 0.45, extend: 3 },
        },
      },
    ],
  },
  {
    id: "aft",
    name: "Aft",
    personalName: "Sal",
    focus: "Reality Engine & Salvage",
    abilities: [
      {
        id: "force_extraction",
        label: "Force Extraction",
        shape: "different_front_now",
        desc: "Fast Salvage grab. The Reality Engine takes the hit, same round.",
        levels: {
          I: { salvageDelta: 5, reDelta: 0 },
          II: { salvageDelta: 11, reDelta: -1 },
          III: { salvageDelta: 20, reDelta: -3 },
        },
      },
      {
        id: "patch_job",
        label: "Patch Job",
        shape: "same_front_later",
        desc: "RE gain now. RE's own wear rate runs hot for the next 2 rounds.",
        levels: {
          I: { reDelta: 6, wearBump: 0.02, bumpRounds: 2 },
          II: { reDelta: 13, wearBump: 0.04, bumpRounds: 2 },
          III: { reDelta: 23, wearBump: 0.07, bumpRounds: 2 },
        },
      },
      {
        id: "stockpile",
        label: "Stockpile",
        shape: "deferred_compounding",
        // REDESIGNED 2026-08-20: previously banked Salvage, which left Aft as the
        // only role with no defensive tool for its own front. Now mirrors Reserve
        // Cache: banks RE. Salvage generation stays on Force Extraction + passive.
        desc: "Raises a barrier around the Reality Engine. The longer it holds, the more it's worth — but a hit to the Engine while it's up costs the barrier the same haircut the Engine itself would take.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "re",
      },
      {
        id: "ration_the_take",
        label: "Ration the Take",
        shape: "personal",
        desc: "Rations the crew's exposure to the incoming threat, softening it for everyone. Also shields any open barrier from this round's exposure haircut entirely. No front healed.",
        levels: {
          I: { mitigation: 0.2, shield: true },
          II: { mitigation: 0.32, shield: true },
          III: { mitigation: 0.45, shield: true },
        },
      },
    ],
  },
];

export const ANCHORS: Record<"ricky" | "maude" | "dez", PersonaConfig> = {
  ricky: {
    id: "ricky",
    name: "Ricky",
    direction: "Risky",
    nativeFront: "entropy",
    color: "#FF4D6D",
    tag: "Different front, now — amplified.",
    blurb:
      "Proud. Arrogant. Mood-swingy. Makes the call, makes you live with it.",
    signature: "Kiss the gamble or curse it. Either way, you'll feel it.",
    pulseClass: "pulse-ricky",
  },
  maude: {
    id: "maude",
    name: "Maude",
    direction: "Moderate",
    nativeFront: "systems",
    color: "#6FA8FF",
    tag: "Same front, later — hers to carry.",
    blurb:
      "Overworked-manager energy. Holds it together through sheer, burning-out competence.",
    signature: "Someone has to hold the line. It's always her.",
    pulseClass: "pulse-maude",
  },
  dez: {
    id: "dez",
    name: "Dez",
    direction: "Desperate",
    nativeFront: "re",
    color: "#8B5CF6",
    tag: "Deferred, compounding — on your word.",
    blurb:
      "Hedges every order. Begs for authority without saying so. The crew is starting to notice.",
    signature:
 "I— I think this is right? If that's okay with everyone.",
    pulseClass: "pulse-dez",
  },
};
