/**
 * Predefined pool of daily content: tips, questions, and lines.
 * Selection is deterministic per day (date key + daysToGo).
 */

export const WEDDING_TIPS = [
  'Book your venue 9–12 months ahead so you get your preferred date.',
  'Send save-the-dates 6–8 months before the wedding.',
  'Order invitations 4–5 months before so you have time for addressing.',
  'Schedule dress fittings early; alterations can take 2–3 months.',
  'Create a day-of timeline and share it with key vendors.',
  'Reserve a block of hotel rooms for out-of-town guests.',
  'Hire a day-of coordinator so you can enjoy the day.',
  'Taste cakes and catering 2–4 months before the wedding.',
  'Finalize the guest list before ordering invitations.',
  'Confirm all vendor details one week before the wedding.',
  'Break in your wedding shoes before the big day.',
  'Plan a small buffer in the timeline for photos and travel.',
  'Ask a trusted friend to handle small emergencies on the day.',
  'Write your vows early and revisit them a few times.',
  'Schedule a hair and makeup trial before the wedding.',
];

export const DAILY_QUESTIONS = [
  'What’s one thing you want to remember most about your wedding day?',
  'How do you want to feel when you say “I do”?',
  'What’s your favorite way to spend time together as a couple?',
  'What song will always remind you of this season?',
  'What’s one tradition you’d like to start as a married couple?',
  'What are you most looking forward to after the wedding?',
  'Who has been your biggest support while planning?',
  'What’s the best advice you’ve received about marriage?',
  'What small detail would make the day feel complete?',
  'How do you want guests to feel when they leave the reception?',
  'What’s one thing you’re doing just for fun, not for others?',
  'What’s your plan for the morning of the wedding?',
  'What’s one thing you’ve decided not to stress about?',
  'What are you most grateful for in your partner?',
  'What’s one way you’ll take care of yourself this week?',
];

export const DAILY_LINES = [
  'True love stories never have endings.',
  'Together is a wonderful place to be.',
  'I have found the one whom my soul loves.',
  'You are my today and all of my tomorrows.',
  'A hundred hearts would be too few to carry all my love for you.',
  'To love and be loved is to feel the sun from both sides.',
  'In a sea of people, my eyes will always search for you.',
  'Every love story is beautiful, but ours is my favorite.',
  'You are the best thing that’s ever been mine.',
  'My favorite place in all the world is next to you.',
  'Grow old along with me; the best is yet to be.',
  'Love is composed of a single soul inhabiting two bodies.',
  'The best thing to hold onto in life is each other.',
  'I choose you. And I’ll choose you over and over.',
  'Where you go I will go; where you stay I will stay.',
];

export type DailyCardType = 'tip' | 'question' | 'line';

export function getDailyCardPayload(
  dateKey: string,
  daysToGo: number
): { type: DailyCardType; content: string; id: string } {
  const dayIndex = hashStringToNumber(dateKey);
  const typeIndex = (dayIndex + daysToGo) % 3;
  const types: DailyCardType[] = ['tip', 'question', 'line'];
  const type = types[typeIndex];

  const tipIndex = (dayIndex + daysToGo * 2) % WEDDING_TIPS.length;
  const questionIndex = (dayIndex + daysToGo * 3) % DAILY_QUESTIONS.length;
  const lineIndex = (dayIndex + daysToGo * 5) % DAILY_LINES.length;

  if (type === 'tip') {
    const content = WEDDING_TIPS[tipIndex];
    return { type: 'tip', content, id: `tip-${dateKey}-${tipIndex}` };
  }
  if (type === 'question') {
    const content = DAILY_QUESTIONS[questionIndex];
    return { type: 'question', content, id: `question-${dateKey}-${questionIndex}` };
  }
  const content = DAILY_LINES[lineIndex];
  return { type: 'line', content, id: `line-${dateKey}-${lineIndex}` };
}

function hashStringToNumber(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
