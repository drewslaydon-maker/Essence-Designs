import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  Zap, 
  Search, 
  Flame, 
  Shield, 
  Crown,
  Heart,
  ExternalLink,
  ChevronRight,
  Scroll,
  Sun,
  Users
} from 'lucide-react';
import { VivecDualityExplorer } from './components/VivecDualityExplorer';
import { PantheonAndCosmology } from './components/PantheonAndCosmology';
import { RacesOfTamriel } from './components/RacesOfTamriel';
import { ArtifactsOfPower } from './components/ArtifactsOfPower';
import { OblivionBridge } from './components/OblivionBridge';
import { MorrowindChronicle } from './components/MorrowindChronicle';
import { KirkbrideDeepLore } from './components/KirkbrideDeepLore';
import { CodexBrowser } from './components/CodexBrowser';
import { AudioAtmosphere } from './components/AudioAtmosphere';
import { InterconnectedDossierModal } from './components/InterconnectedDossierModal';
import { SenneccaGrimoire } from './components/SenneccaGrimoire';

type ActiveView = 'vivec' | 'pantheon' | 'artifacts' | 'races' | 'morrowind' | 'oblivion' | 'sennecca' | 'deepLore' | 'codex';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('vivec');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#e3ded4] flex flex-col selection:bg-[#c8983e]/30 selection:text-[#f8f5ee]">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#212330] bg-[#0d0e15]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setCurrentView('vivec')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3a2510] via-[#c8983e] to-[#475569] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-[#12131b] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#eac368]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg sm:text-xl tracking-wider text-[#f4efe6]">
                    ELDER SCROLLS
                  </span>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40 hidden sm:inline">
                    CODEX
                  </span>
                </div>
                <p className="text-xs text-[#8c887e] font-sans -mt-0.5">
                  Vehk's Archive: Gods, Mortals & The Dream
                </p>
              </div>
            </div>

            {/* Ambient Sound Player */}
            <div className="hidden md:flex items-center gap-3">
              <AudioAtmosphere />
            </div>
          </div>

          {/* Tab Navigation Navigation Bar */}
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-[#1a1c27] pt-2">
            <button
              onClick={() => setCurrentView('vivec')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'vivec'
                  ? 'bg-gradient-to-r from-[#c8983e]/20 to-[#475569]/20 border border-[#c8983e] text-[#f4efe6] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Crown className="w-4 h-4 text-[#eac368]" />
              <span>Lord Vivec</span>
            </button>

            <button
              onClick={() => setCurrentView('pantheon')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'pantheon'
                  ? 'bg-[#c8983e]/25 border border-[#eac368] text-[#fef08a] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Sun className="w-4 h-4 text-[#eac368]" />
              <span>Pantheon & Moons</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#c8983e]/30 text-[#fef08a]">
                Cosmology
              </span>
            </button>

            <button
              onClick={() => setCurrentView('artifacts')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'artifacts'
                  ? 'bg-[#a855f7]/25 border border-[#a855f7] text-[#d8b4fe] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#c084fc]" />
              <span>Artifacts of Power</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#a855f7]/30 text-[#e9d5ff]">
                Relics
              </span>
            </button>

            <button
              onClick={() => setCurrentView('races')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'races'
                  ? 'bg-[#10b981]/25 border border-[#10b981] text-[#6ee7b7] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Users className="w-4 h-4 text-[#34d399]" />
              <span>Races of Tamriel</span>
            </button>

            <button
              onClick={() => setCurrentView('morrowind')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'morrowind'
                  ? 'bg-[#c8983e]/25 border border-[#eac368] text-[#fef08a] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Scroll className="w-4 h-4 text-[#eac368]" />
              <span>The Morrowind Story</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#c8983e]/30 text-[#fef08a]">
                For You
              </span>
            </button>

            <button
              onClick={() => setCurrentView('oblivion')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'oblivion'
                  ? 'bg-[#3b82f6]/20 border border-[#3b82f6] text-[#93c5fd] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#60a5fa]" />
              <span>Cyrodiil & Imperial City</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#3b82f6]/30 text-[#bfdbfe]">
                Wife's Bridge
              </span>
            </button>

            <button
              onClick={() => setCurrentView('sennecca')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'sennecca'
                  ? 'bg-gradient-to-r from-[#2563eb]/25 to-[#3b82f6]/25 border border-[#38bdf8] text-[#e0f2fe] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span>Sennecca’s Grimoire</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#0369a1]/40 text-[#bae6fd]">
                Spellblade
              </span>
            </button>

            <button
              onClick={() => setCurrentView('deepLore')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'deepLore'
                  ? 'bg-[#ea580c]/20 border border-[#ea580c] text-[#fb923c] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#fb923c]" />
              <span>Pelinal & Metaphysics</span>
            </button>

            <button
              onClick={() => setCurrentView('codex')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                currentView === 'codex'
                  ? 'bg-[#10b981]/20 border border-[#10b981] text-[#6ee7b7] shadow-sm'
                  : 'text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#161824]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#34d399]" />
              <span>Master Codex</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'vivec' && (
            <motion.div
              key="vivec-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <VivecDualityExplorer 
                onNavigate={(view) => setCurrentView(view)} 
                onOpenEntity={(id) => setSelectedEntityId(id)} 
              />
            </motion.div>
          )}

          {currentView === 'pantheon' && (
            <motion.div
              key="pantheon-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <PantheonAndCosmology onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'artifacts' && (
            <motion.div
              key="artifacts-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ArtifactsOfPower onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'races' && (
            <motion.div
              key="races-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <RacesOfTamriel onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'morrowind' && (
            <motion.div
              key="morrowind-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <MorrowindChronicle onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'oblivion' && (
            <motion.div
              key="oblivion-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <OblivionBridge onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'sennecca' && (
            <motion.div
              key="sennecca-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SenneccaGrimoire onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'deepLore' && (
            <motion.div
              key="deepLore-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <KirkbrideDeepLore onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}

          {currentView === 'codex' && (
            <motion.div
              key="codex-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CodexBrowser onOpenEntity={(id) => setSelectedEntityId(id)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Interconnected Dossier Modal */}
      <InterconnectedDossierModal
        entityId={selectedEntityId}
        onClose={() => setSelectedEntityId(null)}
        onSelectEntity={(id) => setSelectedEntityId(id)}
        onNavigateToView={(view) => {
          setCurrentView(view);
          setSelectedEntityId(null);
        }}
      />

      {/* Atmospheric Footer */}
      <footer className="border-t border-[#1d1f2b] bg-[#0a0b10] py-8 text-center text-xs text-[#716e66]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-serif text-[#c8983e]">
            <span>"I AM AND I ARE ALL WE"</span>
            <span>•</span>
            <span>THE SECRET SYLLABLE OF ROYALTY IS CHIM</span>
          </div>
          <p>
            Crafted for 15-year veteran lore scholars and fresh Imperial City adventurers alike.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-[#56534d]">
            <span>Morrowind 3E 427</span>
            <span>•</span>
            <span>Oblivion 3E 433</span>
            <span>•</span>
            <span>White-Gold & Red Mountain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
