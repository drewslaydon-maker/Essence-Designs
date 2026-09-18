import React, { useRef, useEffect, useCallback } from 'react';
import { PlayerStats, Realm, Position, Direction, MapEntity, WorldFlags } from '../types';
import { MAPS } from '../engine/Maps';

interface GameCanvasProps {
  currentMapId: string;
  realm: Realm;
  playerPos: Position;
  playerDir: Direction;
  isMoving: boolean;
  worldFlags: WorldFlags;
  stats: PlayerStats;
  nearbyEntity: MapEntity | null;
  onCanvasClickMove?: (target: Position) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentMapId,
  realm,
  playerPos,
  playerDir,
  isMoving,
  worldFlags,
  stats,
  nearbyEntity,
  onCanvasClickMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Smooth visual player position interpolation
  const renderPlayerPosRef = useRef<{ x: number; y: number }>({ x: playerPos.x, y: playerPos.y });
  // Smooth camera tracking coordinates
  const cameraRef = useRef<{ x: number; y: number }>({ x: playerPos.x, y: playerPos.y });
  const prevMapIdRef = useRef<string>(currentMapId);

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.025;
    const time = timeRef.current;

    const map = MAPS[currentMapId];
    if (!map) return;

    const TILE_SIZE = 48; // Size of each tile in pixels
    const width = canvas.width;
    const height = canvas.height;

    // Reset coordinates instantly if map changed or large teleport (> 4 tiles)
    const mapChanged = prevMapIdRef.current !== currentMapId;
    if (mapChanged) {
      prevMapIdRef.current = currentMapId;
      renderPlayerPosRef.current = { x: playerPos.x, y: playerPos.y };
      cameraRef.current = { x: playerPos.x, y: playerPos.y };
    }

    const distToTarget = Math.hypot(
      playerPos.x - renderPlayerPosRef.current.x,
      playerPos.y - renderPlayerPosRef.current.y
    );

    if (distToTarget > 4) {
      renderPlayerPosRef.current = { x: playerPos.x, y: playerPos.y };
    } else if (distToTarget > 0.005) {
      // Smooth lerp: moves across 1 tile in ~130ms at 60fps
      renderPlayerPosRef.current.x += (playerPos.x - renderPlayerPosRef.current.x) * 0.26;
      renderPlayerPosRef.current.y += (playerPos.y - renderPlayerPosRef.current.y) * 0.26;
    } else {
      renderPlayerPosRef.current.x = playerPos.x;
      renderPlayerPosRef.current.y = playerPos.y;
    }

    // Smooth camera interpolation towards visual player position
    cameraRef.current.x += (renderPlayerPosRef.current.x - cameraRef.current.x) * 0.16;
    cameraRef.current.y += (renderPlayerPosRef.current.y - cameraRef.current.y) * 0.16;

    const camX = cameraRef.current.x * TILE_SIZE - width / 2 + TILE_SIZE / 2;
    const camY = cameraRef.current.y * TILE_SIZE - height / 2 + TILE_SIZE / 2;

    // Clear canvas
    ctx.fillStyle = realm === 'interstice' ? '#0f0c1b' : '#181b20';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(-Math.floor(camX), -Math.floor(camY));

    // Visible tile boundaries
    const startCol = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
    const endCol = Math.min(map.width - 1, Math.ceil((camX + width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
    const endRow = Math.min(map.height - 1, Math.ceil((camY + height) / TILE_SIZE) + 1);

    const tiles = realm === 'physical' ? map.physicalTiles : map.intersticeTiles;

    // 1. Draw Ground & Obstacle Tiles
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const tileType = tiles[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        if (realm === 'interstice') {
          // Interstice background grid effect
          ctx.fillStyle = (x + y) % 2 === 0 ? '#19132e' : '#21183c';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        } else {
          // Physical background
          if (tileType === 0) {
            // Grass
            ctx.fillStyle = (x + y) % 2 === 0 ? '#2d472c' : '#345233';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          } else if (tileType === 2) {
            // Cobblestone / Dungeon Floor
            ctx.fillStyle = (x + y) % 2 === 0 ? '#38404a' : '#333b44';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#272d34';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          }
        }

        // Specific Tile Graphics
        if (tileType === 1) {
          // Hamlet Stone Wall
          ctx.fillStyle = '#475569';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#334155';
          ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        } else if (tileType === 6) {
          // Dungeon Solid Crypt Wall
          ctx.fillStyle = realm === 'interstice' ? '#2e1c45' : '#1e293b';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = realm === 'interstice' ? '#442b66' : '#0f172a';
          ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
        } else if (tileType === 3) {
          // Abyss / Deep Water
          if (realm === 'interstice') {
            ctx.fillStyle = '#0a0814';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            // Floating void stars
            ctx.fillStyle = '#a855f7';
            const starOffset = (Math.sin(time + x * 3 + y * 5) * 0.5 + 0.5) * 8;
            ctx.fillRect(px + 12 + starOffset, py + 12, 3, 3);
          } else {
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#2563eb';
            const ripple = Math.sin(time * 3 + x + y) * 2;
            ctx.fillRect(px + 6, py + 18 + ripple, 20, 2);
          }
        } else if (tileType === 4) {
          // Spectral Interstice Bridge (glowing translucent violet)
          ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        } else if (tileType === 5) {
          // Physical Rubble (solid in physical, phased through in interstice)
          if (realm === 'physical') {
            ctx.fillStyle = '#78716c';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#57534e';
            ctx.beginPath();
            ctx.arc(px + 16, py + 24, 10, 0, Math.PI * 2);
            ctx.arc(px + 32, py + 28, 12, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Translucent ghost silhouette
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            ctx.setLineDash([]);
          }
        } else if (tileType === 7) {
          // Grand Altar / Throne Tile
          ctx.fillStyle = realm === 'interstice' ? '#581c87' : '#450a0a';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }
    }

    // 2. Draw Interactive Map Entities
    for (const entity of map.entities) {
      // Check realm visibility
      if (entity.realmVisibility === 'physical_only' && realm !== 'physical') continue;
      if (entity.realmVisibility === 'interstice_only' && realm !== 'interstice') continue;

      const ex = entity.x * TILE_SIZE;
      const ey = entity.y * TILE_SIZE;

      ctx.save();
      ctx.translate(ex, ey);

      if (entity.type === 'npc') {
        // NPC avatar
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2 - 4, 14, 0, Math.PI * 2);
        ctx.fill();

        // NPC Robe
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(TILE_SIZE / 2 - 10, TILE_SIZE / 2 + 4, 20, 16);

        // Speech indicator
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2 - 24, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (entity.type === 'chest') {
        // Treasure Chest
        const isOpen = worldFlags.openedChests[entity.id] || entity.isOpen;
        ctx.fillStyle = isOpen ? '#713f12' : '#b45309';
        ctx.fillRect(8, 14, TILE_SIZE - 16, TILE_SIZE - 24);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(8, 22, TILE_SIZE - 16, 4);

        if (!isOpen) {
          // Golden sparkle
          ctx.fillStyle = '#fde047';
          const sparkle = (Math.sin(time * 4) + 1) * 2;
          ctx.fillRect(TILE_SIZE / 2 - 1, 10 - sparkle, 3, 3);
        }
      } else if (entity.type === 'switch') {
        // Pressure switch plate
        const isDown = worldFlags.switchesActivated[entity.id] || entity.isTriggered;
        ctx.fillStyle = isDown ? '#06b6d4' : '#64748b';
        ctx.fillRect(10, 10, TILE_SIZE - 20, TILE_SIZE - 20);

        ctx.strokeStyle = isDown ? '#22d3ee' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(12, 12, TILE_SIZE - 24, TILE_SIZE - 24);
      } else if (entity.type === 'door') {
        // Dungeon Door / Gate
        const isOpen = worldFlags.catacombsUnlocked || entity.isOpen;
        if (isOpen) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8);
        } else {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8);
          // Keyhole / Lock
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (entity.type === 'portal') {
        // Portal / Staircase
        ctx.fillStyle = '#312e81';
        ctx.beginPath();
        ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const portalAngle = time * 3;
        ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2, 16, portalAngle, portalAngle + Math.PI * 1.5);
        ctx.stroke();
      } else if (entity.type === 'enemy') {
        // Roaming enemy or Boss
        if (worldFlags.defeatedEnemies[entity.id]) {
          ctx.restore();
          continue;
        }

        const hoverY = Math.sin(time * 3 + entity.x) * 4;

        if (entity.isBoss) {
          // Commander Malakar
          ctx.fillStyle = '#e11d48';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2 - 4 + hoverY, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Greatsword blade outline
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(TILE_SIZE / 2 + 16, TILE_SIZE / 2 - 18 + hoverY);
          ctx.lineTo(TILE_SIZE / 2 + 24, TILE_SIZE / 2 + 20 + hoverY);
          ctx.stroke();
        } else {
          // Standard roaming Shade/Sentry
          ctx.fillStyle = entity.enemyType === 'weaver' ? '#10b981' : '#8b5cf6';
          ctx.beginPath();
          ctx.arc(TILE_SIZE / 2, TILE_SIZE / 2 + hoverY, 12, 0, Math.PI * 2);
          ctx.fill();

          // Glowing eye
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2 + hoverY, 4, 4);
        }
      } else if (entity.type === 'shrine') {
        // Astral Shrine
        const isLit = worldFlags.switchesActivated[entity.id] || entity.isTriggered;
        ctx.fillStyle = isLit ? '#38bdf8' : '#334155';
        ctx.fillRect(12, 10, TILE_SIZE - 24, TILE_SIZE - 16);
        if (isLit) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(16, 4, TILE_SIZE - 32, 10);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();
    }

    // 2.5 Active Tile Focus Guidance Reticle
    const activeTilePx = playerPos.x * TILE_SIZE;
    const activeTilePy = playerPos.y * TILE_SIZE;
    ctx.save();
    ctx.strokeStyle = realm === 'interstice' ? 'rgba(192, 132, 252, 0.4)' : 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(activeTilePx + 2, activeTilePy + 2, TILE_SIZE - 4, TILE_SIZE - 4);

    // Subtle facing target dot to make tile-by-tile direction obvious
    let fX = playerPos.x;
    let fY = playerPos.y;
    if (playerDir === 'up') fY--;
    if (playerDir === 'down') fY++;
    if (playerDir === 'left') fX--;
    if (playerDir === 'right') fX++;

    if (fX >= 0 && fX < map.width && fY >= 0 && fY < map.height) {
      ctx.fillStyle = realm === 'interstice' ? 'rgba(192, 132, 252, 0.6)' : 'rgba(251, 191, 36, 0.5)';
      ctx.beginPath();
      ctx.arc(fX * TILE_SIZE + TILE_SIZE / 2, fY * TILE_SIZE + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Draw Player Character using interpolated coordinates
    const playerPx = renderPlayerPosRef.current.x * TILE_SIZE;
    const playerPy = renderPlayerPosRef.current.y * TILE_SIZE;
    const distToTargetNow = Math.hypot(
      playerPos.x - renderPlayerPosRef.current.x,
      playerPos.y - renderPlayerPosRef.current.y
    );
    const isVisiblyStepping = distToTargetNow > 0.02 || isMoving;
    const bob = isVisiblyStepping ? Math.sin(time * 14) * 2 : 0;

    ctx.save();
    ctx.translate(playerPx + TILE_SIZE / 2, playerPy + TILE_SIZE / 2 + bob);

    // Interstice Lantern Aura
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = realm === 'interstice' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(56, 189, 248, 0.2)';
    ctx.fill();

    // Player Body / Cloak
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, -2, 11, 0, Math.PI * 2);
    ctx.fill();

    // Player Head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -7, 7, 0, Math.PI * 2);
    ctx.fill();

    // Directional Facing indicator / Weapon
    ctx.fillStyle = '#e2e8f0';
    if (playerDir === 'up') {
      ctx.fillRect(-2, -18, 4, 10);
    } else if (playerDir === 'down') {
      ctx.fillRect(-2, 4, 4, 10);
    } else if (playerDir === 'left') {
      ctx.fillRect(-18, -4, 10, 4);
    } else if (playerDir === 'right') {
      ctx.fillRect(8, -4, 10, 4);
    }

    ctx.restore();

    // 4. Draw Floating Contextual Action Prompt above Nearby Entity
    if (nearbyEntity) {
      const promptX = nearbyEntity.x * TILE_SIZE + TILE_SIZE / 2;
      const promptY = nearbyEntity.y * TILE_SIZE - 12;

      ctx.save();
      ctx.translate(promptX, promptY);

      const label =
        nearbyEntity.type === 'npc'
          ? 'Talk [E]'
          : nearbyEntity.type === 'chest'
          ? 'Open [E]'
          : nearbyEntity.type === 'door'
          ? 'Unlock [E]'
          : nearbyEntity.type === 'portal'
          ? 'Enter [E]'
          : nearbyEntity.type === 'shrine'
          ? 'Ignite Beacon [E]'
          : nearbyEntity.type === 'switch'
          ? 'Step On [E]'
          : 'Interact [E]';

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;

      const textWidth = ctx.measureText(label).width;
      ctx.beginPath();
      ctx.roundRect(-textWidth / 2 - 8, -14, textWidth + 16, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, -4);

      ctx.restore();
    }

    // 5. Interstice Dimensional Overlay Filter
    if (realm === 'interstice') {
      ctx.restore(); // restore translated state
      ctx.save();
      ctx.fillStyle = 'rgba(107, 33, 168, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Subtle dimensional scanline
      const scanY = (time * 60) % height;
      ctx.fillStyle = 'rgba(216, 180, 254, 0.08)';
      ctx.fillRect(0, scanY, width, 4);
      ctx.restore();
      return;
    }

    ctx.restore();
  }, [currentMapId, realm, playerPos, playerDir, isMoving, worldFlags, stats, nearbyEntity]);

  // Main canvas animation loop
  useEffect(() => {
    const loop = () => {
      render();
      animFrameIdRef.current = requestAnimationFrame(loop);
    };
    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [render]);

  // Resize canvas to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Handle direct click/touch on canvas to move or interact
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCanvasClickMove) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const TILE_SIZE = 48;
    const camX = cameraRef.current.x * TILE_SIZE - canvas.width / 2 + TILE_SIZE / 2;
    const camY = cameraRef.current.y * TILE_SIZE - canvas.height / 2 + TILE_SIZE / 2;

    const worldX = Math.floor((clickX + camX) / TILE_SIZE);
    const worldY = Math.floor((clickY + camY) / TILE_SIZE);

    onCanvasClickMove({ x: worldX, y: worldY });
  };

  return (
    <div id="game-canvas-container" className="relative w-full h-full overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-pointer touch-none"
      />
    </div>
  );
};
