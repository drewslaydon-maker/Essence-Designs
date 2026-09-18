import React from 'react';
import { MomentumTier } from '../../types/ballBreak';
import { MATERIAL_TIERS } from '../../data/ballBreakStages';
import { RotateCcw, Pause, Play, Home, Zap, Flame, Shield, Sparkles } from 'lucide-react';

interface BallBreakHUDProps {
  stageName: string;
  stageSubtitle: string;
  score: number;
  combo: number;
  speed: number;
  tier: MomentumTier;
  destroyed: { glass: number; wood: number; stone: number };
  remainingTargets: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onReturnToLanding: () => void;
  onTestAudio?: () => void;
  isSandboxMode?: boolean;
  onToggleSandboxMode?: () => void;
}

export const BallBreakHUD: React.FC<BallBreakHUDProps> = ({
  stageName,
  stageSubtitle,
  score,
  combo,
  speed,
  tier,
  destroyed,
  remainingTargets,
  isPaused,
  onTogglePause,
  onRestart,
  onReturnToLanding,
  onTestAudio,
  isSandboxMode,
  onToggleSandboxMode,
}) => {
  const currentTierInfo = MATERIAL_TIERS[tier];

  return (
    <div className="w-full max-w-[470px] mx-auto mb-2 flex flex-col gap-1.5 select-none text-xs">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToLanding}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Menu"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <div>
            <div className="text-xs font-bold text-slate-200 leading-tight flex items-center gap-1.5">
              <span>{stageName}</span>
              {isSandboxMode && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] font-bold">
                  SANDBOX
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono leading-tight">{stageSubtitle}</div>
          </div>
        </div>

        {/* Score & Combo & Actions */}
        <div className="flex items-center gap-2">
          {onTestAudio && (
            <button
              onClick={onTestAudio}
              className="px-2 py-0.5 rounded-lg bg-slate-800/90 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Test procedural sound synthesis"
            >
              <span>🔊 SOUND</span>
            </button>
          )}

          {combo > 1 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-black text-[11px] animate-bounce">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{combo}x</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-sm font-black font-mono text-amber-400">
              {score.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">pts</span>
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5">
            <button
              onClick={onRestart}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Restart / Reload Ball"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onTogglePause}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Speedometer, Segmented Tier Bar & Target Counters */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-md flex items-center justify-between gap-3">
        {/* Tier & Speed */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-bold font-mono text-[11px]" style={{ color: currentTierInfo.color }}>
            <Zap className="w-3.5 h-3.5" />
            <span>T{tier}: {currentTierInfo.name.toUpperCase()}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {speed.toFixed(1)} px/f
          </span>
        </div>

        {/* 4-Tier Segmented Bar */}
        <div className="flex-1 max-w-[120px] grid grid-cols-4 gap-1">
          {MATERIAL_TIERS.map((t) => {
            const isActive = tier >= t.tier;
            const isCurrent = tier === t.tier;
            return (
              <div
                key={t.tier}
                className={`relative h-2 rounded-full transition-all duration-200 overflow-hidden ${
                  isActive ? 'shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: isActive ? t.color : undefined,
                  opacity: isActive ? 1 : 0.2,
                }}
              >
                {isCurrent && (
                  <div className="absolute inset-0 bg-white/50 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Remaining Targets Badge */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-400">Left:</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-bold">
            {remainingTargets}
          </span>
        </div>
      </div>
    </div>
  );
};
