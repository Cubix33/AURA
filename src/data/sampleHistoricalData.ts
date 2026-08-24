import { DailyLog, UserCycleProfile } from '../types';

/**
 * 3-Cycle Benchmark Demo Dataset (36 entries across 3 cycles)
 * As defined in the MVP Pattern Detection Specification:
 * - Cycle 1 (28 days)
 * - Cycle 2 (28 days)
 * - Cycle 3 (28 days)
 * - Current cycle (Cycle 0, in progress)
 */

export interface DemoDataset {
  user_id: string;
  profile: {
    average_cycle_length: number;
    cycles_in_history: number;
    logging_frequency: string;
    note: string;
  };
  historical_cycles: Array<{
    cycle: number;
    day: number;
    mood: string;
    appetite: string;
    libido: string;
    energy: string;
    body: string[];
    period: string;
  }>;
}

export const DEMO_BENCHMARK_RAW = [
  // CYCLE 1
  { cycle: 1, day: 2, mood: 'mellow', appetite: 'normal_appetite', libido: 'low_libido', energy: 'drained', body: ['cramps'], period: 'period_ongoing' },
  { cycle: 1, day: 5, mood: 'calm', appetite: 'normal_appetite', libido: 'low_libido', energy: 'normal_energy', body: ['bloated'], period: 'period_ended' },
  { cycle: 1, day: 7, mood: 'happy', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'period_ended' },
  { cycle: 1, day: 10, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'none' },
  { cycle: 1, day: 13, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 1, day: 15, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 1, day: 18, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: [], period: 'none' },
  { cycle: 1, day: 20, mood: 'irritable', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: ['headache'], period: 'none' },
  { cycle: 1, day: 22, mood: 'mellow', appetite: 'extra_hungry', libido: 'normal_libido', energy: 'drained', body: ['bloated'], period: 'none' },
  { cycle: 1, day: 24, mood: 'sensitive', appetite: 'craving', libido: 'normal_libido', energy: 'sleepy', body: ['bloated'], period: 'none' },
  { cycle: 1, day: 26, mood: 'mellow', appetite: 'extra_hungry', libido: 'low_libido', energy: 'drained', body: ['breast_tenderness'], period: 'none' },
  { cycle: 1, day: 28, mood: 'irritable', appetite: 'craving', libido: 'low_libido', energy: 'sleepy', body: ['cramps'], period: 'none' },

  // CYCLE 2
  { cycle: 2, day: 1, mood: 'sensitive', appetite: 'normal_appetite', libido: 'low_libido', energy: 'drained', body: ['cramps'], period: 'period_started' },
  { cycle: 2, day: 4, mood: 'calm', appetite: 'normal_appetite', libido: 'low_libido', energy: 'normal_energy', body: ['bloated'], period: 'period_ongoing' },
  { cycle: 2, day: 7, mood: 'happy', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'period_ended' },
  { cycle: 2, day: 9, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'none' },
  { cycle: 2, day: 12, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 2, day: 14, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 2, day: 17, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: [], period: 'none' },
  { cycle: 2, day: 19, mood: 'anxious', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: ['headache'], period: 'none' },
  { cycle: 2, day: 23, mood: 'mellow', appetite: 'extra_hungry', libido: 'normal_libido', energy: 'drained', body: ['bloated'], period: 'none' },
  { cycle: 2, day: 24, mood: 'sensitive', appetite: 'craving', libido: 'normal_libido', energy: 'sleepy', body: ['bloated'], period: 'none' },
  { cycle: 2, day: 26, mood: 'mellow', appetite: 'extra_hungry', libido: 'low_libido', energy: 'drained', body: ['breast_tenderness'], period: 'none' },
  { cycle: 2, day: 28, mood: 'irritable', appetite: 'craving', libido: 'low_libido', energy: 'sleepy', body: ['cramps'], period: 'none' },

  // CYCLE 3
  { cycle: 3, day: 2, mood: 'mellow', appetite: 'normal_appetite', libido: 'low_libido', energy: 'drained', body: ['cramps'], period: 'period_ongoing' },
  { cycle: 3, day: 5, mood: 'calm', appetite: 'normal_appetite', libido: 'low_libido', energy: 'normal_energy', body: ['bloated'], period: 'period_ended' },
  { cycle: 3, day: 8, mood: 'happy', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'period_ended' },
  { cycle: 3, day: 10, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'none' },
  { cycle: 3, day: 13, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 3, day: 15, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  { cycle: 3, day: 18, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: [], period: 'none' },
  { cycle: 3, day: 21, mood: 'irritable', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'normal_energy', body: ['headache'], period: 'none' },
  { cycle: 3, day: 23, mood: 'mellow', appetite: 'extra_hungry', libido: 'normal_libido', energy: 'drained', body: ['bloated'], period: 'none' },
  { cycle: 3, day: 25, mood: 'sensitive', appetite: 'craving', libido: 'normal_libido', energy: 'sleepy', body: ['bloated'], period: 'none' },
  { cycle: 3, day: 26, mood: 'mellow', appetite: 'extra_hungry', libido: 'low_libido', energy: 'drained', body: ['breast_tenderness'], period: 'none' },
  { cycle: 3, day: 28, mood: 'irritable', appetite: 'craving', libido: 'low_libido', energy: 'sleepy', body: ['cramps'], period: 'none' }
];

export function getInitialCycleProfile(): UserCycleProfile {
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

  const addDays = (base: Date, days: number) => {
    const res = new Date(base);
    res.setDate(res.getDate() + days);
    return res;
  };

  // Build Cycle -3 (cycle: 1 in raw data), Cycle -2 (cycle: 2), Cycle -1 (cycle: 3)
  const cycleIndexMap: Record<number, number> = {
    1: -3,
    2: -2,
    3: -1,
  };

  DEMO_BENCHMARK_RAW.forEach((item, index) => {
    const pastCycleNum = cycleIndexMap[item.cycle];
    const cycleOffset = Math.abs(pastCycleNum); // 3, 2, or 1
    const cycleStartDate = addDays(currentPeriodStart, -cycleLength * cycleOffset);
    const entryDate = addDays(cycleStartDate, item.day - 1);

    const feelingsList: string[] = [];
    if (item.mood && item.mood !== 'none') feelingsList.push(item.mood);
    if (item.appetite && item.appetite !== 'none') feelingsList.push(item.appetite);
    if (item.libido && item.libido !== 'none') feelingsList.push(item.libido);
    if (item.energy && item.energy !== 'none') feelingsList.push(item.energy);
    if (Array.isArray(item.body)) {
      feelingsList.push(...item.body);
    }
    if (item.period && item.period !== 'none') feelingsList.push(item.period);

    logs.push({
      id: `demo-c${item.cycle}-d${item.day}-${index}`,
      date: formatDate(entryDate),
      cycleDay: item.day,
      cycleNumber: pastCycleNum,
      feelings: feelingsList,
      notes: undefined,
      createdAt: entryDate.getTime(),
    });
  });

  // Current Cycle (Cycle 0, up to Day 17)
  const currentEntries = [
    { day: 2, mood: 'mellow', appetite: 'normal_appetite', libido: 'low_libido', energy: 'drained', body: ['cramps'], period: 'period_ongoing' },
    { day: 5, mood: 'calm', appetite: 'normal_appetite', libido: 'low_libido', energy: 'normal_energy', body: ['bloated'], period: 'period_ended' },
    { day: 8, mood: 'happy', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'period_ended' },
    { day: 10, mood: 'calm', appetite: 'normal_appetite', libido: 'normal_libido', energy: 'energetic', body: [], period: 'none' },
    { day: 13, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
    { day: 15, mood: 'happy', appetite: 'normal_appetite', libido: 'high_flirty', energy: 'energetic', body: [], period: 'none' },
  ];

  currentEntries.forEach((item, index) => {
    const entryDate = addDays(currentPeriodStart, item.day - 1);
    const feelingsList: string[] = [];
    if (item.mood && item.mood !== 'none') feelingsList.push(item.mood);
    if (item.appetite && item.appetite !== 'none') feelingsList.push(item.appetite);
    if (item.libido && item.libido !== 'none') feelingsList.push(item.libido);
    if (item.energy && item.energy !== 'none') feelingsList.push(item.energy);
    if (Array.isArray(item.body)) {
      feelingsList.push(...item.body);
    }
    if (item.period && item.period !== 'none') feelingsList.push(item.period);

    logs.push({
      id: `current-c0-d${item.day}-${index}`,
      date: formatDate(entryDate),
      cycleDay: item.day,
      cycleNumber: 0,
      feelings: feelingsList,
      createdAt: entryDate.getTime(),
    });
  });

  return logs;
}
