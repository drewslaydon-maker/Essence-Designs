import { FC, useMemo, useState } from "react";
import { ArmorWeightClass, SymbolForm } from "../types";
import { initialWarpedPantheon } from "../data/warpedPantheonData";
import { initialArmorSymbols } from "../data/armorSymbolsData";
import { spokeSymbolsData, spokeSymbolByNumber } from "../data/spokeSymbolsData";
import { spokesData } from "../data/spokesAndPillarsData";
import { computeCollisions } from "../lab/labChecks";
import { PantheonSymbolGlyph } from "./PantheonSymbolGlyph";
import { useAppStore } from "../store/useAppStore";
import { Flame, Compass, Shield, Hammer, Gauge, Copy, Check, ScrollText, ShieldCheck } from "lucide-react";

// ============================================================================
// HERALDRY — the single canonical home for all three symbol families
// (Divine · Discipline · Armor) plus the runtime audit surface. There is no
// competing gallery; `SymbolsView` was absorbed here.
// ============================================================================

type Family = "Divine" | "Discipline" | "Armor";

const FAMILIES: { id: Family; label: string; sub: string; icon: typeof Flame }[] = [
  { id: "Divine", label: "Divine", sub: "5 Ascendants", icon: Flame },
  { id: "Discipline", label: "Discipline", sub: "15 Spokes", icon: Compass },
  { id: "Armor", label: "Armor", sub: "6 Relics", icon: Shield },
];

const DOMINION_COLOR: Record<string, string> = {
  Iron: "#f59e0b", Ether: "#38bdf8", Frontier: "#10b981", Earth: "#fb923c", Axis: "#a855f7",
};

const WEIGHTS: ("All" | ArmorWeightClass)[] = ["All", "Heavy", "Medium", "Light", "Zero"];
const FLAT_DR: Record<ArmorWeightClass, number> = { Heavy: 24, Medium: 14, Light: 8, Zero: 0 };
const POSTURE_MOD: Record<ArmorWeightClass, number> = { Heavy: 0.35, Medium: 0.6, Light: 0.8, Zero: 1 };

const FormCard: FC<{ form: SymbolForm; corrupted: boolean; label: string }> = ({ form, corrupted, label }) => (
  <div className={`p-4 rounded-xl space-y-2 border ${corrupted ? "bg-rose-950/10 border-rose-500/25" : "bg-amber-950/10 border-amber-500/25"}`}>
    <div className="flex items-center gap-2">
      <PantheonSymbolGlyph symbolForm={form} size={90} isCorrupted={corrupted} />
      <div className="space-y-1">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${corrupted ? "text-rose-400" : "text-amber-400"}`}>
          {label}
        </span>
        <div className="font-cinzel text-sm font-bold text-neutral-100">{form.name}</div>
        <div className="text-[10px] font-mono text-neutral-500">{form.glyph}</div>
      </div>
    </div>
    <p className="text-xs text-neutral-300 leading-relaxed">{form.inUniverseMeaning}</p>
    <p className="text-[11px] text-neutral-500 leading-relaxed italic">{form.geometry}</p>
  </div>
);

export const HeraldryView: FC = () => {
  const { playSfx } = useAppStore();
  const [family, setFamily] = useState<Family>("Divine");
  const [godId, setGodId] = useState(initialWarpedPantheon[0].id);
  const [spokeNum, setSpokeNum] = useState(1);
  const [armorId, setArmorId] = useState(initialArmorSymbols[0].id);
  const [weight, setWeight] = useState<"All" | ArmorWeightClass>("All");
  const [copied, setCopied] = useState(false);
  const [rawDamage, setRawDamage] = useState(60);
  const [incomingPosture, setIncomingPosture] = useState(42);

  const collisions = useMemo(() => computeCollisions(), []);

  const god = initialWarpedPantheon.find((g) => g.id === godId) ?? initialWarpedPantheon[0];
  const discSet = spokeSymbolByNumber[spokeNum] ?? spokeSymbolsData[0];
  const discSpoke = spokesData.find((s) => s.id === discSet.spokeId);
  const armor = initialArmorSymbols.find((a) => a.id === armorId) ?? initialArmorSymbols[0];

  const filteredArmor = initialArmorSymbols.filter((s) => weight === "All" || s.weightClass === weight);
  const flatDR = FLAT_DR[armor.weightClass];
  const netDamage = Math.max(0, rawDamage - flatDR);
  const postureAfter = Math.max(0, Math.round(incomingPosture * POSTURE_MOD[armor.weightClass]));

  const exportArmorMarkdown = () => {
    const sym = armor;
    const text = `=== SACRED ARMOR SYMBOL: ${sym.name} ===\nChronological Era: ${sym.chronologicalEra}\nWeight Class: ${sym.weightClass} | Slot: ${sym.slot}\nGod Affinity: ${sym.godAffinity} (${sym.dominion} Dominion)\n\n[TRUE / HEALTHY FORM: ${sym.trueForm.name}]\nGeometry: ${sym.trueForm.geometry}\nMeaning: ${sym.trueForm.inUniverseMeaning}\n\n[CORRUPTED IMPERIAL FORM: ${sym.corruptedForm.name}]\nGeometry: ${sym.corruptedForm.geometry}\nMeaning: ${sym.corruptedForm.inUniverseMeaning}\n\nForging Incantation: "${sym.forgingIncantation}"\nMitigation: ${sym.postureMitigation}\nSynergy: ${sym.weightSynergy}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    playSfx("scribe");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <ScrollText className="w-3.5 h-3.5" />
            <span>Sacred Heraldry • Three Families • Dual Forms</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            The Heraldry Codex
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Every mark in Alderreach is an ideological battleground with two forms: the ancient true geometry of a
            mortal virtue, and the corrupted seal of the Ascendant that consumed it. One heraldic identity, one
            primitive — enforced at build time.
          </p>
        </div>
      </div>

      {/* Family switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900/60 p-2 rounded-xl border border-neutral-800">
        {FAMILIES.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFamily(f.id); playSfx("click"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              family === f.id
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "text-neutral-400 hover:text-neutral-200 border-transparent"
            }`}
          >
            <f.icon className="w-3.5 h-3.5" /> {f.label}
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-950 text-neutral-500 border border-neutral-800">
              {f.sub}
            </span>
          </button>
        ))}
      </div>

      {/* Audit surface */}
      <div className={`rounded-2xl border p-4 sm:p-5 shadow-2xl ${collisions.length === 0 ? "bg-emerald-950/10 border-emerald-500/30" : "bg-rose-950/15 border-rose-500/40"}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${collisions.length === 0 ? "text-emerald-400" : "text-rose-400"}`} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-100">
            One-Heraldry-One-Primitive Audit
          </span>
        </div>
        <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-relaxed">
          {collisions.length === 0
            ? "Zero primitive collisions across Divine, Discipline, and Armor. Registry coverage is complete."
            : `${collisions.length} collision(s) detected — redesign one identity each: ${collisions.map((c) => c.primitive).join(", ")}`}
        </p>
      </div>

      {/* ---------------- DIVINE ---------------- */}
      {family === "Divine" && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 space-y-2 shadow-2xl">
            {initialWarpedPantheon.map((g) => {
              const active = g.id === godId;
              return (
                <button
                  key={g.id}
                  onClick={() => { setGodId(g.id); playSfx("click"); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    active ? "bg-neutral-900 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]" : "bg-neutral-950/70 border-neutral-800 hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PantheonSymbolGlyph symbolForm={g.trueSymbol} size={34} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-100 truncate">{g.name}</div>
                      <div className="text-[10px] font-mono" style={{ color: DOMINION_COLOR[g.dominion] }}>{g.dominion} Dominion</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-5">
            <div className="border-b border-neutral-800 pb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: DOMINION_COLOR[god.dominion] }}>
                {god.publicTitle}
              </div>
              <h2 className="text-xl sm:text-3xl font-cinzel font-black text-neutral-100">{god.name}</h2>
              <div className="text-[11px] font-mono text-neutral-400">{god.folkWhisper}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormCard form={god.trueSymbol} corrupted={false} label="True / Healthy" />
              <FormCard form={god.corruptedSymbol} corrupted label="Corrupted Mark" />
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Divine Decree</span>
              <p className="font-medieval text-sm text-amber-100/90 italic leading-relaxed">“{god.divineDecree}”</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DISCIPLINE ---------------- */}
      {family === "Discipline" && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 space-y-2 shadow-2xl max-h-[640px] overflow-y-auto">
            {spokeSymbolsData.map((s) => {
              const active = s.number === spokeNum;
              return (
                <button
                  key={s.spokeId}
                  onClick={() => { setSpokeNum(s.number); playSfx("click"); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    active ? "bg-neutral-900 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]" : "bg-neutral-950/70 border-neutral-800 hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PantheonSymbolGlyph symbolForm={s.trueSymbol} size={34} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-100 truncate">{s.discipline}</div>
                      <div className="text-[10px] font-mono text-neutral-500">Spoke #{s.number}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-5">
            <div className="border-b border-neutral-800 pb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Spoke #{discSet.number} • {discSpoke?.category} Discipline
              </div>
              <h2 className="text-xl sm:text-3xl font-cinzel font-black text-neutral-100">{discSet.discipline}</h2>
              <div className="text-[11px] font-mono text-neutral-400">{discSpoke?.name}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormCard form={discSet.trueSymbol} corrupted={false} label="True / Healthy" />
              <FormCard form={discSet.corruptedSymbol} corrupted label="Corrupted Mark" />
            </div>
            {discSpoke && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-500/25 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Original Virtue</span>
                  <p className="text-xs text-neutral-200 leading-relaxed">{discSpoke.originalVirtue}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/25 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold">Corrupted Distortion</span>
                  <p className="text-xs text-neutral-200 leading-relaxed">{discSpoke.corruptedDistortion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- ARMOR ---------------- */}
      {family === "Armor" && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  onClick={() => { setWeight(w); playSfx("click"); }}
                  className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    weight === w
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                      : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredArmor.map((sym) => {
                const active = armor.id === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => { setArmorId(sym.id); playSfx("click"); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active ? "bg-neutral-900 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]" : "bg-neutral-950/70 border-neutral-800 hover:bg-neutral-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <PantheonSymbolGlyph symbolForm={sym.trueForm} size={34} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-100 truncate">{sym.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: DOMINION_COLOR[sym.dominion] }}>
                          {sym.weightClass} • {sym.slot} • {sym.dominion}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: DOMINION_COLOR[armor.dominion] }}>
                  {armor.chronologicalEra}
                </div>
                <h2 className="text-xl sm:text-3xl font-cinzel font-black text-neutral-100">{armor.name}</h2>
                <div className="text-[11px] font-mono text-neutral-400">
                  {armor.weightClass} Armor • {armor.slot} • Bound to {armor.godAffinity}
                </div>
              </div>
              <button
                onClick={exportArmorMarkdown}
                className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-amber-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Markdown"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormCard form={armor.trueForm} corrupted={false} label="True / Healthy" />
              <FormCard form={armor.corruptedForm} corrupted label="Corrupted Mark" />
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                <Hammer className="w-3.5 h-3.5" /> Forging Incantation
              </div>
              <p className="font-medieval text-sm text-amber-100/90 italic leading-relaxed">{armor.forgingIncantation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">Posture Mitigation</span>
                <p className="text-xs text-neutral-200 leading-relaxed">{armor.postureMitigation}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold block">Weight Synergy</span>
                <p className="text-xs text-neutral-200 leading-relaxed">{armor.weightSynergy}</p>
              </div>
            </div>

            {/* Deterministic test blow — preserved from the retired SymbolsView */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/25 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                <Gauge className="w-3.5 h-3.5" /> Deterministic Test Blow — {armor.weightClass} ({flatDR} Flat DR)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Raw Damage</span>
                  <input type="range" min={0} max={120} value={rawDamage} onChange={(e) => setRawDamage(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
                  <div className="font-mono text-sm text-neutral-100">{rawDamage}</div>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Posture Incoming</span>
                  <input type="range" min={0} max={100} value={incomingPosture} onChange={(e) => setIncomingPosture(Number(e.target.value))} className="w-full accent-rose-500 cursor-pointer" />
                  <div className="font-mono text-sm text-neutral-100">{incomingPosture}</div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/30">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Net Damage</div>
                  <div className="font-mono text-2xl font-bold text-amber-200">{(netDamage + "").padStart(2, "0")}</div>
                  <div className="text-[10px] font-mono text-neutral-500">Max(0, {rawDamage} − {flatDR})</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/30">
                  <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Posture Net</div>
                  <div className="font-mono text-2xl font-bold text-rose-200">{(postureAfter + "").padStart(2, "0")}</div>
                  <div className="text-[10px] font-mono text-neutral-500">×{POSTURE_MOD[armor.weightClass]} post-mitigation</div>
                </div>
              </div>
              <p className="text-[10px] font-mono text-neutral-500">
                Flower 02 law: attacks always connect. Net = Max(0, Raw − Flat DR) × Guard Modifier — no hidden dice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
