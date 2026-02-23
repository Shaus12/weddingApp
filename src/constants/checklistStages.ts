/**
 * Wedding checklist: stage buckets and predefined tasks.
 * Stages are by time-to-wedding (days). Completion and notes persisted separately.
 */

export interface ChecklistStage {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
}

export interface ChecklistTask {
  id: string;
  title: string;
  stageId: string;
  suggestedTiming: string;
}

export const CHECKLIST_STAGES: ChecklistStage[] = [
  { id: '6-12', label: '6–12 months', minDays: 180, maxDays: 365 },
  { id: '3-6', label: '3–6 months', minDays: 90, maxDays: 179 },
  { id: '1-3', label: '1–3 months', minDays: 30, maxDays: 89 },
  { id: 'last-month', label: 'Last month', minDays: 7, maxDays: 29 },
  { id: 'last-week', label: 'Last week', minDays: 0, maxDays: 6 },
];

export const CHECKLIST_TASKS: ChecklistTask[] = [
  { id: 'venue', title: 'Book venue', stageId: '6-12', suggestedTiming: '9–12 months before' },
  { id: 'budget', title: 'Set budget & priorities', stageId: '6-12', suggestedTiming: 'Early on' },
  { id: 'guest-list', title: 'Draft guest list', stageId: '6-12', suggestedTiming: 'Before invitations' },
  { id: 'vendors', title: 'Book photographer & videographer', stageId: '6-12', suggestedTiming: '8–12 months before' },
  { id: 'caterer', title: 'Choose caterer', stageId: '6-12', suggestedTiming: '6–9 months before' },
  { id: 'save-dates', title: 'Send save-the-dates', stageId: '3-6', suggestedTiming: '6–8 months before' },
  { id: 'dress', title: 'Order wedding dress / attire', stageId: '3-6', suggestedTiming: '6–9 months before' },
  { id: 'bridal-party', title: 'Ask wedding party', stageId: '3-6', suggestedTiming: '4–6 months before' },
  { id: 'registry', title: 'Create registry', stageId: '3-6', suggestedTiming: '4–6 months before' },
  { id: 'invites', title: 'Order invitations', stageId: '3-6', suggestedTiming: '4–5 months before' },
  { id: 'flowers', title: 'Book florist', stageId: '3-6', suggestedTiming: '3–6 months before' },
  { id: 'music', title: 'Book DJ or band', stageId: '3-6', suggestedTiming: '3–6 months before' },
  { id: 'cake', title: 'Order wedding cake', stageId: '1-3', suggestedTiming: '2–3 months before' },
  { id: 'hair-makeup', title: 'Schedule hair & makeup trial', stageId: '1-3', suggestedTiming: '1–2 months before' },
  { id: 'favors', title: 'Order favors (if any)', stageId: '1-3', suggestedTiming: '1–2 months before' },
  { id: 'seating', title: 'Plan seating chart', stageId: '1-3', suggestedTiming: '1 month before' },
  { id: 'final-count', title: 'Final headcount to caterer', stageId: 'last-month', suggestedTiming: '2 weeks before' },
  { id: 'marriage-license', title: 'Get marriage license', stageId: 'last-month', suggestedTiming: '1–2 weeks before' },
  { id: 'rehearsal', title: 'Confirm rehearsal time', stageId: 'last-month', suggestedTiming: '1 week before' },
  { id: 'payments', title: 'Final payments to vendors', stageId: 'last-week', suggestedTiming: '1 week before' },
  { id: 'confirm-vendors', title: 'Confirm all vendors', stageId: 'last-week', suggestedTiming: '3–5 days before' },
  { id: 'pack-bag', title: 'Pack day-of bag', stageId: 'last-week', suggestedTiming: '2–3 days before' },
];

export function getStageForDaysToGo(daysToGo: number): string | null {
  for (const stage of CHECKLIST_STAGES) {
    if (daysToGo >= stage.minDays && daysToGo <= stage.maxDays) return stage.id;
  }
  if (daysToGo > 365) return CHECKLIST_STAGES[0].id;
  if (daysToGo < 0) return CHECKLIST_STAGES[CHECKLIST_STAGES.length - 1].id;
  return null;
}

export function getTasksByStage(): { stage: ChecklistStage; tasks: ChecklistTask[] }[] {
  return CHECKLIST_STAGES.map((stage) => ({
    stage,
    tasks: CHECKLIST_TASKS.filter((t) => t.stageId === stage.id),
  }));
}
