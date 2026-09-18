import { FC, useState } from "react";
import { Spoke, DominionType } from "../types";
import { spokesData } from "../data/spokesAndPillarsData";
import { useAppStore } from "../store/useAppStore";
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, Award } from "lucide-react";

const CONSUMING: Record<string, string> = { Iron: "Alden", Ether: "Caelen", Frontier: "Mera", Earth: "Bram" };
const DOMINION_COLOR: Record<string, string> = {
  Iron: "#f59e0b", Ether: "#38bdf8", Frontier: "#10b981", Earth: "#fb923c", Axis: "#a855f7",
};

const FILTERS: ("All" | DominionType)[] = ["All", "Iron", "Ether", "Frontier", "Earth", "Axis"];

export const SpokesView: FC = () => {
  const { playSfx } = useAppStore();
  const [filter, setFilter] = useState<"All" | DominionType>("All");
  const [selected, setSelected] = useState<Spoke>(spokesData[0]);

  const filtered = spokesData.filter((s) => filter === "All" || s.dominion === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Phase 0 Architecture • The 15-Spoke Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            Disciplines of the Wheel
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Twelve mortal paths across the Four Dominions, completed by the three-spoke Axis of Soran. Each discipline
            carries input/output handshakes across the wheel, an original virtue, warped into imperial distortion, and
            four milestone unlocks — Levels 25, 50, 75, and 99.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider pl-2 shrink-0">
          Dominion:
        </span>
        {FILTERS.map((dom) => (
          <button
            key={dom}
            onClick={() => { setFilter(dom); playSfx("click"); }}
            className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filter === dom
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                : "bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            }`}
          >
            {dom === "All" ? "All 15" : `${dom} (${spokesData.filter((s) => s.dominion === dom).length})`}
          </button>
        ))}
      </div>

      {/* Spoke cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {filtered.map((spoke) => {
          const isSelected = selected.id === spoke.id;
          return (
            <button
              key={spoke.id}
              onClick={() => { setSelected(spoke); playSfx("click"); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                isSelected
                  ? "bg-neutral-900 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40"
                  : "bg-neutral-950/80 hover:bg-neutral-900/60 border-neutral-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold" style={{ color: spoke.color }}>Spoke #{spoke.number}</span>
                  <span className="text-[9px] font-mono text-neutral-500">{spoke.dominion}</span>
                </div>
                <span className="text-xs font-semibold text-neutral-200 leading-snug mt-1 block">{spoke.name}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 mt-2 block">{spoke.category}</span>
            </button>
          );
        })}
      </div>

      {/* Deep dive */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold" style={{ backgroundColor: `${selected.color}20`, color: selected.color, border: `1px solid ${selected.color}50` }}>
                SPOKE #{selected.number} • {selected.dominion} {selected.dominion !== "Axis" && `(Consumed by ${CONSUMING[selected.dominion]})`}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">{selected.category}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-cinzel font-black text-neutral-100">{selected.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <CheckCircle2 className="w-4 h-4" /> Original Mortal Discipline
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed">{selected.originalVirtue}</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-rose-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Imperial Distortion
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed">{selected.corruptedDistortion}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold block">Gameplay Mechanic</span>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">{selected.purpose}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
            <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold block">Consumes From Other Spokes</span>
            {(selected.consumes || []).map((input, i) => (
              <div key={i} className="text-xs text-neutral-300 font-mono flex items-start gap-2">
                <span className="text-rose-500 font-bold">←</span><span>{input}</span>
              </div>
            ))}
            {(!selected.consumes || selected.consumes.length === 0) && <div className="text-xs text-neutral-500 font-mono italic">Independent discipline</div>}
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">Provides To Other Spokes</span>
            {(selected.produces || []).map((output, i) => (
              <div key={i} className="text-xs text-neutral-300 font-mono flex items-start gap-2">
                <span className="text-emerald-500 font-bold">→</span><span>{output}</span>
              </div>
            ))}
            {(!selected.produces || selected.produces.length === 0) && <div className="text-xs text-neutral-500 font-mono italic">Direct combat manifestation</div>}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-neutral-800">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Award className="w-4 h-4" /> Progression Milestones
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(selected.milestones || []).map((m, i) => {
              const isCap = i === (selected.milestones.length - 1);
              return (
                <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isCap ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "bg-neutral-900/60 border-neutral-800"
                }`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{m.tier}</span>
                      {isCap && <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <h4 className="font-cinzel text-sm font-bold text-neutral-100">{m.title}</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">{m.unlock}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};