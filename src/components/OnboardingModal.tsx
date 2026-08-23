import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Heart, Shield, Check, Info, X } from 'lucide-react';
import { UserCycleProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  isInitialSetup: boolean;
  currentProfile: UserCycleProfile;
  onSave: (newProfile: UserCycleProfile, loadSampleData: boolean) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  isInitialSetup,
  currentProfile,
  onSave,
  onClose,
}) => {
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(
    currentProfile.lastPeriodDate ||
      new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [cycleLength, setCycleLength] = useState<number>(currentProfile.averageCycleLength || 28);
  const [periodLength, setPeriodLength] = useState<number>(currentProfile.averagePeriodLength || 5);
  const [loadSampleData, setLoadSampleData] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        lastPeriodDate,
        averageCycleLength: Number(cycleLength),
        averagePeriodLength: Number(periodLength),
        onboardingCompleted: true,
        hasSampleData: loadSampleData,
      },
      loadSampleData
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231E1B]/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#EAE2D7] shadow-xl relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#F3E2D8]/50 rounded-full blur-3xl pointer-events-none" />

        {onClose && !isInitialSetup && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-[#8A7D73] hover:text-[#2C2420] hover:bg-[#F7F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F5EAE4] text-[#8E3B22] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isInitialSetup ? 'Welcome to AURA' : 'Cycle Profile Settings'}
          </div>
          <h2 className="font-serif-editorial text-3xl text-[#2B231F] font-normal">
            {isInitialSetup ? 'Why do I feel like this today?' : 'Update Cycle Parameters'}
          </h2>
          <p className="text-xs md:text-sm text-[#6E635A] mt-1">
            Log how you feel. AURA helps you spot recurring patterns across your cycle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Last Period Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#73665C] mb-1.5">
              When did your last period start?
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFD5C8] bg-[#FAF8F5] text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8E3B22]/20 focus:border-[#8E3B22]"
              />
            </div>
            <p className="text-[11px] text-[#8C7F74] mt-1">
              Calculates your current cycle day and biological phase.
            </p>
          </div>

          {/* Average Cycle Length */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#73665C]">
                Average Cycle Length
              </label>
              <span className="text-xs font-bold text-[#8E3B22] px-2 py-0.5 rounded bg-[#FAF2ED] border border-[#F2DFD5]">
                {cycleLength} days
              </span>
            </div>
            <input
              type="range"
              min={21}
              max={38}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-[#8E3B22] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9E9085] mt-0.5">
              <span>21 days</span>
              <span>28 days (Typical)</span>
              <span>38 days</span>
            </div>
          </div>

          {/* Average Period Length */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#73665C]">
                Average Period Duration
              </label>
              <span className="text-xs font-bold text-[#8E3B22] px-2 py-0.5 rounded bg-[#FAF2ED] border border-[#F2DFD5]">
                {periodLength} days
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={9}
              value={periodLength}
              onChange={(e) => setPeriodLength(Number(e.target.value))}
              className="w-full accent-[#8E3B22] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9E9085] mt-0.5">
              <span>3 days</span>
              <span>5 days (Typical)</span>
              <span>9 days</span>
            </div>
          </div>

          {/* Sample Historical Data Toggle */}
          {isInitialSetup && (
            <div className="bg-[#FAF6F2] rounded-2xl p-4 border border-[#ECE2D5] space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={loadSampleData}
                  onChange={(e) => setLoadSampleData(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#8E3B22] accent-[#8E3B22] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-[#2B231F]">
                    Preload 3 cycles of historical data (Recommended)
                  </span>
                  <p className="text-[11px] text-[#6E6157] leading-relaxed mt-0.5">
                    Enables immediate demonstration of AURA's multi-cycle pattern engine (such as late luteal hunger surges and ovulatory flirty energy).
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#8E3B22] text-white font-bold text-sm hover:bg-[#722F1B] active:scale-[0.98] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isInitialSetup ? 'Enter AURA Rhythm Tracker' : 'Save Cycle Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
