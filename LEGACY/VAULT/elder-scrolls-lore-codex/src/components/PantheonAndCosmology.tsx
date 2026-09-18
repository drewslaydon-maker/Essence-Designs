import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Flame, 
  Skull, 
  Crown, 
  ShieldAlert, 
  BookOpen, 
  Eye, 
  Zap, 
  Heart, 
  Compass, 
  HelpCircle,
  Clock,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';

interface GodStory {
  title: string;
  god: string;
  badge: string;
  icon: string;
  summary: string;
  narrative: string;
  oblivionConnection: string;
  weirdnessRating: number;
}

interface DeityProfile {
  id: string;
  name: string;
  title: string;
  pantheon: 'Aedra (The Divines)' | 'Daedric Princes' | 'The Missing God';
  sphere: string;
  cosmicNature: string;
  keyMyth: string;
  wifeNote: string;
  artifact: string;
}

interface PantheonAndCosmologyProps {
  onOpenEntity?: (id: string) => void;
}

export function PantheonAndCosmology({ onOpenEntity }: PantheonAndCosmologyProps) {
  const [activeTab, setActiveTab] = useState<'cosmology' | 'stories' | 'deities'>('cosmology');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [selectedDeityId, setSelectedDeityId] = useState<string>('lorkhan');

  const cosmicTruths = [
    {
      id: 'sun',
      name: 'The Sun (Magnus)',
      truth: 'NOT a burning ball of gas. A literal gaping tear in reality into pure magic.',
      icon: Sun,
      color: '#eab308',
      explanation: `When the gods were constructing Nirn, the architect god **Magnus** realized that the mortal realm was a trap draining their divine essence. Horrified, he ripped a massive hole through the firmament of the universe and fled back into the immortal realm of **Aetherius**.\n\nThe Sun is that physical rip in the fabric of space. The blinding light and warmth pouring through it is raw, unrefined **magicka**. In the Elder Scrolls universe, magic is literally the celestial light leaking through the puncture wound left by Magnus fleeing creation!`,
      inGameFact: 'When your wife casts a basic spell in Oblivion, her magicka bar recharges because she is absorbing ambient light leaking through the hole torn by Magnus!'
    },
    {
      id: 'stars',
      name: 'The Stars (The Magna Ge)',
      truth: 'Pinhole punctures torn by the lesser gods who followed Magnus out of reality.',
      icon: Sparkles,
      color: '#38bdf8',
      explanation: `When Magnus tore the great tear of the Sun, thousands of smaller spirits and lesser gods—known as the **Magna Ge** (the Star-Orphans)—panicked and fled after him. Each one punched their own smaller hole through the firmament as they escaped into Aetherius.\n\nThe stars you see in the Cyrodiil night sky are these puncture wounds. Because different Magna Ge possessed different colors and spiritual resonances, the magicka filtering down through their pinholes forms the magical constellations (The Warrior, The Mage, The Thief, The Serpent). Astrological birthsigns are literal radiation filters from outer divine dimensions!`,
      inGameFact: 'The birthsign your wife chose for her character at the start of Oblivion (e.g., The Lady, The Thief) is the literal astrological frequency filtering through those specific divine escape holes!'
    },
    {
      id: 'moons',
      name: 'The Moons (Masser & Secunda)',
      truth: 'The literal rotting, bisected halves of Lorkhan\'s divine corpse.',
      icon: Moon,
      color: '#f43f5e',
      explanation: `The twin moons of Nirn are not rocky orbital bodies formed by cosmic accretion. When the original gods convened at the Adamantine Tower to judge **Lorkhan** for tricking them into mortality, **Trinimac** tore out his heart and Auriel shot it across the ocean with a bow.\n\nLorkhan\'s physical body was severed into two pieces and flung into the heavens to orbit his creation as an eternal reminder. Masser and Secunda are the literal halves of Lorkhan\'s rotting divine flesh. The Khajiit view the moons through the "Lunar Lattice", while high scholars know they serve as cosmic filters shielding Nirn from the total madness of the outer void.`,
      inGameFact: 'Whenever your wife looks up at the two gorgeous glowing moons over the Imperial City palace at night, she is literally gazing upon the celestial remains of the creator god!'
    },
    {
      id: 'planets',
      name: 'The Planets',
      truth: 'Infinite, timeless divine dimensions that look round only because human eyes can\'t process infinity.',
      icon: Layers,
      color: '#a855f7',
      explanation: `In Elder Scrolls cosmology, the other planets visible in the night sky (Akatosh, Arkay, Mara, Zenithar, etc.) are NOT spheres of dirt floating in a vacuum. Each planet is the **infinite divine plane of an Aedric God**.\n\nBecause mortal minds and mortal optics cannot perceive an infinite three-dimensional plane that stretches across eternity, the mortal brain suffers a cognitive compression error: the human optical nerve wraps the infinite plane into a glowing, round orb. When you look at the planet Akatosh through a telescope, you are staring into an endless plane of crystallized golden time compressed by your own biological limitations.`,
      inGameFact: 'The Orrery in the Imperial City Arcane University tracks these celestial gods as they align to broadcast divine energy across Tamriel.'
    },
    {
      id: 'heart',
      name: 'The Heart of Lorkhan',
      truth: 'The divine cornerstone of physical reality. It cannot be destroyed without destroying Nirn.',
      icon: Heart,
      color: '#ef4444',
      explanation: `When Trinimac and Auriel ripped Lorkhan\'s heart out at the Convention, they attempted to destroy it with their weapons. But the Heart laughed at them: *"This Heart is the heart of the world, for one was made to satisfy the other."*\n\nRealizing that destroying the Heart would unravel the very reality they had sacrificed their immortality to build, Auriel fastened it to an arrow and shot it into the ocean. Where it landed, the volcano **Red Mountain** erupted from the sea floor around it. The Dwemer built brass tools to tap it, the Tribunal stole its power to become gods, and your character in Morrowind unbinds its enchantments so no tyrant can ever misuse its divinity again.`,
      inGameFact: 'The entire plot of Morrowind, the creation of the Tribunal, the death of the Dwemer, and the divinity of Vivec all stem from this single unkillable stone heart!'
    }
  ];

  const wildGodStories: GodStory[] = [
    {
      title: 'The Defecation of Trinimac & The Birth of Malacath',
      god: 'Boethiah & Malacath (Trinimac)',
      badge: 'The Wildest Canon Myth',
      icon: '💩',
      summary: 'How the greatest elven champion god was swallowed whole by Boethiah, digested, and literally excreted out as the Daedric Prince of Pariahs—transforming his followers into Orcs!',
      narrative: `In the Dawn Era, **Trinimac** was the golden paragon of the Aldmer—the mightiest warrior god in the cosmos who personally ripped out Lorkhan's heart. When the prophet Veloth attempted to lead his followers (the Chimer) away from Summerset, Trinimac blocked their passage and condemned them as heretics.\n\n**Boethiah**, the Daedric Prince of Deceit, Ambush, and Treason, stepped forth to challenge him. Boethiah ambushed Trinimac, bested him, and **swallowed him whole into her divine belly**. \n\nWhile Trinimac was trapped inside her guts, Boethiah stood before the stunned elven army and began speaking in Trinimac's own stolen voice—mocking his ideals of purity and exposing his flaws. Then, in the ultimate act of divine humiliation, **Boethiah defecated Trinimac out upon the ground**.\n\nThe corrupted, digested, ashen husk that crawled out of the dung heap was no longer the golden knight Trinimac. He was transformed into **Malacath**, the Daedric Prince of the Spurned, the Ostracized, and the Outcast. \n\nHis devoted elven followers, horrified by what had happened to their god, rubbed his excreted ash over their own skin in desperate loyalty. Their skin turned green, their teeth grew into boar tusks, and their bodies swelled with raw muscle. They became the **Orsimer (the Pariah Folk)—the Orcs**!`,
      oblivionConnection: 'Every single Orc your wife meets in the Imperial City or fights in bandit camps was born from the digested followers of Trinimac! In Oblivion, Malacath\'s shrine quest has him asking you to free enslaved ogres because he loves the downtrodden.',
      weirdnessRating: 5
    },
    {
      title: 'The 1,008-Year Dragon Break (The Dance on White-Gold)',
      god: 'Akatosh (The Dragon of Time)',
      badge: 'Temporal Apocalypse',
      icon: '⏳',
      summary: 'Fanatical human priests climbed the White-Gold Tower and danced for centuries to "purify" Akatosh from his elven aspects, snapping time into thousands of parallel paradoxical years!',
      narrative: `In the First Era, an ultra-puritanical human religious sect called the **Marukhati Selectives** could not stomach the fact that their beloved Imperial Dragon God of Time, **Akatosh**, shared a divine identity with the Elven god **Auri-El**. They believed humans should not worship a deity contaminated by elven essence.\n\nTheir solution? To climb to the pinnacle of the **White-Gold Tower** in the Imperial City and perform a bizarre, reality-altering rhythmic dance that lasted for decades, attempting to surgically excise the "elven traits" from the cosmic concept of Time itself.\n\nThey succeeded—by literally **snapping the Dragon of Time in half**! The timeline broke for **one thousand and eight years** (the Middle Dawn Dragon Break). During this millennium, cause and effect dissolved. Night and day occurred at the same time; sons were born decades before their own grandfathers; soldiers fought battles that concluded before they were begun; and Tamriel existed in eighteen simultaneous contradictory realities until the pieces finally snapped back together.`,
      oblivionConnection: 'Your wife is walking right around the base of the White-Gold Tower where this cosmic dance broke reality! Books in the Imperial City mages guild debate whether the Selectives were lunatics or cosmic surgeons.',
      weirdnessRating: 5
    },
    {
      title: 'Sheogorath\'s Invention of Music (The Ribcage Harp)',
      god: 'Sheogorath (The Madgod)',
      badge: 'Dark Whimsy',
      icon: '🎻',
      summary: 'Before Sheogorath, the mortal races only knew noise. The Madgod ripped the entrails and tendons from a living woman to invent the first stringed musical instruments.',
      narrative: `In ancient times, mortals had no concept of music. They could shout and bang stones together, but they had never experienced melody or harmony. The world was dull, quiet, and literal.\n\nSheogorath looked down upon mankind and decided to bestow a gift. He visited a woman named Lyranth who was singing a mournful, flat lament in the woods. Fascinated by her voice, the Madgod did not simply teach her notes. \n\nInstead, with whimsical surgical precision, Sheogorath tore out her tendons, plucked her intestines, and strung them taut across her hollowed-out ribcage and skull. He plucked the wet gut-strings, and a celestial, spine-tingling chord rang out across the forest.\n\n*"Behold!"* Sheogorath proclaimed to the terrified onlookers. *"This is music! Play upon her bones, and your hearts shall dance!"* The mortals wept, carved wood into the shape of her ribcage, and strung dried sheep guts across the frame—creating the first lutes and harps in Tamrielic history.`,
      oblivionConnection: 'Every lute-playing bard in the taverns of the Imperial City and Chorrol is using an instrument whose blueprint was literally harvested from human entrails by the Madgod your wife will meet in the Shivering Isles!',
      weirdnessRating: 4
    },
    {
      title: 'Azura and the Dwemer\'s Empty Box',
      god: 'Azura (Queen of Dusk & Dawn)',
      badge: 'Mortal Wit vs Divine Vanity',
      icon: '📦',
      summary: 'A mortal Dwemer tonal scholar challenged Azura\'s omniscience with a simple box, proving that cold logic could humiliate an immortal Daedric Prince.',
      narrative: `A legendary Dwemer scholar named **Nchunak** wanted to prove to the Chimer that their worship of the Daedra was primitive superstition compared to Dwemer acoustic logic and empiricism. He summoned **Azura**, the Queen of Dusk and Dawn, into his subterranean brass auditorium.\n\nNchunak placed a sealed brass box on the pedestal before her and asked: *"All-knowing Queen of the Crimson Gate, tell me: what object rests within this sealed box?"*\n\nAzura smiled with serene divine confidence and proclaimed: *"A red wild-rose, picked at twilight from the hills of Morrowind."*\n\nNchunak bowed, opened the heavy brass lid, and showed the assembled crowd: **the box was completely empty**. \n\nThe crowd gasped. Azura had guessed incorrectly. But Nchunak had pulled a sleight of hand—he had used tonal magic to teleport the rose out of the box the exact millisecond she answered! \n\nEnraged that a mortal scientist had made a public fool of her divine omniscience, Azura wiped Nchunak and his entire city from existence in a blaze of dusk-fire. It proved that while gods can be outsmarted, they are sore losers!`,
      oblivionConnection: 'Azura\'s vanity is famous. In Oblivion, her shrine quest in the snowy mountains requires you to bring her glowing glow-dust at dawn or dusk precisely, because she refuses to talk to mortals at any other hour!',
      weirdnessRating: 3
    }
  ];

  const deities: DeityProfile[] = [
    {
      id: 'lorkhan',
      name: 'Lorkhan (The Doom Drum / Shor / Shezarr)',
      title: 'The Missing God, Father of Men & Architect of Mortality',
      pantheon: 'The Missing God',
      sphere: 'Mortality, Space, Conflict, The Arena of Nirn',
      cosmicNature: 'The catalyst who convinced the original divine spirits to sacrifice their infinity to build the physical universe. Without Lorkhan, humanity, elves, and the games of Elder Scrolls would not exist.',
      keyMyth: 'His heart was shot across Tamriel on an arrow, creating Red Mountain. His body became the two moons Masser and Secunda.',
      wifeNote: 'The entire reason you can wander around Cyrodiil picking flowers and fighting mudcrabs is because Lorkhan tricked the gods into building a mortal playground!',
      artifact: 'The Heart of Lorkhan / The Ring of Moon-and-Star'
    },
    {
      id: 'akatosh',
      name: 'Akatosh (The Dragon of Time)',
      title: 'Chief of the Nine Divines, Sovereign of Order',
      pantheon: 'Aedra (The Divines)',
      sphere: 'Linear Time, Endurance, The Imperial Covenant, Dragons',
      cosmicNature: 'The first spirit to crystallize in the Void. Through him, the ticking clock began, allowing moments to occur in a past-present-future sequence rather than random chaos.',
      keyMyth: 'Made the divine pact with Saint Alessia, placing his blood into the Amulet of Kings to seal Nirn from Daedric invasion.',
      wifeNote: 'The golden dragon statue in the Temple District of the Imperial City is Akatosh. At the end of your Oblivion main quest, Martin Septim turns into an enormous flaming dragon avatar of Akatosh to battle Mehrunes Dagon!',
      artifact: 'The Amulet of Kings (Chim-el Adabal)'
    },
    {
      id: 'malacath',
      name: 'Malacath (Mauloch / Trinimac Reborn)',
      title: 'Lord of the Pariah, Protector of the Ostracized & The Sworn Oath',
      pantheon: 'Daedric Princes',
      sphere: 'Outcasts, Curses, Grudges, Blood-Pacts, Physical Prowess',
      cosmicNature: 'Formerly the radiant golden Aedric knight Trinimac. Consumed by Boethiah and excreted out into the ash, he fiercely protects those whom society rejects.',
      keyMyth: 'The birth of the Orcs from his excreted followers who covered themselves in his holy dung.',
      wifeNote: 'Every time you talk to an Orc smith or warrior in Oblivion, remember their god was literally pooped out by Boethiah, which is why Orcs take no nonsense from anyone!',
      artifact: 'Volendrung (The Hammer of Might)'
    },
    {
      id: 'boethiah',
      name: 'Boethiah (Prince of Plots)',
      title: 'Sovereign of Ambush, Overthrow, Treason, and Unlawful Power',
      pantheon: 'Daedric Princes',
      sphere: 'Deceit, Martial Prowess, Elimination of the Weak, The Psijic Endeavor',
      cosmicNature: 'Teaches that mortal hardship is a crucible. Weakness deserves to be destroyed; true divinity is earned through surviving relentless struggle and betrayal.',
      keyMyth: 'Swallowed Trinimac, excreted Malacath, and guided the Chimer prophet Veloth into the ash wastes of Morrowind.',
      wifeNote: 'Boethiah is considered a "Good Daedra" by the Dark Elves because they believe her cruel trials made their race tough enough to survive giant volcano ash storms!',
      artifact: 'Goldbrand / The Ebony Mail'
    },
    {
      id: 'sheogorath',
      name: 'Sheogorath (The Madgod)',
      title: 'Prince of Madness, Lord of the Never-There, Ruler of the Shivering Isles',
      pantheon: 'Daedric Princes',
      sphere: 'Insanity, Creative Genius, Paranoia, The Wabbajack, Cheese',
      cosmicNature: 'Actually Jyggalag, the terrifying Prince of Order, who was cursed into madness by the other Princes who feared his mathematical perfection.',
      keyMyth: 'Crafted the first musical instrument out of the intestines of a mortal woman; regularly turns people into sweetrolls.',
      wifeNote: 'He speaks in an outrageous Scottish accent in Oblivion and has the greatest DLC in gaming history (The Shivering Isles). He will be your favorite character in the game!',
      artifact: 'The Wabbajack'
    },
    {
      id: 'azura',
      name: 'Azura of the Crimson Gate',
      title: 'Queen of Dusk and Dawn, Mother of the Rose',
      pantheon: 'Daedric Princes',
      sphere: 'Dusk, Dawn, Mystery, Prophecy, Vanity, Maternal Wrath',
      cosmicNature: 'The only Daedric Prince who craves genuine love rather than terror, but possesses terrifying vanity. She cursed the entire Chimer race into red-eyed Dark Elves.',
      keyMyth: 'Turned the Chimer into Dunmer at Red Mountain and guided the Nerevarine across 3,000 years of patience.',
      wifeNote: 'Her shrine in Oblivion gives you Azura\'s Star, an infinite unbreakable soul gem that you will use to enchant your weapons for the rest of your playthrough!',
      artifact: 'Azura\'s Star'
    }
  ];

  return (
    <div className="space-y-8" id="pantheon-cosmology-section">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#c8983e]/40 bg-gradient-to-r from-[#17141f] via-[#1b1510] to-[#121625] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#f59e0b]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#a855f7]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#eac368]" />
            Literal Cosmology & The Divine Pantheon
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f8f5ee] tracking-wide">
            The Gods, The Moon Holes & Cosmic Realities
          </h1>
          <p className="text-sm sm:text-base text-[#c5c0b4] max-w-3xl leading-relaxed">
            In the Elder Scrolls, mythology is not metaphorical poetry—it is <strong className="text-[#eac368]">measurable, literal astrophysics</strong>. 
            The sun is a cosmic puncture wound, the moons are the rotting flesh of the creator, and the Orcs were born when a god was eaten and pooped out into the ash.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-[#252838] overflow-x-auto">
          <button
            onClick={() => setActiveTab('cosmology')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'cosmology'
                ? 'bg-[#c8983e] text-[#121008] font-bold shadow-md'
                : 'bg-[#141622] text-[#8c887e] hover:text-[#f4efe6]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Literal Cosmology (The Sun, Stars & Moons)</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'bg-[#c8983e] text-[#121008] font-bold shadow-md'
                : 'bg-[#141622] text-[#8c887e] hover:text-[#f4efe6]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Wildest God Stories (The Pooping of Malacath)</span>
          </button>

          <button
            onClick={() => setActiveTab('deities')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'deities'
                ? 'bg-[#c8983e] text-[#121008] font-bold shadow-md'
                : 'bg-[#141622] text-[#8c887e] hover:text-[#f4efe6]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Deity Profiles & Oblivion Links</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LITERAL COSMOLOGY */}
      {activeTab === 'cosmology' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-[#12141e] border border-[#262a3d] p-4 text-xs sm:text-sm text-[#94a3b8] flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#38bdf8] flex-shrink-0" />
            <span>
              <strong className="text-[#f4efe6]">Notice to New Explorers:</strong> When reading in-game books in Cyrodiil, many assume these are primitive religious fables. In Nirn, they are literal facts confirmed by mages and metaphysical explorers!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosmicTruths.map((truth) => {
              const Icon = truth.icon;
              return (
                <div
                  key={truth.id}
                  className="rounded-2xl border border-[#2b2e40] bg-[#141520] p-6 space-y-4 hover:border-[#c8983e]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ borderColor: `${truth.color}40`, backgroundColor: `${truth.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: truth.color }} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e2030] text-[#cbd5e1] border border-[#2f3246]">
                        Literal Astrophysics
                      </span>
                    </div>

                    <h2 className="text-xl font-serif font-bold text-[#f8f5ee]">
                      {truth.name}
                    </h2>

                    <div className="p-2.5 rounded-lg bg-[#191c2b] border border-[#282d45] text-xs font-mono font-semibold" style={{ color: truth.color }}>
                      "{truth.truth}"
                    </div>

                    <p className="text-xs sm:text-sm text-[#c7c2b6] leading-relaxed whitespace-pre-line">
                      {truth.explanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#222638] bg-[#0e1017] -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <span className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold block mb-1">
                      Oblivion Gameplay Connection:
                    </span>
                    <p className="text-xs text-[#94a3b8] italic">
                      {truth.inGameFact}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WILDEST GOD STORIES */}
      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Story Selection List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase text-[#8c887e] px-1 font-bold">
              Mythological Chronicles ({wildGodStories.length})
            </div>
            {wildGodStories.map((story, idx) => (
              <button
                key={story.title}
                onClick={() => setSelectedStoryIndex(idx)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  selectedStoryIndex === idx
                    ? 'bg-[#221f2b] border-[#c8983e] shadow-lg text-[#f8f5ee]'
                    : 'bg-[#13141c] border-[#222533] text-[#94a3b8] hover:bg-[#181a24] hover:text-[#f4efe6]'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{story.icon}</span>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#eac368] block">
                    {story.badge}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-[#f8f5ee] leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-xs text-[#8c887e] line-clamp-2">
                    {story.god}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Selected Story Deep Dive (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-[#3b3425] bg-[#14141d] p-6 sm:p-8 space-y-6 shadow-2xl">
            {(() => {
              const story = wildGodStories[selectedStoryIndex];
              return (
                <div className="space-y-6">
                  {/* Story Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#252838] gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{story.icon}</span>
                        <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40">
                          {story.badge}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee] mt-2">
                        {story.title}
                      </h2>
                      <p className="text-xs text-[#94a3b8] mt-1 font-mono">
                        Key Deities: <strong className="text-[#f4efe6]">{story.god}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#1a1c29] px-3 py-1.5 rounded-lg border border-[#2b3047] text-xs">
                      <span className="text-[#8c887e] font-mono">Wildness:</span>
                      {Array.from({ length: story.weirdnessRating }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-[#191924] border border-[#2e2f42] text-sm text-[#e2ded5] italic font-serif">
                    "{story.summary}"
                  </div>

                  {/* Narrative Body */}
                  <div className="text-sm sm:text-base text-[#d1cbbe] leading-relaxed space-y-4 whitespace-pre-line font-sans">
                    {story.narrative}
                  </div>

                  {/* Oblivion Connection Box */}
                  <div className="rounded-xl border border-[#3b82f6]/40 bg-[#101728] p-4 flex items-start gap-3">
                    <Compass className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono uppercase font-bold text-[#93c5fd]">
                        Oblivion In-Game Spotlight (For Your Wife):
                      </div>
                      <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1">
                        {story.oblivionConnection}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: DEITY PROFILES */}
      {activeTab === 'deities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Deities Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase text-[#8c887e] px-1 font-bold">
              The Major Tamrielic Powers
            </div>
            {deities.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDeityId(d.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedDeityId === d.id
                    ? 'bg-[#221f2a] border-[#c8983e] shadow-lg text-[#f8f5ee]'
                    : 'bg-[#13141c] border-[#222533] text-[#94a3b8] hover:bg-[#181a24] hover:text-[#f4efe6]'
                }`}
              >
                <div>
                  <div className="text-xs font-mono text-[#c8983e] uppercase">
                    {d.pantheon}
                  </div>
                  <div className="text-sm font-serif font-bold text-[#f8f5ee]">
                    {d.name.split(' ')[0]}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedDeityId === d.id ? 'text-[#c8983e] translate-x-1' : 'text-[#474a5d]'}`} />
              </button>
            ))}
          </div>

          {/* Deity Profile Card (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-[#312b20] bg-[#14141c] p-6 sm:p-8 space-y-6 shadow-xl">
            {(() => {
              const deity = deities.find(d => d.id === selectedDeityId) || deities[0];
              return (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#252838]">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#c8983e]">
                      {deity.pantheon} // Sphere: {deity.sphere}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee] mt-1">
                      {deity.name}
                    </h2>
                    <p className="text-sm text-[#94a3b8] font-serif italic mt-0.5">
                      {deity.title}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-[#eac368] font-bold mb-1">
                        Cosmic Nature & Function in Nirn:
                      </h4>
                      <p className="text-sm text-[#d4cfc3] leading-relaxed">
                        {deity.cosmicNature}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase text-[#eac368] font-bold mb-1">
                        Defining Myth:
                      </h4>
                      <p className="text-sm text-[#d4cfc3] leading-relaxed">
                        {deity.keyMyth}
                      </p>
                    </div>
                  </div>

                  {/* Artifact */}
                  <div className="p-3.5 rounded-xl bg-[#191a24] border border-[#2b2d3d] flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#8c887e]">Sacred Relic / Artifact:</span>
                    <button
                      onClick={() => {
                        const artMap: Record<string, string> = {
                          lorkhan: 'literal_cosmology',
                          akatosh: 'amulet_of_kings',
                          malacath: 'volendrung',
                          boethiah: 'goldbrand',
                          sheogorath: 'wabbajack',
                          azura: 'azuras_star'
                        };
                        if (onOpenEntity && artMap[deity.id]) {
                          onOpenEntity(artMap[deity.id]);
                        }
                      }}
                      className="text-xs font-mono font-bold text-[#eac368] hover:text-[#fef08a] flex items-center gap-1.5 underline decoration-[#c8983e]/50 cursor-pointer"
                      title="Inspect artifact dossier"
                    >
                      <span>{deity.artifact}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#c8983e]" />
                    </button>
                  </div>

                  {/* Wife Note */}
                  <div className="p-4 rounded-xl bg-[#101729] border border-[#223554] space-y-1">
                    <div className="text-xs font-mono uppercase text-[#60a5fa] font-bold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      What You Need to Know While Playing Oblivion:
                    </div>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      {deity.wifeNote}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
