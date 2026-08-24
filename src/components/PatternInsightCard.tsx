import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, HeartPulse, CheckCircle2, Info, Compass, ArrowRight, ShieldAlert } from 'lucide-react';
import { PatternInsight } from '../types';

interface PatternInsightCardProps {
  insight: PatternInsight;
  onExploreRhythms?: () => void;
  onViewReceipts?: () => void;
}

export const PatternInsightCard: React.FC<PatternInsightCardProps> = ({
  insight,
  onExploreRhythms,
  onViewReceipts,
}) => {
  const isMatch = insight.isMatch && insight.matchedCyclesCount >= 1;
  const isHighConfidence = insight.matchedCyclesCount >= 2;

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
