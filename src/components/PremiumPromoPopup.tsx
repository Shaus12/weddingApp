import React, { useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    PanResponder,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { setPremiumPopupShown } from '../services/launchCountService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PremiumPromoPopupProps {
    visible: boolean;
    onClose: () => void;
    onStartTrial: () => void;
}

export default function PremiumPromoPopup({ visible, onClose, onStartTrial }: PremiumPromoPopupProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    const close = useCallback(() => {
        setPremiumPopupShown();
        onClose();
    }, [onClose]);

    const handleNotNow = () => {
        close();
    };

    const handleStartTrial = () => {
        setPremiumPopupShown();
        onClose();
        onStartTrial();
    };

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
        <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
            <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={close} activeOpacity={1} />
            </Animated.View>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]} {...panResponder.panHandlers}>
                <View style={styles.handle} />
                <Text style={styles.title}>Unlock Premium</Text>
                <Text style={styles.subtitle}>Create Save-the-Date videos + remove watermark</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleStartTrial}>
                        <Text style={styles.primaryButtonText}>Start free trial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleNotNow}>
                        <Text style={styles.secondaryButtonText}>Not now</Text>
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
