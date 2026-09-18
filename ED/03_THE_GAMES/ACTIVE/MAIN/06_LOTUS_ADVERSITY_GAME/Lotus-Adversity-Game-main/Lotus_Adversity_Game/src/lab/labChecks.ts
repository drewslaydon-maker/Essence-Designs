import { spokesData } from "../data/spokesAndPillarsData";
import { initialWarpedPantheon } from "../data/warpedPantheonData";
import { initialArmorSymbols } from "../data/armorSymbolsData";
import { spokeSymbolsData } from "../data/spokeSymbolsData";
import { GLYPH_KEY_SET } from "../symbols/glyphKeys";
import { DominionType, SpokeId } from "../types";

// ============================================================================
// LAB AIRSEAL CHECKS — The single executable source of truth for Phase 0.5.
// Used by BOTH the CLI verifier (`bun run lab:verify`) and the in-app
// "Run Airseal Verification" button inside the Ratification Chamber, so the
// review window and the sealed command can never drift.
// ============================================================================

export interface CardinalSpoke {
  num: number;
  angle: number;
  dom: DominionType;
}

// Canonical Alden North matrix — THE lone authority on wheel geometry.
// North (330, 0, 30): Iron — 12 (Diplomat), 1 (Bastion, defining), 2 (Edge)
// East  (60, 90, 120): Ether — 3 (Sorcery), 4 (Inscription, defining), 5 (Alchemy)
// South (150, 180, 210): Frontier — 6 (Trapping), 7 (Wayfinding, defining), 8 (Forestry)
// West  (240, 270, 300): Earth — 9 (Masonry), 10 (Quarrying, defining), 11 (Smithing)
export const outerSpokeMatrix: CardinalSpoke[] = [
  { num: 12, angle: 330, dom: "Iron" },
  { num: 1, angle: 0, dom: "Iron" },
  { num: 2, angle: 30, dom: "Iron" },
  { num: 3, angle: 60, dom: "Ether" },
  { num: 4, angle: 90, dom: "Ether" },
  { num: 5, angle: 120, dom: "Ether" },
  { num: 6, angle: 150, dom: "Frontier" },
  { num: 7, angle: 180, dom: "Frontier" },
  { num: 8, angle: 210, dom: "Frontier" },
  { num: 9, angle: 240, dom: "Earth" },
  { num: 10, angle: 270, dom: "Earth" },
  { num: 11, angle: 300, dom: "Earth" },
];

// Soran's Axis — 3 inner spokes orbiting the absolute center hub (Soran).
// Sealed seating: the Axis GUARDS THE SEAMS, never riding an outer spoke's ray.
//   225 = seam between #8 Forestry and #9 Masonry  → Breath (13)   — stillness at the habitation boundary
//   345 = seam between #12 Stance and #1 Bastion  → Vessel (14)   — the composed cup flanked by poise and armor
//   105 = seam between #4 Inscription & #5 Alchemy → Unarmored (15) — the naked blade inside the cold mind's workshop
// Each inner ray extends the outer partition seam, so stillness rules the margins, not the numbers.
export const innerSpokeMatrix: CardinalSpoke[] = [
  { num: 13, angle: 225, dom: "Axis" },
  { num: 14, angle: 345, dom: "Axis" },
  { num: 15, angle: 105, dom: "Axis" },
];

// Canonical inner seats — the Axis guards the seams, never an outer spoke's ray.
// 13 Breath @ 225 (8/9 seam), 14 Vessel @ 345 (12/1 seam), 15 Unarmored @ 105 (4/5 seam).
export const innerSeamAngles: Record<number, number> = {
  13: 225,
  14: 345,
  15: 105,
};

export const cardinalMainNumbers: number[] = [1, 4, 7, 10];

export const canonicalSpokeIds: SpokeId[] = [
  "spoke-1-bastion",
  "spoke-2-edge",
  "spoke-12-stance",
  "spoke-3-sorcery",
  "spoke-4-inscription",
  "spoke-5-alchemy",
  "spoke-6-trapping",
  "spoke-7-wayfinding",
  "spoke-8-forestry",
  "spoke-9-masonry",
  "spoke-10-quarrying",
  "spoke-11-smithing",
  "spoke-13-breath",
  "spoke-14-vessel",
  "spoke-15-unarmored",
];

export const statusIdMap: Record<number, SpokeId> = {
  1: "spoke-1-bastion",
  2: "spoke-2-edge",
  3: "spoke-3-sorcery",
  4: "spoke-4-inscription",
  5: "spoke-5-alchemy",
  6: "spoke-6-trapping",
  7: "spoke-7-wayfinding",
  8: "spoke-8-forestry",
  9: "spoke-9-masonry",
  10: "spoke-10-quarrying",
  11: "spoke-11-smithing",
  12: "spoke-12-stance",
  13: "spoke-13-breath",
  14: "spoke-14-vessel",
  15: "spoke-15-unarmored",
};

export interface LabGateResult {
  id: string;
  title: string;
  pass: boolean;
  details: string[];
}

export interface LabVerification {
  gates: LabGateResult[];
  overall: boolean;
}

function censusGate(): LabGateResult {
  const details: string[] = [];
  const kinds = [outerSpokeMatrix.length, innerSpokeMatrix.length];
  const pass = spokesData.length === 15;
  return {
    id: "census",
    title: "Immutable 15-Spoke Census (12 Outer + 3 Axis + 1 Hub)",
    pass,
    details: pass
      ? [`Spoke record count = ${spokesData.length} (12 outer, ${innerSpokeMatrix.length} axis, hub implicit).`]
      : [`Expected 15 spoke records, found ${spokesData.length} (outer=${kinds[0]}, axis=${kinds[1]}).`],
  };
}

function numericGate(): LabGateResult {
  const numbers = spokesData.map((s) => s.number).sort((a, b) => a - b);
  const unique = [...new Set(numbers)];
  const expected = Array.from({ length: 15 }, (_, i) => i + 1);
  const same = numbers.length === 15 && numbers.every((n, i) => n === expected[i]);
  const pass = same;
  return {
    id: "numeric",
    title: "Numeric Integrity — Exactly Spoke #1 … #15, No Duplicates",
    pass,
    details: pass
      ? ["Numbers form the closed set 1..15 with zero gaps."]
      : unique.length !== numbers.length
        ? [`Duplicate numbers present: ${numbers.filter((n, i) => numbers.indexOf(n) !== i).join(", ")}`]
        : [`Numbers not contiguous 1..15: [${numbers.join(", ")}]`],
  };
}

function geometryGate(): LabGateResult {
  const details: string[] = [];
  const byNumber = new Map(spokesData.map((s) => [s.number, s]));
  const cardinalMains = [...outerSpokeMatrix]
    .filter((c) => c.angle === 0 || c.angle === 90 || c.angle === 180 || c.angle === 270)
    .map((c) => c.num);

  const matrix = [...outerSpokeMatrix, ...innerSpokeMatrix];
  for (const c of matrix) {
    const spoke = byNumber.get(c.num);
    if (!spoke) details.push(`Matrix configured Spoke #${c.num} but no data record exists.`);
    else if (spoke.dominion !== c.dom) details.push(`Spoke #${spoke.number} dominion is ${spoke.dominion}, expected ${c.dom}.`);
  }

  for (const c of innerSpokeMatrix) {
    const sealed = innerSeamAngles[c.num];
    if (sealed === undefined) details.push(`Inner Spoke #${c.num} has no sealed seam angle.`);
    else if (c.angle !== sealed) details.push(`Inner Spoke #${c.num} sits at ${c.angle}°, sealed seam decree requires ${sealed}° (guard the seams, never ride an outer ray).`);
  }

  const mainsOk = cardinalMains.every((n) => cardinalMainNumbers.includes(n));
  if (!mainsOk) details.push(`Defining cardinal spokes misaligned: got ${cardinalMains.join(", ")}, expected ${cardinalMainNumbers.join(", ")}.`);

  const pass = details.length === 0;
  return {
    id: "geometry",
    title: "Alden North Matrix Geometry (12/1/2 @ North; mains 1-4-7-10; Axis inner 13-14-15)",
    pass,
    details: pass
      ? ["All quadrant and axis positions match the canonical Alden North matrix."]
      : details,
  };
}

function idsGate(): LabGateResult {
  const details: string[] = [];
  const canonical = new Set<string>(canonicalSpokeIds);
  const dataIds = spokesData.map((s) => s.id);
  const orphans = dataIds.filter((id) => !canonical.has(id));
  if (orphans.length > 0) details.push(`Data records use non-canonical ids: ${orphans.join(", ")}`);
  const missing = [...canonical].filter((id) => !dataIds.includes(id));
  if (missing.length > 0) details.push(`Canonical ids have no data record: ${missing.join(", ")}`);
  for (let n = 1; n <= 15; n++) {
    if (!(n in statusIdMap)) details.push(`statusIdMap is missing Spoke #${n}.`);
  }
  const idSet = new Set<string>(Object.values(statusIdMap));
  if (idSet.size !== 15) details.push(`statusIdMap endpoint count is ${idSet.size}, expected 15.`);
  const pass = details.length === 0;
  return {
    id: "ids",
    title: "Canonical SpokeId Registry — Exactly 15, Fully Covered",
    pass,
    details: pass
      ? ["statusIdMap covers #1..#15; every record id is canonical."]
      : details,
  };
}

function dataGate(): LabGateResult {
  const details: string[] = [];
  for (const s of spokesData) {
    if (!s.originalVirtue || !s.corruptedDistortion) details.push(`Spoke #${s.number} missing virtue/distortion lore.`);
    if (!s.purpose) details.push(`Spoke #${s.number} missing systemic purpose.`);
    if (!s.consumes || s.consumes.length === 0) details.push(`Spoke #${s.number} has no input handshakes.`);
    if (!s.produces || s.produces.length === 0) details.push(`Spoke #${s.number} has no output yields.`);
    if (!s.milestones || s.milestones.length !== 4) details.push(`Spoke #${s.number} milestone count is ${s.milestones?.length ?? 0}, expected 4 (25/50/75/99).`);
    if (!s.connectedSpokes || s.connectedSpokes.length === 0) details.push(`Spoke #${s.number} has no cross-spoke connections.`);
  }
  const pass = details.length === 0;
  return {
    id: "data",
    title: "Spoke Data Integrity — Inputs, Outputs, Milestones, Virtue/Corruption",
    pass,
    details: pass
      ? ["All 15 spokes carry full input/output matrices, 4 milestones, and dual-form lore."]
      : details,
  };
}

// ============================================================================
// HERALDRY AUDIT — the One-Heraldry-One-Primitive Rule (VISUAL_DESIGN_MASTER.md).
// A "heraldic identity" is a patron's body of work: an Ascendant may echo a
// primitive onto that patron's own armor relics, but two DIFFERENT identities
// must never resolve to the same primitive. Each of the 15 spoke disciplines is
// its own identity and must be globally unique.
// The registry audit also proves every form's glyph is registered. The ledger
// below may only shrink; a stale row fails the gate on purpose.
// ============================================================================

export type HeraldryFamily = "Divine" | "Armor" | "Discipline";

export interface HeraldryFormRef {
  family: HeraldryFamily;
  entity: string;
  group: string; // heraldic identity — forms in the same group may share a primitive
  glyph: string;
}

export interface SymbolCollision {
  primitive: string;
  members: string[]; // sorted "family:entity" keys
}

// Known collisions scheduled for redesign. REMOVE entries as they are purified.
// EMPTY as of the discipline-glyph pass: all five original groups were purified.
export const KNOWN_COLLISIONS: SymbolCollision[] = [];

const divineGroup = (dominion: string) => `divine:${dominion}`;
const disciplineGroup = (spokeId: string) => `disc:${spokeId}`;

function collectHeraldryForms(): HeraldryFormRef[] {
  const refs: HeraldryFormRef[] = [];
  for (const g of initialWarpedPantheon) {
    const group = divineGroup(g.dominion);
    refs.push({ family: "Divine", entity: g.id, group, glyph: g.trueSymbol.glyph });
    refs.push({ family: "Divine", entity: g.id, group, glyph: g.corruptedSymbol.glyph });
  }
  for (const a of initialArmorSymbols) {
    const group = divineGroup(a.dominion);
    refs.push({ family: "Armor", entity: a.id, group, glyph: a.trueForm.glyph });
    refs.push({ family: "Armor", entity: a.id, group, glyph: a.corruptedForm.glyph });
  }
  for (const s of spokeSymbolsData) {
    const group = disciplineGroup(s.spokeId);
    refs.push({ family: "Discipline", entity: s.spokeId, group, glyph: s.trueSymbol.glyph });
    refs.push({ family: "Discipline", entity: s.spokeId, group, glyph: s.corruptedSymbol.glyph });
  }
  return refs;
}

export function computeCollisions(): SymbolCollision[] {
  const byGlyph = new Map<string, Map<string, Set<string>>>();
  for (const ref of collectHeraldryForms()) {
    const groups = byGlyph.get(ref.glyph) ?? new Map<string, Set<string>>();
    const members = groups.get(ref.group) ?? new Set<string>();
    members.add(`${ref.family}:${ref.entity}`);
    groups.set(ref.group, members);
    byGlyph.set(ref.glyph, groups);
  }
  return [...byGlyph.entries()]
    .filter(([, groups]) => groups.size > 1)
    .map(([primitive, groups]) => ({
      primitive,
      members: [...groups.values()].flatMap((set) => [...set]).sort(),
    }))
    .sort((a, b) => a.primitive.localeCompare(b.primitive));
}

function collisionKey(c: SymbolCollision): string {
  return `${c.primitive}:${c.members.join("|")}`;
}

function heraldryGate(): LabGateResult {
  const details: string[] = [];

  const refs = collectHeraldryForms();
  const unregistered = refs.filter((r) => !GLYPH_KEY_SET.has(r.glyph));
  for (const r of unregistered) {
    details.push(`Unregistered glyph "${r.glyph}" on ${r.family}:${r.entity} — add it to src/symbols/glyphKeys.ts.`);
  }

  const disciplineCount = spokeSymbolsData.length;
  if (disciplineCount !== 15) {
    details.push(`Discipline heraldry census is ${disciplineCount}, expected 15 (one per spoke).`);
  }
  const disciplineNumbers = [...new Set(spokeSymbolsData.map((s) => s.number))].sort((a, b) => a - b);
  const expectedNumbers = Array.from({ length: 15 }, (_, i) => i + 1);
  if (disciplineNumbers.length !== 15 || !disciplineNumbers.every((n, i) => n === expectedNumbers[i])) {
    details.push(`Discipline heraldry does not cover spokes #1..#15 exactly: [${disciplineNumbers.join(", ")}].`);
  }

  const actual = computeCollisions();
  const actualKeys = new Set(actual.map(collisionKey));
  const knownKeys = new Set(KNOWN_COLLISIONS.map(collisionKey));

  const newCollisions = actual.filter((c) => !knownKeys.has(collisionKey(c)));
  const staleLedger = KNOWN_COLLISIONS.filter((c) => !actualKeys.has(collisionKey(c)));

  for (const c of newCollisions) {
    details.push(`NEW primitive collision on "${c.primitive}": ${c.members.join(", ")} — redesign one identity (One-Heraldry-One-Primitive Rule).`);
  }
  for (const c of staleLedger) {
    details.push(`Ledger entry no longer collides and must be removed: "${c.primitive}" (${c.members.join(", ")}).`);
  }

  const pass = details.length === 0;
  const groupCount = new Set(refs.map((r) => r.group)).size;
  return {
    id: "heraldry",
    title: "Heraldry Uniqueness — Three Families, One Primitive Per Identity (Ledger Only Shrinks)",
    pass,
    details: pass
      ? [
          `${refs.length} forms across ${groupCount} heraldic identities; zero primitive collisions.`,
          "Discipline registry covers 15 spokes; every glyph key is registered. The ledger is empty and may never grow.",
        ]
      : details,
  };
}

export function runLabVerification(): LabVerification {
  const gates = [censusGate(), numericGate(), geometryGate(), idsGate(), dataGate(), heraldryGate()];
  return {
    gates,
    overall: gates.every((g) => g.pass),
  };
}