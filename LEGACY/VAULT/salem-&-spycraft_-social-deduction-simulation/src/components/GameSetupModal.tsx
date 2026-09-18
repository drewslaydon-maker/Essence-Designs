import React, { useState } from 'react';
import { 
  Settings, 
  Play, 
  Shuffle, 
  Users, 
  Sparkles, 
  Share2, 
  Check, 
  X,
  Info,
  Award
} from 'lucide-react';
import { RoleId, GameSettings } from '../types';
import { ROLES } from '../data/roles';
import { RoleBadge } from './RoleBadge';

interface GameSetupModalProps {
  currentSettings: GameSettings;
  onStartGame: (playerName: string, selectedRole: RoleId | 'random', settings: GameSettings) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  currentSettings,
  onStartGame,
  onClose,
  isOpen
}) => {
  const [playerName, setPlayerName] = useState<string>('Lord Carlisle');
  const [selectedRole, setSelectedRole] = useState<RoleId | 'random'>('detective');
  const [playerCount, setPlayerCount] = useState<number>(currentSettings.playerCount || 10);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [previewRole, setPreviewRole] = useState<RoleId | null>('detective');

  if (!isOpen) return null;

  const handleStart = () => {
    onStartGame(playerName, selectedRole, {
      ...currentSettings,
      playerCount,
      gameSeed: `SALEM-${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('seed', currentSettings.gameSeed || 'SALEM-INT');
    url.searchParams.set('count', playerCount.toString());
    navigator.clipboard.writeText(url.toString());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const allRoleIds = Object.keys(ROLES) as RoleId[];

  return (
    <div 
      id="game-setup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
    >
      <div className="bg-stone-900 border border-amber-800/80 text-stone-100 rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                New Social Deduction Session Setup
              </h2>
              <p className="text-xs text-stone-400">
                Convene the guests at Blackthorn Manor. Configure roles, abilities, and players.
              </p>
            </div>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Player Name & Guest Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Your Guest Identity Name
            </label>
            <input
              id="input-player-name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={24}
              className="w-full text-sm font-semibold p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-white focus:outline-hidden focus:border-amber-500"
              placeholder="e.g. Lord Carlisle, Lady Eleanor"
            />
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Manor Guests Count: <span className="text-amber-400 font-mono">{playerCount}</span>
              </label>
              <span className="text-[10px] text-stone-500">6 to 15 Guests</span>
            </div>
            <input
              id="range-player-count"
              type="range"
              min={6}
              max={15}
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>Intimate (6)</span>
              <span>Classic Salem (10)</span>
              <span>Grand Gala (15)</span>
            </div>
          </div>
        </div>

        {/* Role Selection & Browser */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Select Your Class / Role Assignment
            </label>
            <span className="text-xs text-amber-400 font-medium">
              {selectedRole === 'random' ? 'Random Secret Assignment' : ROLES[selectedRole].name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 mb-4">
            <button
              id="role-select-random"
              type="button"
              onClick={() => { setSelectedRole('random'); setPreviewRole(null); }}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'random'
                  ? 'bg-amber-600 text-stone-950 border-amber-400 shadow-sm ring-2 ring-amber-400'
                  : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              Surprise Mystery Role
            </button>

            {allRoleIds.map((rId) => {
              const rDef = ROLES[rId];
              const isChosen = selectedRole === rId;
              return (
                <button
                  key={rId}
                  id={`role-select-${rId}`}
                  type="button"
                  onClick={() => { setSelectedRole(rId); setPreviewRole(rId); }}
                  onMouseEnter={() => setPreviewRole(rId)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isChosen
                      ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-400 text-white'
                      : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <span className="truncate">{rDef.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1 rounded bg-stone-900 border border-stone-800 text-stone-400">
                    {rDef.prerogativeLevel[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Role Preview Card */}
          {previewRole && ROLES[previewRole] && (
            <div className="p-4 bg-stone-950 border border-amber-900/50 rounded-xl">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RoleBadge roleId={previewRole} size="sm" />
                    <span className="text-[11px] font-mono text-stone-400">
                      Prerogative: <strong className="text-amber-400">{ROLES[previewRole].prerogativeLevel}</strong>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ROLES[previewRole].tagline}</h4>
                </div>
              </div>

              <p className="text-xs text-stone-300 mb-3 leading-relaxed">
                {ROLES[previewRole].description}
              </p>

              <div className="text-[11px] text-stone-400 font-mono mb-2">
                <span className="text-amber-400 font-bold">Win Condition:</span> {ROLES[previewRole].winCondition}
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Signature Abilities:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES[previewRole].detailedAbilities.map(ab => (
                  <div key={ab.id} className="p-2 bg-stone-900 rounded-lg text-xs border border-stone-800/80">
                    <span className="font-bold text-amber-300 block">{ab.name} ({ab.phase})</span>
                    <span className="text-stone-400 text-[11px]">{ab.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shareable Link & Seed */}
        <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between gap-3 mb-6">
          <div className="text-xs text-stone-400">
            <span className="text-stone-200 font-semibold block">Shareable Session Room</span>
            Share this link to pass the scenario configuration or compare storybooks with friends.
          </div>
          <button
            id="btn-share-room-link"
            type="button"
            onClick={handleCopyShareLink}
            className="py-1.5 px-3 rounded-lg text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedCode ? 'Link Copied!' : 'Copy Share Link'}
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            id="btn-start-game-match"
            type="button"
            onClick={handleStart}
            className="py-3 px-8 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Enter Blackthorn Manor
          </button>
        </div>

      </div>
    </div>
  );
};
