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
export async function shareToInstagram(fileUri: string): Promise<void> {
    if (Platform.OS === 'ios') {
        const igScheme = 'instagram-stories://share?source_application=com.eternalglow.app';
        const canOpen = await Linking.canOpenURL('instagram-stories://share');
        if (canOpen) {
            // Use native module pasteboard approach via share
            await shareGeneral(fileUri, '');
            return;
        }
    }
    // Fallback: general share
    await shareGeneral(fileUri, `${APP_LINK}`);
}

// ---------- WhatsApp ----------
export async function shareToWhatsApp(fileUri: string, caption: string): Promise<void> {
    try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'image/png',
                dialogTitle: caption,
                UTI: 'public.png',
            });
        } else {
            await shareGeneral(fileUri, caption);
        }
    } catch {
        await shareGeneral(fileUri, caption);
    }
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
