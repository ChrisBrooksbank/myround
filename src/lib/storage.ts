// localStorage wrapper for MyRound data persistence

import type { Round, Regular, RegularGroup, Drink } from '../types';

const STORAGE_KEYS = {
  CURRENT_ROUND: 'myround_current_round',
  ROUND_HISTORY: 'myround_round_history',
  REGULARS: 'myround_regulars',
  GROUPS: 'myround_groups',
  CUSTOM_DRINKS: 'myround_custom_drinks',
} as const;

// Helper function to safely parse JSON from localStorage
function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage:`, error);
    return fallback;
  }
}

// Helper function to safely save JSON to localStorage
function safeSave(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

// ===== Current Round =====

export function getCurrentRound(): Round | null {
  return safeParse<Round | null>(STORAGE_KEYS.CURRENT_ROUND, null);
}

export function saveCurrentRound(round: Round): void {
  safeSave(STORAGE_KEYS.CURRENT_ROUND, round);
}

export function clearCurrentRound(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ROUND);
}

// ===== Round History =====

export function getRoundHistory(): Round[] {
  return safeParse<Round[]>(STORAGE_KEYS.ROUND_HISTORY, []);
}

export function saveRoundHistory(history: Round[]): void {
  safeSave(STORAGE_KEYS.ROUND_HISTORY, history);
}

export function addToHistory(round: Round): void {
  const history = getRoundHistory();
  history.push(round);
  while (history.length > 50) {
    history.shift();
  }
  saveRoundHistory(history);
}

export function removeLastFromHistory(): Round | null {
  const history = getRoundHistory();
  if (history.length === 0) return null;
  const last = history.pop()!;
  saveRoundHistory(history);
  return last;
}

// Get the most recent drink for a specific person from history
export function getLastDrinkForPerson(personName: string): { drinkId: string; customDrinkName?: string } | null {
  const history = getRoundHistory();
  const normalizedName = personName.toLowerCase().trim();

  // Search from most recent to oldest
  for (let i = history.length - 1; i >= 0; i--) {
    const round = history[i];
    const order = round.orders.find(
      (o) => o.personName.toLowerCase().trim() === normalizedName
    );
    if (order) {
      return {
        drinkId: order.drinkId,
        customDrinkName: order.customDrinkName,
      };
    }
  }

  return null;
}

// ===== Regulars =====

export function getRegulars(): Regular[] {
  return safeParse<Regular[]>(STORAGE_KEYS.REGULARS, []);
}

export function saveRegulars(regulars: Regular[]): void {
  safeSave(STORAGE_KEYS.REGULARS, regulars);
}

export function addRegular(regular: Regular): void {
  const regulars = getRegulars();
  regulars.push(regular);
  saveRegulars(regulars);
}

export function updateRegular(id: string, updates: Partial<Regular>): void {
  const regulars = getRegulars();
  const index = regulars.findIndex((r) => r.id === id);
  if (index !== -1) {
    regulars[index] = { ...regulars[index], ...updates };
    saveRegulars(regulars);
  }
}

export function deleteRegular(id: string): void {
  const regulars = getRegulars();
  const filtered = regulars.filter((r) => r.id !== id);
  saveRegulars(filtered);
}

// ===== Groups =====

export function getGroups(): RegularGroup[] {
  return safeParse<RegularGroup[]>(STORAGE_KEYS.GROUPS, []);
}

export function saveGroups(groups: RegularGroup[]): void {
  safeSave(STORAGE_KEYS.GROUPS, groups);
}

export function addGroup(group: RegularGroup): void {
  const groups = getGroups();
  groups.push(group);
  saveGroups(groups);
}

export function updateGroup(id: string, updates: Partial<RegularGroup>): void {
  const groups = getGroups();
  const index = groups.findIndex((g) => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updates };
    saveGroups(groups);
  }
}

export function deleteGroup(id: string): void {
  const groups = getGroups();
  const filtered = groups.filter((g) => g.id !== id);
  saveGroups(filtered);
}

// ===== Custom Drinks =====

export function getCustomDrinks(): Drink[] {
  return safeParse<Drink[]>(STORAGE_KEYS.CUSTOM_DRINKS, []);
}

export function saveCustomDrinks(drinks: Drink[]): void {
  safeSave(STORAGE_KEYS.CUSTOM_DRINKS, drinks);
}

export function deleteCustomDrink(id: string): void {
  const customs = getCustomDrinks();
  const filtered = customs.filter((d) => d.id !== id);
  saveCustomDrinks(filtered);
}

export function addCustomDrink(drink: Drink): void {
  const customs = getCustomDrinks();
  // Don't add duplicates (by name, case-insensitive)
  const exists = customs.some(
    (d) => d.name.toLowerCase() === drink.name.toLowerCase()
  );
  if (!exists) {
    customs.push(drink);
    saveCustomDrinks(customs);
  }
}

// ===== Export / Import =====

interface ExportData {
  version: number;
  exportedAt: string;
  currentRound: Round | null;
  roundHistory: Round[];
  regulars: Regular[];
  groups: RegularGroup[];
  customDrinks: Drink[];
}

export function exportAllData(): string {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    currentRound: getCurrentRound(),
    roundHistory: getRoundHistory(),
    regulars: getRegulars(),
    groups: getGroups(),
    customDrinks: getCustomDrinks(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): string {
  let data: ExportData;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON file');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup file format');
  }

  if (!('version' in data) || !('exportedAt' in data)) {
    throw new Error('Not a MyRound backup file');
  }

  // Validate arrays
  if (data.regulars && !Array.isArray(data.regulars)) {
    throw new Error('Invalid regulars data');
  }
  if (data.groups && !Array.isArray(data.groups)) {
    throw new Error('Invalid groups data');
  }
  if (data.customDrinks && !Array.isArray(data.customDrinks)) {
    throw new Error('Invalid custom drinks data');
  }
  if (data.roundHistory && !Array.isArray(data.roundHistory)) {
    throw new Error('Invalid round history data');
  }

  // Write data
  if (data.currentRound) {
    saveCurrentRound(data.currentRound);
  } else {
    clearCurrentRound();
  }
  safeSave(STORAGE_KEYS.ROUND_HISTORY, data.roundHistory || []);
  safeSave(STORAGE_KEYS.REGULARS, data.regulars || []);
  safeSave(STORAGE_KEYS.GROUPS, data.groups || []);
  safeSave(STORAGE_KEYS.CUSTOM_DRINKS, data.customDrinks || []);

  // Build summary
  const parts: string[] = [];
  const regularsCount = (data.regulars || []).length;
  const groupsCount = (data.groups || []).length;
  const customDrinksCount = (data.customDrinks || []).length;
  const historyCount = (data.roundHistory || []).length;

  if (regularsCount > 0) parts.push(`${regularsCount} regular${regularsCount !== 1 ? 's' : ''}`);
  if (groupsCount > 0) parts.push(`${groupsCount} group${groupsCount !== 1 ? 's' : ''}`);
  if (customDrinksCount > 0) parts.push(`${customDrinksCount} custom drink${customDrinksCount !== 1 ? 's' : ''}`);
  if (historyCount > 0) parts.push(`${historyCount} round${historyCount !== 1 ? 's' : ''} in history`);

  return parts.length > 0 ? parts.join(', ') : 'Empty backup restored';
}

export function getDataCounts(): { regulars: number; groups: number; customDrinks: number; rounds: number } {
  return {
    regulars: getRegulars().length,
    groups: getGroups().length,
    customDrinks: getCustomDrinks().length,
    rounds: getRoundHistory().length,
  };
}
