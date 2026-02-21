import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';

export default function OptionsScreen({ navigation }: any) {
    const {
        reset,
        countdownPosition,
        setCountdownPosition,
        dailySentenceEnabled,
        setDailySentenceEnabled
    } = useUserStore();

    const [activeTab, setActiveTab] = useState<'settings' | 'design'>('design');

    const handleEditDetails = () => {
        navigation.navigate('Name');
    };

    const handleChangeStyle = () => {
        navigation.navigate('StyleSelection');
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
                        <TouchableOpacity style={styles.menuButton} onPress={handleChangeStyle}>
                            <Text style={styles.menuButtonText}>✨ Change Theme Style</Text>
                        </TouchableOpacity>

                        <View style={[styles.menuButton, styles.rowSwitch]}>
                            <Text style={styles.menuButtonText}>📖 Daily Sentence</Text>
                            <Switch
                                value={dailySentenceEnabled}
                                onValueChange={setDailySentenceEnabled}
                                trackColor={{ false: COLORS.textLight, true: COLORS.accent || '#FF8C94' }}
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
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Date')}>
                            <Text style={styles.menuButtonText}>📅 Change Date</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ImageSelection')}>
                            <Text style={styles.menuButtonText}>🖼️ Change Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Name')}>
                            <Text style={styles.menuButtonText}>📝 Change Names</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Restore', 'Purchases restored successfully.')}>
                            <Text style={styles.menuButtonText}>💎 Restore Purchase</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Notifications', 'Notification settings coming soon.')}>
                            <Text style={styles.menuButtonText}>🔔 Notifications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon.')}>
                            <Text style={styles.menuButtonText}>🔒 Privacy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuButton, styles.dangerButton, { marginTop: SPACING.xl }]} onPress={() => { reset(); navigation.navigate('Name'); }}>
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
        backgroundColor: COLORS.background,
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
        color: COLORS.textLight,
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 24,
        color: COLORS.text,
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
        color: COLORS.textLight,
    },
    tabTextActive: {
        fontFamily: FONTS.sansBold,
        color: COLORS.accent || '#FF8C94',
    },
    content: {
        padding: SPACING.l,
        paddingTop: SPACING.s,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionSubtitle: {
        fontFamily: FONTS.sansBold,
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: SPACING.s,
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        borderColor: COLORS.accent || '#FF8C94',
        backgroundColor: '#FFF0F5',
    },
    positionText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.text,
    },
    positionTextActive: {
        fontFamily: FONTS.sansBold,
        color: COLORS.accent || '#FF8C94',
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
        color: COLORS.text,
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
