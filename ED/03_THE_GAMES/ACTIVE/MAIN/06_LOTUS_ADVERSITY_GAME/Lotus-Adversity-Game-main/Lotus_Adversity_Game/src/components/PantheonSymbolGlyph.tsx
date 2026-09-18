import { FC, useId } from "react";
import { SymbolForm } from "../types";
import { renderGlyph } from "../symbols/glyphRegistry";

interface PantheonSymbolSvgProps {
  symbolForm: SymbolForm;
  size?: number;
  className?: string;
  isCorrupted?: boolean;
}

/**
 * Pure SVG sigil renderer — no wrapper chrome. Safe to embed inside larger SVGs
 * (the wheel) or styled containers. Each instance owns a unique filter id via useId
 * so 15 godman sigils can coexist without filter-capture bugs.
 *
 * The motif itself lives in `src/symbols/glyphRegistry.tsx`, keyed by `SymbolForm.glyph`.
 * This component owns only the alignment ring and the glow filters.
 */
export const PantheonSymbolSvg: FC<PantheonSymbolSvgProps> = ({
  symbolForm,
  size = 24,
  className = "",
  isCorrupted = false,
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const { glyph, accentColor } = symbolForm;
  const strokeColor = accentColor || (isCorrupted ? "#ef4444" : "#f59e0b");
  const glowTrue = `${uid}-true`;
  const glowCorrupt = `${uid}-corrupt`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`overflow-visible select-none ${className}`}>
      <defs>
        <filter id={glowCorrupt} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={glowTrue} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer alignment circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={isCorrupted ? "#7f1d1d" : "#78350f"}
        strokeWidth="1"
        strokeDasharray={isCorrupted ? "4 3 8 3" : "2 2"}
        className="opacity-70"
      />

      <g filter={`url(#${isCorrupted ? glowCorrupt : glowTrue})`}>
        {renderGlyph(glyph, { stroke: strokeColor, corrupted: isCorrupted })}
      </g>
    </svg>
  );
};

interface PantheonSymbolGlyphProps {
  symbolForm: SymbolForm;
  size?: number;
  className?: string;
  isCorrupted?: boolean;
}

/** Styled container wrapping the pure sigil — the gallery surface used across the app. */
export const PantheonSymbolGlyph: FC<PantheonSymbolGlyphProps> = ({
  symbolForm,
  size = 120,
  className = "",
  isCorrupted = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center p-3 rounded-xl border transition-all ${
        isCorrupted
          ? "bg-rose-950/20 border-rose-900/60 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
          : "bg-amber-950/20 border-amber-800/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      } ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >
      <PantheonSymbolSvg symbolForm={symbolForm} size={size} isCorrupted={isCorrupted} />
    </div>
  );
};
