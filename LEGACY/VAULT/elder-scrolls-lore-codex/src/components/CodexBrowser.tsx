import { useState, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  Tag, 
  Flame, 
  Quote, 
  ArrowUpRight, 
  Eye, 
  X,
  Compass,
  Check
} from 'lucide-react';
import { LoreEntry, LoreCategory } from '../types';
import { LORE_ENTRIES } from '../data/loreData';

interface CodexBrowserProps {
  onSelectEntry?: (entry: LoreEntry) => void;
  onOpenEntity?: (id: string) => void;
}

export function CodexBrowser({ onSelectEntry, onOpenEntity }: CodexBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingDepth, setReadingDepth] = useState<'beginner' | 'scholar'>('beginner');
  const [activeEntryModal, setActiveEntryModal] = useState<LoreEntry | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['vivec', 'pelinal_whitestrake']);

  const toggleBookmark = (id: string, e?: MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Entries' },
    { id: 'vivec', label: 'Lord Vivec' },
    { id: 'gods', label: 'Gods & Daedra' },
    { id: 'artifacts', label: 'Relics & Artifacts' },
    { id: 'characters', label: 'Notable Figures' },
    { id: 'races', label: 'Races of Tamriel' },
    { id: 'cyrodiil_guide', label: 'Cyrodiil & Towers' },
    { id: 'metaphysics', label: 'Deep Metaphysics' }
  ];

  const filteredEntries = useMemo(() => {
    return LORE_ENTRIES.filter(entry => {
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      const matchesSearch = 
        searchQuery.trim() === '' ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenEntry = (entry: LoreEntry) => {
    setActiveEntryModal(entry);
    if (onSelectEntry) onSelectEntry(entry);
  };

  const handleCrossReference = (refId: string) => {
    const target = LORE_ENTRIES.find(e => e.id === refId);
    if (target) {
      setActiveEntryModal(target);
    }
  };

  return (
    <div className="space-y-6" id="codex-browser">
      {/* Search Bar & Controls Header */}
      <div className="rounded-2xl border border-[#2b2d38] bg-[#12131a] p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c887e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gods, races, Vivec, Pelinal, CHIM, or lore keywords..."
              className="w-full bg-[#181922] border border-[#2b2d38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f4efe6] placeholder-[#6b675e] focus:outline-none focus:border-[#c8983e] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c887e] hover:text-[#f4efe6]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Reading Depth Toggle */}
          <div className="flex items-center gap-2 bg-[#181922] p-1 rounded-xl border border-[#2b2d38] self-start md:self-auto">
            <span className="text-xs text-[#8c887e] px-2 font-mono uppercase hidden sm:inline">Lens:</span>
            <button
              onClick={() => setReadingDepth('beginner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                readingDepth === 'beginner'
                  ? 'bg-[#3b82f6] text-white shadow'
                  : 'text-[#8c887e] hover:text-[#f4efe6]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Adventurer (Wife's Lens)
            </button>
            <button
              onClick={() => setReadingDepth('scholar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                readingDepth === 'scholar'
                  ? 'bg-[#c8983e] text-[#121008] font-bold shadow'
                  : 'text-[#8c887e] hover:text-[#f4efe6]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Scholar of Vehk
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-[#c8983e]/20 border-[#c8983e] text-[#eac368]'
                  : 'bg-[#181922] border-[#252836] text-[#8c887e] hover:text-[#f4efe6] hover:bg-[#20222e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntries.map((entry) => {
          const isBookmarked = bookmarkedIds.includes(entry.id);

          return (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleOpenEntry(entry)}
              className={`rounded-2xl border p-5 bg-[#14151e] hover:bg-[#181a26] transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden ${
                entry.category === 'vivec'
                  ? 'border-[#c8983e]/50 hover:border-[#c8983e]'
                  : 'border-[#262938] hover:border-[#3d425c]'
              }`}
            >
              {/* Top Row: Category badge & bookmark button */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                    entry.category === 'vivec'
                      ? 'bg-[#c8983e]/15 text-[#eac368] border-[#c8983e]/30'
                      : entry.category === 'gods'
                      ? 'bg-purple-900/30 text-purple-300 border-purple-800/40'
                      : entry.category === 'races'
                      ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40'
                      : entry.category === 'cyrodiil_guide'
                      ? 'bg-blue-900/30 text-blue-300 border-blue-800/40'
                      : 'bg-orange-900/30 text-orange-300 border-orange-800/40'
                  }`}>
                    {entry.category.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {entry.kirkbrideScore && (
                      <span className="text-[10px] font-mono text-[#8c887e]" title="Kirkbride Weirdness Score">
                        ★ {entry.kirkbrideScore}/5
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleBookmark(entry.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? 'text-[#c8983e]' : 'text-[#64748b] hover:text-[#e2e8f0]'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save entry'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-serif font-bold text-[#f4efe6] group-hover:text-[#eac368] transition-colors">
                  {entry.title}
                </h3>
                <p className="text-xs text-[#8c887e] mt-0.5 line-clamp-1">
                  {entry.subtitle}
                </p>

                {/* Content Preview (based on reading lens) */}
                <p className="text-xs text-[#c5c0b4] mt-3 line-clamp-3 leading-relaxed">
                  {readingDepth === 'beginner' && entry.beginnerNote 
                    ? entry.beginnerNote 
                    : entry.summary}
                </p>
              </div>

              {/* Bottom Tags & Read Arrow */}
              <div className="mt-5 pt-3 border-t border-[#202230] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#6b675e] overflow-hidden">
                  <Tag className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[170px]">
                    {entry.tags.slice(0, 2).join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#c8983e] font-semibold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Read</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAILED ENTRY MODAL */}
      <AnimatePresence>
        {activeEntryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#3d425c] bg-[#12131c] p-6 sm:p-8 shadow-2xl space-y-6 scrollbar-thin"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#252838]">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#c8983e]/20 text-[#eac368] mb-2">
                    {activeEntryModal.category.replace('_', ' ')} {activeEntryModal.era && `// ${activeEntryModal.era}`}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4efe6]">
                    {activeEntryModal.title}
                  </h2>
                  <p className="text-sm text-[#8c887e] mt-1">{activeEntryModal.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(activeEntryModal.id)}
                    className="p-2 rounded-lg bg-[#1a1c27] text-[#8c887e] hover:text-[#c8983e]"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(activeEntryModal.id) ? 'text-[#c8983e] fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setActiveEntryModal(null)}
                    className="p-2 rounded-lg bg-[#1a1c27] text-[#8c887e] hover:text-[#f4efe6]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Beginner's Note / Wife's Oblivion Spotlight (if present) */}
              {activeEntryModal.beginnerNote && (
                <div className="rounded-xl border border-[#3b82f6]/40 bg-[#162038] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-[#93c5fd] font-bold">
                    <Compass className="w-4 h-4 text-[#60a5fa]" />
                    Oblivion Explorer's Bridge (Cyrodiil Lens)
                  </div>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {activeEntryModal.beginnerNote}
                  </p>
                </div>
              )}

              {/* Primary Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#8c887e]">Codex Overview</h4>
                <p className="text-sm text-[#e2ded5] leading-relaxed">
                  {activeEntryModal.summary}
                </p>
              </div>

              {/* Deep Metaphysics / Kirkbride Canon */}
              <div className="space-y-2 pt-3 border-t border-[#202333]">
                <h4 className="text-xs font-mono uppercase text-[#eac368] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Deep Metaphysical Lore & Kirkbride Canon
                </h4>
                <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed space-y-3 whitespace-pre-line">
                  {activeEntryModal.deepLore}
                </div>
              </div>

              {/* Authentic In-Universe Quotes */}
              {activeEntryModal.quotes && activeEntryModal.quotes.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[#202333]">
                  <h4 className="text-xs font-mono uppercase text-[#8c887e] flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    Sacred Inscriptions & Quotes
                  </h4>
                  <div className="space-y-3">
                    {activeEntryModal.quotes.map((q, idx) => (
                      <blockquote key={idx} className="border-l-2 border-[#c8983e] pl-3.5 py-1 text-xs sm:text-sm italic text-[#eae5dc] bg-[#161824] rounded-r-lg p-2.5">
                        "{q.text}"
                        <footer className="text-[11px] text-[#8c887e] not-italic mt-1">
                          — {q.speaker ? `${q.speaker}, ` : ''}{q.source}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross References */}
              {activeEntryModal.crossReferences && activeEntryModal.crossReferences.length > 0 && (
                <div className="pt-3 border-t border-[#202333]">
                  <h4 className="text-xs font-mono uppercase text-[#8c887e] mb-2">Related Entities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeEntryModal.crossReferences.map((refId) => {
                      const refTarget = LORE_ENTRIES.find(e => e.id === refId);
                      if (!refTarget) return null;
                      return (
                        <button
                          key={refId}
                          onClick={() => handleCrossReference(refId)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1c27] text-[#c8983e] hover:bg-[#c8983e]/20 border border-[#2e3245] flex items-center gap-1"
                        >
                          <span>{refTarget.title}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
