import { AcademyUpgrade } from '../types';

export const ACADEMY_UPGRADES: AcademyUpgrade[] = [
  {
    id: 'deep_pockets',
    title: 'Cargo Pants Enchantment',
    description: 'Sew extra dimensional pockets into your trousers.',
    costStardust: 60,
    level: 0,
    maxLevel: 5,
    bonusPerLevel: '+4 Refined Essence pouch capacity',
  },
  {
    id: 'caffeine_drip',
    title: 'Arcane Espresso Machine',
    description: 'Keep a hot mug near the Transmuter workbench for frantic chiseling.',
    costStardust: 80,
    level: 0,
    maxLevel: 5,
    bonusPerLevel: '+15% Transmutation & Mining speed',
  },
  {
    id: 'barrier_reinforcement',
    title: 'Titanium Wards',
    description: 'Coat the lane barriers in enchanted celestial enamel.',
    costStardust: 100,
    level: 0,
    maxLevel: 5,
    bonusPerLevel: '+30 Max Barrier HP & +10% repair potency',
  },
  {
    id: 'golem_steroids',
    title: 'Rift Protein Shakes',
    description: 'Feed your summoned golems nutrient-dense cosmic paste.',
    costStardust: 120,
    level: 0,
    maxLevel: 5,
    bonusPerLevel: '+18% Minion HP and Attack Damage',
  },
  {
    id: 'vending_bribe',
    title: 'Vending Machine Grease',
    description: 'Kick the cosmic vending machine at just the right angle.',
    costStardust: 150,
    level: 0,
    maxLevel: 4,
    bonusPerLevel: '+15% chance to pull an extra tier rarity reward',
  },
];
