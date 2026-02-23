/**
 * Stable per-installation device identifier.
 * Generated once (UUID) on first app launch and persisted in AsyncStorage.
 * Survives app restarts; resets if app is deleted.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTALLATION_ID_KEY = '@eternal_glow/installation_id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let cachedId: string | null = null;

/**
 * Returns the stable installation ID for this device/install.
 * Creates and persists one on first call.
 */
export async function getInstallationId(): Promise<string> {
  if (cachedId) return cachedId;
  try {
    const existing = await AsyncStorage.getItem(INSTALLATION_ID_KEY);
    if (existing && existing.length > 0) {
      cachedId = existing;
      return existing;
    }
  } catch {
    // ignore
  }
  const newId = generateUUID();
  try {
    await AsyncStorage.setItem(INSTALLATION_ID_KEY, newId);
  } catch {
    // still use in memory
  }
  cachedId = newId;
  return newId;
}

/**
 * Sync get for use in store hydration — returns cached value or null.
 * Call ensureInstallationId() at app init so this is set.
 */
export function getInstallationIdSync(): string | null {
  return cachedId;
}

/**
 * Call at app startup so installationId is available synchronously after first await.
 */
export async function ensureInstallationId(): Promise<string> {
  return getInstallationId();
}
