import { WarpedGod } from "../types";

export const initialWarpedPantheon: WarpedGod[] = [
  {
    id: "alden-iron-dominion",
    mortalName: "Alden",
    name: "Alden, The Weeping Bull",
    publicTitle: "The Sovereign of the Iron Pillar",
    folkWhisper: "The Weeping Bull / The Monster Unsheathed",
    dominion: "Iron",
    dominionTitle: "The War Pillar (The Iron Triad)",
    mortalVirtue: "Diplomat-poet in his youth; a paragon of supreme restraint, bearing the crushing weight and insults of warring nations without breaking or drawing steel.",
    fracturedCorruption: "When his peaceful words finally failed and his family was slaughtered at the treaty altar, he cast off his armor and drew the naked edge in boundless berserk fury. In ascension, his heavy plate fused irreversibly into his own skeletal marrow; his skull ruptured into upward-curving bone horns, locking him in an eternal, weeping frenzy of slaughter.",
    warpedPhysiology: "Towering 9-foot frame of blackened pig-iron plate grafted seamlessly into calcified bone. His ribcage acts as an exposed iron portcullis, his weeping tear ducts leak boiling furnace-tar, and twin jagged bone spikes tear upward through his temples.",
    consumedSpokes: ["The Bastion Spoke (Armor & Absorption)", "The Edge Spoke (Blades & Impact)", "The Stance Spoke (Poise & Discipline)"],
    armorWeightAffinity: "Heavy",
    armorSlotAffinity: "Cuirass",
    divineDecree: "Every sheath is a lie. Every shield is a prayer spoken by cowards. Bleed the iron dry until only the bone edge remains.",
    relic: {
      name: "The Envoy's Sundered Quill-Blade",
      description: "A ceremonial diplomatic longsword whose golden script has been gouged out and re-sharpened into a jagged executioner's edge, dripping with cold coagulated grease."
    },
    trueSymbol: {
      name: "The Anvil of the Envoy",
      designation: "True / Healthy Form",
      geometry: "Broad grounded trapezoid with unmarred symmetry, housing a golden balanced seed inside.",
      visualDescription: "An unyielding, harmonious sanctuary of patience. A broad downward-pointing anvil holding an unbroken core.",
      inUniverseMeaning: "Represents Alden's prime as the diplomat-poet who bore the suffering of entire realms so common blood would not flow.",
      glyph: "trapezoid",
      accentColor: "#f59e0b"
    },
    corruptedSymbol: {
      name: "The Horned Calyx / The Weeping Bull",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A burst martial ring shattered by two jagged upward-thrusting bone spikes, with tears of molten lead.",
      visualDescription: "The circular perimeter of martial discipline violently torn apart from within by horned brutality.",
      inUniverseMeaning: "The emblem of Alden's ascension: restraint shattered, mercy discarded, the monster permanently unsheathed.",
      glyph: "horned-calyx",
      accentColor: "#ef4444"
    },
    tacticalBlessing: {
      name: "Anvil's Blood-Tithes",
      mechanic: "Absorb 40% of incoming physical damage as flat posture mitigation; when posture drops below 25%, gain +30% brutal posture-breaking force."
    },
    chronicleExcerpt: "He who wrote the thirty songs of peace now speaks only through the percussion of iron cracking against skull. Do not pray to Alden for victory; he answers only with slaughter."
  },
  {
    id: "caelen-ether-dominion",
    mortalName: "Caelen",
    name: "Caelen, The Salt-Tongue",
    publicTitle: "The Arch-Logician of the High Meridian",
    folkWhisper: "The Salt-Tongue / The Calcified Eye",
    dominion: "Ether",
    dominionTitle: "The Mind Pillar (The Ether Triad)",
    mortalVirtue: "Deep, universal empathy. A master of song and ancient linguistics who sought to translate every grievance and dissolve every misunderstanding between mortal souls.",
    fracturedCorruption: "To comprehend every grief in existence, he opened his consciousness to the total totality of mortal misery. The sheer noise of human weeping broke his psyche; to preserve order, he calcified his emotions into dead algorithmic computation, turning the fluid mysteries of sorcery into rigid, frozen geometric equations.",
    warpedPhysiology: "Slender, levitating silhouette draped in crystallized salt robes. His tongue is a desiccated cylinder of mineral salt; his sensory eyes have been replaced by two rotating brass sextants clicking in perpetual binary calculation.",
    consumedSpokes: ["Aetheric Sorcery", "Sacred Inscription", "Grim Alchemy"],
    armorWeightAffinity: "Light",
    armorSlotAffinity: "Helm",
    divineDecree: "Silence the chaotic heartbeat. All sorrow is merely an unsolved arithmetic error. Compute the stillness.",
    relic: {
      name: "The Salt-Chamber Astrolabe",
      description: "A brass ringed astrolabe that whispers in dead languages, measuring the precise volume of salt in mortal tears to calculate enemy intent."
    },
    trueSymbol: {
      name: "The Flowing Meridian",
      designation: "True / Healthy Form",
      geometry: "Gentle sinusoidal curve woven through an open circular aura.",
      visualDescription: "Harmonious resonance where intellect flows like water, listening before calculating.",
      inUniverseMeaning: "The ancient discipline of mental clarity, empathy, and intuitive sorcery before logic was weaponized into cold tyranny.",
      glyph: "circle",
      accentColor: "#38bdf8"
    },
    corruptedSymbol: {
      name: "The Scribed Meridian / Grounding Wedge",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A razor-straight vertical meridian split by a descending triangular salt-wedge.",
      visualDescription: "Cold, geometric dissection pinning thought into sterile mathematical grids.",
      inUniverseMeaning: "The mark of Caelen's calcification: intellect severed from empathy, reducing all living magic to dead algorithmic constraints.",
      glyph: "sextant",
      accentColor: "#0284c7"
    },
    tacticalBlessing: {
      name: "Calculated Nullification",
      mechanic: "Whenever you parry a spell or elemental impact, reduce all enemy action points by 1 on the following cadence."
    },
    chronicleExcerpt: "Caelen heard every orphan's prayer at once, and in horror, he plugged his ears with salt and replaced his heart with a geometric grid."
  },
  {
    id: "mera-frontier-dominion",
    mortalName: "Mera",
    name: "Mera, The Silent Orchard",
    publicTitle: "The Sovereign of the Boundless Sward",
    folkWhisper: "The Silent Orchard / The Taxonomist of Flesh",
    dominion: "Frontier",
    dominionTitle: "The Wild Pillar (The Frontier Triad)",
    mortalVirtue: "Wild communion and pastoral grace. She lived in deep symbiosis with the wild fauna, knowing every root, trail, and burrow without disturbing the untamed canopy.",
    fracturedCorruption: "Watching poachers, woodcutters, and warbands strip the sacred ancient glades, her grief curdled into frantic possessiveness. In ascension, she declared that the only safe beast is a pinned beast, and the only pure forest is one sealed behind airtight glass terrariums.",
    warpedPhysiology: "An eight-limbed dryad-form entwined in briar vines and fossilized amber. Her hands terminate in precision brass calipers and pruning shears; her chest cavity contains a humming, sterile terrarium where ancient butterflies flap silently under glass.",
    consumedSpokes: ["Cartography & Surveying", "Forestry & Woodcraft", "Trapping & Wilderness"],
    armorWeightAffinity: "Medium",
    armorSlotAffinity: "Greaves",
    divineDecree: "The wild was too fragile for sunlight. To save life, one must pin its wings and catalogue its silence.",
    relic: {
      name: "The Pruning Caliper of the First Root",
      description: "A massive botanical implement crafted from petrified rosewood and barbed silver, capable of severing tendons with surgical stillness."
    },
    trueSymbol: {
      name: "The Wandering Compass",
      designation: "True / Healthy Form",
      geometry: "An open four-leaf spiral blooming outward without boundary borders.",
      visualDescription: "Fluid organic branches pointing in all directions, celebrating untamed wilderness and discovery.",
      inUniverseMeaning: "The mortal art of moving with the wild, respecting prey, and reading the terrain without subjugating it.",
      glyph: "antler",
      accentColor: "#34d399"
    },
    corruptedSymbol: {
      name: "The Constricted Meridian / Caliper Snare",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "Two interlocking curved caliper jaws tightening around a withered sprout.",
      visualDescription: "A brutal cage-like geometry representing nature caught in an unyielding imperial clamp.",
      inUniverseMeaning: "Mera's imperial seal: every tree numbered, every beast tagged, wilderness choked into museum-like paralysis.",
      glyph: "caliper",
      accentColor: "#10b981"
    },
    tacticalBlessing: {
      name: "Caliper's Precision Flank",
      mechanic: "Gain +20% evasion against frontline heavy assaults; striking an immobilized target refunds 1 Action Point."
    },
    chronicleExcerpt: "She loved the deer so much she built a cage of silver thorns around its neck, so it would never wander into a hunter's path again."
  },
  {
    id: "bram-earth-dominion",
    mortalName: "Bram",
    name: "Bram, The Slag-King",
    publicTitle: "The Grand Mason / The Hearth-Father",
    folkWhisper: "The Slag-King / The Open Kiln",
    dominion: "Earth",
    dominionTitle: "The Labor Pillar (The Earth Triad)",
    mortalVirtue: "The Reverent Shaper. He was an architect and master blacksmith who revered stone and ore as sacred. His philosophy was Sacred Reciprocity: to pull stone from the mountain is a violent debt that must be repaid with monumental reverence and zero waste.",
    fracturedCorruption: "When the RingWheel took over, the sheer scale of empire demanded infinite stone and steel. Knowing mortal backs would break under the divine mandate, he threw his own body into the primary furnace to spare them, becoming a self-devouring engine of production. Now he strips mountain ranges to dust in perpetual, molten agony.",
    warpedPhysiology: "A walking kiln of fractured basalt granite bound by glowing copper bands. Through the fissures in his torso spills bubbling molten slag; his breath is sulfur smoke, and his right arm has fused into a colossal pneumatic drop-hammer.",
    consumedSpokes: ["Geological Quarrying", "Artisan Smithing", "Masonry & Construction"],
    armorWeightAffinity: "Heavy",
    armorSlotAffinity: "Gauntlets",
    divineDecree: "The kiln must never go cold! Melt the marrow, crush the mountain, keep the wheels of empire turning through blood and cinder!",
    relic: {
      name: "The Crucible of the First Slag",
      description: "A bottomless iron crucible radiating 1,000°C heat, containing the liquefied remnants of Bram's mortal masterwork tools."
    },
    trueSymbol: {
      name: "The Reverent Chisel & Bedrock",
      designation: "True / Healthy Form",
      geometry: "A level horizontal base supporting an upright equilateral prism with gentle ventilation curves.",
      visualDescription: "Sacred stonework rooted in deep balance, respecting the mountain's natural fissures.",
      inUniverseMeaning: "Mortal craftsmanship honoring the earth: every cut deliberate, every stone placed to outlive centuries without scar.",
      glyph: "chisel",
      accentColor: "#fb923c"
    },
    corruptedSymbol: {
      name: "The Crucible Wedge / Cracked Kiln",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A heavy, downward-crushing triangle splitting an anvil base, with jagged fissures leaking molten channels.",
      visualDescription: "Industrial brute force: crushing structural mass forcing ore past its breaking point.",
      inUniverseMeaning: "Bram's tragic mark: unmitigated extraction, perpetual smelting, and generations burned as kindling for the imperial machine.",
      glyph: "wedge",
      accentColor: "#ea580c"
    },
    tacticalBlessing: {
      name: "Molten Quench Resiliency",
      mechanic: "Your armor can never be fully shattered; suffering a critical blow coats your weapons in molten slag for +15 fire-posture damage."
    },
    chronicleExcerpt: "Bram once wept when an apprentice chipped an ancient pillar. Now, he eats entire mountains for breakfast and regurgitates iron rails."
  },
  {
    id: "soran-axis-center",
    mortalName: "Soran",
    name: "Soran, The Blind Stone",
    publicTitle: "The Lord of the Axis / The Unmoving Eye",
    folkWhisper: "The Blind Stone / The Silent Spoke",
    dominion: "Axis",
    dominionTitle: "The Center Hub (The Vessel of Stillness)",
    mortalVirtue: "The Listener. The anchor of the five companions. Not a warrior, not an artisan, but the master of Sunyata (emptiness, ego-loss, pure equanimity) who held their egos from tearing apart during the mortal journey.",
    fracturedCorruption: "To prevent the other four gods from tearing Alderreach apart with their warring obsessions, Soran absorbed all four of their sins into their own vessel. But the contradiction of boundless slaughter, sterile logic, caged wilderness, and molten industry was too catastrophic: Soran became paralyzed in eternal catatonic stone, blind, deaf, and mute upon the unmoving throne.",
    warpedPhysiology: "An obsidian statue seated upon a motionless dais. Its face is completely featureless, polished smooth like mirror-stone; faint hairline cracks pulse with the conflicting colors of the 4 Dominions, sealed behind an impenetrable petrified crust.",
    consumedSpokes: ["The Breath Spoke (Stamina)", "The Vessel Spoke (Soul & Equanimity)", "The Unarmored Stance (Zero-Weight Discipline)"],
    armorWeightAffinity: "Zero",
    armorSlotAffinity: "Pauldrons",
    divineDecree: "The center does not speak. The center does not weep. The center simply bears the void so the wheel does not fly apart.",
    relic: {
      name: "The Petrified Tear of Sunyata",
      description: "A tear of pure liquid void that never falls, held in static suspension between two curved needles of white bone."
    },
    trueSymbol: {
      name: "The Vessel of Stillness",
      designation: "True / Healthy Form",
      geometry: "A perfect circle enclosing an open, balanced lotus cup.",
      visualDescription: "Pure unarmored equanimity: the mind resting at the center of all storms.",
      inUniverseMeaning: "The original 12th hub of the wheel: where the warrior lays down the blade, breathing in stillness and mastering the zero-weight form.",
      glyph: "lotus",
      accentColor: "#e2e8f0"
    },
    corruptedSymbol: {
      name: "The Pierced Lotus / Void Ouroboros",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A circular ouroboros split down the vertical axis by a razor void-channel with a motionless suspended drop.",
      visualDescription: "Total stillness frozen into dead catatonia: a cold, petrified paralysis radiating zero salvation.",
      inUniverseMeaning: "The hollow idol of the Center: a false peace born of guilt and cosmic numbness, where no prayer is ever heard.",
      glyph: "lotus",
      accentColor: "#94a3b8"
    },
    tacticalBlessing: {
      name: "Sunyata's Void Posture",
      mechanic: "While clad in Zero-Weight attire, dodge actions consume 0 stamina once every 3 turns, and perfect timing negates all posture buildup."
    },
    chronicleExcerpt: "The high priests tell you the Lord of the Axis has achieved sublime peace. Touch the stone, pilgrim, and feel the screaming frozen inside."
  }
];
