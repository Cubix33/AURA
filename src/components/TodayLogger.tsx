import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Activity,
  Heart,
  Zap,
  ShieldAlert,
  Droplet
} from 'lucide-react';
import { FEELING_BUCKETS, getFeelingLabel } from '../data/feelingsData';
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
  mood: <Heart className="w-4 h-4 text-[#D96B4F]" />,
  appetite: <Flame className="w-4 h-4 text-[#D67C38]" />,
  libido: <Sparkles className="w-4 h-4 text-[#B84E7D]" />,
  energy: <Zap className="w-4 h-4 text-[#C2932E]" />,
  sensations: <Activity className="w-4 h-4 text-[#5D8B6F]" />,
  period: <Droplet className="w-4 h-4 text-[#B83E3E]" />,
};

export const TodayLogger: React.FC<TodayLoggerProps> = ({
  profile,
  allLogs,
  onSaveLog,
  onExploreRhythms,
  onViewReceipts,
  onOpenSettings,
}) => {
  // Current active date string & simulated cycle day
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
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
  const [note, setNote] = useState<string>('');
  const [activeInsight, setActiveInsight] = useState<PatternInsight | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTestingPreset, setIsTestingPreset] = useState<boolean>(false);
  const [activePresetDay, setActivePresetDay] = useState<number | null>(null);

  // Compute cycle day and phase
  const cyclePhase = getCyclePhase(currentCycleDay, profile.averageCycleLength, profile.averagePeriodLength);
  const phaseName = getPhaseDisplayName(cyclePhase);
  const phaseDesc = getPhaseDescription(cyclePhase);

  const isPresetLoadingRef = React.useRef<boolean>(false);
  const justSavedRef = React.useRef<boolean>(false);

  // Load existing log for this date/day if present (only when not loading a preset simulation or just saved)
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
      setNote(existingLog.notes || '');
    } else {
      // Default empty if none
      setSelectedFeelings([]);
      setNote('');
    }
    setIsSaved(false);
  }, [currentCycleDay, selectedDate, allLogs]);

  // Dynamic live pattern preview whenever selected feelings or cycle day changes
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
    } else {
      setActiveInsight(null);
    }
  }, [selectedFeelings, currentCycleDay, allLogs, profile]);

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
      notes: note.trim() || undefined,
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

    // Clear selections and notes after saving so form is reset cleanly
    setSelectedFeelings([]);
    setNote('');
    setIsTestingPreset(false);

    // Trigger subtle confetti if a strong 3-cycle pattern was spotted
    if (insight.matchedCyclesCount >= 2) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#E89E86', '#D97C38', '#B84E7D', '#5D8B6F'],
        });
      } catch (e) {
        // Ignore confetti error
      }
    }
  };

  const handleTestDay = (day: number, feelings: string[]) => {
    // If user clicks the already active preset, toggle it off (revert to real cycle day & clear)
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

    // Also auto-expand buckets that contain any selected feelings so they are clearly visible
    const newExpanded: Record<string, boolean> = { ...expandedBuckets };
    FEELING_BUCKETS.forEach((b) => {
      const hasSelected = b.items.some((item) => !item.isUpfront && feelings.includes(item.id));
      if (hasSelected) {
        newExpanded[b.id] = true;
      }
    });
    setExpandedBuckets(newExpanded);

    // Compute insight immediately for smooth UI transition
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
    setNote('');
    setIsSaved(false);
    setActiveInsight(null);
    setIsTestingPreset(false);
    setActivePresetDay(null);
    setCurrentCycleDay(realCycleDay);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Editorial Header & Cycle Status */}
      <section className="bg-gradient-to-b from-white to-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-[#EDE5DB] shadow-xs relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#F3E2D8]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#8E3B22] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cycle Sync & Insights
              </span>
              <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2B231F] font-normal mt-1">
                Why do I feel like this today?
              </h1>
            </div>

            {/* Cycle Day Indicator Badge */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#E8E0D5] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F6EDE7] text-[#9E452B] flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] leading-none text-[#8A6A5E] font-medium">DAY</span>
                <span className="text-lg leading-tight">{currentCycleDay}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B231F]">{phaseName}</p>
                <p className="text-[11px] text-[#7A6F66]">Cycle {profile.averageCycleLength} days</p>
              </div>
            </div>
          </div>

          <p className="text-[#5A4F46] text-sm md:text-base font-serif-editorial max-w-2xl leading-relaxed">
            Log how you feel. AURA helps you spot patterns across your cycle and reveals why your body feels this way.
          </p>

          {/* Cycle Phase Visual Bar */}
          <div className="mt-6 pt-5 border-t border-[#EBE3D7]">
            <div className="flex items-center justify-between text-xs text-[#7A6F66] mb-2 font-medium">
              <span className="flex items-center gap-1.5 text-[#8E3B22] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#E06746] animate-pulse" />
                {phaseName} (Day {currentCycleDay} of {profile.averageCycleLength})
              </span>
              <span>{phaseDesc}</span>
            </div>

            {/* Interactive Progress track */}
            <div className="w-full h-3 bg-[#EAE2D7] rounded-full overflow-hidden flex p-0.5 gap-0.5">
              {/* Menstrual Phase (Days 1-5) */}
              <div
                className={`h-full rounded-l-full transition-all ${
                  cyclePhase === 'menstrual' ? 'bg-[#C95C4F] ring-1 ring-white' : 'bg-[#E5B5AF]'
                }`}
                style={{ width: `${(profile.averagePeriodLength / profile.averageCycleLength) * 100}%` }}
                title="Menstrual Phase (Days 1-5)"
              />
              {/* Follicular Phase (Days 6-12) */}
              <div
                className={`h-full transition-all ${
                  cyclePhase === 'follicular' ? 'bg-[#5D8B6F] ring-1 ring-white' : 'bg-[#BCD1C4]'
                }`}
                style={{ width: `${(7 / profile.averageCycleLength) * 100}%` }}
                title="Follicular Phase (Days 6-12)"
              />
              {/* Ovulatory Phase (Days 13-16) */}
              <div
                className={`h-full transition-all ${
                  cyclePhase === 'ovulatory' ? 'bg-[#D98A38] ring-1 ring-white' : 'bg-[#F2CCA0]'
                }`}
                style={{ width: `${(4 / profile.averageCycleLength) * 100}%` }}
                title="Ovulatory Phase (Days 13-16)"
              />
              {/* Luteal Phase (Days 17-28) */}
              <div
                className={`h-full rounded-r-full transition-all ${
                  cyclePhase === 'luteal' ? 'bg-[#8F557E] ring-1 ring-white' : 'bg-[#D8B4CC]'
                }`}
                style={{
                  width: `${
                    ((profile.averageCycleLength - profile.averagePeriodLength - 11) /
                      profile.averageCycleLength) *
                    100
                  }%`,
                }}
                title="Luteal Phase (Days 17-28)"
              />
            </div>

            {/* Quick Cycle Simulator Presets for testing & judging */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#8C7E74] font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Simulate cycle window to test pattern matching:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTestDay(24, ['extra_hungry', 'craving', 'bloated', 'irritable'])}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                    isTestingPreset && activePresetDay === 24
                      ? 'bg-[#8F557E] text-white shadow-xs'
                      : 'bg-white border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F8F3ED]'
                  }`}
                >
                  ⚡ Day 24 (Late Luteal · Hunger & Bloat)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(14, ['high_flirty', 'energetic', 'happy'])}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                    isTestingPreset && activePresetDay === 14
                      ? 'bg-[#D98A38] text-white shadow-xs'
                      : 'bg-white border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F8F3ED]'
                  }`}
                >
                  ✨ Day 14 (Ovulation · High Libido)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(1, ['cramps', 'drained', 'period_started'])}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                    isTestingPreset && activePresetDay === 1
                      ? 'bg-[#C95C4F] text-white shadow-xs'
                      : 'bg-white border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F8F3ED]'
                  }`}
                >
                  🩸 Day 1 (Period · Cramps & Rest)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestDay(8, ['calm', 'energetic', 'normal_appetite'])}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                    isTestingPreset && activePresetDay === 8
                      ? 'bg-[#5D8B6F] text-white shadow-xs'
                      : 'bg-white border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F8F3ED]'
                  }`}
                >
                  🌿 Day 8 (Follicular · Focus)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Buckets Logging Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2E2420] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h2 className="text-lg font-bold text-[#2B231F]">Tap what you feel right now</h2>
            </div>
            <p className="text-xs text-[#7A6F66] mt-0.5">
              1-tap logging across 6 key states. Upfront options shown for instant check-in, expand "+ more" for details.
            </p>
          </div>
          {selectedFeelings.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-semibold text-[#94786A] hover:text-[#5E3B2C] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear selection ({selectedFeelings.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEELING_BUCKETS.map((bucket) => {
            const isExpanded = !!expandedBuckets[bucket.id];
            const upfrontItems = bucket.items.filter((item) => item.isUpfront);
            const moreItems = bucket.items.filter((item) => !item.isUpfront);
            const selectedInBucket = bucket.items.filter((item) => selectedFeelings.includes(item.id));

            return (
              <div
                key={bucket.id}
                className="bg-white rounded-2xl p-5 border border-[#EAE3D9] shadow-xs hover:border-[#DFCFC0] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Bucket Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF5F0] border border-[#EFE5D9] flex items-center justify-center">
                        {BUCKET_ICONS[bucket.id]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#2C2420]">{bucket.title}</h3>
                        <p className="text-[11px] text-[#8C7F75]">{bucket.subtitle}</p>
                      </div>
                    </div>

                    {selectedInBucket.length > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F5EAE4] text-[#8E3B22]">
                        {selectedInBucket.length} selected
                      </span>
                    )}
                  </div>

                  {/* Upfront Feelings Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {upfrontItems.map((item) => {
                      const isSelected = selectedFeelings.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFeeling(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#2E2420] text-white shadow-xs ring-2 ring-[#2E2420]/10 scale-[1.02]'
                              : 'bg-[#F9F6F2] text-[#52463D] border border-[#E8E1D7] hover:bg-[#F2ECE4] hover:border-[#D6CAC0]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          {item.label}
                        </button>
                      );
                    })}

                    {/* Expanded More Items */}
                    <AnimatePresence>
                      {isExpanded &&
                        moreItems.map((item) => {
                          const isSelected = selectedFeelings.includes(item.id);
                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              type="button"
                              onClick={() => toggleFeeling(item.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                                isSelected
                                  ? 'bg-[#2E2420] text-white shadow-xs ring-2 ring-[#2E2420]/10 scale-[1.02]'
                                  : 'bg-[#F9F6F2] text-[#52463D] border border-[#E8E1D7] hover:bg-[#F2ECE4] hover:border-[#D6CAC0]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              {item.label}
                            </motion.button>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* + More expander if items exist */}
                {moreItems.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#F5EFE7] flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleBucketExpand(bucket.id)}
                      className="text-[11px] font-semibold text-[#8C7667] hover:text-[#523A2C] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          + {moreItems.length} more <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Optional Note & Save Button */}
      <section className="bg-white rounded-2xl p-6 border border-[#EAE3D9] shadow-xs space-y-4">
        <div>
          <label htmlFor="log-note" className="block text-xs font-bold uppercase tracking-wider text-[#7A6F66] mb-1.5">
            Personal Note (Optional)
          </label>
          <input
            id="log-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Craved chocolate in the afternoon, took an epsom bath..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#E0D7CB] bg-[#FAF8F5] text-sm text-[#2C2420] placeholder-[#A4978C] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[#7A6F66]">
            {selectedFeelings.length === 0 ? (
              <span>Tap your sensations above to discover your rhythm</span>
            ) : (
              <span className="font-medium text-[#2B231F]">
                {selectedFeelings.length} feeling{selectedFeelings.length > 1 ? 's' : ''} selected for Day {currentCycleDay}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedFeelings.length === 0}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              selectedFeelings.length > 0
                ? 'bg-[#8E3B22] text-white hover:bg-[#722F1B] active:scale-[0.98]'
                : 'bg-[#E5DCD2] text-[#968B80] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isSaved ? 'Rhythm Saved & Checked!' : 'Save & Check AURA Patterns'}
          </button>
        </div>
      </section>

      {/* Real-time / Post-Save Pattern Insight Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#8E3B22] text-white text-[11px] font-bold flex items-center justify-center">2</span>
            <h2 className="text-lg font-bold text-[#2B231F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8E3B22]" />
              Cycle Sync & Insights
            </h2>
          </div>
          <span className="text-xs text-[#8A7D73] font-medium hidden sm:inline-block">
            Scanning 3 past cycles for Cycle Day {currentCycleDay} (±2 days)
          </span>
        </div>

        <AnimatePresence mode="wait">
          {activeInsight ? (
            <motion.div
              key={activeInsight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <PatternInsightCard
                insight={activeInsight}
                onExploreRhythms={onExploreRhythms}
                onViewReceipts={onViewReceipts}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/80 rounded-2xl p-6 md:p-8 border border-dashed border-[#DDD3C7] text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5F0] border border-[#EAE0D5] flex items-center justify-center mx-auto text-[#8E3B22]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-serif-editorial text-xl text-[#2C2420]">
                  Ready to interpret your day
                </h3>
                <p className="text-xs md:text-sm text-[#7A6F66] leading-relaxed">
                  Tap any feelings above or choose a simulation preset to see what AURA has noticed across your past 3 cycles for Day {currentCycleDay}.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#8C7E74]">
                <span className="px-2.5 py-1 bg-[#F7F3EE] rounded-full border border-[#E8E1D7]">
                  🔍 Searching Cycle -1, -2, -3
                </span>
                <span className="px-2.5 py-1 bg-[#F7F3EE] rounded-full border border-[#E8E1D7]">
                  🧬 Hormonal phase context
                </span>
                <span className="px-2.5 py-1 bg-[#F7F3EE] rounded-full border border-[#E8E1D7]">
                  📋 Recurrence rate analysis
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
