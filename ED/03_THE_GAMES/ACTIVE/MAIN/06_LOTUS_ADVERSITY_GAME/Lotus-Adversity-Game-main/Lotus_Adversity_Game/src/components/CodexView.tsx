import { FC, useState } from "react";
import { LoreChronicle } from "../types";
import { initialLoreChronicles } from "../data/loreChroniclesData";
import { useAppStore } from "../store/useAppStore";
import { BookOpen, Copy, Check, Scroll } from "lucide-react";

const CATEGORIES = ["All", ...new Set(initialLoreChronicles.map((c) => c.category))];

export const CodexView: FC = () => {
  const { playSfx } = useAppStore();
  const [category, setCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chronicles = initialLoreChronicles.filter((c) => category === "All" || c.category === category);

  const copyChronicle = (chronicle: LoreChronicle) => {
    const text = `# ${chronicle.title}\n\nCategory: ${chronicle.category}\nContext: ${chronicle.historicalContext}\n\n${chronicle.content}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(chronicle.id);
    playSfx("scribe");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Scroll className="w-3.5 h-3.5" />
            <span>Oral Tradition • Inscribed Parchment</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wide text-neutral-100 uppercase">
            Storytelling Codex
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            The chronicles of Alderreach — how the five companions seized the 15 spokes, how each mortal virtue became
            an agonizing shell, and what the folk whisper in the shadow of the petrified center.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); playSfx("click"); }}
            className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              category === cat
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                : "bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {chronicles.map((chronicle) => (
          <article key={chronicle.id} className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 font-bold">{chronicle.category}</div>
                <h2 className="font-cinzel text-lg sm:text-2xl font-black text-neutral-100">{chronicle.title}</h2>
                <div className="text-[11px] font-mono text-neutral-500">{chronicle.historicalContext}</div>
                {chronicle.characters && chronicle.characters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {chronicle.characters.map((c) => (
                      <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">{c}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => copyChronicle(chronicle)}
                className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-amber-500/20 shrink-0"
              >
                {copiedId === chronicle.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === chronicle.id ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="prose-invert prose-sm text-neutral-200 leading-relaxed whitespace-pre-line text-sm sm:text-[15px]">
                {chronicle.content}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};