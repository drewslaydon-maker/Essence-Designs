import React, { useEffect, useRef, useState } from 'react';
import { 
  Gamepad2, 
  RotateCcw, 
  ExternalLink,
  Code,
  Download,
  Copy,
  Check,
  Save,
  Globe,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  Wine,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Volume2,
  Users,
  BookOpen,
  Zap,
  ArrowRight,
  MessageSquare,
  Compass,
  VolumeX,
  Sparkle,
  Music,
  Target,
  Crosshair,
  Eye
} from 'lucide-react';
import { 
  playCelestialChime, 
  playDispatchSound, 
  playRuneCastSound,
  playDialogueBlip,
  unlockAudio,
  toggleAudioState,
  getAudioState
} from '../utils/audio';
import { SpatialWorld } from '../physics/SpatialWorld.js';
import { KinematicController } from '../core/KinematicController.js';
import { 
  CANON_CHARACTERS, 
  TAVERN_SETPIECES, 
  DRINKING_CONTEST_ROUNDS, 
  AMBUSH_STANDOFF_CHOICES 
} from '../data/loreBible';
import { LoreBibleModal } from './LoreBibleModal';
import { TavernHearthModal } from './TavernHearthModal';
import { TavernDartsModal } from './TavernDartsModal';
import { ZozogSparringModal } from './ZozogSparringModal';
import { ProvingGroundsView } from './ProvingGroundsView';
import { hearthSaveService, EssenceFlowSaveState } from '../services/TavernHearthSaveService';
import { DrinkingDuelController } from '../minigames/DrinkingDuelController.js';
import { MatchstickSpottingController } from '../minigames/MatchstickSpottingController.js';
import { KaironRhythmController } from '../minigames/KaironRhythmController.js';
import { VisualistParticleEngine } from '../effects/VisualistParticleEngine.js';
import { DialoguePacer } from '../ui/DialoguePacer.js';
import { TavernAudioGraph } from '../audio/TavernAudioGraph.js';
import { jujuAnchor } from '../services/JujuAnchorService.js';

interface DialogueState {
  speaker: string;
  avatar: string;
  color: string;
  text: string;
  actionText?: string;
}

interface DrinkingRoundData {
  round: number;
  drink: string;
  decayRate: number;
  challengePrompt: string;
  roundClearedDialogue: string;
  bozogCheer: string;
}

const DRINKING_ROUNDS: DrinkingRoundData[] = [
  {
    round: 1,
    drink: 'Warmup Ale',
    decayRate: 0.30,
    challengePrompt: 'Atreyu: "A simple flagon of Delain harbor grog. Show me your dwarven constitution, tavern keeper!"',
    roundClearedDialogue: 'Atreyu wipes foam from her chin with an appreciative smirk: "Bah! Warmup ale is child\'s play for a berserker. But let us see how your iron stomach handles 90-proof Docks Navy Rum!"',
    bozogCheer: 'Bozog: "Warmup ale going down smooth as Delain spring water!"',
  },
  {
    round: 2,
    drink: 'Docks Navy Rum',
    decayRate: 0.52,
    challengePrompt: 'Atreyu: "Double-distilled molasses spirits! This dark rum has laid low armored corsairs—pace your breathing, Bozog!"',
    roundClearedDialogue: 'Atreyu sways slightly against the counter, her eyes widening with grudging awe: "By the silver crescent... you drink like a sea dragon! But Moon-Cask Spirit was brewed for temple guardians—this next draught will test your immortal soul!"',
    bozogCheer: 'Bozog: "Hot as dragonfire, but my gullet was forged in dwarven kilns!"',
  },
  {
    round: 3,
    drink: 'Moon-Cask Spirit',
    decayRate: 0.75,
    challengePrompt: 'Atreyu: "Silver-distilled in lunar cloisters! The crescent tide decides who rules this harbor—drink or yield, berserker!"',
    roundClearedDialogue: 'Atreyu slams both hands onto the counter, laughing breathlessly as she waves a white bar-cloth: "Enough! My vision is swimming in double-moons. The Greedy Greens has its undisputed champion... I yield!"',
    bozogCheer: 'Bozog: "MY TAVERN, MY GROG! DRINK TO FREEDOM!"',
  },
];

export const JourneysSandboxView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'game' | 'preview' | 'html_manager' | 'sandboxes'>('game');
  const [isLoreBibleOpen, setIsLoreBibleOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const [isSavingHtml, setIsSavingHtml] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'iphone-14' | 'iphone-se' | 'landscape' | 'tablet'>('desktop');
  const [showTouchControls, setShowTouchControls] = useState(true);

  // Virtual Key Controller for Touch & Mobile Devices
  const setVirtualKey = (code: string, pressed: boolean) => {
    keysRef.current[code] = pressed;
  };

  // Game Canvas State
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState(60);
  const [telemetry, setTelemetry] = useState({ 
    x: 340, 
    y: 320, 
    speed: 0, 
    room: 'The Greedy Greens • Delain Docks (Bozog Solo)',
    partyState: 'Solo (Bozog)',
    tension: 0
  });

  const playerRef = useRef<KinematicController | null>(null);
  const worldRef = useRef<SpatialWorld | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});

  // Group Walking Formation State (Deltarune / Chrono Trigger Squad Kinematics)
  interface PartyFollower {
    id: 'matchstick' | 'atreyu' | 'kairon';
    name: string;
    avatar: string;
    color: string;
    role: string;
    corner: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetDist: number;     // Staggered distance behind leader
    lateralOffset: number;  // Lateral formation offset (-left, +right)
    stopRadius: number;
    stepPhase: number;
    facing: 'left' | 'right' | 'up' | 'down';
  }

  const partyTrainUnlockedRef = useRef<boolean>(false);
  const [partyTrainUnlocked, setPartyTrainUnlocked] = useState(false);
  const triggerInteractionRef = useRef<(() => void) | null>(null);

  const handleTriggerInteraction = () => {
    triggerInteractionRef.current?.();
  };
  const leaderHeadingRef = useRef<number>(Math.PI / 2); // Default facing south
  const followersRef = useRef<PartyFollower[]>([
    {
      id: 'matchstick',
      name: 'Matchstick',
      avatar: '🪞',
      color: '#38bdf8',
      role: 'Scout / Mirror Tactician',
      corner: 'North (Refraction)',
      x: 200,
      y: 90,
      vx: 0,
      vy: 0,
      targetDist: 38,
      lateralOffset: -16,
      stopRadius: 18,
      stepPhase: 0,
      facing: 'down',
    },
    {
      id: 'atreyu',
      name: 'Atreyu',
      avatar: '🌙',
      color: '#e0e7ff',
      role: 'High Moon Priest',
      corner: 'West (Lunar Mystic)',
      x: 130,
      y: 240,
      vx: 0,
      vy: 0,
      targetDist: 64,
      lateralOffset: 18,
      stopRadius: 22,
      stepPhase: 0,
      facing: 'down',
    },
    {
      id: 'kairon',
      name: 'Kairon',
      avatar: '🎸',
      color: '#a855f7',
      role: 'Demagogue Bard',
      corner: 'East (Sonic Dissonance)',
      x: 580,
      y: 110,
      vx: 0,
      vy: 0,
      targetDist: 90,
      lateralOffset: -4,
      stopRadius: 26,
      stepPhase: 0,
      facing: 'down',
    },
  ]);

  // Proximity & Dialogue
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);

  // Drinking Contest State
  const [isDrinkingContestActive, setIsDrinkingContestActive] = useState(false);
  const [contestPhase, setContestPhase] = useState<'mashing' | 'round_cleared' | 'victory'>('mashing');
  const [contestRound, setContestRound] = useState(1);
  const [contestTension, setContestTension] = useState(0);
  const [contestWon, setContestWon] = useState(false);
  const [gulpBurst, setGulpBurst] = useState<number | null>(null);
  const [roundBanner, setRoundBanner] = useState<string | null>(null);

  // Ambush & 4 Corners Standoff State
  const [isAmbushActive, setIsAmbushActive] = useState(false);
  const [ambushTrauma, setAmbushTrauma] = useState(0);
  const [selectedStandoffId, setSelectedStandoffId] = useState<string>('bozog_roar');
  const [standoffResolved, setStandoffResolved] = useState<string | null>(null);

  // Quest & Progression Flags
  const [visitedMatchstick, setVisitedMatchstick] = useState(false);
  const [visitedAtreyu, setVisitedAtreyu] = useState(false);
  const [visitedKairon, setVisitedKairon] = useState(false);

  // Synchronized refs for continuous 60 FPS loop (prevents re-mounts & position resets)
  const isDrinkingContestActiveRef = useRef(isDrinkingContestActive);
  useEffect(() => { isDrinkingContestActiveRef.current = isDrinkingContestActive; }, [isDrinkingContestActive]);

  const contestPhaseRef = useRef(contestPhase);
  useEffect(() => { contestPhaseRef.current = contestPhase; }, [contestPhase]);

  const contestRoundRef = useRef(contestRound);
  useEffect(() => { contestRoundRef.current = contestRound; }, [contestRound]);

  const contestWonRef = useRef(contestWon);
  useEffect(() => { contestWonRef.current = contestWon; }, [contestWon]);

  const isAmbushActiveRef = useRef(isAmbushActive);
  useEffect(() => { isAmbushActiveRef.current = isAmbushActive; }, [isAmbushActive]);

  const ambushTraumaRef = useRef(ambushTrauma);
  useEffect(() => { ambushTraumaRef.current = ambushTrauma; }, [ambushTrauma]);

  const dialogueRef = useRef(dialogue);
  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);

  // Terminal Progression Wall & Dead State Flag (Locks game after Knights Standoff resolution)
  const [isProgressionLocked, setIsProgressionLocked] = useState<boolean>(false);
  const isProgressionLockedRef = useRef<boolean>(false);
  useEffect(() => { isProgressionLockedRef.current = isProgressionLocked; }, [isProgressionLocked]);
  const [isProgressionPromptDismissed, setIsProgressionPromptDismissed] = useState<boolean>(false);

  // Point of No Return / Door Confirmation Modal Flag (Prompt before locking progression & triggering Ambush)
  const [showDoorProgressionWarning, setShowDoorProgressionWarning] = useState<boolean>(false);
  const showDoorProgressionWarningRef = useRef<boolean>(false);
  useEffect(() => { showDoorProgressionWarningRef.current = showDoorProgressionWarning; }, [showDoorProgressionWarning]);

  // Master Architectural Directive (ESSENCE FL0W v0.1) Subsystem Controllers
  const drinkingDuelRef = useRef<DrinkingDuelController>(new DrinkingDuelController({ round: 1 }));
  const matchstickReconRef = useRef<MatchstickSpottingController>(new MatchstickSpottingController());
  const kaironRhythmRef = useRef<KaironRhythmController>(new KaironRhythmController());
  const particleEngineRef = useRef<VisualistParticleEngine>(new VisualistParticleEngine(160));

  // Matchstick Spotting Minigame States
  const [isMatchstickReconActive, setIsMatchstickReconActive] = useState<boolean>(false);
  const isMatchstickReconActiveRef = useRef<boolean>(false);
  useEffect(() => { isMatchstickReconActiveRef.current = isMatchstickReconActive; }, [isMatchstickReconActive]);

  const [matchstickReconWon, setMatchstickReconWon] = useState<boolean>(false);
  const matchstickReconWonRef = useRef<boolean>(false);
  useEffect(() => { matchstickReconWonRef.current = matchstickReconWon; }, [matchstickReconWon]);

  const [reconSnapshot, setReconSnapshot] = useState({
    state: 'PRE_RECON',
    timeRemaining: 30,
    spottedCount: 0,
    focusCharge: 0,
    focusedIndex: -1,
    snapshotFlash: 0,
    rx: 0.5,
    ry: 0.5,
    targets: [] as any[],
  });

  // Kairon Body Drums Rhythm Minigame States
  const [isKaironRhythmActive, setIsKaironRhythmActive] = useState<boolean>(false);
  const isKaironRhythmActiveRef = useRef<boolean>(false);
  useEffect(() => { isKaironRhythmActiveRef.current = isKaironRhythmActive; }, [isKaironRhythmActive]);

  const [kaironRhythmWon, setKaironRhythmWon] = useState<boolean>(false);
  const kaironRhythmWonRef = useRef<boolean>(false);
  useEffect(() => { kaironRhythmWonRef.current = kaironRhythmWon; }, [kaironRhythmWon]);

  const [rhythmSnapshot, setRhythmSnapshot] = useState({
    state: 'PRE_JAM',
    countdown: 3,
    countdownText: null as string | null,
    score: 0,
    combo: 0,
    maxCombo: 0,
    grooveMeter: 0.5,
    lastRating: '',
    ratingTimer: 0,
    laneFlashes: [0, 0, 0],
    notes: [] as any[],
    elapsedTime: 0,
  });

  // Checkpoint & Minigame Modals (The Tavern Hearth, Tavern Darts, Zozog Sparring)
  const [isHearthModalOpen, setIsHearthModalOpen] = useState<boolean>(false);
  const [isDartsModalOpen, setIsDartsModalOpen] = useState<boolean>(false);
  const [isSparringModalOpen, setIsSparringModalOpen] = useState<boolean>(false);

  const handleRestoreHearthState = (save: EssenceFlowSaveState) => {
    if (playerRef.current && save.player) {
      playerRef.current.teleport(save.player.x, save.player.y);
      playerRef.current.velocity.x = 0;
      playerRef.current.velocity.y = 0;
    }
  };

  const dialoguePacerRef = useRef<DialoguePacer>(
    new DialoguePacer({
      onChar: (char, node, index) => {
        // Deltarune-style character speech vocalization blip: emit blip every 2 non-whitespace characters
        if (index % 2 === 1) {
          playDialogueBlip(node?.speaker || 'Narrator', char);
        }
      },
    })
  );
  const audioGraphRef = useRef<TavernAudioGraph | null>(null);

  // Title Screen / Landing Page State for Browser Audio Gesture Unlock
  const [isTitleScreenActive, setIsTitleScreenActive] = useState<boolean>(true);
  const isTitleScreenActiveRef = useRef<boolean>(true);
  useEffect(() => {
    isTitleScreenActiveRef.current = isTitleScreenActive;
  }, [isTitleScreenActive]);

  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);

  const handleEnterTavern = () => {
    setIsTitleScreenActive(false);
    isTitleScreenActiveRef.current = false;
    unlockAudio();
    if (!audioGraphRef.current) {
      audioGraphRef.current = new TavernAudioGraph();
    }
    audioGraphRef.current.ensureContext();
    audioGraphRef.current.transitionToStage(1);
    setIsMusicPlaying(true);
    playCelestialChime(528, 'sine', 0.5);
  };

  const handleToggleMusic = () => {
    if (!audioGraphRef.current) {
      audioGraphRef.current = new TavernAudioGraph();
      audioGraphRef.current.ensureContext();
      audioGraphRef.current.transitionToStage(1);
      setIsMusicPlaying(true);
      return;
    }
    const nextState = !isMusicPlaying;
    setIsMusicPlaying(nextState);
    if (nextState) {
      audioGraphRef.current.ensureContext();
      if (audioGraphRef.current.masterGain && audioGraphRef.current.ctx) {
        audioGraphRef.current.masterGain.gain.setValueAtTime(0.75, audioGraphRef.current.ctx.currentTime);
      }
    } else {
      if (audioGraphRef.current.masterGain && audioGraphRef.current.ctx) {
        audioGraphRef.current.masterGain.gain.setValueAtTime(0.0001, audioGraphRef.current.ctx.currentTime);
      }
    }
  };

  const [duelSnapshot, setDuelSnapshot] = useState({
    vBozog: 1.0,
    vAtreyu: 1.0,
    state: 'PRE_DUEL',
    trauma: 0.0,
    bannerScale: 1.0,
    lockoutRemainingMs: 0,
    choked: false,
  });

  const [pacerDisplayText, setPacerDisplayText] = useState('');
  const [pacerPrompt, setPacerPrompt] = useState<{ visible: boolean; y: number; alpha: number; label: string }>({
    visible: false,
    y: 0,
    alpha: 0,
    label: '',
  });

  const openDialogue = (dlg: DialogueState) => {
    setDialogue(dlg);
    dialoguePacerRef.current.startNode(dlg);
    setPacerDisplayText('');
  };

  const handleDialogueInput = () => {
    if (!dialogueRef.current) return;
    const res = dialoguePacerRef.current.handleInput(performance.now());
    if (res.action === 'skip_stream') {
      setPacerDisplayText(dialoguePacerRef.current.getDisplayText());
      return;
    }
    if (res.action === 'advance_node') {
      const act = dialogueRef.current.actionText;
      setDialogue(null);
      if (act === 'Begin Mirror Recon') {
        if (!isMatchstickReconActiveRef.current && !matchstickReconWonRef.current) {
          handleStartMatchstickRecon();
        }
      } else if (act === 'Begin Body Drums Jam') {
        if (!isKaironRhythmActiveRef.current && !kaironRhythmWonRef.current) {
          handleStartKaironRhythm();
        }
      } else if (act === 'Begin Drinking Contest' || act) {
        if (!isDrinkingContestActiveRef.current && !contestWonRef.current) {
          handleStartDrinkingContest();
        }
      }
    }
  };

  // Fetch standalone HTML from server
  const fetchHtml = async () => {
    setIsLoadingHtml(true);
    try {
      const res = await fetch('/api/journeys/html');
      if (res.ok) {
        const data = await res.json();
        setHtmlContent(data.content || '');
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingHtml(false);
    }
  };

  useEffect(() => {
    fetchHtml();
  }, []);

  const handleSaveHtml = async () => {
    setIsSavingHtml(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/journeys/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: htmlContent }),
      });
      if (res.ok) {
        setSaveStatus('Saved successfully to /public/journeys/index.html');
        playCelestialChime(880);
      } else {
        setSaveStatus('Failed to save HTML file.');
      }
    } catch (e: any) {
      setSaveStatus(`Error: ${e.message}`);
    } finally {
      setIsSavingHtml(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    playDispatchSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playCelestialChime(660);
  };

  // Start Drinking Contest
  const handleStartDrinkingContest = () => {
    setIsDrinkingContestActive(true);
    setContestPhase('mashing');
    setContestRound(1);
    setContestTension(0);
    setContestWon(false);

    // Stage 2: Duel Crossfade (1.2s crossfade to G1=0.3, G2=1.0)
    if (!audioGraphRef.current) {
      audioGraphRef.current = new TavernAudioGraph();
      audioGraphRef.current.ensureContext();
    }
    audioGraphRef.current.transitionToStage(2);

    // Initialize Drinking Duel Controller state machine
    drinkingDuelRef.current.startRound(1);

    // Dispatch Juju Anchor Start Telemetry (< 256 bytes)
    jujuAnchor.dispatchAnchor({
      sceneId: 'JRN_TAVERN_01',
      activeNode: 'DUEL_START_ROUND_1',
      duelComplete: false,
      intensity: 0.65,
      tension: 0.5,
    });

    setRoundBanner('ROUND 1: WARMUP ALE');
    setTimeout(() => setRoundBanner(null), 1800);
    playCelestialChime(600);
  };

  // Mash in Drinking Contest with tactile feedback and unhurried pacing
  const handleMashDrink = () => {
    if (!isDrinkingContestActiveRef.current || contestWonRef.current) return;
    
    // If in round_cleared or victory phase, advance appropriately
    if (contestPhaseRef.current === 'round_cleared') {
      handleAdvanceNextRound();
      return;
    }
    if (contestPhaseRef.current === 'victory') {
      handleCloseContestVictory();
      return;
    }

    const res = drinkingDuelRef.current.tap(performance.now());
    if (res.choked) {
      playCelestialChime(220, 'sawtooth', 0.15);
      return;
    }

    if (!res.accepted) return;

    // Tactile pitch rise and foam splash feedback
    const pitch = 400 + contestRoundRef.current * 100 + (1.0 - res.vBozog) * 180;
    playCelestialChime(pitch, 'triangle', 0.12);
    setGulpBurst(Date.now());
    setTimeout(() => setGulpBurst(null), 300);

    const progress = Math.round((1.0 - res.vBozog) * 100);
    setContestTension(progress);

    if (res.vBozog <= 0.0) {
      if (contestRoundRef.current < 3) {
        // Round Cleared: switch to round_cleared phase so player can read Atreyu's retort comfortably
        setContestPhase('round_cleared');
        playRuneCastSound();
        setRoundBanner(`ROUND ${contestRoundRef.current} CLEARED!`);
        setTimeout(() => setRoundBanner(null), 2000);
      } else {
        // Finished all 3 rounds: Round 3 Climax!
        setContestPhase('victory');
        setContestWon(true);
        setVisitedAtreyu(true);
        playDispatchSound();
        playRuneCastSound();
        setRoundBanner('🏆 CHAMPION OF THE GREEDY GREENS!');

        // Transition Audio to Stage 3 (Sudden Silence & Footsteps)
        audioGraphRef.current?.transitionToStage(3);

        // Dispatch Juju Anchor Climax Telemetry (< 256 bytes)
        jujuAnchor.dispatchAnchor({
          sceneId: 'JRN_TAVERN_01',
          activeNode: 'DUEL_ROUND_3_CLIMAX',
          duelComplete: true,
          duelWinner: 'bozog',
          intensity: 1.0,
          tension: 0.95,
        });
      }
    }
  };

  // Advance to Next Round (controlled transition so dialogue is never skipped)
  const handleAdvanceNextRound = () => {
    const nextR = contestRoundRef.current + 1;
    if (nextR <= 3) {
      setContestRound(nextR);
      setContestTension(0);
      setContestPhase('mashing');
      drinkingDuelRef.current.startRound(nextR);
      setRoundBanner(`ROUND ${nextR}: ${DRINKING_ROUNDS[nextR - 1].drink.toUpperCase()}`);
      setTimeout(() => setRoundBanner(null), 1800);
      playCelestialChime(660);

      jujuAnchor.dispatchAnchor({
        sceneId: 'JRN_TAVERN_01',
        activeNode: `DUEL_START_ROUND_${nextR}`,
        duelComplete: false,
        intensity: 0.65 + nextR * 0.1,
        tension: 0.6,
      });
    }
  };

  // Claim Victory, Conclude Contest without triggering ambush
  const handleCloseContestVictory = () => {
    setIsDrinkingContestActive(false);
    setContestWon(true);
    contestWonRef.current = true;
    setVisitedAtreyu(true);
    playCelestialChime(880);
    openDialogue({
      speaker: 'Atreyu (High Moon Priestess)',
      avatar: '🌙',
      color: '#818cf8',
      text: 'Atreyu sets down her pewter chalice, breathing hard with a broad, genuine grin: "Unmatched constitution, Bozog! Three flagons of Moon-Cask grog and you didn\'t even flinch. The Moon Temple owes you a boon. The Greedy Greens has its undisputed champion!"',
    });
  };

  // Matchstick Mirror Recon Handlers
  const handleStartMatchstickRecon = () => {
    setIsMatchstickReconActive(true);
    isMatchstickReconActiveRef.current = true;
    matchstickReconRef.current.onSpotTarget = (_target) => {
      playCelestialChime(880, 'triangle', 0.25);
      particleEngineRef.current.spawnShockwave(400, 300, '#38bdf8', 75);
    };
    matchstickReconRef.current.onComplete = (success) => {
      handleCloseMatchstickRecon(success);
    };
    matchstickReconRef.current.start();
    playCelestialChime(750, 'sine', 0.3);
  };

  const handleCloseMatchstickRecon = (success: boolean) => {
    setIsMatchstickReconActive(false);
    isMatchstickReconActiveRef.current = false;
    if (success) {
      setMatchstickReconWon(true);
      matchstickReconWonRef.current = true;
      setVisitedMatchstick(true);
      playCelestialChime(960, 'sine', 0.4);
      openDialogue({
        speaker: 'Matchstick (Scout)',
        avatar: '🪞',
        color: '#38bdf8',
        text: 'Matchstick clicks his silver pocket mirror shut with a razor grin: "All three Black Knight scouts are cataloged: the crane marksman, the crate sentry, and the skiff signalman. When those heavy oak doors blow, Bozog, their perimeter is already compromised!"',
      });
    } else {
      openDialogue({
        speaker: 'Matchstick (Scout)',
        avatar: '🪞',
        color: '#38bdf8',
        text: 'Matchstick pulls back from the misty pane. "Fog rolled in thick or time ran out. Catch your breath and check the mirror angles again when you\'re ready."',
      });
    }
  };

  // Kairon Body Drums Rhythm Handlers
  const handleStartKaironRhythm = () => {
    setIsKaironRhythmActive(true);
    isKaironRhythmActiveRef.current = true;
    kaironRhythmRef.current.onHit = (lane, rating) => {
      if (rating === 'PERFECT') {
        playCelestialChime(lane === 0 ? 180 : lane === 1 ? 380 : 560, 'sine', 0.2);
      } else if (rating === 'GOOD') {
        playCelestialChime(lane === 0 ? 160 : lane === 1 ? 340 : 500, 'triangle', 0.15);
      }
    };
    kaironRhythmRef.current.onComplete = (success) => {
      handleCloseKaironRhythm(success);
    };
    kaironRhythmRef.current.start();
    playCelestialChime(660, 'sawtooth', 0.35);
  };

  const handleCloseKaironRhythm = (success: boolean) => {
    setIsKaironRhythmActive(false);
    isKaironRhythmActiveRef.current = false;
    if (success) {
      setKaironRhythmWon(true);
      kaironRhythmWonRef.current = true;
      setVisitedKairon(true);
      playCelestialChime(1046, 'sine', 0.5);
      openDialogue({
        speaker: 'Kairon the Eternal',
        avatar: '🎸',
        color: '#a855f7',
        text: 'Kairon strikes an exultant final chord, horns glowing in the lantern light: "BY THE HARMONIC VOID! That chest thump and tusk rhythm rattled the greedy greens to its foundation! Even the cellar rats were tapping in 4/4 time! We are fully locked and loaded, berserker!"',
      });
    } else {
      openDialogue({
        speaker: 'Kairon the Eternal',
        avatar: '🎸',
        color: '#a855f7',
        text: 'Kairon eases his strumming tempo: "Lost the groove in the breakdown, big guy! No shame in it—relax those tusks and jump back on the body drums whenever you feel the cadence."',
      });
    }
  };

  // Lock and Confirm Door Progression to Ambush
  const handleConfirmDoorProgression = () => {
    setShowDoorProgressionWarning(false);
    showDoorProgressionWarningRef.current = false;
    handleTriggerAmbush();
  };

  // Trigger Inciting Ambush
  const handleTriggerAmbush = () => {
    setIsAmbushActive(true);
    isAmbushActiveRef.current = true;
    setAmbushTrauma(1.0); // Max trauma for quadratic shake
    playRuneCastSound();

    // Stage 4: Ambush Crash with -6dB master gain ducking
    if (!audioGraphRef.current) {
      audioGraphRef.current = new TavernAudioGraph();
      audioGraphRef.current.ensureContext();
    }
    audioGraphRef.current.transitionToStage(4);

    // Dispatch Juju Anchor Ambush Telemetry (< 256 bytes)
    jujuAnchor.dispatchAnchor({
      sceneId: 'JRN_TAVERN_01',
      activeNode: 'AMBUSH_BREACH',
      duelComplete: true,
      duelWinner: 'bozog',
      intensity: 0.98,
      tension: 1.0,
    });

    openDialogue({
      speaker: 'Black Knights',
      avatar: '🛡️',
      color: '#f43f5e',
      text: 'BY ORDER OF THE CITADEL! "The Greedy Greens" is an unregistered harbor den harboring dissident arcanists! Surrender your weapons and submit to the Scales of Order!',
    });
  };

  // Select a 4 Corners Standoff Option (Selection Phase)
  const handleSelectStandoff = (choiceId: string) => {
    setSelectedStandoffId(choiceId);
    playCelestialChime(750, 'sine', 0.1);
  };

  // Confirm and Execute the 4 Corners Tactical Initiative (Resolution Phase)
  const handleConfirmStandoff = () => {
    const choice = AMBUSH_STANDOFF_CHOICES.find((c) => c.id === selectedStandoffId);
    if (!choice) return;

    setStandoffResolved(choice.id);
    partyTrainUnlockedRef.current = true;
    setPartyTrainUnlocked(true);

    // Wall off progression to a dead state after player decides what to do after the knights break in
    setIsProgressionLocked(true);
    isProgressionLockedRef.current = true;
    setIsProgressionPromptDismissed(false);

    playDispatchSound();
    playRuneCastSound();

    if (choice.id === 'bozog_roar') {
      openDialogue({
        speaker: 'Bozog the Berserker',
        avatar: '🪓',
        color: '#10b981',
        text: 'Bozog roars with thunderous laughter, vaults the mahogany bar counter, and cleaves the lead Black Knight\'s tower shield into kindling! "YOU TRASH MY TAVERN, YOU PAY IN BLOOD!" The mutual restitution pact is sealed—the four corners unite to demand restitution!',
      });
    } else if (choice.id === 'atreyu_ward') {
      openDialogue({
        speaker: 'Atreyu (High Moon Priestess)',
        avatar: '🌙',
        color: '#e0e7ff',
        text: 'Atreyu steps between the breached oak doors, thrusting her crescent staff forward. A surging silver lunar tide barrier erupts from the floorboards, deflecting the Black Knights\' crossbow bolts and blinding them in holy radiance! "By the silver crescent, you profane sovereign harbor sanctuary!"',
      });
    } else if (choice.id === 'kairon_mock') {
      openDialogue({
        speaker: 'Kairon the Eternal',
        avatar: '🎸',
        color: '#a855f7',
        text: 'Kairon rips a deafening forbidden 7th-harmonic chord from his tuned lute, overloading the Black Knights\' audio-crystal visors into shrieking white static! "Order is so utterly derivative, boys! Let\'s show them tempo!"',
      });
    } else {
      openDialogue({
        speaker: 'Matchstick',
        avatar: '🪞',
        color: '#38bdf8',
        text: 'Matchstick extinguishes the corner booth lantern, angles his polished silver pocket mirror to refract the chandelier glare directly into the Black Knights\' eyes, and slips into their blind flank! "Angle acquired. Let us step outside their formation."',
      });
    }
  };

  // Master Zero-State Reset Handler (AU-03 deterministic reset to pristine initial state)
  const handleFullResetToZeroState = () => {
    // 1. Kinematic player reset
    if (playerRef.current) {
      playerRef.current.teleport(340, 340);
      playerRef.current.velocity.x = 0;
      playerRef.current.velocity.y = 0;
      playerRef.current.acceleration.x = 0;
      playerRef.current.acceleration.y = 0;
    }
    keysRef.current = {};

    // 2. Reset followers to original standalone positions
    followersRef.current = [
      {
        id: 'matchstick',
        name: 'Matchstick',
        avatar: '🪞',
        color: '#38bdf8',
        role: 'Scout / Mirror Tactician',
        corner: 'North (Refraction)',
        x: 200,
        y: 90,
        vx: 0,
        vy: 0,
        targetDist: 38,
        lateralOffset: -16,
        stopRadius: 18,
        stepPhase: 0,
        facing: 'down',
      },
      {
        id: 'atreyu',
        name: 'Atreyu',
        avatar: '🌙',
        color: '#e0e7ff',
        role: 'High Moon Priestess',
        corner: 'West (Lunar Mystic)',
        x: 130,
        y: 240,
        vx: 0,
        vy: 0,
        targetDist: 64,
        lateralOffset: 18,
        stopRadius: 22,
        stepPhase: 0,
        facing: 'down',
      },
      {
        id: 'kairon',
        name: 'Kairon',
        avatar: '🎸',
        color: '#a855f7',
        role: 'Demagogue Bard',
        corner: 'East (Sonic Dissonance)',
        x: 580,
        y: 110,
        vx: 0,
        vy: 0,
        targetDist: 90,
        lateralOffset: -4,
        stopRadius: 26,
        stepPhase: 0,
        facing: 'down',
      },
    ];

    // 3. Reset party squad formation
    partyTrainUnlockedRef.current = false;
    setPartyTrainUnlocked(false);

    // 4. Reset drinking contest state (Clear all duel state & flags)
    isDrinkingContestActiveRef.current = false;
    setIsDrinkingContestActive(false);
    contestWonRef.current = false;
    setContestWon(false);
    setContestPhase('mashing');
    setContestRound(1);
    contestRoundRef.current = 1;
    setContestTension(0);
    setGulpBurst(null);
    setRoundBanner(null);
    drinkingDuelRef.current.reset();
    setDuelSnapshot({
      vBozog: 1.0,
      vAtreyu: 1.0,
      state: 'PRE_DUEL',
      trauma: 0.0,
      bannerScale: 1.0,
      lockoutRemainingMs: 0,
      choked: false,
    });

    // 4b. Reset Matchstick Recon
    isMatchstickReconActiveRef.current = false;
    setIsMatchstickReconActive(false);
    matchstickReconWonRef.current = false;
    setMatchstickReconWon(false);
    matchstickReconRef.current.reset();
    setReconSnapshot(matchstickReconRef.current.toSnapshot());

    // 4c. Reset Kairon Rhythm
    isKaironRhythmActiveRef.current = false;
    setIsKaironRhythmActive(false);
    kaironRhythmWonRef.current = false;
    setKaironRhythmWon(false);
    kaironRhythmRef.current.reset();
    setRhythmSnapshot(kaironRhythmRef.current.toSnapshot());

    // 5. Reset Ambush & Standoff
    isAmbushActiveRef.current = false;
    setIsAmbushActive(false);
    ambushTraumaRef.current = 0;
    setAmbushTrauma(0);
    setSelectedStandoffId('bozog_roar');
    setStandoffResolved(null);

    // 6. Reset Progression Lock Wall / Dead State & Door Warning
    isProgressionLockedRef.current = false;
    setIsProgressionLocked(false);
    setIsProgressionPromptDismissed(false);
    setShowDoorProgressionWarning(false);
    showDoorProgressionWarningRef.current = false;

    // 7. Reset Exploration flags & Dialogue
    setVisitedMatchstick(false);
    setVisitedAtreyu(false);
    setVisitedKairon(false);
    setDialogue(null);
    dialogueRef.current = null;
    setPacerDisplayText('');
    setActiveInteraction(null);

    // 8. Chime
    playCelestialChime(440, 'triangle', 0.25);
  };

  const fullResetRef = useRef(handleFullResetToZeroState);
  useEffect(() => {
    fullResetRef.current = handleFullResetToZeroState;
  });

  // =========================================================================
  // Initialize In-Game World & Kinematic Controller (THE GREEDY GREENS)
  // =========================================================================
  useEffect(() => {
    if (activeTab !== 'game') return;

    const world = new SpatialWorld();

    // The Greedy Greens Perimeter Walls (800x600 Canvas)
    world.addCollider({ x: 0, y: 0, w: 800, h: 28, label: 'North Wall (Weathered Oak)' });
    world.addCollider({ x: 0, y: 572, w: 320, h: 28, label: 'South Wall Left' });
    world.addCollider({ x: 480, y: 572, w: 320, h: 28, label: 'South Wall Right' });
    // South Doorway Barricade / Reinforced Door (Breached in Ambush)
    world.addCollider({ x: 320, y: 576, w: 160, h: 24, label: 'Reinforced Oak Entrance', color: '#451a03' });

    world.addCollider({ x: 0, y: 28, w: 28, h: 544, label: 'West Pier Wall' });
    world.addCollider({ x: 772, y: 28, w: 28, h: 544, label: 'East Wall' });

    // SETPIECE 1: The Main Bar Counter (West Wall) - Mahogany
    world.addCollider({ x: 44, y: 120, w: 76, h: 280, color: '#2e1065', label: 'Main Bar Counter (Atreyu)' });

    // SETPIECE 2: The Ramshackle Stage (North-East Quarter)
    world.addCollider({ x: 480, y: 44, w: 260, h: 120, color: '#1e1b4b', label: 'Ramshackle Stage (Kairon)' });

    // SETPIECE 3: The Shadowed Corner Booth (North-West Corner)
    world.addCollider({ x: 130, y: 44, w: 120, h: 80, color: '#0f172a', label: 'Corner Booth (Matchstick)' });

    // Tavern Tables & Obstacles (D&D Bar Brawl / AABB Sliding Testbeds)
    world.addCollider({ x: 280, y: 200, w: 70, h: 70, color: '#312e81', label: 'Tavern Table A' });
    world.addCollider({ x: 440, y: 280, w: 70, h: 70, color: '#312e81', label: 'Tavern Table B' });
    world.addCollider({ x: 620, y: 380, w: 60, h: 60, color: '#312e81', label: 'Tavern Table C' });
    world.addCollider({ x: 690, y: 480, w: 60, h: 60, color: '#172554', label: 'Grog Casks & Rum Kegs' });

    // SETPIECE 4: The Tavern Hearth (North Wall Center - Checkpoint)
    world.addCollider({ x: 350, y: 28, w: 80, h: 56, color: '#451a03', label: 'The Tavern Hearth (Save Checkpoint)' });

    // SETPIECE 5: Tavern Darts (East Wall)
    world.addCollider({ x: 746, y: 300, w: 26, h: 64, color: '#291811', label: 'Tavern Darts Board' });

    // SETPIECE 6: Zozog Sparring Ring (South-West Corner)
    world.addCollider({ x: 44, y: 440, w: 76, h: 80, color: '#1c1917', label: 'Zozog Sparring Ring' });

    worldRef.current = world;

    // Solo Player Controller: Bozog the Berserker
    const player = new KinematicController({
      mass: 1.2,
      gravity: 0.0, // Top-down Deltarune movement
      air_damping: 0.00001, // Zero-drift snap
      footprint: { w: 24.0, h: 12.0, offsetX: 0.0, offsetY: 0.0 },
      spatialWorld: world,
    });
    player.teleport(340, 340);
    playerRef.current = player;

    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'KeyR') {
        fullResetRef.current();
        return;
      }

      // Active Matchstick Spotting Minigame Controls
      if (isMatchstickReconActiveRef.current) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          matchstickReconRef.current.moveReticleDelta(-0.06, 0);
          return;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          matchstickReconRef.current.moveReticleDelta(0.06, 0);
          return;
        }
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          matchstickReconRef.current.moveReticleDelta(0, -0.06);
          return;
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          matchstickReconRef.current.moveReticleDelta(0, 0.06);
          return;
        }
        if (e.code === 'KeyZ' || e.code === 'Space' || e.code === 'Enter') {
          const snap: any = matchstickReconRef.current.triggerSnapshot();
          if (snap === true || snap?.accepted) {
            playCelestialChime(880, 'triangle', 0.25);
            particleEngineRef.current.spawnShockwave(400, 300, '#38bdf8', 75);
          }
          return;
        }
        if (e.code === 'Escape' || e.code === 'KeyX') {
          handleCloseMatchstickRecon(false);
          return;
        }
        return;
      }

      // Active Kairon Rhythm Minigame Controls
      if (isKaironRhythmActiveRef.current) {
        if (e.code === 'KeyZ' || e.code === 'KeyA' || e.code === 'ArrowLeft') {
          const res = kaironRhythmRef.current.hitLane(0);
          if (res !== 'STRAY') {
            playCelestialChime(150, 'sine', 0.25);
            particleEngineRef.current.spawnShockwave(260, 480, '#e879f9', 50);
            particleEngineRef.current.spawnMusicNotes(260, 460, 2);
          }
          return;
        }
        if (e.code === 'KeyX' || e.code === 'KeyS' || e.code === 'ArrowDown') {
          const res = kaironRhythmRef.current.hitLane(1);
          if (res !== 'STRAY') {
            playCelestialChime(360, 'triangle', 0.2);
            particleEngineRef.current.spawnShockwave(400, 480, '#c084fc', 50);
            particleEngineRef.current.spawnMusicNotes(400, 460, 2);
          }
          return;
        }
        if (e.code === 'KeyC' || e.code === 'KeyD' || e.code === 'ArrowRight' || e.code === 'Space' || e.code === 'Enter') {
          const res = kaironRhythmRef.current.hitLane(2);
          if (res !== 'STRAY') {
            playCelestialChime(520, 'square', 0.2);
            particleEngineRef.current.spawnShockwave(540, 480, '#f59e0b', 65);
            particleEngineRef.current.spawnMusicNotes(540, 460, 3);
          }
          return;
        }
        if (e.code === 'Escape') {
          handleCloseKaironRhythm(false);
          return;
        }
        return;
      }

      // Escape to dismiss dialogue
      if (e.code === 'Escape') {
        setDialogue(null);
        return;
      }

      // Inspect / Action Trigger (Z or Space or Enter)
      if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space') {
        if (showDoorProgressionWarningRef.current) {
          handleConfirmDoorProgression();
          return;
        }

        if (isTitleScreenActiveRef.current) {
          handleEnterTavern();
          return;
        }

        if (dialogueRef.current) {
          handleDialogueInput();
          return;
        }

        if (isDrinkingContestActiveRef.current) {
          handleMashDrink();
        } else {
          checkInteractionPrompt(player.transform.x, player.transform.y, true);
        }
      }

      if (e.code === 'Escape' || e.code === 'KeyX') {
        if (showDoorProgressionWarningRef.current) {
          setShowDoorProgressionWarning(false);
          showDoorProgressionWarningRef.current = false;
          return;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // Check interaction proximity with generous bounding tolerance
    const checkInteractionPrompt = (px: number, py: number, execute = false) => {
      // NPC 1: Atreyu at West Bar (approx 130, 240)
      const distAtreyu = Math.hypot(px - 130, py - 240);
      const nearAtreyu = distAtreyu < 90 || (px >= 36 && px <= 170 && py >= 150 && py <= 340);

      // NPC 2: Kairon on Stage (approx 580, 110)
      const distKairon = Math.hypot(px - 580, py - 110);
      const nearKairon = distKairon < 95 || (px >= 460 && px <= 700 && py >= 40 && py <= 200);

      // NPC 3: Matchstick in Corner Booth (approx 200, 90)
      const distMatchstick = Math.hypot(px - 200, py - 90);
      const nearMatchstick = distMatchstick < 95 || (px >= 110 && px <= 270 && py >= 40 && py <= 180);

      // Setpiece 4: South Door (approx 400, 560)
      const distDoor = Math.hypot(px - 400, py - 560);
      const nearDoor = distDoor < 90 || (px >= 280 && px <= 520 && py >= 500);

      // Setpiece 5: The Tavern Hearth (approx 390, 60)
      const distHearth = Math.hypot(px - 390, py - 60);
      const nearHearth = distHearth < 95 || (px >= 310 && px <= 470 && py <= 120);

      // Setpiece 6: Tavern Darts (approx 746, 330)
      const distDarts = Math.hypot(px - 746, py - 330);
      const nearDarts = distDarts < 90 || (px >= 680 && py >= 250 && py <= 400);

      // Setpiece 7: Zozog Sparring (approx 82, 480)
      const distSparring = Math.hypot(px - 82, py - 480);
      const nearSparring = distSparring < 90 || (px <= 160 && py >= 400 && py <= 560);

      if (nearAtreyu) {
        if (contestWonRef.current) {
          setActiveInteraction('Atreyu (High Moon Priestess): [Z] Speak with Moon Priestess');
          if (execute) {
            setVisitedAtreyu(true);
            playCelestialChime(550, 'sine', 0.2);
            openDialogue({
              speaker: 'Atreyu (High Moon Priestess)',
              avatar: '🌙',
              color: '#818cf8',
              text: 'Atreyu nurses her aching temple with a rueful grin, setting down her drained pewter chalice in salute. "By the silver crescent, Bozog... three flagons of Moon-Cask spirit and you are still standing like an iron colossus. You have earned my respect—and my lunar ward, should the harbor garrison march on Delain."',
            });
          }
          return;
        }

        setActiveInteraction('Atreyu (High Moon Priestess): [Z] Challenge to Drinking Contest');
        if (execute) {
          setVisitedAtreyu(true);
          playCelestialChime(600, 'sine', 0.2);
          openDialogue({
            speaker: 'Atreyu (High Moon Priestess)',
            avatar: '🌙',
            color: '#818cf8',
            text: 'Atreyu rests her silver chalice on the polished mahogany, her posture serene and sober. "A berserker who drinks like a dwarf and talks like an outlaw. I have not tasted a single drop yet, Bozog—if you think you can stomach three flagons of Moon-Cask grog without hitting the sawdust, take a stool and prove your constitution!"',
            actionText: 'Begin Drinking Contest',
          });
        }
        return;
      }

      if (nearKairon) {
        if (kaironRhythmWonRef.current) {
          setActiveInteraction('Kairon the Eternal: [Z] Listen to Stage Riff');
          if (execute) {
            setVisitedKairon(true);
            playCelestialChime(880, 'sawtooth', 0.3);
            openDialogue({
              speaker: 'Kairon the Eternal',
              avatar: '🎸',
              color: '#a855f7',
              text: '*Strums an electric acoustic riff* "That body drumming was pure acoustic rebellion, Bozog! The Greedys\' timbers are still buzzing. We are tuned and ready to crash the garrison!"',
            });
          }
          return;
        }

        setActiveInteraction('Kairon the Eternal: [Z] Body Drums Jam (Rhythm Minigame)');
        if (execute) {
          setVisitedKairon(true);
          playCelestialChime(880, 'sawtooth', 0.3);
          openDialogue({
            speaker: 'Kairon the Eternal',
            avatar: '🎸',
            color: '#a855f7',
            text: '*Strikes a shrieking chord on his tuned lute* "Hey, big guy! Drop the greataxe and loosen those shoulders! Lay down some thunder on that chest plate—4-beat body drums with my riff! Let\'s rattle the rafters before the raid!"',
            actionText: 'Begin Body Drums Jam',
          });
        }
        return;
      }

      if (nearMatchstick) {
        if (matchstickReconWonRef.current) {
          setActiveInteraction('Matchstick (Scout): [Z] Review Recon Map & Sightlines');
          if (execute) {
            setVisitedMatchstick(true);
            playCelestialChime(660, 'sine', 0.2);
            openDialogue({
              speaker: 'Matchstick (Scout)',
              avatar: '🪞',
              color: '#38bdf8',
              text: '*Tilts silver mirror* "All three Black Knight sentries are pinned: crane marksman, crate sentry, skiff lookout. Our sightlines are clean. Let them try to breach Delain now!"',
            });
          }
          return;
        }

        setActiveInteraction('Matchstick: [Z] Mirror Recon (Spot Black Knights)');
        if (execute) {
          setVisitedMatchstick(true);
          playCelestialChime(660, 'sine', 0.2);
          openDialogue({
            speaker: 'Matchstick (Scout)',
            avatar: '🪞',
            color: '#38bdf8',
            text: '*Angles polished silver pocket mirror toward the misty dock window* "Two squads of Black Order vanguard are slipping through the harbor fog. Look through this mirror angle with me, Bozog—spot their 3 perimeter scouts before they seal Delain!"',
            actionText: 'Begin Mirror Recon',
          });
        }
        return;
      }

      if (nearDoor) {
        if (!isAmbushActiveRef.current) {
          setActiveInteraction('Reinforced South Doors: [Z] Inspect Doors (Trigger Raid)');
          if (execute) {
            setShowDoorProgressionWarning(true);
            showDoorProgressionWarningRef.current = true;
          }
        } else {
          setActiveInteraction('Reinforced South Doors: [Z] Inspect Breached Doors');
          if (execute) {
            openDialogue({
              speaker: 'The Greedy Greens Entrance',
              avatar: '🚪',
              color: '#f59e0b',
              text: 'The heavy oak doors are splintered by the Black Knights\' battering ram. The salty sea mist of Delain rushes into the tavern air.',
            });
          }
        }
        return;
      }

      if (nearHearth) {
        setActiveInteraction('The Tavern Hearth: [Z] Rest & Save Checkpoint');
        if (execute) {
          playCelestialChime(660, 'sine', 0.2);
          setIsHearthModalOpen(true);
        }
        return;
      }

      if (nearDarts) {
        setActiveInteraction('Tavern Darts: [Z] Play Darts (Aim & Lissajous Sway)');
        if (execute) {
          playCelestialChime(770, 'triangle', 0.2);
          setIsDartsModalOpen(true);
        }
        return;
      }

      if (nearSparring) {
        setActiveInteraction('Zozog (Brawler): [Z] Spar with Zozog (Strictly 2-Verb Strike/Block)');
        if (execute) {
          playCelestialChime(500, 'square', 0.2);
          setIsSparringModalOpen(true);
        }
        return;
      }

      setActiveInteraction(null);
    };

    triggerInteractionRef.current = () => {
      if (showDoorProgressionWarningRef.current) {
        handleConfirmDoorProgression();
        return;
      }

      if (dialogueRef.current) {
        handleDialogueInput();
        return;
      }

      if (isDrinkingContestActiveRef.current) {
        handleMashDrink();
      } else {
        checkInteractionPrompt(player.transform.x, player.transform.y, true);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      frameCount++;
      if (now - lastFpsUpdate > 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // Dialogue Pacer Typewriter & Bobbing Prompt Animation
      if (dialogueRef.current) {
        dialoguePacerRef.current.update(dt);
        setPacerDisplayText(dialoguePacerRef.current.getDisplayText());
        setPacerPrompt(dialoguePacerRef.current.getPromptMetric(0));
      }

      // Dynamic Tension Decay & Duel Controller Invariant Simulation
      let shakeX = 0;
      let shakeY = 0;

      if (isDrinkingContestActiveRef.current) {
        drinkingDuelRef.current.update(dt);
        const snap = drinkingDuelRef.current.toSnapshot();
        setDuelSnapshot({
          vBozog: snap.vBozog,
          vAtreyu: snap.vAtreyu,
          state: snap.state,
          trauma: snap.trauma,
          bannerScale: snap.bannerScale,
          lockoutRemainingMs: snap.lockoutRemainingMs,
          choked: snap.state === 'CHOKE_REBOUND',
        });

        // Add table slam trauma shake to camera shake
        if (drinkingDuelRef.current.cameraShake) {
          shakeX += drinkingDuelRef.current.cameraShake.x;
          shakeY += drinkingDuelRef.current.cameraShake.y;
        }

        // If AI won round before player, refill flagon for fair retry
        if (snap.winner === 'atreyu' && contestPhaseRef.current === 'mashing') {
          drinkingDuelRef.current.startRound(contestRoundRef.current);
          setRoundBanner('🌙 ATREYU FINISHED FIRST! FLAGON REFILLED');
          setTimeout(() => setRoundBanner(null), 1800);
        }
      }

      // Active Matchstick Recon Minigame Update
      if (isMatchstickReconActiveRef.current) {
        matchstickReconRef.current.update(dt);
        setReconSnapshot(matchstickReconRef.current.toSnapshot());
      }

      // Active Kairon Rhythm Minigame Update
      if (isKaironRhythmActiveRef.current) {
        kaironRhythmRef.current.update(dt);
        setRhythmSnapshot(kaironRhythmRef.current.toSnapshot());
      }

      // Visualist Particle System Update
      particleEngineRef.current.update(dt);

      // Camera Trauma Shake Decay: offset = max_angle * (trauma^2) * sin(time)
      if (ambushTraumaRef.current > 0) {
        ambushTraumaRef.current = Math.max(0, ambushTraumaRef.current - 1.2 * dt);
        setAmbushTrauma(ambushTraumaRef.current);
        const intensity = ambushTraumaRef.current * ambushTraumaRef.current;
        shakeX += (Math.random() * 2 - 1) * 14 * intensity;
        shakeY += (Math.random() * 2 - 1) * 14 * intensity;
      }

      // Active Matchstick Recon continuous reticle steering via held keys / virtual D-pad
      if (isMatchstickReconActiveRef.current) {
        const keys = keysRef.current;
        let rxDelta = 0;
        let ryDelta = 0;
        if (keys['KeyW'] || keys['ArrowUp']) ryDelta -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) ryDelta += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) rxDelta -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) rxDelta += 1;
        if (rxDelta !== 0 || ryDelta !== 0) {
          const reticleSpeed = 0.65 * dt;
          matchstickReconRef.current.moveReticleDelta(rxDelta * reticleSpeed, ryDelta * reticleSpeed);
        }
      }

      // Input Gathering (8-Way top-down) - Locked during minigames, title screen, progression lock, or door warning
      let fx = 0, fy = 0;
      if (!isDrinkingContestActiveRef.current && !isMatchstickReconActiveRef.current && !isKaironRhythmActiveRef.current && !isTitleScreenActiveRef.current && !isProgressionLockedRef.current && !showDoorProgressionWarningRef.current) {
        const keys = keysRef.current;
        if (keys['KeyW'] || keys['ArrowUp']) fy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) fy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) fx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) fx += 1;

        if (fx !== 0 && fy !== 0) {
          const invLen = 1 / Math.SQRT2;
          fx *= invLen;
          fy *= invLen;
        }

        const moveForce = keys['Space'] ? 19000 : 10500;
        player.applyForce(fx * moveForce, fy * moveForce);
      }
      player.update(dt);

      // Track leader heading for squad escort formation
      const leaderSpeed = Math.hypot(player.velocity.x, player.velocity.y);
      if (leaderSpeed > 10) {
        leaderHeadingRef.current = Math.atan2(player.velocity.y, player.velocity.x);
      }
      const heading = leaderHeadingRef.current;
      const backAngle = heading + Math.PI;
      const perpAngle = heading + Math.PI / 2;
      const leaderCenterX = player.transform.x + 12;
      const leaderCenterY = player.transform.y + 6;

      // Group Kinematics: Update Followers in Staggered Squad Formation
      if (partyTrainUnlockedRef.current) {
        followersRef.current.forEach((fol, idx) => {
          // Dynamic escort slot: staggered distance behind Bozog + lateral wing offset
          const slotX = leaderCenterX + Math.cos(backAngle) * fol.targetDist + Math.cos(perpAngle) * fol.lateralOffset;
          const slotY = leaderCenterY + Math.sin(backAngle) * fol.targetDist + Math.sin(perpAngle) * fol.lateralOffset;

          const dx = slotX - fol.x;
          const dy = slotY - fol.y;
          const dist = Math.hypot(dx, dy);

          if (dist > fol.stopRadius) {
            // Natural walking speed with distance scaling, matching leader sprint
            const desiredSpeed = Math.min(dist * 3.4, leaderSpeed > 140 ? 210 : 150);
            const targetVx = (dx / dist) * desiredSpeed;
            const targetVy = (dy / dist) * desiredSpeed;
            fol.vx += (targetVx - fol.vx) * 0.16;
            fol.vy += (targetVy - fol.vy) * 0.16;
            fol.stepPhase += dt * 8.5;
          } else {
            // Gentle deceleration into standing stance (no abrupt snap or jitter)
            fol.vx *= 0.82;
            fol.vy *= 0.82;
          }

          // Anti-crowding separation forces between followers (boids flocking rule)
          for (let j = 0; j < followersRef.current.length; j++) {
            if (idx !== j) {
              const other = followersRef.current[j];
              const sDx = fol.x - other.x;
              const sDy = fol.y - other.y;
              const sDist = Math.hypot(sDx, sDy);
              if (sDist < 26 && sDist > 0.01) {
                const push = (26 - sDist) * 1.6;
                fol.vx += (sDx / sDist) * push;
                fol.vy += (sDy / sDist) * push;
              }
            }
          }

          // Move and clamp inside tavern bounds
          fol.x = Math.max(36, Math.min(755, fol.x + fol.vx * dt));
          fol.y = Math.max(36, Math.min(555, fol.y + fol.vy * dt));

          if (Math.abs(fol.vx) > Math.abs(fol.vy)) {
            fol.facing = fol.vx > 0 ? 'right' : 'left';
          } else if (Math.abs(fol.vy) > 5) {
            fol.facing = fol.vy > 0 ? 'down' : 'up';
          }
        });
      }

      const spd = Math.hypot(player.velocity.x, player.velocity.y);
      setTelemetry((prev) => ({
        ...prev,
        x: Math.round(player.transform.x * 10) / 10,
        y: Math.round(player.transform.y * 10) / 10,
        speed: Math.round(spd),
        partyState: partyTrainUnlockedRef.current ? '4-Man Squad Formation (Bozog • Matchstick • Atreyu • Kairon)' : 'Solo (Bozog the Berserker)',
      }));

      if (!isDrinkingContestActiveRef.current) {
        checkInteractionPrompt(player.transform.x, player.transform.y, false);
      } else {
        setActiveInteraction(null);
      }

      // =====================================================================
      // RENDER "THE GREEDY GREENS" TAVERN DIORAMA
      // =====================================================================
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Tavern Dark Oak Floorboards
      ctx.fillStyle = '#140e09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Plank seams & wood grain
      ctx.strokeStyle = '#22150d';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Staggered vertical nail lines
        for (let x = (y % 64 === 0 ? 0 : 40); x < canvas.width; x += 80) {
          ctx.fillStyle = '#2d1c12';
          ctx.fillRect(x, y - 2, 2, 4);
        }
      }

      // 2. Ambient Lighting (Warm Whale-Oil Lantern Glows)
      const renderLantern = (lx: number, ly: number, radius: number) => {
        const radGrd = ctx.createRadialGradient(lx, ly, 10, lx, ly, radius);
        radGrd.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
        radGrd.addColorStop(0.6, 'rgba(217, 119, 6, 0.06)');
        radGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(lx, ly, radius, 0, Math.PI * 2);
        ctx.fill();

        // Lantern hanging fixture
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
        ctx.fill();
      };

      renderLantern(90, 200, 160);  // Bar lantern
      renderLantern(600, 110, 180); // Stage spotlight
      renderLantern(190, 80, 130);  // Booth lantern
      renderLantern(400, 520, 170); // South door lantern

      // 3. Render Colliders & Setpieces
      const colliders = world.colliders;
      for (const c of colliders) {
        ctx.fillStyle = c.color || '#261a10';
        ctx.fillRect(c.x, c.y, c.w, c.h);

        // Highlight rim
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(c.x, c.y, c.w, c.h);

        // Subtle 3D wood top bevel
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(c.x, c.y, c.w, 3);
      }

      // Bar counter details (Ale taps, dark ale spills)
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(44, 120, 76, 20);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('MOON CASKS', 48, 134);

      // Stage backdrop tapestries
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(480, 44, 260, 16);
      ctx.fillStyle = '#c084fc';
      ctx.font = '10px monospace';
      ctx.fillText('♪ KAIRON & THE DISSIDENTS ♪', 510, 56);

      // SETPIECE 4: The Tavern Hearth (Center North)
      ctx.fillStyle = '#292524';
      ctx.fillRect(350, 28, 80, 56);
      ctx.strokeStyle = '#78350f';
      ctx.strokeRect(350, 28, 80, 56);
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(362, 38, 56, 42);
      const hearthGrd = ctx.createRadialGradient(390, 60, 4, 390, 60, 36);
      hearthGrd.addColorStop(0, '#fef08a');
      hearthGrd.addColorStop(0.3, '#f59e0b');
      hearthGrd.addColorStop(0.7, '#ea580c');
      hearthGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hearthGrd;
      ctx.beginPath();
      ctx.arc(390, 60, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('🔥 HEARTH', 368, 74);

      // SETPIECE 5: Tavern Darts Board (East Wall)
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(746, 300, 26, 64);
      ctx.strokeStyle = '#92400e';
      ctx.strokeRect(746, 300, 26, 64);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(759, 332, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(759, 332, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = '8px monospace';
      ctx.fillText('🎯', 754, 320);

      // SETPIECE 6: Zozog Sparring Ring (South-West Corner)
      ctx.fillStyle = '#22150b';
      ctx.fillRect(44, 440, 76, 80);
      ctx.strokeStyle = '#78350f';
      ctx.strokeRect(44, 440, 76, 80);
      ctx.beginPath();
      ctx.ellipse(82, 480, 30, 26, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(82, 474, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('🥊 ZOZOG', 62, 506);

      // South Door Barricade status
      if (isAmbushActive) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('⚠️ BREACHED BY BLACK KNIGHTS', 300, 560);

        // Draw 3 Black Knight Sprites at South Portal
        const drawKnight = (kx: number, ky: number, label: string) => {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(kx - 10, ky - 18, 20, 26);
          // Cold blue visor
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(kx - 7, ky - 12, 14, 3);
          // White balance-scale tabard
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(kx - 4, ky - 6, 8, 10);
        };
        drawKnight(360, 545, 'K1');
        drawKnight(400, 530, 'K2');
        drawKnight(440, 545, 'K3');

        // Render Physical Progression Wall when locked in Dead State
        if (isProgressionLockedRef.current) {
          ctx.save();
          // Heavy barricade beam & backdrop
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(230, 516, 340, 54);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(230, 516, 340, 54);

          // Diagonal danger caution stripes
          ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
          for (let sx = 235; sx < 565; sx += 24) {
            ctx.beginPath();
            ctx.moveTo(sx, 570);
            ctx.lineTo(sx + 12, 516);
            ctx.lineTo(sx + 22, 516);
            ctx.lineTo(sx + 10, 570);
            ctx.closePath();
            ctx.fill();
          }

          // Runic Wall Heading
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⛔ [ PROGRESSION WALL • CHAPTER 0 CONCLUDED ] ⛔', 400, 538);
          ctx.fillStyle = '#fca5a5';
          ctx.font = '10px monospace';
          ctx.fillText('STANDOFF RESOLVED • DEAD STATE LOCKED • PRESS [R] TO RESET', 400, 555);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(330, 576, 140, 20);
        ctx.fillStyle = '#d97706';
        ctx.font = '10px monospace';
        ctx.fillText('DELAIN PIERS [BARRED OAK]', 334, 590);
      }

      // 4. Render NPC Stationed Sprites (or Vacated Markers when Party is Formed)
      if (!partyTrainUnlockedRef.current) {
        // NPC 1: Atreyu (High Moon Priest at West Bar)
        ctx.fillStyle = '#e0e7ff';
        ctx.beginPath();
        ctx.arc(130, 240, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(130, 240, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0e7ff';
        ctx.font = '10px monospace';
        ctx.fillText('🌙 Atreyu', 110, 260);

        // NPC 2: Kairon the Eternal (on Ramshackle Stage)
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(580, 110, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(572, 102); ctx.lineTo(566, 92);
        ctx.moveTo(588, 102); ctx.lineTo(594, 92);
        ctx.stroke();
        ctx.fillStyle = '#c084fc';
        ctx.font = '10px monospace';
        ctx.fillText('🎸 Kairon', 560, 130);

        // NPC 3: Matchstick (in Shadowed Corner Booth)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(200, 90, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(206, 88, 4, 4);
        ctx.fillStyle = '#7dd3fc';
        ctx.font = '10px monospace';
        ctx.fillText('🪞 Matchstick', 170, 110);
      } else {
        // Subtle ambient reminders that the party has mobilized
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.fillText('🍺 [Bar Vacated • In Formation]', 85, 255);
        ctx.fillText('🎸 [Stage Vacated • In Formation]', 535, 125);
        ctx.fillText('🕯️ [Booth Vacated • In Formation]', 155, 105);
      }

      // 5. Render Follower Squad (Natural Group Escort Formation)
      if (partyTrainUnlockedRef.current) {
        followersRef.current.forEach((fol) => {
          const fx = fol.x;
          const fy = fol.y;
          const isWalking = Math.hypot(fol.vx, fol.vy) > 8;
          const bob = isWalking ? Math.sin(fol.stepPhase) * 1.8 : 0;

          // Ground Contact Shadow
          ctx.beginPath();
          ctx.ellipse(fx, fy + 7, 7, 3.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fill();

          if (fol.id === 'matchstick') {
            // Matchstick (Scout): Cyan cowl, slender silhouette, silver pocket mirror glint
            ctx.fillStyle = fol.color;
            ctx.beginPath();
            ctx.arc(fx, fy + bob, 8.5, 0, Math.PI * 2);
            ctx.fill();
            // Silver mirror gleam
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(fx + 3, fy - 3 + bob, 3, 3);
            // Label
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '9px monospace';
            ctx.fillText('Matchstick 🪞', fx - 24, fy - 12 + bob);
          } else if (fol.id === 'atreyu') {
            // Atreyu (Moon Priest): Pale lunar robe, silver crescent trim & staff
            ctx.fillStyle = fol.color;
            ctx.beginPath();
            ctx.arc(fx, fy + bob, 9, 0, Math.PI * 2);
            ctx.fill();
            // Lunar Crescent Hood Trim
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(fx, fy + bob, 5, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
            // Crescent staff
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(fx + 9, fy - 10 + bob);
            ctx.lineTo(fx + 9, fy + 10 + bob);
            ctx.stroke();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(fx + 9, fy - 10 + bob, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Label
            ctx.fillStyle = '#e0e7ff';
            ctx.font = '9px monospace';
            ctx.fillText('Atreyu 🌙', fx - 18, fy - 13 + bob);
          } else if (fol.id === 'kairon') {
            // Kairon (Demagogue Bard): Purple demonic cloak, horns, acoustic guitar
            ctx.fillStyle = fol.color;
            ctx.beginPath();
            ctx.arc(fx, fy + bob, 9, 0, Math.PI * 2);
            ctx.fill();
            // Silver curved horns
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(fx - 5, fy - 7 + bob); ctx.lineTo(fx - 9, fy - 14 + bob);
            ctx.moveTo(fx + 5, fy - 7 + bob); ctx.lineTo(fx + 9, fy - 14 + bob);
            ctx.stroke();
            // Lute strap & body
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fx - 7, fy + 1 + bob);
            ctx.lineTo(fx + 7, fy + 6 + bob);
            ctx.stroke();
            // Label
            ctx.fillStyle = '#c084fc';
            ctx.font = '9px monospace';
            ctx.fillText('Kairon 🎸', fx - 18, fy - 13 + bob);
          }
        });
      }

      // 6. Render Player: Bozog the Berserker (Orc Silhouette)
      const fp = player.footprint;
      const px = player.transform.x;
      const py = player.transform.y;

      // Shadow
      ctx.beginPath();
      ctx.ellipse(px + fp.offsetX + fp.w / 2, py + fp.offsetY + fp.h / 2, fp.w / 2, fp.h / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Bozog Orc Body (Broad green shoulders)
      const bodyX = px;
      const bodyY = py - 14;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(bodyX + 12, bodyY + 12, 13, 0, Math.PI * 2);
      ctx.fill();

      // Red Pirate Bandana / Cuffs
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bodyX + 2, bodyY + 4, 20, 4);

      // Twin Tusks
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(bodyX + 7, bodyY + 15, 2.5, 4);
      ctx.fillRect(bodyX + 15, bodyY + 15, 2.5, 4);

      // Double-Bitted Greataxe on back
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bodyX + 22, bodyY - 2);
      ctx.lineTo(bodyX + 4, bodyY + 24);
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(bodyX + 20, bodyY - 5, 6, 6);

      // Nameplate
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Bozog 🪓', bodyX - 4, bodyY - 4);

      // Render The Visualist's dynamic particles and ambient lighting bloom
      particleEngineRef.current.render(ctx);
      particleEngineRef.current.renderLightingPass(ctx, canvas.width, canvas.height);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* View Title & Lore Bible Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-cinzel text-slate-100 flex items-center gap-2">
              <Wine className="w-5 h-5 text-amber-400" />
              THE GREEDY GREENS • VERTICAL SLICE (v0.2)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              BOZOG SOLO START
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Setting: The Greedy Greens (Delain Docks pirate dive bar). Replaces random chamber per Lore Bible v0.2.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { playCelestialChime(700); setIsLoreBibleOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Lore Bible (v0.2)</span>
          </button>

          <a
            href="/journeys/index.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Standalone Tab
          </a>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download HTML
          </button>

          <button
            onClick={handleFullResetToZeroState}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 transition-all cursor-pointer shadow-sm"
            title="Deterministic zero-state reset: reverts player, squad, drinking contest, ambush, and progression locks (Press R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Zero State [R]</span>
          </button>
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playCelestialChime(520);
              setActiveTab('game');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            The Greedy Greens Arena
          </button>

          <button
            onClick={() => {
              playCelestialChime(650);
              setActiveTab('preview');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            GitHub Pages Live Preview
          </button>

          <button
            onClick={() => {
              playCelestialChime(780);
              setActiveTab('html_manager');
              fetchHtml();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'html_manager'
                ? 'bg-purple-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Standalone index.html
          </button>

          <button
            onClick={() => {
              playCelestialChime(820);
              setActiveTab('sandboxes');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'sandboxes'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Proving Grounds (Sandboxes)
          </button>
        </div>

        {/* Device Dimensions Preset Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px] font-mono overflow-x-auto max-w-full">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider px-1 hidden md:inline">Preset:</span>
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
              previewDevice === 'desktop' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" /> Desktop
          </button>
          <button
            onClick={() => setPreviewDevice('iphone-14')}
            className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
              previewDevice === 'iphone-14' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" /> iPhone 14
          </button>
          <button
            onClick={() => setPreviewDevice('iphone-se')}
            className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
              previewDevice === 'iphone-se' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" /> iPhone SE
          </button>
          <button
            onClick={() => setPreviewDevice('landscape')}
            className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
              previewDevice === 'landscape' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3 rotate-90" /> Landscape
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
              previewDevice === 'tablet' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3 h-3" /> Tablet
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PLAYABLE IN-GAME REALM (THE GREEDY GREENS) */}
      {/* ==================================================================== */}
      {activeTab === 'game' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">
            <div className={`transition-all duration-300 mx-auto ${
              previewDevice === 'iphone-14' ? 'max-w-[400px]' :
              previewDevice === 'iphone-se' ? 'max-w-[375px]' :
              previewDevice === 'landscape' ? 'max-w-[700px]' :
              previewDevice === 'tablet' ? 'max-w-[768px]' : 'w-full'
            }`}>
              {/* Active Mobile Chassis Simulation Banner */}
              {previewDevice !== 'desktop' && (
                <div className="mb-2 flex items-center justify-between px-3 py-1 text-[11px] font-mono bg-cyan-950/70 border border-cyan-500/40 rounded-lg text-cyan-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    Simulating Mobile Dimensions: {
                      previewDevice === 'iphone-14' ? 'iPhone 14 (390×844)' :
                      previewDevice === 'iphone-se' ? 'iPhone SE (375×667)' :
                      previewDevice === 'landscape' ? 'Landscape (700×400)' : 'Tablet (768×1024)'
                    }
                  </span>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Reset Full
                  </button>
                </div>
              )}

              <div className={`relative rounded-2xl border ${
                previewDevice !== 'desktop'
                  ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-[#04060a] p-2.5 sm:p-3.5'
                  : 'border-amber-500/30 bg-[#07090e] p-3'
              } shadow-2xl overflow-hidden`}>

                {/* Mobile Phone Speaker Pill Notch */}
                {previewDevice !== 'desktop' && (
                  <div className="flex justify-center mb-2">
                    <div className="w-20 h-1 rounded-full bg-slate-800 border border-slate-700/60" />
                  </div>
                )}

                {/* Telemetry Header */}
                <div className="flex items-center justify-between mb-2 px-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-amber-300 font-semibold truncate max-w-[200px] sm:max-w-none">
                      {telemetry.room}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-400 text-xs flex-wrap justify-end">
                    <button
                      onClick={handleToggleMusic}
                      className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded border transition-all cursor-pointer ${
                        isMusicPlaying
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title="Toggle Procedural Tavern Hearth BGM"
                    >
                      {isMusicPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{isMusicPlaying ? 'BGM: ON' : 'BGM: OFF'}</span>
                    </button>

                    <button
                      onClick={() => setIsTitleScreenActive(true)}
                      className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 cursor-pointer"
                      title="Open Prologue Intro & Title Screen"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Intro</span>
                    </button>

                    <span>
                      <strong className="text-emerald-400">{fps}</strong> FPS
                    </span>
                    <button
                      onClick={handleFullResetToZeroState}
                      className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/80 cursor-pointer"
                      title="Reset Full Game to Pristine Zero State [R]"
                    >
                      <RotateCcw className="w-3 h-3 text-rose-400" />
                      <span>RESET [R]</span>
                    </button>
                  </div>
                </div>

                {/* Live Quest & Progression Tracker HUD */}
                <div className="mb-2 p-2 sm:p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-cinzel text-[11px] sm:text-xs font-bold text-slate-200">
                      PROGRESSION:
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      visitedMatchstick 
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold' 
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}>
                      {visitedMatchstick ? '✓ Matchstick (Scouted)' : '🪞 Matchstick (Booth)'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      visitedAtreyu 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold' 
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}>
                      {visitedAtreyu ? '✓ Atreyu (Bar Duel)' : '🌙 Atreyu (West Bar)'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      visitedKairon 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold' 
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}>
                      {visitedKairon ? '✓ Kairon (Solo Heard)' : '🎸 Kairon (Stage)'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      isAmbushActive 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold animate-pulse' 
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}>
                      {isAmbushActive ? '⚠️ South Door (Breached!)' : '🚪 South Door (Raid)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {standoffResolved && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold">
                        🏆 4-Man Squad Active
                      </span>
                    )}
                    {isProgressionLocked && (
                      <button
                        onClick={() => setIsProgressionPromptDismissed(false)}
                        className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-rose-600 hover:bg-rose-500 text-white font-bold border border-rose-300 animate-pulse cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                        title="Click to view Progression Wall End State Prompt"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>⛔ PROGWALL END STATE</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Canvas Frame - LOCKED 4:3 RATIO (Never stretches!) */}
                <div className="relative w-full aspect-[4/3] min-h-[290px] sm:min-h-[380px] md:min-h-[460px] flex items-center justify-center bg-[#0d0905] rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
                  <canvas
                    ref={gameCanvasRef}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain block cursor-crosshair select-none"
                  />

                  {/* Atmospheric Intro & Audio Gesture Landing Page */}
                  {isTitleScreenActive && (
                    <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-2.5 sm:p-5 text-center select-none overflow-y-auto gap-2 sm:gap-3">
                      {/* Top Prologue & Chapter Header */}
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] sm:text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
                          <span>⚓ Docks of Delain</span>
                          <span>•</span>
                          <span>Chapter 0: Tavern Prologue</span>
                        </div>
                        <h1 className="font-cinzel text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 tracking-wider drop-shadow-md">
                          JOURNEYS UNTO
                        </h1>
                        <p className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-wide text-amber-300/80">
                          THE GREEDY GREENS
                        </p>
                      </div>

                      {/* 4-Party Character Preview Banner */}
                      <div className="w-full max-w-lg bg-slate-900/80 border border-amber-500/30 rounded-xl p-2 sm:p-2.5 shadow-xl">
                        <div className="text-[9px] sm:text-[10px] font-mono text-amber-400/90 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1.5">
                          <Users className="w-3 h-3 text-amber-400" />
                          <span>The Four Corners Alliance</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-left">
                          <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-emerald-300">
                              <span>🪓</span> <span className="truncate">Bozog</span>
                            </div>
                            <div className="text-[8px] sm:text-[9px] text-emerald-400/80 font-mono truncate">Brawler</div>
                            <div className="text-[8px] text-slate-400 hidden sm:block">South</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-indigo-300">
                              <span>🌙</span> <span className="truncate">Atreyu</span>
                            </div>
                            <div className="text-[8px] sm:text-[9px] text-indigo-400/80 font-mono truncate">Moon Priest</div>
                            <div className="text-[8px] text-slate-400 hidden sm:block">West</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30">
                            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-purple-300">
                              <span>🎸</span> <span className="truncate">Kairon</span>
                            </div>
                            <div className="text-[8px] sm:text-[9px] text-purple-400/80 font-mono truncate">Minstrel</div>
                            <div className="text-[8px] text-slate-400 hidden sm:block">East</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30">
                            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-sky-300">
                              <span>🪞</span> <span className="truncate">Matchstick</span>
                            </div>
                            <div className="text-[8px] sm:text-[9px] text-sky-400/80 font-mono truncate">Tactician</div>
                            <div className="text-[8px] text-slate-400 hidden sm:block">North</div>
                          </div>
                        </div>
                      </div>

                      {/* Main Audio Unlock CTA Button */}
                      <div className="space-y-1.5 w-full max-w-md">
                        <button
                          type="button"
                          onClick={handleEnterTavern}
                          className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl font-cinzel font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.5)] border-2 border-amber-300 transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                        >
                          <Music className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                          <span>ENTER TAVERN (START MUSIC & AUDIO)</span>
                        </button>
                        <div className="text-[10px] font-mono text-amber-300/80 flex items-center justify-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-300">
                            [Z]
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-300">
                            [SPACE]
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-300">
                            [ENTER]
                          </span>
                          <span>to enter</span>
                        </div>
                      </div>

                      {/* Controls & Features Footer */}
                      <div className="w-full max-w-lg flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-800/80 text-[9px] sm:text-[10px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400 font-semibold">Controls:</span>
                          <span>[WASD] Move</span>
                          <span>•</span>
                          <span>[Z] Talk/Chug</span>
                          <span>•</span>
                          <span>[Space] Dash</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <span>💾 Save States: (v0.2)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Floating In-Canvas Interaction Prompt Badge (Tap or press [Z]) */}
                  {activeInteraction && !dialogue && (
                    <button
                      type="button"
                      onClick={() => triggerInteractionRef.current?.()}
                      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-cinzel text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse hover:scale-105 active:scale-95 cursor-pointer max-w-[90%] backdrop-blur-md select-none"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-bold tracking-wide truncate">{activeInteraction}</span>
                      <span className="font-mono text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shrink-0">
                        TAP / [Z]
                      </span>
                    </button>
                  )}

                  {/* In-Canvas Deltarune Dialogue Box Overlay */}
                  {dialogue && (
                    <div 
                      className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 z-30 p-3 sm:p-4 rounded-xl bg-slate-950/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-md space-y-2 select-none cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDialogueInput();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">{dialogue.avatar}</span>
                          <h4 className="font-cinzel text-xs sm:text-sm font-bold tracking-wide" style={{ color: dialogue.color }}>
                            {dialogue.speaker}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDialogue(null);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] sm:text-xs font-mono cursor-pointer border border-slate-700"
                        >
                          [ESC] Close
                        </button>
                      </div>
                      <p className="font-mono text-[11px] sm:text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                        {pacerDisplayText || dialogue.text}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          {pacerPrompt.visible ? (
                            <span 
                              className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1 transition-transform"
                              style={{ 
                                transform: `translateY(${pacerPrompt.y}px)`,
                                opacity: pacerPrompt.alpha 
                              }}
                            >
                              {pacerPrompt.label}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              ▶ Tap or press [Z] / [Space]
                            </span>
                          )}
                        </div>
                        {dialogue.actionText ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDialogueInput();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs shadow-lg cursor-pointer"
                          >
                            {dialogue.actionText} &rarr;
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDialogueInput();
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer border border-slate-700"
                          >
                            Continue [Z]
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Drinking Contest Active Overlay (High Polish, Centered, Readable, Gold Standard) */}
                  {isDrinkingContestActive && (
                    <div className="absolute inset-0 z-40 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm">
                      <div 
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-3 sm:p-5 my-auto rounded-2xl bg-slate-950/98 border-2 border-amber-500/90 shadow-[0_0_50px_rgba(0,0,0,0.95)] space-y-2.5 sm:space-y-3 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Round Transition Banner Overlay with Climax Elastic Scale */}
                        {roundBanner && (
                          <div 
                            className="p-2 rounded-xl bg-gradient-to-r from-amber-600/70 via-amber-500/90 to-amber-600/70 border border-amber-300 text-center font-cinzel text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse transition-transform"
                            style={{ transform: `scale(${duelSnapshot.bannerScale})` }}
                          >
                            {roundBanner}
                          </div>
                        )}

                        {/* Header Strip */}
                        <div className="flex items-center justify-between pb-1 border-b border-amber-500/30">
                          <div className="flex items-center gap-2">
                            <Wine className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                            <div>
                              <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-300 block leading-tight">
                                CONTEST OF THE HIGH TIDE
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                                Round {contestRound} of 3 • {DRINKING_ROUNDS[contestRound - 1]?.drink}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                              contestPhase === 'victory' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60' 
                                : contestPhase === 'round_cleared'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                            }`}>
                              {contestPhase === 'victory' ? '🏆 Champion' : contestPhase === 'round_cleared' ? '✓ Draft Finished' : '🍺 Chugging'}
                            </span>
                          </div>
                        </div>

                        {/* Spam Guard Choke Lockout Alert */}
                        {duelSnapshot.choked && (
                          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 font-mono text-[10px] sm:text-xs flex items-center justify-between animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                            <span className="font-bold flex items-center gap-1 truncate">
                              ⚠️ CHOKE REBOUND! (&lt;90ms)
                            </span>
                            <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-200 font-black shrink-0">
                              {duelSnapshot.lockoutRemainingMs}ms
                            </span>
                          </div>
                        )}

                        {/* Dual Flagons (Bozog vs Atreyu AI) */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
                          {/* Bozog Flagon */}
                          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-1">
                            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                              <span className="text-amber-400 font-bold flex items-center gap-1 truncate">
                                🪓 BOZOG
                              </span>
                              <span className="text-amber-300 font-black font-mono">
                                {Math.round((1.0 - duelSnapshot.vBozog) * 100)}%
                              </span>
                            </div>
                            <div className="relative w-full h-3.5 sm:h-4 rounded-full bg-slate-950 overflow-hidden border border-slate-700">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-75"
                                style={{ width: `${(1.0 - duelSnapshot.vBozog) * 100}%` }}
                              />
                              {/* Sweet spot indicator */}
                              <div className="absolute inset-y-0 left-[65%] w-[20%] bg-white/15 border-x border-white/40 pointer-events-none" />
                            </div>
                          </div>

                          {/* Atreyu Flagon */}
                          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-1">
                            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                              <span className="text-indigo-400 font-bold flex items-center gap-1 truncate">
                                🌙 ATREYU
                              </span>
                              <span className="text-indigo-300 font-black font-mono">
                                {Math.round((1.0 - duelSnapshot.vAtreyu) * 100)}%
                              </span>
                            </div>
                            <div className="relative w-full h-3.5 sm:h-4 rounded-full bg-slate-950 overflow-hidden border border-slate-700">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-600 via-sky-400 to-indigo-300 transition-all duration-75"
                                style={{ width: `${(1.0 - duelSnapshot.vAtreyu) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Content Box depending on Phase */}
                        {contestPhase === 'mashing' && (
                          <div className="space-y-1.5 bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                            <div className="flex items-start gap-2">
                              <span className="text-sm sm:text-base shrink-0">🌙</span>
                              <p className="text-[11px] sm:text-xs text-slate-200 font-sans leading-relaxed">
                                {DRINKING_ROUNDS[contestRound - 1]?.challengePrompt}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                              <span className="text-amber-300/90 font-bold truncate">
                                Mash [Z] or Tap button to drink!
                              </span>
                              <span className="shrink-0">Zone: 65%-85%</span>
                            </div>
                          </div>
                        )}

                        {contestPhase === 'round_cleared' && (
                          <div className="space-y-2 bg-indigo-950/40 p-2.5 sm:p-3 rounded-xl border-2 border-indigo-500/60 shadow-lg">
                            <div className="flex items-center gap-2 text-indigo-300 font-cinzel text-xs font-bold">
                              <span>🌙</span>
                              <span>Atreyu Retort:</span>
                            </div>
                            <p className="text-xs text-slate-100 font-mono leading-relaxed bg-black/40 p-2 rounded-lg border border-indigo-500/30">
                              {DRINKING_ROUNDS[contestRound - 1]?.roundClearedDialogue}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-mono text-emerald-300 italic">
                              {DRINKING_ROUNDS[contestRound - 1]?.bozogCheer}
                            </p>
                          </div>
                        )}

                        {contestPhase === 'victory' && (
                          <div className="space-y-2 bg-emerald-950/40 p-2.5 sm:p-3 rounded-xl border-2 border-emerald-500/80 shadow-lg">
                            <div className="flex items-center gap-2 text-emerald-300 font-cinzel text-xs font-bold">
                              <span>👑</span>
                              <span>ATREYU YIELDS! CONTEST WON!</span>
                            </div>
                            <p className="text-xs text-slate-100 font-mono leading-relaxed bg-black/40 p-2 rounded-lg border border-emerald-500/40">
                              {DRINKING_ROUNDS[2]?.roundClearedDialogue}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-mono text-emerald-300 font-bold">
                              {DRINKING_ROUNDS[2]?.bozogCheer}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-0.5">
                          {contestPhase === 'mashing' && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleMashDrink}
                                className={`flex-1 py-2.5 sm:py-3 rounded-xl font-cinzel text-xs sm:text-sm font-bold transition-all shadow-lg cursor-pointer active:scale-95 ${
                                  gulpBurst 
                                    ? 'bg-amber-300 text-slate-950 scale-[0.98]'
                                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-slate-950 hover:brightness-110'
                                }`}
                              >
                                🍺 CHUG / MASH [Z]
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDrinkingContestActive(false);
                                  setContestPhase('mashing');
                                }}
                                className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 cursor-pointer border border-slate-700"
                              >
                                Yield
                              </button>
                            </div>
                          )}

                          {contestPhase === 'round_cleared' && (
                            <button
                              type="button"
                              onClick={handleAdvanceNextRound}
                              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-cinzel font-bold text-xs sm:text-sm shadow-xl active:scale-95 cursor-pointer border border-indigo-400 flex items-center justify-center gap-2"
                            >
                              <span>🍺 PROCEED TO ROUND {contestRound + 1}: {DRINKING_ROUNDS[contestRound]?.drink.toUpperCase()} &rarr;</span>
                              <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded text-indigo-200">[Z]</span>
                            </button>
                          )}

                          {contestPhase === 'victory' && (
                            <button
                              type="button"
                              onClick={handleCloseContestVictory}
                              className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 hover:brightness-110 text-slate-950 font-cinzel font-bold text-xs sm:text-sm shadow-2xl active:scale-95 cursor-pointer border-2 border-amber-300 flex items-center justify-center gap-2"
                            >
                              <span>🏆 CLAIM VICTORY & RETURN TO TAVERN</span>
                              <span className="font-mono text-[10px] bg-slate-950/40 px-2 py-0.5 rounded text-emerald-950 font-black">[Z]</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Matchstick Spotting Minigame Overlay */}
                  {isMatchstickReconActive && (
                    <div className="absolute inset-0 z-40 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm">
                      <div
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-3 sm:p-5 my-auto rounded-2xl bg-slate-950/98 border-2 border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.35)] space-y-2.5 sm:space-y-3.5 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Top Header */}
                        <div className="flex items-center justify-between border-b border-sky-500/40 pb-2">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-cinzel text-xs sm:text-sm font-bold text-sky-200">
                                  MATCHSTICK&apos;S SPYGLASS
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-950 border border-sky-500/50 text-sky-300 font-bold">
                                  RECON
                                </span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                Spot 3 Black Order scouts in harbor mist • Tap, drag or hold W/A/S/D
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="text-right">
                              <span className="text-[9px] font-mono text-slate-400 block">TIME LEFT</span>
                              <span className={`font-mono text-xs font-bold ${reconSnapshot.timeRemaining < 10 ? 'text-rose-400 animate-pulse' : 'text-sky-300'}`}>
                                {reconSnapshot.timeRemaining}s
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCloseMatchstickRecon(false)}
                              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Harbor Mist Spyglass Viewport */}
                        <div 
                          className="relative w-full h-44 sm:h-64 rounded-xl bg-slate-950 border border-sky-500/40 overflow-hidden cursor-crosshair group shadow-inner touch-none"
                          onPointerDown={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const nx = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
                            const ny = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
                            matchstickReconRef.current.setReticle(nx, ny);
                          }}
                          onPointerMove={(e) => {
                            if (e.buttons > 0) {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const nx = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
                              const ny = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
                              matchstickReconRef.current.setReticle(nx, ny);
                            }
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const nx = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
                            const ny = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
                            matchstickReconRef.current.setReticle(nx, ny);
                          }}
                          onTouchMove={(e) => {
                            if (e.touches.length > 0) {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const nx = Math.max(0.05, Math.min(0.95, (e.touches[0].clientX - rect.left) / rect.width));
                              const ny = Math.max(0.05, Math.min(0.95, (e.touches[0].clientY - rect.top) / rect.height));
                              matchstickReconRef.current.setReticle(nx, ny);
                            }
                          }}
                        >
                          {/* Spyglass Vignette and Dock Backdrop */}
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 pointer-events-none" />
                          
                          {/* Pier & Harbor Scenery Elements */}
                          <div className="absolute inset-x-0 bottom-6 h-12 bg-slate-900/80 border-t border-slate-700/60 pointer-events-none" />
                          <div className="absolute left-8 bottom-16 w-20 h-28 border-x-2 border-t-2 border-slate-700/40 pointer-events-none flex flex-col justify-end items-center pb-2">
                            <span className="text-[9px] font-mono text-slate-500">CRANE TOWER</span>
                          </div>
                          <div className="absolute right-12 bottom-12 w-24 h-16 border-2 border-slate-700/40 pointer-events-none flex items-center justify-center">
                            <span className="text-[9px] font-mono text-slate-500">CARGO STACK</span>
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-28 h-8 rounded-b-xl border border-slate-700/40 pointer-events-none flex items-center justify-center">
                            <span className="text-[9px] font-mono text-slate-500">SKIFF MOORING</span>
                          </div>

                          {/* Fog Drifts */}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-black/60 pointer-events-none" />

                          {/* Targets */}
                          {reconSnapshot.targets.map((t, idx) => {
                            const isTargetFocused = reconSnapshot.focusedIndex === idx;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  matchstickReconRef.current.setReticle(t.x, t.y);
                                }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform cursor-pointer"
                                style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
                              >
                                {t.spotted ? (
                                  <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-400 bg-emerald-500/30 flex items-center justify-center text-emerald-300 font-black text-xs shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse">
                                      ✓
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded mt-0.5 border border-emerald-500/40 whitespace-nowrap">
                                      {t.label} (TAGGED)
                                    </span>
                                  </div>
                                ) : (
                                  <div className={`flex flex-col items-center transition-all ${isTargetFocused ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`}>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 ${isTargetFocused ? 'border-sky-400 bg-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-pulse' : 'border-dashed border-slate-500 bg-slate-800/60'} flex items-center justify-center`}>
                                      <span className="text-xs">👤</span>
                                    </div>
                                    <span className={`text-[8px] sm:text-[9px] font-mono px-1 py-0.5 rounded mt-0.5 whitespace-nowrap ${isTargetFocused ? 'text-sky-300 bg-sky-950/90 border border-sky-500/40 font-bold' : 'text-slate-400 bg-black/60'}`}>
                                      {isTargetFocused ? t.label : 'Tap to Aim'}
                                    </span>
                                  </div>
                                )}
                              </button>
                            );
                          })}

                          {/* Reticle / Crosshairs */}
                          <div
                            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                            style={{ left: `${reconSnapshot.rx * 100}%`, top: `${reconSnapshot.ry * 100}%` }}
                          >
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                              {/* Inner Crosshair Lines */}
                              <div className="absolute w-full h-[1px] bg-sky-400/80" />
                              <div className="absolute h-full w-[1px] bg-sky-400/80" />
                              <div className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(56,189,248,1)]" />

                              {/* Focus Ring charging up */}
                              {reconSnapshot.focusCharge > 0 && (
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="27"
                                    fill="none"
                                    stroke={reconSnapshot.focusCharge >= 0.4 ? '#38bdf8' : '#e0f2fe'}
                                    strokeWidth="3.5"
                                    strokeDasharray="170"
                                    strokeDashoffset={170 * (1 - reconSnapshot.focusCharge)}
                                  />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Flash on Snapshot */}
                          {reconSnapshot.snapshotFlash > 0 && (
                            <div className="absolute inset-0 bg-white/50 pointer-events-none transition-opacity duration-150" />
                          )}
                        </div>

                        {/* Bottom Status & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] font-mono text-slate-300">
                              TAGGED: <strong className="text-sky-300">{reconSnapshot.spottedCount} / 3</strong>
                            </span>
                            {reconSnapshot.focusCharge >= 0.40 ? (
                              <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 font-bold animate-bounce bg-amber-950/60 border border-amber-500/50 px-1.5 py-0.5 rounded">
                                LOCK READY! [Z]
                              </span>
                            ) : reconSnapshot.focusedIndex >= 0 ? (
                              <span className="text-[9px] font-mono text-sky-400 animate-pulse">
                                Charging Lock...
                              </span>
                            ) : null}
                          </div>

                          {/* Quick Directional Pan for touch devices */}
                          <div className="flex items-center gap-1 sm:hidden">
                            <button
                              type="button"
                              onClick={() => matchstickReconRef.current.moveReticleDelta(-0.08, 0)}
                              className="w-7 h-7 rounded bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold active:scale-95 cursor-pointer"
                              aria-label="Pan Left"
                            >
                              ◀
                            </button>
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => matchstickReconRef.current.moveReticleDelta(0, -0.08)}
                                className="w-7 h-7 rounded bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold active:scale-95 cursor-pointer"
                                aria-label="Pan Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => matchstickReconRef.current.moveReticleDelta(0, 0.08)}
                                className="w-7 h-7 rounded bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold active:scale-95 cursor-pointer"
                                aria-label="Pan Down"
                              >
                                ▼
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => matchstickReconRef.current.moveReticleDelta(0.08, 0)}
                              className="w-7 h-7 rounded bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold active:scale-95 cursor-pointer"
                              aria-label="Pan Right"
                            >
                              ▶
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const snap: any = matchstickReconRef.current.triggerSnapshot();
                                if (snap === true || snap?.accepted) {
                                  playCelestialChime(880, 'triangle', 0.25);
                                  particleEngineRef.current.spawnShockwave(400, 300, '#38bdf8', 75);
                                }
                              }}
                              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-cinzel font-bold text-xs shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                            >
                              <Crosshair className="w-3.5 h-3.5" />
                              <span>TAG SIGHTLINE [Z]</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Kairon Body Drums Rhythm Minigame Overlay */}
                  {isKaironRhythmActive && (
                    <div className="absolute inset-0 z-40 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm">
                      <div
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-3 sm:p-5 my-auto rounded-2xl bg-slate-950/98 border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.35)] space-y-2.5 sm:space-y-3.5 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Top Header */}
                        <div className="flex items-center justify-between border-b border-purple-500/40 pb-2">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-cinzel text-xs sm:text-sm font-bold text-purple-200">
                                  KAIRON&apos;S BODY DRUMS JAM
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 font-bold">
                                  4-BEAT
                                </span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                Chest, thigh, and boot percussion (BPM: 108)
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCloseKaironRhythm(false)}
                            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Stats & Groove Bar */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs font-mono">
                          <div className="bg-slate-900/80 p-1.5 sm:p-2 rounded-lg border border-purple-500/30">
                            <span className="text-[8px] sm:text-[9px] text-slate-400 block">SCORE</span>
                            <span className="text-amber-300 font-bold text-xs sm:text-sm">{rhythmSnapshot.score}</span>
                          </div>
                          <div className="bg-slate-900/80 p-1.5 sm:p-2 rounded-lg border border-purple-500/30">
                            <span className="text-[8px] sm:text-[9px] text-slate-400 block">COMBO</span>
                            <span className="text-purple-300 font-bold text-xs sm:text-sm">{rhythmSnapshot.combo}x</span>
                          </div>
                          <div className="bg-slate-900/80 p-1.5 sm:p-2 rounded-lg border border-purple-500/30">
                            <span className="text-[8px] sm:text-[9px] text-slate-400 block">GROOVE</span>
                            <div className="w-full bg-slate-950 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-700 mt-0.5">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-75"
                                style={{ width: `${Math.round(rhythmSnapshot.grooveMeter * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3-Lane Rhythm Highway */}
                        <div className="relative w-full h-48 sm:h-64 rounded-xl bg-slate-950 border border-purple-500/40 overflow-hidden shadow-inner flex">
                          {/* Countdown State Overlay */}
                          {rhythmSnapshot.state === 'COUNTDOWN' && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] pointer-events-none">
                              <span className="text-[10px] sm:text-xs font-mono text-purple-300 uppercase tracking-widest font-bold animate-pulse">
                                GET READY TO JAM!
                              </span>
                              <span className="font-cinzel text-5xl sm:text-7xl font-black text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-bounce my-1">
                                {rhythmSnapshot.countdownText || rhythmSnapshot.countdown || 'READY'}
                              </span>
                              <span className="text-[10px] sm:text-xs font-mono text-purple-200">
                                Hit [Z], [X], [C] as notes enter the lower target rings!
                              </span>
                            </div>
                          )}

                          {/* Jam Complete / Victory Modal */}
                          {rhythmSnapshot.state === 'JAM_SUCCESS' && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center">
                              <span className="font-cinzel text-xl sm:text-3xl font-bold text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                                🏆 GROOVE MASTER!
                              </span>
                              <p className="text-xs sm:text-sm font-mono text-purple-200 mt-1">
                                Score: {rhythmSnapshot.score} • Max Combo: {rhythmSnapshot.maxCombo}x
                              </p>
                              <button
                                type="button"
                                onClick={() => handleCloseKaironRhythm(true)}
                                className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-cinzel font-bold text-xs shadow-lg active:scale-95 cursor-pointer"
                              >
                                RETURN TO TAVERN
                              </button>
                            </div>
                          )}

                          {/* Jam Failed Modal */}
                          {rhythmSnapshot.state === 'JAM_FAILED' && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center">
                              <span className="font-cinzel text-xl sm:text-2xl font-bold text-rose-400">
                                GROOVE LOST!
                              </span>
                              <p className="text-xs font-mono text-slate-300 mt-1">
                                Groove meter dropped below 20%. Relax tusks and try again!
                              </p>
                              <div className="flex gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => kaironRhythmRef.current.start()}
                                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold active:scale-95 cursor-pointer"
                                >
                                  ↺ RETRY JAM
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCloseKaironRhythm(false)}
                                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs active:scale-95 cursor-pointer"
                                >
                                  EXIT
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Hit Line guide */}
                          <div className="absolute inset-x-0 bottom-14 sm:bottom-16 h-[2px] bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.7)] pointer-events-none" />

                          {/* 3 Columns */}
                          {[
                            { id: 0, label: 'CHEST', key: 'Z', sub: 'Low Sub', icon: '🥁', color: 'border-fuchsia-400 bg-fuchsia-950/80 text-fuchsia-300', flashColor: 'bg-fuchsia-500/40' },
                            { id: 1, label: 'THIGH', key: 'X', sub: 'Crisp Clap', icon: '👏', color: 'border-purple-400 bg-purple-950/80 text-purple-300', flashColor: 'bg-purple-500/40' },
                            { id: 2, label: 'BOOT', key: 'C', sub: 'Impact', icon: '👢', color: 'border-amber-400 bg-amber-950/80 text-amber-300', flashColor: 'bg-amber-500/40' },
                          ].map((lane) => {
                            const flash = rhythmSnapshot.laneFlashes[lane.id] || 0;
                            return (
                              <div
                                key={lane.id}
                                className={`relative flex-1 border-r last:border-r-0 border-slate-800/80 flex flex-col justify-end items-center pb-2 sm:pb-3 ${flash > 0 ? lane.flashColor : ''}`}
                              >
                                {/* Lane Identifier Header */}
                                <div className="absolute top-2 text-center pointer-events-none">
                                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-300 block font-bold">{lane.icon} {lane.label}</span>
                                  <span className="text-[8px] font-mono text-slate-400">[{lane.key}]</span>
                                </div>

                                {/* Hit Target Ring at bottom */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const res = kaironRhythmRef.current.hitLane(lane.id);
                                    if (res !== 'STRAY') {
                                      playCelestialChime(lane.id === 0 ? 150 : lane.id === 1 ? 360 : 520, 'sine', 0.25);
                                      particleEngineRef.current.spawnShockwave(260 + lane.id * 140, 480, '#e879f9', 50);
                                    }
                                  }}
                                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 ${lane.color} hover:bg-white/10 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer shadow-lg z-10`}
                                >
                                  <span className="font-mono text-xs sm:text-sm font-black text-white">{lane.key}</span>
                                  <span className="text-[7px] sm:text-[8px] font-mono uppercase opacity-80">{lane.sub}</span>
                                </button>
                              </div>
                            );
                          })}

                          {/* Falling Note Orbs */}
                          {rhythmSnapshot.notes.filter((n) => n.isVisible !== false).map((note) => {
                            const leftPct = (note.lane * 33.33) + 16.66;
                            const topPct = Math.min(84, Math.max(8, note.progress * 78));
                            const laneStyles = [
                              'from-fuchsia-500 to-rose-600 border-fuchsia-200 text-fuchsia-100',
                              'from-purple-500 to-indigo-600 border-purple-200 text-purple-100',
                              'from-amber-400 to-orange-500 border-amber-100 text-slate-950',
                            ];
                            const laneIcons = ['🥁', '👏', '👢'];
                            return (
                              <div
                                key={note.id}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 ${
                                  note.isInHitZone ? 'scale-125' : 'scale-100'
                                }`}
                                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                              >
                                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${laneStyles[note.lane]} border-2 shadow-[0_0_15px_rgba(232,121,249,0.8)] flex items-center justify-center font-bold text-xs sm:text-sm`}>
                                  <span>{laneIcons[note.lane]}</span>
                                </div>
                                {note.isInHitZone && (
                                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono text-[8px] font-black uppercase tracking-wider animate-bounce whitespace-nowrap">
                                    HIT!
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Last Rating Banner */}
                          {rhythmSnapshot.lastRating && (
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                              <span className={`font-cinzel text-lg sm:text-3xl font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] ${
                                rhythmSnapshot.lastRating === 'PERFECT' ? 'text-emerald-300' :
                                rhythmSnapshot.lastRating === 'GOOD' ? 'text-sky-300' : 'text-rose-400'
                              }`}>
                                {rhythmSnapshot.lastRating}!
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Instruction Bar */}
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pt-0.5">
                          <span>Keys <strong className="text-purple-300">[Z]</strong>, <strong className="text-purple-300">[X]</strong>, <strong className="text-purple-300">[C]</strong> or click pads!</span>
                          <span className="text-slate-500">&ge;20% Groove</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Black Knight Standoff Matrix In-Canvas Modal Overlay */}
                  {isAmbushActive && !standoffResolved && (
                    <div className="absolute inset-0 z-40 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm">
                      <div 
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-3 sm:p-5 my-auto rounded-2xl bg-slate-950/98 border-2 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)] space-y-2.5 sm:space-y-3 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-rose-500/40 pb-2">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                            <span className="font-cinzel text-xs sm:text-sm font-bold text-rose-200">
                              ⚠️ INCITING AMBUSH • 4 CORNERS MATRIX
                            </span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/60">
                            BREACH
                          </span>
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-200 font-sans leading-relaxed">
                          Black Knights smash through the south oak doors demanding Citadel confiscation! Choose which character archetype leads the counter-offensive:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {AMBUSH_STANDOFF_CHOICES.map((choice) => {
                            const isSelected = selectedStandoffId === choice.id;
                            return (
                              <button
                                key={choice.id}
                                type="button"
                                onClick={() => handleSelectStandoff(choice.id)}
                                className={`p-2 sm:p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                                    : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-cinzel font-bold text-xs" style={{ color: choice.color }}>
                                    {choice.avatar} {choice.speaker}
                                  </span>
                                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/50 text-amber-300 border border-slate-700">
                                    {choice.corner.split(' ')[0]}
                                  </span>
                                </div>
                                <div className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-100 mt-1">
                                  {choice.action}
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-snug">
                                  {choice.consequence}
                                </p>
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={handleConfirmStandoff}
                          className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95 flex items-center justify-center gap-2 border border-amber-300"
                        >
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>CONFIRM TACTICAL INITIATIVE: {AMBUSH_STANDOFF_CHOICES.find((c) => c.id === selectedStandoffId)?.action || 'STRIKE'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Point of No Return / Door Progression Warning Modal Prompt Overlay */}
                  {showDoorProgressionWarning && (
                    <div className="absolute inset-0 z-50 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
                      <div 
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-4 sm:p-6 my-auto rounded-2xl bg-[#090d16]/98 border-2 border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.5)] space-y-3 sm:space-y-4 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-amber-500/40 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                            <div>
                              <h3 className="font-cinzel text-xs sm:text-base font-bold text-amber-200 leading-tight">
                                ⚠️ WARNING: POINT OF NO RETURN
                              </h3>
                              <span className="text-[9px] sm:text-[10px] font-mono text-amber-400/90">
                                REINFORCED OAK DOORS • HARBOR PIERS
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-black bg-amber-950/80 text-amber-300 border border-amber-500/80 uppercase">
                            CONFIRM
                          </span>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed bg-black/40 p-3 rounded-xl border border-amber-500/20">
                          <p className="font-medium text-amber-100">
                            Inspecting or unbarring the reinforced harbor doors will incite the Black Knights&apos; raid.
                          </p>
                          <p className="text-slate-300 text-[11px] sm:text-xs">
                            This locks progression to the standoff and halts remaining tavern conversations.
                          </p>
                          <p className="text-amber-400 font-mono text-[10px] sm:text-[11px] font-semibold">
                            Do you want to proceed and lock progression to the standoff?
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={handleConfirmDoorProgression}
                            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs sm:text-sm shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-rose-400"
                          >
                            <ShieldAlert className="w-4 h-4 text-slate-950" />
                            <span>⛔ LOCK &amp; CONFIRM [Z]</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowDoorProgressionWarning(false);
                              showDoorProgressionWarningRef.current = false;
                            }}
                            className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-cinzel font-bold text-xs sm:text-sm shadow-lg active:scale-95 cursor-pointer border border-slate-700 flex items-center justify-center gap-2"
                          >
                            <span>STAY IN TAVERN [X]</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progression Wall Dead State Modal Prompt Overlay (Center Stage) */}
                  {isProgressionLocked && !isProgressionPromptDismissed && (
                    <div className="absolute inset-0 z-50 p-2 sm:p-4 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm">
                      <div 
                        className="relative w-full max-w-xl max-h-full overflow-y-auto p-4 sm:p-6 my-auto rounded-2xl bg-[#090d16]/98 border-2 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.6)] space-y-3 sm:space-y-4 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-rose-500/40 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
                            <div>
                              <h3 className="font-cinzel text-xs sm:text-base font-bold text-rose-200 leading-tight">
                                ⛔ PROGRESSION WALL • CHAPTER 0 CONCLUDED
                              </h3>
                              <span className="text-[9px] sm:text-[10px] font-mono text-rose-300">
                                VERTICAL SLICE CEILING REACHED
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-black bg-rose-950 text-rose-300 border border-rose-500/80 uppercase">
                            DEAD STATE
                          </span>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed bg-black/40 p-3 rounded-xl border border-rose-500/20">
                          <p>
                            The Black Knights&apos; breach has been decisively met. <strong>Bozog</strong>, <strong>Atreyu</strong>, <strong>Kairon</strong>, and <strong>Matchstick</strong> have united in 4-man battle formation and sealed their mutual restitution pact.
                          </p>
                          <p className="text-amber-300/90 font-mono text-[10px] sm:text-[11px]">
                            ✓ 4 Corners Squad Formation Unlocked • Tavern Boundaries Locked
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={handleFullResetToZeroState}
                            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs sm:text-sm shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>RESTART TO ZERO STATE [R]</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsProgressionPromptDismissed(true)}
                            className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-cinzel font-bold text-xs sm:text-sm shadow-lg active:scale-95 cursor-pointer border border-slate-700 flex items-center justify-center gap-2"
                          >
                            <span>TEST SQUAD IN TAVERN &rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Floating Persistent Progression Wall Banner if dismissed */}
                  {isProgressionLocked && isProgressionPromptDismissed && (
                    <div 
                      onClick={() => setIsProgressionPromptDismissed(false)}
                      className="absolute top-14 inset-x-4 sm:inset-x-8 z-30 p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-cinzel font-bold flex items-center justify-between shadow-xl backdrop-blur-md cursor-pointer hover:bg-rose-900/90 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>⛔ PROGWALL ACTIVE: CHAPTER 0 CONCLUDED (Click to View End State Prompt)</span>
                      </div>
                      <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded text-amber-300">
                        Press [R] to Reset
                      </span>
                    </div>
                  )}
                </div>

                {/* Tactical Touch Controller (Virtual D-Pad & Contextual Actions) */}
                <div className="mt-3 p-3 sm:p-4 rounded-xl bg-slate-950/95 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl select-none">
                  {/* 4-Way D-Pad with WCAG compliant 44px touch targets */}
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                      <span>VIRTUAL D-PAD</span>
                      <span className="text-slate-600">• TOUCH 44PX</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 w-36 h-36 select-none touch-none">
                      <div />
                      <button
                        type="button"
                        onMouseDown={() => setVirtualKey('KeyW', true)}
                        onMouseUp={() => setVirtualKey('KeyW', false)}
                        onMouseLeave={() => setVirtualKey('KeyW', false)}
                        onTouchStart={(e) => { e.preventDefault(); setVirtualKey('KeyW', true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setVirtualKey('KeyW', false); }}
                        onTouchCancel={() => setVirtualKey('KeyW', false)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-900 border border-slate-700 active:bg-amber-500 active:text-slate-950 active:scale-95 text-slate-200 rounded-xl font-bold text-base shadow-sm select-none touch-manipulation cursor-pointer"
                        aria-label="Move Up"
                      >
                        ▲
                      </button>
                      <div />
                      <button
                        type="button"
                        onMouseDown={() => setVirtualKey('KeyA', true)}
                        onMouseUp={() => setVirtualKey('KeyA', false)}
                        onMouseLeave={() => setVirtualKey('KeyA', false)}
                        onTouchStart={(e) => { e.preventDefault(); setVirtualKey('KeyA', true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setVirtualKey('KeyA', false); }}
                        onTouchCancel={() => setVirtualKey('KeyA', false)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-900 border border-slate-700 active:bg-amber-500 active:text-slate-950 active:scale-95 text-slate-200 rounded-xl font-bold text-base shadow-sm select-none touch-manipulation cursor-pointer"
                        aria-label="Move Left"
                      >
                        ◀
                      </button>
                      <div className="flex items-center justify-center text-amber-400/60 text-xs font-mono font-bold select-none pointer-events-none">
                        ●
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => setVirtualKey('KeyD', true)}
                        onMouseUp={() => setVirtualKey('KeyD', false)}
                        onMouseLeave={() => setVirtualKey('KeyD', false)}
                        onTouchStart={(e) => { e.preventDefault(); setVirtualKey('KeyD', true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setVirtualKey('KeyD', false); }}
                        onTouchCancel={() => setVirtualKey('KeyD', false)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-900 border border-slate-700 active:bg-amber-500 active:text-slate-950 active:scale-95 text-slate-200 rounded-xl font-bold text-base shadow-sm select-none touch-manipulation cursor-pointer"
                        aria-label="Move Right"
                      >
                        ▶
                      </button>
                      <div />
                      <button
                        type="button"
                        onMouseDown={() => setVirtualKey('KeyS', true)}
                        onMouseUp={() => setVirtualKey('KeyS', false)}
                        onMouseLeave={() => setVirtualKey('KeyS', false)}
                        onTouchStart={(e) => { e.preventDefault(); setVirtualKey('KeyS', true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setVirtualKey('KeyS', false); }}
                        onTouchCancel={() => setVirtualKey('KeyS', false)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-900 border border-slate-700 active:bg-amber-500 active:text-slate-950 active:scale-95 text-slate-200 rounded-xl font-bold text-base shadow-sm select-none touch-manipulation cursor-pointer"
                        aria-label="Move Down"
                      >
                        ▼
                      </button>
                      <div />
                    </div>
                  </div>

                  {/* Dynamic Contextual Action Cluster */}
                  <div className="flex-1 w-full sm:w-auto flex flex-col items-center sm:items-end gap-2 select-none">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span>ACTIONS:</span>
                      <span className="text-amber-400 font-bold uppercase">
                        {isKaironRhythmActive ? 'Body Drums Highway' : isMatchstickReconActive ? 'Spyglass Target Tag' : isDrinkingContestActive ? 'High Tide Contest' : 'Tavern Exploration'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full">
                      {/* Contextual Case 1: Kairon Rhythm Active */}
                      {isKaironRhythmActive ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const res = kaironRhythmRef.current.hitLane(0);
                              if (res !== 'STRAY') {
                                playCelestialChime(150, 'sine', 0.25);
                                particleEngineRef.current.spawnShockwave(260, 480, '#e879f9', 50);
                              }
                            }}
                            className="flex-1 sm:flex-initial px-4 py-3 min-w-[56px] min-h-[48px] rounded-xl bg-gradient-to-b from-fuchsia-700 to-fuchsia-900 border-2 border-fuchsia-400 text-white font-mono font-bold text-xs sm:text-sm active:scale-95 cursor-pointer shadow-lg flex flex-col items-center justify-center"
                          >
                            <span>[Z] CHEST</span>
                            <span className="text-[8px] text-fuchsia-200">BASS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const res = kaironRhythmRef.current.hitLane(1);
                              if (res !== 'STRAY') {
                                playCelestialChime(360, 'sine', 0.25);
                                particleEngineRef.current.spawnShockwave(400, 480, '#c084fc', 50);
                              }
                            }}
                            className="flex-1 sm:flex-initial px-4 py-3 min-w-[56px] min-h-[48px] rounded-xl bg-gradient-to-b from-purple-700 to-purple-900 border-2 border-purple-400 text-white font-mono font-bold text-xs sm:text-sm active:scale-95 cursor-pointer shadow-lg flex flex-col items-center justify-center"
                          >
                            <span>[X] THIGH</span>
                            <span className="text-[8px] text-purple-200">CLAP</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const res = kaironRhythmRef.current.hitLane(2);
                              if (res !== 'STRAY') {
                                playCelestialChime(520, 'sine', 0.25);
                                particleEngineRef.current.spawnShockwave(540, 480, '#fbbf24', 50);
                              }
                            }}
                            className="flex-1 sm:flex-initial px-4 py-3 min-w-[56px] min-h-[48px] rounded-xl bg-gradient-to-b from-amber-600 to-amber-800 border-2 border-amber-400 text-slate-950 font-mono font-bold text-xs sm:text-sm active:scale-95 cursor-pointer shadow-lg flex flex-col items-center justify-center"
                          >
                            <span>[C] BOOT</span>
                            <span className="text-[8px] text-slate-900 font-bold">STOMP</span>
                          </button>
                        </div>
                      ) : isMatchstickReconActive ? (
                        /* Contextual Case 2: Matchstick Recon Active */
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const snap: any = matchstickReconRef.current.triggerSnapshot();
                              if (snap === true || snap?.accepted) {
                                playCelestialChime(880, 'triangle', 0.25);
                                particleEngineRef.current.spawnShockwave(400, 300, '#38bdf8', 75);
                              }
                            }}
                            className="flex-1 sm:flex-initial px-5 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-cinzel font-bold text-xs sm:text-sm active:scale-95 cursor-pointer shadow-lg border border-sky-300 flex items-center justify-center gap-2"
                          >
                            <Crosshair className="w-4 h-4" />
                            <span>TAG SIGHTLINE [Z]</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCloseMatchstickRecon(false)}
                            className="px-4 py-3 min-h-[48px] rounded-xl bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700 active:scale-95 cursor-pointer"
                          >
                            ✕ EXIT
                          </button>
                        </div>
                      ) : (
                        /* Contextual Case 3: Default Tavern & Drinking Mode */
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (isDrinkingContestActive) {
                                if (contestPhase === 'round_cleared') handleAdvanceNextRound();
                                else if (contestPhase === 'victory') handleCloseContestVictory();
                                else handleMashDrink();
                              } else {
                                handleTriggerInteraction();
                              }
                            }}
                            className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs sm:text-sm shadow-lg active:scale-95 cursor-pointer border border-amber-400/80 flex items-center justify-center gap-1.5 touch-manipulation"
                          >
                            {isDrinkingContestActive 
                              ? (contestPhase === 'round_cleared' ? 'NEXT ROUND [Z]' : contestPhase === 'victory' ? '🏆 VICTORY [Z]' : '🍺 CHUG [Z]')
                              : 'INTERACT [Z]'}
                          </button>
                          <button
                            type="button"
                            onMouseDown={() => setVirtualKey('Space', true)}
                            onMouseUp={() => setVirtualKey('Space', false)}
                            onMouseLeave={() => setVirtualKey('Space', false)}
                            onTouchStart={(e) => { e.preventDefault(); setVirtualKey('Space', true); }}
                            onTouchEnd={(e) => { e.preventDefault(); setVirtualKey('Space', false); }}
                            onTouchCancel={() => setVirtualKey('Space', false)}
                            className="px-4 py-3 min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-cyan-500/40 active:bg-cyan-600 active:text-slate-950 active:scale-95 cursor-pointer touch-manipulation"
                          >
                            DASH [SPACE]
                          </button>
                          <button
                            type="button"
                            onClick={handleFullResetToZeroState}
                            className="px-3 py-3 min-h-[44px] rounded-xl bg-slate-900 text-rose-300 font-mono text-xs border border-rose-500/40 hover:bg-rose-950/50 hover:text-white cursor-pointer active:scale-95 transition-all shadow-sm flex items-center gap-1.5 touch-manipulation"
                            title="Revert entire game state to zero state (Press R)"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                            <span>RESET [R]</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                      <span>Locked: 4:3 (800×600)</span>
                      <span>•</span>
                      <span className="text-emerald-400">Tactical Touch Ready</span>
                    </div>
                  </div>
                </div>

                {/* On-screen controls & Telemetry strip */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">ACTIVE AVATAR</span>
                    <span className="text-emerald-300 font-bold truncate block">Bozog the Berserker</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">PARTY FORMATION</span>
                    <span className={partyTrainUnlocked ? 'text-cyan-300 font-bold' : 'text-amber-400 font-bold'}>
                      {partyTrainUnlocked ? '4-Man Squad' : 'Solo (Locked)'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CONTROLS</span>
                    <span className="text-cyan-300">WASD / Touch D-Pad</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">COLLISION MODEL</span>
                    <span className="text-emerald-400">JRN-204 AABB Sliding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info & Vertical Slice Triggers */}
          <div className="lg:col-span-4 space-y-4">
            {/* The Greedy Greens Diorama Info */}
            <div className="rounded-xl border border-amber-500/30 bg-[#090d16] p-4 space-y-3 shadow-lg">
              <h3 className="font-cinzel text-xs font-bold text-amber-300 flex items-center gap-2">
                <Wine className="w-4 h-4 text-amber-400" />
                <span>VENUE: THE GREEDY GREENS</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                A battered pirate dive bar converted from a dry dock warehouse at the Docks of Delain. Owned and fiercely defended by Bozog.
              </p>

              <div className="space-y-1.5 text-xs font-mono pt-1">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">West Mahogany Counter</span>
                  <span className="text-cyan-300">Atreyu (Drinking)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">North-East Stage</span>
                  <span className="text-purple-300">Kairon (Rock Solo)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">North-West Booth</span>
                  <span className="text-sky-300">Matchstick (Mirrors)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">North Hearth</span>
                  <button
                    onClick={() => setIsHearthModalOpen(true)}
                    className="text-amber-400 hover:text-amber-300 underline cursor-pointer text-[11px]"
                  >
                    🔥 Checkpoint Save
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">East Wall Board</span>
                  <button
                    onClick={() => setIsDartsModalOpen(true)}
                    className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-[11px]"
                  >
                    🎯 Tavern Darts
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">South-West Ring</span>
                  <button
                    onClick={() => setIsSparringModalOpen(true)}
                    className="text-orange-400 hover:text-orange-300 underline cursor-pointer text-[11px]"
                  >
                    🥊 Zozog Sparring
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">South Oak Doors</span>
                  <span className="text-rose-400">Ambush Threshold</span>
                </div>
              </div>
            </div>

            {/* Inciting Ambush & Standoff Choice Module */}
            <div className="rounded-xl border border-rose-500/40 bg-gradient-to-b from-rose-950/30 to-slate-900/90 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-xs font-bold text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>THE INCITING AMBUSH</span>
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isAmbushActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'}`}>
                  {isAmbushActive ? 'BREACH ACTIVE' : 'STANDBY'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The Black Knights of Order breach the south oak doors with quadratic camera trauma shake!
              </p>

              {!isAmbushActive ? (
                <button
                  onClick={handleTriggerAmbush}
                  className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-cinzel text-xs font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Trigger Inciting Ambush Event</span>
                </button>
              ) : (
                <div className="space-y-3 pt-2 border-t border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-cinzel font-bold text-amber-300 block">
                      THE 4 CORNERS MATRIX • SELECT & CONFIRM
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Fracture Stance
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Choose which character archetype leads the defense. Requires explicit confirmation to seal the mutual restitution pact.
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {AMBUSH_STANDOFF_CHOICES.map((choice) => {
                      const isSelected = selectedStandoffId === choice.id;
                      const isConfirmed = standoffResolved === choice.id;
                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleSelectStandoff(choice.id)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
                            isConfirmed
                              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                              : isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                              : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs">
                              <span>{choice.avatar}</span>
                              <span style={{ color: choice.color }}>{choice.speaker}</span>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-slate-700 text-amber-300">
                              {choice.corner}
                            </span>
                          </div>

                          <div className="font-mono text-[11px] font-bold text-slate-200 mt-1">
                            {choice.action}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {choice.consequence}
                          </p>

                          {isSelected && !standoffResolved && (
                            <div className="mt-1.5 pt-1.5 border-t border-amber-500/20 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                              <span>✓ Selected Archetype • Click Confirm below to execute</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explicit Confirmation Button Step */}
                  {!standoffResolved ? (
                    <div className="pt-2">
                      <button
                        onClick={handleConfirmStandoff}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel text-xs font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          CONFIRM INITIATIVE:{' '}
                          {AMBUSH_STANDOFF_CHOICES.find((c) => c.id === selectedStandoffId)?.action || 'STRIKE'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          PROGRESSION WALL CONCLUDED
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/70 text-rose-200 border border-rose-500/40">
                          DEAD STATE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        The four archetypes have repelled the Black Knights and sealed their mutual restitution pact. The vertical slice stops here.
                      </p>
                      <button
                        type="button"
                        onClick={handleFullResetToZeroState}
                        className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>RESTART ZERO STATE [R]</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4-Man Squad Follow-Train Status */}
            <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-2">
              <h4 className="font-cinzel text-xs font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>4-MAN SQUAD KINEMATICS</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {partyTrainUnlocked 
                  ? 'Mutual restitution pact sealed! Bozog (front leader), Matchstick (left wing scout), Atreyu (right wing priest), and Kairon (rear demagogue bard) walk together with organic squad spacing, spring acceleration, and flocking anti-clumping.'
                  : 'Bozog explores solo. Select a 4 Corners response above and click "CONFIRM" to form the pact and mobilize the squad.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: GITHUB PAGES LIVE PREVIEW */}
      {/* ==================================================================== */}
      {activeTab === 'preview' && (
        <div className="flex flex-col items-center justify-center p-3 sm:p-6 rounded-xl border border-slate-800 bg-[#07090e] shadow-2xl">
          {/* Device Dimension Info Banner */}
          <div className="mb-3 flex items-center justify-between w-full max-w-[820px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Smartphone className="w-3.5 h-3.5" />
              Viewing: {
                previewDevice === 'desktop' ? 'Desktop / Fluid (800×600)' :
                previewDevice === 'iphone-14' ? 'iPhone 14 / Pro (390×844)' :
                previewDevice === 'iphone-se' ? 'iPhone SE (375×667)' :
                previewDevice === 'landscape' ? 'Mobile Landscape (700×400)' : 'Tablet / iPad (768×1024)'
              }
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Canvas aspect-ratio locked (4:3) • Touch D-Pad enabled
            </span>
          </div>

          <div
            className={`transition-all duration-300 relative overflow-hidden shadow-2xl bg-[#080d1a] border-4 ${
              previewDevice === 'desktop'
                ? 'w-full max-w-[820px] h-[620px] rounded-xl border-slate-700/80 p-0'
                : previewDevice === 'iphone-14'
                ? 'w-[390px] h-[780px] max-w-full rounded-[28px] border-slate-700 p-2'
                : previewDevice === 'iphone-se'
                ? 'w-[375px] h-[667px] max-w-full rounded-[28px] border-slate-700 p-2'
                : previewDevice === 'landscape'
                ? 'w-[720px] h-[400px] max-w-full rounded-[28px] border-slate-700 p-2'
                : 'w-[768px] h-[900px] max-w-full rounded-[28px] border-slate-700 p-3'
            }`}
          >
            {/* Phone Speaker Pill Notch */}
            {previewDevice !== 'desktop' && (
              <div className="flex justify-center mb-1.5">
                <div className="w-20 h-1.5 rounded-full bg-slate-800 border border-slate-700/60" />
              </div>
            )}

            <iframe
              src="/journeys/index.html"
              title="Journeys Standalone GitHub Pages Preview"
              className="w-full h-full border-0 rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: HTML TEMPLATE MANAGER & IN-BROWSER EDITOR */}
      {/* ==================================================================== */}
      {activeTab === 'html_manager' && (
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                STANDALONE HTML CODEBASE (/public/journeys/index.html)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect, modify, and save changes to the standalone HTML engine. Zero external dependencies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied HTML!' : 'Copy to Clipboard'}
              </button>

              <button
                onClick={handleSaveHtml}
                disabled={isSavingHtml}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {isSavingHtml ? 'Saving...' : 'Save & Update index.html'}
              </button>
            </div>
          </div>

          {saveStatus && (
            <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {saveStatus}
            </div>
          )}

          <div className="relative">
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-[500px] p-4 rounded-lg bg-[#05070c] border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Mode 4: Proving Grounds (Standalones & Prototypes) */}
      {activeTab === 'sandboxes' && (
        <div className="space-y-4">
          <ProvingGroundsView previewDevice={previewDevice} setPreviewDevice={setPreviewDevice} />
        </div>
      )}

      {/* Lore Bible Modal */}
      <LoreBibleModal
        isOpen={isLoreBibleOpen}
        onClose={() => setIsLoreBibleOpen(false)}
        onNavigateToSandbox={() => setActiveTab('game')}
      />

      {/* Tavern Hearth Checkpoint Modal */}
      <TavernHearthModal
        isOpen={isHearthModalOpen}
        onClose={() => setIsHearthModalOpen(false)}
        playerPos={{
          x: playerRef.current?.transform.x ?? 340,
          y: playerRef.current?.transform.y ?? 340,
        }}
        onRestoreState={handleRestoreHearthState}
      />

      {/* Tavern Darts Minigame Modal */}
      <TavernDartsModal
        isOpen={isDartsModalOpen}
        onClose={() => setIsDartsModalOpen(false)}
        onCleared={(_stats) => {
          playCelestialChime(880, 'sine', 0.3);
        }}
      />

      {/* Zozog Sparring Minigame Modal */}
      <ZozogSparringModal
        isOpen={isSparringModalOpen}
        onClose={() => setIsSparringModalOpen(false)}
        onCleared={(_stats) => {
          playCelestialChime(880, 'sine', 0.3);
        }}
      />
    </div>
  );
};
