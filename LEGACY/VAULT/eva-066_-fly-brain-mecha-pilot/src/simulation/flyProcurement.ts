/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PilotId, PaintjobId, VisorStyleId, MechaCustomization } from '../types';
import { PILOT_ROSTER, PAINTJOB_CATALOG, VISOR_CATALOG, UPGRADE_CATALOG } from './pilotData';

export interface FlyDeliberationResult {
  purchased: boolean;
  itemType?: 'UPGRADE' | 'PAINTJOB' | 'VISOR';
  itemId?: string;
  itemName?: string;
  cost: number;
  quote: string;
  rationale: string;
  pilotId: PilotId;
  pilotName: string;
  savingsGoal?: {
    name: string;
    cost: number;
    current: number;
    needed: number;
  };
}

export interface FlyPurchasePersonality {
  pilotId: PilotId;
  name: string;
  preferredPaintjob: PaintjobId;
  preferredVisor: VisorStyleId;
  upgradePriority: Array<keyof MechaCustomization['upgrades']>;
  quotes: {
    boughtUpgrade: (name: string, tier: number) => string;
    boughtPaint: (name: string) => string;
    boughtVisor: (name: string) => string;
    savingUp: (item: string, needed: number) => string;
    allMaxed: string;
    humanRefusal: string;
  };
}

export const FLY_PERSONALITIES: Record<PilotId, FlyPurchasePersonality> = {
  SHIN_FLY: {
    pilotId: 'SHIN_FLY',
    name: 'Shin-fly Ikari',
    preferredPaintjob: 'TEST_TYPE_01',
    preferredVisor: 'COMPOUND_HEX',
    upgradePriority: ['giantFiberLevel', 'octopamineLevel', 'ommatidiaLevel', 'needleLevel'],
    quotes: {
      boughtUpgrade: (name, tier) =>
        `"I... I calibrated ${name} to Tier ${tier}! With thicker Giant Fiber axons, maybe I can jump away before the Angel swats me..."`,
      boughtPaint: (name) =>
        `"Equipped ${name}. It's the standard Unit-01 test livery... Father said I didn't need anything flashy."`,
      boughtVisor: (name) =>
        `"Mounted ${name}. All 750 ommatidia are focused on the horizon..."`,
      savingUp: (item, needed) =>
        `"I need ${needed} more Synchro Points for ${item}. I must not fly away... I have to earn points in combat first."`,
      allMaxed:
        `"My connectome is completely calibrated... Is this what Father wanted from EVA-01?"`,
      humanRefusal:
        `"Please don't touch the requisition buttons, Lilin! Commander Gendo said only the fly specimen's survival instincts may determine our equipment!"`,
    },
  },
  ASU_MAG: {
    pilotId: 'ASU_MAG',
    name: 'Asu-mag Langley',
    preferredPaintjob: 'PRODUCTION_02',
    preferredVisor: 'BERSERK_RED',
    upgradePriority: ['needleLevel', 'ommatidiaLevel', 'octopamineLevel', 'giantFiberLevel'],
    quotes: {
      boughtUpgrade: (name, tier) =>
        `"ANTA BAKA?! Obviously we needed ${name} at Tier ${tier}! Now my ultrasonic needle will pulverize Sachiel's core in two seconds flat!"`,
      boughtPaint: (name) =>
        `"HAH! Equipped ${name}! Look at this glorious Vermillion Red Chitin! You think I'd be caught dead in that Third Children's purple bucket?!"`,
      boughtVisor: (name) =>
        `"Crimson Predator Visor online! Every Angel weakness is highlighted in glaring target red!"`,
      savingUp: (item, needed) =>
        `"Hey, Lilin operator! I'm ${needed} points short of ${item}! Get back into the battle cockpit and earn me some merits, pronto!"`,
      allMaxed:
        `"EVA-02 is the ultimate peak of Drosophila combat technology! Nobody can swat me now!"`,
      humanRefusal:
        `"ANTA BAKA?! Did you think a mere human on the site gets to pick my cosmetics?! I am the elite Second Children—I choose the Vermillion Chitin and Max Needle!"`,
    },
  },
  REI_VA: {
    pilotId: 'REI_VA',
    name: 'Rei-va Ayanami',
    preferredPaintjob: 'PROTOTYPE_00',
    preferredVisor: 'CYAN_OPTIC',
    upgradePriority: ['ommatidiaLevel', 'giantFiberLevel', 'needleLevel', 'octopamineLevel'],
    quotes: {
      boughtUpgrade: (name, tier) =>
        `"${name} elevated to Tier ${tier}. Compound facet resolution now permits early detection of spatial A.T. Field distortion."`,
      boughtPaint: (name) =>
        `"${name} ceramic coating applied. Aesthetics are irrelevant, but thermal dissipation is optimal."`,
      boughtVisor: (name) =>
        `"Mounted ${name}. Elementary motion detectors T4 and T5 are synchronized with the Central Complex compass."`,
      savingUp: (item, needed) =>
        `"Calibrating towards ${item}. ${needed} synchro merits required. I will fulfill my duty regardless."`,
      allMaxed:
        `"All biological synaptic parameters are saturated. I am ready for the Third Swat."`,
      humanRefusal:
        `"Human operator intervention is unnecessary. The Drosophila connectome has determined the optimal configuration according to MAGI-Casper."`,
    },
  },
};

/**
 * Autonomously evaluates what the active Fly Pilot wants to buy based on:
 * - Current Synchro Credits
 * - Fly personality and priority queue
 * - Returns updated MechaCustomization and deliberation dialogue
 */
export function deliberateFlyProcurement(
  customization: MechaCustomization,
  credits: number,
  purchasedPaintjobs: PaintjobId[] = ['TEST_TYPE_01'],
  purchasedVisors: VisorStyleId[] = ['COMPOUND_HEX']
): {
  newCustomization: MechaCustomization;
  newCredits: number;
  newPurchasedPaintjobs: PaintjobId[];
  newPurchasedVisors: VisorStyleId[];
  result: FlyDeliberationResult;
} {
  const personality = FLY_PERSONALITIES[customization.activePilotId] || FLY_PERSONALITIES.SHIN_FLY;
  const pilot = PILOT_ROSTER[customization.activePilotId];

  const currentPurchasedPaintjobs = [...purchasedPaintjobs];
  const currentPurchasedVisors = [...purchasedVisors];

  // 1. Check if the fly wants their signature paintjob
  const wantedPaint = personality.preferredPaintjob;
  const paintConfig = PAINTJOB_CATALOG[wantedPaint];
  const ownsPaint = currentPurchasedPaintjobs.includes(wantedPaint) || paintConfig.cost === 0;

  if (!ownsPaint && credits >= paintConfig.cost) {
    const newCredits = credits - paintConfig.cost;
    const newPurchased = [...currentPurchasedPaintjobs, wantedPaint];
    const newCust: MechaCustomization = {
      ...customization,
      paintjob: wantedPaint,
      synchroCredits: newCredits,
    };
    return {
      newCustomization: newCust,
      newCredits,
      newPurchasedPaintjobs: newPurchased,
      newPurchasedVisors: currentPurchasedVisors,
      result: {
        purchased: true,
        itemType: 'PAINTJOB',
        itemId: wantedPaint,
        itemName: paintConfig.name,
        cost: paintConfig.cost,
        quote: personality.quotes.boughtPaint(paintConfig.name),
        rationale: `Signature chitin aesthetic aligned with ${pilot.callsign}`,
        pilotId: customization.activePilotId,
        pilotName: personality.name,
      },
    };
  }

  // 2. Check if the fly wants their signature visor
  const wantedVisor = personality.preferredVisor;
  const visorConfig = VISOR_CATALOG[wantedVisor];
  const ownsVisor = currentPurchasedVisors.includes(wantedVisor) || visorConfig.cost === 0;

  if (!ownsVisor && credits >= visorConfig.cost) {
    const newCredits = credits - visorConfig.cost;
    const newPurchased = [...currentPurchasedVisors, wantedVisor];
    const newCust: MechaCustomization = {
      ...customization,
      visorStyle: wantedVisor,
      synchroCredits: newCredits,
    };
    return {
      newCustomization: newCust,
      newCredits,
      newPurchasedPaintjobs: currentPurchasedPaintjobs,
      newPurchasedVisors: newPurchased,
      result: {
        purchased: true,
        itemType: 'VISOR',
        itemId: wantedVisor,
        itemName: visorConfig.name,
        cost: visorConfig.cost,
        quote: personality.quotes.boughtVisor(visorConfig.name),
        rationale: `Optic interface calibrated for ${pilot.bioArchetype}`,
        pilotId: customization.activePilotId,
        pilotName: personality.name,
      },
    };
  }

  // 3. Check bio-neural upgrades in priority order
  for (const upgradeKey of personality.upgradePriority) {
    const currentTier = customization.upgrades[upgradeKey];
    if (currentTier < 3) {
      let catalog = UPGRADE_CATALOG.ommatidia;
      if (upgradeKey === 'giantFiberLevel') catalog = UPGRADE_CATALOG.giantFiber;
      if (upgradeKey === 'octopamineLevel') catalog = UPGRADE_CATALOG.octopamine;
      if (upgradeKey === 'needleLevel') catalog = UPGRADE_CATALOG.needle;

      const nextTier = catalog.tiers[currentTier + 1];
      if (credits >= nextTier.cost) {
        const newCredits = credits - nextTier.cost;
        const newCust: MechaCustomization = {
          ...customization,
          upgrades: {
            ...customization.upgrades,
            [upgradeKey]: currentTier + 1,
          },
          synchroCredits: newCredits,
        };

        return {
          newCustomization: newCust,
          newCredits,
          newPurchasedPaintjobs: currentPurchasedPaintjobs,
          newPurchasedVisors: currentPurchasedVisors,
          result: {
            purchased: true,
            itemType: 'UPGRADE',
            itemId: upgradeKey,
            itemName: `${catalog.title} (${nextTier.name})`,
            cost: nextTier.cost,
            quote: personality.quotes.boughtUpgrade(catalog.title, currentTier + 1),
            rationale: `Priority upgrade: ${nextTier.boostDescription}`,
            pilotId: customization.activePilotId,
            pilotName: personality.name,
          },
        };
      }
    }
  }

  // 4. If couldn't afford top desire, find what the fly is saving for
  let savingItemName = 'Next Upgrade';
  let savingItemCost = 500;

  if (!ownsPaint && credits < paintConfig.cost) {
    savingItemName = paintConfig.name;
    savingItemCost = paintConfig.cost;
  } else if (!ownsVisor && credits < visorConfig.cost) {
    savingItemName = visorConfig.name;
    savingItemCost = visorConfig.cost;
  } else {
    for (const upgradeKey of personality.upgradePriority) {
      const currentTier = customization.upgrades[upgradeKey];
      if (currentTier < 3) {
        let catalog = UPGRADE_CATALOG.ommatidia;
        if (upgradeKey === 'giantFiberLevel') catalog = UPGRADE_CATALOG.giantFiber;
        if (upgradeKey === 'octopamineLevel') catalog = UPGRADE_CATALOG.octopamine;
        if (upgradeKey === 'needleLevel') catalog = UPGRADE_CATALOG.needle;
        savingItemName = `${catalog.title} (Tier ${currentTier + 1})`;
        savingItemCost = catalog.tiers[currentTier + 1].cost;
        break;
      }
    }
  }

  const needed = Math.max(0, savingItemCost - credits);

  return {
    newCustomization: customization,
    newCredits: credits,
    newPurchasedPaintjobs: currentPurchasedPaintjobs,
    newPurchasedVisors: currentPurchasedVisors,
    result: {
      purchased: false,
      cost: 0,
      quote: personality.quotes.savingUp(savingItemName, needed),
      rationale: `Conserving synchro credits for ${savingItemName}`,
      pilotId: customization.activePilotId,
      pilotName: personality.name,
      savingsGoal: {
        name: savingItemName,
        cost: savingItemCost,
        current: credits,
        needed,
      },
    },
  };
}
