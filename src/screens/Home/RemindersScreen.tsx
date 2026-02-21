import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserStore } from '../../store/useUserStore';

export default function RemindersScreen({ navigation }: any) {
    const { tasks, toggleTask, addTask } = useUserStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [modalVisible, setModalVisible] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            addTask(newTaskText.trim());
            setNewTaskText('');
            setModalVisible(false);
        }
    };

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const totalTasksCount = tasks.length;
    const progressPercentage = totalTasksCount === 0 ? 0 : Math.round((completedTasksCount / totalTasksCount) * 100);

    const filteredTasks = tasks.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });
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
                            <Text style={styles.progressPercentage}>{progressPercentage}% Complete</Text>
                            <Text style={styles.progressSubtitle}>{completedTasksCount} of {totalTasksCount} tasks finished</Text>
                        </View>
                        <Text style={styles.progressLabel}>YOUR JOURNEY</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                    </View>
                    <Text style={styles.progressQuote}>"True love stories never have endings, but they do have great plans."</Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, filter === 'all' && styles.tabActive]} onPress={() => setFilter('all')}>
                        <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>All Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, filter === 'pending' && styles.tabActive]} onPress={() => setFilter('pending')}>
                        <Text style={[styles.tabText, filter === 'pending' && styles.tabTextActive]}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, filter === 'completed' && styles.tabActive]} onPress={() => setFilter('completed')}>
                        <Text style={[styles.tabText, filter === 'completed' && styles.tabTextActive]}>Completed</Text>
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
                        {filteredTasks.length === 0 ? (
                            <Text style={styles.emptyText}>No tasks found in this category.</Text>
                        ) : (
                            filteredTasks.map((task) => (
                                <View key={task.id} style={[styles.taskCard, !task.completed && task.priority && styles.taskCardActive]}>
                                    <View style={styles.taskCheckWrapper}>
                                        <TouchableOpacity
                                            style={task.completed ? styles.taskCheckCompleted : (!task.completed && task.priority ? styles.taskCheckActive : styles.taskCheckRegular)}
                                            onPress={() => toggleTask(task.id)}
                                        >
                                            {task.completed && <MaterialIcons name="check" size={14} color={COLORS.white} />}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.taskContent}>
                                        <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                                        <View style={styles.taskMeta}>
                                            {task.date && (
                                                <View style={styles.taskDate}>
                                                    <MaterialIcons name="event" size={12} color={task.completed ? COLORS.slate400 : (task.priority ? COLORS.primary : COLORS.slate500)} />
                                                    <Text style={[styles.taskDateText, !task.completed && task.priority && { color: COLORS.primary }, task.completed && { color: COLORS.slate400 }]}>
                                                        {task.date}
                                                    </Text>
                                                </View>
                                            )}
                                            {task.completed ? (
                                                <View style={styles.tagCompleted}>
                                                    <Text style={styles.tagCompletedText}>DONE</Text>
                                                </View>
                                            ) : (
                                                task.priority && (
                                                    <View style={styles.tagPriority}>
                                                        <Text style={styles.tagPriorityText}>PRIORITY</Text>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </View>
                                    {!task.completed && task.priority && <MaterialIcons name="chevron-right" size={24} color={COLORS.slate300} />}
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add" size={28} color={COLORS.white} />
            </TouchableOpacity>

            {/* Add Task Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Task</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={COLORS.slate400} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g. Taste testing wedding cakes"
                            value={newTaskText}
                            onChangeText={setNewTaskText}
                            placeholderTextColor={COLORS.slate400}
                            autoFocus
                            onSubmitEditing={handleAddTask}
                            returnKeyType="done"
                        />

                        <TouchableOpacity
                            style={[styles.modalButton, !newTaskText.trim() && styles.modalButtonDisabled]}
                            onPress={handleAddTask}
                            disabled={!newTaskText.trim()}
                        >
                            <Text style={styles.modalButtonText}>Add Task</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

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
    emptyText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate400,
        textAlign: 'center',
        padding: SPACING.xl,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.l,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.l,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    modalTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.slate900,
    },
    modalInput: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: 12,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        backgroundColor: '#f8f9fa',
    },
    modalButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalButtonDisabled: {
        backgroundColor: COLORS.slate300,
    },
    modalButtonText: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.white,
    }
});
