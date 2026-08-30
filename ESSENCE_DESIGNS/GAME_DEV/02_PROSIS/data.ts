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
        desc: "Drop Entropy immediately. Ship Systems sustain heavy splash damage.",
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
        desc: "Deploy a flat Entropy Quick Barrier. Active instantly; holds steady from day one.",
        levels: {
          I: { banked: 3 },
          II: { banked: 6.5 },
          III: { banked: 11.5 },
        },
        front: "entropy",
      },
      {
        id: "threat_ledger",
        label: "Threat Ledger",
        shape: "deferred_compounding",
        desc: "Deploy Entropy Barrier. Compounds over time; takes haircut on threat exposure.",
        levels: { I: { banked: 2 }, II: { banked: 5 }, III: { banked: 9 } },
        front: "entropy",
      },
      {
        id: "analyze",
        label: "Analyze",
        shape: "personal",
        desc: "Scan incoming vector. Mitigates threat and boosts morale this round.",
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
        desc: "Restore Systems integrity. Triggers instantaneous Entropy spike.",
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
        desc: "Deploy a flat Systems Quick Barrier. Active instantly; holds steady from day one.",
        levels: {
          I: { banked: 4 },
          II: { banked: 9 },
          III: { banked: 16 },
        },
        front: "systems",
      },
      {
        id: "reserve_cache",
        label: "Reserve Cache",
        shape: "deferred_compounding",
        desc: "Deploy Systems Barrier. Compounds over time; takes haircut on threat exposure.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "systems",
      },
      {
        id: "dead_reckoning",
        label: "Dead Reckoning",
        shape: "personal",
        desc: "Chart safe vector. Mitigates threat and extends active Barriers.",
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
        desc: "Scavenge Salvage. Reality Engine structural integrity compromised.",
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
        desc: "Deploy a flat Engine Quick Barrier. Active instantly; holds steady from day one.",
        levels: {
          I: { banked: 5 },
          II: { banked: 11 },
          III: { banked: 19.5 },
        },
        front: "re",
      },
      {
        id: "stockpile",
        label: "Stockpile",
        shape: "deferred_compounding",
        desc: "Deploy Engine Barrier. Compounds over time; takes haircut on threat exposure.",
        levels: { I: { banked: 4 }, II: { banked: 9 }, III: { banked: 16 } },
        front: "re",
      },
      {
        id: "ration_the_take",
        label: "Ration the Take",
        shape: "personal",
        desc: "Ration exposure. Mitigates threat and shields Barriers from exposure haircut.",
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
