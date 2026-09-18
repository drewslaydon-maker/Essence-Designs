/**
 * TavernDartsModal.tsx
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Module: Tavern Darts (Far Right Wall)
 * 
 * Embeds TavernDartsController.js with Lissajous sway, polar coordinates,
 * mobile dual-thumb touch controls, and audio synthesized frequency ramps.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Target, X, RotateCcw, Trophy, Sparkles, Wind } from 'lucide-react';
import { TavernDartsController } from '../minigames/TavernDartsController.js';
import { hearthSaveService } from '../services/TavernHearthSaveService';
import { playCelestialChime } from '../utils/audio';

interface TavernDartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCleared?: (stats: { highScore: number; bullsEyes: number }) => void;
}

const DART_SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

export const TavernDartsModal: React.FC<TavernDartsModalProps> = ({
  isOpen,
  onClose,
  onCleared,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<TavernDartsController | null>(null);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [lastCallout, setLastCallout] = useState<string>('Drag on board to aim. Tap or hold THROW!');
  const [lastColor, setLastColor] = useState<string>('#f59e0b');

  useEffect(() => {
    if (!isOpen) return;

    const controller = new TavernDartsController({
      dartsPerLeg: 3,
      onDartThrown: (hit: any) => {
        setLastCallout(hit.label);
        if (hit.ring === 'inner_bull' || hit.ring === 'outer_bull') {
          setLastColor('#ef4444');
          playCelestialChime(880, 'sine', 0.3);
        } else if (hit.multiplier === 3) {
          setLastColor('#f59e0b');
          playCelestialChime(660, 'triangle', 0.2);
        } else if (hit.multiplier === 2) {
          setLastColor('#38bdf8');
          playCelestialChime(550, 'triangle', 0.2);
        } else if (hit.points === 0) {
          setLastColor('#94a3b8');
          playCelestialChime(180, 'sawtooth', 0.15);
        } else {
          setLastColor('#e2e8f0');
          playCelestialChime(440, 'sine', 0.15);
        }
      },
      onLegComplete: (summary: any) => {
        // Save to Hearth Save
        const current = hearthSaveService.loadSave();
        const best = Math.max(summary.totalScore, current?.activities?.darts?.highScore || 0);
        const totalBulls = (current?.activities?.darts?.bullsEyes || 0) + summary.bullsEyes;
        hearthSaveService.writeSave({
          activities: {
            ...current?.activities,
            darts: {
              cleared: true,
              highScore: best,
              bullsEyes: totalBulls,
              attempts: ((current?.activities?.darts?.attempts || 0) + 1),
            },
          },
        });
        if (onCleared) {
          onCleared({ highScore: best, bullsEyes: totalBulls });
        }
      },
    });

    controller.start();
    controllerRef.current = controller;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      controller.update(dt);
      const snap = controller.toSnapshot();
      setSnapshot(snap);

      // Render onto canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderDartsCanvas(ctx, canvas.width, canvas.height, snap);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderDartsCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    snap: any
  ) => {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height * 0.44;
    const R = Math.min(width, height) * 0.40;

    // 1. Outer wood frame
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = '#1b120c';
    ctx.fill();
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 4 * (width / 500);
    ctx.stroke();

    // 2. Wedges
    const wedgeAngle = (Math.PI * 2) / 20;
    for (let i = 0; i < 20; i++) {
      const startA = i * wedgeAngle - Math.PI / 2 - wedgeAngle / 2;
      const endA = startA + wedgeAngle;
      const isDark = i % 2 === 0;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, startA, endA);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.fill();

      // Double ring wedge (outer)
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.96, startA, endA);
      ctx.arc(cx, cy, R * 0.88, endA, startA, true);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#dc2626' : '#16a34a';
      ctx.fill();

      // Triple ring wedge (inner)
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.58, startA, endA);
      ctx.arc(cx, cy, R * 0.52, endA, startA, true);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#dc2626' : '#16a34a';
      ctx.fill();

      // Numbers
      const numA = i * wedgeAngle - Math.PI / 2;
      const numX = cx + Math.cos(numA) * (R * 1.14);
      const numY = cy + Math.sin(numA) * (R * 1.14);
      ctx.font = `bold ${11 * (width / 500)}px monospace`;
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(DART_SECTORS[i].toString(), numX, numY);
    }

    // Outer Bull (25)
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.11, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Inner Bull (50)
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.045, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();

    // Wire rings
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    [0.045, 0.11, 0.52, 0.58, 0.88, 0.96, 1.0].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Landed Darts
    snap.dartsThrown.forEach((hit: any) => {
      const hx = cx + hit.x * R;
      const hy = cy + hit.y * R;
      ctx.beginPath();
      ctx.arc(hx, hy, 5 * (width / 500), 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // In-flight dart
    if (snap.state === 'IN_FLIGHT') {
      const fx = cx + snap.flightPos.x * R;
      const fy = cy + snap.flightPos.y * R;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.scale(snap.flightScale, snap.flightScale);
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(4, 16);
      ctx.lineTo(-4, 16);
      ctx.closePath();
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.restore();
    }

    // Reticle with Lissajous Hand Sway
    if (snap.state === 'AIMING' && snap.dartsRemaining > 0) {
      const rx = cx + snap.reticleX * R;
      const ry = cy + snap.reticleY * R;

      ctx.strokeStyle = snap.isHoldingBreath ? '#38bdf8' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, 14 * (width / 500), 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx - 18, ry); ctx.lineTo(rx + 18, ry);
      ctx.moveTo(rx, ry - 18); ctx.lineTo(rx, ry + 18);
      ctx.stroke();

      // Tension Arc
      if (snap.tension > 0) {
        ctx.beginPath();
        ctx.arc(rx, ry, 22 * (width / 500), -Math.PI / 2, -Math.PI / 2 + snap.tension * Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  };

  const handlePointerAim = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !controllerRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height * 0.44;
    const R = Math.min(rect.width, rect.height) * 0.40;

    const normX = (e.clientX - rect.left - cx) / R;
    const normY = (e.clientY - rect.top - cy) / R;
    controllerRef.current.setAim(normX, normY);
  };

  const handleThrow = () => {
    if (!controllerRef.current) return;
    playCelestialChime(300, 'triangle', 0.1);
    controllerRef.current.startTension();
    setTimeout(() => {
      controllerRef.current?.releaseThrow();
    }, 100);
  };

  const handleReset = () => {
    if (!controllerRef.current) return;
    controllerRef.current.reset();
    setLastCallout('Leg reset. Ready to aim!');
    setLastColor('#f59e0b');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c120c] to-[#0d0905] border-2 border-amber-500/60 p-4 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-3 select-none flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-300">
                TAVERN DARTS (FAR RIGHT WALL)
              </h2>
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-400/80">
                Lissajous Hand Sway • Polar Coordinate Targeting
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* HUD Chips */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
            Darts: <strong className="text-amber-400">{snapshot?.dartsRemaining ?? 3} / 3</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
            Score: <strong className="text-emerald-400">{snapshot?.totalScore ?? 0}</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
            Bulls: <strong className="text-rose-400">{snapshot?.bullsEyes ?? 0}</strong>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full aspect-square max-h-[380px] rounded-xl bg-[#120a06] border border-amber-500/40 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onPointerDown={handlePointerAim}
            onPointerMove={(e) => { if (e.buttons === 1) handlePointerAim(e); }}
            className="w-full h-full object-contain cursor-crosshair touch-none"
          />

          {snapshot?.state === 'LEG_COMPLETE' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in fade-in">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
              <h3 className="font-cinzel text-lg font-bold text-amber-300">LEG CONCLUDED!</h3>
              <p className="text-xs font-mono text-slate-300">
                Final Score: <strong className="text-amber-400 text-sm">{snapshot.totalScore}</strong> | Bullseyes: <strong className="text-rose-400">{snapshot.bullsEyes}</strong>
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono font-bold text-xs cursor-pointer active:scale-95"
                >
                  PLAY AGAIN
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer active:scale-95"
                >
                  RETURN TO TAVERN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Callout */}
        <div
          className="text-center font-mono font-bold text-xs py-1 transition-colors"
          style={{ color: lastColor }}
        >
          {lastCallout}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onPointerDown={() => controllerRef.current?.setHoldBreath(true)}
            onPointerUp={() => controllerRef.current?.setHoldBreath(false)}
            onPointerLeave={() => controllerRef.current?.setHoldBreath(false)}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-900 border border-sky-500/50 active:bg-sky-500 active:text-slate-950 text-sky-300 font-mono font-bold text-xs active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation"
          >
            <Wind className="w-4 h-4" />
            <span>HOLD BREATH (Steady)</span>
          </button>

          <button
            type="button"
            onClick={handleThrow}
            disabled={snapshot?.dartsRemaining <= 0 || snapshot?.state === 'IN_FLIGHT'}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs shadow-lg active:scale-98 transition-transform cursor-pointer border border-amber-300 disabled:opacity-40 flex items-center justify-center gap-1.5 touch-manipulation"
          >
            <Target className="w-4 h-4" />
            <span>PULL & THROW [Z]</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer active:scale-95"
            title="Reset Leg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
