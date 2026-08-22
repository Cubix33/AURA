export type BucketType = 'mood' | 'appetite' | 'libido' | 'energy' | 'sensations' | 'period';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface FeelingItem {
  id: string;
  label: string;
  bucket: BucketType;
  iconName?: string;
  isUpfront: boolean;
  colorClass?: string;
}

export interface BucketDefinition {
  id: BucketType;
  title: string;
  subtitle: string;
  description: string;
  items: FeelingItem[];
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  cycleDay: number; // 1-based index (e.g. Day 1 to 28)
  cycleNumber: number; // 0 for current, -1 for last cycle, -2 for 2 cycles ago, etc.
  feelings: string[]; // FeelingItem ids
  notes?: string;
  createdAt: number;
}

export interface UserCycleProfile {
  lastPeriodDate: string; // YYYY-MM-DD
  averageCycleLength: number; // e.g. 28
  averagePeriodLength: number; // e.g. 5
  onboardingCompleted: boolean;
  hasSampleData: boolean;
}

export interface MatchedCycleOccurrence {
  cycleNumber: number; // -1, -2, -3, or 0
  cycleLabel: string; // e.g. "Last cycle (Aug)", "2 cycles ago (Jul)"
  cycleDay: number;
  date: string;
  matchingFeelings: string[];
}

export interface PatternInsight {
  id: string;
  isMatch: boolean;
  headline: string;
  subheadline?: string;
  explanation: string;
  symptomLabels: string[];
  buckets: BucketType[];
  cyclePhase: CyclePhase;
  phaseName: string;
  cycleDayRange: [number, number];
  matchedCyclesCount: number;
  totalPastCyclesAnalyzed: number;
  occurrences: MatchedCycleOccurrence[];
  hormoneContext?: {
    estrogenTrend: 'rising' | 'peaking' | 'dropping' | 'low';
    progesteroneTrend: 'rising' | 'peaking' | 'dropping' | 'low';
    summary: string;
  };
  actionableTip?: string;
}

export interface BodyReceipt {
  id: string;
  title: string;
  feelings: string[];
  feelingLabels: string[];
  bucket: BucketType;
  phase: CyclePhase;
  cycleDaysRange: string;
  recurrenceRate: number; // percentage, e.g. 100% or 67%
  cyclesPresentCount: number;
  totalCyclesCount: number;
  headline: string;
  patternDescription: string;
  biologicalWhy: string;
  quote: string;
}
