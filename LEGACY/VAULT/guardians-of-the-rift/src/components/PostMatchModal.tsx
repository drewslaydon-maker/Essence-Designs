import React from 'react';
import { Sparkles, Trophy, AlertTriangle, Play, RefreshCw, ShoppingBag } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface PostMatchModalProps {
  isVictory: boolean;
  elementalPoints: number;
  catalyticPoints: number;
  elementalTokensEarned: number;
  catalyticTokensEarned: number;
  stardustEarned: number;
  monstersDefeated: number;
  greatGuardianCharge: number;
  onPlayAgain: () => void;
  onGoToVending: () => void;
}

export const PostMatchModal: React.FC<PostMatchModalProps> = ({
  isVictory,
  elementalPoints,
  catalyticPoints,
  elementalTokensEarned,
  catalyticTokensEarned,
  stardustEarned,
  monstersDefeated,
  greatGuardianCharge,
  onPlayAgain,
  onGoToVending,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isVictory ? 'bg-amber-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Header Title */}
        <div className="text-center space-y-2 relative">
          <div
            className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
              isVictory
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}
          >
            {isVictory ? <Trophy className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-stone-100">
            {isVictory ? 'Rift Successfully Sealed!' : 'The Rift Collapsed!'}
          </h2>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {isVictory
              ? 'The Great Guardian gathered 100% Celestial Power and repelled the abyssal horde into the void.'
              : 'The Great Guardian fell under the pressure of the abyssal breach. The Headmaster is writing a strongly worded letter.'}
          </p>
        </div>

        {/* Score & Rewards Card */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800 pb-2">
            Match Performance Debrief
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Celestial Energy:</span>
              <span className="font-mono text-sm font-bold text-amber-400">{greatGuardianCharge}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Abyssals Defeated:</span>
              <span className="font-mono text-sm font-bold text-stone-200">{monstersDefeated}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-cyan-800/40">
              <span className="text-cyan-400/80 block text-[11px]">Elemental Score:</span>
              <span className="font-mono text-sm font-bold text-cyan-300">{elementalPoints} pts</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-purple-800/40">
              <span className="text-purple-400/80 block text-[11px]">Catalytic Score:</span>
              <span className="font-mono text-sm font-bold text-purple-300">{catalyticPoints} pts</span>
            </div>
          </div>

          {/* Tokens Dispensed */}
          <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
              Currencies Awarded
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/60" />
                <span className="text-xs font-mono font-bold text-cyan-300">+{elementalTokensEarned} Elem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/60" />
                <span className="text-xs font-mono font-bold text-purple-300">+{catalyticTokensEarned} Cata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">+{stardustEarned} Stardust</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="post-match-vending-btn"
            onClick={() => {
              sound.playVendingCrankSfx();
              onGoToVending();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            <span>Spend in Vending Machine</span>
          </button>

          <button
            id="post-match-again-btn"
            onClick={() => {
              sound.playPortalSfx();
              onPlayAgain();
            }}
            className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm tracking-wide border border-stone-700 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
