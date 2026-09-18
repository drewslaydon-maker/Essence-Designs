import { ArmorSymbol } from "../types";

export const initialArmorSymbols: ArmorSymbol[] = [
  // Alden's Armor Trinity: Chronological Death of His Humanity
  {
    id: "alden-heavy-envoy",
    name: "The Anvil of the Envoy",
    chronologicalEra: "The First Era (The Anvil)",
    weightClass: "Heavy",
    slot: "Cuirass",
    godAffinity: "Alden, The Weeping Bull",
    dominion: "Iron",
    trueForm: {
      name: "The Anvil of the Envoy (Ancient Diplomat)",
      designation: "True / Healthy Form",
      geometry: "Broad grounded trapezoid with unmarred symmetry, enclosing an intact golden seed core.",
      visualDescription: "Solid, unmoving bastion with a centered heart. A sanctuary of divine patience.",
      inUniverseMeaning: "Alden in his mortal youth as the Diplomat-Poet. He bore the weight of empires upon his shoulders without breaking. Heavy armor was forged not as an engine of war, but as a peaceful redoubt to shield the vulnerable.",
      glyph: "trapezoid",
      accentColor: "#f59e0b"
    },
    corruptedForm: {
      name: "The Slag-Welded Carapace",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "Trapezoid distorted by iron barbs and inward-biting rivets that fuse into the wearer's skin.",
      visualDescription: "The plate becomes an agonizing iron maiden. The balanced seed is choked by rusted chains.",
      inUniverseMeaning: "The armor after the massacre: plate riveted directly through flesh into bone so it can never be removed in peace.",
      glyph: "trapezoid",
      accentColor: "#b45309"
    },
    forgingIncantation: "Let the hammer strike seven times cold, three times quenched in tears of statecraft. Bear the insolence of kings and do not yield an inch of soil.",
    postureMitigation: "-45% Posture buildup against heavy blunt blows; +30 Flat Physical Absorption; -15% Dodge cadence.",
    weightSynergy: "Heavy Plate Core: Grants 'Unyielding Bulk' — incoming impacts under 15 damage cause zero posture stagger."
  },
  {
    id: "alden-medium-sheathed-verge",
    name: "The Sheathed Verge",
    chronologicalEra: "The Tension Era (The Sheathed Verge)",
    weightClass: "Medium",
    slot: "Gauntlets",
    godAffinity: "Alden, The Weeping Bull",
    dominion: "Iron",
    trueForm: {
      name: "The Sheathed Verge (The Balanced Pivot)",
      designation: "True / Healthy Form",
      geometry: "Sharp vertical diamond bisected by a centered hairline groove, holding perfect equilibrium.",
      visualDescription: "A taut, perfectly disciplined diamond poised between speech and steel.",
      inUniverseMeaning: "The years of strain. The diplomat realizing his words are failing, yet holding back the blade through sheer willpower. The edge remains half-sheathed, balancing the weight of compromise against imminent blood.",
      glyph: "diamond",
      accentColor: "#fbbf24"
    },
    corruptedForm: {
      name: "The Jagged Verge (The Fractured Hilt)",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A cracked diamond whose central bisection line has snapped into an asymmetrical jagged fang.",
      visualDescription: "The restraint has failed. The scabbard has split open, leaking jagged splinters of steel.",
      inUniverseMeaning: "The moment the treaty broke: the hand trembled, the hilt was gripped in agony, and the edge was partially drawn in blind panic.",
      glyph: "diamond",
      accentColor: "#f97316"
    },
    forgingIncantation: "Fold the high-carbon billet ninety times over folded ash. Keep the tension taut as a drawn lute string, but let the scabbard lock tight until honor is dead.",
    postureMitigation: "-25% Posture buildup; +18% Parrying recovery window; allows fluid 1:1 AP conversions between guard and riposte.",
    weightSynergy: "Medium Bridging: Optimal hybrid stance — zero penalty to dodge while retaining baseline deflection against light blades."
  },
  {
    id: "alden-light-severed-scabbard",
    name: "The Severed Scabbard",
    chronologicalEra: "The Breaking Point (The Severed Scabbard)",
    weightClass: "Light",
    slot: "Greaves",
    godAffinity: "Alden, The Weeping Bull",
    dominion: "Iron",
    trueForm: {
      name: "The Wind-Carved Quill",
      designation: "True / Healthy Form",
      geometry: "Two graceful sweeping arcs curving in mirrored harmony, resembling an untethered eagle wing.",
      visualDescription: "Elegantly curved sweeps embodying swift footwork, diplomatic haste, and light stride.",
      inUniverseMeaning: "The original virtue of the light heraldry: travel lightly, outpace aggression, arrive before war can erupt.",
      glyph: "crescents",
      accentColor: "#38bdf8"
    },
    corruptedForm: {
      name: "The Severed Scabbard (The Breaking Point)",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "Two dynamic, curved crescent arcs violently tearing past each other like unsheathed raking fangs.",
      visualDescription: "Raking crescent shears that resemble torn scabbards and exposed fangs.",
      inUniverseMeaning: "The breaking point: Alden cast off his shield, tore away his breastplate, and drew the naked edge. Pure lethal urgency; no defense remains, only the desperate strike.",
      glyph: "crescents",
      accentColor: "#ef4444"
    },
    forgingIncantation: "Strip away the bronze; shave the iron until it is paper-thin. When they slaughter your treaty, throw the scabbard in their teeth and run them down on barefoot glass.",
    postureMitigation: "-10% Posture capacity, but dodges consume -40% Stamina; +25% Critical strike multiplier when flanking.",
    weightSynergy: "Skirmisher Cadence: Grants 'Naked Edge' — consecutive strikes build adrenaline, raising posture damage by +8% per hit up to +32%."
  },
  {
    id: "alden-ascended-horned-calyx",
    name: "The Horned Calyx (The Monster Unsheathed)",
    chronologicalEra: "The Ascended Corruption (The Horned Calyx)",
    weightClass: "Heavy",
    slot: "Helm",
    godAffinity: "Alden, The Weeping Bull",
    dominion: "Iron",
    trueForm: {
      name: "The Crown of Concord",
      designation: "True / Healthy Form",
      geometry: "An unbroken ring surmounted by twin rounded olive-leaf arches.",
      visualDescription: "A gentle circular coronet symbolizing peaceful communion and united peoples.",
      inUniverseMeaning: "The garland Alden wore at the Grand Conciliation before the betrayal at the altar.",
      glyph: "diadem",
      accentColor: "#a3e635"
    },
    corruptedForm: {
      name: "The Horned Calyx / The Weeping Bull",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "The outer martial ring violently burst open by two jagged upward-thrusting bone spikes, with tears of molten lead.",
      visualDescription: "The skull ruptured into bone horns; the circle of discipline shattered forever.",
      inUniverseMeaning: "The full imperial seal of the Weeping Bull: Alden ascended into eternal frenzy, weeping tears of molten iron as he butchers everything in his path.",
      glyph: "horned-calyx",
      accentColor: "#dc2626"
    },
    forgingIncantation: "Quench in the blood of an unavenged brother. Drive the spikes through the brow until the screams turn into thunder.",
    postureMitigation: "+50% Posture Break threshold against enemy attacks; suffering a stance break instantly emits a concussive shockwave.",
    weightSynergy: "Ascendant Frenzy: While below 30% HP, all attacks bypass 20% of enemy armor posture."
  },

  // The Center Head: Soran's Vessel & The Pierced Lotus (Zero Weight)
  {
    id: "soran-zero-pierced-lotus",
    name: "The Pierced Lotus / Void Ouroboros",
    chronologicalEra: "The Axis Stance (The Pierced Lotus)",
    weightClass: "Zero",
    slot: "Pauldrons",
    godAffinity: "Soran, The Blind Stone",
    dominion: "Axis",
    trueForm: {
      name: "The Vessel of Stillness",
      designation: "True / Healthy Form",
      geometry: "A pristine outer circle enclosing an open, balanced lotus cup holding a single drop of dew.",
      visualDescription: "Unbroken concentric perfection. Breath flowing freely into the empty heart.",
      inUniverseMeaning: "The 12th hub of the ancient wheel: Sunyata (egoless stillness). The master unarmored stance where the body requires no iron because it clings to no fear.",
      glyph: "lotus",
      accentColor: "#f8fafc"
    },
    corruptedForm: {
      name: "The Pierced Lotus / Void Ouroboros",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A circular ouroboros split down the vertical axis by a razor void-channel with a motionless suspended drop.",
      visualDescription: "A fractured ring surrounding a static, petrified drop that cannot fall or move.",
      inUniverseMeaning: "The tragedy of the Center: Soran absorbed the sins of the four warring gods and froze in eternal catatonic stone. Stillness became dead paralysis; peace became a silent prison.",
      glyph: "lotus",
      accentColor: "#94a3b8"
    },
    forgingIncantation: "Weave no metal; spin only unbleached flax soaked in mountain mist. Cling to nothing, defend nothing, let the strike pass through empty air.",
    postureMitigation: "Zero armor absorption, but dodges consume 0 stamina once per cadence; posture naturally regenerates +50% faster while stationary.",
    weightSynergy: "Sunyata Equanimity: Total evasion timing window increased by +0.15s; posture damage suffered is converted into pure Action Points."
  },

  // The Earth Dominion: Bram's Crucible Wedge (Heavy Slag)
  {
    id: "bram-heavy-crucible-wedge",
    name: "The Crucible Wedge / Cracked Kiln",
    chronologicalEra: "The Sacred Smelt (The Crucible Wedge)",
    weightClass: "Heavy",
    slot: "Shield",
    godAffinity: "Bram, The Slag-King",
    dominion: "Earth",
    trueForm: {
      name: "The Reverent Chisel & Bedrock",
      designation: "True / Healthy Form",
      geometry: "Level bedrock base supporting an upright equilateral prism with gentle ventilation curves.",
      visualDescription: "Sacred stonework rooted in reciprocity. Stone cut along natural cleavage planes without waste.",
      inUniverseMeaning: "Bram as the master builder: every quarry block treated as a loan from the mountain, every blade quenched with reverence.",
      glyph: "wedge",
      accentColor: "#fb923c"
    },
    corruptedForm: {
      name: "The Crucible Wedge / Cracked Kiln",
      designation: "Corrupted Imperial Form (Godman's Mark)",
      geometry: "A massive, downward-crushing triangle splitting an anvil base, with jagged fissures leaking molten channels.",
      visualDescription: "Crushing structural mass and unyielding industrial heat forcing the mountain to yield.",
      inUniverseMeaning: "Bram's self-sacrifice warped into monstrosity: a walking blast furnace devouring entire mountain ranges in unending, molten toil.",
      glyph: "wedge",
      accentColor: "#ea580c"
    },
    forgingIncantation: "Pour basalt slag into the mold until the crucible cracks. When your apprentice drops from heat-stroke, shovel him into the flue to keep the emperor's road paved.",
    postureMitigation: "-40% Posture buildup against crushing attacks; reflects 25% of blocked physical damage as searing fire.",
    weightSynergy: "Molten Core: Shield bashes inflict 'Slag-Scorched', reducing enemy armor mitigation by 15% for 2 turns."
  }
];
