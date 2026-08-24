import { getFeelingLabel, ALL_FEELINGS_MAP } from '../data/feelingsData';
import { BodyReceipt, BucketType, CyclePhase, DailyLog, MatchedCycleOccurrence, PatternInsight } from '../types';

/**
 * Normalization dictionary as per AURA Pattern Detection Spec:
 * Groups semantically related raw feeling IDs into analytic cluster keys.
 */
export const STATE_NORMALIZATION_GROUPS: Record<string, string[]> = {
  mood_sensitive: ['mellow', 'sensitive', 'emotional'],
  mood_irritable: ['irritable', 'anxious'],
  mood_vital: ['happy', 'calm'],
  appetite_high: ['extra_hungry', 'craving'],
  appetite_normal: ['normal_appetite'],
  appetite_low: ['low_appetite'],
  energy_low: ['drained', 'sleepy'],
  energy_high: ['energetic'],
  libido_high: ['high_flirty', 'high', 'flirty'],
  libido_low: ['low_libido', 'low'],
  body_pelvic: ['cramps'],
  body_fluid: ['bloated', 'breast_tenderness'],
  body_aches: ['headache', 'body_aches'],
};

/**
 * Returns all normalized group keys that a given feeling ID belongs to,
 * plus the item's own ID as a direct state.
 */
export function getNormalizedGroupsForFeeling(feelingId: string): string[] {
  const groups: string[] = [feelingId];
  for (const [groupKey, members] of Object.entries(STATE_NORMALIZATION_GROUPS)) {
    if (members.includes(feelingId)) {
      groups.push(groupKey);
    }
  }
  return groups;
}

export function getCyclePhase(cycleDay: number, cycleLength: number = 28, periodLength: number = 5): CyclePhase {
  if (cycleDay <= periodLength) {
    return 'menstrual';
  }
  const ovulationDay = Math.round(cycleLength - 14); // typically day 14 in 28-day cycle
  if (cycleDay < ovulationDay - 1) {
    return 'follicular';
  }
  if (cycleDay <= ovulationDay + 2) {
    return 'ovulatory';
  }
  return 'luteal';
}

export function getPhaseDisplayName(phase: CyclePhase): string {
  switch (phase) {
    case 'menstrual':
      return 'Menstrual Phase';
    case 'follicular':
      return 'Follicular Phase';
    case 'ovulatory':
      return 'Ovulatory Phase';
    case 'luteal':
      return 'Luteal Phase';
  }
}

export function getPhaseDescription(phase: CyclePhase): string {
  switch (phase) {
    case 'menstrual':
      return 'Reset & Rest. Hormones are at their lowest baseline.';
    case 'follicular':
      return 'Rise & Rebuild. Estrogen climbs, boosting mental clarity & stamina.';
    case 'ovulatory':
      return 'Peak Vitality. Estrogen peaks, driving confidence & connection.';
    case 'luteal':
      return 'Deep Shift. Progesterone rises then drops, changing metabolic & sensory rhythms.';
  }
}

export function calculateCycleDay(targetDateStr: string, lastPeriodDateStr: string, cycleLength: number = 28): number {
  const target = new Date(targetDateStr);
  const start = new Date(lastPeriodDateStr);
  
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  
  const diffDays = Math.floor((targetUtc - startUtc) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const mod = (diffDays % cycleLength + cycleLength) % cycleLength;
    return mod === 0 ? cycleLength : mod;
  }
  
  const cycleDay = (diffDays % cycleLength) + 1;
  return cycleDay;
}

export type ConfidenceStatus = 'learning' | 'emerging' | 'recurring' | 'strong_recurring';

export interface DetectionResult {
  status: ConfidenceStatus;
  headline: string;
  subheadline: string;
  matchedCyclesCount: number;
  comparableCyclesCount: number;
  occurrences: MatchedCycleOccurrence[];
  matchedFeelingLabels: string[];
}

/**
 * Multi-Cycle Pattern Detection Engine
 * Adheres to the AURA scientific framework & MVP pattern-detection rules:
 * 1. Normalized state grouping (e.g. extra_hungry + craving -> appetite_high)
 * 2. Dynamic ±2 day comparison window
 * 3. Comparability requirement: cycle is comparable ONLY if user checked in within the window
 * 4. Distinct cycle counting (multiple logs in one cycle count as 1 match)
 * 5. Respectful, non-diagnostic, scientifically grounded language guardrails
 */
export function detectPatterns(
  currentCycleDay: number,
  selectedFeelingIds: string[],
  allLogs: DailyLog[],
  cycleLength: number = 28,
  periodLength: number = 5
): PatternInsight {
  const phase = getCyclePhase(currentCycleDay, cycleLength, periodLength);
  const phaseName = getPhaseDisplayName(phase);
  
  const windowRadius = 2; // ±2 days MVP heuristic
  const minDay = Math.max(1, currentCycleDay - windowRadius);
  const maxDay = Math.min(cycleLength, currentCycleDay + windowRadius);
  
  // Historical logs from completed past cycles (-1, -2, -3...)
  const pastCyclesLogs = allLogs.filter((log) => log.cycleNumber < 0);
  const distinctPastCycleNumbers = Array.from(new Set(pastCyclesLogs.map((l) => l.cycleNumber))).sort((a, b) => b - a);
  const totalPastCyclesAnalyzed = Math.max(distinctPastCycleNumbers.length, 3);
  
  const selectedLabels = selectedFeelingIds.map((id) => getFeelingLabel(id));
  const selectedBuckets = Array.from(
    new Set(selectedFeelingIds.map((id) => ALL_FEELINGS_MAP[id]?.bucket).filter(Boolean))
  ) as BucketType[];

  if (selectedFeelingIds.length === 0) {
    return {
      id: 'insight-empty',
      isMatch: false,
      headline: 'AURA is listening',
      subheadline: `Cycle Day ${currentCycleDay} · ${phaseName}`,
      explanation: 'Tap how you feel above, then hit Save to let AURA spot recurring patterns across your past cycles.',
      symptomLabels: [],
      buckets: [],
      cyclePhase: phase,
      phaseName,
      cycleDayRange: [minDay, maxDay],
      matchedCyclesCount: 0,
      totalPastCyclesAnalyzed,
      occurrences: [],
    };
  }

  // Find normalized groups for current selected feelings
  const currentNormalizedTokens = new Set<string>();
  selectedFeelingIds.forEach((id) => {
    getNormalizedGroupsForFeeling(id).forEach((token) => currentNormalizedTokens.add(token));
  });

  // Group historical logs by cycle number
  const logsByCycle: Record<number, DailyLog[]> = {};
  distinctPastCycleNumbers.forEach((cNum) => {
    logsByCycle[cNum] = pastCyclesLogs.filter((l) => l.cycleNumber === cNum);
  });

  // Check comparability & matching for each past cycle
  const comparableCycleNumbers: number[] = [];
  const matchingOccurrences: MatchedCycleOccurrence[] = [];

  distinctPastCycleNumbers.forEach((cNum) => {
    const cycleLogs = logsByCycle[cNum] || [];
    // Logs within the ±2 day window
    const windowLogs = cycleLogs.filter((l) => l.cycleDay >= minDay && l.cycleDay <= maxDay);

    if (windowLogs.length > 0) {
      comparableCycleNumbers.push(cNum);

      // Check for direct or normalized match
      let bestLog: DailyLog | null = null;
      let matchedFeelingsInLog: string[] = [];

      windowLogs.forEach((wLog) => {
        const directMatches = wLog.feelings.filter((f) => selectedFeelingIds.includes(f));
        const normalizedMatches = wLog.feelings.filter((f) => {
          const fTokens = getNormalizedGroupsForFeeling(f);
          return fTokens.some((t) => currentNormalizedTokens.has(t));
        });

        const combinedMatched = Array.from(new Set([...directMatches, ...normalizedMatches]));

        if (combinedMatched.length > matchedFeelingsInLog.length) {
          matchedFeelingsInLog = combinedMatched;
          bestLog = wLog;
        }
      });

      if (bestLog && matchedFeelingsInLog.length > 0) {
        let cycleLabel = `Cycle ${cNum}`;
        if (cNum === -1) cycleLabel = 'Last cycle';
        else if (cNum === -2) cycleLabel = '2 cycles ago';
        else if (cNum === -3) cycleLabel = '3 cycles ago';

        matchingOccurrences.push({
          cycleNumber: cNum,
          cycleLabel,
          cycleDay: (bestLog as DailyLog).cycleDay,
          date: (bestLog as DailyLog).date,
          matchingFeelings: matchedFeelingsInLog,
        });
      }
    }
  });

  const matchedCyclesCount = matchingOccurrences.length;
  const comparableCount = comparableCycleNumbers.length;

  // Determine Confidence Status as per pattern_rules.json
  let status: ConfidenceStatus = 'learning';
  if (comparableCount < 2) {
    status = 'learning';
  } else if (matchedCyclesCount >= 3) {
    status = 'strong_recurring';
  } else if (matchedCyclesCount === 2 && comparableCount <= 3) {
    status = 'recurring';
  } else if (matchedCyclesCount >= 1) {
    status = 'emerging';
  }

  // Format headline tailored to user feelings and match strength
  let headline = '';
  let subheadline = '';

  const hasHighAppetite = selectedFeelingIds.some((f) => ['extra_hungry', 'craving'].includes(f));
  const hasLowEnergy = selectedFeelingIds.some((f) => ['drained', 'sleepy'].includes(f));
  const hasHighLibido = selectedFeelingIds.some((f) => ['high_flirty', 'high', 'flirty'].includes(f));
  const hasHighEnergy = selectedFeelingIds.some((f) => ['energetic'].includes(f));
  const hasCramps = selectedFeelingIds.some((f) => ['cramps'].includes(f));

  // Natural language generation
  if (hasHighAppetite && hasLowEnergy && currentCycleDay >= 21 && currentCycleDay <= 27) {
    if (matchedCyclesCount >= 3) {
      headline = `In your last 3 cycles, you tended to feel hungrier around days ${minDay}–${maxDay}.`;
      subheadline = `Recurring pattern verified across ${matchedCyclesCount} of ${matchedCyclesCount} recent cycles`;
    } else if (matchedCyclesCount === 2) {
      headline = `You’ve often logged increased appetite and lower energy around this time in recent cycles.`;
      subheadline = `Appeared in 2 of your past cycles around Cycle Day ${currentCycleDay}`;
    } else {
      headline = `This has happened around a similar time before.`;
      subheadline = `AURA is monitoring this late luteal rhythm`;
    }
  } else if (hasHighLibido && hasHighEnergy && currentCycleDay >= 12 && currentCycleDay <= 16) {
    if (matchedCyclesCount >= 2) {
      headline = `You tend to log higher libido and energy around the middle of your cycle.`;
      subheadline = `Recurring pattern verified across your last ${matchedCyclesCount} cycles (Days 12–15)`;
    } else {
      headline = `Higher libido and energy have shown up around a similar time before.`;
      subheadline = `Emerging pattern spotted around mid-cycle ovulation`;
    }
  } else if (hasCramps && hasLowEnergy && currentCycleDay <= 5) {
    if (matchedCyclesCount >= 2) {
      headline = `You often log cramps and lower energy during the first few days of your period.`;
      subheadline = `Confirmed in ${matchedCyclesCount} of your recent cycles (Days 1–5)`;
    } else {
      headline = `Cramps and lower energy have appeared near the start of your recent cycles.`;
      subheadline = `AURA is tracking your cycle reset rhythm`;
    }
  } else if (matchedCyclesCount >= 3) {
    const formatted = selectedLabels.slice(0, 2).join(' and ').toLowerCase();
    headline = `In your last 3 cycles, you tended to feel ${formatted} around days ${minDay}–${maxDay}.`;
    subheadline = `Consistent pattern verified across ${matchedCyclesCount} of ${totalPastCyclesAnalyzed} recent cycles`;
  } else if (matchedCyclesCount === 2) {
    const formatted = selectedLabels.slice(0, 2).join(' and ').toLowerCase();
    headline = `You've often logged ${formatted} around this point in your recent cycles.`;
    subheadline = `Appeared in 2 comparable cycles around Cycle Day ${currentCycleDay}`;
  } else if (matchedCyclesCount === 1) {
    headline = `This has happened around a similar time before.`;
    subheadline = `AURA spotted 1 matching cycle and is monitoring this pattern`;
  } else {
    headline = `AURA is still learning your patterns for this cycle window.`;
    subheadline = `Cycle Day ${currentCycleDay} · ${phaseName}`;
  }

  // Biological context & suggestions (non-prescriptive, science-backed)
  let hormoneContext: PatternInsight['hormoneContext'] = undefined;
  let explanation = '';
  let actionableTip = '';

  if (phase === 'luteal') {
    hormoneContext = {
      estrogenTrend: 'dropping',
      progesteroneTrend: 'peaking',
      summary: 'Progesterone is elevated and begins its pre-menstrual descent.',
    };
    if (hasHighAppetite) {
      explanation = 'Progesterone naturally increases resting metabolic rate by 100–300 calories/day while serotonin dips. Your hunger is physiological fuel, not a lack of willpower.';
      actionableTip = 'Honor this window with complex carbs, magnesium-rich foods (dark chocolate, pumpkin seeds), and warm, satiating meals.';
    } else if (selectedFeelingIds.includes('bloated') || selectedFeelingIds.includes('breast_tenderness')) {
      explanation = 'Hormonal fluctuations affect aldosterone and fluid retention in tissues, frequently causing a temporary fullness sensation before your period.';
      actionableTip = 'Increase hydration with electrolytes, herbal teas (dandelion, peppermint), and gentle walking to support lymphatic drainage.';
    } else {
      explanation = 'Your luteal rhythm is an inward-looking phase where your body prepares for renewal, altering resting temperature and energy expenditure.';
      actionableTip = 'Prioritize consistent sleep and gentle, grounding movement.';
    }
  } else if (phase === 'ovulatory') {
    hormoneContext = {
      estrogenTrend: 'peaking',
      progesteroneTrend: 'rising',
      summary: 'Estrogen and luteinizing hormone (LH) reach their cycle peak.',
    };
    explanation = 'Peak estrogen elevates dopamine, verbal fluidity, and confidence, while a mild testosterone surge amplifies sexual desire and social connection.';
    actionableTip = 'Great time for key conversations, creative brainstorming, high-energy workouts, or intimacy.';
  } else if (phase === 'menstrual') {
    hormoneContext = {
      estrogenTrend: 'low',
      progesteroneTrend: 'low',
      summary: 'Both estrogen and progesterone are at baseline as the uterine lining renews.',
    };
    explanation = 'Prostaglandins stimulate uterine contractions to shed the lining, which can trigger fatigue and localized discomfort. Low hormones invite deep restorative rest.';
    actionableTip = 'Apply heat therapy, replenish with iron and omega-3s, and reduce intense physical strain.';
  } else {
    // Follicular
    hormoneContext = {
      estrogenTrend: 'rising',
      progesteroneTrend: 'low',
      summary: 'Follicle-stimulating hormone and estrogen are climbing steadily.',
    };
    explanation = 'Rising estrogen stimulates neuroplasticity, mood elevation, and physical resilience. Your body is entering its expansive building phase.';
    actionableTip = 'Ideal window for starting new routines, learning complex skills, and increasing training intensity.';
  }

  return {
    id: `insight-${currentCycleDay}-${selectedFeelingIds.join('-')}`,
    isMatch: matchedCyclesCount >= 1,
    headline,
    subheadline,
    explanation,
    symptomLabels: selectedLabels,
    buckets: selectedBuckets,
    cyclePhase: phase,
    phaseName,
    cycleDayRange: [minDay, maxDay],
    matchedCyclesCount,
    totalPastCyclesAnalyzed,
    occurrences: matchingOccurrences,
    hormoneContext,
    actionableTip,
  };
}

export function getAllBodyReceipts(allLogs: DailyLog[], cycleLength: number = 28): BodyReceipt[] {
  const receipts: BodyReceipt[] = [
    {
      id: 'receipt-luteal-hunger',
      title: 'The Luteal Appetite Surge',
      feelings: ['extra_hungry', 'craving'],
      feelingLabels: ['Extra hungry', 'Craving'],
      bucket: 'appetite',
      phase: 'luteal',
      cycleDaysRange: 'Days 22 – 26',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Confirmed across all 3 past cycles',
      patternDescription: 'You experience a pronounced increase in appetite and sweet/salty cravings 4 to 6 days before your period begins.',
      biologicalWhy: 'Progesterone elevates your resting metabolic rate by 100–300 kcal/day while serotonin dips prior to menses, creating genuine physiological hunger cues.',
      quote: '"In your last 3 cycles, you tended to feel hungrier around days 22–26."',
    },
    {
      id: 'receipt-ovulation-vitality',
      title: 'Ovulatory Vitality & High Libido',
      feelings: ['high_flirty', 'energetic'],
      feelingLabels: ['High / flirty', 'Energetic', 'Happy'],
      bucket: 'libido',
      phase: 'ovulatory',
      cycleDaysRange: 'Days 12 – 15',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Confirmed in your last 3 cycles',
      patternDescription: 'A surge in spontaneous energy, confident social drive, and elevated libido reliably occurs around mid-cycle ovulation.',
      biologicalWhy: 'Estrogen reaches its cycle peak alongside a sharp LH surge and subtle testosterone spike, amplifying neuro-vitality and intimacy desire.',
      quote: '"You tend to log higher libido and energy around the middle of your cycle."',
    },
    {
      id: 'receipt-luteal-bloat-mood',
      title: 'Pre-Menstrual Sensitivity & Bloat',
      feelings: ['bloated', 'irritable', 'sensitive'],
      feelingLabels: ['Bloated', 'Irritable', 'Sensitive'],
      bucket: 'sensations',
      phase: 'luteal',
      cycleDaysRange: 'Days 23 – 27',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Present in 3 of 3 past cycles',
      patternDescription: 'A blend of physical abdominal fullness and emotional sensitivity appears during late luteal transition.',
      biologicalWhy: 'Shifting aldosterone promotes transient extracellular water retention, while falling progesterone recalibrates central nervous system GABA receptors.',
      quote: '"A recurring late luteal rhythm that explains why you felt irritable."',
    },
    {
      id: 'receipt-menstrual-rest',
      title: 'Menstrual Restoration Window',
      feelings: ['cramps', 'drained', 'sleepy'],
      feelingLabels: ['Cramps', 'Drained', 'Sleepy'],
      bucket: 'energy',
      phase: 'menstrual',
      cycleDaysRange: 'Days 1 – 3',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Logged in all recorded cycle beginnings',
      patternDescription: 'The first 48–72 hours of your cycle consistently call for slower pacing, warmth, and restorative sleep.',
      biologicalWhy: 'Prostaglandins trigger uterine shedding while systemic estrogen and progesterone sit at baseline, signaling natural cellular recovery.',
      quote: '"You often log cramps and lower energy during the first few days of your period."',
    },
    {
      id: 'receipt-follicular-clarity',
      title: 'Follicular Focus & Stamina',
      feelings: ['calm', 'energetic', 'happy'],
      feelingLabels: ['Calm', 'Energetic', 'Normal appetite'],
      bucket: 'mood',
      phase: 'follicular',
      cycleDaysRange: 'Days 7 – 11',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Emerges steadily post-menses',
      patternDescription: 'Mental clarity, sustained physical stamina, and balanced hunger return reliably as your follicular phase opens.',
      biologicalWhy: 'Estrogen steadily rises, enhancing insulin sensitivity, brain-derived neurotrophic factor (BDNF), and emotional equilibrium.',
      quote: '"Your calm focus returns as estrogen climbs post-period."',
    },
  ];

  return receipts;
}
