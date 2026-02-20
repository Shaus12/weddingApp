import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function RemindersScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wedding Checklist</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <MaterialIcons name="more-vert" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Section */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <View>
                            <Text style={styles.progressPercentage}>45% Complete</Text>
                            <Text style={styles.progressSubtitle}>12 of 27 tasks finished</Text>
                        </View>
                        <Text style={styles.progressLabel}>YOUR JOURNEY</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '45%' }]} />
                    </View>
                    <Text style={styles.progressQuote}>"True love stories never have endings, but they do have great plans."</Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                        <Text style={[styles.tabText, styles.tabTextActive]}>All Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Completed</Text>
                    </TouchableOpacity>
                </View>

                {/* Task List */}
                <View style={styles.taskList}>
                    {/* Category */}
                    <View style={styles.categoryHeader}>
                        <MaterialIcons name="calendar-today" size={16} color={COLORS.primary} />
                        <Text style={styles.categoryTitle}>12 Months to Go</Text>
                    </View>

                    <View style={styles.taskItems}>
                        {/* Completed Task */}
                        <View style={styles.taskCard}>
                            <View style={styles.taskCheckWrapper}>
                                <View style={styles.taskCheckCompleted}>
                                    <MaterialIcons name="check" size={14} color={COLORS.white} />
                                </View>
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={[styles.taskTitle, styles.taskTitleCompleted]}>Secure the Dream Venue</Text>
                                <View style={styles.taskMeta}>
                                    <View style={styles.taskDate}>
                                        <MaterialIcons name="event" size={12} color={COLORS.slate400} />
                                        <Text style={styles.taskDateText}>Oct 12, 2023</Text>
                                    </View>
                                    <View style={styles.tagCompleted}>
                                        <Text style={styles.tagCompletedText}>DONE</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Active Task */}
                        <View style={[styles.taskCard, styles.taskCardActive]}>
                            <View style={styles.taskCheckWrapper}>
                                <TouchableOpacity style={styles.taskCheckActive} />
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={styles.taskTitle}>Finalize Guest List</Text>
                                <View style={styles.taskMeta}>
                                    <View style={styles.taskDate}>
                                        <MaterialIcons name="event" size={12} color={COLORS.primary} />
                                        <Text style={[styles.taskDateText, { color: COLORS.primary }]}>Nov 05, 2023</Text>
                                    </View>
                                    <View style={styles.tagPriority}>
                                        <Text style={styles.tagPriorityText}>PRIORITY</Text>
                                    </View>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={COLORS.slate300} />
                        </View>

                        {/* Regular Task */}
                        <View style={styles.taskCard}>
                            <View style={styles.taskCheckWrapper}>
                                <TouchableOpacity style={styles.taskCheckRegular} />
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={styles.taskTitle}>Book Wedding Photographer</Text>
                                <View style={styles.taskMeta}>
                                    <View style={styles.taskDate}>
                                        <MaterialIcons name="event" size={12} color={COLORS.slate500} />
                                        <Text style={[styles.taskDateText, { color: COLORS.slate500 }]}>Nov 20, 2023</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <MaterialIcons name="add" size={28} color={COLORS.white} />
            </TouchableOpacity>

            {/* Bottom Nav equivalent from HTML (visual only, navigation handled by app) */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color={COLORS.slate400} />
                    <Text style={styles.navText}>HOME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="list-alt" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>CHECKLIST</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="storefront" size={24} color={COLORS.slate400} />
                    <Text style={styles.navText}>VENDORS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person" size={24} color={COLORS.slate400} />
                    <Text style={styles.navText}>PROFILE</Text>
                </TouchableOpacity>
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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary + '1A',
        zIndex: 10,
    },
    headerButton: {
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
    },
    scrollContent: {
        padding: SPACING.m,
        paddingBottom: 100, // Space for Bottom Nav and FAB
    },
    progressCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.primary + '0D',
        ...SHADOWS.sm,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: SPACING.m,
    },
    progressPercentage: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.primary,
    },
    progressSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 4,
    },
    progressLabel: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 10,
        color: COLORS.slate400,
        letterSpacing: 1.5,
    },
    progressBarBackground: {
        height: 12,
        backgroundColor: COLORS.primary + '1A',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 6,
    },
    progressQuote: {
        fontFamily: FONTS.sans,
        fontStyle: 'italic',
        fontSize: 14,
        color: COLORS.slate600,
        marginTop: SPACING.m,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary + '1A',
        marginBottom: SPACING.l,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontFamily: FONTS.sansMedium,
        fontSize: 14,
        color: COLORS.slate500,
    },
    tabTextActive: {
        fontFamily: FONTS.sansSemiBold,
        color: COLORS.primary,
    },
    taskList: {
        gap: SPACING.l,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
        marginBottom: SPACING.s,
    },
    categoryTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.slate900,
        letterSpacing: -0.5,
    },
    taskItems: {
        gap: SPACING.s,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary + '0D',
        ...SHADOWS.sm,
    },
    taskCardActive: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    taskCheckWrapper: {
        marginRight: SPACING.m,
    },
    taskCheckCompleted: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskCheckActive: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    taskCheckRegular: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.slate300,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.slate900,
    },
    taskTitleCompleted: {
        color: COLORS.slate400,
        textDecorationLine: 'line-through',
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
        marginTop: 4,
    },
    taskDate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    taskDateText: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate400,
    },
    tagCompleted: {
        backgroundColor: COLORS.slate100,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    tagCompletedText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 10,
        color: COLORS.slate400,
    },
    tagPriority: {
        backgroundColor: COLORS.primary + '1A',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    tagPriorityText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 10,
        color: COLORS.primary,
    },
    fab: {
        position: 'absolute',
        bottom: 96,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.lg,
        shadowColor: COLORS.primary,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundLight,
        borderTopWidth: 1,
        borderTopColor: COLORS.primary + '1A',
        paddingTop: SPACING.s,
        paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.s,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    navText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 10,
        color: COLORS.slate400,
        letterSpacing: 1,
    },
});
