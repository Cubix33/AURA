import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Flame,
  Activity,
  Heart,
  Zap,
  Droplet,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Compass
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

const BUCKET_CONFIG: Record<
  BucketType,
  {
    icon: React.ReactNode;
    accentColor: string;
    lightBg: string;
    border: string;
    textColor: string;
  }
> = {
  mood: {
    icon: <Heart className="w-4 h-4 text-[#D0563E]" />,
    accentColor: '#D0563E',
    lightBg: '#FDF6F4',
    border: '#F6DDD6',
    textColor: '#8E3220',
  },
  appetite: {
    icon: <Flame className="w-4 h-4 text-[#D9772B]" />,
    accentColor: '#D9772B',
    lightBg: '#FDF7F2',
    border: '#F6E4D5',
    textColor: '#964812',
  },
  libido: {
    icon: <Sparkles className="w-4 h-4 text-[#B84E7D]" />,
    accentColor: '#B84E7D',
    lightBg: '#FCF4F8',
    border: '#F7D9E7',
    textColor: '#7E2D52',
  },
  energy: {
    icon: <Zap className="w-4 h-4 text-[#C28C1E]" />,
    accentColor: '#C28C1E',
    lightBg: '#FCF9F2',
    border: '#F7ECCF',
    textColor: '#7D5708',
  },
  sensations: {
    icon: <Activity className="w-4 h-4 text-[#4B8361]" />,
    accentColor: '#4B8361',
    lightBg: '#F4F9F6',
    border: '#DBEBE0',
    textColor: '#2D583F',
  },
  period: {
    icon: <Droplet className="w-4 h-4 text-[#BF3D3D]" />,
    accentColor: '#BF3D3D',
    lightBg: '#FDF4F4',
    border: '#F7D8D8',
    textColor: '#7D2222',
  },
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
  const [notes, setNotes] = useState<string>(''); 
  const [activeInsight, setActiveInsight] = useState<PatternInsight | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTestingPreset, setIsTestingPreset] = useState<boolean>(false);
  const [activePresetDay, setActivePresetDay] = useState<number | null>(null);

  const cyclePhase = getCyclePhase(currentCycleDay, profile.averageCycleLength, profile.averagePeriodLength);
  const phaseName = getPhaseDisplayName(cyclePhase);
  const phaseDesc = getPhaseDescription(cyclePhase);

  const isPresetLoadingRef = React.useRef<boolean>(false);
  const justSavedRef = React.useRef<boolean>(false);

  // Automatically update the displayed cycle day if the profile settings change
  useEffect(() => {
    setCurrentCycleDay(realCycleDay);
  }, [realCycleDay]);
  
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
    
    if (existingLog && existingLog.feelings.length > 0) {
      setSelectedFeelings(existingLog.feelings);
      setNotes(existingLog.notes || '');
      // Calculate pattern for existing saved logs
      const insight = detectPatterns(
        currentCycleDay,
        existingLog.feelings,
        allLogs,
        profile.averageCycleLength,
        profile.averagePeriodLength
      );
      setActiveInsight(insight);
      setIsSaved(true);
    } else {
      setSelectedFeelings([]);
      setNotes('');
      setActiveInsight(null); // Hide when there is no saved log
      setIsSaved(false);
    }
  }, [currentCycleDay, selectedDate, allLogs]);

  const toggleFeeling = (id: string) => {
    setIsSaved(false);
    setActiveInsight(null);
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
      notes: notes.trim() !== '' ? notes.trim() : undefined,
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
    setNotes('');
    setIsSaved(false);
    setActiveInsight(null);
    setIsTestingPreset(false);
    setActivePresetDay(null);
    setCurrentCycleDay(realCycleDay);
  };

  return (
    <div className="w-full pb-16 space-y-6">
      {/* Top Banner: Editorial Hero Bar */}
      <div className="bg-gradient-to-r from-[#2B231F] via-[#382E29] to-[#251E1A] rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#483B33]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#8E3B22] text-[#F9ECE7]">
              Cycle Sync & Insights
            </span>
            <span className="text-xs text-[#C7BCB3]">· Day {currentCycleDay} of {profile.averageCycleLength}</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#FAF7F2] font-normal leading-tight">
            Why do I feel like this today?
          </h1>
          <p className="text-xs sm:text-sm text-[#B8ACA2]">
            Log how you feel right now. AURA connects your sensations directly to your cycle history.
          </p>
        </div>

        {/* Phase Pill Badge */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <span className="text-[10px] text-[#C7BCB3] uppercase font-semibold block leading-none">Current Phase</span>
            <p className="text-sm font-bold text-white mt-1 leading-none">{phaseName}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#8E3B22] text-white flex items-center justify-center font-bold text-sm shadow-inner">
            D{currentCycleDay}
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 1-Tap Log + Interactive Timeline (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Sensation Selector Card */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#2B231F] flex items-center gap-2">
                  <span>1. Tap what you feel</span>
                  {selectedFeelings.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5EAE4] text-[#8E3B22]">
                      {selectedFeelings.length} selected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#7A6F66]">
                  Select one or more sensations across categories.
                </p>
              </div>

              {selectedFeelings.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-xs font-semibold text-[#8C7667] hover:text-[#4A3223] flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {!isSaved ? (
              <div className="space-y-4">
                {/* Category Buckets: 2-column clean bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FEELING_BUCKETS.map((bucket) => {
                    const isExpanded = !!expandedBuckets[bucket.id];
                    const config = BUCKET_CONFIG[bucket.id];
                    const upfrontItems = bucket.items.filter((item) => item.isUpfront);
                    const moreItems = bucket.items.filter((item) => !item.isUpfront);
                    const selectedInBucket = bucket.items.filter((item) => selectedFeelings.includes(item.id));

                    return (
                      <div
                        key={bucket.id}
                        className="rounded-xl p-3.5 border transition-all flex flex-col justify-between"
                        style={{
                          backgroundColor: selectedInBucket.length > 0 ? config.lightBg : '#FAF8F5',
                          borderColor: selectedInBucket.length > 0 ? config.border : '#ECE4DA',
                        }}
                      >
                        <div>
                          {/* Bucket Title Row */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                              {config.icon}
                              <h3 className="text-xs font-bold text-[#2C2420]">{bucket.title}</h3>
                            </div>
                            {selectedInBucket.length > 0 && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: config.border, color: config.textColor }}
                              >
                                {selectedInBucket.length}
                              </span>
                            )}
                          </div>

                          {/* Chip Selectors */}
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
                                      ? 'bg-[#2B231F] text-white shadow-xs font-semibold'
                                      : 'bg-white text-[#4A4038] border border-[#E2D8CC] hover:bg-[#F2ECE3] hover:border-[#D6CABF]'
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] text-[#E89E86]" />}
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
                                        ? 'bg-[#2B231F] text-white shadow-xs font-semibold'
                                        : 'bg-white text-[#4A4038] border border-[#E2D8CC] hover:bg-[#F2ECE3] hover:border-[#D6CABF]'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] text-[#E89E86]" />}
                                    {item.label}
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        {moreItems.length > 0 && (
                          <div className="mt-2.5 pt-1.5 border-t border-black/5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleBucketExpand(bucket.id)}
                              className="text-[10px] font-semibold text-[#7D6B5F] hover:text-[#3B2D24] flex items-center gap-0.5 cursor-pointer transition-colors"
                            >
                              {isExpanded ? (
                                <>Show less <ChevronUp className="w-2.5 h-2.5" /></>
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

                {/* New Notes Text Box */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-[#2C2420] mb-1.5 block">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down extra details, specific cravings, or triggers..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22] resize-none h-20"
                  />
                </div>
              </div>
            ) : (
              /* Success state shown when buttons disappear */
              <div className="bg-[#F5EAE4] p-5 rounded-xl text-center border border-[#E8D4C8] my-4">
                <p className="text-[#8E3B22] font-serif-editorial text-lg mb-1">Your log has been saved! 🎉</p>
                <p className="text-xs text-[#7A6F66]">
                  Review your pattern insight on the right, or click <strong className="text-[#2C2420]">Reset</strong> above to edit today's entry.
                </p>
              </div>
            )}

            {/* Save & Spot Patterns Button */}
            {!isSaved && (
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2ECE4]">
                <span className="text-xs text-[#7A6F66]">
                  {selectedFeelings.length === 0 ? (
                    'Select any feelings above'
                  ) : (
                    <span className="font-semibold text-[#2C2420]">
                      Ready to compare with your past cycles
                    </span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={selectedFeelings.length === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    selectedFeelings.length > 0
                      ? 'bg-[#8E3B22] text-white hover:bg-[#742E19] active:scale-[0.98]'
                      : 'bg-[#E5DCD2] text-[#968B80] cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Save & Spot Patterns
                </button>
              </div>
            )}
          </section>

          {/* Interactive Cycle Timeline & Test Presets Card */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7D73] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8E3B22]" />
                  Cycle Timeline & Simulation
                </h3>
                <p className="text-xs text-[#6B5E54] mt-0.5">
                  Test how AURA interprets different days across your 28-day cycle.
                </p>
              </div>

              <span className="text-xs font-semibold text-[#8E3B22] bg-[#F5EAE4] px-2.5 py-0.5 rounded-full">
                Day {currentCycleDay} / {profile.averageCycleLength}
              </span>
            </div>

            {/* Visual Phase Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#7A6F66] font-medium">
                <span className="font-bold text-[#2C2420]">{phaseName}</span>
                <span>{phaseDesc}</span>
              </div>

              <div className="w-full h-2.5 bg-[#EAE2D7] rounded-full overflow-hidden flex p-0.5 gap-0.5">
                <div
                  className={`h-full rounded-l-full transition-all ${
                    cyclePhase === 'menstrual' ? 'bg-[#C95C4F]' : 'bg-[#E5B5AF]'
                  }`}
                  style={{ width: `${(profile.averagePeriodLength / profile.averageCycleLength) * 100}%` }}
                  title="Menstrual"
                />
                <div
                  className={`h-full transition-all ${cyclePhase === 'follicular' ? 'bg-[#5D8B6F]' : 'bg-[#BCD1C4]'}`}
                  style={{ width: `${(7 / profile.averageCycleLength) * 100}%` }}
                  title="Follicular"
                />
                <div
                  className={`h-full transition-all ${cyclePhase === 'ovulatory' ? 'bg-[#D98A38]' : 'bg-[#F2CCA0]'}`}
                  style={{ width: `${(4 / profile.averageCycleLength) * 100}%` }}
                  title="Ovulatory"
                />
                <div
                  className={`h-full rounded-r-full transition-all ${cyclePhase === 'luteal' ? 'bg-[#8F557E]' : 'bg-[#D8B4CC]'}`}
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

              <div className="grid grid-cols-4 text-[10px] text-[#8C7D70] pt-0.5">
                <span>🩸 Menstrual (1-5)</span>
                <span>🌿 Follicular (6-11)</span>
                <span>✨ Ovulation (12-15)</span>
                <span className="text-right">🌙 Luteal (16-28)</span>
              </div>
            </div>

            {/* Quick Demo Preset Chips */}
            <div className="pt-2 border-t border-[#F2ECE4] flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#8C7B6F] font-semibold mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#8E3B22]" />
                Test presets:
              </span>
              <button
                type="button"
                onClick={() => handleTestDay(24, ['extra_hungry', 'craving', 'bloated', 'irritable'])}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  isTestingPreset && activePresetDay === 24
                    ? 'bg-[#8F557E] text-white shadow-xs font-bold'
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
                    ? 'bg-[#D98A38] text-white shadow-xs font-bold'
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
                    ? 'bg-[#C95C4F] text-white shadow-xs font-bold'
                    : 'bg-[#FAF6F0] border border-[#DDD3C7] text-[#5A4F46] hover:bg-[#F2EAE0]'
                }`}
              >
                🩸 Day 1 (Cramps & Rest)
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: AURA Pattern Intelligence Card (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7065] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8E3B22]" />
              2. AURA Pattern Interpretation
            </span>
            <span className="text-[11px] text-[#8E8074] bg-[#F5EBE1] px-2 py-0.5 rounded-md font-medium">
              Cycles -1, -2, -3 scanned
            </span>
          </div>

          <AnimatePresence mode="wait">
            {activeInsight ? (
              <motion.div
                key={activeInsight.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
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
                className="bg-white rounded-2xl p-6 border border-[#E8E1D7] text-center space-y-4 shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF5F0] border border-[#EAE0D5] flex items-center justify-center mx-auto text-[#8E3B22]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif-editorial text-xl text-[#2C2420]">
                    Your pattern insight will appear here
                  </h3>
                  <p className="text-xs text-[#7A6F66] leading-relaxed max-w-xs mx-auto">
                    Select feelings on the left or tap a test preset to see what AURA has noticed across your past 3 cycles for Day {currentCycleDay}.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE4] space-y-3 text-left">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE3D8] text-xs space-y-1.5">
                    <p className="font-semibold text-[#2C2420] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#8E3B22]" />
                      Personal Biological Evidence
                    </p>
                    <p className="text-[#6E635A] text-[11px] leading-relaxed">
                      Rather than generic calendar guesses, AURA correlates your feelings with your exact historical cycle windows to discover verified personal patterns.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8C7E74] px-1">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#8E3B22]" />
                      36 benchmark logs loaded
                    </span>
                    <button
                      onClick={onViewReceipts}
                      className="font-semibold text-[#8E3B22] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View 5 Body Receipts <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
