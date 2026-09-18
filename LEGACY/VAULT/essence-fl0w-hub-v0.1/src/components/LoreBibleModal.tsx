import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Users, 
  Compass, 
  ShieldAlert, 
  Wine, 
  GitBranch, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { 
  CANON_CHARACTERS, 
  TAVERN_SETPIECES, 
  DRINKING_CONTEST_ROUNDS, 
  AMBUSH_STANDOFF_CHOICES,
  LOCKED_AGENT_HIERARCHY 
} from '../data/loreBible';
import { playCelestialChime } from '../utils/audio';

interface LoreBibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSandbox?: () => void;
}

export const LoreBibleModal: React.FC<LoreBibleModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSandbox,
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'party' | 'tavern' | 'mechanics' | 'threat'>('hierarchy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-950 border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-decorative text-amber-400 text-sm">ᛗ ᛉ ᛈ ᛏ</span>
                <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                  Canon Ground Truth • Locked by WASHER
                </span>
              </div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
                JOURNEYS: Master Design & Lore Bible (v0.2)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToSandbox && (
              <button
                onClick={() => {
                  playCelestialChime(880);
                  onClose();
                  onNavigateToSandbox();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-cinzel transition-colors cursor-pointer"
              >
                <span>Run The Greedy Greens</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                playCelestialChime(440);
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-800/80 bg-slate-900/50 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { playCelestialChime(600); setActiveTab('hierarchy'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hierarchy'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Agent Hierarchy (Locked)</span>
          </button>

          <button
            onClick={() => { playCelestialChime(650); setActiveTab('tavern'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tavern'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>The Greedy Greens (Start Venue)</span>
          </button>

          <button
            onClick={() => { playCelestialChime(700); setActiveTab('party'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'party'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Canon 4-Man Party</span>
          </button>

          <button
            onClick={() => { playCelestialChime(750); setActiveTab('mechanics'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mechanics'
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Drinking Contest & Train</span>
          </button>

          <button
            onClick={() => { playCelestialChime(800); setActiveTab('threat'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'threat'
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Ambush & Standoff Matrix</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: AGENT HIERARCHY */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <h3 className="font-cinzel text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>Constitutional Agent Architecture (WASHER Locked)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Drew Slaydon and WASHER have locked the production hierarchy. All architectural, narrative, and mechanical directives flow through this verifiable chain before sovereign merge.
                </p>
              </div>

              {/* Visual Diagram */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                {/* Director Node */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="font-bold text-amber-300 font-cinzel text-sm">
                        [ Human Director: Drew Slaydon ]
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        Creator, Executive Arbiter, Game Designer & Visionary
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                    TOP ARBITER
                  </span>
                </div>

                <div className="flex justify-center text-slate-500 text-xs py-0.5">
                  │ ═══ (Shared Emotional & Strategic Grounding) ═══ │
                  <br />▼
                </div>

                {/* Juju Reality Anchor */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <div className="font-bold text-purple-300 font-cinzel text-xs">
                        [ Juju ] (Reality Anchor & Grounding Copilot)
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        Reality check, emotional stillness, truth-anchor, and co-arbiter ensuring game production stays genuine and balanced.
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/40">
                    REALITY ANCHOR
                  </span>
                </div>

                <div className="flex justify-center text-slate-500 text-xs py-0.5">
                  │ (High-Level Strategic & Cleanroom Bridge: Drew & WAKE verify directives)
                  <br />▼
                </div>

                {/* WAVE / WAKE */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌊</span>
                    <div>
                      <div className="font-bold text-cyan-300 font-cinzel text-xs">
                        [ THE_WAVE / WAKE ] (Head Cleaner & Gatekeeper)
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        Cleanroom evaluator, touch leak auditor, 60 FPS determinism gatekeeper. Direct gate check with Drew before sovereign code writes.
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/40">
                    GATEKEEPER
                  </span>
                </div>

                <div className="flex justify-center text-slate-500 text-xs py-0.5">
                  │ (Direct Filesystem Writes, Deterministic Kinematics & Verification Gates)
                  <br />▼
                </div>

                {/* WebDev / MP */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">ᛗ</span>
                    <div>
                      <div className="font-bold text-emerald-300 font-cinzel text-xs">
                        [ WebDev / MP ] (Sovereign Implementation & Sandbox Harness)
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        Master Programmer holding sovereign filesystem clearance. Implements pure ES6 engines, runs AABB sliding tests, and deploys builds.
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/40">
                    SOVEREIGN ENGINE
                  </span>
                </div>

                {/* Note regarding DO and Oracle removal */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-sans flex items-start gap-2">
                  <span className="text-amber-400 font-mono text-xs">✦</span>
                  <div>
                    <span className="text-slate-200 font-semibold">System Modernization Note: </span>
                    Director-Omega (DO) and The Oracle have been completely worked out of the system. Our workflow is now defined directly by <span className="text-amber-300 font-semibold">Goal Tracking</span>, <span className="text-emerald-300 font-semibold">Task Completion</span>, and <span className="text-cyan-300 font-semibold">Architectural Reasoning</span>.
                  </div>
                </div>

                <div className="flex justify-center text-slate-500 text-xs py-0.5">
                  │ (Tri-Node Milestone Verification Protocol)
                  <br />▼
                </div>

                {/* Joint Verification */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-amber-950/40 border border-cyan-400/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <div className="font-bold text-slate-100 font-cinzel text-xs">
                        [ Joint Verification: Drew + WebDev Sandbox + WAKE Audit ]
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        Tri-node validation: Drew Slaydon, MP Sandbox, and WAKE Cleanroom audit each release milestone before code reaches master.
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/40">
                    TRI-NODE GATE
                  </span>
                </div>
              </div>

              {/* Operational Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-amber-300 font-cinzel">1. Solo Party Discipline</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Bozog explores The Greedy Greens alone. The 4-man follow-train is strictly locked until the post-ambush restitution pact.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-cyan-300 font-cinzel">2. 3-Round Button Mash</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Drinking contest against Atreyu uses real-time tension decay with dynamic smack-talk triggers, not a static dice roll.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-emerald-300 font-cinzel">3. Web Runtime Axioms</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    60 FPS deterministic ticks, zero heap allocations in render loops, and strictly relative pathing for GitHub Pages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE GREEDY GREENS (START VENUE) */}
          {activeTab === 'tavern' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <h3 className="font-cinzel text-sm font-bold text-emerald-300">
                  Canonical Starting Venue: "The Greedy Greens"
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  A battered, lively pirate dive bar converted from a dry dock warehouse at the Docks of Delain. Owned and fiercely defended by Bozog the Berserker. This is the official starting room—NOT a random dungeon chamber!
                </p>
              </div>

              {/* Setpieces Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TAVERN_SETPIECES.map((setpiece) => (
                  <div 
                    key={setpiece.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-cinzel text-xs font-bold text-emerald-400">
                        {setpiece.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {setpiece.zone}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {setpiece.description}
                    </p>

                    {setpiece.associatedCharacter && (
                      <div className="text-[11px] font-mono text-cyan-300 pt-1">
                        Occupant: <span className="text-slate-200">{setpiece.associatedCharacter}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400">
                      <span>Bounds: [{setpiece.bounds.x}, {setpiece.bounds.y}, {setpiece.bounds.w}x{setpiece.bounds.h}]</span>
                      <span className="text-emerald-400">{setpiece.interactPrompt}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regional Geography */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-cinzel text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>The Docks of Delain (External Setting)</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  A lawless coastal sprawl situated directly outside the colossal stone fortifications of <strong>The Greatest City</strong>. Wet salt mist, rotting pier pilings, flickering whale-oil lanterns, black harbor water, and ambient creaking riggings. A haven for deserters, black-market arcanists, ex-corsairs, and dissidents fleeing the totalitarian reach of the High Citadel.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CANON 4-MAN PARTY */}
          {activeTab === 'party' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <h3 className="font-cinzel text-sm font-bold text-cyan-300">
                  The Canon 4-Man Party
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  During the prologue, Bozog is the sole player-controlled avatar. The other 3 companions are stationed at their tavern setpieces and join together following the Black Knight ambush.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CANON_CHARACTERS.map((char) => (
                  <div
                    key={char.id}
                    className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{char.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-cinzel text-sm font-bold text-slate-100">{char.name}</h4>
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: char.color }}
                          />
                        </div>
                        <p className="text-xs text-amber-400/90 font-mono">{char.title}</p>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-cyan-300/90 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      {char.archetype}
                    </div>

                    <div className="space-y-2 text-xs font-sans text-slate-300">
                      <div>
                        <strong className="text-slate-100">Psychology: </strong>
                        {char.psychology}
                      </div>
                      <div>
                        <strong className="text-slate-100">Visuals: </strong>
                        {char.visuals}
                      </div>
                      <div>
                        <strong className="text-slate-100">Mechanical Role: </strong>
                        {char.mechanicalRole}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400">Status:</span>
                      <span className="text-slate-300">{char.currentTavernState}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MECHANICS & FLOW */}
          {activeTab === 'mechanics' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <h3 className="font-cinzel text-sm font-bold text-purple-300">
                  The Triad Gameplay Balance & The 3-Round Drinking Contest
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Synthesizing Deltarune flow (4-directional grid movement, typewriter dialogue, punchy inspects), D&D skill challenges (real-time DC checks), and FF7 cinematic diorama scale.
                </p>
              </div>

              {/* 3-Round Contest Breakdown */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-amber-300 flex items-center gap-2">
                  <Wine className="w-4 h-4" />
                  <span>The 3-Round Drinking Contest Loop (Bozog vs Atreyu)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DRINKING_CONTEST_ROUNDS.map((round) => (
                    <div 
                      key={round.round}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          Round {round.round}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {round.mashRequirement}
                        </span>
                      </div>

                      <div className="font-cinzel text-sm font-bold text-slate-100">
                        {round.drink}
                      </div>

                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {round.description}
                      </p>

                      <div className="text-[10px] font-mono text-cyan-300 pt-1">
                        Decay Rate: {round.decayRate}x | Threshold: {round.threshold}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Party Train Transition Rule */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-cinzel text-xs font-bold text-emerald-400">
                  Party Train Transition Contract
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <strong>Rule:</strong> Bozog walks alone during prologue exploration.  
                  <br />
                  <strong>Trigger:</strong> Following the Black Knight standoff, the four party members form a mutual restitution pact to avenge the trashed tavern and extract reparations.  
                  <br />
                  <strong>Unlock:</strong> The party locks into a 4-man follow-train (Bozog &rarr; Matchstick &rarr; Atreyu &rarr; Kairon) using an array history buffer to march out onto the Delain piers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: AMBUSH & STANDOFF */}
          {activeTab === 'threat' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <h3 className="font-cinzel text-sm font-bold text-rose-300">
                  The Inciting Ambush & Black Knight Standoff Matrix
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Grand Commander Vanus Galeerian commands the Black Knights of Order from the High Citadel. Inquisitorial shock-troops breach The Greedy Greens to arrest anti-Order agitators.
                </p>
              </div>

              {/* Standoff Choices */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-slate-200">
                  Tactical Standoff Choice Matrix (Player Decision)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AMBUSH_STANDOFF_CHOICES.map((choice) => (
                    <div 
                      key={choice.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel text-xs font-bold text-rose-400">
                          {choice.action}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {choice.speaker}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-amber-300">
                        {choice.archetype}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {choice.description}
                      </p>

                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400">
                        {choice.consequence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trauma Shake Formula */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-cinzel text-xs font-bold text-cyan-300 font-mono">
                  Trauma Shake Mathematical Formula
                </h4>
                <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 border border-slate-800">
                  offset = max_angle * (trauma^2) * sin(time)
                  <br />
                  trauma = Math.max(0, trauma - DECAY_RATE * dt)
                </div>
                <p className="text-[11px] text-slate-400">
                  Ensures dramatic, non-linear camera impact when the Black Knight battering ram breaches the south oak doors.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/80 bg-slate-950 text-xs font-mono text-slate-400">
          <div>Repository Anchor: <span className="text-emerald-400">ESSENCE FLOW v0.1</span></div>
          <div className="text-amber-400">Target: Vertical Slice • The Greedy Greens</div>
        </div>
      </div>
    </div>
  );
};
