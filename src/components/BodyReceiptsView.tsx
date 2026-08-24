import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  FileCheck2,
  Filter,
  ArrowUpRight,
  Heart,
  Flame,
  Zap,
  Activity,
  Droplet,
  Calendar,
  Info
} from 'lucide-react';
import { getAllBodyReceipts } from '../utils/patternEngine';
import { BodyReceipt, BucketType, DailyLog } from '../types';

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
  const receipts = getAllBodyReceipts(allLogs, cycleLength);

  const filteredReceipts =
    selectedBucket === 'all'
      ? receipts
      : receipts.filter((r) => r.bucket === selectedBucket);

  const filterOptions: Array<{ id: string; label: string; icon?: React.ReactNode }> = [
    { id: 'all', label: 'All Receipts' },
    { id: 'appetite', label: 'Appetite & Fuel' },
    { id: 'mood', label: 'Mood & Calm' },
    { id: 'libido', label: 'Libido & Vitality' },
    { id: 'sensations', label: 'Body Sensations' },
    { id: 'energy', label: 'Energy & Stamina' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-white to-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-[#EDE5DB] shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F5EAE4] text-[#8E3B22] mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              Verified Pattern Intelligence
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2B231F] font-normal">
              Your Body Receipts
            </h1>
            <p className="text-[#6E635A] text-sm md:text-base mt-2 max-w-2xl">
              A summary of recurring personal patterns across your last 3 cycles. These receipts prove your symptoms aren't random or unpredictable—they are reliable rhythms.
            </p>
          </div>

          <div className="bg-white/90 px-4 py-3 rounded-2xl border border-[#E5DDD2] shadow-xs text-center">
            <span className="text-2xl font-bold text-[#8E3B22] font-serif-editorial">
              {receipts.length}
            </span>
            <p className="text-xs font-semibold text-[#544940]">Active Receipts</p>
            <p className="text-[10px] text-[#8A7D73]">100% Recurrence</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-5 border-t border-[#EAE3D9] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8A7D73] font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedBucket(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedBucket === opt.id
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-white border border-[#E3DAD0] text-[#594E45] hover:bg-[#F7F2EB]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReceipts.map((receipt, idx) => (
          <motion.div
            key={receipt.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-[#EAE3D9] shadow-xs hover:shadow-md hover:border-[#DECFC2] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Receipt Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAF4EF] text-[#8E3B22] border border-[#F2DFD5]">
                  {receipt.cycleDaysRange}
                </span>

                <span className="text-xs font-bold text-[#2C6E49] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full border border-[#D0EADB]">
                  {receipt.recurrenceRate}% Recurrence ({receipt.cyclesPresentCount}/{receipt.totalCyclesCount} cycles)
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif-editorial text-2xl text-[#2B231F] font-normal mb-2">
                {receipt.title}
              </h2>

              {/* Core Quote */}
              <p className="font-serif-editorial italic text-base text-[#7A3622] bg-[#FAF5F2] p-3 rounded-xl border border-[#F2E5DC] mb-4">
                {receipt.quote}
              </p>

              {/* Pattern description */}
              <p className="text-sm text-[#4E443C] leading-relaxed mb-4">
                {receipt.patternDescription}
              </p>

              {/* Biological Reason */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE5DC] text-xs space-y-1.5 mb-4">
                <div className="font-bold text-[#8C7667] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D97C38]" /> The Biological Why
                </div>
                <p className="text-[#594E45] leading-relaxed">
                  {receipt.biologicalWhy}
                </p>
              </div>

              {/* Tagged Feelings */}
              <div className="flex flex-wrap gap-1.5">
                {receipt.feelingLabels.map((label, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2 py-0.5 rounded-md bg-[#F2ECE5] text-[#54483E] text-[11px] font-semibold"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="mt-5 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#8A7D73]">
              <span className="capitalize">{receipt.phase} Phase Rhythm</span>
              <button
                onClick={onNavigateToToday}
                className="font-semibold text-[#8E3B22] hover:text-[#5E2210] flex items-center gap-1 transition-colors cursor-pointer"
              >
                Log Today <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
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
