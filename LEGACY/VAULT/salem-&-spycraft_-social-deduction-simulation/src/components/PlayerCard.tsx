import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  UserX, 
  Sparkles, 
  FileText,
  Skull,
  Coins
} from 'lucide-react';
import { Player, Phase, RoleId } from '../types';
import { RoleBadge } from './RoleBadge';
import { ROLES } from '../data/roles';

interface PlayerCardProps {
  player: Player;
  humanPlayer: Player;
  phase: Phase;
  isAccused?: boolean;
  onNominate?: (player: Player) => void;
  onSelectAction?: (player: Player) => void;
  onViewWill?: (player: Player) => void;
  onInspectForensics?: (player: Player) => void;
  actionButtonLabel?: string;
  actionDisabled?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  humanPlayer,
  phase,
  isAccused = false,
  onNominate,
  onSelectAction,
  onViewWill,
  onInspectForensics,
  actionButtonLabel,
  actionDisabled = false
}) => {
  const isSelf = Boolean(humanPlayer && player.id === humanPlayer.id);
  const isDead = !player.isAlive;
  const revealRole = isSelf || isDead || (humanPlayer?.role === 'judge') || (humanPlayer?.role === 'sheriff' && player.suspicionScore > 75);

  // Suspicion styling
  const suspicionColor = 
    player.suspicionScore > 65 
      ? 'bg-rose-500 text-rose-50' 
      : player.suspicionScore > 35 
        ? 'bg-amber-500 text-amber-50' 
        : 'bg-emerald-500 text-emerald-50';

  return (
    <div 
      id={`player-card-${player.id}`}
      className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
        isDead
          ? 'bg-stone-100/70 dark:bg-stone-900/40 border-stone-300 dark:border-stone-800 opacity-75'
          : isAccused
            ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400 shadow-md'
            : isSelf
              ? 'bg-stone-50 dark:bg-stone-900/90 border-amber-300 dark:border-amber-700/60 shadow-sm'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 shadow-xs'
      }`}
    >
      {/* Top Bar: Identity & Status */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm select-none shadow-xs ${
              isDead 
                ? 'bg-stone-300 text-stone-600 dark:bg-stone-800 dark:text-stone-400' 
                : isSelf 
                  ? 'bg-amber-600 text-amber-50 ring-2 ring-amber-300' 
                  : 'bg-stone-800 text-stone-100 dark:bg-stone-700'
            }`}>
              {isDead ? (
                <Skull className="w-5 h-5 text-stone-500" />
              ) : (
                player.name.substring(0, 2).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className={`text-sm font-bold tracking-tight ${isDead ? 'line-through text-stone-500' : 'text-stone-900 dark:text-stone-100'}`}>
                  {player.name}
                </h3>
                {isSelf && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {player.title}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div>
            <RoleBadge 
              roleId={player.role} 
              isUnknown={!revealRole} 
              size="sm"
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-1.5 flex-wrap my-2 text-[11px]">
          {isDead ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <Skull className="w-3 h-3 text-stone-600" /> Deceased
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Living Guest
            </span>
          )}

          {isAccused && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-amber-500 text-amber-950 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> On Witness Stand
            </span>
          )}

          {player.isRoleblockedTonight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
              Inebriated (Blocked)
            </span>
          )}

          {player.isProtectedTonight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              <Shield className="w-3 h-3 text-teal-600" /> Ward Protected
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <Coins className="w-3 h-3 text-amber-500" /> {player.coins}g
          </span>
        </div>

        {/* Suspicion Meter (TTT Style) */}
        {!isDead && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Town Suspicion Index
              </span>
              <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${suspicionColor}`}>
                {player.suspicionScore}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  player.suspicionScore > 65 
                    ? 'bg-rose-500' 
                    : player.suspicionScore > 35 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(player.suspicionScore, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Spy Party Behavioral Tells */}
        {player.behavioralTells.length > 0 && (
          <div className="mt-2.5 p-2 bg-stone-50 dark:bg-stone-950/50 rounded-lg border border-stone-200 dark:border-stone-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-1">
              <Eye className="w-3 h-3 text-amber-500" />
              Observed Manor Behavior
            </div>
            <ul className="space-y-1">
              {player.behavioralTells.slice(-2).map((tell) => (
                <li key={tell.id} className="text-xs text-stone-700 dark:text-stone-300 italic flex items-start gap-1">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>"{tell.actionText}"</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
        {isDead ? (
          <div className="flex items-center gap-1.5 w-full">
            {onViewWill && (
              <button
                id={`btn-view-will-${player.id}`}
                onClick={() => onViewWill(player)}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Read Will
              </button>
            )}
            {humanPlayer.role === 'detective' && onInspectForensics && (
              <button
                id={`btn-autopsy-${player.id}`}
                onClick={() => onInspectForensics(player)}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-cyan-50 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Forensic Inquest
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            {phase === 'day_discussion' && onNominate && !isSelf && (
              <button
                id={`btn-nominate-${player.id}`}
                onClick={() => onNominate(player)}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 dark:bg-stone-800 dark:hover:bg-rose-950/50 dark:text-stone-300 dark:hover:text-rose-300 border border-stone-300 dark:border-stone-700 flex items-center justify-center gap-1 transition-colors"
                title="Vote to send this suspect to the witness stand for court trial"
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                Accuse ({player.votesAgainst})
              </button>
            )}

            {onSelectAction && actionButtonLabel && (
              <button
                id={`btn-role-action-${player.id}`}
                onClick={() => onSelectAction(player)}
                disabled={actionDisabled}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-amber-50 shadow-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {actionButtonLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
