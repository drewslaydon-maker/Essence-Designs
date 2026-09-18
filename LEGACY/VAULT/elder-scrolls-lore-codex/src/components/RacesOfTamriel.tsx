import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Shield, 
  Sparkles, 
  Flame, 
  Moon, 
  Trees, 
  Swords, 
  Compass, 
  Eye, 
  Heart,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

interface RaceProfile {
  id: string;
  name: string;
  nativeName: string;
  category: 'Men' | 'Mer (Elves)' | 'Beastfolk' | 'Ancient / Extinct';
  homeland: string;
  cosmicOrigin: string;
  biologicalQuirk: string;
  cultureAndVibe: string;
  oblivionSpotlight: string;
  tags: string[];
}

interface RacesOfTamrielProps {
  onOpenEntity?: (id: string) => void;
}

export function RacesOfTamriel({ onOpenEntity }: RacesOfTamrielProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRaceId, setSelectedRaceId] = useState<string>('orsimer');

  const races: RaceProfile[] = [
    // MER (ELVES)
    {
      id: 'orsimer',
      name: 'The Orcs (Orsimer)',
      nativeName: 'The Pariah Folk / Mer of Mauloch',
      category: 'Mer (Elves)',
      homeland: 'Wrothgarian Mountains & Strongholds (Orsinium)',
      cosmicOrigin: 'NOT beastfolk, but ancient elves! When their patron god Trinimac was swallowed and defecated out by Boethiah as Malacath, his devoted followers covered their skin in his ash and dung, transforming into the green-skinned, tusked Orsimer.',
      biologicalQuirk: 'Extremely dense bone and muscle structure with natural tusks. Bound by the Code of Malacath where chieftain disputes are settled strictly with blood honor.',
      cultureAndVibe: 'Fiercely independent stronghold clans who forge the finest heavy armor and weapons in Tamriel. Treated as monsters by snobbish Imperials, but respected as elite Legion shock troops.',
      oblivionSpotlight: 'Your wife will run into Orc smiths in the Market District (like Stonewall Shields) and the famous Gray Prince in the Imperial City Arena—who is half-Orc and the reigning Grand Champion!',
      tags: ['Trinimac Dung Origin', 'Honor-Bound', 'Master Smiths', 'Not Beastfolk']
    },
    {
      id: 'dunmer',
      name: 'The Dark Elves (Dunmer)',
      nativeName: 'Moriche / The Ash Folk',
      category: 'Mer (Elves)',
      homeland: 'Morrowind (Vvardenfell)',
      cosmicOrigin: 'Originally golden Chimer. When the Tribunal stole godhood from the Heart of Lorkhan and broke their oath to Nerevar, Azura transformed the entire race into ash-skinned, red-eyed elves as eternal witness to their sin.',
      biologicalQuirk: 'Naturally resistant to fire (born in volcanic ash). Possess striking crimson or fiery orange eyes with charcoal to dark bluish-grey skin.',
      cultureAndVibe: 'A culture of extreme resilience, ancestor veneration, giant domesticated insects (silt striders), and cutthroat Great House politics (Telvanni wizards, Redoran warriors, Hlaalu merchants).',
      oblivionSpotlight: 'Lots of Dunmer live in the Imperial City Waterfront and Cheydinhal (which has strong Dark Elf architecture and a Dunmer Count). Also: your husband\'s favorite race!',
      tags: ['Azura\'s Curse', 'Heart of Lorkhan', 'Great Houses', 'Tribunal']
    },
    {
      id: 'bosmer',
      name: 'The Wood Elves (Bosmer)',
      nativeName: 'Boiche / The Tree-Sap People',
      category: 'Mer (Elves)',
      homeland: 'Valenwood',
      cosmicOrigin: 'Made a divine pact with the forest god Y\'ffre known as the **Green Pact**.',
      biologicalQuirk: 'THE GREEN PACT: Strictly forbidden from harming, cutting, eating, or smoking ANY plant matter native to Valenwood. Consequently, they are 100% strict carnivores! Under the "Meat Mandate", traditional Bosmer are culturally required to eat the bodies of fallen enemies within three days of battle.',
      cultureAndVibe: 'Unmatched acrobats and archers who live in migratory giant walking graht-oak trees. When under existential threat, they perform the **Wild Hunt**—a ritual where they shapeshift into a tidal wave of formless, shrieking eldritch monsters that consume everything in their path before devouring themselves.',
      oblivionSpotlight: 'Meet Glarthir in Skingrad, the hilariously paranoid Wood Elf who thinks everyone in town is spying on him! Also the Adoring Fan who stalks you after winning the Arena.',
      tags: ['The Green Pact', 'Carnivores', 'Wild Hunt', 'Master Archers']
    },
    {
      id: 'altmer',
      name: 'The High Elves (Altmer)',
      nativeName: 'The Cultured Folk of Summerset',
      category: 'Mer (Elves)',
      homeland: 'Summerset Isle',
      cosmicOrigin: 'The direct aristocratic descendants of the original Aldmer spirits. They view the creation of the mortal world as a horrific cosmic tragedy orchestrated by Lorkhan that stripped them of godhood.',
      biologicalQuirk: 'Tall, golden-skinned, with immense natural magical affinity—but biologically weak to elemental magic and physical attacks. Extremely long lifespans (several centuries).',
      cultureAndVibe: 'Obsessed with bloodline purity, perfection, and fine arts. Many Altmer philosophers hold a dark secret desire: to unbind the mortal plane and destroy the Towers of Nirn so all elven souls can return to the formless heavens.',
      oblivionSpotlight: 'The Mages Guild and Arcane University in the Imperial City are dominated by haughty Altmer scholars wearing silk robes and complaining about the weather.',
      tags: ['Summerset', 'Arcane Royalty', 'Anti-Lorkhan', 'Tower Theory']
    },

    // BEASTFOLK
    {
      id: 'khajiit',
      name: 'The Khajiit',
      nativeName: 'The Children of the Ja-Kha\'jay',
      category: 'Beastfolk',
      homeland: 'Elsweyr',
      cosmicOrigin: 'Blessed by Azurah to be the secret guardians of the Lunar Lattice, which keeps the cosmic void from crashing down onto Nirn.',
      biologicalQuirk: 'LUNAR MORPHOLOGY: Their physical shape has NOTHING to do with their parents\' breed! It is determined 100% by the phases of the moons Masser and Secunda at the hour of birth. They can be born as an **Alfiq** (an ordinary-sized housecat that can cast devastating meteor spells), a **Cathay** (the bipedal cat you see in Oblivion), or a **Senche-raht** (a colossal war-cat as big as a mammoths that other Khajiit ride into battle)!',
      cultureAndVibe: 'Playful, spiritual, lovers of Moon Sugar (sacred crystalline moonlight) and sweet treats. Talk in the beloved third person ("This one thinks you have coin...").',
      oblivionSpotlight: 'Your best allies if your wife joins the Thieves Guild in the Waterfront! Armand Christophe works with Khajiit fences, and M\'aiq the Liar runs across Cyrodiil delivering fourth-wall-breaking jokes.',
      tags: ['17 Moon Breeds', 'Housecat Wizards', 'Moon Sugar', 'Lunar Lattice']
    },
    {
      id: 'argonians',
      name: 'The Argonians (Saxhleel)',
      nativeName: 'People of the Root',
      category: 'Beastfolk',
      homeland: 'Black Marsh (Argonia)',
      cosmicOrigin: 'Not naturally evolved reptiles! They were biologically cultivated, modified, and directed by the **Hist**—an ancient race of sentient, telepathic spore-trees that existed before mortal time.',
      biologicalQuirk: 'Natural waterbreathing, immune to toxic poisons and diseases. Their blood contains Hist sap, and when an Argonian dies, their soul returns to the root network to be reborn into a new egg.',
      cultureAndVibe: 'DEFEATED OBLIVION GATES: During the Oblivion Crisis happening in your wife\'s game, the Hist warned the Argonians in advance. The Argonians ambushed Mehrunes Dagon\'s invading Daedra with such savage ferocity that Dagon\'s generals were forced to manually close their own Oblivion Gates to prevent Argonians from conquering Hell itself!',
      oblivionSpotlight: 'Argonians swim happily in the murky waters around the Imperial City Waterfront and Lake Rumare. If your wife plays an Argonian, she never has to worry about drowning underwater!',
      tags: ['Hist Trees', 'Reverse Oblivion Invasion', 'Waterbreathing', 'Ancient Soul-Root']
    },

    // MEN (HUMANS)
    {
      id: 'imperials',
      name: 'The Imperials (Cyrodiils)',
      nativeName: 'Cyro-Nords / Heartland Folk',
      category: 'Men',
      homeland: 'Cyrodiil',
      cosmicOrigin: 'Descended from the human slaves liberated by Saint Alessia, Morihaus, and Pelinal Whitestrake when they shattered the Ayleid Empire in the First Era.',
      biologicalQuirk: 'Extraordinarily adaptable, silver-tongued, and skilled in diplomacy, commerce, and legion formation tactics.',
      cultureAndVibe: 'Divided into two distinct cultural soul-halves: the **Colovians** (austere, grim western highland warriors who love castle keeps and Nordic discipline) and the **Nibenese** (flamboyant, magical eastern river merchants, philosophers, and silk cultists who run the Imperial City).',
      oblivionSpotlight: 'This is the race running the Imperial City where your wife is playing right now! The guards, Emperor Uriel Septim VII, and shopkeepers are all Imperials.',
      tags: ['Alessian Rebellion', 'Colovian vs Nibenese', 'Imperial City', 'Legion']
    },
    {
      id: 'redguards',
      name: 'The Redguards (Yokudans)',
      nativeName: 'The Ra Gada / Sword-Singers',
      category: 'Men',
      homeland: 'Hammerfell (Originally Yokuda)',
      cosmicOrigin: 'THEY ARE FROM A PREVIOUS UNIVERSE (KALPA)! Deep lore confirms the Yokudans fled a previous cosmic world-cycle by "stepping sideways" through time. Their continent of Yokuda was destroyed when their master sword-singers unleashed the forbidden **Pankratosword**—a sword technique that literally cut the atoms of the earth in two, causing a cataclysmic nuclear-level land sink!',
      biologicalQuirk: 'Immense natural poison resistance and stamina. The most lethal natural swordmasters on the face of Nirn.',
      cultureAndVibe: 'Proud warrior caste divided between the traditionalist "Crowns" and the cosmopolitan "Forebears". They despise necromancy and venerate the celestial constellation of the Warrior.',
      oblivionSpotlight: 'Many fine Redguard mercenaries guard the Imperial City gates and the Fighters Guild in Anvil and Chorrol.',
      tags: ['Previous Universe (Kalpa)', 'Atom-Cutting Pankratosword', 'Ansei Sword-Singers', 'Hammerfell']
    },
    {
      id: 'nords',
      name: 'The Nords of Skyrim',
      nativeName: 'Children of the Sky',
      category: 'Men',
      homeland: 'Skyrim (Atmora)',
      cosmicOrigin: 'Breathed into existence on the peak of the Throat of the World by the mother-goddess Kyne.',
      biologicalQuirk: 'Immune to sub-zero freezing temperatures. Wield the Thu\'um (the Dragon Shouts), using vocal tonal resonance to blow apart city gates with pure speech.',
      cultureAndVibe: 'Hard-drinking, battle-loving warriors who revere Shor (Lorkhan) and crave death in glorious combat to enter the golden feast halls of Sovngarde.',
      oblivionSpotlight: 'Bruma, the snowy northern city near the mountains in Cyrodiil, is a Nord town with wood-carved halls and mead-drinking warriors!',
      tags: ['Skyrim', 'Throat of the World', 'Kyne\'s Breath', 'Sovngarde']
    },
    {
      id: 'bretons',
      name: 'The Bretons of High Rock',
      nativeName: 'The Manmer',
      category: 'Men',
      homeland: 'High Rock',
      cosmicOrigin: 'The hybrid children of ancient Nedic human concubines and Direnni elven lords. They carry the blood of both Man and Mer.',
      biologicalQuirk: 'Natural 50% resistance to all magic spells, paired with an innate pool of high magicka. The best hybrid spell-knights in Tamriel.',
      cultureAndVibe: 'Feudal knights, chivalric romance, courtly intrigue, and squabbling petty duchies nestled in misty stone castles.',
      oblivionSpotlight: 'If your wife wants to be an unstoppable battlemage who shrugs off enemy fireballs, Breton is the legendary choice in Oblivion!',
      tags: ['Manmer Hybrid', 'Magic Resistance', 'Feudal Knights', 'High Rock']
    },

    // ANCIENT / EXTINCT
    {
      id: 'dwemer',
      name: 'The Dwemer (Deep Elves / Dwarves)',
      nativeName: 'The Tonal Heretics',
      category: 'Ancient / Extinct',
      homeland: 'Vvardenfell & Skyrim (Subterranean)',
      cosmicOrigin: 'Subterranean elves who rejected godhood in favor of acoustic physics (tonal architecture).',
      biologicalQuirk: 'Bearded, brilliant, and hubristic. When Kagrenac struck the Heart of Lorkhan in 1E 700, every single Dwemer on the planet instantaneously vanished from existence.',
      cultureAndVibe: 'Left behind steam-powered brass automatons, centurions, and geothermal cities. In Kirkbride lore, their souls were harmonized into the brass skin of the world-denying artificial god Numidium.',
      oblivionSpotlight: 'Only one living Dwemer remains in Tamriel: Yagrum Bagarn, whom you meet in Morrowind riding spider legs inside Divayth Fyr\'s mushroom basement!',
      tags: ['Zero-Summed', 'Tonal Science', 'Numidium', 'Vanished Race']
    },
    {
      id: 'ayleids',
      name: 'The Ayleids (Heartland High Elves)',
      nativeName: 'The Wild Elves of Cyrodiil',
      category: 'Ancient / Extinct',
      homeland: 'Ancient Cyrodiil (Imperial City)',
      cosmicOrigin: 'The ancient elven rulers who built the White-Gold Tower and enslaved early humanity in Cyrodiil.',
      biologicalQuirk: 'Master welkynd-stone glass architects and Daedra worshippers who designed bizarre "flesh-sculpture" torture gardens before being overthrown by Pelinal and Alessia.',
      cultureAndVibe: 'Their gleaming white marble ruins and subterranean dungeons dot the entire landscape of Cyrodiil today.',
      oblivionSpotlight: 'Every single underground marble dungeon with glowing cyan crystals and blue traps your wife explores in Oblivion is an ancient Ayleid ruin!',
      tags: ['White-Gold Builders', 'Welkynd Stones', 'Ayleid Ruins', 'Pelinal\'s Nemesis']
    }
  ];

  const categories = ['all', 'Mer (Elves)', 'Men', 'Beastfolk', 'Ancient / Extinct'];

  const filteredRaces = selectedCategory === 'all' 
    ? races 
    : races.filter(r => r.category === selectedCategory);

  const selectedRace = races.find(r => r.id === selectedRaceId) || races[0];

  return (
    <div className="space-y-8" id="races-tamriel-section">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#c8983e]/40 bg-gradient-to-r from-[#171c14] via-[#161722] to-[#1d161a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#10b981]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#e11d48]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/40">
            <Users className="w-3.5 h-3.5" />
            Biological Anomalies & Bizarre Truths
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f8f5ee] tracking-wide">
            The Races of Tamriel: Men, Mer & Beasts
          </h1>
          <p className="text-sm sm:text-base text-[#c5c0b4] max-w-3xl leading-relaxed">
            Every race in the Elder Scrolls breaks traditional high fantasy clichés: 
            Wood Elves are strictly carnivorous ritual cannibals, Orcs are cursed elven royalty born from divine dung, 
            and Khajiit give birth to either tiny spellcasting housecats or massive war-tigers based purely on moon phases.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-[#252838] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#c8983e] text-[#121008] font-bold shadow-md'
                  : 'bg-[#141622] text-[#8c887e] hover:text-[#f4efe6]'
              }`}
            >
              {cat === 'all' ? 'All Mortal Peoples' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Selection List + Rich Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Race Selection Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase text-[#8c887e] px-1 font-bold">
            Cataloged Peoples ({filteredRaces.length})
          </div>
          {filteredRaces.map((race) => {
            const isSelected = race.id === selectedRaceId;
            return (
              <button
                key={race.id}
                onClick={() => setSelectedRaceId(race.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#221f2b] border-[#c8983e] shadow-lg text-[#f8f5ee]'
                    : 'bg-[#13141c] border-[#222533] text-[#94a3b8] hover:bg-[#181a24] hover:text-[#f4efe6]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#c8983e] uppercase block font-semibold">
                    {race.category}
                  </span>
                  <span className="text-sm font-serif font-bold text-[#f8f5ee]">
                    {race.name}
                  </span>
                  <span className="text-xs text-[#8c887e] block">
                    {race.nativeName}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#c8983e] translate-x-1' : 'text-[#474a5d]'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Selected Race In-Depth Dossier (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#312b20] bg-[#14141c] p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#252838] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40">
                  {selectedRace.category}
                </span>
                <span className="text-xs font-mono text-[#8c887e]">
                  Homeland: <strong className="text-[#cbd5e1]">{selectedRace.homeland}</strong>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee] mt-2">
                {selectedRace.name}
              </h2>
              <p className="text-sm text-[#c8983e] font-serif italic">
                "{selectedRace.nativeName}"
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 max-w-[240px]">
              {selectedRace.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c1d29] text-[#93c5fd] border border-[#2b314a]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Core Cosmic Origin */}
          <div className="rounded-xl border border-[#2e2617] bg-[#1a1711] p-4 space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-[#eac368] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Cosmic & Mythological Origin:
            </span>
            <p className="text-sm text-[#e4decb] leading-relaxed">
              {selectedRace.cosmicOrigin}
            </p>
          </div>

          {/* Biological Anomaly */}
          <div className="rounded-xl border border-[#3a1d1d] bg-[#1a1111] p-4 space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-[#f87171] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              The Bizarre Biological / Cultural Quirk:
            </span>
            <p className="text-sm text-[#f1d0d0] leading-relaxed">
              {selectedRace.biologicalQuirk}
            </p>
          </div>

          {/* Culture & Vibe */}
          <div className="space-y-1">
            <h4 className="text-xs font-mono uppercase text-[#8c887e] font-bold">
              Culture, Society & Outlook:
            </h4>
            <p className="text-sm text-[#c7c2b6] leading-relaxed">
              {selectedRace.cultureAndVibe}
            </p>
          </div>

          {/* Oblivion Connection Box */}
          <div className="rounded-xl border border-[#3b82f6]/40 bg-[#101729] p-4 flex items-start gap-3">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#93c5fd]">
                Oblivion In-Game Spotlight (For Your Wife):
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 leading-relaxed">
                {selectedRace.oblivionSpotlight}
              </p>
            </div>
          </div>

          {/* Interconnected Lore Action */}
          {onOpenEntity && (
            <div className="pt-2 border-t border-[#252838] flex items-center justify-between">
              <span className="text-xs font-mono text-[#8c887e]">
                Aurbic Heritage Registry
              </span>
              <button
                onClick={() => onOpenEntity(selectedRace.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/40 hover:bg-[#10b981] hover:text-[#062419] transition-all flex items-center gap-1.5"
              >
                <span>Inspect Lore Dossier & Cross-Links</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
