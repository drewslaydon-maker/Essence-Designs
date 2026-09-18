import { FC, useState } from "react";
import { Pillar } from "../types";
import { pillarsData, xpMilestonesData } from "../data/spokesAndPillarsData";
import { useAppStore } from "../store/useAppStore";
import { Feather, Scale, ListChecks, TrendingUp, Landmark } from "lucide-react";

export const PillarsView: FC = () => {
  const { playSfx } = useAppStore();
  const [selected, setSelected] = useState<Pillar>(pillarsData[0]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-20 -left-16 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Landmark className="w-3.5 h-3.5" />
            <span>Foundational Doctrine • The Apparatus</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            Pillars Doctrine
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Four load-bearing doctrines stand beneath every screen and system in the Apparatus. They form the
            consequential dominance hierarchy that overrides client-side innovation and keep the codex true.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Pillar selector */}
        <div className="space-y-2.5">
          {pillarsData.map((pillar) => {
            const active = selected.id === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => { setSelected(pillar); playSfx("click"); }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? "bg-neutral-900 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "bg-neutral-950/80 border-neutral-800 hover:bg-neutral-900/60"
                }`}
              >
                <div className="font-mono text-[10px] font-bold text-amber-400">PILLAR {pillar.number}</div>
                <div className="font-cinzel text-sm font-bold text-neutral-100 mt-0.5">{pillar.title}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{pillar.subtitle}</div>
              </button>
            );
          })}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> Progression Curve
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed mt-1.5">
              From 0 XP to the 1,250,000 XP Ascendant cap — the canonical exponential ladder mapped to the Spoke
              mastery milestones at 25 / 50 / 75 / 99.
            </p>
          </div>
        </div>

        {/* Deep dive */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-8 space-y-5 shadow-2xl">
          <div className="border-b border-neutral-800 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 font-bold">
              Pillar {selected.number} — {selected.subtitle}
            </div>
            <h2 className="text-xl sm:text-3xl font-cinzel font-black text-neutral-100 mt-1">{selected.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">Design Origin</span>
              <p className="text-xs text-neutral-200 leading-relaxed mt-1.5">{selected.designOrigin}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">Development Reference Point</span>
              <p className="text-xs text-neutral-200 leading-relaxed mt-1.5">{selected.developmentReferencePoint}</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-b from-amber-950/20 to-neutral-900/60 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" /> Core Rule
            </div>
            <p className="text-sm text-neutral-100 leading-relaxed">{selected.coreRule}</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-b from-rose-950/15 to-neutral-900/60 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Feather className="w-3.5 h-3.5" /> Immutable Golden Rule
            </div>
            <p className="text-sm text-neutral-100 leading-relaxed">{selected.immutableGoldenRule}</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">Concrete Gameplay Expressions</span>
            <div className="space-y-2.5">
              {selected.concreteGameplayExpressions.map((expr, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-start gap-3">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-neutral-100">{expr.title}</div>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">{expr.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <ListChecks className="w-4 h-4" /> Codebase Compliance Checklist
            </span>
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-2">
              {selected.codebaseComplianceChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                  <span className="text-emerald-500 font-mono font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* XP curve table */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold block">Canonical XP Milestone Ladder</span>
            <div className="overflow-x-auto scrollbar-none rounded-xl border border-neutral-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-900/80 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    <th className="px-3 py-2.5">Lv</th>
                    <th className="px-3 py-2.5">Tier</th>
                    <th className="px-3 py-2.5 text-right">Total XP</th>
                    <th className="px-3 py-2.5 hidden sm:table-cell">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {xpMilestonesData.map((m) => {
                    const isMilestone = [25, 50, 75, 99].includes(m.level);
                    return (
                      <tr key={m.level} className={`border-t border-neutral-800/80 ${
                        isMilestone ? "bg-amber-950/10" : "bg-transparent"
                      }`}>
                        <td className={`px-3 py-2.5 font-mono text-xs font-bold ${isMilestone ? "text-amber-400" : "text-neutral-300"}`}>{m.level}</td>
                        <td className="px-3 py-2.5 font-cinzel text-xs font-semibold text-neutral-100">{m.tierName}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-neutral-300 text-right">{m.totalXp.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-[11px] text-neutral-400 leading-relaxed hidden sm:table-cell">{m.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};