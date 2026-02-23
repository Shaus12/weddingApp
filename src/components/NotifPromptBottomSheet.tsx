import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    PanResponder,
    ActivityIndicator,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { setNotifPromptDismissed } from '../services/notificationSettingsService';
import { loadNotificationSettings, saveNotificationSettings } from '../services/notificationSettingsService';
import { scheduleAll } from '../services/notificationScheduler';
import { Platform } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NotifPromptBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    weddingDate: string | null;
}

export default function NotifPromptBottomSheet({ visible, onClose, weddingDate }: NotifPromptBottomSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const [busy, setBusy] = useState(false);

    const close = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleNotNow = useCallback(() => {
        setNotifPromptDismissed();
        close();
    }, [close]);

    const handleYes = useCallback(async () => {
        setBusy(true);
        try {
            const { status: existing } = await Notifications.getPermissionsAsync();
            let finalStatus = existing;
            if (existing !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                close();
                return;
            }
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('countdown-daily', {
                    name: 'Countdown reminders',
                    importance: Notifications.AndroidImportance.DEFAULT,
                });
            }
            const settings = await loadNotificationSettings();
            const next = { ...settings, dailyReminderEnabled: true };
            await saveNotificationSettings(next);
            await scheduleAll(weddingDate, next);
        } catch (e) {
            console.warn('Notif enable failed', e);
        } finally {
            setBusy(false);
            close();
        }
    }, [close, weddingDate]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 80) close();
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={handleNotNow}>
            <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleNotNow} activeOpacity={1} />
            </Animated.View>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]} {...panResponder.panHandlers}>
                <View style={styles.handle} />
                <Text style={styles.title}>רוצה תזכורת יומית עדינה?</Text>
                <Text style={styles.subtitle}>פעם ביום נזכיר כמה ימים נשארו. אפשר לשנות/לבטל תמיד.</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleYes}
                        disabled={busy}
                    >
                        {busy ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.primaryButtonText}>כן, תזכירו לי</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleNotNow} disabled={busy}>
                        <Text style={styles.secondaryButtonText}>לא עכשיו</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.backgroundLight,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: SPACING.s,
        paddingHorizontal: SPACING.l,
        paddingBottom: 40,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.slate300,
        alignSelf: 'center',
        marginBottom: SPACING.m,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.slate900,
        textAlign: 'center',
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 15,
        color: COLORS.slate600,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    buttons: {
        gap: SPACING.s,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.white,
    },
    secondaryButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 15,
        color: COLORS.slate500,
    },
});
