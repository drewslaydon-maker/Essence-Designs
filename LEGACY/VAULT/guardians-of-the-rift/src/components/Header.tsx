import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Shield, CircleDot, Award } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../audio/soundEngine';

interface HeaderProps {
  profile: PlayerProfile;
  activeTab: 'chamber' | 'armory' | 'vending' | 'academy';
  setActiveTab: (tab: 'chamber' | 'armory' | 'vending' | 'academy') => void;
  isGameActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  isGameActive,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Lore Tag */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-indigo-800 flex items-center justify-center shadow-md border border-amber-500/40">
              <CircleDot className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-stone-100 flex items-center gap-1.5">
                  Guardians of the Rift
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Apprentice Edition
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                {profile.name} <span className="text-stone-600">•</span> <span className="text-amber-400/90 italic">{profile.title}</span>
              </p>
            </div>
          </div>

          {/* Mobile Sound Toggle */}
          <button
            id="mobile-sound-toggle-btn"
            onClick={handleToggleSound}
            className="md:hidden p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-stone-700 transition"
            title={isMuted ? 'Unmute GotR Theme' : 'Mute Music'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-xl border border-stone-800 w-full md:w-auto justify-center">
          <button
            id="nav-tab-chamber"
            onClick={() => setActiveTab('chamber')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              activeTab === 'chamber'
                ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rift Chamber</span>
            {isGameActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block ml-0.5" />
            )}
          </button>

          <button
            id="nav-tab-armory"
            onClick={() => setActiveTab('armory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              activeTab === 'armory'
                ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span>Wizard Armory</span>
          </button>

          <button
            id="nav-tab-vending"
            onClick={() => setActiveTab('vending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              activeTab === 'vending'
                ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span>Cosmic Vending</span>
            {(profile.elementalTokens > 0 || profile.catalyticTokens > 0) && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 border border-indigo-500/40 text-[10px] text-indigo-200 font-mono">
                {profile.elementalTokens + profile.catalyticTokens}
              </span>
            )}
          </button>

          <button
            id="nav-tab-academy"
            onClick={() => setActiveTab('academy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              activeTab === 'academy'
                ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Academy</span>
          </button>
        </nav>

        {/* Currency Display & Desktop Audio Toggle */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Elemental Tokens */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-700/40 text-cyan-300 text-xs font-mono font-semibold"
            title="Elemental Reward Tokens (earned from elemental altars & Great Guardian)"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>{profile.elementalTokens}</span>
            <span className="text-[10px] text-cyan-400/70 uppercase">Elem</span>
          </div>

          {/* Catalytic Tokens */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-700/40 text-purple-300 text-xs font-mono font-semibold"
            title="Catalytic Reward Tokens (earned from catalytic altars & minions)"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
            <span>{profile.catalyticTokens}</span>
            <span className="text-[10px] text-purple-400/70 uppercase">Cata</span>
          </div>

          {/* Stardust */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-700/40 text-amber-300 text-xs font-mono font-semibold"
            title="Stardust (earned from monster kills & rift defense to purchase Academy upgrades)"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{profile.stardust}</span>
            <span className="text-[10px] text-amber-400/70 uppercase">Star</span>
          </div>

          {/* Desktop Sound Button */}
          <button
            id="desktop-sound-toggle-btn"
            onClick={handleToggleSound}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-stone-700 transition text-xs"
            title={isMuted ? 'Play GotR Synth Theme' : 'Mute Music & Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-[11px] text-stone-500">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-400 font-medium">Theme Active</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
