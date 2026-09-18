import React, { useState } from 'react';
import { NewspaperArticle } from '../types';
import { NEWSPAPER_ISSUES } from '../data/loreAndCooking';
import { playAudio } from '../audio';
import { X, BookOpen, Clock, AlertTriangle, Sparkles, ChevronRight, FileText } from 'lucide-react';

interface MinerIssueModalProps {
  unlockedIssueIds: string[];
  onClose: () => void;
}

export const MinerIssueModal: React.FC<MinerIssueModalProps> = ({
  unlockedIssueIds,
  onClose,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string>(() => {
    // Default to the newest unlocked issue
    const available = NEWSPAPER_ISSUES.filter(
      (iss) => iss.unlockedByDefault || unlockedIssueIds.includes(iss.id)
    );
    return available.length > 0 ? available[available.length - 1].id : NEWSPAPER_ISSUES[0].id;
  });

  const activeIssue =
    NEWSPAPER_ISSUES.find((iss) => iss.id === selectedIssueId) || NEWSPAPER_ISSUES[0];

  const handleSelectIssue = (id: string) => {
    playAudio('paper');
    setSelectedIssueId(id);
  };

  return (
    <div
      id="miner-issue-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="newspaper-sheet"
        className="relative w-full max-w-5xl h-[96vh] sm:h-[92vh] max-h-none sm:max-h-[850px] bg-[#f5efe1] text-stone-900 rounded-sm shadow-2xl flex flex-col overflow-hidden border-2 sm:border-8 sm:border-double border-[#8b7d6b]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 0 40px rgba(180, 150, 110, 0.25)',
        }}
      >
        {/* Newspaper Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-[#eae0cd] border-b border-[#c8bcab] text-xs font-mono text-stone-700 select-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold tracking-wider sm:tracking-widest uppercase text-[11px] sm:text-xs">Mountain Town Gazette</span>
            <span className="hidden sm:inline">•</span>
            <span className="italic text-[10px] sm:text-xs hidden sm:inline">Volume XXIV</span>
          </div>
          <button
            id="close-newspaper-btn"
            onClick={() => {
              playAudio('paper');
              onClose();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-stone-800 text-stone-100 rounded hover:bg-stone-900 transition-colors cursor-pointer text-xs font-sans font-semibold uppercase tracking-wider"
          >
            <X className="w-4 h-4" />
            <span>Fold</span>
            <span className="hidden sm:inline"> Paper [ESC]</span>
          </button>
        </div>

        {/* Main Content Area: Left Issue Selector & Right Newspaper Page */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Issue Shelf (Horizontal strip on mobile, vertical sidebar on desktop) */}
          <div className="w-full md:w-64 bg-[#e8deca] border-b md:border-b-0 md:border-r border-[#c2b49e] p-2 sm:p-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 select-none touch-pan-x">
            <div className="hidden md:flex items-center gap-2 px-2 py-1 text-xs font-bold font-serif uppercase tracking-wider text-stone-700 border-b border-stone-400">
              <FileText className="w-4 h-4 text-amber-800" />
              <span>Gazette Archive</span>
            </div>

            <div className="flex flex-row md:flex-col gap-1.5 min-w-0">
              {NEWSPAPER_ISSUES.map((iss) => {
                const isUnlocked = iss.unlockedByDefault || unlockedIssueIds.includes(iss.id);
                const isSelected = iss.id === activeIssue.id;

                return (
                  <button
                    key={iss.id}
                    disabled={!isUnlocked}
                    onClick={() => handleSelectIssue(iss.id)}
                    className={`text-left p-2 sm:p-2.5 rounded transition-all border min-w-[160px] sm:min-w-[180px] md:min-w-0 shrink-0 md:shrink ${
                      isSelected
                        ? 'bg-[#dfceb3] border-stone-800 shadow-inner'
                        : isUnlocked
                        ? 'bg-[#f7f3ea] border-stone-300 hover:bg-[#fffdf9] cursor-pointer'
                        : 'bg-stone-300/40 border-dashed border-stone-400 opacity-55 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-stone-600">
                      <span>Issue #{iss.issueNumber}</span>
                      {iss.id.includes('extra') && (
                        <span className="px-1.5 py-0.2 bg-amber-700 text-amber-100 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
                          Extra
                        </span>
                      )}
                    </div>
                    <div className="font-serif font-bold text-xs text-stone-900 truncate mt-0.5">
                      {isUnlocked ? iss.headline : 'Classified by Black Ridge'}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-stone-500 truncate mt-0.5">
                      {isUnlocked ? iss.dateStr : iss.unlockedConditionText}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:block mt-auto p-2 bg-[#dfceb3]/60 rounded text-[11px] text-stone-700 border border-stone-400/50">
              <div className="font-bold font-serif flex items-center gap-1 text-amber-900">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Living Press</span>
              </div>
              <p className="mt-1 leading-snug">
                As you rescue trapped miners and delve into Big Cave, new Extra editions are typeset in town.
              </p>
            </div>
          </div>

          {/* Broadside Newspaper View */}
          <div className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto bg-[#faf6ee] flex flex-col">
            {/* Masthead Banner */}
            <div className="border-b-2 sm:border-b-4 border-stone-900 pb-2 sm:pb-3 text-center">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-serif italic text-stone-700 border-b border-stone-400 pb-1 mb-1.5 sm:mb-2 px-1 sm:px-2">
                <span>No. {activeIssue.issueNumber}</span>
                <span className="font-bold tracking-wider sm:tracking-widest uppercase">The Voice of Appalachian Miners</span>
                <span>{activeIssue.dateStr}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-stone-900 uppercase">
                THE MINER ISSUE
              </h1>

              <div className="text-[9px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-stone-600 uppercase mt-0.5 sm:mt-1">
                Mountain Town Weekly • Truth Without Corporate Favor • 2 Cents
              </div>
            </div>

            {/* Headline Section */}
            <div className="my-3 sm:my-5 border-b-2 border-stone-800 pb-3 sm:pb-4">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-black leading-tight text-stone-950 uppercase tracking-tight">
                {activeIssue.headline}
              </h2>
              <div className="font-serif italic text-sm md:text-base text-stone-700 mt-1.5 font-medium">
                {activeIssue.subheadline}
              </div>
            </div>

            {/* Articles Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif text-sm leading-relaxed text-stone-900 flex-1">
              {/* Main Article Columns (2 columns wide on desktop) */}
              <div className="md:col-span-2 space-y-4 md:border-r border-stone-300 md:pr-6 text-justify">
                {activeIssue.bodyParagraphs.map((para, idx) => (
                  <p key={idx} className={idx === 0 ? 'first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-stone-900' : ''}>
                    {para}
                  </p>
                ))}

                {/* Subterranean Culinary Rumor Box */}
                <div className="mt-6 p-4 bg-[#ede2cf] border-2 border-amber-900/40 rounded-sm shadow-sm">
                  <div className="flex items-center gap-2 text-amber-950 font-bold uppercase tracking-wider text-xs border-b border-amber-900/20 pb-1 font-mono">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span>Hearth & Skillet Rumor Column</span>
                  </div>
                  <p className="font-serif italic text-stone-800 text-xs md:text-sm mt-2 leading-relaxed">
                    "{activeIssue.culinaryRumor}"
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-amber-900 flex items-center gap-1 font-semibold">
                    <span>💡 Tip:</span>
                    <span>Test these ingredients on The Digger's field galley to unlock new recipes!</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Column: Editorial Desk & Historical Vignette */}
              <div className="space-y-5">
                <div className="p-4 bg-[#f0e8d8] border border-stone-400/80 rounded-sm">
                  <h3 className="font-serif font-black uppercase text-xs tracking-wider text-stone-900 border-b border-stone-400 pb-1">
                    Editorial Opinion
                  </h3>
                  <p className="font-serif italic text-xs leading-relaxed text-stone-800 mt-2">
                    {activeIssue.editorialColumn}
                  </p>
                </div>

                <div className="p-3 bg-[#e8decb] border-2 border-dashed border-stone-400 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600">
                    NOTICE TO LOCAL FAMILIES
                  </div>
                  <div className="font-serif font-bold text-xs text-stone-900 mt-1">
                    The Digger Rig On Track 4
                  </div>
                  <p className="text-[11px] text-stone-700 mt-1 leading-normal">
                    Equipped with heavy coal stoves and reinforced armor. Designed to sustain prospectors when corporate rations fail.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-stone-500 text-center border-t border-stone-300 pt-3">
                  Mountain Town Gazette Printworks • Est. 1888
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-6 pt-3 border-t-2 border-stone-900 flex flex-wrap items-center justify-between text-xs font-mono text-stone-600">
              <span>Read thoroughly for clues on cave faults and subterranean ingredients.</span>
              <span className="font-bold text-stone-800">Issue #{activeIssue.issueNumber} of {NEWSPAPER_ISSUES.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
