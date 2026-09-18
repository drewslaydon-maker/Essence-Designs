import React, { useEffect, useRef, useCallback } from 'react';
import { Gem, Rock, Particle, FloatingText, CavernTheme, CharacterProfile } from '../types';
import { GEM_CATALOG } from '../data/gems';
import { playAudio } from '../audio';

interface MiningCanvasProps {
  strikes: number;
  onStrikeUsed: (newStrikes: number) => void;
  onGemRecovered: (gem: Gem, xpAwarded: number) => void;
  onGeodeTriggered: (bonusStrikes: number) => void;
  onSlagShattered: () => void;
  onWallCleared: (leftoverStrikes: number) => void;
  onMineDepleted: () => void;
  onMonsterPartHarvested?: (partId: string, partName: string) => void;
  isGameActive: boolean;
  regenerateTrigger: number;
  cavernTheme: CavernTheme;
  character: CharacterProfile;
  selectedPerkIds: string[];
}

export const MiningCanvas: React.FC<MiningCanvasProps> = ({
  strikes,
  onStrikeUsed,
  onGemRecovered,
  onGeodeTriggered,
  onSlagShattered,
  onWallCleared,
  onMineDepleted,
  onMonsterPartHarvested,
  isGameActive,
  regenerateTrigger,
  cavernTheme,
  character,
  selectedPerkIds,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mutable game state in refs for silky smooth 60fps rendering without React re-renders
  const stateRef = useRef<{
    width: number;
    height: number;
    dpr: number;
    rocks: Rock[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    shakeIntensity: number;
    strikes: number;
    totalTapCount: number;
    isConcluding: boolean;
  }>({
    width: 0,
    height: 0,
    dpr: 1,
    rocks: [],
    particles: [],
    floatingTexts: [],
    shakeIntensity: 0,
    strikes: strikes,
    totalTapCount: 0,
    isConcluding: false,
  });

  // Sync ref with external strikes
  useEffect(() => {
    stateRef.current.strikes = strikes;
  }, [strikes]);

  // Generate cavern wall of rocks tailored to the active cavern theme & perks
  const generateCavernWall = useCallback(() => {
    const s = stateRef.current;
    if (s.width <= 0 || s.height <= 0) return;

    s.particles = [];
    s.floatingTexts = [];
    s.shakeIntensity = 0;
    s.isConcluding = false;

    const isMobile = s.width < 640;
    const cols = isMobile ? 3 : 4;
    const rows = isMobile ? 4 : 4;
    const totalSlots = cols * rows;
    const cellW = s.width / (cols + 1);
    const cellH = (s.height * (isMobile ? 0.72 : 0.72)) / (rows + 1);
    const topMargin = isMobile ? Math.max(60, s.height * 0.10) : s.height * 0.16;

    // Guaranteed gem calculation:
    // Base: 2 gems.
    // +1 if player has 'vein_mastery' perk
    // +1 if cavern theme is 'verdant' (Mineral Rich Rootsoil)
    let guaranteedGemsCount = 2;
    if (selectedPerkIds.includes('vein_mastery')) guaranteedGemsCount += 1;
    if (cavernTheme.id === 'verdant') guaranteedGemsCount += 1;
    guaranteedGemsCount = Math.min(totalSlots - 3, guaranteedGemsCount);

    const guaranteedGeodesCount = 1;

    // Pick unique indices for guaranteed gems and geodes
    const slotIndices = Array.from({ length: totalSlots }, (_, i) => i);
    for (let i = slotIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slotIndices[i], slotIndices[j]] = [slotIndices[j], slotIndices[i]];
    }

    const guaranteedGemIndices = new Set(slotIndices.slice(0, guaranteedGemsCount));
    const guaranteedGeodeIndices = new Set(
      slotIndices.slice(guaranteedGemsCount, guaranteedGemsCount + guaranteedGeodesCount)
    );

    // Available gems pool: Prioritize cavern theme gems, supplemented by general gems
    const themeGems = GEM_CATALOG.filter((g) => cavernTheme.uniqueGemIds.includes(g.id));
    const gemPool = themeGems.length > 0 ? themeGems : GEM_CATALOG;

    const newRocks: Rock[] = [];
    let index = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitterX = (Math.random() - 0.5) * cellW * 0.42;
        const jitterY = (Math.random() - 0.5) * cellH * 0.38;
        const x = cellW * (c + 1) + jitterX;
        const y = topMargin + cellH * (r + 0.9) + jitterY;
        const radius = Math.min(cellW, cellH) * 0.38 + (Math.random() * 8 - 4);

        let type: Rock['type'] = 'SLAG';
        let gem: Gem | null = null;

        if (guaranteedGemIndices.has(index)) {
          type = 'GEM';
          gem = gemPool[Math.floor(Math.random() * gemPool.length)];
        } else if (guaranteedGeodeIndices.has(index)) {
          type = 'GEODE';
        } else {
          // Additional random roll for remaining slots: 35% Gem, 15% Geode, 50% Slag
          const roll = Math.random();
          if (roll > 0.85) {
            type = 'GEODE';
          } else if (roll > 0.5) {
            type = 'GEM';
            // Crystal affinity perk: higher chance of rare/legendary
            if (selectedPerkIds.includes('crystal_affinity')) {
              const rareGems = GEM_CATALOG.filter(
                (g) => g.rarity === 'Rare' || g.rarity === 'Legendary'
              );
              gem = Math.random() > 0.4
                ? rareGems[Math.floor(Math.random() * rareGems.length)]
                : gemPool[Math.floor(Math.random() * gemPool.length)];
            } else {
              gem = gemPool[Math.floor(Math.random() * gemPool.length)];
            }
          }
        }

        // Generate organic jagged polygon vertices
        const numVerts = 7 + Math.floor(Math.random() * 5);
        const vertices: { x: number; y: number }[] = [];
        for (let i = 0; i < numVerts; i++) {
          const angle = (i / numVerts) * Math.PI * 2;
          const rOffset = radius * (0.82 + Math.random() * 0.34);
          vertices.push({
            x: Math.cos(angle) * rOffset,
            y: Math.sin(angle) * rOffset,
          });
        }

        // Procedural fracture fissure lines for progressive chipping
        const fissures = [
          {
            x1: -radius * 0.45,
            y1: -radius * 0.25,
            x2: radius * 0.35,
            y2: radius * 0.35,
          },
          {
            x1: -radius * 0.2,
            y1: radius * 0.4,
            x2: radius * 0.4,
            y2: -radius * 0.2,
          },
          {
            x1: 0,
            y1: -radius * 0.5,
            x2: radius * 0.15,
            y2: radius * 0.45,
          },
        ];

        const rockColor =
          cavernTheme.rockColors[
            Math.floor(Math.random() * cavernTheme.rockColors.length)
          ];

        newRocks.push({
          id: `rock-${r}-${c}-${Math.random().toString(36).substring(2, 6)}`,
          x,
          y,
          radius,
          vertices,
          fissures,
          type,
          gem,
          hitsTaken: 0,
          hitsNeeded: 3,
          broken: false,
          rockColor,
        });

        index++;
      }
    }

    s.rocks = newRocks;
  }, [cavernTheme, selectedPerkIds]);

  // Handle shattering a rock on hit 3
  const finalizeShatter = useCallback(
    (rock: Rock) => {
      const s = stateRef.current;
      rock.broken = true;

      // Spawn angular rock shard rubble
      const shardCount = 14 + Math.floor(Math.random() * 6);
      for (let i = 0; i < shardCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        s.particles.push({
          x: rock.x,
          y: rock.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 4 + Math.random() * 7,
          color: Math.random() > 0.4 ? rock.rockColor : '#44403c',
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          alpha: 1,
          gravity: 0.24,
          isSpark: false,
        });
      }

      if (rock.type === 'SLAG') {
        playAudio('slag');

        // Slag Salvager perk check: 40% chance to refund 1 strike
        let refundStrike = false;
        if (selectedPerkIds.includes('slag_salvager') || character.minerClass === 'tunnel_scavenger') {
          if (Math.random() < 0.4) {
            refundStrike = true;
            s.strikes += 1;
            onStrikeUsed(s.strikes);
          }
        }

        const xpAwarded = character.minerClass === 'tunnel_scavenger' ? 25 : 12;

        s.floatingTexts.push({
          id: `ft-${Date.now()}-${Math.random()}`,
          x: rock.x,
          y: rock.y,
          text: refundStrike ? `Slag (+${xpAwarded} XP, +1 Strike Refund!)` : `Slag (+${xpAwarded} XP)`,
          color: refundStrike ? '#38bdf8' : '#a8a29e',
          alpha: 1.1,
          scale: refundStrike ? 1.1 : 0.95,
        });

        // Check for organic monster/fauna harvest from slag
        if (onMonsterPartHarvested && Math.random() < 0.42) {
          const parts = [
            { id: 'cave_beetle_meat', name: 'Beetle Meat', color: '#f97316' },
            { id: 'phosphor_morel', name: 'Phosphor Morel', color: '#06b6d4' },
            { id: 'salt_crust_lichen', name: 'Rock Lichen', color: '#84cc16' },
          ];
          const chosen = parts[Math.floor(Math.random() * parts.length)];
          onMonsterPartHarvested(chosen.id, chosen.name);
          s.floatingTexts.push({
            id: `ft-org-${Date.now()}-${Math.random()}`,
            x: rock.x + (Math.random() * 20 - 10),
            y: rock.y - 25,
            text: `+1 ${chosen.name}`,
            color: chosen.color,
            alpha: 1.2,
            scale: 1.05,
          });
        }

        onSlagShattered();
      } else if (rock.type === 'GEM' && rock.gem) {
        const capturedGem = rock.gem;
        playAudio('gem', capturedGem.freq);

        // Check for fauna/organics clinging to gem node
        if (onMonsterPartHarvested && Math.random() < 0.35) {
          const gemOrganics = [
            { id: 'dusk_bat_wing', name: 'Bat Wing', color: '#a855f7' },
            { id: 'blind_cave_trout', name: 'Blind Trout', color: '#38bdf8' },
          ];
          const chosenOrg = gemOrganics[Math.floor(Math.random() * gemOrganics.length)];
          onMonsterPartHarvested(chosenOrg.id, chosenOrg.name);
          s.floatingTexts.push({
            id: `ft-gemorg-${Date.now()}-${Math.random()}`,
            x: rock.x + (Math.random() * 20 - 10),
            y: rock.y - 28,
            text: `+1 ${chosenOrg.name}`,
            color: chosenOrg.color,
            alpha: 1.25,
            scale: 1.05,
          });
        }

        // Gem XP bonuses:
        // Gemologist class: +35%
        // precision_chisel perk: +40%
        // Harmonic Amplification (prismatic cavern): +50%
        let xpMultiplier = 1;
        if (character.minerClass === 'gemologist') xpMultiplier += 0.35;
        if (selectedPerkIds.includes('precision_chisel')) xpMultiplier += 0.4;
        if (cavernTheme.id === 'prismatic') xpMultiplier += 0.5;

        const awardedXp = Math.round(capturedGem.baseXp * xpMultiplier);
        onGemRecovered(capturedGem, awardedXp);

        s.floatingTexts.push({
          id: `ft-${Date.now()}-${Math.random()}`,
          x: rock.x,
          y: rock.y,
          text: `${capturedGem.name} (+${awardedXp} XP)`,
          color: capturedGem.color,
          alpha: 1.25,
          scale: 1.25,
        });

        // Gem sparkling crystal shards
        for (let i = 0; i < 24; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3.5 + Math.random() * 7;
          s.particles.push({
            x: rock.x,
            y: rock.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 3 + Math.random() * 5,
            color: capturedGem.color,
            rot: 0,
            vRot: 0,
            alpha: 1,
            gravity: 0.08,
            isSpark: true,
          });
        }
      } else if (rock.type === 'GEODE') {
        // Echo Geode: Base 6 strikes (cost 3 to break = net +3 strikes!)
        // Resonance Mystic class: +3 strikes
        // echo_resonance perk: +3 strikes & shockwave adjacent
        // Hydro-Resonance (abyssal cavern): +2 strikes
        let bonusStrikes = 6;
        if (character.minerClass === 'resonance_mystic') bonusStrikes += 3;
        if (selectedPerkIds.includes('echo_resonance')) bonusStrikes += 3;
        if (cavernTheme.id === 'abyssal') bonusStrikes += 2;

        s.strikes += bonusStrikes;
        s.shakeIntensity = 18;
        playAudio('geode');

        if (onMonsterPartHarvested && Math.random() < 0.5) {
          onMonsterPartHarvested('geode_marrow', 'Geode Marrow');
        }

        s.floatingTexts.push({
          id: `ft-${Date.now()}-${Math.random()}`,
          x: rock.x,
          y: rock.y,
          text: `ECHO GEODE! +${bonusStrikes} STRIKES (+40 XP)`,
          color: '#fbbf24',
          alpha: 1.4,
          scale: 1.35,
        });

        // Echo shockwave to adjacent rocks if echo_resonance perk active
        if (selectedPerkIds.includes('echo_resonance') || character.minerClass === 'resonance_mystic') {
          for (const other of s.rocks) {
            if (!other.broken && other.id !== rock.id) {
              const d = Math.hypot(other.x - rock.x, other.y - rock.y);
              if (d < rock.radius * 2.8) {
                other.hitsTaken = Math.min(other.hitsNeeded, other.hitsTaken + 1);
                if (other.hitsTaken >= other.hitsNeeded) {
                  finalizeShatter(other);
                }
              }
            }
          }
        }

        // Radiant golden spark burst
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 8;
          s.particles.push({
            x: rock.x,
            y: rock.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5,
            size: 4 + Math.random() * 5,
            color: Math.random() > 0.3 ? '#f59e0b' : '#fef08a',
            rot: 0,
            vRot: 0,
            alpha: 1.2,
            gravity: 0.06,
            isSpark: true,
          });
        }

        onGeodeTriggered(bonusStrikes);
        onStrikeUsed(s.strikes);
      }

      // Check wall cleared or mine depleted
      const remainingUnbroken = s.rocks.filter((r) => !r.broken);
      if (remainingUnbroken.length === 0 && !s.isConcluding) {
        s.isConcluding = true;
        playAudio('clear');

        s.floatingTexts.push({
          id: `ft-clear-${Date.now()}`,
          x: s.width / 2,
          y: s.height * 0.45,
          text: 'CAVERN WALL EXCAVATED! ★',
          color: '#38bdf8',
          alpha: 1.6,
          scale: 1.5,
        });

        // Golden spark explosion across the cavern
        for (let i = 0; i < 36; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + Math.random() * 9;
          s.particles.push({
            x: s.width / 2,
            y: s.height * 0.45,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 4 + Math.random() * 5,
            color: Math.random() > 0.5 ? '#38bdf8' : '#fbbf24',
            rot: 0,
            vRot: 0,
            alpha: 1.3,
            gravity: 0.05,
            isSpark: true,
          });
        }

        setTimeout(() => {
          onWallCleared(s.strikes);
        }, 1100);
      } else if (s.strikes <= 0 && !s.isConcluding) {
        s.isConcluding = true;
        setTimeout(() => {
          onMineDepleted();
        }, 900);
      }
    },
    [
      onStrikeUsed,
      onGemRecovered,
      onGeodeTriggered,
      onSlagShattered,
      onWallCleared,
      onMineDepleted,
      selectedPerkIds,
      character,
      cavernTheme,
    ]
  );

  // Progressive 3-Tap Chipping Interaction
  const strikeRock = useCallback(
    (rock: Rock) => {
      const s = stateRef.current;
      if (rock.broken || s.strikes <= 0 || s.isConcluding) return;

      s.totalTapCount++;
      const nextStrikes = s.strikes - 1;
      s.strikes = nextStrikes;
      onStrikeUsed(nextStrikes);

      // Hit damage calculation (sledgehammer perk or volcanic brittleness modifier)
      let damageDealt = 1;
      const isSledgehammer = selectedPerkIds.includes('sledgehammer') && Math.random() < 0.25;
      const isVolcanicBrittleness = cavernTheme.id === 'magma' && Math.random() < 0.2;

      if (isSledgehammer || isVolcanicBrittleness) {
        damageDealt = 2;
        s.floatingTexts.push({
          id: `ft-crit-${Date.now()}-${Math.random()}`,
          x: rock.x,
          y: rock.y - rock.radius * 0.7,
          text: isSledgehammer ? 'HEAVY SLEDGE! (2x DAMAGE)' : 'VOLCANIC CRACK! (2x DAMAGE)',
          color: '#f97316',
          alpha: 1.2,
          scale: 1.1,
        });
      }

      rock.hitsTaken += damageDealt;

      // Tremor Pick perk: Every 4th strike releases a subterranean shockwave damaging neighboring rocks
      if (selectedPerkIds.includes('tremor_pick') && s.totalTapCount % 4 === 0) {
        playAudio('shockwave');
        s.shakeIntensity = 14;
        s.floatingTexts.push({
          id: `ft-tremor-${Date.now()}`,
          x: rock.x,
          y: rock.y + rock.radius * 0.7,
          text: 'TREMOR SHOCKWAVE!',
          color: '#fbbf24',
          alpha: 1.2,
          scale: 1.1,
        });

        for (const neighbor of s.rocks) {
          if (!neighbor.broken && neighbor.id !== rock.id) {
            const dist = Math.hypot(neighbor.x - rock.x, neighbor.y - rock.y);
            if (dist < rock.radius * 2.5) {
              neighbor.hitsTaken += 1;
              if (neighbor.hitsTaken >= neighbor.hitsNeeded) {
                finalizeShatter(neighbor);
              }
            }
          }
        }
      }

      if (rock.hitsTaken >= rock.hitsNeeded) {
        // Hit 3: Full Shatter!
        s.shakeIntensity = 12;
        finalizeShatter(rock);
      } else if (rock.hitsTaken === 2) {
        // Hit 2: Deep fracture (65% exposed interior reveal)
        s.shakeIntensity = 6;
        playAudio('crack', 1 + (Math.random() * 0.2 - 0.1));

        // Spawns rock chips
        for (let i = 0; i < 7; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          s.particles.push({
            x: rock.x,
            y: rock.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: 3 + Math.random() * 4,
            color: rock.rockColor,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            alpha: 1,
            gravity: 0.2,
            isSpark: false,
          });
        }
      } else {
        // Hit 1: Chipped (Initial crack and faint mineral peek)
        s.shakeIntensity = 3;
        playAudio('chip', 1 + (Math.random() * 0.2 - 0.1));

        // Spawns dust particles
        for (let i = 0; i < 4; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 3;
          s.particles.push({
            x: rock.x,
            y: rock.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 2.5 + Math.random() * 3,
            color: '#78716c',
            rot: 0,
            vRot: 0,
            alpha: 0.9,
            gravity: 0.18,
            isSpark: false,
          });
        }
      }

      // If strikes reach zero and not concluding
      if (s.strikes <= 0 && !s.isConcluding && !rock.broken) {
        s.isConcluding = true;
        setTimeout(() => {
          onMineDepleted();
        }, 900);
      }
    },
    [
      onStrikeUsed,
      finalizeShatter,
      onMineDepleted,
      selectedPerkIds,
      cavernTheme,
    ]
  );

  // Mouse / Touch handler
  const handleInteract = useCallback(
    (clientX: number, clientY: number) => {
      if (!isGameActive) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const s = stateRef.current;
      const hitMultiplier = s.width < 640 ? 1.35 : 1.15;
      for (let i = s.rocks.length - 1; i >= 0; i--) {
        const rock = s.rocks[i];
        if (!rock.broken) {
          const dist = Math.hypot(x - rock.x, y - rock.y);
          if (dist <= rock.radius * hitMultiplier) {
            strikeRock(rock);
            break;
          }
        }
      }
    },
    [isGameActive, strikeRock]
  );

  // Canvas resize observer
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.dpr = dpr;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      if (stateRef.current.rocks.length === 0) {
        generateCavernWall();
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    return () => ro.disconnect();
  }, [generateCavernWall]);

  // Re-generate cavern wall when requested
  useEffect(() => {
    if (regenerateTrigger > 0) {
      generateCavernWall();
    }
  }, [regenerateTrigger, generateCavernWall]);

  // Main 60fps render loop with 3-tap visual fracture rendering
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hasKeenInstinct = selectedPerkIds.includes('keen_instinct');

    const render = () => {
      const s = stateRef.current;
      const dpr = s.dpr;

      // Screen shake offset
      let offsetX = 0;
      let offsetY = 0;
      if (s.shakeIntensity > 0) {
        offsetX = (Math.random() - 0.5) * s.shakeIntensity;
        offsetY = (Math.random() - 0.5) * s.shakeIntensity;
        s.shakeIntensity *= 0.82;
        if (s.shakeIntensity < 0.2) s.shakeIntensity = 0;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, s.width, s.height);

      ctx.save();
      ctx.translate(offsetX, offsetY);

      // Thematic cavern background gradient
      const bgGrad = ctx.createRadialGradient(
        s.width * 0.5,
        s.height * 0.45,
        40,
        s.width * 0.5,
        s.height * 0.5,
        Math.max(s.width, s.height) * 0.85
      );
      bgGrad.addColorStop(0, cavernTheme.bgGradStart);
      bgGrad.addColorStop(0.65, cavernTheme.bgGradMid);
      bgGrad.addColorStop(1, cavernTheme.bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, s.width, s.height);

      // Cavern Strata Fissure Lines
      ctx.strokeStyle = `${cavernTheme.accentColor}18`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, s.height * 0.3);
      ctx.bezierCurveTo(
        s.width * 0.35,
        s.height * 0.26,
        s.width * 0.65,
        s.height * 0.34,
        s.width,
        s.height * 0.28
      );
      ctx.moveTo(0, s.height * 0.7);
      ctx.bezierCurveTo(
        s.width * 0.3,
        s.height * 0.74,
        s.width * 0.7,
        s.height * 0.66,
        s.width,
        s.height * 0.72
      );
      ctx.stroke();

      // Render rocks with 3-Tap Progressive Reveal
      for (const rock of s.rocks) {
        if (rock.broken) continue;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // 1. Draw outer rock polygonal body
        ctx.beginPath();
        for (let i = 0; i < rock.vertices.length; i++) {
          const v = rock.vertices[i];
          if (i === 0) ctx.moveTo(rock.x + v.x, rock.y + v.y);
          else ctx.lineTo(rock.x + v.x, rock.y + v.y);
        }
        ctx.closePath();
        ctx.fillStyle = rock.rockColor;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#3f3b38';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 2. PROGRESSIVE REVEAL: Hit 1 (Chipped) and Hit 2 (Fractured)
        if (rock.hitsTaken > 0) {
          const isRevealed = rock.hitsTaken >= 2 || hasKeenInstinct;
          const windowRadius = rock.radius * (rock.hitsTaken === 1 && !hasKeenInstinct ? 0.32 : 0.65);

          // Interior revealed cavity
          ctx.save();
          ctx.beginPath();
          ctx.arc(rock.x, rock.y, windowRadius, 0, Math.PI * 2);
          ctx.clip();

          // Dark interior cavity backplate
          ctx.fillStyle = '#141210';
          ctx.fill();

          // Reveal interior content
          if (rock.type === 'GEM' && rock.gem) {
            // Crystalline gemstone facets exposed
            ctx.beginPath();
            const gRadius = windowRadius * 0.85;
            const sides = 6;
            for (let i = 0; i < sides; i++) {
              const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const gx = rock.x + Math.cos(a) * gRadius;
              const gy = rock.y + Math.sin(a) * gRadius;
              if (i === 0) ctx.moveTo(gx, gy);
              else ctx.lineTo(gx, gy);
            }
            ctx.closePath();
            ctx.fillStyle = rock.gem.color;
            ctx.shadowColor = rock.gem.color;
            ctx.shadowBlur = isRevealed ? 12 : 6;
            ctx.fill();

            // Gem facet lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Gem facet specular glint
            ctx.beginPath();
            ctx.arc(rock.x - gRadius * 0.3, rock.y - gRadius * 0.3, gRadius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.fill();
          } else if (rock.type === 'GEODE') {
            // Golden hollow crystal geode interior
            ctx.beginPath();
            ctx.arc(rock.x, rock.y, windowRadius * 0.85, 0, Math.PI * 2);
            ctx.fillStyle = '#78350f';
            ctx.fill();

            // Sparkling inner golden geode druzy
            ctx.beginPath();
            ctx.arc(rock.x, rock.y, windowRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            // Slag: coarse dark charcoal stone core
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(rock.x - windowRadius, rock.y - windowRadius, windowRadius * 2, windowRadius * 2);
            ctx.strokeStyle = '#292524';
            ctx.lineWidth = 2;
            ctx.strokeRect(rock.x - windowRadius * 0.6, rock.y - windowRadius * 0.6, windowRadius * 1.2, windowRadius * 1.2);
          }
          ctx.restore();

          // 3. Draw Jagged Fracture Cracks on rock face
          ctx.strokeStyle = cavernTheme.fissureColor || '#44403c';
          ctx.lineWidth = rock.hitsTaken >= 2 ? 2.5 : 1.5;
          ctx.beginPath();
          rock.fissures.forEach((f, fIdx) => {
            if (rock.hitsTaken === 1 && fIdx > 1) return;
            ctx.moveTo(rock.x + f.x1, rock.y + f.y1);
            ctx.lineTo(rock.x + (f.x1 + f.x2) * 0.5 + (Math.random() * 2 - 1), rock.y + (f.y1 + f.y2) * 0.5);
            ctx.lineTo(rock.x + f.x2, rock.y + f.y2);
          });
          ctx.stroke();

          // 4. Hit indicator pips (e.g. 1/3 or 2/3 dots)
          const pipSize = 3;
          const pipsY = rock.y + rock.radius * 0.85;
          for (let p = 0; p < rock.hitsNeeded; p++) {
            const pipX = rock.x + (p - 1) * 8;
            ctx.beginPath();
            ctx.arc(pipX, pipsY, pipSize, 0, Math.PI * 2);
            ctx.fillStyle = p < rock.hitsTaken ? '#f59e0b' : 'rgba(68, 64, 60, 0.6)';
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Draw particle rubble & sparks
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.vRot;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.isSpark) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      // Draw floating text notifications
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 1.3;
        ft.alpha -= 0.015;

        if (ft.alpha <= 0) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        const fontSize = Math.round(17 * (ft.scale || 1));
        ctx.font = `bold ${fontSize}px "Outfit", monospace, sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cavernTheme, selectedPerkIds]);

  return (
    <div
      ref={containerRef}
      id="mining-stage"
      className="relative w-full h-full touch-none select-none cursor-crosshair overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        id="cavern-canvas"
        className="block w-full h-full"
        onMouseDown={(e) => handleInteract(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.changedTouches.length > 0) {
            const t = e.changedTouches[0];
            handleInteract(t.clientX, t.clientY);
          }
        }}
      />
    </div>
  );
};
