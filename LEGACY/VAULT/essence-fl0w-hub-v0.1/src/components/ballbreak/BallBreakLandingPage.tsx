import React, { useState } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Music, 
  RotateCcw, 
  Star, 
  Zap, 
  Flame, 
  Shield, 
  Sparkles, 
  Smartphone, 
  Crosshair, 
  Sliders, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { BALL_BREAK_STAGES, MATERIAL_TIERS } from '../../data/ballBreakStages';
import { BallBreakProgress } from '../../types/ballBreak';
import { 
  unlockBallBreakAudio, 
  ensureAudioUnlocked,
  playAudioTestPing,
  setSoundSettings, 
  getSoundSettings, 
  startBGM, 
  stopBGM, 
  playTierShift 
} from '../../utils/ballBreakAudio';

interface BallBreakLandingPageProps {
  progress: BallBreakProgress;
  onSelectStage: (stageId: number) => void;
  onResetProgress: () => void;
}

export const BallBreakLandingPage: React.FC<BallBreakLandingPageProps> = ({
  progress,
  onSelectStage,
  onResetProgress,
}) => {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [soundConfig, setSoundConfigState] = useState(getSoundSettings());
  const [showSettings, setShowSettings] = useState(false);

  // Total stars earned
  const totalStars = Object.values(progress.stageRecords || {}).reduce((acc: number, rec: any) => acc + (rec?.stars || 0), 0);

  const handleEngageSimulator = (stageId: number = 1) => {
    // Audio Gate: unlock audio context on primary interaction
    unlockBallBreakAudio();
    setAudioUnlocked(true);

    if (!soundConfig.isMuted) {
      startBGM();
      playTierShift(2);
    }
    onSelectStage(stageId);
  };

  const handleToggleMute = () => {
    const nextMuted = !soundConfig.isMuted;
    setSoundSettings({ muted: nextMuted });
    setSoundConfigState(getSoundSettings());
    if (nextMuted) {
      stopBGM();
    } else {
      unlockBallBreakAudio();
      startBGM();
    }
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSoundSettings({ sfxVol: val });
    setSoundConfigState(getSoundSettings());
  };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSoundSettings({ bgmVol: val });
    setSoundConfigState(getSoundSettings());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8 text-slate-200">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d1322] to-[#080c14] border border-cyan-500/20 p-6 sm:p-8 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
        {/* Background decorative glow elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-amber-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs uppercase tracking-wider shadow-inner">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mobile Touch Simulation • Continuous Flow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-orange-500">
              BALL BREAK
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl font-sans leading-relaxed">
            Build kinetic momentum, shift color tiers in real-time, and demolish Glass, Wood, and solid Stone barriers with pinball steering and progressive stress fractures.
          </p>

          {/* Primary Audio & Simulator Gate Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleEngageSimulator(progress.unlockedStageMax || 1)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-amber-500 to-orange-500 hover:from-cyan-400 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-base sm:text-lg tracking-wide uppercase shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>ENGAGE SIMULATOR</span>
            </button>

            <button
              onClick={() => {
                ensureAudioUnlocked();
                handleEngageSimulator(0);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              title="Launch Slingshot & Feel Sandbox directly in-app"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>FEEL SANDBOX (IN-APP)</span>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Audio & Simulation Settings"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>

          {/* Audio Quick Status & Test Ping */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
            <button 
              onClick={handleToggleMute}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {soundConfig.isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">Audio Muted (Click to Unmute)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Synthesizer Ready • Procedural Web Audio</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                ensureAudioUnlocked();
                playAudioTestPing();
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Click to test procedural sound effect"
            >
              <span>🔊 TEST SOUND</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio & Settings Drawer (if toggled) */}
      {showSettings && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Audio & Physics Parameters
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> SFX Volume</span>
                <span>{Math.round(soundConfig.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundConfig.sfxVolume}
                onChange={handleSfxChange}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> Synth BGM Volume</span>
                <span>{Math.round(soundConfig.bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundConfig.bgmVolume}
                onChange={handleBgmChange}
                className="w-full accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Progress & Lifetime Records Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase">Stars Earned</div>
          <div className="text-2xl font-black font-mono text-amber-400 flex items-center justify-center gap-1 mt-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{totalStars} / 15</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase">Glass Smashed</div>
          <div className="text-2xl font-black font-mono text-cyan-400 flex items-center justify-center gap-1 mt-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>{progress.totalGlassSmashed}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase">Wood Splintered</div>
          <div className="text-2xl font-black font-mono text-amber-500 flex items-center justify-center gap-1 mt-1">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{progress.totalWoodSmashed}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase">Stone Monoliths</div>
          <div className="text-2xl font-black font-mono text-purple-400 flex items-center justify-center gap-1 mt-1">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>{progress.totalStoneSmashed}</span>
          </div>
        </div>
      </div>

      {/* Blueprint: Momentum Color Tiers & 4-Hit Crack Rule */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Kinetic Destruction Blueprint
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Velocity Color Tiers Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" /> Real-Time Momentum Color Tiers
            </h3>
            <p className="text-xs text-slate-400">
              The ball shifts color as velocity compounds from slingshots, gravity, and pinball bumpers:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {MATERIAL_TIERS.map((t) => (
                <div 
                  key={t.tier} 
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: t.color, boxShadow: `0 0 10px ${t.glowColor}` }}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    Tier {t.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Hit Progressive Stress & Mobile Control Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" /> The 4-Hit Crack Rule & Mobile Controls
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We reward building speed: hitting an obstacle at its exact tier (or above) shatters it instantly in 1 devastating blow.
            </p>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex flex-col gap-2 font-mono">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <Flame className="w-4 h-4 text-orange-400" /> Sub-Tier Crack Accumulation:
              </div>
              <p className="text-[11px] leading-relaxed">
                If the ball hits an obstacle with momentum <strong>1 level below</strong> its threshold (e.g. hitting Stone with Tier 2 Flame speed), it takes <strong>4 hits</strong> to generate stress fractures and crack it open!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 flex flex-col gap-2 font-mono">
              <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                <Smartphone className="w-4 h-4 text-cyan-400" /> Slingshot + Floating Joystick:
              </div>
              <p className="text-[11px] leading-relaxed">
                Pull back to launch from the cradle. While in flight, touch anywhere to steer and nudge the ball around obstacles. If the ball drains, it automatically reloads to keep flow going!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Select Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyan-400" /> Stage Selection & Laboratories
          </h2>
          <button
            onClick={onResetProgress}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 font-mono"
            title="Reset high scores and unlocked stages"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Records
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BALL_BREAK_STAGES.map((stg) => {
            const isUnlocked = stg.id <= progress.unlockedStageMax;
            const record = progress.stageRecords[stg.id];
            const stars = record ? record.stars : 0;

            return (
              <div
                key={stg.id}
                onClick={() => isUnlocked && handleEngageSimulator(stg.id)}
                className={`relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] cursor-pointer hover:-translate-y-1'
                    : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">Stage {stg.id}</span>
                    {isUnlocked ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx <= stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{stg.name.replace(/^Stage \d+: /, '')}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
                    {stg.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  {record && record.completed ? (
                    <>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Best: {record.bestTime}s
                      </span>
                      <span className="text-amber-300 font-bold">{record.highScore.toLocaleString()} pts</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Par Time: {stg.parTime}s</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Endless Sandbox Card */}
          <div
            onClick={() => handleEngageSimulator(999)}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/90 via-cyan-950/30 to-slate-900/90 p-5 flex flex-col justify-between hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] cursor-pointer hover:-translate-y-1 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">Sandbox Lab</span>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">Destruction Sandbox</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
                Infinite regenerative playground. Test max velocity, rapid slingshot launches, and stress crack physics without time pressure.
              </p>
            </div>

            <div className="pt-3 border-t border-cyan-950/60 flex items-center justify-between text-xs font-mono text-cyan-300">
              <span>Free Kinetic Testing</span>
              <span className="font-bold">Play →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
