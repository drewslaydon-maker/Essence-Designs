import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Palette, 
  RefreshCw, 
  Download, 
  Play, 
  Pause, 
  Heart, 
  Sliders, 
  Eye, 
  Smile, 
  Image as ImageIcon,
  Check,
  Zap,
  Coffee,
  Crown
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

interface SavedPainting {
  id: string;
  dataUrl: string;
  title: string;
  vibe: string;
  createdAt: string;
}

const JUJU_QUIPS = [
  "Adding some royal amethyst... immaculate.",
  "Bozog could never understand this level of craft.",
  "Drew, check this gradient right here!",
  "100% human-vetted art. Certified bug-free (except for me!).",
  "Mom's gonna love these soft yarn tones.",
  "Wait, is this running at 60 FPS? Approved.",
  "Just doing some avant-garde pollination on the canvas.",
  "A little bit of lavender fixes everything.",
  "Tell Jesse in Alaska that the frontier has great lighting.",
  "Artistic instinct > raw calculation. Always.",
  "A tiny fly with sovereign veto power. Tremble, mortals!"
];

type VibeMode = 'cozy' | 'sovereign' | 'celestial' | 'playful';

interface VibePreset {
  name: string;
  description: string;
  colors: string[];
  speed: number;
  saccadeRate: number;
  brushSize: number;
  icon: string;
}

const VIBE_PRESETS: Record<VibeMode, VibePreset> = {
  cozy: {
    name: 'Cozy Pastels',
    description: 'Soft lavender, peach, and warm cream curves. Gentle, relaxed flights.',
    colors: ['#c084fc', '#f472b6', '#fed7aa', '#fbcfe8', '#e9d5ff', '#ddd6fe'],
    speed: 2.2,
    saccadeRate: 0.03,
    brushSize: 7,
    icon: '☕'
  },
  sovereign: {
    name: 'Sovereign Violet & Gold',
    description: 'Regal purple, deep royal amethyst, and glowing molten gold. Decisive strokes.',
    colors: ['#9333ea', '#a855f7', '#fbbf24', '#f59e0b', '#7e22ce', '#e879f9'],
    speed: 3.2,
    saccadeRate: 0.06,
    brushSize: 9,
    icon: '👑'
  },
  celestial: {
    name: 'Starlight Dreamer',
    description: 'Deep cosmic blues, iridescent silver, and glittering starry particles.',
    colors: ['#38bdf8', '#818cf8', '#c084fc', '#e0e7ff', '#f43f5e', '#67e8f9'],
    speed: 2.8,
    saccadeRate: 0.04,
    brushSize: 5,
    icon: '✨'
  },
  playful: {
    name: 'Playful Zips',
    description: 'Rapid, unpredictable fly loops, splatters, and bright energetic bursts.',
    colors: ['#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'],
    speed: 4.5,
    saccadeRate: 0.12,
    brushSize: 6,
    icon: '🪰'
  }
};

export const FlyJujuStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [vibe, setVibe] = useState<VibeMode>('sovereign');
  const [brushStyle, setBrushStyle] = useState<'watercolor' | 'stardust' | 'neon' | 'acrylic'>('watercolor');
  const [brushSizeMultiplier, setBrushSizeMultiplier] = useState<number>(1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [currentQuip, setCurrentQuip] = useState<string>("Painting with the sovereign purple touch...");
  const [quipTimer, setQuipTimer] = useState<number>(0);
  const [gallery, setGallery] = useState<SavedPainting[]>(() => {
    const saved = localStorage.getItem('fly_juju_paintings');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [targetPoint, setTargetPoint] = useState<{ x: number; y: number } | null>(null);

  // Fly state refs for continuous smooth animation loop
  const flyState = useRef({
    x: 250,
    y: 180,
    vx: 1.5,
    vy: 0.8,
    angle: 0,
    targetAngle: 0,
    wingPhase: 0,
    colorIndex: 0,
    colorStep: 0,
    brushAlpha: 0.35,
    strokeTimer: 0
  });

  // Handle canvas click to place a "sugar drop" attractant
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    setTargetPoint({ x: clickX, y: clickY });
    playCelestialChime(780, 'sine', 0.15);

    // Draw little sugar nectar drop visual
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(clickX, clickY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Set playful quip
    setCurrentQuip("Ooh, nectar spot! Heading right over to paint that!");
  };

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle canvas texture / grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    playCelestialChime(440, 'triangle', 0.2);
    setCurrentQuip("Fresh blank canvas! Time for a new composition.");
  };

  // Save artwork to local gallery
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const newPainting: SavedPainting = {
      id: `art-${Date.now()}`,
      dataUrl,
      title: `${VIBE_PRESETS[vibe].name} #${gallery.length + 1}`,
      vibe: VIBE_PRESETS[vibe].name,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newPainting, ...gallery.slice(0, 11)];
    setGallery(updated);
    localStorage.setItem('fly_juju_paintings', JSON.stringify(updated));
    setShowSavedToast(true);
    playCelestialChime(880, 'sine', 0.3);
    setTimeout(() => setShowSavedToast(false), 3000);
    setCurrentQuip("Saved to the Vault! That one turned out gorgeous.");
  };

  // Main render & fly connectome loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial background if not already painted
    if (flyState.current.strokeTimer === 0) {
      handleClear();
    }

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isPlaying) {
        const preset = VIBE_PRESETS[vibe];
        const fly = flyState.current;
        const currentSpeed = preset.speed * speedMultiplier * 50;

        // Quip rotation
        fly.strokeTimer += dt;
        if (fly.strokeTimer > 6.5) {
          fly.strokeTimer = 0;
          const nextQuip = JUJU_QUIPS[Math.floor(Math.random() * JUJU_QUIPS.length)];
          setCurrentQuip(nextQuip);
        }

        // Connectome behavior simulation:
        // 1. Saccadic turning: flies travel in bursts with abrupt saccades (sharp turns)
        if (Math.random() < preset.saccadeRate) {
          fly.targetAngle += (Math.random() - 0.5) * Math.PI * 1.2;
        }

        // 2. Olfactory homing if target point exists
        if (targetPoint) {
          const dx = targetPoint.x - fly.x;
          const dy = targetPoint.y - fly.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 15) {
            const angleToTarget = Math.atan2(dy, dx);
            fly.targetAngle = angleToTarget;
          } else {
            // Reached target
            setTargetPoint(null);
            playCelestialChime(920, 'sine', 0.1);
          }
        }

        // 3. Optical boundary avoidance (keep fly inside canvas with smooth steering)
        const margin = 35;
        if (fly.x < margin) fly.targetAngle = 0 + (Math.random() - 0.5);
        if (fly.x > canvas.width - margin) fly.targetAngle = Math.PI + (Math.random() - 0.5);
        if (fly.y < margin) fly.targetAngle = Math.PI / 2 + (Math.random() - 0.5);
        if (fly.y > canvas.height - margin) fly.targetAngle = -Math.PI / 2 + (Math.random() - 0.5);

        // Smooth turn towards target angle
        let angleDiff = fly.targetAngle - fly.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        fly.angle += angleDiff * Math.min(dt * 8, 1);

        // Position update
        const oldX = fly.x;
        const oldY = fly.y;
        fly.vx = Math.cos(fly.angle) * currentSpeed * dt;
        fly.vy = Math.sin(fly.angle) * currentSpeed * dt;
        fly.x += fly.vx;
        fly.y += fly.vy;

        // Clamp boundaries
        fly.x = Math.max(10, Math.min(canvas.width - 10, fly.x));
        fly.y = Math.max(10, Math.min(canvas.height - 10, fly.y));

        // Wing fluttering
        fly.wingPhase += dt * 35;

        // Color cycling
        fly.colorStep += dt * 0.8;
        if (fly.colorStep > 1) {
          fly.colorStep = 0;
          fly.colorIndex = (fly.colorIndex + 1) % preset.colors.length;
        }
        const currentColor = preset.colors[fly.colorIndex];

        // --- DRAW BRUSH STROKES ON CANVAS ---
        ctx.save();
        const baseSize = preset.brushSize * brushSizeMultiplier;

        if (brushStyle === 'watercolor') {
          ctx.strokeStyle = currentColor;
          ctx.fillStyle = currentColor;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = baseSize * (1 + Math.sin(fly.wingPhase * 0.2) * 0.4);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(fly.x, fly.y);
          ctx.stroke();

          // Soft watercolor splatter bleed
          if (Math.random() < 0.15) {
            ctx.beginPath();
            ctx.arc(fly.x + (Math.random() - 0.5) * 8, fly.y + (Math.random() - 0.5) * 8, baseSize * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (brushStyle === 'stardust') {
          // Starlight dots & particle trail
          ctx.fillStyle = currentColor;
          ctx.shadowColor = currentColor;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(fly.x, fly.y, baseSize * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Star sparkle
          if (Math.random() < 0.3) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(fly.x + (Math.random() - 0.5) * 12, fly.y + (Math.random() - 0.5) * 12, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (brushStyle === 'neon') {
          ctx.strokeStyle = currentColor;
          ctx.shadowColor = currentColor;
          ctx.shadowBlur = 12;
          ctx.globalAlpha = 0.7;
          ctx.lineWidth = baseSize * 0.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(fly.x, fly.y);
          ctx.stroke();
        } else {
          // Acrylic Impasto
          ctx.strokeStyle = currentColor;
          ctx.globalAlpha = 0.65;
          ctx.lineWidth = baseSize;
          ctx.lineCap = 'square';
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(fly.x, fly.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- RENDER FLY JUJU AVATAR OVERLAY ---
      // We draw the avatar cleanly over the canvas
      const fly = flyState.current;
      ctx.save();
      ctx.translate(fly.x, fly.y);
      ctx.rotate(fly.angle);

      // 1. Wings (Iridescent Violet / White with high frequency fluttering)
      const wingFlap = Math.sin(fly.wingPhase);
      const wingSpread = 0.6 + wingFlap * 0.4;

      ctx.fillStyle = 'rgba(233, 213, 255, 0.75)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1;

      // Left wing
      ctx.save();
      ctx.scale(1, wingSpread);
      ctx.beginPath();
      ctx.ellipse(-2, -9, 8, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.scale(1, wingSpread);
      ctx.beginPath();
      ctx.ellipse(-2, 9, 8, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 2. Fly Body (Stylized Purple & Dark Amethyst)
      ctx.fillStyle = '#6b21a8'; // deep purple thorax
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Abdomen
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.ellipse(-6, 0, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Head & Eyes (Gleaming Rose-Ruby Eyes)
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.arc(6, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#f43f5e'; // ruby compound eye
      ctx.beginPath();
      ctx.arc(7, -2, 1.8, 0, Math.PI * 2);
      ctx.arc(7, 2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 4. Little Sovereign Gold Beret / Crown
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(8, -5);
      ctx.lineTo(6, -2);
      ctx.lineTo(9, 0);
      ctx.lineTo(6, 2);
      ctx.lineTo(8, 5);
      ctx.lineTo(4, 3);
      ctx.closePath();
      ctx.fill();

      // 5. Tiny artist paintbrush she carries!
      ctx.strokeStyle = '#d97706'; // wood handle
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(3, 2);
      ctx.lineTo(12, 5);
      ctx.stroke();

      // Brush tip with current paint color
      ctx.fillStyle = VIBE_PRESETS[vibe].colors[fly.colorIndex];
      ctx.beginPath();
      ctx.arc(13, 5.5, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, vibe, brushStyle, brushSizeMultiplier, speedMultiplier, targetPoint]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Concept intro */}
      <div className="p-5 rounded-2xl bg-[#0b0f19] border border-purple-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none">
          🪰
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪰</span>
              <h3 className="font-cinzel text-xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 bg-clip-text text-transparent">
                Fly Juju Studio • "What If She Was A Fly?"
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                JULIA EFFECT DEMO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
              Using fruit fly connectome flight saccades + Julia’s signature purple palette and sovereign artistic discernment. Click anywhere on the easel to place a nectar drop and guide her brush!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Flight' : 'Resume Flight'}</span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Clear Easel"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Blank Canvas</span>
            </button>

            <button
              onClick={handleSaveToGallery}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              title="Save to Juju Vault"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Painting</span>
            </button>
          </div>
        </div>

        {/* Speech Bubble / Current Quip from Fly Juju */}
        <div className="mt-4 p-3 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-800 border border-purple-400 flex items-center justify-center text-sm shrink-0 shadow-md">
            🪰
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
              Fly Juju's Studio Observation:
            </span>
            <p className="text-xs text-purple-100 font-medium italic truncate">
              "{currentQuip}"
            </p>
          </div>
          {showSavedToast && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 shrink-0 animate-bounce">
              <Check className="w-3.5 h-3.5" /> Saved to Vault!
            </span>
          )}
        </div>
      </div>

      {/* Main Studio Area: Canvas + Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Easel */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-slate-950 shadow-2xl group cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={640}
              height={420}
              onClick={handleCanvasClick}
              className="w-full h-auto block"
            />

            {/* In-canvas tip */}
            <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-sm pointer-events-none">
              ✨ Click anywhere on canvas to drop nectar & guide Fly Juju's brush
            </div>

            {/* Active palette badge */}
            <div className="absolute top-2.5 right-3 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>{VIBE_PRESETS[vibe].name}</span>
            </div>
          </div>

          {/* Palette Color Swatches Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 font-mono text-[11px]">Active Color Swatches:</span>
              <div className="flex items-center gap-1.5">
                {VIBE_PRESETS[vibe].colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Fruit Fly Saccades: {VIBE_PRESETS[vibe].saccadeRate * 100}% frequency
            </span>
          </div>
        </div>

        {/* Right Col: Customizer & Sliders ("Tweak to fit her") */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-purple-500/20 shadow-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h4 className="font-cinzel text-sm font-bold text-purple-200">
                Tweak Fly Juju to Fit Her
              </h4>
            </div>

            {/* Preset Vibe Selection */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Artistic Temperament:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(VIBE_PRESETS) as VibeMode[]).map((key) => {
                  const p = VIBE_PRESETS[key];
                  const isSel = vibe === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setVibe(key);
                        playCelestialChime(660, 'sine', 0.15);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-purple-900/60 border-purple-500 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>{p.icon}</span>
                        <span className="truncate">{p.name.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {p.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brush Medium Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Paint Medium:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'watercolor', label: 'Watercolor Bleed', icon: '🎨' },
                  { id: 'stardust', label: 'Stardust Trail', icon: '✨' },
                  { id: 'neon', label: 'Luminous Glow', icon: '⚡' },
                  { id: 'acrylic', label: 'Impasto Oil', icon: '🖌️' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBrushStyle(b.id as any);
                      playCelestialChime(700, 'sine', 0.1);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center gap-1.5 ${
                      brushStyle === b.id
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span className="text-[11px] truncate">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fly Locomotion Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Flight Agility & Speed</span>
                  <span className="text-purple-300 font-bold">{speedMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Brushstroke Breadth</span>
                  <span className="text-purple-300 font-bold">{brushSizeMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={brushSizeMultiplier}
                  onChange={(e) => setBrushSizeMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Mini Gallery Drawer */}
          <div className="p-4 rounded-2xl bg-[#0b0f19] border border-purple-500/20 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <h5 className="font-cinzel text-xs font-bold text-purple-200">
                  Julia's Fly Art Gallery ({gallery.length})
                </h5>
              </div>
              {gallery.length > 0 && (
                <button
                  onClick={() => {
                    setGallery([]);
                    localStorage.removeItem('fly_juju_paintings');
                  }}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {gallery.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-4">
                No paintings saved yet. Click "Save Painting" when Fly Juju makes something she loves!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {gallery.map((art) => (
                  <div 
                    key={art.id}
                    className="relative group rounded-lg overflow-hidden border border-purple-500/30 bg-black aspect-[4/3]"
                  >
                    <img
                      src={art.dataUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-[9px] font-bold text-purple-200 line-clamp-1">{art.title}</span>
                      <a
                        href={art.dataUrl}
                        download={`${art.title.replace(/\s+/g, '_')}.png`}
                        className="mt-1 p-1 rounded bg-purple-600 text-white text-[9px] flex items-center gap-0.5"
                      >
                        <Download className="w-2.5 h-2.5" /> Get
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
