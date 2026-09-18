/**
 * ProvingGroundsView.tsx
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Proving Grounds (Micro-Game Prototyping & Cleanroom Sandboxes)
 * 
 * Allows the Lead WebDev / Mechanic-Physicist & Director to inspect, test,
 * and play verified standalone minigames in simulated mobile chassis frames.
 */

import React, { useState } from 'react';
import { Target, Zap, Coffee, CircleDot, Globe, ExternalLink, Monitor, Smartphone, Tablet, Sparkles } from 'lucide-react';

interface SandboxSpec {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  axioms: string[];
}

const SANDBOXES: SandboxSpec[] = [
  {
    id: 'darts',
    title: 'Tavern Darts (Lissajous & Polar Targeting)',
    category: 'Aim & Sway Mechanic',
    description: 'Far right wall activity. Lissajous equation hand sway, breath holding, pull-back tension, and polar-coordinate dartboard scoring with zero npm runtime dependencies.',
    path: '/sandboxes/tavern-darts.html',
    icon: Target,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    axioms: ['Lissajous curve x=sin(2.1t), y=cos(1.7t)', 'Polar radius & angle evaluation', 'AudioContext synthesized frequency chimes'],
  },
  {
    id: 'sparring',
    title: 'Zozog Sparring (Strictly 2-Verb Brawling)',
    category: 'Combat Mechanic',
    description: 'Far left corner brawl pit. Melee tutorial with strictly 2 verbs: STRIKE [Z] and BLOCK [X]. Features telegraph spark alerts, perfect parry window, and combo multipliers.',
    path: '/sandboxes/zozog-sparring.html',
    icon: Zap,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    axioms: ['2-Verb state machine (STRIKE / BLOCK)', 'Tight parry frame check (0.2s)', '3 progressive bouts with recovery states'],
  },
  {
    id: 'yarn-brew',
    title: 'Tavern Brew Refinement & Foraging (Match-3)',
    category: 'Alchemy & Puzzle',
    description: 'Ingredients foraging & ale blending for Atreyu\'s Moon-Casks. Pure canvas 2D grid swap mechanic with gravity drops, cascades, and procedural fermentation sparkles.',
    path: '/sandboxes/yarn-brew-match3.html',
    icon: Coffee,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
    axioms: ['Pure HTML5 Canvas 8x8 grid', 'Breadth-first cascade matching', 'Zero external physics or match engine'],
  },
  {
    id: 'ball-breaker',
    title: 'Ball Breaker // Slingshot & Feel Sandbox (Phase 1)',
    category: 'Kinetic Physics & Audio',
    description: 'Kinetic slingshot and feel sandbox. Logarithmic tension dampening, elliptical deformation under stretch, dual-band cyan-to-amber shift, predictive trajectory beads with single-surface bounce, and procedural Web Audio.',
    path: '/sandboxes/ball-breaker.html',
    icon: CircleDot,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    axioms: [
      'Strict touchId tracking via changedTouches with touch-action: none',
      'Logarithmic tension dampening (Rmax · tanh(d / Rmax)) & elliptical stretch',
      'Dynamic dual-band tension rendering with cyan to hot amber shift',
      'Predictive trajectory beads with single-surface boundary bounce reflection',
      'Procedural Web Audio: 110Hz→440Hz pull ramp, sub-bass release, dynamic bounce blips',
      'Screen-shake impulse and ball reset upon coming to rest',
    ],
  },
  {
    id: 'room0',
    title: 'Room 0: The Greedy Greens (Pure HTML Engine)',
    category: 'Vertical Slice',
    description: 'The complete standalone prologue: top-down JRN-204 AABB sliding, Atreyu drinking duel, Kairon rhythm, Matchstick recon, and the South Door ambush.',
    path: '/journeys/index.html',
    icon: Globe,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    axioms: ['Single-file zero-dependency architecture', 'Mobile touch D-Pad with changedTouches', 'Tavern diorama diorama lighting'],
  },
];

interface ProvingGroundsViewProps {
  previewDevice: string;
  setPreviewDevice: (d: string) => void;
}

export const ProvingGroundsView: React.FC<ProvingGroundsViewProps> = ({
  previewDevice,
  setPreviewDevice,
}) => {
  const [selectedSandbox, setSelectedSandbox] = useState<SandboxSpec>(SANDBOXES[0]);

  return (
    <div className="space-y-4">
      {/* Sandbox Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {SANDBOXES.map((sb) => {
          const Icon = sb.icon;
          const isSelected = selectedSandbox.id === sb.id;
          return (
            <button
              key={sb.id}
              onClick={() => setSelectedSandbox(sb)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? `${sb.badgeColor} shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold scale-[1.02]`
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sb.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Sandbox Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sandbox Preview Canvas Frame */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-amber-300 font-bold">{selectedSandbox.title}</span>
            </div>
            <a
              href={selectedSandbox.path}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
            >
              <span>Launch Fullscreen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Scrolling Safety Notice & Top Return */}
          <div className="w-full max-w-[800px] flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span>↕ Mobile Safe Scroll:</span>
              <span className="text-slate-300">Drag this bar or margins to scroll page</span>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-bold"
            >
              ↑ Top Nav
            </button>
          </div>

          <div
            className={`transition-all duration-300 relative overflow-hidden shadow-2xl bg-[#06090f] border-4 ${
              previewDevice === 'desktop'
                ? 'w-full max-w-[800px] h-[600px] rounded-xl border-slate-700/80 p-0'
                : previewDevice === 'iphone-14'
                ? 'w-[390px] h-[780px] max-w-full rounded-[28px] border-slate-700 p-2'
                : previewDevice === 'iphone-se'
                ? 'w-[375px] h-[667px] max-w-full rounded-[28px] border-slate-700 p-2'
                : previewDevice === 'landscape'
                ? 'w-[720px] h-[400px] max-w-full rounded-[28px] border-slate-700 p-2'
                : 'w-[768px] h-[900px] max-w-full rounded-[28px] border-slate-700 p-3'
            }`}
          >
            {previewDevice !== 'desktop' && (
              <div className="flex justify-center mb-1.5">
                <div className="w-20 h-1.5 rounded-full bg-slate-800 border border-slate-700/60" />
              </div>
            )}

            <iframe
              key={selectedSandbox.path}
              src={selectedSandbox.path}
              title={selectedSandbox.title}
              className="w-full h-full border-0 rounded-xl bg-black"
            />
          </div>

          {/* Bottom Scroll Safety Handle */}
          <div className="w-full max-w-[800px] flex items-center justify-between px-3 py-1.5 mt-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-slate-400">↕ Drag margins to scroll past mini-game</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-bold"
            >
              ↑ Return to Top
            </button>
          </div>
        </div>

        {/* Right Column: Sandbox Specs & Technical Axioms */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${selectedSandbox.badgeColor}`}>
                {selectedSandbox.category}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Axiom Compliant
              </span>
            </div>

            <h3 className="font-cinzel text-base font-bold text-amber-300">
              {selectedSandbox.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedSandbox.description}
            </p>

            {/* Axioms Checklist */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Technical Axioms Verified:
              </span>
              {selectedSandbox.axioms.map((ax, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{ax}</span>
                </div>
              ))}
            </div>

            {/* Direct Link */}
            <div className="pt-3 border-t border-slate-800">
              <a
                href={selectedSandbox.path}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Cleanroom Sandbox Tab</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
