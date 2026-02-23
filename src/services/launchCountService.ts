/**
 * Device-based app launch counter and one-time premium popup flag.
 * Used for "show premium promo on 2nd app open" (once per device).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LAUNCH_COUNT_KEY = '@eternal_glow/launch_count';
const PREMIUM_POPUP_SHOWN_KEY = '@eternal_glow/premium_popup_shown';

export async function getLaunchCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
    if (raw != null) {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) return n;
    }
  } catch {
    // ignore
  }
  return 0;
}

export async function incrementLaunchCount(): Promise<number> {
  const count = await getLaunchCount();
  const next = count + 1;
  await AsyncStorage.setItem(LAUNCH_COUNT_KEY, String(next));
  return next;
}

export async function getPremiumPopupShown(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(PREMIUM_POPUP_SHOWN_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function setPremiumPopupShown(): Promise<void> {
  await AsyncStorage.setItem(PREMIUM_POPUP_SHOWN_KEY, 'true');
}
