import { FC, useState } from "react";
import { WarpedGod, Spoke } from "../types";
import { initialWarpedPantheon } from "../data/warpedPantheonData";
import { RingWheel } from "./RingWheel";
import { PantheonSymbolGlyph, PantheonSymbolSvg } from "./PantheonSymbolGlyph";
import { useAppStore } from "../store/useAppStore";
import { X, Eye, Shield, Award, ScrollText, Flame, Gem, Swords } from "lucide-react";

const DOMINION_META: Record<string, { color: string; title: string }> = {
  Iron: { color: "#f59e0b", title: "The War Pillar" },
  Ether: { color: "#38bdf8", title: "Mind Pillar" },
  Frontier: { color: "#10b981", title: "Wild Pillar" },
  Earth: { color: "#fb923c", title: "Labor Pillar" },
  Axis: { color: "#a855f7", title: "Center Hub" },
};

export const PantheonView: FC = () => {
  const { playSfx } = useAppStore();
  const [wheelMode, setWheelMode] = useState<"corrupted" | "true">("corrupted");
  const [selectedGod, setSelectedGod] = useState<WarpedGod | null>(null);
  const [selectedSpoke, setSelectedSpoke] = useState<Spoke | null>(null);

  const gods = initialWarpedPantheon;
  const active = selectedGod || selectedSpoke ? { god: selectedGod, spoke: selectedSpoke } : null;

  const close = () => {
    playSfx("click");
    setSelectedGod(null);
    setSelectedSpoke(null);
  };

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Flame className="w-3.5 h-3.5" />
            <span>The Broken RingWheel • Cosmology</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            The Warped Pantheon
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Fifteen spokes, bound into the gravity of five weeping sovereigns. Each of the mortal virtues that kept the
            wheel balanced was torn from its socket and consumed by an Ascendant's obsession — war, dead calculation,
            caged wilderness, molten extraction, and at the center, a stillness so absolute it froze the world in place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Wheel column */}
        <div className="relative rounded-2xl bg-neutral-950 border border-neutral-800 p-4 sm:p-6 shadow-2xl overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            wheelMode === "true" ? "bg-amber-500/10" : "bg-rose-500/10"
          }`} />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="space-y-0.5">
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-neutral-100 uppercase tracking-wide">
                The 15-Spoke RingWheel
              </h2>
              <p className="text-[11px] font-mono text-neutral-500">Drag to spin • Click any spoke, dominion, or the Soran hub</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setWheelMode("true"); playSfx("scribe"); }}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  wheelMode === "true"
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                TRUE FORM
              </button>
              <button
                onClick={() => { setWheelMode("corrupted"); playSfx("click"); }}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  wheelMode === "corrupted"
                    ? "bg-rose-500/20 border-rose-500/60 text-rose-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                BROKEN
              </button>
            </div>
          </div>

          <RingWheel
            mode={wheelMode}
            onSelectSpoke={setSelectedSpoke}
            onSelectGod={setSelectedGod}
          />

          {/* In-place absolute overlay dossier (The Big Tooltip) */}
          {active && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-3 sm:p-5 transition-all duration-150">
              {active.god ? (
                <GodDossier god={active.god} onClose={close} />
              ) : active.spoke ? (
                <SpokeDossier spoke={active.spoke} onClose={close} />
              ) : null}
            </div>
          )}
        </div>

        {/* Ascendants index */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-sm font-bold text-neutral-100 uppercase tracking-wide">The Five Ascendants</h3>
            <span className="text-[10px] font-mono text-amber-400">5 + 1 Hub</span>
          </div>
          {gods.map((god) => {
            const meta = DOMINION_META[god.dominion];
            return (
              <button
                key={god.id}
                onClick={() => { setSelectedGod(god); playSfx("scribe"); }}
                className="w-full text-left p-3 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden"
                    style={{ backgroundColor: `${meta.color}1a`, borderColor: `${meta.color}60` }}
                  >
                    <PantheonSymbolSvg symbolForm={god.corruptedSymbol} size={26} isCorrupted />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-100 truncate group-hover:text-amber-200 transition-colors">
                      {god.name}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: meta.color }}>
                      {god.dominion} — {god.folkWhisper}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          <p className="text-[10px] font-mono text-neutral-500 leading-relaxed pt-1">
            Select an Ascendant, or click directly on the wheel — every interaction opens the full dossier in place.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dossier surfaces                                                      */
/* ------------------------------------------------------------------ */

const sectionIcon = { virtue: Shield, corruption: Swords, decree: ScrollText, blessing: Award, relic: Gem };

const GodDossier: FC<{ god: WarpedGod; onClose: () => void }> = ({ god, onClose }) => {
  const meta = DOMINION_META[god.dominion];
  return (
    <div className="relative w-full max-w-lg max-h-[86vh] overflow-y-auto rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-2xl">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${meta.color}` }} />
      <div className="sticky top-0 z-10 flex items-start justify-between gap-2 p-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: meta.color }}>
            {god.dominion} • {god.dominionTitle}
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-black text-neutral-100 uppercase">{god.name}</h3>
          <div className="text-[11px] font-mono text-neutral-400">{god.publicTitle} — {god.folkWhisper}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 font-sans text-xs">
        <div className="grid grid-cols-4 gap-3">
          <PantheonSymbolGlyph symbolForm={god.trueSymbol} size={90} />
          <PantheonSymbolGlyph symbolForm={god.corruptedSymbol} size={90} isCorrupted />
          <div className="col-span-2 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-neutral-800 pb-1">True Heraldry</div>
            <div className="text-neutral-200 leading-relaxed">{god.trueSymbol.name}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold border-b border-neutral-800 pb-1 mt-2">Corrupted Mark</div>
            <div className="text-neutral-200 leading-relaxed">{god.corruptedSymbol.name}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <sectionIcon.virtue className="w-3.5 h-3.5" /> Mortal Virtue
          </div>
          <p className="text-neutral-200 leading-relaxed">{god.mortalVirtue}</p>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/10 border border-rose-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <sectionIcon.corruption className="w-3.5 h-3.5" /> Fractured Corruption
          </div>
          <p className="text-neutral-200 leading-relaxed">{god.fracturedCorruption}</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <sectionIcon.relic className="w-3.5 h-3.5" /> Warped Physiology
          </div>
          <p className="text-neutral-300 leading-relaxed">{god.warpedPhysiology}</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <sectionIcon.decree className="w-3.5 h-3.5" /> Divine Decree
          </div>
          <p className="font-medieval text-sm text-amber-100/90 leading-relaxed italic">“{god.divineDecree}”</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Consumed Spokes</span>
            {(god.consumedSpokes || []).map((spoke, i) => (
              <div key={i} className="text-[11px] font-mono text-neutral-300">← {spoke}</div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Affinities</span>
            <div className="text-[11px] font-mono text-neutral-300">Weight: {god.armorWeightAffinity}</div>
            <div className="text-[11px] font-mono text-neutral-300">Slot: {god.armorSlotAffinity}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <sectionIcon.blessing className="w-3.5 h-3.5" /> {god.tacticalBlessing.name}
          </div>
          <p className="text-neutral-300 leading-relaxed">{god.tacticalBlessing.mechanic}</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-950 border border-amber-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            Relic — {god.relic.name}
          </div>
          <p className="text-neutral-300 leading-relaxed italic">{god.relic.description}</p>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed font-medieval italic">{god.chronicleExcerpt}</p>
      </div>
    </div>
  );
};

const SpokeDossier: FC<{ spoke: Spoke; onClose: () => void }> = ({ spoke, onClose }) => {
  const consuming: Record<string, string> = { Iron: "Alden", Ether: "Caelen", Frontier: "Mera", Earth: "Bram" };
  const meta = DOMINION_META[spoke.dominion];
  return (
    <div className="relative w-full max-w-lg max-h-[86vh] overflow-y-auto rounded-2xl bg-neutral-900/95 border border-neutral-800 shadow-2xl">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: meta.color }} />
      <div className="sticky top-0 z-10 flex items-start justify-between gap-2 p-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: spoke.color }}>
            SPOKE #{spoke.number} • {spoke.dominion} Dominion
            {spoke.dominion !== "Axis" && ` • Consumed by ${consuming[spoke.dominion]}`}
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-black text-neutral-100 uppercase">{spoke.name}</h3>
          <div className="text-[11px] font-mono text-neutral-400">{spoke.category} • Phase 0 Discipline</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-500/25 space-y-1">
            <span className="text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Original Mortal Discipline</span>
            <p className="text-neutral-200 leading-relaxed">{spoke.originalVirtue}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/10 border border-rose-500/25 space-y-1">
            <span className="text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Imperial Distortion</span>
            <p className="text-neutral-200 leading-relaxed">{spoke.corruptedDistortion}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <span className="text-neutral-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Systemic Purpose</span>
          <p className="text-neutral-200 leading-relaxed">{spoke.purpose}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <span className="text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Consumes</span>
            {(spoke.consumes || []).map((input, i) => (
              <div key={i} className="text-[11px] font-mono text-neutral-300 flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">←</span>{input}
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider block">Produces</span>
            {(spoke.produces || []).map((output, i) => (
              <div key={i} className="text-[11px] font-mono text-neutral-300 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">→</span>{output}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" /> Milestone Unlocks
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(spoke.milestones || []).map((m, i) => (
              <div key={i} className={`p-3 rounded-xl border ${
                i === (spoke.milestones.length - 1) ? "bg-amber-950/15 border-amber-500/40" : "bg-neutral-900/60 border-neutral-800"
              }`}>
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">{m.tier}</div>
                <h4 className="font-cinzel text-sm font-bold text-neutral-100">{m.title}</h4>
                <p className="text-[11px] text-neutral-300 leading-relaxed">{m.unlock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};