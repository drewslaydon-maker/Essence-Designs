import React from 'react';
import { Gem, CavernTheme, CharacterProfile } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Award, Pickaxe, Flame, Home } from 'lucide-react';

interface ExpeditionSummaryModalProps {
  expeditionGems: Gem[];
  sector: number;
  shaftInSector: number; // 1, 2, or 3
  isShaftCleared: boolean;
  cavernTheme: CavernTheme;
  character: CharacterProfile;
  geodeCount: number;
  xpEarned: number;
  playerLevel: number;
  pendingPerkChoices: number;
  onNextShaft: () => void;
  onInspectVault: () => void;
  onOpenPerks: () => void;
  onBoardDigger?: () => void;
  onReturnToTown?: () => void;
}

export const ExpeditionSummaryModal: React.FC<ExpeditionSummaryModalProps> = ({
  expeditionGems,
  sector,
  shaftInSector,
  isShaftCleared,
  cavernTheme,
  character,
  geodeCount,
  xpEarned,
  playerLevel,
  pendingPerkChoices,
  onNextShaft,
  onInspectVault,
  onOpenPerks,
  onBoardDigger,
  onReturnToTown,
}) => {
  const hasGems = expeditionGems.length > 0;
  const isSectorFinalShaft = shaftInSector >= 3;

  return (
    <div
      id="summary-overlay"
      className="fixed inset-0 z-40 bg-stone-950/92 backdrop-blur-md flex flex-col items-center p-3 sm:p-6 text-center animate-in fade-in zoom-in-95 duration-200 overflow-y-auto"
    >
      <div className="max-w-md w-full bg-stone-900/95 border border-stone-800 p-4 sm:p-7 rounded-2xl shadow-2xl flex flex-col items-center gap-4 sm:gap-5 my-auto py-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            Depth {sector}-{shaftInSector} • {cavernTheme.name}
          </div>
          <h2
            id="summary-heading"
            className="text-2xl sm:text-3xl font-black tracking-wide text-amber-400 font-serif"
          >
            {isShaftCleared ? 'CAVERN SHAFT EXCAVATED!' : 'STAMINA DEPLETED'}
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            {isSectorFinalShaft
              ? `Shaft 3 completed! Crossroads choice ready ahead.`
              : `Proceeding deeper into ${cavernTheme.name} (Shaft ${shaftInSector + 1}/3).`}
          </p>
        </div>

        {/* Expedition Metrics Strip */}
        <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-500 block uppercase">XP Gained</span>
            <span className="text-amber-400 font-extrabold text-base">
              +{xpEarned}
            </span>
          </div>
          <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-500 block uppercase">Gems Found</span>
            <span className="text-emerald-400 font-extrabold text-base">
              {expeditionGems.length}
            </span>
          </div>
          <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-500 block uppercase">Prospector</span>
            <span className="text-amber-300 font-extrabold text-base">
              Lv {playerLevel}
            </span>
          </div>
        </div>

        {/* Recovered Gemstones Section */}
        <div className="w-full bg-stone-950/70 border border-stone-800/90 rounded-xl p-4 text-sm text-stone-300 space-y-3">
          {hasGems ? (
            <div className="space-y-2.5 text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-400 border-b border-stone-800/80 pb-2">
                <span className="uppercase tracking-wider">Recovered Specimens</span>
                <span className="text-amber-400 font-mono font-bold">
                  {expeditionGems.length} Gem{expeditionGems.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {expeditionGems.map((gem, index) => (
                  <div
                    key={`${gem.id}-${index}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-900/80 border border-stone-800/90"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{
                          backgroundColor: gem.color,
                          boxShadow: `0 0 10px ${gem.color}`,
                        }}
                      />
                      <span className="font-semibold text-stone-200 text-xs sm:text-sm">
                        {gem.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-400/90 px-2 py-0.5 rounded bg-stone-800">
                      +{gem.baseXp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2.5 text-center space-y-1">
              <p className="text-stone-300 font-medium">Only rock dust in this shaft.</p>
              <p className="text-xs text-stone-500">
                Chip stones to uncover mineral facets and save your strikes for precious veins.
              </p>
            </div>
          )}

          {geodeCount > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-800/70 text-xs text-amber-400/90 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cascaded {geodeCount} Echo Geode bonus strike{geodeCount > 1 ? 's' : ''}!</span>
            </div>
          )}
        </div>

        {/* Pending RPG Perk Choice Alert */}
        {pendingPerkChoices > 0 && (
          <div className="w-full bg-amber-500/10 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-bold">
                {pendingPerkChoices} Talent Choice{pendingPerkChoices > 1 ? 's' : ''} Ready!
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenPerks}
              className="text-[11px] font-bold uppercase font-mono px-2.5 py-1 rounded bg-amber-500 text-stone-950 cursor-pointer hover:bg-amber-400"
            >
              Choose Talent
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-2.5">
          <button
            id="next-shaft-btn"
            type="button"
            onClick={onNextShaft}
            className="w-full py-3.5 px-6 font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-98 transition-all rounded-xl shadow-[0_4px_16px_rgba(217,119,6,0.35)] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
          >
            {isSectorFinalShaft ? (
              <>
                <span>Approach Crossroads (Choose Next Cavern)</span>
                <Compass className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Delve Into Shaft {sector}-{shaftInSector + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="view-vault-btn"
              type="button"
              onClick={onInspectVault}
              className="py-2.5 px-3 font-semibold text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-750 active:scale-98 transition-all border border-stone-700 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Velvet Vault</span>
            </button>

            {onBoardDigger && (
              <button
                id="board-digger-btn"
                type="button"
                onClick={onBoardDigger}
                className="py-2.5 px-3 font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 active:scale-98 transition-all border border-amber-800/80 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>The Digger</span>
              </button>
            )}
          </div>

          {onReturnToTown && (
            <button
              id="summary-return-town-btn"
              type="button"
              onClick={onReturnToTown}
              className="py-2 px-3 font-mono text-stone-400 hover:text-stone-200 active:scale-98 transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <Home className="w-3.5 h-3.5 text-stone-500" />
              <span>Surface to Mountain Town</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
