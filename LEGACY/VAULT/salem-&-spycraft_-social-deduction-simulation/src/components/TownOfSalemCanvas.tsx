import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, Phase, RoleId, BehavioralTell } from '../types';
import { ROLES } from '../data/roles';
import { soundEngine } from '../utils/audioEngine';

export interface WorldPosition {
  x: number;
  y: number;
}

export interface TownHouse {
  id: string;
  playerId: string;
  number: number;
  name: string;
  role: RoleId;
  x: number;
  y: number;
  width: number;
  height: number;
  doorX: number;
  doorY: number;
  roofColor: string;
}

interface SpeechBubble {
  id: string;
  playerId: string;
  speakerName: string;
  text: string;
  createdAt: number;
  durationMs: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface TownOfSalemCanvasProps {
  players: Player[];
  humanPlayer: Player;
  phase: Phase;
  dayNumber: number;
  accusedPlayer: Player | null;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
  onInteractBuilding?: (type: 'gallows' | 'tavern' | 'graveyard' | 'house', house?: TownHouse) => void;
  recentDialogues: { senderId: string; senderName: string; text: string; id: string }[];
  onQuickAccuse?: (player: Player) => void;
}

export const TownOfSalemCanvas: React.FC<TownOfSalemCanvasProps> = ({
  players,
  humanPlayer,
  phase,
  dayNumber,
  accusedPlayer,
  selectedPlayer,
  onSelectPlayer,
  onInteractBuilding,
  recentDialogues
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Character positions in world space (1200 x 850)
  const playerPositionsRef = useRef<Map<string, {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    facing: 'left' | 'right';
    isMoving: boolean;
    walkCycle: number;
    idleTimer: number;
    nextWanderTime: number;
  }>>(new Map());

  // Click destination marker
  const [clickDestination, setClickDestination] = useState<WorldPosition | null>(null);

  // Active speech bubbles
  const speechBubblesRef = useRef<SpeechBubble[]>([]);

  // Particles (motes, night fireflies, trial dust)
  const particlesRef = useRef<Particle[]>([]);

  // Keyboard keys pressed
  const keysPressedRef = useRef<Set<string>>(new Set());

  // Touch controls direction (-1, 0, 1)
  const touchDirectionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [showTouchControls, setShowTouchControls] = useState<boolean>(true);

  // Town map structures
  const MAP_WIDTH = 1200;
  const MAP_HEIGHT = 860;
  const GALLOWS_CENTER = { x: 600, y: 440 };
  const TAVERN_LOCATION = { x: 1040, y: 190, width: 140, height: 110 };
  const GRAVEYARD_LOCATION = { x: 160, y: 710, width: 150, height: 110 };
  const FOUNTAIN_LOCATION = { x: 600, y: 560, radius: 26 };

  // Calculate House layouts in a grand elliptical ring around the town square
  const housesRef = useRef<TownHouse[]>([]);
  
  useEffect(() => {
    const count = Math.max(players.length, 10);
    const radiusX = 430;
    const radiusY = 300;
    const centerX = 600;
    const centerY = 440;

    const roofPalette = [
      '#78350f', '#831843', '#1e3a8a', '#14532d', 
      '#701a75', '#312e81', '#7c2d12', '#064e3b',
      '#4c1d95', '#854d0e', '#3f3f46', '#881337'
    ];

    housesRef.current = players.map((p, idx) => {
      // distribute evenly around the ellipse, skipping top-right (tavern) and bottom-left (graveyard)
      const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
      const hx = Math.round(centerX + Math.cos(angle) * radiusX);
      const hy = Math.round(centerY + Math.sin(angle) * radiusY);

      return {
        id: `house_${p.id}`,
        playerId: p.id,
        number: idx + 1,
        name: p.name,
        role: p.role,
        x: hx - 45,
        y: hy - 40,
        width: 90,
        height: 75,
        doorX: hx,
        doorY: hy + 35,
        roofColor: roofPalette[idx % roofPalette.length]
      };
    });

    // Initialize or reconcile player positions
    players.forEach((p, idx) => {
      if (!playerPositionsRef.current.has(p.id)) {
        const house = housesRef.current[idx];
        const initialX = house ? house.doorX : 600 + (Math.random() * 80 - 40);
        const initialY = house ? house.doorY + 15 : 480 + (Math.random() * 60 - 30);

        playerPositionsRef.current.set(p.id, {
          x: initialX,
          y: initialY,
          targetX: initialX,
          targetY: initialY,
          facing: Math.random() > 0.5 ? 'right' : 'left',
          isMoving: false,
          walkCycle: Math.random() * 10,
          idleTimer: Math.random() * 200,
          nextWanderTime: Date.now() + 2000 + Math.random() * 5000
        });
      }
    });
  }, [players]);

  // Sync new incoming dialogue messages to floating speech bubbles
  useEffect(() => {
    if (recentDialogues.length > 0) {
      const latest = recentDialogues[recentDialogues.length - 1];
      if (latest) {
        soundEngine.playSpeechBlip();
        speechBubblesRef.current = [
          ...speechBubblesRef.current.filter(b => b.playerId !== latest.senderId),
          {
            id: latest.id,
            playerId: latest.senderId,
            speakerName: latest.senderName,
            text: latest.text,
            createdAt: Date.now(),
            durationMs: Math.max(4000, latest.text.length * 90)
          }
        ];
      }
    }
  }, [recentDialogues]);

  // Handle phase specific character repositioning (e.g. gathering at Gallows for trial)
  useEffect(() => {
    if (phase === 'trial' && accusedPlayer) {
      // Escort accused to the center gallows platform
      const accusedState = playerPositionsRef.current.get(accusedPlayer.id);
      if (accusedState) {
        accusedState.targetX = GALLOWS_CENTER.x;
        accusedState.targetY = GALLOWS_CENTER.y - 10;
        accusedState.isMoving = true;
      }

      // Other living players form a semicircle facing the gallows
      const livingJurors = players.filter(p => p.isAlive && p.id !== accusedPlayer.id);
      const juryCount = livingJurors.length;
      livingJurors.forEach((juror, idx) => {
        const angle = Math.PI * 0.15 + (idx / Math.max(1, juryCount - 1)) * Math.PI * 0.7;
        const radius = 160;
        const jx = GALLOWS_CENTER.x + Math.cos(angle) * radius;
        const jy = GALLOWS_CENTER.y + Math.sin(angle) * (radius * 0.65) + 30;

        const jurorState = playerPositionsRef.current.get(juror.id);
        if (jurorState) {
          jurorState.targetX = jx;
          jurorState.targetY = jy;
          jurorState.isMoving = true;
        }
      });
    } else if (phase === 'night') {
      // At night, bots retreat toward their designated houses
      players.forEach((p, idx) => {
        if (!p.isHuman && p.isAlive) {
          const house = housesRef.current[idx];
          const state = playerPositionsRef.current.get(p.id);
          if (house && state) {
            state.targetX = house.doorX;
            state.targetY = house.doorY + 10;
            state.isMoving = true;
          }
        }
      });
    } else if (phase === 'day_discussion') {
      // Disperse into discussion clusters around cobblestone plaza & fountain
      players.forEach((p) => {
        if (!p.isHuman && p.isAlive) {
          const state = playerPositionsRef.current.get(p.id);
          if (state) {
            const clusterAngle = Math.random() * Math.PI * 2;
            const clusterDist = 60 + Math.random() * 150;
            state.targetX = GALLOWS_CENTER.x + Math.cos(clusterAngle) * clusterDist;
            state.targetY = GALLOWS_CENTER.y + Math.sin(clusterAngle) * (clusterDist * 0.7);
            state.isMoving = true;
          }
        }
      });
    }
  }, [phase, accusedPlayer, players]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into chat input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(k)) {
        keysPressedRef.current.add(k);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressedRef.current.delete(k);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Rendering and Animation Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update Human Player movement via Keyboard or Touch D-Pad
      const humanState = playerPositionsRef.current.get(humanPlayer.id);
      if (humanState && humanPlayer.isAlive) {
        let dx = touchDirectionRef.current.dx;
        let dy = touchDirectionRef.current.dy;
        const speed = 160 * dt;

        if (keysPressedRef.current.has('w') || keysPressedRef.current.has('arrowup')) dy -= 1;
        if (keysPressedRef.current.has('s') || keysPressedRef.current.has('arrowdown')) dy += 1;
        if (keysPressedRef.current.has('a') || keysPressedRef.current.has('arrowleft')) dx -= 1;
        if (keysPressedRef.current.has('d') || keysPressedRef.current.has('arrowright')) dx += 1;

        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          humanState.x = Math.max(60, Math.min(MAP_WIDTH - 60, humanState.x + (dx / len) * speed));
          humanState.y = Math.max(60, Math.min(MAP_HEIGHT - 60, humanState.y + (dy / len) * speed));
          humanState.targetX = humanState.x;
          humanState.targetY = humanState.y;
          humanState.facing = dx > 0 ? 'right' : dx < 0 ? 'left' : humanState.facing;
          humanState.isMoving = true;
          humanState.walkCycle += dt * 10;
          soundEngine.playFootstep();
          setClickDestination(null);
        }
      }

      // Update Bot Movements & Autonomous Social Wandering
      const now = Date.now();
      playerPositionsRef.current.forEach((state, pId) => {
        const player = players.find(p => p.id === pId);
        if (!player || !player.isAlive) return;

        // Click-to-move interpolation
        const dist = Math.hypot(state.targetX - state.x, state.targetY - state.y);
        if (dist > 3) {
          const moveSpeed = (pId === humanPlayer.id ? 170 : 110) * dt;
          const ratio = Math.min(1, moveSpeed / dist);
          state.x += (state.targetX - state.x) * ratio;
          state.y += (state.targetY - state.y) * ratio;
          state.facing = state.targetX > state.x ? 'right' : 'left';
          state.isMoving = true;
          state.walkCycle += dt * 8;
          if (pId === humanPlayer.id) {
            soundEngine.playFootstep();
          }
        } else {
          state.isMoving = false;
        }

        // Bot autonomous micro-wandering during Day Discussion
        if (!player.isHuman && phase === 'day_discussion' && now > state.nextWanderTime && !state.isMoving) {
          state.nextWanderTime = now + 4000 + Math.random() * 7000;
          // Wander near town square or near another guest to gossip
          if (Math.random() > 0.4) {
            const wanderAngle = Math.random() * Math.PI * 2;
            const wanderRadius = 30 + Math.random() * 80;
            state.targetX = Math.max(200, Math.min(MAP_WIDTH - 200, state.x + Math.cos(wanderAngle) * wanderRadius));
            state.targetY = Math.max(220, Math.min(MAP_HEIGHT - 220, state.y + Math.sin(wanderAngle) * wanderRadius));
          }
        }
      });

      // Clear & Draw Town Environment
      ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      // 1. Ground Canvas: Medieval cobblestone lawn
      drawGround(ctx, phase);

      // 2. Cobblestone Plaza & Paths
      drawTownSquareRoads(ctx, GALLOWS_CENTER, housesRef.current);

      // 3. Buildings & Landmarks (Graveyard, Tavern, Fountain, Gallows)
      drawLandmarks(ctx, phase, dayNumber);

      // 4. Houses
      drawHouses(ctx, housesRef.current, players, phase, selectedPlayer);

      // 5. Destination Click Indicator
      if (clickDestination) {
        drawDestinationMarker(ctx, clickDestination, time);
      }

      // 6. Draw Characters (Y-sorted for proper isometric depth!)
      const sortedCharacters = Array.from(playerPositionsRef.current.entries())
        .map(([id, state]) => ({ player: players.find(p => p.id === id)!, state }))
        .filter(c => Boolean(c.player))
        .sort((a, b) => a.state.y - b.state.y);

      sortedCharacters.forEach(({ player, state }) => {
        drawCharacter(ctx, player, state, humanPlayer, accusedPlayer, selectedPlayer, phase, time);
      });

      // 7. Floating Speech Bubbles
      drawSpeechBubbles(ctx, speechBubblesRef.current, playerPositionsRef.current, now);

      // 8. Atmospheric Lighting & Fog Overlay
      drawAtmosphericLighting(ctx, phase, humanState, time, particlesRef.current);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [players, humanPlayer, phase, dayNumber, accusedPlayer, selectedPlayer, clickDestination]);

  // Unified Interaction Handler for both Mouse & Touch
  const processInteractionAt = (clickX: number, clickY: number) => {
    // Check if clicked on a character
    let clickedChar: Player | null = null;
    let closestDist = 38; // Click/touch radius

    playerPositionsRef.current.forEach((pos, pId) => {
      const d = Math.hypot(pos.x - clickX, pos.y - 20 - clickY);
      if (d < closestDist) {
        closestDist = d;
        clickedChar = players.find(p => p.id === pId) || null;
      }
    });

    if (clickedChar) {
      soundEngine.playTellDiscovered();
      onSelectPlayer(clickedChar);
      return;
    }

    // Check if clicked on buildings / landmarks
    // Gallows
    if (Math.hypot(clickX - GALLOWS_CENTER.x, clickY - GALLOWS_CENTER.y) < 75) {
      if (onInteractBuilding) onInteractBuilding('gallows');
      return;
    }
    // Tavern
    if (clickX >= TAVERN_LOCATION.x && clickX <= TAVERN_LOCATION.x + TAVERN_LOCATION.width &&
        clickY >= TAVERN_LOCATION.y && clickY <= TAVERN_LOCATION.y + TAVERN_LOCATION.height) {
      if (onInteractBuilding) onInteractBuilding('tavern');
      return;
    }
    // Graveyard
    if (clickX >= GRAVEYARD_LOCATION.x && clickX <= GRAVEYARD_LOCATION.x + GRAVEYARD_LOCATION.width &&
        clickY >= GRAVEYARD_LOCATION.y && clickY <= GRAVEYARD_LOCATION.y + GRAVEYARD_LOCATION.height) {
      if (onInteractBuilding) onInteractBuilding('graveyard');
      return;
    }
    // Check houses
    const clickedHouse = housesRef.current.find(h => 
      clickX >= h.x && clickX <= h.x + h.width &&
      clickY >= h.y && clickY <= h.y + h.height
    );
    if (clickedHouse) {
      const houseOwner = players.find(p => p.id === clickedHouse.playerId);
      if (houseOwner) onSelectPlayer(houseOwner);
      return;
    }

    // Otherwise: Move human character to clicked/touched spot!
    const humanState = playerPositionsRef.current.get(humanPlayer.id);
    if (humanState && humanPlayer.isAlive) {
      humanState.targetX = Math.max(40, Math.min(MAP_WIDTH - 40, clickX));
      humanState.targetY = Math.max(40, Math.min(MAP_HEIGHT - 40, clickY));
      humanState.isMoving = true;
      setClickDestination({ x: clickX, y: clickY });
    }
  };

  // Canvas Mouse Click: Select or Move
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = MAP_WIDTH / rect.width;
    const scaleY = MAP_HEIGHT / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    processInteractionAt(clickX, clickY);
  };

  // Canvas Touch Tap: Select or Move on Mobile
  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = MAP_WIDTH / rect.width;
    const scaleY = MAP_HEIGHT / rect.height;

    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    processInteractionAt(touchX, touchY);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-stone-950 overflow-hidden select-none">
      {/* 2D Viewport Canvas */}
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasTouch}
        className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-stone-800 cursor-crosshair touch-manipulation"
      />

      {/* Control Instruction Ribbon & D-Pad Toggle */}
      <div className="absolute top-3 left-3 sm:left-4 z-10 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-[11px] text-stone-300 font-mono shadow-md">
        <span className="font-bold text-amber-400 hidden sm:inline">Controls:</span>
        <span className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-200 hidden sm:inline">WASD / Tap to Walk</span>
        <button
          type="button"
          onClick={() => setShowTouchControls(!showTouchControls)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
            showTouchControls 
              ? 'bg-amber-500 text-stone-950 border-amber-400 font-black' 
              : 'bg-stone-800 text-stone-400 border-stone-700'
          }`}
          title="Toggle On-Screen Touch Joystick Pad"
        >
          🎮 D-Pad: {showTouchControls ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Active Phase Badge Floating Top-Center */}
      <div className="absolute top-3 right-3 sm:right-4 z-10 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-xs font-semibold shadow-md">
        <span className="capitalize font-bold text-amber-300">
          {phase.replace('_', ' ')}
        </span>
        <span className="text-stone-500">•</span>
        <span className="text-stone-400">Day {dayNumber}</span>
      </div>

      {/* Native Mobile Virtual Touch D-Pad Overlay */}
      {showTouchControls && (
        <div className="absolute bottom-4 left-3 sm:left-4 z-20 flex flex-col items-center select-none touch-none animate-in fade-in duration-150">
          <div className="p-2 sm:p-2.5 bg-stone-950/85 backdrop-blur-xl rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col items-center gap-1.5">
            {/* UP BUTTON */}
            <button
              type="button"
              aria-label="Move Up"
              className="w-12 h-12 rounded-2xl bg-stone-900 active:bg-amber-500 hover:bg-stone-800 text-stone-200 active:text-stone-950 flex items-center justify-center font-black text-lg shadow-md border border-stone-700 active:border-amber-400 transition-transform active:scale-95 cursor-pointer select-none"
              onPointerDown={(e) => {
                e.preventDefault();
                touchDirectionRef.current.dy = -1;
                soundEngine.playFootstep();
                if (navigator.vibrate) navigator.vibrate(12);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (touchDirectionRef.current.dy === -1) touchDirectionRef.current.dy = 0;
              }}
              onPointerLeave={() => {
                if (touchDirectionRef.current.dy === -1) touchDirectionRef.current.dy = 0;
              }}
              onPointerCancel={() => {
                if (touchDirectionRef.current.dy === -1) touchDirectionRef.current.dy = 0;
              }}
            >
              ▲
            </button>

            {/* MIDDLE ROW: LEFT, CENTER INDICATOR, RIGHT */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Move Left"
                className="w-12 h-12 rounded-2xl bg-stone-900 active:bg-amber-500 hover:bg-stone-800 text-stone-200 active:text-stone-950 flex items-center justify-center font-black text-lg shadow-md border border-stone-700 active:border-amber-400 transition-transform active:scale-95 cursor-pointer select-none"
                onPointerDown={(e) => {
                  e.preventDefault();
                  touchDirectionRef.current.dx = -1;
                  soundEngine.playFootstep();
                  if (navigator.vibrate) navigator.vibrate(12);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (touchDirectionRef.current.dx === -1) touchDirectionRef.current.dx = 0;
                }}
                onPointerLeave={() => {
                  if (touchDirectionRef.current.dx === -1) touchDirectionRef.current.dx = 0;
                }}
                onPointerCancel={() => {
                  if (touchDirectionRef.current.dx === -1) touchDirectionRef.current.dx = 0;
                }}
              >
                ◀
              </button>

              <div className="w-9 h-9 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400/70 select-none">
                WALK
              </div>

              <button
                type="button"
                aria-label="Move Right"
                className="w-12 h-12 rounded-2xl bg-stone-900 active:bg-amber-500 hover:bg-stone-800 text-stone-200 active:text-stone-950 flex items-center justify-center font-black text-lg shadow-md border border-stone-700 active:border-amber-400 transition-transform active:scale-95 cursor-pointer select-none"
                onPointerDown={(e) => {
                  e.preventDefault();
                  touchDirectionRef.current.dx = 1;
                  soundEngine.playFootstep();
                  if (navigator.vibrate) navigator.vibrate(12);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (touchDirectionRef.current.dx === 1) touchDirectionRef.current.dx = 0;
                }}
                onPointerLeave={() => {
                  if (touchDirectionRef.current.dx === 1) touchDirectionRef.current.dx = 0;
                }}
                onPointerCancel={() => {
                  if (touchDirectionRef.current.dx === 1) touchDirectionRef.current.dx = 0;
                }}
              >
                ▶
              </button>
            </div>

            {/* DOWN BUTTON */}
            <button
              type="button"
              aria-label="Move Down"
              className="w-12 h-12 rounded-2xl bg-stone-900 active:bg-amber-500 hover:bg-stone-800 text-stone-200 active:text-stone-950 flex items-center justify-center font-black text-lg shadow-md border border-stone-700 active:border-amber-400 transition-transform active:scale-95 cursor-pointer select-none"
              onPointerDown={(e) => {
                e.preventDefault();
                touchDirectionRef.current.dy = 1;
                soundEngine.playFootstep();
                if (navigator.vibrate) navigator.vibrate(12);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (touchDirectionRef.current.dy === 1) touchDirectionRef.current.dy = 0;
              }}
              onPointerLeave={() => {
                if (touchDirectionRef.current.dy === 1) touchDirectionRef.current.dy = 0;
              }}
              onPointerCancel={() => {
                if (touchDirectionRef.current.dy === 1) touchDirectionRef.current.dy = 0;
              }}
            >
              ▼
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DRAWING HELPER FUNCTIONS ---

function drawGround(ctx: CanvasRenderingContext2D, phase: Phase) {
  // Base dark mossy soil
  const baseColor = phase === 'night' ? '#0f172a' : phase === 'dusk' ? '#1c1917' : '#141c14';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1200, 860);

  // Subtle grass texture patches
  ctx.fillStyle = phase === 'night' ? '#111e38' : phase === 'dusk' ? '#292524' : '#1a291a';
  for (let i = 0; i < 40; i++) {
    const rx = (i * 31) % 1200;
    const ry = (i * 47) % 860;
    ctx.beginPath();
    ctx.arc(rx, ry, 24 + (i % 15), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTownSquareRoads(
  ctx: CanvasRenderingContext2D, 
  center: WorldPosition, 
  houses: TownHouse[]
) {
  // Cobblestone town circle
  ctx.save();
  ctx.fillStyle = '#292524';
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 3;

  // Central circle
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, 220, 150, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cobblestone radiating paths to houses
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#292524';
  houses.forEach(h => {
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(h.doorX, h.doorY);
    ctx.stroke();
  });

  // Path to Tavern
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(1040, 240);
  ctx.stroke();

  // Path to Graveyard
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(220, 720);
  ctx.stroke();

  ctx.restore();
}

function drawLandmarks(
  ctx: CanvasRenderingContext2D, 
  phase: Phase, 
  dayNumber: number
) {
  ctx.save();

  // 1. Central Gallows / Judicial Platform (600, 440)
  const gx = 600;
  const gy = 440;

  // Wooden platform shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(gx, gy + 15, 80, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Platform timber base
  ctx.fillStyle = '#451a03';
  ctx.fillRect(gx - 65, gy - 35, 130, 60);

  // Platform floor planks
  ctx.fillStyle = '#78350f';
  ctx.fillRect(gx - 65, gy - 45, 130, 20);

  // Judicial Desk / Bench
  ctx.fillStyle = '#92400e';
  ctx.fillRect(gx - 25, gy - 40, 50, 18);
  ctx.fillStyle = '#f59e0b'; // Golden gavel icon on bench
  ctx.fillRect(gx - 8, gy - 36, 16, 6);

  // Gallows Timber Post & Beam
  ctx.fillStyle = '#291807';
  ctx.fillRect(gx + 32, gy - 85, 10, 60); // Vertical post
  ctx.fillRect(gx + 10, gy - 85, 32, 8); // Horizontal crossbeam

  // Gallows hanging rope
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gx + 16, gy - 77);
  ctx.lineTo(gx + 16, gy - 55);
  ctx.stroke();

  // Gallows sign banner
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(gx - 40, gy - 8, 80, 14);
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('INQUEST GALLOWS', gx, gy + 3);

  // 2. Fountain / Courtyard Well (600, 560)
  const fx = 600;
  const fy = 560;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(fx, fy + 5, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#57534e';
  ctx.beginPath();
  ctx.arc(fx, fy, 26, 0, Math.PI * 2);
  ctx.fill();

  // Water pool
  ctx.fillStyle = phase === 'night' ? '#1e3a8a' : '#0284c7';
  ctx.beginPath();
  ctx.arc(fx, fy, 18, 0, Math.PI * 2);
  ctx.fill();

  // Water ripple ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(fx, fy, 8, 0, Math.PI * 2);
  ctx.stroke();

  // 3. The Blackthorn Tavern & Barter Bazaar (1040, 190)
  const tx = 1040;
  const ty = 190;
  // Tavern building shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(tx - 5, ty + 10, 150, 115);

  // Tavern timber structure
  ctx.fillStyle = '#451a03';
  ctx.fillRect(tx, ty, 140, 105);

  // Tavern roof
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(tx - 10, ty);
  ctx.lineTo(tx + 70, ty - 35);
  ctx.lineTo(tx + 150, ty);
  ctx.closePath();
  ctx.fill();

  // Tavern warm glowing door
  ctx.fillStyle = phase === 'night' ? '#f59e0b' : '#d97706';
  ctx.fillRect(tx + 50, ty + 55, 36, 50);

  // Ale signpost
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(tx + 20, ty + 30, 100, 18);
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍺 TAVERN & BAZAAR', tx + 70, ty + 43);

  // 4. Graveyard & Crypt (160, 710)
  const gyx = 160;
  const gyy = 710;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(gyx - 10, gyy - 10, 170, 120);

  // Stone fence / iron railing
  ctx.strokeStyle = '#57534e';
  ctx.lineWidth = 3;
  ctx.strokeRect(gyx, gyy, 150, 100);

  // Graveyard gate title
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(gyx + 25, gyy - 12, 100, 16);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MANOR GRAVEYARD', gyx + 75, gyy);

  // Sample tombstones inside cemetery
  ctx.fillStyle = '#64748b';
  ctx.fillRect(gyx + 20, gyy + 35, 20, 26);
  ctx.fillRect(gyx + 55, gyy + 25, 22, 32);
  ctx.fillRect(gyx + 95, gyy + 40, 20, 24);

  ctx.restore();
}

function drawHouses(
  ctx: CanvasRenderingContext2D, 
  houses: TownHouse[], 
  players: Player[], 
  phase: Phase, 
  selectedPlayer: Player | null
) {
  ctx.save();

  houses.forEach(h => {
    const occupant = players.find(p => p.id === h.playerId);
    const isOccupantAlive = occupant ? occupant.isAlive : true;
    const isSelected = selectedPlayer?.id === h.playerId;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(h.x + 4, h.y + 10, h.width, h.height);

    // House walls (stone / timber)
    ctx.fillStyle = '#292524';
    ctx.fillRect(h.x, h.y, h.width, h.height);

    // House roof
    ctx.fillStyle = isSelected ? '#f59e0b' : h.roofColor;
    ctx.beginPath();
    ctx.moveTo(h.x - 8, h.y + 10);
    ctx.lineTo(h.x + h.width / 2, h.y - 25);
    ctx.lineTo(h.x + h.width + 8, h.y + 10);
    ctx.closePath();
    ctx.fill();

    // Chimney with subtle smoke
    ctx.fillStyle = '#44403c';
    ctx.fillRect(h.x + h.width - 20, h.y - 30, 12, 18);

    // Door
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(h.doorX - 12, h.doorY - 26, 24, 26);

    // Window (glowing warm candle in night or dark if dead)
    const windowGlow = !isOccupantAlive ? '#1e293b' : phase === 'night' ? '#fbbf24' : '#60a5fa';
    ctx.fillStyle = windowGlow;
    ctx.fillRect(h.x + 12, h.y + 18, 16, 16);
    ctx.fillRect(h.x + h.width - 28, h.y + 18, 16, 16);

    // House Nameplate Signpost
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(h.doorX - 35, h.doorY + 2, 70, 14);
    ctx.strokeStyle = isSelected ? '#fbbf24' : '#57534e';
    ctx.lineWidth = 1;
    ctx.strokeRect(h.doorX - 35, h.doorY + 2, 70, 14);

    ctx.fillStyle = isOccupantAlive ? '#e7e5e4' : '#ef4444';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    const shortName = h.name.replace(/Lord|Lady|Sir|Captain|Master|Doctor|Father|Sister/g, '').trim();
    ctx.fillText(`#${h.number} ${shortName}`, h.doorX, h.doorY + 12);
  });

  ctx.restore();
}

function drawDestinationMarker(ctx: CanvasRenderingContext2D, dest: WorldPosition, time: number) {
  ctx.save();
  const pulse = (Math.sin(time * 0.008) + 1) * 0.5;
  const radius = 10 + pulse * 6;

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(dest.x, dest.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(dest.x, dest.y, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  player: Player,
  state: { x: number; y: number; facing: 'left' | 'right'; isMoving: boolean; walkCycle: number },
  humanPlayer: Player,
  accusedPlayer: Player | null,
  selectedPlayer: Player | null,
  phase: Phase,
  time: number
) {
  ctx.save();
  const cx = state.x;
  const cy = state.y;
  const isSelected = selectedPlayer?.id === player.id;
  const isSelf = player.id === humanPlayer.id;
  const isAccused = accusedPlayer?.id === player.id;
  const isDead = !player.isAlive;

  // 1. Shadow Oval under feet
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, isDead ? 8 : 14, isDead ? 4 : 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Selection Spotlight / Accused Spotlight
  if (isSelected || isAccused) {
    ctx.strokeStyle = isAccused ? '#ef4444' : '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // If player is DEAD: draw as translucent ghost
  if (isDead) {
    const floatY = Math.sin(time * 0.005 + player.id.length) * 5;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#94a3b8';
    // Ghost head & sheet
    ctx.beginPath();
    ctx.arc(cx, cy - 24 + floatY, 10, Math.PI, 0, false);
    ctx.lineTo(cx + 10, cy - 6 + floatY);
    ctx.lineTo(cx + 5, cy - 10 + floatY);
    ctx.lineTo(cx, cy - 6 + floatY);
    ctx.lineTo(cx - 5, cy - 10 + floatY);
    ctx.lineTo(cx - 10, cy - 6 + floatY);
    ctx.closePath();
    ctx.fill();

    // Ghost eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 24 + floatY, 2, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 24 + floatY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Dead badge
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FALLEN', cx, cy - 35 + floatY);

    ctx.restore();
    return;
  }

  // Alive Character Rendering
  const walkBob = state.isMoving ? Math.abs(Math.sin(state.walkCycle)) * 3 : 0;
  const legAngle = state.isMoving ? Math.sin(state.walkCycle) * 6 : 0;
  const flip = state.facing === 'left' ? -1 : 1;

  ctx.translate(cx, cy - walkBob);

  // Role Accent Colors
  const roleDef = ROLES[player.role] || ROLES.detective;
  const cloakColor = roleDef.accentColor || '#3b82f6';

  // 1. Legs
  ctx.fillStyle = '#1c1917';
  // Left leg
  ctx.fillRect(-6 + legAngle * 0.5, -12, 4, 12);
  // Right leg
  ctx.fillRect(2 - legAngle * 0.5, -12, 4, 12);

  // 2. Cloak / Body
  ctx.fillStyle = cloakColor;
  ctx.beginPath();
  ctx.moveTo(-10 * flip, -12);
  ctx.lineTo(10 * flip, -12);
  ctx.lineTo(8 * flip, -30);
  ctx.lineTo(-8 * flip, -30);
  ctx.closePath();
  ctx.fill();

  // 3. Torso / Inner Vest
  ctx.fillStyle = '#f5f5f4';
  ctx.fillRect(-3 * flip, -28, 6, 12);

  // 4. Head (skin tone)
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -35, 7, 0, Math.PI * 2);
  ctx.fill();

  // 5. Hair / Role Hat
  drawRoleHat(ctx, player.role, flip);

  // 6. Role Handheld Accessory
  drawRoleAccessory(ctx, player.role, flip);

  // 7. Human Indicator Arrow over self
  if (isSelf) {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.lineTo(-5, -64);
    ctx.lineTo(5, -64);
    ctx.closePath();
    ctx.fill();
  }

  // 8. Nameplate & Status Badge
  ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
  ctx.fillRect(-35, -53, 70, 13);
  ctx.strokeStyle = isSelf ? '#f59e0b' : '#44403c';
  ctx.lineWidth = 1;
  ctx.strokeRect(-35, -53, 70, 13);

  ctx.fillStyle = isSelf ? '#fbbf24' : '#f5f5f4';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  const nameLabel = player.name.split(' ')[1] || player.name.split(' ')[0];
  ctx.fillText(nameLabel, 0, -44);

  // 9. Spy Party Behavioral Tell Icon Indicator
  if (player.behavioralTells && player.behavioralTells.length > 0) {
    const latestTell = player.behavioralTells[player.behavioralTells.length - 1];
    if (latestTell.isSuspicious) {
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('👁️', 18 * flip, -36);
    }
  }

  // 10. Jury Vote Paddles during Trial
  if (phase === 'trial' && player.trialVote) {
    ctx.fillStyle = player.trialVote === 'guilty' ? '#ef4444' : player.trialVote === 'innocent' ? '#10b981' : '#64748b';
    ctx.fillRect(-18, -72, 36, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText(player.trialVote.toUpperCase(), 0, -62);
  }

  ctx.restore();
}

function drawRoleHat(ctx: CanvasRenderingContext2D, role: RoleId, flip: number) {
  ctx.save();
  switch (role) {
    case 'judge':
      // Baroque powdered white wig
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -37, 9, Math.PI, 0, false);
      ctx.lineTo(8, -28);
      ctx.lineTo(-8, -28);
      ctx.closePath();
      ctx.fill();
      break;
    case 'detective':
      // Deerstalker cap
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, -41, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-7, -43, 14, 5);
      break;
    case 'prince':
      // Golden Crown
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-7, -40);
      ctx.lineTo(-7, -46);
      ctx.lineTo(-4, -43);
      ctx.lineTo(0, -47);
      ctx.lineTo(4, -43);
      ctx.lineTo(7, -46);
      ctx.lineTo(7, -40);
      ctx.closePath();
      ctx.fill();
      break;
    case 'jester':
      // Motley bells hat
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(-8, -40);
      ctx.lineTo(-12, -49);
      ctx.lineTo(0, -42);
      ctx.lineTo(12, -49);
      ctx.lineTo(8, -40);
      ctx.closePath();
      ctx.fill();
      break;
    case 'killer':
      // Dark hooded cowl
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(0, -37, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'doctor':
      // Apothecary top hat
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -42, 16, 3);
      ctx.fillRect(-5, -50, 10, 8);
      break;
    case 'sheriff':
      // Marshal wide brim hat
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(0, -41, 12, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-6, -46, 12, 6);
      break;
    case 'cook':
      // Chef Toque
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -50, 12, 10);
      ctx.beginPath();
      ctx.arc(0, -50, 8, Math.PI, 0, false);
      ctx.fill();
      break;
    default:
      // Neutral gentle hair
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(0, -37, 8, Math.PI, 0, false);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function drawRoleAccessory(ctx: CanvasRenderingContext2D, role: RoleId, flip: number) {
  ctx.save();
  const handX = 9 * flip;
  const handY = -22;

  switch (role) {
    case 'judge':
      // Gavel in hand
      ctx.fillStyle = '#78350f';
      ctx.fillRect(handX - 2, handY - 8, 4, 10);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(handX - 5, handY - 10, 10, 4);
      break;
    case 'detective':
      // Magnifying glass
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(handX + 2 * flip, handY - 4, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + 3 * flip, handY - 2);
      ctx.stroke();
      break;
    case 'killer':
      // Dagger
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(handX, handY - 6);
      ctx.lineTo(handX + 3 * flip, handY + 4);
      ctx.lineTo(handX - 2 * flip, handY + 4);
      ctx.closePath();
      ctx.fill();
      break;
    case 'tavern_keeper':
      // Ale mug
      ctx.fillStyle = '#d97706';
      ctx.fillRect(handX - 3, handY - 6, 7, 8);
      ctx.fillStyle = '#fef08a'; // Foam
      ctx.fillRect(handX - 3, handY - 8, 7, 2);
      break;
    case 'sheriff':
      // Gold Star badge on chest
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -22, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function drawSpeechBubbles(
  ctx: CanvasRenderingContext2D,
  bubbles: SpeechBubble[],
  positions: Map<string, { x: number; y: number }>,
  now: number
) {
  ctx.save();

  bubbles.forEach(b => {
    const age = now - b.createdAt;
    if (age > b.durationMs) return;

    const pos = positions.get(b.playerId);
    if (!pos) return;

    // Fade out near end
    const remaining = b.durationMs - age;
    const alpha = remaining < 600 ? remaining / 600 : 1.0;
    ctx.globalAlpha = alpha;

    const bx = pos.x;
    const by = pos.y - 75;

    ctx.font = 'bold 10px sans-serif';
    const textWidth = ctx.measureText(b.text).width;
    const boxWidth = Math.min(220, Math.max(80, textWidth + 16));
    const boxHeight = 32;

    // Bubble Background (parchment)
    ctx.fillStyle = '#fafaf9';
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(bx - boxWidth / 2, by - boxHeight / 2, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Downward speech pointer triangle
    ctx.fillStyle = '#fafaf9';
    ctx.beginPath();
    ctx.moveTo(bx - 6, by + boxHeight / 2);
    ctx.lineTo(bx + 6, by + boxHeight / 2);
    ctx.lineTo(bx, by + boxHeight / 2 + 7);
    ctx.closePath();
    ctx.fill();

    // Speaker Name Tag
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.speakerName, bx, by - 4);

    // Dialogue text (truncated if too long)
    ctx.fillStyle = '#1c1917';
    ctx.font = '10px sans-serif';
    const displayText = b.text.length > 32 ? b.text.substring(0, 30) + '…' : b.text;
    ctx.fillText(displayText, bx, by + 9);
  });

  ctx.restore();
}

function drawAtmosphericLighting(
  ctx: CanvasRenderingContext2D,
  phase: Phase,
  humanState: { x: number; y: number } | undefined,
  time: number,
  particles: Particle[]
) {
  ctx.save();

  if (phase === 'night') {
    // Night Fog & Darkness with Lantern Radius
    const hx = humanState ? humanState.x : 600;
    const hy = humanState ? humanState.y : 440;

    // Darkness vignette
    const darkGrad = ctx.createRadialGradient(hx, hy, 40, hx, hy, 380);
    darkGrad.addColorStop(0, 'rgba(10, 15, 30, 0.05)');
    darkGrad.addColorStop(0.5, 'rgba(10, 15, 30, 0.55)');
    darkGrad.addColorStop(1, 'rgba(5, 8, 20, 0.92)');

    ctx.fillStyle = darkGrad;
    ctx.fillRect(0, 0, 1200, 860);

    // Warm lantern flicker around player
    const flicker = Math.sin(time * 0.015) * 4;
    const lanternGrad = ctx.createRadialGradient(hx, hy, 5, hx, hy, 120 + flicker);
    lanternGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
    lanternGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
    lanternGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = lanternGrad;
    ctx.fillRect(0, 0, 1200, 860);

  } else if (phase === 'dusk') {
    // Warm Twilight Orange glow
    ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
    ctx.fillRect(0, 0, 1200, 860);
  } else if (phase === 'dawn') {
    // Soft morning pink/gold mist
    ctx.fillStyle = 'rgba(251, 146, 60, 0.08)';
    ctx.fillRect(0, 0, 1200, 860);
  } else if (phase === 'trial') {
    // Dramatic court trial vignette
    const trialGrad = ctx.createRadialGradient(600, 440, 100, 600, 440, 500);
    trialGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    trialGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = trialGrad;
    ctx.fillRect(0, 0, 1200, 860);
  }

  ctx.restore();
}
