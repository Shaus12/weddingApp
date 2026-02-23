import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import {
    loadNotificationSettings,
    saveNotificationSettings,
    type NotificationSettings,
} from '../../services/notificationSettingsService';
import { scheduleAll, cancelAll } from '../../services/notificationScheduler';
import * as Notifications from 'expo-notifications';

export default function NotificationsScreen({ navigation }: any) {
    const { weddingDate } = useUserStore();
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const load = useCallback(async () => {
        const s = await loadNotificationSettings();
        setSettings(s);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const update = useCallback(
        async (next: NotificationSettings) => {
            setSettings(next);
            await saveNotificationSettings(next);
            if (!next.dailyReminderEnabled) {
                await cancelAll();
            } else {
                const { status } = await Notifications.getPermissionsAsync();
                if (status === 'granted') {
                    await scheduleAll(weddingDate, next);
                }
            }
        },
        [weddingDate]
    );

    const handleDailyToggle = useCallback(
        async (value: boolean) => {
            if (!settings) return;
            if (value) {
                const { status: existing } = await Notifications.getPermissionsAsync();
                let finalStatus = existing;
                if (existing !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') return;
            }
            await update({ ...settings, dailyReminderEnabled: value });
        },
        [settings, update]
    );

    const handleTimeChange = useCallback(
        (_: any, date?: Date) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (!date || !settings) return;
            const next = {
                ...settings,
                dailyTimeHour: date.getHours(),
                dailyTimeMinute: date.getMinutes(),
            };
            update(next);
        },
        [settings, update]
    );

    const timeValue = settings
        ? new Date(2000, 0, 1, settings.dailyTimeHour, settings.dailyTimeMinute)
        : new Date(2000, 0, 1, 20, 30);

    if (!settings) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Close ✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <View style={[styles.row, styles.rowSwitch]}>
                        <Text style={styles.label}>תזכורת יומית</Text>
                        <Switch
                            value={settings.dailyReminderEnabled}
                            onValueChange={handleDailyToggle}
                            trackColor={{ false: COLORS.slate500, true: COLORS.primary || '#FF8C94' }}
                            thumbColor={COLORS.white}
                        />
                    </View>

                    {settings.dailyReminderEnabled && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>שעה יומית</Text>
                                <TouchableOpacity
                                    style={styles.timeButton}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={styles.timeText}>
                                        {String(settings.dailyTimeHour).padStart(2, '0')}:
                                        {String(settings.dailyTimeMinute).padStart(2, '0')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={timeValue}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleTimeChange}
                                />
                            )}
                            {Platform.OS === 'ios' && showTimePicker && (
                                <TouchableOpacity
                                    style={styles.doneButton}
                                    onPress={() => setShowTimePicker(false)}
                                >
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.row, styles.rowSwitch]}>
                                <Text style={styles.label}>Milestones</Text>
                                <Switch
                                    value={settings.milestonesEnabled}
                                    onValueChange={(v) => update({ ...settings, milestonesEnabled: v })}
                                    trackColor={{ false: COLORS.slate500, true: COLORS.primary || '#FF8C94' }}
                                    thumbColor={COLORS.white}
                                />
                            </View>
                        </>
                    )}

                    <View style={[styles.row, styles.rowSwitch]}>
                        <Text style={styles.label}>התראות Today</Text>
                        <Switch
                            value={settings.todayAgendaEnabled}
                            onValueChange={(v) => update({ ...settings, todayAgendaEnabled: v })}
                            trackColor={{ false: COLORS.slate500, true: COLORS.primary || '#FF8C94' }}
                            thumbColor={COLORS.white}
                        />
                    </View>
                    <Text style={styles.hint}>לא מתזמן עדיין (להפעלה עתידית).</Text>
                </View>
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
    backButton: { padding: SPACING.xs },
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
    content: {
        padding: SPACING.l,
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    rowSwitch: {
        marginBottom: SPACING.m,
    },
    label: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
    },
    timeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.slate100,
        borderRadius: 12,
    },
    timeText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.slate900,
    },
    doneButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: SPACING.l,
        marginTop: SPACING.s,
    },
    doneButtonText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.primary || '#FF8C94',
    },
    hint: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate500,
        marginTop: -SPACING.xs,
    },
});
