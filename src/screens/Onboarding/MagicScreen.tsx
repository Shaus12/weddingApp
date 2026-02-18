import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MagicScreen({ navigation }: any) {
    const { completeOnboarding } = useUserStore();

    useEffect(() => {
        // Simulate AI generation time
        const timer = setTimeout(() => {
            completeOnboarding();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Countdown' }],
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Creating Your Magic...</Text>
                <Text style={styles.subtitle}>We are weaving your story into art.</Text>
                <ActivityIndicator size="large" color={COLORS.gold} style={styles.loader} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginBottom: SPACING.xxl,
        textAlign: 'center',
    },
    loader: {
        marginTop: SPACING.xl,
        transform: [{ scale: 1.5 }],
    },
});
