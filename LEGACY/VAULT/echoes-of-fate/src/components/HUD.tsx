import React from 'react';
import { PlayerStats, Realm, Quest } from '../types';
import { Heart, Sparkles, Compass, Shield, Coins, Volume2, VolumeX, Eye, BookOpen } from 'lucide-react';
import { sound } from '../engine/Audio';

interface HUDProps {
  stats: PlayerStats;
  realm: Realm;
  mapName: string;
  activeQuest: Quest | null;
  onToggleRealm: () => void;
  onOpenInventory: () => void;
  onOpenQuests: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  realm,
  mapName,
  activeQuest,
  onToggleRealm,
  onOpenInventory,
  onOpenQuests,
}) => {
  const [muted, setMuted] = React.useState(sound.getMuted());

  const handleToggleMute = () => {
    const isM = sound.toggleMute();
    setMuted(isM);
  };

  const currentObjective = activeQuest?.objectives.find((o) => !o.completed) || activeQuest?.objectives[0];

  return (
    <div id="game-hud" className="pointer-events-none absolute inset-x-0 top-0 z-30 p-2 sm:p-4 flex flex-col gap-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Player Vital Stats */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 sm:p-3 shadow-lg flex flex-col gap-1.5 min-w-[150px] sm:min-w-[200px]">
          {/* Level & Gold */}
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium pb-1 border-b border-slate-700/50">
            <span className="text-amber-400 font-bold">Lv. {stats.level} Wanderer</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{stats.gold}g</span>
            </div>
          </div>

          {/* HP Bar */}
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-rose-900/50">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-200">
              {stats.hp}/{stats.maxHp}
            </span>
          </div>

          {/* MP Bar */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden border border-cyan-900/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, (stats.mp / stats.maxMp) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-200">
              {stats.mp}/{stats.maxMp}
            </span>
          </div>
        </div>

        {/* Center: Map Title & Realm Pill */}
        <div className="flex flex-col items-center gap-1">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-xs font-semibold text-slate-100 shadow-md flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wide">{mapName}</span>
          </div>

          {/* Realm Indicator & Quick Switch */}
          <button
            id="hud-realm-indicator"
            onClick={onToggleRealm}
            className={`pointer-events-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-95 ${
              realm === 'interstice'
                ? 'bg-purple-950/90 border-purple-400/80 text-purple-200 shadow-purple-500/20'
                : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200 shadow-emerald-500/20'
            }`}
            title="Press [Q] or tap to Shift Realm"
          >
            <Eye className="w-3 h-3" />
            <span>{realm === 'interstice' ? 'INTERSTICE PLANE' : 'PHYSICAL REALM'}</span>
            <span className="text-[9px] opacity-70 bg-black/40 px-1 rounded">Q</span>
          </button>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            id="hud-btn-inventory"
            onClick={onOpenInventory}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 shadow-md active:scale-95 transition-all flex items-center gap-1"
            title="Inventory & Gear [Tab]"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-xs font-medium">Gear</span>
          </button>

          <button
            id="hud-btn-quests"
            onClick={onOpenQuests}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 shadow-md active:scale-95 transition-all flex items-center gap-1"
            title="Quest Log"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-xs font-medium">Quest</span>
          </button>

          <button
            id="hud-btn-sound"
            onClick={handleToggleMute}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 shadow-md active:scale-95 transition-all"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Floating Active Quest Objective Banner */}
      {currentObjective && (
        <div
          onClick={onOpenQuests}
          className="pointer-events-auto self-end max-w-[280px] sm:max-w-xs bg-slate-950/85 hover:bg-slate-900/95 cursor-pointer backdrop-blur-md border border-cyan-500/40 rounded-lg px-3 py-1.5 shadow-lg transition-all"
        >
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-0.5">
            <span>Active Quest</span>
            <span>
              {currentObjective.current}/{currentObjective.target}
            </span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-1 font-medium">{currentObjective.description}</p>
        </div>
      )}
    </div>
  );
};
