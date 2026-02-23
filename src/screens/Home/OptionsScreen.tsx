import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';

const HOME_TEXT_COLOR_OPTIONS: { label: string; value: string }[] = [
    { label: 'White', value: '#ffffff' },
    { label: 'Cream', value: '#FFF8E7' },
    { label: 'Gold', value: '#D4AF37' },
    { label: 'Rose', value: '#E8B4B8' },
    { label: 'Black', value: '#1a1a1a' },
];

export default function OptionsScreen({ navigation }: any) {
    const {
        reset,
        countdownPosition,
        setCountdownPosition,
        dailySentenceEnabled,
        setDailySentenceEnabled,
        language,
        setLanguage,
        setBaseImage,
        homeTextColor,
        setHomeTextColor,
    } = useUserStore();

    const [activeTab, setActiveTab] = useState<'settings' | 'design'>('design');

    const handleEditDetails = () => {
        navigation.navigate('Welcome');
    };

    const handleChangeStyle = () => {
        navigation.navigate('StyleSelection');
    };

    const handleCycleLanguage = () => {
        const langs = ['en', 'es', 'he'];
        const currentIndex = langs.indexOf(language || 'en');
        const nextIndex = (currentIndex + 1) % langs.length;
        setLanguage(langs[nextIndex]);
    };

    const pickHomePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Allow access to your photos to change the home page image.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled) {
            setBaseImage(result.assets[0].uri);
            Alert.alert('Done', 'Home page photo updated.');
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            // Only claim the gesture if it's a distinct horizontal swipe
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx, vx } = gestureState;
                if (Math.abs(dx) > 40 && Math.abs(vx) > 0.3) {
                    // Swipe left or right -> go back for robustness
                    navigation.goBack();
                }
            }
        })
    ).current;

    return (
        <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
            <View style={styles.header}>
                <Text style={styles.title}>Options</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Close ✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('settings')}
                >
                    <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'design' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('design')}
                >
                    <Text style={[styles.tabText, activeTab === 'design' && styles.tabTextActive]}>Design</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'design' && (
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.menuButton} onPress={pickHomePhoto}>
                            <Text style={styles.menuButtonText}>🖼️ Replace home page photo</Text>
                        </TouchableOpacity>

                        <Text style={[styles.sectionSubtitle, { marginTop: SPACING.m }]}>Home page text color</Text>
                        <View style={styles.colorRow}>
                            {HOME_TEXT_COLOR_OPTIONS.map(({ label, value }) => (
                                <View key={value} style={styles.colorOption}>
                                    <TouchableOpacity
                                        style={[
                                            styles.colorChip,
                                            { backgroundColor: value },
                                            homeTextColor === value && styles.colorChipActive,
                                        ]}
                                        onPress={() => setHomeTextColor(value)}
                                    >
                                        {homeTextColor === value && <Text style={styles.colorChipCheck}>✓</Text>}
                                    </TouchableOpacity>
                                    <Text style={styles.colorLabel}>{label}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.menuButton} onPress={handleChangeStyle}>
                            <Text style={styles.menuButtonText}>✨ Change Theme Style</Text>
                        </TouchableOpacity>

                        <View style={[styles.menuButton, styles.rowSwitch]}>
                            <Text style={styles.menuButtonText}>📖 Daily Sentence</Text>
                            <Switch
                                value={dailySentenceEnabled}
                                onValueChange={setDailySentenceEnabled}
                                trackColor={{ false: COLORS.slate500, true: COLORS.primary || '#FF8C94' }}
                                thumbColor={COLORS.white}
                            />
                        </View>

                        <Text style={[styles.sectionSubtitle, { marginTop: SPACING.m }]}>Countdown Placing</Text>
                        <View style={styles.positionButtons}>
                            <TouchableOpacity
                                style={[styles.positionButton, countdownPosition === 80 && styles.positionButtonActive]}
                                onPress={() => setCountdownPosition(80)}
                            >
                                <Text style={[styles.positionText, countdownPosition === 80 && styles.positionTextActive]}>Top</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.positionButton, countdownPosition === 50 && styles.positionButtonActive]}
                                onPress={() => setCountdownPosition(50)}
                            >
                                <Text style={[styles.positionText, countdownPosition === 50 && styles.positionTextActive]}>Middle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.positionButton, countdownPosition === 20 && styles.positionButtonActive]}
                                onPress={() => setCountdownPosition(20)}
                            >
                                <Text style={[styles.positionText, countdownPosition === 20 && styles.positionTextActive]}>Bottom</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {activeTab === 'settings' && (
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Welcome')}>
                            <Text style={styles.menuButtonText}>📅 Change Date</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ImageUpload')}>
                            <Text style={styles.menuButtonText}>🖼️ Change Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={handleEditDetails}>
                            <Text style={styles.menuButtonText}>📝 Change Names</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Restore', 'Purchases restored successfully.')}>
                            <Text style={styles.menuButtonText}>💎 Restore Purchase</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Notifications')}>
                            <Text style={styles.menuButtonText}>🔔 Notifications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon.')}>
                            <Text style={styles.menuButtonText}>🔒 Privacy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuButton, styles.rowSwitch]} onPress={handleCycleLanguage}>
                            <Text style={styles.menuButtonText}>🌐 Language</Text>
                            <Text style={styles.valueText}>{language?.toUpperCase() || 'EN'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuButton, styles.dangerButton, { marginTop: SPACING.xl }]} onPress={() => { reset(); navigation.navigate('Welcome'); }}>
                            <Text style={[styles.menuButtonText, styles.dangerButtonText]}>⚠️ Restart Onboarding</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    backButton: {
        padding: SPACING.xs,
    },
    backButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 18,
        color: COLORS.slate500,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.slate900,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
        gap: SPACING.m,
    },
    tabButton: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    tabButtonActive: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate500,
    },
    tabTextActive: {
        fontFamily: FONTS.sansSemiBold,
        color: COLORS.primary || '#FF8C94',
    },
    content: {
        padding: SPACING.l,
        paddingTop: SPACING.s,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionSubtitle: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        color: COLORS.slate500,
        marginBottom: SPACING.s,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    colorOption: {
        alignItems: 'center',
        minWidth: 44,
    },
    colorChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
    },
    colorChipActive: {
        borderColor: COLORS.primary,
        borderWidth: 3,
    },
    colorChipCheck: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.sansSemiBold,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    colorLabel: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate500,
        textAlign: 'center',
    },
    positionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.s,
    },
    positionButton: {
        flex: 1,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    positionButtonActive: {
        borderColor: COLORS.primary || '#FF8C94',
        backgroundColor: '#FFF0F5',
    },
    positionText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
    },
    positionTextActive: {
        fontFamily: FONTS.sansSemiBold,
        color: COLORS.primary || '#FF8C94',
    },
    menuButton: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 20,
        marginBottom: SPACING.s, // reduced gap from m since there are more buttons
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    rowSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
    },
    valueText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.primary || '#FF8C94',
    },
    dangerButton: {
        backgroundColor: '#FFF0F5',
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    dangerButtonText: {
        color: COLORS.error,
    },
});
