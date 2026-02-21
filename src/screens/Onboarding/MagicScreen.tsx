import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Creating Your Magic... ✨</Text>
                <Text style={styles.subtitle}>We are weaving your story into art.</Text>
                <View style={styles.loaderContainer}>
                    <Text style={styles.magicIcon}>💖</Text>
                    <ActivityIndicator size="large" color={COLORS.primary || '#FF8C94'} style={styles.loader} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.backgroundLight, handled by LinearGradient
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginBottom: SPACING.xxl,
        textAlign: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xl,
    },
    magicIcon: {
        fontSize: 60,
        marginBottom: SPACING.l,
    },
    loader: {
        transform: [{ scale: 1.5 }],
    },
});
