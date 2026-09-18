/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { audio } from '../services/audioService';
import { ShieldAlert, Play, Volume2, Sparkles, ChevronRight } from 'lucide-react';

interface GendoIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GendoIntroModal: React.FC<GendoIntroModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      audio.playGendoChord();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const dialogue = [
    {
      speaker: 'COMMANDER GENDO IKAR-FLY [碇ゲンドウ]',
      role: 'NERV SUPREME COMMANDER // THE APEX SPECIMEN',
      text: 'Shin-fly. The Angels have breached the Tokyo-3 ceiling. An extreme looming threat is descending upon Central Dogma.',
      color: 'text-amber-400',
    },
    {
      speaker: 'SHIN-FLY IKARI [碇シンジ]',
      role: 'THIRD CHILDREN // SPECIMEN-01 PILOT',
      text: 'Father... no! I can\'t! My Giant Fiber neurons aren\'t calibrated! My ommatidia are spinning! I just wanted a droplet of 10% sucrose water!',
      color: 'text-purple-300',
    },
    {
      speaker: 'COMMANDER GENDO IKAR-FLY [碇ゲンドウ]',
      role: 'NERV SUPREME COMMANDER // THE APEX SPECIMEN',
      text: 'If you refuse to pilot EVA-066... Rei-va will have to crawl into the bio-plug again. Even with half her chitin fractured.',
      color: 'text-amber-400',
    },
    {
      speaker: 'SHIN-FLY IKARI [碇シンジ]',
      role: 'THIRD CHILDREN // SPECIMEN-01 PILOT',
      text: 'I must not fly away... I must not fly away... I MUST NOT FLY AWAY! Fine! Launch the biological biomecha!',
      color: 'text-emerald-400',
    },
  ];

  const handleNext = () => {
    if (step < dialogue.length - 1) {
      audio.playBeep(480 + step * 60, 'sine', 0.1);
      setStep(step + 1);
    } else {
      handleLaunch();
    }
  };

  const handleLaunch = () => {
    audio.playEmergencyKlaxon();
    audio.playLoomingReflex();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none">
      {/* Letterbox cinematic container */}
      <div className="relative w-full max-w-4xl border-2 border-red-600/80 bg-gradient-to-b from-neutral-950 via-red-950/20 to-neutral-950 rounded-lg overflow-hidden shadow-2xl shadow-red-950/90 flex flex-col">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

        {/* NERV Top Banner */}
        <div className="px-4 py-2 bg-red-950/80 border-b border-red-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
              NERV COMMAND DOGMA // EMERGENCY DIRECTIVE #01
            </span>
          </div>
          <span className="text-[10px] font-mono text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40">
            CONFIDENTIAL // MAGI-01 RATIFIED
          </span>
        </div>

        {/* Main Cinematic Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
          {/* Left: Commander Gendo Ikar-fly Vector Art */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-black/60 border border-amber-500/30 rounded-lg relative overflow-hidden">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Backlight halo glow */}
              <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />

              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                {/* NERV High-Collar Silhouette */}
                <path d="M40 190 L60 125 L140 125 L160 190 Z" fill="#0f0f14" stroke="#451a03" strokeWidth="2" />
                <path d="M75 125 L100 150 L125 125" stroke="#ef4444" strokeWidth="2" fill="none" />

                {/* Fly Head Capsule */}
                <ellipse cx="100" cy="85" rx="38" ry="32" fill="#18181b" stroke="#78350f" strokeWidth="2" />

                {/* Left Compound Eye (Faceted Fly Eye) */}
                <ellipse cx="74" cy="80" rx="18" ry="24" fill="#451a03" stroke="#b45309" strokeWidth="1.5" transform="rotate(-15 74 80)" />
                <path d="M62 70 L86 90 M64 85 L84 75 M70 65 L78 95" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />

                {/* Right Compound Eye */}
                <ellipse cx="126" cy="80" rx="18" ry="24" fill="#451a03" stroke="#b45309" strokeWidth="1.5" transform="rotate(15 126 80)" />
                <path d="M114 90 L138 70 M116 75 L136 85 M122 65 L130 95" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />

                {/* Antennae */}
                <path d="M92 56 Q85 35 70 30" stroke="#a1a1aa" strokeWidth="2" fill="none" />
                <path d="M108 56 Q115 35 130 30" stroke="#a1a1aa" strokeWidth="2" fill="none" />
                <circle cx="70" cy="30" r="2.5" fill="#f59e0b" />
                <circle cx="130" cy="30" r="2.5" fill="#f59e0b" />

                {/* Iconic Gendo Tinted Glasses (Solid Orange Rectangular Lenses) */}
                <rect x="62" y="74" width="34" height="15" rx="2" fill="#f59e0b" opacity="0.9" stroke="#ffffff" strokeWidth="1" />
                <rect x="104" y="74" width="34" height="15" rx="2" fill="#f59e0b" opacity="0.9" stroke="#ffffff" strokeWidth="1" />
                <line x1="96" y1="81" x2="104" y2="81" stroke="#ffffff" strokeWidth="1.5" />
                {/* Lens Flare Reflections */}
                <polygon points="65,86 78,76 82,76 69,86" fill="#ffffff" opacity="0.8" />
                <polygon points="107,86 120,76 124,76 111,86" fill="#ffffff" opacity="0.8" />

                {/* Fly Proboscis & Mouthparts behind clasped gloved claws */}
                <path d="M96 110 L100 128 L104 110" stroke="#71717a" strokeWidth="2" fill="none" />

                {/* Clasping White-Gloved Fly Claws (Iconic Gendo Pose) */}
                {/* Desk Silhouette */}
                <rect x="25" y="168" width="150" height="25" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />

                {/* Left gloved forearm & jointed claws */}
                <path d="M55 170 Q80 148 94 140" stroke="#e4e4e7" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M92 138 Q99 132 105 138" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />

                {/* Right gloved forearm */}
                <path d="M145 170 Q120 148 106 140" stroke="#e4e4e7" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M108 138 Q101 132 95 138" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />

                {/* Additional fly tarsal spikes */}
                <circle cx="100" cy="136" r="3" fill="#ef4444" />
              </svg>
            </div>

            <div className="mt-2 text-center">
              <div className="text-xs font-bold text-amber-400 tracking-wider font-mono">
                GENDO IKAR-FLY
              </div>
              <div className="text-[9px] text-neutral-400 font-mono">
                "GET IN THE ROBOT, SHIN-FLY."
              </div>
            </div>
          </div>

          {/* Right: Dramatic Dialogue & Monitor Readout */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* Monitor Box */}
            <div className="p-4 bg-black/80 border border-red-500/40 rounded-lg min-h-[160px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-red-500/30 pb-1.5 mb-2">
                  <span className="text-[11px] font-bold text-red-400 tracking-wider font-mono">
                    {dialogue[step].speaker}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono">
                    SCENE 0{step + 1} / 04
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2">
                  {dialogue[step].role}
                </div>
                <p className={`text-sm sm:text-base font-medium leading-relaxed ${dialogue[step].color}`}>
                  {dialogue[step].text}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-1.5 pt-3">
                {dialogue.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? 'w-8 bg-red-500' : 'w-2 bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tactical Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleLaunch}
                className="text-xs text-neutral-400 hover:text-neutral-200 underline font-mono tracking-wider"
              >
                Skip Briefing [Direct Launch]
              </button>

              <div className="flex items-center gap-2">
                {step < dialogue.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase rounded transition-colors shadow-lg shadow-red-700/30 font-mono"
                  >
                    <span>Next Transmission</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-black font-extrabold text-sm uppercase rounded transition-all shadow-xl shadow-red-600/40 animate-pulse font-teko tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>GET IN THE MECHA // PILOT EVA-066</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
