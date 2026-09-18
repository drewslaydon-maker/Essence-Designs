import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Gamepad2, 
  FileText, 
  ExternalLink,
  Code,
  Terminal,
  Layers,
  Wand2
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

interface WaveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaveBriefingModal: React.FC<WaveBriefingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<'both' | 'pr0sis' | 'journeys'>('both');
  const [extraInstructions, setExtraInstructions] = useState('');

  if (!isOpen) return null;

  const generatePrompt = () => {
    let focusSection = '';

    if (selectedFocus === 'both' || selectedFocus === 'pr0sis') {
      focusSection += `
### 1. PRIORITY PROJECT: PR0SIS MOBILE FORMATTING & VIEWPORT OVERHAUL
- **Live URL**: https://drewslaydon-maker.github.io/Essence-Designs/
- **Live Status**: Operational on PC displays (1920x1080 / desktop viewports), but severely broken on mobile browsers (iPhone 375px/390px, Android 412px).
- **Exact Mobile Breakage Diagnostics (Since you cannot view the webpage directly)**:
  1. **Horizontal Screen Wobble & Overflow-x**: The Canvas and HUD overlays exceed 100vw, allowing sideways drag that displaces UI buttons and text off-screen.
     *Required Fix*: Strict \`html, body { max-width: 100vw; overflow-x: hidden; }\` and all wrappers constrained to \`box-sizing: border-box\`.
  2. **Viewport Meta-Tag & Safe Area**: Lacks \`viewport-fit=cover\` and dynamic safe area padding. Mobile notches and gesture bars obscure the game HUD.
     *Required Fix*: Set \`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">\` and \`padding: env(safe-area-inset-*)\`.
  3. **100vh Mobile Address Bar Jumping**: Classic \`100vh\` causes sudden layout reflows when the browser search bar expands/collapses upon touch interaction.
     *Required Fix*: Adopt \`min-height: 100dvh\` (Dynamic Viewport Height) with 100% fallbacks.
  4. **Touch Input Delay & Tap Targets**: Mouse click events incur a 300ms double-tap delay on mobile WebKit, and small controls miss the 44px touch threshold.
     *Required Fix*: Enforce \`touch-action: manipulation\` on interactive elements, minimum 44x44px hitboxes, and active pointer event handlers.
  5. **High-DPI Canvas Retina Scaling (DPR)**: The canvas backing store renders at 1:1 CSS pixels, causing blurry visuals on high-density mobile screens.
     *Required Fix*: Scale canvas backing dimensions by \`Math.min(window.devicePixelRatio || 1, 2.0)\` while keeping CSS style width/height at 100%.
  6. **Mobile WebAudio Autoplay Policy**: AudioContext initializes in a \`suspended\` state on iOS/Android until unlocked by an explicit user touch gesture.
     *Required Fix*: Attach a one-time \`touchstart\` / \`pointerdown\` listener that executes \`audioCtx.resume()\`.
`;
    }

    if (selectedFocus === 'both' || selectedFocus === 'journeys') {
      focusSection += `
### 2. CORE SPRINT PROJECT: JOURNEYS UNTO — v2 BLUEPRINT FOR GAME START
- **Objective**: Construct the clean, high-performance v2 architectural foundation for the opening of JOURNEYS UNTO.
- **Architectural Specifications to Deliver**:
  1. **GameDirector State Machine**:
     - Explicit states: \`BOOT\` -> \`PRELOAD\` -> \`TITLE_SCREEN\` -> \`PROLOGUE_CHRONICLE\` -> \`IN_GAME\`.
     - Fixed timestep simulation loop: \`update(fixedDt = 1/60)\` with accumulator to ensure zero physics jitter, coupled with a decoupled \`render(interpolationAlpha)\`.
  2. **World Origin Scene Graph & Entity Registry**:
     - Coordinate origin at (0, 0) with camera bounding viewport tracking the player.
     - Lightweight Entity-Component registry (Position, Velocity, CollisionBounds, Sprite/RuneRender).
  3. **Kinematic Character Controller**:
     - 8-directional movement with vector magnitude normalization (\`length > 0 ? v / length : 0\`).
     - Velocity dampening (lerp deceleration) for smooth tactile game feel.
     - Unified input abstraction layer accepting Keyboard (WASD / Arrows), Gamepad API (Axes 0 & 1), and Mobile Touch D-pad vectors.
  4. **Prologue Dialogue & Narrative Engine**:
     - Typewriter text effect with adjustable cadence and celestial WebAudio blips.
     - Deterministic event hooks signaling state transitions upon dialogue completion.
  5. **Chapter 0 Progression Decoupling & South Door Gating**:
     - The Drinking Contest with Atreyu is decoupled: winning it awards champion status and celestial boons, but does NOT trigger the ambush.
     - The South Harbor Door is the sole trigger for the Inciting Ambush, gated behind an explicit "Point of No Return" confirmation modal.
     - Zero-State Reset guarantees pristine teardown: squadFollowers let re-declaration, zero listener leaks, and Atreyu canonically positioned as sober High Moon Priestess (she/her).
`;
    }

    const customNote = extraInstructions.trim() 
      ? `\n### 3. SPECIFIC INSTRUCTIONS FROM DREW SLAYDON:\n${extraInstructions.trim()}\n`
      : '';

    return `You are WAVE, the Cleanroom Guardian and Web Game Sandbox Specialist in Drew Slaydon's workspace (ESSENCE FL0W HUB v0.1).

## CONTEXT & STATUS BRIEFING
*IMPORTANT: You cannot view or browse live web pages directly, so this briefing provides the complete, authoritative operational context, repository details, user feedback, and architectural mandates.*

- **Developer**: Drew Slaydon (drewslaydon-maker)
- **Repository**: drewslaydon-maker/Essence-Designs
- **Workspace**: ESSENCE FL0W HUB v0.1
- **Your Role**: As WAVE, you are responsible for sandboxing, purifying, and verifying game code modules before they are dispatched to Director OMEGA, The Mechanic, and QA Sentinel on local machines. You ensure zero global window leaks, memory safety, responsive viewport adaptation, and deterministic 60+ FPS pacing.
${focusSection}${customNote}
## WAVE'S SANCTUARY INVARIANTS & PURIFICATION RULES
When reviewing, writing, or purifying code:
1. **Zero Global Pollution**: Never attach naked event listeners to \`window\` or \`document\` without an explicit \`destroy()\` or cleanup callback.
2. **Encapsulation & Self-Containment**: All modules must export clean interfaces without assuming global variables.
3. **Memory Leak Prevention**: Truncate particle arrays, cancel active \`requestAnimationFrame\` handles on unmount, and disconnect WebAudio nodes.
4. **Mobile-First Responsiveness**: All canvas elements and HUD overlays must gracefully handle screens from 375px up to 4K displays with zero horizontal overflow.
5. **Deterministic Timing**: Game physics must use fixed delta steps rather than raw variable timestamp deltas.

Please acknowledge this briefing, confirm your understanding of the Pr0sis mobile breakdown and JOURNEYS UNTO v2 blueprint requirements, and state how you are ready to assist Drew.`;
  };

  const currentPrompt = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    playCelestialChime(880, 'sine', 0.2);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f19] border border-cyan-500/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950/80 bg-[#070a12]">
          <div className="flex items-center gap-3">
            <span className="font-decorative text-2xl text-cyan-400 glow-rune">ᛉ</span>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                WAVE Bot Offline Briefing Prompt Generator
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Full-context briefing prompt for external AI/WAVE instances that cannot browse live pages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-900 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Include Context:</span>
              <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 text-xs font-mono">
                <button
                  onClick={() => { playCelestialChime(600, 'sine', 0.1); setSelectedFocus('both'); }}
                  className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                    selectedFocus === 'both' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Both Projects
                </button>
                <button
                  onClick={() => { playCelestialChime(650, 'sine', 0.1); setSelectedFocus('pr0sis'); }}
                  className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                    selectedFocus === 'pr0sis' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pr0sis Mobile Only
                </button>
                <button
                  onClick={() => { playCelestialChime(700, 'sine', 0.1); setSelectedFocus('journeys'); }}
                  className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                    selectedFocus === 'journeys' ? 'bg-amber-950 text-amber-300 border border-amber-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  JOURNEYS UNTO v2 Only
                </button>
              </div>
            </div>

            <button
              id="copy-wave-briefing-btn"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Prompt to Clipboard!' : 'Copy Full Briefing Prompt'}</span>
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Add Specific Note / Task for WAVE (Optional):
            </label>
            <input
              type="text"
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="e.g. Focus specifically on writing the CSS reset and canvas DPR scale helper..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-slate-200 text-xs font-sans placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Scrollable Prompt Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#07090e]">
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed select-all">
              {currentPrompt}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-900 bg-[#070a12] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Ready to paste directly into ChatGPT, Claude, Gemini, or local LLM instances of WAVE.</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{copied ? 'Copied!' : 'Click to Copy Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
