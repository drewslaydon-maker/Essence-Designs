import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Wand2, 
  Activity, 
  Radio, 
  Terminal,
  CheckCircle
} from 'lucide-react';
import { AgentProfile, AgentId } from '../types';
import { playCelestialChime, playRuneCastSound } from '../utils/audio';

interface AgentSanctumViewProps {
  agents: AgentProfile[];
  onOpenWave: () => void;
  onOpenOracle: () => void;
}

export const AgentSanctumView: React.FC<AgentSanctumViewProps> = ({
  agents,
  onOpenWave,
  onOpenOracle,
}) => {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>('mp');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentResponses, setAgentResponses] = useState<Record<string, string>>({
    drew: 'Human Director Drew Slaydon. Setting the creative vision, master lore canon, mechanical depth, and milestone pace for JOURNEYS UNTO and Ball Break.',
    juju: 'Reality Anchor Juju. Grounding the studio with emotional clarity, truth verification, still presence, and balanced direction.',
    mp: 'MP (Master Programmer) sovereign node operational. Direct file write access engaged. Verification Gates 0, 1, and 2 passed for JRN-204 AABB spatial boundaries and frictionless wall sliding. Ready to refactor engines, execute tests, and manage GitHub Pages deployments.',
    omega: 'Director OMEGA stands at attention on the local machine array. Ready to orchestrate local build pipelines, coordinate physics and QA agents, and enforce milestone deliveries.',
    mechanic: 'The Mechanic is ready at the kinetic forge. Ready to calculate Verlet equations, continuous collision detection, and WebGL state machines.',
    qa: 'The Sentinel is vigilant. Test harnesses, fuzzing pipelines, and latency probes are calibrated for high-stress web game playtesting.',
    wave: 'WAVE Cleanroom stands online. Ready to purify untrusted game code, purge memory leaks, and guarantee 60fps frame-pacing determinism.',
    oracle: 'ORACLE gazes into the celestial tapestry. Ready to divine technical tickets and dispatch commands from your high-level game visions.',
    au: 'The Auditor stands sentinel over the Master Manifest. Validating AU-01 through AU-04 invariant contracts, safe Web Audio ramps, and non-blocking telemetry envelopes.',
  });

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  const agentPrompts: Record<AgentId, string[]> = {
    drew: [
      'Define core game feel and tactical standoff consequences for The Greedy Greens',
      'What are the priority acceptance criteria for the vertical slice milestone?',
      'Review deterministic physics targets across desktop and mobile',
    ],
    juju: [
      'Perform a stillness and reality check before making structural changes',
      'How do we ensure our pacing remains balanced and intentional?',
      'Verify that all tasks are backed by explicit reasoning and clear intent',
    ],
    mp: [
      'Refactor KinematicController to support JRN-204 sub-step axis separation',
      'Execute JRN204_AABB_Sliding verification test suite and inspect telemetry',
      'Generate a standalone single-file HTML bundle for GitHub Pages deployment',
    ],
    omega: [
      'Evaluate milestone 0.1 readiness and summarize critical blockers',
      'What git branching strategy best isolates local physics from QA playtests?',
      'Draft a sprint decree for the web game release candidate',
    ],
    mechanic: [
      'Write a 2D Verlet gravity solver with inverse-square falloff and damping',
      'How to implement continuous collision detection (CCD) for fast laser rays?',
      'Optimize requestAnimationFrame game loop to prevent spiral-of-death',
    ],
    qa: [
      'Generate an automated playtesting fuzz matrix with 120 keypresses/sec',
      'How to profile Chrome garbage collection spikes during particle bursts?',
      'Design test assertions for audio synthesizer spatial attenuation',
    ],
    wave: [
      'How do we ensure WebGL textures are completely garbage-collected on scene unload?',
      'Checklist for preventing memory leaks in HTML5 Canvas event listeners',
      'Techniques for deterministic floating point physics in browser web workers',
    ],
    oracle: [
      'Divine a high-priority ticket for zero-gravity projectile reflection',
      'Break down a procedural star system generator into 3 local machine tickets',
      'Divine ticket for WebAudio celestial chime synthesizer',
    ],
    au: [
      'Execute cleanroom verification for AU-01 through AU-04 invariant matrix',
      'Audit Web Audio exponential ramp safety to prevent RangeError exceptions',
      'Verify Juju Anchor telemetry payload remains strictly under 256 bytes',
    ],
  };

  const handleConsult = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    playRuneCastSound();

    try {
      const res = await fetch('/api/agents/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgentId,
          query: q,
          context: 'ESSENCE FL0W HUB v0.1 - Web Based Game Development with Gemini AI',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Agent consultation error.');
      }

      setAgentResponses((prev) => ({
        ...prev,
        [activeAgentId]: data.response,
      }));
      setQuery('');
      playCelestialChime(880, 'sine', 0.4);
    } catch (err: any) {
      console.error(err);
      setAgentResponses((prev) => ({
        ...prev,
        [activeAgentId]: `Communication fracture: ${err.message || 'Unable to reach agent via Gemini API.'}`,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-slate-950/80 border border-purple-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-decorative text-2xl text-purple-400 glow-rune-violet">ᛗ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-300/80">The 5 Astral Pillars</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
            Agent Sanctum: Cloud & Local Guardians
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Commune directly with your specialized AI development guardians. Powered by server-side Gemini 3.8 Flash, each agent provides authoritative domain intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-cinzel transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            WAVE Cleanroom
          </button>
          <button
            onClick={onOpenOracle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-cinzel transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            ORACLE Diviner
          </button>
        </div>
      </div>

      {/* Agents Selector Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {agents.map((agent) => {
          const isSelected = agent.id === activeAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => {
                playCelestialChime(500 + agents.indexOf(agent) * 80, 'sine', 0.15);
                setActiveAgentId(agent.id);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)] scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Realm badge */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                  agent.realm === 'cloud'
                    ? 'bg-cyan-950/60 border-cyan-800/40 text-cyan-300'
                    : 'bg-purple-950/60 border-purple-800/40 text-purple-300'
                }`}>
                  {agent.realm === 'cloud' ? '☁ Cloud' : '🖥 Local Node'}
                </span>
                <span className="font-decorative text-base text-amber-400 select-none">{agent.rune}</span>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{agent.avatarSymbol}</span>
                <h3 className="font-cinzel text-xs font-bold text-slate-100 truncate">{agent.name}</h3>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans mb-3">
                {agent.description}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="text-slate-500">Gemini 3.8</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive & Direct Consultation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agent Dossier & Quick Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeAgent.avatarSymbol}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-slate-100">{activeAgent.name}</h3>
                  <span className="font-decorative text-lg text-amber-400 glow-rune-gold">{activeAgent.rune}</span>
                </div>
                <p className="text-xs text-amber-300/80 font-mono">{activeAgent.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500/40 pl-3">
              {activeAgent.description}
            </p>

            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Specialized Invariants:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeAgent.specialties.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Inscribed Prompts */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Runic Inscribed Prompts:
              </div>
              <div className="space-y-1.5">
                {(agentPrompts[activeAgentId] || []).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(p);
                      handleConsult(p);
                    }}
                    className="w-full text-left p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate max-w-[90%]">{p}</span>
                    <span className="text-slate-600 group-hover:text-cyan-400 text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Agent Terminal & Live Output (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="parchment-scroll rounded-xl border border-amber-500/30 p-6 flex-1 min-h-[380px] flex flex-col justify-between shadow-xl">
            {/* Terminal Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4 text-xs font-mono">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Astral Channel: {activeAgent.name.toUpperCase()}
                </span>
                <span className="text-slate-400">Rune: {activeAgent.runeName}</span>
              </div>

              {/* Response scroll */}
              <div className="space-y-3 font-mono text-xs text-slate-200 leading-relaxed max-h-[360px] overflow-y-auto pr-2">
                {agentResponses[activeAgentId] ? (
                  <div className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                    {agentResponses[activeAgentId]}
                  </div>
                ) : (
                  <div className="text-slate-500 italic">
                    The astral channel is open. Ask a technical question to receive starlight counsel.
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-6 pt-4 border-t border-amber-500/20">
              <div className="flex items-center gap-2">
                <input
                  id="agent-query-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) handleConsult();
                  }}
                  placeholder={`Consult ${activeAgent.name} (e.g. physics equation, test suite, or cleanroom rule)...`}
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-500 text-slate-200 text-xs font-sans placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  id="agent-consult-send-btn"
                  onClick={() => handleConsult()}
                  disabled={loading || !query.trim()}
                  className={`px-4 py-2.5 rounded-lg font-cinzel text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    loading || !query.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black shadow-md'
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Cast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
