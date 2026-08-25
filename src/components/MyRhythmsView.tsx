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
  Clock,
  Compass,
  ArrowRight
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. DOMINANT HERO: Active Day Trajectory & Biological State */}
      <section className="bg-gradient-to-br from-[#2B231F] via-[#352B26] to-[#201A17] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443831] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8E3B22] text-white shadow-2xs">
                <Activity className="w-3.5 h-3.5 text-[#E89E86]" />
                Biological Rhythm Trajectory
              </span>
              <span className="text-xs font-semibold text-[#C7BCB3]">
                Inspecting Day {inspectedDay} · {phaseTitle}
              </span>
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F2] font-normal leading-snug">
              {inspectedPhase === 'luteal' && 'Progesterone Surge & Natural Caloric Burn'}
              {inspectedPhase === 'ovulatory' && 'Estrogen Peak, High Confidence & Vitality'}
              {inspectedPhase === 'follicular' && 'Rising Estrogen, Mental Focus & Physical Stamina'}
              {inspectedPhase === 'menstrual' && 'Baseline Recovery, Pelvic Care & Restorative Quiet'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D1C6BC] leading-relaxed">
              {phaseDesc}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 shrink-0 self-start lg:self-auto text-left lg:text-right">
            <span className="text-[10px] text-[#E89E86] uppercase font-bold tracking-widest block">
              Inspected Day
            </span>
            <div className="text-3xl font-serif-editorial font-bold text-white mt-0.5">
              Day {inspectedDay}
            </div>
            <p className="text-xs text-[#D1C6BC] mt-0.5">
              {matchingLogsForDay.length} multi-cycle receipts recorded
            </p>
          </div>
        </div>
      </section>

      {/* 2. 4 PHASES SNAPSHOT STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            phase: 'menstrual',
            range: `Days 1–${periodLength}`,
            title: 'Menstrual',
            summary: 'Pelvic rest & iron replenishment',
            color: '#BF3D3D',
            bg: 'bg-[#FDF4F4]',
            border: 'border-[#F7D8D8]',
            activeBg: 'ring-2 ring-[#BF3D3D]',
          },
          {
            phase: 'follicular',
            range: `Days ${periodLength + 1}–12`,
            title: 'Follicular',
            summary: 'Rising stamina & mental acuity',
            color: '#3E7D59',
            bg: 'bg-[#F2F7F4]',
            border: 'border-[#D2E6DB]',
            activeBg: 'ring-2 ring-[#3E7D59]',
          },
          {
            phase: 'ovulatory',
            range: 'Days 13–16',
            title: 'Ovulatory',
            summary: 'Fertile peak & high energy',
            color: '#C47525',
            bg: 'bg-[#FDF7EE]',
            border: 'border-[#F5DCB5]',
            activeBg: 'ring-2 ring-[#C47525]',
          },
          {
            phase: 'luteal',
            range: `Days 17–${cycleLength}`,
            title: 'Luteal',
            summary: 'Progesterone surge & calming needs',
            color: '#8E3B22',
            bg: 'bg-[#FAF4EF]',
            border: 'border-[#F1DDD1]',
            activeBg: 'ring-2 ring-[#8E3B22]',
          },
        ].map((p) => {
          const isActive = inspectedPhase === p.phase;
          return (
            <div
              key={p.phase}
              className={`rounded-2xl p-3.5 border transition-all ${p.bg} ${p.border} ${
                isActive ? `${p.activeBg} shadow-xs` : 'opacity-85'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A6F66]">
                  {p.range}
                </span>
                {isActive && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/90 shadow-2xs text-[#2B231F]">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="font-serif-editorial text-base text-[#2B231F] font-bold mt-1">
                {p.title}
              </h3>
              <p className="text-[11px] text-[#594E45] mt-0.5 leading-snug">
                {p.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. 28-DAY INTERACTIVE HEATMAP STRIP */}
      <section className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2B231F] uppercase tracking-wider">
              Cycle Day Explorer
            </h2>
            <p className="text-xs text-[#7A6F66]">
              Click any day across your {cycleLength}-day cycle to inspect verified logs and hormone curves.
            </p>
          </div>

          <span className="text-xs font-semibold text-[#8E3B22] bg-[#FAF5F2] px-3 py-1 rounded-xl border border-[#F2E3DB]">
            Selected: Day {inspectedDay} ({phaseTitle})
          </span>
        </div>

        {/* Days Strip */}
        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
          {Array.from({ length: cycleLength }, (_, i) => i + 1).map((day) => {
            const phase = getCyclePhase(day, cycleLength, periodLength);
            const isSelected = inspectedDay === day;
            const symptomCount = getDayTotalSymptoms(day);

            let bgClass = 'bg-[#FAF7F2] text-[#594E45] border-[#EAE1D5]';
            if (phase === 'menstrual') bgClass = 'bg-[#FDF4F4] text-[#8C3427] border-[#F7D8D8]';
            else if (phase === 'follicular') bgClass = 'bg-[#F2F7F4] text-[#28593E] border-[#D2E6DB]';
            else if (phase === 'ovulatory') bgClass = 'bg-[#FDF7EE] text-[#8F5518] border-[#F5DCB5]';
            else bgClass = 'bg-[#FAF4EF] text-[#7A3622] border-[#F1DDD1]';

            return (
              <button
                key={day}
                onClick={() => setInspectedDay(day)}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-between transition-all border cursor-pointer ${bgClass} ${
                  isSelected
                    ? 'ring-2 ring-[#2B231F] shadow-sm scale-105 z-10'
                    : 'hover:scale-102 hover:shadow-2xs'
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
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E1D7] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E1D7] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E0D6CA] flex items-center justify-center font-bold text-sm text-[#8E3B22] shadow-2xs">
                {inspectedDay}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2B231F]">{phaseTitle} State</h3>
                <p className="text-xs text-[#7A6F66]">{phaseDesc}</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#61544B] bg-white px-3 py-1 rounded-full border border-[#E2D8CC]">
              {matchingLogsForDay.length} Logs recorded around Day {inspectedDay}
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
                      className="bg-white p-3 rounded-xl border border-[#EAE3D9] text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#2C2420]">
                        <span>{cycleLabel}</span>
                        <span className="text-[#8E3B22] text-[11px]">Day {log.cycleDay}</span>
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
        </div>
      </section>
    </div>
  );
};
