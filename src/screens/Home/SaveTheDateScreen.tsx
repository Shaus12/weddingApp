import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function SaveTheDateScreen({ navigation }: any) {
    const { partner1Name, partner2Name, weddingDate, baseImage } = useUserStore();

    const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) : 'August 24, 2024';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview Your Card</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="more-horiz" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.cardContainer}>
                    <ImageBackground
                        source={baseImage ? { uri: baseImage } : { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAvyXt4D_sz6KOLpeyEs_eHXiUUM3LbuElsB0JV5XwG0nDEUEvKcL1Um4UJzni9zzF096q5ZY1rMVVX6MSpdmc9JX0E8twJum83ms1DxlnUNmJ6JNFiUVhQxCZ7W4GrVCwH7tAg0lsE3hYoqYAXPP_cxuGUztcoYkcG5LP50FiXtUh3MBgkx3S_YZZ-8AzAD7WWvYAfmrn5TtJ-iZoz95H9pvHpzYuT_J7w9EleUtuV85a2jdz_Mpjw_Ff0MyFT4lxA_hehqzocjs" }}
                        style={styles.cardInternal}
                        imageStyle={styles.cardImageStyle}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardTop}>
                                <Text style={styles.cardPreTitle}>SAVE THE DATE</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.cardMiddle}>
                                <Text style={styles.namesTitle}>{partner1Name || "Julian"} & {partner2Name || "Sophie"}</Text>
                                <Text style={styles.italicSub}>Are getting married</Text>
                            </View>

                            <View style={styles.cardBottom}>
                                <Text style={styles.dateText}>{formattedDate}</Text>
                                <Text style={styles.locationText}>NEW YORK CITY, NY</Text>
                                <Text style={styles.formalText}>FORMAL INVITATION TO FOLLOW</Text>
                            </View>

                            <TouchableOpacity style={styles.zoomButton}>
                                <MaterialIcons name="zoom-out-map" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                <View style={styles.metadataContainer}>
                    <Text style={styles.metadataDesign}>DESIGN: MODERN ROMANCE</Text>
                    <Text style={styles.metadataInfo}>This preview reflects how your guests will see the invitation.</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                    <MaterialIcons name="ios-share" size={20} color={COLORS.white} />
                    <Text style={styles.primaryButtonText}>Share with Guests</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={styles.secondaryButtonLight}
                        onPress={() => navigation.navigate('StyleSelection')}
                    >
                        <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                        <Text style={styles.secondaryButtonLightText}>Edit Design</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButtonDark}
                        onPress={() => Alert.alert("Coming Soon", "RSVP tracking will be enabled closer to your date!")}
                    >
                        <MaterialIcons name="settings" size={20} color={COLORS.slate700} />
                        <Text style={styles.secondaryButtonDarkText}>RSVP Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: 'rgba(248, 246, 246, 0.8)',
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.slate900,
        letterSpacing: -0.5,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 400,
        aspectRatio: 4 / 5,
        borderRadius: 24,
        ...SHADOWS['2xl'],
    },
    cardInternal: {
        flex: 1,
        width: '100%',
        borderRadius: 24,
    },
    cardImageStyle: {
        borderRadius: 24,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 24,
        padding: SPACING.xl,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTop: {
        alignItems: 'center',
        marginTop: SPACING.s,
    },
    cardPreTitle: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 12,
        color: COLORS.white,
        letterSpacing: 3,
        opacity: 0.9,
    },
    divider: {
        height: 1,
        width: 32,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginTop: SPACING.s,
    },
    cardMiddle: {
        alignItems: 'center',
        gap: SPACING.s,
    },
    namesTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 40,
        color: COLORS.white,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    italicSub: {
        fontFamily: FONTS.display,
        fontStyle: 'italic',
        fontSize: 18,
        color: COLORS.white,
        opacity: 0.95,
    },
    cardBottom: {
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    dateText: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.white,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    locationText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.8,
        letterSpacing: 2,
        marginTop: SPACING.xs,
    },
    formalText: {
        fontFamily: FONTS.sans,
        fontStyle: 'italic',
        fontSize: 10,
        color: COLORS.white,
        opacity: 0.6,
        letterSpacing: 2,
        marginTop: SPACING.l,
    },
    zoomButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    metadataContainer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
        gap: SPACING.s,
    },
    metadataDesign: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 12,
        color: COLORS.primary,
        letterSpacing: 2,
    },
    metadataInfo: {
        fontFamily: FONTS.sans,
        fontStyle: 'italic',
        fontSize: 14,
        color: COLORS.slate500,
        textAlign: 'center',
        paddingHorizontal: SPACING.l,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(248, 246, 246, 0.9)',
        borderTopWidth: 1,
        borderTopColor: COLORS.primary + '1A',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.l,
        paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.l,
        gap: SPACING.m,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: SPACING.s,
        ...SHADOWS.md,
        shadowColor: COLORS.primary,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontFamily: FONTS.displayBold,
        fontSize: 18,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    secondaryButtonLight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary + '1A',
        paddingVertical: 12,
        borderRadius: 16,
        gap: SPACING.xs,
    },
    secondaryButtonLightText: {
        color: COLORS.primary,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
    },
    secondaryButtonDark: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.slate200,
        paddingVertical: 12,
        borderRadius: 16,
        gap: SPACING.xs,
    },
    secondaryButtonDarkText: {
        color: COLORS.slate700,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
    },
});
