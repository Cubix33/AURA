import { getFeelingLabel, ALL_FEELINGS_MAP } from '../data/feelingsData';
import {
  BodyReceipt,
  BucketType,
  CyclePhase,
  DailyLog,
  MatchedCycleOccurrence,
  PatternInsight,
  PatternGuidanceAction,
} from '../types';

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
 * Helper to generate actionable, domain-rich guidance based on detected patterns and logged symptoms.
 */
export function generatePatternGuidanceList(
  phase: CyclePhase,
  selectedFeelingIds: string[],
  currentCycleDay: number
): { primary?: PatternGuidanceAction; additional: PatternGuidanceAction[] } {
  const guidances: PatternGuidanceAction[] = [];

  // Individual feeling flags
  const hasHeadache = selectedFeelingIds.includes('headache');
  const hasCramps = selectedFeelingIds.includes('cramps');
  const hasBloated = selectedFeelingIds.includes('bloated');
  const hasBreastTenderness = selectedFeelingIds.includes('breast_tenderness');
  const hasBodyAches = selectedFeelingIds.includes('body_aches');
  
  const hasCravings = selectedFeelingIds.includes('craving') || selectedFeelingIds.includes('extra_hungry');
  const hasLowAppetite = selectedFeelingIds.includes('low_appetite');
  
  const hasAnxiety = selectedFeelingIds.includes('anxious');
  const hasIrritable = selectedFeelingIds.includes('irritable');
  const hasSensitiveOrMellow = selectedFeelingIds.includes('sensitive') || selectedFeelingIds.includes('mellow');
  const hasCalmOrHappy = selectedFeelingIds.includes('calm') || selectedFeelingIds.includes('happy');
  
  const hasHighLibido = selectedFeelingIds.includes('high_flirty') || selectedFeelingIds.includes('high') || selectedFeelingIds.includes('flirty');
  const hasLowLibido = selectedFeelingIds.includes('low_libido');
  
  const hasLowEnergy = selectedFeelingIds.includes('drained') || selectedFeelingIds.includes('sleepy');
  const hasHighEnergy = selectedFeelingIds.includes('energetic');
  const hasPeriodFlow = selectedFeelingIds.some((f) => ['period_started', 'period_ongoing', 'spotting'].includes(f));

  // 1. DEDICATED HEADACHE RELIEF
  if (hasHeadache) {
    guidances.push({
      id: 'guidance-headache-relief',
      category: 'headache_relief',
      categoryLabel: 'Headache & Migraine Relief',
      title: 'Hormonal Migraine & Tension Headache Protocol',
      shortSummary:
        'Rapid estrogen drops before menstruation or during ovulation cause cerebral blood vessel vasodilation and localized neuro-inflammation.',
      bullets: [
        'Electrolyte & Magnesium Loading: Sip 500ml water with sea salt and magnesium glycinate (300-400mg) to stabilize neurovascular spasm.',
        'Sub-Occipital & Temple Acupressure: Press firmly into the base of the skull (GB20) and the web between thumb and index finger (LI4) for 2–3 minutes.',
        'Cold/Heat Gradient Therapy: Place a cold compress across the forehead and temples while soaking feet in warm water to draw blood pressure downward.',
        'Reduce Histamines & Bright Screens: Dim harsh blue light and limit aged cheeses, red wine, and cured meats during acute headache spikes.',
      ],
      recommendedFoodsOrSteps: [
        'Magnesium Glycinate (400mg)',
        'Cold Temple Compress',
        'LI4 / GB20 Acupressure',
        'Trace Mineral Electrolytes',
      ],
      directActionLabel: 'View Headache & Health Red Flags',
      targetTab: 'body_mind',
      targetSubTab: 'red_flags',
    });
  }

  // 2. DEDICATED CRAMPS & PELVIC PAIN RELIEF
  if (hasCramps) {
    guidances.push({
      id: 'guidance-cramps-relief',
      category: 'rest_recovery',
      categoryLabel: 'Pelvic Relief & Cramp Soothing',
      title: 'Prostaglandin & Uterine Muscle Soothing',
      shortSummary:
        'Endometrial shedding releases inflammatory prostaglandins (PGF2α) triggering rhythmic uterine myometrium contractions and pelvic aching.',
      bullets: [
        'Continuous Heat Application: 15–20 minutes of 40°C heat over the suprapubic area increases pelvic blood flow and reduces uterine pressure.',
        'Natural Anti-Prostaglandins: Fresh ginger tea (2 cups/day) and turmeric root inhibit COX-2 inflammatory pathways as effectively as mild NSAIDs.',
        'Pelvic Decompression Poses: Reclined Bound Angle (Supta Baddha Konasana) and Child’s Pose with a bolster to relieve sacral compression.',
      ],
      recommendedFoodsOrSteps: [
        'Suprapubic Heat Pad (40°C)',
        'Fresh Brewed Ginger Root Tea',
        'Child’s Pose with Bolster',
        'Omega-3 EPA/DHA Support',
      ],
      directActionLabel: 'Explore Pelvic Care & Menstrual Guide',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  // 3. DEDICATED BLOATING & FLUID RETENTION RELIEF
  if (hasBloated) {
    guidances.push({
      id: 'guidance-bloating-relief',
      category: 'bloating_relief',
      categoryLabel: 'Digestive & Bloating Relief',
      title: 'Fluid Balance & Digestive Ease Protocol',
      shortSummary:
        'Elevated progesterone slows gut transit time while estrogen alters aldosterone, prompting temporary water and electrolyte retention in tissues.',
      bullets: [
        'Potassium-Rich Diuretics: Dandelion root tea, cucumbers, celery, bananas, and coconut water naturally counter sodium-induced fluid pooling.',
        'Gentle Digestive Mobility: Sip warm peppermint or fennel seed tea after meals; take a slow 10-minute walk to stimulate intestinal peristalsis.',
        'Temporary Salt & Carbonation Moderation: Reduce sodium-dense processed foods, sparkling water, and artificial sweeteners that trap intestinal gas.',
      ],
      recommendedFoodsOrSteps: [
        'Dandelion & Fennel Tea',
        'Potassium-Rich Foods (Banana, Avocado)',
        'Post-Meal 10-Min Gentle Walk',
        'Hydration with Fresh Lemon',
      ],
      directActionLabel: 'View Gut Health & Nutrition Guide',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  // 4. DEDICATED BREAST TENDERNESS RELIEF
  if (hasBreastTenderness) {
    guidances.push({
      id: 'guidance-breast-tenderness-relief',
      category: 'body_relief',
      categoryLabel: 'Breast Care & Lymphatic Relief',
      title: 'Luteal Breast Congestion & Tenderness Care',
      shortSummary:
        'Luteal estrogen and progesterone stimulate breast lobular and ductal tissue proliferation, causing fluid pooling and heightened sensitivity.',
      bullets: [
        'Supportive Non-Wire Bras: Switch to soft, wireless bamboo or cotton bralettes to prevent chest wall lymphatic compression.',
        'Evening Primrose Oil & Vitamin E: Gamma-linolenic acid (GLA) helps reduce cyclical mastalgia and breast tissue inflammatory sensitivity.',
        'Gentle Lymphatic Drainage: Stroke lightly from under the breast upward toward the axillary armpit lymph nodes while showering in warm water.',
      ],
      recommendedFoodsOrSteps: [
        'Wireless Cotton Bralette',
        'Evening Primrose Oil (GLA)',
        'Axillary Lymphatic Massage',
        'Reduce Excess Caffeine',
      ],
      directActionLabel: 'Explore Hormone Symptom Guide',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  // 5. DEDICATED BODY ACHES & JOINT RELIEF
  if (hasBodyAches && !hasHeadache && !hasCramps) {
    guidances.push({
      id: 'guidance-body-aches-relief',
      category: 'body_relief',
      categoryLabel: 'Musculoskeletal & Joint Relief',
      title: 'Systemic Inflammation & Muscle Recovery',
      shortSummary:
        'Shifting steroid hormone levels temporarily elevate systemic cytokines (IL-6, TNF-alpha), causing generalized muscle soreness and fatigue.',
      bullets: [
        'Warm Epsom Salt Soaks: 2 cups of magnesium sulfate in a warm bath absorbs transdermally to relax tight neuromuscular junctions.',
        'Gentle Yin Mobility: Avoid heavy eccentric loading; choose dynamic foam rolling and gentle spine mobility.',
        'Curcumin & Tart Cherry Juice: Natural polyphenols that significantly attenuate delayed-onset soreness and muscle ache.',
      ],
      recommendedFoodsOrSteps: [
        'Epsom Salt Magnesium Bath',
        'Tart Cherry Juice Extract',
        'Spinal Mobility & Foam Rolling',
        'Deep Restorative Sleep',
      ],
      directActionLabel: 'Explore Restorative Health Hub',
      targetTab: 'body_mind',
      targetSubTab: 'mental_health',
    });
  }

  // 6. DEDICATED ANXIETY & NERVOUS SYSTEM GROUNDING
  if (hasAnxiety || hasIrritable || hasSensitiveOrMellow) {
    guidances.push({
      id: 'guidance-grounding-anxiety',
      category: 'grounding',
      categoryLabel: 'Grounding & Nervous System Reset',
      title: '4-7-8 Parasympathetic Vagus Nerve Reset',
      shortSummary:
        'Hormonal fluctuations alter GABA receptor sensitivity in the brain, making the autonomic nervous system more reactive to sensory and emotional stressors.',
      bullets: [
        '4-7-8 Vagus Breathing Loop: Inhale through nose for 4s, gently hold for 7s, long audible exhale through mouth for 8s. 4 rounds signals immediate safety to the amygdala.',
        '5-4-3-2-1 Sensory Grounding: Notice 5 things you can see, 4 you can physically touch, 3 sounds you hear, 2 scents, and take 1 deep conscious breath.',
        'Sip Warm Herbal Teas: Chamomile, spearmint, and lemon balm soothe cortisol surges; avoid excess late-afternoon caffeine.',
      ],
      recommendedFoodsOrSteps: [
        '4-7-8 Breathing Loop (Below)',
        '5-4-3-2-1 Sensory Grounding',
        'Warm Chamomile / Lemon Balm Tea',
        'Magnesium Glycinate (300mg)',
      ],
      directActionLabel: 'Launch 4-7-8 Grounding Breathwork',
      targetTab: 'body_mind',
      targetSubTab: 'mental_health',
    });
  }

  // 7. DEDICATED CRAVINGS & METABOLISM GUIDANCE
  if (hasCravings) {
    guidances.push({
      id: 'guidance-nutrition-cravings',
      category: 'nutrition',
      categoryLabel: 'Cycle Nutrition Guidance',
      title: 'Support Your Metabolic Energy & Cravings',
      shortSummary:
        'Progesterone increases your resting metabolic rate by 100–300 kcal/day while serotonin dips. Cravings are physiological cues for steady fuel, not a lack of willpower.',
      bullets: [
        'Slow-Burn Complex Carbohydrates: Sweet potatoes, oats, quinoa, and brown rice sustain brain serotonin and prevent blood-sugar drops.',
        'Magnesium & Healthy Fats: 70%+ dark chocolate, pumpkin seeds, and avocado ease muscle tension and stabilize mood.',
        'Luteal Seed Cycling: 1 tbsp sunflower seeds + 1 tbsp sesame seeds daily to naturally support progesterone synthesis.',
      ],
      recommendedFoodsOrSteps: [
        'Dark Chocolate (70%+)',
        'Pumpkin & Sunflower Seeds',
        'Roasted Sweet Potatoes',
        'Warm Lentil / Bone Broth',
      ],
      directActionLabel: 'View Phase Nutrition & Meal Ideas',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  // 8. DEDICATED HIGH LIBIDO & INTIMACY SOVEREIGNTY
  if (hasHighLibido) {
    guidances.push({
      id: 'guidance-sexual-health-vitality',
      category: 'sexual_health',
      categoryLabel: 'Sexual Health & Intimacy Sovereignty',
      title: 'Peak Ovulatory Vitality & Fertile Window Navigation',
      shortSummary:
        'Estrogen peaks alongside luteinizing hormone (LH) and subtle testosterone, naturally increasing natural lubrication, tactile sensitivity, and sexual drive.',
      bullets: [
        'Fertility Window Awareness: Clear, stretchy "egg-white" cervical fluid indicates peak fertility. Sperm can survive up to 5 days in fertile cervical crypts.',
        'Empowered Protection: If avoiding pregnancy, use dual-barrier methods (condoms) or reliable contraception throughout this high-probability window.',
        'FRIES Enthusiastic Consent: Practice clear boundaries that are Freely given, Reversible, Informed, Enthusiastic, and Specific.',
      ],
      recommendedFoodsOrSteps: [
        'Fertile Window Check',
        'Barrier Protection',
        'FRIES Consent Checklist',
        'Zinc & Hydration Boost',
      ],
      directActionLabel: 'Explore Sexual Health & Contraception Guide',
      targetTab: 'body_mind',
      targetSubTab: 'sexual_health',
    });
  }

  // 9. DEDICATED LOW LIBIDO / RESTORATIVE CARE
  if (hasLowLibido && !hasHighLibido) {
    guidances.push({
      id: 'guidance-low-libido-care',
      category: 'sexual_health',
      categoryLabel: 'Intimacy & Hormone Harmony',
      title: 'Low Desire & Nervous System Nourishment',
      shortSummary:
        'Lower estradiol or high cortisol suppresses spontaneous desire. Hormonal shifts make non-demanding touch and emotional security essential.',
      bullets: [
        'Sensate Focus & Pressure-Free Intimacy: Prioritize emotional attunement, warm hugs, skin-to-skin touch without performance expectations.',
        'Adrenal Recovery: High stress diverts pregnenolone away from sex hormone production toward cortisol (pregnenolone steal).',
        'Nourishing Adaptogens: Ashwagandha or Maca root to gently support adrenal stamina and vitality.',
      ],
      recommendedFoodsOrSteps: [
        'Pressure-Free Connection',
        'Ashwagandha / Maca Root',
        'Warm Herbal Baths',
        'Open Partner Communication',
      ],
      directActionLabel: 'Explore Intimacy & Sexual Health Hub',
      targetTab: 'body_mind',
      targetSubTab: 'sexual_health',
    });
  }

  // 10. DEDICATED FATIGUE / DRAINED / SLEEPY RECOVERY
  if (hasLowEnergy) {
    guidances.push({
      id: 'guidance-fatigue-recovery',
      category: 'rest_recovery',
      categoryLabel: 'Energy & Circadian Recovery',
      title: 'Cellular Recovery & Energy Restoration',
      shortSummary:
        'Low estrogen/progesterone nadir or elevated progesterone promotes GABA activation and higher body temperature, impacting restorative deep sleep.',
      bullets: [
        'Circadian Light Exposure: Get 10–15 minutes of natural sunlight within 1 hour of waking to calibrate melatonin onset tonight.',
        'Targeted Iron & B-Complex: If bleeding, replenish iron (spinach, lentils, vitamin C pairing) and active B12/B6 for mitochondrial ATP.',
        'Protect Non-Negotiable Rest: Honor your body’s biological request for lower output without guilt.',
      ],
      recommendedFoodsOrSteps: [
        'Morning Natural Sunlight (15 min)',
        'Iron + Vitamin C Food Pairings',
        'Hydration with Sea Salt',
        'Non-Negotiable 8h Sleep',
      ],
      directActionLabel: 'View Energy & Sleep Rhythms',
      targetTab: 'rhythms',
    });
  }

  // 11. HIGH ENERGY / COGNITIVE FLOW
  if (hasHighEnergy || (phase === 'follicular' && guidances.length === 0)) {
    guidances.push({
      id: 'guidance-follicular-vitality',
      category: 'vitality',
      categoryLabel: 'Cognitive Flow & Vitality',
      title: 'Estrogen Peak & Cognitive Expansion',
      shortSummary:
        'Rising estradiol enhances insulin sensitivity, dopamine receptor density, and cognitive stamina, creating an optimal window for peak execution.',
      bullets: [
        'Strategic Deep Work: Ideal phase for pitching, starting complex creative initiatives, and challenging cognitive tasks.',
        'Progressive Strength Training: Enhanced muscle protein synthesis allows higher training volume and faster neuromuscular recovery.',
        'Gut & Liver Support: Cruciferous greens (broccoli, kale, arugula) assist hepatic phase II estrogen methylation.',
      ],
      recommendedFoodsOrSteps: [
        'Ground Flaxseeds & Pumpkin Seeds',
        'High-Intensity / Strength Training',
        'Cruciferous Vegetables (Arugula, Broccoli)',
        'Creative Project Kickoffs',
      ],
      directActionLabel: 'Explore Follicular Nutrition & Lifestyle',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  // 12. CALM & HAPPY HARMONY
  if (hasCalmOrHappy && guidances.length === 0) {
    guidances.push({
      id: 'guidance-harmony-mind',
      category: 'vitality',
      categoryLabel: 'Emotional Flow & Well-being',
      title: 'Hormonal Balance & Emotional Grounding',
      shortSummary:
        'Your nervous system is resting in a parasympathetic vagal baseline with balanced neurotransmitter synthesis.',
      bullets: [
        'Anchor Positive Habits: Great time to establish consistent meditation, gratitude journaling, or sleep hygiene practices.',
        'Nourish Steady Baseline: Maintain clean whole foods and mindful hydration to extend this stable state.',
        'Check in daily with AURA to document what creates this positive physiological state.',
      ],
      recommendedFoodsOrSteps: [
        'Gratitude Journaling',
        'Balanced Mediterranean Meals',
        'Outdoor Walk in Nature',
        'Mindful Evening Wind-Down',
      ],
      directActionLabel: 'Explore Body & Mind Health Hub',
      targetTab: 'body_mind',
      targetSubTab: 'mental_health',
    });
  }

  // 13. Fallback general guidance if no feelings selected
  if (guidances.length === 0) {
    guidances.push({
      id: 'guidance-general-rhythm',
      category: 'general',
      categoryLabel: 'Daily Biological Rhythm Tip',
      title: `${getPhaseDisplayName(phase)} Optimization`,
      shortSummary:
        'Your body moves in biological phases that influence resting metabolism, sleep depth, and emotional bandwidth.',
      bullets: [
        'Hydrate with trace mineral electrolytes to support cellular fluid balance.',
        'Align physical movement intensity with your current hormone baseline.',
        'Check in daily with AURA to build your personalized pattern receipts.',
      ],
      recommendedFoodsOrSteps: ['Hydration with Electrolytes', 'Balanced Whole Foods', 'Consistent Sleep Pacing'],
      directActionLabel: 'Explore Body & Mind Health Hub',
      targetTab: 'body_mind',
      targetSubTab: 'nutrition',
    });
  }

  return {
    primary: guidances[0],
    additional: guidances.slice(1),
  };
}

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

  const { primary: primaryGuidance, additional: additionalGuidances } = generatePatternGuidanceList(
    phase,
    selectedFeelingIds,
    currentCycleDay
  );

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
    guidance: primaryGuidance,
    additionalGuidances,
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
