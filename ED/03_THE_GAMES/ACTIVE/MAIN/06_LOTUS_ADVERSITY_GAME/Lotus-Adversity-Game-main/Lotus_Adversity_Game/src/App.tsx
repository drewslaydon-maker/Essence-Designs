import { useAppStore } from "./store/useAppStore";
import { Header } from "./components/Header";
import { PantheonView } from "./components/PantheonView";
import { SpokesView } from "./components/SpokesView";
import { HeraldryView } from "./components/HeraldryView";
import { CodexView } from "./components/CodexView";
import { PillarsView } from "./components/PillarsView";
import { ChamberView } from "./components/ChamberView";
import { Shield } from "lucide-react";

export default function App() {
  const { activeTab, crtEnabled } = useAppStore();

  return (
    <div className={`min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 ${crtEnabled ? "crt-overlay" : ""}`}>
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === "pantheon" && <PantheonView />}
        {activeTab === "spokes" && <SpokesView />}
        {activeTab === "heraldry" && <HeraldryView />}
        {activeTab === "codex" && <CodexView />}
        {activeTab === "pillars" && <PillarsView />}
        {activeTab === "chamber" && <ChamberView />}
      </main>

      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-sm py-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="font-cinzel font-bold text-neutral-200 tracking-wider">Adversity</span>
            <span>•</span>
            <span>The Apparatus v2</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="text-[11px] font-mono">Pillars I–IV</span>
            <span>•</span>
            <span className="text-[11px] font-mono">15-Spoke Matrix</span>
            <span>•</span>
            <span className="text-[11px] font-mono text-rose-400">FLOWER 08 REVOKED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}