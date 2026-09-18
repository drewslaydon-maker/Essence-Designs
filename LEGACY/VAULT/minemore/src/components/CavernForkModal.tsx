import React from 'react';
import { CavernTheme, Gem } from '../types';
import { GEM_CATALOG } from '../data/gems';
import { playAudio } from '../audio';
import { Compass, Sparkles, Flame, Droplets, Gem as GemIcon, ArrowRight, ShieldAlert } from 'lucide-react';

interface CavernForkModalProps {
  completedSector: number;
  cavernChoices: CavernTheme[];
  onSelectCavern: (theme: CavernTheme) => void;
}

const THEME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  magma: Flame,
  abyssal: Droplets,
  prismatic: Sparkles,
  verdant: GemIcon,
  granite: Compass,
};

export const CavernForkModal: React.FC<CavernForkModalProps> = ({
  completedSector,
  cavernChoices,
  onSelectCavern,
}) => {
  const handleSelect = (theme: CavernTheme) => {
    playAudio('perkSelect');
    onSelectCavern(theme);
  };

  return (
    <div
      id="cavern-fork-overlay"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="max-w-2xl w-full flex flex-col items-center gap-4 sm:gap-6 my-auto text-center py-4">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            Sector {completedSector} Subterranean Crossroads
          </div>
          <h2
            id="cavern-fork-heading"
            className="text-2xl sm:text-3xl font-black tracking-wide text-amber-400 font-serif"
          >
            CHOOSE YOUR EXPEDITION ROUTE
          </h2>
          <p className="text-xs text-stone-300 max-w-lg mx-auto font-mono">
            You stand at a subterranean fork. The bedrock splits into two distinct geological biomes, each holding unique minerals, atmospheric traits, and resonant soundscapes.
          </p>
        </div>

        {/* Cavern Choices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
          {cavernChoices.map((theme) => {
            const Icon = THEME_ICONS[theme.id] || Compass;
            const nativeGems = GEM_CATALOG.filter((g) => theme.uniqueGemIds.includes(g.id));

            return (
              <div
                key={theme.id}
                className="bg-stone-900/90 hover:bg-stone-850 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-xl group hover:border-amber-500/60"
                style={{
                  boxShadow: `0 8px 30px ${theme.accentColor}10`,
                }}
              >
                <div className="space-y-3">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: theme.accentColor,
                        borderColor: `${theme.accentColor}50`,
                        backgroundColor: `${theme.accentColor}15`,
                      }}
                    >
                      {theme.strataName}
                    </span>
                    <div
                      className="p-2 rounded-lg border"
                      style={{
                        backgroundColor: `${theme.accentColor}15`,
                        borderColor: `${theme.accentColor}40`,
                        color: theme.accentColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {theme.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Environmental Trait Modifier */}
                  <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/90 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px] uppercase">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>{theme.modifierName}</span>
                    </div>
                    <p className="text-stone-300 text-[11px] leading-snug">
                      {theme.modifierDescription}
                    </p>
                  </div>

                  {/* Native Specimens */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block font-semibold">
                      Native Cavern Minerals:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {nativeGems.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800 text-[11px]"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: g.color,
                              boxShadow: `0 0 6px ${g.color}`,
                            }}
                          />
                          <span className="text-stone-200 font-medium text-[11px]">
                            {g.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Descend Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(theme)}
                  className="w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                >
                  <span>Descend Into {theme.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
