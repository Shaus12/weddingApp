import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../store/useUserStore';
import { getTodayDateKey } from '../../services/dailyContentService';
import {
  getDailyCardPayload,
  type DailyCardType,
} from '../../constants/dailyContent';
import {
  getTasksByStage,
  getStageForDaysToGo,
  CHECKLIST_STAGES,
  type ChecklistTask,
  type ChecklistStage,
} from '../../constants/checklistStages';
import {
  getCompletedIds,
  setCompleted as persistCompleted,
  getNotes,
  setNote as persistNote,
  getCustomTasks,
  addCustomTask,
  deleteCustomTask,
  type CustomTask,
} from '../../services/checklistPersistenceService';

type Tab = 'today' | 'checklist';

export default function RemindersScreen({ navigation }: any) {
  const { weddingDate } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>('today');

  const [todaysCard, setTodaysCard] = useState<{
    type: DailyCardType;
    content: string;
    id: string;
  } | null>(null);
  const [milestoneHint, setMilestoneHint] = useState<string | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [addMissionVisible, setAddMissionVisible] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionStageId, setNewMissionStageId] = useState<string>(CHECKLIST_STAGES[0].id);

  const daysToGo = weddingDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;
  const dateKey = getTodayDateKey();

  const loadDaily = useCallback(() => {
    setLoadingDaily(true);
    const payload = getDailyCardPayload(dateKey, daysToGo);
    setTodaysCard(payload);
    const tomorrow = daysToGo - 1;
    if (tomorrow === 30 || tomorrow === 14 || tomorrow === 7 || tomorrow === 1) {
      setMilestoneHint(`Milestone tomorrow: ${tomorrow} days left`);
    } else {
      setMilestoneHint(null);
    }
    setLoadingDaily(false);
  }, [dateKey, daysToGo]);

  const loadChecklist = useCallback(async () => {
    const [c, n, custom] = await Promise.all([getCompletedIds(), getNotes(), getCustomTasks()]);
    setCompleted(c);
    setNotes(n);
    setCustomTasks(custom);
    const relevantStage = getStageForDaysToGo(daysToGo);
    setExpandedStages(new Set(relevantStage ? [relevantStage] : []));
  }, [daysToGo]);

  useEffect(() => {
    loadDaily();
  }, [loadDaily]);

  useEffect(() => {
    if (activeTab === 'checklist') loadChecklist();
  }, [activeTab, loadChecklist]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadDaily();
    if (activeTab === 'checklist') await loadChecklist();
    setRefreshing(false);
  }, [loadDaily, loadChecklist, activeTab]);

  const toggleTask = useCallback(async (taskId: string) => {
    const next = !completed[taskId];
    setCompleted((prev) => ({ ...prev, [taskId]: next }));
    await persistCompleted(taskId, next);
  }, [completed]);

  const updateNote = useCallback(async (taskId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [taskId]: text }));
    await persistNote(taskId, text);
  }, []);

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const handleAddMission = useCallback(async () => {
    const title = newMissionTitle.trim();
    if (!title) return;
    const task = await addCustomTask(title, newMissionStageId);
    setCustomTasks((prev) => [...prev, task]);
    setNewMissionTitle('');
    setAddMissionVisible(false);
  }, [newMissionTitle, newMissionStageId]);

  const handleDeleteMission = useCallback(async (id: string) => {
    await deleteCustomTask(id);
    setCustomTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const groups = getTasksByStage();
  const allPredefinedIds = groups.flatMap((g) => g.tasks.map((t) => t.id));
  const allTaskIds = [...allPredefinedIds, ...customTasks.map((t) => t.id)];
  const completedCount = allTaskIds.filter((id) => completed[id]).length;
  const totalTasks = allTaskIds.length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const openAddMission = (stageId: string) => {
    setNewMissionStageId(stageId);
    setNewMissionTitle('');
    setAddMissionVisible(true);
  };
  const relevantStageId = getStageForDaysToGo(daysToGo);

  const emotionalHeader =
    todaysCard?.type === 'tip'
      ? "Today's little win"
      : todaysCard?.type === 'question'
        ? 'Question for you two'
        : "Today's feeling";
  const iconBadge = todaysCard?.type === 'tip' ? '💡' : todaysCard?.type === 'question' ? '💬' : '❤️';
  const microContext =
    daysToGo <= 7 && daysToGo > 0
      ? 'This week is getting real 💍'
      : daysToGo > 0
        ? `${daysToGo} days to go`
        : 'Your day is here 💒';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
      </View>

      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'today' && styles.segmentActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.segmentText, activeTab === 'today' && styles.segmentTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'checklist' && styles.segmentActive]}
          onPress={() => setActiveTab('checklist')}
        >
          <Text style={[styles.segmentText, activeTab === 'checklist' && styles.segmentTextActive]}>
            Checklist
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {activeTab === 'today' && (
          <View style={styles.todayContent}>
            {loadingDaily ? (
              <Text style={styles.muted}>Loading…</Text>
            ) : todaysCard ? (
              <>
                <Text style={styles.microContext}>{microContext}</Text>
                <Text style={styles.emotionalHeader}>{emotionalHeader}</Text>
                <View style={styles.dailyCardWrap}>
                  <LinearGradient
                    colors={['rgba(255,240,245,0.95)', 'rgba(255,248,250,0.9)', 'rgba(248,246,246,0.95)']}
                    style={styles.dailyCard}
                  >
                    <View style={styles.dailyCardInner}>
                      <View style={styles.iconBadge}>
                        <Text style={styles.iconBadgeText}>{iconBadge}</Text>
                      </View>
                      <Text style={styles.cardContent}>{todaysCard.content}</Text>
                    </View>
                  </LinearGradient>
                </View>
                {milestoneHint && (
                  <Text style={styles.milestoneHint}>{milestoneHint}</Text>
                )}
              </>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptySub}>No card for today.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'checklist' && (
          <View style={styles.checklistContent}>
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Your progress</Text>
                <Text style={styles.progressCount}>
                  {completedCount} of {totalTasks} tasks
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
              </View>
            </View>

            {groups.map(({ stage, tasks: predefinedTasks }) => {
              const isExpanded = expandedStages.has(stage.id);
              const isRelevant = stage.id === relevantStageId;
              const customForStage = customTasks.filter((ct) => ct.stageId === stage.id);
              const allTasks: { id: string; title: string; suggestedTiming: string; isCustom: boolean }[] = [
                ...predefinedTasks.map((t) => ({ id: t.id, title: t.title, suggestedTiming: t.suggestedTiming, isCustom: false })),
                ...customForStage.map((t) => ({ id: t.id, title: t.title, suggestedTiming: '', isCustom: true })),
              ];
              return (
                <View key={stage.id} style={styles.stageBlock}>
                  <TouchableOpacity
                    style={[styles.stageHeader, isRelevant && styles.stageHeaderRelevant]}
                    onPress={() => toggleStage(stage.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stageLabel}>{stage.label}</Text>
                    <MaterialIcons
                      name={isExpanded ? 'expand-less' : 'expand-more'}
                      size={24}
                      color={COLORS.slate600}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <>
                      {allTasks.map((task) => (
                        <ChecklistRow
                          key={task.id}
                          task={{ id: task.id, title: task.title, stageId: stage.id, suggestedTiming: task.suggestedTiming }}
                          completed={!!completed[task.id]}
                          note={notes[task.id] ?? ''}
                          onToggle={() => toggleTask(task.id)}
                          onNoteChange={(text) => updateNote(task.id, text)}
                          onDelete={task.isCustom ? () => handleDeleteMission(task.id) : undefined}
                        />
                      ))}
                      <TouchableOpacity style={styles.addMissionButton} onPress={() => openAddMission(stage.id)}>
                        <MaterialIcons name="add" size={22} color={COLORS.primary} />
                        <Text style={styles.addMissionText}>Add mission to this timeline</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })}

            <View style={styles.premiumPlaceholder}>
              <Text style={styles.premiumPlaceholderText}>
                Premium: smart reminders · smart ordering
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={addMissionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMissionVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setAddMissionVisible(false)}
          />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add mission</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Order thank-you cards"
              placeholderTextColor={COLORS.slate400}
              value={newMissionTitle}
              onChangeText={setNewMissionTitle}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddMission}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setAddMissionVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAdd, !newMissionTitle.trim() && styles.modalAddDisabled]}
                onPress={handleAddMission}
                disabled={!newMissionTitle.trim()}
              >
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function ChecklistRow({
  task,
  completed,
  note,
  onToggle,
  onNoteChange,
  onDelete,
}: {
  task: ChecklistTask & { suggestedTiming?: string };
  completed: boolean;
  note: string;
  onToggle: () => void;
  onNoteChange: (text: string) => void;
  onDelete?: () => void;
}) {
  const [noteFocused, setNoteFocused] = useState(false);
  return (
    <View style={styles.taskRow}>
      <TouchableOpacity
        style={[styles.taskCheck, completed && styles.taskCheckCompleted]}
        onPress={onToggle}
      >
        {completed && <MaterialIcons name="check" size={14} color={COLORS.white} />}
      </TouchableOpacity>
      <View style={styles.taskBody}>
        <Text style={[styles.taskTitle, completed && styles.taskTitleCompleted]}>{task.title}</Text>
        {task.suggestedTiming ? (
          <Text style={styles.taskTiming}>{task.suggestedTiming}</Text>
        ) : null}
        <TextInput
          style={[styles.taskNotes, noteFocused && styles.taskNotesFocused]}
          placeholder="Notes"
          placeholderTextColor={COLORS.slate400}
          value={note}
          onChangeText={onNoteChange}
          onFocus={() => setNoteFocused(true)}
          onBlur={() => setNoteFocused(false)}
          multiline
        />
      </View>
      {onDelete ? (
        <TouchableOpacity style={styles.taskDelete} onPress={onDelete} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="delete-outline" size={22} color={COLORS.slate400} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.slate900,
  },
  segmented: {
    flexDirection: 'row',
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    backgroundColor: COLORS.slate100,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  segmentText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    color: COLORS.slate500,
  },
  segmentTextActive: {
    fontFamily: FONTS.sansSemiBold,
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  todayContent: {
    marginTop: SPACING.l,
  },
  muted: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.slate400,
    textAlign: 'center',
    padding: SPACING.xl,
  },
  microContext: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.slate500,
    marginBottom: SPACING.xs,
  },
  emotionalHeader: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.slate800,
    marginBottom: SPACING.m,
  },
  dailyCardWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  dailyCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 91, 0.08)',
  },
  dailyCardInner: {
    padding: SPACING.xl,
    paddingTop: SPACING.l,
  },
  iconBadge: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
    ...SHADOWS.sm,
  },
  iconBadgeText: {
    fontSize: 22,
  },
  cardContent: {
    fontFamily: FONTS.sans,
    fontSize: 19,
    color: COLORS.slate800,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  emptySub: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.slate500,
  },
  milestoneHint: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: SPACING.m,
    textAlign: 'center',
  },
  checklistContent: {
    marginTop: SPACING.l,
    gap: SPACING.s,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    ...SHADOWS.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  progressLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.slate700,
  },
  progressCount: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.slate500,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.slate100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  stageBlock: {
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  stageHeaderRelevant: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  stageLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    color: COLORS.slate900,
  },
  addMissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  addMissionText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  taskDelete: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
    marginTop: 2,
  },
  taskCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate300,
    marginRight: SPACING.m,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskBody: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 15,
    color: COLORS.slate900,
  },
  taskTitleCompleted: {
    color: COLORS.slate400,
    textDecorationLine: 'line-through',
  },
  taskTiming: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
  },
  taskNotes: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.slate600,
    marginTop: 4,
    padding: 6,
    backgroundColor: COLORS.slate50,
    borderRadius: 8,
    minHeight: 36,
  },
  taskNotesFocused: {
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  premiumPlaceholder: {
    marginTop: SPACING.l,
    paddingVertical: SPACING.s,
    alignItems: 'center',
  },
  premiumPlaceholderText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.slate400,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.l,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    color: COLORS.slate900,
    marginBottom: SPACING.m,
  },
  modalInput: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: COLORS.slate900,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.slate50,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.m,
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
  },
  modalCancelText: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: COLORS.slate500,
  },
  modalAdd: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  modalAddDisabled: {
    backgroundColor: COLORS.slate300,
  },
  modalAddText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 16,
    color: COLORS.white,
  },
});
