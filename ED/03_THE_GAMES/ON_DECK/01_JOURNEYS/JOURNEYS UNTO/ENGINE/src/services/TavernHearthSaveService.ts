/**
 * TavernHearthSaveService.ts
 * ESSENCE FL0W CreativeOS v1.0 • Journeys Top-Down RPG Engine
 * 
 * Checkpoint Architecture:
 * - "The Tavern Hearth" checkpoint architecture stored in localStorage under 'essence_flow_v1_save'.
 * - Preserves kinematic position, tavern exploration state, the 5 tavern activities,
 *   party status, and player boons.
 * - Deterministic, zero-dependency ES6 JSON storage with schema validation.
 */

export interface HearthPlayerState {
  x: number;
  y: number;
  facing: 'left' | 'right' | 'up' | 'down';
  stamina: number;
  maxStamina: number;
  boons: string[];
}

export interface TavernActivitiesSave {
  darts: {
    cleared: boolean;
    highScore: number;
    bullsEyes: number;
    attempts: number;
  };
  sparring: {
    cleared: boolean;
    boutsWon: number;
    perfectParries: number;
  };
  rhythm: {
    cleared: boolean;
    highScore: number;
    maxCombo: number;
  };
  spotting: {
    cleared: boolean;
    scoutsCataloged: number;
    bestTime: number;
  };
  drinking: {
    cleared: boolean;
    roundsWon: number;
  };
}

export interface EssenceFlowSaveState {
  version: string;
  checkpoint: string;
  room: string;
  timestamp: number;
  savedAtFormatted: string;
  player: HearthPlayerState;
  activities: TavernActivitiesSave;
  partyUnlocked: boolean;
  ambushTriggered: boolean;
  progressionLocked: boolean;
  visitedSetpieces: string[];
}

export const SAVE_KEY = 'essence_flow_v1_save';

export const DEFAULT_SAVE_STATE: EssenceFlowSaveState = {
  version: '1.0',
  checkpoint: 'The Tavern Hearth',
  room: 'The Greedy Greens (Room 0)',
  timestamp: Date.now(),
  savedAtFormatted: new Date().toLocaleTimeString(),
  player: {
    x: 340,
    y: 340,
    facing: 'down',
    stamina: 100,
    maxStamina: 100,
    boons: ['hearth_warmth'],
  },
  activities: {
    darts: {
      cleared: false,
      highScore: 0,
      bullsEyes: 0,
      attempts: 0,
    },
    sparring: {
      cleared: false,
      boutsWon: 0,
      perfectParries: 0,
    },
    rhythm: {
      cleared: false,
      highScore: 0,
      maxCombo: 0,
    },
    spotting: {
      cleared: false,
      scoutsCataloged: 0,
      bestTime: 30,
    },
    drinking: {
      cleared: false,
      roundsWon: 0,
    },
  },
  partyUnlocked: false,
  ambushTriggered: false,
  progressionLocked: false,
  visitedSetpieces: [],
};

class TavernHearthSaveService {
  /**
   * Load active save state from localStorage ('essence_flow_v1_save')
   */
  loadSave(): EssenceFlowSaveState | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.checkpoint) {
        // Deep merge with default to guard against missing fields
        return {
          ...DEFAULT_SAVE_STATE,
          ...parsed,
          player: { ...DEFAULT_SAVE_STATE.player, ...parsed.player },
          activities: {
            darts: { ...DEFAULT_SAVE_STATE.activities.darts, ...parsed.activities?.darts },
            sparring: { ...DEFAULT_SAVE_STATE.activities.sparring, ...parsed.activities?.sparring },
            rhythm: { ...DEFAULT_SAVE_STATE.activities.rhythm, ...parsed.activities?.rhythm },
            spotting: { ...DEFAULT_SAVE_STATE.activities.spotting, ...parsed.activities?.spotting },
            drinking: { ...DEFAULT_SAVE_STATE.activities.drinking, ...parsed.activities?.drinking },
          },
        };
      }
    } catch (e) {
      console.warn('[TavernHearthSaveService] Failed to load save:', e);
    }
    return null;
  }

  /**
   * Write save state to localStorage under 'essence_flow_v1_save'
   */
  writeSave(state: Partial<EssenceFlowSaveState>): EssenceFlowSaveState {
    const current = this.loadSave() || DEFAULT_SAVE_STATE;
    const merged: EssenceFlowSaveState = {
      ...current,
      ...state,
      checkpoint: 'The Tavern Hearth',
      room: 'The Greedy Greens (Room 0)',
      timestamp: Date.now(),
      savedAtFormatted: new Date().toLocaleTimeString(),
      player: {
        ...current.player,
        ...(state.player || {}),
      },
      activities: {
        darts: { ...current.activities.darts, ...(state.activities?.darts || {}) },
        sparring: { ...current.activities.sparring, ...(state.activities?.sparring || {}) },
        rhythm: { ...current.activities.rhythm, ...(state.activities?.rhythm || {}) },
        spotting: { ...current.activities.spotting, ...(state.activities?.spotting || {}) },
        drinking: { ...current.activities.drinking, ...(state.activities?.drinking || {}) },
      },
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('[TavernHearthSaveService] Failed to write save:', e);
    }
    return merged;
  }

  /**
   * Checkpoint at The Tavern Hearth
   */
  checkpointAtHearth(options: {
    playerPos?: { x: number; y: number };
    activities?: Partial<TavernActivitiesSave>;
    visitedSetpieces?: string[];
  }): EssenceFlowSaveState {
    const current = this.loadSave() || DEFAULT_SAVE_STATE;
    const boons = new Set(current.player.boons);
    boons.add('hearth_warmth');
    boons.add('hearth_rested');

    const updated = this.writeSave({
      player: {
        ...current.player,
        x: options.playerPos?.x ?? 380,
        y: options.playerPos?.y ?? 200,
        stamina: current.player.maxStamina,
        boons: Array.from(boons),
      },
      activities: {
        ...current.activities,
        ...(options.activities || {}),
      },
      visitedSetpieces: Array.from(new Set([...current.visitedSetpieces, 'The Tavern Hearth', ...(options.visitedSetpieces || [])])),
    });

    return updated;
  }

  /**
   * Clear and reset the save state
   */
  clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.warn('[TavernHearthSaveService] Failed to clear save:', e);
    }
  }

  /**
   * Has an existing save in localStorage
   */
  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }
}

export const hearthSaveService = new TavernHearthSaveService();
