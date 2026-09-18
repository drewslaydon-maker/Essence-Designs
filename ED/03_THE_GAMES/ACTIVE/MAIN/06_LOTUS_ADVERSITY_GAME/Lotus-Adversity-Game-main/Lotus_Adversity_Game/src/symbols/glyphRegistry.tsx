import { ReactNode } from "react";
import type { GlyphKey } from "./glyphKeys";

// ============================================================================
// GLYPH REGISTRY — the single render map for every symbol primitive.
// Parent (`PantheonSymbolGlyph`) owns the alignment ring + glow filter and
// wraps the returned node group; each entry only draws its own motif.
// Curated against VISUAL_DESIGN_MASTER.md §3. No two different entities may
// resolve to the same key (enforced by the Heraldry gate).
// ============================================================================

export interface GlyphRenderContext {
  stroke: string;
  corrupted: boolean;
}

type GlyphRenderer = (ctx: GlyphRenderContext) => ReactNode;

const CRIMSON = "#f43f5e";
const DEEP_CRIMSON = "#ef4444";

export const GLYPHS: Record<GlyphKey, GlyphRenderer> = {
  // ---------------------------------------------------------------------
  // ORIGINAL EIGHT — Divine / Armor primitives carried into the registry.
  // ---------------------------------------------------------------------
  trapezoid: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <polygon points="20,28 80,32 72,78 28,74" fill="none" stroke={stroke} strokeWidth={4} strokeLinejoin="miter" />
        <line x1="28" y1="20" x2="34" y2="38" stroke={stroke} strokeWidth={3} />
        <line x1="72" y1="20" x2="66" y2="38" stroke={stroke} strokeWidth={3} />
        <line x1="15" y1="52" x2="32" y2="52" stroke={stroke} strokeWidth={3} />
        <line x1="85" y1="52" x2="68" y2="52" stroke={stroke} strokeWidth={3} />
        <line x1="42" y1="44" x2="58" y2="64" stroke={CRIMSON} strokeWidth={4} />
        <line x1="58" y1="44" x2="42" y2="64" stroke={CRIMSON} strokeWidth={4} />
      </>
    ) : (
      <>
        <polygon points="24,34 76,34 66,74 34,74" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinejoin="round" />
        <line x1="16" y1="34" x2="84" y2="34" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <circle cx="50" cy="54" r={6} fill={stroke} />
        <circle cx="50" cy="54" r={12} fill="none" stroke={stroke} strokeWidth={1.5} strokeDasharray="3 3" />
      </>
    ),

  diamond: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 50 12 L 86 48 L 54 88 L 18 52 Z" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="40" y1="92" x2="62" y2="8" stroke={CRIMSON} strokeWidth={4.5} strokeLinecap="round" />
        <line x1="62" y1="8" x2="74" y2="24" stroke={CRIMSON} strokeWidth={3} />
      </>
    ) : (
      <>
        <polygon points="50,14 82,50 50,86 18,50" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinejoin="round" />
        <line x1="42" y1="22" x2="42" y2="78" stroke={stroke} strokeWidth={2.5} />
        <circle cx="50" cy="50" r={4.5} fill={stroke} />
      </>
    ),

  crescents: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 24 16 L 36 28 L 24 40 L 36 52 L 24 64 L 36 76 L 24 88" fill="none" stroke={stroke} strokeWidth={3.5} />
        <path d="M 76 16 L 64 28 L 76 40 L 64 52 L 76 64 L 64 76 L 76 88" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="50" y1="12" x2="50" y2="88" stroke={CRIMSON} strokeWidth={4} />
      </>
    ) : (
      <>
        <path d="M 30 20 C 15 35, 15 65, 30 80 C 22 65, 22 35, 30 20 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 70 20 C 85 35, 85 65, 70 80 C 78 65, 78 35, 70 20 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="50" y1="16" x2="50" y2="84" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <circle cx="50" cy="30" r={3.5} fill={stroke} />
      </>
    ),

  "horned-calyx": ({ stroke }) => (
    <>
      <circle cx="50" cy="58" r="26" fill="none" stroke={stroke} strokeWidth={3.5} strokeDasharray="16 8 20 6" />
      <path d="M 32 64 C 20 48, 16 28, 22 14 C 28 26, 36 42, 38 52" fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
      <path d="M 68 64 C 80 48, 84 28, 78 14 C 72 26, 64 42, 62 52" fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
      <circle cx="50" cy="62" r={6} fill={CRIMSON} />
      <line x1="46" y1="72" x2="46" y2="86" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="54" y1="72" x2="54" y2="92" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),

  wedge: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="14" y1="76" x2="44" y2="74" stroke={stroke} strokeWidth={4} />
        <line x1="56" y1="74" x2="86" y2="80" stroke={stroke} strokeWidth={4} />
        <polygon points="50,14 78,72 22,72" fill="none" stroke={stroke} strokeWidth={4} />
        <path d="M 50 18 L 46 42 L 54 58 L 50 86" stroke="#ea580c" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <line x1="18" y1="74" x2="82" y2="74" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
        <polygon points="50,22 72,66 28,66" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx="50" cy="48" r={4.5} fill={stroke} />
      </>
    ),

  lotus: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 47 16 A 34 34 0 0 0 47 84" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 53 16 A 34 34 0 0 1 53 84" fill="none" stroke={stroke} strokeWidth={3} />
        <circle cx="47" cy="16" r={2.5} fill={DEEP_CRIMSON} />
        <circle cx="53" cy="16" r={2.5} fill={DEEP_CRIMSON} />
        <circle cx="47" cy="84" r={2.5} fill={DEEP_CRIMSON} />
        <circle cx="53" cy="84" r={2.5} fill={DEEP_CRIMSON} />
        <line x1="50" y1="10" x2="50" y2="90" stroke={DEEP_CRIMSON} strokeWidth={1.5} strokeDasharray="5 2" />
        <path d="M 40 36 C 37 45, 37 55, 40 64" fill="none" stroke="#e2e8f0" strokeWidth={2} />
        <path d="M 60 36 C 63 45, 63 55, 60 64" fill="none" stroke="#e2e8f0" strokeWidth={2} />
        <path d="M 50 40 C 46 47, 45 50, 45 53 C 45 56.5, 47.2 59, 50 59 C 52.8 59, 55 56.5, 55 53 C 55 50, 54 47, 50 40 Z" fill="#09090b" stroke="#a855f7" strokeWidth={2} />
        <line x1="50" y1="42" x2="50" y2="57" stroke={DEEP_CRIMSON} strokeWidth={1.5} />
      </>
    ) : (
      <>
        <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth={2.5} />
        <circle cx="50" cy="50" r="30" fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
        <path d="M 28 48 C 28 66, 72 66, 72 48 C 66 60, 56 63, 50 63 C 44 63, 34 60, 28 48 Z" fill="none" stroke={stroke} strokeWidth={2.5} />
        <path d="M 33 49 C 37 40, 43 38, 48 44" fill="none" stroke={stroke} strokeWidth={2} />
        <path d="M 67 49 C 63 40, 57 38, 52 44" fill="none" stroke={stroke} strokeWidth={2} />
        <path d="M 50 32 C 45 40, 44 43, 44 46 C 44 49.5, 46.7 52, 50 52 C 53.3 52, 56 49.5, 56 46 C 56 43, 55 40, 50 32 Z" fill={stroke} fillOpacity={0.85} stroke={stroke} strokeWidth={1.5} />
        <circle cx="50" cy="46" r={2} fill="#ffffff" />
      </>
    ),

  circle: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth={3} strokeDasharray="8 4" />
        <line x1="30" y1="20" x2="30" y2="80" stroke="#38bdf8" strokeWidth={3} />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#38bdf8" strokeWidth={3} />
        <line x1="70" y1="20" x2="70" y2="80" stroke="#38bdf8" strokeWidth={3} />
        <line x1="20" y1="50" x2="80" y2="50" stroke={CRIMSON} strokeWidth={3} />
      </>
    ) : (
      <>
        <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 26 50 Q 50 30, 74 50 Q 50 70, 26 50 Z" fill="none" stroke={stroke} strokeWidth={2.5} />
        <circle cx="50" cy="50" r={5} fill={stroke} />
      </>
    ),

  caliper: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="50" y1="18" x2="26" y2="76" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
        <line x1="50" y1="18" x2="74" y2="76" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
        <circle cx="50" cy="18" r={7} fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="30" y1="64" x2="70" y2="64" stroke={CRIMSON} strokeWidth={3.5} strokeDasharray="4 2" />
      </>
    ) : (
      <>
        <path d="M 32 82 C 32 50, 68 50, 68 18" fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
        <circle cx="68" cy="18" r={5} fill={stroke} />
        <circle cx="32" cy="82" r={5} fill={stroke} />
      </>
    ),

  // ---------------------------------------------------------------------
  // COLLISION PURIFICATION — four unique primitives replacing shared ones.
  // ---------------------------------------------------------------------
  // Bram true — the Reverent Chisel & Bedrock (was trapezoid).
  chisel: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="16" y1="74" x2="84" y2="80" stroke={stroke} strokeWidth={4} />
        <line x1="20" y1="60" x2="80" y2="66" stroke={stroke} strokeWidth={3} opacity={0.7} />
        <rect x="45" y="16" width="10" height="30" rx="1.5" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 45 46 L 55 46 L 58 58 L 42 58 Z" fill={stroke} fillOpacity={0.85} stroke={stroke} strokeWidth={2} />
        <line x1="30" y1="86" x2="70" y2="86" stroke={CRIMSON} strokeWidth={3} strokeDasharray="4 3" />
      </>
    ) : (
      <>
        <line x1="18" y1="76" x2="82" y2="76" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
        <line x1="24" y1="84" x2="76" y2="84" stroke={stroke} strokeWidth={1.5} opacity={0.55} />
        <path d="M 50 14 L 56 22 L 56 48 L 50 56 L 44 48 L 44 22 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <line x1="50" y1="20" x2="50" y2="50" stroke={stroke} strokeWidth={1.5} opacity={0.7} />
        <circle cx="50" cy="68" r={3.5} fill={stroke} />
      </>
    ),

  // Mera true — the wild canopy crown (was circle).
  antler: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 50 82 L 50 44" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 50 56 L 30 40 L 22 22 M 30 40 L 38 30" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 50 56 L 70 40 L 78 22 M 70 40 L 62 30" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx="22" cy="22" r={3} fill={CRIMSON} />
        <circle cx="78" cy="22" r={3} fill={CRIMSON} />
        <line x1="24" y1="86" x2="76" y2="86" stroke={CRIMSON} strokeWidth={3} strokeDasharray="3 3" />
      </>
    ) : (
      <>
        <path d="M 50 84 L 50 42" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 50 58 L 28 42 L 18 24 M 28 42 L 34 28" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <path d="M 50 58 L 72 42 L 82 24 M 72 42 L 66 28" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <path d="M 36 74 C 42 66, 58 66, 64 74 C 56 78, 44 78, 36 74 Z" fill="none" stroke={stroke} strokeWidth={2} opacity={0.8} />
        <circle cx="50" cy="46" r={3} fill={stroke} />
      </>
    ),

  // Caelen corrupted — the calcified surveyor's arc (was wedge).
  sextant: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 22 62 A 34 34 0 0 1 78 62" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="22" y1="62" x2="50" y2="30" stroke={stroke} strokeWidth={3} />
        <line x1="78" y1="62" x2="50" y2="30" stroke={stroke} strokeWidth={3} />
        <line x1="30" y1="66" x2="34" y2="54" stroke="#38bdf8" strokeWidth={2} />
        <line x1="42" y1="70" x2="45" y2="56" stroke="#38bdf8" strokeWidth={2} />
        <line x1="58" y1="70" x2="55" y2="56" stroke="#38bdf8" strokeWidth={2} />
        <line x1="70" y1="66" x2="66" y2="54" stroke="#38bdf8" strokeWidth={2} />
        <line x1="16" y1="82" x2="84" y2="82" stroke={CRIMSON} strokeWidth={3} strokeDasharray="5 3" />
        <circle cx="50" cy="30" r={4} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 20 66 A 36 36 0 0 1 80 66" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="20" y1="66" x2="50" y2="28" stroke={stroke} strokeWidth={3} />
        <line x1="80" y1="66" x2="50" y2="28" stroke={stroke} strokeWidth={3} />
        <circle cx="50" cy="28" r={4.5} fill={stroke} />
        <path d="M 50 28 L 50 16" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      </>
    ),

  // Alden-ascended true — the Crown of Concord (was circle).
  diadem: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 26 62 A 24 24 0 0 1 74 62" fill="none" stroke={stroke} strokeWidth={3} strokeDasharray="6 4" />
        <path d="M 34 60 C 30 44, 38 32, 50 34 C 62 32, 70 44, 66 60" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="50" y1="34" x2="50" y2="60" stroke={CRIMSON} strokeWidth={3} />
        <circle cx="50" cy="46" r={3} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 24 62 A 26 26 0 0 1 76 62" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 34 60 C 26 44, 34 30, 50 32 C 66 30, 74 44, 66 60" fill="none" stroke={stroke} strokeWidth={2.5} />
        <path d="M 40 58 C 36 46, 42 38, 50 40 C 58 38, 64 46, 60 58" fill="none" stroke={stroke} strokeWidth={1.75} opacity={0.75} />
        <circle cx="50" cy="40" r={4} fill={stroke} />
      </>
    ),

  // ---------------------------------------------------------------------
  // DISCIPLINE VOCABULARY — one unique motif per spoke (VISUAL_DESIGN_MASTER §3.1)
  // ---------------------------------------------------------------------
  // 1 Bastion — the standing shield wall.
  bulwark: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 30 22 L 70 22 L 70 52 C 70 70, 58 82, 50 86 C 42 82, 30 70, 30 52 Z" fill="none" stroke={stroke} strokeWidth={3.5} />
        <path d="M 38 34 L 50 48 L 62 34" fill="none" stroke={CRIMSON} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 38 48 L 50 62 L 62 48" fill="none" stroke={CRIMSON} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx="50" cy="34" r={3} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 30 20 L 70 20 L 70 52 C 70 70, 58 82, 50 86 C 42 82, 30 70, 30 52 Z" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinejoin="round" />
        <line x1="30" y1="40" x2="70" y2="40" stroke={stroke} strokeWidth={2.5} />
        <circle cx="50" cy="56" r={6} fill={stroke} />
      </>
    ),

  // 2 Edge — the clean single-edge blade.
  blade: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 50 12 L 58 30 L 54 34 L 58 50 L 52 54 L 56 70 L 50 74 L 44 70 L 48 54 L 42 50 L 46 34 L 42 30 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <line x1="50" y1="12" x2="50" y2="74" stroke={CRIMSON} strokeWidth={2} strokeDasharray="4 3" />
        <rect x="44" y="74" width="12" height="8" rx="2" fill={stroke} fillOpacity={0.8} />
      </>
    ) : (
      <>
        <path d="M 50 12 L 58 32 L 50 44 L 58 60 L 50 78 L 42 60 L 50 44 L 42 32 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <line x1="50" y1="16" x2="50" y2="76" stroke={stroke} strokeWidth={1.5} opacity={0.7} />
        <rect x="43" y="78" width="14" height="8" rx="2" fill={stroke} fillOpacity={0.85} />
      </>
    ),

  // 12 Stance — the balanced tripod + plumb.
  tripod: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="50" y1="18" x2="50" y2="82" stroke={stroke} strokeWidth={2.5} strokeDasharray="5 4" />
        <line x1="50" y1="40" x2="24" y2="80" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="40" x2="72" y2="70" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="40" x2="60" y2="84" stroke={CRIMSON} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="2 3" />
        <circle cx="50" cy="40" r={4} fill={CRIMSON} />
      </>
    ) : (
      <>
        <line x1="50" y1="16" x2="50" y2="74" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        <line x1="50" y1="42" x2="28" y2="82" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="42" x2="72" y2="82" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="42" x2="50" y2="82" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx="50" cy="42" r={4.5} fill={stroke} />
        <circle cx="50" cy="82" r={3} fill={stroke} />
      </>
    ),

  // 3 Sorcery — the living ley spiral.
  spiral: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <circle cx="50" cy="50" r="10" fill="none" stroke={stroke} strokeWidth={3} />
        <circle cx="50" cy="50" r="20" fill="none" stroke={stroke} strokeWidth={2.5} strokeDasharray="6 3" />
        <circle cx="50" cy="50" r="30" fill="none" stroke={stroke} strokeWidth={2} strokeDasharray="3 3" />
        <line x1="50" y1="20" x2="50" y2="80" stroke={CRIMSON} strokeWidth={2.5} />
        <line x1="20" y1="50" x2="80" y2="50" stroke={CRIMSON} strokeWidth={2.5} />
      </>
    ) : (
      <>
        <path d="M 50 50 C 54 50, 56 54, 54 58 C 50 64, 42 62, 40 54 C 38 42, 50 34, 62 40 C 74 46, 76 62, 64 72 C 52 82, 32 78, 26 62" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <circle cx="50" cy="50" r={3} fill={stroke} />
      </>
    ),

  // 4 Inscription — the living word.
  quill: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="16" y1="34" x2="84" y2="34" stroke={stroke} strokeWidth={2.5} />
        <line x1="16" y1="50" x2="84" y2="50" stroke={stroke} strokeWidth={2.5} />
        <line x1="16" y1="66" x2="84" y2="66" stroke={stroke} strokeWidth={2.5} />
        <line x1="30" y1="24" x2="30" y2="76" stroke={stroke} strokeWidth={2.5} />
        <line x1="50" y1="24" x2="50" y2="76" stroke={stroke} strokeWidth={2.5} />
        <line x1="70" y1="24" x2="70" y2="76" stroke={stroke} strokeWidth={2.5} />
        <line x1="34" y1="70" x2="66" y2="30" stroke={CRIMSON} strokeWidth={4} strokeLinecap="round" />
      </>
    ) : (
      <>
        <line x1="18" y1="66" x2="82" y2="66" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        <line x1="18" y1="76" x2="60" y2="76" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
        <path d="M 64 22 C 50 34, 40 52, 34 68 C 46 60, 58 46, 66 30 C 68 26, 67 23, 64 22 Z" fill="none" stroke={stroke} strokeWidth={2.5} />
        <line x1="34" y1="68" x2="66" y2="30" stroke={stroke} strokeWidth={1.5} opacity={0.7} />
      </>
    ),

  // 5 Alchemy — the alembic and its vapor.
  alembic: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <circle cx="50" cy="62" r="20" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="34" y1="48" x2="66" y2="76" stroke={CRIMSON} strokeWidth={3} />
        <line x1="50" y1="42" x2="50" y2="30" stroke={stroke} strokeWidth={3} />
        <line x1="40" y1="26" x2="60" y2="26" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <line x1="50" y1="82" x2="50" y2="90" stroke={CRIMSON} strokeWidth={2.5} strokeDasharray="2 3" />
        <line x1="44" y1="86" x2="44" y2="92" stroke={CRIMSON} strokeWidth={2} strokeDasharray="2 3" />
      </>
    ) : (
      <>
        <circle cx="50" cy="64" r="20" fill="none" stroke={stroke} strokeWidth={3.5} />
        <path d="M 50 44 L 50 32 L 60 32" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <path d="M 40 40 C 36 32, 44 28, 40 22" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        <path d="M 56 38 C 52 30, 60 26, 56 20" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        <circle cx="50" cy="64" r={4} fill={stroke} />
      </>
    ),

  // 6 Trapping — the true snare loop.
  snare: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="26" y1="20" x2="26" y2="84" stroke={stroke} strokeWidth={2.5} />
        <line x1="40" y1="20" x2="40" y2="84" stroke={stroke} strokeWidth={2.5} />
        <line x1="54" y1="20" x2="54" y2="84" stroke={stroke} strokeWidth={2.5} />
        <line x1="68" y1="20" x2="68" y2="84" stroke={stroke} strokeWidth={2.5} />
        <line x1="20" y1="20" x2="80" y2="20" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <line x1="20" y1="84" x2="80" y2="84" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <circle cx="47" cy="52" r={5} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 30 68 C 14 58, 22 34, 40 32 C 58 30, 68 46, 60 60 C 54 70, 40 70, 36 60 C 33 52, 40 44, 48 46" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <path d="M 48 46 L 74 22" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <circle cx="48" cy="46" r={2.5} fill={stroke} />
      </>
    ),

  // 7 Wayfinding — the eight-point rose.
  compass: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth={2.5} strokeDasharray="5 4" />
        <path d="M 50 50 L 68 40 L 54 54 L 66 68 C 52 62, 48 58, 50 50 Z" fill={CRIMSON} stroke={CRIMSON} strokeWidth={1.5} />
        <circle cx="50" cy="50" r={4} fill="none" stroke={stroke} strokeWidth={2.5} />
      </>
    ) : (
      <>
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth={2} />
        <path d="M 50 14 L 56 44 L 86 50 L 56 56 L 50 86 L 44 56 L 14 50 L 44 44 Z" fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M 50 30 L 50 70" stroke={stroke} strokeWidth={2} />
        <path d="M 30 50 L 70 50" stroke={stroke} strokeWidth={2} />
        <circle cx="50" cy="50" r={4} fill={stroke} />
      </>
    ),

  // 8 Forestry — the living bough.
  bough: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 38 84 L 38 58 L 62 58 L 62 84 Z" fill="none" stroke={stroke} strokeWidth={3.5} />
        <line x1="38" y1="58" x2="62" y2="58" stroke={stroke} strokeWidth={3} />
        <path d="M 42 48 L 50 58 L 58 48 L 50 40 Z" fill="none" stroke={CRIMSON} strokeWidth={2.5} />
        <path d="M 30 60 L 70 60" stroke={CRIMSON} strokeWidth={2.5} strokeDasharray="4 3" />
        <line x1="30" y1="70" x2="70" y2="70" stroke={CRIMSON} strokeWidth={2} strokeDasharray="3 4" />
      </>
    ) : (
      <>
        <path d="M 50 86 L 50 44" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 50 58 C 38 56, 30 48, 28 38" fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 50 50 C 62 48, 70 40, 72 30" fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 28 38 C 24 30, 30 26, 34 30 C 36 34, 32 40, 28 38 Z" fill={stroke} fillOpacity={0.7} stroke={stroke} strokeWidth={1.5} />
        <path d="M 72 30 C 76 22, 70 18, 66 22 C 64 26, 68 32, 72 30 Z" fill={stroke} fillOpacity={0.7} stroke={stroke} strokeWidth={1.5} />
        <circle cx="50" cy="44" r={3} fill={stroke} />
      </>
    ),

  // 9 Masonry — the keyed arch.
  keystone: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 24 76 L 24 58 A 26 26 0 0 1 76 58 L 76 76" fill="none" stroke={stroke} strokeWidth={3.5} />
        <path d="M 40 44 L 60 44 L 58 56 L 42 56 Z" fill="none" stroke={CRIMSON} strokeWidth={3} strokeDasharray="4 3" />
        <line x1="46" y1="52" x2="58" y2="72" stroke={CRIMSON} strokeWidth={2.5} />
      </>
    ) : (
      <>
        <path d="M 22 78 L 22 58 A 28 28 0 0 1 78 58 L 78 78" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 40 42 L 60 42 L 56 56 L 44 56 Z" fill={stroke} fillOpacity={0.85} stroke={stroke} strokeWidth={2} />
        <line x1="22" y1="66" x2="32" y2="66" stroke={stroke} strokeWidth={2} opacity={0.6} />
        <line x1="68" y1="66" x2="78" y2="66" stroke={stroke} strokeWidth={2} opacity={0.6} />
      </>
    ),

  // 10 Quarrying — the pick over strata.
  pick: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <line x1="20" y1="72" x2="80" y2="72" stroke={stroke} strokeWidth={3} />
        <line x1="30" y1="82" x2="70" y2="82" stroke={stroke} strokeWidth={3} />
        <line x1="40" y1="92" x2="60" y2="92" stroke={stroke} strokeWidth={3} />
        <path d="M 22 30 C 40 40, 60 40, 78 30" fill="none" stroke={CRIMSON} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="38" x2="50" y2="62" stroke={stroke} strokeWidth={3} />
      </>
    ) : (
      <>
        <path d="M 22 28 C 40 40, 60 40, 78 28" fill="none" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="50" y1="38" x2="50" y2="70" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <line x1="24" y1="78" x2="76" y2="78" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
        <line x1="24" y1="86" x2="76" y2="86" stroke={stroke} strokeWidth={2} opacity={0.6} strokeLinecap="round" />
      </>
    ),

  // 11 Smithing — the cross-peen hammer over the anvil.
  hammer: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <rect x="38" y="14" width="24" height="16" rx="2" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="50" y1="30" x2="50" y2="62" stroke={stroke} strokeWidth={3.5} />
        <path d="M 26 66 L 74 62" stroke={stroke} strokeWidth={3} />
        <path d="M 30 62 L 26 78 L 74 74" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="30" y1="86" x2="70" y2="86" stroke={CRIMSON} strokeWidth={3} strokeDasharray="4 3" />
      </>
    ) : (
      <>
        <rect x="40" y="14" width="20" height="14" rx="2" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="50" y1="28" x2="50" y2="58" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 26 70 L 40 62 L 60 62 L 74 70 L 60 78 L 40 78 Z" fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
        <line x1="34" y1="86" x2="66" y2="86" stroke={stroke} strokeWidth={2} opacity={0.6} />
      </>
    ),

  // 13 Breath — the twin bellows.
  bellows: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 50 50 C 44 40, 30 36, 20 42 C 26 52, 38 58, 50 50 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 50 50 C 56 60, 70 64, 80 58 C 74 48, 62 42, 50 50 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 34 46 C 40 50, 46 52, 52 52" fill="none" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 66 54 C 60 50, 54 48, 48 48" fill="none" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx="50" cy="50" r={4} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 50 50 C 42 38, 26 34, 16 40 C 24 52, 38 58, 50 50 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <path d="M 50 50 C 58 62, 74 66, 84 60 C 76 48, 62 42, 50 50 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <path d="M 22 42 L 14 36 M 22 46 L 12 44 M 78 58 L 86 64 M 78 54 L 88 56" stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        <circle cx="50" cy="50" r={3.5} fill={stroke} />
      </>
    ),

  // 14 Vessel — the open chalice.
  chalice: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 32 24 L 68 24 L 62 52 L 38 52 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <line x1="50" y1="52" x2="50" y2="74" stroke={stroke} strokeWidth={3.5} />
        <line x1="34" y1="78" x2="66" y2="78" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="36" y1="30" x2="64" y2="48" stroke={CRIMSON} strokeWidth={2.5} />
        <circle cx="50" cy="38" r={3} fill={CRIMSON} />
      </>
    ) : (
      <>
        <path d="M 32 22 L 68 22 L 62 52 C 60 58, 40 58, 38 52 Z" fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
        <line x1="50" y1="56" x2="50" y2="74" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <line x1="34" y1="78" x2="66" y2="78" stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 50 30 C 46 36, 46 40, 50 44 C 54 40, 54 36, 50 30 Z" fill={stroke} fillOpacity={0.8} stroke={stroke} strokeWidth={1.5} />
      </>
    ),

  // 15 Unarmored — the bare footprint.
  footprint: ({ stroke, corrupted }) =>
    corrupted ? (
      <>
        <path d="M 50 16 C 60 16, 64 26, 62 38 C 60 50, 56 60, 50 60 C 44 60, 40 50, 38 38 C 36 26, 40 16, 50 16 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <ellipse cx="50" cy="74" rx="14" ry="10" fill="none" stroke={stroke} strokeWidth={3} />
        <line x1="40" y1="72" x2="60" y2="72" stroke={CRIMSON} strokeWidth={2.5} />
        <line x1="50" y1="66" x2="50" y2="82" stroke={CRIMSON} strokeWidth={2.5} />
        <line x1="42" y1="26" x2="58" y2="26" stroke={CRIMSON} strokeWidth={2} strokeDasharray="3 3" />
      </>
    ) : (
      <>
        <path d="M 50 16 C 60 16, 64 26, 62 38 C 60 50, 56 60, 50 60 C 44 60, 40 50, 38 38 C 36 26, 40 16, 50 16 Z" fill="none" stroke={stroke} strokeWidth={3} />
        <ellipse cx="50" cy="74" rx="14" ry="10" fill="none" stroke={stroke} strokeWidth={3} />
        <path d="M 24 30 C 30 42, 30 62, 24 74" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <path d="M 76 30 C 70 42, 70 62, 76 74" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      </>
    ),
};

export function renderGlyph(key: GlyphKey, ctx: GlyphRenderContext): ReactNode {
  const renderer = GLYPHS[key];
  if (!renderer) {
    return (
      <>
        <circle cx="50" cy="50" r="26" fill="none" stroke={ctx.stroke} strokeWidth={3} />
        <line x1="50" y1="24" x2="50" y2="76" stroke={ctx.stroke} strokeWidth={3} />
        <line x1="24" y1="50" x2="76" y2="50" stroke={ctx.stroke} strokeWidth={3} />
      </>
    );
  }
  return renderer(ctx);
}
