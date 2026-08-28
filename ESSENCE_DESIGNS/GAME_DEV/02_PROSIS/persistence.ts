// Run persistence module — localStorage persistence with Node fallback.

import type { LogicState } from "./types";

export const SAVE_KEY = "PROSIS_RUN_SAVE_v1";
export const HISTORY_KEY = "PROSIS_RUN_HISTORY_v1";

export interface RunHistorySummary {
  round: number;
  causeOfLoss: string | null;
  sector: number;
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
