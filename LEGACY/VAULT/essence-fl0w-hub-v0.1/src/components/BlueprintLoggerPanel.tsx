import React, { useEffect, useRef, useState } from 'react';
import { 
  Copy, 
  Check, 
  FileCode, 
  Eye, 
  Code, 
  Terminal,
  ExternalLink,
  Smartphone,
  Gamepad2,
  Share2,
  Info
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

export const BlueprintLoggerPanel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'preview' && mountRef.current) {
      mountRef.current.innerHTML = '';
      
      const mountLogger = () => {
        if ((window as any).EssenceBlueprintLogger && mountRef.current) {
          (window as any).EssenceBlueprintLogger.mount(mountRef.current);
        }
      };

      if ((window as any).EssenceBlueprintLogger) {
        mountLogger();
      } else {
        const script = document.createElement('script');
        script.src = '/essence-blueprint-logger.js';
        script.onload = mountLogger;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [activeTab]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playCelestialChime(880, 'sine', 0.15);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const rawHtmlSnippet = `<div id="essence-blueprint-logger" data-auto-mount="essence-blueprint-logger">
  <div class="ebl-panel" role="region" aria-label="Essence Blueprint Logger">
    <!-- Header -->
    <header class="ebl-header">
      <div class="ebl-title-group">
        <span class="ebl-rune" aria-hidden="true">ᛉ ᛏ</span>
        <h2 class="ebl-title">ARCHITECTURAL BLUEPRINTS & INVARIANTS</h2>
      </div>
      <div class="ebl-controls">
        <button type="button" class="ebl-btn ebl-btn-primary" id="ebl-btn-copy-raw">
          <span>📋 Copy Specs</span>
        </button>
      </div>
    </header>

    <!-- Compact Overview Grid -->
    <div class="ebl-body-container">
      <div class="ebl-grid-overview">
        <!-- PR0SIS Mobile Card -->
        <div class="ebl-summary-card">
          <div class="ebl-card-head">
            <div class="ebl-card-title">
              <span style="color:var(--ebl-cyan)">●</span>
              <span>PR0SIS Mobile Health</span>
            </div>
            <span class="ebl-badge ebl-badge-cyan">6 FIXES ACTIVE</span>
          </div>
          <div class="ebl-card-pills">
            <span class="ebl-pill warn">viewport-fit=cover</span>
            <span class="ebl-pill warn">100dvh searchbar</span>
            <span class="ebl-pill">touch-action</span>
            <span class="ebl-pill">retina DPR 2x</span>
            <span class="ebl-pill">audio unlock</span>
            <span class="ebl-pill warn">overflow-x:hidden</span>
          </div>
          <button type="button" class="ebl-drill-btn" id="ebl-toggle-section-a">
            ▼ Toggle 6 Pr0sis Mobile Fixes
          </button>
        </div>

        <!-- JOURNEYS UNTO v2 Card -->
        <div class="ebl-summary-card ebl-summary-card-gold">
          <div class="ebl-card-head">
            <div class="ebl-card-title">
              <span style="color:var(--ebl-gold)">●</span>
              <span>JOURNEYS UNTO v2</span>
            </div>
            <span class="ebl-badge ebl-badge-gold">4 PILLARS</span>
          </div>
          <div class="ebl-card-pills">
            <span class="ebl-pill">Fixed dt (1/60s)</span>
            <span class="ebl-pill">Origin (0,0) Scene</span>
            <span class="ebl-pill" style="color:#6ee7b7;border-color:rgba(16,185,129,0.4)">Kinematic ES-Module (Aider Online)</span>
            <span class="ebl-pill">Prologue Chronicle</span>
          </div>
          <button type="button" class="ebl-drill-btn ebl-drill-btn-gold" id="ebl-toggle-section-b">
            ▼ Toggle 4 Blueprint Pillars
          </button>
        </div>
      </div>

      <!-- Collapsible Detailed Sections (Shown on toggle) -->
      <div class="ebl-detailed-wrap" id="ebl-wrap-a">
        <!-- Individual accordions for PR0SIS items 1 through 6 -->
      </div>
      <div class="ebl-detailed-wrap" id="ebl-wrap-b">
        <!-- Individual accordions for JOURNEYS UNTO items 1 through 4 -->
      </div>
    </div>
  </div>
</div>`;

  const scopedCssSnippet = `/* Scoped to #essence-blueprint-logger with zero global CSS pollution */
#essence-blueprint-logger {
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: max(10px, env(safe-area-inset-top, 0px)) max(12px, env(safe-area-inset-right, 0px)) max(12px, env(safe-area-inset-bottom, 0px)) max(12px, env(safe-area-inset-left, 0px));
  touch-action: manipulation;
}
/* See /essence-blueprint-logger.js for the complete isolated stylesheet */`;

  const isolatedJsSnippet = `// Self-contained Vanilla JS IIFE
// Drop this into your index.html:
// <div data-auto-mount="essence-blueprint-logger"></div>
// <script src="./essence-blueprint-logger.js"></script>`;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-slate-950 border border-cyan-500/35 shadow-xl overflow-hidden space-y-3">
      {/* Control Banner */}
      <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#060913]">
        <div className="flex items-center gap-2.5">
          <span className="font-decorative text-lg text-cyan-400 glow-rune">ᛏ</span>
          <div>
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>[DIRECTOR-OMEGA] Architectural Blueprint Logger</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                v0.2 Compact
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Summary view with drill-down accordions for individual fixes & code specs.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => { playCelestialChime(550, 'sine', 0.1); setActiveTab('preview'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'preview' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive View</span>
          </button>

          <button
            onClick={() => { playCelestialChime(600, 'sine', 0.1); setActiveTab('html'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'html' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            onClick={() => { playCelestialChime(650, 'sine', 0.1); setActiveTab('css'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'css' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>CSS</span>
          </button>

          <button
            onClick={() => { playCelestialChime(700, 'sine', 0.1); setActiveTab('js'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'js' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Script</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-3 sm:p-4">
        {activeTab === 'preview' && (
          <div className="space-y-2.5">
            <div 
              ref={mountRef} 
              className="w-full rounded-xl overflow-hidden"
            />
          </div>
        )}

        {activeTab === 'html' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Semantic HTML Structure</span>
              <button
                onClick={() => handleCopy(rawHtmlSnippet, 'html')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer"
              >
                {copiedKey === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'html' ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-[360px] leading-relaxed">
              {rawHtmlSnippet}
            </pre>
          </div>
        )}

        {activeTab === 'css' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Scoped CSS</span>
              <button
                onClick={() => handleCopy(scopedCssSnippet, 'css')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer"
              >
                {copiedKey === 'css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'css' ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-[360px] leading-relaxed">
              {scopedCssSnippet}
            </pre>
          </div>
        )}

        {activeTab === 'js' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Mount Script</span>
              <button
                onClick={() => handleCopy(isolatedJsSnippet, 'js')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer"
              >
                {copiedKey === 'js' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'js' ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-[360px] leading-relaxed">
              {isolatedJsSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
