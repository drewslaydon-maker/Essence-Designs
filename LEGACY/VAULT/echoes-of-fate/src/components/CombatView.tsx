import React, { useState, useEffect, useRef } from 'react';
import { EnemyStats, PlayerStats, CombatOutcome } from '../types';
import { BulletBoxSimulator } from '../engine/Combat';
import { sound } from '../engine/Audio';
import { Sword, Flame, MessageCircle, Heart, Shield, Sparkles, Skull, CheckCircle, FlameKindling } from 'lucide-react';

interface CombatViewProps {
  enemy: EnemyStats;
  player: PlayerStats;
  onVictory: (outcome: CombatOutcome, enemy: EnemyStats) => void;
  onDefeat: () => void;
  onFlee: () => void;
  onUpdatePlayerStats: (updates: Partial<PlayerStats>) => void;
}

type TurnPhase =
  | 'player_menu'
  | 'attack_timing'
  | 'act_menu'
  | 'arcane_menu'
  | 'enemy_dialogue'
  | 'bullet_dodge'
  | 'resolution';

export const CombatView: React.FC<CombatViewProps> = ({
  enemy: initialEnemy,
  player,
  onVictory,
  onDefeat,
  onFlee,
  onUpdatePlayerStats,
}) => {
  const [enemy, setEnemy] = useState<EnemyStats>({ ...initialEnemy });
  const [phase, setPhase] = useState<TurnPhase>('player_menu');
  const [narration, setNarration] = useState<string>(
    initialEnemy.isBoss
      ? 'Commander Malakar draws his dimensional greatsword. The fabric of reality groans!'
      : `A hostile ${initialEnemy.name} emerges from the shadows!`
  );

  // Attack Timing Mini-game State
  const [timingPosition, setTimingPosition] = useState<number>(0);
  const timingDirectionRef = useRef<number>(1);
  const timingRafRef = useRef<number>(0);

  // Bullet Box State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simulatorRef = useRef<BulletBoxSimulator>(new BulletBoxSimulator(240, 180));
  const soulPosRef = useRef<{ x: number; y: number }>({ x: 120, y: 90 });
  const dodgeTimerRef = useRef<number>(0);
  const [dodgeTimeRemaining, setDodgeTimeRemaining] = useState<number>(0);
  const [frostWardActive, setFrostWardActive] = useState<boolean>(false);
  const [lastDamagePlayer, setLastDamagePlayer] = useState<number | null>(null);
  const iFramesTimerRef = useRef<number>(0);
  const keysHeldRef = useRef<Set<string>>(new Set());

  // Mutable refs to prevent timer reset when state updates during dodging
  const playerRef = useRef<PlayerStats>(player);
  playerRef.current = player;
  const enemyRef = useRef<EnemyStats>(enemy);
  enemyRef.current = enemy;
  const frostWardActiveRef = useRef<boolean>(frostWardActive);
  frostWardActiveRef.current = frostWardActive;
  const onUpdatePlayerStatsRef = useRef(onUpdatePlayerStats);
  onUpdatePlayerStatsRef.current = onUpdatePlayerStats;
  const onDefeatRef = useRef(onDefeat);
  onDefeatRef.current = onDefeat;

  // Soul touch/drag tracking for mobile
  const isDraggingSoulRef = useRef<boolean>(false);

  // Handle Attack Timing bar animation
  useEffect(() => {
    if (phase === 'attack_timing') {
      let currentPos = 0;
      timingDirectionRef.current = 1;

      const loop = () => {
        currentPos += 2.5 * timingDirectionRef.current;
        if (currentPos >= 100) {
          currentPos = 100;
          timingDirectionRef.current = -1;
        } else if (currentPos <= 0) {
          currentPos = 0;
          timingDirectionRef.current = 1;
        }
        setTimingPosition(currentPos);
        timingRafRef.current = requestAnimationFrame(loop);
      };

      timingRafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(timingRafRef.current);
    }
  }, [phase]);

  // Handle Bullet Box loop during enemy attack phase
  useEffect(() => {
    if (phase === 'bullet_dodge') {
      const sim = simulatorRef.current;
      sim.reset();
      soulPosRef.current = { x: sim.boxWidth / 2, y: sim.boxHeight / 2 };
      const patternDuration = enemyRef.current.attackPatternDuration;
      dodgeTimerRef.current = patternDuration;
      setDodgeTimeRemaining(patternDuration);
      iFramesTimerRef.current = 0.35; // Brief initial grace buffer on spawn

      let lastTime = performance.now();
      let animId: number;

      const dodgeLoop = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        // Count down the turn duration strictly (never reset on taking damage!)
        dodgeTimerRef.current -= dt;
        setDodgeTimeRemaining(Math.max(0, dodgeTimerRef.current));

        // Smooth desktop keyboard movement
        const keys = keysHeldRef.current;
        let mx = 0;
        let my = 0;
        if (keys.has('arrowup') || keys.has('w')) my -= 1;
        if (keys.has('arrowdown') || keys.has('s')) my += 1;
        if (keys.has('arrowleft') || keys.has('a')) mx -= 1;
        if (keys.has('arrowright') || keys.has('d')) mx += 1;

        if (mx !== 0 && my !== 0) {
          mx *= 0.7071;
          my *= 0.7071;
        }

        const soul = soulPosRef.current;
        if (mx !== 0 || my !== 0) {
          const moveSpeed = 155; // 155 px/sec
          soul.x = Math.max(8, Math.min(sim.boxWidth - 8, soul.x + mx * moveSpeed * dt));
          soul.y = Math.max(8, Math.min(sim.boxHeight - 8, soul.y + my * moveSpeed * dt));
        }

        // Count down invulnerability frames
        if (iFramesTimerRef.current > 0) {
          iFramesTimerRef.current -= dt;
        }

        // Update bullets
        const curEnemy = enemyRef.current;
        sim.update(dt, curEnemy.spriteType, curEnemy.attackPhase, frostWardActiveRef.current);

        // Check collision with player soul spark with invulnerability frames
        if (iFramesTimerRef.current <= 0 && sim.checkCollision(soul.x, soul.y, 3.5)) {
          sound.playHit(false);
          // 0.85s grace period with shield aura & blinking
          iFramesTimerRef.current = 0.85;
          // Clear bullets in immediate vicinity so player is never trapped
          sim.clearBulletsNear(soul.x, soul.y, 30);

          const curPlayer = playerRef.current;
          const rawDmg = Math.max(3, Math.floor(curEnemy.atk - curPlayer.def * 0.5));
          setLastDamagePlayer(rawDmg);
          const newHp = Math.max(0, curPlayer.hp - rawDmg);
          onUpdatePlayerStatsRef.current({ hp: newHp });

          if (newHp <= 0) {
            cancelAnimationFrame(animId);
            onDefeatRef.current();
            return;
          }
        }

        // Draw bullet box
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw arena border
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 3;
            ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

            // Draw bullets
            for (const b of sim.bullets) {
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
              ctx.fillStyle = b.color;
              ctx.shadowColor = b.color;
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            // Draw player Soul Spark (Glowing Heart with i-frames flash & shield aura)
            const isInvulnerable = iFramesTimerRef.current > 0;
            const isBlinking = isInvulnerable && Math.floor(iFramesTimerRef.current * 14) % 2 === 0;

            if (!isBlinking) {
              ctx.save();
              ctx.translate(soul.x, soul.y);
              ctx.fillStyle = isInvulnerable ? '#fca5a5' : '#ef4444';
              ctx.shadowColor = '#f43f5e';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
              ctx.fill();

              // Protective aura ring during i-frames
              if (isInvulnerable) {
                ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
                ctx.stroke();
              }
              ctx.restore();
            }
          }
        }

        // Check if dodging phase is finished
        if (dodgeTimerRef.current <= 0) {
          setFrostWardActive(false);
          setPhase('player_menu');
          setNarration(`The onslaught subsides. It is your turn!`);
          return;
        }

        animId = requestAnimationFrame(dodgeLoop);
      };

      animId = requestAnimationFrame(dodgeLoop);
      return () => cancelAnimationFrame(animId);
    }
  }, [phase]);

  // Execute Strike when tapping timing bar
  const handleStrikeTiming = () => {
    cancelAnimationFrame(timingRafRef.current);
    sound.playAttackSwing();

    // Sweet spot is between 42 and 58
    const distanceToCenter = Math.abs(timingPosition - 50);
    const isCrit = distanceToCenter <= 8;
    const isGood = distanceToCenter <= 20;

    let dmg = Math.max(6, Math.floor(player.atk - enemy.def * 0.4));
    if (isCrit) {
      dmg = Math.floor(dmg * 2.2);
      sound.playHit(true);
      setNarration(`CRITICAL PRECISION STRIKE! Dealt ${dmg} damage!`);
    } else if (isGood) {
      dmg = Math.floor(dmg * 1.3);
      sound.playHit(false);
      setNarration(`Clean hit! Dealt ${dmg} damage.`);
    } else {
      dmg = Math.floor(dmg * 0.7);
      sound.playHit(false);
      setNarration(`Glancing blow... Dealt ${dmg} damage.`);
    }

    const newEnemyHp = Math.max(0, enemy.hp - dmg);
    const updatedEnemy = { ...enemy, hp: newEnemyHp };
    setEnemy(updatedEnemy);

    if (newEnemyHp <= 0) {
      if (enemy.isBoss) {
        setPhase('resolution');
        setNarration('Malakar falls to his knee! The moment of Judgment has arrived.');
      } else {
        onVictory('slain', updatedEnemy);
      }
    } else {
      setTimeout(() => {
        startEnemyTurn(updatedEnemy);
      }, 900);
    }
  };

  // Arcane Spell casting
  const handleCastSpell = (spellType: 'flame' | 'frost' | 'sever') => {
    if (spellType === 'flame') {
      if (player.mp < 15) return;
      sound.playSpellCast();
      onUpdatePlayerStats({ mp: player.mp - 15 });
      const dmg = Math.floor(player.atk * 1.8);
      const newEnemyHp = Math.max(0, enemy.hp - dmg);
      const updatedEnemy = { ...enemy, hp: newEnemyHp };
      setEnemy(updatedEnemy);
      setNarration(`Pyretic flame scorches ${enemy.name} for ${dmg} damage!`);

      if (newEnemyHp <= 0) {
        if (enemy.isBoss) {
          setPhase('resolution');
        } else {
          onVictory('slain', updatedEnemy);
        }
      } else {
        setTimeout(() => startEnemyTurn(updatedEnemy), 800);
      }
    } else if (spellType === 'frost') {
      if (player.mp < 20) return;
      sound.playSpellCast();
      onUpdatePlayerStats({ mp: player.mp - 20 });
      setFrostWardActive(true);
      setNarration(`Frost Ward activated! Enemy projectiles slowed by 40% this turn.`);
      setTimeout(() => startEnemyTurn(enemy), 800);
    } else if (spellType === 'sever') {
      if (player.mp < 25) return;
      sound.playSpellCast();
      onUpdatePlayerStats({ mp: player.mp - 25 });
      const dmg = Math.floor(player.atk * 1.2);
      const newMercy = Math.min(100, enemy.mercy + 25);
      const newEnemyHp = Math.max(0, enemy.hp - dmg);
      const updatedEnemy = { ...enemy, hp: newEnemyHp, mercy: newMercy };
      setEnemy(updatedEnemy);
      setNarration(`Void Sever dealt ${dmg} dmg and severed rift corruption (+25% Compliance)!`);

      if (newEnemyHp <= 0) {
        if (enemy.isBoss) {
          setPhase('resolution');
        } else {
          onVictory('slain', updatedEnemy);
        }
      } else {
        setTimeout(() => startEnemyTurn(updatedEnemy), 800);
      }
    }
  };

  // Act / Pacify choice
  const handleAct = (actType: 'inquire' | 'taunt' | 'parley' | 'purify') => {
    sound.playDialogueBlip();
    let mercyBoost = 0;
    let text = '';

    if (actType === 'inquire') {
      mercyBoost = 25;
      text = enemy.dialogueReactions.inquire;
    } else if (actType === 'taunt') {
      mercyBoost = 10;
      text = enemy.dialogueReactions.taunt;
    } else if (actType === 'parley') {
      mercyBoost = 30;
      text = enemy.dialogueReactions.parley;
    } else if (actType === 'purify') {
      mercyBoost = 35;
      text = enemy.dialogueReactions.purify;
    }

    const newMercy = Math.min(100, enemy.mercy + mercyBoost);
    const updatedEnemy = { ...enemy, mercy: newMercy };
    setEnemy(updatedEnemy);
    setNarration(`${text} (Compliance: ${newMercy}%)`);

    if (newMercy >= 100) {
      sound.playMercyChime();
    }

    setTimeout(() => {
      startEnemyTurn(updatedEnemy);
    }, 1100);
  };

  // Use Consumable Item
  const handleUseItem = (itemId: string) => {
    if (itemId === 'crimson_draught') {
      sound.playSpellCast();
      const newHp = Math.min(player.maxHp, player.hp + 45);
      onUpdatePlayerStats({ hp: newHp });
      setNarration('Drank Crimson Draught! Recovered 45 Hit Points.');
      setTimeout(() => startEnemyTurn(enemy), 800);
    } else if (itemId === 'aether_flask') {
      sound.playSpellCast();
      const newMp = Math.min(player.maxMp, player.mp + 35);
      onUpdatePlayerStats({ mp: newMp });
      setNarration('Drank Aether Flask! Restored 35 Mana.');
      setTimeout(() => startEnemyTurn(enemy), 800);
    }
  };

  // Start Enemy Turn & transition to bullet dodge box
  const startEnemyTurn = (currentEnemy: EnemyStats) => {
    // Determine boss phase shifts
    if (currentEnemy.isBoss) {
      if (currentEnemy.hp <= 80 || currentEnemy.mercy >= 70) {
        currentEnemy.attackPhase = 3;
      } else if (currentEnemy.hp <= 150 || currentEnemy.mercy >= 35) {
        currentEnemy.attackPhase = 2;
      } else {
        currentEnemy.attackPhase = 1;
      }
    }

    setPhase('bullet_dodge');
    setNarration(`${currentEnemy.name} unleashes an astral barrage! Evade!`);
  };

  // Soul touch / drag handler for mobile screens
  const handleTouchMoveCanvas = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (phase !== 'bullet_dodge') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.max(10, Math.min(canvas.width - 10, (touch.clientX - rect.left) * scaleX));
    const y = Math.max(10, Math.min(canvas.height - 10, (touch.clientY - rect.top) * scaleY));

    soulPosRef.current = { x, y };
  };

  // Keyboard controls for soul spark inside bullet box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'bullet_dodge') return;
      const key = e.key.toLowerCase();
      keysHeldRef.current.add(key);

      // Single quick tap response
      const soul = soulPosRef.current;
      const sim = simulatorRef.current;
      if (key === 'arrowup' || key === 'w') soul.y = Math.max(8, soul.y - 4);
      else if (key === 'arrowdown' || key === 's') soul.y = Math.min(sim.boxHeight - 8, soul.y + 4);
      else if (key === 'arrowleft' || key === 'a') soul.x = Math.max(8, soul.x - 4);
      else if (key === 'arrowright' || key === 'd') soul.x = Math.min(sim.boxWidth - 8, soul.x + 4);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeldRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      keysHeldRef.current.clear();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase]);

  return (
    <div id="combat-screen" className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-3 sm:p-6 select-none overflow-hidden">
      {/* Top Header: Enemy Status & Visual Representation */}
      <div className="w-full max-w-lg flex flex-col items-center gap-2">
        {/* Enemy Sprite & Glow */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
            style={{ backgroundColor: enemy.color }}
          />

          {/* Procedural Animated Pixel-Styled Boss/Enemy Avatar */}
          <div className="relative z-10 flex flex-col items-center">
            {enemy.spriteType === 'malakar' ? (
              <div className="relative flex flex-col items-center animate-bounce duration-1000">
                {/* Crown / Horns */}
                <div className="w-12 h-4 bg-rose-600 rounded-t-lg border-2 border-amber-400 flex justify-between px-1">
                  <div className="w-2 h-3 bg-amber-400 -mt-2 rounded-t" />
                  <div className="w-2 h-4 bg-amber-300 -mt-3 rounded-t" />
                  <div className="w-2 h-3 bg-amber-400 -mt-2 rounded-t" />
                </div>
                {/* Armored Visage */}
                <div className="w-16 h-14 bg-slate-900 border-2 border-rose-500 rounded-b-lg flex items-center justify-center shadow-lg">
                  <div className="flex gap-3">
                    <div className="w-2.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                    <div className="w-2.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  </div>
                </div>
                {/* Greatsword Silhouette */}
                <div className="absolute -right-7 -top-2 w-3 h-24 bg-gradient-to-t from-rose-700 via-amber-300 to-white rotate-12 rounded shadow-red-500/50 shadow-md" />
              </div>
            ) : enemy.spriteType === 'weaver' ? (
              <div className="w-20 h-16 bg-emerald-950 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-emerald-500/30 shadow-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                </div>
              </div>
            ) : enemy.spriteType === 'sentry' ? (
              <div className="w-20 h-20 bg-stone-800 border-2 border-orange-500 rounded-lg flex items-center justify-center shadow-orange-500/30 shadow-lg">
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
              </div>
            ) : (
              <div className="w-16 h-20 bg-purple-950/80 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-purple-500/40 shadow-lg">
                <div className="w-3 h-3 bg-purple-300 rounded-full animate-ping" />
              </div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-wide flex items-center justify-center gap-2">
            <span>{enemy.name}</span>
            {enemy.isBoss && <span className="bg-rose-900/80 border border-rose-500 text-rose-200 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">BOSS</span>}
          </h2>
          <p className="text-xs text-slate-400">{enemy.title}</p>
        </div>

        {/* Meters (HP & Compliance/Mercy) */}
        <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-md">
          {/* Enemy HP */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> HP
            </span>
            <span className="font-mono text-slate-200">
              {enemy.hp} / {enemy.maxHp}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
            />
          </div>

          {/* Compliance / Mercy */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Compliance (Mercy)
            </span>
            <span className="font-mono text-slate-200">{enemy.mercy}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(0, enemy.mercy)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Middle Section: Battle Narration or Bullet Box Arena */}
      <div className="w-full max-w-md my-auto flex flex-col items-center">
        {phase === 'bullet_dodge' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full text-xs text-indigo-300 font-mono">
              <span>Evade incoming astral hazards!</span>
              <span className="font-bold text-amber-400">{dodgeTimeRemaining.toFixed(1)}s</span>
            </div>

            {/* Deltarune-style Bullet Dodge Box Canvas */}
            <div className="relative p-1 bg-slate-950 border-2 border-indigo-500/80 rounded-xl shadow-2xl overflow-hidden touch-none">
              <canvas
                ref={canvasRef}
                width={240}
                height={180}
                onTouchMove={handleTouchMoveCanvas}
                className="bg-black/95 block cursor-crosshair rounded"
              />

              {/* Mobile Drag Instruction Pill */}
              <div className="absolute bottom-1 inset-x-0 text-center pointer-events-none text-[9px] text-indigo-400/70 font-mono">
                Drag thumb inside box or use WASD / Arrow keys
              </div>
            </div>
          </div>
        ) : phase === 'attack_timing' ? (
          <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-3 shadow-xl">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Timing Precision Strike — Strike the Center!
            </h3>
            {/* Timing Slider Bar */}
            <div className="relative w-full h-8 bg-slate-800 rounded-lg overflow-hidden border border-slate-600 flex items-center">
              {/* Sweet spot zone (42% to 58%) */}
              <div className="absolute left-[42%] w-[16%] h-full bg-emerald-500/40 border-x border-emerald-400 flex items-center justify-center">
                <span className="text-[9px] font-black text-emerald-200 tracking-tighter">CRIT</span>
              </div>
              {/* Moving pointer */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-amber-400 shadow-md shadow-amber-400/80 -translate-x-1/2 rounded"
                style={{ left: `${timingPosition}%` }}
              />
            </div>

            <button
              id="btn-confirm-strike"
              onClick={handleStrikeTiming}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg font-black text-sm tracking-wider uppercase text-white shadow-lg active:scale-95 transition-all"
            >
              Strike Now!
            </button>
          </div>
        ) : (
          /* Narration dialogue box */
          <div className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-200 font-medium shadow-lg min-h-[72px] flex items-center">
            <p className="leading-relaxed">{narration}</p>
          </div>
        )}
      </div>

      {/* Bottom Section: Tactical Menu & Choices */}
      <div className="w-full max-w-lg flex flex-col gap-2">
        {/* Player Mini Stats */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-300 font-mono">
          <span className="text-rose-400">HP: {player.hp}/{player.maxHp}</span>
          <span className="text-cyan-400">MP: {player.mp}/{player.maxMp}</span>
          <span className="text-amber-400">Lantern: {player.lanternCharge}%</span>
        </div>

        {/* Phase: Main Menu */}
        {phase === 'player_menu' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              id="combat-btn-attack"
              onClick={() => setPhase('attack_timing')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-rose-950/80 border border-rose-600/70 rounded-xl text-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Sword className="w-4 h-4 text-rose-500" />
              <span>Attack</span>
            </button>

            <button
              id="combat-btn-arcane"
              onClick={() => setPhase('arcane_menu')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-cyan-950/80 border border-cyan-500/70 rounded-xl text-cyan-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>Arcane</span>
            </button>

            <button
              id="combat-btn-act"
              onClick={() => setPhase('act_menu')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-amber-950/80 border border-amber-500/70 rounded-xl text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>Act</span>
            </button>

            {/* Mercy / Spare Button (Active when Compliance is 100%) */}
            {enemy.mercy >= 100 ? (
              <button
                id="combat-btn-spare"
                onClick={() => {
                  if (enemy.isBoss) {
                    setPhase('resolution');
                  } else {
                    onVictory('subdued', enemy);
                  }
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-300 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/40 animate-pulse active:scale-95 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Spare</span>
              </button>
            ) : (
              <button
                id="combat-btn-item"
                onClick={() => handleUseItem('crimson_draught')}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Potion</span>
              </button>
            )}
          </div>
        )}

        {/* Phase: Arcane Menu */}
        {phase === 'arcane_menu' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCastSpell('flame')}
                disabled={player.mp < 15}
                className="py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-cyan-500/50 rounded-lg text-xs font-semibold text-cyan-200 flex flex-col items-center"
              >
                <span>Flame Surge</span>
                <span className="text-[10px] text-cyan-400">15 MP</span>
              </button>
              <button
                onClick={() => handleCastSpell('frost')}
                disabled={player.mp < 20}
                className="py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-cyan-500/50 rounded-lg text-xs font-semibold text-cyan-200 flex flex-col items-center"
              >
                <span>Frost Ward</span>
                <span className="text-[10px] text-cyan-400">20 MP</span>
              </button>
              <button
                onClick={() => handleCastSpell('sever')}
                disabled={player.mp < 25}
                className="py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-purple-500/50 rounded-lg text-xs font-semibold text-purple-200 flex flex-col items-center"
              >
                <span>Void Sever</span>
                <span className="text-[10px] text-purple-400">25 MP</span>
              </button>
            </div>
            <button
              onClick={() => setPhase('player_menu')}
              className="py-1.5 text-xs text-slate-400 hover:text-slate-200 text-center"
            >
              Back to Menu
            </button>
          </div>
        )}

        {/* Phase: Act Menu */}
        {phase === 'act_menu' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAct('inquire')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-lg text-xs font-semibold text-amber-200"
              >
                Inquire (+25% Compliance)
              </button>
              <button
                onClick={() => handleAct('parley')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-lg text-xs font-semibold text-amber-200"
              >
                Parley (+30% Compliance)
              </button>
              <button
                onClick={() => handleAct('taunt')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-lg text-xs font-semibold text-amber-200"
              >
                Disarm / Taunt (+10%)
              </button>
              <button
                onClick={() => handleAct('purify')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-purple-500/50 rounded-lg text-xs font-semibold text-purple-200"
              >
                Lantern Purify (+35%)
              </button>
            </div>
            <button
              onClick={() => setPhase('player_menu')}
              className="py-1.5 text-xs text-slate-400 hover:text-slate-200 text-center"
            >
              Back to Menu
            </button>
          </div>
        )}

        {/* Phase: Boss Consequential Resolution Choices */}
        {phase === 'resolution' && (
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
            <h3 className="text-center font-black text-amber-400 text-sm tracking-wider uppercase">
              Decide the Fate of Commander Malakar
            </h3>
            <p className="text-xs text-slate-300 text-center">
              Your decision here permanently mutates the game world, faction allegiance, and unlocks unique endgame rewards:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option 1: Slay */}
              <button
                id="btn-verdict-slay"
                onClick={() => onVictory('slain', enemy)}
                className="p-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-500 rounded-xl text-rose-100 flex flex-col items-center text-center gap-1 active:scale-95 transition-all shadow-md"
              >
                <Skull className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-xs uppercase">Slay (Martial Law)</span>
                <span className="text-[10px] text-rose-300/80">
                  Execute Malakar. Claim his greatsword; village enters fearful mourning.
                </span>
              </button>

              {/* Option 2: Subdue / Spare */}
              <button
                id="btn-verdict-subdue"
                onClick={() => onVictory('subdued', enemy)}
                className="p-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 rounded-xl text-emerald-100 flex flex-col items-center text-center gap-1 active:scale-95 transition-all shadow-md"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs uppercase">Subdue (Redeem)</span>
                <span className="text-[10px] text-emerald-300/80">
                  Spare Malakar. He pledges oath to defend the Hamlet as veteran commander.
                </span>
              </button>

              {/* Option 3: Banish */}
              <button
                id="btn-verdict-banish"
                onClick={() => onVictory('banished', enemy)}
                className="p-3 bg-purple-950/80 hover:bg-purple-900 border border-purple-500 rounded-xl text-purple-100 flex flex-col items-center text-center gap-1 active:scale-95 transition-all shadow-md"
              >
                <FlameKindling className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-xs uppercase">Banish (Rift Seal)</span>
                <span className="text-[10px] text-purple-300/80">
                  Trap him in the Interstice. Protects physical world, but eternal rift storms rage.
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
