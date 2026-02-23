import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const STYLES = [
    { id: 'Modern Minimal', label: 'Modern Minimal 🤍', description: 'Clean lines, simple, and elegant.', isPremium: false },
    { id: 'Cinematic Premium', label: 'Cinematic / Premium 🎬', description: 'Film grain, vignette, soft glow.', isPremium: false },
    { id: 'Modern Fun', label: 'Modern / Fun ✨', description: 'Playful accent, progress ring, bolder feel.', isPremium: false },
    { id: 'Boho-Chic', label: 'Boho-Chic 🌿', description: 'Natural, earthy, and free-spirited.', isPremium: true },
    { id: 'Classic Royal', label: 'Classic Royal 👑', description: 'Timeless, luxurious, and grand.', isPremium: true },
    { id: 'Vintage', label: 'Vintage 🕰️', description: 'Nostalgic, warm, and romantic.', isPremium: true },
    { id: 'Rustic Charm', label: 'Rustic Charm 🪵', description: 'Cozy, woodsy, and intimate.', isPremium: true },
    { id: 'Beach Paradise', label: 'Beach Paradise 🌊', description: 'Breezy, sunny, and relaxed.', isPremium: true },
    { id: 'Romantic Fairytale', label: 'Romantic Fairytale 🧚‍♀️', description: 'Magical, soft, and storybook.', isPremium: true },
    { id: 'Urban Industrial', label: 'Urban Industrial 🏙️', description: 'Edgy, modern, and chic.', isPremium: true },
];

export default function StyleSelectionScreen({ navigation, route }: any) {
    const { setStyle, style, setSaveTheDatePosterStyle, saveTheDatePosterStyle, isOnboardingCompleted, isPremium, isTrialActive } = useUserStore();
    const hasAccess = isPremium || isTrialActive;
    const forSaveTheDate = route.params?.forSaveTheDate === true;
    const initialStyle = forSaveTheDate ? (saveTheDatePosterStyle ?? style) : style;
    const [selectedStyle, setSelectedStyle] = useState<string | null>(initialStyle);

    const handleNext = () => {
        if (selectedStyle) {
            if (forSaveTheDate) {
                setSaveTheDatePosterStyle(selectedStyle);
                navigation.goBack();
            } else {
                setStyle(selectedStyle);
                if (isOnboardingCompleted) {
                    navigation.navigate('MainTabs');
                } else {
                    navigation.navigate('Questionnaire');
                }
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{forSaveTheDate ? 'Poster style' : 'Choose Your Style ✨'}</Text>
                    <Text style={styles.subtitle}>
                        {forSaveTheDate ? 'Style for your Save The Date poster only.' : 'What defines your wedding vibe?'}
                    </Text>
                </View>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {STYLES.map((item) => {
                    const isLocked = item.isPremium && !hasAccess;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.card,
                                selectedStyle === item.id && styles.cardSelected,
                                isLocked && styles.cardLocked
                            ]}
                            onPress={() => {
                                if (isLocked) {
                                    navigation.navigate('Paywall');
                                } else {
                                    setSelectedStyle(item.id);
                                }
                            }}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={[
                                    styles.cardTitle,
                                    selectedStyle === item.id && styles.cardTitleSelected,
                                    isLocked && styles.cardTitleLocked
                                ]}>{item.label}</Text>
                                {isLocked && (
                                    <View style={styles.lockBadge}>
                                        <Text style={styles.lockIcon}>🔒</Text>
                                        <Text style={styles.proLabel}>PRO</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.cardDesc,
                                selectedStyle === item.id && styles.cardDescSelected,
                                isLocked && styles.cardDescLocked
                            ]}>{item.description}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !selectedStyle && styles.buttonDisabled]}
                    onPress={handleNext}
                    disabled={!selectedStyle}
                >
                    <Text style={styles.buttonText}>
                        {forSaveTheDate ? 'Save' : isOnboardingCompleted ? 'Save Style' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.backgroundLight, handled by LinearGradient
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.s,
        paddingBottom: SPACING.m,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 28,
        color: COLORS.slate900,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate500,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 20,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardSelected: {
        borderColor: COLORS.primary || '#FF8C94',
        backgroundColor: '#FFFFFF',
    },
    cardLocked: {
        backgroundColor: 'rgba(230, 230, 230, 0.7)',
        borderColor: 'transparent',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    cardTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.slate900,
    },
    cardTitleSelected: {
        color: COLORS.slate900,
    },
    cardTitleLocked: {
        color: COLORS.slate500,
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lockIcon: {
        fontSize: 14,
    },
    proLabel: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 11,
        color: COLORS.slate500,
        letterSpacing: 0.5,
    },
    cardDesc: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate500,
    },
    cardDescSelected: {
        color: COLORS.slate900,
    },
    cardDescLocked: {
        color: '#A0A0A0',
    },
    footer: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.primary || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        shadowColor: COLORS.primary || '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: COLORS.slate500,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
    },
});
