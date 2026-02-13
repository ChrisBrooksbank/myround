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
