import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NameScreen({ navigation }: any) {
    const { setNames, partner1Name, partner2Name } = useUserStore();
    const [p1, setP1] = useState(partner1Name);
    const [p2, setP2] = useState(partner2Name);

    const handleNext = () => {
        if (p1.trim() && p2.trim()) {
            setNames(p1, p2);
            navigation.navigate('Date');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Text style={styles.title}>Welcome to Eternal Glow ✨</Text>
                <Text style={styles.subtitle}>Who are the happy couple? 💕</Text>

                <View style={styles.inputsWrapper}>
                    <TextInput
                        style={styles.stylizedInput}
                        placeholder="Your Name"
                        value={p1}
                        onChangeText={setP1}
                        placeholderTextColor={COLORS.textLight}
                        textAlign="center"
                    />

                    <Text style={styles.ampersand}>&</Text>

                    <TextInput
                        style={styles.stylizedInput}
                        placeholder="Their Name"
                        value={p2}
                        onChangeText={setP2}
                        placeholderTextColor={COLORS.textLight}
                        textAlign="center"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, (!p1.trim() || !p2.trim()) && styles.buttonDisabled]}
                    onPress={handleNext}
                    disabled={!p1.trim() || !p2.trim()}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Background color handled by LinearGradient
    },
    keyboardView: {
        flex: 1,
        padding: SPACING.l,
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
    inputsWrapper: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    stylizedInput: {
        fontFamily: FONTS.serifBold,
        fontSize: 32,
        color: COLORS.text,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 140, 148, 0.5)',
        paddingVertical: SPACING.s,
        minWidth: '80%',
    },
    ampersand: {
        fontFamily: 'DancingScript_700Bold', // Using one of the new elegant fonts
        fontSize: 48,
        color: COLORS.accent || '#FF8C94',
        marginVertical: SPACING.m,
    },
    button: {
        backgroundColor: COLORS.accent || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: SPACING.xl,
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
