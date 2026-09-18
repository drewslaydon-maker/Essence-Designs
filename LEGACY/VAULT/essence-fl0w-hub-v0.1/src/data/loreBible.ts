export interface CharacterLore {
  id: string;
  name: string;
  title: string;
  archetype: string;
  avatar: string;
  color: string;
  psychology: string;
  visuals: string;
  mechanicalRole: string;
  currentTavernState: string;
  specialAbility: string;
}

export interface TavernSetpiece {
  id: string;
  name: string;
  zone: string;
  description: string;
  bounds: { x: number; y: number; w: number; h: number };
  associatedCharacter?: string;
  interactPrompt: string;
}

export const CANON_CHARACTERS: CharacterLore[] = [
  {
    id: 'bozog',
    name: 'Bozog the Berserker',
    title: 'The Host & The Hammer',
    archetype: 'Orc ex-sailor turned corsair, turned dive-bar proprietor',
    avatar: '🪓',
    color: '#10b981',
    psychology: 'Eren Yeager-level conviction regarding personal and collective freedom, matched with a massive, boisterous ego. Craves destruction when it tests raw strength or shatters authority.',
    visuals: 'Broad-shouldered green silhouette, rolled-up pirate cuffs, heavy leather breeches, twin tusks, carrying an oversized double-bitted greataxe hooked behind the bar.',
    mechanicalRole: 'High-impact kinetic melee, knockback vectors, and the Rage/Momentum Meter (gained through trades, spent on crushing strikes).',
    currentTavernState: 'Active player-controlled avatar exploring the bar SOLO.',
    specialAbility: 'Rage Burst / Greatcleave Smash',
  },
  {
    id: 'kairon',
    name: 'Kairon the Eternal',
    title: 'The Chaotic Chronicler',
    archetype: 'Hell-blood (ancient singular entity—neither tiefling nor common fiend)',
    avatar: '🎸',
    color: '#a855f7',
    psychology: 'Ozzy Osbourne rock-legend energy. Mind is an overstuffed filing cabinet where centuries of historical events, ancient grudges, and musical riffs collide. Either worshipped as a sonic pioneer or dismissed as an erratic madman.',
    visuals: 'Swept-back weathered horns wire-wrapped in silver, tattered plum-velvet coat, tinted wire spectacles, carrying an ornate dueling rapier and tuned repeating hand-crossbow.',
    mechanicalRole: 'Harmonic buffs, tempo alteration, dissonance debuffs. (Late Act 1: Commands "Bony Boys" skeleton rhythm section).',
    currentTavernState: 'Performing an erratic solo on stage to a small group of mesmerized patrons.',
    specialAbility: 'Discordant Solo / Tempo Warp',
  },
  {
    id: 'matchstick',
    name: 'Matchstick',
    title: 'The Outside Thinker',
    archetype: 'Half-elf outlander, rogue scout, and future Mirror Master',
    avatar: '🪞',
    color: '#38bdf8',
    psychology: 'Aloof, introspective, laconic. Constantly questions assumptions, steps outside established lines of thought, and gets hypnotically lost in mirror reflections.',
    visuals: 'Slender build in a worn leather outlander duster, cropped hair, perpetually spinning a polished silver pocket mirror between his knuckles.',
    mechanicalRole: 'High-evasion flanker, shadow relocation, critical strikes. (Act 1 Finale: Unlocks dimensional mirror relics).',
    currentTavernState: 'Observing the bar floor from the shadowed corner booth, reading room angles.',
    specialAbility: 'Mirror Relocation / Blindside Ambush',
  },
  {
    id: 'atreyu',
    name: 'Atreyu',
    title: 'The High Moon Priestess',
    archetype: 'Dual-aspect lunar arcanist',
    avatar: '🌙',
    color: '#e0e7ff',
    psychology: 'Serene spiritual devotion coupled with an unruly, fiercely competitive streak. As comfortable slugging heavy grog in a dive bar as she is chanting sacred lunar rites.',
    visuals: 'Flowing dark iridescent robes with luminous silver trim, floating crystal shards revolving around her forearms, glowing pale crest on her collar.',
    mechanicalRole: 'Dual-Phase Lunar Arts — Waxing Light (crystal barriers, regen wards) and Waning Dark (beam lances, spatial blinds).',
    currentTavernState: 'Locked in an intense 3-round drinking contest with Bozog at the main counter.',
    specialAbility: 'Waxing Shield / Waning Lance',
  },
];

export const TAVERN_SETPIECES: TavernSetpiece[] = [
  {
    id: 'main_bar',
    name: 'The Main Bar Counter',
    zone: 'West Wall',
    description: 'Notched mahogany drenched in dark ale and glowing moon-casks. Site of the 3-Round Drinking Contest with Atreyu.',
    bounds: { x: 36, y: 80, w: 72, h: 200 },
    associatedCharacter: 'Atreyu (High Moon Priest)',
    interactPrompt: 'Engage Atreyu in Drinking Contest [Z]',
  },
  {
    id: 'ramshackle_stage',
    name: 'The Ramshackle Stage',
    zone: 'North-East Quarter',
    description: 'Uneven planks draped in frayed tapestries where Kairon plays chaotic sets to a loyal fringe audience.',
    bounds: { x: 420, y: 44, w: 180, h: 80 },
    associatedCharacter: 'Kairon the Eternal',
    interactPrompt: 'Listen to Kairon shred on stage [Z]',
  },
  {
    id: 'corner_booth',
    name: 'The Shadowed Corner Booth',
    zone: 'North-West Corner',
    description: 'Obscured by smoked glass and hanging whale-oil lanterns where Matchstick studies room reflections.',
    bounds: { x: 128, y: 44, w: 90, h: 70 },
    associatedCharacter: 'Matchstick (Mirror Master)',
    interactPrompt: 'Approach Matchstick studying reflections [Z]',
  },
  {
    id: 'reinforced_doors',
    name: 'The Reinforced Oak Entrance',
    zone: 'South Boundary',
    description: 'Double-planked oak doors bound in corroded iron, leading out to the Delain piers. Site of the Inciting Ambush!',
    bounds: { x: 270, y: 320, w: 100, h: 32 },
    interactPrompt: 'Inspect barred oak doors / Docks sea-mist [Z]',
  },
];

export const DRINKING_CONTEST_ROUNDS = [
  {
    round: 1,
    drink: 'Warmup Ale',
    decayRate: 0.35,
    threshold: 100,
    mashRequirement: 'Steady Rhythm',
    description: 'Standard Delain harbor grog. Bozog and Atreyu exchange initial banter.',
  },
  {
    round: 2,
    drink: 'Docks Navy Rum',
    decayRate: 0.65,
    threshold: 150,
    mashRequirement: 'Rapid Tap',
    description: 'Double-distilled molasses spirits. Atreyu enters Waxing focus and counter-mashes.',
  },
  {
    round: 3,
    drink: 'Moon-Cask Spirit',
    decayRate: 0.95,
    threshold: 200,
    mashRequirement: 'Furious Mash',
    description: 'Glowing silver celestial brew that bites like lightning. The bar erupts into cheers.',
  },
];

export const FOUR_CORNERS_SYSTEM = {
  name: 'The 4 Corners System',
  description: 'Parallel to the Pr0sis fracture matrix, JOURNEYS UNTO is anchored across 4 cardinal archetypes, philosophies, and combat paths.',
  corners: [
    {
      corner: 'The South Corner (Front & Kinetic Force)',
      character: 'Bozog the Berserker',
      role: 'Vanguard Dominance / Blood & Wood',
      color: '#10b981',
      symbol: '🪓',
      stance: 'Direct Kinetic Impact',
      philosophy: 'Violent confrontation, debt extraction, unyielding physical momentum.',
    },
    {
      corner: 'The West Corner (The Tide & Celestial Ward)',
      character: 'Atreyu (High Moon Priestess)',
      role: 'Cosmic Weaver / Lunar Gravity & Ward',
      color: '#e0e7ff',
      symbol: '🌙',
      stance: 'Gravitational Order & Stillness',
      philosophy: 'Silver moon tides, divine reflection, immovable calm under chaotic assault.',
    },
    {
      corner: 'The East Corner (The Overdrive & Sonic Flame)',
      character: 'Kairon the Eternal',
      role: 'Bardic Demagogue / Dissonance Shredder',
      color: '#a855f7',
      symbol: '🎸',
      stance: 'Sonic Anarchy & Harmonic Shock',
      philosophy: 'Disrupting geometric dogma, mocking Citadel order, shattering frequencies.',
    },
    {
      corner: 'The North Corner (The Shadow & Refraction)',
      character: 'Matchstick (Outside Thinker)',
      role: 'Rogue Tactician / Mirror Master',
      color: '#38bdf8',
      symbol: '🪞',
      stance: 'Geometric Inversion & Blindspot Flank',
      philosophy: 'Exploiting angles, silver reflections, slipping outside the adversary\'s frame.',
    },
  ],
};

export const AMBUSH_STANDOFF_CHOICES = [
  {
    id: 'bozog_roar',
    speaker: 'Bozog the Berserker',
    avatar: '🪓',
    color: '#10b981',
    corner: 'South (Kinetic / Restitution)',
    action: '[ROAR & CLEAVE BLACK KNIGHTS]',
    archetype: 'Brute Force Initiative',
    description: 'Bozog vaults over the mahogany bar, roars with furious laughter, and cleaves the lead Black Knight\'s tower shield into splintered kindling.',
    consequence: 'Initiates direct kinetic brawl. Shatters Black Knight armor & grants +100 Rage Meter at combat start.',
  },
  {
    id: 'atreyu_ward',
    speaker: 'Atreyu (High Moon Priestess)',
    avatar: '🌙',
    color: '#e0e7ff',
    corner: 'West (Lunar Mystic / Divine Ward)',
    action: '[RAISE LUNAR WARD & CONDEMN]',
    archetype: 'Celestial Ward & Repulsion',
    description: 'Atreyu slams her silver crescent staff onto the tavern floorboards, conjuring an iridescent tide barrier that turns back the Black Knight crossbow volley and blinds them in lunar radiance.',
    consequence: 'Erects an unbreakable barrier. Black Knights are pushed back outside the threshold, inflicting -50% knight accuracy.',
  },
  {
    id: 'kairon_mock',
    speaker: 'Kairon the Eternal',
    avatar: '🎸',
    color: '#a855f7',
    corner: 'East (Sonic Dissonance / Flame)',
    action: '[MOCK & SHRED FORBIDDEN HARMONIC]',
    archetype: 'Sonic Disruption & Overdrive',
    description: 'Kairon strikes an ear-splitting forbidden 7th-harmonic feedback riff from the stage, mocking the Black Knights and shattering their crystal audio-visors into shrieking static.',
    consequence: 'Blinds Black Knight visors, induces acoustic disorientation, and delays Black Knight action turns.',
  },
  {
    id: 'matchstick_shadows',
    speaker: 'Matchstick',
    avatar: '🪞',
    color: '#38bdf8',
    corner: 'North (Refraction / Subterfuge)',
    action: '[FLASH MIRRORS & SLIP FLANK]',
    archetype: 'Tactical Blindspot Inversion',
    description: 'Matchstick extinguishes the corner lantern, angles his polished silver pocket mirror to refract the chandelier glare into the Black Knights\' eyes, and vanishes into their rear blind flank.',
    consequence: 'Guaranteed surprise flank position with 100% critical strike opening attack.',
  },
];

export const LOCKED_AGENT_HIERARCHY = {
  director: {
    name: 'Drew Slaydon',
    role: 'Human Director',
    description: 'Creator, visionary, and final arbiter of JOURNEYS UNTO design, lore, and production pace.',
  },
  realityAnchor: {
    name: 'Juju',
    role: 'Reality Anchor & Copilot',
    description: 'Grounding presence, emotional stillness, truth checker, and shared anchor keeping the vision aligned with reality.',
  },
  layers: [
    {
      id: 'wake',
      name: 'THE_WAVE / WAKE',
      title: 'Head Cleaner & Gatekeeper',
      responsibilities: 'High-level strategic & cleanroom bridge. Audits memory leaks, 60fps determinism, and checks off tickets with Drew and Juju before bringing to MP.',
      symbol: '🌊',
      color: 'text-cyan-400',
    },
    {
      id: 'mp',
      name: 'WebDev / MP',
      title: 'Sovereign Implementation & Sandbox Harness',
      responsibilities: 'Master Programmer holding direct filesystem write clearance. Writes pure ES6 engines, runs verification gates, and deploys standalone GitHub Pages releases.',
      symbol: 'ᛗ',
      color: 'text-emerald-400',
    },
  ],
  statusNote: 'Director-Omega (DO) and The Oracle have been officially worked out of the system. System operates via direct goal tracking, task completion, and explicit reasoning.',
  jointVerification: 'Joint Verification: Drew + Juju Reality Anchor + WebDev Sandbox + WAKE Audit (Tri-Node verification before milestone merge)',
};
