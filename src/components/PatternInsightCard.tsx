import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  HeartPulse,
  CheckCircle2,
  Info,
  Compass,
  ArrowRight,
  Apple,
  Brain,
  Activity,
  Flame,
  Droplet,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PatternInsight, PatternGuidanceAction } from '../types';
import { TabType } from './Navbar';

interface PatternInsightCardProps {
  insight: PatternInsight;
  onExploreRhythms?: () => void;
  onViewReceipts?: () => void;
  onNavigateToTab?: (tab: TabType, subTab?: string) => void;
}

export const PatternInsightCard: React.FC<PatternInsightCardProps> = ({
  insight,
  onExploreRhythms,
  onViewReceipts,
  onNavigateToTab,
}) => {
  const isMatch = insight.isMatch && insight.matchedCyclesCount >= 1;
  const isHighConfidence = insight.matchedCyclesCount >= 2;

  const [selectedGuidanceTab, setSelectedGuidanceTab] = useState<string>(
    insight.guidance ? insight.guidance.id : ''
  );
  const [showAllGuidance, setShowAllGuidance] = useState<boolean>(false);

  // Quick Mini 4-7-8 Breathing State (in-card grounding tool)
  const [isMiniBreathingActive, setIsMiniBreathingActive] = useState<boolean>(false);
  const [miniBreathPhase, setMiniBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [miniBreathCount, setMiniBreathCount] = useState<number>(4);
  const [miniRounds, setMiniRounds] = useState<number>(0);

  // Synchronize selected guidance tab when insight changes
  useEffect(() => {
    if (insight.guidance) {
      setSelectedGuidanceTab(insight.guidance.id);
    }
    setIsMiniBreathingActive(false);
    setMiniBreathPhase('Inhale');
    setMiniBreathCount(4);
    setMiniRounds(0);
  }, [insight.id]);

  // Mini breathing timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMiniBreathingActive) {
      timer = setInterval(() => {
        setMiniBreathCount((prev) => {
          if (prev <= 1) {
            if (miniBreathPhase === 'Inhale') {
              setMiniBreathPhase('Hold');
              return 7;
            } else if (miniBreathPhase === 'Hold') {
              setMiniBreathPhase('Exhale');
              return 8;
            } else {
              setMiniBreathPhase('Inhale');
              setMiniRounds((r) => r + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMiniBreathingActive, miniBreathPhase]);

  const allGuidances: PatternGuidanceAction[] = [
    ...(insight.guidance ? [insight.guidance] : []),
    ...(insight.additionalGuidances || []),
  ];

  const activeGuidance = allGuidances.find((g) => g.id === selectedGuidanceTab) || insight.guidance;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'headache_relief':
        return <Activity className="w-4 h-4 text-[#8E3B22]" />;
      case 'bloating_relief':
        return <Droplet className="w-4 h-4 text-[#38668E]" />;
      case 'body_relief':
        return <HeartPulse className="w-4 h-4 text-[#8E4B38]" />;
      case 'nutrition':
        return <Apple className="w-4 h-4 text-[#8E3B22]" />;
      case 'grounding':
        return <Brain className="w-4 h-4 text-[#385E53]" />;
      case 'sexual_health':
        return <Sparkles className="w-4 h-4 text-[#9C3861]" />;
      case 'rest_recovery':
        return <Droplet className="w-4 h-4 text-[#A84832]" />;
      case 'vitality':
        return <Flame className="w-4 h-4 text-[#B86828]" />;
      default:
        return <Activity className="w-4 h-4 text-[#6E6359]" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'headache_relief':
        return {
          bg: 'bg-[#FFF6F3]',
          border: 'border-[#F2D0C5]',
          badge: 'bg-[#FBE4DD] text-[#8E3B22]',
          accentText: 'text-[#8E3B22]',
          buttonBg: 'bg-[#8E3B22] text-white hover:bg-[#732C17]',
        };
      case 'bloating_relief':
        return {
          bg: 'bg-[#F4F8FA]',
          border: 'border-[#C8DFEC]',
          badge: 'bg-[#DDEEF8] text-[#285A80]',
          accentText: 'text-[#285A80]',
          buttonBg: 'bg-[#285A80] text-white hover:bg-[#1E4563]',
        };
      case 'body_relief':
        return {
          bg: 'bg-[#FBF6F3]',
          border: 'border-[#EBDCD3]',
          badge: 'bg-[#F5E6DC] text-[#7A3C2A]',
          accentText: 'text-[#7A3C2A]',
          buttonBg: 'bg-[#7A3C2A] text-white hover:bg-[#5E2B1D]',
        };
      case 'nutrition':
        return {
          bg: 'bg-[#FFF8F4]',
          border: 'border-[#F0D5C7]',
          badge: 'bg-[#FBE8DF] text-[#8E3B22]',
          accentText: 'text-[#8E3B22]',
          buttonBg: 'bg-[#8E3B22] text-white hover:bg-[#732C17]',
        };
      case 'grounding':
        return {
          bg: 'bg-[#F2F7F4]',
          border: 'border-[#C8DDD2]',
          badge: 'bg-[#DDECE4] text-[#285746]',
          accentText: 'text-[#285746]',
          buttonBg: 'bg-[#285746] text-white hover:bg-[#1E4336]',
        };
      case 'sexual_health':
        return {
          bg: 'bg-[#FDF4F8]',
          border: 'border-[#F3D1E3]',
          badge: 'bg-[#FAE3EE] text-[#9C3861]',
          accentText: 'text-[#9C3861]',
          buttonBg: 'bg-[#9C3861] text-white hover:bg-[#802B4D]',
        };
      case 'rest_recovery':
        return {
          bg: 'bg-[#FAF3F0]',
          border: 'border-[#EED7CE]',
          badge: 'bg-[#F5E2DA] text-[#933D27]',
          accentText: 'text-[#933D27]',
          buttonBg: 'bg-[#933D27] text-white hover:bg-[#752D1B]',
        };
      default:
        return {
          bg: 'bg-[#F9F7F4]',
          border: 'border-[#EAE1D5]',
          badge: 'bg-[#EEE6DC] text-[#5A4F46]',
          accentText: 'text-[#5A4F46]',
          buttonBg: 'bg-[#5A4F46] text-white hover:bg-[#433A33]',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border p-5 sm:p-6 relative overflow-hidden transition-all shadow-sm ${
        isHighConfidence
          ? 'bg-gradient-to-br from-[#FFF9F6] via-[#FFFDFB] to-[#FDF5F1] border-[#EAC5B6]'
          : isMatch
          ? 'bg-gradient-to-br from-[#FCFAF7] via-[#FFFDFB] to-[#F7F3EC] border-[#DDD2C4]'
          : 'bg-[#FDFCFA] border-[#E8E2D9]'
      }`}
    >
      {/* Subtle warm decorative glow */}
      {isHighConfidence && (
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#E89E86]/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              isHighConfidence
                ? 'bg-[#E89E86]/25 text-[#8E3B22]'
                : isMatch
                ? 'bg-[#D9CEBF]/40 text-[#54483E]'
                : 'bg-[#EAE4DC] text-[#695F56]'
            }`}
          >
            {isHighConfidence ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#8E3B22]" />
                Pattern Detected
              </>
            ) : isMatch ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#54483E]" />
                Emerging Rhythm
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-[#7A6F66]" />
                Learning Mode
              </>
            )}
          </span>

          <span className="text-xs font-semibold text-[#6E6359] px-2.5 py-1 rounded-lg bg-white/90 border border-[#ECE5DC]">
            {insight.phaseName} · Days {insight.cycleDayRange[0]}–{insight.cycleDayRange[1]}
          </span>
        </div>

        {isHighConfidence && (
          <span className="text-xs font-bold text-[#8E3B22] flex items-center gap-1 bg-[#FDEEE9] px-2.5 py-1 rounded-full border border-[#F4D0C5]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified in {insight.matchedCyclesCount}/{insight.totalPastCyclesAnalyzed} cycles
          </span>
        )}
      </div>

      {/* Primary Natural Language Headline */}
      <h3 className="font-serif-editorial text-2xl sm:text-[25px] leading-snug text-[#2C2420] font-normal mb-2">
        "{insight.headline}"
      </h3>

      {/* Subheadline status */}
      {insight.subheadline && (
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7B6E] mb-3.5">
          {insight.subheadline}
        </p>
      )}

      {/* Biological Explanation Card */}
      <div className="bg-white/95 rounded-xl p-4 sm:p-5 border border-[#EFE9E0] mb-4 shadow-xs space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F8EFEA] flex items-center justify-center shrink-0 mt-0.5 text-[#8E3B22]">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7E73]">
              Why your body feels this way
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4A4039]">
              {insight.explanation}
            </p>
            {insight.actionableTip && (
              <div className="pt-2 border-t border-[#F2ECE4] text-xs text-[#6B5E54] flex items-start gap-1.5">
                <span className="font-bold text-[#8E3B22] shrink-0">Rhythm Tip:</span>
                <span>{insight.actionableTip}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW: ACTIONABLE GUIDANCE SECTION ("What you can do with this information") */}
      {activeGuidance && (
        <div className="mb-4">
          {/* Section Heading & Category Tabs */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8E3B22]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">
                Guidance for this pattern
              </h4>
            </div>
            {allGuidances.length > 1 && (
              <div className="flex items-center gap-1">
                {allGuidances.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGuidanceTab(g.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      selectedGuidanceTab === g.id
                        ? 'bg-[#2B231F] text-white'
                        : 'bg-[#ECE5DC] text-[#695F56] hover:bg-[#DFD6CB]'
                    }`}
                  >
                    {g.category === 'headache_relief'
                      ? '⚡ Headache'
                      : g.category === 'bloating_relief'
                      ? '💧 Bloating'
                      : g.category === 'body_relief'
                      ? '🌿 Body Relief'
                      : g.category === 'nutrition'
                      ? '🥗 Nutrition'
                      : g.category === 'grounding'
                      ? '🧘 Grounding'
                      : g.category === 'sexual_health'
                      ? '✨ Intimacy'
                      : g.category === 'rest_recovery'
                      ? '🌸 Cramps / Rest'
                      : '⚡ Energy'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Guidance Box */}
          {(() => {
            const theme = getCategoryTheme(activeGuidance.category);
            return (
              <div
                className={`rounded-xl p-4 sm:p-5 border transition-all ${theme.bg} ${theme.border} space-y-3`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${theme.badge}`}
                  >
                    {getCategoryIcon(activeGuidance.category)}
                    {activeGuidance.categoryLabel}
                  </span>

                  <span className="text-[11px] font-medium text-[#7A6F66]">
                    Actionable steps today
                  </span>
                </div>

                <div>
                  <h5 className="text-sm sm:text-[15px] font-bold text-[#2C2420]">
                    {activeGuidance.title}
                  </h5>
                  <p className="text-xs text-[#5C5147] mt-1 leading-relaxed">
                    {activeGuidance.shortSummary}
                  </p>
                </div>

                {/* Bullets */}
                <ul className="space-y-1.5 pt-1">
                  {activeGuidance.bullets.map((bullet, idx) => {
                    const [heading, ...rest] = bullet.split(':');
                    return (
                      <li key={idx} className="text-xs text-[#4A4038] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8E3B22] mt-1.5 shrink-0" />
                        <span>
                          {rest.length > 0 ? (
                            <>
                              <strong className="text-[#2C2420]">{heading}:</strong>
                              {rest.join(':')}
                            </>
                          ) : (
                            bullet
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Specific Food / Action Chips */}
                {activeGuidance.recommendedFoodsOrSteps && (
                  <div className="pt-2 border-t border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D7065] mb-1.5">
                      {activeGuidance.category === 'nutrition'
                        ? 'Recommended Phase Superfoods'
                        : activeGuidance.category === 'grounding'
                        ? 'Recommended Calming Tools'
                        : activeGuidance.category === 'sexual_health'
                        ? 'Key Biomarkers & Practices'
                        : activeGuidance.category === 'headache_relief'
                        ? 'Immediate Headache Relief Steps'
                        : activeGuidance.category === 'bloating_relief'
                        ? 'Fluid Balance & Digestive Steps'
                        : activeGuidance.category === 'body_relief'
                        ? 'Targeted Body Relief Steps'
                        : 'Quick Relief Recommendations'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeGuidance.recommendedFoodsOrSteps.map((chip, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#E2D8CC] text-[11px] font-medium text-[#3D332B] shadow-2xs flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5 text-[#8E3B22]" />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Quick 4-7-8 Breathing Tool for Grounding */}
                {activeGuidance.category === 'grounding' && (
                  <div className="mt-3 p-3.5 bg-white rounded-xl border border-[#C8DDD2] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-[#285746]" />
                        <span className="text-xs font-bold text-[#285746]">
                          Quick 4-7-8 Grounding Loop
                        </span>
                      </div>
                      <span className="text-[11px] text-[#697A72] font-medium">
                        Round {miniRounds + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {/* Animated Pacer Visual */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-700 ${
                            isMiniBreathingActive
                              ? miniBreathPhase === 'Inhale'
                                ? 'bg-[#E3F0E9] border-[#285746] text-[#285746] scale-110'
                                : miniBreathPhase === 'Hold'
                                ? 'bg-[#F6ECE4] border-[#8E3B22] text-[#8E3B22] scale-105'
                                : 'bg-[#EBF2F7] border-[#38668E] text-[#38668E] scale-90'
                              : 'bg-[#F2F7F4] border-[#C8DDD2] text-[#4F685D]'
                          }`}
                        >
                          {isMiniBreathingActive ? `${miniBreathCount}s` : '4-7-8'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2C2420]">
                            {isMiniBreathingActive
                              ? `${miniBreathPhase}...`
                              : 'Ready for a quick 60s reset'}
                          </p>
                          <p className="text-[11px] text-[#7A6F66]">
                            {miniBreathPhase === 'Inhale'
                              ? 'Deep inhale through nose'
                              : miniBreathPhase === 'Hold'
                              ? 'Hold gently with relaxed shoulders'
                              : 'Slow complete exhale through mouth'}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setIsMiniBreathingActive(!isMiniBreathingActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isMiniBreathingActive
                            ? 'bg-[#285746] text-white hover:bg-[#1E4336]'
                            : 'bg-[#E1EDE6] text-[#285746] hover:bg-[#D0E3D7]'
                        }`}
                      >
                        {isMiniBreathingActive ? (
                          <>
                            <Pause className="w-3 h-3" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" /> Start Breathing
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct Action Navigation Button */}
                {activeGuidance.directActionLabel && onNavigateToTab && (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigateToTab(
                          activeGuidance.targetTab || 'body_mind',
                          activeGuidance.targetSubTab
                        )
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${theme.buttonBg}`}
                    >
                      {activeGuidance.directActionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Past Cycle Receipts Occurrences */}
      {insight.occurrences.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A6E63] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8E3B22]" />
            Matching records from your last 3 cycles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {insight.occurrences.map((occ, idx) => (
              <div
                key={idx}
                className="bg-white/90 border border-[#EAE3D9] rounded-xl p-3 text-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-medium text-[#4D423A] mb-1">
                  <span className="font-bold text-[#2C2420]">{occ.cycleLabel}</span>
                  <span className="text-[#8E3B22] font-bold">Day {occ.cycleDay}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {occ.matchingFeelings.map((fId) => (
                    <span
                      key={fId}
                      className="px-2 py-0.5 bg-[#F7EFE9] text-[#783723] rounded-md text-[11px] font-semibold"
                    >
                      {fId.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#EAE4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#877C72] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#A89A8E]" />
          AURA connects what you feel to your natural biology.
        </span>

        {onViewReceipts && (
          <button
            onClick={onViewReceipts}
            className="inline-flex items-center gap-1 font-bold text-[#8E3B22] hover:text-[#5E2210] transition-colors cursor-pointer"
          >
            Explore all Body Receipts
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
