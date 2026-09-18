import { FC, useState } from "react";
import { foreverFlowersData } from "../data/foreverFlowersData";
import { phaseDossiersData } from "../data/spokesAndPillarsData";
import { runLabVerification, LabVerification } from "../lab/labChecks";
import { useAppStore } from "../store/useAppStore";
import { GitSyncModal } from "./GitSyncModal";
import { Boxes, ShieldCheck, Flower2, GitBranch, RefreshCw, CheckCircle2, XCircle, Siren } from "lucide-react";

const PHASE_STYLES: Record<string, { label: string; cls: string }> = {
  COMPLETED: { label: "COMPLETED", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  "ACTIVE SPRINT": { label: "ACTIVE SPRINT", cls: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  SEALED: { label: "SEALED", cls: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  PAUSED: { label: "PAUSED", cls: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
  UPCOMING: { label: "UPCOMING", cls: "bg-neutral-800 text-neutral-400 border-neutral-700" },
};

type ChamberTab = "pipeline" | "gates" | "covenants";
const TABS: { id: ChamberTab; label: string; icon: typeof Boxes }[] = [
  { id: "pipeline", label: "Pipeline", icon: Boxes },
  { id: "gates", label: "Sealing Gates", icon: ShieldCheck },
  { id: "covenants", label: "Covenants", icon: Flower2 },
];

export const ChamberView: FC = () => {
  const { playSfx } = useAppStore();
  const [tab, setTab] = useState<ChamberTab>("pipeline");
  const [gates, setGates] = useState<LabVerification>(() => runLabVerification());
  const [syncOpen, setSyncOpen] = useState(false);

  const runGates = () => {
    playSfx("shield");
    setGates(runLabVerification());
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Siren className="w-3.5 h-3.5" />
            <span>Ratification Chamber • Unsealed Phase 0.5</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            Consolidated Chamber
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            The narrative pipeline, executable sealing gates, and the Forever Flower covenants that bind agent and
            Architect. Phase 0.5 stands UNSEALED pending the v2 rebuild ratification.
          </p>
        </div>
        <button
          onClick={() => { setSyncOpen(true); playSfx("click"); }}
          className="absolute top-5 right-5 px-4 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-amber-500/20"
        >
          <GitBranch className="w-4 h-4" /> Git Sync
        </button>
      </div>

      <div className="flex items-center gap-2 bg-neutral-900/60 p-2 rounded-xl border border-neutral-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); playSfx("click"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === t.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                : "text-neutral-400 hover:text-neutral-200 border border-transparent"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "pipeline" && (
        <div className="space-y-4">
          {phaseDossiersData.map((phase) => {
            const pct = Math.round((phase.deliverablesCompleted / phase.totalDeliverables) * 100);
            const s = PHASE_STYLES[phase.status];
            return (
              <div key={phase.phase} className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">Phase {phase.phase}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                    </div>
                    <h2 className="font-cinzel text-lg sm:text-2xl font-black text-neutral-100 mt-0.5">
                      {phase.codename} <span className="text-neutral-400 font-semibold">— {phase.title}</span>
                    </h2>
                    <div className="text-[11px] font-mono text-neutral-500">{phase.timeframe}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-neutral-200">{phase.deliverablesCompleted}/{phase.totalDeliverables}</div>
                    <div className="w-40 h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-300">
                  <span className="text-neutral-500 uppercase tracking-wider font-bold text-[10px]">Validation Gate: </span>
                  {phase.validationGate}
                </div>
                {(phase.deliverables || []).map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className={`mt-0.5 shrink-0 ${
                      d.status === "COMPLETE" ? "text-emerald-500" : d.status === "IN_PROGRESS" ? "text-amber-400" : "text-neutral-600"
                    }`}>{d.status === "COMPLETE" ? "✓" : "○"}</span>
                    <div>
                      <div className="text-neutral-200"><span className="font-semibold">{d.title}.</span> {d.description}</div>
                      <div className="text-[10px] font-mono text-neutral-500">{d.acceptanceCriteria}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {tab === "gates" && (
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-cinzel text-xl font-black text-neutral-100">Airseal Verification</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {gates.gates.length} executable gates • {gates.gates.filter((g) => g.pass).length} passing
              </p>
            </div>
            <button
              onClick={runGates}
              className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-amber-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-run
            </button>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            gates.overall ? "bg-emerald-950/15 border-emerald-500/40" : "bg-rose-950/15 border-rose-500/40"
          }`}>
            {gates.overall ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />}
            <div>
              <div className={`font-cinzel font-black ${gates.overall ? "text-emerald-300" : "text-rose-300"}`}>
                {gates.overall ? "CANNON TRUE — ALL GATES PASS" : "CANNON DRIFT DETECTED"}
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                Data-level gates only. View-layer ratification requires green lab:verify + green lint per FLOWER 08.
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {gates.gates.map((g) => (
              <div key={g.id} className={`p-3.5 rounded-xl border ${
                g.pass ? "bg-neutral-900/60 border-neutral-800" : "bg-rose-950/15 border-rose-500/30"
              }`}>
                <div className="flex items-center gap-2">
                  {g.pass ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  <span className="text-xs font-mono font-bold text-neutral-100">{g.title}</span>
                </div>
                {g.details.map((d, i) => (
                  <p key={i} className={`text-[11px] mt-1 ml-6 leading-relaxed ${g.pass ? "text-neutral-400" : "text-rose-300"}`}>{d}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "covenants" && (
        <div className="space-y-4">
          {foreverFlowersData.map((flower) => {
            const revoked = flower.status === "INVALIDATED";
            return (
              <div key={flower.id} className={`rounded-2xl border p-5 sm:p-7 shadow-2xl space-y-3 ${
                revoked ? "bg-neutral-950 border-rose-500/30" : "bg-neutral-950 border-neutral-800"
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      revoked ? "bg-rose-500/10 text-rose-400 border-rose-500/40" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                    }`}>{flower.number}</span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{flower.category}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    revoked ? "bg-rose-500/10 text-rose-400 border-rose-500/40" : "bg-sky-500/10 text-sky-400 border-sky-500/40"
                  }`}>{revoked ? "INVALIDATED" : "RATIFIED"}</span>
                </div>
                <div>
                  <h2 className="font-cinzel text-lg sm:text-2xl font-black text-neutral-100">{flower.title}</h2>
                  <div className="text-xs font-mono text-neutral-500">{flower.subtitle}</div>
                </div>
                {revoked && flower.revocationNote && (
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">Revocation Note</span>
                    <p className="text-xs text-rose-200 leading-relaxed">{flower.revocationNote}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">Lesson Learned</span>
                    <p className="text-xs text-neutral-200 leading-relaxed mt-1">{flower.lessonLearned}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Core Principle</span>
                    <p className="text-xs text-neutral-200 leading-relaxed mt-1">{flower.corePrinciple}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold">Agent Practice</span>
                    <p className="text-xs text-neutral-200 leading-relaxed mt-1">{flower.agentPractice}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">User Practice</span>
                    <p className="text-xs text-neutral-200 leading-relaxed mt-1">{flower.userPractice}</p>
                  </div>
                </div>
                <blockquote className="font-medieval italic text-sm text-amber-200/80 border-l-2 border-amber-500/40 pl-4">
                  “{flower.goldenQuote}”
                </blockquote>
              </div>
            );
          })}
        </div>
      )}

      {syncOpen && <GitSyncModal isOpen={syncOpen} onClose={() => setSyncOpen(false)} />}
    </div>
  );
};