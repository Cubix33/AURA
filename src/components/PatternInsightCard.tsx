import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, HeartPulse, CheckCircle2, Info, Compass, ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border p-6 md:p-7 relative overflow-hidden transition-all shadow-sm ${
        isHighConfidence
          ? 'bg-gradient-to-br from-[#FFF9F6] via-[#FFFDFB] to-[#FDF4F0] border-[#E8C5B8]'
          : isMatch
          ? 'bg-gradient-to-br from-[#FCFAF7] via-[#FFFDFB] to-[#F7F2EB] border-[#D9CEBF]'
          : 'bg-[#FDFCFA] border-[#E8E2D9]'
      }`}
    >
      {/* Subtle decorative glow */}
      {isHighConfidence && (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#E89E86]/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
              isHighConfidence
                ? 'bg-[#E89E86]/20 text-[#8E3B22]'
                : isMatch
                ? 'bg-[#D9CEBF]/40 text-[#54483E]'
                : 'bg-[#EAE4DC] text-[#695F56]'
            }`}
          >
            {isHighConfidence ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#C45E3D]" />
                Pattern Detected
              </>
            ) : isMatch ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#695F56]" />
                Emerging Rhythm
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-[#7A6F66]" />
                Learning Mode
              </>
            )}
          </span>

          <span className="text-xs font-medium text-[#7D736A] px-2.5 py-0.5 rounded-md bg-white/80 border border-[#EBE5DC]">
            {insight.phaseName} · Days {insight.cycleDayRange[0]}–{insight.cycleDayRange[1]}
          </span>
        </div>

        {isHighConfidence && (
          <span className="text-xs font-semibold text-[#8E3B22] flex items-center gap-1 bg-[#FDEEE9] px-2.5 py-1 rounded-full border border-[#F4D0C5]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified in {insight.matchedCyclesCount}/{insight.totalPastCyclesAnalyzed} cycles
          </span>
        )}
      </div>

      {/* Core Plain-Language Headline */}
      <h3 className="font-serif-editorial text-2xl md:text-[26px] leading-snug text-[#2C2420] font-normal mb-3">
        "{insight.headline}"
      </h3>

      {/* Subheadline if present */}
      {insight.subheadline && (
        <p className="text-xs font-medium uppercase tracking-wider text-[#9C8F84] mb-4">
          {insight.subheadline}
        </p>
      )}

      {/* Plain Language Interpretation */}
      <div className="bg-white/90 rounded-xl p-4 md:p-5 border border-[#EFE9E0] mb-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F8EFEA] flex items-center justify-center shrink-0 mt-0.5 text-[#B25838]">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8A7E73]">
              Why your body feels this way
            </p>
            <p className="text-sm leading-relaxed text-[#4A4039] font-normal">
              {insight.explanation}
            </p>
            {insight.actionableTip && (
              <div className="pt-2 border-t border-[#F2ECE4] text-xs text-[#6B5E54] flex items-start gap-1.5">
                <span className="font-semibold text-[#8E3B22] shrink-0">Rhythm Tip:</span>
                <span>{insight.actionableTip}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Occurrences Proof */}
      {insight.occurrences.length > 0 && (
        <div className="space-y-2 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7E73] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Matching logs in your historical records
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {insight.occurrences.map((occ, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-[#EAE3D9] rounded-lg p-3 text-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-medium text-[#4D423A] mb-1">
                  <span className="font-semibold text-[#2C2420]">{occ.cycleLabel}</span>
                  <span className="text-[#8E3B22] font-semibold">Day {occ.cycleDay}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {occ.matchingFeelings.map((fId) => (
                    <span
                      key={fId}
                      className="px-2 py-0.5 bg-[#F7EFE9] text-[#783723] rounded text-[11px] font-medium"
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
        <span className="text-[#877C72] flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-[#B0A294]" />
          AURA connects the dots between today's feelings and past cycles.
        </span>

        <div className="flex items-center gap-2">
          {onViewReceipts && (
            <button
              onClick={onViewReceipts}
              className="inline-flex items-center gap-1 font-semibold text-[#8E3B22] hover:text-[#5E2210] transition-colors cursor-pointer"
            >
              View Body Receipts
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
