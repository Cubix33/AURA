import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Apple,
  HeartPulse,
  Brain,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Flame,
  Droplet,
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  BookOpen,
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { UserCycleProfile, CyclePhase } from '../types';
import {
  NUTRITION_BY_PHASE,
  SEXUAL_HEALTH_TOPICS,
  RED_FLAG_SYMPTOMS,
  MENTAL_HEALTH_DATA,
} from '../data/wellnessData';
import { calculateCycleDay, getCyclePhase, getPhaseDisplayName } from '../utils/patternEngine';

interface BodyAndMindViewProps {
  profile: UserCycleProfile;
}

export const BodyAndMindView: React.FC<BodyAndMindViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'sexual_health' | 'mental_health' | 'red_flags'>('nutrition');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentCycleDay = calculateCycleDay(todayStr, profile.lastPeriodDate, profile.averageCycleLength);
  const currentPhase = getCyclePhase(currentCycleDay, profile.averageCycleLength, profile.averagePeriodLength);

  const [selectedNutritionPhase, setSelectedNutritionPhase] = useState<string>(currentPhase);
  const [selectedSexualTopic, setSelectedSexualTopic] = useState<string>(SEXUAL_HEALTH_TOPICS[0].id);

  // 4-7-8 Breathwork Interactive Engine
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  // Emotional journal entry
  const [journalNote, setJournalNote] = useState<string>('');
  const [isJournalSaved, setIsJournalSaved] = useState<boolean>(false);

  // Breathing timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              setCompletedRounds((r) => r + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setBreathCount(4);
    }
    setIsBreathingActive((prev) => !prev);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setBreathCount(4);
    setCompletedRounds(0);
  };

  const handleSaveJournal = () => {
    if (!journalNote.trim()) return;
    setIsJournalSaved(true);
    setTimeout(() => setIsJournalSaved(false), 3000);
  };

  const activeNutrition = NUTRITION_BY_PHASE[selectedNutritionPhase] || NUTRITION_BY_PHASE.menstrual;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Editorial Header Banner */}
      <section className="bg-gradient-to-br from-[#FAF5F0] via-white to-[#F7EFE8] rounded-3xl p-6 md:p-8 border border-[#EDE2D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#8E3B22] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" />
              Physical, Sexual & Emotional Well-Being
            </span>
            <h1 className="font-serif-editorial text-2xl md:text-3xl text-[#2B231F] font-normal">
              Nourishing Body & Mind
            </h1>
            <p className="text-xs md:text-sm text-[#6B5E54]">
              Science-grounded nutrition tailored to your cycle phases, sexual health sovereignty, and calming mental health tools.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-[#E8DFD3] shrink-0 self-start md:self-auto shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5E8E0] text-[#8E3B22] flex flex-col items-center justify-center font-bold">
              <span className="text-[9px] text-[#8A6A5E] font-medium leading-none">DAY</span>
              <span className="text-base font-bold leading-none mt-0.5">{currentCycleDay}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#2B231F]">{getPhaseDisplayName(currentPhase)}</p>
              <p className="text-[11px] text-[#857970]">Active biological phase</p>
            </div>
          </div>
        </div>

        {/* Sub-Nav Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#EFE7DC]">
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nutrition'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            Cycle Nutrition & Seed Cycling
          </button>

          <button
            onClick={() => setActiveTab('sexual_health')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sexual_health'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sexual Health & Contraception
          </button>

          <button
            onClick={() => setActiveTab('mental_health')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mental_health'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Mental Health & 4-7-8 Breathwork
          </button>

          <button
            onClick={() => setActiveTab('red_flags')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'red_flags'
                ? 'bg-[#BF3D3D] text-white shadow-xs'
                : 'bg-white text-[#8C3A3A] border border-[#F2D7D7] hover:bg-[#FDF4F4]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Symptom Alerts & Red Flags
          </button>
        </div>
      </section>

      {/* TAB 1: CYCLE NUTRITION & SEED CYCLING */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          {/* Phase Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'menstrual', label: '🩸 Menstrual (1–5)', color: '#C95C4F' },
              { id: 'follicular', label: '🌿 Follicular (6–11)', color: '#5D8B6F' },
              { id: 'ovulatory', label: '✨ Ovulatory (12–15)', color: '#D98A38' },
              { id: 'luteal', label: '🌙 Luteal (16–28)', color: '#8F557E' },
            ].map((p) => {
              const isSelected = selectedNutritionPhase === p.id;
              const isCurrent = currentPhase === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedNutritionPhase(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-[#8E3B22] shadow-sm ring-1 ring-[#8E3B22]/30'
                      : 'bg-[#FAF8F5] border-[#E8E0D5] hover:bg-white'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#F3E7DF] text-[#8E3B22]">
                      Current
                    </span>
                  )}
                  <p className="text-xs font-bold text-[#2B231F]">{p.label}</p>
                  <p className="text-[11px] text-[#7A6F66] mt-1 line-clamp-1">
                    {NUTRITION_BY_PHASE[p.id]?.focus.split(',')[0]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Nutrition Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Detailed Guidance */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E1D7] shadow-xs space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22]">
                  Phase Protocol
                </span>
                <h2 className="font-serif-editorial text-2xl text-[#2B231F]">
                  {activeNutrition.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5147] leading-relaxed">
                  {activeNutrition.whyItWorks}
                </p>
              </div>

              {/* Seed Cycling Module */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE1D5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F4E8E0] text-[#8E3B22] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#2B231F] uppercase tracking-wider">
                    Seed Cycling Guide
                  </h4>
                  <p className="text-xs text-[#52453B] leading-relaxed">
                    {activeNutrition.seedCycling}
                  </p>
                </div>
              </div>

              {/* Micronutrients */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6F66]">
                  Key Micronutrients to prioritize
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeNutrition.micronutrients.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#F5EFE9] text-[#733723] border border-[#E9DDCE]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Foods vs Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F2ECE4]">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#2D583F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Foods to Embrace
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#52453B]">
                    {activeNutrition.recommendedFoods.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#4B8361] mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#8E3B22] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Foods to Moderate
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#6B5E54]">
                    {activeNutrition.foodsToLimit.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#8E3B22] mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Sample Daily Meal Plan */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E1D7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                  Sample Daily Plate
                </h3>
                <span className="text-[11px] font-semibold text-[#8E3B22] bg-[#FAF3EE] px-2.5 py-1 rounded-full border border-[#F1DFD5]">
                  Easy Prep
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7D73] block">
                    Breakfast
                  </span>
                  <p className="text-[#40352D] font-medium leading-relaxed">
                    {activeNutrition.mealIdea.breakfast}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7D73] block">
                    Lunch
                  </span>
                  <p className="text-[#40352D] font-medium leading-relaxed">
                    {activeNutrition.mealIdea.lunch}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7D73] block">
                    Dinner
                  </span>
                  <p className="text-[#40352D] font-medium leading-relaxed">
                    {activeNutrition.mealIdea.dinner}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7D73] block">
                    Restorative Snack
                  </span>
                  <p className="text-[#40352D] font-medium leading-relaxed">
                    {activeNutrition.mealIdea.snack}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEXUAL HEALTH & CONTRACEPTION */}
      {activeTab === 'sexual_health' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topic Navigation List */}
          <div className="lg:col-span-4 space-y-2.5">
            {SEXUAL_HEALTH_TOPICS.map((topic) => {
              const isSelected = selectedSexualTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedSexualTopic(topic.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#2B231F] text-white border-[#2B231F] shadow-sm'
                      : 'bg-white text-[#4A3E36] border-[#E8E1D7] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isSelected ? 'text-[#E89E86]' : 'text-[#8E3B22]'
                      }`}
                    >
                      {topic.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-xs font-bold mt-0.5">{topic.title}</h3>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#E89E86]' : 'text-[#A8988C]'
                    }`}
                  />
                </button>
              );
            })}

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D8] text-xs space-y-2 text-[#685D54]">
              <p className="font-bold text-[#2B231F] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8E3B22]" />
                Autonomy & Safety
              </p>
              <p className="leading-relaxed text-[11px]">
                Your body belongs solely to you. Health information here is educational and supports empowered decision-making.
              </p>
            </div>
          </div>

          {/* Topic Detail View */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-xs space-y-6">
            {(() => {
              const currentTopic =
                SEXUAL_HEALTH_TOPICS.find((t) => t.id === selectedSexualTopic) ||
                SEXUAL_HEALTH_TOPICS[0];
              return (
                <>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22]">
                      {currentTopic.category.replace('_', ' ')}
                    </span>
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#2B231F]">
                      {currentTopic.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#61544B] leading-relaxed">
                      {currentTopic.summary}
                    </p>
                  </div>

                  {/* Key Facts */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6F66]">
                      Essential Knowledge
                    </h4>
                    <div className="space-y-2">
                      {currentTopic.keyFacts.map((fact, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4DA] text-xs text-[#42372F] flex items-start gap-2.5 leading-relaxed"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#F4E8E0] text-[#8E3B22] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Tips */}
                  <div className="space-y-2.5 pt-2 border-t border-[#F2ECE4]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E3B22]">
                      Empowered Action & Self-Care
                    </h4>
                    <div className="space-y-2">
                      {currentTopic.actionTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#FDF9F7] border border-[#F4E3DC] text-xs text-[#633325] flex items-start gap-2 leading-relaxed font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#8E3B22] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: MENTAL HEALTH & 4-7-8 BREATHWORK */}
      {activeTab === 'mental_health' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 4-7-8 Breathing Guide */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-xs flex flex-col items-center text-center space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22]">
                Parasympathetic Nervous System Reset
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#2B231F]">
                4-7-8 Calming Breathwork
              </h3>
              <p className="text-xs text-[#7A6F66] max-w-sm">
                Soothe hormonal stress spikes and vagus nerve tension during luteal or menstrual shifts.
              </p>
            </div>

            {/* Interactive Animated Pulsing Circle */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              <motion.div
                animate={{
                  scale:
                    isBreathingActive && breathPhase === 'Inhale'
                      ? 1.25
                      : isBreathingActive && breathPhase === 'Hold'
                      ? 1.25
                      : 0.95,
                  backgroundColor:
                    breathPhase === 'Inhale'
                      ? '#F5EAE4'
                      : breathPhase === 'Hold'
                      ? '#F7F1E6'
                      : '#EBF4F0',
                }}
                transition={{
                  duration: breathPhase === 'Inhale' ? 4 : breathPhase === 'Hold' ? 0.2 : 8,
                  ease: 'easeInOut',
                }}
                className="w-44 h-44 rounded-full border-2 border-[#8E3B22]/30 flex flex-col items-center justify-center shadow-inner"
              >
                <span className="text-xs uppercase font-bold tracking-widest text-[#8E3B22]">
                  {isBreathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="font-serif-editorial text-4xl font-normal text-[#2B231F] mt-1">
                  {isBreathingActive ? breathCount : '4-7-8'}
                </span>
                <span className="text-[10px] text-[#8C7E74] mt-0.5">
                  {isBreathingActive
                    ? breathPhase === 'Inhale'
                      ? 'Nose breath'
                      : breathPhase === 'Hold'
                      ? 'Gently retain'
                      : 'Mouth release'
                    : 'Tap play to begin'}
                </span>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleBreathing}
                className="px-6 py-2.5 rounded-xl bg-[#8E3B22] text-white text-xs font-bold hover:bg-[#722E1A] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {isBreathingActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Start Breathwork
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetBreathing}
                className="p-2.5 rounded-xl bg-[#FAF6F0] text-[#7A6E64] hover:text-[#2B231F] border border-[#E8DFD3] transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-[#8A7D72]">
              Completed cycles: <span className="font-bold text-[#2B231F]">{completedRounds}</span> · 4 continuous cycles recommended
            </p>
          </div>

          {/* Right: Cycle-Linked Emotional Journal & Helplines */}
          <div className="lg:col-span-6 space-y-6">
            {/* Emotional Journal Prompt */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-editorial text-lg text-[#2B231F]">
                    Cycle-Linked Emotional Reflection
                  </h3>
                  <p className="text-xs text-[#7A6F66]">
                    Today is Day {currentCycleDay} ({getPhaseDisplayName(currentPhase)}). Express what's in your heart.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5F0] text-[#8E3B22] border border-[#EFE5DC]">
                  Private
                </span>
              </div>

              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                rows={3}
                placeholder="How is your inner world feeling right now? Any noticeable thoughts or emotional shifts..."
                className="w-full text-xs p-3.5 rounded-xl border border-[#E3D9CD] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8C7F74]">
                  Stored strictly on your local device
                </span>
                <button
                  type="button"
                  onClick={handleSaveJournal}
                  disabled={!journalNote.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isJournalSaved
                      ? 'bg-[#4B8361] text-white'
                      : journalNote.trim()
                      ? 'bg-[#2B231F] text-white hover:bg-black'
                      : 'bg-[#EAE4DC] text-[#A69B91] cursor-not-allowed'
                  }`}
                >
                  {isJournalSaved ? 'Saved to Log' : 'Save Reflection'}
                </button>
              </div>
            </div>

            {/* Psychological Helplines Directory */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-xs space-y-3.5">
              <h3 className="font-serif-editorial text-lg text-[#2B231F]">
                Psychological Crisis & Support Helplines
              </h3>
              <div className="space-y-2.5">
                {MENTAL_HEALTH_DATA.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE5DB] text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[#2B231F]">{hl.title}</h4>
                      {hl.isFree && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF4F0] text-[#2D583F] shrink-0">
                          Free 24/7
                        </span>
                      )}
                    </div>
                    {hl.contact && (
                      <p className="font-mono font-bold text-[#8E3B22] text-xs flex items-center gap-1.5">
                        <PhoneCall className="w-3 h-3" />
                        {hl.contact}
                      </p>
                    )}
                    <p className="text-[#695D54] text-[11px] leading-relaxed">
                      {hl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RED FLAGS & ABNORMAL SYMPTOMS */}
      {activeTab === 'red_flags' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#FDF4F4] border border-[#F5D5D5] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#BF3D3D] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-[#7D2222]">
                Medical Safety & Clinical Consultation Guidance
              </h3>
              <p className="text-[#8A3B3B] leading-relaxed">
                AURA is a rhythm and self-awareness tracking tool. It is <strong>not</strong> a substitute for clinical diagnostics or professional gynecological care. If you experience acute symptoms listed below, reach out to your physician or local urgent care center.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RED_FLAG_SYMPTOMS.map((rf) => (
              <div
                key={rf.id}
                className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FDF1F1] text-[#BF3D3D] border border-[#F8D2D2]">
                      {rf.category} alert
                    </span>
                    <span className="text-xs font-semibold text-[#8C7D72]">
                      Action: {rf.urgency === 'immediate' ? 'Immediate Urgent Care' : 'Schedule Clinical Visit'}
                    </span>
                  </div>

                  <h3 className="font-serif-editorial text-lg text-[#2B231F] font-semibold">
                    {rf.symptom}
                  </h3>

                  <p className="text-xs text-[#54483E] leading-relaxed">
                    {rf.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE4] space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D4] space-y-1">
                    <span className="font-bold text-[#8E3B22] block text-[11px]">
                      Why a doctor should check this:
                    </span>
                    <p className="text-[#665A51] text-[11px] leading-relaxed">
                      {rf.whenToConsult}
                    </p>
                  </div>
                  <p className="text-[10px] text-[#918377] italic">
                    "{rf.disclaimer}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
