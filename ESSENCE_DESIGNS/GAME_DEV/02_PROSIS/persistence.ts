// Run persistence module — localStorage persistence with Node fallback.

import type { LogicState } from "./types";

export const SAVE_KEY = "PROSIS_RUN_SAVE_v1";
export const HISTORY_KEY = "PROSIS_RUN_HISTORY_v1";
export const SHIP_KEY = "PROSIS_SHIP_NAME_v1";
export const MANIFEST_KEY = "PROSIS_CAPTAINS_MANIFEST_v1";
export const LORE_KEY = "PROSIS_UNLOCKED_LORE_v1";
export const ACHIEVEMENTS_KEY = "PROSIS_ACHIEVEMENTS_v1";

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
  victory: boolean;
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

