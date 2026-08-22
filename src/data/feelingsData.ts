import { BucketDefinition, FeelingItem } from '../types';

export const FEELING_BUCKETS: BucketDefinition[] = [
  {
    id: 'mood',
    title: 'Mood',
    subtitle: 'Emotional state & nervous system',
    description: 'How your mind and emotional climate feel right now',
    items: [
      { id: 'calm', label: 'Calm', bucket: 'mood', isUpfront: true },
      { id: 'irritable', label: 'Irritable', bucket: 'mood', isUpfront: true },
      { id: 'anxious', label: 'Anxious', bucket: 'mood', isUpfront: true },
      { id: 'happy', label: 'Happy', bucket: 'mood', isUpfront: false },
      { id: 'mellow', label: 'Mellow', bucket: 'mood', isUpfront: false },
      { id: 'sensitive', label: 'Sensitive', bucket: 'mood', isUpfront: false },
    ],
  },
  {
    id: 'appetite',
    title: 'Appetite',
    subtitle: 'Metabolism & food cues',
    description: 'Hunger levels, cravings, and digestive rhythms',
    items: [
      { id: 'normal_appetite', label: 'Normal', bucket: 'appetite', isUpfront: true },
      { id: 'extra_hungry', label: 'Extra hungry', bucket: 'appetite', isUpfront: true },
      { id: 'craving', label: 'Craving', bucket: 'appetite', isUpfront: true },
      { id: 'low_appetite', label: 'Low appetite', bucket: 'appetite', isUpfront: false },
    ],
  },
  {
    id: 'libido',
    title: 'Libido',
    subtitle: 'Sensuality & vitality',
    description: 'Drive, intimacy inclination, and connection desire',
    items: [
      { id: 'normal_libido', label: 'Normal', bucket: 'libido', isUpfront: true },
      { id: 'high_flirty', label: 'High / flirty', bucket: 'libido', isUpfront: true },
      { id: 'low_libido', label: 'Low', bucket: 'libido', isUpfront: true },
    ],
  },
  {
    id: 'energy',
    title: 'Energy',
    subtitle: 'Physical & mental fuel',
    description: 'Stamina, sleepiness, and focus capacity',
    items: [
      { id: 'normal_energy', label: 'Normal', bucket: 'energy', isUpfront: true },
      { id: 'energetic', label: 'Energetic', bucket: 'energy', isUpfront: true },
      { id: 'drained', label: 'Drained', bucket: 'energy', isUpfront: true },
      { id: 'sleepy', label: 'Sleepy', bucket: 'energy', isUpfront: false },
    ],
  },
  {
    id: 'sensations',
    title: 'Body sensations',
    subtitle: 'Physical signals & tension',
    description: 'Sensory feedback from muscles, joints, and organs',
    items: [
      { id: 'cramps', label: 'Cramps', bucket: 'sensations', isUpfront: true },
      { id: 'bloated', label: 'Bloated', bucket: 'sensations', isUpfront: true },
      { id: 'headache', label: 'Headache', bucket: 'sensations', isUpfront: true },
      { id: 'breast_tenderness', label: 'Breast tenderness', bucket: 'sensations', isUpfront: false },
      { id: 'body_aches', label: 'Body aches', bucket: 'sensations', isUpfront: false },
    ],
  },
  {
    id: 'period',
    title: 'Period',
    subtitle: 'Menstrual flow tracking',
    description: 'Start, flow state, spotting, or conclusion',
    items: [
      { id: 'period_started', label: 'Started', bucket: 'period', isUpfront: true },
      { id: 'period_ongoing', label: 'Ongoing', bucket: 'period', isUpfront: true },
      { id: 'spotting', label: 'Spotting', bucket: 'period', isUpfront: true },
      { id: 'period_ended', label: 'Ended', bucket: 'period', isUpfront: false },
    ],
  },
];

export const ALL_FEELINGS_MAP: Record<string, FeelingItem> = {};
FEELING_BUCKETS.forEach((b) => {
  b.items.forEach((item) => {
    ALL_FEELINGS_MAP[item.id] = item;
  });
});

export function getFeelingLabel(id: string): string {
  return ALL_FEELINGS_MAP[id]?.label || id;
}

export function getFeelingBucket(id: string): string {
  return ALL_FEELINGS_MAP[id]?.bucket || 'other';
}
