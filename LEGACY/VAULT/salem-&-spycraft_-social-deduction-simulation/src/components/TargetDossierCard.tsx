import React from 'react';
import { Player, Phase, RoleId } from '../types';
import { ROLES } from '../data/roles';
import { RoleBadge } from './RoleBadge';
import { 
  Gavel, 
  Eye, 
  Skull, 
  Scroll, 
  X, 
  AlertTriangle, 
  Heart, 
  Palette, 
  Beer,
  Check
} from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface TargetDossierCardProps {
  target: Player;
  humanPlayer: Player;
  phase: Phase;
  onClose: () => void;
  onNominate: (target: Player) => void;
  onJudgeOrder?: (target: Player) => void;
  onArtistSketch?: (target: Player) => void;
  onSheriffWarrant?: (target: Player) => void;
  onInspectWill?: (target: Player) => void;
  onSelectNightTarget?: (target: Player) => void;
  isNightTargetSelected?: boolean;
}

export const TargetDossierCard: React.FC<TargetDossierCardProps> = ({
  target,
  humanPlayer,
  phase,
  onClose,
  onNominate,
  onJudgeOrder,
  onArtistSketch,
  onSheriffWarrant,
  onInspectWill,
  onSelectNightTarget,
  isNightTargetSelected
}) => {
  const isSelf = target.id === humanPlayer.id;
  const isDead = !target.isAlive;
  const roleDef = ROLES[target.role] || ROLES.detective;
  
  // Role reveal rules: Judge sees all, self sees self, Sheriff sees high suspicion, dead is public
  const revealRole = isSelf || isDead || humanPlayer.role === 'judge' || (humanPlayer.role === 'sheriff' && target.suspicionScore > 75);

  const handleAccuse = () => {
    soundEngine.playGavel();
    onNominate(target);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md bg-stone-900/98 backdrop-blur-2xl border border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom-6 duration-200 text-stone-100 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Prominent Close */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-stone-100 text-base sm:text-lg leading-tight">
                {target.name}
              </h3>
              {isSelf && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  YOU
                </span>
              )}
              {isDead ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                  <Skull className="w-3 h-3" />
                  FALLEN
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVING GUEST
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {target.title} • House #{target.id.slice(-2)}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Dossier"
            className="w-10 h-10 -mr-1 -mt-1 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Identity / Dossier Status */}
        <div className="py-3 flex items-center justify-between gap-2 border-b border-stone-800/80">
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 tracking-wider">
              Assigned Role
            </div>
            {revealRole ? (
              <div className="mt-1">
                <RoleBadge roleId={target.role} size="sm" />
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-400 italic">
                <span className="w-2 h-2 rounded-full bg-stone-600" />
                <span>Unknown / Cloaked Persona</span>
              </div>
            )}
          </div>

          {/* Suspicion Meter */}
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-stone-500 tracking-wider">
              Suspicion Level
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 font-bold text-xs">
              <span className={target.suspicionScore > 65 ? 'text-rose-400' : target.suspicionScore > 35 ? 'text-amber-400' : 'text-emerald-400'}>
                {target.suspicionScore}%
              </span>
              <div className="w-16 h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className={`h-full ${target.suspicionScore > 65 ? 'bg-rose-500' : target.suspicionScore > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${target.suspicionScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Observed Behavioral Tells */}
        <div className="py-2.5">
          <div className="text-[10px] uppercase font-mono text-stone-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Observed Tells (Spy Party)</span>
            <span className="text-amber-400 font-bold">{target.behavioralTells.length} recorded</span>
          </div>
          {target.behavioralTells.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-1">No micro-behaviors yet logged for this guest.</p>
          ) : (
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {target.behavioralTells.slice(-2).map((tell) => (
                <div key={tell.id} className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-xs flex items-start gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-stone-300">"{tell.actionText}"</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contextual Tactical Action Hotbar */}
        <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
          {/* Day Actions */}
          {(phase === 'day_discussion' || phase === 'dawn') && !isSelf && target.isAlive && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAccuse}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>Accuse ({target.votesAgainst}/2)</span>
              </button>

              {humanPlayer.role === 'judge' && onJudgeOrder && (
                <button
                  onClick={() => { soundEngine.playGavel(); onJudgeOrder(target); onClose(); }}
                  className="min-h-[44px] py-2.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Judge emergency subpoena to summon directly to the gallows"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Order Trial</span>
                </button>
              )}

              {humanPlayer.role === 'artist' && onArtistSketch && (
                <button
                  onClick={() => { soundEngine.playTellDiscovered(); onArtistSketch(target); onClose(); }}
                  className="min-h-[44px] py-2.5 px-2.5 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-600 active:bg-fuchsia-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Sketch micro-tell charcoal portrait"
                >
                  <Palette className="w-4 h-4" />
                  <span>Sketch Tell</span>
                </button>
              )}

              {humanPlayer.role === 'sheriff' && onSheriffWarrant && (
                <button
                  onClick={() => { soundEngine.playGavel(); onSheriffWarrant(target); onClose(); }}
                  className="min-h-[44px] py-2.5 px-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-stone-950 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Issue official public warrant"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Warrant</span>
                </button>
              )}
            </div>
          )}

          {/* Night Actions */}
          {phase === 'night' && !isSelf && target.isAlive && onSelectNightTarget && (
            <button
              onClick={() => { onSelectNightTarget(target); onClose(); }}
              className={`min-h-[44px] w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isNightTargetSelected 
                  ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-400' 
                  : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white'
              }`}
            >
              {humanPlayer.role === 'doctor' && <Heart className="w-4 h-4" />}
              {humanPlayer.role === 'killer' && <Skull className="w-4 h-4" />}
              {humanPlayer.role === 'detective' && <Eye className="w-4 h-4" />}
              {humanPlayer.role === 'tavern_keeper' && <Beer className="w-4 h-4" />}
              <span>
                {isNightTargetSelected ? '✓ Target Confirmed' : `Target for ${roleDef.name} Night Action`}
              </span>
            </button>
          )}

          {/* Read Will */}
          {onInspectWill && (
            <button
              onClick={() => { soundEngine.playParchment(); onInspectWill(target); onClose(); }}
              className="min-h-[44px] w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scroll className="w-4 h-4 text-amber-400" />
              <span>Inspect Last Will & Records</span>
            </button>
          )}

          {/* Explicit Dismiss Button to Never Break Flow */}
          <button
            onClick={onClose}
            className="min-h-[44px] w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 active:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-stone-400" />
            <span>Close Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
