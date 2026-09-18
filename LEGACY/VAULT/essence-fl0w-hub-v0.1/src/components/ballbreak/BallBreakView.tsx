import React, { useState, useEffect } from 'react';
import { BallBreakLandingPage } from './BallBreakLandingPage';
import { BallBreakCanvas } from './BallBreakCanvas';
import { BallBreakHUD } from './BallBreakHUD';
import { StageClearModal } from './StageClearModal';
import { BALL_BREAK_STAGES, INITIAL_BALL_BREAK_PROGRESS, generateSandboxStage } from '../../data/ballBreakStages';
import { BallBreakProgress, MomentumTier, StageDefinition } from '../../types/ballBreak';
import { ensureAudioUnlocked, playAudioTestPing } from '../../utils/ballBreakAudio';

const STORAGE_KEY = 'ball_break_progress_v1';

export const BallBreakView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'simulating'>('landing');
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [activeStage, setActiveStage] = useState<StageDefinition>(BALL_BREAK_STAGES[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [canvasKey, setCanvasKey] = useState(1);

  // In-game Telemetry
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [tier, setTier] = useState<MomentumTier>(0);
  const [destroyed, setDestroyed] = useState({ glass: 0, wood: 0, stone: 0 });

  // Victory Dialog
  const [clearModalState, setClearModalState] = useState<{
    isOpen: boolean;
    stats: { score: number; timeTaken: number; stars: number };
  }>({
    isOpen: false,
    stats: { score: 0, timeTaken: 0, stars: 0 },
  });

  // Persistent Progress in LocalStorage
  const [progress, setProgress] = useState<BallBreakProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_BALL_BREAK_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Handle stage selection from landing page
  const handleSelectStage = (stageId: number) => {
    setSelectedStageId(stageId);
    if (stageId === 999) {
      setActiveStage(generateSandboxStage());
    } else {
      const found = BALL_BREAK_STAGES.find((s) => s.id === stageId) || BALL_BREAK_STAGES[0];
      setActiveStage(found);
    }
    setScore(0);
    setCombo(0);
    setSpeed(0);
    setTier(0);
    setDestroyed({ glass: 0, wood: 0, stone: 0 });
    setIsPaused(false);
    setCanvasKey((prev) => prev + 1);
    setViewMode('simulating');
  };

  // Restart current stage
  const handleRestartStage = () => {
    if (selectedStageId === 999) {
      setActiveStage(generateSandboxStage());
    }
    setScore(0);
    setCombo(0);
    setSpeed(0);
    setTier(0);
    setDestroyed({ glass: 0, wood: 0, stone: 0 });
    setIsPaused(false);
    setClearModalState({ isOpen: false, stats: { score: 0, timeTaken: 0, stars: 0 } });
    setCanvasKey((prev) => prev + 1);
  };

  // Stage clear handler
  const handleStageClear = (stats: { score: number; timeTaken: number; stars: number }) => {
    setClearModalState({
      isOpen: true,
      stats,
    });

    // Save Progress
    setProgress((prev) => {
      const existingRecord = prev.stageRecords[selectedStageId];
      const newStars = Math.max(existingRecord?.stars || 0, stats.stars);
      const newHighScore = Math.max(existingRecord?.highScore || 0, stats.score);
      const newBestTime = existingRecord?.bestTime
        ? Math.min(existingRecord.bestTime, stats.timeTaken)
        : stats.timeTaken;

      const nextUnlocked =
        selectedStageId < 5
          ? Math.max(prev.unlockedStageMax, selectedStageId + 1)
          : prev.unlockedStageMax;

      return {
        ...prev,
        unlockedStageMax: nextUnlocked,
        stageRecords: {
          ...prev.stageRecords,
          [selectedStageId]: {
            stageId: selectedStageId,
            completed: true,
            stars: newStars,
            highScore: newHighScore,
            bestTime: newBestTime,
          },
        },
        totalGlassSmashed: prev.totalGlassSmashed + destroyed.glass,
        totalWoodSmashed: prev.totalWoodSmashed + destroyed.wood,
        totalStoneSmashed: prev.totalStoneSmashed + destroyed.stone,
        lifetimeScore: prev.lifetimeScore + stats.score,
        highestSpeed: Math.max(prev.highestSpeed, speed),
        highestCombo: Math.max(prev.highestCombo, combo),
      };
    });
  };

  // Next stage transition
  const handleNextStage = () => {
    setClearModalState({ isOpen: false, stats: { score: 0, timeTaken: 0, stars: 0 } });
    const nextId = selectedStageId + 1;
    handleSelectStage(nextId <= 5 ? nextId : 999);
  };

  // Reset all records
  const handleResetProgress = () => {
    if (window.confirm('Reset all Ball Break stage completions, stars, and records?')) {
      setProgress(INITIAL_BALL_BREAK_PROGRESS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const totalTargetsInStage = activeStage.obstacles.length;
  const destroyedCount = destroyed.glass + destroyed.wood + destroyed.stone;
  const remainingTargets = Math.max(0, totalTargetsInStage - destroyedCount);

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {viewMode === 'landing' ? (
        <BallBreakLandingPage
          progress={progress}
          onSelectStage={handleSelectStage}
          onResetProgress={handleResetProgress}
        />
      ) : (
        <div className="w-full max-w-lg flex flex-col items-center animate-fade-in">
          <BallBreakHUD
            stageName={activeStage.name}
            stageSubtitle={activeStage.subtitle}
            score={score}
            combo={combo}
            speed={speed}
            tier={tier}
            destroyed={destroyed}
            remainingTargets={remainingTargets}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            onRestart={handleRestartStage}
            onReturnToLanding={() => setViewMode('landing')}
            onTestAudio={() => {
              ensureAudioUnlocked();
              playAudioTestPing();
            }}
            isSandboxMode={selectedStageId === 0}
          />

          <BallBreakCanvas
            key={canvasKey}
            stage={activeStage}
            onStageClear={handleStageClear}
            onScoreUpdate={(s, c, sp, t) => {
              setScore(s);
              setCombo(c);
              setSpeed(sp);
              setTier(t);
            }}
            onDestroyUpdate={(g, w, st) => {
              setDestroyed({ glass: g, wood: w, stone: st });
            }}
            isPaused={isPaused}
            onRestart={handleRestartStage}
          />

          {/* Quick Controls Advice / Desktop Keyboard Help */}
          <div className="mt-3 text-center text-xs font-mono text-slate-500 max-w-md">
            <span className="text-cyan-400">Touch Controls:</span> Pull back cradle to launch • Touch & drag to steer in flight • Drain gutter auto-reloads.
            <br className="hidden sm:inline" />
            <span className="text-slate-400"> Desktop:</span> Arrow Keys / WASD to steer • Space to launch.
          </div>

          <StageClearModal
            isOpen={clearModalState.isOpen}
            stage={activeStage}
            stats={clearModalState.stats}
            onNextStage={handleNextStage}
            onReplayStage={handleRestartStage}
            onReturnToMenu={() => {
              setClearModalState({ isOpen: false, stats: { score: 0, timeTaken: 0, stars: 0 } });
              setViewMode('landing');
            }}
          />
        </div>
      )}
    </div>
  );
};
