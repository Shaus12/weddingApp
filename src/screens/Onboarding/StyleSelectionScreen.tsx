import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const STYLES = [
    { id: 'Boho-Chic', label: 'Boho-Chic', description: 'Natural, earthy, and free-spirited.' },
    { id: 'Modern Minimal', label: 'Modern Minimal', description: 'Clean lines, simple, and elegant.' },
    { id: 'Classic Royal', label: 'Classic Royal', description: 'Timeless, luxurious, and grand.' },
    { id: 'Vintage', label: 'Vintage', description: 'Nostalgic, warm, and romantic.' },
];

export default function StyleSelectionScreen({ navigation }: any) {
    const { setStyle, style } = useUserStore();
    const [selectedStyle, setSelectedStyle] = useState<string | null>(style);

    const handleNext = () => {
        if (selectedStyle) {
            setStyle(selectedStyle);
            navigation.navigate('Questionnaire');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Choose Your Style</Text>
                <Text style={styles.subtitle}>What defines your wedding vibe?</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {STYLES.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            selectedStyle === item.id && styles.cardSelected
                        ]}
                        onPress={() => setSelectedStyle(item.id)}
                    >
                        <Text style={[
                            styles.cardTitle,
                            selectedStyle === item.id && styles.cardTitleSelected
                        ]}>{item.label}</Text>
                        <Text style={[
                            styles.cardDesc,
                            selectedStyle === item.id && styles.cardDescSelected
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
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.white,
        borderRadius: SPACING.s,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: 'transparent',
        ...SHADOWS.small,
    },
    cardSelected: {
        borderColor: COLORS.gold,
        backgroundColor: '#FFFDF5', // Very light gold/beige tint
    },
    cardTitle: {
        fontFamily: FONTS.serifBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    cardTitleSelected: {
        color: COLORS.text,
    },
    cardDesc: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.textLight,
    },
    cardDescSelected: {
        color: COLORS.text,
    },
    footer: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.text,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        width: '100%',
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
