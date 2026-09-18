import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { GitRepoState, Ticket } from '../types';
import { playCelestialChime, playDispatchSound, playRuneCastSound } from '../utils/audio';

interface LocalBridgeAndGitViewProps {
  gitState: GitRepoState;
  onUpdateGitState: (updated: GitRepoState) => void;
  tickets: Ticket[];
}

export const LocalBridgeAndGitView: React.FC<LocalBridgeAndGitViewProps> = ({
  gitState,
  onUpdateGitState,
  tickets,
}) => {
  const [repoUrl, setRepoUrl] = useState(gitState.url);
  const [selectedBranch, setSelectedBranch] = useState(gitState.branch);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isGeneratingCommit, setIsGeneratingCommit] = useState(false);
  const [commitDecree, setCommitDecree] = useState<any | null>(null);

  const completedTickets = tickets.filter((t) => t.status === 'merged' || t.status === 'qa_inspection');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    playCelestialChime(880, 'sine', 0.2);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleGenerateCommitDecree = async () => {
    setIsGeneratingCommit(true);
    playRuneCastSound();

    try {
      const res = await fetch('/api/git/generate-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTickets: completedTickets.map((t) => ({ id: t.id, title: t.title, agent: t.targetAgent })),
          branch: selectedBranch,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to synthesize commit decree.');
      }

      setCommitDecree(data.result);
      playDispatchSound();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCommit(false);
    }
  };

  const handleSaveRepoSettings = () => {
    playCelestialChime(660, 'sine', 0.2);
    onUpdateGitState({
      ...gitState,
      url: repoUrl,
      branch: selectedBranch,
      lastSync: 'Synchronized with Astral Hub (Just now)',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-700/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-decorative text-2xl text-cyan-400 glow-rune">ᚲ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300/80">Continuous Creative Flow</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
            Local Machine Bridge & Starlight Git Chronicle
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Bi-directional conduit connecting Cloud agents (WAVE, ORACLE) with your physical local machines (Director OMEGA, Mechanic, QA Sentinel) and Git repository.
          </p>
        </div>

        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 text-xs font-mono transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Git Repo</span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Repo Configuration & Local Daemon Command (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Git Config Box */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-slate-200 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              Project Repository Synchronization
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Git Repository URL</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/game-repo"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Active Tracked Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              >
                {gitState.branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveRepoSettings}
              className="w-full py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-cinzel font-semibold transition-colors cursor-pointer"
            >
              Update Repository Settings
            </button>
          </div>

          {/* Local Machine Dispatch Runner Commands */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Local Machine Runner Packet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Run these commands in your local machine terminal to pull tickets directly into your local IDE or game test runner:
            </p>

            <div className="space-y-2">
              {/* Command 1: Pull Ticket */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>1. Pull Latest Ticket via CLI</span>
                  <button
                    onClick={() => handleCopy(`npx essence-flow pull --ticket EFH-101 --agent mechanic`, 'cmd1')}
                    className="text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'cmd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCmd === 'cmd1' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-200 select-all overflow-x-auto">
                  <code>npx essence-flow pull --ticket EFH-101 --agent mechanic</code>
                </div>
              </div>

              {/* Command 2: Start Local Physics & QA Daemon */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>2. Run Local QA Sentinel Automated Playtest</span>
                  <button
                    onClick={() => handleCopy(`npm run test:qa -- --ticket EFH-103 --target 60fps`, 'cmd2')}
                    className="text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCmd === 'cmd2' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-200 select-all overflow-x-auto">
                  <code>npm run test:qa -- --ticket EFH-103 --target 60fps</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Commit Synthesizer & Starlight Git Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Director OMEGA Commit Synthesis */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-cinzel text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Director OMEGA: Commit & PR Synthesizer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates conventional git commits and PR summaries from completed tickets.
                </p>
              </div>

              <button
                onClick={handleGenerateCommitDecree}
                disabled={isGeneratingCommit}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-cinzel text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                {isGeneratingCommit ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Synthesize Decree</span>
              </button>
            </div>

            {commitDecree && (
              <div className="parchment-scroll rounded-lg border border-purple-500/30 p-4 space-y-3 text-xs animate-in fade-in duration-200">
                <div>
                  <div className="text-[10px] font-mono text-purple-300 uppercase">Commit Title:</div>
                  <div className="font-mono text-xs text-slate-100 font-bold bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                    {commitDecree.commitTitle}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-purple-300 uppercase">PR Description:</div>
                  <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 mt-1 overflow-x-auto whitespace-pre-wrap">
                    {commitDecree.prDescription}
                  </pre>
                </div>

                {commitDecree.runicBlessing && (
                  <div className="italic text-purple-200/90 font-cinzel pt-2 border-t border-purple-500/20 text-[11px]">
                    &ldquo;{commitDecree.runicBlessing}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Starlight Git Commit Chronicle */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-slate-100 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              Chronicle of Starlight (Recent Repository Commits)
            </h3>

            <div className="space-y-2">
              {gitState.commits.map((c) => (
                <div
                  key={c.hash}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-decorative text-base text-amber-400 mt-0.5">{c.rune}</span>
                    <div>
                      <div className="font-mono text-xs text-slate-200 font-medium">
                        {c.message}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {c.author} • {c.timestamp} • <span className="text-cyan-400">{c.branch}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-cyan-300">
                    {c.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
