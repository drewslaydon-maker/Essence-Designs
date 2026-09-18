import React, { useState } from 'react';
import { 
  Heart, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Sparkles, 
  Smartphone, 
  Tablet, 
  Monitor, 
  QrCode,
  Send,
  Gamepad2
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

interface ShareWithMomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMomTab?: () => void;
}

export const ShareWithMomModal: React.FC<ShareWithMomModalProps> = ({
  isOpen,
  onClose,
  onOpenMomTab
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://ais-pre-mmfmy3xartspch52dybgq2-685385347118.us-west2.run.app';

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      playCelestialChime(880, 'sine', 0.4);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="share-mom-modal"
        className="relative w-full max-w-lg bg-[#0d1322] border-2 border-rose-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.25)] text-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Heart className="w-6 h-6 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-lg font-bold text-rose-200">
                Share ESSENCE FL0W with Mom
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/50">
                ATREYU'S HAVEN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live link to share instantly with Mom on any phone, tablet, or PC!
            </p>
          </div>
        </div>

        {/* Warm Note Box */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 mb-5 text-xs text-rose-100 leading-relaxed">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ready for Mom — Zero Logins or Downloads</span>
          </div>
          Mom can jump straight into <strong className="text-amber-200">Atreyu's Yarn Haven</strong> to play 
          Candy-Crush style <strong className="text-rose-200">Yarn Crush match-3</strong>, cozy word puzzles, weave custom yarn blankets on the loom, or explore Atreyu's tavern lore!
        </div>

        {/* Link Card with Copy */}
        <div className="mb-5">
          <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Public Live Link
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-xs text-cyan-300">
            <span className="truncate flex-1 pl-2 select-all">
              {shareUrl}
            </span>
            <button
              id="copy-share-mom-link-btn"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Device Compatibility */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Smartphone className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-[11px] font-medium text-slate-300">iPhone / Android</div>
            <div className="text-[10px] text-slate-500">Touch & swipe</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Tablet className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[11px] font-medium text-slate-300">iPad / Tablet</div>
            <div className="text-[10px] text-slate-500">Great for yarn & games</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Monitor className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-[11px] font-medium text-slate-300">Laptop / Desktop</div>
            <div className="text-[10px] text-slate-500">Full screen experience</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              if (onOpenMomTab) {
                onOpenMomTab();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-rose-400" />
            <span>Preview Mom's Space First</span>
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
          >
            <span>Open Link in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
