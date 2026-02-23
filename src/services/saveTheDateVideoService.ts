/**
 * Save The Date AI Video service.
 * - Device-based: cache and quota keyed by installationId only.
 * - Cache: one video per day per device (installationId:YYYY-MM-DD, local date).
 * - Quota: max 3 generation attempts total per device (persisted).
 */

import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalDateKey } from './dateKeyService';

const SUPABASE_FUNCTIONS_URL = 'https://cwnnjhcivkqnqgpmnitj.supabase.co/functions/v1';
const CACHE_DIR = (FileSystem.cacheDirectory ?? '') + 'saveTheDateVideo/';
const ATTEMPTS_STORAGE_KEY = '@eternal_glow/save_the_date_video_attempts';
export const MAX_GENERATION_ATTEMPTS = 3;

export const VIDEO_STYLES = [
  { id: 'cinematic', label: 'Cinematic', thumbnail: null },
  { id: 'elegant-invite', label: 'Elegant Invite', thumbnail: null },
  { id: 'fun-playful', label: 'Fun & Playful', thumbnail: null },
  { id: 'minimal', label: 'Minimal', thumbnail: null },
  { id: 'luxury-gold', label: 'Luxury Gold', thumbnail: null },
] as const;

export type VideoStyleId = (typeof VIDEO_STYLES)[number]['id'];

/** Cache key: installationId + local date (one video per day per device). */
export function buildVideoCacheKey(installationId: string, dateKey: string): string {
  return `${installationId}:${dateKey}`;
}

/** Ensure cache dir exists */
async function ensureCacheDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

/**
 * Get cached video URL for today if it exists (per device, local date).
 */
export async function getCachedVideoUrl(installationId: string): Promise<string | null> {
  const dateKey = getLocalDateKey();
  const cacheKey = buildVideoCacheKey(installationId, dateKey);
  await ensureCacheDir();
  const metaPath = CACHE_DIR + cacheKey + '_meta.json';
  const metaInfo = await FileSystem.getInfoAsync(metaPath);
  if (!metaInfo.exists) return null;
  try {
    const raw = await FileSystem.readAsStringAsync(metaPath);
    const meta = JSON.parse(raw) as { url: string; generatedAt: string };
    if (meta?.url) return meta.url;
  } catch {
    return null;
  }
  return null;
}

/**
 * Persist generated video URL for this device + local date.
 */
export async function setCachedVideoUrl(installationId: string, url: string): Promise<void> {
  const dateKey = getLocalDateKey();
  const cacheKey = buildVideoCacheKey(installationId, dateKey);
  await ensureCacheDir();
  const metaPath = CACHE_DIR + cacheKey + '_meta.json';
  await FileSystem.writeAsStringAsync(
    metaPath,
    JSON.stringify({ url, generatedAt: new Date().toISOString() })
  );
}

/**
 * Persist video URL for a specific date key (e.g. when server returns URL during polling).
 */
export async function setCachedVideoUrlForDate(
  installationId: string,
  dateKey: string,
  url: string
): Promise<void> {
  const cacheKey = buildVideoCacheKey(installationId, dateKey);
  await ensureCacheDir();
  const metaPath = CACHE_DIR + cacheKey + '_meta.json';
  await FileSystem.writeAsStringAsync(
    metaPath,
    JSON.stringify({ url, generatedAt: new Date().toISOString() })
  );
}

// ---------- Server status (for polling) ----------

export interface LatestVideoStatus {
  videoUrl?: string;
  status?: string;
}

/**
 * Query backend for latest video URL/status for (installationId, dateKey).
 * Use during polling; if server returns videoUrl, persist to local cache and use it.
 */
export async function getLatestVideoStatus(
  installationId: string,
  dateKey: string
): Promise<LatestVideoStatus> {
  const params = new URLSearchParams({ installationId, date: dateKey });
  const url = `${SUPABASE_FUNCTIONS_URL}/get-save-the-date-video-status?${params.toString()}`;
  const response = await fetch(url, { method: 'GET' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {};
  }
  return (data as LatestVideoStatus) || {};
}

// ---------- Attempts quota (max 3 total per device) ----------

type AttemptsData = { used: number };

async function getAttemptsData(installationId: string): Promise<AttemptsData> {
  try {
    const key = `${ATTEMPTS_STORAGE_KEY}:${installationId}`;
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as AttemptsData;
      if (typeof parsed.used === 'number') return parsed;
    }
  } catch {
    // ignore
  }
  return { used: 0 };
}

async function setAttemptsData(installationId: string, data: AttemptsData): Promise<void> {
  const key = `${ATTEMPTS_STORAGE_KEY}:${installationId}`;
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

/** Returns how many generation attempts remain (0 to MAX_GENERATION_ATTEMPTS). */
export async function getAttemptsRemaining(installationId: string): Promise<number> {
  const data = await getAttemptsData(installationId);
  const remaining = MAX_GENERATION_ATTEMPTS - data.used;
  return Math.max(0, remaining);
}

/**
 * Consume one attempt. Call when user taps "Generate Video" (before calling the API).
 * Returns false if no attempts left (caller should not start generation).
 */
export async function consumeAttempt(installationId: string): Promise<boolean> {
  const data = await getAttemptsData(installationId);
  if (data.used >= MAX_GENERATION_ATTEMPTS) return false;
  data.used += 1;
  await setAttemptsData(installationId, data);
  return true;
}

export interface GenerateVideoParams {
  installationId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string | null;
  style: VideoStyleId;
  photoReferenceUri: string | null;
}

/**
 * Call edge function to generate Save The Date video.
 * Does NOT check or consume attempts — caller must consume before calling.
 * Returns URL of the generated 1080x1920 mp4 (8–12s). Caches by installationId + local date.
 */
export async function generateSaveTheDateVideo(params: GenerateVideoParams): Promise<string> {
  const { installationId, partner1Name, partner2Name, weddingDate, style, photoReferenceUri } = params;

  const url = `${SUPABASE_FUNCTIONS_URL}/generate-save-the-date-video`;
  const body = {
    userId: installationId,
    partner1Name,
    partner2Name,
    weddingDate: weddingDate ?? undefined,
    style,
    photoReferenceUri: photoReferenceUri ?? undefined,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string })?.error ?? 'Video generation failed.');
  }

  const videoUrl = (data as { videoUrl?: string }).videoUrl;
  if (!videoUrl || typeof videoUrl !== 'string') {
    throw new Error('No video URL returned.');
  }

  await setCachedVideoUrl(installationId, videoUrl);
  return videoUrl;
}
