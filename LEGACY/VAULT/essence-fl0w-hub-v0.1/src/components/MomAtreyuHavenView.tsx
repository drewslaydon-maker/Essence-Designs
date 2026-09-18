import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  Shuffle, 
  HelpCircle, 
  CheckCircle2, 
  FolderPlus, 
  FileText, 
  Upload, 
  Trash2, 
  Share2, 
  Gamepad2, 
  BookOpen, 
  Grid, 
  Palette, 
  Save, 
  Star,
  ChevronRight,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { playCelestialChime } from '../utils/audio';

interface MomAtreyuHavenViewProps {
  onNavigateToJourneys: () => void;
  onOpenShareModal: () => void;
}

// ---------------------------------------------------------------------------
// Types & Constants for Yarn Crush (Match-3)
// ---------------------------------------------------------------------------
interface YarnTile {
  id: string;
  type: number; // 0 to 5
}

const YARN_ITEMS = [
  { id: 0, name: 'Magenta Merino', emoji: '🧶', color: 'from-pink-500 to-rose-600', ring: 'border-pink-400' },
  { id: 1, name: 'Golden Silk', emoji: '🧵', color: 'from-amber-400 to-yellow-600', ring: 'border-amber-300' },
  { id: 2, name: 'Emerald Alpaca', emoji: '🪡', color: 'from-emerald-400 to-teal-600', ring: 'border-emerald-300' },
  { id: 3, name: 'Moon Crystal', emoji: '💎', color: 'from-cyan-400 to-blue-600', ring: 'border-cyan-300' },
  { id: 4, name: 'Rose Blossom', emoji: '🌸', color: 'from-rose-300 to-pink-500', ring: 'border-rose-300' },
  { id: 5, name: 'Starlight Spool', emoji: '🌟', color: 'from-purple-400 to-indigo-600', ring: 'border-purple-300' },
];

const GRID_SIZE = 6;

// ---------------------------------------------------------------------------
// Word Weaver Puzzles
// ---------------------------------------------------------------------------
interface WordPuzzle {
  word: string;
  clue: string;
  category: string;
}

const WORD_PUZZLES: WordPuzzle[] = [
  { word: 'YARN', clue: 'Spun skein of soft wool loved by knitters and cats alike', category: 'Cozy Craft' },
  { word: 'WEAVE', clue: 'Interlacing threads across a loom to make a blanket', category: 'Cozy Craft' },
  { word: 'ATREYU', clue: 'Mom\'s canon character — High Moon Priestess of the Delain docks', category: 'Character' },
  { word: 'COZY', clue: 'The warm, comforting feeling of a knitted blanket on a rainy evening', category: 'Comfort' },
  { word: 'MOON', clue: 'The celestial orb that powers Atreyu\'s crystal shield arts', category: 'Magic' },
  { word: 'STITCH', clue: 'A single loop of thread that holds an entire quilt together', category: 'Cozy Craft' },
  { word: 'SKEIN', clue: 'A wound coil of yarn ready to be unraveled into something beautiful', category: 'Cozy Craft' },
  { word: 'HARBOR', clue: 'The salty waters of Delain right outside The Greedy Greens tavern', category: 'World' },
  { word: 'BLANKET', clue: 'A heavy woven masterpiece keeping you warm in winter', category: 'Cozy Craft' },
  { word: 'LUNAR', clue: 'Silver light that reflects off Atreyu\'s floating crystal wards', category: 'Magic' },
];

// ---------------------------------------------------------------------------
// Initial Mom Documents
// ---------------------------------------------------------------------------
interface VaultDoc {
  id: string;
  title: string;
  updatedAt: string;
  category: 'Lore' | 'Preferences' | 'Notes';
  content: string;
}

const INITIAL_MOM_DOCS: VaultDoc[] = [
  {
    id: 'doc-atreyu-profile',
    title: 'Mom_Atreyu_Canon_Character_Dossier.md',
    updatedAt: '2026-09-03',
    category: 'Lore',
    content: `# Character Canon: ATREYU (The High Moon Priestess)
**Player Anchor:** Drew's Mom  
**Affinity:** Dual-Aspect Lunar Arts (Waxing Shield / Waning Lance)  
**Personality & Vibes:**
- Serene spiritual devotion coupled with an unruly, fiercely competitive streak!
- As comfortable slugging heavy grog in a dive bar as she is chanting sacred lunar rites.
- Currently locked in a 3-round drinking contest with Bozog at the main tavern counter.
- Loves yarn, colorful patterns, word puzzles, and playful banter.
- Special Ability: "Waxing Shield" (protects the whole party with floating crystal wards).`
  },
  {
    id: 'doc-mom-gaming',
    title: 'Mom_Gaming_Preferences_and_Yarn_Crafts.md',
    updatedAt: '2026-09-03',
    category: 'Preferences',
    content: `# Mom's Play Style & Design Guidelines
1. **Immediate Fun:** Needs instant, tactile feedback without dense manuals or convoluted tutorials.
2. **Candy Crush & Match-3 Fan:** Loves juicy tile pops, satisfying cascades, and score streaks.
3. **Word Game Aficionado:** Enjoys anagrams, crossword vibes, and unscrambling cozy themes.
4. **Master Yarner:** Enjoys knitting, crochet, weaving, and tactile crafting aesthetics.
5. **No Complicated Controls:** Everything should be playable with simple clicks or taps on any phone, tablet, or laptop.`
  }
];

export const MomAtreyuHavenView: React.FC<MomAtreyuHavenViewProps> = ({
  onNavigateToJourneys,
  onOpenShareModal,
}) => {
  const [subTab, setSubTab] = useState<'crush' | 'word' | 'loom' | 'lore' | 'docs'>('crush');

  // -------------------------------------------------------------------------
  // Yarn Crush (Match-3 State)
  // -------------------------------------------------------------------------
  const [grid, setGrid] = useState<YarnTile[][]>([]);
  const [selectedPos, setSelectedPos] = useState<{ r: number; c: number } | null>(null);
  const [crushScore, setCrushScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mom_yarn_crush_high') || '250', 10);
  });
  const [yarnBallsHarvested, setYarnBallsHarvested] = useState(12);
  const [comboMessage, setComboMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Match-3 Grid
  const createFreshGrid = (): YarnTile[][] => {
    const newGrid: YarnTile[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: YarnTile[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let type = Math.floor(Math.random() * YARN_ITEMS.length);
        // Avoid initial 3-matches
        while (
          (r >= 2 && newGrid[r - 1][c].type === type && newGrid[r - 2][c].type === type) ||
          (c >= 2 && row[c - 1].type === type && row[c - 2].type === type)
        ) {
          type = Math.floor(Math.random() * YARN_ITEMS.length);
        }
        row.push({ id: `tile-${r}-${c}-${Math.random()}`, type });
      }
      newGrid.push(row);
    }
    return newGrid;
  };

  useEffect(() => {
    setGrid(createFreshGrid());
  }, []);

  // Handle Tile Click / Swap
  const handleTileClick = (r: number, c: number) => {
    if (isProcessing) return;

    if (!selectedPos) {
      setSelectedPos({ r, c });
      playCelestialChime(520, 'sine', 0.15);
      return;
    }

    const isAdjacent = 
      (Math.abs(selectedPos.r - r) === 1 && selectedPos.c === c) ||
      (Math.abs(selectedPos.c - c) === 1 && selectedPos.r === r);

    if (!isAdjacent) {
      // Re-select new tile
      setSelectedPos({ r, c });
      playCelestialChime(520, 'sine', 0.15);
      return;
    }

    // Attempt Swap
    setIsProcessing(true);
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[selectedPos.r][selectedPos.c];
    newGrid[selectedPos.r][selectedPos.c] = newGrid[r][c];
    newGrid[r][c] = temp;

    // Check matches
    const matches = findMatches(newGrid);

    if (matches.length > 0) {
      // Valid move!
      setGrid(newGrid);
      setSelectedPos(null);
      processMatches(newGrid, matches, 1);
    } else {
      // Revert swap with subtle boing sound
      playCelestialChime(300, 'triangle', 0.2);
      setSelectedPos(null);
      setIsProcessing(false);
    }
  };

  const findMatches = (currentGrid: YarnTile[][]): { r: number; c: number }[] => {
    const matched = new Set<string>();

    // Horizontal check
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const t1 = currentGrid[r][c].type;
        const t2 = currentGrid[r][c + 1].type;
        const t3 = currentGrid[r][c + 2].type;
        if (t1 === t2 && t2 === t3) {
          matched.add(`${r},${c}`);
          matched.add(`${r},${c + 1}`);
          matched.add(`${r},${c + 2}`);
        }
      }
    }

    // Vertical check
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const t1 = currentGrid[r][c].type;
        const t2 = currentGrid[r + 1][c].type;
        const t3 = currentGrid[r + 2][c].type;
        if (t1 === t2 && t2 === t3) {
          matched.add(`${r},${c}`);
          matched.add(`${r + 1},${c}`);
          matched.add(`${r + 2},${c}`);
        }
      }
    }

    return Array.from(matched).map(coord => {
      const [r, c] = coord.split(',').map(Number);
      return { r, c };
    });
  };

  const processMatches = (
    currentGrid: YarnTile[][], 
    matches: { r: number; c: number }[],
    multiplier: number
  ) => {
    const pointsGained = matches.length * 20 * multiplier;
    setCrushScore(prev => {
      const next = prev + pointsGained;
      if (next > highScore) {
        setHighScore(next);
        localStorage.setItem('mom_yarn_crush_high', next.toString());
      }
      return next;
    });

    setYarnBallsHarvested(prev => prev + Math.floor(matches.length / 3));

    // Combo cheering
    if (multiplier >= 3) {
      setComboMessage(`🧶 MEGA SKEIN COMBO x${multiplier}! +${pointsGained} pts!`);
      playCelestialChime(880, 'sine', 0.4);
    } else if (multiplier === 2) {
      setComboMessage(`🌸 SWEET WEAVE! Double Combo! +${pointsGained} pts!`);
      playCelestialChime(660, 'sine', 0.3);
    } else {
      setComboMessage(`✨ +${pointsGained} Yarn Points!`);
      playCelestialChime(580, 'sine', 0.25);
    }

    setTimeout(() => {
      // Clear matched and drop new tiles
      const nextGrid = currentGrid.map(row => [...row]);

      // Mark matched with -1
      matches.forEach(({ r, c }) => {
        nextGrid[r][c] = { id: `cleared-${r}-${c}`, type: -1 };
      });

      // Drop tiles downward
      for (let c = 0; c < GRID_SIZE; c++) {
        let emptySpots = 0;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (nextGrid[r][c].type === -1) {
            emptySpots++;
          } else if (emptySpots > 0) {
            nextGrid[r + emptySpots][c] = nextGrid[r][c];
            nextGrid[r][c] = { id: `empty-${r}-${c}`, type: -1 };
          }
        }
        // Fill top with fresh tiles
        for (let r = 0; r < emptySpots; r++) {
          nextGrid[r][c] = {
            id: `tile-${r}-${c}-${Math.random()}`,
            type: Math.floor(Math.random() * YARN_ITEMS.length),
          };
        }
      }

      setGrid(nextGrid);

      // Check cascade matches
      setTimeout(() => {
        const cascadeMatches = findMatches(nextGrid);
        if (cascadeMatches.length > 0) {
          processMatches(nextGrid, cascadeMatches, multiplier + 1);
        } else {
          setIsProcessing(false);
          setTimeout(() => setComboMessage(null), 2000);
        }
      }, 250);
    }, 250);
  };

  const handleShuffleBoard = () => {
    setGrid(createFreshGrid());
    setSelectedPos(null);
    setComboMessage('✨ Board Refreshed & Untangled!');
    playCelestialChime(700, 'sine', 0.3);
    setTimeout(() => setComboMessage(null), 2000);
  };

  // -------------------------------------------------------------------------
  // Word Weaver (Cozy Word Game State)
  // -------------------------------------------------------------------------
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = WORD_PUZZLES[puzzleIndex % WORD_PUZZLES.length];
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [wordFeedback, setWordFeedback] = useState<string | null>(null);
  const [knittedRows, setKnittedRows] = useState<string[]>([
    '#f43f5e', '#ec4899', '#d946ef', '#a855f7'
  ]);

  useEffect(() => {
    // Shuffle target word letters
    const letters = currentPuzzle.word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setShuffledLetters(letters);
    setUserLetters([]);
    setWordFeedback(null);
  }, [puzzleIndex]);

  const handlePickLetter = (letter: string, index: number) => {
    setUserLetters(prev => [...prev, letter]);
    setShuffledLetters(prev => prev.filter((_, i) => i !== index));
    playCelestialChime(550 + userLetters.length * 40, 'sine', 0.15);
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userLetters[index];
    setUserLetters(prev => prev.filter((_, i) => i !== index));
    setShuffledLetters(prev => [...prev, letter]);
  };

  const handleCheckWord = () => {
    const spelled = userLetters.join('');
    if (spelled === currentPuzzle.word) {
      playCelestialChime(880, 'sine', 0.5);
      setWordFeedback('🎉 Wonderful, Mom! Correctly Woven!');
      // Add row to cozy blanket
      const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
      const nextColor = colors[knittedRows.length % colors.length];
      setKnittedRows(prev => [...prev, nextColor]);

      setTimeout(() => {
        setPuzzleIndex(prev => (prev + 1) % WORD_PUZZLES.length);
      }, 1500);
    } else {
      playCelestialChime(320, 'triangle', 0.3);
      setWordFeedback('Almost! Try rearranging the yarn letters!');
      setTimeout(() => setWordFeedback(null), 2500);
    }
  };

  const handleWordHint = () => {
    // Put first missing letter in place
    const targetLetter = currentPuzzle.word[userLetters.length];
    if (!targetLetter) return;
    const foundIdx = shuffledLetters.indexOf(targetLetter);
    if (foundIdx !== -1) {
      handlePickLetter(targetLetter, foundIdx);
    }
  };

  // -------------------------------------------------------------------------
  // Yarn Loom & Atelier (Interactive Tapestry Knitter)
  // -------------------------------------------------------------------------
  const LOOM_ROWS = 10;
  const LOOM_COLS = 12;
  const YARN_PALETTE = [
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Blush', color: '#fb7185' },
    { name: 'Lavender', color: '#c084fc' },
    { name: 'Moon Cyan', color: '#38bdf8' },
    { name: 'Buttercup', color: '#fbbf24' },
    { name: 'Mint Leaf', color: '#34d399' },
    { name: 'Warm Cream', color: '#fef3c7' },
    { name: 'Deep Midnight', color: '#0f172a' },
  ];
  const [selectedYarnColor, setSelectedYarnColor] = useState(YARN_PALETTE[0].color);
  const [loomGrid, setLoomGrid] = useState<string[][]>(() => {
    return Array(LOOM_ROWS).fill(null).map(() => Array(LOOM_COLS).fill('#0f172a'));
  });

  const handleLoomCellClick = (r: number, c: number) => {
    setLoomGrid(prev => {
      const copy = prev.map(row => [...row]);
      copy[r][c] = copy[r][c] === selectedYarnColor ? '#0f172a' : selectedYarnColor;
      return copy;
    });
    playCelestialChime(600 + (r + c) * 20, 'sine', 0.1);
  };

  const loadPresetPattern = (type: 'heart' | 'moon' | 'cat') => {
    const blank = Array(LOOM_ROWS).fill(null).map(() => Array(LOOM_COLS).fill('#0f172a'));
    if (type === 'heart') {
      const heartCoords = [
        [2, 3], [2, 4], [2, 7], [2, 8],
        [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9],
        [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
        [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
        [6, 4], [6, 5], [6, 6], [6, 7],
        [7, 5], [7, 6],
      ];
      heartCoords.forEach(([r, c]) => { blank[r][c] = '#f43f5e'; });
    } else if (type === 'moon') {
      const moonCoords = [
        [2, 6], [2, 7],
        [3, 5], [3, 6],
        [4, 4], [4, 5],
        [5, 4], [5, 5],
        [6, 4], [6, 5],
        [7, 5], [7, 6],
        [8, 6], [8, 7],
      ];
      moonCoords.forEach(([r, c]) => { blank[r][c] = '#38bdf8'; });
    } else if (type === 'cat') {
      const catCoords = [
        [2, 3], [2, 8],
        [3, 3], [3, 4], [3, 7], [3, 8],
        [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
        [5, 4], [5, 5], [5, 6], [5, 7],
        [6, 4], [6, 5], [6, 6], [6, 7],
        [7, 4], [7, 7],
      ];
      catCoords.forEach(([r, c]) => { blank[r][c] = '#fbbf24'; });
    }
    setLoomGrid(blank);
    playCelestialChime(750, 'sine', 0.3);
  };

  // -------------------------------------------------------------------------
  // Mom Documents Vault State
  // -------------------------------------------------------------------------
  const [docs, setDocs] = useState<VaultDoc[]>(() => {
    const saved = localStorage.getItem('mom_vault_docs');
    return saved ? JSON.parse(saved) : INITIAL_MOM_DOCS;
  });
  const [activeDocId, setActiveDocId] = useState<string>(INITIAL_MOM_DOCS[0].id);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDoc = docs.find(d => d.id === activeDocId) || docs[0];

  const handleSaveDocs = (updated: VaultDoc[]) => {
    setDocs(updated);
    localStorage.setItem('mom_vault_docs', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newDoc: VaultDoc = {
        id: `doc-${Date.now()}`,
        title: file.name,
        updatedAt: new Date().toISOString().split('T')[0],
        category: 'Notes',
        content: content || 'Empty document imported.'
      };
      const updated = [newDoc, ...docs];
      handleSaveDocs(updated);
      setActiveDocId(newDoc.id);
      playCelestialChime(750, 'sine', 0.3);
    };
    reader.readAsText(file);
  };

  const handleCreateNewDoc = () => {
    if (!newDocTitle.trim()) return;
    const newDoc: VaultDoc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.endsWith('.md') ? newDocTitle : `${newDocTitle}.md`,
      updatedAt: new Date().toISOString().split('T')[0],
      category: 'Notes',
      content: newDocContent || '# Notes for Mom\n\nEnter details here...'
    };
    const updated = [newDoc, ...docs];
    handleSaveDocs(updated);
    setActiveDocId(newDoc.id);
    setNewDocTitle('');
    setNewDocContent('');
    setIsAddingDoc(false);
    playCelestialChime(800, 'sine', 0.3);
  };

  const handleDeleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    handleSaveDocs(updated);
    if (activeDocId === id && updated.length > 0) {
      setActiveDocId(updated[0].id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* ------------------------------------------------------------------- */}
      {/* Warm Cozy Hero Banner for Mom */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-900 border-2 border-rose-500/30 p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-9xl">
          🧶
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/30 to-amber-500/30 border-2 border-rose-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.3)]">
              <span className="text-3xl animate-bounce">🌙</span>
              <div className="absolute -bottom-1 -right-1 text-base">🧶</div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 bg-clip-text text-transparent">
                  Mom's Haven • ATREYU'S YARN & GAME SANCTUM
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                  MOM FIRST 🌸
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-200/80 mt-1 max-w-2xl">
                Dedicated space for Drew's Mom! Play instant Candy-Crush style Yarn Match-3, solve cozy word puzzles, weave custom tapestry blankets on the loom, and explore Atreyu's tavern lore.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="mom-share-btn"
              onClick={onOpenShareModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer group"
            >
              <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Share Link with Mom</span>
            </button>

            <button
              onClick={onNavigateToJourneys}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Visit Atreyu inside the Greedy Greens Tavern"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Play Atreyu in Tavern</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-5 border-t border-rose-900/30 mt-5">
          <button
            id="mom-subtab-crush"
            onClick={() => { playCelestialChime(600); setSubTab('crush'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'crush'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🧶</span>
            <span>Atreyu's Yarn Crush (Match-3)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              Score: {crushScore}
            </span>
          </button>

          <button
            id="mom-subtab-word"
            onClick={() => { playCelestialChime(640); setSubTab('word'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'word'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>📖</span>
            <span>Essence Word Weaver</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              Puzzle #{puzzleIndex + 1}
            </span>
          </button>

          <button
            id="mom-subtab-loom"
            onClick={() => { playCelestialChime(680); setSubTab('loom'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'loom'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🪡</span>
            <span>Yarn Loom & Tapestry</span>
          </button>

          <button
            id="mom-subtab-lore"
            onClick={() => { playCelestialChime(720); setSubTab('lore'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'lore'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🌙</span>
            <span>Atreyu Lore & Notes</span>
          </button>

          <button
            id="mom-subtab-docs"
            onClick={() => { playCelestialChime(760); setSubTab('docs'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'docs'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>📁</span>
            <span>Mom's PC Documents Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {docs.length}
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 1: ATREYU'S YARN CRUSH (Match-3 Game) */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'crush' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Board (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-rose-500/20 p-5 sm:p-6 shadow-lg flex flex-col items-center">
            {/* Score & Combo Telemetry Bar */}
            <div className="w-full flex items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mom's Score</div>
                  <div className="text-xl font-black text-rose-200 font-mono">{crushScore}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">High Score</div>
                <div className="text-sm font-bold text-amber-300 font-mono">{highScore}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShuffleBoard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  title="Shuffle the loom if you need fresh moves"
                >
                  <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>

            {/* Live Combo / Banner Feedback */}
            {comboMessage && (
              <div className="w-full py-2 px-4 mb-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-pink-900/80 to-amber-950/80 border border-rose-500/50 text-center font-bold text-sm text-rose-100 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                {comboMessage}
              </div>
            )}

            {/* 6x6 Match-3 Grid */}
            <div className="relative p-3 sm:p-4 rounded-2xl bg-[#07090e] border-2 border-rose-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] max-w-[420px] w-full aspect-square">
              <div className="grid grid-cols-6 grid-rows-6 gap-1.5 sm:gap-2 w-full h-full">
                {grid.map((row, r) =>
                  row.map((tile, c) => {
                    const item = YARN_ITEMS[tile.type] || YARN_ITEMS[0];
                    const isSelected = selectedPos?.r === r && selectedPos?.c === c;

                    return (
                      <button
                        key={tile.id}
                        id={`yarn-tile-${r}-${c}`}
                        onClick={() => handleTileClick(r, c)}
                        className={`relative rounded-xl flex items-center justify-center transition-all transform cursor-pointer select-none active:scale-95 ${
                          isSelected
                            ? 'ring-4 ring-rose-400 scale-105 z-10 shadow-[0_0_20px_rgba(244,63,94,0.8)] bg-gradient-to-br from-rose-600 to-amber-500'
                            : `bg-gradient-to-br ${item.color} hover:brightness-110 hover:scale-102 shadow-md`
                        }`}
                        title={item.name}
                      >
                        <span className="text-xl sm:text-2xl filter drop-shadow-md transition-transform">
                          {item.emoji}
                        </span>

                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-white animate-ping opacity-50 pointer-events-none" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Instructions below grid */}
            <p className="text-xs text-slate-400 mt-4 text-center">
              💡 <strong>How to Play:</strong> Tap one yarn ball, then tap an adjacent yarn ball to swap them. Match 3 or more in a line to pop and score!
            </p>
          </div>

          {/* Right Column: Harvested Skeins & Mom's Trophy Case */}
          <div className="space-y-4">
            {/* Yarn Harvest Progress */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-rose-500/20 shadow-md">
              <h3 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold mb-3 flex items-center gap-2">
                <span>🧶</span>
                <span>Mom's Yarn Basket</span>
              </h3>

              <div className="flex items-center justify-between text-sm mb-2 font-medium">
                <span className="text-slate-300">Skeins Collected</span>
                <span className="text-amber-300 font-mono font-bold">{yarnBallsHarvested} / 50</span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800 mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (yarnBallsHarvested / 50) * 100)}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Every match knits Atreyu's celestial journey cloak. Reach 50 skeins to unlock the <strong className="text-rose-300">"Master Yarner of Delain"</strong> badge!
              </p>
            </div>

            {/* Cozy Legend */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-3">
                Yarn Tile Legend
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {YARN_ITEMS.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-slate-300 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Tavern Link */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Want to see Atreyu in action?</span>
              </div>
              Jump directly into the Greedy Greens tavern and test Atreyu's 3-round drinking challenge against Bozog the Berserker!
              <button
                onClick={onNavigateToJourneys}
                className="mt-3 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Enter Tavern with Atreyu</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 2: ESSENCE WORD WEAVER (Cozy Word Puzzle) */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'word' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Puzzle Area (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-rose-500/20 p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40">
                  {currentPuzzle.category}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-rose-100 mt-1">
                  Puzzle #{puzzleIndex + 1} of {WORD_PUZZLES.length}
                </h3>
              </div>
              <div className="text-xs text-slate-400">
                Tap the yarn letters in the correct order to spell the word!
              </div>
            </div>

            {/* Clue Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 text-sm text-slate-200">
              <div className="text-xs font-mono text-rose-400 font-semibold mb-1 uppercase tracking-wider">
                🧶 Clue:
              </div>
              <p className="italic text-base text-rose-100">
                "{currentPuzzle.clue}"
              </p>
            </div>

            {/* User Spelled Slots */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-4 flex-wrap min-h-[70px]">
              {Array.from({ length: currentPuzzle.word.length }).map((_, idx) => {
                const letter = userLetters[idx];
                return (
                  <button
                    key={`slot-${idx}`}
                    onClick={() => letter && handleRemoveLetter(idx)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black font-mono transition-all cursor-pointer ${
                      letter
                        ? 'bg-gradient-to-br from-rose-600 to-pink-600 border-rose-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:scale-105'
                        : 'bg-slate-950/80 border-dashed border-slate-700 text-slate-600'
                    }`}
                    title={letter ? 'Click to return this letter' : 'Empty slot'}
                  >
                    {letter || '_'}
                  </button>
                );
              })}
            </div>

            {/* Available Shuffled Letter Pool */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-center text-slate-400">
                Available Yarn Letters:
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {shuffledLetters.map((char, idx) => (
                  <button
                    key={`letter-${char}-${idx}`}
                    onClick={() => handlePickLetter(char, idx)}
                    className="w-11 h-13 sm:w-13 sm:h-15 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-rose-400 text-rose-200 text-xl font-bold font-mono shadow-md transition-all active:scale-90 cursor-pointer flex items-center justify-center"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            {wordFeedback && (
              <div className={`py-2 px-4 rounded-xl text-center font-bold text-sm ${
                wordFeedback.includes('Wonderful') 
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' 
                  : 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
              }`}>
                {wordFeedback}
              </div>
            )}

            {/* Word Action Controls */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWordHint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Give Me a Hint</span>
                </button>

                <button
                  onClick={() => {
                    setUserLetters([]);
                    setShuffledLetters(currentPuzzle.word.split('').sort(() => Math.random() - 0.5));
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset Letters</span>
                </button>
              </div>

              <button
                id="check-word-btn"
                disabled={userLetters.length !== currentPuzzle.word.length}
                onClick={handleCheckWord}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  userLetters.length === currentPuzzle.word.length
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Check Word</span>
              </button>
            </div>
          </div>

          {/* Right Column: Cozy Knitted Blanket Progress */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-rose-500/20 shadow-md">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold mb-2 flex items-center gap-2">
                <span>🪡</span>
                <span>Mom's Cozy Woven Blanket</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Each solved word stitches a new colorful row onto Mom's Delain tapestry!
              </p>

              {/* Visual Blanket Strip */}
              <div className="rounded-xl border-2 border-rose-500/30 p-2 bg-slate-950 space-y-1">
                {knittedRows.map((color, idx) => (
                  <div
                    key={`blanket-row-${idx}`}
                    className="h-4 rounded-md w-full flex items-center justify-center text-[9px] font-mono font-bold text-white/90 shadow-sm transition-all"
                    style={{ backgroundColor: color }}
                  >
                    Row #{idx + 1} ════════════
                  </div>
                ))}
              </div>

              <div className="text-center text-xs font-mono text-amber-300 mt-3 font-semibold">
                {knittedRows.length} Rows Woven
              </div>
            </div>

            {/* Word List Preview */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
                Upcoming Themes
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400">•</span> Cozy Knitting Terms
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">•</span> Atreyu's High Moon Spells
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-cyan-400">•</span> The Greedy Greens Tavern
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-purple-400">•</span> Delain Docks Lore
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 3: ATREYU'S YARN LOOM (Interactive Tapestry Knitter) */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'loom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Loom Grid (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-rose-500/20 p-6 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-100 flex items-center gap-2">
                  <span>🪡</span>
                  <span>Atreyu's Tapestry Loom</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select a yarn spool, then tap cells to knit custom patterns!
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => loadPresetPattern('heart')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 text-xs font-medium cursor-pointer"
                >
                  Heart ❤️
                </button>
                <button
                  onClick={() => loadPresetPattern('moon')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-medium cursor-pointer"
                >
                  Moon 🌙
                </button>
                <button
                  onClick={() => loadPresetPattern('cat')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-medium cursor-pointer"
                >
                  Kitten 🐱
                </button>
              </div>
            </div>

            {/* Yarn Color Palette Picker */}
            <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex-wrap justify-center">
              <span className="text-xs font-mono text-slate-400 mr-1">Yarn Color:</span>
              {YARN_PALETTE.map(p => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedYarnColor(p.color);
                    playCelestialChime(650, 'sine', 0.1);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedYarnColor === p.color
                      ? 'ring-2 ring-white scale-105 shadow-md'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.color, color: p.name === 'Warm Cream' ? '#000' : '#fff' }}
                >
                  <span>🧵</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Loom Grid */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border-2 border-rose-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] max-w-[500px] w-full">
              <div 
                className="grid gap-1 w-full"
                style={{ gridTemplateColumns: `repeat(${LOOM_COLS}, minmax(0, 1fr))` }}
              >
                {loomGrid.map((row, r) =>
                  row.map((cellColor, c) => (
                    <button
                      key={`loom-cell-${r}-${c}`}
                      onClick={() => handleLoomCellClick(r, c)}
                      className="aspect-square rounded-sm transition-all hover:scale-110 active:scale-95 cursor-pointer border border-slate-900/40"
                      style={{ backgroundColor: cellColor }}
                      title={`Stitch (${r}, ${c})`}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Clear Loom Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setLoomGrid(Array(LOOM_ROWS).fill(null).map(() => Array(LOOM_COLS).fill('#0f172a')));
                  playCelestialChime(400, 'triangle', 0.2);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Loom Canvas</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tapestry Insights */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-rose-500/20 shadow-md">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold mb-2">
                Atreyu's Weaving Lore
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Delain, High Moon Priestesses weave sacred celestial runes into clothing for safe passage through harbor storms. The patterns Mom creates here are directly woven into Atreyu's sprite cloak in Journeys!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md text-xs text-slate-400 space-y-2">
              <div className="font-bold text-slate-200">Creative Tips for Mom:</div>
              <p>• Click any square to stitch the active yarn color.</p>
              <p>• Click the same square again to remove the thread.</p>
              <p>• Use the Heart, Moon, or Kitten presets to start with a fun foundation!</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 4: ATREYU CANON LORE & DREW'S DEDICATION */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'lore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Character Spotlight (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-rose-500/20 p-6 shadow-lg space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 border-2 border-rose-400/50 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                🌙
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-xl font-bold text-rose-100">
                    ATREYU • The High Moon Priest
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    MOM'S CANON
                  </span>
                </div>
                <p className="text-xs text-rose-300/80 font-mono mt-0.5">
                  Dual-Aspect Lunar Arcanist • Master Yarner • Grog Champion
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong className="text-rose-200">Character Concept:</strong> Atreyu embodies serene spiritual devotion coupled with an unruly, fiercely competitive streak. As comfortable slugging heavy grog in a dive bar as she is chanting sacred lunar rites atop the high towers of Delain.
              </p>
              <p>
                <strong className="text-amber-200">Current Tavern Role:</strong> In <em>The Greedy Greens</em>, Atreyu sits at the west counter, locked in an epic 3-round drinking contest against Bozog the Berserker. She banters, laughs, and tests whether any pirate has the constitution to match her sacred moon-draughts.
              </p>
              <p>
                <strong className="text-cyan-200">Combat Arts:</strong> Waxing Light (crystal barriers, regeneration wards, shielding party members) and Waning Dark (beam lances and spatial blinds).
              </p>
            </div>

            {/* Note from Drew */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/40 text-xs sm:text-sm text-rose-100 space-y-2">
              <div className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Drew's Note to Mom</span>
              </div>
              <p className="italic leading-relaxed">
                "Mom, Atreyu was built for you. Every time I write dialogue or design mechanics for her, I make sure she's fun, competitive, full of life, and loved by everyone around the table. Your excitement and joy mean everything to me. This entire space is here for you to play anytime!"
              </p>
            </div>

            {/* Direct Play Button */}
            <div className="pt-2">
              <button
                onClick={onNavigateToJourneys}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Play Atreyu's Tavern Challenge in Journeys RPG</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Character Stats & Attributes */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold">
                Atreyu's Stats
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Constitution & Grog Resist</span>
                    <span className="text-amber-300 font-mono">100 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-amber-400 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Yarn Craft Mastery</span>
                    <span className="text-rose-300 font-mono">100 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-rose-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Lunar Crystal Shielding</span>
                    <span className="text-cyan-300 font-mono">98 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Smack-Talk & Wit</span>
                    <span className="text-purple-300 font-mono">95 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-purple-400 w-[95%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Things */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-md text-xs space-y-2">
              <div className="font-bold text-slate-200">Atreyu's Favorites:</div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>🧶</span> Soft merino wool and handmade shawls
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>🍺</span> Spiced Delain harbor grog
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>🌙</span> Moonlit harbor walks
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>⚔️</span> Winning friendly wagers against Bozog
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Sub-Tab 5: MOM'S PC DOCUMENTS VAULT */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Document Sidebar (1 Col) */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0b0f19] border border-rose-500/20 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Mom's PC Documents</span>
                </h4>
                <button
                  onClick={() => setIsAddingDoc(true)}
                  className="p-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs cursor-pointer"
                  title="Add new document or note"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Upload from PC button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.doc"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-3 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Document from PC</span>
              </button>

              {/* Document List */}
              <div className="space-y-1.5">
                {docs.map(d => (
                  <div
                    key={d.id}
                    onClick={() => { setActiveDocId(d.id); playCelestialChime(620, 'sine', 0.15); }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                      activeDocId === d.id
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-medium">{d.title}</span>
                    </div>
                    {docs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(d.id);
                        }}
                        className="opacity-60 hover:opacity-100 p-1 hover:text-red-300"
                        title="Delete document"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Helper */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              💡 <strong>PC File Dropzone:</strong> When you pull documents about Mom off your PC, drop or upload them right here. They are saved locally so Mom and you can view them anytime!
            </div>
          </div>

          {/* Document Content Reader / Editor (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0f19] border border-rose-500/20 p-6 shadow-lg">
            {isAddingDoc ? (
              <div className="space-y-4">
                <h4 className="font-cinzel text-base font-bold text-rose-200">
                  Add New Document for Mom
                </h4>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Document Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Mom_Favorite_Recipes_and_Knits.md"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Content (Markdown or Text)</label>
                  <textarea
                    rows={10}
                    placeholder="Type or paste notes from PC here..."
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500 leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsAddingDoc(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewDoc}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-rose-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <span>{activeDoc.title}</span>
                    </h3>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Last Updated: {activeDoc.updatedAt} • Category: {activeDoc.category}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {activeDoc.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
