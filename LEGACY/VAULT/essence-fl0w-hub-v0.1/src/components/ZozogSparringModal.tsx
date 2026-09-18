/**
 * ZozogSparringModal.tsx
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * Module: Zozog Sparring (Far Left Corner)
 * 
 * Melee Striking Tutorial: Strictly 2-Verb Brawling (STRIKE / BLOCK).
 * Telegraph spark, Perfect Parry windows, combo punish chains, and bout progression.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Shield, Zap, RotateCcw, X, Trophy, AlertTriangle } from 'lucide-react';
import { ZozogSparringController } from '../minigames/ZozogSparringController.js';
import { hearthSaveService } from '../services/TavernHearthSaveService';
import { playCelestialChime } from '../utils/audio';

interface ZozogSparringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCleared?: (stats: { boutsWon: number; perfectParries: number }) => void;
}

export const ZozogSparringModal: React.FC<ZozogSparringModalProps> = ({
  isOpen,
  onClose,
  onCleared,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<ZozogSparringController | null>(null);
  const [snapshot, setSnapshot] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new ZozogSparringController({
      onHit: (hit: any) => {
        if (hit.type === 'PUNISH') {
          playCelestialChime(500 + hit.combo * 80, 'triangle', 0.15);
        } else if (hit.type === 'OPPORTUNISTIC') {
          playCelestialChime(420, 'sine', 0.12);
        } else {
          playCelestialChime(200, 'sawtooth', 0.08);
        }
      },
      onParry: () => {
        playCelestialChime(880, 'square', 0.25);
      },
      onPlayerHit: () => {
        playCelestialChime(150, 'sawtooth', 0.2);
      },
      onBoutCleared: (boutNum: number) => {
        playCelestialChime(660, 'sine', 0.35);
      },
      onMatchComplete: (stats: any) => {
        const current = hearthSaveService.loadSave();
        const won = (current?.activities?.sparring?.boutsWon || 0) + stats.boutsWon;
        const parries = (current?.activities?.sparring?.perfectParries || 0) + stats.perfectParries;
        hearthSaveService.writeSave({
          activities: {
            ...current?.activities,
            sparring: {
              cleared: true,
              boutsWon: won,
              perfectParries: parries,
            },
          },
        });
        if (onCleared) {
          onCleared({ boutsWon: won, perfectParries: parries });
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

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderSparringCanvas(ctx, canvas.width, canvas.height, snap);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyZ' || e.code === 'Space') {
        controller.strike();
      }
      if (e.code === 'KeyX') {
        controller.setBlock(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyX') {
        controller.setBlock(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderSparringCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    snap: any
  ) => {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height * 0.46;
    const scale = width / 500;

    // Sawdust ring
    ctx.beginPath();
    ctx.ellipse(cx, cy + 60 * scale, 170 * scale, 75 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#22150b';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Opponent Zozog
    ctx.save();
    ctx.translate(cx, cy);

    // Telegraph alert ring
    if (snap.zozogState === 'TELEGRAPH') {
      ctx.beginPath();
      ctx.arc(0, -30 * scale, 52 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Body
    ctx.fillStyle = snap.zozogState === 'STUNNED' ? '#475569' : '#065f46';
    ctx.fillRect(-36 * scale, -50 * scale, 72 * scale, 80 * scale);

    // Head
    ctx.beginPath();
    ctx.arc(0, -70 * scale, 28 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#047857';
    ctx.fill();

    // Tusks
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-10 * scale, -60 * scale); ctx.lineTo(-16 * scale, -75 * scale); ctx.lineTo(-6 * scale, -65 * scale);
    ctx.moveTo(10 * scale, -60 * scale); ctx.lineTo(16 * scale, -75 * scale); ctx.lineTo(6 * scale, -65 * scale);
    ctx.fill();

    // State visuals
    if (snap.zozogState === 'TELEGRAPH') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(46 * scale, -70 * scale, 20 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (snap.zozogState === 'STUNNED') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = `${18 * scale}px sans-serif`;
      ctx.fillText("💫 💫 💫", -35 * scale, -105 * scale);
    } else {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-48 * scale, -40 * scale, 22 * scale, 42 * scale);
      ctx.fillRect(26 * scale, -40 * scale, 22 * scale, 42 * scale);
    }

    ctx.restore();

    // Player Block Shield
    if (snap.isBlocking) {
      ctx.beginPath();
      ctx.arc(cx, cy + 30 * scale, 70 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  };

  const handleStrike = () => {
    controllerRef.current?.strike();
  };

  const handleNextBout = () => {
    if (!controllerRef.current) return;
    controllerRef.current.startBout(controllerRef.current.bout + 1);
  };

  const handleRestart = () => {
    controllerRef.current?.start();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#131d16] to-[#070d0a] border-2 border-emerald-500/60 p-4 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-3 select-none flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-emerald-300">
                ZOZOG SPARRING (FAR LEFT CORNER)
              </h2>
              <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80">
                Strictly 2-Verb Brawling: STRIKE / BLOCK • Parries & Combos
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

        {/* Meters */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-rose-400 font-bold w-24">Zozog Poise:</span>
            <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-rose-500 transition-all duration-75"
                style={{ width: `${Math.round((snapshot?.zozogPoise / (snapshot?.zozogMaxPoise || 100)) * 100)}%` }}
              />
            </div>
            <span className="text-slate-400 w-10 text-right">{snapshot?.zozogPoise ?? 100}</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-emerald-400 font-bold w-24">Bozog Stam:</span>
            <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-75"
                style={{ width: `${Math.round((snapshot?.playerStamina / (snapshot?.playerMaxStamina || 100)) * 100)}%` }}
              />
            </div>
            <span className="text-slate-400 w-10 text-right">{snapshot?.playerStamina ?? 100}</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full aspect-[4/3] max-h-[340px] rounded-xl bg-[#09120e] border border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={375}
            className="w-full h-full object-contain touch-none"
          />

          {snapshot?.state === 'BOUT_CLEARED' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in fade-in">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
              <h3 className="font-cinzel text-lg font-bold text-emerald-300">BOUT {snapshot.bout} WON!</h3>
              <p className="text-xs font-mono text-slate-300">Zozog fell to your relentless berserker combos!</p>
              <button
                type="button"
                onClick={handleNextBout}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-cinzel font-bold text-xs cursor-pointer active:scale-95"
              >
                PROCEED TO BOUT {snapshot.bout + 1}
              </button>
            </div>
          )}

          {snapshot?.state === 'MATCH_WON' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in fade-in">
              <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
              <h3 className="font-cinzel text-xl font-bold text-amber-300">TAVERN BRAWL CHAMPION!</h3>
              <p className="text-xs font-mono text-slate-300">
                All 3 Bouts Cleared • Perfect Parries: <strong className="text-emerald-300">{snapshot.perfectParries}</strong>
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-cinzel font-bold text-xs cursor-pointer active:scale-95"
              >
                RETURN TO TAVERN
              </button>
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        <div
          className="text-center font-mono font-bold text-xs py-1 transition-colors"
          style={{ color: snapshot?.feedbackColor || '#10b981' }}
        >
          {snapshot?.feedbackText || 'Tap STRIKE to hit. Hold BLOCK to parry telegraphed attacks!'}
        </div>

        {/* Strictly 2 Verbs Controls */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onPointerDown={() => controllerRef.current?.setBlock(true)}
            onPointerUp={() => controllerRef.current?.setBlock(false)}
            onPointerLeave={() => controllerRef.current?.setBlock(false)}
            className={`flex-1 py-3.5 px-4 rounded-xl border-2 font-mono font-black text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform touch-manipulation ${
              snapshot?.isBlocking
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>HOLD BLOCK [X]</span>
          </button>

          <button
            type="button"
            onClick={handleStrike}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 active:from-cyan-400 active:to-sky-300 text-slate-950 border-2 border-sky-300 font-cinzel font-black text-sm shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform touch-manipulation"
          >
            <Zap className="w-4 h-4" />
            <span>STRIKE [Z]</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer active:scale-95"
            title="Restart Sparring"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
