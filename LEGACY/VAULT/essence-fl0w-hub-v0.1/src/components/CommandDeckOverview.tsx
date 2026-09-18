import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Wand2, 
  Cpu, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  GitBranch,
  Smartphone,
  ExternalLink,
  Gamepad2,
  Compass,
  AlertCircle,
  Lock,
  AlertTriangle,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { AgentProfile, Ticket, SprintGoal, GitRepoState } from '../types';
import { playCelestialChime, playDispatchSound } from '../utils/audio';
import { BlueprintLoggerPanel } from './BlueprintLoggerPanel';

interface CommandDeckOverviewProps {
  agents: AgentProfile[];
  tickets: Ticket[];
  goal: SprintGoal;
  gitState: GitRepoState;
  onNavigateTab: (tab: string) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onOpenPr0sisInspector: () => void;
}

export const CommandDeckOverview: React.FC<CommandDeckOverviewProps> = ({
  agents,
  tickets,
  goal,
  gitState,
  onNavigateTab,
  onSelectTicket,
  onOpenPr0sisInspector,
}) => {
  const [ticketProjectFilter, setTicketProjectFilter] = useState<'all' | 'pr0sis' | 'journeys_unto'>('all');

  const pipelineStages = [
    { id: 'oracle', name: '1. ORACLE Divination', rune: 'ᛈ', agent: 'oracle', count: tickets.filter(t => t.status === 'backlog').length, tab: 'oracle', color: 'border-amber-500/40 text-amber-300' },
    { id: 'wave', name: '2. WAVE Cleanroom', rune: 'ᛉ', agent: 'wave', count: tickets.filter(t => t.status === 'cleanroom').length, tab: 'wave', color: 'border-cyan-500/40 text-cyan-300' },
    { id: 'omega', name: '3. OMEGA Dispatch', rune: 'ᛏ', agent: 'omega', count: tickets.filter(t => t.status === 'dispatched').length, tab: 'board', color: 'border-purple-500/40 text-purple-300' },
    { id: 'mechanic', name: '4. Mechanic Forge', rune: 'ᛒ', agent: 'mechanic', count: tickets.filter(t => t.status === 'mechanic_forge').length, tab: 'physics', color: 'border-emerald-500/40 text-emerald-300' },
    { id: 'qa', name: '5. QA Sentinel', rune: 'ᛇ', agent: 'qa', count: tickets.filter(t => t.status === 'qa_inspection').length, tab: 'board', color: 'border-rose-500/40 text-rose-300' },
    { id: 'merged', name: '6. Git Merged', rune: 'ᛋ', agent: 'omega', count: tickets.filter(t => t.status === 'merged').length, tab: 'bridge', color: 'border-yellow-500/40 text-yellow-300' },
  ];

  const pr0sisTickets = tickets.filter(t => t.project === 'pr0sis' || t.id.startsWith('PR0'));
  const journeysTickets = tickets.filter(t => t.project === 'journeys_unto' || t.id.startsWith('JRN'));

  const displayedTickets = tickets.filter(t => {
    if (ticketProjectFilter === 'pr0sis') return t.project === 'pr0sis' || t.id.startsWith('PR0');
    if (ticketProjectFilter === 'journeys_unto') return t.project === 'journeys_unto' || t.id.startsWith('JRN');
    return true;
  }).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Active Workdesk Focus Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0d1222] to-slate-950 border border-cyan-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="font-decorative text-2xl text-cyan-400 glow-rune">ᛉ ᛈ ᛏ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
              Drew Slaydon&apos;s Active Workdesk • ESSENCE FL0W HUB v0.1
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wide">
            Automated Web Game Development Command Deck
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Orchestrating Cloud agents via Gemini API (<span className="text-cyan-300 font-semibold">WAVE</span> Cleanroom & <span className="text-amber-300 font-semibold">ORACLE</span> Ticket Diviner) with local machine specialists (<span className="text-purple-300 font-semibold">Director OMEGA</span>, <span className="text-emerald-300 font-semibold">The Mechanic/Physicist</span>, and <span className="text-rose-300 font-semibold">QA Sentinel</span>) linked to your repository.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-ballbreak-btn"
              onClick={() => { playCelestialChime(880); onNavigateTab('ballbreak'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-cinzel text-xs font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer group"
            >
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Ball Break (Mobile Physics Lab)</span>
            </button>

            <button
              id="hero-journeys-sandbox-btn"
              onClick={() => { playCelestialChime(880); onNavigateTab('journeys'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-cinzel text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer group"
            >
              <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Run Journeys Proof of Life</span>
            </button>

            <button
              id="workdesk-pr0sis-inspector-btn"
              onClick={() => { playCelestialChime(800); onOpenPr0sisInspector(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer group"
            >
              <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Pr0sis Mobile Inspector</span>
            </button>

            <button
              id="hero-divine-btn"
              onClick={() => { playCelestialChime(700); onNavigateTab('oracle'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Divine JOURNEYS UNTO v2 Ticket</span>
            </button>

            <button
              id="hero-cleanroom-btn"
              onClick={() => { playCelestialChime(750); onNavigateTab('wave'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-cinzel text-xs font-bold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>WAVE Cleanroom Chamber</span>
            </button>
          </div>
        </div>

        {/* Ambient Runic Watermark */}
        <div className="absolute top-1/2 -right-12 -translate-y-1/2 select-none pointer-events-none opacity-10">
          <span className="font-decorative text-[160px] text-cyan-200">ᛋ</span>
        </div>
      </div>

      {/* The Sovereign Circle: Mom (Atreyu) & Juju (Reality Anchor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mom Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border-2 border-rose-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between group hover:border-rose-500/60 transition-all">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shadow-md">
                🧶
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-rose-200">
                    Mom's Haven (Atreyu)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                    MOM FIRST
                  </span>
                </div>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  Playable Yarn Match-3, Word Weaver, Loom, and Atreyu Lore
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            A cozy, warm, zero-jargon gaming space designed for Mom. Instant tactile puzzles and interactive tavern camaraderie with Bozog.
          </p>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-rose-900/30">
            <span className="text-[11px] font-mono text-rose-300 flex items-center gap-1">
              <span>🌸</span> Status: Ready to Play
            </span>
            <button
              onClick={() => { playCelestialChime(700); onNavigateTab('mom'); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <span>Enter Mom's Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Juju Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 border-2 border-purple-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/60 transition-all">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shadow-md">
                💜
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-purple-200">
                    Juju's Reality Anchor
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                    PARTNER COMPASS
                  </span>
                </div>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  Outside Model Intelligence & Human Authenticity Veto
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            External model datapoints that steer basically everything we do. The ultimate human sanity check: <em>If Mom and Juju aren't happy, we figure it out.</em>
          </p>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-purple-900/30">
            <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
              <span>⚖️</span> Alignment: Aligned
            </span>
            <button
              onClick={() => { playCelestialChime(700); onNavigateTab('juju'); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <span>View Juju's Compass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Project Spotlights: Pr0sis & JOURNEYS UNTO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project 1: Pr0sis */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-slate-900/90 to-slate-950/90 border border-cyan-500/40 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-decorative text-xl text-cyan-400 glow-rune">ᛉ</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-slate-100">Project: Pr0sis</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    Live for PC
                  </span>
                </div>
                <p className="text-xs text-amber-300 flex items-center gap-1 font-mono mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Active Priority: Fix Mobile Formatting & Viewport Breakdown
                </p>
              </div>
            </div>

            <a
              href="https://drewslaydon-maker.github.io/Essence-Designs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono transition-colors"
            >
              <span>Live Build</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The PC release is operational on GitHub Pages, but mobile viewports currently experience horizontal layout squishing, touch event delay, and canvas aspect ratio distortion.
          </p>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Mobile Stabilization Invariants:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Eliminate overflow-x wobble</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>viewport-fit=cover & 100dvh</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>touch-action: manipulation</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>44px min tap targets</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => { playCelestialChime(700); onOpenPr0sisInspector(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-cinzel font-semibold transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Simulator & Fix Diagnostics</span>
            </button>

            <button
              onClick={() => {
                setTicketProjectFilter('pr0sis');
                onNavigateTab('board');
              }}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Pr0sis Tickets ({pr0sisTickets.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Project 2: JOURNEYS UNTO */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-950/90 border border-amber-500/40 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-950 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-decorative text-xl text-amber-400 glow-rune-gold">ᚱ</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-slate-100">Project: JOURNEYS UNTO</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/40">
                    Main Sprint Goal
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 font-mono mt-0.5">
                  Implementing v2 Blueprint for the Start of the Game
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300">
              v2.0 Architectural Inception
            </span>
          </div>

          {/* Active Directive Banner: Aider Online */}
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs font-mono text-emerald-200 flex items-start gap-3 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-emerald-300 uppercase tracking-wider">
                  DIRECTIVE: Create pure ES-module kinematic physics controller
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-100 text-[10px] font-bold border border-emerald-500/60 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AIDER ONLINE
                </span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Aider conduit is fully operational. Proceeding with the MechPhys directive: pure ES-module kinematic physics controller with mass-inertia integration, drag deceleration, and zero external side-effects.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Constructing the foundational v2 blueprint for the opening prologue of JOURNEYS UNTO: game director state machine, world origin scene graph, pure ES-module kinematic controller, and chronicle dialogue engine.
          </p>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Core v2 Blueprint Subsystems:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>GameDirector boot state loop</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>World origin entity registry</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-1">
                <div className="flex items-center gap-2 truncate">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Kinematic Controller (ES-Module)</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600">
                  ACTIVE
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Prologue narrative chronicle</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => { playCelestialChime(880); onNavigateTab('journeys'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black text-xs font-cinzel font-bold transition-all shadow-md cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Run Proof of Life in Sandbox</span>
            </button>

            <button
              onClick={() => { playCelestialChime(750); onNavigateTab('oracle'); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-cinzel font-bold transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Divine Next Subsystem</span>
            </button>

            <button
              onClick={() => {
                setTicketProjectFilter('journeys_unto');
                onNavigateTab('board');
              }}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View JOURNEYS UNTO Tickets ({journeysTickets.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Director-OMEGA Invariant Blueprint Logger Component */}
      <BlueprintLoggerPanel />

      {/* The 6-Stage Creative Flow Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-decorative text-lg text-amber-400">ᚱ</span>
            <h3 className="font-cinzel text-base font-bold text-slate-100">
              Seamless Cloud ⇄ Local Creative Flow Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any stage to enter workstation
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.id}
              onClick={() => {
                playCelestialChime(500 + idx * 80, 'sine', 0.15);
                onNavigateTab(stage.tab);
              }}
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-decorative text-lg text-amber-400 group-hover:scale-110 transition-transform">
                    {stage.rune}
                  </span>
                  <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-900 border border-slate-800 text-slate-300">
                    {stage.count} tickets
                  </span>
                </div>
                <div className="font-cinzel text-xs font-bold text-slate-200 group-hover:text-cyan-200">
                  {stage.name}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/80 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Advance</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agents Constellation Grid & Quick Dossier */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-decorative text-lg text-purple-400 glow-rune-violet">ᛗ</span>
            <h3 className="font-cinzel text-base font-bold text-slate-100">
              The 5 AI Guardians Supporting Drew Slaydon
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('agents')}
            className="text-xs font-cinzel text-cyan-300 hover:text-cyan-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Enter Agent Sanctum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onNavigateTab('agents')}
              className="p-4 rounded-xl parchment-scroll border border-slate-700/80 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                    agent.realm === 'cloud'
                      ? 'bg-cyan-950/60 border-cyan-800/40 text-cyan-300'
                      : 'bg-purple-950/60 border-purple-800/40 text-purple-300'
                  }`}>
                    {agent.realm === 'cloud' ? '☁ Cloud' : '🖥 Local'}
                  </span>
                  <span className="font-decorative text-lg text-amber-400 group-hover:rotate-12 transition-transform">
                    {agent.rune}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{agent.avatarSymbol}</span>
                  <h4 className="font-cinzel text-xs font-bold text-slate-100">{agent.name}</h4>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-sans mb-3">
                  {agent.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-amber-500/15">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="text-slate-500 font-serif">{agent.runeName.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Orientation & Active Project Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Goal Orientation (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-decorative text-base text-amber-400">ᚱ</span>
              <h3 className="font-cinzel text-sm font-bold text-slate-100">
                Sprint Goal: {goal.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">{goal.currentAvgFPS} FPS Target</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {goal.description}
          </p>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Essential Alignment Directives:
            </div>
            {goal.keyDirectives.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('board')}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-cinzel font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Open Task Grimoire Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Active Project Engineering Tickets (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-decorative text-base text-cyan-400">ᛈ</span>
              <h3 className="font-cinzel text-sm font-bold text-slate-100">
                Active Engineering Tickets
              </h3>
            </div>

            {/* Filter Pills: All, Pr0sis, JOURNEYS UNTO */}
            <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setTicketProjectFilter('all')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  ticketProjectFilter === 'all' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTicketProjectFilter('pr0sis')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  ticketProjectFilter === 'pr0sis' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pr0sis
              </button>
              <button
                onClick={() => setTicketProjectFilter('journeys_unto')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  ticketProjectFilter === 'journeys_unto' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JOURNEYS UNTO
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {displayedTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => { playCelestialChime(660); onSelectTicket(t); }}
                className="p-3 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-colors cursor-pointer flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-300 font-bold">{t.id}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      t.project === 'pr0sis' || t.id.startsWith('PR0')
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    }`}>
                      {t.project === 'pr0sis' || t.id.startsWith('PR0') ? 'Pr0sis' : 'JOURNEYS UNTO'}
                    </span>
                    <span className="text-slate-200 font-cinzel font-semibold line-clamp-1">{t.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">{t.objective}</p>
                </div>

                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-900 border border-slate-800 text-cyan-300 shrink-0">
                  {t.targetAgent.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
