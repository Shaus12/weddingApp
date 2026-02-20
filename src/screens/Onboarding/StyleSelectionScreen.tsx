import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const STYLES = [
    { id: 'Boho-Chic', label: 'Boho-Chic 🌿', description: 'Natural, earthy, and free-spirited.', isPremium: false },
    { id: 'Modern Minimal', label: 'Modern Minimal 🤍', description: 'Clean lines, simple, and elegant.', isPremium: false },
    { id: 'Classic Royal', label: 'Classic Royal 👑', description: 'Timeless, luxurious, and grand.', isPremium: false },
    { id: 'Vintage', label: 'Vintage 🕰️', description: 'Nostalgic, warm, and romantic.', isPremium: true },
    { id: 'Rustic Charm', label: 'Rustic Charm 🪵', description: 'Cozy, woodsy, and intimate.', isPremium: true },
    { id: 'Beach Paradise', label: 'Beach Paradise 🌊', description: 'Breezy, sunny, and relaxed.', isPremium: true },
    { id: 'Romantic Fairytale', label: 'Romantic Fairytale 🧚‍♀️', description: 'Magical, soft, and storybook.', isPremium: true },
    { id: 'Urban Industrial', label: 'Urban Industrial 🏙️', description: 'Edgy, modern, and chic.', isPremium: true },
];

export default function StyleSelectionScreen({ navigation }: any) {
    const { setStyle, style, isOnboardingCompleted } = useUserStore();
    const [selectedStyle, setSelectedStyle] = useState<string | null>(style);

    const handleNext = () => {
        if (selectedStyle) {
            setStyle(selectedStyle);
            if (isOnboardingCompleted) {
                // Return straight to home if they are just editing
                navigation.navigate('Countdown');
            } else {
                // Continue onboarding flow
                navigation.navigate('Questionnaire');
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
                <Text style={styles.title}>Choose Your Style ✨</Text>
                <Text style={styles.subtitle}>What defines your wedding vibe?</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {STYLES.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            selectedStyle === item.id && styles.cardSelected,
                            item.isPremium && styles.cardLocked
                        ]}
                        onPress={() => {
                            if (item.isPremium) {
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
                                item.isPremium && styles.cardTitleLocked
                            ]}>{item.label}</Text>
                            {item.isPremium && (
                                <Text style={styles.lockIcon}>🔒</Text>
                            )}
                        </View>
                        <Text style={[
                            styles.cardDesc,
                            selectedStyle === item.id && styles.cardDescSelected,
                            item.isPremium && styles.cardDescLocked
                        ]}>{item.description}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !selectedStyle && styles.buttonDisabled]}
                    onPress={handleNext}
                    disabled={!selectedStyle}
                >
                    <Text style={styles.buttonText}>{isOnboardingCompleted ? 'Save Style' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.background, handled by LinearGradient
    },
    header: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 28,
        color: COLORS.text,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
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
        borderColor: COLORS.accent || '#FF8C94',
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
        fontFamily: FONTS.serifBold,
        fontSize: 20,
        color: COLORS.text,
    },
    cardTitleSelected: {
        color: COLORS.text,
    },
    cardTitleLocked: {
        color: COLORS.textLight,
    },
    lockIcon: {
        fontSize: 16,
    },
    cardDesc: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.textLight,
    },
    cardDescSelected: {
        color: COLORS.text,
    },
    cardDescLocked: {
        color: '#A0A0A0',
    },
    footer: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.accent || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        shadowColor: COLORS.accent || '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: COLORS.textLight,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
});
