import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ActiveEnemy, ActiveMinion, LaneState, AltarInfo } from '../types';
import { sound } from '../audio/soundEngine';

export interface ArenaActionProps {
  rawFragments: number;
  refinedEssence: number;
  elementalRunes: number;
  catalyticRunes: number;
  heldChargedCell: 'weak' | 'medium' | 'strong' | 'overcharged' | null;
  activeChannelAction: string | null;
  channelProgress: number;
  greatGuardianCharge: number;
  greatGuardianHp: number;
  lanes: Record<'west' | 'north' | 'east', LaneState>;
  activeEnemies: ActiveEnemy[];
  activeMinions: ActiveMinion[];
  activeElementalAltar: AltarInfo;
  activeCatalyticAltar: AltarInfo;
  altarRotationSeconds: number;
  hugePortalActive: boolean;
  hugePortalSeconds: number;
  selectedTargetLane: 'west' | 'north' | 'east';
  onSelectLane: (lane: 'west' | 'north' | 'east') => void;
  onMine: () => void;
  onChisel: () => void;
  onEnterAltar: (category: 'elemental' | 'catalytic') => void;
  onInfuseGuardian: () => void;
  onRepairBarrier: (lane: 'west' | 'north' | 'east') => void;
  onZapEnemy: (uid: string) => void;
  onHugePortal: () => void;
}

interface ClickMarker {
  x: number;
  y: number;
  isInteract: boolean; // red for interact, yellow for ground
  time: number;
}

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  birth: number;
  duration: number;
}

interface LaserProjectile {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  birth: number;
  duration: number;
}

export const RiftArenaCanvas: React.FC<ArenaActionProps> = ({
  rawFragments,
  refinedEssence,
  elementalRunes,
  catalyticRunes,
  heldChargedCell,
  activeChannelAction,
  channelProgress,
  greatGuardianCharge,
  greatGuardianHp,
  lanes,
  activeEnemies,
  activeMinions,
  activeElementalAltar,
  activeCatalyticAltar,
  altarRotationSeconds,
  hugePortalActive,
  hugePortalSeconds,
  selectedTargetLane,
  onSelectLane,
  onMine,
  onChisel,
  onEnterAltar,
  onInfuseGuardian,
  onRepairBarrier,
  onZapEnemy,
  onHugePortal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in virtual coords (800 x 540)
  const playerPosRef = useRef<{ x: number; y: number; targetX: number; targetY: number; facing: number }>({
    x: 400,
    y: 320,
    targetX: 400,
    targetY: 320,
    facing: 0,
  });

  // Target interact task pending arrival
  const pendingInteractRef = useRef<{ type: 'mine' | 'chisel' | 'portal-elem' | 'portal-cata' | 'infuse' | 'gate-west' | 'gate-north' | 'gate-east' | 'huge-portal'; targetPos: { x: number; y: number } } | null>(null);

  // Click visual markers
  const clickMarkersRef = useRef<ClickMarker[]>([]);
  // Floating damage / feedback texts
  const floatingTextsRef = useRef<FloatingText[]>([]);
  // Visual turret/zap projectiles
  const projectilesRef = useRef<LaserProjectile[]>([]);

  // Hovered target
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  // Add floating text
  const addFloatingText = useCallback((x: number, y: number, text: string, color: string = '#fef08a') => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      birth: Date.now(),
      duration: 1200,
    });
  }, []);

  // Add click marker
  const addClickMarker = useCallback((x: number, y: number, isInteract: boolean) => {
    clickMarkersRef.current.push({
      x,
      y,
      isInteract,
      time: Date.now(),
    });
    sound.playClickSfx();
  }, []);

  // Virtual Coordinate dimensions
  const V_WIDTH = 800;
  const V_HEIGHT = 540;

  // Station Coordinates
  const STATIONS = {
    guardian: { x: 400, y: 240, radius: 55, name: 'The Great Guardian' },
    quarry: { x: 130, y: 440, radius: 48, name: 'Essence Quarry' },
    chisel: { x: 380, y: 460, radius: 42, name: 'Chisel Bench' },
    portalElem: { x: 610, y: 440, radius: 36, name: 'Elemental Portal' },
    portalCata: { x: 710, y: 440, radius: 36, name: 'Catalytic Portal' },
    gateWest: { x: 160, y: 240, radius: 36, name: 'West Gate Barrier' },
    gateNorth: { x: 400, y: 110, radius: 36, name: 'North Gate Barrier' },
    gateEast: { x: 640, y: 240, radius: 36, name: 'East Gate Barrier' },
    hugePortal: { x: 260, y: 390, radius: 40, name: 'Huge Essence Portal' },
  };

  // Convert enemy distance percentage into physical causeway coordinates
  const getEnemyCoords = (lane: 'west' | 'north' | 'east', distancePct: number) => {
    // distancePct is 100 (at breach) down to 0 (at guardian)
    const factor = distancePct / 100;
    if (lane === 'west') {
      // From x=30 (breach) to x=360 (near guardian)
      const x = 360 - factor * (360 - 30);
      return { x, y: 240 };
    }
    if (lane === 'north') {
      // From y=20 (breach) to y=200 (near guardian)
      const y = 200 - factor * (200 - 20);
      return { x: 400, y };
    }
    // east
    // From x=770 (breach) to x=440 (near guardian)
    const x = 440 + factor * (770 - 440);
    return { x, y: 240 };
  };

  // Trigger floating texts on action changes
  const prevActionRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeChannelAction && activeChannelAction !== prevActionRef.current) {
      if (activeChannelAction === 'mining') {
        addFloatingText(STATIONS.quarry.x, STATIONS.quarry.y - 30, '+ Mining Fragments', '#fbbf24');
      } else if (activeChannelAction === 'chiseling') {
        addFloatingText(STATIONS.chisel.x, STATIONS.chisel.y - 30, '+ Chiseling Essence', '#34d399');
      }
    }
    prevActionRef.current = activeChannelAction;
  }, [activeChannelAction, addFloatingText]);

  // Handle canvas click / interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = V_WIDTH / rect.width;
    const scaleY = V_HEIGHT / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // 1. Check if an Enemy was clicked (Apprentice Zap)
    for (const enemy of activeEnemies) {
      const ePos = getEnemyCoords(enemy.lane, enemy.distanceToGuardian);
      const dist = Math.hypot(clickX - ePos.x, clickY - ePos.y);
      if (dist < 26) {
        addClickMarker(ePos.x, ePos.y, true);
        projectilesRef.current.push({
          fromX: playerPosRef.current.x,
          fromY: playerPosRef.current.y,
          toX: ePos.x,
          toY: ePos.y,
          color: '#fbbf24',
          birth: Date.now(),
          duration: 250,
        });
        addFloatingText(ePos.x, ePos.y - 20, '-25 HP', '#ef4444');
        onZapEnemy(enemy.uid);
        return;
      }
    }

    // 2. Check if Huge Portal was clicked
    if (hugePortalActive) {
      const dist = Math.hypot(clickX - STATIONS.hugePortal.x, clickY - STATIONS.hugePortal.y);
      if (dist < STATIONS.hugePortal.radius) {
        addClickMarker(STATIONS.hugePortal.x, STATIONS.hugePortal.y, true);
        playerPosRef.current.targetX = STATIONS.hugePortal.x;
        playerPosRef.current.targetY = STATIONS.hugePortal.y;
        pendingInteractRef.current = { type: 'huge-portal', targetPos: STATIONS.hugePortal };
        return;
      }
    }

    // 3. Check Quarry
    const quarryDist = Math.hypot(clickX - STATIONS.quarry.x, clickY - STATIONS.quarry.y);
    if (quarryDist < STATIONS.quarry.radius) {
      addClickMarker(STATIONS.quarry.x, STATIONS.quarry.y, true);
      playerPosRef.current.targetX = STATIONS.quarry.x + 30;
      playerPosRef.current.targetY = STATIONS.quarry.y - 20;
      pendingInteractRef.current = { type: 'mine', targetPos: STATIONS.quarry };
      return;
    }

    // 4. Check Chisel Bench
    const chiselDist = Math.hypot(clickX - STATIONS.chisel.x, clickY - STATIONS.chisel.y);
    if (chiselDist < STATIONS.chisel.radius) {
      addClickMarker(STATIONS.chisel.x, STATIONS.chisel.y, true);
      playerPosRef.current.targetX = STATIONS.chisel.x;
      playerPosRef.current.targetY = STATIONS.chisel.y - 30;
      pendingInteractRef.current = { type: 'chisel', targetPos: STATIONS.chisel };
      return;
    }

    // 5. Check Elemental Portal
    const elemDist = Math.hypot(clickX - STATIONS.portalElem.x, clickY - STATIONS.portalElem.y);
    if (elemDist < STATIONS.portalElem.radius) {
      addClickMarker(STATIONS.portalElem.x, STATIONS.portalElem.y, true);
      playerPosRef.current.targetX = STATIONS.portalElem.x;
      playerPosRef.current.targetY = STATIONS.portalElem.y - 20;
      pendingInteractRef.current = { type: 'portal-elem', targetPos: STATIONS.portalElem };
      return;
    }

    // 6. Check Catalytic Portal
    const cataDist = Math.hypot(clickX - STATIONS.portalCata.x, clickY - STATIONS.portalCata.y);
    if (cataDist < STATIONS.portalCata.radius) {
      addClickMarker(STATIONS.portalCata.x, STATIONS.portalCata.y, true);
      playerPosRef.current.targetX = STATIONS.portalCata.x;
      playerPosRef.current.targetY = STATIONS.portalCata.y - 20;
      pendingInteractRef.current = { type: 'portal-cata', targetPos: STATIONS.portalCata };
      return;
    }

    // 7. Check The Great Guardian (Infuse Core)
    const guardianDist = Math.hypot(clickX - STATIONS.guardian.x, clickY - STATIONS.guardian.y);
    if (guardianDist < STATIONS.guardian.radius + 15) {
      addClickMarker(STATIONS.guardian.x, STATIONS.guardian.y + 40, true);
      playerPosRef.current.targetX = STATIONS.guardian.x;
      playerPosRef.current.targetY = STATIONS.guardian.y + 45;
      pendingInteractRef.current = { type: 'infuse', targetPos: STATIONS.guardian };
      return;
    }

    // 8. Check Gates (Socket Cell or Target Lane)
    const gates = [
      { key: 'west' as const, pos: STATIONS.gateWest, action: 'gate-west' as const },
      { key: 'north' as const, pos: STATIONS.gateNorth, action: 'gate-north' as const },
      { key: 'east' as const, pos: STATIONS.gateEast, action: 'gate-east' as const },
    ];
    for (const g of gates) {
      const gDist = Math.hypot(clickX - g.pos.x, clickY - g.pos.y);
      if (gDist < g.pos.radius + 15) {
        onSelectLane(g.key);
        addClickMarker(g.pos.x, g.pos.y, true);
        playerPosRef.current.targetX = g.pos.x + (g.key === 'west' ? 30 : g.key === 'east' ? -30 : 0);
        playerPosRef.current.targetY = g.pos.y + (g.key === 'north' ? 35 : 0);
        pendingInteractRef.current = { type: g.action, targetPos: g.pos };
        return;
      }
    }

    // 9. Otherwise, standard ground click to walk!
    addClickMarker(clickX, clickY, false);
    playerPosRef.current.targetX = Math.max(40, Math.min(V_WIDTH - 40, clickX));
    playerPosRef.current.targetY = Math.max(60, Math.min(V_HEIGHT - 40, clickY));
    pendingInteractRef.current = null;
  };

  // Mouse Move / Hover Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = V_WIDTH / rect.width;
    const scaleY = V_HEIGHT / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    // Check enemies
    for (const enemy of activeEnemies) {
      const ePos = getEnemyCoords(enemy.lane, enemy.distanceToGuardian);
      if (Math.hypot(mx - ePos.x, my - ePos.y) < 24) {
        setHoveredStation(`Abyssal: ${enemy.name} (Click to Zap!)`);
        return;
      }
    }
    // Check stations
    if (Math.hypot(mx - STATIONS.quarry.x, my - STATIONS.quarry.y) < STATIONS.quarry.radius) {
      setHoveredStation('Guardian Quarry (Click to Mine Fragments)');
      return;
    }
    if (Math.hypot(mx - STATIONS.chisel.x, my - STATIONS.chisel.y) < STATIONS.chisel.radius) {
      setHoveredStation('Chisel Workbench (Click to Chisel Essence)');
      return;
    }
    if (Math.hypot(mx - STATIONS.portalElem.x, my - STATIONS.portalElem.y) < STATIONS.portalElem.radius) {
      setHoveredStation(`Elemental Portal: ${activeElementalAltar.name} (Craft Runes & Charge Cell)`);
      return;
    }
    if (Math.hypot(mx - STATIONS.portalCata.x, my - STATIONS.portalCata.y) < STATIONS.portalCata.radius) {
      setHoveredStation(`Catalytic Portal: ${activeCatalyticAltar.name} (Craft Runes & Charge Cell)`);
      return;
    }
    if (Math.hypot(mx - STATIONS.guardian.x, my - STATIONS.guardian.y) < STATIONS.guardian.radius + 15) {
      setHoveredStation('The Great Guardian (Click to Infuse Runes & Power Core)');
      return;
    }
    if (Math.hypot(mx - STATIONS.gateWest.x, my - STATIONS.gateWest.y) < STATIONS.gateWest.radius) {
      setHoveredStation('West Gate Barrier (Click to Select / Socket Power Cell)');
      return;
    }
    if (Math.hypot(mx - STATIONS.gateNorth.x, my - STATIONS.gateNorth.y) < STATIONS.gateNorth.radius) {
      setHoveredStation('North Gate Barrier (Click to Select / Socket Power Cell)');
      return;
    }
    if (Math.hypot(mx - STATIONS.gateEast.x, my - STATIONS.gateEast.y) < STATIONS.gateEast.radius) {
      setHoveredStation('East Gate Barrier (Click to Select / Socket Power Cell)');
      return;
    }
    if (hugePortalActive && Math.hypot(mx - STATIONS.hugePortal.x, my - STATIONS.hugePortal.y) < STATIONS.hugePortal.radius) {
      setHoveredStation('Great Essence Portal (Instant Motherlode!)');
      return;
    }
    setHoveredStation(null);
  };

  // 60FPS Game Render Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Update Player Movement
      const player = playerPosRef.current;
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;
      const dist = Math.hypot(dx, dy);
      const speed = 240; // px/sec

      if (dist > 3) {
        const moveDist = Math.min(dist, speed * dt);
        player.x += (dx / dist) * moveDist;
        player.y += (dy / dist) * moveDist;
        player.facing = Math.atan2(dy, dx);
      } else {
        // Player reached target, check if pending interact is ready
        if (pendingInteractRef.current) {
          const task = pendingInteractRef.current;
          pendingInteractRef.current = null;
          if (task.type === 'mine') onMine();
          else if (task.type === 'chisel') onChisel();
          else if (task.type === 'portal-elem') onEnterAltar('elemental');
          else if (task.type === 'portal-cata') onEnterAltar('catalytic');
          else if (task.type === 'infuse') onInfuseGuardian();
          else if (task.type === 'gate-west') onRepairBarrier('west');
          else if (task.type === 'gate-north') onRepairBarrier('north');
          else if (task.type === 'gate-east') onRepairBarrier('east');
          else if (task.type === 'huge-portal') onHugePortal();
        }
      }

      // ----------------------------------------------------
      // DRAW BACKGROUND & SANCTUM ARENA
      // ----------------------------------------------------
      ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      // Deep obsidian floor
      ctx.fillStyle = '#0f1015';
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Stone tile grid lines
      ctx.strokeStyle = 'rgba(40, 44, 55, 0.4)';
      ctx.lineWidth = 1;
      const tileSize = 40;
      for (let x = 0; x < V_WIDTH; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, V_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < V_HEIGHT; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(V_WIDTH, y);
        ctx.stroke();
      }

      // 3 Causeway Stone Roads leading outward to breaches
      // West road (x=30 to x=360, y=240, height=50)
      const gradW = ctx.createLinearGradient(30, 240, 360, 240);
      gradW.addColorStop(0, 'rgba(88, 28, 135, 0.25)'); // purple abyssal tint
      gradW.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
      ctx.fillStyle = gradW;
      ctx.fillRect(30, 215, 330, 50);

      // North road (x=400, y=20 to y=200, width=50)
      const gradN = ctx.createLinearGradient(400, 20, 400, 200);
      gradN.addColorStop(0, 'rgba(88, 28, 135, 0.25)');
      gradN.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
      ctx.fillStyle = gradN;
      ctx.fillRect(375, 20, 50, 180);

      // East road (x=440 to x=770, y=240, height=50)
      const gradE = ctx.createLinearGradient(770, 240, 440, 240);
      gradE.addColorStop(0, 'rgba(88, 28, 135, 0.25)');
      gradE.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
      ctx.fillStyle = gradE;
      ctx.fillRect(440, 215, 330, 50);

      // Abyssal Rifts at the edge of causeways
      const rifts = [
        { x: 30, y: 240, label: 'West Maw' },
        { x: 400, y: 20, label: 'North Maw' },
        { x: 770, y: 240, label: 'East Maw' },
      ];
      rifts.forEach((r) => {
        ctx.save();
        const pulse = 18 + Math.sin(now / 200) * 3;
        ctx.fillStyle = 'rgba(147, 51, 234, 0.25)';
        ctx.beginPath();
        ctx.arc(r.x, r.y, pulse + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.arc(r.x, r.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(r.x, r.y, pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ----------------------------------------------------
      // DRAW 3 GATE BARRIERS & ARCANE TURRETS
      // ----------------------------------------------------
      const gatesList = [
        { key: 'west' as const, x: STATIONS.gateWest.x, y: STATIONS.gateWest.y, isVert: true },
        { key: 'north' as const, x: STATIONS.gateNorth.x, y: STATIONS.gateNorth.y, isVert: false },
        { key: 'east' as const, x: STATIONS.gateEast.x, y: STATIONS.gateEast.y, isVert: true },
      ];

      gatesList.forEach((g) => {
        const lane = lanes[g.key];
        const isSelected = selectedTargetLane === g.key;
        const barrierPct = lane.barrierHp / lane.maxBarrierHp;

        ctx.save();
        // Barrier shield glow
        if (lane.barrierHp > 0) {
          ctx.strokeStyle = barrierPct > 0.4 ? 'rgba(34, 211, 238, 0.85)' : 'rgba(239, 68, 68, 0.85)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          if (g.isVert) {
            ctx.moveTo(g.x, g.y - 28);
            ctx.lineTo(g.x, g.y + 28);
          } else {
            ctx.moveTo(g.x - 28, g.y);
            ctx.lineTo(g.x + 28, g.y);
          }
          ctx.stroke();

          // Shield shimmering line
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Broken barrier sparks
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          if (g.isVert) {
            ctx.moveTo(g.x, g.y - 28);
            ctx.lineTo(g.x, g.y + 28);
          } else {
            ctx.moveTo(g.x - 28, g.y);
            ctx.lineTo(g.x + 28, g.y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Stone Barrier Pylons
        const pylonOffsets = g.isVert ? [{ dx: 0, dy: -32 }, { dx: 0, dy: 32 }] : [{ dx: -32, dy: 0 }, { dx: 32, dy: 0 }];
        pylonOffsets.forEach((p) => {
          ctx.fillStyle = isSelected ? '#f59e0b' : '#334155';
          ctx.beginPath();
          ctx.arc(g.x + p.dx, g.y + p.dy, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Arcane Turret Crystal on top pylon
        const turretPos = { x: g.x + pylonOffsets[0].dx, y: g.y + pylonOffsets[0].dy };
        const crystalPulse = Math.sin(now / 150) * 1.5;
        ctx.fillStyle = lane.turretCharge > 0 ? '#fbbf24' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(turretPos.x, turretPos.y, 5 + crystalPulse, 0, Math.PI * 2);
        ctx.fill();

        // Gate Name and HP overlay text
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        const labelY = g.isVert ? g.y + 44 : g.y - 14;
        ctx.fillText(`${lane.name.split(' ')[0]}: ${Math.ceil(lane.barrierHp)} HP`, g.x, labelY);

        ctx.restore();
      });

      // ----------------------------------------------------
      // DRAW THE GREAT GUARDIAN DAIS (CENTER)
      // ----------------------------------------------------
      const cx = STATIONS.guardian.x;
      const cy = STATIONS.guardian.y;

      ctx.save();
      // Outer runic stone ring
      ctx.fillStyle = '#1e1b2e';
      ctx.beginPath();
      ctx.arc(cx, cy, 62, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pulsing Celestial energy rings
      const pulseRing = (now / 30) % 45;
      ctx.strokeStyle = `rgba(245, 158, 11, ${1 - pulseRing / 45})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 20 + pulseRing, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Dais
      ctx.fillStyle = '#2e1065';
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();

      // Great Guardian Golem Body (Stylized Rune Colossus)
      ctx.fillStyle = '#e0e7ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4338ca';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Core Eye / Heart
      const eyeGlow = 8 + Math.sin(now / 120) * 3;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, eyeGlow, 0, Math.PI * 2);
      ctx.fill();

      // Guardian Power Progress Ring
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (greatGuardianCharge / 100)));
      ctx.stroke();

      // Overhead Text: Great Guardian Name & Power %
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('The Great Guardian', cx, cy - 42);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${greatGuardianCharge.toFixed(1)}% Core Power`, cx, cy - 28);

      ctx.restore();

      // ----------------------------------------------------
      // DRAW STATIONS (QUARRY, CHISEL, PORTALS)
      // ----------------------------------------------------
      // 1. Guardian Quarry (South-West)
      const qx = STATIONS.quarry.x;
      const qy = STATIONS.quarry.y;
      ctx.save();
      // Bedrock Mound
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.ellipse(qx, qy, 46, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Essence Crystals
      const crystalColors = ['#38bdf8', '#fbbf24', '#c084fc'];
      [
        { dx: -18, dy: -8, size: 14, col: crystalColors[0] },
        { dx: 0, dy: -16, size: 18, col: crystalColors[1] },
        { dx: 18, dy: -4, size: 12, col: crystalColors[2] },
        { dx: -6, dy: 6, size: 15, col: crystalColors[0] },
      ].forEach((c) => {
        ctx.fillStyle = c.col;
        ctx.beginPath();
        ctx.moveTo(qx + c.dx, qy + c.dy - c.size);
        ctx.lineTo(qx + c.dx + c.size * 0.6, qy + c.dy);
        ctx.lineTo(qx + c.dx, qy + c.dy + c.size * 0.5);
        ctx.lineTo(qx + c.dx - c.size * 0.6, qy + c.dy);
        ctx.closePath();
        ctx.fill();
      });

      // Quarry Label
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛏️ Guardian Quarry', qx, qy + 32);
      ctx.fillStyle = '#a8a29e';
      ctx.font = '10px monospace';
      ctx.fillText(`${rawFragments} fragments`, qx, qy + 44);
      ctx.restore();

      // 2. Chisel Bench (South-Center)
      const bx = STATIONS.chisel.x;
      const by = STATIONS.chisel.y;
      ctx.save();
      // Stone Table
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(bx - 32, by - 16, 64, 32);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 32, by - 16, 64, 32);

      // Chisel tools & essence blocks on table
      ctx.fillStyle = '#10b981';
      ctx.fillRect(bx - 18, by - 8, 12, 12);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(bx - 2, by - 6, 14, 12);

      // Label
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔨 Chisel Bench', bx, by + 30);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '10px monospace';
      ctx.fillText(`${refinedEssence} essence`, bx, by + 42);
      ctx.restore();

      // 3. Altar Portals (South-East)
      // Elemental Portal
      const pEx = STATIONS.portalElem.x;
      const pEy = STATIONS.portalElem.y;
      ctx.save();
      const elemSpin = (now / 400) % (Math.PI * 2);
      ctx.translate(pEx, pEy);
      ctx.rotate(elemSpin);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🌀 ${activeElementalAltar.name} Portal`, pEx, pEy + 28);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${Math.ceil(altarRotationSeconds)}s`, pEx, pEy + 38);

      // Catalytic Portal
      const pCx = STATIONS.portalCata.x;
      const pCy = STATIONS.portalCata.y;
      ctx.save();
      const cataSpin = (-now / 400) % (Math.PI * 2);
      ctx.translate(pCx, pCy);
      ctx.rotate(cataSpin);
      ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🌀 ${activeCatalyticAltar.name} Portal`, pCx, pCy + 28);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${Math.ceil(altarRotationSeconds)}s`, pCx, pCy + 38);

      // 4. Huge Portal if Active
      if (hugePortalActive) {
        const hx = STATIONS.hugePortal.x;
        const hy = STATIONS.hugePortal.y;
        ctx.save();
        const hugeSpin = (now / 200) % (Math.PI * 2);
        ctx.translate(hx, hy);
        ctx.rotate(hugeSpin);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ HUGE PORTAL (${Math.ceil(hugePortalSeconds)}s)`, hx, hy + 30);
      }

      // ----------------------------------------------------
      // DRAW STATIONED MINIONS
      // ----------------------------------------------------
      activeMinions.forEach((m, idx) => {
        let mx = 400;
        let my = 240;
        if (m.lane === 'west') {
          mx = STATIONS.gateWest.x + 16;
          my = STATIONS.gateWest.y - 12 + idx * 24;
        } else if (m.lane === 'north') {
          mx = STATIONS.gateNorth.x - 12 + idx * 24;
          my = STATIONS.gateNorth.y + 16;
        } else if (m.lane === 'east') {
          mx = STATIONS.gateEast.x - 16;
          my = STATIONS.gateEast.y - 12 + idx * 24;
        }

        ctx.save();
        // Minion body (Stone Golem with emerald runes)
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fill();

        // Minion name
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.name.split(' ')[0], mx, my - 12);
        ctx.restore();
      });

      // ----------------------------------------------------
      // DRAW ADVANCING ENEMIES
      // ----------------------------------------------------
      activeEnemies.forEach((enemy) => {
        const pos = getEnemyCoords(enemy.lane, enemy.distanceToGuardian);
        ctx.save();

        // Danger aura if close
        if (enemy.distanceToGuardian <= 25) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        // Monster sprite (Abyssal Fiend)
        ctx.fillStyle = '#831843'; // deep abyssal red
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(pos.x - 3, pos.y - 2, 2, 0, Math.PI * 2);
        ctx.arc(pos.x + 3, pos.y - 2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Health Bar above monster
        const hpPct = enemy.hp / enemy.maxHp;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(pos.x - 14, pos.y - 18, 28, 4);
        ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : '#ef4444';
        ctx.fillRect(pos.x - 14, pos.y - 18, 28 * hpPct, 4);

        // Monster Name
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.name.split(' ')[0], pos.x, pos.y + 18);

        ctx.restore();
      });

      // ----------------------------------------------------
      // DRAW PROJECTILES & ZAP BOLTS
      // ----------------------------------------------------
      projectilesRef.current = projectilesRef.current.filter((p) => {
        const age = now - p.birth;
        if (age >= p.duration) return false;
        const progress = age / p.duration;

        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.fromX, p.fromY);
        const currX = p.fromX + (p.toX - p.fromX) * progress;
        const currY = p.fromY + (p.toY - p.fromY) * progress;
        ctx.lineTo(currX, currY);
        ctx.stroke();

        // Head spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currX, currY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // ----------------------------------------------------
      // DRAW PLAYER CHARACTER (APPRENTICE WIZARD)
      // ----------------------------------------------------
      ctx.save();
      const px = player.x;
      const py = player.y;

      // Shadow under feet
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(px, py + 8, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Walking bounce
      const isMoving = dist > 3;
      const walkBob = isMoving ? Math.sin(now / 100) * 2 : 0;

      // Robes Body
      ctx.fillStyle = '#3b82f6'; // Mystic blue apprentice robes
      ctx.beginPath();
      ctx.arc(px, py - 4 + walkBob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Wizard Hat
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(px - 9, py - 6 + walkBob);
      ctx.lineTo(px, py - 20 + walkBob);
      ctx.lineTo(px + 9, py - 6 + walkBob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 7, py - 7 + walkBob, 14, 2); // gold hat band

      // Staff with glowing orb
      const staffX = px + Math.cos(player.facing + 1.2) * 14;
      const staffY = py + Math.sin(player.facing + 1.2) * 14 + walkBob;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px, py + walkBob);
      ctx.lineTo(staffX, staffY - 6);
      ctx.stroke();

      // Orb on staff
      ctx.fillStyle = heldChargedCell ? '#22d3ee' : '#e0e7ff';
      ctx.beginPath();
      ctx.arc(staffX, staffY - 8, 5, 0, Math.PI * 2);
      ctx.fill();

      // Held Cell Aura above player if carrying one
      if (heldChargedCell) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ ${heldChargedCell.toUpperCase()} CELL`, px, py - 26 + walkBob);
      }

      // Action Progress Bar above head if channeling
      if (activeChannelAction) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(px - 20, py - 38 + walkBob, 40, 6);
        ctx.fillStyle = activeChannelAction === 'mining' ? '#fbbf24' : '#10b981';
        ctx.fillRect(px - 20, py - 38 + walkBob, 40 * (channelProgress / 100), 6);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeChannelAction === 'mining' ? 'Mining...' : 'Chiseling...', px, py - 42 + walkBob);
      }

      ctx.restore();

      // ----------------------------------------------------
      // DRAW CLICK MARKERS (OSRS STYLE X)
      // ----------------------------------------------------
      clickMarkersRef.current = clickMarkersRef.current.filter((m) => {
        const age = now - m.time;
        if (age > 450) return false;
        const alpha = 1 - age / 450;
        const size = 7 + (age / 450) * 4;

        ctx.save();
        ctx.strokeStyle = m.isInteract ? `rgba(239, 68, 68, ${alpha})` : `rgba(234, 179, 8, ${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(m.x - size, m.y - size);
        ctx.lineTo(m.x + size, m.y + size);
        ctx.moveTo(m.x + size, m.y - size);
        ctx.lineTo(m.x - size, m.y + size);
        ctx.stroke();
        ctx.restore();
        return true;
      });

      // ----------------------------------------------------
      // DRAW FLOATING TEXTS (DAMAGE / NOTIFICATIONS)
      // ----------------------------------------------------
      floatingTextsRef.current = floatingTextsRef.current.filter((f) => {
        const age = now - f.birth;
        if (age > f.duration) return false;
        const progress = age / f.duration;
        const yOffset = progress * 35;
        const alpha = 1 - progress;

        ctx.save();
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = f.color;
        ctx.globalAlpha = alpha;
        ctx.fillText(f.text, f.x, f.y - yOffset);
        ctx.restore();
        return true;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    activeEnemies,
    activeMinions,
    lanes,
    greatGuardianCharge,
    rawFragments,
    refinedEssence,
    heldChargedCell,
    activeChannelAction,
    channelProgress,
    activeElementalAltar,
    activeCatalyticAltar,
    altarRotationSeconds,
    hugePortalActive,
    hugePortalSeconds,
    selectedTargetLane,
    onMine,
    onChisel,
    onEnterAltar,
    onInfuseGuardian,
    onRepairBarrier,
    onHugePortal,
  ]);

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-stone-800 bg-stone-950 shadow-2xl select-none">
      {/* 2D HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={V_WIDTH}
        height={V_HEIGHT}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[560px] cursor-crosshair block"
      />

      {/* Dynamic Hover Tooltip / Action Guide Bar */}
      <div className="absolute bottom-2 left-3 right-3 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-stone-200 shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold text-amber-300">
            {hoveredStation || 'Click anywhere to walk, or click stations/enemies to interact!'}
          </span>
        </div>
        <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
          Tip: Click approaching monsters to Zap with Apprentice Bolts (-25 HP)
        </span>
      </div>
    </div>
  );
};
