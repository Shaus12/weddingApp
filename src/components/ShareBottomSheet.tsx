import React, { useRef, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, Animated,
    ActivityIndicator, Alert, Dimensions
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import ShareCard from './ShareCard';
import {
    captureShareCard, shareToInstagram, shareToWhatsApp,
    saveImage, shareGeneral, buildCacheKey, buildCaption
} from '../services/shareService';
import { useUserStore } from '../store/useUserStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShareBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    daysLeft: number;
    navigation: any;
}

export default function ShareBottomSheet({ visible, onClose, daysLeft, navigation }: ShareBottomSheetProps) {
    const { partner1Name, partner2Name, weddingDate, baseImage, style, isPremium, countdownPosition } = useUserStore();

    const viewShotRef = useRef<ViewShot | null>(null);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    const [isGenerating, setIsGenerating] = useState(false);
    const [cardUri, setCardUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cacheKey = buildCacheKey(daysLeft, style);
    const caption = buildCaption(daysLeft);

    // Animate in when visible
    React.useEffect(() => {
        if (visible) {
            setError(null);
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
            ]).start(() => generateCard());
        } else {
            setCardUri(null);
        }
    }, [visible]);

    const close = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
            Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start(() => onClose());
    }, [onClose]);

    const generateCard = async () => {
        setIsGenerating(true);
        try {
            const uri = await captureShareCard(viewShotRef, cacheKey);
            setCardUri(uri);
        } catch (e: any) {
            setError('Could not prepare your share card. Try "More…" instead.');
        } finally {
            setIsGenerating(false);
        }
    };

    const withCard = async (action: (uri: string) => Promise<void>) => {
        if (!cardUri) {
            Alert.alert('Still preparing…', 'Please wait a moment and try again.');
            return;
        }
        try {
            await action(cardUri);
        } catch {
            Alert.alert('Oops!', 'Something went wrong. Try "More…" for another option.', [
                { text: 'More…', onPress: () => shareGeneral(cardUri, caption) },
                { text: 'Cancel', style: 'cancel' },
            ]);
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
            {/* Off-screen capture target */}
            <View style={styles.offScreen} pointerEvents="none">
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                    <ShareCard
                        partner1Name={partner1Name}
                        partner2Name={partner2Name}
                        daysLeft={daysLeft}
                        weddingDate={weddingDate}
                        baseImage={baseImage}
                        isPremium={isPremium}
                        countdownPosition={countdownPosition}
                    />
                </ViewShot>
            </View>

            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={close} activeOpacity={1} />
            </Animated.View>

            {/* Sheet */}
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                {/* Handle */}
                <View style={styles.handle} />

                <Text style={styles.sheetTitle}>Share Your Countdown</Text>
                <Text style={styles.sheetSubtitle}>
                    {isGenerating ? 'Preparing your card…' : error ?? 'Choose how to share'}
                </Text>

                {/* Loading / Error state */}
                {isGenerating ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.accent} />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={() => shareGeneral(cardUri ?? '', caption)}
                        >
                            <Text style={styles.primaryButtonText}>More…</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        {/* Instagram Story */}
                        <TouchableOpacity
                            style={[styles.actionButton, styles.instagramButton]}
                            onPress={() => withCard(uri => shareToInstagram(uri))}
                        >
                            <Text style={styles.actionEmoji}>📸</Text>
                            <View>
                                <Text style={styles.actionLabel}>Instagram Story</Text>
                                <Text style={styles.actionSub}>Share as a Story background</Text>
                            </View>
                        </TouchableOpacity>

                        {/* WhatsApp */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => withCard(uri => shareToWhatsApp(uri, caption))}
                        >
                            <Text style={styles.actionEmoji}>💬</Text>
                            <View>
                                <Text style={styles.actionLabel}>WhatsApp</Text>
                                <Text style={styles.actionSub}>Send the card to a contact</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Save Image */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => withCard(async uri => {
                                const saved = await saveImage(uri);
                                if (saved) Alert.alert('Saved! 🎉', 'Your share card is in your photo library.');
                            })}
                        >
                            <Text style={styles.actionEmoji}>💾</Text>
                            <View>
                                <Text style={styles.actionLabel}>Save Image</Text>
                                <Text style={styles.actionSub}>Save the card to your camera roll</Text>
                            </View>
                        </TouchableOpacity>

                        {/* More… */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => withCard(uri => shareGeneral(uri, caption))}
                        >
                            <Text style={styles.actionEmoji}>📤</Text>
                            <View>
                                <Text style={styles.actionLabel}>More…</Text>
                                <Text style={styles.actionSub}>Open the system share sheet</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Change Style */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => { close(); navigation.navigate('StyleSelection'); }}
                        >
                            <Text style={styles.actionEmoji}>🎨</Text>
                            <View>
                                <Text style={styles.actionLabel}>Change Style</Text>
                                <Text style={styles.actionSub}>Pick a different theme for your card</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Premium watermark note */}
                        {!isPremium && (
                            <TouchableOpacity
                                style={styles.watermarkNote}
                                onPress={() => { close(); navigation.navigate('Paywall'); }}
                            >
                                <Text style={styles.watermarkNoteText}>
                                    ✨ Upgrade to remove the watermark
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.cancelButton} onPress={close}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    offScreen: {
        position: 'absolute',
        top: -9999,
        left: -9999,
        opacity: 0,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: SPACING.s,
        paddingBottom: 40,
        paddingHorizontal: SPACING.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D0D0D0',
        alignSelf: 'center',
        marginBottom: SPACING.m,
    },
    sheetTitle: {
        fontFamily: FONTS.serifBold,
        fontSize: 22,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    sheetSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    loadingContainer: {
        paddingVertical: SPACING.xxl,
        alignItems: 'center',
    },
    errorContainer: {
        paddingVertical: SPACING.l,
        alignItems: 'center',
        gap: SPACING.m,
    },
    errorText: {
        fontFamily: FONTS.sans,
        fontSize: 15,
        color: COLORS.error,
        textAlign: 'center',
    },
    actions: {
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    instagramButton: {
        borderColor: COLORS.accent,
        borderWidth: 1.5,
        backgroundColor: '#FFF5F5',
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    primaryButtonText: {
        fontFamily: FONTS.sansBold,
        color: COLORS.white,
        fontSize: 16,
    },
    actionEmoji: {
        fontSize: 24,
    },
    actionLabel: {
        fontFamily: FONTS.sansBold,
        fontSize: 15,
        color: COLORS.text,
    },
    actionSub: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.textLight,
    },
    watermarkNote: {
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
    watermarkNoteText: {
        fontFamily: FONTS.sans,
        fontSize: 13,
        color: COLORS.accent,
        textDecorationLine: 'underline',
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: SPACING.m,
        marginTop: SPACING.xs,
    },
    cancelText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
});
