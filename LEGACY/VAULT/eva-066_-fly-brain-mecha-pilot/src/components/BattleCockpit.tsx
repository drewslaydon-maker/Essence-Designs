/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BattleState, ConnectomeState, Angel, Projectile, MechaCustomization } from '../types';
import { FlyBrainConnectome } from '../simulation/flyBrainConnectome';
import { AngelEngine, ANGEL_CATALOG } from '../simulation/angelEngine';
import { PILOT_ROSTER, PAINTJOB_CATALOG, VISOR_CATALOG } from '../simulation/pilotData';
import { audio } from '../services/audioService';
import {
  Crosshair,
  Zap,
  Shield,
  Dna,
  Eye,
  AlertOctagon,
  Sparkles,
  Flame,
  RotateCcw,
  Target,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';

interface BattleCockpitProps {
  connectome: FlyBrainConnectome;
  connectomeState: ConnectomeState;
  onSyncRatioChange: (ratio: number) => void;
  customization?: MechaCustomization;
  onAwardCredits?: (credits: number) => void;
}

export const BattleCockpit: React.FC<BattleCockpitProps> = ({
  connectome,
  connectomeState,
  onSyncRatioChange,
  customization,
  onAwardCredits,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Engines
  const angelEngineRef = useRef<AngelEngine>(new AngelEngine());
  const activePilot = PILOT_ROSTER[customization?.activePilotId || 'SHIN_FLY'];
  const activePaint = PAINTJOB_CATALOG[customization?.paintjob || 'TEST_TYPE_01'];
  const activeVisor = VISOR_CATALOG[customization?.visorStyle || 'COMPOUND_HEX'];

  // Battle State
  const [battle, setBattle] = useState<BattleState>({
    evaHealth: 100,
    evaMaxHealth: 100,
    evaAtField: 100,
    evaEnergy: 100,
    pilotSyncRatio: 78.4,
    evaPosition: { x: 0, y: 0 },
    evaVelocity: { x: 0, y: 0 },
    activeAngel: null,
    defeatedAngelsCount: 0,
    projectiles: [],
    score: 0,
    pilotMode: 'AUTO_FLY', // 'AUTO_FLY' | 'BIO_SYNC' | 'BERSERK'
    alerts: ['PILOT: SPECIMEN-01 (FLY) SYNCHRONIZED', 'BLOOD TYPE BLUE: ANGEL DETECTED'],
    sugarLureActive: false,
    sugarLurePos: null,
    lightStrobeActive: false,
  });

  const [lastEvasionTime, setLastEvasionTime] = useState(0);
  const [showAngelDefeatedSplash, setShowAngelDefeatedSplash] = useState<string | null>(null);
  const [autoFireEnabled, setAutoFireEnabled] = useState(true);
  const [damageFlash, setDamageFlash] = useState(false);
  const [showAngelInfo, setShowAngelInfo] = useState(false);

  // Floating combat text on canvas
  const floatingTextsRef = useRef<{ id: string; text: string; x: number; y: number; color: string; birth: number }[]>([]);
  const autoFireCooldownRef = useRef(0);

  // Sync with angel engine
  useEffect(() => {
    setBattle((prev) => ({
      ...prev,
      activeAngel: angelEngineRef.current.activeAngel,
    }));
  }, []);

  // Keyboard controls for Bio-Sync mode
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // Quick action keys
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        firePositron();
      } else if (e.key.toLowerCase() === 'e') {
        injectOctopamine();
      } else if (e.key.toLowerCase() === 's') {
        toggleSugarLure();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Fire Positron Rifle - Leads target accurately towards active Angel
  const firePositron = useCallback(() => {
    setBattle((prev) => {
      if (prev.evaEnergy < 10) return prev;

      const angel = angelEngineRef.current.activeAngel;
      audio.playLaserShot();

      // Targeting lead calculation toward Angel position
      const targetZ = angel && angel.state !== 'DEFEATED' ? angel.position.z : 350;
      const flightFrames = Math.max(6, (targetZ - 15) / 14);
      const targetX = angel && angel.state !== 'DEFEATED' ? angel.position.x : prev.evaPosition.x;
      const targetY = angel && angel.state !== 'DEFEATED' ? angel.position.y : prev.evaPosition.y;
      const vx = (targetX - prev.evaPosition.x) / flightFrames;
      const vy = (targetY - (prev.evaPosition.y - 4)) / flightFrames;

      const newProj: Projectile = {
        id: `EVA_SHOT_${Date.now()}_${Math.random()}`,
        x: prev.evaPosition.x,
        y: prev.evaPosition.y - 4,
        z: 15,
        vx: vx,
        vy: vy,
        vz: 14,
        radius: 10,
        color: '#00ffff',
        isHostile: false,
        type: 'EVA_POSITRON',
      };

      return {
        ...prev,
        evaEnergy: Math.max(0, prev.evaEnergy - 10),
        projectiles: [...prev.projectiles, newProj],
      };
    });
  }, []);

  // Inject Octopamine
  const injectOctopamine = () => {
    connectome.injectOctopamine(30);
    audio.playBeep(750, 'sawtooth', 0.15);
    setBattle((prev) => ({
      ...prev,
      alerts: [`[OCTOPAMINE INJECTED]: STIMULUS BOOSTED TO ${Math.round(connectome.state.octopamineLevel)}%`, ...prev.alerts.slice(0, 4)],
    }));
  };

  // Toggle Sugar Lure
  const toggleSugarLure = () => {
    setBattle((prev) => {
      const active = !prev.sugarLureActive;
      if (active) audio.playBeep(880, 'sine', 0.2);
      return {
        ...prev,
        sugarLureActive: active,
        sugarLurePos: active ? { x: 0, y: 0 } : null,
        alerts: [active ? '[SUCROSE BEACON DEPLOYED]: DRAWING FLY RETINA' : '[SUCROSE BEACON EXPIRED]', ...prev.alerts.slice(0, 4)],
      };
    });
  };

  // Toggle Light Strobe
  const toggleLightStrobe = () => {
    setBattle((prev) => {
      const active = !prev.lightStrobeActive;
      if (active) audio.playBeep(1200, 'square', 0.1);
      return {
        ...prev,
        lightStrobeActive: active,
        alerts: [active ? '[OPTIC STROBE ENGAGED]: DISORIENTING MOTION DETECTORS' : '[OPTIC STROBE DISENGAGED]', ...prev.alerts.slice(0, 4)],
      };
    });
  };

  // Main 60 FPS Game & SNN Simulation Loop
  useEffect(() => {
    let animFrame: number;
    let gridOffset = 0;

    const loop = () => {
      gridOffset = (gridOffset + 1.2) % 30;

      // 1. Update Angel & Projectiles
      const angelEngine = angelEngineRef.current;
      const angel = angelEngine.activeAngel;

      let angelAngle = 0;
      let angelDist = 300;

      if (angel) {
        const dx = angel.position.x - battle.evaPosition.x;
        const dz = Math.max(10, angel.position.z);
        angelAngle = Math.atan2(dx, dz);
        angelDist = Math.sqrt(dx * dx + dz * dz);
      }

      // Check upcoming projectiles for looming threat
      let maxProjLooming = 0;
      battle.projectiles.forEach((p) => {
        if (p.isHostile && p.z > 0 && p.z < 180) {
          const expansion = (180 - p.z) / 180;
          if (expansion > maxProjLooming) maxProjLooming = expansion;
        }
      });

      const { newProjectiles, loomingExpansion, opticFlowX } = angelEngine.update(battle.evaPosition);
      const totalLooming = Math.max(loomingExpansion, maxProjLooming * 1.5);

      // 2. Feed Sensory Data to Fly Connectome
      connectome.feedSensoryData({
        angelRelativeAngle: angelAngle,
        angelDistance: angelDist,
        loomingExpansionVelocity: totalLooming,
        opticFlowLeft: -opticFlowX * 0.05,
        opticFlowRight: opticFlowX * 0.05,
        sugarLureActive: battle.sugarLureActive,
        lightStrobeActive: battle.lightStrobeActive,
      });

      // 3. Step Biological Connectome
      const snn = connectome.step();
      onSyncRatioChange(snn.syncRatio);

      // Update sound engine wingbeat
      audio.updateWingbeat(snn.wingbeatFrequency, snn.motorOutputs.forwardThrust);

      // Check Giant Fiber Evasive Burst
      if (snn.motorOutputs.evasiveBurst && Date.now() - lastEvasionTime > 1200) {
        setLastEvasionTime(Date.now());
        audio.playLoomingReflex();
        audio.playAtField();
        if (onAwardCredits) onAwardCredits(100);

        // Sudden evasive dash
        const dashBonus = 1 + (customization?.upgrades.giantFiberLevel || 0) * 0.25;
        const dashDir = snn.motorOutputs.yawRate >= 0 ? 1 : -1;
        setBattle((prev) => ({
          ...prev,
          score: prev.score + 100,
          evaPosition: {
            x: Math.max(-45, Math.min(45, prev.evaPosition.x + dashDir * 24 * dashBonus)),
            y: prev.evaPosition.y,
          },
          evaAtField: Math.min(100, prev.evaAtField + 15),
          alerts: ['[GIANT FIBER TRIGGERED]: RETRO-THRUST EVASION (+100 PTS)!', ...prev.alerts.slice(0, 4)],
        }));
      }

      // Auto-fire positron if target in crosshair cone
      autoFireCooldownRef.current -= 1;
      const shouldAutoFire = autoFireEnabled && (battle.pilotMode === 'AUTO_FLY' || battle.pilotMode === 'BERSERK');
      const cadence = battle.pilotMode === 'BERSERK' ? 20 : 36;
      if (shouldAutoFire && autoFireCooldownRef.current <= 0 && angel && angel.state !== 'DEFEATED') {
        const xDist = Math.abs(angel.position.x - battle.evaPosition.x);
        const yDist = Math.abs(angel.position.y - battle.evaPosition.y);
        if (xDist < 35 && yDist < 25 && battle.evaEnergy >= 10) {
          firePositron();
          autoFireCooldownRef.current = cadence;
        }
      }

      // 4. Update EVA Movement based on Pilot Mode
      setBattle((prev) => {
        let targetVx = 0;
        let targetVy = 0;

        if (prev.pilotMode === 'AUTO_FLY' || prev.pilotMode === 'BERSERK') {
          // The fly's motor neurons pilot the mecha!
          const speedMultiplier = prev.pilotMode === 'BERSERK' ? 1.8 : 1.0;
          targetVx = snn.motorOutputs.yawRate * 1.8 * speedMultiplier;
          targetVy = -snn.motorOutputs.pitchRate * 1.2 * speedMultiplier;

          // Natural micro-jitter of fly saccadic movements
          targetVx += (Math.random() - 0.5) * 0.4;
        } else {
          // Bio-Sync Mode (hybrid player + fly assistance)
          if (keysPressed.current['a'] || keysPressed.current['arrowleft']) targetVx -= 1.6;
          if (keysPressed.current['d'] || keysPressed.current['arrowright']) targetVx += 1.6;
          if (keysPressed.current['w'] || keysPressed.current['arrowup']) targetVy -= 1.2;
          if (keysPressed.current['s'] || keysPressed.current['arrowdown']) targetVy += 1.2;

          // Fly stabilization assistance
          targetVx += snn.motorOutputs.yawRate * 0.6;
        }

        const nextPosX = Math.max(-50, Math.min(50, prev.evaPosition.x + targetVx));
        const nextPosY = Math.max(-30, Math.min(30, prev.evaPosition.y + targetVy));

        // Recharging energy slowly
        const nextEnergy = Math.min(100, prev.evaEnergy + 0.18);
        const nextAtField = Math.min(100, prev.evaAtField + 0.08);

        // Update Projectiles
        const currentProjectiles = [...prev.projectiles, ...newProjectiles];
        const survivingProjectiles: Projectile[] = [];
        let updatedEvaHealth = prev.evaHealth;
        let updatedEvaAtField = nextAtField;
        let scoreInc = 0;
        let angelDestroyed = false;

        currentProjectiles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Check hit on EVA
          if (p.isHostile && p.z <= 16 && p.z >= -14) {
            const hitDist = Math.hypot(p.x - nextPosX, p.y - nextPosY);
            if (hitDist < 24) {
              setDamageFlash(true);
              setTimeout(() => setDamageFlash(false), 200);

              if (updatedEvaAtField > 10) {
                // AT field absorbs part of impact, but hull takes chip damage!
                updatedEvaAtField = Math.max(0, updatedEvaAtField - 18);
                updatedEvaHealth = Math.max(0, updatedEvaHealth - 8);
                audio.playAtField();
                floatingTextsRef.current.push({
                  id: `FT_${Date.now()}_${Math.random()}`,
                  text: `-18 AT // -8 HULL`,
                  x: nextPosX,
                  y: nextPosY,
                  color: '#ffaa00',
                  birth: Date.now(),
                });
              } else {
                // Hull breach! Full damage!
                updatedEvaHealth = Math.max(0, updatedEvaHealth - 22);
                audio.playExplosion();
                floatingTextsRef.current.push({
                  id: `FT_${Date.now()}_${Math.random()}`,
                  text: `CRITICAL HULL -22!`,
                  x: nextPosX,
                  y: nextPosY,
                  color: '#ff0033',
                  birth: Date.now(),
                });
              }
              return; // Consume projectile
            }
          }

          // Check hit on Angel
          if (!p.isHostile && angel && angel.state !== 'DEFEATED') {
            const distToAngel = Math.hypot(p.x - angel.position.x, p.y - angel.position.y, p.z - angel.position.z);
            const zClose = Math.abs(p.z - angel.position.z);
            const xyDist = Math.hypot(p.x - angel.position.x, p.y - angel.position.y);
            if (distToAngel < 38 || (zClose < 20 && xyDist < 28)) {
              audio.playExplosion();
              scoreInc += 50; // Core hit merit
              if (onAwardCredits) onAwardCredits(50);

              const needleBonus = 1 + (customization?.upgrades.needleLevel || 0) * 0.25;
              const pilotAtk = activePilot.stats.attackPower;
              const baseDamage = prev.pilotMode === 'BERSERK' ? 65 : 42;
              const damageAmount = Math.round(baseDamage * pilotAtk * needleBonus);
              const defeated = angelEngine.damageAngel(damageAmount);

              floatingTextsRef.current.push({
                id: `FT_${Date.now()}_${Math.random()}`,
                text: `-${damageAmount} HP`,
                x: angel.position.x,
                y: angel.position.y,
                color: '#ff3366',
                birth: Date.now(),
              });

              if (defeated) {
                angelDestroyed = true;
                scoreInc += 1200; // Defeat bonus merit
                if (onAwardCredits) onAwardCredits(1200);
              }
              return; // Consume projectile
            }
          }

          // Filter out-of-bounds
          if (p.z > -20 && p.z < 600) {
            survivingProjectiles.push(p);
          }
        });

        // Emergency bio-defibrillation if hull is depleted
        if (updatedEvaHealth <= 0) {
          updatedEvaHealth = 75;
          updatedEvaAtField = 60;
          connectome.injectOctopamine(45);
          audio.playEmergencyKlaxon();
          floatingTextsRef.current.push({
            id: `FT_${Date.now()}_${Math.random()}`,
            text: `EMERGENCY DEFIBRILLATION!`,
            x: nextPosX,
            y: nextPosY,
            color: '#a855f7',
            birth: Date.now(),
          });
        }

        // If Angel defeated, spawn next after a brief delay
        if (angelDestroyed && angel) {
          setShowAngelDefeatedSplash(angel.name);
          setTimeout(() => {
            angelEngine.spawnNextAngel();
            setShowAngelDefeatedSplash(null);
            setBattle((b) => ({
              ...b,
              activeAngel: angelEngine.activeAngel,
              defeatedAngelsCount: b.defeatedAngelsCount + 1,
              alerts: [`NEW PATTERN BLUE DETECTED: ${angelEngine.activeAngel?.name}`, ...b.alerts.slice(0, 4)],
            }));
          }, 2400);
        }

        return {
          ...prev,
          evaPosition: { x: nextPosX, y: nextPosY },
          evaHealth: Math.max(0, updatedEvaHealth),
          evaAtField: Math.max(0, updatedEvaAtField),
          evaEnergy: nextEnergy,
          projectiles: survivingProjectiles,
          score: prev.score + scoreInc,
          activeAngel: angelEngine.activeAngel,
        };
      });

      // 5. Render Cockpit Vector Graphics onto Canvas
      renderCanvas(gridOffset);

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [battle.pilotMode, battle.sugarLureActive, battle.lightStrobeActive, lastEvasionTime, onSyncRatioChange]);

  // Canvas Vector Graphics Renderer
  const renderCanvas = (gridOffset: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);
    const cx = w / 2;
    const cy = h / 2;

    // Clear with dark atmospheric gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#04070a');
    bgGrad.addColorStop(0.5, '#0c0f18');
    bgGrad.addColorStop(1, '#020406');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 1. Perspective Wireframe City Grid (Tokyo-3)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.22)';
    ctx.lineWidth = 1;

    // Horizon line
    const horizonY = cy + 40;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(w, horizonY);
    ctx.stroke();

    // Perspective depth lines
    for (let x = -w * 0.8; x <= w * 1.8; x += 60) {
      ctx.beginPath();
      ctx.moveTo(cx + (battle.evaPosition.x * 2), horizonY);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal depth rungs
    for (let z = 1; z <= 12; z++) {
      const pz = ((z * 25 + gridOffset) % 300) / 300;
      const py = horizonY + Math.pow(pz, 1.8) * (h - horizonY);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Render Projectiles
    battle.projectiles.forEach((p) => {
      // Perspective projection
      const scale = 300 / Math.max(10, p.z);
      const px = cx + (p.x - battle.evaPosition.x) * scale;
      const py = cy + (p.y - battle.evaPosition.y) * scale;
      const radius = Math.max(2, p.radius * (scale / 10));

      if (px > -50 && px < w + 50 && py > -50 && py < h + 50) {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isHostile ? 14 : 18;

        if (p.type === 'ANGEL_WEB') {
          // Geometric spider web filament
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.stroke();
          // Crossed filaments
          ctx.moveTo(px - radius, py);
          ctx.lineTo(px + radius, py);
          ctx.moveTo(px, py - radius);
          ctx.lineTo(px, py + radius);
          ctx.stroke();
        } else if (p.type === 'EVA_POSITRON') {
          // Intense neon laser streak
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#00ffff';
          ctx.beginPath();
          ctx.moveTo(px, py + 10);
          ctx.lineTo(px, py - 35);
          ctx.stroke();
        } else {
          // Energy sphere
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // 3. Render Active Angel in 3D Wireframe / Vector
    const angel = battle.activeAngel;
    if (angel && angel.position.z > 5) {
      const scale = 320 / Math.max(10, angel.position.z);
      const ax = cx + (angel.position.x - battle.evaPosition.x) * scale;
      const ay = cy + (angel.position.y - battle.evaPosition.y) * scale;
      const angelSize = 45 * scale;

      ctx.save();
      ctx.translate(ax, ay);

      // Floating A.T. Field Shimmering Hexagons
      if (angel.atFieldIntegrity > 10) {
        ctx.strokeStyle = `rgba(255, 140, 0, ${angel.atFieldIntegrity / 140})`;
        ctx.lineWidth = 2;
        for (let r = 0; r < 3; r++) {
          const hexR = angelSize * (1.1 + r * 0.25);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3 + angel.phase * 0.5;
            const hx = Math.cos(a) * hexR;
            const hy = Math.sin(a) * hexR;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Angel Specific Wireframe Geometry
      if (angel.type === 'RAMIEL_SWAT') {
        // Rotating Octahedron
        const rot = angel.phase * 2;
        ctx.strokeStyle = '#ffbb00';
        ctx.shadowColor = '#ffbb00';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2.5;

        // Draw wireframe diamond / octahedron
        const topY = -angelSize * 1.5;
        const botY = angelSize * 1.5;
        const midR = angelSize * 1.2;

        const pts = [
          { x: Math.cos(rot) * midR, y: 0 },
          { x: Math.cos(rot + Math.PI / 2) * midR, y: 0 },
          { x: Math.cos(rot + Math.PI) * midR, y: 0 },
          { x: Math.cos(rot + (Math.PI * 3) / 2) * midR, y: 0 },
        ];

        // Facets
        ctx.beginPath();
        pts.forEach((p) => {
          ctx.moveTo(0, topY);
          ctx.lineTo(p.x, p.y);
          ctx.lineTo(0, botY);
        });
        for (let i = 0; i < 4; i++) {
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[(i + 1) % 4].x, pts[(i + 1) % 4].y);
        }
        ctx.stroke();

        // Glowing red core
        ctx.fillStyle = '#ff0033';
        ctx.beginPath();
        ctx.arc(0, 0, angelSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (angel.type === 'SACHIEL_SPIDER') {
        // Spider Angel with 8 segmented legs
        ctx.strokeStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;

        // Core body
        ctx.beginPath();
        ctx.ellipse(0, 0, angelSize * 0.6, angelSize * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing Red Core
        ctx.fillStyle = '#ff0033';
        ctx.beginPath();
        ctx.arc(0, 0, angelSize * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // 8 articulated spider legs
        for (let i = 0; i < 8; i++) {
          const side = i < 4 ? -1 : 1;
          const legIdx = i % 4;
          const legAngle = (legIdx * 0.4 - 0.6) + Math.sin(angel.phase * 3 + i) * 0.15;
          const kneeX = side * (angelSize * (1.2 + legIdx * 0.3));
          const kneeY = Math.sin(legAngle) * angelSize * 0.8 - angelSize * 0.4;
          const footX = kneeX + side * angelSize * 0.6;
          const footY = kneeY + angelSize * 1.1;

          ctx.beginPath();
          ctx.moveTo(side * angelSize * 0.4, (legIdx - 1.5) * 8);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        }
      } else if (angel.type === 'MANTIS_IEL') {
        // Praying Mantis Angel with scythes
        ctx.strokeStyle = '#00ffaa';
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur = 14;
        ctx.lineWidth = 2;

        // Triangular Mantis Head & Compound eyes
        ctx.beginPath();
        ctx.moveTo(0, -angelSize * 0.8);
        ctx.lineTo(-angelSize * 0.5, -angelSize * 0.3);
        ctx.lineTo(angelSize * 0.5, -angelSize * 0.3);
        ctx.closePath();
        ctx.stroke();

        // Glowing Core
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(0, angelSize * 0.2, angelSize * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Two razor-sharp scythe arms
        for (let side of [-1, 1]) {
          const scytheAngle = Math.sin(angel.phase * 4) * 0.4 + 0.8;
          ctx.beginPath();
          ctx.moveTo(side * angelSize * 0.4, -angelSize * 0.2);
          const elbowX = side * angelSize * 1.3;
          const elbowY = -angelSize * 0.8;
          const bladeTipX = elbowX - side * Math.cos(scytheAngle) * angelSize * 1.2;
          const bladeTipY = elbowY + Math.sin(scytheAngle) * angelSize * 1.5;

          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(bladeTipX, bladeTipY);
          ctx.stroke();
        }
      } else if (angel.type === 'FROG_IEL') {
        // Frog Behemoth
        ctx.strokeStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 2.5;

        // Wide predatory mouth & head
        ctx.beginPath();
        ctx.ellipse(0, 0, angelSize * 1.4, angelSize * 0.9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eyes
        ctx.beginPath();
        ctx.arc(-angelSize * 0.8, -angelSize * 0.7, angelSize * 0.35, 0, Math.PI * 2);
        ctx.arc(angelSize * 0.8, -angelSize * 0.7, angelSize * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        // Red Core
        ctx.fillStyle = '#ff0033';
        ctx.beginPath();
        ctx.arc(0, 0, angelSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Crosshair Lock-on Reticle
      ctx.save();
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 1.5;
      const reticleR = Math.max(25, angelSize * 0.9);
      ctx.beginPath();
      ctx.arc(ax, ay, reticleR, 0, Math.PI * 2);
      ctx.stroke();

      // Corner brackets
      const bLen = 10;
      ctx.beginPath();
      ctx.moveTo(ax - reticleR - bLen, ay);
      ctx.lineTo(ax - reticleR + bLen, ay);
      ctx.moveTo(ax + reticleR - bLen, ay);
      ctx.lineTo(ax + reticleR + bLen, ay);
      ctx.moveTo(ax, ay - reticleR - bLen);
      ctx.lineTo(ax, ay - reticleR + bLen);
      ctx.moveTo(ax, ay + reticleR - bLen);
      ctx.lineTo(ax, ay + reticleR + bLen);
      ctx.stroke();

      // Angel Target Information Tag - position defensively so it never clips or overlaps
      const isRightSide = ax > cx;
      const tagX = isRightSide ? ax - reticleR - 190 : ax + reticleR + 12;
      ctx.fillStyle = '#00ffcc';
      ctx.font = '11px "Share Tech Mono", monospace';
      ctx.fillText(`TARGET: ${angel.codeName}`, tagX, ay - 12);
      ctx.fillText(`DIST: ${Math.round(angel.position.z)}m // AT-FIELD: ${Math.round(angel.atFieldIntegrity)}%`, tagX, ay + 4);
      ctx.fillText(`THREAT: PREDATOR CLASS`, tagX, ay + 20);
      ctx.restore();
    }

    // 4. Cockpit Canopy Frame & HUD Overlays
    ctx.save();
    // Border canopy frame
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.4)';
    ctx.lineWidth = 2;

    // Corner HUD brackets
    const pad = 24;
    const len = 40;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(pad, pad + len);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + len, pad);
    // Top-right
    ctx.moveTo(w - pad - len, pad);
    ctx.lineTo(w - pad, pad);
    ctx.lineTo(w - pad, pad + len);
    // Bottom-left
    ctx.moveTo(pad, h - pad - len);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(pad + len, h - pad);
    // Bottom-right
    ctx.moveTo(w - pad - len, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.lineTo(w - pad, h - pad - len);
    ctx.stroke();

    // Central EVA Targeting Crosshair
    ctx.strokeStyle = 'rgba(0, 255, 180, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.moveTo(cx - 24, cy);
    ctx.lineTo(cx + 24, cy);
    ctx.moveTo(cx, cy - 24);
    ctx.lineTo(cx, cy + 24);
    ctx.stroke();

    // Floating Combat Text on Canvas
    const now = Date.now();
    floatingTextsRef.current = floatingTextsRef.current.filter((ft) => now - ft.birth < 1100);
    floatingTextsRef.current.forEach((ft) => {
      const age = (now - ft.birth) / 1100;
      const scale = 300 / Math.max(10, 70);
      const fx = cx + ft.x * scale;
      const fy = cy + ft.y * scale - age * 35;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 13px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, fx, fy);
      ctx.restore();
    });

    // Damage flash vignette
    if (damageFlash) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 0, 30, 0.28)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // Looming Escape Warning Vignette if threat level is high
    if (connectomeState.loomingThreatLevel > 0.45) {
      const alpha = Math.min(0.6, (connectomeState.loomingThreatLevel - 0.45) * 1.5);
      const radGrad = ctx.createRadialGradient(cx, cy, w * 0.2, cx, cy, w * 0.7);
      radGrad.addColorStop(0, 'rgba(255, 0, 0, 0)');
      radGrad.addColorStop(1, `rgba(255, 0, 50, ${alpha})`);
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Warning text
      ctx.fillStyle = '#ff0033';
      ctx.font = 'bold 18px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ LOOMING STIMULUS DETECTED // GIANT FIBER ARMED ⚠', cx, cy - 80);
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.fillText('[EMERGENCY ESCAPE REFLEX PRIMED]', cx, cy - 60);
    }

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black text-white font-mono-tech select-none overflow-hidden">
      {/* 3D Battlefield Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[380px] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none" />

        {/* Top-Center: Non-blocking Evangelion Alert Banner (Replaces intrusive popup) */}
        {showAngelDefeatedSplash && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[92%] max-w-md">
            <div className="px-4 py-2 bg-gradient-to-r from-red-950/95 via-neutral-950/95 to-red-950/95 border-y-2 border-red-500 shadow-xl shadow-red-950/70 flex items-center justify-between gap-3 text-center backdrop-blur-md rounded">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-[9px] text-red-300 tracking-widest font-mono uppercase">
                  PATTERN BLUE SILENCED // SYNAPSE RECORDED
                </div>
                <div className="text-lg font-bold font-teko text-white tracking-widest leading-none">
                  {showAngelDefeatedSplash} ANNIHILATED (+1500 PTS)
                </div>
              </div>
              <Target className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
          </div>
        )}

        {/* Top-Left: Bio-Sync Cockpit Telemetry */}
        <div className="absolute top-3 left-3 p-2.5 bg-black/80 border border-orange-500/50 rounded-lg backdrop-blur-sm w-52 sm:w-60 space-y-1.5 z-10 text-xs">
          <div className="flex items-center justify-between border-b border-orange-500/30 pb-1">
            <span className="text-orange-400 font-bold tracking-wider text-[11px]">EVA-066 TELEMETRY</span>
            <span className="text-[10px] text-neutral-400 font-mono">SPECIMEN-01</span>
          </div>

          {/* EVA Hull Integrity */}
          <div>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-neutral-300">HULL INTEGRITY</span>
              <span className={battle.evaHealth > 40 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {Math.round(battle.evaHealth)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${battle.evaHealth > 40 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${battle.evaHealth}%` }}
              />
            </div>
          </div>

          {/* A.T. Field Power */}
          <div>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-neutral-300">A.T. FIELD BARRIER</span>
              <span className="text-orange-400 font-bold">{Math.round(battle.evaAtField)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all shadow-sm shadow-orange-500"
                style={{ width: `${battle.evaAtField}%` }}
              />
            </div>
          </div>

          {/* Battery Reserves */}
          <div>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-neutral-300">POSITRON BATTERY</span>
              <span className="text-cyan-400 font-bold">{Math.round(battle.evaEnergy)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: `${battle.evaEnergy}%` }} />
            </div>
          </div>

          {/* Biological Stats */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-neutral-800 text-[10px]">
            <div>
              <span className="text-neutral-400 block text-[9px]">WINGBEAT</span>
              <span className="text-emerald-400 font-bold">{connectomeState.wingbeatFrequency} Hz</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[9px]">OCTOPAMINE</span>
              <span className="text-purple-400 font-bold">{Math.round(connectomeState.octopamineLevel)}%</span>
            </div>
          </div>
        </div>

        {/* Top-Right: Target Angel Diagnostic (Compact & non-obstructive) */}
        {battle.activeAngel && (
          <div className="absolute top-3 right-3 p-2.5 bg-black/80 border border-red-500/50 rounded-lg backdrop-blur-sm w-52 sm:w-60 space-y-1.5 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-red-500/30 pb-1">
              <span className="text-red-400 font-bold tracking-wider text-[11px] truncate">{battle.activeAngel.codeName}</span>
              <span className="text-[9px] text-red-500 animate-pulse font-bold">BLOOD: BLUE</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-300 font-semibold">
              <span className="truncate">{battle.activeAngel.name}</span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {Math.round(battle.activeAngel.position.z)}m
              </span>
            </div>

            {/* Core Integrity */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-neutral-400">CORE INTEGRITY</span>
                <span className="text-red-400 font-bold">
                  {Math.round((battle.activeAngel.health / battle.activeAngel.maxHealth) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all"
                  style={{
                    width: `${Math.max(0, (battle.activeAngel.health / battle.activeAngel.maxHealth) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Angel A.T. Field */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-neutral-400">ANGEL A.T. FIELD</span>
                <span className="text-orange-400 font-bold">
                  {Math.round(battle.activeAngel.atFieldIntegrity)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{
                    width: `${Math.max(0, battle.activeAngel.atFieldIntegrity)}%`,
                  }}
                />
              </div>
            </div>

            {/* Expandable Lore info toggle */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowAngelInfo(!showAngelInfo)}
                className="text-[9px] text-neutral-400 hover:text-neutral-200 flex items-center justify-between w-full font-mono uppercase"
              >
                <span>Bio-Threat Spec</span>
                {showAngelInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showAngelInfo && (
                <div className="mt-1 text-[10px] text-amber-300/90 bg-amber-950/40 p-1.5 border border-amber-500/30 rounded space-y-1">
                  <div><strong>Trait:</strong> {battle.activeAngel.predatorTrait}</div>
                  <div className="text-[9px] text-neutral-400">{battle.activeAngel.description}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom-Center: Live NERV Feed Log */}
        <div className="absolute bottom-3 left-4 p-2 bg-black/80 border border-orange-500/30 rounded text-[10px] max-w-sm hidden md:block z-10">
          <div className="text-orange-400 font-bold mb-1">NERV TACTICAL LOG:</div>
          <div className="space-y-0.5 text-neutral-300">
            {battle.alerts.map((alert, idx) => (
              <div key={idx} className={idx === 0 ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>
                &gt; {alert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cockpit Command Center Bar */}
      <div className="w-full bg-neutral-950 border-t-2 border-orange-500/60 p-3 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Active Pilot Indicator & Pilot Mode Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Pilot Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black border border-neutral-700">
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              <div className="text-[11px] leading-none">
                <span className="text-[9px] text-neutral-400 font-mono block uppercase">ACTIVE CHILDREN</span>
                <span className="font-bold text-white font-mono">{activePilot.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 uppercase">MODE:</span>
              <div className="flex bg-neutral-900 border border-neutral-700 rounded p-0.5">
                <button
                  id="btn-pilot-auto-fly"
                  onClick={() => {
                    audio.playBeep(520);
                    setBattle((b) => ({ ...b, pilotMode: 'AUTO_FLY' }));
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    battle.pilotMode === 'AUTO_FLY'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Auto-Fly (Pure SNN)
                </button>

                <button
                  id="btn-pilot-bio-sync"
                  onClick={() => {
                    audio.playBeep(640);
                    setBattle((b) => ({ ...b, pilotMode: 'BIO_SYNC' }));
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    battle.pilotMode === 'BIO_SYNC'
                      ? 'bg-orange-500 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bio-Sync (Co-Pilot)
                </button>

                <button
                  id="btn-pilot-berserk"
                  onClick={() => {
                    audio.playEmergencyKlaxon();
                    connectome.injectOctopamine(50);
                    setBattle((b) => ({ ...b, pilotMode: 'BERSERK' }));
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    battle.pilotMode === 'BERSERK'
                      ? 'bg-purple-600 text-white font-bold animate-pulse'
                      : 'text-neutral-400 hover:text-purple-400'
                  }`}
                >
                  Mode-066 (Berserk)
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Positron Fire */}
            <button
              id="btn-fire-positron"
              onClick={firePositron}
              disabled={battle.evaEnergy < 10}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold text-xs uppercase rounded transition-all shadow-md shadow-cyan-600/30"
            >
              <Crosshair className="w-4 h-4" />
              <span>Fire Positron [Space]</span>
            </button>

            {/* Auto-Fire Toggle */}
            <button
              id="btn-toggle-autofire"
              onClick={() => setAutoFireEnabled((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 border text-xs uppercase rounded transition-colors ${
                autoFireEnabled
                  ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
              title="Toggle fly brain automatic targeting and firing"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Auto-Fire: {autoFireEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Octopamine Stimulus */}
            <button
              id="btn-inject-octopamine"
              onClick={injectOctopamine}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-500 text-purple-200 font-semibold text-xs uppercase rounded transition-colors"
              title="Inject insect adrenaline to raise spike frequencies"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Octopamine [E]</span>
            </button>

            {/* Sucrose Beacon Lure */}
            <button
              id="btn-toggle-sugar-lure"
              onClick={toggleSugarLure}
              className={`flex items-center gap-1.5 px-3 py-2 border text-xs uppercase rounded transition-colors ${
                battle.sugarLureActive
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-neutral-900 text-amber-300 border-amber-500/40 hover:bg-neutral-800'
              }`}
              title="Deploy sweet sucrose attractor to guide fly heading"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sugar Lure [S]</span>
            </button>

            {/* Light Strobe */}
            <button
              id="btn-toggle-light-strobe"
              onClick={toggleLightStrobe}
              className={`flex items-center gap-1.5 px-3 py-2 border text-xs uppercase rounded transition-colors ${
                battle.lightStrobeActive
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-neutral-900 text-emerald-300 border-emerald-500/40 hover:bg-neutral-800'
              }`}
              title="Disorient motion-sensitive EMDs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Strobe Optic</span>
            </button>
          </div>

          {/* Defeated Angels & Score */}
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block text-[10px]">ANGELS PURGED</span>
              <span className="font-bold text-red-400 text-sm font-teko tracking-wider">
                {battle.defeatedAngelsCount} / 4
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">TOTAL SCORE</span>
              <span className="font-bold text-orange-400 text-sm font-teko tracking-wider">
                {battle.score.toLocaleString()} PTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
