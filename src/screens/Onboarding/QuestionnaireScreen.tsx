import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuestionnaireScreen({ navigation }: any) {
    const { setStoryDetails, story, adjectives } = useUserStore();
    const [currentStory, setCurrentStory] = useState(story);
    const [currentAdjectives, setCurrentAdjectives] = useState(adjectives);

    const handleNext = () => {
        setStoryDetails(currentStory, currentAdjectives);
        navigation.navigate('Magic');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Your Story</Text>
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
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    textArea: {
        height: 120,
    },
    button: {
        backgroundColor: COLORS.text,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        marginTop: SPACING.m,
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
