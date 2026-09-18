import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Sword, 
  Shield, 
  Key, 
  BookMarked, 
  Wand2, 
  Flame, 
  EyeOff, 
  Compass, 
  Heart, 
  Layers, 
  Hammer, 
  ShieldAlert, 
  Skull,
  Search,
  Check,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { ARTIFACTS_DATA } from '../data/artifactsData';
import { ArtifactEntry } from '../types';

interface ArtifactsOfPowerProps {
  onOpenEntity: (id: string) => void;
}

export function ArtifactsOfPower({ onOpenEntity }: ArtifactsOfPowerProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGod, setSelectedGod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(ARTIFACTS_DATA[0].id);

  const types = ['all', 'Weapon', 'Armor', 'Cosmic Key / Relic', 'Grimoire / Tome', 'Divine Jewelry'];
  
  const gods = [
    'all',
    'Azura',
    'Sheogorath',
    'Nocturnal',
    'Malacath',
    'Mehrunes Dagon',
    'Boethiah',
    'Akatosh',
    'Clavicus Vile',
    'Hermaeus Mora',
    'Dwemer'
  ];

  const filteredArtifacts = ARTIFACTS_DATA.filter((art) => {
    const matchesType = selectedType === 'all' || art.type === selectedType;
    const matchesGod = selectedGod === 'all' || art.godOrCreator.toLowerCase().includes(selectedGod.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.godOrCreator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesGod && matchesSearch;
  });

  const selectedArtifact = ARTIFACTS_DATA.find(a => a.id === selectedArtifactId) || ARTIFACTS_DATA[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Sword': return Sword;
      case 'Wand2': return Wand2;
      case 'Key': return Key;
      case 'Hammer': return Hammer;
      case 'Flame': return Flame;
      case 'EyeOff': return EyeOff;
      case 'ShieldAlert': return ShieldAlert;
      case 'Layers': return Layers;
      case 'Skull': return Skull;
      case 'Shield': return Shield;
      case 'BookMarked': return BookMarked;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8" id="artifacts-of-power-section">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#c8983e]/40 bg-gradient-to-r from-[#1b1429] via-[#161220] to-[#1a1c29] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#a855f7]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#f59e0b]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#a855f7]/20 text-[#d8b4fe] border border-[#a855f7]/40">
            <Sparkles className="w-3.5 h-3.5" />
            Divine Artifacts & Cosmic Relics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f8f5ee] tracking-wide">
            The Artifacts of the Gods
          </h1>
          <p className="text-sm sm:text-base text-[#c5c0b4] max-w-3xl leading-relaxed">
            Unlike many fantasy franchises where legendary items are rebooted every installment, in The Elder Scrolls these are <strong className="text-[#eac368]">literal physical artifacts passing through history</strong>. 
            Born from Kirkbride design sticky-notes and deep metaphysics, each relic represents an amputated piece of a deity's infinite power cast down onto Nirn.
          </p>

          {/* Final Fantasy vs Elder Scrolls Canon Comparison Box */}
          <div className="mt-4 p-4 rounded-xl bg-[#12111c] border border-[#372f4d] flex flex-col sm:flex-row items-start gap-3.5">
            <Info className="w-5 h-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-bold text-[#e9d5ff]">
                The "Final Fantasy vs Elder Scrolls" Canon Distinction:
              </span>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                In <em>Final Fantasy</em>, concepts like Bahamut, Chocobos, or the sword Excalibur reappear as thematic motifs in brand-new separate universes. 
                In <em>The Elder Scrolls</em>, it is <strong>one single, unbroken physical timeline</strong>: when your wife finds <strong>Azura's Star</strong> or the <strong>Wabbajack</strong> in <em>Oblivion</em> (3E 433), it is the exact same physical relic you held in <em>Morrowind</em> (3E 427), and that your brother wielded in <em>Skyrim</em> (4E 201)!
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-6 mt-6 border-t border-[#252838] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8c887e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search artifacts, gods, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#13141f] border border-[#272b3d] text-xs sm:text-sm text-[#f4efe6] placeholder-[#64748b] focus:outline-none focus:border-[#c8983e]"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === t
                    ? 'bg-[#c8983e] text-[#121008] font-bold shadow'
                    : 'bg-[#141624] text-[#8c887e] hover:text-[#f4efe6]'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Artifacts Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase text-[#8c887e] font-bold">
              Cataloged Relics ({filteredArtifacts.length})
            </span>
            <span className="text-[11px] font-mono text-[#a855f7]">
              Click to view deep dossier
            </span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredArtifacts.map((art) => {
              const Icon = getIcon(art.iconName);
              const isSelected = art.id === selectedArtifactId;

              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArtifactId(art.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#211b2b] border-[#c8983e] shadow-xl text-[#f8f5ee]'
                      : 'bg-[#13141d] border-[#222533] text-[#94a3b8] hover:bg-[#181924] hover:text-[#f4efe6]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                    isSelected 
                      ? 'bg-[#c8983e]/20 border-[#c8983e]/50 text-[#eac368]' 
                      : 'bg-[#1a1b26] border-[#292d3e] text-[#a855f7]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono uppercase text-[#c8983e] font-semibold truncate">
                        {art.godOrCreator}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1c1d29] text-[#94a3b8] border border-[#2b2d3d]">
                        {art.type.split(' ')[0]}
                      </span>
                    </div>

                    <h3 className="text-sm font-serif font-bold text-[#f8f5ee] truncate">
                      {art.name}
                    </h3>

                    <p className="text-xs text-[#8c887e] line-clamp-1">
                      {art.inGameEffect}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Artifact Deep Dossier (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#3b3425] bg-[#14141d] p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="pb-4 border-b border-[#252838] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onOpenEntity(selectedArtifact.godId)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase font-bold bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40 hover:bg-[#c8983e]/30 transition-colors"
                title="Click to view God Dossier"
              >
                <span>Deity: {selectedArtifact.godOrCreator}</span>
                <ExternalLink className="w-3 h-3 text-[#eac368]" />
              </button>

              {/* Games Featured Badges */}
              <div className="flex items-center gap-1">
                {selectedArtifact.gamesFeatured.map((game) => (
                  <span
                    key={game}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1b1c2b] text-[#93c5fd] border border-[#2b3047]"
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee]">
              {selectedArtifact.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#c8983e] font-serif italic">
              "{selectedArtifact.subtitle}"
            </p>
          </div>

          {/* In-Game Power & Effect */}
          <div className="rounded-xl border border-[#262a3d] bg-[#171926] p-4 space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-[#38bdf8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              In-Game Combat & Practical Effect:
            </span>
            <p className="text-sm text-[#e2e8f0] font-medium leading-relaxed">
              {selectedArtifact.inGameEffect}
            </p>
          </div>

          {/* Kirkbride Sticky-Note & Deep Lore */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-[#eac368] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#eac368]" />
              The "Kirkbride Sticky-Note" Metaphysical Reality:
            </h4>
            <div className="text-xs sm:text-sm text-[#d4cfc3] leading-relaxed bg-[#0d0e14] p-4 rounded-xl border border-[#212330] space-y-2">
              <p>{selectedArtifact.kirkbrideStickyNoteLore}</p>
              <div className="pt-2 border-t border-[#1a1b24] text-[#94a3b8] italic">
                {selectedArtifact.canonicalContinuity}
              </div>
            </div>
          </div>

          {/* Where to Find It in Oblivion (For Wife) */}
          <div className="rounded-xl border border-[#3b82f6]/40 bg-[#101729] p-4 space-y-1">
            <div className="text-xs font-mono uppercase font-bold text-[#93c5fd] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#60a5fa]" />
              Where To Find It in Oblivion Right Now (For Your Wife):
            </div>
            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              {selectedArtifact.oblivionLocation}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="rounded-xl border border-[#eab308]/30 bg-[#17160f] p-4 space-y-1">
            <div className="text-xs font-mono uppercase font-bold text-[#fef08a] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Why It Truly Matters in the Universe:
            </div>
            <p className="text-xs sm:text-sm text-[#fef9c3] leading-relaxed">
              {selectedArtifact.whyItMatters}
            </p>
          </div>

          {/* Tags and Interconnected Links */}
          <div className="pt-2 border-t border-[#222533] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {selectedArtifact.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c1d29] text-[#8c887e]">
                  #{t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onOpenEntity(selectedArtifact.id)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40 hover:bg-[#c8983e] hover:text-[#121008] transition-all flex items-center gap-1.5"
            >
              <span>Inspect Interconnected Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
