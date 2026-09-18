import {
  PartyMember,
  MonsterPart,
  CulinaryRecipe,
  NewspaperArticle,
  DiggerDecoration,
} from '../types';

export const INITIAL_PARTY_MEMBERS: PartyMember[] = [
  {
    id: 'mage',
    name: 'Ronald the Pyromancer',
    classTitle: 'Crystal Arcanist',
    color: '#8b5cf6',
    portraitIcon: 'Sparkles',
    rescued: false,
    rescueVein: 1,
    rescueStory:
      'Trapped behind the collapsed quartz chimney in Vein 1. Driven half-mad by singing amethyst geodes until your hearth meal snapped him back to reality.',
    sanity: 45,
    hunger: 70,
    veinUnlocks: 2,
    veinUnlockTitle: 'Vein 2: Volcanic Sulfur & Obsidian Chasm',
    perkDescription:
      'Arcane Resonant Strike: Periodically detonates brittle rock seams with concussive heat.',
    favoriteFoodNote:
      'Loves warm stews with crystalline amethyst infusions. Swears the mineral vibration clarifies magical leylines.',
    currentThought: 'The crystals down there... they sing in four-part harmony. It never stops unless you eat something warm.',
  },
  {
    id: 'rogue',
    name: 'Vesper the Shadow Scavenger',
    classTitle: 'Vein Scout',
    color: '#10b981',
    portraitIcon: 'Eye',
    rescued: false,
    rescueVein: 2,
    rescueStory:
      'Found clinging to an abandoned corporate haulage cable over the sulfur chasm. Was surviving off raw cave lichen and paranoia.',
    sanity: 55,
    hunger: 80,
    veinUnlocks: 3,
    veinUnlockTitle: 'Vein 3: Abyssal Chasm & Lapis Caverns',
    perkDescription:
      'Faultline Perception: Highlights hidden stress fractures and prevents tool recoil.',
    favoriteFoodNote:
      'Prefers crispy fried beetle chitin seasoned with briny rock lichen. Quick, quiet, and packed with mountain crunch.',
    currentThought: 'Black Ridge Corp had maps they never filed with the county. I saw marks on the 3rd level that looked ancient.',
  },
  {
    id: 'warrior',
    name: 'Brann the Deep Sledge',
    classTitle: 'Tectonic Vanguard',
    color: '#ef4444',
    portraitIcon: 'Hammer',
    rescued: false,
    rescueVein: 3,
    rescueStory:
      'Left to brace a collapsing timber bulkhead when corporate officers fled. Refused to let go of his timber post until you offered him hot skillet jerky.',
    sanity: 60,
    hunger: 90,
    veinUnlocks: 4,
    veinUnlockTitle: 'Vein 4: The Primordial Core',
    perkDescription:
      'Bedrock Sledgehammer: Every strike against hard bedrock cracks adjacent slag.',
    favoriteFoodNote:
      'Give him heavy, hearty smoked meats and charred geode marrow. Needs fuel to swing a fifty-pound sledge.',
    currentThought: 'My grandfather dug these shafts with a hand steel. The rock was stubborn then, but it wasn’t angry like it is now.',
  },
];

export const MONSTER_PARTS_CATALOG: MonsterPart[] = [
  {
    id: 'cave_beetle_meat',
    name: 'Subterranean Beetle Meat',
    category: 'fauna',
    description: 'Sweet, dense white meat harvested from the carapace of mineral-grazing cave beetles.',
    flavorProfile: 'Tastes like sweet rock lobster with a slight nutty flint finish.',
    color: '#f97316',
    icon: 'Bug',
  },
  {
    id: 'phosphor_morel',
    name: 'Phosphor Morel Caps',
    category: 'fungus',
    description: 'Bioluminescent mushrooms that sprout on moist limestone near underground riverbanks.',
    flavorProfile: 'Earthy, velvety, and gently tingles the tongue with faint cold luminescence.',
    color: '#06b6d4',
    icon: 'Flower2',
  },
  {
    id: 'dusk_bat_wing',
    name: 'Dusk Bat Wings & Marrow',
    category: 'fauna',
    description: 'Crispy leathery wings rich in subterranean collagen, harvested from roosting cave bats.',
    flavorProfile: 'Rich, gamey, and smoky when seared over hot coals.',
    color: '#a855f7',
    icon: 'Feather',
  },
  {
    id: 'blind_cave_trout',
    name: 'Deep-Basin Blind Trout',
    category: 'fauna',
    description: 'Pale, translucent fish that navigate underground lakes by water pressure changes.',
    flavorProfile: 'Buttery, delicate flesh that absorbs mineral seasonings effortlessly.',
    color: '#38bdf8',
    icon: 'Fish',
  },
  {
    id: 'salt_crust_lichen',
    name: 'Salt-Crusted Rock Lichen',
    category: 'seasoning',
    description: 'Hard crusty lichen scraped from salt chimneys deep inside the mountain.',
    flavorProfile: 'Pungent, mineral-salty, with notes of dried wild rosemary and pepper.',
    color: '#84cc16',
    icon: 'Sprout',
  },
  {
    id: 'geode_marrow',
    name: 'Crystalline Geode Marrow',
    category: 'seasoning',
    description: 'A viscous, syrup-like gel found inside ancient hollow quartz nodules.',
    flavorProfile: 'Intensely sweet like honeyed rock candy, vibrating softly with latent harmonic energy.',
    color: '#ec4899',
    icon: 'Sparkle',
  },
];

export const CULINARY_RECIPES: CulinaryRecipe[] = [
  {
    id: 'ruby_beetle_fritters',
    name: 'Pyre Ruby Beetle Fritters',
    mineralIngredient: 'Pyre Ruby',
    faunaIngredient: 'Subterranean Beetle Meat',
    optionalSeasoning: 'Salt-Crusted Rock Lichen',
    dishType: 'Fritters',
    visualColor: '#ef4444',
    description:
      'Crispy, golden-crusted patties of sweet beetle meat pan-fried over hot crushed ruby coals with mountain salt.',
    tasteNotes: 'Crunchy outer shell with hot, savory sweetness and a lingering hearth warmth.',
    sanityRestore: 35,
    fatigueRestore: 40,
    buffTitle: 'Thermal Fortitude',
    buffDescription: '+5 Base Strikes for your next subterranean delve.',
    buffType: 'extra_strikes',
    buffValue: 5,
    buffDurationShafts: 2,
    discovered: true,
  },
  {
    id: 'amethyst_bat_stew',
    name: 'Simmered Amethyst Bat Stew',
    mineralIngredient: 'Starlight Amethyst',
    faunaIngredient: 'Dusk Bat Wings & Marrow',
    optionalSeasoning: 'Salt-Crusted Rock Lichen',
    dishType: 'Stew',
    visualColor: '#8b5cf6',
    description:
      'A deep purple broth simmered with tender bat wings and crushed amethyst powder, glowing with quiet violet radiance.',
    tasteNotes: 'Rich, gamey broth with an electric herbal buzz that calms racing cavern thoughts.',
    sanityRestore: 55,
    fatigueRestore: 30,
    buffTitle: 'Mind Shield',
    buffDescription: 'Halves Sanity loss from greed nodes and dark hallucinations.',
    buffType: 'sanity_shield',
    buffValue: 50,
    buffDurationShafts: 3,
    discovered: true,
  },
  {
    id: 'citrine_morel_broth',
    name: 'Citrine-Poached Phosphor Morel Broth',
    mineralIngredient: 'Sun Citrine',
    faunaIngredient: 'Phosphor Morel Caps',
    dishType: 'Broth',
    visualColor: '#f59e0b',
    description:
      'Luminous golden broth infused with sunny citrine warmth and soft glowing morel mushrooms.',
    tasteNotes: 'Velvety, buttery, and fills your chest with the warmth of a mountain sunrise.',
    sanityRestore: 45,
    fatigueRestore: 50,
    buffTitle: 'Seam Sight',
    buffDescription: 'Reveals the internal structural fault line of rocks upon the first strike.',
    buffType: 'fault_vision',
    buffValue: 1,
    buffDurationShafts: 2,
    discovered: false,
  },
  {
    id: 'emerald_trout_skillet',
    name: 'Emerald-Smoked Deep Trout Skillet',
    mineralIngredient: 'Verdant Emerald',
    faunaIngredient: 'Deep-Basin Blind Trout',
    optionalSeasoning: 'Salt-Crusted Rock Lichen',
    dishType: 'Roast',
    visualColor: '#10b981',
    description:
      'Fresh subterranean trout seared crisp over green volcanic stones, releasing a pine and cedar aroma.',
    tasteNotes: 'Flaky, buttery trout with a clean herbal minerality that sharpens your instincts.',
    sanityRestore: 40,
    fatigueRestore: 45,
    buffTitle: 'Shatter Instinct',
    buffDescription: '+25% Critical Fracture chance when striking rock nodes.',
    buffType: 'crit_fracture',
    buffValue: 25,
    buffDurationShafts: 3,
    discovered: false,
  },
  {
    id: 'moonstone_geode_confection',
    name: 'Moonstone Geode Glace',
    mineralIngredient: 'Moonstone Pearl',
    faunaIngredient: 'Phosphor Morel Caps',
    optionalSeasoning: 'Crystalline Geode Marrow',
    dishType: 'Confection',
    visualColor: '#38bdf8',
    description:
      'A rare crystallized delicacy blending opalescent moonstone dust, glowing morel jelly, and geode marrow.',
    tasteNotes: 'Cool like mountain snow, bursting with sweet mineral sugar that banishes all fatigue.',
    sanityRestore: 70,
    fatigueRestore: 70,
    buffTitle: 'Abyssal Grace',
    buffDescription: 'Immunity to greed corruption and +6 Base Strikes for 3 delves.',
    buffType: 'greed_ward',
    buffValue: 6,
    buffDurationShafts: 3,
    discovered: false,
  },
];

export const NEWSPAPER_ISSUES: NewspaperArticle[] = [
  {
    id: 'issue-118',
    issueNumber: 118,
    dateStr: 'October 14, 1922',
    headline: 'BLACK RIDGE CORP EXPANDS BIG CAVE LEASE: 150 NEW TOWN JOBS PROMISED',
    subheadline: 'Town Council Approves Deep Drilling Rights; Mayor Hails "A Century of Prosperity"',
    bodyParagraphs: [
      'MOUNTAIN TOWN — Yesterday morning, representatives of Black Ridge Mineral & Excavation Co. finalized terms with the town board to construct an industrial narrow-gauge rail depot and install heavy steam drills at the mouth of Big Cave.',
      '"Our grandfathers chipped iron by hand with candles on their caps," said Councilman Vance Holloway. "Black Ridge brings modern pneumatic power and steady wages. Mountain Town will be the gem capital of the Appalachians."',
      'Local prospectors expressed quiet reservation about breaking the sacred limestone seal established by old settlers, but their cautions were drowned out by the whistle of the arriving iron crane engine.'
    ],
    editorialColumn:
      'From the Editor’s Desk: Prosperity is a welcome guest, but let us not forget the mountain proverb: "The stone you take without asking will ask something of you in the dark."',
    culinaryRumor:
      'Mrs. Gable at the Boarding House notes that roasting cave mushrooms with a pinch of river silt keeps miners full twice as long as store-bought oats.',
    unlockedByDefault: true,
    unlockedConditionText: 'Available in the newspaper kiosk.',
  },
  {
    id: 'issue-134',
    issueNumber: 134,
    dateStr: 'August 3, 1923',
    headline: 'THE UNEXPLAINED FEVER: SHIFT 3 CREWS REFUSE DINNER, SLEEP IN TIE-RODS',
    subheadline: 'Doctor Diagnoses "Severe Mineral Obsession"; Company Implements Armed Shifts',
    bodyParagraphs: [
      'MOUNTAIN TOWN — Strange occurrences in the lower drift have alarmed local families. Men returning from the second strata report an unbearable craving to continue chipping stone, even when their hands bleed and their picks splinter.',
      'Dr. Elias Thorne noted three miners admitted to the clinic refused soup and water, clutching raw purple druzy against their chests and weeping if separated from their hauls.',
      'In response, Black Ridge management declared the incident "isolated malingering" and posted private company guards at the shaft hoist to ensure quotas are met around the clock.'
    ],
    editorialColumn:
      'Editor’s Note: This is not fatigue. A sickness lives in the resonance of those stones. When men choose a lump of cold quartz over their own children’s voices, greed has ceased to be a sin and become a poison.',
    culinaryRumor:
      'Old prospector Silas claims the only cure for cave fever is hot skillet food cooked with bitter mountain lichen: "Eat the beast that feeds on the rock, and your mind stays your own."',
    unlockedByDefault: true,
    unlockedConditionText: 'Available in the newspaper kiosk.',
  },
  {
    id: 'issue-152',
    issueNumber: 152,
    dateStr: 'May 19, 1924',
    headline: 'DISASTER AT VEIN 1: PYROMANCER RONALD BLOCKS RUNAWAY FAULT; GIVEN UP FOR DEAD',
    subheadline: 'Company Seals Ventilation Flue to Protect Steam Machinery; 12 Miners Unaccounted For',
    bodyParagraphs: [
      'MOUNTAIN TOWN — A subterranean blowout struck the 600-foot level on Tuesday when drilling struck a pressurized volcanic chimney. Eyewitnesses describe purple shockwaves that shattered railway cars.',
      'Ronald, the town’s scholar and arcane pyromancer, descended alone with his flame-warding wardstones to seal the fissure and buy time for the shift to evacuate.',
      'Rather than organize a rescue winch, Black Ridge executives ordered the blast door locked from the surface to prevent toxic steam from damaging the heavy drill engine. Ronald and his men were sealed within.'
    ],
    editorialColumn:
      'A Town in Mourning: Black Ridge calls this an "unfortunate engineering casualty." Mountain Town calls it abandonment. Ronald was our neighbor, our teacher, and our shield.',
    culinaryRumor:
      'Ronald’s old journal at the press shop mentions: "Amethyst resonates with human thought. When starved, the mind mirrors the stone’s frozen emptiness."',
    unlockedByDefault: true,
    unlockedConditionText: 'Available in the newspaper kiosk.',
  },
  {
    id: 'issue-178',
    issueNumber: 178,
    dateStr: 'November 2, 1924',
    headline: 'FINAL TRAIN LEAVES MOUNTAIN TOWN: COMPANY PULLS OUT, STREETS FALL SILENT',
    subheadline: 'Boarding House Boarded Up; Only A Handful of Stubborn Prospectors Remain',
    bodyParagraphs: [
      'MOUNTAIN TOWN — Yesterday at dusk, the Black Ridge locomotive blew its long retreat whistle, pulling empty ore hoppers down the mountain towards the valley.',
      'The company scrip store is nailed shut with corrugated zinc. The bank vault is cleared. Having stripped the easy seams and driven our strongest men into the dark, the syndicate left behind broken timber, rusted cranes, and a town without young people.',
      'Only the old wind blowing through the mountain hemlocks remains. Big Cave stands open like a yawning black maw, whispering to anyone left listening.'
    ],
    editorialColumn:
      'The Last Word: If you are reading this in years to come, know that we loved this town. The earth beneath us holds untold treasures, but she demands a humble heart and a full belly to survive her depths. — The Editor.',
    culinaryRumor:
      'A handwritten note tucked into the press drawer: "The iron crawler engine, The Digger, still sits on track 4. It was built with a galley stove. It will take someone who knows how to cook and mine to bring our people home."',
    unlockedByDefault: true,
    unlockedConditionText: 'Available in the newspaper kiosk.',
  },
  {
    id: 'issue-183-extra',
    issueNumber: 183,
    dateStr: 'Present Day — Extra Edition',
    headline: 'THE ADVENTURE MINER RETURNS: HEARTH SMOKE RISES OVER MOUNTAIN TOWN',
    subheadline: 'An Old Resident Reopens The Digger; First Expedition Slated for Vein 1',
    bodyParagraphs: [
      'SPECIAL BULLETIN — For the first time in years, the iron chimney of The Digger crawler puffs sweet hemlock and coal smoke along Track 4.',
      'An adventure miner, returning to their ancestral home, has broken the padlock off the municipal tool shed and rekindled the central town square hearth.',
      'Reports indicate the adventurer has brought along an iron skillet and field wok, determined not merely to break stone, but to survive the depths by turning cavern beasts and gems into sustaining meals.'
    ],
    editorialColumn:
      'A Spark in the Ashes: Mountain Town was never truly dead so long as someone remembers how to strike a pick with care and share bread by the fire.',
    culinaryRumor:
      'First recipe discovered: Pyre Ruby Beetle Fritters. Keeps the hands steady against the dark chill.',
    unlockedByDefault: true,
    unlockedConditionText: 'Printed upon your arrival in Mountain Town.',
  },
  {
    id: 'issue-184-extra',
    issueNumber: 184,
    dateStr: 'Extra Edition — Vein 1 Cleared',
    headline: 'RONALD FOUND ALIVE! MAGE RESCUED FROM AMETHYST CHIMNEY',
    subheadline: 'Pyromancer Breaks His Trance With Skillet Stew; Melts Way to Vein 2',
    bodyParagraphs: [
      'A MIRACLE IN VEIN 1 — The adventure miner has accomplished what company engineers abandoned: Pyromancer Ronald has been brought to the surface, safe and sound.',
      '"I thought I was dreaming of crystal towers," Ronald told reporters while devouring three bowls of hot stew. "The cave makes you forget hunger until you wither. That hot food brought me back to my senses."',
      'Ronald has taken up residence in the old stone Library tower and has pledged his flame magic to shatter the reinforced granite barrier blocking the path to Vein 2.'
    ],
    editorialColumn:
      'Ronald’s Recovery: Look at the town square tonight: the magical lanterns are lit once more. We are coming back.',
    culinaryRumor:
      'Ronald has shared his arcane recipe: Citrine-Poached Phosphor Morel Broth for seeing hidden stone faults.',
    unlockedByDefault: false,
    unlockedConditionText: 'Rescue Ronald the Pyromancer from Vein 1.',
  },
  {
    id: 'issue-185-extra',
    issueNumber: 185,
    dateStr: 'Extra Edition — Vein 2 Cleared',
    headline: 'VESPER RECOVERS FAULTLINE MAP: SECRET ROUTE TO VEIN 3 REVEALED',
    subheadline: 'Vein Scout Re-opens Old Saloon; Reports Ancient Corporate Caches in the Deep',
    bodyParagraphs: [
      'DEEP DELVE REPORT — Scout Vesper, long presumed lost in the sulfur vents, has returned to Mountain Town with maps tracing corporate secret caches.',
      'Vesper demonstrated a knack for finding hairline fissures in what appeared to be solid basalt, showing the town how to access the flooded cavern strata of Vein 3.',
      'The town saloon now smells of crisp fried roach fritters and boiling chicory coffee.'
    ],
    editorialColumn:
      'Vesper’s Keen Eye: Where the company saw expendable workers, our scout sees old friends and forgotten paths.',
    culinaryRumor:
      'Vesper reveals: Emerald-Smoked Trout sharpens pick accuracy to break rocks in fewer strikes.',
    unlockedByDefault: false,
    unlockedConditionText: 'Rescue Vesper the Scout from Vein 2.',
  },
];

export const DIGGER_DECORATIONS: DiggerDecoration[] = [
  {
    id: 'heirloom_quilt',
    name: 'Appalachian Lone Star Quilt',
    category: 'bedding',
    description: 'A heavy hand-stitched patchwork quilt of red flannel and mountain wool.',
    cozyBonus: '+15 Sanity restored when resting in The Digger.',
    unlocked: true,
    equipped: true,
  },
  {
    id: 'amber_lantern',
    name: 'Incandescent Amber Kerosene Lamp',
    category: 'lighting',
    description: 'A heavy brass railway lantern fitted with a warm amber lens that casts long, calming shadows.',
    cozyBonus: 'Reduces passive cave fear buildup by 20%.',
    unlocked: true,
    equipped: true,
  },
  {
    id: 'corkboard_bulletin',
    name: 'Prospector’s Corkboard & Map',
    category: 'wall',
    description: 'A corkboard pinned with yellowed clippings from the Miner Issue and hand-drawn geological cross-sections.',
    cozyBonus: '+10% XP gained from discovering rare mineral nodes.',
    unlocked: true,
    equipped: false,
    costGems: 3,
  },
  {
    id: 'cast_iron_spice_rack',
    name: 'Hearth Iron Seasoning Rack',
    category: 'tabletop',
    description: 'A sturdy iron rack stocked with glass jars of rock lichen, wild mountain sage, and ground river salt.',
    cozyBonus: 'All cooked dishes grant +1 additional delve duration.',
    unlocked: false,
    equipped: false,
    costGems: 5,
  },
  {
    id: 'trilobite_fossil_mount',
    name: 'Polished Trilobite Fossil Specimen',
    category: 'tabletop',
    description: 'A pristinely preserved 400-million-year-old subterranean fossil mounted on polished Appalachian cedar.',
    cozyBonus: '+5% higher chance of finding Geodes in bedrock.',
    unlocked: false,
    equipped: false,
    costGems: 8,
  },
];
