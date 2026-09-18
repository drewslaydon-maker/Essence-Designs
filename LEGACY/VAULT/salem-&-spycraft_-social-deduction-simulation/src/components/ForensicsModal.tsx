import React from 'react';
import { 
  Search, 
  X, 
  Clock, 
  AlertTriangle, 
  Footprints, 
  Dna, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { ForensicReport } from '../types';
import { RoleBadge } from './RoleBadge';

interface ForensicsModalProps {
  report: ForensicReport;
  onClose: () => void;
}

export const ForensicsModal: React.FC<ForensicsModalProps> = ({
  report,
  onClose
}) => {
  return (
    <div 
      id="forensics-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-stone-900 border border-cyan-800 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-700/60 text-cyan-400 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Detective Dossier — TTT Forensics
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Crime Scene Inquest: {report.victimName}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-forensics"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Forensics Report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certainty Meter */}
        <div className="mb-5 p-3.5 bg-cyan-950/40 border border-cyan-900/50 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Forensic Certainty: Absolute Prerogative
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Detective findings bypass civilian hearsay and represent physical proof.
            </p>
          </div>
          <div className="text-right font-mono text-cyan-300 font-bold text-base">
            {report.certaintyPercent}%
          </div>
        </div>

        {/* Autopsy Details */}
        <div className="space-y-3 mb-5">
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-500 font-semibold block">Deceased Victim:</span>
              <span className="font-bold text-white text-sm">{report.victimName}</span>
              <div className="mt-1">
                <RoleBadge roleId={report.victimRole} size="sm" />
              </div>
            </div>

            <div>
              <span className="text-stone-500 font-semibold block">Cause of Death:</span>
              <span className="font-bold text-rose-400">{report.causeOfDeath}</span>
              <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {report.timeEstimated}
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs">
            <span className="text-stone-500 font-semibold block mb-1">Identified Murder Implement:</span>
            <div className="p-2 bg-stone-900 rounded-lg font-mono text-amber-300 font-semibold border border-stone-800">
              {report.weaponType}
            </div>
          </div>

          {/* Forensic Clues & Footprints */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs">
            <span className="text-stone-500 font-semibold flex items-center gap-1 mb-2">
              <Footprints className="w-3.5 h-3.5 text-cyan-400" />
              Ballistic Scuffs & Environmental Evidence:
            </span>
            <ul className="space-y-1.5 pl-2 border-l-2 border-cyan-800/60">
              {report.clues.map((clue, idx) => (
                <li key={idx} className="text-stone-300 italic">
                  "{clue}"
                </li>
              ))}
            </ul>
          </div>

          {/* DNA Match Registry (TTT DNA Scanner) */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs">
            <span className="text-stone-500 font-semibold flex items-center gap-1 mb-2">
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              Genetic Epithelial Scans (Suspected Night Visitors):
            </span>
            <div className="flex flex-wrap gap-2">
              {report.dnaMatches.map((name, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/80 text-purple-200 font-bold font-mono text-xs"
                >
                  🧬 {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            id="btn-dismiss-forensics"
            onClick={onClose}
            className="min-h-[44px] py-2.5 px-6 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white shadow-md cursor-pointer transition-all"
          >
            Archive Findings & Close
          </button>
        </div>

      </div>
    </div>
  );
};
