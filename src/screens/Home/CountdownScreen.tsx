import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Animated, PanResponder, DimensionValue, Platform, Easing } from 'react-native';
import ShareBottomSheet from '../../components/ShareBottomSheet';
import PremiumPromoPopup from '../../components/PremiumPromoPopup';
import LoadingOverlay from '../../components/LoadingOverlay';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

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
    const {
        partner1Name, partner2Name, weddingDate, baseImage, style,
        countdownPosition, dailySentenceEnabled,
        isTrialActive, isPremium, dailyImageUrl, lastDailyImageDate, setDailyImage,
        firstTimeHintShown, setFirstTimeHintShown,
        showPremiumPromoPopup, setShowPremiumPromoPopup,
        startFreeTrial, clearProAccess,
        homeTextColor,
    } = useUserStore();
    const textColor = homeTextColor || '#ffffff';

    const [overlayVisible, setOverlayVisible] = useState(true);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const overlayVisibleRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const numberOpacityAnim = useRef(new Animated.Value(1)).current;

    const hasAccess = isTrialActive || isPremium;
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDailyImage = async () => {
            if (!hasAccess) return;

            // Check if we already have today's image
            if (lastDailyImageDate === todayStr && dailyImageUrl) {
                return;
            }

            setIsGenerating(true);
            try {
                // In a real scenario, this points to your secure Supabase/Edge function
                const response = await fetch('https://cwnnjhcivkqnqgpmnitj.supabase.co/functions/v1/generate-daily-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        partner1: partner1Name,
                        partner2: partner2Name,
                        styleInfo: style,
                        baseImage: baseImage, // Send baseImage to Edge Function for Image-to-Image inference
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.imageUrl) {
                        setDailyImage(data.imageUrl, todayStr);
                    }
                } else {
                    console.warn("Edge function not configured or failed");
                }
            } catch (error) {
                console.warn("Failed to fetch daily AI image:", error);
            } finally {
                setIsGenerating(false);
            }
        };

        fetchDailyImage();
    }, [hasAccess, lastDailyImageDate, todayStr, setDailyImage, partner1Name, partner2Name, style, baseImage]);

    const startTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            hideOverlay();
        }, 3000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const showOverlay = () => {
        setOverlayVisible(true);
        overlayVisibleRef.current = true;

        // Show Tab Bar (Inverted logic: UI Visible by default)
        navigation.setOptions({
            tabBarStyle: {
                backgroundColor: COLORS.backgroundLight,
                borderTopWidth: 1,
                borderTopColor: COLORS.primary + '1A',
                paddingBottom: Platform.OS === 'ios' ? 34 : 10,
                paddingTop: 10,
                height: Platform.OS === 'ios' ? 88 : 64,
                ...SHADOWS.md,
            }
        });
        StatusBar.setHidden(false, 'fade');

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();

        // Handle first-time hint
        if (!firstTimeHintShown) {
            setShowHint(true);
            setFirstTimeHintShown(true);
        }
    };

    const hideOverlay = () => {
        overlayVisibleRef.current = false;
        setShowHint(false);
        // Hide Tab Bar immediately (Inverted logic: entrar em Poster Mode)
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });
        StatusBar.setHidden(true, 'fade');

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setOverlayVisible(false);
        });
    };

    const handleTap = () => {
        if (overlayVisibleRef.current) {
            hideOverlay();
        } else {
            showOverlay();
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const calculateDaysLeft = () => {
        if (!weddingDate) return 0;
        const today = new Date();
        const wedding = new Date(weddingDate);
        const diffTime = wedding.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft();

    useEffect(() => {
        pulseAnim.setValue(1);
        numberOpacityAnim.setValue(0.9);
        Animated.parallel([
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.03,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(numberOpacityAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [daysLeft]);

    const PRO_ONLY_STYLES = ['Boho-Chic', 'Classic Royal'];
    const effectiveStyle = (PRO_ONLY_STYLES.includes(style || '') && !hasAccess) ? 'Modern Minimal' : (style || 'Classic Royal');

    const getThemeStyles = () => {
        switch (effectiveStyle) {
            case 'Boho-Chic':
                return { nameFont: 'DancingScript_700Bold', numberFont: 'CormorantGaramond_700Bold', labelFont: 'Montserrat_400Regular', textShadow: false };
            case 'Modern Minimal':
            case 'Cinematic Premium':
                return { nameFont: 'Montserrat_400Regular', numberFont: 'Montserrat_700Bold', labelFont: 'Montserrat_400Regular', textShadow: false };
            case 'Modern Fun':
                return { nameFont: 'Montserrat_400Regular', numberFont: 'Montserrat_700Bold', labelFont: FONTS.sansSemiBold, textShadow: false };
            case 'Vintage':
                return { nameFont: 'CormorantGaramond_700Bold', numberFont: 'PlayfairDisplay_700Bold', labelFont: 'CormorantGaramond_400Regular', textShadow: true };
            case 'Classic Royal':
            default:
                return { nameFont: FONTS.displayBold, numberFont: FONTS.displayBold, labelFont: FONTS.sans, textShadow: true };
        }
    };

    const themeStyles = getThemeStyles();
    const isCinematic = effectiveStyle === 'Cinematic Premium';
    const isModernFun = effectiveStyle === 'Modern Fun';
    const modernFunEmoji = ['💍', '❤️', '✨'][daysLeft % 3];

    const gradientColors = useMemo(() => {
        const isDark = textColor === 'white';
        if (effectiveStyle === 'Boho-Chic') {
            return [
                isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
                'transparent',
                'transparent',
                isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
            ];
        }
        if (effectiveStyle === 'Cinematic Premium') {
            return [
                isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)',
                'transparent',
                'transparent',
                isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)',
            ];
        }
        if (effectiveStyle === 'Modern Minimal' || effectiveStyle === 'Modern Fun') {
            const c = isDark ? ['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.55)'] : ['rgba(255,255,255,0.25)', 'transparent', 'transparent', 'rgba(255,255,255,0.35)'];
            return c;
        }
        return [
            isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)',
            'transparent',
            'transparent',
            isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)',
        ];
    }, [textColor, effectiveStyle]);

    const progressFill = useMemo(() => {
        if (!isModernFun) return 0;
        const total = Math.max(365, daysLeft);
        return Math.max(0, 1 - daysLeft / total);
    }, [isModernFun, daysLeft]);

    const todayIndex = Math.floor(Date.now() / 86400000) % DAILY_SENTENCES.length;
    const todaySentence = DAILY_SENTENCES[todayIndex];
    const sentencePositionStyles = { bottom: '5%' as DimensionValue };

    // Determine what image to show
    let displayImage = require('../../../assets/splash-icon.png');
    if (hasAccess && dailyImageUrl) {
        displayImage = { uri: dailyImageUrl };
    } else if (baseImage) {
        displayImage = { uri: baseImage };
    }

    return (
        <>
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleTap}>
                <StatusBar barStyle="light-content" />
                <ImageBackground
                    source={displayImage}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                    blurRadius={!hasAccess ? 0 : 0} // Could blur if no access, but let's just use baseImage
                >
                    <LinearGradient
                        colors={gradientColors}
                        locations={[0, 0.3, 0.65, 1]}
                        style={styles.gradient}
                    >
                        {isCinematic && (
                            <View style={[StyleSheet.absoluteFill, styles.filmGrain]} pointerEvents="none" />
                        )}
                        <SafeAreaView style={styles.content} pointerEvents="box-none">
                            <View style={styles.header}>
                                <Text style={[styles.names, { fontFamily: themeStyles.nameFont, color: textColor }, !themeStyles.textShadow && styles.noTextShadow]}>
                                    {partner1Name} & {partner2Name}
                                </Text>
                            </View>

                            <View style={[styles.countdownWrapper, { bottom: `${countdownPosition}%` }]} pointerEvents="none">
                                <View style={styles.countdownContainer}>
                                    <View style={styles.numberRow}>
                                        <Animated.Text style={[
                                            styles.days,
                                            { fontFamily: themeStyles.numberFont, color: textColor },
                                            !themeStyles.textShadow && styles.noTextShadow,
                                            isCinematic && { textShadowColor: textColor, textShadowRadius: 22, textShadowOffset: { width: 0, height: 0 } },
                                            { transform: [{ scale: pulseAnim }], opacity: numberOpacityAnim },
                                        ]}>
                                            {daysLeft}
                                        </Animated.Text>
                                        {isModernFun && <Text style={[styles.stickerEmoji, { color: textColor }]}>{modernFunEmoji}</Text>}
                                    </View>
                                    <Text style={[styles.label, { fontFamily: themeStyles.labelFont, color: textColor }, !themeStyles.textShadow && styles.noTextShadow]}>
                                        Days To Go
                                    </Text>
                                    {isCinematic && (
                                        <Text style={[styles.microLine, { color: textColor }]}>One day closer 💍</Text>
                                    )}
                                    {isModernFun && (
                                        <View style={[styles.progressTrack, { borderColor: textColor }]}>
                                            <View style={[styles.progressFill, { backgroundColor: textColor, width: `${progressFill * 100}%` }]} />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Generating State */}
                            {isGenerating && (
                                <LoadingOverlay message="Generating today's preview..." />
                            )}

                            {/* Daily sentence: always in tree when enabled, opacity cross-fades with overlay */}
                            {dailySentenceEnabled && !isGenerating && (
                                <Animated.View
                                    style={[
                                        styles.sentenceWrapper,
                                        sentencePositionStyles,
                                        {
                                            opacity: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0],
                                            }),
                                        },
                                    ]}
                                    pointerEvents="none"
                                >
                                    <View style={styles.sentenceBacking}>
                                        <Text style={[styles.sentenceText, { fontFamily: themeStyles.labelFont, color: textColor }, !themeStyles.textShadow && styles.noTextShadow]}>
                                            "{todaySentence}"
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}
                        </SafeAreaView>
                    </LinearGradient>
                </ImageBackground>

                {/* Tap-to-Reveal Overlay — no shade; countdown stays as-is */}
                <Animated.View
                    pointerEvents={overlayVisible ? 'box-none' : 'none'}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent', opacity: fadeAnim }]}
                >
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }} pointerEvents="box-none">

                        {/* PRO badge — only when menu is open (hidden in full-screen poster view) */}
                        <TouchableOpacity
                            style={styles.proBadge}
                            onPress={() => navigation.navigate('Paywall')}
                            onLongPress={() => {
                                if (hasAccess) clearProAccess();
                                else startFreeTrial();
                            }}
                            activeOpacity={0.8}
                            delayLongPress={400}
                        >
                            <Text style={styles.proBadgeText}>{hasAccess ? 'PRO ✓' : 'PRO'}</Text>
                        </TouchableOpacity>

                        {/* Share Button relocated to corner when tapped */}
                        <TouchableOpacity style={styles.cornerShareButton} onPress={() => {
                            setShareSheetVisible(true);
                        }}>
                            <MaterialIcons name="ios-share" size={24} color={COLORS.white} />
                        </TouchableOpacity>

                        {/* First-time Hint */}
                        {showHint && (
                            <View style={styles.hintsContainer} pointerEvents="none">
                                <Text style={styles.hintText}>Tap to hide/show menu</Text>
                            </View>
                        )}

                        {/* Hint: tap for full-screen view (narrow, centered, clear of PRO badge) */}
                        {overlayVisible && (
                            <View style={styles.fullScreenHintWrap} pointerEvents="none">
                                <View style={styles.fullScreenHint}>
                                    <Text style={styles.fullScreenHintText}>Tap screen for clean full-screen view</Text>
                                </View>
                            </View>
                        )}

                    </SafeAreaView>
                </Animated.View>
            </TouchableOpacity>

            <ShareBottomSheet
                visible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                daysLeft={daysLeft}
                navigation={navigation}
            />
            <PremiumPromoPopup
                visible={showPremiumPromoPopup}
                onClose={() => setShowPremiumPromoPopup(false)}
                onStartTrial={() => navigation.navigate('Paywall')}
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
    filmGrain: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        opacity: 1,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
    },
    proBadge: {
        position: 'absolute',
        bottom: SPACING.l,
        left: SPACING.l,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    proBadgeText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 12,
        color: COLORS.white,
        letterSpacing: 0.8,
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
    numberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    stickerEmoji: {
        fontSize: 36,
        opacity: 0.9,
    },
    microLine: {
        fontSize: 13,
        letterSpacing: 1,
        marginTop: 6,
        opacity: 0.85,
    },
    progressTrack: {
        marginTop: 10,
        width: '48%',
        height: 3,
        borderRadius: 2,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressFill: {
        height: '100%',
        borderRadius: 1,
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
        maxWidth: '80%',
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
    },
    sentenceText: {
        fontSize: 17,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 26,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8,
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
    cornerShareButton: {
        position: 'absolute',
        top: SPACING.xl,
        right: SPACING.l,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        ...SHADOWS.md,
    },
    shareText: {
        color: COLORS.white,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        letterSpacing: 1,
    },
    premiumText: {
        color: COLORS.white,
        fontFamily: FONTS.sansSemiBold,
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
    fullScreenHintWrap: {
        position: 'absolute',
        bottom: SPACING.l,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenHint: {
        paddingVertical: 6,
        paddingHorizontal: SPACING.m,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 14,
    },
    fullScreenHintText: {
        fontFamily: FONTS.sans,
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 0.2,
    },
});
