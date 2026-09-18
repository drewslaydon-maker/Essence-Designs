import { FC, useState } from "react";
import {
  Flame,
  ScrollText,
  BookOpen,
  Compass,
  Volume2,
  VolumeX,
  Tv,
  Layers,
  Cpu,
  Database,
  Milestone,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { GitSyncModal } from "./GitSyncModal";

interface NavEntry {
  id: string;
  label: string;
  icon: typeof Flame;
  badge?: string;
}

const NAV: NavEntry[] = [
  { id: "pantheon", label: "Pantheon", icon: Flame, badge: "5 Ascendants" },
  { id: "spokes", label: "Spokes", icon: Compass, badge: "15-Spoke" },
  { id: "heraldry", label: "Heraldry", icon: ScrollText, badge: "3 Families" },
  { id: "codex", label: "Codex", icon: BookOpen, badge: "Chronicles" },
  { id: "pillars", label: "Pillars", icon: Layers, badge: "Doctrine" },
  { id: "chamber", label: "Chamber", icon: Cpu, badge: "Unratified" },
];

export const Header: FC = () => {
  const { activeTab, setActiveTab, crtEnabled, setCrtEnabled, soundEnabled, setSoundEnabled, playSfx } = useAppStore();
  const [gitModalOpen, setGitModalOpen] = useState(false);

  const select = (id: string) => {
    setActiveTab(id);
    playSfx("click");
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 shadow-xl">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.5rem] gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => select("pantheon")}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-amber-600 via-neutral-900 to-black border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/40 cursor-pointer group hover:border-amber-400 transition-all shrink-0"
              aria-label="Adversity home"
            >
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl font-bold tracking-wider text-neutral-100 uppercase">
                  Adversity
                </span>
                <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold uppercase">
                  The Apparatus
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Canonical OSRS, Morrowind &amp; CRPG Systems Studio
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-neutral-300">FLOWER 08</span>
              <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/60 font-bold">
                REVOKED
              </span>
            </div>

            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSfx("anvil");
              }}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-amber-950/40 border-amber-600/50 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
              title="Toggle sound effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px] font-mono">SFX</span>
            </button>

            <button
              onClick={() => { setCrtEnabled((prev) => !prev); playSfx("click"); }}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                crtEnabled
                  ? "bg-amber-950/40 border-amber-600/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
              title="Toggle retro CRT scanline effect"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden md:inline text-[11px] font-mono">CRT</span>
            </button>

            <button
              onClick={() => { setGitModalOpen(true); playSfx("anvil"); }}
              className="p-2 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Push directly to the GitHub Truth Holder"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Git Sync</span>
            </button>
          </div>
        </div>

        {/* Flat Navigation — one bar, no dropdowns */}
        <nav className="md:hidden overflow-x-auto scrollbar-none border-t border-neutral-900">
          <div className="flex items-center gap-1 py-1.5 px-0.5">
            {NAV.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => select(tab.id)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-center flex items-center gap-1.5 transition-all cursor-pointer border ${
                    active
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold"
                      : "text-neutral-400 hover:text-neutral-200 bg-neutral-900/40 border-neutral-900/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] leading-tight font-mono">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <nav className="hidden md:flex items-center py-2.5 border-t border-neutral-900/90 text-xs">
          <div className="flex items-center gap-2 lg:gap-3 w-full">
            {NAV.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => select(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
                    active
                      ? "bg-neutral-800 text-amber-300 border-neutral-700 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] font-bold"
                      : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border-transparent shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-amber-400" : "text-neutral-500"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                      active ? "bg-amber-900/40 text-amber-200 border border-amber-500/30" : "bg-neutral-950 text-neutral-600 border border-neutral-800"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <GitSyncModal isOpen={gitModalOpen} onClose={() => setGitModalOpen(false)} />
    </header>
  );
};