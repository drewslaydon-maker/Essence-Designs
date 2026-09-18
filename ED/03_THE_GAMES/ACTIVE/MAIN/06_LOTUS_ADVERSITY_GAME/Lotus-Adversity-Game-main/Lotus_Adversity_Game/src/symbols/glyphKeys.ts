// ============================================================================
// GLYPH KEYS — the closed set of rendering primitives for every SymbolForm.
// The single source of truth imported by `types.ts` (typing) and by the
// Heraldry gate in `src/lab/labChecks.ts` (registry coverage). A form whose
// glyph is not listed here fails `bun run lab:verify`.
// ============================================================================

export const GLYPH_KEYS = [
  // Divine / Armor primitives (the original eight)
  "trapezoid",
  "diamond",
  "crescents",
  "horned-calyx",
  "wedge",
  "lotus",
  "circle",
  "caliper",

  // Collision-purification primitives (one-form-one-primitive rebuilds)
  "chisel", // Bram true — the Reverent Chisel & Bedrock
  "antler", // Mera true — the wild canopy crown
  "sextant", // Caelen corrupted — the calcified surveyor's arc
  "diadem", // Alden-ascended true — the Crown of Concord

  // Reserved discipline vocabulary — one per spoke (VISUAL_DESIGN_MASTER §3.1)
  "bulwark", // 1 Bastion
  "blade", // 2 Edge
  "tripod", // 12 Stance
  "spiral", // 3 Sorcery
  "quill", // 4 Inscription
  "alembic", // 5 Alchemy
  "snare", // 6 Trapping
  "compass", // 7 Wayfinding
  "bough", // 8 Forestry
  "keystone", // 9 Masonry
  "pick", // 10 Quarrying
  "hammer", // 11 Smithing
  "bellows", // 13 Breath
  "chalice", // 14 Vessel
  "footprint", // 15 Unarmored
] as const;

export type GlyphKey = (typeof GLYPH_KEYS)[number];

export const GLYPH_KEY_SET: ReadonlySet<string> = new Set(GLYPH_KEYS);

export function isGlyphKey(value: string): value is GlyphKey {
  return GLYPH_KEY_SET.has(value);
}
