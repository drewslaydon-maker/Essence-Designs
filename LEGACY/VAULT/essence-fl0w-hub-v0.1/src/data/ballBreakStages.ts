import { StageDefinition, MaterialTierInfo } from '../types/ballBreak';

export const MATERIAL_TIERS: MaterialTierInfo[] = [
  {
    tier: 0,
    minSpeed: 0,
    name: 'Inert / Sub-Speed',
    color: '#38bdf8', // Light cyan
    glowColor: 'rgba(56, 189, 248, 0.4)',
    tailColor: '#0284c7',
    breaks: 'none',
    description: 'Harmless ricochets. Leaves tiny scuffs on glass.',
  },
  {
    tier: 1,
    minSpeed: 9,
    name: 'Glass Breaker',
    color: '#fbbf24', // Amber / Electric Yellow
    glowColor: 'rgba(251, 191, 36, 0.7)',
    tailColor: '#d97706',
    breaks: 'glass',
    description: 'Shatters Glass in 1 hit! (Takes 4 hits to crack Wood)',
  },
  {
    tier: 2,
    minSpeed: 15,
    name: 'Wood Breaker',
    color: '#f97316', // Fiery Flame Orange / Crimson
    glowColor: 'rgba(249, 115, 22, 0.85)',
    tailColor: '#ea580c',
    breaks: 'wood',
    description: 'Splinters Wood in 1 hit! (Takes 4 hits to crack Stone)',
  },
  {
    tier: 3,
    minSpeed: 21,
    name: 'Stone Pulverizer',
    color: '#c084fc', // Radiant Violet / Plasma White
    glowColor: 'rgba(192, 132, 252, 0.95)',
    tailColor: '#9333ea',
    breaks: 'stone',
    description: 'Pulverizes solid Stone Monoliths in 1 devastating shockwave!',
  },
];

export const BALL_BREAK_STAGES: StageDefinition[] = [
  {
    id: 0,
    name: 'Feel & Kinetic Sandbox',
    subtitle: 'Open Slingshot Arena (Phase 1 Feel)',
    description: 'Logarithmic tension dampening, elliptical deformation under stretch, dual-band cyan-to-amber shift, predictive trajectory beads, and procedural Web Audio.',
    parTime: 999,
    starScoreThresholds: [1000, 2500, 5000],
    obstacles: [
      { id: 'demo_g1', x: 130, y: 160, width: 50, height: 26, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'demo_w1', x: 210, y: 130, width: 50, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 300 },
      { id: 'demo_s1', x: 290, y: 160, width: 50, height: 26, material: 'stone', maxHealth: 100, maxCracks: 4, points: 600 },
    ],
    pinballElements: [
      { id: 'demo_b1', type: 'bumper', x: 160, y: 320, radius: 26, impulse: 10 },
      { id: 'demo_b2', type: 'bumper', x: 310, y: 320, radius: 26, impulse: 10 },
    ],
  },
  {
    id: 1,
    name: 'Stage 1: Crystal Gallery',
    subtitle: 'Glass Shatter Fundamentals',
    description: 'Aim your slingshot and build Tier 1 velocity to shatter the fragile glass panes.',
    parTime: 25,
    starScoreThresholds: [1500, 2500, 3800],
    obstacles: [
      // Upper glass arch
      { id: 'g1', x: 120, y: 150, width: 48, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g2', x: 180, y: 130, width: 48, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g3', x: 240, y: 130, width: 48, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g4', x: 300, y: 150, width: 48, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      // Central cluster
      { id: 'g5', x: 150, y: 220, width: 50, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g6', x: 270, y: 220, width: 50, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g7', x: 185, y: 280, width: 45, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
      { id: 'g8', x: 240, y: 280, width: 45, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 150 },
    ],
    pinballElements: [
      { id: 'b1', type: 'bumper', x: 150, y: 360, radius: 26, impulse: 9 },
      { id: 'b2', type: 'bumper', x: 320, y: 360, radius: 26, impulse: 9 },
      { id: 'b3', type: 'bumper', x: 235, y: 430, radius: 28, impulse: 10 },
    ],
  },
  {
    id: 2,
    name: 'Stage 2: Timber Run',
    subtitle: 'Speed Strips & Wood Splintering',
    description: 'Use the neon speed pads to surge into Tier 2 Flame momentum and blast through timber barricades!',
    parTime: 32,
    starScoreThresholds: [2800, 4200, 6000],
    obstacles: [
      // Wood front-line
      { id: 'w1', x: 110, y: 200, width: 60, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 350 },
      { id: 'w2', x: 190, y: 180, width: 90, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 350 },
      { id: 'w3', x: 300, y: 200, width: 60, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 350 },
      // Protected Glass behind wood
      { id: 'g1', x: 135, y: 130, width: 50, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      { id: 'g2', x: 210, y: 115, width: 50, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      { id: 'g3', x: 285, y: 130, width: 50, height: 24, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      // Side wood pillars
      { id: 'w4', x: 120, y: 280, width: 45, height: 35, material: 'wood', maxHealth: 100, maxCracks: 4, points: 350 },
      { id: 'w5', x: 305, y: 280, width: 45, height: 35, material: 'wood', maxHealth: 100, maxCracks: 4, points: 350 },
    ],
    pinballElements: [
      { id: 'pad1', type: 'boost_pad', x: 130, y: 440, width: 40, height: 65, impulse: 14, angle: 0 },
      { id: 'pad2', type: 'boost_pad', x: 340, y: 440, width: 40, height: 65, impulse: 14, angle: 0 },
      { id: 'b1', type: 'bumper', x: 235, y: 330, radius: 26, impulse: 10 },
      { id: 'b2', type: 'bumper', x: 235, y: 240, radius: 22, impulse: 9 },
    ],
  },
  {
    id: 3,
    name: 'Stage 3: Quarry Monoliths',
    subtitle: 'Stone Density & Stress Fractures',
    description: 'Hit massive stone monoliths at Tier 3 to pulverize them instantly, or land 3-4 Tier 2 crack hits!',
    parTime: 40,
    starScoreThresholds: [4500, 7000, 9500],
    obstacles: [
      // Heavy Stone Monoliths
      { id: 's1', x: 130, y: 140, width: 65, height: 45, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1000 },
      { id: 's2', x: 275, y: 140, width: 65, height: 45, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1000 },
      { id: 's3', x: 200, y: 90, width: 70, height: 45, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1000 },
      // Wood supports
      { id: 'w1', x: 140, y: 240, width: 55, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 400 },
      { id: 'w2', x: 275, y: 240, width: 55, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 400 },
      // Glass core
      { id: 'g1', x: 210, y: 190, width: 50, height: 26, material: 'glass', maxHealth: 100, maxCracks: 4, points: 250 },
    ],
    pinballElements: [
      { id: 'b1', type: 'bumper', x: 150, y: 350, radius: 28, impulse: 16 },
      { id: 'b2', type: 'bumper', x: 320, y: 350, radius: 28, impulse: 16 },
      { id: 'b3', type: 'bumper', x: 235, y: 410, radius: 30, impulse: 18 },
      { id: 'pad1', type: 'boost_pad', x: 215, y: 470, width: 40, height: 50, impulse: 20, angle: 0 },
      { id: 'pad2', type: 'boost_pad', x: 75, y: 290, width: 34, height: 50, impulse: 18, angle: 15 },
      { id: 'pad3', type: 'boost_pad', x: 360, y: 290, width: 34, height: 50, impulse: 18, angle: -15 },
    ],
  },
  {
    id: 4,
    name: 'Stage 4: Pinball Gauntlet',
    subtitle: 'Ricochet Momentum Stacking',
    description: 'String together bumper ricochets to stack combo multipliers and conquer mixed obstacle tiers!',
    parTime: 45,
    starScoreThresholds: [6000, 9500, 13000],
    obstacles: [
      // Top Stone Bastion
      { id: 's1', x: 160, y: 80, width: 60, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1100 },
      { id: 's2', x: 250, y: 80, width: 60, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1100 },
      // Wood Flanks
      { id: 'w1', x: 90, y: 170, width: 50, height: 30, material: 'wood', maxHealth: 100, maxCracks: 4, points: 450 },
      { id: 'w2', x: 330, y: 170, width: 50, height: 30, material: 'wood', maxHealth: 100, maxCracks: 4, points: 450 },
      { id: 'w3', x: 205, y: 220, width: 60, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 450 },
      // Glass Ring
      { id: 'g1', x: 100, y: 280, width: 45, height: 22, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      { id: 'g2', x: 325, y: 280, width: 45, height: 22, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      { id: 'g3', x: 160, y: 310, width: 45, height: 22, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
      { id: 'g4', x: 265, y: 310, width: 45, height: 22, material: 'glass', maxHealth: 100, maxCracks: 4, points: 200 },
    ],
    pinballElements: [
      { id: 'b1', type: 'bumper', x: 140, y: 230, radius: 24, impulse: 11 },
      { id: 'b2', type: 'bumper', x: 330, y: 230, radius: 24, impulse: 11 },
      { id: 'b3', type: 'bumper', x: 235, y: 150, radius: 26, impulse: 12 },
      { id: 'pad1', type: 'boost_pad', x: 100, y: 440, width: 38, height: 60, impulse: 15, angle: 15 },
      { id: 'pad2', type: 'boost_pad', x: 332, y: 440, width: 38, height: 60, impulse: 15, angle: -15 },
    ],
  },
  {
    id: 5,
    name: 'Stage 5: Citadel of Elements',
    subtitle: 'The Triple Ring Fortress',
    description: 'Breach the outer Stone Monolith wall to crack the Wood inner sanctum and obliterate the Glass power heart!',
    parTime: 55,
    starScoreThresholds: [8000, 13000, 18000],
    obstacles: [
      // Outer Stone Wall (4 Monoliths)
      { id: 's1', x: 90, y: 90, width: 65, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1200 },
      { id: 's2', x: 175, y: 70, width: 60, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1200 },
      { id: 's3', x: 245, y: 70, width: 60, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1200 },
      { id: 's4', x: 315, y: 90, width: 65, height: 35, material: 'stone', maxHealth: 100, maxCracks: 4, points: 1200 },
      // Middle Wood Wall
      { id: 'w1', x: 130, y: 150, width: 60, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 500 },
      { id: 'w2', x: 280, y: 150, width: 60, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 500 },
      { id: 'w3', x: 160, y: 220, width: 50, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 500 },
      { id: 'w4', x: 260, y: 220, width: 50, height: 26, material: 'wood', maxHealth: 100, maxCracks: 4, points: 500 },
      // Inner Sacred Glass Relics
      { id: 'g1', x: 205, y: 130, width: 60, height: 25, material: 'glass', maxHealth: 100, maxCracks: 4, points: 300 },
      { id: 'g2', x: 215, y: 175, width: 40, height: 25, material: 'glass', maxHealth: 100, maxCracks: 4, points: 300 },
    ],
    pinballElements: [
      { id: 'pad1', type: 'boost_pad', x: 215, y: 470, width: 40, height: 60, impulse: 18, angle: 0 },
      { id: 'b1', type: 'bumper', x: 130, y: 310, radius: 26, impulse: 12 },
      { id: 'b2', type: 'bumper', x: 340, y: 310, radius: 26, impulse: 12 },
      { id: 'b3', type: 'bumper', x: 235, y: 360, radius: 28, impulse: 13 },
    ],
  },
];

// Helper to generate an endless random layout in the sandbox
export function generateSandboxStage(): StageDefinition {
  const obstacles: any[] = [];
  const materials: ('glass' | 'wood' | 'stone')[] = ['glass', 'glass', 'wood', 'wood', 'stone'];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (Math.random() > 0.25) {
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const pts = mat === 'glass' ? 150 : mat === 'wood' ? 400 : 1000;
        obstacles.push({
          id: `rand_${r}_${c}`,
          x: 95 + c * 70,
          y: 80 + r * 55,
          width: 52,
          height: 26,
          material: mat,
          maxHealth: 100,
          maxCracks: 4,
          points: pts,
        });
      }
    }
  }

  return {
    id: 999,
    name: 'Destruction Sandbox (Infinite)',
    subtitle: 'Free Kinetic Physics Playground',
    description: 'Dynamic regenerating playground. Test slingshots, joystick steering, and threshold destruction freely.',
    parTime: 999,
    starScoreThresholds: [5000, 10000, 20000],
    obstacles,
    pinballElements: [
      { id: 'b1', type: 'bumper', x: 150, y: 340, radius: 26, impulse: 11 },
      { id: 'b2', type: 'bumper', x: 320, y: 340, radius: 26, impulse: 11 },
      { id: 'b3', type: 'bumper', x: 235, y: 410, radius: 28, impulse: 12 },
      { id: 'pad1', type: 'boost_pad', x: 215, y: 480, width: 40, height: 60, impulse: 16, angle: 0 },
    ],
  };
}

export const INITIAL_BALL_BREAK_PROGRESS: import('../types/ballBreak').BallBreakProgress = {
  unlockedStageMax: 1,
  stageRecords: {},
  totalGlassSmashed: 0,
  totalWoodSmashed: 0,
  totalStoneSmashed: 0,
  lifetimeScore: 0,
  highestSpeed: 0,
  highestCombo: 0,
};
