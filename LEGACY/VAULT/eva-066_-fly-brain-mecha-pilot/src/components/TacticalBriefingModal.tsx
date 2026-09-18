/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Cpu, AlertTriangle, Crosshair, Dna, Brain, Eye } from 'lucide-react';

interface TacticalBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TacticalBriefingModal: React.FC<TacticalBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-2 border-orange-500 rounded-lg p-6 shadow-2xl shadow-orange-950/50">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none rounded-lg" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-orange-500/40 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-mono-tech tracking-widest uppercase">
              <span>TOP SECRET // NERV BIO-CYBERNETICS CLASSIFIED</span>
              <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-700 rounded text-[10px]">
                CODE: 066-DROSOPHILA
              </span>
            </div>
            <h2 className="text-2xl font-bold font-teko text-orange-400 tracking-wider mt-1">
              PROJECT CONNECTOME: THE FLY IN THE EVA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-orange-400 hover:bg-neutral-900 border border-neutral-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Box */}
        <div className="space-y-5 text-sm text-neutral-300 font-mono-tech leading-relaxed">
          <div className="p-3.5 bg-red-950/30 border border-red-500/40 rounded">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Pilot Relocation Directive: Shinji Replaced</span>
            </div>
            <p className="text-xs text-neutral-300">
              Third Child Shinji Ikari repeatedly stated: <span className="text-neutral-100 italic">&ldquo;I don&rsquo;t wanna pilot it, father!&rdquo;</span>.
              NERV Bio-Division deemed human emotions too fragile and synthesized an interface for <strong className="text-emerald-400">Specimen-01 (Drosophila melanogaster)</strong>,
              leveraging the newly published complete fruit fly connectome (139,255 mapped neurons and 50+ million synapses).
            </p>
          </div>

          {/* Biological Modules Breakdown */}
          <div>
            <h3 className="text-base font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Authentic Biological Circuit Emulation</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>1. Optic Lobes & EMDs (T4 / T5 Cells)</span>
                </div>
                <p className="text-neutral-400">
                  Motion-detecting circuits calculate optic flow across the compound eye. Incoming lateral projectiles stimulate left/right turning reflexes in the descending steering neurons (DNa01/DNa02).
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>2. Giant Fiber Looming Reflex (GF Axon)</span>
                </div>
                <p className="text-neutral-400">
                  When an object rapidly expands in the visual field (approaching attack), the Giant Fiber spikes violently, triggering an instant evasive thruster burst or A.T. Field pulse.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                <div className="flex items-center gap-1.5 font-bold text-purple-400 mb-1">
                  <Dna className="w-3.5 h-3.5" />
                  <span>3. Central Complex (E-PG Ring Attractor)</span>
                </div>
                <p className="text-neutral-400">
                  The biological compass of the fly brain. 8 wedge neurons maintain a localized activity bump, representing the EVA heading azimuth relative to Tokyo-3 landmarks.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>4. Descending Motor & Neuromodulators</span>
                </div>
                <p className="text-neutral-400">
                  Octopamine (fly adrenaline) increases spike rates and wingbeat frequency (~180-240Hz). Dopamine/sugar satiety stabilizes synaptic synchronization.
                </p>
              </div>
            </div>
          </div>

          {/* Angels (Natural Fly Predators) */}
          <div>
            <h3 className="text-base font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>The Invading Angels: Natural Predators of the Fly</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li>
                <strong className="text-red-400">Sachiel-Arachnida (Angel 03):</strong> Giant spider weaver deploying crystalline snare webs and leaping lunges.
              </li>
              <li>
                <strong className="text-amber-400">Ramiel-Swat (Angel 04):</strong> Floating geometric flyswatter polyhedron charging a fatal high-voltage swat laser.
              </li>
              <li>
                <strong className="text-emerald-400">Mantis-Iel (Angel 05):</strong> Apex ambush predator swinging supersonic geometric scythes.
              </li>
              <li>
                <strong className="text-purple-400">Frog-Iel (Angel 06):</strong> Subterranean titan firing a supersonic tongue harpoon causing maximum looming threat.
              </li>
            </ul>
          </div>

          {/* Controls & Baseball Drill */}
          <div className="p-3 bg-orange-950/20 border border-orange-500/30 rounded text-xs space-y-1">
            <div className="font-bold text-orange-400 uppercase">Operator Directives & Controls:</div>
            <p>• <strong>Auto-Fly Pilot:</strong> The connectome drives the robot autonomously based on optic flow and looming signals!</p>
            <p>• <strong>Bio-Sync Mode:</strong> Steer using [A]/[D] or Arrow Keys, fire the Positron Rifle with [Spacebar], and inject Octopamine [E].</p>
            <p>• <strong>Sugar Lure [S]:</strong> Drops a sweet sucrose beacon to guide the fly mecha toward the center.</p>
            <p>• <strong>Baseball Drill Mode:</strong> Switch tabs anytime to calibrate the fly&rsquo;s looming reflex against Angel energy fastballs!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-bold font-teko text-lg uppercase tracking-wider rounded transition-colors"
          >
            Acknowledge & Enter Pilot Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
