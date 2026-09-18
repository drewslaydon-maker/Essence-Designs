import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  ExternalLink, 
  RotateCw, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  Code,
  Layers,
  Wand2
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

interface Pr0sisMobileInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToWaveCleanroom: (code: string) => void;
}

type DevicePreset = 'iphone-se' | 'iphone-14' | 'android-pixel' | 'tablet' | 'desktop';

export const Pr0sisMobileInspectorModal: React.FC<Pr0sisMobileInspectorModalProps> = ({
  isOpen,
  onClose,
  onSendToWaveCleanroom,
}) => {
  const [device, setDevice] = useState<DevicePreset>('iphone-14');
  const [isLandscape, setIsLandscape] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'diagnostics' | 'patch' | 'dropin'>('simulator');

  if (!isOpen) return null;

  const pr0sisUrl = 'https://drewslaydon-maker.github.io/Essence-Designs/';

  const deviceDimensions: Record<DevicePreset, { width: number; height: number; name: string; type: string }> = {
    'iphone-se': { width: 375, height: 667, name: 'iPhone SE (Compact)', type: 'phone' },
    'iphone-14': { width: 390, height: 844, name: 'iPhone 14 / Pro', type: 'phone' },
    'android-pixel': { width: 412, height: 915, name: 'Google Pixel 7', type: 'phone' },
    'tablet': { width: 768, height: 1024, name: 'iPad / Tablet', type: 'tablet' },
    'desktop': { width: 1024, height: 640, name: 'PC Reference', type: 'desktop' },
  };

  const currentDim = deviceDimensions[device];
  const simWidth = isLandscape ? currentDim.height : currentDim.width;
  const simHeight = isLandscape ? currentDim.width : currentDim.height;

  const mobileCssPatch = `/* ==========================================================================
   Pr0sis Mobile Formatting & Viewport Overhaul Patch
   Repository: drewslaydon-maker/Essence-Designs
   Target: Fixes layout squishing, horizontal overflow & touch delays
   ========================================================================== */

/* 1. Viewport & Root Overflow Reset */
html, body {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
}

/* 2. Dynamic Viewport Height (prevents mobile toolbar jumps on iOS/Android) */
#root, #app, #pr0sis-canvas-container, main {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
}

/* 3. Responsive Safe Area Padding for Notches & Home Bars */
.pr0sis-hud, .pr0sis-controls, header, footer {
  padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(12px, env(safe-area-inset-right));
  padding-top: max(8px, env(safe-area-inset-top));
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

/* 4. Canvas Responsive Scaling with Retina DPR Support */
canvas {
  display: block;
  max-width: 100%;
  touch-action: none;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* 5. Minimum 44px Touch Targets for Mobile HUD */
@media (max-width: 768px) {
  button, .clickable-rune, .menu-item {
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Stack desktop multi-column sidebars into clean mobile drawer */
  .pr0sis-desktop-sidebar {
    display: none !important;
  }
}`;

  const handleCopyPatch = () => {
    navigator.clipboard.writeText(mobileCssPatch);
    setCopiedPatch(true);
    playCelestialChime(880, 'sine', 0.2);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const handleSendToCleanroom = () => {
    onSendToWaveCleanroom(mobileCssPatch);
    playCelestialChime(750, 'triangle', 0.3);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-[#0b0f19] border border-cyan-500/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-cyan-950/80 bg-[#070a12]">
          <div className="flex items-center gap-3">
            <span className="font-decorative text-xl text-cyan-400 glow-rune">ᛉ ᛋ</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-100">
                  Pr0sis Mobile Inspector & Viewport Simulator
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  Live PC Build
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <span>Target URL:</span>
                <a 
                  href={pr0sisUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-100 underline flex items-center gap-1"
                >
                  {pr0sisUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'simulator' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Simulator
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'diagnostics' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => setActiveTab('patch')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'patch' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CSS Patch
              </button>
              <button
                onClick={() => setActiveTab('dropin')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'dropin' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Drop-in JS & Aider
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Device preset buttons & orientation toggle (when in simulator tab) */}
        {activeTab === 'simulator' && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-950/70 border-b border-slate-900 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 mr-1">Device Bounds:</span>
              {(['iphone-se', 'iphone-14', 'android-pixel', 'tablet', 'desktop'] as DevicePreset[]).map((key) => {
                const info = deviceDimensions[key];
                const isActive = device === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      playCelestialChime(600, 'sine', 0.1);
                      setDevice(key);
                    }}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                      isActive 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-semibold' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {info.type === 'phone' && <Smartphone className="w-3 h-3" />}
                    {info.type === 'tablet' && <Tablet className="w-3 h-3" />}
                    {info.type === 'desktop' && <Monitor className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playCelestialChime(700, 'sine', 0.15);
                  setIsLandscape(!isLandscape);
                }}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                  isLandscape ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
              </button>

              <span className="text-slate-400 font-mono">
                {simWidth} × {simHeight} px
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-[#07090e]">
          {activeTab === 'simulator' && (
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              {/* Simulated Device Frame */}
              <div 
                className="relative rounded-3xl p-3 bg-slate-900/90 border-4 border-slate-700/80 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all flex flex-col items-center max-w-full max-h-[72vh]"
                style={{
                  width: `${Math.min(simWidth + 24, 980)}px`,
                  height: `${Math.min(simHeight + 36, 680)}px`,
                }}
              >
                {/* Device Speaker/Camera notch simulation */}
                <div className="w-24 h-3 rounded-full bg-black/60 mb-2 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                  <div className="w-8 h-1 rounded-full bg-slate-800" />
                </div>

                {/* Embedded Live Preview Iframe */}
                <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-black border border-slate-800">
                  <iframe
                    src={pr0sisUrl}
                    title="Pr0sis Live Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                  />
                </div>

                {/* Home Indicator line */}
                <div className="w-28 h-1 rounded-full bg-slate-700/60 mt-2 shrink-0" />
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Simulating: {currentDim.name} ({isLandscape ? 'Landscape' : 'Portrait'})</span>
                <span>•</span>
                <a
                  href={pr0sisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline flex items-center gap-1"
                >
                  Open in New Tab
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="w-full max-w-3xl space-y-4 text-xs font-sans text-slate-200">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="font-cinzel text-sm font-bold text-amber-200">
                    Pr0sis Mobile Formatting Root Causes & Audit
                  </h4>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  The live PC build at <code className="text-cyan-300 font-mono">https://drewslaydon-maker.github.io/Essence-Designs/</code> works smoothly on desktop displays, but breaks on mobile viewports due to 4 primary factors:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-cinzel font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="font-mono text-amber-400">1.</span>
                    Horizontal Screen Overflow
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Fixed-width canvas or HUD wrappers wider than mobile screen boundaries (375px–412px) create horizontal wobble and squish text elements.
                  </p>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
                    Fix: html, body &#123; max-width: 100vw; overflow-x: hidden; &#125;
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-cinzel font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="font-mono text-amber-400">2.</span>
                    Viewport Meta Tag Scale
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Missing <code className="text-amber-200 font-mono">viewport-fit=cover</code> or <code className="text-amber-200 font-mono">user-scalable=no</code> lets mobile browsers arbitrarily scale or letterbox the canvas into tiny illegible shapes.
                  </p>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
                    Fix: viewport-fit=cover, width=device-width
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-cinzel font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="font-mono text-amber-400">3.</span>
                    Mobile 100vh Toolbar Jump
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Classic <code className="text-amber-200 font-mono">100vh</code> causes canvas repositioning when mobile browser search bars expand or collapse upon scrolling.
                  </p>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
                    Fix: min-height: 100dvh; (Dynamic Viewport Height)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-cinzel font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="font-mono text-amber-400">4.</span>
                    Touch Delay & Tap Targets
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Desktop mouse click handlers incur a 300ms double-tap delay on mobile WebKit without <code className="text-amber-200 font-mono">touch-action: manipulation</code>.
                  </p>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
                    Fix: touch-action: manipulation; min-size: 44px
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setActiveTab('patch')}
                  className="px-5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-cinzel font-bold transition-colors cursor-pointer"
                >
                  View Ready-to-Apply CSS & HTML Patch →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'patch' && (
            <div className="w-full max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-slate-100">
                    Pr0sis Mobile Viewport Overhaul Code Patch
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ready to commit directly into <code className="text-amber-300 font-mono">drewslaydon-maker/Essence-Designs</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPatch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedPatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedPatch ? 'Copied to Clipboard' : 'Copy Patch'}</span>
                  </button>

                  <button
                    onClick={handleSendToCleanroom}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-cinzel font-semibold transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Send to WAVE Cleanroom</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-[50vh] leading-relaxed">
                <code>{mobileCssPatch}</code>
              </pre>
            </div>
          )}

          {activeTab === 'dropin' && (
            <div className="w-full max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>Pr0sis Self-Healing Drop-In Script & Aider Command</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      All 6 Invariants
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Fixes viewport, 100dvh, horizontal overflow wobble, touch delays, retina DPR, and WebAudio auto-unlock on load.
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('<script src="https://ais-pre-27a970cd-b21a-44ff-a96f-fae985a3138d.ai.studio/pr0sis-mobile-fix.js"></script>');
                    setCopiedScript(true);
                    playCelestialChime(880, 'sine', 0.2);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Tag Copied!' : 'Copy Script Tag'}</span>
                </button>
              </div>

              {/* Method 1: HTML Script Tag */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-emerald-400">METHOD 1:</span>
                  <span>Add Drop-in Script to Pr0sis index.html</span>
                </div>
                <p className="text-xs text-slate-400">
                  Paste before the closing <code className="text-cyan-300 font-mono">&lt;/head&gt;</code> tag in your repository:
                </p>
                <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
                  &lt;script src="./pr0sis-mobile-fix.js"&gt;&lt;/script&gt;
                </div>
              </div>

              {/* Method 2: Aider Command */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-amber-400">METHOD 2:</span>
                  <span>Aider One-Shot Prompt (When Routing Restored)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Run this inside your local <code className="text-amber-300 font-mono">drewslaydon-maker/Essence-Designs</code> directory:
                </p>
                <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-amber-200 select-all overflow-x-auto">
                  aider --message &quot;Fix mobile viewport: Add viewport-fit=cover meta tag, apply 100dvh and overflow-x:hidden to html and body, set touch-action:manipulation on all interactive buttons, and support retina 2x canvas devicePixelRatio.&quot;
                </div>
              </div>

              {/* Method 3: Direct Code Refactor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-2">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>METHOD 3: Paste Your Files Directly In Chat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  You can paste your Pr0sis <code className="text-cyan-300 font-mono">index.html</code> or game canvas script directly into this chat, and I will refactor it with all 6 mobile fixes baked in and provide the finished code instantly!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
