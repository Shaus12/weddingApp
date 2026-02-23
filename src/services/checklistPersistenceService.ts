/**
 * Persist checklist completion, notes, and custom tasks (AsyncStorage).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_COMPLETED = '@agenda/checklist_completed';
const KEY_NOTES = '@agenda/checklist_notes';
const KEY_CUSTOM_TASKS = '@agenda/checklist_custom_tasks';

export interface CustomTask {
  id: string;
  title: string;
  stageId: string; // same ids as CHECKLIST_STAGES: '6-12', '3-6', '1-3', 'last-month', 'last-week'
}

export async function getCompletedIds(): Promise<Record<string, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(KEY_COMPLETED);
    if (raw) {
      const obj = JSON.parse(raw);
      return typeof obj === 'object' && obj !== null ? obj : {};
    }
  } catch {
    // ignore
  }
  return {};
}

export async function setCompleted(taskId: string, completed: boolean): Promise<void> {
  const map = await getCompletedIds();
  map[taskId] = completed;
  await AsyncStorage.setItem(KEY_COMPLETED, JSON.stringify(map));
}

export async function getNotes(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(KEY_NOTES);
    if (raw) {
      const obj = JSON.parse(raw);
      return typeof obj === 'object' && obj !== null ? obj : {};
    }
  } catch {
    // ignore
  }
  return {};
}

export async function setNote(taskId: string, note: string): Promise<void> {
  const map = await getNotes();
  if (note.trim()) map[taskId] = note.trim();
  else delete map[taskId];
  await AsyncStorage.setItem(KEY_NOTES, JSON.stringify(map));
}

export async function getCustomTasks(): Promise<CustomTask[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_CUSTOM_TASKS);
    if (raw) {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map((t: any) => ({
        id: t.id,
        title: t.title,
        stageId: t.stageId ?? 'last-week',
      }));
    }
  } catch {
    // ignore
  }
  return [];
}

export async function addCustomTask(title: string, stageId: string): Promise<CustomTask> {
  const tasks = await getCustomTasks();
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const task: CustomTask = { id, title: title.trim(), stageId };
  tasks.push(task);
  await AsyncStorage.setItem(KEY_CUSTOM_TASKS, JSON.stringify(tasks));
  return task;
}

export async function deleteCustomTask(id: string): Promise<void> {
  const tasks = await getCustomTasks();
  const next = tasks.filter((t) => t.id !== id);
  await AsyncStorage.setItem(KEY_CUSTOM_TASKS, JSON.stringify(next));
}
