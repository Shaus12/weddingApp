import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Share, Platform, Linking, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';

const APP_NAME = 'Eternal Glow';
const APP_LINK = 'https://eternalglow.app'; // Replace with real link when live

// ---------- Cache key ----------
export function buildCacheKey(daysLeft: number, style: string | null): string {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    return `share_card_${dateStr}_${daysLeft}_${style ?? 'default'}.png`;
}

// ---------- Capture + Cache ----------
export async function captureShareCard(
    viewShotRef: React.RefObject<ViewShot | null>,
    cacheKey: string
): Promise<string> {
    const cacheDir = (FileSystem.cacheDirectory as string | null) || '';
    const cachedUri = cacheDir + cacheKey;

    // Check if cached file exists
    const fileInfo = await FileSystem.getInfoAsync(cachedUri);
    if (fileInfo.exists) {
        return cachedUri;
    }

    // Capture fresh
    const ref = viewShotRef.current;
    if (!ref || !ref.capture) throw new Error('ViewShot ref not ready');
    const uri = await ref.capture();

    // Move to cache directory with our key
    await FileSystem.copyAsync({ from: uri, to: cachedUri });
    return cachedUri;
}

// ---------- Instagram Story ----------
/** Returns false if app not installed or deep link failed (caller should show "try More… or Save"). */
export async function shareToInstagram(fileUri: string): Promise<boolean> {
    if (Platform.OS === 'ios') {
        const canOpen = await Linking.canOpenURL('instagram-stories://share');
        if (canOpen) {
            try {
                await shareGeneral(fileUri, '');
                return true;
            } catch {
                await shareGeneral(fileUri, `${APP_LINK}`);
                return false;
            }
        }
    }
    await shareGeneral(fileUri, `${APP_LINK}`);
    return false;
}

// ---------- WhatsApp ----------
/** Returns false if app not available or share failed (caller should show "try More… or Save"). */
export async function shareToWhatsApp(fileUri: string, caption: string): Promise<boolean> {
    try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'image/png',
                dialogTitle: caption,
                UTI: 'public.png',
            });
            return true;
        }
    } catch {
        // fall through to fallback
    }
    await shareGeneral(fileUri, caption);
    return false;
}

// ---------- Save to Camera Roll ----------
export async function saveImage(fileUri: string): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow photo access to save your share card.');
        return false;
    }
    await MediaLibrary.saveToLibraryAsync(fileUri);
    return true;
}

// ---------- General / More… ----------
export async function shareGeneral(fileUri: string, caption: string): Promise<void> {
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
        await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            UTI: 'public.png',
        });
    } else {
        // Text-only fallback
        await Share.share({ message: caption });
    }
}

export function buildCaption(daysLeft: number): string {
    return `${daysLeft} days to go 💍 Made with ${APP_NAME} ${APP_LINK}`;
}

// ---------- Save The Date poster cache key ----------
export function buildSaveTheDatePosterCacheKey(partner1: string, partner2: string): string {
    return `save_the_date_${partner1}_${partner2}.png`;
}

// ---------- Video sharing (Save The Date video: 1080x1920 mp4) ----------
const VIDEO_MIME = 'video/mp4';
const VIDEO_UTI = 'public.movie';

/** Returns false if Instagram not installed or deep link failed (caller should show "try More… or Save"). */
export async function shareToInstagramVideo(videoUri: string): Promise<boolean> {
    if (Platform.OS === 'ios') {
        const canOpen = await Linking.canOpenURL('instagram-stories://share');
        if (canOpen) {
            try {
                await shareGeneralVideo(videoUri, '');
                return true;
            } catch {
                await shareGeneralVideo(videoUri, APP_LINK);
                return false;
            }
        }
    }
    await shareGeneralVideo(videoUri, APP_LINK);
    return false;
}

/** Returns false if WhatsApp not available or share failed (caller should show "try More… or Save"). */
export async function shareToWhatsAppVideo(videoUri: string, caption: string): Promise<boolean> {
    try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(videoUri, {
                mimeType: VIDEO_MIME,
                dialogTitle: caption,
                UTI: VIDEO_UTI,
            });
            return true;
        }
    } catch {
        // fall through to fallback
    }
    await shareGeneralVideo(videoUri, caption);
    return false;
}

export async function saveVideo(videoUri: string): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow photo access to save your video.');
        return false;
    }
    await MediaLibrary.saveToLibraryAsync(videoUri);
    return true;
}

export async function shareGeneralVideo(videoUri: string, caption: string): Promise<void> {
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
        await Sharing.shareAsync(videoUri, {
            mimeType: VIDEO_MIME,
            UTI: VIDEO_UTI,
        });
    } else {
        await Share.share({ message: caption });
    }
}

export function buildSaveTheDateCaption(partner1: string, partner2: string, formattedDate: string): string {
    return `Save the Date! ${partner1} & ${partner2} are getting married on ${formattedDate}. 💍 ${APP_LINK}`;
}
