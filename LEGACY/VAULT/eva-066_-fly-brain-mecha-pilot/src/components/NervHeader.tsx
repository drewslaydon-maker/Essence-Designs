/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GameMode, MechaCustomization } from '../types';
import { PILOT_ROSTER } from '../simulation/pilotData';
import { audio } from '../services/audioService';
import { Volume2, VolumeX, ShieldAlert, Cpu, Activity, CircleDot, HelpCircle, Shield, Sparkles, Film } from 'lucide-react';

interface NervHeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  syncRatio: number;
  onOpenBriefing: () => void;
  onOpenGendoIntro?: () => void;
  customization?: MechaCustomization;
  synchroCredits?: number;
}

export const NervHeader: React.FC<NervHeaderProps> = ({
  currentMode,
  onSelectMode,
  syncRatio,
  onOpenBriefing,
  onOpenGendoIntro,
  customization,
  synchroCredits = 0,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [magiTick, setMagiTick] = useState(0);

  const activePilot = PILOT_ROSTER[customization?.activePilotId || 'SHIN_FLY'];

  useEffect(() => {
    const timer = setInterval(() => {
      setMagiTick((prev) => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.setMuted(newMuted);
    if (!newMuted) {
      audio.playBeep(660);
      audio.startWingbeat();
    }
  };

  const getSyncColor = (ratio: number) => {
    if (ratio > 100) return 'text-purple-400 border-purple-500 bg-purple-950/40 glow-eva-purple';
    if (ratio >= 80) return 'text-emerald-400 border-emerald-500 bg-emerald-950/40 glow-nerv-green';
    if (ratio >= 50) return 'text-amber-400 border-amber-500 bg-amber-950/40 glow-nerv-orange';
    return 'text-red-400 border-red-500 bg-red-950/40 glow-nerv-red';
  };

  return (
    <header className="relative w-full border-b border-orange-500/40 bg-black/90 backdrop-blur-md px-3 py-2 z-30 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* NERV Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-red-950/60 border border-red-600 rounded">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            <div className="leading-none">
              <div className="text-[10px] text-red-400 tracking-widest font-mono-tech">NERV BIO-SYNTH</div>
              <div className="text-sm font-bold text-red-500 font-teko tracking-wider">EVA-066 // DROSOPHILA</div>
            </div>
          </div>

          {/* Pilot ID Card */}
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-neutral-400">PILOT:</span>
            <span className="font-semibold text-neutral-200">{activePilot.name}</span>
            <span className="text-[10px] text-orange-400 px-1 border border-orange-500/50 rounded">{activePilot.callsign}</span>
          </div>

          {/* Synchro Rate Display */}
          <div className={`px-2.5 py-1 border rounded text-xs font-mono-tech transition-colors ${getSyncColor(syncRatio)}`}>
            <span className="text-[10px] uppercase tracking-wider block opacity-75">SYNC RATIO [シンクロ率]</span>
            <span className="text-base font-bold font-teko tracking-wider">{syncRatio.toFixed(1)}%</span>
            {syncRatio > 100 && <span className="ml-1 text-[10px] font-bold text-purple-300 animate-pulse">BERSERK</span>}
          </div>

          {/* Synchro Merit Balance in Header */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/30 border border-amber-500/40 rounded text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-neutral-400 font-mono">SYNCHRO PTS:</span>
            <span className="text-sm font-bold font-teko text-amber-400">{synchroCredits.toLocaleString()}</span>
          </div>
        </div>

        {/* Mode Switcher Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-orange-500/30 rounded">
          <button
            id="tab-battle-cockpit"
            onClick={() => {
              audio.playBeep(440);
              onSelectMode('BATTLE');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech uppercase transition-all rounded ${
              currentMode === 'BATTLE'
                ? 'bg-orange-500 text-black font-bold shadow-md shadow-orange-500/20'
                : 'text-orange-400/80 hover:text-orange-300 hover:bg-orange-950/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>EVA Cockpit</span>
          </button>

          <button
            id="tab-hangar-armory"
            onClick={() => {
              audio.playBeep(480);
              onSelectMode('HANGAR_ARMORY');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech uppercase transition-all rounded ${
              currentMode === 'HANGAR_ARMORY'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Hangar & Armory</span>
          </button>

          <button
            id="tab-baseball-drill"
            onClick={() => {
              audio.playBeep(580);
              onSelectMode('BASEBALL_DRILL');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech uppercase transition-all rounded ${
              currentMode === 'BASEBALL_DRILL'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Baseball Drill</span>
          </button>

          <button
            id="tab-connectome-lab"
            onClick={() => {
              audio.playBeep(520);
              onSelectMode('CONNECTOME_LAB');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech uppercase transition-all rounded ${
              currentMode === 'CONNECTOME_LAB'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Connectome Lab</span>
          </button>
        </div>

        {/* Right Tools: MAGI status, Gendo Directive, Briefing & Audio */}
        <div className="flex items-center gap-2">
          {/* MAGI Consensus */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono-tech px-2 py-1 bg-neutral-950 border border-neutral-800 rounded">
            <span className="text-neutral-500">MAGI:</span>
            <span className={`px-1 rounded ${magiTick % 3 === 0 ? 'bg-emerald-950 text-emerald-400' : 'text-neutral-400'}`}>M-1</span>
            <span className={`px-1 rounded ${magiTick % 3 === 1 ? 'bg-emerald-950 text-emerald-400' : 'text-neutral-400'}`}>B-2</span>
            <span className={`px-1 rounded ${magiTick % 3 === 2 ? 'bg-emerald-950 text-emerald-400' : 'text-neutral-400'}`}>C-3</span>
            <span className="text-emerald-400 font-bold ml-1">AGREE</span>
          </div>

          {onOpenGendoIntro && (
            <button
              id="btn-open-gendo"
              onClick={onOpenGendoIntro}
              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-600/60 rounded transition-colors flex items-center gap-1 text-xs font-mono"
              title="Gendo Ikar-fly Directive (Replay Cutscene)"
            >
              <Film className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline text-[11px] uppercase tracking-wider font-bold">Gendo</span>
            </button>
          )}

          <button
            id="btn-open-briefing"
            onClick={onOpenBriefing}
            className="p-1.5 text-neutral-300 hover:text-orange-400 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors flex items-center gap-1 text-xs"
            title="Project Briefing & Biological Connectome Science"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Briefing</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className={`p-1.5 border rounded transition-colors ${
              isMuted
                ? 'text-neutral-500 border-neutral-700 bg-neutral-900'
                : 'text-orange-400 border-orange-500/60 bg-orange-950/40 hover:bg-orange-900/50'
            }`}
            title={isMuted ? 'Unmute Bio-Audio' : 'Mute Bio-Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
