/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PilotId, PilotProfile, PaintjobId, VisorStyleId } from '../types';

export const PILOT_ROSTER: Record<PilotId, PilotProfile> = {
  SHIN_FLY: {
    id: 'SHIN_FLY',
    name: 'Shin-fly Ikari [シンジ]',
    callsign: 'THIRD CHILDREN // SPECIMEN-01',
    unitName: 'EVA-01 TEST TYPE [DROSOPHILA]',
    evaUnit: 'UNIT-01',
    tagline: 'Neurotic escape reflex pioneer with explosive Giant Fiber jumping power.',
    quote: '"I must not fly away... I must not fly away! Father, my ommatidia aren\'t even calibrated!"',
    trait: 'Giant Fiber Looming Hypersensitivity (+25% Evasive Jump Window, Berserk Wing Flap at low HP)',
    bioArchetype: 'Giant Fiber Reflex / Escape Jump Neuron (GF & TTM/PSI)',
    primaryColor: '#8b5cf6', // Evangelion Unit-01 Purple
    accentColor: '#22c55e', // Unit-01 Neon Green
    badgeBg: 'bg-purple-950/80 border-purple-500',
    stats: {
      gfAgility: 1.25,
      attackPower: 1.0,
      atFieldPower: 1.0,
      energyCap: 1.1,
    },
  },
  ASU_MAG: {
    id: 'ASU_MAG',
    name: 'Asu-mag Langley [アスカ]',
    callsign: 'SECOND CHILDREN // SPECIMEN-02',
    unitName: 'EVA-02 PRODUCTION TYPE [MAGGOT-PRIDE]',
    evaUnit: 'UNIT-02',
    tagline: 'Hyper-aggressive optic tracker with predatory LC10 visual projection neurons.',
    quote: '"ANTA BAKA?! You call that a looming threat? You couldn\'t swat a larval fruit fly!"',
    trait: 'LC10 Visual Target Pursuit (+20% Positron Damage & Rapid Volley Cadence, -10% Evasion)',
    bioArchetype: 'Lobula Columnar LC10 Target-Chasing Neural Circuits',
    primaryColor: '#ef4444', // Evangelion Unit-02 Crimson
    accentColor: '#eab308', // Unit-02 Yellow
    badgeBg: 'bg-red-950/80 border-red-500',
    stats: {
      gfAgility: 0.95,
      attackPower: 1.25,
      atFieldPower: 0.9,
      energyCap: 1.2,
    },
  },
  REI_VA: {
    id: 'REI_VA',
    name: 'Rei-va Ayanami [レイ]',
    callsign: 'FIRST CHILDREN // SPECIMEN-00',
    unitName: 'EVA-00 PROTOTYPE [BLUE-CHITIN]',
    evaUnit: 'UNIT-00',
    tagline: 'Stoic bio-synthetic specimen with near-zero baseline membrane fluctuations.',
    quote: '"If this specimen is swatted... I can be replaced. Deploy the A.T. Field barrier."',
    trait: 'Unshakeable Homeostatic A.T. Field (+30% Barrier Armor & Continuous Hull Regeneration)',
    bioArchetype: 'Central Complex Compass E-PG Ring Stability & Low Octopamine Drift',
    primaryColor: '#0ea5e9', // Evangelion Unit-00 Arctic Blue
    accentColor: '#f8fafc', // Unit-00 White
    badgeBg: 'bg-sky-950/80 border-sky-500',
    stats: {
      gfAgility: 1.0,
      attackPower: 0.95,
      atFieldPower: 1.35,
      energyCap: 1.0,
    },
  },
};

export interface PaintjobConfig {
  id: PaintjobId;
  name: string;
  cost: number;
  description: string;
  hullColor: string;
  glowColor: string;
  chitinFinish: string;
}

export const PAINTJOB_CATALOG: Record<PaintjobId, PaintjobConfig> = {
  TEST_TYPE_01: {
    id: 'TEST_TYPE_01',
    name: 'Unit-01 Awakening (Purple / Neon Green)',
    cost: 0,
    description: 'The standard bio-synthetic livery tuned to Shin-fly Ikari. High visual resonance.',
    hullColor: '#7c3aed',
    glowColor: '#10b981',
    chitinFinish: 'Slick Bio-Polymer',
  },
  PRODUCTION_02: {
    id: 'PRODUCTION_02',
    name: 'Unit-02 Vermillion Strike (Crimson / Gold)',
    cost: 1200,
    description: 'Aggressive Euro-NERV red chitin armor plating. Inspires acute predator dread.',
    hullColor: '#dc2626',
    glowColor: '#facc15',
    chitinFinish: 'Reflective Crimson Enamel',
  },
  PROTOTYPE_00: {
    id: 'PROTOTYPE_00',
    name: 'Unit-00 Arctic Prototype (Cobalt / White)',
    cost: 1500,
    description: 'Stabilized cryogenic shielding coat designed for high-density A.T. Field containment.',
    hullColor: '#0284c7',
    glowColor: '#ffffff',
    chitinFinish: 'Matte Ceramic Chitin',
  },
  GOLDEN_CHRYSALIS: {
    id: 'GOLDEN_CHRYSALIS',
    name: 'Tokyo-3 Golden Chrysalis (Gilded Metamorphosis)',
    cost: 3000,
    description: 'Rare pupal shell reinforced with crystallized Angel S² core residue. Radiates gold.',
    hullColor: '#d97706',
    glowColor: '#fef08a',
    chitinFinish: 'Iridescent Gold Leaf',
  },
};

export interface VisorConfig {
  id: VisorStyleId;
  name: string;
  cost: number;
  description: string;
  reticleColor: string;
  gridStyle: string;
}

export const VISOR_CATALOG: Record<VisorStyleId, VisorConfig> = {
  COMPOUND_HEX: {
    id: 'COMPOUND_HEX',
    name: '750-Ommatidia Hexagonal Compound',
    cost: 0,
    description: 'Standard fly compound eye array mapping 360-degree field of view to the cockpit.',
    reticleColor: '#f59e0b',
    gridStyle: 'Hexagonal Amber Lattice',
  },
  BERSERK_RED: {
    id: 'BERSERK_RED',
    name: 'Synchro Overdrive Crimson Predator Grid',
    cost: 800,
    description: 'Direct optical tap that overrides safe limits. Flashes high contrast danger spikes.',
    reticleColor: '#ef4444',
    gridStyle: 'Strobe Crimson Cross-Matrix',
  },
  CYAN_OPTIC: {
    id: 'CYAN_OPTIC',
    name: 'T4/T5 Lobula Plate Optic Flow HUD',
    cost: 1000,
    description: 'Displays elementary motion detector vector fields directly over the Angel.',
    reticleColor: '#06b6d4',
    gridStyle: 'Vector Optic Flow Stream',
  },
};

export interface UpgradeTier {
  name: string;
  cost: number;
  boostDescription: string;
}

export const UPGRADE_CATALOG = {
  ommatidia: {
    id: 'ommatidia',
    title: 'Compound Ommatidia Calibration',
    iconName: 'Eye',
    description: 'Increases targeting lead cone width and speeds up autonomous crosshair acquisition.',
    tiers: [
      { name: 'Standard Retina (700 facets)', cost: 0, boostDescription: 'Baseline lock cone (35°)' },
      { name: 'Deep Ultraviolet Receptors', cost: 500, boostDescription: '+15% wider targeting lock-on cone' },
      { name: 'Neural Super-Resolution (1,200 facets)', cost: 1200, boostDescription: '+30% lock cone & faster tracking' },
      { name: 'Apex Predator Compound Prism', cost: 2400, boostDescription: 'Instant optical lock & predictive lead' },
    ],
  },
  giantFiber: {
    id: 'giantFiber',
    title: 'Giant Fiber Axon Myelination',
    iconName: 'Zap',
    description: 'Thickens the large interneurons descending from the brain to thoracic motor circuits.',
    tiers: [
      { name: 'Wild-Type Drosophila Axon', cost: 0, boostDescription: 'Baseline 5ms looming reaction delay' },
      { name: 'Lipid-Insulated Bio-Sheath', cost: 600, boostDescription: '+20% faster looming auto-dodge window' },
      { name: 'Supersonic Synaptic Gap Junctions', cost: 1400, boostDescription: '+40% faster escape reflex & extra dash distance' },
      { name: 'God\'s Messenger Reflex', cost: 2800, boostDescription: 'Immunity to initial projectile damage on dodge' },
    ],
  },
  octopamine: {
    id: 'octopamine',
    title: 'Octopamine Bio-Synthesis Gland',
    iconName: 'Flame',
    description: 'The insect fight-or-flight amine. Enhances positron battery regeneration and thruster burst duration.',
    tiers: [
      { name: 'Standard Thoracic Gland', cost: 0, boostDescription: 'Baseline 100 energy / normal recharge' },
      { name: 'Synthesized Octopamine Reservoir', cost: 450, boostDescription: '+25 max battery & +20% recharge speed' },
      { name: 'Hyper-Adrenergic Cascade Loop', cost: 1100, boostDescription: '+50 max battery & +45% recharge speed' },
      { name: 'Endless Flight Neuro-Pump', cost: 2200, boostDescription: 'Continuous rapid battery regeneration' },
    ],
  },
  needle: {
    id: 'needle',
    title: 'Progressive Vibrating Proboscis Needle',
    iconName: 'Sword',
    description: 'High-frequency ultrasonic needle weapon that shatters Angel A.T. Fields on impact.',
    tiers: [
      { name: 'Standard Positron Rifle', cost: 0, boostDescription: '45 HP damage per shot' },
      { name: 'Ultrasonic Chitin Oscillators', cost: 700, boostDescription: '60 HP damage (+33% power)' },
      { name: 'Harmonic Phase-Disruption Needle', cost: 1600, boostDescription: '80 HP damage & double A.T. Field erosion' },
      { name: 'Longinus Bio-Lance Frequency', cost: 3200, boostDescription: '110 HP damage & pierces through A.T. Fields' },
    ],
  },
};
