/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, EquipmentItem, EquipmentSlot } from './types';
import { STARTER_ITEMS } from './data/items';
import { Header } from './components/Header';
import { RiftChamber } from './components/RiftChamber';
import { ArmoryModal } from './components/ArmoryModal';
import { VendingMachine } from './components/VendingMachine';
import { AcademyModal } from './components/AcademyModal';
import { PostMatchModal } from './components/PostMatchModal';
import { sound } from './audio/soundEngine';
import { 
  Play, 
  Shield, 
  Sparkles, 
  Award, 
  Hammer, 
  ShoppingBag, 
  BookOpen, 
  Flame, 
  Zap, 
  ChevronRight 
} from 'lucide-react';

const STORAGE_KEY = 'gotr_apprentice_save_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Apprentice Zephyr',
  title: 'Novice Rift Sweeper',
  stardust: 120,
  elementalTokens: 2,
  catalyticTokens: 2,
  matchesPlayed: 0,
  matchesWon: 0,
  riftsSealed: 0,
  equipped: {
    head: STARTER_ITEMS[0],
    body: STARTER_ITEMS[1],
    tool: STARTER_ITEMS[2],
    offhand: STARTER_ITEMS[3],
    pet: STARTER_ITEMS[4],
  },
  inventory: [],
  unlockedBlueprints: ['starter_rock_sentinel', 'the_bouncer'],
  upgrades: {},
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'chamber' | 'armory' | 'vending' | 'academy'>('chamber');
  const [isMatchActive, setIsMatchActive] = useState<boolean>(false);

  // Post-match debrief state
  const [matchResult, setMatchResult] = useState<{
    isVictory: boolean;
    elementalPoints: number;
    catalyticPoints: number;
    elementalTokensEarned: number;
    catalyticTokensEarned: number;
    stardustEarned: number;
    monstersDefeated: number;
    greatGuardianCharge: number;
  } | null>(null);

  // Save profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Handlers for Armory
  const handleEquipItem = (item: EquipmentItem) => {
    setProfile((prev) => {
      const currentEquipped = prev.equipped[item.slot];
      const newInventory = prev.inventory.filter((i) => i.id !== item.id);
      if (currentEquipped) {
        newInventory.push(currentEquipped);
      }

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [item.slot]: item,
        },
        inventory: newInventory,
      };
    });
  };

  const handleUnequipSlot = (slot: EquipmentSlot) => {
    setProfile((prev) => {
      const item = prev.equipped[slot];
      if (!item) return prev;

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [slot]: null,
        },
        inventory: [...prev.inventory, item],
      };
    });
  };

  // Handlers for Vending Machine Rewards
  const handleRewardAwarded = (reward: {
    item?: EquipmentItem;
    blueprintId?: string;
    stardustBonus?: number;
  }) => {
    setProfile((prev) => {
      const next = { ...prev };

      // Deduct 1 elemental & 1 catalytic token per pull
      next.elementalTokens = Math.max(0, next.elementalTokens - 1);
      next.catalyticTokens = Math.max(0, next.catalyticTokens - 1);

      if (reward.item) {
        next.inventory = [reward.item, ...next.inventory];
      }

      if (reward.blueprintId && !next.unlockedBlueprints.includes(reward.blueprintId)) {
        next.unlockedBlueprints = [...next.unlockedBlueprints, reward.blueprintId];
      }

      if (reward.stardustBonus) {
        next.stardust += reward.stardustBonus;
      }

      return next;
    });
  };

  // Handlers for Academy Upgrades
  const handleUpgradePurchased = (upgradeId: string, cost: number) => {
    setProfile((prev) => {
      if (prev.stardust < cost) return prev;

      const currentLvl = prev.upgrades[upgradeId] || 0;
      return {
        ...prev,
        stardust: prev.stardust - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: currentLvl + 1,
        },
      };
    });
  };

  // Match Complete
  const handleMatchComplete = (result: {
    isVictory: boolean;
    elementalPoints: number;
    catalyticPoints: number;
    elementalTokensEarned: number;
    catalyticTokensEarned: number;
    stardustEarned: number;
    monstersDefeated: number;
    greatGuardianCharge: number;
  }) => {
    setIsMatchActive(false);
    setMatchResult(result);

    setProfile((prev) => {
      const won = result.isVictory;
      return {
        ...prev,
        matchesPlayed: prev.matchesPlayed + 1,
        matchesWon: won ? prev.matchesWon + 1 : prev.matchesWon,
        riftsSealed: won ? prev.riftsSealed + 1 : prev.riftsSealed,
        elementalTokens: prev.elementalTokens + result.elementalTokensEarned,
        catalyticTokens: prev.catalyticTokens + result.catalyticTokensEarned,
        stardust: prev.stardust + result.stardustEarned,
      };
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Universal Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGameActive={isMatchActive}
      />

      {/* Main Tab Routing */}
      <main className="flex-1 pb-12">
        {activeTab === 'chamber' && (
          <>
            {isMatchActive ? (
              <RiftChamber
                profile={profile}
                onMatchComplete={handleMatchComplete}
                onExitToHub={() => setIsMatchActive(false)}
              />
            ) : (
              /* Pre-Match Chamber Briefing / Launch Station */
              <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-indigo-950/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="max-w-xl space-y-3 relative z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                      Guardians of the Rift Minigame
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
                      Ready to Defend the Great Guardian?
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      Mine fragments from the quarry, chisel them into refined essence, wait for rotating elemental & catalytic altar portals, and craft runes to charge barrier shields and deploy autonomous defender minions before the abyssal horde breaks through.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        id="start-match-btn"
                        onClick={() => {
                          sound.playPortalSfx();
                          setIsMatchActive(true);
                        }}
                        className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-amber-600/30 flex items-center gap-2 transition active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-stone-950" />
                        <span>Enter the Rift Chamber (Start Run)</span>
                      </button>

                      <button
                        id="hub-inspect-armory-btn"
                        onClick={() => setActiveTab('armory')}
                        className="px-4 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition border border-stone-700 flex items-center gap-1.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Check Equipment</span>
                      </button>
                    </div>
                  </div>

                  {/* Decorative arcane rune emblem in background */}
                  <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-amber-500/10 bg-amber-500/5 flex items-center justify-center pointer-events-none">
                    <div className="w-60 h-60 rounded-full border border-indigo-500/15" />
                  </div>
                </div>

                {/* Quick 3-Step Strategy Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-xs border border-amber-500/30">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-stone-200">Mine & Chisel</h3>
                    <p className="text-xs text-stone-400">
                      Extract guardian fragments from the quarry and chisel them into refined essence. Keep an eye out for random Huge Essence Portals!
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/30">
                      2
                    </div>
                    <h3 className="text-sm font-bold text-stone-200">Altar Rotations & Cells</h3>
                    <p className="text-xs text-stone-400">
                      Altars rotate dynamically. Crafting runes generates Power Cells that you can socket into West, North, or East barrier pylons.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-xs border border-purple-500/30">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-stone-200">Minions & Infusion</h3>
                    <p className="text-xs text-stone-400">
                      Deploy quirky minions at the Foundry to intercept void creeps, and infuse excess runes directly to push the Great Guardian to 100%!
                    </p>
                  </div>
                </div>

                {/* Career Record Card */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-stone-500 uppercase font-semibold text-[10px] block">Matches Played</span>
                      <span className="font-mono text-base font-bold text-stone-200">{profile.matchesPlayed}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase font-semibold text-[10px] block">Rifts Sealed</span>
                      <span className="font-mono text-base font-bold text-emerald-400">{profile.riftsSealed}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase font-semibold text-[10px] block">Win Rate</span>
                      <span className="font-mono text-base font-bold text-amber-300">
                        {profile.matchesPlayed > 0
                          ? Math.round((profile.matchesWon / profile.matchesPlayed) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('vending')}
                      className="text-stone-400 hover:text-amber-300 transition flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Vending Machine ({profile.elementalTokens + profile.catalyticTokens} Tokens)</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'armory' && (
          <ArmoryModal
            profile={profile}
            onEquipItem={handleEquipItem}
            onUnequipSlot={handleUnequipSlot}
            onStartGame={() => {
              setActiveTab('chamber');
              setIsMatchActive(true);
            }}
          />
        )}

        {activeTab === 'vending' && (
          <VendingMachine
            profile={profile}
            onRewardAwarded={handleRewardAwarded}
            onEquipItem={(item) => {
              handleEquipItem(item);
              setActiveTab('armory');
            }}
          />
        )}

        {activeTab === 'academy' && (
          <AcademyModal
            profile={profile}
            onUpgradePurchased={handleUpgradePurchased}
          />
        )}
      </main>

      {/* Post-Match Debrief Dialog */}
      {matchResult && (
        <PostMatchModal
          isVictory={matchResult.isVictory}
          elementalPoints={matchResult.elementalPoints}
          catalyticPoints={matchResult.catalyticPoints}
          elementalTokensEarned={matchResult.elementalTokensEarned}
          catalyticTokensEarned={matchResult.catalyticTokensEarned}
          stardustEarned={matchResult.stardustEarned}
          monstersDefeated={matchResult.monstersDefeated}
          greatGuardianCharge={matchResult.greatGuardianCharge}
          onPlayAgain={() => {
            setMatchResult(null);
            setActiveTab('chamber');
            setIsMatchActive(true);
          }}
          onGoToVending={() => {
            setMatchResult(null);
            setActiveTab('vending');
          }}
        />
      )}
    </div>
  );
}
