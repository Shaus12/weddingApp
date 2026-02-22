import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Animated, PanResponder, DimensionValue, Alert, Platform } from 'react-native';
import ShareBottomSheet from '../../components/ShareBottomSheet';
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
        hasRecreatedToday, lastRecreatedDate, setHasRecreatedToday,
        firstTimeHintShown, setFirstTimeHintShown
    } = useUserStore();

    const [overlayVisible, setOverlayVisible] = useState(true);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const overlayVisibleRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const hasAccess = isTrialActive || isPremium;
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.03, duration: 300, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

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

    const handleRecreateImage = async () => {
        if (!hasAccess) return;
        if (hasRecreatedToday && lastRecreatedDate === todayStr) {
            Alert.alert("Limit Reached", "You can only recreate the daily image once per day!");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('https://cwnnjhcivkqnqgpmnitj.supabase.co/functions/v1/generate-daily-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partner1: partner1Name,
                    partner2: partner2Name,
                    styleInfo: style,
                    baseImage: baseImage,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.imageUrl) {
                    setDailyImage(data.imageUrl, todayStr);
                    setHasRecreatedToday(true, todayStr);
                    Alert.alert("Success", "Your image has been recreated!");
                }
            } else {
                Alert.alert("Error", "Could not recreate image at this time.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not recreate image at this time.");
        } finally {
            setIsGenerating(false);
        }
    };

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

    const getThemeStyles = () => {
        switch (style) {
            case 'Boho-Chic':
                return { nameFont: 'DancingScript_700Bold', numberFont: 'CormorantGaramond_700Bold', labelFont: 'Montserrat_400Regular', textShadow: false };
            case 'Modern Minimal':
                return { nameFont: 'Montserrat_400Regular', numberFont: 'Montserrat_700Bold', labelFont: 'Montserrat_400Regular', textShadow: false };
            case 'Vintage':
                return { nameFont: 'CormorantGaramond_700Bold', numberFont: 'PlayfairDisplay_700Bold', labelFont: 'CormorantGaramond_400Regular', textShadow: true };
            case 'Classic Royal':
            default:
                return { nameFont: FONTS.displayBold, numberFont: FONTS.displayBold, labelFont: FONTS.sans, textShadow: true };
        }
    };

    const themeStyles = getThemeStyles();
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
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.55)']}
                        locations={[0, 0.3, 0.65, 1]}
                        style={styles.gradient}
                    >
                        <SafeAreaView style={styles.content} pointerEvents="box-none">
                            <View style={styles.header}>
                                <Text style={[styles.names, { fontFamily: themeStyles.nameFont }, !themeStyles.textShadow && styles.noTextShadow]}>
                                    {partner1Name} & {partner2Name}
                                </Text>
                            </View>

                            <View style={[styles.countdownWrapper, { bottom: `${countdownPosition}%` }]} pointerEvents="none">
                                <View style={styles.countdownContainer}>
                                    <Animated.Text style={[styles.days, { fontFamily: themeStyles.numberFont }, !themeStyles.textShadow && styles.noTextShadow, { transform: [{ scale: pulseAnim }] }]}>
                                        {daysLeft}
                                    </Animated.Text>
                                    <Text style={[styles.label, { fontFamily: themeStyles.labelFont }, !themeStyles.textShadow && styles.noTextShadow]}>
                                        Days To Go
                                    </Text>
                                </View>
                            </View>

                            {/* Generating State */}
                            {isGenerating && (
                                <LoadingOverlay message="Generating today's preview..." />
                            )}

                            {dailySentenceEnabled && !overlayVisible && !isGenerating && (
                                <View style={[styles.sentenceWrapper, sentencePositionStyles]} pointerEvents="none">
                                    <View style={styles.sentenceBacking}>
                                        <Text style={[styles.sentenceText, { fontFamily: themeStyles.labelFont }, !themeStyles.textShadow && styles.noTextShadow]}>
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
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', opacity: fadeAnim }]}
                >
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }} pointerEvents="box-none">

                        {/* Premium Call to Action */}
                        {!hasAccess && (
                            <View style={styles.topButtonGroup}>
                                <TouchableOpacity style={styles.largePremiumButton} onPress={() => navigation.navigate('Paywall')}>
                                    <Text style={styles.largePremiumText}>✨ START FREE TRIAL FOR DAILY AI IMAGES</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Recreate Button - Only shown if they have access and haven't recreated today */}
                        {hasAccess && (!hasRecreatedToday || lastRecreatedDate !== todayStr) && (
                            <TouchableOpacity style={styles.recreateButton} onPress={handleRecreateImage}>
                                <Text style={styles.recreateText}>🔄 Recreate Today's Image</Text>
                            </TouchableOpacity>
                        )}

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

                    </SafeAreaView>
                </Animated.View>
            </TouchableOpacity>

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
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        letterSpacing: 2,
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
    recreateButton: {
        position: 'absolute',
        bottom: 120, // Sit above the share button
        alignSelf: 'center',
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    recreateText: {
        color: COLORS.white,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        letterSpacing: 1,
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
});
