import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { StageDefinition } from '../../types/ballBreak';
import { playStageClear } from '../../utils/ballBreakAudio';

interface StageClearModalProps {
  isOpen: boolean;
  stage: StageDefinition;
  stats: {
    score: number;
    timeTaken: number;
    stars: number;
  };
  onNextStage: () => void;
  onReplayStage: () => void;
  onReturnToMenu: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  isOpen,
  stage,
  stats,
  onNextStage,
  onReplayStage,
  onReturnToMenu,
}) => {
  if (!isOpen) return null;

  React.useEffect(() => {
    if (isOpen) {
      playStageClear();
    }
  }, [isOpen]);

  const hasNext = stage.id < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-[#07090e] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.3)] text-center flex flex-col items-center gap-5">
        {/* Top Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] -mt-12 border-2 border-amber-300 animate-bounce">
          <Trophy className="w-8 h-8 text-slate-950" />
        </div>

        <div>
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Stage Cleared!
          </div>
          <h2 className="text-2xl font-black text-white">{stage.name}</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">{stage.subtitle}</p>
        </div>

        {/* Stars Breakdown */}
        <div className="flex items-center justify-center gap-3 my-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`p-2 rounded-2xl border transition-all ${
                s <= stats.stars
                  ? 'bg-amber-950/60 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-110'
                  : 'bg-slate-900 border-slate-800 text-slate-700'
              }`}
            >
              <Star className={`w-8 h-8 ${s <= stats.stars ? 'fill-amber-400' : ''}`} />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
          <div className="text-left">
            <span className="text-slate-500 block uppercase text-[10px]">Clear Time</span>
            <span className="text-base font-bold text-slate-200">
              {stats.timeTaken}s <span className="text-slate-500 text-xs font-normal">(Par {stage.parTime}s)</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 block uppercase text-[10px]">Final Score</span>
            <span className="text-base font-bold text-amber-400">
              {stats.score.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <button
            onClick={onReturnToMenu}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Menu
          </button>

          <button
            onClick={onReplayStage}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Replay
          </button>

          {hasNext && (
            <button
              onClick={onNextStage}
              className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
