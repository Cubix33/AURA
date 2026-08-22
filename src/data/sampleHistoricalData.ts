import { DailyLog, UserCycleProfile } from '../types';

export function getInitialCycleProfile(): UserCycleProfile {
  // Let's compute a lastPeriodDate roughly 18 days before today
  const today = new Date();
  const lastPeriod = new Date(today);
  lastPeriod.setDate(today.getDate() - 17); // Day 18 of current cycle

  return {
    lastPeriodDate: lastPeriod.toISOString().split('T')[0],
    averageCycleLength: 28,
    averagePeriodLength: 5,
    onboardingCompleted: true,
    hasSampleData: true,
  };
}

export function generateSampleHistoricalLogs(lastPeriodDateStr: string, cycleLength: number = 28): DailyLog[] {
  const logs: DailyLog[] = [];
  const currentPeriodStart = new Date(lastPeriodDateStr);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Helper to add days
  const addDays = (base: Date, days: number) => {
    const res = new Date(base);
    res.setDate(res.getDate() + days);
    return res;
  };

  // Cycle -3 (3 cycles ago)
  const cycle3Start = addDays(currentPeriodStart, -cycleLength * 3);
  const cycle3Entries: Array<{ day: number; feelings: string[]; notes?: string }> = [
    { day: 1, feelings: ['period_started', 'cramps', 'drained'], notes: 'Period started morning, heating pad needed' },
    { day: 2, feelings: ['period_ongoing', 'cramps', 'drained', 'headache'] },
    { day: 3, feelings: ['period_ongoing', 'sleepy', 'drained'] },
    { day: 5, feelings: ['period_ended', 'calm', 'normal_energy'] },
    { day: 8, feelings: ['energetic', 'calm', 'normal_appetite'] },
    { day: 10, feelings: ['happy', 'energetic', 'normal_libido'] },
    { day: 14, feelings: ['high_flirty', 'energetic', 'happy'], notes: 'Peak energy at work' },
    { day: 15, feelings: ['high_flirty', 'calm'] },
    { day: 19, feelings: ['calm', 'normal_energy', 'normal_appetite'] },
    { day: 22, feelings: ['extra_hungry', 'craving', 'bloated'] },
    { day: 24, feelings: ['extra_hungry', 'irritable', 'bloated', 'craving'], notes: 'Ate twice as much dinner, chocolate craving' },
    { day: 26, feelings: ['extra_hungry', 'sensitive', 'bloated', 'sleepy'] },
    { day: 27, feelings: ['irritable', 'spotting', 'breast_tenderness'] },
  ];

  cycle3Entries.forEach((entry) => {
    const entryDate = addDays(cycle3Start, entry.day - 1);
    logs.push({
      id: `log-c3-d${entry.day}`,
      date: formatDate(entryDate),
      cycleDay: entry.day,
      cycleNumber: -3,
      feelings: entry.feelings,
      notes: entry.notes,
      createdAt: entryDate.getTime(),
    });
  });

  // Cycle -2 (2 cycles ago, 29 days)
  const cycle2Start = addDays(currentPeriodStart, -cycleLength * 2 - 1);
  const cycle2Entries: Array<{ day: number; feelings: string[]; notes?: string }> = [
    { day: 1, feelings: ['period_started', 'cramps', 'drained', 'headache'] },
    { day: 2, feelings: ['period_ongoing', 'cramps', 'drained'] },
    { day: 3, feelings: ['period_ongoing', 'bloated', 'sleepy'] },
    { day: 4, feelings: ['period_ongoing', 'calm'] },
    { day: 6, feelings: ['period_ended', 'normal_energy'] },
    { day: 9, feelings: ['energetic', 'calm', 'normal_appetite'] },
    { day: 11, feelings: ['happy', 'energetic'] },
    { day: 14, feelings: ['high_flirty', 'energetic', 'happy'], notes: 'Felt very social' },
    { day: 15, feelings: ['high_flirty', 'energetic'] },
    { day: 18, feelings: ['calm', 'normal_energy'] },
    { day: 23, feelings: ['extra_hungry', 'craving', 'bloated'] },
    { day: 24, feelings: ['extra_hungry', 'irritable', 'bloated', 'craving'] },
    { day: 25, feelings: ['extra_hungry', 'sensitive', 'bloated', 'body_aches'] },
    { day: 27, feelings: ['irritable', 'drained', 'breast_tenderness'] },
  ];

  cycle2Entries.forEach((entry) => {
    const entryDate = addDays(cycle2Start, entry.day - 1);
    logs.push({
      id: `log-c2-d${entry.day}`,
      date: formatDate(entryDate),
      cycleDay: entry.day,
      cycleNumber: -2,
      feelings: entry.feelings,
      notes: entry.notes,
      createdAt: entryDate.getTime(),
    });
  });

  // Cycle -1 (Last cycle, 28 days)
  const cycle1Start = addDays(currentPeriodStart, -cycleLength);
  const cycle1Entries: Array<{ day: number; feelings: string[]; notes?: string }> = [
    { day: 1, feelings: ['period_started', 'cramps', 'drained'] },
    { day: 2, feelings: ['period_ongoing', 'cramps', 'drained', 'breast_tenderness'] },
    { day: 3, feelings: ['period_ongoing', 'sleepy'] },
    { day: 5, feelings: ['period_ended', 'calm', 'normal_energy'] },
    { day: 8, feelings: ['energetic', 'happy', 'normal_appetite'] },
    { day: 10, feelings: ['energetic', 'calm'] },
    { day: 13, feelings: ['high_flirty', 'energetic', 'happy'] },
    { day: 14, feelings: ['high_flirty', 'energetic', 'calm'] },
    { day: 15, feelings: ['high_flirty', 'happy'] },
    { day: 20, feelings: ['calm', 'normal_energy', 'normal_appetite'] },
    { day: 23, feelings: ['extra_hungry', 'craving', 'bloated'] },
    { day: 24, feelings: ['extra_hungry', 'irritable', 'bloated', 'craving'], notes: 'Unusually hungry all afternoon' },
    { day: 25, feelings: ['extra_hungry', 'sleepy', 'sensitive', 'bloated'] },
    { day: 26, feelings: ['irritable', 'bloated', 'breast_tenderness'] },
  ];

  cycle1Entries.forEach((entry) => {
    const entryDate = addDays(cycle1Start, entry.day - 1);
    logs.push({
      id: `log-c1-d${entry.day}`,
      date: formatDate(entryDate),
      cycleDay: entry.day,
      cycleNumber: -1,
      feelings: entry.feelings,
      notes: entry.notes,
      createdAt: entryDate.getTime(),
    });
  });

  // Current Cycle (Cycle 0, up to day 17)
  const currentEntries: Array<{ day: number; feelings: string[]; notes?: string }> = [
    { day: 1, feelings: ['period_started', 'cramps', 'drained'] },
    { day: 2, feelings: ['period_ongoing', 'cramps', 'drained'] },
    { day: 3, feelings: ['period_ongoing', 'sleepy'] },
    { day: 5, feelings: ['period_ended', 'calm'] },
    { day: 9, feelings: ['energetic', 'happy'] },
    { day: 13, feelings: ['high_flirty', 'energetic', 'happy'] },
    { day: 14, feelings: ['high_flirty', 'energetic'] },
  ];

  currentEntries.forEach((entry) => {
    const entryDate = addDays(currentPeriodStart, entry.day - 1);
    logs.push({
      id: `log-c0-d${entry.day}`,
      date: formatDate(entryDate),
      cycleDay: entry.day,
      cycleNumber: 0,
      feelings: entry.feelings,
      notes: entry.notes,
      createdAt: entryDate.getTime(),
    });
  });

  return logs;
}
