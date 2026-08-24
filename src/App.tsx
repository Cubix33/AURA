/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { TodayLogger } from './components/TodayLogger';
import { BodyReceiptsView } from './components/BodyReceiptsView';
import { MyRhythmsView } from './components/MyRhythmsView';
import { CycleHistoryLog } from './components/CycleHistoryLog';
import { BodyAndMindView } from './components/BodyAndMindView';
import { RightsAndSafetyView } from './components/RightsAndSafetyView';
import { EmpowermentView } from './components/EmpowermentView';
import { DiscreetModeView } from './components/DiscreetModeView';
import { OnboardingModal } from './components/OnboardingModal';
import { DailyLog, UserCycleProfile } from './types';
import { generateSampleHistoricalLogs, getInitialCycleProfile } from './data/sampleHistoricalData';
import { getAllBodyReceipts } from './utils/patternEngine';

const PROFILE_STORAGE_KEY = 'aura_cycle_profile_v1';
const LOGS_STORAGE_KEY = 'aura_cycle_logs_v1';

export default function App() {
  const [profile, setProfile] = useState<UserCycleProfile>(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return getInitialCycleProfile();
  });

  const [allLogs, setAllLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem(LOGS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    const initialProfile = getInitialCycleProfile();
    return generateSampleHistoricalLogs(initialProfile.lastPeriodDate, initialProfile.averageCycleLength);
  });

  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !profile.onboardingCompleted);
  const [isDiscreetMode, setIsDiscreetMode] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
  }, [allLogs]);

  // Global Quick Escape with Escape key (press ESC to toggle Discreet mode instantly)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSettingsOpen && !showOnboarding) {
        setIsDiscreetMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, showOnboarding]);

  // Handler for saving a new or updated daily log
  const handleSaveLog = (newLog: DailyLog) => {
    setAllLogs((prev) => {
      const existingIndex = prev.findIndex(
        (l) => l.date === newLog.date || (l.cycleNumber === newLog.cycleNumber && l.cycleDay === newLog.cycleDay)
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newLog;
        return updated;
      }
      return [newLog, ...prev];
    });
  };

  const handleDeleteLog = (id: string) => {
    setAllLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSaveProfile = (newProfile: UserCycleProfile, shouldLoadSampleData: boolean) => {
    setProfile(newProfile);
    setShowOnboarding(false);
    setIsSettingsOpen(false);

    if (shouldLoadSampleData) {
      const sampleLogs = generateSampleHistoricalLogs(newProfile.lastPeriodDate, newProfile.averageCycleLength);
      setAllLogs(sampleLogs);
    }
  };

  const handleResetData = () => {
    const initialProf = getInitialCycleProfile();
    setProfile(initialProf);
    const sampleLogs = generateSampleHistoricalLogs(initialProf.lastPeriodDate, initialProf.averageCycleLength);
    setAllLogs(sampleLogs);
  };

  const receipts = getAllBodyReceipts(allLogs, profile.averageCycleLength);

  if (isDiscreetMode) {
    return <DiscreetModeView onExitDiscreetMode={() => setIsDiscreetMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2420] flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleDiscreetMode={() => setIsDiscreetMode(true)}
        receiptCount={receipts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentTab === 'today' && (
          <TodayLogger
            profile={profile}
            allLogs={allLogs}
            onSaveLog={handleSaveLog}
            onExploreRhythms={() => setCurrentTab('rhythms')}
            onViewReceipts={() => setCurrentTab('receipts')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentTab === 'receipts' && (
          <BodyReceiptsView
            allLogs={allLogs}
            cycleLength={profile.averageCycleLength}
            onNavigateToToday={() => setCurrentTab('today')}
          />
        )}

        {currentTab === 'body_mind' && (
          <BodyAndMindView profile={profile} />
        )}

        {currentTab === 'rights_safety' && (
          <RightsAndSafetyView />
        )}

        {currentTab === 'empowerment' && (
          <EmpowermentView />
        )}

        {currentTab === 'rhythms' && (
          <MyRhythmsView
            allLogs={allLogs}
            cycleLength={profile.averageCycleLength}
            periodLength={profile.averagePeriodLength}
          />
        )}

        {currentTab === 'history' && (
          <CycleHistoryLog
            allLogs={allLogs}
            profile={profile}
            onDeleteLog={handleDeleteLog}
          />
        )}
      </main>

      {/* Onboarding & Settings Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        isInitialSetup={true}
        currentProfile={profile}
        onSave={handleSaveProfile}
      />

      <OnboardingModal
        isOpen={isSettingsOpen}
        isInitialSetup={false}
        currentProfile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-[#EAE3D9] py-6 text-center text-xs text-[#8A7D73]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif-editorial text-sm text-[#54483E]">
            AURA · Biological rhythm intelligence, sovereign rights, safety & empowerment.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsDiscreetMode(true)}
              className="hover:text-[#8E3B22] underline cursor-pointer"
              title="Discreet screen (Press ESC)"
            >
              Discreet Mode (ESC)
            </button>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="hover:text-[#8E3B22] underline cursor-pointer"
            >
              Reset Sample Data
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#8E3B22] underline cursor-pointer"
            >
              Recalibrate Cycle
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
