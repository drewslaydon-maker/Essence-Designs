import React, { useState } from 'react';
import { 
  Moon, 
  HeartPulse, 
  Skull, 
  Search, 
  ShieldCheck, 
  Beer, 
  Dices, 
  Sparkles, 
  Footprints, 
  Feather, 
  Check,
  AlertCircle
} from 'lucide-react';
import { Player, RoleId } from '../types';
import { ROLES } from '../data/roles';
import { NightActionChoice } from '../utils/gameEngine';

interface NightActionPanelProps {
  humanPlayer: Player;
  livingPlayers: Player[];
  onCommitAction: (choice: NightActionChoice) => void;
  dayNumber: number;
}

export const NightActionPanel: React.FC<NightActionPanelProps> = ({
  humanPlayer,
  livingPlayers,
  onCommitAction,
  dayNumber
}) => {
  const roleDef = ROLES[humanPlayer.role];
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [deathNote, setDeathNote] = useState<string>('The shadows take their toll. You were careless.');
  const [plantFraming, setPlantFraming] = useState<boolean>(false);
  const [selfHeal, setSelfHeal] = useState<boolean>(false);

  const eligibleTargets = livingPlayers.filter(p => {
    if (humanPlayer.role === 'killer') return p.id !== humanPlayer.id;
    if (humanPlayer.role === 'doctor') return selfHeal ? true : p.id !== humanPlayer.id;
    return p.id !== humanPlayer.id;
  });

  const handleConfirm = () => {
    let actionId = 'night_idle';
    let targetId = selectedTargetId;

    switch (humanPlayer.role) {
      case 'doctor':
        actionId = selfHeal ? 'doc_self' : 'doc_heal';
        targetId = selfHeal ? humanPlayer.id : selectedTargetId;
        break;
      case 'killer':
        actionId = 'killer_strike';
        break;
      case 'sheriff':
        actionId = 'sheriff_interrogate';
        break;
      case 'detective':
        actionId = 'det_track';
        break;
      case 'tavern_keeper':
        actionId = 'tavern_serve';
        break;
      case 'gambler':
        actionId = 'gambler_dice';
        break;
      case 'cook':
        actionId = 'cook_broth';
        break;
      case 'musician':
        actionId = 'musician_listen';
        break;
      default:
        actionId = 'night_observe';
    }

    onCommitAction({
      actionId,
      targetId: targetId || eligibleTargets[0]?.id,
      customNote: deathNote
    });
  };

  return (
    <div 
      id="night-action-panel"
      className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 shadow-xl"
    >
      {/* Night Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 flex items-center justify-center">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Night Phase — Night {dayNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-stone-100">
              Nocturnal Prerogative: {roleDef.name}
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400 font-mono">
            Prerogative: <strong className="text-amber-400">{roleDef.prerogativeLevel}</strong>
          </span>
        </div>
      </div>

      {/* Role Instructions */}
      <div className="mb-5 p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs leading-relaxed text-stone-300 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-100 block mb-0.5">{roleDef.tagline}</strong>
          {roleDef.description}
        </div>
      </div>

      {/* Action Configuration by Role */}
      <div className="space-y-4 mb-6">
        {/* Doctor Special Toggle */}
        {humanPlayer.role === 'doctor' && (
          <div className="flex items-center gap-3 p-3 bg-teal-950/40 border border-teal-800/40 rounded-xl text-xs">
            <input
              type="checkbox"
              id="chk-self-heal"
              checked={selfHeal}
              onChange={(e) => setSelfHeal(e.target.checked)}
              className="rounded accent-teal-500 w-4 h-4"
            />
            <label htmlFor="chk-self-heal" className="text-teal-200 font-semibold cursor-pointer">
              Perform Emergency Self-Triage (Treat your own quarters tonight)
            </label>
          </div>
        )}

        {/* Killer Custom Death Note & Framing */}
        {humanPlayer.role === 'killer' && (
          <div className="space-y-3 p-4 bg-rose-950/30 border border-rose-900/40 rounded-xl">
            <div>
              <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5 mb-1.5">
                <Feather className="w-3.5 h-3.5" />
                Pen Death Note (Discovered on Victim at Dawn):
              </label>
              <textarea
                id="killer-death-note-input"
                value={deathNote}
                onChange={(e) => setDeathNote(e.target.value)}
                maxLength={140}
                rows={2}
                className="w-full text-xs p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-rose-100 placeholder-stone-500 focus:outline-hidden focus:border-rose-500"
                placeholder="Leave a taunting riddle or misdirecting rumor..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="chk-plant-framing"
                checked={plantFraming}
                onChange={(e) => setPlantFraming(e.target.checked)}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <label htmlFor="chk-plant-framing" className="text-xs text-rose-200 cursor-pointer font-medium">
                Plant False Clue (Leaves muddy boots pointing toward an innocent guest)
              </label>
            </div>
          </div>
        )}

        {/* Target Selector */}
        {(!selfHeal || humanPlayer.role !== 'doctor') && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Select Your Nocturnal Target:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {eligibleTargets.map((target) => {
                const isSelected = selectedTargetId === target.id;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setSelectedTargetId(target.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-400 text-white'
                        : 'bg-stone-900 hover:bg-stone-800/80 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{target.name}</div>
                      <div className="text-[11px] text-stone-400">{target.title}</div>
                      <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
                        Suspicion: {target.suspicionScore}%
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Button */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-800">
        <p className="text-xs text-stone-400 italic">
          All nocturnal actions resolve simultaneously when dawn breaks.
        </p>

        <button
          id="btn-commit-night-action"
          onClick={handleConfirm}
          disabled={!selfHeal && !selectedTargetId && eligibleTargets.length > 0}
          className="py-2.5 px-6 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <Moon className="w-4 h-4" />
          Commit Night Action
        </button>
      </div>
    </div>
  );
};
