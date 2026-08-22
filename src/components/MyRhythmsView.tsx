import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Activity,
  Calendar,
  Heart,
  Flame,
  Zap,
  Droplet,
  Info,
  Clock
} from 'lucide-react';
import { getFeelingLabel } from '../data/feelingsData';
import { CyclePhase, DailyLog } from '../types';
import { getCyclePhase, getPhaseDescription, getPhaseDisplayName } from '../utils/patternEngine';

interface MyRhythmsViewProps {
  allLogs: DailyLog[];
  cycleLength: number;
  periodLength: number;
}

export const MyRhythmsView: React.FC<MyRhythmsViewProps> = ({
  allLogs,
  cycleLength,
  periodLength,
}) => {
  const [inspectedDay, setInspectedDay] = useState<number>(24);
  const [selectedRhythmCategory, setSelectedRhythmCategory] = useState<string>('all');

  const inspectedPhase = getCyclePhase(inspectedDay, cycleLength, periodLength);
  const phaseTitle = getPhaseDisplayName(inspectedPhase);
  const phaseDesc = getPhaseDescription(inspectedPhase);

  // Find logs from all cycles on this cycle day (±1 day)
  const matchingLogsForDay = allLogs.filter(
    (l) => Math.abs(l.cycleDay - inspectedDay) <= 1
  );

  // Count feeling frequencies across the entire cycle for heatmap
  const dayFeelingsMap: Record<number, Record<string, number>> = {};
  for (let d = 1; d <= cycleLength; d++) {
    dayFeelingsMap[d] = {};
  }

  allLogs.forEach((l) => {
    if (dayFeelingsMap[l.cycleDay]) {
      l.feelings.forEach((f) => {
        dayFeelingsMap[l.cycleDay][f] = (dayFeelingsMap[l.cycleDay][f] || 0) + 1;
      });
    }
  });

  const getDayTotalSymptoms = (day: number) => {
    const counts = dayFeelingsMap[day] || {};
    return Object.values(counts).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-[#EDE5DB] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F0EBE3] text-[#544940] mb-2">
          <Activity className="w-3.5 h-3.5 text-[#8E3B22]" />
          Cycle Rhythm Map
        </div>
        <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2B231F] font-normal">
          My Biological Rhythms
        </h1>
        <p className="text-[#6E635A] text-sm md:text-base mt-2 max-w-2xl">
          Observe how your appetite, mood, energy, libido, and physical sensations transition across each phase of your {cycleLength}-day cycle.
        </p>

        {/* 4 Phases Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#EAE3D9]">
          <div className="bg-[#FAF3F2] border border-[#F0D5D0] rounded-2xl p-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#B84E3E]">
              Days 1–{periodLength}
            </span>
            <h3 className="font-serif-editorial text-lg text-[#2B231F] font-normal mt-0.5">Menstrual</h3>
            <p className="text-xs text-[#6B5A54] mt-1">Cramps, low baseline, restorative quiet.</p>
          </div>

          <div className="bg-[#F2F7F4] border border-[#D2E6DB] rounded-2xl p-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#3E7D59]">
              Days {periodLength + 1}–12
            </span>
            <h3 className="font-serif-editorial text-lg text-[#2B231F] font-normal mt-0.5">Follicular</h3>
            <p className="text-xs text-[#52665B] mt-1">Estrogen rises, mental clarity & stamina build.</p>
          </div>

          <div className="bg-[#FDF7EE] border border-[#F5DCB5] rounded-2xl p-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C47525]">
              Days 13–16
            </span>
            <h3 className="font-serif-editorial text-lg text-[#2B231F] font-normal mt-0.5">Ovulatory</h3>
            <p className="text-xs text-[#7A5B3D] mt-1">Peak estrogen & LH, flirty high energy.</p>
          </div>

          <div className="bg-[#F7F2F6] border border-[#E3D1E0] rounded-2xl p-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#8F4E80]">
              Days 17–{cycleLength}
            </span>
            <h3 className="font-serif-editorial text-lg text-[#2B231F] font-normal mt-0.5">Luteal</h3>
            <p className="text-xs text-[#665262] mt-1">Progesterone surges; appetite & bloat emerge.</p>
          </div>
        </div>
      </section>

      {/* Interactive 28-Day Heatmap & Wheel */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#EAE3D9] shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#2B231F]">28-Day Feeling Heatmap</h2>
            <p className="text-xs text-[#8A7D73]">
              Click any day below to inspect historical sensation logs and hormonal trajectory.
            </p>
          </div>

          <div className="text-xs font-semibold text-[#8E3B22] bg-[#FAF5F2] px-3 py-1 rounded-lg border border-[#F2E3DB]">
            Selected: Day {inspectedDay} ({phaseTitle})
          </div>
        </div>

        {/* Days Strip */}
        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
          {Array.from({ length: cycleLength }, (_, i) => i + 1).map((day) => {
            const phase = getCyclePhase(day, cycleLength, periodLength);
            const isSelected = inspectedDay === day;
            const symptomCount = getDayTotalSymptoms(day);

            let bgClass = 'bg-[#FAF7F2] text-[#594E45]';
            if (phase === 'menstrual') bgClass = 'bg-[#FBEAE8] text-[#8C3427] border-[#F2CDC8]';
            else if (phase === 'follicular') bgClass = 'bg-[#EBF5EF] text-[#28593E] border-[#CCE5D5]';
            else if (phase === 'ovulatory') bgClass = 'bg-[#FDF3E3] text-[#8F5518] border-[#F5DCB5]';
            else bgClass = 'bg-[#F5EBF4] text-[#69345D] border-[#E3CCE0]';

            return (
              <button
                key={day}
                onClick={() => setInspectedDay(day)}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-between transition-all border cursor-pointer ${bgClass} ${
                  isSelected
                    ? 'ring-2 ring-[#2E2420] shadow-md scale-105 z-10'
                    : 'hover:scale-102 hover:shadow-xs'
                }`}
              >
                <span className="text-[10px] font-bold">{day}</span>
                <div className="mt-1 flex gap-0.5 justify-center">
                  {symptomCount > 0 && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        symptomCount >= 3 ? 'bg-[#8E3B22]' : 'bg-[#9C8F84]'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inspected Day Details Card */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#E8E1D7] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E1D7] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E0D6CA] flex items-center justify-center font-bold text-[#8E3B22]">
                {inspectedDay}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2B231F]">{phaseTitle} Rhythm</h3>
                <p className="text-xs text-[#7A6F66]">{phaseDesc}</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#61544B] bg-white px-3 py-1 rounded-full border border-[#E2D8CC]">
              {matchingLogsForDay.length} Historical Logs recorded around Day {inspectedDay}
            </span>
          </div>

          {/* Sensation summary for this day */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7D73] mb-2">
              Sensation Highlights Recorded on Day {inspectedDay} (±1 day)
            </h4>

            {matchingLogsForDay.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {matchingLogsForDay.map((log) => {
                  let cycleLabel = `Cycle ${log.cycleNumber}`;
                  if (log.cycleNumber === 0) cycleLabel = 'Current Cycle';
                  else if (log.cycleNumber === -1) cycleLabel = 'Last Cycle';
                  else if (log.cycleNumber === -2) cycleLabel = '2 Cycles Ago';
                  else if (log.cycleNumber === -3) cycleLabel = '3 Cycles Ago';

                  return (
                    <div
                      key={log.id}
                      className="bg-white p-3 rounded-xl border border-[#EAE3D9] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#2C2420]">
                        <span>{cycleLabel}</span>
                        <span className="text-[#8E3B22]">Day {log.cycleDay}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {log.feelings.map((fId) => (
                          <span
                            key={fId}
                            className="px-1.5 py-0.5 rounded bg-[#F7EFEA] text-[#7A3622] text-[11px] font-medium"
                          >
                            {getFeelingLabel(fId)}
                          </span>
                        ))}
                      </div>
                      {log.notes && (
                        <p className="text-[11px] text-[#7A6E64] italic pt-1 border-t border-[#F5EFE7]">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#8A7D73] italic">
                No past logs recorded on Day {inspectedDay} yet. Log how you feel on the Today screen to build this day's rhythm map!
              </p>
            )}
          </div>

          {/* Biological Hormone Explanation */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E1D7] flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-[#8E3B22] shrink-0 mt-0.5" />
            <div className="text-xs text-[#4F443C] space-y-1">
              <p className="font-bold text-[#2B231F]">Hormonal Dynamics at Day {inspectedDay}</p>
              {inspectedPhase === 'luteal' && (
                <p>
                  Progesterone dominates the luteal phase, peaking midway before dropping. This increases caloric burn, alters GABA sensitivity, and causes fluid retention.
                </p>
              )}
              {inspectedPhase === 'ovulatory' && (
                <p>
                  Estrogen peaks while LH triggers ovulation. Testosterone also experiences a brief surge, driving confidence, elevated mood, and increased libido.
                </p>
              )}
              {inspectedPhase === 'follicular' && (
                <p>
                  Estrogen climbs steadily from post-menses baseline, improving glucose tolerance, mood neurotransmitters, and workout stamina.
                </p>
              )}
              {inspectedPhase === 'menstrual' && (
                <p>
                  Estrogen and progesterone drop to baseline levels, prompting the uterine lining to shed. The nervous system naturally seeks quiet, gentle recovery.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
