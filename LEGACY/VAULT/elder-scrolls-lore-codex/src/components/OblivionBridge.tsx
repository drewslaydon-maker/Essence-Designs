import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  Anchor, 
  Swords, 
  Trees, 
  Castle, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  Coins, 
  Heart, 
  ArrowRight, 
  MapPin,
  Compass
} from 'lucide-react';
import { IMPERIAL_CITY_DISTRICTS } from '../data/loreData';

interface OblivionBridgeProps {
  onOpenEntity?: (id: string) => void;
}

export function OblivionBridge({ onOpenEntity }: OblivionBridgeProps) {
  const [selectedDistrictId, setSelectedDistrictId] = useState('prison_sewers');
  const [activeTab, setActiveTab] = useState<'districts' | 'ladder' | 'husbandNotes'>('districts');

  const selectedDistrict = IMPERIAL_CITY_DISTRICTS.find(d => d.id === selectedDistrictId) || IMPERIAL_CITY_DISTRICTS[0];

  const getDistrictIcon = (id: string) => {
    switch (id) {
      case 'prison_sewers': return <ShieldAlert className="w-5 h-5" />;
      case 'market_district': return <Store className="w-5 h-5" />;
      case 'waterfront': return <Anchor className="w-5 h-5" />;
      case 'arena': return <Swords className="w-5 h-5" />;
      case 'arboretum': return <Trees className="w-5 h-5" />;
      case 'palace_district': return <Castle className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const loreLadderSteps = [
    {
      level: 'Step 1: Fresh Out of Chains',
      action: 'Looting Sewers & Picking Rats',
      flavor: 'You just crawled out of the dark Imperial Prison with rusty iron swords and a handful of lockpicks.',
      loreBridge: 'Those damp stone arches were actually constructed 4,000 years ago by the ancient elven Ayleids who ruled Cyrodiil with Welkynd stone sorcery.'
    },
    {
      level: 'Step 2: Pawning Silverware',
      action: 'Selling Stolen Cups in the Market District',
      flavor: 'Trying to convince Jensine or Thoronir to give you 12 gold coins for a heavy silver candlestick.',
      loreBridge: 'Every gold coin ("Septim") is stamped with Emperor Tiber Septim, a warlord who conquered Tamriel using a giant brass robot and attained godhood as Talos!'
    },
    {
      level: 'Step 3: The Emperor\'s Final Breath',
      action: '"Close shut the jaws of Oblivion!"',
      flavor: 'Emperor Uriel Septim VII (voiced by Patrick Stewart) handed you the Amulet of Kings before the Mythic Dawn assassins struck him down.',
      loreBridge: 'His death broke the ancient Dragonfire Covenant made with Akatosh. Without an heir on the throne, the barrier between Mundus and the Daedric realms of fire has shattered.'
    },
    {
      level: 'Step 4: The Colossus in the Lake',
      action: 'Looking Up at the White-Gold Tower',
      flavor: 'Walking across the stone bridge and gazing at that impossible ivory spire piercing the clouds.',
      loreBridge: 'It is one of the cosmic "Towers" of Nirn—a metaphysical tuning fork that prevents the mortal world from collapsing back into primordial chaos.'
    },
    {
      level: 'Step 5: The Neighboring Province',
      action: '"Wait, who is this Vivec guy my husband keeps mentioning?"',
      flavor: 'Wondering why your husband has spent 15 years obsessing over a half-gold, half-blue bald poet.',
      loreBridge: 'Just east across the mountains in Morrowind (the previous game, set 6 years before Oblivion), Lord Vivec was a literal living god you could talk to in his palace. He stole godhood from a divine heart, but retained half of his mortal regret. He is the philosophical soul of Elder Scrolls.'
    }
  ];

  return (
    <div className="space-y-8" id="oblivion-bridge-section">
      {/* Warm Welcome Banner */}
      <div className="rounded-2xl border border-[#3e485e] bg-gradient-to-r from-[#141824] via-[#10141f] to-[#171b26] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-60 h-60 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-60 h-60 rounded-full bg-[#eab308]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40 mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              The Explorer\'s Bridge: From Imperial City to Cosmic Lore
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f4efe6] tracking-wide">
              Cyrodiil Sightseer & Oblivion Companion
            </h1>
            <p className="mt-2 text-[#94a3b8] max-w-2xl text-sm sm:text-base leading-relaxed">
              Tailored for anyone fresh out of the Imperial Prison sewers who is currently looting silver goblets, 
              evading city guards, and wondering why the Emperor left you with a glowing ruby necklace.
            </p>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex bg-[#0f1219] p-1.5 rounded-xl border border-[#272c3d] w-full md:w-auto">
            <button
              onClick={() => setActiveTab('districts')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'districts'
                  ? 'bg-[#3b82f6] text-white shadow'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1a2030]'
              }`}
            >
              City Districts
            </button>
            <button
              onClick={() => setActiveTab('ladder')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ladder'
                  ? 'bg-[#3b82f6] text-white shadow'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1a2030]'
              }`}
            >
              The Lore Ladder
            </button>
            <button
              onClick={() => setActiveTab('husbandNotes')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'husbandNotes'
                  ? 'bg-[#3b82f6] text-white shadow'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1a2030]'
              }`}
            >
              Husband\'s Notes
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DISTRICT EXPLORER */}
      {activeTab === 'districts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* District Selector Buttons (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#94a3b8] px-1 mb-2">
              Select Imperial City Sector
            </div>
            {IMPERIAL_CITY_DISTRICTS.map((district) => {
              const isSelected = district.id === selectedDistrictId;
              return (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrictId(district.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1a2236] border-[#3b82f6] shadow-lg text-[#f8fafc]'
                      : 'bg-[#121520] border-[#222738] text-[#94a3b8] hover:bg-[#171b29] hover:text-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#3b82f6]/20 text-[#60a5fa]' : 'bg-[#1c202e] text-[#64748b]'}`}>
                      {getDistrictIcon(district.id)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{district.name}</div>
                      <div className="text-[11px] text-[#64748b] truncate max-w-[180px]">{district.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="w-4 h-4 text-[#3b82f6]" />}
                </button>
              );
            })}
          </div>

          {/* District Detail View (Right 8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-[#2b334a] bg-[#121624] p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#22293d]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/30">
                  {getDistrictIcon(selectedDistrict.id)}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#f8fafc]">
                    {selectedDistrict.name}
                  </h2>
                  <p className="text-xs text-[#93c5fd] font-medium">{selectedDistrict.subtitle}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#1e2538] text-[#94a3b8] border border-[#2e3752]">
                Cyrodiil Heartland
              </span>
            </div>

            {/* Atmosphere Description */}
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              {selectedDistrict.description}
            </p>

            {/* Two Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Looting Spotlight */}
              <div className="rounded-xl bg-[#171c2d] p-4 border border-[#2b354e] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#f59e0b] uppercase tracking-wide">
                  <Coins className="w-4 h-4" />
                  What You're Doing Here (Loot & Fun)
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  {selectedDistrict.lootingSpotlight}
                </p>
              </div>

              {/* Deep Lore Connection */}
              <div className="rounded-xl bg-[#191e30] p-4 border border-[#384566] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#60a5fa] uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  Husband's Lore Secret
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  {selectedDistrict.deepLoreSecret}
                </p>
              </div>
            </div>

            {/* Notable NPCs & Characters */}
            <div className="pt-2 border-t border-[#22293d]">
              <div className="text-xs font-mono uppercase text-[#64748b] mb-2 flex items-center justify-between">
                <span>Notable Figures Around This District:</span>
                <span className="text-[10px] text-[#60a5fa] font-mono">Click to inspect related lore</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDistrict.charactersPresent.map((char) => (
                  <button
                    key={char}
                    onClick={() => {
                      if (onOpenEntity) {
                        if (char.includes('Septim') || char.includes('Emperor')) onOpenEntity('amulet_of_kings');
                        else if (char.includes('Gray Fox') || char.includes('Armand')) onOpenEntity('gray_cowl_of_nocturnal');
                        else if (char.includes('Orc') || char.includes('Agronak') || char.includes('Prince')) onOpenEntity('orsimer');
                        else if (char.includes('High Elf') || char.includes('Sorcerer') || char.includes('Phintias')) onOpenEntity('altmer');
                        else onOpenEntity('imperials');
                      }
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a2133] text-[#93c5fd] border border-[#28334d] hover:bg-[#3b82f6] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{char}</span>
                    <Sparkles className="w-3 h-3 text-[#60a5fa]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE LORE LADDER */}
      {activeTab === 'ladder' && (
        <div className="rounded-2xl border border-[#2b334a] bg-[#121624] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-[#f8fafc]">
              The Lore Ladder: From Pewter Spoons to The Godhead
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">
              How a simple RPG about escaping a sewer connects directly to the most mind-bending metaphysical world in video games.
            </p>
          </div>

          <div className="relative border-l-2 border-[#2b354e] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8 my-6">
            {loreLadderSteps.map((step, idx) => (
              <div key={step.level} className="relative group">
                {/* Number Circle Marker */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#1e273b] border-2 border-[#3b82f6] text-[#93c5fd] font-bold text-xs flex items-center justify-center shadow">
                  {idx + 1}
                </div>

                <div className="rounded-xl bg-[#171d2e] p-5 border border-[#26314a] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-mono font-bold text-[#60a5fa] uppercase tracking-wider">
                      {step.level}
                    </span>
                    <span className="text-xs font-serif italic text-[#f59e0b]">
                      "{step.action}"
                    </span>
                  </div>

                  <p className="text-sm text-[#f1f5f9] font-medium">
                    {step.flavor}
                  </p>

                  <div className="rounded-lg bg-[#111420] p-3.5 border border-[#1f2638] text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    <span className="font-bold text-[#cbd5e1] block mb-1">The Lore Truth:</span>
                    {step.loreBridge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HUSBAND'S NOTES */}
      {activeTab === 'husbandNotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#3e485e] bg-[#141824] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#f8fafc]">
                Why I Love Vivec (And Why He's Like Me)
              </h3>
            </div>
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              "In most fantasy worlds, gods are either all-powerful and arrogant, or cold and distant. Vivec is unique: he is a god who literally sits floating in a quiet room, thinking about his mistakes.
              <br /><br />
              He is caught between two halves: one half is capable of cosmic miracles, poetry, and leadership, while the other half feels the quiet, heavy sadness of being just a mortal human who knows he's flawed. That feeling of living with a constant internal split—trying to be strong on the outside while deeply introspective on the inside—is why he's my favorite character of all time."
            </p>
          </div>

          <div className="rounded-2xl border border-[#3b382d] bg-[#191712] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#eab308]/20 text-[#facc15] border border-[#eab308]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#f8fafc]">
                Quick Imperial City Survival Tips for My Wife
              </h3>
            </div>
            <ul className="text-xs sm:text-sm text-[#cbd5e1] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong>Don't drop your lockpicks!</strong> Always move the tumbler slowly and press it when it bounces to the top gently.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong>Red hand icon = Crime:</strong> If you pick up an item with a red hand icon, every guard in Cyrodiil will telepathically know. Sell it only to fences in the Thieves Guild!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong>The Adoring Fan:</strong> If you win the Arena matches, a funny yellow-haired kid will follow you around offering to carry your torch. He's an internet legend!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong>Fast Travel:</strong> You can click any city on the world map to fast travel instantly if no enemies are nearby!</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
