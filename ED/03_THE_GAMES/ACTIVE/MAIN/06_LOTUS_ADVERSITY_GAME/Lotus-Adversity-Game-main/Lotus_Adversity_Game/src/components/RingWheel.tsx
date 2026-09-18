import { FC, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Spoke, WarpedGod } from "../types";
import { spokesData } from "../data/spokesAndPillarsData";
import { initialWarpedPantheon } from "../data/warpedPantheonData";
import { spokeSymbolByNumber } from "../data/spokeSymbolsData";
import { outerSpokeMatrix, innerSpokeMatrix, cardinalMainNumbers } from "../lab/labChecks";
import { useAppStore } from "../store/useAppStore";
import { PantheonSymbolSvg } from "./PantheonSymbolGlyph";

const VIEW = 640;
const CENTER = 0;

// Radial depth ladder — hub -> Sunyata triad -> 12-spoke ring -> rim
const HUB_R = 60;
const SUNYATA_IN = 72;
const SUNYATA_OUT = 180;
const SPOKE_IN = 184;
const SPOKE_OUT = 274;
const OUTER_NUM_R = 212;
const INNER_NUM_R = 126;
const DOM_R = 258;
const RIM_R = 282;
// Godman sigil depths — sigils ride the ring at 240, the Sunyata bridge at 160.
const OUTER_GLYPH_R = 240;
const OUTER_GLYPH_SIZE = 24;
const INNER_GLYPH_R = 160;
const INNER_GLYPH_SIZE = 22;

const DOMINION_COLORS: Record<string, string> = {
  Iron: "#f59e0b",
  Ether: "#38bdf8",
  Frontier: "#10b981",
  Earth: "#fb923c",
  Axis: "#a855f7",
};

const RAD = Math.PI / 180;
const pt = (r: number, deg: number): [number, number] => {
  const rad = (deg - 90) * RAD;
  return [CENTER + r * Math.cos(rad), CENTER + r * Math.sin(rad)];
};

function sectorPath(r1: number, r2: number, a1: number, a2: number): string {
  const [s1x, s1y] = pt(r1, a1);
  const [e1x, e1y] = pt(r1, a2);
  const [s2x, s2y] = pt(r2, a1);
  const [e2x, e2y] = pt(r2, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${s1x} ${s1y} L ${s2x} ${s2y} A ${r2} ${r2} 0 ${large} 1 ${e2x} ${e2y} L ${e1x} ${e1y} A ${r1} ${r1} 0 ${large} 0 ${s1x} ${s1y} Z`;
}

// Tapered spoke ray: narrow at the hub, flaring toward the ring — the Sunyata bridge.
function spokePath(r1: number, r2: number, deg: number, innerHalfDeg: number, outerHalfDeg: number): string {
  const [a1x, a1y] = pt(r1, deg - innerHalfDeg);
  const [a2x, a2y] = pt(r1, deg + innerHalfDeg);
  const [b1x, b1y] = pt(r2, deg - outerHalfDeg);
  const [b2x, b2y] = pt(r2, deg + outerHalfDeg);
  return `M ${a1x} ${a1y} L ${b1x} ${b1y} L ${b2x} ${b2y} L ${a2x} ${a2y} Z`;
}

// 12 outer spokes tile their full 30° — the poise/balance of the wheel.
const SECTOR_BOUNDS = Array.from({ length: 12 }, (_, i) => i * 30 + 15); // 15..345
// Rim ticks at each spoke's seat (0..330) — the numeral clock of the wheel.
const RIM_TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

interface RingWheelProps {
  mode?: "corrupted" | "true";
  onSelectSpoke?: (spoke: Spoke) => void;
  onSelectGod?: (god: WarpedGod) => void;
  className?: string;
}

export const RingWheel: FC<RingWheelProps> = ({
  mode = "corrupted",
  onSelectSpoke,
  onSelectGod,
  className = "",
}) => {
  const { playSfx } = useAppStore();
  const [rotation, setRotation] = useState(0);
  // Live mirror of rotation so stable callbacks (endDrag) always settle from the
  // true current angle — not the first render's 0 (the old "sticky North" bug).
  const rotationRef = useRef(0);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  const drag = useRef<{ startRot: number; startAngle: number; pointerId: number } | null>(null);

  // Mechanical settle — a damped wobble on release so the wheel rests with weight.
  const settleState = useRef<{ a0: number; t0: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);

  const cancelSettle = () => {
    settleState.current = null;
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
  };

  const doSettle = () => {
    cancelSettle();
    settleState.current = { a0: rotationRef.current, t0: performance.now() };
    const step = () => {
      if (!settleState.current) { frameRef.current = null; return; }
      const t = performance.now() - settleState.current.t0;
      const dur = 420;
      if (t > dur) { settleState.current = null; frameRef.current = null; return; }
      const k = t / dur;
      const spring = Math.exp(-4.5 * k) * Math.sin(k * Math.PI * 2.2) * 3.2;
      setRotation(settleState.current.a0 + spring);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  };

  const soran = useMemo(() => initialWarpedPantheon.find((g) => g.dominion === "Axis"), []);

  const spokesByNumber = useMemo(() => {
    const map = new Map<number, Spoke>();
    for (const s of spokesData) map.set(s.number, s);
    return map;
  }, []);

  // True circular-arc midpoint per dominion (unit-vector mean, crosses 360 cleanly): Iron->0, Ether->90, Frontier->180, Earth->270.
  const dominionMidAngles = useMemo(() => {
    const groups = new Map<string, number[]>();
    for (const c of outerSpokeMatrix) {
      const arr = groups.get(c.dom) || [];
      arr.push(c.angle);
      groups.set(c.dom, arr);
    }
    const out = new Map<string, number>();
    for (const [dom, angles] of groups) {
      const rad = angles.map((a) => (a - 90) * RAD);
      const sx = rad.reduce((sum, r) => sum + Math.cos(r), 0);
      const sy = rad.reduce((sum, r) => sum + Math.sin(r), 0);
      const mid = (Math.atan2(sy, sx) / RAD + 90 + 360) % 360;
      out.set(dom, mid);
    }
    return out;
  }, []);

  const angleAt = (screenPos: { x: number; y: number }) => {
    const rect = wheelSvg.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = screenPos.x - cx;
    const py = screenPos.y - cy;
    return (Math.atan2(py, px) * 180) / Math.PI + 90;
  };

  const wheelSvg = useRef<SVGSVGElement | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    cancelSettle();
    wheelSvg.current?.setPointerCapture(e.pointerId);
    drag.current = { startRot: rotation, startAngle: angleAt({ x: e.clientX, y: e.clientY }), pointerId: e.pointerId };
  }, [rotation]);

  const onPointerMove = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag.current || drag.current.pointerId !== e.pointerId) return;
    const cur = angleAt({ x: e.clientX, y: e.clientY });
    let delta = cur - drag.current.startAngle;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    setRotation(drag.current.startRot + delta);
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
    doSettle();
  }, []);

  const rotated = (deg: number) => deg + rotation;
  // Opposing gears — the Axis (soul) mirrors the discipline ring, so the inner
  // spokes roll counter to the outer world. Connection and disconnection in one motion.
  const innerRotation = -rotation;
  const rotatedInner = (deg: number) => deg + innerRotation;

  const outer = outerSpokeMatrix.map((c) => ({ ...c, spoke: spokesByNumber.get(c.num) }));
  const inner = innerSpokeMatrix.map((c) => ({ ...c, spoke: spokesByNumber.get(c.num) }));

  const spokeIdToNumber = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of spokesData) m.set(s.id, s.number);
    return m;
  }, []);

  const angleByNumber = useMemo(() => {
    const m = new Map<number, number>();
    for (const c of [...outerSpokeMatrix, ...innerSpokeMatrix]) m.set(c.num, c.angle);
    return m;
  }, []);

  const godsByDominion = useMemo(() => {
    const m = new Map<string, WarpedGod>();
    for (const g of initialWarpedPantheon) m.set(g.dominion, g);
    return m;
  }, []);

  // Cross-dominion web — each spoke's connectedSpokes becomes a chord between seats.
  // Only the true form reveals the living lattice; corruption hides it.
  const chordEdges: { a: number; b: number }[] = [];
  if (mode === "true") {
    const seen = new Set<string>();
    const walk = (c: { num: number; spoke?: Spoke }) => {
      const s = c.spoke;
      if (!s?.connectedSpokes) return;
      for (const connId of s.connectedSpokes) {
        const connNum = spokeIdToNumber.get(connId);
        if (connNum === undefined || connNum === c.num) continue;
        const key = c.num < connNum ? `${c.num}-${connNum}` : `${connNum}-${c.num}`;
        if (seen.has(key)) continue;
        seen.add(key);
        chordEdges.push({ a: c.num, b: connNum });
      }
    };
    for (const c of outer) walk(c);
    for (const c of inner) walk(c);
  }

  const selectSpoke = (num: number, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    cancelSettle();
    playSfx("click");
    const spoke = spokesByNumber.get(num);
    if (spoke) onSelectSpoke?.(spoke);
  };

  const outerWedges = outer.map((c) => {
    const a = rotated(c.angle);
    const color = DOMINION_COLORS[c.dom];
    // True form resurrects each spoke's own spirit-color; broken form stays the
    // consuming Ascendant's grim bed/keyline.
    const fill = mode === "true" ? (c.spoke?.color ?? color) : "#0e0e12";
    const stroke = mode === "true" ? "#0a0a0c" : c.dom === "Iron" ? "#e11d48" : color;
    return (
      <path
        key={`wedge-${c.num}`}
        d={sectorPath(SPOKE_IN, SPOKE_OUT, a - 15, a + 15)}
        fill={fill}
        fillOpacity={mode === "true" ? 0.55 : 0.95}
        stroke={stroke}
        strokeWidth={mode === "true" ? 1 : 1.5}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer transition hover:brightness-125"
      />
    );
  });

  const innerWedges = inner.map((c) => {
    const a = rotatedInner(c.angle);
    const color = DOMINION_COLORS[c.dom];
    return (
      <path
        key={`sunyata-${c.num}`}
        d={spokePath(SUNYATA_IN, SUNYATA_OUT, a, 7, 13)}
        fill={mode === "true" ? (c.spoke?.color ?? color) : "#0e0e12"}
        fillOpacity={mode === "true" ? 0.75 : 0.95}
        stroke={color}
        strokeWidth={1.5}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer transition hover:brightness-125"
      />
    );
  });

  // Sunyata link-lines: the soul's veins, counter-rotating with the Axis triad.
  const sunyataLinks = inner.map((c) => {
    const a = rotatedInner(c.angle);
    const [x1, y1] = pt(HUB_R + 2, a);
    const [x2, y2] = pt(SPOKE_OUT, a);
    const color = DOMINION_COLORS[c.dom];
    return (
      <line key={`link-${c.num}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity={0.18} strokeWidth={1} strokeDasharray="2 6" />
    );
  });

  const outerLabels = outer.map((c) => {
    const a = rotated(c.angle);
    const [x, y] = pt(OUTER_NUM_R, a);
    const isMain = cardinalMainNumbers.includes(c.num);
    return (
      <g
        key={`label-${c.num}`}
        transform={`translate(${x} ${y}) rotate(${-a})`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer"
      >
        <circle r={13} fill="#050506" opacity={0.72} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fontWeight={isMain ? 700 : 400}
          fill={isMain ? "#fbbf24" : mode === "true" ? "#f5f5f4" : "#d4d4d4"}
        >
          {c.num}
        </text>
        {isMain && (
          <text y={19} textAnchor="middle" fontSize={7} fontFamily="ui-monospace, monospace" fill="#f59e0b" opacity={0.85}>
            MAIN
          </text>
        )}
        {isMain && (
          /* Contaminated seal — a slow pulse breathing around each cardinal seat. */
          <g pointerEvents="none">
            <circle r={14} fill="none" stroke={mode === "true" ? "#f59e0b" : "#f43f5e"} strokeWidth={1.2}>
              <animate
                attributeName="r"
                values="13;24;13"
                dur={mode === "true" ? "4.6s" : "3s"}
                repeatCount="indefinite"
                begin={`${-0.6 * c.num}s`}
              />
              <animate
                attributeName="stroke-opacity"
                values="0.55;0.02;0.55"
                dur={mode === "true" ? "4.6s" : "3s"}
                repeatCount="indefinite"
                begin={`${-0.6 * c.num}s`}
              />
            </circle>
          </g>
        )}
      </g>
    );
  });

  const innerLabels = inner.map((c) => {
    const a = rotatedInner(c.angle);
    const [x, y] = pt(INNER_NUM_R, a);
    return (
      <g
        key={`ilabel-${c.num}`}
        transform={`translate(${x} ${y}) rotate(${-a})`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer"
      >
        <circle r={13} fill="#050506" opacity={0.72} stroke="#a855f7" strokeOpacity={0.35} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700} fill="#c4b5fd">
          {c.num}
        </text>
        <text y={18} textAnchor="middle" fontSize={6.5} fontFamily="ui-monospace, monospace" fill="#a855f7" opacity={0.8}>
          AXIS
        </text>
      </g>
    );
  });

  // Discipline heraldry — in True Form each seat bears its OWN discipline glyph
  // (the ancient individuality of the skill). In Broken Form the consuming
  // Ascendant's corrupted mark grins down from the seat it has swallowed.
  const outerGlyphs = outer.map((c) => {
    const god = godsByDominion.get(c.dom);
    const disc = spokeSymbolByNumber[c.num];
    const sym = mode === "true" ? (disc?.trueSymbol ?? god?.trueSymbol) : god?.corruptedSymbol;
    if (!sym) return null;
    const a = rotated(c.angle);
    const [x, y] = pt(OUTER_GLYPH_R, a);
    return (
      <g
        key={`glyph-${c.num}`}
        transform={`translate(${x} ${y}) rotate(${-a})`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer"
      >
        <g transform={`translate(${-OUTER_GLYPH_SIZE / 2} ${-OUTER_GLYPH_SIZE / 2})`} pointerEvents="none">
          <PantheonSymbolSvg symbolForm={sym} size={OUTER_GLYPH_SIZE} isCorrupted={mode === "corrupted"} />
        </g>
      </g>
    );
  });

  const innerGlyphs = inner.map((c) => {
    const disc = spokeSymbolByNumber[c.num];
    const sym = mode === "true" ? (disc?.trueSymbol ?? soran?.trueSymbol) : soran?.corruptedSymbol;
    if (!sym) return null;
    const a = rotatedInner(c.angle);
    const [x, y] = pt(INNER_GLYPH_R, a);
    return (
      <g
        key={`iglyph-${c.num}`}
        transform={`translate(${x} ${y}) rotate(${-a})`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => selectSpoke(c.num, e)}
        className="cursor-pointer"
      >
        <g transform={`translate(${-INNER_GLYPH_SIZE / 2} ${-INNER_GLYPH_SIZE / 2})`} pointerEvents="none">
          <PantheonSymbolSvg symbolForm={sym} size={INNER_GLYPH_SIZE} isCorrupted={mode === "corrupted"} />
        </g>
      </g>
    );
  });

  return (
    <div className={`relative w-full max-w-[600px] mx-auto select-none ${className}`}>
      {/* Breathing ambient orb — life force behind the wheel */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl animate-pulse pointer-events-none ${
          mode === "true" ? "bg-amber-500/10" : "bg-rose-500/15"
        }`}
      />

      <svg
        ref={wheelSvg}
        viewBox={`-${VIEW / 2} -${VIEW / 2} ${VIEW} ${VIEW}`}
        className="w-full h-auto touch-none relative z-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <defs>
          <radialGradient id="hubGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.9} />
          </radialGradient>
          <radialGradient id="lifeGrad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={SPOKE_OUT}>
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="rotGrad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={SPOKE_OUT}>
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.32} />
            <stop offset="45%" stopColor="#e11d48" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
          </radialGradient>
          <filter id="rotSoft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Ambient under-glow — breathing rings */}
        <g pointerEvents="none">
          <circle r={RIM_R + 8} fill="none" stroke={mode === "true" ? "#f59e0b" : "#e11d48"} strokeOpacity={0.08} strokeWidth={2}>
            <animate attributeName="stroke-opacity" values="0.04;0.1;0.04" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle r={RIM_R + 22} fill="none" stroke={mode === "true" ? "#f59e0b" : "#e11d48"} strokeOpacity={0.06} strokeWidth={2}>
            <animate attributeName="stroke-opacity" values="0.03;0.08;0.03" dur="9.5s" repeatCount="indefinite" />
          </circle>

          {/* Torque transmission rings — counter-rotating clockwork frame */}
          <circle r={RIM_R + 10} fill="none" stroke={mode === "true" ? "#f59e0b" : "#e11d48"} strokeOpacity={0.14} strokeWidth={1.5} strokeDasharray="2 12">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="46s" repeatCount="indefinite" />
          </circle>
          <circle r={RIM_R + 20} fill="none" stroke={mode === "true" ? "#f59e0b" : "#e11d48"} strokeOpacity={0.1} strokeWidth={1} strokeDasharray="1 18">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="74s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Outer ring bed */}
        <circle r={SPOKE_OUT} fill="#0a0a0c" stroke={mode === "true" ? "#b45309" : "#7f1d1d"} strokeWidth={3} />

        {/* The 12 spoke sectors of discipline (contiguous, each true 30°) */}
        {outerWedges}

        {/* Corruption / life current — a slow mass bleeding across the wheel */}
        <g pointerEvents="none" filter="url(#rotSoft)">
          <path d={sectorPath(0, SPOKE_OUT, -55, 150)} fill={mode === "true" ? "url(#lifeGrad)" : "url(#rotGrad)"}>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to={mode === "true" ? "-360" : "360"}
              dur={mode === "true" ? "34s" : "24s"}
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Sector partition lines — the poise/balance seams between spokes */}
        {SECTOR_BOUNDS.map((deg) => {
          const a = rotated(deg);
          const [x1, y1] = pt(SPOKE_IN + 2, a);
          const [x2, y2] = pt(SPOKE_OUT - 2, a);
          return (
            <line key={`seam-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mode === "true" ? "#0a0a0c" : "#292524"} strokeWidth={1} />
          );
        })}

        {/* Inner bed + Sunyata triad linking the hub to the ring */}
        <circle r={SPOKE_IN} fill="#09090b" stroke="#27272a" strokeWidth={1.5} />
        {sunyataLinks}
        {innerWedges}

        {/* Cross-dominion lattice — the true web that corruption severed */}
        {mode === "true" && (
          <g pointerEvents="none" opacity={0.85}>
            {chordEdges.map((e) => {
              // Inner anchors ride the counter-spinning Axis; outer anchors stay on the ring,
              // so every soul-connection visibly strains as the two wheels oppose.
              const a1 = (e.a > 12 ? rotatedInner : rotated)(angleByNumber.get(e.a) ?? 0);
              const a2 = (e.b > 12 ? rotatedInner : rotated)(angleByNumber.get(e.b) ?? 0);
              const r1 = e.a > 12 ? INNER_NUM_R : OUTER_NUM_R;
              const r2 = e.b > 12 ? INNER_NUM_R : OUTER_NUM_R;
              const [x1, y1] = pt(r1, a1);
              const [x2, y2] = pt(r2, a2);
              return (
                <line key={`chord-${e.a}-${e.b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeOpacity={0.14} strokeWidth={1} strokeDasharray="2 6" />
              );
            })}
          </g>
        )}

        {/* Dominion names — seated on their true cardinal arcs */}
        {[...dominionMidAngles.entries()].map(([dom, mid]) => {
          const a = rotated(mid);
          const [x, y] = pt(DOM_R, a);
          return (
            <g key={`dom-${dom}`} transform={`translate(${x} ${y}) rotate(${-a})`} onPointerDown={(e) => e.stopPropagation()}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fontFamily="Cinzel, serif"
                fontWeight={700}
                letterSpacing={2}
                fill={DOMINION_COLORS[dom] || "#a3a3a3"}
                opacity={0.9}
              >
                {dom.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Numeric seal — 12 on the discipline ring, 13/14/15 on the Sunyata bridge */}
        {outerLabels}
        {innerLabels}

        {/* Discipline sigils — own mark in True, consuming Ascendant's mark in Broken */}
        {outerGlyphs}
        {innerGlyphs}

        {/* Rim seat ticks at each of the 12 numerals */}
        {RIM_TICKS.map((deg) => {
          const [x1, y1] = pt(SPOKE_OUT + 2, deg);
          const [x2, y2] = pt(SPOKE_OUT + 8, deg);
          return <line key={`rim-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#57534e" strokeOpacity={0.55} strokeWidth={1.5} />;
        })}

        {/* Center Hub — Soran */}
        <g
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            cancelSettle();
            playSfx("shield");
            if (soran) onSelectGod?.(soran);
          }}
          className="cursor-pointer"
        >
          {/* Pulsing halo around the Blind Stone */}
          <g pointerEvents="none">
            <circle r={HUB_R + 4} fill="none" stroke={mode === "true" ? "#e2e8f0" : "#a855f7"} strokeOpacity={0.4} strokeWidth={1}>
              <animate attributeName="r" values={`${HUB_R};${HUB_R + 20};${HUB_R}`} dur="6s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="6s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Slow torque ring — the forever stone's own rotation */}
          <circle r={HUB_R + 14} fill="none" stroke="#a855f7" strokeOpacity={0.18} strokeWidth={1} strokeDasharray="3 10" pointerEvents="none">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle r={HUB_R} fill="#0c0c0f" stroke={mode === "true" ? "#e2e8f0" : "#a855f7"} strokeWidth={2} />
          <circle r={HUB_R - 8} fill="url(#hubGrad)" stroke="#52525b" strokeWidth={1} />
          <circle r={22} fill="#050506" stroke="#a855f7" strokeOpacity={0.5} strokeWidth={1} />
          <text textAnchor="middle" dominantBaseline="central" y={-20} fontSize={14} fontFamily="Cinzel, serif" fontWeight={700} letterSpacing={2} fill="#e2e8f0">
            SORAN
          </text>
          <text textAnchor="middle" dominantBaseline="central" y={0} fontSize={9} fontFamily="ui-monospace, monospace" fill="#a78bfa">
            AXIS
          </text>
          <text textAnchor="middle" dominantBaseline="central" y={14} fontSize={8} fontFamily="ui-monospace, monospace" fill="#71717a">
            THE BLIND STONE
          </text>
        </g>
      </svg>

      {/* Mode + spin hint strip */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 rounded-full px-3 py-1.5 pointer-events-none z-20">
        <span className="text-neutral-400">DRAG TO SPIN</span>
        <span>•</span>
        <span className={mode === "true" ? "text-amber-400" : "text-rose-400"}>
          {mode === "true" ? "TRUE / HEALTHY" : "BROKEN / CORRUPTED"}
        </span>
      </div>
    </div>
  );
};