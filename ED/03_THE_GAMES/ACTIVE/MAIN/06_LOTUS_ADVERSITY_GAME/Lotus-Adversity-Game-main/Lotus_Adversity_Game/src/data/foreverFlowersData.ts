export interface ForeverFlower {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: "Design Doctrine" | "Engineering Practice" | "Agent-User Protocol" | "Cosmological Law";
  status: "RATIFIED" | "INVALIDATED";
  revocationNote?: string;
  lessonLearned: string;
  corePrinciple: string;
  userPractice: string;
  agentPractice: string;
  goldenQuote: string;
}

export const foreverFlowersData: ForeverFlower[] = [
  {
    id: "flower-1-anti-hallucination",
    number: "FLOWER 01",
    title: "The Anti-Hallucination Covenant",
    subtitle: "Truth Over Invention: Push Back and Verify",
    category: "Agent-User Protocol",
    status: "RATIFIED",
    lessonLearned: "Early iterations risked hallucinating generic dark-fantasy tropes and unsolicited filler modules to match the title 'Adversity' rather than confirming canonical truth. True collaboration requires grounding every system in documented lore.",
    corePrinciple: "Never invent systems to fill a void. If a canonical design is ambiguous, pause, push back, and inspect the foundational truth rather than generating speculative filler.",
    userPractice: "Provide clear architectural constraints, canonical terminology, and prompt guidance when establishing new frameworks.",
    agentPractice: "Airseal the codebase: strictly verify lore and mechanics against the canon; never introduce unsolicited features, mini-games, or fake backend layers.",
    goldenQuote: "A single faithful stone cut true to the mountain is worth a thousand gilded towers built on sand."
  },
  {
    id: "flower-2-deterministic-combat",
    number: "FLOWER 02",
    title: "The 0% RNG Covenant",
    subtitle: "Deterministic Resolution: Zero Random Misses",
    category: "Design Doctrine",
    status: "RATIFIED",
    lessonLearned: "Combat games often default to hidden dice rolls and percentage-based miss rates. In Adversity, random misses destroy tactical player intelligence.",
    corePrinciple: "Attacks always connect. Combat is a contest of posture management, Action Point velocity, telegraphed stance counters, and flat armor mitigation.",
    userPractice: "Evaluate combat balance through deterministic counterplay: Was the telegraph readable? Was the AP budget respected? Was posture managed?",
    agentPractice: "Eliminate all Math.random() rolls from damage pipelines. Always use transparent formulas: Net Damage = Max(0, Raw - Flat DR) × Guard Modifier.",
    goldenQuote: "A blade swung with purpose does not pass through air by whim of dice; it is stopped by iron, absorbed by posture, or punished by footwork."
  },
  {
    id: "flower-3-time-spent-sanctuary",
    number: "FLOWER 03",
    title: "The Time-Spent Sanctuary",
    subtitle: "Genuine Mastery: Calibrated Exponential Growth",
    category: "Design Doctrine",
    status: "RATIFIED",
    lessonLearned: "Generic progression often swings between shallow instant-gratification and absurd 13-million XP grinds designed for engagement metrics. Adversity requires a balanced, calibrated curve.",
    corePrinciple: "Progress reflects uninterrupted player dedication. Milestone tiers at Levels 25, 50, 75, and 99 award non-purchasable cloaks and transformative perks without predatory treadmills.",
    userPractice: "Keep milestone unlocks meaningful, awarding tangible utility perks and non-purchasable prestige cosmetic capes.",
    agentPractice: "Maintain monotonic XP formulas that scale appropriately (max cap ~1.25M XP) without artificial multi-million bloat.",
    goldenQuote: "Greatness cannot be rented, bought, or accelerated. Onlookers must know with 100% certainty what ordeal was overcome."
  },
  {
    id: "flower-4-world-literacy",
    number: "FLOWER 04",
    title: "World Literacy Over HUD Clutter",
    subtitle: "Morrowind Exploration: Unguided Discovery",
    category: "Cosmological Law",
    status: "RATIFIED",
    lessonLearned: "Floating compass chevrons and minimap GPS lines turn exploration into passive obedience. True immersion demands spatial memory and geological literacy.",
    corePrinciple: "The player finds their way by reading stone strata, listening to acoustic hammer pitches, and following diegetic spoken directions.",
    userPractice: "Design encounters and resource veins linked to natural terrain landmarks (e.g. basalt crags, river bends, glacial scree).",
    agentPractice: "Refuse to implement glowing objective arrows or compass question marks that rob the player of the triumph of discovery.",
    goldenQuote: "Do not look to the sky for an arrow; strike the bedrock with your chisel and listen to what the mountain remembers."
  },
  {
    id: "flower-5-closed-economic-loop",
    number: "FLOWER 05",
    title: "The 15-Spoke Symbiosis",
    subtitle: "Closed Economic Loop: No Isolated Silos",
    category: "Engineering Practice",
    status: "RATIFIED",
    lessonLearned: "Traditional RPGs isolate crafters, gatherers, and combatants into rigid silos. In Adversity, every weapon demands inputs from across the wheel.",
    corePrinciple: "Smithing requires Quarry stone ballast and Forestry charcoal; Inscription requires Quarry pigment and Forestry gallnuts; Combat relies on Alchemical posture draughts.",
    userPractice: "Ensure any newly designed equipment recipe has at least two cross-spoke input handshakes.",
    agentPractice: "Maintain the 1:1 input/output matrix cleanly across all disciplines, ensuring no spoke exists as a dead-end.",
    goldenQuote: "The greatest greatsword is not forged by the smith alone; it carries the sweat of the miner, the ash of the woodcutter, and the ink of the scribe."
  },
  {
    id: "flower-6-zero-armor-sunyata",
    number: "FLOWER 06",
    title: "Sunyata: The Sacred Glass Cannon",
    subtitle: "Weight Class Triforce: High Risk, Pure Flow",
    category: "Design Doctrine",
    status: "RATIFIED",
    lessonLearned: "Unarmored characters are often treated as either a joke or an invincible dodge-tank. Sunyata must stand as an extreme, deliberate high-skill archetype.",
    corePrinciple: "Zero Armor grants +2 AP (5 AP total) and 4-tile sprint velocity, but takes 100% unmitigated damage. A single missed parry or guard collapse means immediate peril.",
    userPractice: "Test Zero Armor as a true glass cannon: reward precision timing while ensuring mistakes are heavily punished.",
    agentPractice: "Never grant passive armor absorption or secret flat DR to Zero Armor; keep its vulnerability pure and its mobility unrivaled.",
    goldenQuote: "To discard armor is not to seek death; it is to accept that your only shield is the precision of your mind."
  },
  {
    id: "flower-7-airsealing-cadence",
    number: "FLOWER 07",
    title: "Airsealing & Architectural Cadence",
    subtitle: "Continuous Integrity: Clean State & Zero Drift",
    category: "Engineering Practice",
    status: "RATIFIED",
    lessonLearned: "Large projects easily degrade through feature accumulation, orphaned components, and inconsistent types. Continuous airsealing preserves clarity.",
    corePrinciple: "Prune dead code aggressively, verify build and lint status before concluding turns, and structure navigation into clean, intuitive categories.",
    userPractice: "Guide development in distinct, phased milestones (Phase 0 ratified, Phase 1 combat sprint).",
    agentPractice: "Never leave broken imports, unused artifacts, or stale types in the workspace. Compile and verify every step.",
    goldenQuote: "A clean workbench sharpens the chisel. Keep the room sealed against drift, and the truth will remain clear."
  },
  {
    id: "flower-8-self-proving-gate",
    number: "FLOWER 08",
    title: "The Self-Proving Gate",
    subtitle: "Airseal Verification: No Checkmark Without an Exit Code",
    category: "Engineering Practice",
    status: "INVALIDATED",
    revocationNote: "Revoked by Architect decree following the Apparatus v2 client rebuild. The gate it ratified could not survive execution against the client it was meant to prove: the wheel renderer, navigation, and governance surfaces it sealed were rebuilt from scratch because they failed the Architect's bar. A self-proving gate can only seal what holds under fire. Pending re-ratification once the fresh client is verified.",
    lessonLearned: "The Lab Sealing sprint proved that progress billed as 'Verified' from a human eyeball can hide stale copy, phantom data reads, and 19-spoke type aliases masquerading as canon. A milestone is only Verified when a machine command proves it.",
    corePrinciple: "A gate that cannot fail is a prayer. Every sealed claim must terminate in an executable exit code: `bun run lint` for the compiler and `bun run lab:verify` for the canon invariants — the same checks the Ratification Chamber runs in-browser.",
    userPractice: "Demand a passing exit code before accepting any milestone marked Verified; treat screenshots and hover states as review, never as proof.",
    agentPractice: "Refuse to mark work Verified without running the available gate commands. When a truth is pressed into status, bind it to an encoded invariant the whole repository can execute.",
    goldenQuote: "Seal as a command, not a claim. What cannot fail my gate cannot prove my work."
  }
];
