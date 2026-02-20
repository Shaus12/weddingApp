import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }: any) {
    const { setNames, setWeddingDate, partner1Name, partner2Name, weddingDate } = useUserStore();
    const [p1, setP1] = useState(partner1Name);
    const [p2, setP2] = useState(partner2Name);

    // For simplicity, we just use a basic string date for now. 
    // Usually you'd use a DatePicker component here but matching HTML text input style.
    const [date, setDate] = useState(weddingDate || '');

    const handleNext = () => {
        if (p1.trim() && p2.trim() && date.trim()) {
            setNames(p1, p2);
            setWeddingDate(date);
            // Assuming after Date screen it went to ImageUpload or Questionnaire in previous flow
            navigation.navigate('ImageUpload');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => { }}>
                    <MaterialIcons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Our Wedding</Text>
                <TouchableOpacity onPress={() => { }}>
                    <MaterialIcons name="more-horiz" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.heroContainer}>
                    <ImageBackground
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmD7ukNETNMPzXrkSI6WlgeCRZeSTJ0ubcX7Gz70uG2kABhtyRVkHM1ysTgg0pQb1qJ0hZyOefb5da51sF8PzkHznBy4cuhmfLOTvPOVX2jCVBS9ibxc5VImaRsuejGWSbuapyI5X4euB-SfoohgqJGRys14moKk0_b6Hm4KEAzlTuFmea1aCbVo3p_IAzfQJLhIy53H7vyiSHrCcmvHXUEM8LXmTP-x-3c_Jc-m7GDFk8itq-37em66zGjcT83xWzId-vCyJ-N1Y" }}
                        style={styles.heroImage}
                        imageStyle={styles.heroImageRadius}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)']}
                            style={styles.heroGradient}
                        >
                            <View style={styles.heroTagContainer}>
                                <Text style={styles.heroTagText}>New Journey</Text>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Crafting Your Perfect Day</Text>
                    <Text style={styles.subtitle}>Enter your details to start planning your journey together.</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Partner 1</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="favorite" size={20} color={COLORS.primary + '99'} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={p1}
                                onChangeText={setP1}
                                placeholderTextColor={COLORS.slate400}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Partner 2</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="favorite" size={20} color={COLORS.primary + '99'} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={p2}
                                onChangeText={setP2}
                                placeholderTextColor={COLORS.slate400}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>The Big Day</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="calendar-today" size={20} color={COLORS.primary + '99'} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                                placeholderTextColor={COLORS.slate400}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, (!p1.trim() || !p2.trim() || !date.trim()) && styles.buttonDisabled]}
                            onPress={handleNext}
                            disabled={!p1.trim() || !p2.trim() || !date.trim()}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                            <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.s,
        paddingTop: SPACING.m,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    topBarTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.slate900,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
    },
    heroContainer: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.xs,
    },
    heroImage: {
        width: '100%',
        aspectRatio: 4 / 5,
        justifyContent: 'flex-end',
    },
    heroImageRadius: {
        borderRadius: 24,
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        justifyContent: 'flex-end',
        padding: SPACING.l,
    },
    heroTagContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: SPACING.s,
    },
    heroTagText: {
        color: COLORS.white,
        fontFamily: FONTS.sansMedium,
        fontSize: 12,
    },
    headerContainer: {
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.xs,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 30,
        color: COLORS.slate900,
        lineHeight: 36,
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate600,
        lineHeight: 24,
    },
    formContainer: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.xl,
        gap: SPACING.l,
        paddingBottom: SPACING.xxl,
    },
    inputGroup: {
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    label: {
        fontFamily: FONTS.displayBold,
        fontSize: 14,
        color: COLORS.slate900,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    input: {
        backgroundColor: COLORS.slate50,
        borderColor: COLORS.slate200,
        borderWidth: 1,
        borderRadius: 16,
        height: 56,
        paddingLeft: 48,
        paddingRight: 16,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
    },
    buttonContainer: {
        paddingTop: SPACING.m,
        paddingBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
        ...SHADOWS.md,
        shadowColor: COLORS.primary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.displayBold,
        fontSize: 16,
    },
    termsText: {
        textAlign: 'center',
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate400,
        marginTop: SPACING.l,
        paddingHorizontal: SPACING.xl,
    }
});
