import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Heart, 
  Compass, 
  Database, 
  Globe, 
  Plus, 
  Check, 
  Trash2, 
  FileText, 
  Upload, 
  FolderPlus, 
  Scale, 
  Sparkles, 
  AlertTriangle, 
  Cpu, 
  UserCheck, 
  Flame,
  MessageCircle,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';
import { FlyJujuStudio } from './FlyJujuStudio';

interface JujuRealityAnchorViewProps {
  onNavigateToCommandDeck: () => void;
}

interface ExternalDatapoint {
  id: string;
  source: string;
  category: 'External Model' | 'Human Test' | 'Core Principle' | 'Design Truth';
  summary: string;
  impactOnEssenceFlow: string;
  weight: 'Critical' | 'High' | 'Guiding';
  dateAdded: string;
}

interface VibeLog {
  id: string;
  author: 'Juju' | 'Drew';
  sentiment: 'Approved' | 'Caution' | 'Veto / Halt';
  notes: string;
  timestamp: string;
}

interface VaultDoc {
  id: string;
  title: string;
  updatedAt: string;
  category: 'Intelligence' | 'Guardrails' | 'Notes';
  content: string;
}

const INITIAL_DATAPOINTS: ExternalDatapoint[] = [
  {
    id: 'dp-1',
    source: 'Juju\'s Outside Model Query (External Intelligence)',
    category: 'External Model',
    summary: 'Complex technical hierarchies alienate non-technical players; instant tactile clarity and emotional warmth retain 10x more genuine human interest.',
    impactOnEssenceFlow: 'Mandate zero loading barriers for Mom, and place Atreyu\'s yarn games right at the forefront.',
    weight: 'Critical',
    dateAdded: '2026-09-03',
  },
  {
    id: 'dp-2',
    source: 'Independent Game Feel Research',
    category: 'Design Truth',
    summary: 'A game is only as good as the smile on the player\'s face in the first 5 seconds. Avoid AI jargon in front of family members.',
    impactOnEssenceFlow: 'Refactored navigation so Mom has her own cozy Haven with Yarn Match-3, word puzzles, and zero code clutter.',
    weight: 'Critical',
    dateAdded: '2026-09-03',
  },
  {
    id: 'dp-3',
    source: 'External Model Cross-Evaluation',
    category: 'External Model',
    summary: 'Single-source AI models hallucinate architectural complexity. Comparing against external sources keeps the project grounded in reality.',
    impactOnEssenceFlow: 'Established Juju\'s Reality Anchor as the supreme human sanity check and strategic compass.',
    weight: 'High',
    dateAdded: '2026-09-03',
  },
  {
    id: 'dp-4',
    source: 'Juju\'s Core Human Anchor',
    category: 'Core Principle',
    summary: 'If Mom and Juju aren\'t happy with what we are making, halt and figure it out. Technology must serve real human joy, never the reverse.',
    impactOnEssenceFlow: 'Ultimate Veto authority over releases, cleanroom builds, and feature scope.',
    weight: 'Critical',
    dateAdded: '2026-09-03',
  },
];

const INITIAL_VIBE_LOGS: VibeLog[] = [
  {
    id: 'vibe-1',
    author: 'Juju',
    sentiment: 'Approved',
    notes: 'Excited about the vision, but keep it simple, honest, and fun for Mom. No overwhelming screens.',
    timestamp: '2026-09-03 15:20',
  },
  {
    id: 'vibe-2',
    author: 'Drew',
    sentiment: 'Approved',
    notes: 'Organizing all clutter into distinct manageable tabs. Mom comes first with Yarn Crush & Word Weaver.',
    timestamp: '2026-09-03 15:30',
  }
];

const INITIAL_JUJU_DOCS: VaultDoc[] = [
  {
    id: 'doc-juju-guidelines',
    title: 'Juju_Human_Truth_and_Reality_Anchor.md',
    updatedAt: '2026-09-03',
    category: 'Guardrails',
    content: `# Juju's Ground Truth & Reality Guardrails
**Role:** Wife, Partner, and Sovereign Compass  
**Stance:** Skeptical of AI, but 100% supportive of Drew's creative vision and endeavors.  
**Core Purpose:**
1. Serves as the ultimate human reality anchor.
2. Interacts with external models outside our source to import fresh, objective datapoints.
3. Decides and steers basically everything we do.
4. If Mom or Juju is unhappy with a feature or direction, we stop and solve it together.
5. Juju does not test AI or technical code — all reviews must be framed through genuine human game feel, art, and narrative warmth.`
  },
  {
    id: 'doc-external-datapoints',
    title: 'External_Model_Intelligence_Matrix.md',
    updatedAt: '2026-09-03',
    category: 'Intelligence',
    content: `# External Source Datapoints & Cross-Validation Notes
- Data from external sources outside our model environment must be logged here.
- These external datapoints keep our engineering honest and prevent echo chambers.
- Priority 1: Joy and engagement for Mom (Atreyu).
- Priority 2: Genuine partnership and consensus with Juju.`
  }
];

export const JujuRealityAnchorView: React.FC<JujuRealityAnchorViewProps> = ({
  onNavigateToCommandDeck,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'compass' | 'datapoints' | 'craft' | 'docs' | 'fly-juju'>('fly-juju');

  // Vibe Barometer State
  const [currentVibe, setCurrentVibe] = useState<'Approved' | 'Caution' | 'Veto / Halt'>(() => {
    return (localStorage.getItem('juju_vibe_status') as any) || 'Approved';
  });
  const [humanScore, setHumanScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('juju_human_score') || '9', 10);
  });
  const [vibeLogs, setVibeLogs] = useState<VibeLog[]>(() => {
    const saved = localStorage.getItem('juju_vibe_logs');
    return saved ? JSON.parse(saved) : INITIAL_VIBE_LOGS;
  });
  const [newLogNote, setNewLogNote] = useState('');
  const [newLogAuthor, setNewLogAuthor] = useState<'Juju' | 'Drew'>('Juju');

  // External Datapoints State
  const [datapoints, setDatapoints] = useState<ExternalDatapoint[]>(() => {
    const saved = localStorage.getItem('juju_datapoints');
    return saved ? JSON.parse(saved) : INITIAL_DATAPOINTS;
  });
  const [isAddingDatapoint, setIsAddingDatapoint] = useState(false);
  const [dpSource, setDpSource] = useState('');
  const [dpSummary, setDpSummary] = useState('');
  const [dpImpact, setDpImpact] = useState('');
  const [dpWeight, setDpWeight] = useState<'Critical' | 'High' | 'Guiding'>('High');

  // Documents State
  const [docs, setDocs] = useState<VaultDoc[]>(() => {
    const saved = localStorage.getItem('juju_vault_docs');
    return saved ? JSON.parse(saved) : INITIAL_JUJU_DOCS;
  });
  const [activeDocId, setActiveDocId] = useState<string>(INITIAL_JUJU_DOCS[0].id);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDoc = docs.find(d => d.id === activeDocId) || docs[0];

  const handleSetVibe = (status: 'Approved' | 'Caution' | 'Veto / Halt') => {
    setCurrentVibe(status);
    localStorage.setItem('juju_vibe_status', status);
    if (status === 'Approved') playCelestialChime(880, 'sine', 0.4);
    else if (status === 'Caution') playCelestialChime(550, 'triangle', 0.3);
    else playCelestialChime(300, 'sawtooth', 0.4);
  };

  const handleAddVibeLog = () => {
    if (!newLogNote.trim()) return;
    const newEntry: VibeLog = {
      id: `vibe-${Date.now()}`,
      author: newLogAuthor,
      sentiment: currentVibe,
      notes: newLogNote,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    const updated = [newEntry, ...vibeLogs];
    setVibeLogs(updated);
    localStorage.setItem('juju_vibe_logs', JSON.stringify(updated));
    setNewLogNote('');
    playCelestialChime(700, 'sine', 0.2);
  };

  const handleAddDatapoint = () => {
    if (!dpSource.trim() || !dpSummary.trim()) return;
    const newDp: ExternalDatapoint = {
      id: `dp-${Date.now()}`,
      source: dpSource,
      category: 'External Model',
      summary: dpSummary,
      impactOnEssenceFlow: dpImpact || 'Steers architectural priority.',
      weight: dpWeight,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    const updated = [newDp, ...datapoints];
    setDatapoints(updated);
    localStorage.setItem('juju_datapoints', JSON.stringify(updated));
    setDpSource('');
    setDpSummary('');
    setDpImpact('');
    setIsAddingDatapoint(false);
    playCelestialChime(750, 'sine', 0.3);
  };

  const handleDeleteDatapoint = (id: string) => {
    const updated = datapoints.filter(d => d.id !== id);
    setDatapoints(updated);
    localStorage.setItem('juju_datapoints', JSON.stringify(updated));
  };

  const handleSaveDocs = (updated: VaultDoc[]) => {
    setDocs(updated);
    localStorage.setItem('juju_vault_docs', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newDoc: VaultDoc = {
        id: `doc-${Date.now()}`,
        title: file.name,
        updatedAt: new Date().toISOString().split('T')[0],
        category: 'Notes',
        content: content || 'Empty document imported.'
      };
      const updated = [newDoc, ...docs];
      handleSaveDocs(updated);
      setActiveDocId(newDoc.id);
      playCelestialChime(750, 'sine', 0.3);
    };
    reader.readAsText(file);
  };

  const handleCreateNewDoc = () => {
    if (!newDocTitle.trim()) return;
    const newDoc: VaultDoc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.endsWith('.md') ? newDocTitle : `${newDocTitle}.md`,
      updatedAt: new Date().toISOString().split('T')[0],
      category: 'Notes',
      content: newDocContent || '# Notes for Juju & External Intelligence\n\nEnter details here...'
    };
    const updated = [newDoc, ...docs];
    handleSaveDocs(updated);
    setActiveDocId(newDoc.id);
    setNewDocTitle('');
    setNewDocContent('');
    setIsAddingDoc(false);
    playCelestialChime(800, 'sine', 0.3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* ------------------------------------------------------------------- */}
      {/* Sovereign Partner Hero Banner */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border-2 border-purple-500/40 p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-9xl">
          ⚖️
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-rose-600/30 border-2 border-purple-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)]">
              <span className="text-3xl">💜</span>
              <div className="absolute -bottom-1 -right-1 text-base">🛡️</div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-100 to-amber-200 bg-clip-text text-transparent">
                  Juju's Sanctum • HUMAN REALITY ANCHOR & COMPASS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                  PARTNER SOVEREIGNTY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
                Dedicated space for Juju (Drew's wife and partner). Outside model intelligence, human reality checks, and the supreme guiding principle: <em>If Mom and Juju aren't happy, we figure it out.</em>
              </p>
            </div>
          </div>

          {/* Vibe Status Indicator Pill */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold shadow-md ${
              currentVibe === 'Approved'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : currentVibe === 'Caution'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              <span>ALIGNMENT: {currentVibe.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-5 border-t border-purple-900/30 mt-5">
          <button
            onClick={() => { playCelestialChime(750); setActiveSubTab('fly-juju'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'fly-juju'
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/50'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span className="text-base">🪰</span>
            <span>Fly Juju Studio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/30 text-pink-200 border border-pink-500/40 font-mono font-bold">
              "WHAT IF" DEMO
            </span>
          </button>

          <button
            onClick={() => { playCelestialChime(600); setActiveSubTab('compass'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'compass'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🧭</span>
            <span>Vibe Check & Veto Barometer</span>
          </button>

          <button
            onClick={() => { playCelestialChime(640); setActiveSubTab('datapoints'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'datapoints'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🌐</span>
            <span>Outside Model Datapoints Matrix</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {datapoints.length}
            </span>
          </button>

          <button
            onClick={() => { playCelestialChime(680); setActiveSubTab('craft'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'craft'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🎨</span>
            <span>No-AI Pure Craft View</span>
          </button>

          <button
            onClick={() => { playCelestialChime(720); setActiveSubTab('docs'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'docs'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>📁</span>
            <span>Juju's PC Documents Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {docs.length}
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 1: VIBE CHECK & VETO BAROMETER */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'compass' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Controls (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-purple-500/20 p-6 shadow-lg space-y-6">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-purple-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                <span>The Sovereign Directive: Juju's Reality Barometer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Juju holds supreme veto power. If something feels unnatural, overly technical, or misses the heart, she can flag caution or pause the flow.
              </p>
            </div>

            {/* Vibe Status Selector Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSetVibe('Approved')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  currentVibe === 'Approved'
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aligned</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Human heartbeat confirmed. Game feel and warmth approved.
                </p>
              </button>

              <button
                onClick={() => handleSetVibe('Caution')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  currentVibe === 'Caution'
                    ? 'bg-amber-950/60 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Caution</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Questions raised. Needs simplification or discussion.
                </p>
              </button>

              <button
                onClick={() => handleSetVibe('Veto / Halt')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  currentVibe === 'Veto / Halt'
                    ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-rose-500/40'
                }`}
              >
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Veto / Halt</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pause building until Mom and Juju are fully satisfied.
                </p>
              </button>
            </div>

            {/* Human Heartbeat Slider */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-300 uppercase tracking-wider font-semibold">
                  Human Heartbeat & Warmth Rating
                </span>
                <span className="text-amber-300 font-mono font-bold text-sm">
                  {humanScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={humanScore}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setHumanScore(val);
                  localStorage.setItem('juju_human_score', val.toString());
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 - Too Artificial / Cold</span>
                <span>5 - Balanced</span>
                <span>10 - Pure Heart & Cozy Fun</span>
              </div>
            </div>

            {/* Add Log / Conversation Note */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Log Partner Alignment & Discussion Note</span>
              </h4>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Author:</span>
                <button
                  type="button"
                  onClick={() => setNewLogAuthor('Juju')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    newLogAuthor === 'Juju' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Juju
                </button>
                <button
                  type="button"
                  onClick={() => setNewLogAuthor('Drew')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    newLogAuthor === 'Drew' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Drew
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record what Juju thinks, or what needs fixing..."
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddVibeLog()}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddVibeLog}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Record Note
                </button>
              </div>
            </div>

            {/* Conversation Timeline */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Alignment History
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vibeLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-300 font-mono">
                        {log.author} [{log.sentiment}]
                      </span>
                      <span className="text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{log.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Ground Truth Principles */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-purple-500/20 shadow-md space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>The Core Agreement</span>
              </h4>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Juju is Drew's anchor to genuine reality. While she may be skeptical of automated models, she wholeheartedly supports his vision and ensures our products are filled with genuine love and human craftsmanship.
              </p>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 italic">
                "Those outside datapoints define and decide basically everything we do."
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md space-y-3 text-xs">
              <div className="font-bold text-slate-200">The 3 Partner Guardrails:</div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mom Comes First:</strong> Mom's space must remain simple, fun, responsive, and free of confusing technical walls.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Juju Does Not Test AI:</strong> We never burden Juju with evaluating code syntax or raw models. We share finished, joyful experiences.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Outside Consensus:</strong> Always benchmark and cross-check against models outside our source to stay honest.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 2: OUTSIDE MODEL DATAPOINTS MATRIX */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'datapoints' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-purple-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span>Outside Model & External Datapoints Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Datapoints gathered by Juju from models and sources outside our environment. These define our architecture.
              </p>
            </div>

            <button
              onClick={() => setIsAddingDatapoint(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Outside Datapoint</span>
            </button>
          </div>

          {/* Add Datapoint Modal/Form */}
          {isAddingDatapoint && (
            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/50 space-y-4">
              <h4 className="font-cinzel text-sm font-bold text-purple-200">
                Log New External Datapoint
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Source / Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Juju's Outside Query / Claude 3.7 / User Survey"
                    value={dpSource}
                    onChange={(e) => setDpSource(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Weight / Priority</label>
                  <select
                    value={dpWeight}
                    onChange={(e) => setDpWeight(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Critical">Critical (Directly alters roadmap)</option>
                    <option value="High">High (Major guiding influence)</option>
                    <option value="Guiding">Guiding (Design nuance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Observation / Datapoint</label>
                <textarea
                  rows={2}
                  placeholder="What did the external model or human observation reveal?"
                  value={dpSummary}
                  onChange={(e) => setDpSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Impact on ESSENCE FL0W</label>
                <input
                  type="text"
                  placeholder="e.g. Simplified navigation tabs and added Yarn Match-3 for Mom"
                  value={dpImpact}
                  onChange={(e) => setDpImpact(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingDatapoint(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDatapoint}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save to Matrix
                </button>
              </div>
            </div>
          )}

          {/* Matrix Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datapoints.map(dp => (
              <div
                key={dp.id}
                className="p-5 rounded-2xl bg-[#0b0f19] border border-purple-500/20 hover:border-purple-500/40 shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50 font-semibold">
                      {dp.source}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Logged: {dp.dateAdded}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      dp.weight === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                    }`}>
                      {dp.weight}
                    </span>
                    <button
                      onClick={() => handleDeleteDatapoint(dp.id)}
                      className="opacity-40 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                      title="Remove datapoint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  "{dp.summary}"
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-purple-200">
                  <span className="font-mono text-[10px] text-purple-400 uppercase font-bold block mb-0.5">
                    Flow Impact:
                  </span>
                  {dp.impactOnEssenceFlow}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 3: NO-AI PURE CRAFT VIEW (Zero AI Hype Audit) */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'craft' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-purple-500/20 p-6 shadow-lg space-y-6">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-purple-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                <span>The Pure Craft Audit (Zero AI Jargon)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Because Juju cannot and does not test automated code, this audit view strips away all AI marketing fluff. It presents our work strictly as human game development, art, and storytelling.
              </p>
            </div>

            {/* Human Craft Pillars */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-amber-200 text-sm">
                  <span>1. Narrative Heart & Humor (The Delain Docks)</span>
                  <span className="text-emerald-400 font-mono">100% Hand-Authored</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  The characters Bozog, Atreyu, Kairon, and Matchstick are real creative personalities with distinct voices, flaws, and camaraderie. No sterile robotic dialogue.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-rose-200 text-sm">
                  <span>2. Instant Tactile Joy (Mom's Haven)</span>
                  <span className="text-emerald-400 font-mono">Real Interactive Games</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Yarn Match-3 cascades, cozy word puzzles, and interactive yarn looms that respond immediately with gentle chimes. Accessible to any family member on any phone or iPad.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-cyan-200 text-sm">
                  <span>3. Deterministic Physics & Retro Aesthetic</span>
                  <span className="text-emerald-400 font-mono">60 FPS Native Canvas</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Clean retro pixel rendering, zero stutter, real kinematic sliding collision, and responsive touch controls designed for tactile immersion.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md text-xs space-y-3">
              <h4 className="font-mono uppercase tracking-wider text-purple-300 font-bold">
                Juju's Quality Checklist
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Does it make Mom smile immediately?</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Is the navigation clean and uncluttered?</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Are we listening to outside models and critics?</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Is the human heart visible in every detail?</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 4: JUJU'S PC DOCUMENTS VAULT */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Document Sidebar (1 Col) */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0b0f19] border border-purple-500/20 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Juju's PC Documents</span>
                </h4>
                <button
                  onClick={() => setIsAddingDoc(true)}
                  className="p-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer"
                  title="Add new document or note"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.doc"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-3 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Document from PC</span>
              </button>

              <div className="space-y-1.5">
                {docs.map(d => (
                  <div
                    key={d.id}
                    onClick={() => { setActiveDocId(d.id); playCelestialChime(620, 'sine', 0.15); }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                      activeDocId === d.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-medium">{d.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              💡 <strong>PC File Dropzone:</strong> When you pull documents about Juju, partner feedback, or external model notes off your PC, drop them here to keep everything synced and grounded!
            </div>
          </div>

          {/* Document Content Reader / Editor (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-purple-500/20 p-6 shadow-lg">
            {isAddingDoc ? (
              <div className="space-y-4">
                <h4 className="font-cinzel text-base font-bold text-purple-200">
                  Add New Document for Juju
                </h4>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Document Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Juju_Strategic_Priorities.md"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Content (Markdown or Text)</label>
                  <textarea
                    rows={10}
                    placeholder="Type or paste notes from PC here..."
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsAddingDoc(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewDoc}
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-purple-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>{activeDoc.title}</span>
                    </h3>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Last Updated: {activeDoc.updatedAt} • Category: {activeDoc.category}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {activeDoc.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 5: FLY JUJU STUDIO ("WHAT IF SHE WAS A FLY?") */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'fly-juju' && (
        <FlyJujuStudio />
      )}
    </div>
  );
};
