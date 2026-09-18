import React, { useState } from 'react';
import { PlayerProfile, EquipmentItem, ItemRarity } from '../types';
import { VENDING_MACHINE_LOOT_POOL } from '../data/items';
import { MINION_BLUEPRINTS } from '../data/minions';
import { ItemIcon } from './ItemIcon';
import { sound } from '../audio/soundEngine';
import { Sparkles, RefreshCw, CheckCircle2, Award, Zap } from 'lucide-react';

interface VendingMachineProps {
  profile: PlayerProfile;
  onRewardAwarded: (reward: {
    item?: EquipmentItem;
    blueprintId?: string;
    stardustBonus?: number;
  }) => void;
  onEquipItem: (item: EquipmentItem) => void;
}

export const VendingMachine: React.FC<VendingMachineProps> = ({
  profile,
  onRewardAwarded,
  onEquipItem,
}) => {
  const [isCranking, setIsCranking] = useState<boolean>(false);
  const [lastWonItem, setLastWonItem] = useState<EquipmentItem | null>(null);
  const [lastWonBlueprint, setLastWonBlueprint] = useState<string | null>(null);
  const [lastWonStardust, setLastWonStardust] = useState<number | null>(null);
  const [recentPulls, setRecentPulls] = useState<string[]>([]);

  const canPull = profile.elementalTokens >= 1 && profile.catalyticTokens >= 1;

  const handlePullCrank = () => {
    if (!canPull || isCranking) return;

    setIsCranking(true);
    setLastWonItem(null);
    setLastWonBlueprint(null);
    setLastWonStardust(null);

    sound.playVendingCrankSfx();

    setTimeout(() => {
      // Determine reward:
      // 1. Check if there are locked blueprints
      const lockedBlueprints = MINION_BLUEPRINTS.filter(
        (b) => !profile.unlockedBlueprints.includes(b.id)
      );

      // Upgrade bonus
      const vendingBribeLvl = profile.upgrades['vending_bribe'] || 0;
      const rareBonus = vendingBribeLvl * 0.15;

      const roll = Math.random();

      // 20% chance to unlock a blueprint if any are locked
      if (lockedBlueprints.length > 0 && roll < 0.22) {
        const bp = lockedBlueprints[Math.floor(Math.random() * lockedBlueprints.length)];
        setLastWonBlueprint(bp.name);
        onRewardAwarded({ blueprintId: bp.id });
        setRecentPulls((prev) => [`Blueprint: ${bp.name}`, ...prev.slice(0, 4)]);
        sound.playWinFanfare();
      } else if (roll < 0.85) {
        // Roll an equipment piece from pool
        // Filter out items already owned if possible, or give duplicate value
        const unownedPool = VENDING_MACHINE_LOOT_POOL.filter(
          (item) => !profile.inventory.some((i) => i.id === item.id) &&
                    !(Object.values(profile.equipped) as (EquipmentItem | null)[]).some((e) => e?.id === item.id)
        );

        let chosenItem: EquipmentItem;
        if (unownedPool.length > 0) {
          // Weight by rarity + upgrade bonus
          const rarityRoll = Math.random() + rareBonus;
          let pool = unownedPool;
          if (rarityRoll > 0.8) {
            const highTier = unownedPool.filter((i) => i.rarity === 'epic' || i.rarity === 'mythic');
            if (highTier.length > 0) pool = highTier;
          }
          chosenItem = pool[Math.floor(Math.random() * pool.length)];
        } else {
          chosenItem = VENDING_MACHINE_LOOT_POOL[Math.floor(Math.random() * VENDING_MACHINE_LOOT_POOL.length)];
        }

        setLastWonItem(chosenItem);
        onRewardAwarded({ item: chosenItem });
        setRecentPulls((prev) => [`Relic: ${chosenItem.name}`, ...prev.slice(0, 4)]);
        sound.playPortalSfx();
      } else {
        // Stardust Jackpot
        const dustAmount = Math.floor(60 + Math.random() * 80);
        setLastWonStardust(dustAmount);
        onRewardAwarded({ stardustBonus: dustAmount });
        setRecentPulls((prev) => [`+${dustAmount} Cosmic Stardust`, ...prev.slice(0, 4)]);
        sound.playBarrierSfx();
      }

      setIsCranking(false);
    }, 1200);
  };

  const totalRelicsInGame = VENDING_MACHINE_LOOT_POOL.length;
  const relicsOwnedCount = VENDING_MACHINE_LOOT_POOL.filter(
    (item) => profile.inventory.some((i) => i.id === item.id) ||
              (Object.values(profile.equipped) as (EquipmentItem | null)[]).some((e) => e?.id === item.id)
  ).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">Ancient Arcane Vending Machine</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Crank of Destiny
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-lg">
            Feed in 1 Elemental Token and 1 Catalytic Token to rotate the brass gears and dispense oddities, absurd robes, and forgotten minion blueprints.
          </p>
        </div>

        {/* Currency summary */}
        <div className="flex items-center gap-3 bg-stone-950/80 px-4 py-2.5 rounded-xl border border-stone-800">
          <div className="text-center">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">Elemental</span>
            <span className="font-mono text-base font-bold text-cyan-300">{profile.elementalTokens}</span>
          </div>
          <span className="text-stone-600 font-bold">+</span>
          <div className="text-center">
            <span className="text-[10px] text-purple-400 uppercase font-semibold block">Catalytic</span>
            <span className="font-mono text-base font-bold text-purple-300">{profile.catalyticTokens}</span>
          </div>
        </div>
      </div>

      {/* Main Machine Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Machine Display (7 cols) */}
        <div className="md:col-span-7 bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Subtle cosmic glow in background */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Machine Glass Globe */}
          <div className="w-56 h-56 rounded-full border-4 border-amber-600/40 bg-stone-950/80 shadow-2xl shadow-amber-500/10 flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-amber-950/20 to-purple-950/30" />
            
            {/* Swirling orbs inside the machine */}
            <div className={`relative w-full h-full flex items-center justify-center ${isCranking ? 'animate-spin' : ''}`} style={{ animationDuration: '0.8s' }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-400/50 absolute top-4 left-6" />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-400/50 absolute bottom-6 right-8" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 shadow-md shadow-purple-400/50 absolute top-12 right-6" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md shadow-emerald-400/50 absolute bottom-8 left-10" />
            </div>

            {/* Brass Ring Accents */}
            <div className="absolute bottom-2 inset-x-8 h-3 rounded-full bg-amber-700/60 border border-amber-500/40" />
          </div>

          {/* Crank Lever Section */}
          <div className="text-center space-y-3 w-full max-w-xs">
            <button
              id="vending-crank-btn"
              disabled={!canPull || isCranking}
              onClick={handlePullCrank}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition active:scale-95 ${
                canPull && !isCranking
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 hover:brightness-110 shadow-amber-600/30'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
              }`}
            >
              {isCranking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Cranking Ancient Gears...</span>
                </>
              ) : canPull ? (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
                  <span>Pull Lever (Cost: 1 Elem + 1 Cata)</span>
                </>
              ) : (
                <span>Need 1 Elem & 1 Cata Token</span>
              )}
            </button>

            <p className="text-[11px] text-stone-500">
              Matches won balance reward points 1:1. Seal rifts to earn tokens!
            </p>
          </div>

          {/* Last Won Item Presentation */}
          {(lastWonItem || lastWonBlueprint || lastWonStardust) && (
            <div className="w-full p-4 rounded-xl bg-stone-900 border border-amber-500/40 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                Item Dispensed!
              </span>

              {lastWonItem && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-stone-950 border border-amber-500/30 text-amber-300">
                      <ItemIcon name={lastWonItem.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-100">{lastWonItem.name}</h4>
                      <p className="text-xs text-amber-300/80 italic">{lastWonItem.flavorText}</p>
                    </div>
                  </div>
                  <button
                    id="vending-quick-equip-btn"
                    onClick={() => {
                      sound.playChiselSfx();
                      onEquipItem(lastWonItem);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition shadow-sm whitespace-nowrap"
                  >
                    Equip Now
                  </button>
                </div>
              )}

              {lastWonBlueprint && (
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Award className="w-5 h-5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">Unlocked: {lastWonBlueprint}</h4>
                    <p className="text-xs text-stone-400">New minion blueprint now available in the Minion Foundry!</p>
                  </div>
                </div>
              )}

              {lastWonStardust && (
                <div className="flex items-center gap-2.5 text-amber-300">
                  <Sparkles className="w-5 h-5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">+{lastWonStardust} Cosmic Stardust</h4>
                    <p className="text-xs text-stone-400">Spent in the Apprentice Academy for permanent perks.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collection Log & Recent Pulls (5 cols) */}
        <div className="md:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Rift Collection Log</span>
              </h3>
              <p className="text-xs text-stone-500">
                Relics cataloged: <span className="text-amber-400 font-bold">{relicsOwnedCount}</span> / {totalRelicsInGame}
              </p>
            </div>

            {/* Collection Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(relicsOwnedCount / totalRelicsInGame) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>Novice Hoarder</span>
                <span>Master of Arcane Oddities</span>
              </div>
            </div>

            {/* Minion Blueprint Status */}
            <div className="space-y-2 pt-2 border-t border-stone-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Summon Blueprints</h4>
              <div className="space-y-1.5 text-xs">
                {MINION_BLUEPRINTS.map((bp) => {
                  const unlocked = profile.unlockedBlueprints.includes(bp.id);
                  return (
                    <div
                      key={bp.id}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        unlocked
                          ? 'bg-stone-950/60 border-stone-800 text-stone-300'
                          : 'bg-stone-950/20 border-dashed border-stone-800/60 text-stone-600'
                      }`}
                    >
                      <span className="font-medium">{bp.name}</span>
                      {unlocked ? (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-600">In Vending Pool</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Pull History */}
          {recentPulls.length > 0 && (
            <div className="pt-3 border-t border-stone-800/80 space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Recent Drops</h4>
              <div className="space-y-1 text-xs font-mono">
                {recentPulls.map((p, idx) => (
                  <div key={idx} className="text-stone-400 text-[11px] truncate flex items-center gap-1.5">
                    <span className="text-amber-500">•</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
