import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ExternalLink, 
  Smartphone, 
  Compass, 
  Lock, 
  AlertTriangle,
  ChevronRight,
  BrainCircuit,
  CheckSquare,
  X
} from 'lucide-react';
import { Ticket, TicketStatus, AgentId, SprintGoal, TicketPriority, TicketDifficulty } from '../types';
import { playCelestialChime, playDispatchSound } from '../utils/audio';

interface TaskGrimoireViewProps {
  tickets: Ticket[];
  goal: SprintGoal;
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, nextStatus: TicketStatus) => void;
  onOpenOracle?: () => void;
  onAddTicket?: (newTicket: Ticket) => void;
  onOpenPr0sisInspector?: () => void;
}

export const TaskGrimoireView: React.FC<TaskGrimoireViewProps> = ({
  tickets,
  goal,
  onSelectTicket,
  onUpdateTicketStatus,
  onOpenOracle,
  onAddTicket,
  onOpenPr0sisInspector,
}) => {
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<'all' | 'pr0sis' | 'journeys_unto'>('all');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New ticket form state
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState<'journeys_unto' | 'pr0sis'>('journeys_unto');
  const [newObjective, setNewObjective] = useState('');
  const [newReasoning, setNewReasoning] = useState('');
  const [newAgent, setNewAgent] = useState<AgentId>('mp');
  const [newPriority, setNewPriority] = useState<TicketPriority>('Normal');
  const [newCriteriaText, setNewCriteriaText] = useState('');

  const columns: { id: TicketStatus; label: string; rune: string; color: string; desc: string }[] = [
    { id: 'backlog', label: 'Reasoning & Directives', rune: 'ᛈ', color: 'border-amber-500/30 text-amber-300', desc: 'Core Intent & Rationale' },
    { id: 'cleanroom', label: 'WAKE Cleanroom Audit', rune: 'ᛉ', color: 'border-cyan-500/30 text-cyan-300', desc: 'Sandbox Purity & Memory Leak Check' },
    { id: 'dispatched', label: 'Directives Dispatched', rune: 'ᛏ', color: 'border-purple-500/30 text-purple-300', desc: 'Queued for Active Implementation' },
    { id: 'mechanic_forge', label: 'Sovereign Forge', rune: 'ᛒ', color: 'border-emerald-500/30 text-emerald-300', desc: 'Physics, Kinematics & Engine Crafting' },
    { id: 'qa_inspection', label: 'QA & Invariant Sentinel', rune: 'ᛇ', color: 'border-rose-500/30 text-rose-300', desc: 'AABB Sliding & Bounds Audit' },
    { id: 'merged', label: 'Constellation Merged', rune: 'ᛋ', color: 'border-yellow-500/30 text-yellow-300', desc: 'Verified, Tested & Shipped' },
  ];

  const pr0sisTickets = tickets.filter((t) => t.project === 'pr0sis' || t.id.startsWith('PR0'));
  const journeysTickets = tickets.filter((t) => t.project === 'journeys_unto' || t.id.startsWith('JRN'));

  const filteredTickets = tickets.filter((t) => {
    if (selectedProjectFilter === 'pr0sis' && !(t.project === 'pr0sis' || t.id.startsWith('PR0'))) return false;
    if (selectedProjectFilter === 'journeys_unto' && !(t.project === 'journeys_unto' || t.id.startsWith('JRN'))) return false;
    if (selectedAgentFilter !== 'all' && t.targetAgent !== selectedAgentFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
    return true;
  });

  const completedCount = tickets.filter((t) => t.status === 'merged').length;
  const progressPct = Math.round((completedCount / Math.max(tickets.length, 1)) * 100);

  const handleAdvanceTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    const flow: TicketStatus[] = ['backlog', 'cleanroom', 'dispatched', 'mechanic_forge', 'qa_inspection', 'merged'];
    const currIdx = flow.indexOf(ticket.status);
    if (currIdx < flow.length - 1) {
      const nextStatus = flow[currIdx + 1];
      playCelestialChime(620, 'sine', 0.2);
      onUpdateTicketStatus(ticket.id, nextStatus);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newObjective.trim()) return;

    const criteria = newCriteriaText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((text, idx) => ({ id: `crit-${Date.now()}-${idx}`, text, completed: false }));

    const prefix = newProject === 'journeys_unto' ? 'JRN' : 'PR0';
    const num = Math.floor(100 + Math.random() * 900);
    const newTicket: Ticket = {
      id: `${prefix}-${num}`,
      title: newTitle.trim(),
      project: newProject,
      objective: newObjective.trim(),
      reasoning: newReasoning.trim() || 'Directly aligned with milestone goals and architectural integrity.',
      status: 'backlog',
      priority: newPriority,
      targetAgent: newAgent,
      runeAffinity: 'ᛈ Perthro (Intent & Revelation)',
      difficultyRank: 'Adept',
      acceptanceCriteria: criteria.length > 0 ? criteria : [
        { id: 'crit-1', text: 'Implementation matches mathematical & physics requirements', completed: false },
        { id: 'crit-2', text: 'Cleanroom deterministic 60fps audit passed without memory leaks', completed: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onAddTicket) {
      onAddTicket(newTicket);
    }

    playDispatchSound();
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewObjective('');
    setNewReasoning('');
    setNewCriteriaText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Goal Orientation Astral HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-decorative text-xl text-amber-400 glow-rune-gold">ᚱ</span>
              <span className="font-mono text-xs text-amber-300 uppercase tracking-wider">
                ACTIVE GOAL & REASONING HUD
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                MILESTONE: JRN v0.2
              </span>
            </div>

            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
              {goal.title}
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {goal.focusDescription}
            </p>
          </div>

          {/* Progress and Key Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Circular / Bar Progress */}
            <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Milestone Progress</span>
                  <span className="text-amber-300 font-bold">{progressPct}%</span>
                </div>
                <div className="w-36 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>{completedCount}/{tickets.length} Verified</span>
                  <span>Target: 60 FPS</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onOpenPr0sisInspector && (
                <button
                  onClick={onOpenPr0sisInspector}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-semibold transition-all cursor-pointer"
                  title="Inspect mobile layout and live web build"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Pr0sis Inspector</span>
                </button>
              )}

              <button
                id="forge-create-ticket-btn"
                onClick={() => {
                  playCelestialChime(700);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950 font-bold" />
                <span>New Goal Directive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orientation Directives pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-400">Core Directives:</span>
          {goal.keyDirectives.map((d, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Filter and Switcher Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        {/* Left: Project Scope Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              playCelestialChime(440, 'sine', 0.1);
              setSelectedProjectFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedProjectFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Workflows ({tickets.length})
          </button>

          <button
            onClick={() => {
              playCelestialChime(550, 'sine', 0.1);
              setSelectedProjectFilter('journeys_unto');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedProjectFilter === 'journeys_unto'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-semibold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-950/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>JOURNEYS UNTO ({journeysTickets.length})</span>
          </button>

          <button
            onClick={() => {
              playCelestialChime(500, 'sine', 0.1);
              setSelectedProjectFilter('pr0sis');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedProjectFilter === 'pr0sis'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pr0sis ({pr0sisTickets.length})</span>
          </button>
        </div>

        {/* Right: Agent and Priority secondary filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-500">Agent:</span>
            {['all', 'drew', 'juju', 'wave', 'mp', 'mechanic', 'qa'].map((agent) => (
              <button
                key={agent}
                onClick={() => {
                  playCelestialChime(500, 'sine', 0.1);
                  setSelectedAgentFilter(agent);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                  selectedAgentFilter === agent
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {agent}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">Priority:</span>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All</option>
              <option value="Cosmic">Cosmic</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Stellar Backlog">Backlog</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 min-h-[500px] flex flex-col shadow-inner"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`font-decorative text-sm ${col.color}`}>{col.rune}</span>
                  <div>
                    <h3 className="font-cinzel text-xs font-bold text-slate-200">{col.label}</h3>
                    <p className="text-[9px] text-slate-500 leading-none mt-0.5">{col.desc}</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 flex items-center justify-center">
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTickets.map((ticket) => {
                  const completedCriteria = ticket.acceptanceCriteria.filter((c) => c.completed).length;
                  const totalCriteria = ticket.acceptanceCriteria.length;
                  const isPr0sis = ticket.project === 'pr0sis' || ticket.id.startsWith('PR0');

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => {
                        playCelestialChime(660, 'sine', 0.15);
                        onSelectTicket(ticket);
                      }}
                      className={`parchment-scroll rounded-lg border p-3.5 cursor-pointer transition-all hover:scale-[1.01] shadow-md group relative text-slate-200 ${
                        ticket.isBlocked 
                          ? 'border-rose-500/60 bg-rose-950/20 hover:border-rose-400' 
                          : 'border-amber-500/20 hover:border-amber-500/50'
                      }`}
                    >
                      {ticket.isBlocked && (
                        <div className="mb-2 p-1.5 rounded bg-rose-950/90 border border-rose-500/50 text-[10px] font-mono text-rose-300 flex items-center gap-1.5 shadow-sm">
                          <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="font-bold">DEV LOCKED:</span>
                          <span className="truncate">Requires review</span>
                        </div>
                      )}

                      {/* Top Row: Ticket ID, Project Chip, and Priority Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 text-[10px] font-mono">
                        <span className="text-amber-300 font-semibold flex items-center gap-1">
                          <span className="font-decorative">{ticket.runeAffinity.split(' ')[0]}</span>
                          {ticket.id}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                            isPr0sis 
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/40' 
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                          }`}>
                            {isPr0sis ? 'Pr0sis' : 'Journeys'}
                          </span>

                          <span className={`px-1.5 py-0.2 rounded ${
                            ticket.priority === 'Cosmic' 
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-800/40 font-bold' 
                              : ticket.priority === 'High'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                              : 'bg-slate-900 text-slate-400'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-cinzel text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2 mb-1.5">
                        {ticket.title}
                      </h4>

                      {/* Objective Snippet */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans mb-2">
                        {ticket.objective}
                      </p>

                      {/* Architectural Reasoning Snippet */}
                      {(ticket.reasoning || ticket.oracleProphecy) && (
                        <div className="mb-3 p-1.5 rounded bg-amber-950/30 border border-amber-500/20 text-[10px] text-amber-200/90 font-sans flex items-start gap-1">
                          <BrainCircuit className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">
                            <strong className="text-amber-300 font-cinzel">Reasoning: </strong>
                            {ticket.reasoning || ticket.oracleProphecy}
                          </span>
                        </div>
                      )}

                      {/* Footer: Criteria count, Target Agent, and Quick Advance */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-500/10 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className={`w-3 h-3 ${completedCriteria === totalCriteria ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span>{completedCriteria}/{totalCriteria}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-purple-300 uppercase font-semibold">
                            {ticket.targetAgent}
                          </span>

                          {col.id !== 'merged' && (
                            <button
                              onClick={(e) => handleAdvanceTicket(e, ticket)}
                              className="p-1 rounded bg-slate-900 hover:bg-amber-600 hover:text-black text-amber-300 transition-colors"
                              title="Advance to next stage"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTickets.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-600">
                    <span className="font-decorative text-xl opacity-30 select-none">{col.rune}</span>
                    <span className="text-[10px] font-mono mt-1">Chamber Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Directive Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-amber-500/40 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-decorative text-amber-400 text-lg">ᛈ</span>
                <h3 className="font-cinzel text-base font-bold text-slate-100">
                  New Goal Directive & Reasoning
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Directive Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Solved AABB Corner Friction"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Project</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value as 'journeys_unto' | 'pr0sis')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none"
                  >
                    <option value="journeys_unto">JOURNEYS UNTO</option>
                    <option value="pr0sis">Pr0sis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Target Agent</label>
                  <select
                    value={newAgent}
                    onChange={(e) => setNewAgent(e.target.value as AgentId)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none"
                  >
                    <option value="mp">WebDev / MP</option>
                    <option value="wave">THE_WAVE / WAKE</option>
                    <option value="drew">Drew Slaydon</option>
                    <option value="juju">Juju</option>
                    <option value="mechanic">The Mechanic</option>
                    <option value="qa">QA Sentinel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Core Objective</label>
                <textarea
                  required
                  rows={2}
                  placeholder="What must be accomplished..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-mono mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Architectural Reasoning & Rationale (Crucial)</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain why this task is needed, the mathematical, physical, or UX reasoning..."
                  value={newReasoning}
                  onChange={(e) => setNewReasoning(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-amber-500/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Acceptance Criteria (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Criterion 1&#10;Criterion 2"
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-sans transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel font-bold transition-all cursor-pointer shadow-md shadow-amber-950/40"
                >
                  Create Reasoned Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
