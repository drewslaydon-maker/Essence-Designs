import { FC, useEffect, useState } from "react";
import {
  GitBranch,
  Key,
  Check,
  AlertCircle,
  ExternalLink,
  Download,
  FolderDown,
  RefreshCw,
  Terminal,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  Database,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";

interface GitSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitSyncModal: FC<GitSyncModalProps> = ({ isOpen, onClose }) => {
  const { playSfx } = useAppStore();

  const [repoUrl, setRepoUrl] = useState<string>(() =>
    localStorage.getItem("apparatus_gh_repo") || "brokenelysium/Lotus_Adversity_Game",
  );
  const [token, setToken] = useState<string>(() => localStorage.getItem("apparatus_gh_token") || "");
  const [branch, setBranch] = useState<string>(() => localStorage.getItem("apparatus_gh_branch") || "main");
  const [commitMessage, setCommitMessage] = useState<string>(
    "feat(apparatus): v2 client rebuild ratified to truth holder",
  );
  const [forcePush, setForcePush] = useState<boolean>(false);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [subtab, setSubtab] = useState<"push" | "mac">("push");

  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [logOutput, setLogOutput] = useState<string>("");

  useEffect(() => { if (repoUrl) localStorage.setItem("apparatus_gh_repo", repoUrl); }, [repoUrl]);
  useEffect(() => { if (token) localStorage.setItem("apparatus_gh_token", token); }, [token]);
  useEffect(() => { if (branch) localStorage.setItem("apparatus_gh_branch", branch); }, [branch]);

  if (!isOpen) return null;

  const pushToGitHub = async () => {
    if (!token.trim() || !repoUrl.trim()) {
      setStatus("error");
      setStatusMessage("Both a Personal Access Token (PAT) and a repository (username/repo) are required.");
      playSfx("anvil");
      return;
    }
    setIsPushing(true);
    setStatus("idle");
    setStatusMessage("");
    setLogOutput("");
    playSfx("click");
    try {
      const response = await fetch("/api/git-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: token.trim(),
          branch: branch.trim() || "main",
          commitMessage: commitMessage.trim(),
          forcePush,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage(data.message || "Successfully pushed to GitHub.");
        setLogOutput(data.output || "");
        playSfx("shield");
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Failed to push to the repository.");
        setLogOutput(data.details || "");
        playSfx("anvil");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err?.message || "Network error while contacting the sync engine.");
      playSfx("anvil");
    } finally {
      setIsPushing(false);
    }
  };

  const downloadZip = () => {
    playSfx("scribe");
    window.location.href = "/api/export-project-zip";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between gap-3 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-neutral-100 uppercase tracking-wide">
                  Truth Holder Sync
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                  Direct
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Push the working tree to GitHub with zero terminal commands.
              </p>
            </div>
          </div>
          <button
            onClick={() => { playSfx("click"); onClose(); }}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-3 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950">
          <button
            onClick={() => { setSubtab("push"); playSfx("click"); }}
            className={`pb-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              subtab === "push" ? "border-amber-400 text-amber-300" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>1-Click Push</span>
          </button>
          <button
            onClick={() => { setSubtab("mac"); playSfx("click"); }}
            className={`pb-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              subtab === "mac" ? "border-amber-400 text-amber-300" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>Mac &amp; Export</span>
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto font-sans text-xs">
          {subtab === "push" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Repository</span>
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">Format: username/repo</span>
                </div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="brokenelysium/Lotus_Adversity_Game"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label className="font-mono text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personal Access Token (PAT)</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=TheApparatus-TruthHolder"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Generate token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Stored in browser session only. Never written into git plain-text config.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-neutral-300 block">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold text-neutral-300 block">Commit Summary</label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/40 border border-neutral-800">
                <div>
                  <span className="font-mono font-bold text-neutral-300 text-xs block">Force Push Override</span>
                  <span className="text-[11px] text-neutral-500">Divergent history recovery</span>
                </div>
                <input
                  type="checkbox"
                  checked={forcePush}
                  onChange={(e) => setForcePush(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <button
                disabled={isPushing}
                onClick={pushToGitHub}
                className={`w-full py-3.5 px-4 rounded-xl font-cinzel font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                  isPushing
                    ? "bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 border border-amber-300 shadow-amber-950/40"
                }`}
              >
                {isPushing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Executing Push...</span>
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4" />
                    <span>Push Current State to GitHub</span>
                  </>
                )}
              </button>

              {status !== "idle" && (
                <div className={`p-4 rounded-xl border space-y-2 ${
                  status === "success"
                    ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                    : "bg-red-950/30 border-red-500/50 text-red-200"
                }`}>
                  <div className="flex items-center gap-2 font-mono font-bold text-xs">
                    {status === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{statusMessage}</span>
                  </div>
                  {logOutput && (
                    <div className="p-2.5 rounded-lg bg-black/60 border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {logOutput}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Terminal className="w-4 h-4" />
                  <span>MAC WORKFLOW — GITHUB DESKTOP (ZERO TERMINAL)</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed font-sans">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <div><strong className="text-neutral-200">Push here first:</strong> use the 1-Click Push tab to send the ratified tree to GitHub.</div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <div><strong className="text-neutral-200">Open GitHub Desktop on Mac:</strong> File &gt; Clone Repository &gt; <span className="font-mono text-amber-300">{repoUrl}</span>.</div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <div><strong className="text-neutral-200">Fetch origin / Pull:</strong> all files land in Finder automatically. No terminal required.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-xs text-neutral-200">
                    <FolderDown className="w-4 h-4 text-amber-400" />
                    <span>Instant Project Download (.zip)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">Offline Archive</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pull the entire raw source archive straight onto your Mac without touching GitHub.
                </p>
                <button
                  onClick={downloadZip}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download TheApparatus-Project.zip</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AGENTS.md Rule 0: Git is the Absolute Truth Holder</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200 cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
};