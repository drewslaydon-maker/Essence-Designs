import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  StageDefinition, 
  Obstacle, 
  PinballElement, 
  ShardParticle, 
  FloatingText, 
  MomentumTier,
  MaterialType 
} from '../../types/ballBreak';
import { MATERIAL_TIERS } from '../../data/ballBreakStages';
import { 
  ensureAudioUnlocked,
  initContinuousTension,
  setContinuousTension,
  stopContinuousTension,
  playKineticRelease,
  playKineticCancel,
  playKineticBounce,
  playTierShift, 
  playBumperHit, 
  playSpeedBoost, 
  playObstacleHit, 
  playComboJingle, 
  playBallDrain,
  triggerHaptic,
  playAudioTestPing 
} from '../../utils/ballBreakAudio';

interface BallBreakCanvasProps {
  stage: StageDefinition;
  onStageClear: (stats: { score: number; timeTaken: number; stars: number }) => void;
  onScoreUpdate: (score: number, combo: number, speed: number, tier: MomentumTier) => void;
  onDestroyUpdate: (glass: number, wood: number, stone: number) => void;
  isPaused: boolean;
  onRestart: () => void;
}

const TABLE_WIDTH = 470;
const TABLE_HEIGHT = 760;
const CRADLE_POS = { x: 235, y: 550 };
const BALL_BASE_RADIUS = 16;

export const BallBreakCanvas: React.FC<BallBreakCanvasProps> = ({
  stage,
  onStageClear,
  onScoreUpdate,
  onDestroyUpdate,
  isPaused,
  onRestart
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ball State (Phase 1 Kinetic feel + Stage destruction)
  const ballRef = useRef({
    x: CRADLE_POS.x,
    y: CRADLE_POS.y,
    vx: 0,
    vy: 0,
    radius: BALL_BASE_RADIUS,
    speed: 0,
    tier: 0 as MomentumTier,
    inSlingshot: true,
    color: '#00f0ff',
    trail: [] as { x: number; y: number; alpha: number; radius: number; color: string }[],
  });

  // Strict Slingshot Drag Tracking (Phase 1 Math & Feel)
  const dragRef = useRef({
    active: false,
    touchId: null as number | 'mouse' | null,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    pullDist: 0,
    clampedDist: 0,
    angle: 0,
    deadZone: 12,
    maxPull: 120,
    impulseScalar: 0.28,
  });

  // Simulation Game State
  const obstaclesRef = useRef<Obstacle[]>([]);
  const pinballElementsRef = useRef<PinballElement[]>([]);
  const particlesRef = useRef<ShardParticle[]>([]);
  const floatTextsRef = useRef<FloatingText[]>([]);
  
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const destroyedCountRef = useRef({ glass: 0, wood: 0, stone: 0 });
  const screenShakeRef = useRef({ intensity: 0, duration: 0 });
  const freezeFramesRef = useRef(0);
  const hasClearedRef = useRef(false);

  // Key pressed state for desktop
  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean }>({
    left: false, right: false, up: false, down: false
  });

  const addScreenShake = (amount: number, durationFrames = 10) => {
    screenShakeRef.current.intensity = Math.max(screenShakeRef.current.intensity, amount);
    screenShakeRef.current.duration = Math.max(screenShakeRef.current.duration, durationFrames);
  };

  const addFloatingText = (text: string, x: number, y: number, color: string, scale = 1.0) => {
    floatTextsRef.current.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      alpha: 1.0,
      scale,
      life: 55,
    });
  };

  const spawnShards = (x: number, y: number, w: number, h: number, material: MaterialType) => {
    const numShards = material === 'stone' ? 14 : material === 'wood' ? 12 : 9;
    const colors = 
      material === 'glass'
        ? ['#38bdf8', '#7dd3fc', '#e0f2fe', '#ffffff']
        : material === 'wood'
        ? ['#f97316', '#ea580c', '#c2410c', '#fdba74']
        : ['#c084fc', '#a855f7', '#7e22ce', '#f3e8ff'];

    for (let i = 0; i < numShards; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6.5;
      const size = 3 + Math.random() * 5;

      const points = [
        { x: -size, y: -size },
        { x: size * (0.8 + Math.random() * 0.5), y: -size * 0.5 },
        { x: size * (Math.random() - 0.5), y: size },
      ];

      particlesRef.current.push({
        id: Math.random().toString(),
        x: x + w / 2 + (Math.random() - 0.5) * (w * 0.6),
        y: y + h / 2 + (Math.random() - 0.5) * (h * 0.6),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        size,
        material,
        points,
        life: 0,
        maxLife: 35 + Math.floor(Math.random() * 20),
      });
    }
  };

  const getRequiredTier = (material: MaterialType): MomentumTier => {
    switch (material) {
      case 'glass': return 1;
      case 'wood': return 2;
      case 'stone': return 3;
      default: return 0;
    }
  };

  // Reload ball to cradle
  const reloadBallToCradle = useCallback(() => {
    const b = ballRef.current;
    b.inSlingshot = true;
    b.x = CRADLE_POS.x;
    b.y = CRADLE_POS.y;
    b.vx = 0;
    b.vy = 0;
    b.speed = 0;
    b.tier = 0;
    b.trail = [];
    dragRef.current.active = false;
    dragRef.current.touchId = null;
    dragRef.current.pullDist = 0;
    dragRef.current.clampedDist = 0;
    stopContinuousTension();
  }, []);

  // Initialize stage
  const resetStageState = useCallback(() => {
    hasClearedRef.current = false;
    startTimeRef.current = Date.now();
    scoreRef.current = 0;
    comboRef.current = 0;
    comboTimerRef.current = 0;
    destroyedCountRef.current = { glass: 0, wood: 0, stone: 0 };
    particlesRef.current = [];
    floatTextsRef.current = [];

    // Clone obstacles with dynamic crack/health state
    obstaclesRef.current = stage.obstacles.map((obs) => ({
      ...obs,
      currentHealth: obs.maxHealth,
      cracks: 0,
      maxCracks: 4,
      destroyed: false,
      crackPoints: [
        { x: obs.width * 0.3, y: obs.height * 0.4 },
        { x: obs.width * 0.65, y: obs.height * 0.6 },
        { x: obs.width * 0.45, y: obs.height * 0.25 },
      ],
    }));

    pinballElementsRef.current = stage.pinballElements.map((el) => ({
      ...el,
      pulseTimer: 0,
    }));

    reloadBallToCradle();
  }, [stage, reloadBallToCradle]);

  useEffect(() => {
    resetStageState();
  }, [stage, resetStageState]);

  // Main Physics Step
  const updatePhysics = () => {
    if (isPaused) return;

    // Micro-freeze frame on heavy stone smash impact
    if (freezeFramesRef.current > 0) {
      freezeFramesRef.current--;
      return;
    }

    const b = ballRef.current;
    const d = dragRef.current;

    // Desktop keyboard steering nudge
    if (!b.inSlingshot) {
      if (keysRef.current.left) b.vx -= 0.55;
      if (keysRef.current.right) b.vx += 0.55;
      if (keysRef.current.up) b.vy -= 0.55;
      if (keysRef.current.down) b.vy += 0.55;
    }

    // Slingshot State vs Flying State
    if (b.inSlingshot) {
      b.vx = 0;
      b.vy = 0;
      b.speed = 0;
      b.tier = 0;
      b.x = CRADLE_POS.x;
      b.y = CRADLE_POS.y;

      if (d.active) {
        // Calculate stretch position from logarithmic tension
        b.x = CRADLE_POS.x + Math.cos(d.angle) * d.clampedDist;
        b.y = CRADLE_POS.y + Math.sin(d.angle) * d.clampedDist;
      }
    } else {
      // IN-FLIGHT KINETIC PHYSICS
      const GRAVITY = 0.11; // Pinball table slant
      b.vy += GRAVITY;

      // Friction dampening
      b.vx *= 0.992;
      b.vy *= 0.992;

      // Position step
      b.x += b.vx;
      b.y += b.vy;

      // Speed & Momentum Tier
      const speed = Math.hypot(b.vx, b.vy);
      b.speed = speed;

      let nextTier: MomentumTier = 0;
      if (speed >= 21) nextTier = 3;
      else if (speed >= 15) nextTier = 2;
      else if (speed >= 9) nextTier = 1;

      if (nextTier !== b.tier) {
        if (nextTier > b.tier) {
          playTierShift(nextTier);
          addFloatingText(`TIER ${nextTier}: ${MATERIAL_TIERS[nextTier].name.toUpperCase()}!`, b.x, b.y - 20, MATERIAL_TIERS[nextTier].color, 1.2);
        }
        b.tier = nextTier;
      }

      // Trail record
      b.trail.unshift({
        x: b.x,
        y: b.y,
        alpha: 0.75,
        radius: b.radius * (0.8 + (b.tier / 3) * 0.4),
        color: MATERIAL_TIERS[b.tier].color,
      });
      if (b.trail.length > 20) b.trail.pop();

      // Table Boundary Collisions
      const LEFT_WALL = 32;
      const RIGHT_WALL = TABLE_WIDTH - 32;
      const TOP_WALL = 40;

      // Left Wall
      if (b.x - b.radius < LEFT_WALL) {
        b.x = LEFT_WALL + b.radius;
        b.vx = -b.vx * 0.88;
        playKineticBounce(speed * 0.08);
        addScreenShake(speed * 0.25, 6);
      }
      // Right Wall
      if (b.x + b.radius > RIGHT_WALL) {
        b.x = RIGHT_WALL - b.radius;
        b.vx = -b.vx * 0.88;
        playKineticBounce(speed * 0.08);
        addScreenShake(speed * 0.25, 6);
      }
      // Top Wall
      if (b.y - b.radius < TOP_WALL) {
        b.y = TOP_WALL + b.radius;
        b.vy = -b.vy * 0.88;
        playKineticBounce(speed * 0.08);
        addScreenShake(speed * 0.25, 6);
      }

      // Auto-reload on coming to rest or bottom gutter
      const BOTTOM_WALL = TABLE_HEIGHT - 35;
      if (b.y + b.radius > BOTTOM_WALL || (b.y > 500 && speed < 0.25)) {
        playBallDrain();
        triggerHaptic('medium');
        addFloatingText('CRADLE RELOADED!', CRADLE_POS.x, CRADLE_POS.y - 30, '#00f0ff', 1.0);
        reloadBallToCradle();
        comboRef.current = 0;
      }

      // Pinball Elements (Bumpers & Boosters)
      pinballElementsRef.current.forEach((el) => {
        if (el.pulseTimer && el.pulseTimer > 0) el.pulseTimer--;

        if (el.type === 'bumper' && el.radius) {
          const dx = b.x - el.x;
          const dy = b.y - el.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b.radius + el.radius;

          if (dist < minDist) {
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            const impulse = el.impulse || 15;
            const currentSpeed = Math.hypot(b.vx, b.vy);
            const outgoingSpeed = Math.max(currentSpeed + 4, impulse + currentSpeed * 0.82);
            b.vx = nx * outgoingSpeed;
            b.vy = Math.min(-6, ny * outgoingSpeed);

            b.x = el.x + nx * (minDist + 1);
            b.y = el.y + ny * (minDist + 1);

            el.pulseTimer = 15;
            playBumperHit();
            playKineticBounce(1.5);
            addScreenShake(4, 10);
            scoreRef.current += 50;
            addFloatingText('+50', el.x, el.y - 15, '#00f0ff', 0.9);
          }
        } else if (el.type === 'boost_pad' && el.width && el.height) {
          if (
            b.x + b.radius > el.x &&
            b.x - b.radius < el.x + el.width &&
            b.y + b.radius > el.y &&
            b.y - b.radius < el.y + el.height
          ) {
            const boost = el.impulse || 18;
            b.vy = -Math.max(22, Math.abs(b.vy) + boost);
            b.vx = b.vx * 0.65 + (Math.sin((el.angle || 0) * Math.PI / 180) * 8);
            playSpeedBoost();
            addScreenShake(4, 10);
            addFloatingText('HYPER BOOST!', el.x + el.width / 2, el.y - 10, '#f97316', 1.1);
          }
        }
      });

      // Obstacle Collisions (Destruction / Cracking)
      obstaclesRef.current.forEach((obs) => {
        if (obs.destroyed) return;

        const nearestX = Math.max(obs.x, Math.min(b.x, obs.x + obs.width));
        const nearestY = Math.max(obs.y, Math.min(b.y, obs.y + obs.height));
        const deltaX = b.x - nearestX;
        const deltaY = b.y - nearestY;
        const distSq = deltaX * deltaX + deltaY * deltaY;

        if (distSq < b.radius * b.radius) {
          const dist = Math.sqrt(distSq) || 1;
          const nx = deltaX / dist;
          const ny = deltaY / dist;

          const requiredTier = getRequiredTier(obs.material);
          const currentTier = b.tier;

          if (currentTier >= requiredTier) {
            // INSTANT DEMOLITION
            obs.destroyed = true;
            spawnShards(obs.x, obs.y, obs.width, obs.height, obs.material);
            playObstacleHit(obs.material, true, 4);

            const speedKeep = obs.material === 'glass' ? 0.88 : obs.material === 'wood' ? 0.74 : 0.55;
            b.vx = (b.vx + nx * 2) * speedKeep;
            b.vy = (b.vy + ny * 2) * speedKeep;

            if (obs.material === 'stone') freezeFramesRef.current = 2;

            const shake = obs.material === 'glass' ? 5 : obs.material === 'wood' ? 9 : 15;
            addScreenShake(shake, 14);

            comboRef.current++;
            comboTimerRef.current = 140;
            const comboMult = Math.min(5, comboRef.current);
            const pts = obs.points * comboMult;
            scoreRef.current += pts;

            playComboJingle(comboRef.current);

            const matColor = obs.material === 'glass' ? '#38bdf8' : obs.material === 'wood' ? '#f97316' : '#c084fc';
            addFloatingText(`+${pts}!`, obs.x + obs.width / 2, obs.y - 10, matColor, 1.1);

            if (obs.material === 'glass') destroyedCountRef.current.glass++;
            else if (obs.material === 'wood') destroyedCountRef.current.wood++;
            else if (obs.material === 'stone') destroyedCountRef.current.stone++;
          } else {
            // SUB-TIER DAMAGE (4-hit fracture accumulation)
            obs.cracks++;
            const shake = obs.material === 'stone' ? 5 : 3;
            addScreenShake(shake, 8);

            if (obs.cracks >= obs.maxCracks) {
              obs.destroyed = true;
              spawnShards(obs.x, obs.y, obs.width, obs.height, obs.material);
              playObstacleHit(obs.material, true, 4);
              scoreRef.current += obs.points;
              addFloatingText(`CRACKED! +${obs.points}`, obs.x + obs.width / 2, obs.y - 10, '#fbbf24', 1.1);
              if (obs.material === 'glass') destroyedCountRef.current.glass++;
              else if (obs.material === 'wood') destroyedCountRef.current.wood++;
              else if (obs.material === 'stone') destroyedCountRef.current.stone++;
            } else {
              playObstacleHit(obs.material, false, obs.cracks);
              addFloatingText(`HIT ${obs.cracks}/${obs.maxCracks}`, obs.x + obs.width / 2, obs.y - 8, '#f59e0b', 0.9);
            }

            b.vx = nx * (b.speed * 0.8 + 1.5);
            b.vy = ny * (b.speed * 0.8 + 1.5);
            b.x = nearestX + nx * (b.radius + 1);
            b.y = nearestY + ny * (b.radius + 1);
            playKineticBounce(b.speed * 0.1);
          }
        }
      });

      // Combo countdown
      if (comboTimerRef.current > 0) {
        comboTimerRef.current--;
        if (comboTimerRef.current <= 0) comboRef.current = 0;
      }

      // Inform parent HUD of telemetry
      onScoreUpdate(scoreRef.current, comboRef.current, b.speed, b.tier);
      onDestroyUpdate(
        destroyedCountRef.current.glass,
        destroyedCountRef.current.wood,
        destroyedCountRef.current.stone
      );

      // Check Stage Clear condition
      const remainingTargets = obstaclesRef.current.filter((o) => !o.destroyed).length;
      if (remainingTargets === 0 && !hasClearedRef.current && obstaclesRef.current.length > 0) {
        hasClearedRef.current = true;
        const timeTaken = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        
        let stars = 1;
        if (timeTaken <= stage.parTime && scoreRef.current >= stage.starScoreThresholds[1]) stars = 2;
        if (timeTaken <= stage.parTime * 0.85 && scoreRef.current >= stage.starScoreThresholds[2]) stars = 3;

        onStageClear({
          score: scoreRef.current,
          timeTaken,
          stars,
        });
      }
    }

    // Update Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) particlesRef.current.splice(i, 1);
    }

    // Update Floating Texts
    for (let i = floatTextsRef.current.length - 1; i >= 0; i--) {
      const ft = floatTextsRef.current[i];
      ft.y -= 0.8;
      ft.life--;
      ft.alpha = Math.max(0, ft.life / 55);
      if (ft.life <= 0) floatTextsRef.current.splice(i, 1);
    }

    // Screen Shake decay
    if (screenShakeRef.current.duration > 0) {
      screenShakeRef.current.duration--;
      screenShakeRef.current.intensity *= 0.88;
    } else {
      screenShakeRef.current.intensity = 0;
    }
  };

  // Rendering Loop
  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // Handle Screen Shake
    if (screenShakeRef.current.intensity > 0.4) {
      const sx = (Math.random() - 0.5) * screenShakeRef.current.intensity;
      const sy = (Math.random() - 0.5) * screenShakeRef.current.intensity;
      ctx.translate(sx, sy);
    }

    // Clear background
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

    // Subtle table grid / blueprint lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 32; x < TABLE_WIDTH - 32; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, TABLE_HEIGHT - 35);
      ctx.stroke();
    }
    for (let y = 40; y < TABLE_HEIGHT - 35; y += 32) {
      ctx.beginPath();
      ctx.moveTo(32, y);
      ctx.lineTo(TABLE_WIDTH - 32, y);
      ctx.stroke();
    }

    // Outer Table Walls (Neon borders)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.strokeRect(28, 36, TABLE_WIDTH - 56, TABLE_HEIGHT - 72);

    // Side deflector rails
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(32, 560);
    ctx.lineTo(155, 715);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(TABLE_WIDTH - 32, 560);
    ctx.lineTo(315, 715);
    ctx.stroke();

    // Draw Pinball Elements
    pinballElementsRef.current.forEach((el) => {
      if (el.type === 'bumper' && el.radius) {
        const pulse = (el.pulseTimer || 0) * 0.5;
        const rad = el.radius + pulse;

        const grad = ctx.createRadialGradient(el.x, el.y, rad * 0.3, el.x, el.y, rad);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.7, '#0284c7');
        grad.addColorStop(1, '#0f172a');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(el.x, el.y, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(el.x, el.y, rad * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'boost_pad' && el.width && el.height) {
        ctx.fillStyle = '#f97316';
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.strokeStyle = '#fdba74';
        ctx.lineWidth = 2;
        ctx.strokeRect(el.x, el.y, el.width, el.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('▲ BOOST', el.x + el.width / 2, el.y + el.height / 2 + 3);
      }
    });

    // Draw Obstacles (Glass / Wood / Stone)
    obstaclesRef.current.forEach((obs) => {
      if (obs.destroyed) return;

      if (obs.material === 'glass') {
        const grad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
        grad.addColorStop(1, 'rgba(14, 165, 233, 0.25)');
        ctx.fillStyle = grad;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.material === 'wood') {
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.material === 'stone') {
        ctx.fillStyle = '#475569';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }

      // Draw Crack Fractures
      if (obs.cracks > 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let c = 0; c < obs.cracks; c++) {
          const pt = obs.crackPoints?.[c % (obs.crackPoints?.length || 1)] || { x: obs.width / 2, y: obs.height / 2 };
          ctx.moveTo(obs.x + pt.x, obs.y + pt.y);
          ctx.lineTo(obs.x + pt.x + (c % 2 === 0 ? 12 : -12), obs.y + pt.y + 10);
        }
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      const label = obs.material === 'glass' ? 'GLASS' : obs.material === 'wood' ? 'WOOD' : 'STONE';
      ctx.fillText(label, obs.x + obs.width / 2, obs.y + obs.height / 2 + 3);
    });

    // Draw Particles
    particlesRef.current.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.points && p.points.length > 0) {
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let i = 1; i < p.points.length; i++) {
          ctx.lineTo(p.points[i].x, p.points[i].y);
        }
      } else {
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    const b = ballRef.current;
    const d = dragRef.current;

    // --- PHASE 1 KINETIC SLINGSHOT RENDERING ---
    if (b.inSlingshot) {
      const tensionRatio = d.clampedDist / d.maxPull;
      const perp = d.angle + Math.PI / 2;
      const spread = 32;

      // Anchor pins perpendicular to drag vector
      const p1x = CRADLE_POS.x + Math.cos(perp) * spread;
      const p1y = CRADLE_POS.y + Math.sin(perp) * spread;
      const p2x = CRADLE_POS.x - Math.cos(perp) * spread;
      const p2y = CRADLE_POS.y - Math.sin(perp) * spread;

      const stretchX = CRADLE_POS.x + Math.cos(d.angle) * d.clampedDist;
      const stretchY = CRADLE_POS.y + Math.sin(d.angle) * d.clampedDist;

      // Dynamic color shift: Cyan (#00f0ff) -> Hot Amber/Pink (#ff3c69)
      const r = Math.round(0 + tensionRatio * 255);
      const g = Math.round(240 - tensionRatio * 180);
      const bColor = Math.round(255 - tensionRatio * 150);
      const bandColor = `rgb(${r}, ${g}, ${bColor})`;

      // 1. Predictive Trajectory Beads with single-surface boundary bounce reflection
      if (d.active && d.pullDist > d.deadZone) {
        const simPower = d.clampedDist * d.impulseScalar;
        let simX = stretchX;
        let simY = stretchY;
        let simVx = -Math.cos(d.angle) * simPower;
        let simVy = -Math.sin(d.angle) * simPower;
        const steps = 38;
        let bounceCount = 0;

        const LEFT_WALL = 32;
        const RIGHT_WALL = TABLE_WIDTH - 32;
        const TOP_WALL = 40;

        for (let i = 0; i < steps; i++) {
          simX += simVx;
          simY += simVy;
          simVx *= 0.992;
          simVy = (simVy + 0.11) * 0.992;

          // Wall bounce prediction
          if (bounceCount <= 1) {
            if (simX - b.radius < LEFT_WALL) {
              simX = LEFT_WALL + b.radius;
              simVx *= -0.88;
              bounceCount++;
            } else if (simX + b.radius > RIGHT_WALL) {
              simX = RIGHT_WALL - b.radius;
              simVx *= -0.88;
              bounceCount++;
            }
            if (simY - b.radius < TOP_WALL) {
              simY = TOP_WALL + b.radius;
              simVy *= -0.88;
              bounceCount++;
            }
          }

          const alpha = (1 - i / steps) * 0.85;
          const radius = Math.max(2, 5.5 * (1 - i / steps));

          ctx.fillStyle = `rgba(${r}, ${g}, ${bColor}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(simX, simY, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Power & Tier readout
        const predictedSpeed = simPower;
        const tierName = predictedSpeed >= 21 ? 'TIER 3 (STONE)' : predictedSpeed >= 15 ? 'TIER 2 (WOOD)' : predictedSpeed >= 9 ? 'TIER 1 (GLASS)' : 'SUB-SPEED';
        ctx.fillStyle = bandColor;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`PWR: ${Math.round(tensionRatio * 100)}% • ${tierName}`, stretchX, stretchY + 36);
      }

      // 2. Dual-band tension rendering
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = bandColor;
      ctx.lineCap = 'round';

      // Band 1: Pin 1 to deformed ball
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(CRADLE_POS.x, CRADLE_POS.y, stretchX, stretchY);
      ctx.stroke();

      // Band 2: Pin 2 to deformed ball
      ctx.beginPath();
      ctx.moveTo(p2x, p2y);
      ctx.quadraticCurveTo(CRADLE_POS.x, CRADLE_POS.y, stretchX, stretchY);
      ctx.stroke();

      // Anchor Pins
      const drawPin = (px: number, py: number) => {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = bandColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      };
      drawPin(p1x, p1y);
      drawPin(p2x, p2y);

      // 3. Elliptical ball deformation under stretch
      ctx.save();
      ctx.translate(stretchX, stretchY);
      ctx.rotate(d.angle);

      const squashX = 1 + tensionRatio * 0.35;
      const squashY = 1 - tensionRatio * 0.22;
      ctx.scale(squashX, squashY);

      // Ball body
      ctx.fillStyle = bandColor;
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-b.radius * 0.3, -b.radius * 0.3, b.radius * 0.32, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else {
      // --- IN-FLIGHT BALL RENDERING ---
      // Trail Ribbon
      if (b.trail.length > 1) {
        for (let i = b.trail.length - 1; i > 0; i--) {
          const t = b.trail[i];
          const ratio = 1 - i / b.trail.length;
          ctx.fillStyle = t.color;
          ctx.globalAlpha = ratio * 0.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * ratio, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      const tierInfo = MATERIAL_TIERS[b.tier];

      // Aura Glow
      const auraGrad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.4, b.x, b.y, b.radius * 2.2);
      auraGrad.addColorStop(0, tierInfo.glowColor);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Ball Core
      const ballGrad = ctx.createRadialGradient(
        b.x - b.radius * 0.3, 
        b.y - b.radius * 0.3, 
        b.radius * 0.1, 
        b.x, 
        b.y, 
        b.radius
      );
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.3, tierInfo.color);
      ballGrad.addColorStop(1, tierInfo.tailColor);

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw Floating Texts
    floatTextsRef.current.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${Math.round(13 * ft.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  };

  // Canvas Coordinate Mapping
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: clientX, y: clientY };
    const rect = canvas.getBoundingClientRect();
    const scaleX = TABLE_WIDTH / rect.width;
    const scaleY = TABLE_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // --- STRICT TOUCH & POINTER EVENT HANDLERS ---
  const handleStart = (clientX: number, clientY: number, id: number | 'mouse') => {
    ensureAudioUnlocked();
    initContinuousTension();

    const coords = getCanvasCoords(clientX, clientY);
    const b = ballRef.current;
    const d = dragRef.current;

    // If ball is flying, a tap immediately resets or halts it
    if (!b.inSlingshot) {
      playKineticBounce(0.6);
      reloadBallToCradle();
      return;
    }

    // Pull from cradle or lower field
    const dx = coords.x - CRADLE_POS.x;
    const dy = coords.y - CRADLE_POS.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 140 || coords.y >= 440) {
      d.active = true;
      d.touchId = id;
      d.startX = coords.x;
      d.startY = coords.y;
      d.currX = coords.x;
      d.currY = coords.y;
      handleMove(clientX, clientY, id);
    }
  };

  const handleMove = (clientX: number, clientY: number, id: number | 'mouse') => {
    const d = dragRef.current;
    if (!d.active || d.touchId !== id) return;

    const coords = getCanvasCoords(clientX, clientY);
    d.currX = coords.x;
    d.currY = coords.y;

    const dx = d.currX - CRADLE_POS.x;
    const dy = d.currY - CRADLE_POS.y;

    d.pullDist = Math.hypot(dx, dy);
    d.angle = Math.atan2(dy, dx);

    // Logarithmic tension dampening
    d.clampedDist = d.maxPull * Math.tanh(d.pullDist / d.maxPull);

    // Continuous audio pitch ramp
    if (d.pullDist > d.deadZone) {
      const tensionRatio = d.clampedDist / d.maxPull;
      setContinuousTension(tensionRatio);
    } else {
      setContinuousTension(0);
    }
  };

  const handleEnd = (id: number | 'mouse') => {
    const d = dragRef.current;
    if (!d.active || d.touchId !== id) return;

    d.active = false;
    d.touchId = null;

    const b = ballRef.current;

    if (d.pullDist > d.deadZone) {
      // Launch ball!
      const power = d.clampedDist * d.impulseScalar;
      b.inSlingshot = false;
      b.vx = -Math.cos(d.angle) * power;
      b.vy = -Math.sin(d.angle) * power;

      playKineticRelease(power / (d.maxPull * d.impulseScalar));
      addScreenShake(power * 0.45, 12);
    } else {
      // Drop back inside deadzone
      playKineticCancel();
      reloadBallToCradle();
    }
  };

  // Mount listeners with non-passive touch prevention
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleStart(touch.clientX, touch.clientY, touch.identifier);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === dragRef.current.touchId) {
          handleMove(touch.clientX, touch.clientY, touch.identifier);
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === dragRef.current.touchId) {
          handleEnd(touch.identifier);
          break;
        }
      }
    };

    const onTouchCancel = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd(dragRef.current.touchId ?? 0);
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY, 'mouse');
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY, 'mouse');
    };

    const onMouseUp = () => {
      handleEnd('mouse');
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onTouchCancel, { passive: false });

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Keyboard controls for desktop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true;

      // Space to launch if in slingshot
      if (e.code === 'Space' && ballRef.current.inSlingshot) {
        ensureAudioUnlocked();
        const b = ballRef.current;
        b.inSlingshot = false;
        b.vx = (Math.random() - 0.5) * 3;
        b.vy = -26;
        playKineticRelease(1.0);
        addScreenShake(6, 12);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      updatePhysics();
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) render(ctx);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      stopContinuousTension();
    };
  }, [isPaused]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[470px] mx-auto select-none touch-none">
      <canvas
        ref={canvasRef}
        width={TABLE_WIDTH}
        height={TABLE_HEIGHT}
        className="w-full h-auto max-h-[72vh] sm:max-h-[76vh] rounded-2xl border-2 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#06090f] cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Slingshot Pull Hint */}
      {ballRef.current.inSlingshot && !dragRef.current.active && (
        <div className="absolute bottom-36 pointer-events-none text-center bg-slate-900/90 backdrop-blur-sm border border-cyan-500/50 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          ↓ Pull Back Ball to Launch ↓
        </div>
      )}

      {/* Status & Control Guidance */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 px-2">
        <span className="text-cyan-400">✦ Kinetic Slingshot (Phase 1 Engine)</span>
        <button
          onClick={() => {
            ensureAudioUnlocked();
            playAudioTestPing();
          }}
          className="text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-bold"
        >
          🔊 Test Sound
        </button>
      </div>
    </div>
  );
};
