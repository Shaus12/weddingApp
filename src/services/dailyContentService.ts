/**
 * Daily content (Today tab): date key, card for today, save/skip persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_SAVED = '@agenda/daily_saved';
const KEY_SKIPPED_DATES = '@agenda/daily_skipped_dates';

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function getSavedIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SAVED);
    if (raw) {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }
  } catch {
    // ignore
  }
  return [];
}

export async function saveContentId(id: string): Promise<void> {
  const ids = await getSavedIds();
  if (ids.includes(id)) return;
  await AsyncStorage.setItem(KEY_SAVED, JSON.stringify([...ids, id]));
}

export async function wasSkippedToday(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SKIPPED_DATES);
    if (raw) {
      const arr = JSON.parse(raw);
      const set = new Set(Array.isArray(arr) ? arr : []);
      return set.has(getTodayDateKey());
    }
  } catch {
    // ignore
  }
  return false;
}

export async function skipToday(): Promise<void> {
  const dateKey = getTodayDateKey();
  try {
    const raw = await AsyncStorage.getItem(KEY_SKIPPED_DATES);
    const arr = raw ? JSON.parse(raw) : [];
    const set = new Set(Array.isArray(arr) ? arr : []);
    set.add(dateKey);
    await AsyncStorage.setItem(KEY_SKIPPED_DATES, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}
