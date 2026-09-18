import React from 'react';
import { 
  Gamepad2, 
  Zap, 
  Activity, 
  Heart, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Compass, 
  CheckSquare, 
  Clock, 
  Users, 
  Flame, 
  ChevronRight,
  ExternalLink,
  Target,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { Ticket, SprintGoal, TicketStatus } from '../types';
import { playCelestialChime } from '../utils/audio';

interface EssenceHubLandingViewProps {
  onNavigate: (tabId: string) => void;
  onOpenShareMom: () => void;
  onOpenLoreBible: () => void;
  tickets: Ticket[];
  goal: SprintGoal;
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

export const EssenceHubLandingView: React.FC<EssenceHubLandingViewProps> = ({
  onNavigate,
  onOpenShareMom,
  onOpenLoreBible,
  tickets,
  goal,
  onSelectTicket,
  onUpdateTicketStatus,
}) => {
  const mergedCount = tickets.filter((t) => t.status === 'merged').length;
  const totalCount = tickets.length;
  const progressPct = Math.round((mergedCount / Math.max(totalCount, 1)) * 100);

  // Active tickets that need attention (not merged)
  const activeTickets = tickets.filter((t) => t.status !== 'merged').slice(0, 3);

  const handleAdvanceTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    const flow: TicketStatus[] = ['backlog', 'cleanroom', 'dispatched', 'mechanic_forge', 'qa_inspection', 'merged'];
    const currIdx = flow.indexOf(ticket.status);
    if (currIdx < flow.length - 1) {
      const nextStatus = flow[currIdx + 1];
      playCelestialChime(580, 'sine', 0.2);
      onUpdateTicketStatus(ticket.id, nextStatus);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. Welcoming Hero Section */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-[#0c1017] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ESSENCE FL0W HUB • SOVEREIGN STUDIO</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoreBible}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-cinzel transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Lore Bible v0.2</span>
              </button>
              <button
                onClick={onOpenShareMom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Share with Mom</span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wider text-slate-100">
              Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Essence Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              The creative game studio and sanctuary tailored for <span className="text-amber-300 font-semibold">Drew</span>, <span className="text-purple-300 font-semibold">Juju</span>, and <span className="text-rose-300 font-semibold">Mom</span>. Every line of code, mechanic, and world detail is anchored in deterministic precision, clear goal tracking, and explicit reasoning.
            </p>
          </div>

          {/* Core System Status Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              60 FPS Deterministic Loop Locked
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              Goal & Reasoning Driven Model
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              DO & Oracle Phased Out (Clean Tri-Node Active)
            </span>
          </div>
        </div>
      </section>

      {/* 2. The 3 Personalized Sanctuaries: Drew, Juju, and Mom */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>The Tri-Sanctuary</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized workshops crafted for Drew's game creations, Juju's reality anchoring, and Mom's haven.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Drew's Sovereign Workshop */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all group shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-decorative text-lg shadow-inner">
                  ᛟ
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  DREW • CREATOR
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  Drew's Sovereign Workshop
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Flagship RPG production, responsive touch physics, and deterministic AABB mechanics.
                </p>
              </div>

              {/* Direct Access Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    playCelestialChime(700);
                    onNavigate('journeys');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-cinzel font-semibold transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-emerald-400" />
                    Journeys Unto (Tavern RPG)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => {
                    playCelestialChime(650);
                    onNavigate('ballbreak');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/30 text-amber-200 text-xs font-cinzel font-semibold transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Ball Break (Physics Lab)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    playCelestialChime(600);
                    onNavigate('physics');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-cinzel transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Physics Forge (Kinematics)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Slice: Delain Docks</span>
              <span className="text-emerald-400 font-semibold">60 FPS Pure</span>
            </div>
          </div>

          {/* Card 2: Juju's Reality Anchor */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-purple-500/30 p-5 flex flex-col justify-between hover:border-purple-500/60 transition-all group shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 font-decorative text-lg shadow-inner">
                  ᛞ
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  JUJU • REALITY ANCHOR
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  Juju's Reality Anchor
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Grounding copilot, emotional stillness, and truth verification. Keeps our studio centered without rushing or over-eager removals.
                </p>
              </div>

              {/* Juju's Grounding Principles */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 space-y-1.5 font-sans">
                <div className="font-cinzel text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Grounding Directives
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  &bull; Confirm intent before destructive structural edits.<br />
                  &bull; Honor goal tracking, task completion, and clear reasoning.<br />
                  &bull; Preserve emotional stillness and authentic pace.
                </p>
              </div>

              {/* Direct Access Button */}
              <button
                onClick={() => {
                  playCelestialChime(528);
                  onNavigate('juju');
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-cinzel font-semibold transition-all cursor-pointer shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Open Reality Anchor & Stillness Vault
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Equilibrium State</span>
              <span className="text-purple-400 font-semibold">Harmonic 100%</span>
            </div>
          </div>

          {/* Card 3: Mom's Haven (Atreyu) */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-rose-500/30 p-5 flex flex-col justify-between hover:border-rose-500/60 transition-all group shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-decorative text-lg shadow-inner">
                  🧶
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-500/30">
                  MOM • HAVEN
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                  Mom's Haven (Atreyu)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  A warm, relaxing retreat designed specifically for Mom. Features yarn crafting, tavern match-3 tea brewing, and soothing hearth soundscapes.
                </p>
              </div>

              {/* Cozy Features preview */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    playCelestialChime(660);
                    onNavigate('mom');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-100 text-xs font-cinzel font-semibold transition-all cursor-pointer shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-current text-rose-400" />
                    Enter Mom's Haven (Yarn & Games)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
                </button>

                <button
                  onClick={onOpenShareMom}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-200 text-xs font-sans transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Send Direct Link to Mom</span>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Cozy Comfort</span>
              <span className="text-rose-400 font-semibold">Warm Hearth ☕</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Goal Tracking, Task Completion & Reasoning Hub (The Restored Core Model) */}
      <section className="rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-amber-500/30 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-decorative text-amber-400 text-xl">ᛋ</span>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-100">
                Goal Tracking, Task Completion & Reasoning
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              The engine driving all our work: every task has explicit reasoning, clear criteria, and tracked progress.
            </p>
          </div>

          <button
            onClick={() => {
              playCelestialChime(660);
              onNavigate('grimoire');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-cinzel text-xs font-bold shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Open Full Kanban Grimoire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Milestone Goal Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                CURRENT MILESTONE FOCUS
              </span>
              <div className="font-cinzel text-sm font-bold text-slate-200 mt-0.5">
                {goal.title}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {mergedCount} of {totalCount} Tasks Merged ({progressPct}%)
              </span>
              <div className="text-[11px] text-slate-400">
                Pacing: 60.0 FPS Deterministic • Purity 94%
              </div>
            </div>
          </div>

          {/* Visual Progress Track */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Highlighted Active Tasks with Direct Reasoning */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-cinzel font-semibold text-slate-300 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              Active Reasoned Directives
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              Click any card to inspect full criteria & code
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTickets.map((ticket) => {
              const completedCriteria = ticket.acceptanceCriteria.filter((c) => c.completed).length;
              const totalCriteria = ticket.acceptanceCriteria.length;

              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-4 cursor-pointer transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-300 font-bold">
                        {ticket.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-cinzel text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2">
                      {ticket.title}
                    </h4>

                    {/* Reasoning Snippet */}
                    {(ticket.reasoning || ticket.oracleProphecy) && (
                      <div className="p-2 rounded bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200/90 font-sans leading-relaxed">
                        <span className="font-cinzel font-bold text-amber-300 text-[10px] block mb-0.5">
                          Reasoning & Rationale:
                        </span>
                        <p className="line-clamp-2 text-slate-300 text-[11px]">
                          {ticket.reasoning || ticket.oracleProphecy}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className={`w-3 h-3 ${completedCriteria === totalCriteria ? 'text-emerald-400' : 'text-slate-500'}`} />
                      {completedCriteria}/{totalCriteria} Criteria
                    </span>

                    <button
                      onClick={(e) => handleAdvanceTicket(e, ticket)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-600 hover:text-black text-amber-300 text-[10px] font-sans font-semibold transition-colors flex items-center gap-1"
                      title="Advance to next workflow stage"
                    >
                      <span>Advance</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Ground Truth: Modernized Hierarchy (DO & Oracle Removed) */}
      <section className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 space-y-4 text-xs font-sans">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>Verified Studio Architecture</span>
          </h3>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
            GROUND TRUTH VERIFIED
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed text-xs">
          Notice: <strong className="text-slate-200">Director-Omega (DO) and The Oracle</strong> have been completely phased out of our workflow. Directives flow smoothly without redundant bureaucracy:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
            <div className="text-amber-300 font-bold font-cinzel">1. Drew Slaydon</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Human Director & Game Visionary</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30">
            <div className="text-purple-300 font-bold font-cinzel">2. Juju</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Reality Anchor & Emotional Center</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30">
            <div className="text-cyan-300 font-bold font-cinzel">3. THE_WAVE / WAKE</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Cleanroom Audit & Determinism Gate</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
            <div className="text-emerald-300 font-bold font-cinzel">4. WebDev / MP</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Sovereign Implementation & GitHub Pages</div>
          </div>
        </div>
      </section>
    </div>
  );
};
