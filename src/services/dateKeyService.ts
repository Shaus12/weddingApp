/**
 * Centralized date key in device local timezone.
 * Use for cache keys, polling, and daily quota so behavior is consistent.
 */

/**
 * Returns YYYY-MM-DD in the user's local timezone (not UTC).
 */
export function getLocalDateKey(): string {
  const d = new Date();
  return getDateKeyFromDate(d);
}

/**
 * Returns YYYY-MM-DD for a given Date in the same (local) calendar.
 */
export function getDateKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Add N days to a date key (YYYY-MM-DD), returns new date key in local sense.
 */
export function addDaysToDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return getDateKeyFromDate(date);
}
