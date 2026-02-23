import React, { useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Alert,
    Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import {
    shareToInstagram,
    shareToWhatsApp,
    shareToInstagramVideo,
    shareToWhatsAppVideo,
    saveImage,
    saveVideo,
    shareGeneral,
    shareGeneralVideo,
    buildSaveTheDateCaption,
} from '../services/shareService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type SaveTheDateShareType = 'poster' | 'video';

interface SaveTheDateShareSheetProps {
    visible: boolean;
    onClose: () => void;
    type: SaveTheDateShareType;
    uri: string;
    partner1Name: string;
    partner2Name: string;
    formattedDate: string;
    navigation: any;
}

const FALLBACK_MSG = 'Try More… or Save to device.';

export default function SaveTheDateShareSheet({
    visible,
    onClose,
    type,
    uri,
    partner1Name,
    partner2Name,
    formattedDate,
    navigation,
}: SaveTheDateShareSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const close = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
            Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start(onClose);
    }, [onClose]);

    const caption = buildSaveTheDateCaption(partner1Name, partner2Name, formattedDate);

    const handleInstagram = async () => {
        try {
            const ok = type === 'video'
                ? await shareToInstagramVideo(uri)
                : await shareToInstagram(uri);
            if (!ok) Alert.alert("Couldn't open Instagram", FALLBACK_MSG);
        } catch {
            Alert.alert("Couldn't open Instagram", FALLBACK_MSG);
        }
        close();
    };

    const handleWhatsApp = async () => {
        try {
            const ok = type === 'video'
                ? await shareToWhatsAppVideo(uri, caption)
                : await shareToWhatsApp(uri, caption);
            if (!ok) Alert.alert("Couldn't open WhatsApp", FALLBACK_MSG);
        } catch {
            Alert.alert("Couldn't open WhatsApp", FALLBACK_MSG);
        }
        close();
    };

    const handleSave = async () => {
        const saved = type === 'video' ? await saveVideo(uri) : await saveImage(uri);
        if (saved) Alert.alert('Saved! 🎉', type === 'video' ? 'Video saved to your camera roll.' : 'Poster saved to your camera roll.');
        close();
    };

    const handleMore = () => {
        if (type === 'video') {
            shareGeneralVideo(uri, caption).catch(() => {});
        } else {
            shareGeneral(uri, caption).catch(() => {});
        }
        close();
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
            <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={close} activeOpacity={1} />
            </Animated.View>

            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>
                    {type === 'video' ? 'Share Video' : 'Share Poster'}
                </Text>
                <Text style={styles.sheetSubtitle}>Choose how to share</Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.instagramButton]}
                        onPress={handleInstagram}
                    >
                        <Text style={styles.actionEmoji}>📸</Text>
                        <View>
                            <Text style={styles.actionLabel}>Instagram Story</Text>
                            <Text style={styles.actionSub}>Share as a Story</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
                        <Text style={styles.actionEmoji}>💬</Text>
                        <View>
                            <Text style={styles.actionLabel}>WhatsApp</Text>
                            <Text style={styles.actionSub}>Send to a contact</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                        <Text style={styles.actionEmoji}>💾</Text>
                        <View>
                            <Text style={styles.actionLabel}>Save to device</Text>
                            <Text style={styles.actionSub}>Save to camera roll</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleMore}>
                        <Text style={styles.actionEmoji}>📤</Text>
                        <View>
                            <Text style={styles.actionLabel}>More…</Text>
                            <Text style={styles.actionSub}>System share sheet</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.cancelButton} onPress={close}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
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
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.slate900,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    sheetSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate500,
        textAlign: 'center',
        marginBottom: SPACING.l,
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
        borderColor: COLORS.primary,
        borderWidth: 1.5,
        backgroundColor: '#FFF5F5',
    },
    actionEmoji: {
        fontSize: 24,
    },
    actionLabel: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 15,
        color: COLORS.slate900,
    },
    actionSub: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate500,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: SPACING.m,
        marginTop: SPACING.xs,
    },
    cancelText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate500,
    },
});
