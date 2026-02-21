import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Animated, PanResponder, DimensionValue } from 'react-native';
import ShareBottomSheet from '../../components/ShareBottomSheet';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const DAILY_SENTENCES = [
    "Every love story is beautiful, but ours is my favorite.",
    "I have found the one whom my soul loves.",
    "You are my today and all of my tomorrows.",
    "Together is a wonderful place to be.",
    "I look at you and see the rest of my life in front of my eyes.",
    "A hundred hearts would be too few to carry all my love for you.",
    "You are the best thing that's ever been mine.",
    "In a sea of people, my eyes will always search for you.",
    "To love and be loved is to feel the sun from both sides.",
    "My favorite place in all the world is next to you."
];

export default function CountdownScreen({ navigation }: any) {
    const { partner1Name, partner2Name, weddingDate, baseImage, style, countdownPosition, dailySentenceEnabled } = useUserStore();

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const overlayVisibleRef = useRef(false); // Ref to avoid stale closure in PanResponder
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // One-shot pulse on mount
    useEffect(() => {
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.03, duration: 300, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    const showOverlay = () => {
        setOverlayVisible(true);
        overlayVisibleRef.current = true;
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const hideOverlay = () => {
        overlayVisibleRef.current = false;
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setOverlayVisible(false));
    };

    const handleTap = () => {
        if (overlayVisibleRef.current) {
            hideOverlay();
        } else {
            showOverlay();
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            // Only set responder for moves if it's distinctly horizontal
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 10;
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx, dy, vx } = gestureState;
                if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                    handleTap();
                } else if (dx > 40 && vx > 0.3) {
                    // Swipe Right -> Options
                    navigation.navigate('Options');
                } else if (dx < -40 && vx < -0.3) {
                    // Swipe Left -> Daily Tips
                    navigation.navigate('DailyTips');
                }
            }
        })
    ).current;

    const calculateDaysLeft = () => {
        if (!weddingDate) return 0;
        const today = new Date();
        const wedding = new Date(weddingDate);
        const diffTime = wedding.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft();


    // Map themes to Specific styles
    const getThemeStyles = () => {
        switch (style) {
            case 'Boho-Chic':
                return {
                    nameFont: 'DancingScript_700Bold',
                    numberFont: 'CormorantGaramond_700Bold',
                    labelFont: 'Montserrat_400Regular',
                    textShadow: false,
                };
            case 'Modern Minimal':
                return {
                    nameFont: 'Montserrat_400Regular',
                    numberFont: 'Montserrat_700Bold',
                    labelFont: 'Montserrat_400Regular',
                    textShadow: false,
                };
            case 'Vintage':
                return {
                    nameFont: 'CormorantGaramond_700Bold',
                    numberFont: 'PlayfairDisplay_700Bold',
                    labelFont: 'CormorantGaramond_400Regular',
                    textShadow: true,
                };
            case 'Classic Royal':
            default:
                return {
                    nameFont: FONTS.serifBold,
                    numberFont: FONTS.serifBold,
                    labelFont: FONTS.sans,
                    textShadow: true,
                };
        }
    };

    const themeStyles = getThemeStyles();

    // Calculate a daily index that changes every 24 hours
    const todayIndex = Math.floor(Date.now() / 86400000) % DAILY_SENTENCES.length;
    const todaySentence = DAILY_SENTENCES[todayIndex];

    // Fix daily sentence to the bottom as requested
    const sentencePositionStyles = { bottom: '5%' as DimensionValue };

    return (
        <>
            <View style={styles.container} {...panResponder.panHandlers}>
                <StatusBar barStyle="light-content" />
                <ImageBackground
                    source={baseImage ? { uri: baseImage } : require('../../../assets/splash-icon.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.55)']}
                        locations={[0, 0.3, 0.65, 1]}
                        style={styles.gradient}
                    >
                        <SafeAreaView style={styles.content}>
                            <View style={styles.header}>
                                <Text style={[
                                    styles.names,
                                    { fontFamily: themeStyles.nameFont },
                                    !themeStyles.textShadow && styles.noTextShadow
                                ]}>
                                    {partner1Name} & {partner2Name}
                                </Text>
                            </View>

                            {/* Position countdown using absolute positioning based on selected percentage */}
                            <View style={[styles.countdownWrapper, { bottom: `${countdownPosition}%` }]}>
                                <View style={styles.countdownContainer}>
                                    <Animated.Text style={[
                                        styles.days,
                                        { fontFamily: themeStyles.numberFont },
                                        !themeStyles.textShadow && styles.noTextShadow,
                                        { transform: [{ scale: pulseAnim }] }
                                    ]}>{daysLeft}</Animated.Text>
                                    <Text style={[
                                        styles.label,
                                        { fontFamily: themeStyles.labelFont },
                                        !themeStyles.textShadow && styles.noTextShadow
                                    ]}>Days To Go</Text>
                                </View>
                            </View>

                            {/* Daily Sentence - hidden when overlay is active */}
                            {dailySentenceEnabled && !overlayVisible && (
                                <View style={[styles.sentenceWrapper, sentencePositionStyles]}>
                                    <View style={styles.sentenceBacking}>
                                        <Text style={[
                                            styles.sentenceText,
                                            { fontFamily: themeStyles.labelFont },
                                            !themeStyles.textShadow && styles.noTextShadow
                                        ]}>
                                            "{todaySentence}"
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </SafeAreaView>
                    </LinearGradient>
                </ImageBackground>

                {/* Tap-to-Reveal Overlay */}
                <Animated.View
                    pointerEvents={overlayVisible ? 'box-none' : 'none'}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', opacity: fadeAnim }]}
                >
                    <SafeAreaView style={{ flex: 1 }} pointerEvents="box-none">
                        {/* Options (Left Edge, vertically centered) */}
                        <TouchableOpacity
                            style={[styles.edgeButton, { left: 0 }]}
                            onPress={() => navigation.navigate('Options')}
                        >
                            <Text style={styles.edgeIcon}>◀</Text>
                            <Text style={styles.edgeText}>Options</Text>
                        </TouchableOpacity>

                        {/* Daily Tips (Right Edge, vertically centered) */}
                        <TouchableOpacity
                            style={[styles.edgeButton, { right: 0 }]}
                            onPress={() => navigation.navigate('DailyTips')}
                        >
                            <Text style={styles.edgeIcon}>▶</Text>
                            <Text style={styles.edgeText}>Daily Tips</Text>
                        </TouchableOpacity>

                        {/* Top Group (Premium) */}
                        <View style={styles.topButtonGroup}>
                            <TouchableOpacity
                                style={styles.largePremiumButton}
                                onPress={() => navigation.navigate('Paywall')}
                            >
                                <Text style={styles.largePremiumText}>✨ UNLOCK PREMIUM EXPERIENCE</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Group (Share) */}
                        <TouchableOpacity
                            style={styles.bottomShareButton}
                            onPress={() => setShareSheetVisible(true)}
                        >
                            <Text style={styles.shareText}>📤 Share Countdown</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Animated.View>
            </View>
            <ShareBottomSheet
                visible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                daysLeft={daysLeft}
                navigation={navigation}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    names: {
        fontSize: 32,
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        marginBottom: SPACING.s,
        letterSpacing: 1.5,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    noTextShadow: {
        textShadowColor: 'transparent',
    },
    countdownWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    countdownContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    days: {
        fontSize: 100,
        color: COLORS.white,
        lineHeight: 120,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    label: {
        fontSize: 24,
        color: COLORS.white,
        letterSpacing: 4,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    sentenceWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    sentenceBacking: {
        maxWidth: '70%',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.18)',
        alignItems: 'center',
    },
    sentenceText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.97)',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 22,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    edgeButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -30 }], // Half of approximate height
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        justifyContent: 'center',
    },
    edgeIcon: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    edgeText: {
        color: 'rgba(255,255,255,0.9)',
        fontFamily: FONTS.sans,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    topButtonGroup: {
        position: 'absolute',
        top: 185,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    largePremiumButton: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 40,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    largePremiumText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 14,
        letterSpacing: 2,
    },
    bottomShareButton: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xxl,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    shareText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
        letterSpacing: 1,
    },
    premiumText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
    hintsContainer: {
        position: 'absolute',
        top: '40%',
        width: '100%',
        alignItems: 'center',
    },
    hintText: {
        color: COLORS.white,
        fontFamily: FONTS.sans,
        fontSize: 18,
        marginBottom: SPACING.s,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});
