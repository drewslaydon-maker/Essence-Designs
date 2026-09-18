import { SymbolForm, SpokeId } from "../types";
import { GlyphKey } from "../symbols/glyphKeys";
import { spokesData } from "./spokesAndPillarsData";

// ============================================================================
// DISCIPLINE HERALDRY — the true + corrupted mark of each of the 15 spokes.
// Complements `warpedPantheonData.ts` (Divine) and `armorSymbolsData.ts`
// (Armor). Reserved vocabulary lives in VISUAL_DESIGN_MASTER.md §3.1 and the
// Heraldry gate audits all three families together.
// ============================================================================

export interface SpokeSymbolSet {
  spokeId: SpokeId;
  number: number;
  discipline: string;
  trueSymbol: SymbolForm;
  corruptedSymbol: SymbolForm;
}

const colorOf = (id: SpokeId): string => spokesData.find((s) => s.id === id)?.color ?? "#f59e0b";

const CORRUPTED_ACCENT = "#e11d48";

const form = (
  name: string,
  designation: SymbolForm["designation"],
  geometry: string,
  visualDescription: string,
  inUniverseMeaning: string,
  glyph: GlyphKey,
  accentColor: string,
): SymbolForm => ({ name, designation, geometry, visualDescription, inUniverseMeaning, glyph, accentColor });

const TRUE = "True / Healthy Form";
const BROKEN = "Corrupted Imperial Form (Godman's Mark)";

export const spokeSymbolsData: SpokeSymbolSet[] = [
  {
    spokeId: "spoke-1-bastion",
    number: 1,
    discipline: "Bastion",
    trueSymbol: form(
      "The Bulwark Standard",
      TRUE,
      "A square shield-wall standing on a level lintel, holding a single balanced seed at its heart.",
      "The anvil of the envoy: a peaceful redoubt that bears the weight of the world without striking back.",
      "Armor worn to absorb blows meant for the innocent — patience made structure.",
      "bulwark",
      colorOf("spoke-1-bastion"),
    ),
    corruptedSymbol: form(
      "The Rusted Maw",
      BROKEN,
      "The shield-wall mawed open, its crown split into inward-biting iron teeth around a crushed seed.",
      "Protection turned predator — a carapace that swallows the one it was built to defend.",
      "The Slag-Welded Carapace: plate riveted through flesh so the soldier can never lay it down.",
      "bulwark",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-2-edge",
    number: 2,
    discipline: "Edge",
    trueSymbol: form(
      "The Clean Bevel",
      TRUE,
      "A single-edged straight blade with a calm fuller and a balanced, un-notched tip.",
      "Honed steel kept sheathed as a deterrent, drawn only to cut clean threads of danger.",
      "The warrior's unsheathed boundary: force held in restraint, never in cruelty.",
      "blade",
      colorOf("spoke-2-edge"),
    ),
    corruptedSymbol: form(
      "The Serrated Fang",
      BROKEN,
      "The blade gnawed into a ragged serration, its fuller flooded with a bleeding groove.",
      "Edges designed not to end a fight but to prolong the suffering of it.",
      "The Severed Scabbard: scabbards discarded, steel made to tear flesh into ribbons.",
      "blade",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-12-stance",
    number: 12,
    discipline: "Stance",
    trueSymbol: form(
      "The Balanced Pivot",
      TRUE,
      "An equilateral tripod meeting a true vertical plumb line at a single poised joint.",
      "The diplomat's rooted stance before a screaming host — dignity that does not lean.",
      "The core posture of restraint: grounded, centred, unpanicked before the storm.",
      "tripod",
      colorOf("spoke-12-stance"),
    ),
    corruptedSymbol: form(
      "The Broken Pivot",
      BROKEN,
      "One tripod leg snapped, the whole frame tilted off its plumb into a reckless forward lean.",
      "Balance abandoned for a suicidal charge, grinding forward on a ruined joint.",
      "Berserk frenzy: the stance that would rather fall than hold.",
      "tripod",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-3-sorcery",
    number: 3,
    discipline: "Sorcery",
    trueSymbol: form(
      "The Living Ley",
      TRUE,
      "A smooth outward logarithmic spiral blooming without a closing border.",
      "Attunement to the hum of ley-currents — listening to the cosmos before speaking.",
      "The intuitive song of sorcery, drawn from the natural harmonics of the world.",
      "spiral",
      colorOf("spoke-3-sorcery"),
    ),
    corruptedSymbol: form(
      "The Stasis Coil",
      BROKEN,
      "The spiral crushed into tightly locked concentric rings crossed by rigid calculation bars.",
      "Magic pinned into a geometric vice until the current can no longer breathe.",
      "Dead algorithmic computation: ley-lines clamped into grids, the ether drained to salt.",
      "spiral",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-4-inscription",
    number: 4,
    discipline: "Inscription",
    trueSymbol: form(
      "The Living Word",
      TRUE,
      "A feather quill crossing an open ruled line, ink flowing from a single unbroken stroke.",
      "The carved word of remembrance — names honoured on stone, covenants kept in ink.",
      "Words of power that record rather than brand; memory as devotion.",
      "quill",
      colorOf("spoke-4-inscription"),
    ),
    corruptedSymbol: form(
      "The Erasure Grid",
      BROKEN,
      "A rigid three-by-three lattice with the quill deadened into a straight gouge.",
      "The word turned ledger: every soul indexed as a number to be spent.",
      "The Scribed Wedge: brands burned into conscripts to mark them as imperial assets.",
      "quill",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-5-alchemy",
    number: 5,
    discipline: "Alchemy",
    trueSymbol: form(
      "The Healing Alembic",
      TRUE,
      "A round-bottom flask with a rising neck and gentle curls of vapour bearing a bright essence.",
      "The balm of the crag: broths brewed to mend limbs and ease fevered minds.",
      "Mercy distilled — alchemy as medicine, not as weapon.",
      "alembic",
      colorOf("spoke-5-alchemy"),
    ),
    corruptedSymbol: form(
      "The Slag Retort",
      BROKEN,
      "The flask cracked across its belly, leaking dark drip-slags and bitter fumes.",
      "A battle-stimulant still: the vessel that burns the drinker to keep them standing.",
      "The vivisection beaker — toxic courage brewed at the cost of organs.",
      "alembic",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-6-trapping",
    number: 6,
    discipline: "Trapping",
    trueSymbol: form(
      "The Honest Snare",
      TRUE,
      "An open cord loop knotted to a single strand, slack and unhurried.",
      "The honest hunt: take only what winter requires, and give thanks to the beast.",
      "Sinew and hidecraft in reciprocity with the wild, never in contempt of it.",
      "snare",
      colorOf("spoke-6-trapping"),
    ),
    corruptedSymbol: form(
      "The Gilded Cage",
      BROKEN,
      "A closed lattice of gilded bars with a small heart pinned and still inside.",
      "The slaughter pens: creatures caged so their pelts can be harvested for vanity.",
      "The snare that never opens — capture as industry.",
      "snare",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-7-wayfinding",
    number: 7,
    discipline: "Wayfinding",
    trueSymbol: form(
      "The Wayfinder's Rose",
      TRUE,
      "An eight-point compass rose set in a single unbroken ring of discovery.",
      "The patient pathfinder reading stars and water-flow, leaving cairns for strangers.",
      "The horizon needle: guidance freely given to any who are lost.",
      "compass",
      colorOf("spoke-7-wayfinding"),
    ),
    corruptedSymbol: form(
      "The Compass Snare",
      BROKEN,
      "The rose's needle bent back upon itself into a hook, ring dashed by surveying marks.",
      "The map turned leash: wilderness plotted only to be parceled and sold.",
      "The imperial grid — every horizon reduced to a concession line.",
      "compass",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-8-forestry",
    number: 8,
    discipline: "Forestry",
    trueSymbol: form(
      "The Steward's Bough",
      TRUE,
      "A living branch bearing two close leaves and a fresh green bud at its crown.",
      "Plant three acorns for every trunk felled; take only what the grove can spare.",
      "Arborcraft as stewardship — timber lent to mortals by the elder wood.",
      "bough",
      colorOf("spoke-8-forestry"),
    ),
    corruptedSymbol: form(
      "The Clear-Cut",
      BROKEN,
      "A cut stump with a fallen crown beside it, rings scattered like fallen coins.",
      "The grove stripped to barren mud to feed the furnaces of empire.",
      "Wild forestry inverted into the clear-cut furnace.",
      "bough",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-9-masonry",
    number: 9,
    discipline: "Masonry",
    trueSymbol: form(
      "The Thousand-Year Arch",
      TRUE,
      "A round masonry arch held at true centre by a single keyed keystone.",
      "Aqueducts and bridges harmonized with mountain floods, enduring for generations.",
      "The builder's covenant: structure that outlives the hand that laid it.",
      "keystone",
      colorOf("spoke-9-masonry"),
    ),
    corruptedSymbol: form(
      "The Fallen Keystone",
      BROKEN,
      "The arch fractured at its crown, the cracked keystone slipping from its seat.",
      "Colossal monuments raised on starving backs, sagging under their own vanity.",
      "The Megalithic Idol — architecture as a monument to the Ascended.",
      "keystone",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-10-quarrying",
    number: 10,
    discipline: "Quarrying",
    trueSymbol: form(
      "The Sacred Pick",
      TRUE,
      "A double-pointed pick resting above level strata lines cut along natural cleavage.",
      "Listening to the acoustic ring of the rock, apologizing to the mountain for each stone.",
      "Sacred Reciprocity: stone taken as a loan that must be repaid in reverence.",
      "pick",
      colorOf("spoke-10-quarrying"),
    ),
    corruptedSymbol: form(
      "The Strip-Mine Terrace",
      BROKEN,
      "A pick bent over descending, gouged terraces that swallow a level horizon.",
      "Mountains carved into open pits, rivers buried in sulfuric tailings.",
      "The Strip-Mine Chasm — extraction without end and without thanks.",
      "pick",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-11-smithing",
    number: 11,
    discipline: "Smithing",
    trueSymbol: form(
      "The Reverent Hammer",
      TRUE,
      "A cross-peen hammer poised above a simple anvil, struck in patient rhythm.",
      "Striking only when the iron is willing, quenching so the blade never betrays its master.",
      "The beating heart of craft: ore made sacred through deliberate labour.",
      "hammer",
      colorOf("spoke-11-smithing"),
    ),
    corruptedSymbol: form(
      "The Drop-Hammer",
      BROKEN,
      "A colossal pneumatic hammer crushed down on a split anvil, sparking molten slag.",
      "Mass-production without a smith — the forge that consumes labourers as fuel.",
      "The Open Kiln — industry that never cools and never mourns.",
      "hammer",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-13-breath",
    number: 13,
    discipline: "Breath",
    trueSymbol: form(
      "The Measured Bellows",
      TRUE,
      "Twin bellows breathing outward in balance, air flowing in gentle unfurling arcs.",
      "Stamina drawn from the stillness of the void — never over-exerting, never panicked.",
      "The rhythm of the tides made lung: composure as endurance.",
      "bellows",
      colorOf("spoke-13-breath"),
    ),
    corruptedSymbol: form(
      "The Vacuum",
      BROKEN,
      "The bellows collapsed into a single inward vortex, all air spiraling to a suffocating point.",
      "The breath that takes and gives nothing back, draining friend and foe alike.",
      "The Vacuum: a tireless, suffocating advance with no exhale.",
      "bellows",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-14-vessel",
    number: 14,
    discipline: "Vessel",
    trueSymbol: form(
      "The Empty Cup",
      TRUE,
      "An open chalice holding a single suspended drop of dew above its unbroken rim.",
      "A mind devoid of ego, able to receive the world's pain without breaking.",
      "Sunyata: the vessel that is strong because it clings to nothing.",
      "chalice",
      colorOf("spoke-14-vessel"),
    ),
    corruptedSymbol: form(
      "The Petrified Chalice",
      BROKEN,
      "The cup sealed and fissured to stone, the suspended drop frozen mid-fall.",
      "A soul encased in unbreakable stone — feeling nothing, caring for nothing.",
      "The Petrified Tear: equanimity collapsed into absolute apathy.",
      "chalice",
      CORRUPTED_ACCENT,
    ),
  },
  {
    spokeId: "spoke-15-unarmored",
    number: 15,
    discipline: "Unarmored",
    trueSymbol: form(
      "The Naked Step",
      TRUE,
      "A bare footprint flanked by flowing silk lines that trail lightly behind it.",
      "Walking into danger with no physical protection, trusting intuition and cosmic flow.",
      "The naked blade stance: the pinnacle of evasion, unburdened and unafraid.",
      "footprint",
      colorOf("spoke-15-unarmored"),
    ),
    corruptedSymbol: form(
      "The Iron Skin",
      BROKEN,
      "An armored gauntlet-print riveted at the joints, all silk lines stiffened to bars.",
      "Flesh transmuted to literal stone, sacrificing all speed and humanity for invulnerability.",
      "Zero-weight discipline inverted: the weight of iron worn from within.",
      "footprint",
      CORRUPTED_ACCENT,
    ),
  },
];

export const spokeSymbolByNumber: Record<number, SpokeSymbolSet> = Object.fromEntries(
  spokeSymbolsData.map((s) => [s.number, s]),
);

export const spokeSymbolById: Record<string, SpokeSymbolSet> = Object.fromEntries(
  spokeSymbolsData.map((s) => [s.spokeId, s]),
);
