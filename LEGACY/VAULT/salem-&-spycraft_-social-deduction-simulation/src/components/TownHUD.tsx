import React, { useState } from 'react';
import { Player, Phase, RoleId } from '../types';
import { ROLES } from '../data/roles';
import { RoleBadge } from './RoleBadge';
import { 
  Gavel, 
  Moon, 
  Sun, 
  Beer, 
  Scroll, 
  BookOpen, 
  MessageSquare, 
  Coins, 
  Send, 
  Users, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Skull,
  UserCheck,
  Check
} from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface TownHUDProps {
  humanPlayer: Player;
  phase: Phase;
  dayNumber: number;
  players: Player[];
  onAdvancePhase: () => void;
  onOpenWill: () => void;
  onOpenTavern: () => void;
  onOpenChronicle: () => void;
  onSelectPlayer: (p: Player) => void;
  onSendChat: (text: string) => void;
  selectedPlayer: Player | null;
  recentDialogues: { senderId: string; senderName: string; text: string; id: string }[];
  isRosterOpen?: boolean;
  setIsRosterOpen?: (open: boolean) => void;
}

export const TownHUD: React.FC<TownHUDProps> = ({
  humanPlayer,
  phase,
  dayNumber,
  players,
  onAdvancePhase,
  onOpenWill,
  onOpenTavern,
  onOpenChronicle,
  onSelectPlayer,
  onSendChat,
  selectedPlayer,
  recentDialogues,
  isRosterOpen: externalIsRosterOpen,
  setIsRosterOpen: externalSetIsRosterOpen
}) => {
  const [chatInput, setChatInput] = useState('');
  const [localIsRosterOpen, setLocalIsRosterOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [rosterFilter, setRosterFilter] = useState<'all' | 'alive' | 'dead'>('all');

  const isRosterOpen = externalIsRosterOpen !== undefined ? externalIsRosterOpen : localIsRosterOpen;
  const setIsRosterOpen = externalSetIsRosterOpen !== undefined ? externalSetIsRosterOpen : setLocalIsRosterOpen;

  const roleDef = ROLES[humanPlayer.role] || ROLES.detective;
  const livingPlayers = players.filter(p => p.isAlive);
  const deadPlayers = players.filter(p => !p.isAlive);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  // Dynamic Phase Action Label
  const getPhaseActionDetails = () => {
    switch (phase) {
      case 'dawn':
        return {
          title: `Convene Assembly — Day ${dayNumber}`,
          subtitle: 'Advance to open social inquiry',
          icon: Sun,
          color: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black'
        };
      case 'day_discussion':
        return {
          title: 'Advance to Inquest Stand',
          subtitle: 'Summon suspect to stand or dusk',
          icon: Gavel,
          color: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black'
        };
      case 'trial':
        return {
          title: 'Court Inquest in Session',
          subtitle: 'Gallows deliberation active',
          icon: Gavel,
          color: 'bg-rose-700 text-white cursor-default font-bold'
        };
      case 'dusk':
        return {
          title: 'Retire to Night Chambers',
          subtitle: 'Lock doors for nocturnal actions',
          icon: Moon,
          color: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold'
        };
      case 'night':
        return {
          title: 'Execute Night Duty',
          subtitle: 'Carry out nocturnal assignment',
          icon: Moon,
          color: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold'
        };
      default:
        return {
          title: 'Inquest Concluded',
          subtitle: 'A victor has emerged',
          icon: Sparkles,
          color: 'bg-stone-700 text-stone-200'
        };
    }
  };

  const actionDetails = getPhaseActionDetails();
  const ActionIcon = actionDetails.icon;

  const filteredGuests = players.filter(p => {
    if (rosterFilter === 'alive') return p.isAlive;
    if (rosterFilter === 'dead') return !p.isAlive;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 flex flex-col gap-2 pointer-events-auto select-none">
      
      {/* Bottom Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
        
        {/* Left: Player Persona Badge & Sovereign Purse (md:col-span-4) */}
        <div className="md:col-span-4 p-2.5 sm:p-3 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-stone-800 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-base sm:text-lg shadow-inner shrink-0">
              {roleDef.name[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-stone-100 text-xs sm:text-sm truncate">{humanPlayer.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 shrink-0">YOU</span>
              </div>
              <div className="mt-0.5">
                <RoleBadge roleId={humanPlayer.role} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-400 font-bold text-xs shrink-0">
            <Coins className="w-3.5 h-3.5" />
            <span>{humanPlayer.coins}g</span>
          </div>
        </div>

        {/* Center: Phase Action & Primary Utility Bar (md:col-span-5) */}
        <div className="md:col-span-5 flex flex-col gap-2">
          
          {/* Action Row: Guest Toggle + Tools */}
          <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-800 shadow-md">
            
            {/* The Requested Alive/Dead Toggle: Green Number / Slash / Red Number */}
            <button
              id="btn-toggle-roster"
              onClick={() => {
                soundEngine.playParchment();
                setIsRosterOpen(!isRosterOpen);
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 active:bg-stone-700 border border-stone-700 text-stone-200 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Toggle Guest Inquest Roster (Alive / Fallen)"
            >
              <Users className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm">
                <span className="text-emerald-400 font-bold">{livingPlayers.length}</span>
                <span className="text-stone-500 font-bold">/</span>
                <span className="text-rose-400 font-bold">{deadPlayers.length}</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-400 hidden sm:inline">Guests</span>
            </button>

            {/* Quick Actions (44px min touch target) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { soundEngine.playParchment(); onOpenWill(); }}
                className="min-h-[44px] py-1.5 px-2.5 sm:px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit your Last Will and confidential clues"
              >
                <Scroll className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Last Will</span>
                <span className="sm:hidden">Will</span>
              </button>

              <button
                onClick={() => { soundEngine.playCoinClink(); onOpenTavern(); }}
                className="min-h-[44px] py-1.5 px-2.5 sm:px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Visit Merchant's Bazaar & rumors"
              >
                <Beer className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Tavern</span>
              </button>

              <button
                onClick={onOpenChronicle}
                className="min-h-[44px] py-1.5 px-2.5 sm:px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Review Case Chronicle"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden sm:inline">Chronicle</span>
              </button>
            </div>
          </div>

          {/* Primary Phase Advance Button (44px min touch target) */}
          <button
            onClick={phase !== 'trial' ? onAdvancePhase : undefined}
            disabled={phase === 'trial'}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${actionDetails.color} ${phase !== 'trial' ? 'cursor-pointer active:scale-98' : ''}`}
          >
            <ActionIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">{actionDetails.title}</span>
          </button>
        </div>

        {/* Right: Town Parlor Dialogue & Chatter (md:col-span-3) */}
        <div className="md:col-span-3 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-stone-800 shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header / Collapsible for Mobile */}
          <div 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center justify-between px-3 py-2 bg-stone-950/90 border-b border-stone-800 cursor-pointer text-xs font-semibold text-stone-300 min-h-[40px]"
          >
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Parlor Speech</span>
              {recentDialogues.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            {isChatOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronUp className="w-4 h-4 text-stone-400" />}
          </div>

          {/* Messages Feed (Expanded or Compact) */}
          {isChatOpen && (
            <div className="p-2 space-y-1.5 max-h-28 overflow-y-auto text-xs bg-stone-950/40">
              {recentDialogues.slice(-4).map(msg => (
                <div key={msg.id} className="leading-snug">
                  <span className="font-bold text-amber-300">{msg.senderName}: </span>
                  <span className="text-stone-300">{msg.text}</span>
                </div>
              ))}
              {recentDialogues.length === 0 && (
                <p className="text-stone-500 italic text-[11px]">The parlor is quiet. Speak your mind below...</p>
              )}
            </div>
          )}

          {/* Quick Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-1.5 bg-stone-900 flex items-center gap-1 border-t border-stone-800">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Speak to square..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500 min-h-[36px]"
            />
            <button
              type="submit"
              className="min-h-[36px] min-w-[36px] p-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Send speech bubble"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Guest Inquest Roster Modal / Bottom Sheet */}
      {isRosterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRosterOpen(false);
          }}
        >
          <div 
            className="w-full max-w-xl bg-stone-900/98 backdrop-blur-2xl border border-amber-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom-6 duration-200 text-stone-100 max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-stone-100 text-base sm:text-lg">
                  Manor Guest Directory
                </h3>
                <div className="flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-800 ml-1">
                  <span className="text-emerald-400">{livingPlayers.length} Alive</span>
                  <span className="text-stone-500">/</span>
                  <span className="text-rose-400">{deadPlayers.length} Fallen</span>
                </div>
              </div>

              <button
                onClick={() => setIsRosterOpen(false)}
                className="w-10 h-10 -mr-1 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Close Roster"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 py-2.5 shrink-0">
              <button
                onClick={() => setRosterFilter('all')}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rosterFilter === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                All ({players.length})
              </button>
              <button
                onClick={() => setRosterFilter('alive')}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  rosterFilter === 'alive'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Living ({livingPlayers.length})</span>
              </button>
              <button
                onClick={() => setRosterFilter('dead')}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  rosterFilter === 'dead'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-rose-400" />
                <span>Fallen ({deadPlayers.length})</span>
              </button>
            </div>

            {/* Guest List Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1">
              {filteredGuests.map((guest) => {
                const isSelf = guest.id === humanPlayer.id;
                const isSelected = selectedPlayer?.id === guest.id;
                const isDead = !guest.isAlive;
                const roleKnown = isSelf || isDead || humanPlayer.role === 'judge';

                return (
                  <div
                    key={guest.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md' 
                        : isDead 
                          ? 'bg-stone-950/60 border-stone-800/80 opacity-80' 
                          : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isDead 
                          ? 'bg-rose-950/40 text-rose-400 border-rose-800/50' 
                          : isSelf 
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                            : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}>
                        {isDead ? <Skull className="w-4 h-4" /> : guest.name[0]}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold text-xs sm:text-sm truncate ${isDead ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                            {guest.name}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">YOU</span>
                          )}
                          {guest.votesAgainst > 0 && guest.isAlive && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              {guest.votesAgainst} Accused
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate">
                          {guest.title} • {isDead ? `Fallen in Inquest (${guest.deathCause || 'Execution'})` : `Cottage #${guest.id.slice(-2)}`}
                        </p>
                        {roleKnown && (
                          <div className="mt-1">
                            <RoleBadge roleId={guest.role} size="sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button for Guest (44px min touch target) */}
                    <button
                      onClick={() => {
                        onSelectPlayer(guest);
                        setIsRosterOpen(false);
                      }}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 font-black'
                          : isDead
                            ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                            : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950'
                      }`}
                    >
                      {isDead ? (
                        <>
                          <Scroll className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Will</span>
                        </>
                      ) : (
                        <>
                          <span>Inspect</span>
                          <span className="hidden sm:inline">& Walk To</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Close */}
            <div className="pt-3 border-t border-stone-800 shrink-0">
              <button
                onClick={() => setIsRosterOpen(false)}
                className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-stone-400" />
                <span>Close Guest Directory</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
