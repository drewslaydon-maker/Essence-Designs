import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Skull, Crown, BookOpen, Flame, Compass, HeartHandshake, Eye, Sun, Users, ArrowRight, Zap, Scroll } from 'lucide-react';
import { VIVEC_DUALITY_DATA } from '../data/loreData';

interface VivecDualityExplorerProps {
  onNavigate?: (view: 'vivec' | 'pantheon' | 'races' | 'artifacts' | 'morrowind' | 'oblivion' | 'sennecca' | 'deepLore' | 'codex') => void;
  onOpenEntity?: (id: string) => void;
}

export function VivecDualityExplorer({ onNavigate, onOpenEntity }: VivecDualityExplorerProps) {
  const [activeStance, setActiveStance] = useState<'synthesis' | 'god' | 'mortal'>('synthesis');
  const [selectedSermonIndex, setSelectedSermonIndex] = useState(0);

  const sermons = [
    {
      number: 'Sermon 1',
      title: 'The Mystery of the Middle Air',
      text: 'He was born of netchimen in the ashlands, but wore a face of gold and a face of night so that neither man nor spirit could claim him entirely. The secret is the lotus, which opens and closes. I am the letter that has not yet been spoken.',
      significance: 'Establishes Vivec\'s dual birth—a mortal child raised amidst common ashlanders who transcends through the holy syllable of paradox.'
    },
    {
      number: 'Sermon 12',
      title: 'The Syllable of Royalty (CHIM)',
      text: 'The secret syllable of royalty is CHIM. Which is the sound of the word that has no name. It is the fire that cannot be consumed, for he is the candle and the room and the darkness beyond. Look at the Wheel from the side, and behold the Tower of "I".',
      significance: 'The core metaphysical revelation of The Elder Scrolls: waking up inside the dream of the Godhead without dissolving into nothingness.'
    },
    {
      number: 'Sermon 36',
      title: 'The Hidden Acrostic ("FOUL MURDER")',
      text: 'Each sermon holds a glyph. When the first letter of each paragraph in the thirty-sixth sermon is taken together, they spell: "FOUL MURDER". Vivec confessed his greatest sin in the very scripture his priests forced the Dunmer to memorize.',
      significance: 'The ultimate proof of Vivec\'s mortal guilt: his godhood could not hide the truth of Nerevar\'s assassination at Red Mountain.'
    },
    {
      number: 'Sermon 37',
      title: 'The Second Walking Way',
      text: 'There is no right lesson learned alone. The world was born of a great betrayal, and so all gods must bleed to keep the sky from falling. Look upon the moonlet Baar Dau: it hangs by my breath, not my fist.',
      significance: 'Explains Baar Dau (the Ministry of Truth): Vivec holds the rogue celestial meteor in the air using only the conditional devotion and love of his people.'
    }
  ];

  return (
    <div className="space-y-8" id="vivec-duality-section">
      {/* Top Banner & Introduction */}
      <div className="relative overflow-hidden rounded-2xl border border-[#c8983e]/30 bg-gradient-to-b from-[#181920] to-[#0f1015] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#c8983e]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#3d4f7c]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              The Central Mystery of Resdayn
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f4efe6] tracking-wide">
              Lord Vivec: The God-Man Split
            </h1>
            <p className="mt-2 text-[#a8a398] max-w-2xl text-sm sm:text-base leading-relaxed">
              Warrior, poet, thief, god. Hovering in perpetual lotus meditation inside his High Fane palace, 
              Lord Vehk is the literal axis of mortal guilt and divine omnipotence.
            </p>
          </div>

          {/* Stance Selector Buttons */}
          <div className="flex bg-[#12131a] p-1.5 rounded-xl border border-[#2b2d38] w-full md:w-auto shadow-inner">
            <button
              onClick={() => setActiveStance('god')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStance === 'god'
                  ? 'bg-gradient-to-r from-[#d89a2b] to-[#eac368] text-[#121008] shadow-md'
                  : 'text-[#a8a398] hover:text-[#f4efe6] hover:bg-[#1a1c25]'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Divine Half</span>
            </button>

            <button
              onClick={() => setActiveStance('synthesis')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStance === 'synthesis'
                  ? 'bg-gradient-to-r from-[#7b6d48] to-[#4d5970] text-[#f8f5ee] shadow-md border border-[#c8983e]/40'
                  : 'text-[#a8a398] hover:text-[#f4efe6] hover:bg-[#1a1c25]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Sitting / Thinking</span>
            </button>

            <button
              onClick={() => setActiveStance('mortal')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStance === 'mortal'
                  ? 'bg-gradient-to-r from-[#4b5568] to-[#2d3748] text-[#e2e8f0] shadow-md'
                  : 'text-[#a8a398] hover:text-[#f4efe6] hover:bg-[#1a1c25]'
              }`}
            >
              <Skull className="w-4 h-4" />
              <span>Mortal Half</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Duality Canvas / Interactive Split Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left / Central Visualizer (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#2b2d38] bg-[#121319] p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Light splitting the card */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#334155]/20 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#d97706]/15 to-transparent pointer-events-none" />

          {/* Duality Graphic Display */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#252836]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#94a3b8]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
                Ashen Dunmer (Mortal)
              </div>
              <div className="text-xs font-serif text-[#c8983e] font-semibold">
                THE SITTING / THINKING LOTUS
              </div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#f59e0b]">
                Golden Chimer (Divine)
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              </div>
            </div>

            {/* Central Artistic Representation of the Split */}
            <div className="py-8 flex flex-col items-center justify-center relative">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-56 h-72 sm:w-64 sm:h-80 rounded-2xl relative flex overflow-hidden shadow-2xl border-2 border-[#524933]"
              >
                {/* Ashen Dunmer Half (Left) */}
                <div className={`w-1/2 h-full bg-gradient-to-br from-[#232733] via-[#1a1e29] to-[#0f1219] p-4 flex flex-col justify-between transition-opacity duration-500 ${
                  activeStance === 'god' ? 'opacity-40' : 'opacity-100'
                }`}>
                  <div className="text-[#94a3b8] text-xs font-mono">01. ASH</div>
                  <div className="space-y-2 text-center my-auto">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#334155]/40 border border-[#64748b]/40 flex items-center justify-center text-[#94a3b8]">
                      <Skull className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-serif font-bold text-[#cbd5e1]">Man / Mortal</div>
                    <p className="text-[11px] text-[#94a3b8] leading-tight">
                      Remembers the murder of Nerevar. Carries the weight of mortality.
                    </p>
                  </div>
                  <div className="text-[10px] text-[#64748b] text-center font-mono">Dunmer Blue</div>
                </div>

                {/* Glowing Seam Divider */}
                <div className="w-[3px] h-full bg-gradient-to-b from-[#eac368] via-[#f59e0b] to-[#c8983e] shadow-[0_0_12px_#eac368] z-20" />

                {/* Golden Chimer Half (Right) */}
                <div className={`w-1/2 h-full bg-gradient-to-bl from-[#452b07] via-[#2d1c05] to-[#1a1002] p-4 flex flex-col justify-between transition-opacity duration-500 ${
                  activeStance === 'mortal' ? 'opacity-40' : 'opacity-100'
                }`}>
                  <div className="text-[#f59e0b] text-xs font-mono text-right">GOLD .02</div>
                  <div className="space-y-2 text-center my-auto">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#d97706]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#fcd34d]">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-serif font-bold text-[#fef08a]">God / Divine</div>
                    <p className="text-[11px] text-[#e0b06b] leading-tight">
                      Sustains Baar Dau. Speaks in royal sermons. Knows CHIM.
                    </p>
                  </div>
                  <div className="text-[10px] text-[#d97706] text-center font-mono">Chimer Gold</div>
                </div>

                {/* Center Hovering Ring / Halo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 rounded-full border border-[#f59e0b]/30 animate-pulse" />
                </div>
              </motion.div>

              <div className="mt-4 text-center">
                <span className="text-xs font-serif italic text-[#c8983e]">
                  "He hovers above the floor, forever unmoving, his mind traveling across kalpas while his body watches Morrowind burn."
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Stance Breakdown */}
          <div className="mt-4 pt-4 border-t border-[#252836]">
            <AnimatePresence mode="wait">
              {activeStance === 'synthesis' && (
                <motion.div
                  key="synthesis-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#eac368] font-serif">
                    <Flame className="w-4 h-4 text-[#eac368]" />
                    {VIVEC_DUALITY_DATA.synthesis.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#c5c0b4] leading-relaxed">
                    {VIVEC_DUALITY_DATA.synthesis.description}
                  </p>
                </motion.div>
              )}

              {activeStance === 'god' && (
                <motion.div
                  key="god-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#fcd34d] font-serif">
                    <Crown className="w-4 h-4 text-[#fcd34d]" />
                    {VIVEC_DUALITY_DATA.godHalf.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {VIVEC_DUALITY_DATA.godHalf.historicalAct}
                  </p>
                  <div className="text-xs italic text-[#eac368]">
                    "{VIVEC_DUALITY_DATA.godHalf.quote}"
                  </div>
                </motion.div>
              )}

              {activeStance === 'mortal' && (
                <motion.div
                  key="mortal-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#cbd5e1] font-serif">
                    <Skull className="w-4 h-4 text-[#94a3b8]" />
                    {VIVEC_DUALITY_DATA.mortalHalf.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    {VIVEC_DUALITY_DATA.mortalHalf.historicalAct}
                  </p>
                  <div className="text-xs italic text-[#94a3b8]">
                    "{VIVEC_DUALITY_DATA.mortalHalf.quote}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Deep Metaphysical Pillars (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Box 1: The 'Sitting and Thinking' Doctrine */}
          <div className="rounded-xl border border-[#3b382d] bg-[#16171f] p-5 shadow-lg">
            <div className="flex items-center gap-2.5 text-[#eac368] font-serif font-bold text-base mb-2">
              <Eye className="w-4 h-4" />
              The "Sitting & Thinking" Posture
            </div>
            <p className="text-xs sm:text-sm text-[#a8a398] leading-relaxed">
              In Morrowind, players enter the Palace of Vivec expecting thunderous decrees, but find a solitary figure floating two feet in the air, legs folded in the lotus pose. 
              <br /><br />
              He is not resting. One half of his consciousness is holding up the atmosphere of Vvardenfell, shielding against Dagoth Ur's corprus storms. The other half is trapped inside human cognition—brooding over his sins, analyzing the mortal condition, and preparing for his own replacement by the Nerevarine.
            </p>
          </div>

          {/* Box 2: Baar Dau - The Floating Moonlet */}
          <div className="rounded-xl border border-[#2d3242] bg-[#141620] p-5 shadow-lg">
            <div className="flex items-center gap-2.5 text-[#93c5fd] font-serif font-bold text-base mb-2">
              <Compass className="w-4 h-4" />
              Baar Dau: The Hostage of Love
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Sheogorath hurled a celestial moonlet at Vivec City. Instead of vaporizing it, Vivec froze it in mid-air right above his citizens' heads.
              <br /><br />
              When asked why he didn't gently guide it to the sea, Vivec smiled: <span className="italic text-[#f4efe6]">"If my people cease to love me, I shall let it fall."</span> It stands as the ultimate symbol of his precarious divine bargain.
            </p>
          </div>

          {/* Box 3: CHIM & The Wheel */}
          <div className="rounded-xl border border-[#423a23] bg-[#191712] p-5 shadow-lg">
            <div className="flex items-center gap-2.5 text-[#f59e0b] font-serif font-bold text-base mb-2">
              <HeartHandshake className="w-4 h-4" />
              CHIM: The Kingly Syllable
            </div>
            <p className="text-xs sm:text-sm text-[#d4af37] leading-relaxed">
              Realizing that all of existence is merely the dream of the sleeping Godhead. A normal mind realizing this dissolves (Zero-Sums). Vivec possesses the supreme ego to state: <span className="font-bold">"I AM AND I ARE ALL WE."</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sermons of Vivec Interactive Reader */}
      <div className="rounded-2xl border border-[#2b2d38] bg-[#12131a] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252836]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#f4efe6]">The 36 Lessons of Vivec (Apocrypha)</h2>
              <p className="text-xs text-[#8c887e]">Sacred scriptures penned by Michael Kirkbride and Lord Vehk</p>
            </div>
          </div>

          {/* Sermon Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {sermons.map((sermon, idx) => (
              <button
                key={sermon.number}
                onClick={() => setSelectedSermonIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedSermonIndex === idx
                    ? 'bg-[#c8983e] text-[#121008] font-bold shadow'
                    : 'bg-[#1a1c25] text-[#9ca3af] hover:text-[#f4efe6] border border-[#2a2d3d]'
                }`}
              >
                {sermon.number}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sermon Content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c8983e]">
              {sermons[selectedSermonIndex].number} — {sermons[selectedSermonIndex].title}
            </span>
            <blockquote className="text-base sm:text-lg font-serif italic text-[#eae5dc] border-l-2 border-[#c8983e] pl-4 py-1 leading-relaxed">
              "{sermons[selectedSermonIndex].text}"
            </blockquote>
          </div>

          <div className="md:col-span-4 rounded-xl bg-[#171923] p-4 border border-[#252836] flex flex-col justify-center">
            <div className="text-xs font-mono uppercase text-[#94a3b8] mb-1">Metaphysical Meaning:</div>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              {sermons[selectedSermonIndex].significance}
            </p>
          </div>
        </div>
      </div>

      {/* Exploration Gateway Portals */}
      {onNavigate && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase font-bold text-[#c8983e] tracking-wider">
              Explore the Tamrielic Universe
            </h3>
            <span className="text-xs text-[#8c887e]">Key Pillars of the Lore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Gateway 1: Gods & Cosmology */}
            <button
              onClick={() => onNavigate && onNavigate('pantheon')}
              className="p-5 rounded-2xl border border-[#c8983e]/40 bg-gradient-to-br from-[#1a1712] to-[#12131d] text-left hover:border-[#c8983e] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#c8983e]/20 border border-[#c8983e]/40 flex items-center justify-center text-[#eac368] group-hover:scale-110 transition-transform">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-bold text-[#f8f5ee]">
                  The Gods & Moon Holes
                </h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  The sun as a rip into magic, moons as Lorkhan's corpse, and the defecation birth of Malacath.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#2a2720] flex items-center gap-1 text-xs font-mono text-[#eac368]">
                <span>Read God Myths</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Gateway 2: Divine Artifacts & Relics */}
            <button
              onClick={() => onNavigate && onNavigate('artifacts')}
              className="p-5 rounded-2xl border border-[#a855f7]/40 bg-gradient-to-br from-[#1b1329] to-[#12131d] text-left hover:border-[#a855f7] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-bold text-[#f8f5ee]">
                  Artifacts of Power
                </h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Azura's Star, Wabbajack, Skeleton Key, Volendrung, and why Elder Scrolls lore is unbroken physical canon.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#2c203d] flex items-center gap-1 text-xs font-mono text-[#d8b4fe]">
                <span>Inspect Relics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Gateway 3: Sennecca's Spellblade Grimoire */}
            <button
              onClick={() => onNavigate && onNavigate('sennecca')}
              className="p-5 rounded-2xl border border-[#38bdf8]/40 bg-gradient-to-br from-[#0c2340] to-[#0f172a] text-left hover:border-[#38bdf8] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#0284c7]/40 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-[#38bdf8]" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-serif font-bold text-[#f0f9ff]">
                    Sennecca’s Grimoire
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0369a1] text-[#e0f2fe]">
                    Level 1 Build
                  </span>
                </div>
                <p className="text-xs text-[#93c5fd] leading-relaxed">
                  Tailor-made survival cheat sheet: Atronach mana fuel, Kvatch to Cloud Ruler, and the Arena roadmap.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#1e3a5f] flex items-center gap-1 text-xs font-mono text-[#7dd3fc]">
                <span>Open Spellblade Sheet</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Gateway 4: Races of Tamriel */}
            <button
              onClick={() => onNavigate && onNavigate('races')}
              className="p-5 rounded-2xl border border-[#10b981]/40 bg-gradient-to-br from-[#131c18] to-[#11131c] text-left hover:border-[#10b981] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#6ee7b7] group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-bold text-[#f8f5ee]">
                  The Races of Tamriel
                </h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  17 moon breeds of Khajiit, Green Pact cannibals, and atom-splitting Redguards.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#1c2a23] flex items-center gap-1 text-xs font-mono text-[#6ee7b7]">
                <span>Explore Mortal Races</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Gateway 5: Morrowind Chronicle */}
            <button
              onClick={() => onNavigate && onNavigate('morrowind')}
              className="p-5 rounded-2xl border border-[#eab308]/40 bg-gradient-to-br from-[#1c1a10] to-[#12131c] text-left hover:border-[#eab308] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#eab308]/20 border border-[#eab308]/40 flex items-center justify-center text-[#fef08a] group-hover:scale-110 transition-transform">
                  <Scroll className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-bold text-[#f8f5ee]">
                  The Morrowind Story
                </h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  In-order chronological story of Morrowind, unbinding the Heart and the truth behind Cyrodiil rumors.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#292518] flex items-center gap-1 text-xs font-mono text-[#fef08a]">
                <span>Read Her Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Gateway 6: Cyrodiil & Imperial City Bridge */}
            <button
              onClick={() => onNavigate && onNavigate('oblivion')}
              className="p-5 rounded-2xl border border-[#3b82f6]/40 bg-gradient-to-br from-[#111624] to-[#0e1017] text-left hover:border-[#3b82f6] hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#93c5fd] group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-bold text-[#f8f5ee]">
                  Imperial City Guide
                </h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  From pawning candlesticks in the Market District to uncovering the secrets of White-Gold Tower.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#1a233a] flex items-center gap-1 text-xs font-mono text-[#93c5fd]">
                <span>Open Wife's Bridge</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
