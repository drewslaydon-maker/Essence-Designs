import React, { useState } from 'react';
import { 
  Gavel, 
  ShieldCheck, 
  Skull, 
  Search, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Scroll, 
  Beer, 
  Eye, 
  Award, 
  Scale, 
  Compass, 
  HelpCircle,
  Dices,
  Palette,
  Crosshair
} from 'lucide-react';
import { ROLES } from '../data/roles';
import { RoleId } from '../types';
import { soundEngine } from '../utils/audioEngine';
import { RoleBadge } from './RoleBadge';

interface LandingPageProps {
  onEnterGame: (selectedRole?: RoleId | 'random') => void;
  hasActiveSession: boolean;
  onResumeGame?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterGame,
  hasActiveSession,
  onResumeGame,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume
}) => {
  const [selectedRolePreview, setSelectedRolePreview] = useState<RoleId>('detective');
  const [testedSound, setTestedSound] = useState<string | null>(null);

  const roleList = Object.keys(ROLES) as RoleId[];
  const preview = ROLES[selectedRolePreview];

  const handleTestSound = (type: 'gavel' | 'bell' | 'paddle' | 'tell' | 'coin') => {
    soundEngine.unlockAudio();
    if (type === 'gavel') {
      soundEngine.playGavel();
      setTestedSound('Gavel Slam (Courtroom)');
    } else if (type === 'bell') {
      soundEngine.playBellToll();
      setTestedSound('Midnight Bell (Nocturnal)');
    } else if (type === 'paddle') {
      soundEngine.playVotePaddle();
      setTestedSound('Jury Paddle Tap (Trial)');
    } else if (type === 'tell') {
      soundEngine.playTellDiscovered();
      setTestedSound('Glass Chime (Spy Party Tell)');
    } else if (type === 'coin') {
      soundEngine.playCoinClink();
      setTestedSound('Merchant Gold Clink');
    }
    setTimeout(() => setTestedSound(null), 1800);
  };

  const handleEnterWithAudio = (role: RoleId | 'random' = 'detective') => {
    soundEngine.unlockAudio();
    soundEngine.playGavel();
    onEnterGame(role);
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 font-sans">
      
      {/* Hero Atmosphere Navigation */}
      <header className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Salem & Spycraft
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono">
                Social Deduction • Forensics • Behavioral Intrigue
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Volume Control */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
              <button 
                onClick={onToggleMute}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-24 accent-amber-500 cursor-pointer"
                title="Master Sound Volume"
              />
            </div>

            {hasActiveSession && onResumeGame && (
              <button
                id="btn-landing-resume"
                onClick={onResumeGame}
                className="py-1.5 px-4 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md transition-all cursor-pointer"
              >
                Resume Active Inquest
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="py-12 sm:py-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Town of Salem Trials • TTT Forensics • Spy Party Behavioral Tells
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Deceit at Blackthorn Manor: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
              Where Every Gesture Tells a Secret
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Step inside a Victorian parlor of aristocrats, conspirators, and cutthroats.
            Convene court trials, submit sealed Last Wills, autopsy crime scenes with 
            ballistic certainty, and decipher micro-tells before the midnight bell tolls.
          </p>

          {/* Primary Call-to-Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="btn-landing-enter"
              onClick={() => handleEnterWithAudio('detective')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Enter Blackthorn Manor (Unlock Audio)</span>
            </button>

            <button
              id="btn-landing-random"
              onClick={() => handleEnterWithAudio('random')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Surprise Secret Role</span>
            </button>
          </div>

          {/* Sound Prompt Test Bench */}
          <div className="pt-4 flex flex-col items-center">
            <div className="text-xs text-stone-400 flex items-center gap-1.5 mb-2 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Sound Prompts (Click to test procedural sound effects):</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                id="btn-test-sfx-gavel"
                onClick={() => handleTestSound('gavel')}
                className="py-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-600/70 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>Court Gavel</span>
              </button>

              <button
                id="btn-test-sfx-bell"
                onClick={() => handleTestSound('bell')}
                className="py-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-indigo-600/70 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Skull className="w-3.5 h-3.5 text-indigo-400" />
                <span>Midnight Bell</span>
              </button>

              <button
                id="btn-test-sfx-paddle"
                onClick={() => handleTestSound('paddle')}
                className="py-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-emerald-600/70 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jury Paddle</span>
              </button>

              <button
                id="btn-test-sfx-tell"
                onClick={() => handleTestSound('tell')}
                className="py-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-cyan-600/70 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Spy Tell Chime</span>
              </button>

              <button
                id="btn-test-sfx-coin"
                onClick={() => handleTestSound('coin')}
                className="py-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/70 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Beer className="w-3.5 h-3.5 text-amber-400" />
                <span>Bazaar Gold</span>
              </button>
            </div>

            {testedSound && (
              <span className="text-xs text-amber-300 font-mono mt-2 animate-pulse">
                ▶ Playing sound prompt: {testedSound}
              </span>
            )}
          </div>

        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section className="py-10 px-6 border-y border-stone-800/80 bg-stone-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              The Three Pillars of Mystery
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Engineered by synthesizing the tensest mechanics of social deduction history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Town of Salem */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-800/70 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-4">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Town of Salem Courtrooms</h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Nominate suspects to the stand. Lawyers can lodge formal objections, Judges issue 
                unilateral emergency orders or royal pardons, and every deceased guest’s Last Will 
                is unsealed and read aloud upon execution.
              </p>
              <ul className="text-[11px] text-stone-400 space-y-1.5 font-mono">
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">•</span> Sealed Last Will & Testament system
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">•</span> Courtroom defense & jury paddle voting
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">•</span> Executioner sworn quarry & Jester curse
                </li>
              </ul>
            </div>

            {/* Pillar 2: TTT Forensics & Armory */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-indigo-800/70 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">TTT Forensics & Armory</h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Conduct detailed autopsies on victim corpses. The Detective uncovers the exact 
                weapon caliber, time of death, and DNA matches, while players purchase Kevlar vests, 
                DNA scanners, and truth serum at the Dusk Bazaar.
              </p>
              <ul className="text-[11px] text-stone-400 space-y-1.5 font-mono">
                <li className="flex items-center gap-1.5">
                  <span className="text-indigo-400">•</span> Scientific forensic autopsy dossiers
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-indigo-400">•</span> Tactical Dusk Bazaar equipment & armor
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-indigo-400">•</span> Traitor death notes & planted evidence
                </li>
              </ul>
            </div>

            {/* Pillar 3: Spy Party Tells */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-800/70 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Spy Party Behavioral Tells</h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Guests reveal subconscious physical tells: fidgeting with pocket watches, tapping 
                gavel handles, or furtively scanning salon exits. The Artist paints charcoal sketches 
                to expose guilty twitches before anyone says a word.
              </p>
              <ul className="text-[11px] text-stone-400 space-y-1.5 font-mono">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> Dynamic micro-behavioral log for all guests
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> Artist charcoal sketch inquests
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> Dynamic Suspicion Index (0-100%)
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Role Dossier Carousel / Browser */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                Cast of Blackthorn Manor ({roleList.length} Unique Identities)
              </h2>
              <p className="text-xs text-stone-400">
                Click any persona to inspect their faction, signature abilities, and victory objectives.
              </p>
            </div>
            <button
              onClick={() => handleEnterWithAudio(selectedRolePreview)}
              className="py-2 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              Play as {preview.name}
            </button>
          </div>

          {/* Quick Role Badges Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {roleList.map((rId) => {
              const r = ROLES[rId];
              const isSelected = selectedRolePreview === rId;
              return (
                <button
                  key={rId}
                  id={`landing-role-${rId}`}
                  onClick={() => setSelectedRolePreview(rId)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-950 border-amber-500 text-amber-200 ring-2 ring-amber-400 shadow-md' 
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <RoleBadge roleId={rId} size="sm" showPrerogative={false} />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Role Deep-Dive Card */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-amber-900/60 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-800 pb-6 md:pb-0 md:pr-6 space-y-4">
              <div>
                <RoleBadge roleId={selectedRolePreview} size="lg" />
                <h3 className="text-xl font-bold text-white mt-2">{preview.name}</h3>
                <p className="text-xs text-amber-400/90 font-medium italic mt-0.5">{preview.tagline}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Allegiance:</span>
                  <span className="font-bold text-stone-200 uppercase">{preview.faction}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Prerogative Authority:</span>
                  <span className="font-bold text-amber-400">{preview.prerogativeLevel}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Win Condition:
                </span>
                <p className="text-stone-300">{preview.winCondition}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Class Overview
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {preview.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Signature Abilities & Tactics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {preview.detailedAbilities.map(ab => (
                    <div key={ab.id} className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-300 text-xs">{ab.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-900 border border-stone-700 text-stone-400">
                          {ab.phase}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        {ab.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {preview.spyPartyTells && preview.spyPartyTells.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Known Subconscious Tells
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.spyPartyTells.map((tell, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-stone-300 font-mono">
                        "{tell}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-900/40 px-6 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Salem &amp; Spycraft • Offline Victorian Intrigue Simulation</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleEnterWithAudio('detective')}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Start New Inquest
            </button>
            <span>•</span>
            <button 
              onClick={onToggleMute}
              className="hover:text-stone-300 cursor-pointer"
            >
              {isMuted ? "Sound: Muted" : "Sound: Active"}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
