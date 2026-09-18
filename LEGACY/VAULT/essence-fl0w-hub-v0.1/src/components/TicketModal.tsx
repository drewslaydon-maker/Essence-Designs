import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  ExternalLink,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Ticket, TicketStatus, AgentId } from '../types';
import { playCelestialChime, playDispatchSound } from '../utils/audio';

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateTicket: (updated: Ticket) => void;
  onDirectToCleanroom?: (ticket: Ticket) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  onClose,
  onUpdateTicket,
  onDirectToCleanroom,
}) => {
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleToggleCriterion = (criterionId: string) => {
    playCelestialChime(587.33, 'sine', 0.2);
    const updatedCriteria = ticket.acceptanceCriteria.map((c) => 
      c.id === criterionId ? { ...c, completed: !c.completed } : c
    );
    onUpdateTicket({
      ...ticket,
      acceptanceCriteria: updatedCriteria,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCopyCommand = () => {
    if (ticket.localDispatchCommand) {
      navigator.clipboard.writeText(ticket.localDispatchCommand);
      setCopied(true);
      playCelestialChime(880, 'sine', 0.3);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusOrder: TicketStatus[] = [
    'backlog',
    'cleanroom',
    'dispatched',
    'mechanic_forge',
    'qa_inspection',
    'merged',
  ];

  const statusLabels: Record<TicketStatus, string> = {
    backlog: 'Celestial Backlog',
    cleanroom: 'WAVE Cleanroom',
    dispatched: 'Dispatched to Local',
    mechanic_forge: 'Mechanic Forge',
    qa_inspection: 'QA Sentinel',
    merged: 'Constellation Merged',
  };

  const currentIdx = statusOrder.indexOf(ticket.status);
  const nextStatus = currentIdx < statusOrder.length - 1 ? statusOrder[currentIdx + 1] : null;

  const handleAdvanceStatus = () => {
    if (nextStatus) {
      playDispatchSound();
      onUpdateTicket({
        ...ticket,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl parchment-scroll rounded-xl border border-amber-500/30 text-slate-200 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Parchment Corner Runes */}
        <span className="absolute top-3 left-4 font-decorative text-xs text-amber-500/40 select-none">ᚠ</span>
        <span className="absolute top-3 right-10 font-decorative text-xs text-amber-500/40 select-none">ᛟ</span>
        <span className="absolute bottom-3 left-4 font-decorative text-xs text-amber-500/40 select-none">ᛞ</span>
        <span className="absolute bottom-3 right-4 font-decorative text-xs text-amber-500/40 select-none">ᛃ</span>

        {/* Close Button */}
        <button
          id="close-ticket-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-700/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded font-mono text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <span className="font-decorative">{ticket.runeAffinity.split(' ')[0] || 'ᛈ'}</span>
            {ticket.id}
          </span>

          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-900/80 text-cyan-300 border border-cyan-800/40">
            {statusLabels[ticket.status]}
          </span>

          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-950/50 text-purple-300 border border-purple-700/40">
            Agent: {ticket.targetAgent.toUpperCase()}
          </span>

          <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-800/40">
            Rank: {ticket.difficultyRank}
          </span>

          {ticket.purityScore !== undefined && (
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
              Purity: {ticket.purityScore}%
            </span>
          )}

          {ticket.isBlocked && (
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/60 flex items-center gap-1 shadow-sm">
              <Lock className="w-3 h-3 text-rose-400" />
              DEVELOPMENT LOCKED
            </span>
          )}
        </div>

        {/* Blocked Warning Banner if ticket is blocked */}
        {ticket.isBlocked && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs font-mono text-rose-200 flex items-start gap-2.5 shadow-md">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-300 uppercase tracking-wider mb-0.5">
                Blocker Alert: Local Aider / Gemini API Routing
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {ticket.blockedReason || 'Development is temporarily locked due to API issues routing Gemini through Aider. Coding will resume once the API conduit is operational.'}
              </p>
            </div>
          </div>
        )}

        {/* Title & Core Objective */}
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100 tracking-wide mb-2">
          {ticket.title}
        </h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed font-sans border-l-2 border-amber-500/30 pl-3">
          {ticket.objective}
        </p>

        {/* Architectural Reasoning & Intent */}
        {(ticket.reasoning || ticket.oracleProphecy) && (
          <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 text-xs text-amber-200/95 font-sans flex items-start gap-3 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-cinzel font-bold text-amber-300 text-[11px] uppercase tracking-wider mb-0.5">
                Architectural Reasoning & Rationale
              </div>
              <p className="leading-relaxed text-slate-300">
                {ticket.reasoning || ticket.oracleProphecy}
              </p>
            </div>
          </div>
        )}

        {/* Math & Physics Specifications */}
        {ticket.mathematicalOrPhysicsSpec && (
          <div className="mb-6">
            <h3 className="font-cinzel text-xs uppercase tracking-widest text-cyan-300 font-semibold mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Mechanic / Physicist Formula Specification
            </h3>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-900/40 font-mono text-xs text-cyan-200/90 overflow-x-auto">
              <code>{ticket.mathematicalOrPhysicsSpec}</code>
            </div>
          </div>
        )}

        {/* Acceptance Criteria Checklist */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-cinzel text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              Acceptance Decrees ({ticket.acceptanceCriteria.filter(c => c.completed).length}/{ticket.acceptanceCriteria.length})
            </h3>
          </div>
          <div className="space-y-2">
            {ticket.acceptanceCriteria.map((c) => (
              <button
                key={c.id}
                onClick={() => handleToggleCriterion(c.id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  c.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                {c.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className={`text-xs leading-relaxed ${c.completed ? 'line-through text-slate-400' : ''}`}>
                  {c.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Local Machine Dispatch Command */}
        {ticket.localDispatchCommand && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                Local Machine Dispatch Command
              </span>
              <button
                id="copy-dispatch-command-btn"
                onClick={handleCopyCommand}
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied to clipboard' : 'Copy command'}
              </button>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 select-all overflow-x-auto">
              <code>{ticket.localDispatchCommand}</code>
            </div>
          </div>
        )}

        {/* Code Starter Snippet if present */}
        {ticket.codeStarterSnippet && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-emerald-400" />
                Starter Blueprint
              </span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
              <code>{ticket.codeStarterSnippet}</code>
            </pre>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-500/20">
          <div className="flex items-center gap-2">
            {onDirectToCleanroom && (
              <button
                id="send-to-cleanroom-btn"
                onClick={() => {
                  onDirectToCleanroom(ticket);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Inspect in WAVE Cleanroom
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {nextStatus && (
              <button
                id="advance-ticket-status-btn"
                onClick={handleAdvanceStatus}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <span>Advance to {statusLabels[nextStatus]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
