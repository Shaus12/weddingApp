/**
 * Local notification scheduling: rolling window (e.g. 45 days), top-up when needed.
 * One notification per day at chosen time; milestone days replace daily message.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationSettings } from './notificationSettingsService';
import { getLocalDateKey, addDaysToDateKey, getDateKeyFromDate } from './dateKeyService';

const MILESTONES = [100, 50, 30, 14, 7, 3, 1];
const CHANNEL_ID = 'countdown-daily';

/** Number of days ahead to schedule (rolling window). */
export const SCHEDULE_WINDOW_DAYS = 45;
/** Days before end of window to trigger a top-up. */
export const BUFFER_DAYS = 7;

const LAST_SCHEDULED_DATE_KEY = '@eternal_glow/notif_last_scheduled_dateKey';

const DAILY_TEMPLATES = [
  (d: number) => `${d} ימים לספירה 💍`,
  (d: number) => `עוד יום אחד קרוב יותר ❤️ (${d})`,
  (d: number) => `${d}. זה מתקרב ✨`,
];

const MILESTONE_TEMPLATES: Record<number, string> = {
  100: '100 ימים! 🎉 היום שווה שיתוף',
  50: '50 ימים! 💍 מתקרבים',
  30: 'חודש לחתונה! 💍',
  14: 'שבועיים! ✨',
  7: 'שבוע לחתונה! 💍',
  3: '3 ימים! ❤️',
  1: 'מחר החתונה! 💒',
};

/** Days left from a given local date (YYYY-MM-DD) to wedding (ISO string). */
export function getDaysLeftForDate(
  fromDateKey: string,
  weddingDateIso: string
): number {
  const [fy, fm, fd] = fromDateKey.split('-').map(Number);
  const from = new Date(fy, fm - 1, fd);
  const wedding = new Date(weddingDateIso);
  const diffTime = wedding.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function getMessage(daysLeft: number, dayIndex: number, milestonesEnabled: boolean): string {
  if (milestonesEnabled && MILESTONES.includes(daysLeft) && MILESTONE_TEMPLATES[daysLeft]) {
    return MILESTONE_TEMPLATES[daysLeft];
  }
  const template = DAILY_TEMPLATES[dayIndex % DAILY_TEMPLATES.length];
  return template(daysLeft);
}

function buildTriggerDate(dateKey: string, hour: number, minute: number): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d, hour, minute, 0, 0);
  return date;
}

/** Ensure Android channel exists. */
async function ensureChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Countdown reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  try {
    await AsyncStorage.removeItem(LAST_SCHEDULED_DATE_KEY);
  } catch {
    // ignore
  }
}

async function setLastScheduledDateKey(dateKey: string): Promise<void> {
  await AsyncStorage.setItem(LAST_SCHEDULED_DATE_KEY, dateKey);
}

export async function getLastScheduledDateKey(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_SCHEDULED_DATE_KEY);
  } catch {
    return null;
  }
}

/** Wedding date as local YYYY-MM-DD (for comparison with date keys). */
function getWeddingDateKey(weddingDateIso: string): string {
  return getDateKeyFromDate(new Date(weddingDateIso));
}

/**
 * Schedule notifications for a range of days [fromDateKey, toDateKey] (inclusive).
 * Does not cancel existing; uses device-local date keys. Returns the last scheduled date key.
 */
async function scheduleRange(
  fromDateKey: string,
  toDateKey: string,
  weddingDateIso: string,
  settings: NotificationSettings,
  startDayIndex: number
): Promise<string> {
  const hour = settings.dailyTimeHour;
  const minute = settings.dailyTimeMinute;
  const milestonesEnabled = settings.milestonesEnabled;
  const weddingDateKey = getWeddingDateKey(weddingDateIso);
  let currentKey = fromDateKey;
  let dayIndex = startDayIndex;
  let lastScheduled = fromDateKey;

  while (currentKey <= toDateKey && currentKey < weddingDateKey) {
    const daysLeft = getDaysLeftForDate(currentKey, weddingDateIso);
    if (daysLeft <= 0) break;

    const triggerDate = buildTriggerDate(currentKey, hour, minute);
    if (triggerDate.getTime() > Date.now()) {
      const body = getMessage(daysLeft, dayIndex, milestonesEnabled);
      const identifier = `countdown-${currentKey}`;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ספירה לחתונה',
          body,
          data: { route: 'Home' },
          channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
        },
        trigger: triggerDate,
        identifier,
      });
      lastScheduled = currentKey;
    }
    dayIndex += 1;
    currentKey = addDaysToDateKey(currentKey, 1);
  }

  return lastScheduled;
}

export async function scheduleAll(
  weddingDateIso: string | null,
  settings: NotificationSettings
): Promise<void> {
  if (!weddingDateIso || !settings.dailyReminderEnabled) {
    await cancelAll();
    return;
  }

  await cancelAll();
  await ensureChannel();

  const todayKey = getLocalDateKey();
  const tomorrowKey = addDaysToDateKey(todayKey, 1);
  const windowEndKey = addDaysToDateKey(todayKey, SCHEDULE_WINDOW_DAYS);
  const weddingDateKey = getWeddingDateKey(weddingDateIso);
  const toKey = windowEndKey < weddingDateKey ? windowEndKey : weddingDateKey;

  const lastScheduled = await scheduleRange(
    tomorrowKey,
    toKey,
    weddingDateIso,
    settings,
    0
  );
  await setLastScheduledDateKey(lastScheduled);
}

/**
 * Top-up: if the last scheduled date is before (today + window - buffer), schedule more days.
 * If nothing scheduled yet, does a full scheduleAll.
 */
export async function topUp(
  weddingDateIso: string | null,
  settings: NotificationSettings
): Promise<void> {
  if (!weddingDateIso || !settings.dailyReminderEnabled) return;

  const lastScheduled = await getLastScheduledDateKey();
  const todayKey = getLocalDateKey();

  if (lastScheduled == null) {
    await scheduleAll(weddingDateIso, settings);
    return;
  }

  const thresholdKey = addDaysToDateKey(todayKey, SCHEDULE_WINDOW_DAYS - BUFFER_DAYS);
  if (lastScheduled >= thresholdKey) return;

  await ensureChannel();

  const fromKey = addDaysToDateKey(lastScheduled, 1);
  const windowEndKey = addDaysToDateKey(todayKey, SCHEDULE_WINDOW_DAYS);
  const weddingDateKey = getWeddingDateKey(weddingDateIso);
  const toKey = windowEndKey < weddingDateKey ? windowEndKey : weddingDateKey;

  if (fromKey > toKey) return;

  const dayIndex = SCHEDULE_WINDOW_DAYS; // approximate offset for template rotation
  const newLastScheduled = await scheduleRange(
    fromKey,
    toKey,
    weddingDateIso,
    settings,
    dayIndex
  );
  await setLastScheduledDateKey(newLastScheduled);
}

export async function rescheduleOnChange(
  weddingDateIso: string | null,
  settings: NotificationSettings
): Promise<void> {
  await scheduleAll(weddingDateIso, settings);
}
