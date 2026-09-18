import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Terminal, 
  Check, 
  Copy, 
  Cpu, 
  Compass, 
  ChevronRight,
  Zap,
  BookmarkPlus
} from 'lucide-react';
import { Ticket, AgentId, SprintGoal } from '../types';
import { playRuneCastSound, playDispatchSound, playCelestialChime } from '../utils/audio';

interface OracleDivinerViewProps {
  goal: SprintGoal;
  onAddTicket: (ticket: Ticket) => void;
  onNavigateToBoard: () => void;
}

export const OracleDivinerView: React.FC<OracleDivinerViewProps> = ({
  goal,
  onAddTicket,
  onNavigateToBoard,
}) => {
  const [idea, setIdea] = useState('');
  const [gameGenre, setGameGenre] = useState('JOURNEYS UNTO v2 Blueprint (Web Game) / Pr0sis Mobile');
  const [targetAgent, setTargetAgent] = useState<'Mechanic' | 'QA Agent' | 'Director OMEGA'>('Mechanic');
  const [priority, setPriority] = useState<'Cosmic' | 'High' | 'Normal' | 'Stellar Backlog'>('High');
  const [loading, setLoading] = useState(false);
  const [divinedTicket, setDivinedTicket] = useState<any | null>(null);
  const [enshrined, setEnshrined] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    {
      title: 'JOURNEYS UNTO: v2 Game Start State Machine',
      genre: 'JOURNEYS UNTO v2 Blueprint',
      agent: 'Mechanic' as const,
      prompt: 'Implement the JOURNEYS UNTO v2 blueprint game start state machine with decoupled update(dt) fixed timestep, asset preloading, and transition from title screen to the prologue in-game scene.',
    },
    {
      title: 'Pr0sis: Mobile Viewport & Overflow Elimination',
      genre: 'Pr0sis Mobile Optimization',
      agent: 'QA Agent' as const,
      prompt: 'Audit and resolve mobile formatting squishing on live Pr0sis (https://drewslaydon-maker.github.io/Essence-Designs/): enforce overflow-x hidden, viewport-fit=cover, and 100dvh dynamic container height.',
    },
    {
      title: 'JOURNEYS UNTO: Player Character Controller',
      genre: 'JOURNEYS UNTO v2 Blueprint',
      agent: 'Mechanic' as const,
      prompt: 'Construct the v2 blueprint character controller for JOURNEYS UNTO: 8-directional movement with vector normalization, smooth velocity dampening (lerp), and unified Keyboard, Gamepad, and Touch D-pad abstraction.',
    },
    {
      title: 'Pr0sis: Mobile Touch & Tap Latency Fix',
      genre: 'Pr0sis Mobile Optimization',
      agent: 'QA Agent' as const,
      prompt: 'Map touchstart/touchmove listeners with touch-action: manipulation to eliminate the 300ms mobile tap delay on Pr0sis, and enforce minimum 44px touch targets on all interactive runes.',
    },
    {
      title: 'JOURNEYS UNTO: World Origin Entity Registry',
      genre: 'JOURNEYS UNTO v2 Blueprint',
      agent: 'Mechanic' as const,
      prompt: 'Build the lightweight Entity-Component scene graph and world origin coordinate space for the starting zone of JOURNEYS UNTO with camera tracking.',
    },
    {
      title: 'Pr0sis: High-DPI Canvas Retina Scaling (DPR)',
      genre: 'Pr0sis Mobile Optimization',
      agent: 'Mechanic' as const,
      prompt: 'Implement devicePixelRatio backing store scaling capped at 2.0 with letterbox aspect ratio preservation to ensure Pr0sis renders crystal clear on mobile Retina/AMOLED displays without frame drops.',
    },
  ];

  const handleDivine = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setEnshrined(false);
    playRuneCastSound();

    try {
      const res = await fetch('/api/agents/oracle/divine-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          gameGenre,
          targetAgent,
          priority,
          sprintGoal: goal.title,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to divine ticket from ORACLE.');
      }

      setDivinedTicket(data.ticket);
      playCelestialChime(880, 'triangle', 0.6);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Oracle connection error. Please verify Gemini API connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnshrineTicket = () => {
    if (!divinedTicket) return;

    let mappedAgent: AgentId = 'mechanic';
    const tgt = (divinedTicket.targetAgent || targetAgent).toLowerCase();
    if (tgt.includes('qa') || tgt.includes('sentinel')) mappedAgent = 'qa';
    else if (tgt.includes('omega') || tgt.includes('director')) mappedAgent = 'omega';
    else if (tgt.includes('wave') || tgt.includes('cleanroom')) mappedAgent = 'wave';
    else mappedAgent = 'mechanic';

    const criteria = Array.isArray(divinedTicket.acceptanceCriteria)
      ? divinedTicket.acceptanceCriteria.map((txt: string, idx: number) => ({
          id: `c-${Date.now()}-${idx}`,
          text: txt,
          completed: false,
        }))
      : [
          { id: `c-1`, text: 'Code compiles without TypeScript errors', completed: false },
          { id: `c-2`, text: 'Passes deterministic 60fps benchmark', completed: false },
        ];

    const textToCheck = `${divinedTicket.title || ''} ${idea} ${gameGenre}`.toLowerCase();
    const detectedProject: 'pr0sis' | 'journeys_unto' = textToCheck.includes('pr0sis') || textToCheck.includes('mobile') || textToCheck.includes('viewport')
      ? 'pr0sis'
      : 'journeys_unto';

    const newTicket: Ticket = {
      id: divinedTicket.ticketId || (detectedProject === 'pr0sis' ? `PR0-${Math.floor(105 + Math.random() * 800)}` : `JRN-${Math.floor(205 + Math.random() * 700)}`),
      title: divinedTicket.title || idea.slice(0, 50),
      project: detectedProject,
      objective: divinedTicket.objective || idea,
      status: 'backlog',
      priority: (divinedTicket.priority as any) || priority,
      targetAgent: mappedAgent,
      runeAffinity: divinedTicket.runeAffinity || (detectedProject === 'pr0sis' ? 'ᛉ Algiz (Purified Viewport)' : 'ᚱ Raido (Journey & Path)'),
      difficultyRank: divinedTicket.difficultyRank || 'Adept',
      acceptanceCriteria: criteria,
      mathematicalOrPhysicsSpec: divinedTicket.mathematicalOrPhysicsSpec,
      localDispatchCommand: divinedTicket.localDispatchCommand || `oracle-dispatch --ticket ${divinedTicket.ticketId || 'EFH-NEW'} --agent ${mappedAgent}`,
      codeStarterSnippet: divinedTicket.codeStarterSnippet,
      oracleProphecy: divinedTicket.oracleProphecy,
      branch: detectedProject === 'pr0sis' 
        ? `fix/pr0sis-${(divinedTicket.title || 'patch').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}`
        : `feat/journeys-${(divinedTicket.title || 'feature').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTicket(newTicket);
    setEnshrined(true);
    playDispatchSound();
  };

  const handleCopyCommand = () => {
    if (divinedTicket?.localDispatchCommand) {
      navigator.clipboard.writeText(divinedTicket.localDispatchCommand);
      setCopiedCommand(true);
      playCelestialChime(880, 'sine', 0.2);
      setTimeout(() => setCopiedCommand(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title Banner with Runes & Astral Description */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-950/80 border border-amber-500/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-decorative text-2xl text-amber-400 glow-rune-gold">ᛈ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300/80">Cloud Divination & Ticket Engine</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
            ORACLE: The Ticket Creator for Local Machines
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Harnessing the Gemini API to forge raw web game mechanics into actionable, mathematically grounded engineering tickets dispatched directly to your local machines.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-center px-4 py-2 rounded-xl bg-slate-950/70 border border-amber-500/20">
          <div>
            <div className="text-[10px] font-mono text-slate-400">Current Goal Alignment</div>
            <div className="text-xs font-semibold text-amber-200">{goal.title}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Target: {goal.targetFPS} FPS Determinism</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Crucible & Divined Scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Divination Forge Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <h3 className="font-cinzel text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" />
              Feature & Mechanic Crucible
            </h3>

            {/* Presets chips */}
            <div className="mb-4">
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Astral Presets for Web Games</label>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIdea(p.prompt);
                      setGameGenre(p.genre);
                      setTargetAgent(p.agent);
                      playCelestialChime(520 + i * 40, 'sine', 0.15);
                    }}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Mechanic / Physics / Bug Description
                </label>
                <textarea
                  id="oracle-idea-input"
                  rows={4}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your game feature or math challenge (e.g. 2D Verlet continuous orbital movement with starlight particle trails)..."
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 focus:border-amber-500/80 text-slate-200 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 leading-relaxed"
                />
              </div>

              {/* Target Agent & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Local Agent</label>
                  <select
                    id="oracle-target-agent"
                    value={targetAgent}
                    onChange={(e) => setTargetAgent(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mechanic">The Mechanic (Physics & Math)</option>
                    <option value="QA Agent">QA Sentinel (Playtesting & Fuzzing)</option>
                    <option value="Director OMEGA">Director OMEGA (Orchestrator)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Priority Rank</label>
                  <select
                    id="oracle-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="Cosmic">Cosmic (Urgent)</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Stellar Backlog">Stellar Backlog</option>
                  </select>
                </div>
              </div>

              {/* Game Genre / Context */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Web Game Subsystem / Stack</label>
                <input
                  type="text"
                  value={gameGenre}
                  onChange={(e) => setGameGenre(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Button */}
              <button
                id="oracle-divine-btn"
                onClick={handleDivine}
                disabled={loading || !idea.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-cinzel text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  loading || !idea.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Divining with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Divine Ticket with ORACLE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right Column: Divined Parchment Scroll (7 cols) */}
        <div className="lg:col-span-7">
          {divinedTicket ? (
            <div className="parchment-scroll rounded-xl border border-amber-500/40 p-6 sm:p-7 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 relative">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-decorative text-lg text-amber-400 glow-rune-gold">
                    {divinedTicket.runeAffinity?.split(' ')[0] || 'ᛈ'}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                    {divinedTicket.ticketId || 'EFH-DIVINED'}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800/40">
                    Target: {divinedTicket.targetAgent}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40">
                    Rank: {divinedTicket.difficultyRank || 'Adept'}
                  </span>
                </div>

                <span className="text-xs font-mono text-amber-400">
                  Affinity: {divinedTicket.runeAffinity}
                </span>
              </div>

              {/* Title & Objective */}
              <div>
                <h3 className="font-cinzel text-xl font-bold text-amber-100 mb-2">
                  {divinedTicket.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans pl-3 border-l-2 border-amber-500/40">
                  {divinedTicket.objective}
                </p>
              </div>

              {/* Prophecy */}
              {divinedTicket.oracleProphecy && (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 italic text-xs text-amber-200 font-cinzel flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>&ldquo;{divinedTicket.oracleProphecy}&rdquo;</span>
                </div>
              )}

              {/* Math / Physics Specifications */}
              {divinedTicket.mathematicalOrPhysicsSpec && (
                <div>
                  <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Physics & Math Invariants
                  </div>
                  <div className="p-3 rounded bg-slate-950/90 border border-cyan-900/40 font-mono text-xs text-cyan-200 overflow-x-auto">
                    <code>{divinedTicket.mathematicalOrPhysicsSpec}</code>
                  </div>
                </div>
              )}

              {/* Acceptance Criteria */}
              {Array.isArray(divinedTicket.acceptanceCriteria) && (
                <div>
                  <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider mb-2">
                    Acceptance Decrees ({divinedTicket.acceptanceCriteria.length})
                  </div>
                  <ul className="space-y-1.5">
                    {divinedTicket.acceptanceCriteria.map((crit: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="text-amber-400 font-mono mt-0.5">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Starter Code Blueprint */}
              {divinedTicket.codeStarterSnippet && (
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    Starter Blueprint
                  </div>
                  <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-40">
                    <code>{divinedTicket.codeStarterSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Local Machine Dispatch Command */}
              {divinedTicket.localDispatchCommand && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Local Machine Run Command
                    </span>
                    <button
                      onClick={handleCopyCommand}
                      className="text-[11px] font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCommand ? 'Copied' : 'Copy command'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 select-all overflow-x-auto">
                    <code>{divinedTicket.localDispatchCommand}</code>
                  </div>
                </div>
              )}

              {/* Action Buttons: Enshrine to Board */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-500/20">
                <button
                  id="enshrine-ticket-btn"
                  onClick={handleEnshrineTicket}
                  disabled={enshrined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    enshrined
                      ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black shadow-md'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{enshrined ? 'Enshrined to Task Grimoire ✓' : 'Enshrine as Ticket to Board'}</span>
                </button>

                {enshrined && (
                  <button
                    onClick={onNavigateToBoard}
                    className="flex items-center gap-1 text-xs font-cinzel text-cyan-300 hover:text-cyan-100 transition-colors cursor-pointer"
                  >
                    <span>View in Task Grimoire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-400">
              <span className="font-decorative text-4xl text-slate-600 mb-3 select-none">ᛈ</span>
              <h4 className="font-cinzel text-base font-bold text-slate-300 mb-1">
                The Diviner&apos;s Mirror is Clear
              </h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Select a game mechanic preset or describe a feature in the crucible. ORACLE will cast the starlight runes and divine an engineering decree for your local machines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
