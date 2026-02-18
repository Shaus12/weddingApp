import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function CountdownScreen(props: any) {
    const { partner1Name, partner2Name, weddingDate, baseImage, style } = useUserStore();

    const calculateDaysLeft = () => {
        if (!weddingDate) return 0;
        const today = new Date();
        const wedding = new Date(weddingDate);
        const diffTime = wedding.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={baseImage ? { uri: baseImage } : require('../../../assets/splash-icon.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.content}>
                        <View style={styles.header}>
                            <View style={{ position: 'absolute', right: 0, top: 0 }}>
                                <TouchableOpacity onPress={() => (props.navigation as any).navigate('Reminders')}>
                                    <Text style={{ fontSize: 24 }}>🔔</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.names}>
                                {partner1Name} & {partner2Name}
                            </Text>
                            <Text style={styles.styleBadge}>{style || 'Wedding'}</Text>
                        </View>

                        <View style={styles.countdownContainer}>
                            <Text style={styles.days}>{daysLeft}</Text>
                            <Text style={styles.label}>Days To Go</Text>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.galleryButton}
                                onPress={() => (props.navigation as any).navigate('SaveTheDate')}
                            >
                                <Text style={styles.galleryButtonText}>Create Save The Date</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.galleryButton, { marginTop: SPACING.m, backgroundColor: COLORS.gold }]}
                                onPress={() => (props.navigation as any).navigate('Paywall')}
                            >
                                <Text style={[styles.galleryButtonText, { color: COLORS.white }]}>Daily AI Art Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View >
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    names: {
        fontFamily: FONTS.serifBold,
        fontSize: 32,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: SPACING.s,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    styleBadge: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.xs,
        borderRadius: 20,
    },
    countdownContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    days: {
        fontFamily: FONTS.serifBold,
        fontSize: 100,
        color: COLORS.white,
        lineHeight: 120,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    label: {
        fontFamily: FONTS.sans,
        fontSize: 24,
        color: COLORS.white,
        letterSpacing: 4,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    footer: {
        width: '100%',
        marginBottom: SPACING.xl,
    },
    galleryButton: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    galleryButtonText: {
        fontFamily: FONTS.sansBold,
        fontSize: 16,
        color: COLORS.text,
    },
});
