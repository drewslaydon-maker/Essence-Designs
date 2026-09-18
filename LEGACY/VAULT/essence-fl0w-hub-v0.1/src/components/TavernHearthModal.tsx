/**
 * TavernHearthModal.tsx
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Checkpoint Architecture: "The Tavern Hearth"
 * 
 * Checkpoint saved to localStorage under 'essence_flow_v1_save'.
 * Provides full checkpoint restoration, boons display, and zero-state resets.
 */

import React, { useState, useEffect } from 'react';
import { Flame, Save, RotateCcw, Check, Sparkles, Shield, Heart, Trophy, X } from 'lucide-react';
import { hearthSaveService, EssenceFlowSaveState, SAVE_KEY } from '../services/TavernHearthSaveService';
import { playCelestialChime } from '../utils/audio';

interface TavernHearthModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerPos: { x: number; y: number };
  onRestoreState: (save: EssenceFlowSaveState) => void;
}

export const TavernHearthModal: React.FC<TavernHearthModalProps> = ({
  isOpen,
  onClose,
  playerPos,
  onRestoreState,
}) => {
  const [saveState, setSaveState] = useState<EssenceFlowSaveState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const active = hearthSaveService.loadSave();
      setSaveState(active);
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    playCelestialChime(660, 'sine', 0.25);
    const updated = hearthSaveService.checkpointAtHearth({
      playerPos,
    });
    setSaveState(updated);
    setFeedback('🔥 Checkpoint saved at The Tavern Hearth!');
  };

  const handleRestore = () => {
    if (!saveState) return;
    playCelestialChime(880, 'sine', 0.3);
    onRestoreState(saveState);
    setFeedback('✨ Restored checkpoint from The Tavern Hearth!');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handlePurge = () => {
    hearthSaveService.clearSave();
    setSaveState(null);
    setFeedback('🔄 Save data purged from localStorage.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#1c120c] to-[#0d0a08] border-2 border-amber-500/60 p-5 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4 text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-amber-300">
                THE TAVERN HEARTH
              </h2>
              <span className="text-[10px] font-mono text-amber-400/80">
                Checkpoint Engine • Key: '{SAVE_KEY}'
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative */}
        <p className="text-xs text-slate-300 leading-relaxed">
          The crackling driftwood hearth warms Bozog's battle-scarred shoulders. The hearth fire purges exhaustion, restores vigor, and anchors your timeline at Delain Docks.
        </p>

        {/* Feedback Banner */}
        {feedback && (
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Checkpoint Status Card */}
        <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 p-3.5 space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">LAST CHECKPOINT:</span>
            <span className={saveState ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {saveState ? saveState.savedAtFormatted || new Date(saveState.timestamp).toLocaleTimeString() : 'No Checkpoint Saved'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">ROOM:</span>
            <span className="text-amber-300">The Greedy Greens (Room 0)</span>
          </div>

          {/* Boons */}
          <div className="pt-1 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 uppercase">Boons Active:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-[10px] text-amber-300 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-amber-400" />
              <span>Hearth Warmth (+Stamina)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] text-emerald-300 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              <span>Rested Poise</span>
            </span>
          </div>

          {/* Activities Summary */}
          {saveState && (
            <div className="pt-1.5 border-t border-slate-800 grid grid-cols-2 gap-1 text-[10px] text-slate-300">
              <div>🎯 Darts High Score: <strong className="text-amber-300">{saveState.activities?.darts?.highScore || 0}</strong></div>
              <div>🥊 Bouts Won: <strong className="text-emerald-300">{saveState.activities?.sparring?.boutsWon || 0}</strong></div>
              <div>🎸 Rhythm Jam: <strong className="text-purple-300">{saveState.activities?.rhythm?.highScore || 0}</strong></div>
              <div>🪞 Scouts Cataloged: <strong className="text-sky-300">{saveState.activities?.spotting?.scoutsCataloged || 0}</strong></div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-amber-300 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-slate-950" />
            <span>🔥 REST & SAVE CHECKPOINT</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRestore}
              disabled={!saveState}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs border border-emerald-500/40 disabled:opacity-40 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>LOAD SAVED CHECKPOINT</span>
            </button>

            <button
              type="button"
              onClick={handlePurge}
              disabled={!saveState}
              className="py-2.5 px-3 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 font-mono text-xs border border-rose-500/40 disabled:opacity-40 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1"
              title="Purge localStorage save"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>PURGE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
