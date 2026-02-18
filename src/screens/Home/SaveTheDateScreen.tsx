import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, Share } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SaveTheDateScreen({ navigation }: any) {
    const { partner1Name, partner2Name, weddingDate, baseImage } = useUserStore();

    const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) : '';

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Save the Date! ${partner1Name} & ${partner2Name} are getting married on ${formattedDate}.`,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={baseImage ? { uri: baseImage } : require('../../../assets/splash-icon.png')}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.content}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Save the Date</Text>
                            <Text style={styles.names}>{partner1Name} & {partner2Name}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.date}>{formattedDate}</Text>
                            <Text style={styles.location}>Tel Aviv, Israel</Text>
                            {/* Location is hardcoded for now or could be added to Questionnaire */}
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.button} onPress={handleShare}>
                                <Text style={styles.buttonText}>Share Invitation</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.secondaryButtonText}>Back to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
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
        justifyContent: 'center',
        padding: SPACING.l,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: SPACING.xl,
        borderRadius: SPACING.m,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
        ...SHADOWS.medium,
    },
    title: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 4,
        color: COLORS.textLight,
        marginBottom: SPACING.m,
    },
    names: {
        fontFamily: FONTS.serifBold,
        fontSize: 32,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.m,
    },
    divider: {
        height: 1,
        width: 60,
        backgroundColor: COLORS.gold,
        marginBottom: SPACING.m,
    },
    date: {
        fontFamily: FONTS.serif,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    location: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
    actions: {
        width: '100%',
        marginTop: SPACING.xl,
        gap: SPACING.m,
    },
    button: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        width: '100%',
        ...SHADOWS.small,
    },
    buttonText: {
        color: COLORS.text,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
    secondaryButton: {
        padding: SPACING.m,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.white,
        fontFamily: FONTS.sans,
        fontSize: 16,
    },
});
