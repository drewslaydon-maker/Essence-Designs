import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  ShieldCheck, 
  Skull, 
  Search, 
  Moon, 
  Sun, 
  Beer, 
  Coins, 
  Scroll, 
  BookOpen, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings, 
  MessageSquare, 
  Send, 
  Eye, 
  Flame,
  Award,
  Crown,
  Scale,
  Palette,
  Soup,
  Dices
} from 'lucide-react';
import { 
  Player, 
  Phase, 
  StoryEvent, 
  DialogueMessage, 
  ForensicReport, 
  BehavioralTell, 
  GameSettings,
  InventoryItem,
  RoleId
} from './types';
import { ROLES } from './data/roles';
import { 
  initializeGame, 
  generateSpyPartyTells, 
  generateBotDialogues, 
  resolveNightPhase, 
  checkWinCondition,
  NightActionChoice 
} from './utils/gameEngine';
import { RoleBadge } from './components/RoleBadge';
import { PlayerCard } from './components/PlayerCard';
import { CourtTrialModal } from './components/CourtTrialModal';
import { NightActionPanel } from './components/NightActionPanel';
import { ForensicsModal } from './components/ForensicsModal';
import { TavernShopModal } from './components/TavernShopModal';
import { WillEditorModal } from './components/WillEditorModal';
import { StoryChronicle } from './components/StoryChronicle';
import { GameSetupModal } from './components/GameSetupModal';
import { LandingPage } from './components/LandingPage';
import { TownOfSalemCanvas, TownHouse } from './components/TownOfSalemCanvas';
import { TargetDossierCard } from './components/TargetDossierCard';
import { TownHUD } from './components/TownHUD';
import { soundEngine } from './utils/audioEngine';
import { Volume2, VolumeX, Map as MapIcon, Users as UsersIcon } from 'lucide-react';

const initialDefaultSettings: GameSettings = {
  playerCount: 10,
  gameSeed: 'SALEM-4821-NOCT',
  allowRoleRevealOnDeath: true,
  turnPacing: 'manual',
  includeFlavorRoles: true
};

const initialSessionData = initializeGame('Lord Carlisle', 'detective', initialDefaultSettings);

export default function App() {
  // Navigation View Mode (Landing vs Active Game)
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);

  // Play View Mode: 2D Town of Salem Map vs Classic Dossiers
  const [viewMode, setViewMode] = useState<'map' | 'dossiers'>('map');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isChronicleOpen, setIsChronicleOpen] = useState<boolean>(false);
  const [isNightPanelOpen, setIsNightPanelOpen] = useState<boolean>(false);

  // Audio settings
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  // Game Setup & Core State
  const [settings, setSettings] = useState<GameSettings>(initialDefaultSettings);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [phase, setPhase] = useState<Phase>('dawn');

  // Players & Story initialized synchronously (prevents white page on mount)
  const [players, setPlayers] = useState<Player[]>(initialSessionData.players);
  const [events, setEvents] = useState<StoryEvent[]>(initialSessionData.events);
  const [dialogues, setDialogues] = useState<DialogueMessage[]>(initialSessionData.dialogues);
  const [forensicReports, setForensicReports] = useState<ForensicReport[]>([]);
  const [tavernRumors, setTavernRumors] = useState<string[]>([
    "Someone heard footsteps near the secret gallery after the candles were put out.",
    "The apothecary reported a missing vial of belladonna from the shelf."
  ]);

  // Modals & Subviews
  const [accusedPlayer, setAccusedPlayer] = useState<Player | null>(null);
  const [activeForensicReport, setActiveForensicReport] = useState<ForensicReport | null>(null);
  const [isTavernOpen, setIsTavernOpen] = useState<boolean>(false);
  const [isWillOpen, setIsWillOpen] = useState<boolean>(false);
  const [inspectWillPlayer, setInspectWillPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<'hall' | 'chronicle' | 'dialogue'>('hall');

  // Notification Banner
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Charges
  const [objectionsRemaining, setObjectionsRemaining] = useState<number>(2);
  const [pardonsRemaining, setPardonsRemaining] = useState<number>(1);
  const [vetosRemaining, setVetosRemaining] = useState<number>(1);

  // User input chat
  const [userChatInput, setUserChatInput] = useState<string>('');

  // Synchronize shifting background music with game state and landing page
  useEffect(() => {
    if (isLandingPage) {
      soundEngine.setMood('landing');
    } else if (phase === 'game_over') {
      soundEngine.setMood('game_over');
    } else if (phase === 'trial') {
      soundEngine.setMood('trial');
    } else if (phase === 'night') {
      soundEngine.setMood('night');
    } else if (phase === 'dusk') {
      soundEngine.setMood('dusk');
    } else if (phase === 'dawn') {
      soundEngine.setMood('dawn');
    } else if (phase === 'day_discussion') {
      soundEngine.setMood('day_discussion');
    }
  }, [isLandingPage, phase]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleChangeVolume = (val: number) => {
    setVolume(val);
    soundEngine.setMasterVolume(val);
  };

  const getMoodTitle = () => {
    if (isLandingPage) return 'Baroque Salon';
    if (phase === 'trial') return 'Courtroom Heartbeat';
    if (phase === 'night') return 'Midnight Stealth';
    if (phase === 'day_discussion') return 'Parlor Clockwork';
    if (phase === 'dawn') return 'Morning Mourning';
    if (phase === 'dusk') return 'Twilight Fog';
    if (phase === 'game_over') return 'Requiem Cadence';
    return 'Blackthorn Manor';
  };

  const startNewGame = (playerName: string, selectedRole: RoleId | 'random', newSettings: GameSettings) => {
    const { players: initPlayers, events: initEvents, dialogues: initDialogues } = initializeGame(
      playerName,
      selectedRole,
      newSettings
    );

    setSettings(newSettings);
    setPlayers(initPlayers);
    setEvents(initEvents);
    setDialogues(initDialogues);
    setForensicReports([]);
    setDayNumber(1);
    setPhase('dawn');
    setAccusedPlayer(null);
    setObjectionsRemaining(2);
    setPardonsRemaining(1);
    setVetosRemaining(1);
    setIsSetupOpen(false);

    soundEngine.playGavel();
    setSystemAlert(`Welcome to Blackthorn Manor, ${playerName}! Secret roles have been assigned.`);
    setTimeout(() => setSystemAlert(null), 4000);
  };

  const handleEnterFromLanding = (role: RoleId | 'random' = 'detective') => {
    soundEngine.unlockAudio();
    soundEngine.playGavel();
    const currentHuman = players.find(p => p.isHuman);
    const pName = currentHuman ? currentHuman.name : 'Lord Carlisle';

    if (role === 'random' || role !== currentHuman?.role) {
      startNewGame(pName, role, settings);
    }
    setIsLandingPage(false);
  };

  const humanPlayer = players.find(p => p.isHuman) || players[0];

  // Advance Phase Logic
  const handleAdvanceToDiscussion = () => {
    soundEngine.playTellDiscovered();
    // Generate fresh Spy Party tells and bot dialogues for discussion
    const freshTells = generateSpyPartyTells(players);
    const updatedPlayers = players.map(p => {
      const match = freshTells.filter(t => t.playerId === p.id);
      return {
        ...p,
        behavioralTells: [...p.behavioralTells, ...match],
        votesAgainst: 0
      };
    });

    const botTalk = generateBotDialogues(updatedPlayers, 'day_discussion', dayNumber);

    setPlayers(updatedPlayers);
    setDialogues(prev => [...prev, ...botTalk]);
    setPhase('day_discussion');

    setEvents(prev => [
      ...prev,
      {
        id: `ev_disc_${Date.now()}`,
        dayNumber,
        phase: 'day_discussion',
        title: `Morning Assembly — Day ${dayNumber}`,
        description: `The grand parlor is abuzz with suspicion. Guests examine behavioral tells and debate accusations.`,
        category: 'system',
        involvedPlayerIds: updatedPlayers.map(p => p.id),
        timestamp: '10:00 AM'
      }
    ]);
  };

  // Accusation / Nomination
  const handleNominateSuspect = (suspect: Player) => {
    soundEngine.playVotePaddle();
    const updated = players.map(p => {
      if (p.id === suspect.id) {
        const newCount = p.votesAgainst + 1;
        return { ...p, votesAgainst: newCount };
      }
      return p;
    });

    const updatedSuspect = updated.find(p => p.id === suspect.id)!;
    setPlayers(updated);

    // If 2+ votes, put on trial
    if (updatedSuspect.votesAgainst >= 2) {
      soundEngine.playGavel();
      setAccusedPlayer(updatedSuspect);
      setPhase('trial');

      // Bot trial dialogue
      const trialTalk = generateBotDialogues(updated, 'trial', dayNumber, updatedSuspect);
      setDialogues(prev => [...prev, ...trialTalk]);

      setEvents(prev => [
        ...prev,
        {
          id: `ev_nom_${Date.now()}`,
          dayNumber,
          phase: 'trial',
          title: `Trial Convened: ${updatedSuspect.name} on the Stand`,
          description: `The town jury has summoned ${updatedSuspect.name} to answer for alleged crimes.`,
          category: 'verdict',
          involvedPlayerIds: [updatedSuspect.id],
          timestamp: '11:45 AM'
        }
      ]);
    } else {
      setSystemAlert(`You cast an accusation against ${suspect.name}! (${updatedSuspect.votesAgainst}/2 votes needed for trial)`);
      setTimeout(() => setSystemAlert(null), 2500);
    }
  };

  // Judge Emergency Order
  const handleJudgeEmergencyOrder = (suspect: Player) => {
    if (humanPlayer.role !== 'judge') return;
    soundEngine.playGavel();
    soundEngine.playObjection();
    setAccusedPlayer(suspect);
    setPhase('trial');
    setSystemAlert(`JUDGE'S PREROGATIVE: Emergency Court Order issued! ${suspect.name} summoned immediately to the stand.`);
    setTimeout(() => setSystemAlert(null), 3500);
  };

  // Artist Sketch Tell
  const handleArtistSketch = (target: Player) => {
    soundEngine.playTellDiscovered();
    const roleDef = ROLES[target.role];
    const candidateTells = roleDef.spyPartyTells || ['Furtively glances at exits'];
    const discovered = candidateTells[Math.floor(Math.random() * candidateTells.length)];
    
    setSystemAlert(`[Artist Charcoal Sketch] You observed ${target.name}'s micro-tell: "${discovered}"`);
    setTimeout(() => setSystemAlert(null), 5000);

    const tell: BehavioralTell = {
      id: `tell_art_${Date.now()}`,
      playerId: target.id,
      actorName: target.name,
      actionText: discovered,
      isSuspicious: target.role === 'killer' || target.role === 'jester',
      discoveredBy: humanPlayer.name,
      timestamp: 'Just now'
    };

    setPlayers(prev => prev.map(p => p.id === target.id ? { ...p, behavioralTells: [...p.behavioralTells, tell] } : p));
  };

  // Sheriff Tag Warrant
  const handleSheriffWarrant = (target: Player) => {
    soundEngine.playGavel();
    setSystemAlert(`[Sheriff Warrant] You publicly marked ${target.name} with official town suspicion!`);
    setTimeout(() => setSystemAlert(null), 3500);
    setPlayers(prev => prev.map(p => p.id === target.id ? { ...p, suspicionScore: Math.min(100, p.suspicionScore + 25) } : p));
  };

  // Trial Conclusion
  const handleConcludeTrial = (verdict: 'guilty' | 'innocent', details: string) => {
    if (!accusedPlayer) return;

    if (verdict === 'guilty') {
      soundEngine.playGavel();
      soundEngine.playBellToll();
      const isJester = accusedPlayer.role === 'jester';
      const isExeTarget = players.some(p => p.role === 'executioner' && p.targetPlayerId === accusedPlayer.id);

      const updatedPlayers = players.map(p => {
        if (p.id === accusedPlayer.id) {
          return { ...p, isAlive: false };
        }
        return p;
      });

      setPlayers(updatedPlayers);
      setEvents(prev => [
        ...prev,
        {
          id: `ev_execution_${Date.now()}`,
          dayNumber,
          phase: 'trial',
          title: `Execution at the Gallows: ${accusedPlayer.name}`,
          description: `${accusedPlayer.name} was sentenced to the gallows by court verdict. Role: ${ROLES[accusedPlayer.role].name}.`,
          category: 'death',
          involvedPlayerIds: [accusedPlayer.id],
          details: `Their Will was read to the assembled town:\n${accusedPlayer.will}`,
          timestamp: '01:00 PM'
        }
      ]);

      if (isJester) {
        setSystemAlert(`🎭 MAD JESTER VICTORY! ${accusedPlayer.name} tricked the town into hanging them! A posthumous curse now looms.`);
      } else if (isExeTarget) {
        setSystemAlert(`⚔️ EXECUTIONER VICTORY! The Executioner successfully manipulated the gallows to eliminate their sworn quarry!`);
      } else {
        setSystemAlert(`The gavel falls. ${accusedPlayer.name} has been executed.`);
      }
    } else {
      soundEngine.playVotePaddle();
      setEvents(prev => [
        ...prev,
        {
          id: `ev_acquit_${Date.now()}`,
          dayNumber,
          phase: 'trial',
          title: `Court Acquittal: ${accusedPlayer.name}`,
          description: details,
          category: 'verdict',
          involvedPlayerIds: [accusedPlayer.id],
          timestamp: '01:00 PM'
        }
      ]);
      setSystemAlert(`The Court has acquitted ${accusedPlayer.name}! The accused steps down from the stand.`);
    }

    setAccusedPlayer(null);
    setPhase('dusk');
  };

  // Advance to Night Phase
  const handleAdvanceToNight = () => {
    soundEngine.playBellToll();
    setPhase('night');
    setSystemAlert(`Dusk fades. The grand clock chimes midnight. Take to your nocturnal duties...`);
    setTimeout(() => setSystemAlert(null), 3000);
  };

  // Commit Night Action
  const handleCommitNightAction = (choice: NightActionChoice) => {
    soundEngine.playBellToll();
    const { updatedPlayers, events: nightEvents, newReports, intelFeedback } = resolveNightPhase(
      players,
      choice,
      dayNumber
    );

    // If anyone died in the night, play blade strike
    const anyNewDeaths = updatedPlayers.some(p => !p.isAlive && players.find(old => old.id === p.id)?.isAlive);
    if (anyNewDeaths) {
      setTimeout(() => soundEngine.playBladeStrike(), 400);
    }

    setPlayers(updatedPlayers);
    setEvents(prev => [...prev, ...nightEvents]);
    setForensicReports(prev => [...prev, ...newReports]);

    // Check Win Conditions
    const winResult = checkWinCondition(updatedPlayers);
    if (winResult.isOver) {
      setPhase('game_over');
      setSystemAlert(`GAME CONCLUDED: ${winResult.headline} - ${winResult.details}`);
      return;
    }

    // Advance to next day dawn
    setDayNumber(prev => prev + 1);
    setPhase('dawn');

    if (intelFeedback.length > 0) {
      setSystemAlert(intelFeedback.join(' | '));
    } else {
      setSystemAlert(`Dawn arrives on Day ${dayNumber + 1}. Review the morning casualty reports.`);
    }
  };

  // Buy item
  const handleBuyItem = (item: InventoryItem) => {
    soundEngine.playCoinClink();
    setPlayers(prev => prev.map(p => {
      if (p.isHuman) {
        return {
          ...p,
          coins: p.coins - item.cost,
          items: [...p.items, item.id]
        };
      }
      return p;
    }));
  };

  // Save Will
  const handleSaveWill = (newWill: string) => {
    soundEngine.playParchment();
    setPlayers(prev => prev.map(p => {
      if (p.isHuman) {
        return { ...p, will: newWill };
      }
      return p;
    }));
  };

  // User chat send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newMsg: DialogueMessage = {
      id: `chat_${Date.now()}`,
      senderId: humanPlayer.id,
      senderName: humanPlayer.name,
      senderRole: humanPlayer.role,
      text: userChatInput.trim(),
      timestamp: 'Just now'
    };

    setDialogues(prev => [...prev, newMsg]);
    setUserChatInput('');

    // Generate responsive bot chatter
    setTimeout(() => {
      const randomBot = players.find(p => !p.isHuman && p.isAlive);
      if (randomBot) {
        const replies = [
          `An intriguing point, ${humanPlayer.name}. But how do we verify it?`,
          `I am listening carefully, yet the shadows suggest deeper deceit.`,
          `Let the Judge weigh those words before we jump to hasty conclusions.`
        ];
        setDialogues(prev => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            senderId: randomBot.id,
            senderName: randomBot.name,
            text: replies[Math.floor(Math.random() * replies.length)],
            timestamp: 'Just now'
          }
        ]);
      }
    }, 1200);
  };

  // Master phase advance trigger for TownHUD and 2D canvas controls
  const handleAdvancePhaseMaster = () => {
    if (phase === 'dawn') {
      handleAdvanceToDiscussion();
    } else if (phase === 'day_discussion') {
      if (accusedPlayer) {
        soundEngine.playGavel();
        setPhase('trial');
      } else {
        // If someone has votes, put on trial; otherwise transition to dusk
        const topVoted = [...players]
          .filter(p => p.isAlive && !p.isHuman && p.votesAgainst > 0)
          .sort((a, b) => b.votesAgainst - a.votesAgainst)[0];

        if (topVoted && topVoted.votesAgainst >= 2) {
          soundEngine.playGavel();
          setAccusedPlayer(topVoted);
          setPhase('trial');
          const trialTalk = generateBotDialogues(players, 'trial', dayNumber, topVoted);
          setDialogues(prev => [...prev, ...trialTalk]);
        } else {
          soundEngine.playBellToll();
          setPhase('dusk');
          setSystemAlert('The town discussion has concluded. Dusk falls over Blackthorn Manor.');
          setTimeout(() => setSystemAlert(null), 4000);
        }
      }
    } else if (phase === 'dusk') {
      handleAdvanceToNight();
    } else if (phase === 'night') {
      setIsNightPanelOpen(true);
    }
  };

  // Handle clicking town buildings in the 2D world
  const handleInteractBuilding = (type: 'gallows' | 'tavern' | 'graveyard' | 'house', house?: TownHouse) => {
    if (type === 'gallows') {
      soundEngine.playGavel();
      if (accusedPlayer && phase === 'trial') {
        // In trial, player can view the proceedings
      } else {
        setSystemAlert('🏛️ Inquest Stand: To convene a trial at the gallows, accuse a suspect with 2+ votes, or have the Judge issue an emergency order.');
        setTimeout(() => setSystemAlert(null), 4500);
      }
    } else if (type === 'tavern') {
      soundEngine.playCoinClink();
      setIsTavernOpen(true);
    } else if (type === 'graveyard') {
      soundEngine.playBellToll();
      setIsChronicleOpen(true);
    } else if (type === 'house' && house) {
      const owner = players.find(p => p.id === house.playerId);
      if (owner) setSelectedPlayer(owner);
    }
  };

  // Send direct chat message to town square (produces floating speech bubble)
  const handleSendDirectChat = (text: string) => {
    if (!text.trim()) return;
    soundEngine.playSpeechBlip();
    const newMsg: DialogueMessage = {
      id: `msg_human_${Date.now()}`,
      senderId: humanPlayer.id,
      senderName: humanPlayer.name,
      senderRole: humanPlayer.role,
      text: text.trim(),
      timestamp: 'Just now'
    };

    setDialogues(prev => [...prev, newMsg]);

    setTimeout(() => {
      const aliveBots = players.filter(p => !p.isHuman && p.isAlive);
      if (aliveBots.length > 0) {
        const randomBot = aliveBots[Math.floor(Math.random() * aliveBots.length)];
        const botLines = [
          `An intriguing point, ${humanPlayer.name}. But let us check the clues!`,
          `I heard whispers about that... keep your eyes on the shadows.`,
          `Are you certain? The truth may not be as simple as it appears.`,
          `We shall see who speaks truly when the night bell strikes.`
        ];
        soundEngine.playSpeechBlip();
        setDialogues(prev => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            senderId: randomBot.id,
            senderName: randomBot.name,
            text: botLines[Math.floor(Math.random() * botLines.length)],
            timestamp: 'Just now'
          }
        ]);
      }
    }, 1100);
  };

  const livingCount = players.filter(p => p.isAlive).length;
  const deadCount = players.length - livingCount;

  // Render Landing Page if active
  if (isLandingPage) {
    return (
      <LandingPage
        onEnterGame={handleEnterFromLanding}
        hasActiveSession={true}
        onResumeGame={() => {
          soundEngine.unlockAudio();
          setIsLandingPage(false);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-xs">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-100 tracking-tight">
                  Salem & Spycraft
                </h1>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                  Offline Deduction
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Blackthorn Manor Social Simulation & Court Inquests
              </p>
            </div>
          </div>

          {/* Phase & Day Indicator + Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Shifting Soundtrack Status & Audio Controls */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">♪ {getMoodTitle()}</span>
              </span>
              <button 
                id="header-btn-mute"
                onClick={handleToggleMute}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer ml-1"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleChangeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-16 accent-amber-500 cursor-pointer"
                title="Master Volume"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Day {dayNumber}</span>
              <span className="text-stone-500">•</span>
              <span className="capitalize font-bold text-amber-300">
                {phase.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300">
              <span className="text-emerald-400 font-bold">{livingCount} Alive</span>
              <span className="text-stone-500">/</span>
              <span className="text-rose-400 font-bold">{deadCount} Fallen</span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                id="btn-view-map"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Interactive 2D top-down Town of Salem visual map"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>2D Town Map</span>
              </button>
              <button
                id="btn-view-dossiers"
                onClick={() => setViewMode('dossiers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'dossiers' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Detailed card dossier directory"
              >
                <UsersIcon className="w-3.5 h-3.5" />
                <span>Guest Dossiers</span>
              </button>
            </div>

            {/* Quick Action Utilities */}
            <button
              id="nav-btn-landing"
              onClick={() => setIsLandingPage(true)}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Return to Landing Page, rules, and role dossiers"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Archive & Rules</span>
              <span className="sm:hidden">Rules</span>
            </button>

            <button
              id="nav-btn-will"
              onClick={() => { 
                soundEngine.playParchment();
                setInspectWillPlayer(humanPlayer); 
                setIsWillOpen(true); 
              }}
              className="hidden md:flex py-1.5 px-3 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Edit your Last Will and personal clue notes"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>My Will</span>
            </button>

            <button
              id="nav-btn-tavern"
              onClick={() => {
                soundEngine.playCoinClink();
                setIsTavernOpen(true);
              }}
              className="hidden md:flex py-1.5 px-3 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Visit Merchant's shop & Tavern rumor board"
            >
              <Beer className="w-3.5 h-3.5 text-orange-400" />
              <span>Bazaar ({humanPlayer?.coins}g)</span>
            </button>

            <button
              id="nav-btn-setup"
              onClick={() => setIsSetupOpen(true)}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors cursor-pointer shrink-0"
              title="Session settings and new game"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* System Alert Notification Banner */}
      {systemAlert && (
        <div className="bg-amber-950/90 border-b border-amber-600 text-amber-200 px-3 sm:px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{systemAlert}</span>
            </div>
            <button
              onClick={() => setSystemAlert(null)}
              className="p-1 text-stone-400 hover:text-white rounded-md hover:bg-amber-900/50 cursor-pointer"
              title="Dismiss Alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      {viewMode === 'map' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 flex flex-col gap-3">
          {/* Top Info Strip */}
          <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">TOWN OF SALEM 2D MAP</span>
              <span className="text-stone-500">•</span>
              <span className="text-xs text-stone-300">
                {phase === 'dawn' && "Dawn of Day: Morning casualties discovered at first light"}
                {phase === 'day_discussion' && "Daylight Assembly: Walk freely, inspect tells, or accuse suspects"}
                {phase === 'trial' && "Court Inquest at the central Gallows: Deliberation in progress"}
                {phase === 'dusk' && "Dusk Twilight: Prepare for the night ahead"}
                {phase === 'night' && "Midnight Cloak: Sneak between houses to execute your role duty"}
                {phase === 'game_over' && "Inquest Finished: A victor has emerged!"}
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChronicleOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 border border-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                title="View full story chronicle"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Chronicle</span>
              </button>
              {phase === 'night' && (
                <button
                  onClick={() => setIsNightPanelOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                  title="Open Night Duty Action panel"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Night Action Panel</span>
                </button>
              )}
            </div>
          </div>

          {/* 2D Town Canvas Viewport */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950">
            <TownOfSalemCanvas
              players={players}
              humanPlayer={humanPlayer}
              phase={phase}
              dayNumber={dayNumber}
              accusedPlayer={accusedPlayer}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={(p) => setSelectedPlayer(p)}
              onInteractBuilding={handleInteractBuilding}
              recentDialogues={dialogues.slice(-12)}
            />

            {/* Interactive Target Dossier Card floating directly over canvas */}
            {selectedPlayer && (
              <TargetDossierCard
                target={selectedPlayer}
                humanPlayer={humanPlayer}
                phase={phase}
                onClose={() => setSelectedPlayer(null)}
                onNominate={(target) => {
                  handleNominateSuspect(target);
                }}
                onJudgeOrder={humanPlayer.role === 'judge' ? (target) => {
                  handleJudgeEmergencyOrder(target);
                  setSelectedPlayer(null);
                } : undefined}
                onArtistSketch={humanPlayer.role === 'artist' ? (target) => {
                  handleArtistSketch(target);
                  setSelectedPlayer(null);
                } : undefined}
                onSheriffWarrant={humanPlayer.role === 'sheriff' ? (target) => {
                  handleSheriffWarrant(target);
                  setSelectedPlayer(null);
                } : undefined}
                onInspectWill={(target) => {
                  setInspectWillPlayer(target);
                  setIsWillOpen(true);
                }}
                onSelectNightTarget={phase === 'night' ? (target) => {
                  let actionId = 'night_idle';
                  if (humanPlayer.role === 'killer') actionId = 'killer_strike';
                  else if (humanPlayer.role === 'doctor') actionId = 'doc_heal';
                  else if (humanPlayer.role === 'sheriff') actionId = 'sheriff_interrogate';
                  else if (humanPlayer.role === 'detective') actionId = 'detective_track';
                  else if (humanPlayer.role === 'tavern_keeper') actionId = 'tavern_eavesdrop';
                  else if (humanPlayer.role === 'gambler') actionId = 'gambler_wager';
                  else actionId = 'flavor_stalk';

                  handleCommitNightAction({ actionId, targetId: target.id });
                  setSelectedPlayer(null);
                } : undefined}
              />
            )}
          </div>

          {/* Tactile In-Game HUD overlay at bottom */}
          <TownHUD
            humanPlayer={humanPlayer}
            phase={phase}
            dayNumber={dayNumber}
            players={players}
            onAdvancePhase={handleAdvancePhaseMaster}
            onOpenWill={() => {
              setInspectWillPlayer(humanPlayer);
              setIsWillOpen(true);
            }}
            onOpenTavern={() => setIsTavernOpen(true)}
            onOpenChronicle={() => setIsChronicleOpen(true)}
            onSelectPlayer={(p) => setSelectedPlayer(p)}
            onSendChat={handleSendDirectChat}
            selectedPlayer={selectedPlayer}
            recentDialogues={dialogues}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols on lg): Active Manor Hall & Guests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Phase Control Hero Banner */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {phase === 'night' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Night Infiltration
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Daylight Proceedings
                  </span>
                )}
                <span className="text-xs font-mono text-stone-400">
                  Phase: {phase.toUpperCase()}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">
                {phase === 'dawn' && `Dawn of Day ${dayNumber}: Casualty Announcements`}
                {phase === 'day_discussion' && `Grand Assembly: Accusations & Behavioral Tells`}
                {phase === 'trial' && `Court of Justice: Stand & Deliberate`}
                {phase === 'dusk' && `Dusk at the Manor: Market Barter & Twilight Prep`}
                {phase === 'night' && `Midnight Shadows: Nocturnal Maneuvers`}
                {phase === 'game_over' && `The Session Has Concluded!`}
              </h2>

              <p className="text-xs text-stone-400 mt-1 max-w-xl">
                {phase === 'dawn' && "Review fallen guests and Wills discovered at first light before opening the floor."}
                {phase === 'day_discussion' && "Observe guest tells (Spy Party), review the suspicion indices, and cast accusations to put suspects on trial."}
                {phase === 'trial' && "Hear the defense testimony. Lawyers may object, Judges may pardon, or the jury may hang."}
                {phase === 'dusk' && "Shop for tactical gear, place gambler bets, and ready yourself for the nocturnal hours."}
                {phase === 'night' && "Execute secret nocturnal role prerogatives under the veil of darkness."}
              </p>
            </div>

            {/* Next Step / Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              {phase === 'dawn' && (
                <button
                  id="btn-open-discussion"
                  onClick={handleAdvanceToDiscussion}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sun className="w-4 h-4" />
                  Open Floor Discussion
                </button>
              )}

              {phase === 'day_discussion' && (
                <button
                  id="btn-advance-dusk"
                  onClick={() => setPhase('dusk')}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Moon className="w-4 h-4" />
                  Conclude Day & Enter Dusk
                </button>
              )}

              {phase === 'dusk' && (
                <button
                  id="btn-start-night"
                  onClick={handleAdvanceToNight}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Moon className="w-4 h-4" />
                  Commence Night Phase
                </button>
              )}

              {phase === 'game_over' && (
                <button
                  id="btn-restart-match"
                  onClick={() => setIsSetupOpen(true)}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Session
                </button>
              )}
            </div>
          </div>

          {/* Active Night Action View */}
          {phase === 'night' && (
            <NightActionPanel
              humanPlayer={humanPlayer}
              livingPlayers={players.filter(p => p.isAlive)}
              onCommitAction={handleCommitNightAction}
              dayNumber={dayNumber}
            />
          )}

          {/* Guest Roster Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                  Assembled Manor Guests ({players.length})
                </h3>
                <span className="text-xs text-stone-500">
                  (Icons & color-coded status badges distinguish each class)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {players.map((p) => {
                let actionLabel: string | undefined;
                let onAction: ((target: Player) => void) | undefined;

                if (phase === 'day_discussion' && p.isAlive && !p.isHuman) {
                  if (humanPlayer.role === 'judge') {
                    actionLabel = 'Order Trial';
                    onAction = handleJudgeEmergencyOrder;
                  } else if (humanPlayer.role === 'artist') {
                    actionLabel = 'Sketch Tell';
                    onAction = handleArtistSketch;
                  } else if (humanPlayer.role === 'sheriff') {
                    actionLabel = 'Tag Warrant';
                    onAction = handleSheriffWarrant;
                  }
                }

                return (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    humanPlayer={humanPlayer}
                    phase={phase}
                    isAccused={accusedPlayer?.id === p.id}
                    onNominate={handleNominateSuspect}
                    onSelectAction={onAction}
                    actionButtonLabel={actionLabel}
                    onViewWill={(target) => {
                      setInspectWillPlayer(target);
                      setIsWillOpen(true);
                    }}
                    onInspectForensics={(target) => {
                      const rep = forensicReports.find(r => r.victimId === target.id);
                      if (rep) {
                        setActiveForensicReport(rep);
                      } else {
                        // Generate fresh report on demand
                        const repFallback: ForensicReport = {
                          victimId: target.id,
                          victimName: target.name,
                          victimRole: target.role,
                          causeOfDeath: 'Lethal Chest Trauma',
                          timeEstimated: '02:30 AM',
                          weaponType: 'Honed Dagger with Silver Seal',
                          clues: ['Traces of mud on the windowsill', 'Scent of pipe tobacco'],
                          dnaMatches: [players.find(o => !o.isHuman && o.isAlive)?.name || 'Unknown'],
                          certaintyPercent: 95
                        };
                        setActiveForensicReport(repFallback);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Emergent Story Chronicle Component */}
          <StoryChronicle
            events={events}
            players={players}
            dayNumber={dayNumber}
          />
        </div>

        {/* Right Column (1 Col): Live Manor Dialogue & Spy Party Intel */}
        <div className="space-y-6">
          
          {/* Your Dossier Card */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Your Player Dossier
              </span>
              <RoleBadge roleId={humanPlayer.role} size="sm" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Assigned Identity:</span>
                <span className="font-bold text-white">{humanPlayer.name}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Faction:</span>
                <span className="font-semibold text-stone-200">{ROLES[humanPlayer.role].faction}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Prerogative:</span>
                <span className="font-bold text-amber-400">{ROLES[humanPlayer.role].prerogativeLevel}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Purse:</span>
                <span className="font-mono text-amber-300 font-bold">{humanPlayer.coins} Gold Coins</span>
              </div>

              {humanPlayer.targetPlayerId && (
                <div className="mt-2 p-2 bg-stone-950 rounded-lg border border-stone-800">
                  <span className="text-stone-500 font-semibold block mb-0.5">Assigned Target/Client:</span>
                  <span className="font-bold text-amber-300">
                    {players.find(p => p.id === humanPlayer.targetPlayerId)?.name || 'Classified'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Will Preview */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              <div className="flex items-center justify-between text-xs font-bold text-stone-400 mb-1.5">
                <span>Active Testament:</span>
                <button
                  onClick={() => { setInspectWillPlayer(humanPlayer); setIsWillOpen(true); }}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Edit Full Will
                </button>
              </div>
              <div className="p-2.5 bg-stone-950 rounded-lg text-[11px] font-mono text-stone-300 max-h-20 overflow-hidden border border-stone-800/80">
                {humanPlayer.will || '[No will penned yet]'}
              </div>
            </div>
          </div>

          {/* Emergent Social Dialogue Feed */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex flex-col h-[520px]">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  Manor Parlor Exchange
                </h3>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">
                {dialogues.length} Messages
              </span>
            </div>

            {/* Chat Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {dialogues.map((msg) => {
                const isHuman = msg.senderId === humanPlayer.id;
                return (
                  <div 
                    key={msg.id}
                    className={`p-3 rounded-xl border leading-relaxed ${
                      isHuman 
                        ? 'bg-amber-950/40 border-amber-800/60 ml-3' 
                        : msg.isAccusation
                          ? 'bg-rose-950/30 border-rose-900/50'
                          : 'bg-stone-950/70 border-stone-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`font-bold ${isHuman ? 'text-amber-300' : 'text-stone-200'}`}>
                        {msg.senderName} {isHuman && '(You)'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-stone-300">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-stone-800 flex items-center gap-2">
              <input
                id="input-dialogue-text"
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="Speak in the parlor or cast doubts..."
                className="flex-1 p-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
              />
              <button
                id="btn-send-dialogue"
                type="submit"
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs cursor-pointer transition-colors"
                title="Send dialogue"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </main>
      )}

      {/* Modals */}
      {/* 0. Full Case Chronicle Modal (Accessible from 2D canvas, graveyard, or header) */}
      {isChronicleOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChronicleOpen(false);
          }}
        >
          <div 
            className="w-full max-w-3xl max-h-[85vh] bg-stone-900 border border-stone-700 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-stone-100 text-base">Blackthorn Manor Case Chronicle</h3>
              </div>
              <button
                onClick={() => setIsChronicleOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 active:bg-stone-600 transition-colors cursor-pointer"
                title="Close Chronicle"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <StoryChronicle events={events} players={players} dayNumber={dayNumber} />
            </div>
            <div className="p-3 border-t border-stone-800 bg-stone-950 flex justify-end">
              <button
                onClick={() => setIsChronicleOpen(false)}
                className="min-h-[44px] py-2 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 text-xs font-semibold cursor-pointer"
              >
                Close Chronicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Night Action Panel Modal (when opened from 2D top navigation) */}
      {isNightPanelOpen && phase === 'night' && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNightPanelOpen(false);
          }}
        >
          <div 
            className="w-full max-w-2xl bg-stone-900 border border-indigo-500/40 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNightPanelOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer z-10"
              title="Close Night Action Panel"
            >
              ✕
            </button>
            <NightActionPanel
              humanPlayer={humanPlayer}
              livingPlayers={players.filter(p => p.isAlive)}
              onCommitAction={(choice) => {
                handleCommitNightAction(choice);
                setIsNightPanelOpen(false);
              }}
              dayNumber={dayNumber}
            />
          </div>
        </div>
      )}

      {/* 1. Court Trial Modal */}
      {phase === 'trial' && accusedPlayer && (
        <CourtTrialModal
          accused={accusedPlayer}
          players={players}
          humanPlayer={humanPlayer}
          onConcludeTrial={handleConcludeTrial}
          onLawyerObjection={() => setObjectionsRemaining(prev => Math.max(0, prev - 1))}
          onLawyerAlibi={() => {}}
          onJudgePardon={() => setPardonsRemaining(prev => Math.max(0, prev - 1))}
          onPrinceVeto={() => setVetosRemaining(prev => Math.max(0, prev - 1))}
          objectionsRemaining={objectionsRemaining}
          pardonsRemaining={pardonsRemaining}
          vetosRemaining={vetosRemaining}
        />
      )}

      {/* 2. Forensics Dossier Modal */}
      {activeForensicReport && (
        <ForensicsModal
          report={activeForensicReport}
          onClose={() => setActiveForensicReport(null)}
        />
      )}

      {/* 3. Tavern & Bazaar Shop Modal */}
      {isTavernOpen && (
        <TavernShopModal
          humanPlayer={humanPlayer}
          onBuyItem={handleBuyItem}
          onClose={() => setIsTavernOpen(false)}
          tavernRumors={tavernRumors}
        />
      )}

      {/* 4. Will Editor Modal */}
      {isWillOpen && inspectWillPlayer && (
        <WillEditorModal
          player={inspectWillPlayer}
          onSaveWill={handleSaveWill}
          onClose={() => { setIsWillOpen(false); setInspectWillPlayer(null); }}
          isReadOnly={!inspectWillPlayer.isHuman}
        />
      )}

      {/* 5. Game Setup & Roster Modal */}
      <GameSetupModal
        currentSettings={settings}
        onStartGame={startNewGame}
        onClose={() => setIsSetupOpen(false)}
        isOpen={isSetupOpen}
      />

    </div>
  );
}
