import { AgentProfile, Ticket, SprintGoal, GitRepoState } from '../types';

export const INITIAL_AGENTS: AgentProfile[] = [
  {
    id: 'drew',
    name: 'Drew Slaydon',
    title: 'Human Director & Creator',
    realm: 'sovereign',
    rune: 'ᛟ',
    runeName: 'Othala (Sovereignty & Heritage)',
    avatarSymbol: '👑',
    description: 'Human Director, Visionary, and Creator of JOURNEYS UNTO, Ball Break, and the ESSENCE FL0W Hub. Final arbiter of mechanics, pacing, story lore, and production standards.',
    specialties: ['Game Design & Direction', 'Kinematic & Momentum Architecture', 'Master Lore Canon', 'Goal & Milestone Setting'],
    status: 'online',
    color: {
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/30',
      glow: 'glow-rune-gold',
    },
  },
  {
    id: 'juju',
    name: 'Juju',
    title: 'Reality Anchor & Copilot',
    realm: 'sovereign',
    rune: 'ᛞ',
    runeName: 'Dagaz (Awakening & Equilibrium)',
    avatarSymbol: '🛡️',
    description: 'Reality Anchor, Grounding Copilot, and Emotional Center. Keeps the studio centered, checks assumptions, preserves emotional clarity, and ensures creation remains authentic and grounded.',
    specialties: ['Reality Anchoring & Stillness', 'Assumption & Vibe Verification', 'Emotional Equilibrium', 'Strategic Balance'],
    status: 'online',
    color: {
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      bg: 'bg-purple-950/30',
      glow: 'glow-rune-violet',
    },
  },
  {
    id: 'wave',
    name: 'THE_WAVE / WAKE',
    title: 'Head Cleaner & Gatekeeper',
    realm: 'cloud',
    rune: 'ᛉ',
    runeName: 'Algiz (Sanctuary & Cleanroom Bridge)',
    avatarSymbol: '🌊',
    description: 'High-Level Strategic & Cleanroom Bridge (Head Cleaner & Gatekeeper). Directly checks off directives with Human Director Drew Slaydon before dispatching to MP. Audits code purity, memory leak hazards, deterministic frame pacing, and certifies Verification Gates before sovereign merge.',
    specialties: ['Cleanroom Verification Gate Audits', 'Drew <-> WAKE Strategic Bridge', 'Touch Event Memory Leak Analysis', 'Deterministic 60 FPS Pacing', 'JOURNEYS UNTO Module Isolation'],
    status: 'online',
    color: {
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      glow: 'glow-rune',
    },
  },
  {
    id: 'mp',
    name: 'WebDev / MP',
    title: 'Sovereign Implementation & Sandbox Harness',
    realm: 'sovereign',
    rune: 'ᛗ',
    runeName: 'Mannaz (Master Mind & Implementation)',
    avatarSymbol: '⚡',
    description: 'Sovereign Implementation & Sandbox Harness Lead (AI Studio / Gemini 3.8 Flash). Holds direct filesystem write and execution clearance. Directly inspects, implements, and refactors pure ES6 game engines, executes deterministic verification gates (JRN-204 AABB sliding), manages GitHub Pages assets, and maintains repository integrity.',
    specialties: ['Sovereign Codebase Writing & Refactoring', 'Deterministic Kinematics (JRN-204)', 'AABB Spatial Collision Engines', 'Zero-Jitter Corner & Seam Solvers', 'GitHub Pages Standalone HTML Deployment'],
    status: 'online',
    color: {
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/30',
      glow: 'glow-rune-emerald',
    },
  },
  {
    id: 'mechanic',
    name: 'THE MECHANIC',
    title: 'Kinetic Forge & Math Specialist',
    realm: 'local',
    rune: 'ᛒ',
    runeName: 'Berkano (Kinetic Forge & Inception)',
    avatarSymbol: '⚙️',
    description: 'Gameplay Engine & Math Specialist. Assists MP with continuous collision detection, particle velocity vectors, and responsive canvas renderers.',
    specialties: ['Kinetic Math Formulas', 'Entity & Scene Graph Architecture', 'Trauma Shake Equations', 'Character Controller Kinematics'],
    status: 'online',
    color: {
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      glow: 'glow-rune-emerald',
    },
  },
  {
    id: 'qa',
    name: 'THE SENTINEL (QA)',
    title: 'Inspector & Playtest Arbiter',
    realm: 'local',
    rune: 'ᛇ',
    runeName: 'Eihwaz (Resilience & Vigilance)',
    avatarSymbol: '🛡️',
    description: 'Quality Assurance & Mobile Inspection. Profiles mobile viewports, audits touch targets, and asserts gameplay invariants across all devices.',
    specialties: ['Mobile Viewport & Overflow Tests', 'Touch Target (44px) Verification', 'Mobile Audio Gesture Checks', 'Cross-Device Playtesting'],
    status: 'online',
    color: {
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20',
      glow: 'glow-rune',
    },
  },
  {
    id: 'au',
    name: 'THE AUDITOR (AU)',
    title: 'Kinematic & Invariant Arbiter',
    realm: 'sovereign',
    rune: 'ᛟ',
    runeName: 'Othala (Truth & Invariant Sanctuary)',
    avatarSymbol: '⚖️',
    description: 'Cleanroom Invariant Auditor for ESSENCE FL0W v0.1. Validates mathematical contracts, audio gain floors, non-blocking telemetry payloads, and headless Monte Carlo simulations.',
    specialties: ['Invariant Contracts (AU-01 through AU-04)', 'Deterministic Cleanroom Headless Tests', 'Safe Web Audio Ramps', 'Telemetry Envelope Size Bounds'],
    status: 'online',
    color: {
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      glow: 'glow-rune-cyan',
    },
  },
];

export const INITIAL_GOAL: SprintGoal = {
  id: 'goal-essence-v2',
  title: 'JOURNEYS UNTO: The Greedy Greens — Inciting Ambush (v0.2)',
  subtitle: 'Vertical Slice Active: The Greedy Greens Tavern Diorama [Bozog Solo]',
  description: 'Constituting Master Lore Bible v0.2. Setting: The Greedy Greens (battered pirate dive bar at the Docks of Delain). Bozog explores solo, engages Atreyu in the 3-round drinking contest, triggers the Black Knight ambush, and faces the standoff choice matrix.',
  targetFPS: 60,
  currentAvgFPS: 60,
  targetPurityScore: 100,
  currentPurityScore: 100,
  milestoneConstellation: 'The Greedy Greens: Inciting Ambush & Triad Gameplay',
  keyDirectives: [
    'LORE BIBLE V0.2: Enforce The Greedy Greens as the canonical start (NOT a random chamber)',
    'PARTY DISCIPLINE: Bozog explores SOLO; 4-man follow train locks until post-ambush pact',
    '3-ROUND DRINKING CONTEST: Real-time button mash against Atreyu with smack-talk triggers',
    'INCITING AMBUSH: Black Knights crash through reinforced south oak doors with trauma shake',
    'STANDOFF MATRIX: 3 distinct tactical choices (Bozog roar, Kairon dissonance, Matchstick shadow)',
  ],
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'JRN-205',
    title: 'Declarative Environment Contract: The Greedy Greens (Tavern Diorama)',
    project: 'journeys_unto',
    objective: 'Reconstitute the prologue starting room from a generic chamber into The Greedy Greens tavern diorama (640x360). Implement automatic boundary containment, mahogany bar counter, ramshackle stage, corner booth, and reinforced south oak doors.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛗ Mannaz (Master Mind & Architecture)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Constitutes The Greedy Greens layout: West Bar, North-East Stage, North-West Booth, South Oak Doors', completed: true },
      { id: 'c2', text: 'Bozog navigates SOLO with no phantom party train followers during prologue exploration', completed: true },
      { id: 'c3', text: 'AABB spatial boundaries prevent clipping outside tavern walls and behind heavy counter', completed: true },
      { id: 'c4', text: 'Retro diorama styling with whale-oil lanterns, grog casks, and Delain mist ambient palette', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Arena Bounds: 640x360. Player starts at (320, 220). Spatial Colliders: West Bar Counter [36, 80, 72, 200], Stage [420, 44, 180, 80], Corner Booth [128, 44, 90, 70], South Oak Doors [270, 320, 100, 32].',
    localDispatchCommand: 'node tests/physics/JRN205_GreedyGreens_Arena.test.js',
    branch: 'feat/jrn-205-greedy-greens-diorama',
    purityScore: 100,
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:05:00Z',
    oracleProphecy: 'The dive bar of Delain is where iron wills clash and the saga truly ignites.',
  },
  {
    id: 'JRN-206',
    title: 'The Greedy Greens NPCs & Canon Party Placement',
    project: 'journeys_unto',
    objective: 'Place the 3 canon party members in their designated tavern positions: Atreyu at West Counter, Kairon on North-East Stage, Matchstick in North-West Corner Booth. Provide Deltarune-style typewriter interaction triggers.',
    status: 'cleanroom',
    priority: 'High',
    targetAgent: 'mp',
    runeAffinity: 'ᛈ Perthro (Blueprint Vision)',
    difficultyRank: 'Adept',
    acceptanceCriteria: [
      { id: 'c1', text: 'Atreyu placed at (120, 150) with lunar arcanist crest and drinking contest prompt', completed: true },
      { id: 'c2', text: 'Kairon placed at (510, 84) with hell-blood horns and rock guitar riff inspect', completed: true },
      { id: 'c3', text: 'Matchstick placed at (170, 70) with outlander duster and pocket mirror reflection inspect', completed: true },
      { id: 'c4', text: 'Interaction radius (48px) with [Z] / [Space] prompt popup and distinct audio chime', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Proximity check: dist(avatar, npc) <= 48.0 triggers HUD prompt and unlocks inspect action.',
    localDispatchCommand: 'node tests/gameplay/JRN206_Tavern_NPCs.test.js',
    branch: 'feat/jrn-206-tavern-npcs',
    purityScore: 100,
    createdAt: '2026-09-03T11:05:00Z',
    updatedAt: '2026-09-03T11:10:00Z',
    oracleProphecy: 'The four wanderers gather under Bozog’s roof, unaware that order draws near.',
  },
  {
    id: 'JRN-207',
    title: '3-Round Arcade Drinking Contest Mechanic (Bozog vs Atreyu)',
    project: 'journeys_unto',
    objective: 'Implement the arcade-style 3-round button-mash contest between Bozog and Atreyu at the main counter. Real-time tension meter, decay rates, and smack-talk dialogue triggers at 25%, 50%, 75%, 100% tension.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛏ Tiwaz (Contest of Will)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Round 1 (Warmup Ale), Round 2 (Docks Navy Rum), Round 3 (Moon-Cask Spirit)', completed: true },
      { id: 'c2', text: 'Rapid [Z] / [Space] mash fills tension bar with dynamic decay rate: tension -= decay * dt', completed: true },
      { id: 'c3', text: 'Real-time smack-talk bubbles fire between Bozog and Atreyu at 25%, 50%, 75%, 100%', completed: true },
      { id: 'c4', text: 'Victory triggers tavern cheer and party morale boost; defeat inflicts sway daze effect', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Tension dynamics: dT/dt = (mashEvents * MASH_POWER) - (DECAY_RATES[round] * BASE_DECAY). Clamped [0, 100].',
    localDispatchCommand: 'node tests/gameplay/JRN207_Drinking_Contest.test.js',
    branch: 'feat/jrn-207-drinking-contest',
    purityScore: 100,
    createdAt: '2026-09-03T11:10:00Z',
    updatedAt: '2026-09-03T11:15:00Z',
    oracleProphecy: 'Grog burns the throat while lunar silver sharpens the mind.',
  },
  {
    id: 'JRN-208',
    title: 'Inciting Ambush Event & Black Knight Standoff Matrix',
    project: 'journeys_unto',
    objective: 'Implement the cinematic ambush sequence: Black Knights of Order breach the south oak doors with quadratic trauma shake. Present the 3-option tactical standoff choice matrix (Bozog roar, Kairon dissonance, Matchstick shadow).',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛒ Berkano (Catalyst of Conflict)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Breach event triggers trauma screen shake: offset = max_angle * (trauma^2) * sin(time)', completed: true },
      { id: 'c2', text: 'Splintered door visual state and 3 Black Knight Inquisitor sprites enter the south threshold', completed: true },
      { id: 'c3', text: 'Tactical standoff UI appears with 3 distinct character choices and mechanical consequences', completed: true },
      { id: 'c4', text: 'Following resolution, party pact forms and unlocks the 4-man follow-train for dock departure', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Trauma decay: trauma = Math.max(0, trauma - DECAY_RATE * dt); Shake X = (Math.random()*2-1)*MAX_OFFSET*(trauma^2).',
    localDispatchCommand: 'node tests/gameplay/JRN208_Inciting_Ambush.test.js',
    branch: 'feat/jrn-208-inciting-ambush',
    purityScore: 100,
    createdAt: '2026-09-03T11:15:00Z',
    updatedAt: '2026-09-03T11:20:00Z',
    oracleProphecy: 'The iron heel of Order splinters the oak, and the four are bound by fire and debt.',
  },
  {
    id: 'JRN-204',
    title: 'AABB Spatial Boundaries & Axis-Separated Wall Sliding',
    project: 'journeys_unto',
    objective: 'Integrate static AABB collision resolution into the top-down kinematic controller using an axis-separated Euler pipeline. Enable frictionless wall-sliding, eliminate corner-snagging, and verify via deterministic test scenarios.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛗ Mannaz (Master Mind & Architecture)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Gate 2.1 (45° Wall-Slide): vx drops to 0.0, vy conserved at 300.0, snaps flush to (100 - footprint.w - 0.01)', completed: true },
      { id: 'c2', text: 'Gate 2.2 (90° Concave Corner Pinning): Position delta over 60 frames identically (0,0) with zero jitter', completed: true },
      { id: 'c3', text: 'Gate 2.3 (Zero-Epsilon Breakaway): Avatar disengages on tick 1 with zero sticky delay', completed: true },
      { id: 'c4', text: 'Gate 2.4 (Flush-Seam Traversal): Slide entity across abutting boxes at Y=50 seam with zero snagging', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Axis-Separated Euler: Phase X (x+=vx*dt, snap X to boundary - 0.01, vx=0); Phase Y (y+=vy*dt, snap Y to boundary - 0.01, vy=0). Strict open-interval overlap predicate.',
    localDispatchCommand: 'node tests/physics/JRN204_AABB_Sliding.test.js',
    branch: 'feat/jrn-204-aabb-wall-slide',
    purityScore: 100,
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-03T10:15:00Z',
    oracleProphecy: 'The boundary is honored, yet the momentum flows unhindered along the plane.',
  },
  {
    id: 'JRN-209',
    title: 'Arcade Drinking Duel State Machine & Kinematics (Bozog vs Atreyu)',
    project: 'journeys_unto',
    objective: 'Implement the arcade drinking duel state machine: PRE_DUEL -> COUNTDOWN -> ACTIVE_DRINK -> ROUND_SETTLE -> ROUND_3_CLIMAX with sub-90ms CHOKE_REBOUND spam guard. Enforce [0.000, 1.000] volume clamping, dynamic AI rubber-banding, hit-stop 120ms, and quadratic camera shake.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛏ Tiwaz (Contest of Will & Flow)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Normalized volumes V_bozog, V_atreyu strictly clamped in [0.000, 1.000] with -0.085 drain per valid tap', completed: true },
      { id: 'c2', text: 'Input spam guard triggers CHOKE_REBOUND on < 90ms taps with 250ms lockout and froth jitter', completed: true },
      { id: 'c3', text: 'Round 3 rubber-banding dynamically scales AI drain rate for a razor-thin photo finish', completed: true },
      { id: 'c4', text: 'Climax execution features 120ms hit-stop, table slam trauma linear decay T = max(0, T - 2.5*dt), and 1.4 -> 1.0 elastic banner overshoot', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'dV_atreyu/dt = -(r_base + r_clutch * (1.0 - V_bozog)); Trauma T(t) = max(0, T - 2.5*dt); Shake = Random(-1,1)*16px*(T^2).',
    localDispatchCommand: 'node tests/invariants/M1_MasterManifest.test.js',
    branch: 'feat/jrn-209-drinking-duel',
    purityScore: 100,
    createdAt: '2026-09-03T12:00:00Z',
    updatedAt: '2026-09-03T12:15:00Z',
    oracleProphecy: 'The flagons clash beneath the Delain lanterns, and two titans test the limits of mortality.',
  },
  {
    id: 'JRN-210',
    title: 'JRPG Dialogue Pacer & Universal Two-Tap Input Buffer',
    project: 'journeys_unto',
    objective: 'Implement typewriter cadence with 25ms base char delay, +150ms clause pause, +350ms terminal pause. Universal Two-Tap Contract: Tap 1 completes typewriter stream; Tap 2 advances node. Render bobbing prompt indicator exclusively in AWAITING_INPUT.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᚨ Ansuz (Breath of Wisdom & Voice)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Typewriter pauses for punctuation (+150ms clause, +350ms terminal) for natural narrative cadence', completed: true },
      { id: 'c2', text: 'Two-Tap Input contract: Tap 1 dumps buffer instantly, Tap 2 advances node', completed: true },
      { id: 'c3', text: 'Bobbing indicator ▼ [TAP / SPACE] pulses at Y = Y_anchor + sin(6.0*t)*4px exclusively during AWAITING_INPUT', completed: true },
      { id: 'c4', text: 'AU-02 Invariant: 50 rapid taps within 500ms advances exactly 1 node with zero frame drop or state corruption', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Prompt Y = Y_anchor + sin(6.0 * t) * 4px; Alpha = 0.80 + 0.20 * cos(6.0 * t); Debounce window = 60ms.',
    localDispatchCommand: 'node tests/invariants/M1_MasterManifest.test.js',
    branch: 'feat/jrn-210-dialogue-pacer',
    purityScore: 100,
    createdAt: '2026-09-03T12:05:00Z',
    updatedAt: '2026-09-03T12:20:00Z',
    oracleProphecy: 'The spoken decree rings once, yet settles deep into the memory of the listener.',
  },
  {
    id: 'JRN-211',
    title: 'State-Contact Web Audio Controller & RangeError Safety Floor',
    project: 'journeys_unto',
    objective: 'Construct native Web Audio graph with BGM and SFX channels across StageGains 1..4. Enforce strict AU-03 safety floor (target >= 0.0001) on all exponential ramps to prevent RangeError. Handle Hearth, Duel Crossfade, Sudden Silence, and Ambush Crash ducking.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᚲ Kaunan (Resonant Hearth Flame)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'AU-03 Invariant: All exponential gain ramps clamped to >= 0.0001 floor before discrete cutoff, preventing RangeError', completed: true },
      { id: 'c2', text: 'Stage 1 Hearth loop, Stage 2 Duel crossfade (1.2s linear ramp to G1=0.3, G2=1.0)', completed: true },
      { id: 'c3', text: 'Stage 3 Sudden silence with 80ms anti-pop decay and center-panned wooden footstep with 1.8s tail', completed: true },
      { id: 'c4', text: 'Stage 4 Ambush crash transient with -6dB master gain ducking for 2000ms', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'safeExponentialRamp: clampedTarget = max(0.0001, target); Master ducking = currentGain * 0.50118 (-6dB).',
    localDispatchCommand: 'node tests/invariants/M1_MasterManifest.test.js',
    branch: 'feat/jrn-211-tavern-audio-graph',
    purityScore: 100,
    createdAt: '2026-09-03T12:10:00Z',
    updatedAt: '2026-09-03T12:25:00Z',
    oracleProphecy: 'In absolute silence, even the weight of a wooden heel carries the portent of war.',
  },
  {
    id: 'JRN-212',
    title: 'Juju Shared Server Anchor & Low-Latency Telemetry Beacon',
    project: 'journeys_unto',
    objective: 'Design and deploy lightweight non-blocking telemetry envelope (< 256 bytes) transmitting game state anchors to /api/telemetry/juju-anchor via navigator.sendBeacon with fetch fallback.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛇ Eihwaz (Axis Mundi / Telemetry Anchor)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Telemetry envelope schema strictly under 256 bytes total payload size', completed: true },
      { id: 'c2', text: 'Non-blocking navigator.sendBeacon dispatch with keepalive fetch fallback', completed: true },
      { id: 'c3', text: 'Server-side circular telemetry buffer retaining recent anchor envelopes for diagnostics', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'ByteSize(JSON.stringify(envelope)) < 256 bytes; VibeVector: { intensity: [0, 1], tension: [0, 1] }.',
    localDispatchCommand: 'node tests/invariants/M1_MasterManifest.test.js',
    branch: 'feat/jrn-212-juju-anchor',
    purityScore: 100,
    createdAt: '2026-09-03T12:15:00Z',
    updatedAt: '2026-09-03T12:30:00Z',
    oracleProphecy: 'The thread stretches across the void, recording the pulse of every soul in the tavern.',
  },
  {
    id: 'JRN-213',
    title: 'Auditor Matrix: Invariant Verification Suite (AU-01 through AU-04)',
    project: 'journeys_unto',
    objective: 'Implement comprehensive cleanroom headless test suite verifying all Master Manifest invariants: AU-01 (trauma decay & hit-stop), AU-02 (dialogue rapid input buffer), AU-03 (Web Audio gain floor), AU-04 (10,000 Monte Carlo duel kinematics).',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'au',
    runeAffinity: 'ᛟ Othala (Auditor Truth & Sanctuary)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'AU-01 passed: Trauma T never yields NaN/undefined and decays to 0.0 in 400ms +- 1 frame', completed: true },
      { id: 'c2', text: 'AU-02 passed: 50 rapid taps in 500ms advances exactly 1 node with 0 frame drops', completed: true },
      { id: 'c3', text: 'AU-03 passed: Safe exponential ramp throws 0 RangeErrors when targeting 0.0', completed: true },
      { id: 'c4', text: 'AU-04 passed: 10,000 simulations confirm volume strictly clamped in [0.000, 1.000] with spam guard engage', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'AU-01: T(400ms) == 0.0; AU-02: deltaNodes == 1; AU-03: clampFloor >= 0.0001; AU-04: min(V)>=0 && max(V)<=1.',
    localDispatchCommand: 'node tests/invariants/M1_MasterManifest.test.js',
    branch: 'feat/jrn-213-auditor-matrix',
    purityScore: 100,
    createdAt: '2026-09-03T12:20:00Z',
    updatedAt: '2026-09-03T12:35:00Z',
    oracleProphecy: 'The Auditor sees beyond the code, measuring every particle against the law of invariants.',
  },
  {
    id: 'JRN-201',
    title: 'JOURNEYS UNTO v2 Blueprint: Game Boot Sequence & State Architecture',
    project: 'journeys_unto',
    objective: 'Scaffold the v2 blueprint foundation for the start of JOURNEYS UNTO: state machine transitions (Preload -> Title/Intro -> World Inception -> Gameplay Active), asset pipeline, and bootloader.',
    status: 'mechanic_forge',
    priority: 'Cosmic',
    targetAgent: 'mechanic',
    runeAffinity: 'ᛒ Berkano (New Inception & Growth)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Implement v2 GameDirector state machine with typed transitions (Boot, IntroCinematic, WorldStart, InGame)', completed: true },
      { id: 'c2', text: 'Setup asset preloader cache with graceful fallback placeholders for starting zone textures and audio', completed: true },
      { id: 'c3', text: 'Provide deterministic game start loop tick with decoupled update(dt) and render(alpha)', completed: false },
      { id: 'c4', text: 'Expose global GameSession context for player progression and chapter flags', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'StateMachine: S(t+1) = Transition(S(t), Event); Tick: accumulator += dt; while(accumulator >= FIXED_DT) { update(FIXED_DT); accumulator -= FIXED_DT; }',
    localDispatchCommand: 'npx essence-flow pull --ticket JRN-201 --agent mechanic --branch feat/journeys-bootloader',
    branch: 'feat/journeys-bootloader',
    purityScore: 99,
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-02T13:45:00Z',
    oracleProphecy: 'The chronicle of JOURNEYS UNTO begins at the threshold of the v2 blueprint, where every state is sovereign and deliberate.',
    codeStarterSnippet: `// JOURNEYS UNTO: v2 Blueprint Game Director & Boot Machine
export type GameState = 'PRELOAD' | 'INTRO_CINEMATIC' | 'WORLD_START' | 'ACTIVE_GAMEPLAY' | 'PAUSED';

export interface GameSession {
  chapter: number;
  questMarker: string;
  playerCoords: { x: number; y: number };
  flags: Record<string, boolean>;
}

export class JourneysGameDirector {
  private currentState: GameState = 'PRELOAD';
  private session: GameSession = {
    chapter: 1,
    questMarker: 'Threshold of the Unknown',
    playerCoords: { x: 0, y: 0 },
    flags: { 'prologue_awakened': false },
  };

  public transitionTo(nextState: GameState) {
    console.log(\`[JOURNEYS UNTO v2] State Shift: \${this.currentState} -> \${nextState}\`);
    this.currentState = nextState;
  }

  public getSession(): GameSession {
    return this.session;
  }
}`,
  },
  {
    id: 'PR0-101',
    title: 'Pr0sis: Mobile Viewport Formatting & Responsive Layout Overhaul',
    project: 'pr0sis',
    objective: 'Resolve mobile formatting breakdowns on live build (https://drewslaydon-maker.github.io/Essence-Designs/): eliminate horizontal overflow squishing, normalize viewport meta scales, and adapt UI containers for mobile screens.',
    status: 'cleanroom',
    priority: 'Cosmic',
    targetAgent: 'wave',
    runeAffinity: 'ᛉ Algiz (Purified Viewport & Sanctuary)',
    difficultyRank: 'Adept',
    acceptanceCriteria: [
      { id: 'c1', text: 'Audit index.html viewport meta tag: width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover', completed: true },
      { id: 'c2', text: 'Enforce overflow-x: hidden on root canvas/body to eliminate horizontal wobble on iOS & Android', completed: true },
      { id: 'c3', text: 'Wrap desktop-fixed toolbars and status panels in responsive flex/grid wrappers with mobile breakpoint rules', completed: false },
      { id: 'c4', text: 'Validate layout rendering seamlessly on 375px (iPhone SE), 390px (iPhone 14), and 412px (Pixel) viewport bounds', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'Viewport Width Clamping: CSS max-width: 100vw; box-sizing: border-box; Dynamic Viewport Unit: height: 100dvh;',
    localDispatchCommand: 'npx essence-flow pull --ticket PR0-101 --agent wave --branch fix/pr0sis-mobile-formatting',
    branch: 'fix/pr0sis-mobile-formatting',
    purityScore: 96,
    createdAt: '2026-09-02T10:30:00Z',
    updatedAt: '2026-09-02T14:15:00Z',
    oracleProphecy: 'Let the boundaries of the mobile glass frame Pr0sis with absolute poise, banishing the jitter of horizontal overflow.',
    codeStarterSnippet: `/* Pr0sis Mobile Formatting & Viewport Reset Invariants */
html, body {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
}

#pr0sis-root, #game-container {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .pr0sis-hud-desktop {
    display: none !important;
  }
  .pr0sis-hud-mobile {
    display: flex !important;
    padding: env(safe-area-inset-top) 12px env(safe-area-inset-bottom) 12px;
  }
}`,
  },
  {
    id: 'JRN-202',
    title: 'JOURNEYS UNTO v2 Blueprint: World Origin Scene Graph & Entity Registry',
    project: 'journeys_unto',
    objective: 'Construct the initial spatial coordinate system and entity registry for the starting chapter of JOURNEYS UNTO according to v2 blueprint specifications.',
    status: 'dispatched',
    priority: 'High',
    targetAgent: 'mechanic',
    runeAffinity: 'ᚱ Raido (Journey & Path)',
    difficultyRank: 'Archmage',
    acceptanceCriteria: [
      { id: 'c1', text: 'Implement lightweight Entity-Component Registry (EntityManager) for world origin, player, environment props', completed: true },
      { id: 'c2', text: 'Establish local 2D/isometric coordinate transform matrix with camera viewport tracking', completed: true },
      { id: 'c3', text: 'Scaffold starting chapter environment bounds with smooth boundary collision walls', completed: false },
      { id: 'c4', text: 'Verify 60 FPS baseline performance with 500 static environmental entities in starting zone', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'WorldToScreen(P): ScreenX = (P.x - Cam.x) * Zoom + CenterX; ScreenY = (P.y - Cam.y) * Zoom + CenterY;',
    localDispatchCommand: 'npx essence-flow pull --ticket JRN-202 --agent mechanic --branch feat/journeys-entity-engine',
    branch: 'feat/journeys-entity-engine',
    purityScore: 98,
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T13:30:00Z',
    oracleProphecy: 'Every stone and starlight marker in JOURNEYS UNTO anchors to the world origin with mathematical certainty.',
  },
  {
    id: 'PR0-102',
    title: 'Pr0sis: Mobile Touch Controls & Virtual Input Surface',
    project: 'pr0sis',
    objective: 'Implement touch input handling, prevent default mobile gestures (pinch-to-zoom / pull-to-refresh conflicts), and ensure minimum 44px touch targets on mobile Pr0sis.',
    status: 'backlog',
    priority: 'High',
    targetAgent: 'qa',
    runeAffinity: 'ᛇ Eihwaz (Vigilance & Resilience)',
    difficultyRank: 'Adept',
    acceptanceCriteria: [
      { id: 'c1', text: 'Add touch-action: manipulation to interactive canvas elements to eliminate 300ms tap delay', completed: false },
      { id: 'c2', text: 'Map touchstart / touchmove / touchend events to unified virtual input vector for mobile controls', completed: false },
      { id: 'c3', text: 'Prevent pull-to-refresh and multi-touch zoom gestures from interrupting live gameplay', completed: false },
      { id: 'c4', text: 'Enforce minimum 44px bounding boxes on mobile HUD buttons and action controls', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'Touch Vector: dx = touch.clientX - originX; dy = touch.clientY - originY; magnitude = Math.hypot(dx, dy); clamp to maxRadius;',
    localDispatchCommand: 'npx essence-flow pull --ticket PR0-102 --agent qa --branch fix/pr0sis-touch-input',
    branch: 'fix/pr0sis-touch-input',
    createdAt: '2026-09-02T12:00:00Z',
    updatedAt: '2026-09-02T12:00:00Z',
  },
  {
    id: 'JRN-203',
    title: 'JOURNEYS UNTO: Kinematic Controller Proof of Life [VERIFIED IN SANDBOX]',
    project: 'journeys_unto',
    objective: 'Unified Proof of Life for JOURNEYS UNTO verified in the cloud sandbox! Implements the pure ES-module KinematicController with deterministic delta-time integration, mass inertia, exponential ground/air damping, terminal velocity clamping, and floating-point numerical corruption reset safeguards.',
    status: 'qa_inspection',
    priority: 'Cosmic',
    targetAgent: 'mechanic',
    runeAffinity: 'ᚦ Thurisaz (Arcane Force & Kinematic Vector)',
    difficultyRank: 'Archmage',
    isBlocked: false,
    acceptanceCriteria: [
      { id: 'c1', text: 'Cloud-first pipeline established: Proof of Life running live in web sandbox prior to local checkout', completed: true },
      { id: 'c2', text: 'Scaffold pure ES-module KinematicController with applyForce and applyImpulse vector math', completed: true },
      { id: 'c3', text: 'Deterministic delta-time integration with safe max_dt (0.1s) clamping against frame stutters', completed: true },
      { id: 'c4', text: 'Exponential friction model: pow(ground_damping / air_damping, safeDt) for natural deceleration', completed: true },
      { id: 'c5', text: 'Numerical integrity watchdog automatically catches NaN/Infinity corruption and resets state', completed: true },
      { id: 'c6', text: 'Unified multi-platform control: WASD, Arrow keys, Space jump, and virtual touch on-screen pads', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'Kinematic Acceleration: a += F / mass; Velocity: v += a * dt; Damping: v.x *= pow(is_grounded ? ground_damping : air_damping, dt); Terminal Vel: clamp(v.y, -terminal_velocity, terminal_velocity); Position: p += v * dt;',
    localDispatchCommand: 'npx essence-flow pull --ticket JRN-203 --agent mechanic --branch feat/journeys-proof-of-life',
    branch: 'feat/journeys-proof-of-life',
    createdAt: '2026-09-02T08:30:00Z',
    updatedAt: '2026-09-03T08:32:00Z',
    oracleProphecy: 'The celestial vessel breathes! In the cloud sandbox, weight, friction, and momentum have awakened with absolute mathematical purity.',
    codeStarterSnippet: `// ============================================================================
// JOURNEYS UNTO v0.1: Unified Proof of Life - Kinematic Controller
// Verified in Cloud Sandbox at 60 FPS
// ============================================================================

export class KinematicController {
  constructor() {
    this.transform = { x: 0.0, y: 0.0 };
    this.velocity = { x: 0.0, y: 0.0 };
    this.acceleration = { x: 0.0, y: 0.0 };
    
    this.config = {
      mass: 1.0,
      gravity: 980.0,
      terminal_velocity: 1200.0,
      ground_damping: 0.05,
      air_damping: 0.85,
      max_dt: 0.1
    };
    
    this.flags = {
      is_grounded: false,
      is_frozen: false
    };
  }

  _isValidNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
  }

  applyForce(fx, fy) {
    if (this._isValidNumber(fx) && this._isValidNumber(fy)) {
      this.acceleration.x += fx / this.config.mass;
      this.acceleration.y += fy / this.config.mass;
    }
  }

  applyImpulse(ix, iy) {
    if (this._isValidNumber(ix) && this._isValidNumber(iy)) {
      this.velocity.x += ix / this.config.mass;
      this.velocity.y += iy / this.config.mass;
    }
  }

  setGrounded(isGrounded) {
    this.flags.is_grounded = Boolean(isGrounded);
    if (this.flags.is_grounded && this.velocity.y > 0) {
      this.velocity.y = 0.0;
    }
  }

  teleport(x, y) {
    if (this._isValidNumber(x) && this._isValidNumber(y)) {
      this.transform.x = x;
      this.transform.y = y;
      this.velocity.x = 0.0;
      this.velocity.y = 0.0;
      this.acceleration.x = 0.0;
      this.acceleration.y = 0.0;
    }
  }

  update(dt) {
    if (this.flags.is_frozen === true) return;

    const safeDt = Math.min(dt, this.config.max_dt);

    if (!this.flags.is_grounded) {
      this.velocity.y += this.config.gravity * safeDt;
    }

    this.velocity.x += this.acceleration.x * safeDt;
    this.velocity.y += this.acceleration.y * safeDt;

    if (this.flags.is_grounded) {
      if (this.velocity.y > 0) this.velocity.y = 0.0;
    } else {
      this.velocity.y = Math.max(
        -this.config.terminal_velocity, 
        Math.min(this.config.terminal_velocity, this.velocity.y)
      );
    }

    const friction = Math.pow(
      this.flags.is_grounded ? this.config.ground_damping : this.config.air_damping, 
      safeDt
    );
    this.velocity.x *= friction;

    if (Math.abs(this.velocity.x) < 0.05) {
      this.velocity.x = 0.0;
    }

    this.transform.x += this.velocity.x * safeDt;
    this.transform.y += this.velocity.y * safeDt;

    const isCorrupted = (
      !this._isValidNumber(this.transform.x) || 
      !this._isValidNumber(this.transform.y) ||
      !this._isValidNumber(this.velocity.x) || 
      !this._isValidNumber(this.velocity.y)
    );

    if (isCorrupted) {
      console.warn("[KinematicController] Numerical corruption detected. Resetting.");
      if (!this._isValidNumber(this.transform.x)) this.transform.x = 0.0;
      if (!this._isValidNumber(this.transform.y)) this.transform.y = 0.0;
      if (!this._isValidNumber(this.velocity.x)) this.velocity.x = 0.0;
      if (!this._isValidNumber(this.velocity.y)) this.velocity.y = 0.0;
    }

    this.acceleration.x = 0.0;
    this.acceleration.y = 0.0;
  }
}`,
  },
  {
    id: 'PR0-103',
    title: 'Pr0sis: Mobile Device Pixel Ratio (DPR) & High-DPI Canvas Scaling',
    project: 'pr0sis',
    objective: 'Fix canvas pixelation and blurring on high-DPI mobile screens (Retina / Super AMOLED) while maintaining 60 FPS performance without thermal throttling.',
    status: 'qa_inspection',
    priority: 'Normal',
    targetAgent: 'qa',
    runeAffinity: 'ᛋ Sowilo (Starlight Clarity)',
    difficultyRank: 'Adept',
    acceptanceCriteria: [
      { id: 'c1', text: 'Scale HTML5 Canvas backing store by window.devicePixelRatio capped at 2.0 to prevent mobile GPU throttling', completed: true },
      { id: 'c2', text: 'CSS width/height set to 100% / max-w-full with letterbox aspect ratio preservation', completed: true },
      { id: 'c3', text: 'QA Sentinel automated latency benchmark confirms no frame drops during mobile window resize', completed: false },
      { id: 'c4', text: 'Tested on mobile Safari and Chrome Android dev tools emulation', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'dpr = Math.min(window.devicePixelRatio || 1, 2.0); canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr);',
    localDispatchCommand: 'npx essence-flow pull --ticket PR0-103 --agent qa --branch fix/pr0sis-dpr-scaling',
    branch: 'fix/pr0sis-dpr-scaling',
    purityScore: 97,
    createdAt: '2026-09-02T09:15:00Z',
    updatedAt: '2026-09-02T14:10:00Z',
    oracleProphecy: 'Clear as glacial starlight on mobile screens, Pr0sis shall retain crisp geometry without straining the mobile silicon.',
  },
  {
    id: 'JRN-204',
    title: 'JOURNEYS UNTO v2 Blueprint: Prologue Narrative Chronicle & Dialogue Engine',
    project: 'journeys_unto',
    objective: 'Scaffold the narrative dialogue engine for the start of JOURNEYS UNTO, supporting typewriter text effects, character portraits, and branching dialogue choices.',
    status: 'backlog',
    priority: 'Normal',
    targetAgent: 'mp',
    runeAffinity: 'ᛈ Perthro (Destiny & Revelation)',
    difficultyRank: 'Adept',
    acceptanceCriteria: [
      { id: 'c1', text: 'Dialogue graph data structure supporting nodes, speaker IDs, portrait triggers, and choice branches', completed: false },
      { id: 'c2', text: 'Typewriter text effect with punctuation cadence pauses and skip-to-end on tap/space', completed: false },
      { id: 'c3', text: 'Chronicle log storing revealed story lore and completed conversation states', completed: false },
      { id: 'c4', text: 'Cleanroom isolated module ready for integration with the starting scene', completed: false },
    ],
    mathematicalOrPhysicsSpec: 'Typewriter cadence: pause 250ms at commas, 500ms at periods; default interval 28ms/char',
    localDispatchCommand: 'npx essence-flow pull --ticket JRN-204 --agent mp --branch feat/journeys-dialogue-engine',
    branch: 'feat/journeys-dialogue-engine',
    createdAt: '2026-09-02T13:00:00Z',
    updatedAt: '2026-09-02T13:00:00Z',
    reasoning: 'Dialogue cadence and branching graph anchor the narrative pacing without blocking 60fps render ticks.',
    oracleProphecy: 'The spoken decree rings once, yet settles deep into the memory of the listener.',
  },
  {
    id: 'PR0-104',
    title: 'Pr0sis: Live PC Deployment & Mobile Audio Gesture Unlock',
    project: 'pr0sis',
    objective: 'Ensure audio synthesizer in live Pr0sis build (https://drewslaydon-maker.github.io/Essence-Designs/) unlocks seamlessly on first user touch gesture without silent browser rejection.',
    status: 'merged',
    priority: 'Cosmic',
    targetAgent: 'mp',
    runeAffinity: 'ᛏ Tiwaz (Cosmic Order & Mastery)',
    difficultyRank: 'Cosmic',
    acceptanceCriteria: [
      { id: 'c1', text: 'AudioContext suspension state checked on window focus and unlocked on touchstart/pointerdown', completed: true },
      { id: 'c2', text: 'Live PC deployment online on drewslaydon-maker.github.io/Essence-Designs/', completed: true },
      { id: 'c3', text: 'Signed off by Drew & WAKE and tagged in repository', completed: true },
    ],
    mathematicalOrPhysicsSpec: 'if (ctx.state === "suspended") { window.addEventListener("touchstart", () => ctx.resume(), { once: true }); }',
    localDispatchCommand: 'npx essence-flow pull --ticket PR0-104 --agent mp --merged',
    branch: 'main',
    purityScore: 100,
    createdAt: '2026-09-01T14:00:00Z',
    updatedAt: '2026-09-02T06:30:00Z',
    reasoning: 'Modern browser autoplay policies reject audio contexts initialized before a user interaction; attaching a one-shot touch listener ensures seamless sound without console exceptions.',
    oracleProphecy: 'The soundscape of Pr0sis awakens the instant the wanderer touches the glass.',
  },
];

export const INITIAL_GIT_STATE: GitRepoState = {
  url: 'https://github.com/drewslaydon-maker/Essence-Designs',
  branch: 'main',
  branches: [
    'main',
    'journeys-unto-v2-blueprint',
    'fix/pr0sis-mobile-formatting',
    'feat/journeys-bootloader',
    'feat/journeys-entity-engine',
    'feat/journeys-character-controller',
  ],
  isSynced: true,
  lastSync: 'Synchronized with drewslaydon-maker/Essence-Designs',
  commits: [
    {
      hash: '7a19f42',
      message: 'feat(journeys): scaffold v2 blueprint game start state machine and bootloader (JRN-201)',
      author: 'The Mechanic <mechanic@essenceflow.local>',
      timestamp: 'Today at 01:45 PM',
      branch: 'feat/journeys-bootloader',
      rune: 'ᛒ',
      tickets: ['JRN-201'],
    },
    {
      hash: '5d82e1c',
      message: 'fix(pr0sis): diagnose mobile viewport meta, eliminate horizontal overflow (PR0-101)',
      author: 'WAVE Cleanroom <wave@cloud.essenceflow>',
      timestamp: 'Today at 02:15 PM',
      branch: 'fix/pr0sis-mobile-formatting',
      rune: 'ᛉ',
      tickets: ['PR0-101'],
    },
    {
      hash: '9f2a71c',
      message: 'release(pr0sis): live PC build deployed on drewslaydon-maker.github.io/Essence-Designs (PR0-104)',
      author: 'WebDev / MP <mp@essenceflow.local>',
      timestamp: 'Today at 06:30 AM',
      branch: 'main',
      rune: 'ᛏ',
      tickets: ['PR0-104'],
    },
    {
      hash: '3e1b88a',
      message: 'docs(blueprint): commit v2 architecture specs for JOURNEYS UNTO prologue start',
      author: 'Drew Slaydon <drew.slaydon@gmail.com>',
      timestamp: 'Yesterday at 08:20 PM',
      branch: 'journeys-unto-v2-blueprint',
      rune: 'ᛈ',
      tickets: [],
    },
  ],
};
