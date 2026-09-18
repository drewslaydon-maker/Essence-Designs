import { Spoke, Pillar, PhaseDossier } from "../types";

export interface XpMilestone {
  level: number;
  tierName: string;
  totalXp: number;
  xpToNext: number;
  description: string;
}

// Canonical exponential progression curve (scaled appropriately for Adversity without 13M bloat)
export const xpMilestonesData: XpMilestone[] = [
  { level: 1, tierName: "Novice Initiate", totalXp: 0, xpToNext: 120, description: "Unlocks basic harvesting tools and apprentice recipes." },
  { level: 10, tierName: "Field Practitioner", totalXp: 2800, xpToNext: 850, description: "Consistent resource yield without tool fracturing." },
  { level: 25, tierName: "Apprentice Tier", totalXp: 24500, xpToNext: 3400, description: "Milestone Tier I: Unlocks Tier I field utility perks, specialized gathering techniques, and apprentice insignia." },
  { level: 50, tierName: "Journeyman Tier", totalXp: 120000, xpToNext: 11200, description: "Milestone Tier II: Unlocks advanced cross-spoke syntheses, refined refining ratios, and journeyman tabards." },
  { level: 75, tierName: "Master Artisan Tier", totalXp: 480000, xpToNext: 32000, description: "Milestone Tier III: Unlocks mastercraft recipes, zero-waste extraction, and regional guild recognition." },
  { level: 90, tierName: "Grand Exemplar", totalXp: 950000, xpToNext: 65000, description: "Unrivaled operational efficiency; near-instant preparation cadences." },
  { level: 99, tierName: "Ascendant Spoke Cap", totalXp: 1250000, xpToNext: 0, description: "Mastery Cap Tier: Awards the non-purchasable Spoke Mastery Cape, unique overworld animations, and transformative passive perks." },
];

export const phaseDossiersData: PhaseDossier[] = [
  {
    phase: "PHASE 0",
    codename: "Infrastructure",
    timeframe: "Q3 2026",
    status: "COMPLETED",
    title: "System Pillars & Architecture Specification",
    subtitle: "Core Design Ratification & Interactive Proof of Concept",
    validationGate: "Architecture Dossier and interactive sandbox approved by systems design review.",
    deliverablesCompleted: 3,
    totalDeliverables: 3,
    deliverables: [
      {
        title: "15-Spoke Wheel Blueprint",
        description: "Ratify all 12 skill spokes, training vectors, input/output handshakes, and milestone unlocks across the 4 Dominions + Center.",
        acceptanceCriteria: "Complete matrix of spoke pairing synergies and input/output resource loops documented and verified.",
        status: "COMPLETE",
      },
      {
        title: "Turn-Based Grid Combat Specification",
        description: "Establish AP action economy, posture break mechanic, tile grid calculations, and weapon reach.",
        acceptanceCriteria: "Mathematical formulas for damage mitigation, poise thresholds, and deterministic hit calculations finalized (0% random misses).",
        status: "COMPLETE",
      },
      {
        title: "Time-Spent Progression Formula",
        description: "Exponential XP curve from Level 1 to 99 modeled after classic time-honored progression, calibrated for Adversity.",
        acceptanceCriteria: "Total XP progression modeled with definitive milestone unlocks at 25, 50, 75, and 99 without arbitrary inflation.",
        status: "COMPLETE",
      },
    ],
  },
  {
    phase: "PHASE 0.5",
    codename: "Lab Sealing & Wheel Verification",
    timeframe: "RATIFIED — SEALED v1.0",
    status: "SEALED",
    title: "Lab Sealing & Wheel Foundational Inspection",
    subtitle: "Structural Canon Alignment, Immutable Geometry, & Verification Gate",
    validationGate: "Airseal verification passed: `bun run lint` green + `bun run lab:verify` green across all 5 gates. Forever Flower 08 ratified. Phase 1 remains shelved pending Architect command.",
    deliverablesCompleted: 5,
    totalDeliverables: 5,
    deliverables: [
      {
        title: "Alden North Wheel Alignment (12, 1, 2 Matrix)",
        description: "Anchor Alden at True North with 1 as defining main number, presiding over 12 (Diplomat/Restraint) and 2 (Warrior/Edge). Propagate clockwise to Caelen East (3,4,5 with 4 main), Mera South (6,7,8 with 7 main), Bram West (9,10,11 with 10 main), and Soran Axis (13,14,15).",
        acceptanceCriteria: "Spoke positions and numbers precisely aligned to Alden North matrix; 0 geometric distortion; 15 spokes + 1 center hub immutable.",
        status: "COMPLETE",
      },
      {
        title: "Interactive In-Place Dossier Overlay (The Big Tooltip)",
        description: "Clicking spokes, spikes, or center hub opens the detailed dossier as an absolute backdrop-blurred overlay directly over the wheel without being swallowed by pointer capture or drag rotation.",
        acceptanceCriteria: "Tapping or clicking nodes reliably displays the popup on desktop and mobile; drag rotation threshold isolated from click triggers.",
        status: "COMPLETE",
      },
      {
        title: "Soran Canonical Esoteric Symbols",
        description: "Render Soran's Vessel of Stillness (open lotus chalice with unburdened Sunyata drop and halo) in true form and Pierced Lotus / Void Ouroboros (split ouroboros cleaved by vertical void channel with twin bone needles holding frozen tear) in corrupted form.",
        acceptanceCriteria: "Symbols strictly mirror lore specifications in warpedPantheonData.ts and AGENTS.md.",
        status: "COMPLETE",
      },
      {
        title: "Combat Lab Pause & Shelving Protocol",
        description: "Combat engine sandbox verified in working order and explicitly paused. All tactical features shelved until overall Lab passes inspection.",
        acceptanceCriteria: "Lab UI clearly displays Paused/Shelved status; no forward combat development occurs during Sealing sprint.",
        status: "COMPLETE",
      },
      {
        title: "Git Repository Truth Holder & Credential Transparency",
        description: "Git truth holder established at the repository root with an authenticated GitHub remote; in-app push, zip export, and Mac workflow verified. The repository is the sole Truth Holder — never AI Studio share/export.",
        acceptanceCriteria: "Root repository synchronized and remotely authenticated; status communicated to user with zero fabricated claims.",
        status: "COMPLETE",
      },
    ],
  },
  {
    phase: "PHASE 1",
    codename: "Tactical Core (PAUSED)",
    timeframe: "SHELVED PENDING LAB SEAL",
    status: "PAUSED",
    title: "Tactical Core & Combat Engine (PAUSED)",
    subtitle: "Playable Battle Engine, Posture Dynamics, and First Dungeon Arena",
    validationGate: "Shelved until Phase 0.5 Lab Sealing passes full architect inspection.",
    deliverablesCompleted: 1,
    totalDeliverables: 5,
    deliverables: [
      {
        title: "Deterministic Mitigation & AP State Machine",
        description: "Implement deterministic turn queue, tile pathfinding, line of sight, and AP tracking without hit-chance RNG.",
        acceptanceCriteria: "Attacks always connect; calculations transparently factor weapon reach, damage threshold DR, and posture break.",
        status: "IN_PROGRESS",
      },
      {
        title: "Weight Class Triforce (H / M / L + Zero Armor Center)",
        description: "Encode AP velocity, damage reduction, and spell resonance across Heavy, Medium, Light, and the unarmored glass cannon center.",
        acceptanceCriteria: "Zero Armor gains +2 AP and 4-tile sprint but takes 100% unmitigated damage with high stagger peril.",
        status: "PLANNED",
      },
      {
        title: "3-Player Triad & 75% Mercenary AI",
        description: "Party system structuring Scout (Wayfarer), Crafter/Gatherer (Artificer), and Combatant (Vanguard), plus 75% competency NPC hireling companions.",
        acceptanceCriteria: "Solo Wanderers can hire 1-2 tavern mercenaries who perform combat and hauling at 75% average player efficiency.",
        status: "PLANNED",
      },
      {
        title: "Lone Wanderer Perk & Adversity Protocol",
        description: "Fallout-inspired bespoke buffs (+30% carrying capacity, +15% posture resistance, accelerated campcraft) and adversity trade-offs for solo play.",
        acceptanceCriteria: "Wanderers venturing without group or hireling receive active Lone Wanderer traits with clear visual HUD indicators.",
        status: "PLANNED",
      },
      {
        title: "Alderstone Crypt Slice & 30-Second Decisive Skirmishes",
        description: "A handcrafted crypt featuring Skeletal Sentinels, Crypt Stalkers, and a multi-phase Crypt Warden with WoW-style mechanical telegraphs.",
        acceptanceCriteria: "Trash mob encounters resolve in 20-30 seconds of skilled execution; telegraphs pre-train players for boss cleaves.",
        status: "PLANNED",
      },
    ],
  },
];

export const spokesData: Spoke[] = [
  // --- Dominion I: Iron (War & Diplomacy) - Under Alden (North: 12, 1, 2 with 1 Defining) ---
  {
    id: "spoke-1-bastion",
    name: "The Bastion Spoke (Armor & Absorption)",
    number: 1,
    dominion: "Iron",
    category: "Combat",
    color: "#f59e0b",
    originalVirtue: "The anvil of the envoy. Heavy plate worn by guardians to absorb blows intended for the innocent, suffering strikes without returning malice.",
    corruptedDistortion: "The Slag-Welded Carapace. Plate riveted directly through flesh into bone so the soldier can never remove their armor or sleep, bred only for perpetual war.",
    purpose: "Governs deterministic armor mitigation, damage absorption thresholds, and shield deflection dynamics across heavy plate geometries.",
    consumes: ["Tempered Billets (Spoke 11 Smithing)", "Toughened Leather Laces (Spoke 6 Trapping)", "Granite Ballast (Spoke 10 Quarrying)"],
    produces: ["Plate Carapaces", "Reinforced Tower Shields", "Posture-Reinforced Greaves"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Iron Root", unlock: "Flat damage absorption increased by +4; posture recovery rate increased by 10%." },
      { tier: "Lvl 50 Journeyman", title: "Tempered Guard", unlock: "Negates 50% of posture stagger caused by blunt concussive impacts." },
      { tier: "Lvl 75 Master Artisan", title: "Envoy's Bulwark", unlock: "Negates 100% of posture stagger from light and skirmisher arrows." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Weeping Bull", unlock: "Grants 'The Unbroken Wall' — whenever an ally within 5 paces would take fatal damage, you absorb it with 50% mitigation." }
    ],
    connectedSpokes: ["spoke-2-edge", "spoke-12-stance", "spoke-11-smithing"]
  },
  {
    id: "spoke-2-edge",
    name: "The Edge Spoke (Blades & Impact)",
    number: 2,
    dominion: "Iron",
    category: "Combat",
    color: "#ef4444",
    originalVirtue: "The warrior's unsheathed boundary. Honed steel held in scabbards as a deterrent, drawn only to cut clean threads of danger without unnecessary suffering.",
    corruptedDistortion: "The Severed Scabbard. Scabbards discarded; edges serrated with jagged fangs designed to tear flesh into ribbons and prolong agonizing deaths.",
    purpose: "Dictates weapon balance, critical strike cadences, edge sharpness retention, and armor-cleaving leverage in melee engagements.",
    consumes: ["Folded Carbon Steel (Spoke 11 Smithing)", "Hardened Ashwood Shafts (Spoke 8 Forestry)", "Honing Whetstones (Spoke 10 Quarrying)"],
    produces: ["Greatswords", "War-Cleavers", "Halberds", "Stiletto Piercers"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Honed Bevel", unlock: "Weapon durability degrades 25% slower; edge retention adds +3 bleed on heavy blows." },
      { tier: "Lvl 50 Journeyman", title: "Armor Notcher", unlock: "Strikes strip 10% of enemy flat armor mitigation for 2 turns." },
      { tier: "Lvl 75 Master Artisan", title: "Sunder-Loom", unlock: "Heavy strikes strip 20% of enemy flat armor mitigation for 3 cadences." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Severed Scabbard", unlock: "Grants 'Naked Steel' — while wielded without a shield, melee attacks refund 1 Action Point on posture-shattering blows." }
    ],
    connectedSpokes: ["spoke-1-bastion", "spoke-12-stance", "spoke-11-smithing"]
  },
  {
    id: "spoke-12-stance",
    name: "The Stance Spoke (Poise & Restraint)",
    number: 12,
    dominion: "Iron",
    category: "Combat",
    color: "#b45309",
    originalVirtue: "The diplomat's balanced pivot. Standing firm before screaming hosts, rooted in dignity, evading panic with steady breath and peaceful restraint before the storm.",
    corruptedDistortion: "Berserk frenzy. Stomping iron heels that grind enemy bones into dust, ignoring personal wounds in a suicidal forward charge.",
    purpose: "Controls the player's core Posture Bar, stance-break recovery, center of gravity, and Action Point cadence under duress.",
    consumes: ["Supple Greave Liners (Spoke 6 Trapping)", "Balance Gyros (Spoke 4 Inscription)", "Ration Stews (Spoke 5 Alchemy)"],
    produces: ["Tactical Stance Forms", "Deflection Katas", "Poise Tonics"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Firm Rooting", unlock: "Recover from posture stagger 25% faster; knockback distance reduced." },
      { tier: "Lvl 50 Journeyman", title: "Recoil Buffer", unlock: "Blocking heavy attacks drains 30% less posture while standing on stone." },
      { tier: "Lvl 75 Master Artisan", title: "The Sheathed Verge", unlock: "Parrying an enemy attack immediately restores 25% of your own posture meter." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Diplomat's Poise", unlock: "Grants 'Inviolable Center' — your stance cannot be broken by attacks from the front while you hold unspent Action Points." }
    ],
    connectedSpokes: ["spoke-1-bastion", "spoke-2-edge", "spoke-13-breath"]
  },

  // --- Dominion II: Ether (Mind & Glyphs) - Under Caelen (East: 3, 4, 5 with 4 Defining) ---
  {
    id: "spoke-3-sorcery",
    name: "Aetheric Sorcery (Resonance & Ley-lines)",
    number: 3,
    dominion: "Ether",
    category: "Esoteric",
    color: "#38bdf8",
    originalVirtue: "The intuitive song. Attuning personal spirit to the hum of ley-currents, listening to the natural harmonics of the cosmos before speaking.",
    corruptedDistortion: "Dead algorithmic calculation. Forcing ley-lines into geometric grid-clamps and draining atmospheric mana until forests wither into salt.",
    purpose: "Commands spell resonance, elemental refraction, field control, and mana conduit alignments across the ether spectrum.",
    consumes: ["Refined Luminary Flux (Spoke 5 Alchemy)", "Chiseled Quartz Prisms (Spoke 10 Quarrying)", "Runed Vellum (Spoke 4 Inscription)"],
    produces: ["Ley-Spells", "Resonant Wards", "Aetheric Disruption Bolts"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Harmonic Tone", unlock: "Spell casting noise reduced by 40%; ley-draw consumes 15% less mental stamina." },
      { tier: "Lvl 50 Journeyman", title: "Prismatic Splice", unlock: "Resonance wards reflect 20% of elemental spell damage back at the caster." },
      { tier: "Lvl 75 Master Artisan", title: "Meridian Conductor", unlock: "Weave two spells into a single casting cadence with zero elemental backlash." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Flowing Meridian", unlock: "Grants 'Aetheric Dissolution' — turn incoming magical damage into restorative posture." }
    ],
    connectedSpokes: ["spoke-4-inscription", "spoke-5-alchemy", "spoke-10-quarrying"]
  },
  {
    id: "spoke-4-inscription",
    name: "Sacred Inscription (Rune-Carving & Seals)",
    number: 4,
    dominion: "Ether",
    category: "Esoteric",
    color: "#0284c7",
    originalVirtue: "The living word. Carving ancient words of remembrance into monuments to honor fallen heroes and record peaceful covenants.",
    corruptedDistortion: "The Scribed Wedge. Brands burned into the flesh of conscripts and citizens to index them as numerical assets for imperial war.",
    purpose: "Enables etching True and Corrupted heraldic symbols onto armor surfaces, weapon blades, and threshold ward-stones.",
    consumes: ["Ground Mineral Pigments (Spoke 10 Quarrying)", "Gallnut Ink (Spoke 8 Forestry)", "Chiseled Slate Tablets (Spoke 9 Masonry)"],
    produces: ["Armor Sigils", "Ward Parchments", "Sanctum Treaties"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Clean Chisel", unlock: "Inscribed symbols retain potency through 25 additional combat encounters." },
      { tier: "Lvl 50 Journeyman", title: "Deep Groove", unlock: "Sigils inscribed on shields grant +10% extra posture resistance." },
      { tier: "Lvl 75 Master Artisan", title: "Dual Etching", unlock: "Armor pieces can hold both a True Form symbol and a Corrupted Form symbol simultaneously." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Living Glyph", unlock: "Grants 'Scribe of Eternity' — any sigil you engrave onto stone or armor becomes permanent and immune to decay." }
    ],
    connectedSpokes: ["spoke-3-sorcery", "spoke-5-alchemy", "spoke-11-smithing"]
  },
  {
    id: "spoke-5-alchemy",
    name: "Grim Alchemy (Distillation & Posture Draughts)",
    number: 5,
    dominion: "Ether",
    category: "Production",
    color: "#06b6d4",
    originalVirtue: "The healing balm. Brewing soothing broths from alpine herbs to mend broken limbs, ease fevered minds, and sustain travelers through blizzards.",
    corruptedDistortion: "The vivisection beaker. Brewing toxic battle-stimulants that numb fear and pain, burning out soldiers' organs in exchange for ten minutes of frenzy.",
    purpose: "Extracts reagents, brews combat posture elixirs, creates preserving agents, and mixes purifying fluxes for metallurgical smelting.",
    consumes: ["Bile & Gland Reagents (Spoke 6 Trapping)", "Wild Herbs & Moss (Spoke 7 Wayfinding)", "Volcanic Ash (Spoke 10 Quarrying)"],
    produces: ["Posture Draughts", "Smelting Fluxes", "Cauterizing Salves", "Neutralizing Salts"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Sterile Alembic", unlock: "Potions yield 25% more doses per brew; toxin side-effects reduced." },
      { tier: "Lvl 50 Journeyman", title: "Adrenaline Distillation", unlock: "Combat draughts grant +1 bonus Action Point during turn 1 of battle." },
      { tier: "Lvl 75 Master Artisan", title: "Pure Catalyst", unlock: "Eliminates all negative toxic buildup from consuming high-tier posture elixirs." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Great Alembic", unlock: "Grants 'Panacea of the Crag' — brews a legendary elixir once per dawn that instantly repairs shattered posture." }
    ],
    connectedSpokes: ["spoke-3-sorcery", "spoke-10-quarrying", "spoke-11-smithing"]
  },

  // --- Dominion III: Frontier (Wilds & Survival) - Under Mera (South: 6, 7, 8 with 7 Defining) ---
  {
    id: "spoke-6-trapping",
    name: "Beast Trapping & Tanning (Sinew & Hidecraft)",
    number: 6,
    dominion: "Frontier",
    category: "Gathering",
    color: "#047857",
    originalVirtue: "The honest hunt. Taking only what the family needs for winter warmth, honoring the beast's spirit, wasting neither bone, tendon, nor marrow.",
    corruptedDistortion: "The slaughter pens. Catching wild creatures in razor-wire cages to harvest pelts for imperial vanity, leaving thousands of carcasses to rot.",
    purpose: "Yields supple hides for armor lining, bowstrings, animal sinew, venom glands, and companion scouting instincts.",
    consumes: ["Tempered Wire Snares (Spoke 11 Smithing)", "Aromatic Baits (Spoke 5 Alchemy)", "Hollow Calling Horns (Spoke 8 Forestry)"],
    produces: ["Supple Greave Leather", "Heavy Fur Mantles", "Sinew Bowstrings", "Beast Venoms"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Quiet Step", unlock: "Footsteps make no sound in brush; traps have a 25% higher catch rate." },
      { tier: "Lvl 50 Journeyman", title: "Seamless Tanner", unlock: "Cures armor leather that reduces weight-class penalty by 1 tier (e.g. Medium to Light agility)." },
      { tier: "Lvl 75 Master Artisan", title: "Predator Mimicry", unlock: "Befriend apex predators; ride dire-elk across snowy mountain chasms." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Pinned Beast", unlock: "Grants 'Pruning Caliper' — snare traps automatically break the posture of any enemy entering them." }
    ],
    connectedSpokes: ["spoke-7-wayfinding", "spoke-8-forestry", "spoke-1-bastion"]
  },
  {
    id: "spoke-7-wayfinding",
    name: "Wayfinding & Cartography (Topography & The Horizon Needle)",
    number: 7,
    dominion: "Frontier",
    category: "Survival",
    color: "#10b981",
    originalVirtue: "The patient pathfinder. Guiding lost caravans through mountain passes by reading the stars and water-flow, leaving cairns for strangers.",
    corruptedDistortion: "The imperial grid. Mapping ancient wilderness solely to parcel it out for logging concessions, slave mines, and fortresses.",
    purpose: "Unlocks overland navigation, hidden path discovery, acoustic geological surveying, and hazard avoidance in unmapped terrain.",
    consumes: ["Cured Parchment (Spoke 6 Trapping)", "Charcoal Pencils (Spoke 8 Forestry)", "Lodestones (Spoke 10 Quarrying)"],
    produces: ["Topographical Charts", "Trail Cairn Markers", "Acoustic Survey Notes"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Star Reckoning", unlock: "Travel speed increased by 15% across rough granite crags and mountain scree." },
      { tier: "Lvl 50 Journeyman", title: "Subterranean Sense", unlock: "Detects hidden cave drafts and underground water veins before mining into them." },
      { tier: "Lvl 75 Master Artisan", title: "Surveyor's Triangulation", unlock: "Reveals the location of ancient undiscovered sanctums within a 5-league radius." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Horizon", unlock: "Grants 'Eye of the Osprey' — navigate blizzards and fog without penalty; teleport between consecrated trail cairns." }
    ],
    connectedSpokes: ["spoke-6-trapping", "spoke-8-forestry", "spoke-10-quarrying"]
  },
  {
    id: "spoke-8-forestry",
    name: "Wild Forestry & Logging (Timber & Arborcraft)",
    number: 8,
    dominion: "Frontier",
    category: "Gathering",
    color: "#059669",
    originalVirtue: "The grove steward. Harvesting only wind-fallen or diseased timber, planting three acorns for every trunk felled, respecting the elder briars.",
    corruptedDistortion: "The clear-cut furnace. Ripping ancient groves out by the roots to feed massive industrial blast-furnaces, leaving barren mud wastes.",
    purpose: "Supplies hardwood shafts for polearms, timber scaffolding for masonry, charcoal for blacksmithing, and medicinal bark resins.",
    consumes: ["Tempered Felling Axes (Spoke 11 Smithing)", "Hardened Pitch (Spoke 5 Alchemy)", "Hauling Harnesses (Spoke 6 Trapping)"],
    produces: ["Iron-Ash Lumber", "Hardwood Charcoal", "Bow Staves", "Amber Rosin"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Clean Wedge", unlock: "Felling trees takes 30% fewer strokes; logs drop without splintering." },
      { tier: "Lvl 50 Journeyman", title: "Slow Kiln", unlock: "Yields 50% more premium charcoal per cord of wood in forest kiln pits." },
      { tier: "Lvl 75 Master Artisan", title: "Heartwood Selection", unlock: "Harvest rare Heartwood capable of absorbing divine weapon impacts without breaking." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Living Timber", unlock: "Grants 'Steward's Renewal' — felled trees immediately sprout vigorous saplings; wooden weapons self-repair over time." }
    ],
    connectedSpokes: ["spoke-6-trapping", "spoke-7-wayfinding", "spoke-11-smithing"]
  },

  // --- Dominion IV: Earth (Labor & Bedrock) - Under Bram (West: 9, 10, 11 with 10 Defining) ---
  {
    id: "spoke-9-masonry",
    name: "Masonry & Architecture (Enduring Monoliths)",
    number: 9,
    dominion: "Earth",
    category: "Production",
    color: "#c2410c",
    originalVirtue: "The thousand-year arch. Raising aqueducts and bridges that harmonize with mountain floods, enduring for generations without sagging.",
    corruptedDistortion: "The Megalithic Idol. Colossal vanity monuments and towering fortresses built on the backs of starving slaves to glorify the Ascended Gods.",
    purpose: "Constructs defensive redoubts, public granaries, aqueducts, sanctum altars, and durable stone foundation roads.",
    consumes: ["Granite Slabs (Spoke 10 Quarrying)", "Quicklime Mortar (Spoke 5 Alchemy)", "Hardwood Scaffolding (Spoke 8 Forestry)"],
    produces: ["Sanctum Keeps", "Aqueduct Channels", "Defensive Bastions", "Altar Pedestals"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Keystone Placer", unlock: "Stone fortifications take 30% less siege damage and resist weathering." },
      { tier: "Lvl 50 Journeyman", title: "Mortar Master", unlock: "Constructs stone walls with zero foundation slippage even along steep scree." },
      { tier: "Lvl 75 Master Artisan", title: "Aqueduct Engineer", unlock: "Construct water conduits that double crop yield and prevent famine in adjacent settlements." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Grand Mason", unlock: "Grants 'Monolith of Ages' — build stone structures that can withstand divine god-strikes without crumbling." }
    ],
    connectedSpokes: ["spoke-10-quarrying", "spoke-11-smithing", "spoke-7-wayfinding"]
  },
  {
    id: "spoke-10-quarrying",
    name: "Geological Quarrying (Stone & Bedrock Extraction)",
    number: 10,
    dominion: "Earth",
    category: "Gathering",
    color: "#fb923c",
    originalVirtue: "The Sacred Reciprocity. Listening to the acoustic ringing of the rock face, cutting along natural strata seams, apologizing to the mountain for each stone taken.",
    corruptedDistortion: "The Strip-Mine Chasm. Dynamite and slave labor gouging miles of sacred mountain into open pits, burying pristine rivers in sulfuric tailings.",
    purpose: "Harvests building basalt, iron ores, rare quartz crystal, whetstones, and mineral fluxes for all production spokes.",
    consumes: ["Hardened Steel Picks (Spoke 11 Smithing)", "Splitting Wedges (Spoke 9 Masonry)", "Blasting Powder (Spoke 5 Alchemy)"],
    produces: ["Dark-Iron Ore", "Granite Slabs", "Whetstone Grit", "Quartz Prisms"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Acoustic Ear", unlock: "Tapping a rock face reveals ore purity and hidden gem hollows without fracturing the vein." },
      { tier: "Lvl 50 Journeyman", title: "Fracture Striker", unlock: "Splits stone along natural faults, reducing stamina consumption by 35%." },
      { tier: "Lvl 75 Master Artisan", title: "Cleavage Cleave", unlock: "Extract raw monolith blocks in one-third the time with zero fractured waste." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Sacred Bedrock", unlock: "Grants 'Heart of Granite' — complete immunity to cave-ins; strike any rock face to locate water or precious silver." }
    ],
    connectedSpokes: ["spoke-9-masonry", "spoke-11-smithing", "spoke-3-sorcery"]
  },
  {
    id: "spoke-11-smithing",
    name: "Artisan Smithing (Anvil & Ingot Tempering)",
    number: 11,
    dominion: "Earth",
    category: "Production",
    color: "#ea580c",
    originalVirtue: "The Reverent Shaper. Heating ore with patient charcoal, striking only when the iron is willing, quenching in ash-oil to ensure the blade never betrays its master.",
    corruptedDistortion: "The Open Kiln. Molten slag poured into crude mass-production molds, working laborers until they collapse into the molten vat to keep imperial quotas met.",
    purpose: "The beating industrial heart: turns ores into blades, armor plates, tools, pickaxes, and sacred metal symbols.",
    consumes: ["Raw Dark-Iron & Copper Ore (Spoke 10 Quarrying)", "Lump Charcoal (Spoke 8 Forestry)", "Purifying Flux (Spoke 5 Alchemy)"],
    produces: ["Folded Weapon Billets", "Artisan Armor Plates", "Hardened Tools", "Inscribed Heraldic Medallions"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "True Quench", unlock: "Items forged possess +15% durability and never crack under initial hammer blows." },
      { tier: "Lvl 50 Journeyman", title: "Slag Skimmer", unlock: "Reduces metal impurities, increasing base armor damage reduction by +3." },
      { tier: "Lvl 75 Master Artisan", title: "Pattern Welder", unlock: "Forge Damascus steel that grants +20% posture damage on weapon impacts." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Slag-King", unlock: "Grants 'The Open Kiln' — craft masterwork plate armor using 50% fewer raw ingots; can forge barehanded without tools." }
    ],
    connectedSpokes: ["spoke-1-bastion", "spoke-2-edge", "spoke-10-quarrying"]
  },

  // --- Dominion V: Axis (Stillness & Void) - Under Soran (Center Hub: 13, 14, 15) ---
  {
    id: "spoke-13-breath",
    name: "The Breath Spoke (Stamina & Stillness)",
    number: 13,
    dominion: "Axis",
    category: "Stillness",
    color: "#a855f7",
    originalVirtue: "The rhythm of the tides. Drawing stamina from the stillness of the void, never over-exerting, never panicked.",
    corruptedDistortion: "The Vacuum. Sucking the air from the lungs of allies and enemies alike to fuel a tireless, suffocating advance.",
    purpose: "Governs stamina regeneration, action point maximums, and the reduction of stamina costs for physical exertion.",
    consumes: ["Lotus Incense (Spoke 5 Alchemy)", "Woven Meditation Mats (Spoke 6 Trapping)"],
    produces: ["Action Points", "Stamina Reserves", "Clarity"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Measured Inhale", unlock: "Stamina regenerates 10% faster." },
      { tier: "Lvl 50 Journeyman", title: "Deep Lung", unlock: "Max stamina increased by 20." },
      { tier: "Lvl 75 Master Artisan", title: "Void Breath", unlock: "First action of each turn costs 0 stamina." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Unbroken Wind", unlock: "Grants 'Tireless' — You never suffer exhaustion penalties." }
    ],
    connectedSpokes: ["spoke-14-vessel"]
  },
  {
    id: "spoke-14-vessel",
    name: "The Vessel Spoke (Soul & Equanimity)",
    number: 14,
    dominion: "Axis",
    category: "Stillness",
    color: "#a855f7",
    originalVirtue: "The empty cup. A mind completely devoid of ego, able to receive the world's pain without breaking.",
    corruptedDistortion: "The Petrified Tear. A soul encased in unbreakable stone, feeling nothing, caring for nothing, absolute apathy.",
    purpose: "Determines resistance to psychological/magical corruption, maximum resonance (mana), and composure.",
    consumes: ["Purified Spring Water (Spoke 7 Wayfinding)", "Aetheric Salts (Spoke 3 Sorcery)"],
    produces: ["Resonance", "Corruption Resistance"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Still Surface", unlock: "+15% resistance to mental status effects." },
      { tier: "Lvl 50 Journeyman", title: "Deep Vessel", unlock: "Max resonance increased by 30." },
      { tier: "Lvl 75 Master Artisan", title: "Sunyata's Embrace", unlock: "Taking damage restores a small amount of resonance." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Empty Cup", unlock: "Grants 'Ego Death' — Immune to all fear and mind-control effects." }
    ],
    connectedSpokes: ["spoke-13-breath", "spoke-15-unarmored"]
  },
  {
    id: "spoke-15-unarmored",
    name: "The Unarmored Stance (Zero-Weight Discipline)",
    number: 15,
    dominion: "Axis",
    category: "Stillness",
    color: "#a855f7",
    originalVirtue: "The naked blade. Walking into danger with no physical protection, trusting entirely in intuition and cosmic flow.",
    corruptedDistortion: "The Iron Skin. Flesh transmuted to literal stone, sacrificing all speed and humanity for invulnerability.",
    purpose: "Provides combat bonuses that scale inversely with equipped armor weight. The pinnacle of evasion and speed.",
    consumes: ["Lightweight Linens (Spoke 6 Trapping)", "Balancing Weights (Spoke 11 Smithing)"],
    produces: ["Evasion", "Movement Speed", "Counter-Attack Chance"],
    milestones: [
      { tier: "Lvl 25 Apprentice", title: "Flowing Silk", unlock: "If wearing no heavy armor, evasion increases by +10%." },
      { tier: "Lvl 50 Journeyman", title: "Wind Walker", unlock: "Movement speed increased by 20% when unencumbered." },
      { tier: "Lvl 75 Master Artisan", title: "Precognition", unlock: "Successfully dodging an attack grants a free counter-strike." },
      { tier: "Lvl 99 Ascendant Cap", title: "Mastery Cape of the Naked Blade", unlock: "Grants 'Ghost Step' — 50% chance to completely phase through any physical attack while at Zero-Weight." }
    ],
    connectedSpokes: ["spoke-14-vessel"]
  }
];

export const pillarsData: Pillar[] = [
  {
    id: "pillar-1",
    number: "PILLAR 01",
    title: "Time Spent = Genuine Mastery",
    subtitle: "The Antidote to Modern Instant-Gratification RPGs",
    designOrigin: "Old School RuneScape & Classic MMOs",
    coreRule: "1:1 Direct Correlation — No daily stamina gates, zero microtransactions, no pay-to-accelerate mechanics. In Adversity, greatness cannot be bought, rented, or skipped. Every level, recipe, and milestone gear piece directly mirrors dedicated player hours. Hard work commands unmistakable community respect in the game world.",
    developmentReferencePoint: "Every system build must guarantee that veteran player investment retains permanent prestige and utility without artificial season resets.",
    immutableGoldenRule: "Never grant power through convenience skips. If a player displays a relic or title, onlookers must know with 100% certainty what ordeal was overcome.",
    concreteGameplayExpressions: [
      {
        title: "Milestone Cape & Gear Unlocks",
        description: "Reaching mastery tiers (Lv. 25, 50, 75, 99) unlocks non-purchasable cosmetic cloaks, unique overworld animations, and specialized field utility perks.",
      },
      {
        title: "Anti-Treadmill Economy",
        description: "Items do not become obsolete with each minor patch; legendary crafted gear remains historically significant across all world tiers.",
      },
      {
        title: "Meaningful Downtime",
        description: "Campfires, cooking, tavern rumors, and field repairs create rewarding rhythm between perilous dungeon delves.",
      },
    ],
    codebaseComplianceChecklist: [
      "Milestone capes require verifiable in-game activity criteria (no vendor shortcuts)",
      "Equipment durability repair loops require artisan crafter materials, not currency sinks",
      "Player trade prices scale with raw labor and extraction difficulty",
      "All progression curves are monotonic and publicly inspectable in code",
    ],
  },
  {
    id: "pillar-2",
    number: "PILLAR 02",
    title: "Unguided Hand-Crafted World",
    subtitle: "True Exploration Without Compass Markers or GPS Trails",
    designOrigin: "The Elder Scrolls III: Morrowind",
    coreRule: "World Literacy Over HUD Clutter — True exploration thrives on spatial observation, topographical memory, and diegetic directions given by mortals in the world. If you find a hidden vein of Dark-Iron or a forgotten crypt, it is because you observed the basalt strata and followed the river's bend, not because an icon popped up.",
    developmentReferencePoint: "If an adventurer discovers a hidden sanctum, it is because they read the world, listened in taverns, and deciphered landscape clues.",
    immutableGoldenRule: "Never rob the player of the triumph of discovery by placing a floating objective chevron over the mystery.",
    concreteGameplayExpressions: [
      {
        title: "Acoustic Prospecting & Surveying",
        description: "Striking bedrock with geological hammers reveals resonance pitches signaling hollow chambers or mineral densities.",
      },
      {
        title: "Diegetic Tavern Lore & Cartography",
        description: "Directions are given via natural landmarks: 'three miles north past the split oak where the granite turns red at sundown.'",
      },
      {
        title: "Environmental Consequence",
        description: "Zones explain their history through physical architectural ruin, slag heaps, and weather wear, not codex popups.",
      },
    ],
    codebaseComplianceChecklist: [
      "Zero minimap objective beacons, floating arrows, or compass question marks",
      "Overworld maps must be hand-drawn parchment cartography with player-inscribed notes",
      "NPC travel directions must reference tangible world geometry and wind patterns",
      "Dungeon entries rely on physical keyholes, counterweights, and environmental puzzles",
    ],
  },
  {
    id: "pillar-3",
    number: "PILLAR 03",
    title: "Tactical Turn-Based Combat (The Lotus Philosophy)",
    subtitle: "Zero Hit-Chance RNG, Deterministic Mitigation, and Weight Class Dynamics",
    designOrigin: "Classic CRPGs",
    coreRule: "100% Deterministic Resolution — Attacks always connect. Combat is a contest of foresight, stamina, positioning, and posture threshold management, not rolling 73% dice in an invisible calculator.",
    developmentReferencePoint: "Player intelligence and tactical discipline are always respected. Every loss must be traceable to a tactical mistake, never to random misfortune.",
    immutableGoldenRule: "A strike aimed true never misses by arbitrary chance; it is deflected by armor, absorbed by posture, or punished by positioning.",
    concreteGameplayExpressions: [
      {
        title: "Weight Class Triforce (H / M / L + Zero Armor Center)",
        description: "Heavy maximizes damage reduction & poise at high AP cost; Medium balances velocity; Light gains evasion AP; Zero Armor gains +2 AP and 4-tile sprint with 100% unmitigated damage peril.",
      },
      {
        title: "Posture Stability & Execution Cleaves",
        description: "Posture acts as the primary buffer. Depleting enemy posture to 0 shatters their guard, unlocking high-commitment Execution strikes.",
      },
      {
        title: "Telegraphed Enemy Intention",
        description: "Elites and bosses telegraph their attack stances (Overhand, Cleave, Thrust), allowing players to react with Parries or Guard counters.",
      },
    ],
    codebaseComplianceChecklist: [
      "Zero hit-chance or evasion percentage RNG in the combat pipeline",
      "Deterministic damage threshold formulas (Flat Absorption + Posture Mitigators)",
      "Explicit telegraph states on all hostile actions prior to player execution",
      "Clear HUD indicators for Posture, Stagger Risk, and Action Points",
    ],
  },
  {
    id: "pillar-4",
    number: "PILLAR 04",
    title: "The 12 Interconnected Spokes",
    subtitle: "Play the Sides You Love; Feel the Synergy Across All",
    designOrigin: "Vanilla World of Warcraft",
    coreRule: "Symbiotic Dependency Without Artificial Classes — No warrior/mage/rogue silos. Gathering, refining, combat, and esoteric disciplines exist in an airtight economic loop.",
    developmentReferencePoint: "The greatest weapons demand inputs from miners, woodcutters, alchemists, and scribes. Every player role is an essential organ in the living world.",
    immutableGoldenRule: "No discipline is an island. Progress in any spoke reverberates through the gear, posture, and survivability of every companion.",
    concreteGameplayExpressions: [
      {
        title: "1:1 Input/Output Handshakes",
        description: "Smithing requires Quarry stone ballast and Forestry charcoal; Inscription requires Quarry pigment and Forestry gallnuts; Combat relies on Alchemical stamina tonics.",
      },
      {
        title: "3-Player Triad & Tavern Mercenary AI",
        description: "Parties thrive on the balance of Wayfarer (Scout), Artificer (Crafter/Gatherer), and Vanguard (Combatant), supported by 75% efficiency NPC hirelings for solo play.",
      },
      {
        title: "Lone Wanderer Protocol",
        description: "Solo adventurers venturing without companions gain active adversity perks (+30% carry capacity, +15% posture resistance) to conquer trials alone.",
      },
    ],
    codebaseComplianceChecklist: [
      "Every crafted item must require at least two distinct spoke component inputs",
      "All 12 disciplines must feature Level 25, 50, 75, and 99 milestone perks",
      "Classless progression state machine allows freely mixing abilities from any of the 15 Spokes",
      "Tavern mercenary companion stats strictly calibrated at 75% player baseline",
    ],
  },
];
