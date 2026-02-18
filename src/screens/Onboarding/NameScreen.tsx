import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Text style={styles.title}>Welcome to Eternal Glow</Text>
                <Text style={styles.subtitle}>Who are the happy couple?</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Partner 1</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={p1}
                        onChangeText={setP1}
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Partner 2</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={p2}
                        onChangeText={setP2}
                        placeholderTextColor={COLORS.textLight}
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
        backgroundColor: COLORS.background,
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
    inputContainer: {
        marginBottom: SPACING.l,
    },
    label: {
        fontFamily: FONTS.sansBold,
        fontSize: 14,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: COLORS.text,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        marginTop: SPACING.xl,
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
