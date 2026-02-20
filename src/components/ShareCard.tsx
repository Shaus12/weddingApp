import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS } from '../constants/theme';

interface ShareCardProps {
    partner1Name: string;
    partner2Name: string;
    daysLeft: number;
    weddingDate: string | null;
    baseImage: string | null;
    isPremium: boolean;
    countdownPosition: number; // 0-100, percentage from bottom (same as home screen)
}

/**
 * ShareCard – a 1080x1920 (9:16) off-screen view captured via react-native-view-shot.
 * Render it with opacity 0 / absolute position so it's never visible to the user.
 */
const ShareCard = forwardRef<View, ShareCardProps>((props, ref) => {
    const { partner1Name, partner2Name, daysLeft, weddingDate, baseImage, isPremium, countdownPosition } = props;

    const formattedDate = weddingDate
        ? new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    // Convert the countdownPosition (% from bottom) to pixels on the 1920px tall card
    const countdownBottomPx = (countdownPosition / 100) * 1920;

    return (
        <View ref={ref} style={styles.card} collapsable={false}>
            <ImageBackground
                source={baseImage ? { uri: baseImage } : require('../../assets/splash-icon.png')}
                style={styles.image}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.75)']}
                    locations={[0, 0.3, 0.6, 1]}
                    style={styles.gradient}
                >
                    {/* Top — Couple Names */}
                    <View style={styles.topSection}>
                        <Text style={styles.names}>{partner1Name} & {partner2Name}</Text>
                    </View>

                    {/* Countdown — positioned to match the user's chosen layout */}
                    <View style={[styles.countdownSection, { bottom: countdownBottomPx }]}>
                        <Text style={styles.daysNumber}>{daysLeft}</Text>
                        <Text style={styles.daysLabel}>DAYS TO GO</Text>
                        {formattedDate && (
                            <Text style={styles.dateText}>{formattedDate}</Text>
                        )}
                    </View>

                    {/* Bottom — Watermark (free only) */}
                    <View style={styles.bottomSection}>
                        {!isPremium && (
                            <View style={styles.watermarkContainer}>
                                <Text style={styles.watermarkText}>Made with Eternal Glow 💍</Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;

const styles = StyleSheet.create({
    card: {
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        position: 'relative',
    },
    topSection: {
        paddingTop: 120,
        alignItems: 'center',
        paddingHorizontal: 60,
    },
    names: {
        fontFamily: FONTS.serifBold,
        fontSize: 80,
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        letterSpacing: 3,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 12,
    },
    countdownSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    daysNumber: {
        fontFamily: FONTS.serifBold,
        fontSize: 320,
        color: '#FFFFFF',
        lineHeight: 340,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 6 },
        textShadowRadius: 20,
    },
    daysLabel: {
        fontFamily: FONTS.sansBold,
        fontSize: 72,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 16,
        marginTop: 0,
    },
    dateText: {
        fontFamily: FONTS.sans,
        fontSize: 42,
        color: 'rgba(255,255,255,0.65)',
        marginTop: 40,
        letterSpacing: 2,
    },
    bottomSection: {
        paddingBottom: 80,
        alignItems: 'center',
    },
    watermarkContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    watermarkText: {
        fontFamily: FONTS.sans,
        fontSize: 32,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1,
    },
});
