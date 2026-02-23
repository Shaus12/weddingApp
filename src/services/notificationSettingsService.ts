/**
 * Notification settings persistence and prompt state.
 * Key: @eternal_glow/notif_settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_SETTINGS_KEY = '@eternal_glow/notif_settings';
const NOTIF_PROMPT_DISMISSED_KEY = '@eternal_glow/notif_prompt_dismissed';

export interface NotificationSettings {
  dailyReminderEnabled: boolean;
  dailyTimeHour: number;
  dailyTimeMinute: number;
  milestonesEnabled: boolean;
  todayAgendaEnabled: boolean;
}

const DEFAULTS: NotificationSettings = {
  dailyReminderEnabled: false,
  dailyTimeHour: 20,
  dailyTimeMinute: 30,
  milestonesEnabled: true,
  todayAgendaEnabled: false,
};

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(NOTIF_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
      return { ...DEFAULTS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULTS };
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  await AsyncStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
}

export async function getNotifPromptDismissed(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(NOTIF_PROMPT_DISMISSED_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function setNotifPromptDismissed(): Promise<void> {
  await AsyncStorage.setItem(NOTIF_PROMPT_DISMISSED_KEY, 'true');
}
