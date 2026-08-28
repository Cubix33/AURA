import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  FileCheck2,
  Filter,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookmarkCheck,
  Info
} from 'lucide-react';
import { getAllBodyReceipts } from '../utils/patternEngine';
import { DailyLog } from '../types';
import { AuraLogo } from './AuraLogo';

interface BodyReceiptsViewProps {
  allLogs: DailyLog[];
  cycleLength: number;
  onNavigateToToday: () => void;
}

export const BodyReceiptsView: React.FC<BodyReceiptsViewProps> = ({
  allLogs,
  cycleLength,
  onNavigateToToday,
}) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);

  const receipts = getAllBodyReceipts(allLogs, cycleLength);

  const filteredReceipts =
    selectedBucket === 'all'
      ? receipts
      : receipts.filter((r) => r.bucket === selectedBucket);

  const filterOptions: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Receipts' },
    { id: 'appetite', label: 'Appetite & Fuel' },
    { id: 'mood', label: 'Mood & Calm' },
    { id: 'libido', label: 'Libido & Vitality' },
    { id: 'sensations', label: 'Body Sensations' },
    { id: 'energy', label: 'Energy & Stamina' },
  ];

  const dominantReceipt = receipts[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. DOMINANT HERO: Top Verified Rhythm */}
      {dominantReceipt && (
        <section className="bg-gradient-to-br from-[#2B231F] via-[#352B26] to-[#201A17] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443831] relative overflow-hidden">
          {/* Subtle celestial watermark glow */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10 pointer-events-none hidden md:block">
            <AuraLogo variant="icon" size="xl" theme="white" iconClassName="w-56 h-56" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8E3B22] text-white shadow-2xs">
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#E89E86]" />
                  AURA's #1 Verified Personal Rhythm
                </span>
                <span className="text-xs font-semibold text-[#C7BCB3]">
                  {dominantReceipt.recurrenceRate}% Recurrence across {dominantReceipt.totalCyclesCount} cycles
                </span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F2] font-normal leading-snug">
                "{dominantReceipt.quote}"
              </h1>

              <p className="text-xs sm:text-sm text-[#D1C6BC] leading-relaxed">
                {dominantReceipt.patternDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-left lg:text-right">
                <div className="text-xl font-bold font-serif-editorial text-[#E89E86]">
                  {dominantReceipt.cycleDaysRange}
                </div>
                <div className="text-[11px] font-semibold text-[#E6DBD1] uppercase tracking-wider capitalize">
                  {dominantReceipt.phase} Phase
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToToday}
                className="px-5 py-2.5 rounded-xl bg-white text-[#2B231F] text-xs font-bold hover:bg-[#F5EFE9] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Log Today's Sensations</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8E3B22]" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. FILTER STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] p-2 rounded-2xl border border-[#EAE3D9]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#7A6F66] font-bold flex items-center gap-1 px-2">
            <Filter className="w-3.5 h-3.5 text-[#8E3B22]" /> Filter:
          </span>
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedBucket(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBucket === opt.id
                  ? 'bg-white text-[#2B231F] shadow-xs border border-[#E0D7CC]'
                  : 'text-[#695D54] hover:text-[#2B231F] hover:bg-white/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-[#8E3B22] px-3 py-1 bg-white rounded-xl border border-[#EAE3D9]">
          {filteredReceipts.length} Active Receipts
        </span>
      </div>

      {/* 3. RECEIPTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReceipts.map((receipt, idx) => {
          const isExpanded = expandedReceiptId === receipt.id;
          return (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs hover:border-[#DECFC2] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAF4EF] text-[#8E3B22] border border-[#F2DFD5]">
                    {receipt.cycleDaysRange}
                  </span>

                  <span className="text-xs font-bold text-[#2C6E49] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full border border-[#D0EADB] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2C6E49]" />
                    {receipt.recurrenceRate}% ({receipt.cyclesPresentCount}/{receipt.totalCyclesCount} cycles)
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif-editorial text-2xl text-[#2B231F] font-normal">
                  {receipt.title}
                </h3>

                {/* Core Quote */}
                <p className="font-serif-editorial italic text-sm text-[#7A3622] bg-[#FAF5F2] p-3 rounded-xl border border-[#F2E5DC]">
                  "{receipt.quote}"
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#54483E] leading-relaxed">
                  {receipt.patternDescription}
                </p>

                {/* Tagged Feelings */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {receipt.feelingLabels.map((label, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded-md bg-[#F2ECE5] text-[#54483E] text-[11px] font-semibold"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Expandable Biological Why */}
                <div className="pt-2 border-t border-[#F2ECE4]">
                  <button
                    type="button"
                    onClick={() => setExpandedReceiptId(isExpanded ? null : receipt.id)}
                    className="text-xs font-bold text-[#8E3B22] flex items-center justify-between w-full cursor-pointer py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#D97C38]" />
                      {isExpanded ? 'Hide Biological Explanation' : 'Why does your body do this?'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-[#8E3B22]" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DC] text-xs text-[#594E45] leading-relaxed">
                          {receipt.biologicalWhy}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#8A7D73]">
                <span className="capitalize">{receipt.phase} Phase Rhythm</span>
                <button
                  type="button"
                  onClick={onNavigateToToday}
                  className="font-bold text-[#8E3B22] hover:text-[#5E2210] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Test in Today</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reassurance Footer Note */}
      <div className="bg-[#F5EFE7] rounded-2xl p-5 border border-[#E3D9CD] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#8E3B22] shrink-0 mt-0.5" />
        <div className="text-xs text-[#594E45] leading-relaxed space-y-1">
          <p className="font-bold text-[#2B231F]">How AURA generates Body Receipts</p>
          <p>
            When you log how you feel, AURA clusters similar cycle days across past periods. A receipt is generated when a feeling cluster appears consistently across multiple recorded cycles.
          </p>
        </div>
      </div>
    </div>
  );
};
