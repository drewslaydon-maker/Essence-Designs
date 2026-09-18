import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Cpu, BookOpen, Compass, Flame, AlertOctagon, Sparkles } from 'lucide-react';

interface KirkbrideDeepLoreProps {
  onOpenEntity?: (id: string) => void;
}

export function KirkbrideDeepLore({ onOpenEntity }: KirkbrideDeepLoreProps) {
  const [activeSection, setActiveSection] = useState<'pelinal' | 'walkingWays' | 'towers' | 'godhead'>('pelinal');

  return (
    <div className="space-y-8" id="deep-lore-section">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#c2410c]/30 bg-gradient-to-r from-[#1c120c] via-[#14100e] to-[#1a120c] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#ea580c]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#ea580c]/20 text-[#fb923c] border border-[#ea580c]/40 mb-3">
              <Zap className="w-3.5 h-3.5" />
              Kirkbride Metaphysics & Deep Canon
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f4efe6] tracking-wide">
              Pelinal the Star-Made & The Deep Lore
            </h1>
            <p className="mt-2 text-[#a8a29e] max-w-2xl text-sm sm:text-base leading-relaxed">
              From the laser-handed cyborg knight screaming future emperors' names to the Six Walking Ways 
              and the metaphysical Towers anchoring the Godhead's dream.
            </p>
          </div>

          {/* Section Navigation Buttons */}
          <div className="flex flex-wrap bg-[#120f0d] p-1.5 rounded-xl border border-[#2e231d] w-full md:w-auto">
            <button
              onClick={() => setActiveSection('pelinal')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'pelinal'
                  ? 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white shadow'
                  : 'text-[#a8a29e] hover:text-[#fafaf9] hover:bg-[#1f1915]'
              }`}
            >
              Pelinal the Cyborg
            </button>
            <button
              onClick={() => setActiveSection('walkingWays')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'walkingWays'
                  ? 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white shadow'
                  : 'text-[#a8a29e] hover:text-[#fafaf9] hover:bg-[#1f1915]'
              }`}
            >
              The 6 Walking Ways
            </button>
            <button
              onClick={() => setActiveSection('towers')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'towers'
                  ? 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white shadow'
                  : 'text-[#a8a29e] hover:text-[#fafaf9] hover:bg-[#1f1915]'
              }`}
            >
              Towers of Nirn
            </button>
            <button
              onClick={() => setActiveSection('godhead')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'godhead'
                  ? 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white shadow'
                  : 'text-[#a8a29e] hover:text-[#fafaf9] hover:bg-[#1f1915]'
              }`}
            >
              Godhead & Kalpas
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: PELINAL WHITESTRAKE CYBORG DEEP DIVE */}
      {activeSection === 'pelinal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Pelinal Profile (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-[#3e2719] bg-[#140e0a] p-6 sm:p-7 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#2b1c13]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ea580c]/20 text-[#fb923c] border border-[#ea580c]/30">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#fafaf9]">
                      Pelinal Whitestrake: The Time-Traveling Ada
                    </h2>
                    <p className="text-xs text-[#ea580c] font-mono">FIRST ERA ~1E 242 // TERMINATOR OF CYRODIIL</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#241710] text-[#fb923c] border border-[#3d271c]">
                  Canonized in ESO
                </span>
              </div>

              <p className="text-sm text-[#d6d3d1] leading-relaxed">
                Authored by Michael Kirkbride in <em>The Song of Pelinal</em>, Pelinal was Saint Alessia's unstoppable champion 
                during the human slave rebellion against the elven Ayleid overlords. But beneath the heroic chivalric exterior 
                lies the most fascinating text in Elder Scrolls history: evidence that Pelinal was an artificial, time-displaced 
                divine cyborg sent backward from the Ninth Era to preserve mankind.
              </p>

              {/* 4 Pillars of the Cyborg Theory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#1c130d] p-4 border border-[#362115] space-y-2">
                  <div className="text-xs font-mono uppercase text-[#fb923c] font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    1. The "Killing Light" Left Hand
                  </div>
                  <p className="text-xs text-[#a8a29e] leading-relaxed">
                    The Song of Pelinal specifically records that his left arm was not made of flesh, but of a strange 
                    <em>"killing light"</em> that could atomize elven warlords from a distance—described by Kirkbride as a plasma/laser beam weapon.
                  </p>
                </div>

                <div className="rounded-xl bg-[#1c130d] p-4 border border-[#362115] space-y-2">
                  <div className="text-xs font-mono uppercase text-[#fb923c] font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    2. Diamond Chest Cavity
                  </div>
                  <p className="text-xs text-[#a8a29e] leading-relaxed">
                    Instead of a biological heartbeat, Pelinal had a cavity in his chest holding a red crystalline jewel 
                    (the Chim-el Adabal / Red Diamond), acting as his core power capacitor.
                  </p>
                </div>

                <div className="rounded-xl bg-[#1c130d] p-4 border border-[#362115] space-y-2">
                  <div className="text-xs font-mono uppercase text-[#fb923c] font-bold flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" />
                    3. Screaming Reman's Name
                  </div>
                  <p className="text-xs text-[#a8a29e] leading-relaxed">
                    In 1E 242, while drenched in Ayleid blood, Pelinal shouted: <span className="text-[#fafaf9] italic">"O Reman!"</span> 
                    Emperor Reman Cyrodiil was not born until 1E 2703—over <strong>2,460 years</strong> later! Pelinal had memory banks from the far future.
                  </p>
                </div>

                <div className="rounded-xl bg-[#1c130d] p-4 border border-[#362115] space-y-2">
                  <div className="text-xs font-mono uppercase text-[#fb923c] font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    4. The Teratomorphic Madness
                  </div>
                  <p className="text-xs text-[#a8a29e] leading-relaxed">
                    When his lover Huna was killed, Pelinal entered a berserk feedback loop so violent that he literally deleted geographical landforms into non-existence ("the Void").
                  </p>
                </div>
              </div>
            </div>

            {/* Right: ESO Canonization & In-Game Oblivion Links (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-[#2d221b] bg-[#17110d] p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-[#fb923c] font-serif font-bold text-base">
                  <Shield className="w-4 h-4" />
                  How ESO Fully Canonized the Myth
                </div>
                <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed">
                  For years, some dismissed the cyborg aspects as mere poetry. But in <em>The Elder Scrolls Online</em>, 
                  ZeniMax Online Studios brought Pelinal directly into modern canon:
                </p>
                <ul className="text-xs text-[#d6d3d1] space-y-2 pl-4 list-disc marker:text-[#ea580c]">
                  <li>
                    <strong>Whitestrake's Mayhem (Midyear Mayhem):</strong> An annual holiday where PvP warriors earn the "Star-Made Knight" title and Pelinal's Boon Boxes.
                  </li>
                  <li>
                    <strong>Pelinal's Aptitude Armor Set:</strong> An iconic gear set referencing his hybrid mechanical resilience.
                  </li>
                  <li>
                    <strong>Ghost of Pelinal Dialogue:</strong> Spirits in Cyrodiil whisper of the holy crusader who arrived like a comet with metal limbs.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#3b2b1b] bg-[#1a140f] p-5 shadow-lg space-y-2">
                <div className="text-xs font-mono text-[#fb923c] uppercase">Connecting to Oblivion:</div>
                <div className="text-sm font-serif font-bold text-[#fafaf9]">The Knights of the Nine DLC</div>
                <p className="text-xs text-[#a8a29e] leading-relaxed">
                  In Oblivion, you literally complete the pilgrimage to reassemble the <strong>Relics of the Crusader</strong>—the exact helm, cuirass, sword, and shield worn by Pelinal himself! When you defeat Umaril the Unfeathered, you are fulfilling the vow Pelinal made when the Ayleid kings cut his body into eight pieces.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: THE SIX WALKING WAYS */}
      {activeSection === 'walkingWays' && (
        <div className="rounded-2xl border border-[#3e2719] bg-[#140e0a] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-[#fafaf9]">
              The Six Walking Ways to Godhood
            </h2>
            <p className="text-sm text-[#a8a29e] mt-1">
              Outlined in the 36 Lessons of Vivec: the six metaphysical methods mortals can utilize to escape mortality and ascend to godhood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: 'Way I: Proving',
                name: 'The Proving by Trial',
                desc: 'Overcoming divine trials and conquering death through raw will and existential struggle.'
              },
              {
                num: 'Way II: The Heart Tonal Tapping',
                name: 'Tonal Manipulation',
                desc: 'Harnessing Kagrenac\'s tools upon the Heart of Lorkhan to siphon the primordial divine frequency (as the Tribunal did).'
              },
              {
                num: 'Way III: Mantling',
                name: 'Walk Like Them Until They Walk Like You',
                desc: 'Imitating a divine entity so completely and reenacting their mythic archetype until the cosmos cannot distinguish between you.'
              },
              {
                num: 'Way IV: The Enantiomorph',
                name: 'The King-Rebel Reenactment',
                desc: 'Stepping into the cosmic triad of King, Rebel, and Blinded Observer to trigger a divine combustion of identity (Talos).'
              },
              {
                num: 'Way V: CHIM',
                name: 'The Royal Syllable',
                desc: 'Awakening within the Godhead\'s dream and proclaiming "I AM" despite realizing you are merely a figment.'
              },
              {
                num: 'Way VI: The Scarab / Amaranth',
                name: 'The New Dreamer',
                desc: 'Escaping the current Godhead\'s dream entirely to become the dreamer of an entirely new cosmos.'
              }
            ].map((way) => (
              <div key={way.num} className="rounded-xl bg-[#1c130d] p-5 border border-[#362115] space-y-2">
                <div className="text-xs font-mono text-[#ea580c] font-bold">{way.num}</div>
                <div className="text-sm font-serif font-bold text-[#fafaf9]">{way.name}</div>
                <p className="text-xs text-[#a8a29e] leading-relaxed">{way.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: THE TOWERS OF NIRN */}
      {activeSection === 'towers' && (
        <div className="rounded-2xl border border-[#3e2719] bg-[#140e0a] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-[#fafaf9]">
              The Towers: Spikes Driven into Reality
            </h2>
            <p className="text-sm text-[#a8a29e] mt-1">
              Mundus was created unstable. To prevent the world from drifting back into the formless Dawn Era, 
              the gods and ancient elves built metaphysical Towers powered by sacred Stones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'White-Gold Tower (Cyrodiil)',
                builder: 'Ancient Ayleid Elves',
                stone: 'The Chim-el Adabal (Amulet of Kings)',
                status: 'Under direct siege during Oblivion Crisis!',
                desc: 'The center of Cyrodiil and the Wheel. Built to dominate all reality around Lake Rumare.'
              },
              {
                name: 'Red Mountain (Vvardenfell)',
                builder: 'Formed when Lorkhan\'s Heart fell',
                stone: 'The Heart of Lorkhan',
                status: 'Unbound in 3E 427 by the Nerevarine',
                desc: 'The original primordial tower of the east, where Vivec, Sotha Sil, and Almalexia attained godhood.'
              },
              {
                name: 'Ada-Mantia (Direnni Tower, High Rock)',
                builder: 'Auri-El / The Aedra',
                stone: 'The Zero Stone (Convention)',
                status: 'Still standing in the Iliac Bay',
                desc: 'The oldest structure on Tamriel. The spaceship-like spire where the gods held the trial of Lorkhan.'
              },
              {
                name: 'Walk-Brass (The Numidium)',
                builder: 'Dwemer Chief Architect Kagrenac',
                stone: 'The Mantella / Heart of Lorkhan',
                status: 'Shattered and dispersed',
                desc: 'A mobile, robotic Tower designed by the vanished Dwemer to shout "NO" to existence itself.'
              }
            ].map((tower) => (
              <div key={tower.name} className="rounded-xl bg-[#1c130d] p-5 border border-[#362115] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif font-bold text-[#fafaf9]">{tower.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a1a11] text-[#fb923c] border border-[#3d271c]">
                    {tower.stone}
                  </span>
                </div>
                <div className="text-xs text-[#ea580c] font-medium">Built by: {tower.builder}</div>
                <p className="text-xs text-[#a8a29e] leading-relaxed">{tower.desc}</p>
                <div className="text-[11px] text-[#fb923c] italic font-mono pt-1">Status: {tower.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: GODHEAD & KALPAS */}
      {activeSection === 'godhead' && (
        <div className="rounded-2xl border border-[#3e2719] bg-[#140e0a] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-[#fafaf9]">
              The Godhead, Anu, Padomay & Kalpas
            </h2>
            <p className="text-sm text-[#a8a29e] mt-1">
              Before Tamriel, before time, there is only the Dream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#1c130d] p-5 border border-[#362115] space-y-2">
              <div className="text-xs font-mono text-[#fb923c] font-bold">1. The Godhead</div>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                An infinite cosmic entity in a state of eternal slumber. All stars, planets, mortals, Daedra, and gods 
                are simply dreams floating in the Godhead's subconscious mind.
              </p>
            </div>

            <div className="rounded-xl bg-[#1c130d] p-5 border border-[#362115] space-y-2">
              <div className="text-xs font-mono text-[#fb923c] font-bold">2. Anu & Padomay</div>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                The primordial primal forces: Anu represents absolute Stasis, Order, and "IS". 
                Padomay represents absolute Chaos, Change, and "IS NOT". Their collision sparked the Aurbis.
              </p>
            </div>

            <div className="rounded-xl bg-[#1c130d] p-5 border border-[#362115] space-y-2">
              <div className="text-xs font-mono text-[#fb923c] font-bold">3. Kalpas & Alduin</div>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                Reality does not last forever. It runs in cycles called Kalpas. When a world cycle grows corrupt, 
                Alduin the World-Eater wakes to devour it, clearing the slate for the next iteration of mortals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
