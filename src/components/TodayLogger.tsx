import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Activity,
  Heart,
  Zap,
  Droplet,
  Info
} from 'lucide-react';
import { FEELING_BUCKETS } from '../data/feelingsData';
import { BucketType, DailyLog, PatternInsight, UserCycleProfile } from '../types';
import { calculateCycleDay, detectPatterns, getCyclePhase, getPhaseDescription, getPhaseDisplayName } from '../utils/patternEngine';
import { PatternInsightCard } from './PatternInsightCard';

interface TodayLoggerProps {
  profile: UserCycleProfile;
  allLogs: DailyLog[];
  onSaveLog: (log: DailyLog) => void;
  onExploreRhythms: () => void;
  onViewReceipts: () => void;
  onOpenSettings: () => void;
}

const BUCKET_ICONS: Record<BucketType, React.ReactNode> = {
  mood: <Heart className="w-3.5 h-3.5 text-[#D96B4F]" />,
  appetite: <Flame className="w-3.5 h-3.5 text-[#D67C38]" />,
  libido: <Sparkles className="w-3.5 h-3.5 text-[#B84E7D]" />,
  energy: <Zap className="w-3.5 h-3.5 text-[#C2932E]" />,
  sensations: <Activity className="w-3.5 h-3.5 text-[#5D8B6F]" />,
  period: <Droplet className="w-3.5 h-3.5 text-[#B83E3E]" />,
};

export const TodayLogger: React.FC<TodayLoggerProps> = ({
  profile,
  allLogs,
  onSaveLog,
  onExploreRhythms,
  onViewReceipts,
}) => {
  // Current active date string & simulated cycle day
  const [selectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const realCycleDay = useMemo(() => {
    return calculateCycleDay(selectedDate, profile.lastPeriodDate, profile.averageCycleLength);
  }, [selectedDate, profile.lastPeriodDate, profile.averageCycleLength]);

  const [currentCycleDay, setCurrentCycleDay] = useState<number>(() => {
    return calculateCycleDay(
      new Date().toISOString().split('T')[0],
      profile.lastPeriodDate,
      profile.averageCycleLength
    );
  });

  const [expandedBuckets, setExpandedBuckets] = useState<Record<string, boolean>>({});
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeInsight, setActiveInsight] = useState<PatternInsight | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showSecondaryDetails, setShowSecondaryDetails] = useState<boolean>(false);
  const [isTestingPreset, setIsTestingPreset] = useState<boolean>(false);
  const [activePresetDay, setActivePresetDay] = useState<number | null>(null);

  const cyclePhase = getCyclePhase(currentCycleDay, profile.averageCycleLength, profile.averagePeriodLength);
  const phaseName = getPhaseDisplayName(cyclePhase);
  const phaseDesc = getPhaseDescription(cyclePhase);

  const isPresetLoadingRef = React.useRef<boolean>(false);
  const justSavedRef = React.useRef<boolean>(false);

  // Load existing log for today if present
  useEffect(() => {
    if (isPresetLoadingRef.current) {
      isPresetLoadingRef.current = false;
      return;
    }
    if (justSavedRef.current) {
      justSavedRef.current = false;
      return;
    }
    const existingLog = allLogs.find((l) => l.date === selectedDate || (l.cycleNumber === 0 && l.cycleDay === currentCycleDay));
    if (existingLog) {
      setSelectedFeelings(existingLog.feelings);
    } else {
      setSelectedFeelings([]);
    }
    setIsSaved(false);
  }, [currentCycleDay, selectedDate, allLogs]);

  // Live pattern preview calculation
  useEffect(() => {
    if (selectedFeelings.length > 0) {
      const insight = detectPatterns(
        currentCycleDay,
        selectedFeelings,
        allLogs,
        profile.averageCycleLength,
        profile.averagePeriodLength
      );
      setActiveInsight(insight);
    } else if (!isSaved) {
      setActiveInsight(null);
    }
  }, [selectedFeelings, currentCycleDay, allLogs, profile, isSaved]);

  const toggleFeeling = (id: string) => {
    setIsSaved(false);
    setSelectedFeelings((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBucketExpand = (bucketId: string) => {
    setExpandedBuckets((prev) => ({
      ...prev,
      [bucketId]: !prev[bucketId],
    }));
  };

  const handleSave = () => {
    if (selectedFeelings.length === 0) return;

    const savedFeelings = [...selectedFeelings];
    const savedDay = currentCycleDay;

    const newLog: DailyLog = {
      id: `log-${Date.now()}`,
      date: selectedDate,
      cycleDay: currentCycleDay,
      cycleNumber: 0,
      feelings: savedFeelings,
      createdAt: Date.now(),
    };

    justSavedRef.current = true;
    onSaveLog(newLog);

    const insight = detectPatterns(
      savedDay,
      savedFeelings,
      allLogs,
      profile.averageCycleLength,
      profile.averagePeriodLength
    );
    setActiveInsight(insight);
    setIsSaved(true);

    // Trigger celebratory confetti if multi-cycle pattern detected
    if (insight.matchedCyclesCount >= 2) {
      try {
        confetti({
          particleCount: 36,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#E89E86', '#D97C38', '#B84E7D', '#5D8B6F'],
        });
      } catch (e) {
        // Ignore confetti error
      }
    }
  };

  const handleTestDay = (day: number, feelings: string[]) => {
    if (isTestingPreset && activePresetDay === day) {
      clearSelection();
      return;
    }

    isPresetLoadingRef.current = true;
    setActivePresetDay(day);
    setCurrentCycleDay(day);
    setSelectedFeelings(feelings);
    setIsTestingPreset(true);
    setIsSaved(false);

    // Auto-expand any buckets containing non-upfront feelings
    const newExpanded: Record<string, boolean> = { ...expandedBuckets };
    FEELING_BUCKETS.forEach((b) => {
      const hasSelected = b.items.some((item) => !item.isUpfront && feelings.includes(item.id));
      if (hasSelected) {
        newExpanded[b.id] = true;
      }
    });
    setExpandedBuckets(newExpanded);

    const insight = detectPatterns(
      day,
      feelings,
      allLogs,
      profile.averageCycleLength,
      profile.averagePeriodLength
    );
    setActiveInsight(insight);
  };

  const clearSelection = () => {
    setSelectedFeelings([]);
    setIsSaved(false);
    setActiveInsight(null);
    setIsTestingPreset(false);
    setActivePresetDay(null);
    setCurrentCycleDay(realCycleDay);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-12">
      {/* 1. Header: Focused on "Why do I feel like this today?" */}
      <section className="bg-white rounded-2xl p-5 md:p-6 border border-[#EAE2D7] shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#8E3B22] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Cycle Sync & Insights
            </span>
            <h1 className="font-serif-editorial text-2xl md:text-3xl text-[#2B231F] font-normal">
              Why do I feel like this today?
            </h1>
            <p className="text-xs md:text-sm text-[#6B5E54] font-serif-editorial">
              Log how you feel. AURA helps you spot patterns across your cycle.
            </p>
          </div>

          {/* Compact Cycle Day Badge */}
          <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-3 py-2 rounded-xl border border-[#EAE1D5] shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#F5E8E0] text-[#9E452B] flex flex-col items-center justify-center font-bold">
              <span className="text-[9px] leading-none text-[#8A6A5E]">DAY</span>
              <span className="text-sm leading-none font-bold">{currentCycleDay}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#2B231F] leading-tight">{phaseName}</p>
              <p className="text-[10px] text-[#857970]">Cycle {profile.averageCycleLength}d</p>
            </div>
          </div>
        </div>

        {/* Secondary Details & Cycle Bar Toggle */}
        <div className="mt-3 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowSecondaryDetails((prev) => !prev)}
            className="text-[11px] font-semibold text-[#8C7667] hover:text-[#4A382C] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#8E3B22]" />
            {showSecondaryDetails ? 'Hide cycle timeline & presets' : 'Show cycle timeline & demo presets'}
            {showSecondaryDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <span className="text-[11px] text-[#8A7E74] hidden sm:inline-block">
            {phaseDesc}
          </span>
        </div>

        {/* Expandable Secondary Cycle Bar & Demo Testing Presets */}
        <AnimatePresence>
          {showSecondaryDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 mt-2 border-t border-[#F4EFEA] space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#7A6F66] mb-1 font-medium">
                  <span className="text-[#8E3B22] font-semibold">
                    {phaseName} (Day {currentCycleDay} of {profile.averageCycleLength})
                  </span>
                  <span>{phaseDesc}</span>
                </div>
                <div className="w-full h-2.5 bg-[#EAE2D7] rounded-full overflow-hidden flex p-0.5 gap-0.5">
                  <div
                    className={`h-full rounded-l-full ${
                      cyclePhase === 'menstrual' ? 'bg-[#C95C4F]' : 'bg-[#E5B5AF]'
                    }`}
                    style={{ width: `${(profile.averagePeriodLength / profile.averageCycleLength) * 100}%` }}
                    title="Menstrual"
                  />
                  <div
                    className={`h-full ${cyclePhase === 'follicular' ? 'bg-[#5D8B6F]' : 'bg-[#BCD1C4]'}`}
                    style={{ width: `${(7 / profile.averageCycleLength) * 100}%` }}
                    title="Follicular"
                  />
                  <div
                    className={`h-full ${cyclePhase === 'ovulatory' ? 'bg-[#D98A38]' : 'bg-[#F2CCA0]'}`}
                    style={{ width: `${(4 / profile.averageCycleLength) * 100}%` }}
                    title="Ovulatory"
                  />
                  <div
                    className={`h-full rounded-r-full ${cyclePhase === 'luteal' ? 'bg-[#8F557E]' : 'bg-[#D8B4CC]'}`}
                    style={{
                      width: `${
                        ((profile.averageCycleLength - profile.averagePeriodLength - 11) /
                          profile.averageCycleLength) *
                        100
                      }%`,
                    }}
                    title="Luteal"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                <span className="text-[11px] text-[#7D7065] font-medium mr-1">Demo presets:</span>
                <button
                  type="button"
                  onClick={() => handleTestDay(24, ['extra_hungry', 'craving', 'bloated', 'irritable'])}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isTestingPreset && activePresetDay === 24
                      ? 'bg-[#8F557E] text-white shadow-xs'
                      : 'bg-[#FAF6F0] border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F2EAE0]'
                  }`}
                >
                  ⚡ Day 24 (Hunger & PMS)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(14, ['high_flirty', 'energetic', 'happy'])}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isTestingPreset && activePresetDay === 14
                      ? 'bg-[#D98A38] text-white shadow-xs'
                      : 'bg-[#FAF6F0] border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F2EAE0]'
                  }`}
                >
                  ✨ Day 14 (Ovulation & Libido)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(1, ['cramps', 'drained', 'period_started'])}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isTestingPreset && activePresetDay === 1
                      ? 'bg-[#C95C4F] text-white shadow-xs'
                      : 'bg-[#FAF6F0] border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F2EAE0]'
                  }`}
                >
                  🩸 Day 1 (Cramps & Rest)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(8, ['calm', 'energetic', 'normal_appetite'])}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isTestingPreset && activePresetDay === 8
                      ? 'bg-[#5D8B6F] text-white shadow-xs'
                      : 'bg-[#FAF6F0] border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F2EAE0]'
                  }`}
                >
                  🌿 Day 8 (Follicular Calm)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. Effortless 1-Tap Feeling Selector Grid */}
      <section className="bg-white rounded-2xl p-5 md:p-6 border border-[#EAE2D7] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2B231F]">Tap how you feel</h2>
            <p className="text-xs text-[#7A6F66]">
              Common states shown upfront. Tap one or more, then Save to see what AURA noticed.
            </p>
          </div>

          {selectedFeelings.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-semibold text-[#94786A] hover:text-[#5E3B2C] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear ({selectedFeelings.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FEELING_BUCKETS.map((bucket) => {
            const isExpanded = !!expandedBuckets[bucket.id];
            const upfrontItems = bucket.items.filter((item) => item.isUpfront);
            const moreItems = bucket.items.filter((item) => !item.isUpfront);
            const selectedInBucket = bucket.items.filter((item) => selectedFeelings.includes(item.id));

            return (
              <div
                key={bucket.id}
                className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#ECE4DA] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {BUCKET_ICONS[bucket.id]}
                      <h3 className="text-xs font-bold text-[#2C2420]">{bucket.title}</h3>
                    </div>
                    {selectedInBucket.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F4E8E1] text-[#8E3B22]">
                        {selectedInBucket.length}
                      </span>
                    )}
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {upfrontItems.map((item) => {
                      const isSelected = selectedFeelings.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFeeling(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#2E2420] text-white shadow-xs font-semibold'
                              : 'bg-white text-[#52463D] border border-[#E3D9CD] hover:bg-[#F2ECE3]'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          {item.label}
                        </button>
                      );
                    })}

                    {isExpanded &&
                      moreItems.map((item) => {
                        const isSelected = selectedFeelings.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleFeeling(item.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer select-none ${
                              isSelected
                                ? 'bg-[#2E2420] text-white shadow-xs font-semibold'
                                : 'bg-white text-[#52463D] border border-[#E3D9CD] hover:bg-[#F2ECE3]'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            {item.label}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {moreItems.length > 0 && (
                  <div className="mt-2 pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleBucketExpand(bucket.id)}
                      className="text-[10px] font-semibold text-[#8C7667] hover:text-[#523A2C] flex items-center gap-0.5 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Less <ChevronUp className="w-2.5 h-2.5" /></>
                      ) : (
                        <>+{moreItems.length} more <ChevronDown className="w-2.5 h-2.5" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Primary Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2ECE4]">
          <span className="text-xs text-[#7A6F66]">
            {selectedFeelings.length === 0 ? (
              'Select feelings above to check patterns'
            ) : (
              <span className="font-semibold text-[#2C2420]">
                {selectedFeelings.length} sensation{selectedFeelings.length > 1 ? 's' : ''} selected
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedFeelings.length === 0}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              selectedFeelings.length > 0
                ? 'bg-[#8E3B22] text-white hover:bg-[#722F1B] active:scale-[0.98]'
                : 'bg-[#E5DCD2] text-[#968B80] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isSaved ? 'Saved! See AURA Insight Below' : 'Save & Spot Patterns'}
          </button>
        </div>
      </section>

      {/* 4. AURA Instant Pattern Insight (The Core "Aha" Moment) */}
      <section className="space-y-3">
        <AnimatePresence mode="wait">
          {activeInsight ? (
            <motion.div
              key={activeInsight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PatternInsightCard
                insight={activeInsight}
                onExploreRhythms={onExploreRhythms}
                onViewReceipts={onViewReceipts}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/80 rounded-2xl p-5 md:p-6 border border-dashed border-[#DDD3C7] text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F0] border border-[#EAE0D5] flex items-center justify-center mx-auto text-[#8E3B22]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-lg text-[#2C2420]">
                AURA is ready to spot your rhythm
              </h3>
              <p className="text-xs text-[#7A6F66] max-w-sm mx-auto leading-relaxed">
                Tap your feelings above and hit Save to see how your body responded around Day {currentCycleDay} across your last 3 cycles.
              </p>
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-[#8C7E74]">
                <span className="flex items-center gap-1 bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#E9E0D4]">
                  <Info className="w-3 h-3 text-[#A8988C]" />
                  Includes 3-cycle demo history (36 benchmark logs)
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
