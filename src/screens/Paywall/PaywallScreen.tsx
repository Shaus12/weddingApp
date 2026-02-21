import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../store/useUserStore';

export default function PaywallScreen({ navigation }: any) {
    const { startFreeTrial } = useUserStore();

    const handlePurchase = (plan: string) => {
        startFreeTrial();
        Alert.alert('Success!', `Welcome! Your 3 Days Free Trial has started.`, [
            { text: 'Start Creating', onPress: () => navigation.navigate('MainTabs') }
        ]);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.backgroundLight, '#FDFBF7']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Unlock Eternal Glow Premium</Text>
                        <Text style={styles.subtitle}>Enhance your wedding journey with daily AI art.</Text>
                    </View>

                    <View style={styles.features}>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureIcon}>✨</Text>
                            <Text style={styles.featureText}>Daily AI Art Generation</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureIcon}>💌</Text>
                            <Text style={styles.featureText}>Custom Save the Dates</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Text style={styles.featureIcon}>🔔</Text>
                            <Text style={styles.featureText}>Smart Wedding Reminders</Text>
                        </View>
                    </View>

                    <View style={styles.plans}>
                        <TouchableOpacity style={styles.planCard} onPress={() => handlePurchase('Monthly')}>
                            <Text style={styles.planTitle}>Monthly</Text>
                            <Text style={styles.planPrice}>$9.99 / mo</Text>
                            <Text style={styles.planTrial}>3 Days Free Trial</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.planCard, styles.planBestValue]} onPress={() => handlePurchase('Yearly')}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>BEST VALUE</Text>
                            </View>
                            <Text style={styles.planTitle}>Yearly</Text>
                            <Text style={styles.planPrice}>$59.99 / yr</Text>
                            <Text style={styles.planTrial}>3 Days Free Trial</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeButtonText}>Maybe Later</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 28,
        color: COLORS.slate900,
        textAlign: 'center',
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate500,
        textAlign: 'center',
    },
    features: {
        marginVertical: SPACING.xl,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: SPACING.m,
    },
    featureText: {
        fontFamily: FONTS.sans,
        fontSize: 18,
        color: COLORS.slate900,
    },
    plans: {
        width: '100%',
        gap: SPACING.m,
    },
    planCard: {
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderRadius: SPACING.m,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    planBestValue: {
        borderColor: '#D4AF37',
        backgroundColor: '#FFFDF5',
        borderWidth: 2,
    },
    planTitle: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 18,
        color: COLORS.slate900,
        marginBottom: SPACING.xs,
    },
    planPrice: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.slate900,
        marginBottom: SPACING.xs,
    },
    planTrial: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        color: '#D4AF37',
    },
    badge: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#D4AF37',
        paddingHorizontal: SPACING.m,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: FONTS.sansSemiBold,
    },
    closeButton: {
        alignItems: 'center',
        padding: SPACING.m,
        marginTop: SPACING.s,
        marginBottom: SPACING.s,
    },
    closeButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate500,
        textDecorationLine: 'underline',
    },
});
