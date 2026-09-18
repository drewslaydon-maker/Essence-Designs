import React, { useRef, useEffect } from 'react';
import { Sparkles, Footprints, MessageSquare, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Realm } from '../types';

interface VirtualControlsProps {
  realm: Realm;
  onStep: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onInteract: () => void;
  onToggleRealm: () => void;
  onDash: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  realm,
  onStep,
  onInteract,
  onToggleRealm,
  onDash,
}) => {
  const holdTimerRef = useRef<number | null>(null);
  const stepIntervalRef = useRef<number | null>(null);
  const activeDirRef = useRef<'up' | 'down' | 'left' | 'right' | null>(null);

  const clearTimers = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (stepIntervalRef.current !== null) {
      window.clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  };

  const startStepping = (dir: 'up' | 'down' | 'left' | 'right') => {
    clearTimers();
    activeDirRef.current = dir;
    // Immediate 1 single tile step
    onStep(dir);

    // If held down for >220ms, initiate controlled walking cadence (every 180ms)
    holdTimerRef.current = window.setTimeout(() => {
      stepIntervalRef.current = window.setInterval(() => {
        if (activeDirRef.current) {
          onStep(activeDirRef.current);
        }
      }, 180);
    }, 220);
  };

  const stopStepping = () => {
    activeDirRef.current = null;
    clearTimers();
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      stopStepping();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      clearTimers();
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  return (
    <div
      id="virtual-controls"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-3 sm:p-6 flex items-end justify-between select-none touch-none"
    >
      {/* Left: Directional Pad */}
      <div className="pointer-events-auto relative w-36 h-36 sm:w-44 sm:h-44 bg-slate-950/75 backdrop-blur-md rounded-full border border-slate-700/80 shadow-2xl p-2 flex items-center justify-center">
        {/* Center core */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400/70 animate-pulse" />
        </div>

        {/* Up */}
        <button
          id="btn-dpad-up"
          onPointerDown={(e) => {
            e.preventDefault();
            startStepping('up');
          }}
          onPointerUp={stopStepping}
          onPointerLeave={stopStepping}
          onPointerCancel={stopStepping}
          className="absolute top-1.5 inset-x-1/2 -translate-x-1/2 w-12 h-11 bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 rounded-t-xl border-t border-slate-600 flex items-center justify-center text-slate-200 transition-colors shadow-md active:scale-95"
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          id="btn-dpad-down"
          onPointerDown={(e) => {
            e.preventDefault();
            startStepping('down');
          }}
          onPointerUp={stopStepping}
          onPointerLeave={stopStepping}
          onPointerCancel={stopStepping}
          className="absolute bottom-1.5 inset-x-1/2 -translate-x-1/2 w-12 h-11 bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 rounded-b-xl border-b border-slate-600 flex items-center justify-center text-slate-200 transition-colors shadow-md active:scale-95"
          aria-label="Move Down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          id="btn-dpad-left"
          onPointerDown={(e) => {
            e.preventDefault();
            startStepping('left');
          }}
          onPointerUp={stopStepping}
          onPointerLeave={stopStepping}
          onPointerCancel={stopStepping}
          className="absolute left-1.5 inset-y-1/2 -translate-y-1/2 w-11 h-12 bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 rounded-l-xl border-l border-slate-600 flex items-center justify-center text-slate-200 transition-colors shadow-md active:scale-95"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          id="btn-dpad-right"
          onPointerDown={(e) => {
            e.preventDefault();
            startStepping('right');
          }}
          onPointerUp={stopStepping}
          onPointerLeave={stopStepping}
          onPointerCancel={stopStepping}
          className="absolute right-1.5 inset-y-1/2 -translate-y-1/2 w-11 h-12 bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 rounded-r-xl border-r border-slate-600 flex items-center justify-center text-slate-200 transition-colors shadow-md active:scale-95"
          aria-label="Move Right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Desktop Hints Indicator */}
      <div className="hidden md:flex flex-col items-center gap-1 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 text-[11px] text-slate-400 font-mono shadow-md">
        <span>[WASD / Arrows] Move • [E] Interact • [Q] Shift • [Space] Dash</span>
      </div>

      {/* Right: Action Buttons Pad */}
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {/* Phase Shift Button */}
        <button
          id="btn-action-realm-shift"
          onClick={onToggleRealm}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all ${
            realm === 'interstice'
              ? 'bg-purple-900/90 border-purple-400 text-purple-100 shadow-purple-600/40 ring-4 ring-purple-500/20'
              : 'bg-emerald-900/90 border-emerald-400 text-emerald-100 shadow-emerald-600/40 ring-4 ring-emerald-500/20'
          }`}
          title="Realm Shift [Q]"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Shift</span>
        </button>

        {/* Secondary row: Dash + Interact */}
        <div className="flex items-center gap-3">
          {/* Dash Button */}
          <button
            id="btn-action-dash"
            onClick={onDash}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-900/80 hover:bg-blue-800 border-2 border-blue-400/80 text-blue-100 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all"
            title="Dash [Space]"
          >
            <Footprints className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase mt-0.5">Dash</span>
          </button>

          {/* Primary Interact / Action Button */}
          <button
            id="btn-action-interact"
            onClick={onInteract}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border-2 border-amber-300 text-slate-950 font-black flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all ring-4 ring-amber-400/20"
            title="Interact / Examine [E]"
          >
            <MessageSquare className="w-6 h-6 fill-slate-950" />
            <span className="text-[10px] tracking-wider uppercase font-extrabold mt-0.5">Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
