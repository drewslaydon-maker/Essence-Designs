import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Check, 
  Scroll, 
  Feather, 
  Plus,
  BookOpen
} from 'lucide-react';
import { Player } from '../types';

interface WillEditorModalProps {
  player: Player;
  onSaveWill: (newWill: string) => void;
  onClose: () => void;
  isReadOnly?: boolean;
}

export const WillEditorModal: React.FC<WillEditorModalProps> = ({
  player,
  onSaveWill,
  onClose,
  isReadOnly = false
}) => {
  const [content, setContent] = useState<string>(player.will || '');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = () => {
    onSaveWill(content);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const insertTemplate = (snippet: string) => {
    setContent(prev => (prev ? prev + '\n' + snippet : snippet));
  };

  return (
    <div 
      id="will-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400 flex items-center justify-center shrink-0">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Town of Salem Testament
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isReadOnly ? `Testament of ${player.name}` : 'Your Last Will & Testament'}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-will"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Testament"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Info */}
        <p className="text-xs text-stone-400 mb-3">
          {isReadOnly 
            ? "This document was discovered on the victim's person following their tragic demise."
            : "Should you fall in the night or hang at the gallows, this testament will be read aloud to all living townsfolk at dawn."}
        </p>

        {/* Templates for Active Writing */}
        {!isReadOnly && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              onClick={() => insertTemplate(`Night 1: Visited - Result: `)}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Night Log
            </button>
            <button
              onClick={() => insertTemplate(`Prime Suspects: `)}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Suspects List
            </button>
            <button
              onClick={() => insertTemplate(`If I die tonight, interrogate: `)}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-stone-800 hover:bg-stone-700 text-rose-300 border border-stone-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Dying Accusation
            </button>
          </div>
        )}

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            id="will-content-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={isReadOnly}
            rows={10}
            className={`w-full font-mono text-xs p-4 bg-stone-950 border rounded-xl leading-relaxed resize-none focus:outline-hidden ${
              isReadOnly 
                ? 'border-stone-800 text-stone-300' 
                : 'border-amber-700/50 text-amber-100 focus:border-amber-500'
            }`}
            placeholder="Write your discoveries, track roles, and leave guidance for the remaining town..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <div>
            {savedNotice && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Sealed & Recorded in Pocket
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="min-h-[44px] py-2 px-5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-300 transition-colors cursor-pointer"
            >
              Close
            </button>
            {!isReadOnly && (
              <button
                id="btn-save-will"
                onClick={handleSave}
                className="min-h-[44px] py-2 px-5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                Seal Testament
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
