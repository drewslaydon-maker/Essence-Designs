import React from 'react';
import { PlayerProfile } from '../types';
import { ACADEMY_UPGRADES } from '../data/upgrades';
import { sound } from '../audio/soundEngine';
import { Sparkles, Award, ArrowUpCircle, Check } from 'lucide-react';

interface AcademyModalProps {
  profile: PlayerProfile;
  onUpgradePurchased: (upgradeId: string, cost: number) => void;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({
  profile,
  onUpgradePurchased,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">The Reluctant Apprentice Academy</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Department of Cutting Corners
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-lg">
            Spend accumulated Cosmic Stardust on permanent upgrades. The Headmaster doesn’t technically approve of these modifications, but results speak for themselves.
          </p>
        </div>

        {/* Stardust Balance */}
        <div className="flex items-center gap-2 bg-stone-950/80 px-4 py-2.5 rounded-xl border border-stone-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Cosmic Stardust</span>
            <span className="font-mono text-lg font-bold text-amber-300">{profile.stardust}</span>
          </div>
        </div>
      </div>

      {/* Upgrades List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACADEMY_UPGRADES.map((upgrade) => {
          const currentLvl = profile.upgrades[upgrade.id] || 0;
          const isMax = currentLvl >= upgrade.maxLevel;
          const cost = Math.floor(upgrade.costStardust * (1 + currentLvl * 0.45));
          const canAfford = profile.stardust >= cost && !isMax;

          return (
            <div
              key={upgrade.id}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-100 tracking-tight">{upgrade.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold block">
                      Rank {currentLvl} / {upgrade.maxLevel}
                    </span>
                  </div>

                  {/* Level Pips */}
                  <div className="flex gap-1">
                    {Array.from({ length: upgrade.maxLevel }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-sm border ${
                          idx < currentLvl
                            ? 'bg-amber-500 border-amber-400'
                            : 'bg-stone-950 border-stone-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-400">{upgrade.description}</p>
                <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80 text-xs">
                  <span className="text-stone-400">Bonus: </span>
                  <span className="text-emerald-400 font-semibold">{upgrade.bonusPerLevel}</span>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div className="text-xs">
                  {isMax ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Max Rank Achieved
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 text-stone-400">
                      <span>Cost: </span>
                      <span className={`font-mono font-bold ${canAfford ? 'text-amber-400' : 'text-stone-500'}`}>
                        {cost} Stardust
                      </span>
                    </div>
                  )}
                </div>

                {!isMax && (
                  <button
                    id={`upgrade-btn-${upgrade.id}`}
                    disabled={!canAfford}
                    onClick={() => {
                      sound.playChiselSfx();
                      onUpgradePurchased(upgrade.id, cost);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md shadow-amber-600/20'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                    }`}
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Research Perk</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
