import React, { useState } from 'react';
import { X, GitBranch, ExternalLink, Copy, Check, Terminal, Radio } from 'lucide-react';
import { GitRepoState } from '../types';
import { playCelestialChime } from '../utils/audio';

interface GitConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  gitState: GitRepoState;
  onUpdateGitState: (updated: GitRepoState) => void;
}

export const GitConfigModal: React.FC<GitConfigModalProps> = ({
  isOpen,
  onClose,
  gitState,
  onUpdateGitState,
}) => {
  const [repoUrl, setRepoUrl] = useState(gitState.url);
  const [branch, setBranch] = useState(gitState.branch);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    playCelestialChime(700, 'sine', 0.2);
    onUpdateGitState({
      ...gitState,
      url: repoUrl,
      branch,
      lastSync: 'Synchronized (Just now)',
    });
    onClose();
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${repoUrl} && cd essence-flow-games && git checkout ${branch}`);
    setCopied(true);
    playCelestialChime(880, 'sine', 0.2);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg parchment-scroll rounded-xl border border-cyan-500/30 text-slate-200 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <h3 className="font-cinzel text-base font-bold text-slate-100">
            Project Git Repository Conduit
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Git Repository URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Active Working Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {gitState.branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Local Checkout Command:</span>
              <button
                onClick={handleCopyClone}
                className="text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-200 overflow-x-auto select-all">
              <code>git clone {repoUrl} && git checkout {branch}</code>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 font-mono"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open on GitHub</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold font-cinzel transition-colors cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
