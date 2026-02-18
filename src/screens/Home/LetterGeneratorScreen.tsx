import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LetterGeneratorScreen({ navigation }: any) {
    const { partner1Name, partner2Name } = useUserStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const letterText = `Dearest Friends and Family,

We are over the moon to share our special day with you. As the days count down, our excitement grows, knowing that we will soon be celebrating our love surrounded by the people who mean the most to us.

Save the date, because we can't wait to dance the night away with you!

With love,
${partner1Name} & ${partner2Name}`;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>AI Love Letter</Text>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.gold} />
                        <Text style={styles.loadingText}>Writing from the heart...</Text>
                    </View>
                ) : (
                    <View style={styles.paper}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <Text style={styles.letterText}>{letterText}</Text>
                        </ScrollView>
                    </View>
                )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: SPACING.l,
        padding: SPACING.s,
    },
    backButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.text,
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 24,
        color: COLORS.text,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.m,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
    paper: {
        backgroundColor: '#FFFDF9',
        padding: SPACING.xl,
        borderRadius: SPACING.s,
        ...SHADOWS.medium,
        minHeight: 400,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    letterText: {
        fontFamily: FONTS.serif,
        fontSize: 18,
        lineHeight: 28,
        color: COLORS.text,
        fontStyle: 'italic',
    },
});
