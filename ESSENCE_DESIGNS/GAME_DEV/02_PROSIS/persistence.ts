// Run persistence module — localStorage persistence with Node fallback.

import type {
  LogicState,
  HighScoreEntry,
  CosmeticsProfile,
  CaptainProfile,
  HullSkin,
  PersonaId,
} from "./types";

export const SAVE_KEY = "PROSIS_RUN_SAVE_v1";
export const HISTORY_KEY = "PROSIS_RUN_HISTORY_v1";
export const SHIP_KEY = "PROSIS_SHIP_NAME_v1";
export const MANIFEST_KEY = "PROSIS_CAPTAINS_MANIFEST_v1";
export const LORE_KEY = "PROSIS_UNLOCKED_LORE_v1";
export const ACHIEVEMENTS_KEY = "PROSIS_ACHIEVEMENTS_v1";
export const HIGH_SCORES_KEY = "PROSIS_HIGH_SCORES_v1";
export const COSMETICS_KEY = "PROSIS_COSMETICS_v1";
export const CAPTAIN_PROFILE_KEY = "PROSIS_CAPTAIN_PROFILE_v1";

export interface RunHistorySummary {
  round: number;
  causeOfLoss: string | null;
  sector: number;
}

export interface ShipLogEntry {
  id: string;
  shipName: string;
  captainName: string;
  sector: number;
  round: number;
  causeOfLoss: string | null;
  date: string;
  victory?: boolean;
  anchorPersona?: PersonaId | string;
}

export interface LoreEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  sectorRequired: number;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      return localStorage.getItem(key);
    }
  } catch {
    // Fallback on storage errors
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Fallback on storage errors
  }
  memoryStore.set(key, value);
}

function removeItem(key: string): void {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      localStorage.removeItem(key);
      return;
    }
  } catch {
    // Fallback on storage errors
  }
  memoryStore.delete(key);
}

export function saveRunState(state: LogicState): void {
  setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadRunState(): LogicState | null {
  const raw = getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LogicState;
  } catch {
    return null;
  }
}

export function clearRunState(): void {
  removeItem(SAVE_KEY);
}

export function getRunHistory(): RunHistorySummary[] {
  const raw = getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRunHistory(summary: RunHistorySummary): void {
  const history = getRunHistory();
  history.push(summary);
  setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearRunHistory(): void {
  removeItem(HISTORY_KEY);
}

// ============================================================
// PROSIS V2 CAPTAIN'S EDITION PERSISTENCE HELPERS
// ============================================================

export function getShipName(): string {
  const name = getItem(SHIP_KEY);
  return name && name.trim().length > 0 ? name : "SS Horizon Zero";
}

export function setShipName(name: string): void {
  setItem(SHIP_KEY, name.trim());
}

export function getCaptainsManifest(): ShipLogEntry[] {
  const raw = getItem(MANIFEST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordManifestEntry(entry: Omit<ShipLogEntry, "id" | "date">): ShipLogEntry {
  const logs = getCaptainsManifest();
  const fullEntry: ShipLogEntry = {
    ...entry,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toISOString(),
  };
  logs.unshift(fullEntry); // newest first
  setItem(MANIFEST_KEY, JSON.stringify(logs));
  return fullEntry;
}

export function clearCaptainsManifest(): void {
  removeItem(MANIFEST_KEY);
}

export function getUnlockedLoreIds(): string[] {
  const raw = getItem(LORE_KEY);
  if (!raw) return ["sig_01"]; // default initial signal
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ["sig_01"];
  } catch {
    return ["sig_01"];
  }
}

export function unlockLoreId(id: string): boolean {
  const current = new Set(getUnlockedLoreIds());
  if (current.has(id)) return false;
  current.add(id);
  setItem(LORE_KEY, JSON.stringify(Array.from(current)));
  return true;
}

export function isLoreUnlocked(id: string): boolean {
  return getUnlockedLoreIds().includes(id);
}

export function clearUnlockedLore(): void {
  removeItem(LORE_KEY);
}

export function getUnlockedAchievementIds(): string[] {
  const raw = getItem(ACHIEVEMENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function unlockAchievementId(id: string): boolean {
  const current = new Set(getUnlockedAchievementIds());
  if (current.has(id)) return false;
  current.add(id);
  setItem(ACHIEVEMENTS_KEY, JSON.stringify(Array.from(current)));
  return true;
}

export function isAchievementUnlocked(id: string): boolean {
  return getUnlockedAchievementIds().includes(id);
}

export function clearAchievements(): void {
  removeItem(ACHIEVEMENTS_KEY);
}


// ============================================================
// SPRINT 1: HIGH SCORES & COSMETICS & CAPTAIN PROFILE
// ============================================================

export function calculateRunScore(
  rounds: number,
  sector: number,
  morale: number,
  entropy: number,
  runeCount: number
): number {
  const score = rounds * 1000 + sector * 5000 + morale * 50 - entropy * 30 + runeCount * 2500;
  return Math.max(0, Math.floor(score));
}

export function getHighScores(): HighScoreEntry[] {
  const raw = getItem(HIGH_SCORES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a: HighScoreEntry, b: HighScoreEntry) => b.score - a.score);
  } catch {
    return [];
  }
}

export function submitHighScore(
  entry: Omit<HighScoreEntry, "id" | "timestamp">
): HighScoreEntry {
  const scores = getHighScores();
  const fullEntry: HighScoreEntry = {
    ...entry,
    id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  scores.push(fullEntry);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 100);
  setItem(HIGH_SCORES_KEY, JSON.stringify(trimmed));
  return fullEntry;
}

export function clearHighScores(): void {
  removeItem(HIGH_SCORES_KEY);
}

const DEFAULT_CAPTAIN_PROFILE: CaptainProfile = {
  captainCallsign: "CAPTAIN",
  helmName: "Helm",
  geneName: "Gene",
  salName: "Sal",
  activeHullSkin: "titanium",
};

export function getCaptainProfile(): CaptainProfile {
  const raw = getItem(CAPTAIN_PROFILE_KEY);
  if (!raw) return { ...DEFAULT_CAPTAIN_PROFILE };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CAPTAIN_PROFILE,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_CAPTAIN_PROFILE };
  }
}

export function saveCaptainProfile(profile: Partial<CaptainProfile>): CaptainProfile {
  const current = getCaptainProfile();
  const updated: CaptainProfile = {
    ...current,
    ...profile,
  };
  setItem(CAPTAIN_PROFILE_KEY, JSON.stringify(updated));

  // Also sync crew names and active skin to cosmetics profile if present
  const cosmetics = getCosmeticsProfile();
  let cosmeticsUpdated = false;
  if (profile.helmName !== undefined && cosmetics.helmName !== profile.helmName) {
    cosmetics.helmName = profile.helmName;
    cosmeticsUpdated = true;
  }
  if (profile.geneName !== undefined && cosmetics.geneName !== profile.geneName) {
    cosmetics.geneName = profile.geneName;
    cosmeticsUpdated = true;
  }
  if (profile.salName !== undefined && cosmetics.salName !== profile.salName) {
    cosmetics.salName = profile.salName;
    cosmeticsUpdated = true;
  }
  if (profile.activeHullSkin !== undefined && cosmetics.activeHullSkin !== profile.activeHullSkin) {
    cosmetics.activeHullSkin = profile.activeHullSkin;
    cosmeticsUpdated = true;
  }
  if (cosmeticsUpdated) {
    setItem(COSMETICS_KEY, JSON.stringify(cosmetics));
  }

  return updated;
}

export function clearCaptainProfile(): void {
  removeItem(CAPTAIN_PROFILE_KEY);
}

const DEFAULT_COSMETICS_PROFILE: CosmeticsProfile = {
  unlockedHullSkins: ["titanium"],
  activeHullSkin: "titanium",
  unlockedBadges: {
    ricky: [],
    maude: [],
    dez: [],
  },
  helmName: "Helm",
  geneName: "Gene",
  salName: "Sal",
};

export function getCosmeticsProfile(): CosmeticsProfile {
  const raw = getItem(COSMETICS_KEY);
  if (!raw) return { ...DEFAULT_COSMETICS_PROFILE, unlockedBadges: { ricky: [], maude: [], dez: [] } };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_COSMETICS_PROFILE,
      ...parsed,
      unlockedBadges: {
        ricky: parsed.unlockedBadges?.ricky ?? [],
        maude: parsed.unlockedBadges?.maude ?? [],
        dez: parsed.unlockedBadges?.dez ?? [],
      },
    };
  } catch {
    return { ...DEFAULT_COSMETICS_PROFILE, unlockedBadges: { ricky: [], maude: [], dez: [] } };
  }
}

export function unlockHullSkin(skin: HullSkin): CosmeticsProfile {
  const current = getCosmeticsProfile();
  if (!current.unlockedHullSkins.includes(skin)) {
    current.unlockedHullSkins.push(skin);
    setItem(COSMETICS_KEY, JSON.stringify(current));
  }
  return current;
}

export function unlockScoutBadge(persona: PersonaId, badgeId: string): CosmeticsProfile {
  const current = getCosmeticsProfile();
  if (!current.unlockedBadges[persona]) {
    current.unlockedBadges[persona] = [];
  }
  if (!current.unlockedBadges[persona].includes(badgeId)) {
    current.unlockedBadges[persona].push(badgeId);
    setItem(COSMETICS_KEY, JSON.stringify(current));
  }
  return current;
}

export function clearCosmeticsProfile(): void {
  removeItem(COSMETICS_KEY);
}

