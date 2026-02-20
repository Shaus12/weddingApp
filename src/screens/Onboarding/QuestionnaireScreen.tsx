import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuestionnaireScreen({ navigation }: any) {
    const { setStoryDetails, story, adjectives } = useUserStore();
    const [currentStory, setCurrentStory] = useState(story);
    const [currentAdjectives, setCurrentAdjectives] = useState(adjectives);

    const handleNext = () => {
        setStoryDetails(currentStory, currentAdjectives);
        navigation.navigate('Magic');
    };

    const handleSkip = () => {
        // Just navigate without setting story details
        navigation.navigate('Magic');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Your Story 📖</Text>
                    <Text style={styles.subtitle}>Help us create the perfect content for you.</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>How did you meet?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="We met at a coffee shop..."
                            value={currentStory}
                            onChangeText={setCurrentStory}
                            multiline
                            textAlignVertical="top"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Describe yourselves in a few words</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Adventurous, Foodies, Chill"
                            value={currentAdjectives}
                            onChangeText={setCurrentAdjectives}
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (!currentStory.trim() || !currentAdjectives.trim()) && styles.buttonDisabled]}
                        onPress={handleNext}
                        disabled={!currentStory.trim() || !currentAdjectives.trim()}
                    >
                        <Text style={styles.buttonText}>Create Magic ✨</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.background, handled by LinearGradient
    },
    content: {
        padding: SPACING.l,
        flexGrow: 1,
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: SPACING.m,
        borderRadius: 20,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    textArea: {
        height: 120,
    },
    button: {
        backgroundColor: COLORS.accent || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: SPACING.m,
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
    skipButton: {
        padding: SPACING.m,
        alignItems: 'center',
        marginTop: SPACING.s,
    },
    skipButtonText: {
        color: COLORS.textLight,
        fontFamily: FONTS.sans,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
