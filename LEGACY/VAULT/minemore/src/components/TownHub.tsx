import React, { useState } from 'react';
import {
  CharacterProfile,
  PartyMember,
  ActiveCulinaryBuff,
} from '../types';
import { playAudio } from '../audio';
import {
  BookOpen,
  Flame,
  Users,
  Sparkles,
  Pickaxe,
  Volume2,
  VolumeX,
  Compass,
  Heart,
  Brain,
  Shield,
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Coffee,
} from 'lucide-react';

interface TownHubProps {
  character: CharacterProfile;
  playerLevel: number;
  playerSanity: number;
  playerFatigue: number;
  partyMembers: PartyMember[];
  activeBuffs: ActiveCulinaryBuff[];
  unlockedNewspaperCount: number;
  totalNewspaperCount: number;
  storedGemsCount: number;
  onOpenNewspaper: () => void;
  onOpenDigger: () => void;
  onOpenCharacterSheet: () => void;
  onOpenVault: () => void;
  onDescendDirectly: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const TownHub: React.FC<TownHubProps> = ({
  character,
  playerLevel,
  playerSanity,
  playerFatigue,
  partyMembers,
  activeBuffs,
  unlockedNewspaperCount,
  totalNewspaperCount,
  storedGemsCount,
  onOpenNewspaper,
  onOpenDigger,
  onOpenCharacterSheet,
  onOpenVault,
  onDescendDirectly,
  onToggleMute,
  isMuted,
}) => {
  const [activeTab, setActiveTab] = useState<'districts' | 'party' | 'lore'>('districts');
  const [loreSnippet, setLoreSnippet] = useState<string>(
    'The cold Appalachian wind hums through the empty coal tipple. Mountain Town stands quiet, but Big Cave whispers below.'
  );
  const [hearthRests, setHearthRests] = useState<number>(0);

  const rescuedCount = partyMembers.filter((m) => m.rescued).length;

  const handleRestAtHearth = () => {
    playAudio('cook');
    setHearthRests((prev) => prev + 1);
    const hearthTales = [
      'You warm your calloused hands over the hemlock fire. The smell of burning pine pitch clears your heavy thoughts.',
      'An old track worker once said: "If the rock hums like a wet violin, don\'t swing your pick—run for the timbering."',
      'The fire crackles cheerfully. In the distance, the steam whistle of The Digger releases a slow hiss.',
      'Maeve used to keep cider warming on these stones before the corporate guards closed down the third shift.',
      'The sparks drift up toward the cold mountain stars. Your grip on your pickaxe feels steady once again.',
    ];
    setLoreSnippet(hearthTales[hearthRests % hearthTales.length]);
  };

  return (
    <div
      id="town-hub-screen"
      className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans text-stone-100 select-none flex flex-col"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 10%, rgba(147, 51, 234, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 80% 30%, rgba(245, 158, 11, 0.06) 0%, transparent 40%),
          linear-gradient(to bottom, #100e0c 0%, #171411 50%, #100e0c 100%)
        `,
      }}
    >
      {/* ----------------- TOP STATUS & SYSTEM HEADER ----------------- */}
      <header className="z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-stone-950/95 border-b border-stone-800/90 backdrop-blur-md shrink-0 shadow-md">
        {/* Town Badge & Character summary */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-950 border border-amber-700/80 flex items-center justify-center text-amber-400 font-serif font-black text-sm shadow-inner">
            MT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-sm sm:text-base text-stone-100 tracking-wide">
                Mountain Town
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/90 text-emerald-300 rounded border border-emerald-800/80 font-bold uppercase tracking-wider">
                Surface Hub
              </span>
            </div>
            <p className="text-[11px] font-mono text-stone-400 flex items-center gap-1.5">
              <span>{character.name}</span>
              <span className="text-stone-600">•</span>
              <span className="text-amber-400 font-semibold">Lv.{playerLevel} {character.classTitle}</span>
            </p>
          </div>
        </div>

        {/* Vital Gauges & Audio */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sanity Meter */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900/90 border border-stone-800 text-xs font-mono"
            title="Miner Sanity: Kept steady by rest and good meals"
          >
            <Brain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-stone-400">Sanity:</span>
            <span className="text-sky-300 font-bold">{Math.round(playerSanity)}%</span>
          </div>

          {/* Fatigue Meter */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900/90 border border-stone-800 text-xs font-mono"
            title="Miner Fatigue: Accumulates with strikes"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-stone-400">Fatigue:</span>
            <span className="text-rose-300 font-bold">{Math.round(playerFatigue)}%</span>
          </div>

          {/* Active Buffs Pill */}
          {activeBuffs.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-[11px] font-semibold">{activeBuffs.length} Buff{activeBuffs.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Miner Profile Button */}
          <button
            onClick={() => {
              playAudio('paper');
              onOpenCharacterSheet();
            }}
            className="px-2 sm:px-3 py-1 bg-stone-900 hover:bg-stone-800 active:scale-95 text-stone-200 rounded border border-stone-700 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Open Character Dossier & Talent Tree"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline font-semibold">Dossier</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 active:scale-95 text-stone-400 hover:text-stone-200 rounded border border-stone-800 transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* ----------------- ATMOSPHERIC BANNER & OBJECTIVE TICKER ----------------- */}
      <div className="z-20 px-3 sm:px-6 py-2 bg-stone-900/60 border-b border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Compass className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            Mountain Haven:
          </span>
          <span className="text-stone-300 text-xs truncate">
            {loreSnippet}
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 self-end sm:self-auto text-[11px]">
          <button
            onClick={() => setActiveTab('districts')}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition font-semibold ${
              activeTab === 'districts'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Districts
          </button>
          <button
            onClick={() => setActiveTab('party')}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition font-semibold flex items-center gap-1 ${
              activeTab === 'party'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span>Miners</span>
            <span className="text-[10px] px-1 bg-stone-950/60 rounded">
              {rescuedCount}/3
            </span>
          </button>
          <button
            onClick={() => setActiveTab('lore')}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition font-semibold ${
              activeTab === 'lore'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Town Lore
          </button>
        </div>
      </div>

      {/* ----------------- MAIN DISTRICT HUB INTERFACE ----------------- */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col justify-between max-w-7xl w-full mx-auto">
        {activeTab === 'districts' && (
          <div className="flex flex-col gap-4 sm:gap-6 my-auto">
            {/* 1. HERO LOCATION: BIG CAVE ENTRANCE (EXPEDITION LAUNCH) */}
            <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/90 via-stone-900/95 to-stone-900 border-2 border-purple-600/70 p-4 sm:p-6 shadow-[0_0_40px_rgba(147,51,234,0.18)] hover:border-purple-400 transition-all duration-300 group">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                  PRIMARY EXPEDITION
                </span>
                <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                  SHAFT 1 UNLOCKED
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 sm:gap-4 max-w-2xl">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-900/40 border border-purple-500/50 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <Pickaxe className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif font-black text-lg sm:text-2xl text-purple-100 tracking-wide">
                        Big Cave Entrance
                      </h2>
                      <span className="text-xs font-mono text-purple-300/80">
                        (Vein 1: Corporate Bedrock)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed font-sans">
                      The yawning portal cut into the Appalachian ridge. Strike the 3-tap bedrock wall, unearth geode clusters, harvest cavern organics, and locate trapped townsfolk deep underground.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] font-mono text-stone-400">
                      <span className="flex items-center gap-1 text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Gems & Minerals to Unearth
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        Lost Miners to Rescue
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-300">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        Crossroads Delve Paths
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playAudio('crack');
                    onDescendDirectly();
                  }}
                  className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-stone-950 font-serif font-black text-sm sm:text-base cursor-pointer transition-all shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 border border-purple-400/50 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] shrink-0"
                >
                  <Pickaxe className="w-5 h-5 text-stone-950" />
                  <span>DESCEND INTO BIG CAVE</span>
                  <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 2. SECONDARY DISTRICT BUILDINGS (CLEAN 4-COLUMN GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Location Card: The Digger */}
              <div
                onClick={() => {
                  playAudio('cook');
                  onOpenDigger();
                }}
                className="rounded-xl bg-stone-900/90 hover:bg-stone-900 border border-amber-800/60 hover:border-amber-500 p-4 sm:p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 shadow-md group hover:shadow-amber-950/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 text-[9px] font-mono font-bold tracking-wider uppercase">
                      CRAWLER BASE
                    </span>
                    <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-100 group-hover:text-amber-300 transition-colors">
                    The Digger Rig
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 leading-snug">
                    Board the armored steam crawler. Cook mineral recipes at the Field Galley, feed rescued miners, and rest in bunks.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400/90 font-semibold flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5" />
                    Field Galley
                  </span>
                  <span className="text-stone-300 group-hover:translate-x-1 transition-transform flex items-center">
                    Enter <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-amber-400" />
                  </span>
                </div>
              </div>

              {/* Location Card: The Miner Issue */}
              <div
                onClick={() => {
                  playAudio('paper');
                  onOpenNewspaper();
                }}
                className="rounded-xl bg-[#2e2720]/95 hover:bg-[#382f27] border border-[#8a7256]/60 hover:border-[#d4be98] p-4 sm:p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-stone-950/80 text-amber-200 border border-stone-700 text-[9px] font-mono font-bold tracking-wider uppercase">
                      TOWN PRESS
                    </span>
                    <BookOpen className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#f5efe1] group-hover:text-amber-200 transition-colors">
                    The Miner Issue
                  </h3>
                  <p className="text-xs text-[#c9bcab] mt-1 leading-snug">
                    Mountain Town broadsheet archive. Read historical reporting on the 1924 company collapse, mine disaster lore, and rumors.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-700/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300/90 font-semibold">
                    {unlockedNewspaperCount}/{totalNewspaperCount} Broadsides
                  </span>
                  <span className="text-[#f5efe1] group-hover:translate-x-1 transition-transform flex items-center">
                    Read <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-amber-300" />
                  </span>
                </div>
              </div>

              {/* Location Card: Velvet Vault */}
              <div
                onClick={() => {
                  playAudio('gem');
                  onOpenVault();
                }}
                className="rounded-xl bg-stone-900/90 hover:bg-stone-900 border border-stone-800 hover:border-emerald-500/70 p-4 sm:p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 shadow-md group hover:shadow-emerald-950/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[9px] font-mono font-bold tracking-wider uppercase">
                      COLLECTION
                    </span>
                    <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-100 group-hover:text-emerald-300 transition-colors">
                    Velvet Vault
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 leading-snug">
                    Inspect recovered gems, crystal geodes, and curios in lined wooden trays. Review market appraisal values and lore.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">
                    {storedGemsCount} Rare Gems
                  </span>
                  <span className="text-stone-300 group-hover:translate-x-1 transition-transform flex items-center">
                    Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-emerald-400" />
                  </span>
                </div>
              </div>

              {/* Location Card: Town Square Hearth */}
              <div
                onClick={handleRestAtHearth}
                className="rounded-xl bg-stone-900/90 hover:bg-stone-900 border border-stone-800 hover:border-rose-500/70 p-4 sm:p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 text-[9px] font-mono font-bold tracking-wider uppercase">
                      REST HEARTH
                    </span>
                    <Flame className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-100 group-hover:text-rose-300 transition-colors">
                    Town Hearth
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 leading-snug">
                    Warm your hands over crackling hemlock embers. Steady your nerves, recover your focus, and hear Appalachian folklore.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400/90 font-semibold">
                    Warm Hands
                  </span>
                  <span className="text-stone-300 group-hover:translate-x-1 transition-transform flex items-center">
                    Rest <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-rose-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: PARTY & RESCUED MINERS ----------------- */}
        {activeTab === 'party' && (
          <div className="max-w-4xl w-full mx-auto space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-100">
                  Town Survivors & Rescued Miners
                </h2>
                <p className="text-xs text-stone-400 font-mono">
                  Miners trapped deep in Big Cave. Rescue them from collapse zones to bring Mountain Town back to life.
                </p>
              </div>
              <div className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded text-xs font-mono text-emerald-300 font-bold">
                {rescuedCount}/3 Rescued
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {partyMembers.map((member) => (
                <div
                  key={member.id}
                  className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                    member.rescued
                      ? 'bg-stone-900/90 border-emerald-600/60 shadow-lg'
                      : 'bg-stone-950/80 border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif font-bold text-sm shrink-0 ${
                        member.rescued
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-stone-900 text-stone-600 border border-stone-800'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.rescued && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </h4>
                      <div className="text-[11px] font-mono text-amber-400">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 italic font-serif">
                    "{member.dialogue}"
                  </p>

                  <div className="pt-2 border-t border-stone-800/80 text-[11px] font-mono flex items-center justify-between">
                    <span className="text-stone-400">Status:</span>
                    <span
                      className={`font-semibold ${
                        member.rescued ? 'text-emerald-400' : 'text-stone-500'
                      }`}
                    >
                      {member.rescued ? 'Safe in Town' : 'Trapped in Mines'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs font-mono text-amber-300 flex items-center justify-between">
              <span>Feed rescued miners hot stews in The Digger Galley to earn morale and gathering perks.</span>
              <button
                onClick={onOpenDigger}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded font-bold cursor-pointer transition ml-3 shrink-0"
              >
                Go to Galley
              </button>
            </div>
          </div>
        )}

        {/* ----------------- TAB: TOWN LORE & HISTORY ----------------- */}
        {activeTab === 'lore' && (
          <div className="max-w-3xl w-full mx-auto space-y-4 my-auto bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-7 shadow-xl">
            <div className="border-b border-stone-800 pb-3">
              <h2 className="font-serif font-bold text-xl text-amber-200">
                Chronicles of Black Ridge & Mountain Town
              </h2>
              <p className="text-xs font-mono text-stone-400 mt-1">
                Appalachian mining history, scrip records, and the Great Collapse of 1924.
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
              <p>
                Before the corporate engineers arrived with their diamond-tipped rotary drills, Mountain Town was a resilient timbering settlement. Families worked the small veins with sledgehammers, honoring the old mountain law: never blast deeper than the roots of the hemlock trees.
              </p>
              <p>
                In the autumn of 1924, the Black Ridge Syndicate acquired the mineral leases. They drove Shaft 1 two thousand feet straight into the granite, cutting through amethyst pockets and venting strange, phosphorescent vapors that turned the miners' watches blue.
              </p>
              <p>
                When the lower levels caved in on November 4th, company officials padlocked the offices, loaded their motorcars with payroll gold, and abandoned the town overnight. The Digger crawler rig remains the only piece of heavy machinery still functioning.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">
                More articles available in the town gazette archives.
              </span>
              <button
                onClick={onOpenNewspaper}
                className="px-3.5 py-1.5 bg-[#f5efe1] hover:bg-[#fff9ed] text-stone-950 font-serif font-bold rounded text-xs cursor-pointer transition shadow-sm"
              >
                Read Broadsides
              </button>
            </div>
          </div>
        )}

        {/* ----------------- BOTTOM RESCUED CREW BANNER ----------------- */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-stone-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Town Sanctuary:</span>
            <span className="text-emerald-400 font-semibold">
              {rescuedCount} of 3 Miners Rescued
            </span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">
              {storedGemsCount} Gems Stored
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playAudio('paper');
                onOpenCharacterSheet();
              }}
              className="hover:text-stone-200 underline cursor-pointer"
            >
              Talent Tree
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playAudio('gem');
                onOpenVault();
              }}
              className="hover:text-stone-200 underline cursor-pointer"
            >
              Velvet Vault
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playAudio('crack');
                onDescendDirectly();
              }}
              className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
            >
              Enter Mine Shaft 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
