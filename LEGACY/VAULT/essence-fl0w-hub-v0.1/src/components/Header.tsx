import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Gamepad2, 
  BookOpen, 
  Heart, 
  Shield, 
  Zap,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { toggleAudioState, playCelestialChime } from '../utils/audio';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLoreBible: () => void;
  onOpenShareMom: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenLoreBible,
  onOpenShareMom,
  audioEnabled,
  setAudioEnabled,
}) => {
  const handleToggleAudio = () => {
    const next = toggleAudioState();
    setAudioEnabled(next);
    if (next) {
      playCelestialChime(528, 'sine', 0.4);
    }
  };

  const navItems = [
    { 
      id: 'landing', 
      label: 'Essence Hub', 
      icon: Sparkles, 
      activeStyle: 'bg-gradient-to-r from-amber-950/70 to-slate-900 text-amber-200 border-b-2 border-amber-400 font-semibold shadow-[0_2px_12px_rgba(245,158,11,0.25)]',
      inactiveStyle: 'text-amber-300/70 hover:text-amber-200 hover:bg-slate-900/50'
    },
    { 
      id: 'journeys', 
      label: 'Journeys Unto (Tavern RPG)', 
      icon: Gamepad2, 
      activeStyle: 'bg-emerald-950/60 text-emerald-200 border-b-2 border-emerald-400 font-semibold shadow-[0_2px_12px_rgba(16,185,129,0.2)]',
      inactiveStyle: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
    },
    { 
      id: 'grimoire', 
      label: 'Goal & Task Grimoire', 
      icon: CheckSquare, 
      badge: 'Kanban',
      activeStyle: 'bg-cyan-950/60 text-cyan-200 border-b-2 border-cyan-400 font-semibold shadow-[0_2px_12px_rgba(6,182,212,0.25)]',
      inactiveStyle: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
    },
    { 
      id: 'ballbreak', 
      label: 'Ball Break (Simulator)', 
      icon: Zap, 
      badge: 'Mobile Lab',
      activeStyle: 'bg-amber-950/60 text-amber-200 border-b-2 border-amber-400 font-semibold shadow-[0_2px_12px_rgba(245,158,11,0.2)]',
      inactiveStyle: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
    },
    { 
      id: 'physics', 
      label: 'Physics Forge', 
      icon: Activity, 
      activeStyle: 'bg-cyan-950/60 text-cyan-200 border-b-2 border-cyan-400 font-semibold shadow-[0_2px_12px_rgba(56,189,248,0.2)]',
      inactiveStyle: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
    },
    { 
      id: 'mom', 
      label: "Mom's Haven (Atreyu)", 
      icon: Heart, 
      badge: 'Yarn & Games 🧶',
      activeStyle: 'bg-rose-950/70 text-rose-200 border-b-2 border-rose-400 font-semibold shadow-[0_2px_12px_rgba(244,63,94,0.25)]',
      inactiveStyle: 'text-rose-300/70 hover:text-rose-100 hover:bg-rose-950/30'
    },
    { 
      id: 'juju', 
      label: "Juju's Reality Anchor", 
      icon: Shield, 
      activeStyle: 'bg-purple-950/70 text-purple-200 border-b-2 border-purple-400 font-semibold shadow-[0_2px_12px_rgba(168,85,247,0.25)]',
      inactiveStyle: 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/30'
    },
  ];

  return (
    <header className="relative z-20 border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-md">
      {/* Top Bar: Clean Brand & Key Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => { playCelestialChime(720); setActiveTab('landing'); }}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/70 text-emerald-400 font-bold text-base shadow-sm cursor-pointer hover:border-emerald-500/50 transition-colors"
          >
            ✦
          </div>

          <div 
            onClick={() => { playCelestialChime(720); setActiveTab('landing'); }}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-slate-100 hover:text-amber-300 transition-colors">
                ESSENCE FL0W
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Hub & Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Essence Hub for Drew, Juju & Mom • Goal & Reasoning Driven
            </p>
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Link to Mom button */}
          <button
            id="header-share-mom-btn"
            onClick={onOpenShareMom}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-950/40 transition-colors cursor-pointer"
            title="Get the share link for Mom"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-white" />
            <span>Share Link to Mom</span>
          </button>

          {/* Lore Bible */}
          <button
            id="header-lore-btn"
            onClick={onOpenLoreBible}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors cursor-pointer"
            title="Open Master Lore Bible (v0.2 Ground Truth)"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel">Lore Bible</span>
          </button>

          {/* Audio Chime Synthesizer Toggle */}
          <button
            id="header-audio-toggle"
            onClick={handleToggleAudio}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              audioEnabled 
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={audioEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Streamlined Tab Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  playCelestialChime(isActive ? 440 : 660, 'sine', 0.15);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-md font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? item.activeStyle
                    : `${item.inactiveStyle} border-b-2 border-transparent`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-inherit' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
