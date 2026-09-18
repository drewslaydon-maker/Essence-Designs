import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Share2, 
  Skull, 
  Gavel, 
  Search, 
  Beer, 
  Eye, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { StoryEvent, Player } from '../types';

interface StoryChronicleProps {
  events: StoryEvent[];
  players: Player[];
  dayNumber: number;
}

export const StoryChronicle: React.FC<StoryChronicleProps> = ({
  events,
  players,
  dayNumber
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'death' | 'verdict' | 'investigation' | 'gossip'>('all');

  const filteredEvents = events.filter(ev => {
    if (filter === 'all') return true;
    return ev.category === filter;
  });

  const generateMarkdownSummary = () => {
    let md = `# The Blackthorn Manor Chronicle — Day ${dayNumber}\n\n`;
    md += `*An emergent tale of intrigue, betrayal, and courtroom justice.*\n\n`;
    md += `## Roster of Guests\n`;
    for (const p of players) {
      md += `- **${p.name}** (${p.title}): ${p.isAlive ? 'Living Guest' : 'Deceased'}\n`;
    }
    md += `\n## Timeline of Incidents\n\n`;
    for (const ev of events) {
      md += `### [${ev.timestamp}] ${ev.title} (Day ${ev.dayNumber})\n`;
      md += `${ev.description}\n`;
      if (ev.details) {
        md += `> ${ev.details.replace(/\n/g, '\n> ')}\n`;
      }
      md += `\n`;
    }
    return md;
  };

  const handleCopyTranscript = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'death':
        return <Skull className="w-4 h-4 text-rose-400" />;
      case 'verdict':
        return <Gavel className="w-4 h-4 text-amber-400" />;
      case 'investigation':
        return <Search className="w-4 h-4 text-cyan-400" />;
      case 'gossip':
        return <Beer className="w-4 h-4 text-orange-400" />;
      case 'tell':
        return <Eye className="w-4 h-4 text-fuchsia-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div 
      id="story-chronicle-container"
      className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              The Manor Gazette & Story Chronicle
            </h2>
            <p className="text-xs text-stone-400">
              A continuous, emergent chronicle of courtroom proceedings and nocturnal encounters.
            </p>
          </div>
        </div>

        {/* Share & Copy Transcript */}
        <button
          id="btn-copy-story-transcript"
          onClick={handleCopyTranscript}
          className="py-1.5 px-3.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Story Copied to Clipboard!' : 'Copy Storybook Log'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-amber-600 text-stone-950'
              : 'bg-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          All Entries ({events.length})
        </button>
        <button
          onClick={() => setFilter('death')}
          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
            filter === 'death'
              ? 'bg-rose-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:text-rose-300'
          }`}
        >
          <Skull className="w-3 h-3" /> Deaths
        </button>
        <button
          onClick={() => setFilter('verdict')}
          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
            filter === 'verdict'
              ? 'bg-amber-600 text-stone-950'
              : 'bg-stone-800 text-stone-400 hover:text-amber-300'
          }`}
        >
          <Gavel className="w-3 h-3" /> Verdicts
        </button>
        <button
          onClick={() => setFilter('investigation')}
          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
            filter === 'investigation'
              ? 'bg-cyan-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:text-cyan-300'
          }`}
        >
          <Search className="w-3 h-3" /> Forensics
        </button>
        <button
          onClick={() => setFilter('gossip')}
          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
            filter === 'gossip'
              ? 'bg-orange-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:text-orange-300'
          }`}
        >
          <Beer className="w-3 h-3" /> Tavern
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl hover:border-stone-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                {getCategoryIcon(ev.category)}
                <h4 className="text-xs font-bold text-stone-200">{ev.title}</h4>
              </div>
              <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Day {ev.dayNumber} • {ev.timestamp}
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pl-6">
              {ev.description}
            </p>

            {ev.details && (
              <div className="mt-2 ml-6 p-2 bg-stone-900 rounded-lg text-[11px] font-mono text-amber-300/90 border border-stone-800 whitespace-pre-wrap">
                {ev.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
