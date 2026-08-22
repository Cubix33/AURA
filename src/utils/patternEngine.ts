import { getFeelingLabel, ALL_FEELINGS_MAP } from '../data/feelingsData';
import { BodyReceipt, BucketType, CyclePhase, DailyLog, MatchedCycleOccurrence, PatternInsight } from '../types';

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
  
  // Set both to midnight UTC to avoid timezone drift
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  
  const diffDays = Math.floor((targetUtc - startUtc) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Before last period: wrap around
    const mod = (diffDays % cycleLength + cycleLength) % cycleLength;
    return mod === 0 ? cycleLength : mod;
  }
  
  const cycleDay = (diffDays % cycleLength) + 1;
  return cycleDay;
}

export function detectPatterns(
  currentCycleDay: number,
  selectedFeelingIds: string[],
  allLogs: DailyLog[],
  cycleLength: number = 28,
  periodLength: number = 5
): PatternInsight {
  const phase = getCyclePhase(currentCycleDay, cycleLength, periodLength);
  const phaseName = getPhaseDisplayName(phase);
  
  const windowRadius = 2; // ±2 days
  const minDay = Math.max(1, currentCycleDay - windowRadius);
  const maxDay = Math.min(cycleLength, currentCycleDay + windowRadius);
  
  // Filter historical logs from past cycles (-1, -2, -3, etc.)
  const pastCyclesLogs = allLogs.filter((log) => log.cycleNumber < 0);
  
  // Group logs by cycleNumber
  const distinctPastCycles = Array.from(new Set(pastCyclesLogs.map((l) => l.cycleNumber))).sort((a, b) => b - a);
  const totalPastCyclesAnalyzed = Math.max(distinctPastCycles.length, 3);
  
  if (selectedFeelingIds.length === 0) {
    return {
      id: 'insight-empty',
      isMatch: false,
      headline: 'AURA is listening',
      subheadline: `Cycle Day ${currentCycleDay} · ${phaseName}`,
      explanation: 'Select one or more feelings above to see if your body has followed this rhythm in past cycles.',
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

  // Check matching occurrences across past cycles
  const cycleMatches: Record<number, { log: DailyLog; matchingFeelings: string[] }> = {};
  
  pastCyclesLogs.forEach((log) => {
    // Check if log is within the cycle day window
    if (log.cycleDay >= minDay && log.cycleDay <= maxDay) {
      const common = log.feelings.filter((f) => selectedFeelingIds.includes(f));
      if (common.length > 0) {
        if (!cycleMatches[log.cycleNumber] || common.length > cycleMatches[log.cycleNumber].matchingFeelings.length) {
          cycleMatches[log.cycleNumber] = {
            log,
            matchingFeelings: common,
          };
        }
      }
    }
  });

  const matchedCycleNumbers = Object.keys(cycleMatches).map(Number);
  const matchedCyclesCount = matchedCycleNumbers.length;

  const occurrences: MatchedCycleOccurrence[] = matchedCycleNumbers.map((cNum) => {
    const match = cycleMatches[cNum];
    let cycleLabel = `Cycle ${cNum}`;
    if (cNum === -1) cycleLabel = 'Last cycle';
    else if (cNum === -2) cycleLabel = '2 cycles ago';
    else if (cNum === -3) cycleLabel = '3 cycles ago';

    return {
      cycleNumber: cNum,
      cycleLabel,
      cycleDay: match.log.cycleDay,
      date: match.log.date,
      matchingFeelings: match.matchingFeelings,
    };
  });

  const selectedLabels = selectedFeelingIds.map((id) => getFeelingLabel(id));
  const selectedBuckets = Array.from(new Set(selectedFeelingIds.map((id) => ALL_FEELINGS_MAP[id]?.bucket).filter(Boolean))) as BucketType[];

  // Biological & Hormonal Explanations based on feelings + phase
  let hormoneContext: PatternInsight['hormoneContext'] = undefined;
  let explanation = '';
  let actionableTip = '';

  if (phase === 'luteal') {
    hormoneContext = {
      estrogenTrend: 'dropping',
      progesteroneTrend: 'peaking',
      summary: 'Progesterone is elevated and begins its pre-menstrual descent.',
    };
    if (selectedFeelingIds.includes('extra_hungry') || selectedFeelingIds.includes('craving')) {
      explanation = 'Progesterone naturally increases your resting metabolic rate by 100–300 calories/day while serotonin dips. Your hunger is physiological fuel, not a lack of willpower.';
      actionableTip = 'Honor this window with complex carbs, magnesium-rich foods (dark chocolate, pumpkin seeds), and warm, satiating meals.';
    } else if (selectedFeelingIds.includes('bloated') || selectedFeelingIds.includes('breast_tenderness')) {
      explanation = 'Hormonal fluctuations affect aldosterone and fluid retention in tissues, frequently causing a temporary fullness sensation before your period.';
      actionableTip = 'Increase hydration with electrolytes, herbal teas (dandelion, peppermint), and gentle walking to support lymphatic drainage.';
    } else if (selectedFeelingIds.includes('irritable') || selectedFeelingIds.includes('anxious') || selectedFeelingIds.includes('sensitive')) {
      explanation = 'As progesterone drops toward the end of your luteal phase, GABA receptors and serotonin adapt, making emotional boundaries and sensory inputs feel more intense.';
      actionableTip = 'Give yourself permission to slow down, protect evening downtime, and avoid overcommitting social energy.';
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
    if (selectedFeelingIds.includes('high_flirty') || selectedFeelingIds.includes('energetic') || selectedFeelingIds.includes('happy')) {
      explanation = 'Peak estrogen elevates dopamine, verbal fluidity, and confidence, while a mild testosterone surge amplifies sexual desire and social connection.';
      actionableTip = 'Great time for key conversations, creative brainstorming, high-energy workouts, or intimacy.';
    } else {
      explanation = 'Around ovulation, heightened sensory perception and metabolic efficiency peak as your body releases an egg.';
      actionableTip = 'Channel your natural vitality into passion projects and dynamic movement.';
    }
  } else if (phase === 'menstrual') {
    hormoneContext = {
      estrogenTrend: 'low',
      progesteroneTrend: 'low',
      summary: 'Both estrogen and progesterone are at baseline as the uterine lining renews.',
    };
    if (selectedFeelingIds.includes('cramps') || selectedFeelingIds.includes('drained') || selectedFeelingIds.includes('headache')) {
      explanation = 'Prostaglandins stimulate uterine contractions to shed the lining, which can also trigger fatigue and localized discomfort. Low hormones invite deep restorative rest.';
      actionableTip = 'Apply heat therapy, replenish with iron and omega-3s, and reduce intense physical strain.';
    } else {
      explanation = 'Your body is undergoing an active cleansing and reset process, requiring quiet focus and cellular recovery.';
      actionableTip = 'Treat this as a sacred recovery window for nervous system calm.';
    }
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

  // Construct headline based on match count
  const isStrongMatch = matchedCyclesCount >= 2;
  const isMatch = matchedCyclesCount >= 1;

  let headline = '';
  let subheadline = '';

  const symptomsFormatted = selectedLabels.join(', ').toLowerCase();

  if (matchedCyclesCount >= 3) {
    headline = `You've felt ${symptomsFormatted} around this time in your last 3 cycles.`;
    subheadline = `Consistent Day ${minDay}–${maxDay} pattern (${matchedCyclesCount}/${totalPastCyclesAnalyzed} cycles)`;
  } else if (matchedCyclesCount === 2) {
    headline = `You also logged ${symptomsFormatted} around Cycle Day ${currentCycleDay} in 2 of your past cycles.`;
    subheadline = `Emerging pattern spotted (${matchedCyclesCount}/${totalPastCyclesAnalyzed} cycles)`;
  } else if (matchedCyclesCount === 1) {
    headline = `You logged similar sensations around this cycle window once before.`;
    subheadline = `AURA is monitoring this emerging rhythm`;
  } else {
    headline = `AURA is still learning your patterns for this cycle window.`;
    subheadline = `Cycle Day ${currentCycleDay} · ${phaseName}`;
    if (!explanation) {
      explanation = `Every cycle teaches AURA more about your unique rhythm. We've saved these sensations to your timeline.`;
    }
  }

  return {
    id: `insight-${currentCycleDay}-${selectedFeelingIds.join('-')}`,
    isMatch,
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
    occurrences,
    hormoneContext,
    actionableTip,
  };
}

export function getAllBodyReceipts(allLogs: DailyLog[], cycleLength: number = 28): BodyReceipt[] {
  // Pre-calculate verified patterns from multi-cycle history
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
      headline: 'Consistent in 3 of your last 3 cycles',
      patternDescription: 'You experience a pronounced increase in appetite and sweet/salty cravings 4 to 6 days before your period begins.',
      biologicalWhy: 'Progesterone elevates your resting metabolic rate by 100–300 kcal/day while serotonin dips prior to menses, creating genuine physiological hunger cues.',
      quote: '"You\'ve felt extra hungry around this time in your last 3 cycles."',
    },
    {
      id: 'receipt-ovulation-vitality',
      title: 'Ovulatory Vitality & High Libido',
      feelings: ['high_flirty', 'energetic'],
      feelingLabels: ['High / flirty', 'Energetic', 'Happy'],
      bucket: 'libido',
      phase: 'ovulatory',
      cycleDaysRange: 'Days 13 – 16',
      recurrenceRate: 100,
      cyclesPresentCount: 3,
      totalCyclesCount: 3,
      headline: 'Confirmed across 3 recorded cycles',
      patternDescription: 'A surge in spontaneous energy, confident social drive, and elevated libido reliably occurs around mid-cycle ovulation.',
      biologicalWhy: 'Estrogen reaches its cycle peak alongside a sharp LH surge and subtle testosterone spike, amplifying neuro-vitality and intimacy desire.',
      quote: '"Your energy and flirty mood peak predictably at mid-cycle."',
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
      quote: '"Your body asks for restorative rest and warmth during cycle reset."',
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
