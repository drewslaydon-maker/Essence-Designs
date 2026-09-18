import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  Activity, 
  FileCode, 
  Download, 
  CheckCircle2,
  FileText,
  Terminal
} from 'lucide-react';
import { CleanroomReport, Ticket } from '../types';
import { playPurifySound, playCelestialChime } from '../utils/audio';
import { WaveBriefingModal } from './WaveBriefingModal';

interface WaveCleanroomViewProps {
  initialCode?: string;
  onDispatchCleanroomTicket?: (ticketTitle: string, cleanCode: string) => void;
}

export const WaveCleanroomView: React.FC<WaveCleanroomViewProps> = ({
  initialCode,
  onDispatchCleanroomTicket,
}) => {
  const sampleCodes = [
    {
      title: 'Pr0sis: Mobile Touch Listener & Viewport Leak',
      code: `// Unpurified Pr0sis mobile touch & viewport handling
let touchOrigin = { x: 0, y: 0 };
let activeTouches = [];

// Hazard: Direct window listeners without cleanup
window.addEventListener('touchstart', (e) => {
  touchOrigin.x = e.touches[0].clientX;
  touchOrigin.y = e.touches[0].clientY;
  // Potential memory leak: continuous array push without bounds
  activeTouches.push(e.touches[0]);
});

window.addEventListener('touchmove', (e) => {
  // Missing touch-action: manipulation or preventDefault causes scrolling jitter
  let dx = e.touches[0].clientX - touchOrigin.x;
  let dy = e.touches[0].clientY - touchOrigin.y;
  console.log('Mobile swipe vector:', dx, dy);
});`,
    },
    {
      title: 'JOURNEYS UNTO: v2 Blueprint Boot State Machine',
      code: `// JOURNEYS UNTO v2: Game Start State Loop (Unpurified)
export class GameDirector {
  constructor() {
    this.state = 'BOOT';
    this.entities = [];
  }

  start() {
    this.state = 'IN_GAME';
    // Hazard: Variable delta time leads to physics jitter on mobile
    let last = performance.now();
    const tick = (now) => {
      let dt = (now - last) / 1000;
      last = now;
      this.update(dt);
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  update(dt) {
    for (let e of this.entities) {
      e.x += e.vx * dt;
    }
  }

  render() {
    // Missing DPR canvas scaling
  }
}`,
    },
    {
      title: 'Pr0sis: Mobile Audio Gesture Unlock',
      code: `// Pr0sis WebAudio engine without touch gesture unlock guard
class Pr0sisAudio {
  constructor() {
    // Autoplay policy warning: AudioContext created in suspended state
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playEssenceTone(freq) {
    if (this.ctx.state === 'suspended') {
      // Missing user gesture promise resume
      this.ctx.resume();
    }
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    // Hazard: osc node never stopped or disconnected
  }
}`,
    },
    {
      title: 'WAVE Audit: Journeys Progression Gating & Invariant State Log',
      code: `// WAVE ARCHITECTURAL STATE AUDIT & VERIFICATION DIRECTIVE
// Target: Journeys Unto Chapter 0 Vertical Slice
// Status: VERIFIED & LOCKED
export const WAVE_STATE_DIRECTIVE = {
  version: "v0.2-cleanroom",
  drinkingGameDecoupled: true, // Drinking game victory DOES NOT trigger ambush
  doorProgressionGated: true,  // South Door requires explicit "Point of No Return" confirmation
  atreyuCanonCompliant: true,  // High Moon Priestess (she/her), sober zero-state
  zeroStateResetDeterminism: true, // 'squadFollowers' let re-declaration, zero leak
  invariants: {
    AU01_TraumaDecay: "PASS (400ms deterministic, T in [0, 1])",
    AU02_DialogueBuffer: "PASS (<=33ms drain, zero orphaned runes)",
    AU03_AudioDucking: "PASS (-6.02dB attenuation at ambush transition)",
    AU04_ColossusKinematics: "PASS (v_max = 175 px/s, zeta = 0.88)"
  }
};`,
    },
  ];

  const [code, setCode] = useState(initialCode || sampleCodes[0].code);
  const [moduleName, setModuleName] = useState('GameEngineCore');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CleanroomReport | null>(null);
  const [copiedCleanCode, setCopiedCleanCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isStateLogModalOpen, setIsStateLogModalOpen] = useState(false);
  const [copiedStateLog, setCopiedStateLog] = useState(false);

  const handlePurify = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    playPurifySound();

    try {
      const res = await fetch('/api/agents/wave/purify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          moduleName,
          language: 'typescript',
          context: 'Drew Slaydon workspace: Pr0sis (mobile responsive fix & touch optimization) and JOURNEYS UNTO (v2 blueprint game start state machine and controllers)',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'WAVE cleanroom inspection failed.');
      }

      setReport(data.result);
      playCelestialChime(1046.5, 'triangle', 0.5);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to commune with WAVE Cleanroom.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCleanCode = () => {
    if (report?.isolatedSandboxCode) {
      navigator.clipboard.writeText(report.isolatedSandboxCode);
      setCopiedCleanCode(true);
      playCelestialChime(784, 'sine', 0.2);
      setTimeout(() => setCopiedCleanCode(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/80 border border-cyan-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-decorative text-2xl text-cyan-400 glow-rune">ᛉ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300/80">Cloud Cleanroom & Sandboxed Isolation</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-cyan-100">
            WAVE: The Web Game Cleanroom Guardian
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Eliminates memory leaks, global window pollution, and frame-rate jitter. Delivers deterministic, hermetically isolated game modules ready for local machine compilation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="view-wave-state-log-btn"
            onClick={() => {
              playCelestialChime(660, 'sine', 0.2);
              setIsStateLogModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-cinzel text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>WAVE State Directive Log</span>
          </button>

          <button
            id="brief-wave-bot-btn"
            onClick={() => {
              playCelestialChime(750, 'sine', 0.2);
              setIsBriefingModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Brief WAVE Bot (Copy Offline Prompt)</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-xs font-mono text-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Sanctuary Seal: Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Chamber Input (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <h3 className="font-cinzel text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Chamber Code Inspection Input
            </h3>

            {/* Presets */}
            <div className="mb-4">
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Load Target Game Hazard Sample</label>
              <div className="flex flex-wrap gap-1.5">
                {sampleCodes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCode(s.code);
                      setModuleName(s.title.replace(/[^a-zA-Z0-9]/g, ''));
                      playCelestialChime(600 + i * 50, 'sine', 0.15);
                    }}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Name */}
            <div className="mb-3">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Module / Component Name</label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Code Input */}
            <div className="mb-4">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Code to Purify & Sandbox</label>
              <textarea
                id="wave-code-input"
                rows={10}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste game module, Canvas loop, or audio synth code..."
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700/80 focus:border-cyan-500 text-cyan-200 text-xs font-mono leading-relaxed focus:outline-none"
              />
            </div>

            {/* Purify Button */}
            <button
              id="wave-purify-btn"
              onClick={handlePurify}
              disabled={loading || !code.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-cinzel text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                loading || !code.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:brightness-110 text-black shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>WAVE Cleanroom Purifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Purify & Sandbox Code</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right: Cleanroom Inspection Certificate & Isolated Output (7 cols) */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="parchment-scroll rounded-xl border border-cyan-500/40 p-6 sm:p-7 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Certificate Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                    <span className="font-decorative text-2xl text-cyan-300 glow-rune">
                      {report.astralSeal || 'ᛉ'}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-300 uppercase tracking-widest">
                      Cleanroom Certificate
                    </div>
                    <div className="font-cinzel text-lg font-bold text-slate-100">
                      Seal of {report.astralSeal || 'Algiz'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Purity Rating</div>
                  <div className="font-mono text-2xl font-black text-emerald-400">
                    {report.purityScore}%
                  </div>
                  <div className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-mono">
                    {report.cleanroomStatus}
                  </div>
                </div>
              </div>

              {/* Summary Decree */}
              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 font-sans leading-relaxed">
                <div className="font-cinzel font-bold text-cyan-100 mb-1">Executive Purity Audit:</div>
                {report.summary}
              </div>

              {/* Frame Pacing & Memory Hazard Audits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 mb-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Frame Pacing & Determinism
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 font-sans">
                    <div><span className="text-slate-500">Target:</span> {report.framePacingAudit?.targetFPS || '60-120 FPS'}</div>
                    <div><span className="text-slate-500">Jitter Risk:</span> {report.framePacingAudit?.determinismRisk || 'Low'}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{report.framePacingAudit?.timingNotes}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Memory Leak Invariants
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 font-sans">
                    {report.memoryLeakHazards?.map((hazard, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{hazard}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purified Sandbox Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Purified & Sandboxed Code
                  </span>
                  <button
                    onClick={handleCopyCleanCode}
                    className="text-[11px] font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCleanCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCleanCode ? 'Copied Clean Code' : 'Copy Clean Code'}
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-slate-950 border border-emerald-950 text-xs font-mono text-emerald-200/90 overflow-x-auto max-h-72 leading-relaxed">
                  <code>{report.isolatedSandboxCode}</code>
                </pre>
              </div>

              {/* Decree from WAVE */}
              {report.cleanroomDecree && (
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 italic text-xs text-cyan-200 font-cinzel">
                  &ldquo;{report.cleanroomDecree}&rdquo;
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-400">
              <span className="font-decorative text-4xl text-slate-600 mb-3 select-none">ᛉ</span>
              <h4 className="font-cinzel text-base font-bold text-slate-300 mb-1">
                WAVE Cleanroom Chamber Awaiting Input
              </h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Provide code in the chamber or load a web game sample. WAVE will purge global leaks, audit frame timing, and output an isolated sandbox module.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WAVE Bot Offline Context Briefing Generator Modal */}
      <WaveBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
      />

      {/* WAVE State Directive Log Modal */}
      {isStateLogModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsStateLogModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f19] border-2 border-amber-500/50 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-[#070a12]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-cinzel text-base font-bold text-amber-200">
                    WAVE ARCHITECTURAL AUDIT &amp; STATE DIRECTIVE LOG
                  </h3>
                  <p className="text-[11px] font-mono text-amber-400/80">
                    Target: Journeys Unto Chapter 0 Vertical Slice • Verified &amp; Locked
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `# WAVE ARCHITECTURAL AUDIT & STATE DIRECTIVE LOG
Target: Journeys Unto Chapter 0 Vertical Slice
Status: VERIFIED & LOCKED
1. Drinking Game Decoupled from Ambush: Winning contest does NOT trigger raid.
2. South Door Gated Confirmation: Explicit Point of No Return modal stops accidental progression.
3. Atreyu Lore Compliant: High Moon Priestess (she/her), sober zero-state, post-duel champion recognition.
4. Zero-State Reset Determinism: squadFollowers let re-declaration, zero leaks, clean state return.
5. Invariants Verified: AU-01 through AU-04 + Telemetry pass deterministically.`;
                    navigator.clipboard.writeText(text);
                    setCopiedStateLog(true);
                    playCelestialChime(880, 'sine', 0.2);
                    setTimeout(() => setCopiedStateLog(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedStateLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStateLog ? 'Copied Directive' : 'Copy Directive'}</span>
                </button>
                <button
                  onClick={() => setIsStateLogModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Close [Esc]
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 font-sans leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-0.5">PROGRESSION GATING</span>
                  <p className="font-cinzel text-xs font-bold text-emerald-200">Door Confirmation Gated</p>
                  <p className="text-[11px] text-emerald-300/80 mt-1">Drinking duel victory decoupled; South Door is sole trigger with explicit Point of No Return confirmation prompt.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block mb-0.5">ZERO-STATE RESET</span>
                  <p className="font-cinzel text-xs font-bold text-sky-200">Deterministic Reset</p>
                  <p className="text-[11px] text-sky-300/80 mt-1">squadFollowers let declaration, zero event leaks, full state purge back to pure Zero State on [R].</p>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 block mb-0.5">CANON &amp; LORE</span>
                  <p className="font-cinzel text-xs font-bold text-indigo-200">High Moon Priestess</p>
                  <p className="text-[11px] text-indigo-300/80 mt-1">Atreyu canonical (she/her), sober zero state posture and chalice, post-duel recognition on victory.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                <p className="text-amber-400 font-bold border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  M1 MASTER MANIFEST INVARIANT VERIFICATION MATRIX
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <strong className="text-slate-200">AU-01: Trauma Decay</strong>
                    <p className="text-emerald-400">✓ PASS: 400ms decay rate (2.5/s), zero NaN, deterministic shake.</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <strong className="text-slate-200">AU-02: Dialogue Stream</strong>
                    <p className="text-emerald-400">✓ PASS: Stream drains &le; 33ms on skip, zero orphaned runes.</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <strong className="text-slate-200">AU-03: Tavern Audio Ducking</strong>
                    <p className="text-emerald-400">✓ PASS: -6.02dB attenuation at ambush transition (T_decay = 80ms).</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <strong className="text-slate-200">AU-04: Colossus Kinematics</strong>
                    <p className="text-emerald-400">✓ PASS: v_max = 175 px/s, restitution dampening zeta = 0.88.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 italic text-cyan-200 font-cinzel text-xs">
                &ldquo;The tavern stands bounded. The doors are guarded. The Priestess is sober until proven otherwise, and the Black Knights shall enter only when the iron bolts are unfastened by the champion&apos;s own hand. Boundary integrity verified.&rdquo;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
