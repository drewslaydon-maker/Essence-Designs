// Quantum Calibration Diagnostic Module (WDT — Water Divination Test) for prOsis v2.0CE.

import type { PersonaId } from "./types";

export interface ScenarioOption {
  id: string;
  text: string;
  personaWeights: Record<PersonaId, number>;
}

export interface Scenario {
  id: string;
  title: string;
  question: string;
  options: ScenarioOption[];
}

export interface CalibrationPatch {
  personaId: PersonaId;
  title: string;
  tagline: string;
  color: string;
  accentColor: string;
  glyph: string;
  badgeIcon: string;
  description: string;
  recommendedLoadout: {
    focus: string;
    tacticalStyle: string;
    startingRuneId: string;
  };
  svg: string;
}

export const WDT_SCENARIOS: Scenario[] = [
  {
    id: "wdt_01",
    title: "Cascading Reactor Breach",
    question: "Alert! Primary energy core has suffered an unstable cascade breakdown. Immediate tactical response required:",
    options: [
      {
        id: "wdt_01_opt_a",
        text: "Overdrive containment vents and force a high-energy pulse to blow past the failure threshold.",
        personaWeights: { ricky: 3, maude: 0, dez: 1 },
      },
      {
        id: "wdt_01_opt_b",
        text: "Initiate standard multi-stage dampening protocols to lock down systems and minimize wear.",
        personaWeights: { ricky: 0, maude: 3, dez: 1 },
      },
      {
        id: "wdt_01_opt_c",
        text: "Redirect remaining output into reserve banks and prepare for emergency crew intervention.",
        personaWeights: { ricky: 1, maude: 1, dez: 3 },
      },
    ],
  },
  {
    id: "wdt_02",
    title: "Gravitational Anomaly Field",
    question: "A dense rift opens on your long-range radar, offering abundant raw salvage alongside intense distortion:",
    options: [
      {
        id: "wdt_02_opt_a",
        text: "Charge full throttle into the rift core to harvest maximum salvage before distortion collapses.",
        personaWeights: { ricky: 3, maude: 1, dez: 0 },
      },
      {
        id: "wdt_02_opt_b",
        text: "Deploy sensor arrays to systematically map decay corridors before committing vessel resources.",
        personaWeights: { ricky: 1, maude: 3, dez: 1 },
      },
      {
        id: "wdt_02_opt_c",
        text: "Maintain defensive distance, banking current energy while monitoring ambient volatility.",
        personaWeights: { ricky: 0, maude: 1, dez: 3 },
      },
    ],
  },
  {
    id: "wdt_03",
    title: "Crew Strain & Morale Flare",
    question: "Protracted temporal decay is straining crew focus and raising doubts about executive decisions:",
    options: [
      {
        id: "wdt_03_opt_a",
        text: "Enforce aggressive operational tempo — momentum and quick victories are the best cure for fear.",
        personaWeights: { ricky: 3, maude: 0, dez: 0 },
      },
      {
        id: "wdt_03_opt_b",
        text: "Re-organize duty shifts to equalize systemic strain and guarantee reliable baseline performance.",
        personaWeights: { ricky: 0, maude: 3, dez: 1 },
      },
      {
        id: "wdt_03_opt_c",
        text: "Acknowledge defiance, grant operational leeway, and rely on crew instinct to break the deadlock.",
        personaWeights: { ricky: 1, maude: 0, dez: 3 },
      },
    ],
  },
  {
    id: "wdt_04",
    title: "Terminal Warp Choice",
    question: "The sector exit gate is in sight, but surrounded by unpredictable void threat trajectories:",
    options: [
      {
        id: "wdt_04_opt_a",
        text: "Engage emergency thrusters for a high-speed dash straight through the threat sector.",
        personaWeights: { ricky: 3, maude: 1, dez: 0 },
      },
      {
        id: "wdt_04_opt_b",
        text: "Methodically neutralize incoming threat vectors front by front before initiating warp sequence.",
        personaWeights: { ricky: 0, maude: 3, dez: 1 },
      },
      {
        id: "wdt_04_opt_c",
        text: "Fortify all defensive barriers and await an opportunistic lull in environmental pressure.",
        personaWeights: { ricky: 0, maude: 1, dez: 3 },
      },
    ],
  },
];

export function evaluateDiagnosticResult(answers: Record<string, string>): PersonaId {
  const scores: Record<PersonaId, number> = { ricky: 0, maude: 0, dez: 0 };

  for (const scenario of WDT_SCENARIOS) {
    const selectedOptionId = answers[scenario.id];
    if (selectedOptionId) {
      const option = scenario.options.find((opt) => opt.id === selectedOptionId);
      if (option && option.personaWeights) {
        scores.ricky += option.personaWeights.ricky ?? 0;
        scores.maude += option.personaWeights.maude ?? 0;
        scores.dez += option.personaWeights.dez ?? 0;
      }
    }
  }

  let dominant: PersonaId = "ricky";
  let maxScore = -1;
  const personas: PersonaId[] = ["ricky", "maude", "dez"];
  for (const p of personas) {
    if (scores[p] > maxScore) {
      maxScore = scores[p];
      dominant = p;
    }
  }

  return dominant;
}

export function getCalibrationPatch(personaId: PersonaId): CalibrationPatch {
  switch (personaId) {
    case "ricky":
      return {
        personaId: "ricky",
        title: "Aggressive Impulse Vector",
        tagline: "Ruthless Momentum & Direct Pressure Suppression",
        color: "#ff4d6d",
        accentColor: "#ff758f",
        glyph: "ZAP",
        badgeIcon: "Zap",
        description: "Focuses on rapid entropy reduction, high-impact offensive bursts, and score acceleration under pressure.",
        recommendedLoadout: {
          focus: "Entropy Front & Overdrive",
          tacticalStyle: "Aggressive Momentum",
          startingRuneId: "singularity-catalyst",
        },
        svg: `<svg viewBox="0 0 100 100" width="48" height="48"><polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="#ff4d6d" fill-opacity="0.15" stroke="#ff4d6d" stroke-width="3"/><path d="M55 20 L30 55 L50 55 L45 80 L70 45 L50 45 Z" fill="#ff4d6d"/></svg>`,
      };
    case "maude":
      return {
        personaId: "maude",
        title: "Methodical Shielding Vector",
        tagline: "System Containment & Structural Integrity",
        color: "#6fa8ff",
        accentColor: "#93c5fd",
        glyph: "SHIELD",
        badgeIcon: "ShieldAlert",
        description: "Emphasizes steady system repairs, wear mitigation, and cumulative barrier defense.",
        recommendedLoadout: {
          focus: "Systems & Mitigation",
          tacticalStyle: "Methodical Containment",
          startingRuneId: "aether-refractor",
        },
        svg: `<svg viewBox="0 0 100 100" width="48" height="48"><polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="#6fa8ff" fill-opacity="0.15" stroke="#6fa8ff" stroke-width="3"/><path d="M50 20 L80 35 V60 C80 75 50 88 50 88 C50 88 20 75 20 60 V35 Z" fill="none" stroke="#6fa8ff" stroke-width="4"/><circle cx="50" cy="52" r="10" fill="#6fa8ff"/></svg>`,
      };
    case "dez":
      return {
        personaId: "dez",
        title: "Entropic Re-Bank Vector",
        tagline: "Desperate Reserve Banking & Calculated Defiance",
        color: "#8b5cf6",
        accentColor: "#c4b5fd",
        glyph: "RE",
        badgeIcon: "Anchor",
        description: "Specializes in banking energy reserves, turning low trust into powerful defiance triggers, and high-yield scoring.",
        recommendedLoadout: {
          focus: "RE Banking & Morale",
          tacticalStyle: "Contrarian Defiance",
          startingRuneId: "chronos-anchor",
        },
        svg: `<svg viewBox="0 0 100 100" width="48" height="48"><polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="#8b5cf6" fill-opacity="0.15" stroke="#8b5cf6" stroke-width="3"/><path d="M50 22 V70 M30 40 H70 M30 70 Q50 85 70 70" fill="none" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="22" r="6" fill="#8b5cf6"/></svg>`,
      };
  }
}
