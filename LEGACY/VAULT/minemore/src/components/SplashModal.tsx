import React from 'react';
import { Pickaxe, Sparkles, Gem, ShieldAlert } from 'lucide-react';

interface SplashModalProps {
  onStartGame: () => void;
}

export const SplashModal: React.FC<SplashModalProps> = ({ onStartGame }) => {
  return (
    <div
      id="splash-overlay"
      className="fixed inset-0 z-40 bg-stone-950/95 backdrop-blur-md flex flex-col items-center p-4 sm:p-6 text-center animate-in fade-in duration-300 overflow-y-auto"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-4 sm:gap-6 my-auto py-4">
        {/* Crest */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <Pickaxe className="w-10 h-10 text-amber-500 transform -rotate-12" />
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1
            id="splash-title"
            className="text-4xl sm:text-5xl font-black tracking-widest text-amber-500 font-serif drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            MINE MORE
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400/80 font-mono font-bold">
            Gem Prospector Expedition
          </p>
        </div>

        {/* Description & Prospecting Tips */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 text-stone-300 text-sm leading-relaxed space-y-3 shadow-inner">
          <p>
            Watch the cavern wall for <strong className="text-amber-300 font-semibold">subtle glints</strong>.
            Shatter stones, trigger cascading bonus strikes, and uncover rare gems for your velvet vault.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-stone-800 text-left">
            <div className="flex items-start gap-1.5 text-stone-400">
              <span className="text-stone-500">⛏️</span>
              <span><strong>Slag:</strong> Dull stone, no glint.</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-400/90">
              <Gem className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Gems:</strong> Colored gleam.</span>
            </div>
            <div className="flex items-start gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Geode:</strong> +2 bonus strikes!</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="start-btn"
          type="button"
          onClick={onStartGame}
          className="w-full sm:w-auto min-w-[240px] py-4 px-8 text-lg font-bold tracking-wider uppercase text-stone-950 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all duration-150 rounded-xl shadow-[0_4px_24px_rgba(217,119,6,0.45)] cursor-pointer"
        >
          Enter The Cavern
        </button>

        <p className="text-[11px] text-stone-500 font-mono">
          Audio synthesizer enabled • Tap or click stones to prospect
        </p>
      </div>
    </div>
  );
};
