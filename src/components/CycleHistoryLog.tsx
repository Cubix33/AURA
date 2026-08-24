import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Filter, Trash2, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { getFeelingLabel } from '../data/feelingsData';
import { DailyLog, UserCycleProfile } from '../types';
import { getCyclePhase, getPhaseDisplayName } from '../utils/patternEngine';

interface CycleHistoryLogProps {
  allLogs: DailyLog[];
  profile: UserCycleProfile;
  onDeleteLog: (id: string) => void;
}

export const CycleHistoryLog: React.FC<CycleHistoryLogProps> = ({
  allLogs,
  profile,
  onDeleteLog,
}) => {
  const [selectedCycleFilter, setSelectedCycleFilter] = useState<string>('all');
  const [searchFeeling, setSearchFeeling] = useState<string>('');

  // Group logs by cycle
  const sortedLogs = [...allLogs].sort((a, b) => b.createdAt - a.createdAt);

  const filteredLogs = sortedLogs.filter((log) => {
    if (selectedCycleFilter !== 'all' && String(log.cycleNumber) !== selectedCycleFilter) {
      return false;
    }
    if (searchFeeling) {
      const match = log.feelings.some((f) =>
        getFeelingLabel(f).toLowerCase().includes(searchFeeling.toLowerCase())
      );
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE5DB] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F0EBE3] text-[#544940] mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#8E3B22]" />
              Rhythm Timeline
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2B231F] font-normal">
              Logged Cycle History
            </h1>
            <p className="text-[#6E635A] text-sm mt-1">
              Every data point feeds your pattern recognition engine across multiple cycles.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-serif-editorial text-[#8E3B22]">
              {allLogs.length}
            </span>
            <p className="text-xs font-semibold text-[#544940]">Total Logs Stored</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-5 border-t border-[#EAE3D9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#8A7D73]">Cycle:</span>
            <button
              onClick={() => setSelectedCycleFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCycleFilter === 'all'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-[#E0D7CC] text-[#544940]'
              }`}
            >
              All Cycles
            </button>
            <button
              onClick={() => setSelectedCycleFilter('0')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCycleFilter === '0'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-[#E0D7CC] text-[#544940]'
              }`}
            >
              Current Cycle
            </button>
            <button
              onClick={() => setSelectedCycleFilter('-1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCycleFilter === '-1'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-[#E0D7CC] text-[#544940]'
              }`}
            >
              Last Cycle (-1)
            </button>
            <button
              onClick={() => setSelectedCycleFilter('-2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCycleFilter === '-2'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-[#E0D7CC] text-[#544940]'
              }`}
            >
              2 Cycles Ago (-2)
            </button>
            <button
              onClick={() => setSelectedCycleFilter('-3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCycleFilter === '-3'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-[#E0D7CC] text-[#544940]'
              }`}
            >
              3 Cycles Ago (-3)
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search feeling (e.g. hungry)..."
              value={searchFeeling}
              onChange={(e) => setSearchFeeling(e.target.value)}
              className="px-3.5 py-1.5 text-xs rounded-xl border border-[#E0D7CC] bg-[#FAF8F5] text-[#2C2420] placeholder-[#9C8F84] focus:outline-none focus:ring-1 focus:ring-[#8E3B22]"
            />
          </div>
        </div>
      </section>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const phase = getCyclePhase(log.cycleDay, profile.averageCycleLength, profile.averagePeriodLength);
            const phaseName = getPhaseDisplayName(phase);

            let cycleLabel = `Cycle ${log.cycleNumber}`;
            if (log.cycleNumber === 0) cycleLabel = 'Current Cycle';
            else if (log.cycleNumber === -1) cycleLabel = 'Last Cycle (Cycle -1)';
            else if (log.cycleNumber === -2) cycleLabel = '2 Cycles Ago (Cycle -2)';
            else if (log.cycleNumber === -3) cycleLabel = '3 Cycles Ago (Cycle -3)';

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 md:p-5 border border-[#EAE3D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF4EF] text-[#8E3B22] font-bold text-xs border border-[#F2DFD5]">
                      Day {log.cycleDay}
                    </span>
                    <span className="text-xs font-semibold text-[#52463E]">{log.date}</span>
                    <span className="text-xs text-[#8A7D73]">· {cycleLabel}</span>
                    <span className="text-xs text-[#7A6E64] px-2 py-0.5 rounded bg-[#F2ECE5]">
                      {phaseName}
                    </span>
                  </div>

                  {/* Feelings pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {log.feelings.map((fId) => (
                      <span
                        key={fId}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF6F2] text-[#423730] text-xs font-medium border border-[#ECE2D8]"
                      >
                        {getFeelingLabel(fId)}
                      </span>
                    ))}
                  </div>

                  {log.notes && (
                    <p className="text-xs text-[#6B5E54] italic">"{log.notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    title="Delete log"
                    className="p-2 rounded-xl text-[#9C8E82] hover:text-[#B83E3E] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE3D9] text-[#8A7D73]">
            <p className="font-serif-editorial text-lg text-[#2B231F]">No matching logs found</p>
            <p className="text-xs mt-1">Try changing your filter or log today's sensations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
