import React, { useMemo } from 'react';
import { MinerPerk } from '../types';
import { MINER_PERKS } from '../data/gems';
import { playAudio } from '../audio';
import {
  Award,
  Hammer,
  Shield,
  RefreshCw,
  Sparkles,
  Zap,
  Gem,
  Radio,
  Eye,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface LevelUpModalProps {
  playerLevel: number;
  rankTitle: string;
  selectedPerkIds: string[];
  onSelectPerk: (perkId: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer,
  Shield,
  RefreshCw,
  Sparkles,
  Zap,
  Gem,
  Radio,
  Eye,
  Search,
};

const BRANCH_COLORS: Record<MinerPerk['branch'], { text: string; bg: string; border: string }> = {
  Striking: { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40' },
  Stamina: { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40' },
  Fortune: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40' },
  Resonance: { text: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/40' },
  Alchemy: { text: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/40' },
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  playerLevel,
  rankTitle,
  selectedPerkIds,
  onSelectPerk,
}) => {
  // Offer 3 random perks that the player hasn't picked yet (or available repeats if pool exhausted)
  const offeredPerks = useMemo(() => {
    const unselected = MINER_PERKS.filter((p) => !selectedPerkIds.includes(p.id));
    const pool = unselected.length >= 3 ? unselected : MINER_PERKS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [selectedPerkIds]);

  const handlePick = (perk: MinerPerk) => {
    playAudio('perkSelect');
    onSelectPerk(perk.id);
  };

  return (
    <div
      id="level-up-overlay"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="max-w-xl w-full flex flex-col items-center gap-4 sm:gap-6 my-auto text-center py-4">
        {/* Level Up Banner */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            <Award className="w-4 h-4 text-amber-400" />
            LEVEL UP! PROSPECTOR RANK {playerLevel}
          </div>
          <h2
            id="level-up-heading"
            className="text-3xl sm:text-4xl font-black tracking-wide text-amber-400 font-serif"
          >
            CUSTOMIZE YOUR MINER
          </h2>
          <p className="text-xs text-stone-300 font-mono">
            Rank Achieved: <span className="text-amber-300 font-bold uppercase">{rankTitle}</span>
          </p>
          <p className="text-xs text-stone-400 max-w-md mx-auto pt-1">
            Choose a permanent RPG talent to forge your prospector build. Every level deepens your mining prowess.
          </p>
        </div>

        {/* 3 Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {offeredPerks.map((perk) => {
            const Icon = ICON_MAP[perk.iconName] || Sparkles;
            const branchStyle = BRANCH_COLORS[perk.branch] || BRANCH_COLORS.Striking;

            return (
              <div
                key={perk.id}
                className="bg-stone-900/90 hover:bg-stone-850/95 border border-stone-800 hover:border-amber-500/60 p-4 rounded-xl flex flex-col justify-between items-center text-center gap-3 transition-all duration-200 shadow-xl group hover:scale-102"
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  {/* Branch Tag */}
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${branchStyle.bg} ${branchStyle.border} ${branchStyle.text}`}
                  >
                    {perk.branch}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 group-hover:border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner transition-colors">
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {perk.name}
                  </h4>
                  <p className="text-xs text-stone-400 leading-snug">
                    {perk.description}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  onClick={() => handlePick(perk)}
                  className="w-full py-2.5 px-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md mt-1"
                >
                  Select Perk
                </button>
              </div>
            );
          })}
        </div>

        {/* Existing Active Perks Tray */}
        {selectedPerkIds.length > 0 && (
          <div className="w-full bg-stone-900/50 border border-stone-800/80 rounded-xl p-3 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Currently Active Talents ({selectedPerkIds.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedPerkIds.map((id) => {
                const perk = MINER_PERKS.find((p) => p.id === id);
                if (!perk) return null;
                return (
                  <span
                    key={id}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-stone-800/80 border border-stone-700 text-stone-300"
                  >
                    ★ {perk.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
