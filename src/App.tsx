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
import { AuthModal } from './components/AuthModal';
import { AuraLogo } from './components/AuraLogo';
import { DailyLog, UserAccount, UserCycleProfile } from './types';
import { generateSampleHistoricalLogs, getInitialCycleProfile } from './data/sampleHistoricalData';
import { getAllBodyReceipts } from './utils/patternEngine';
import { auth, db, onAuthStateChanged, signOut, doc, getDoc, setDoc } from './firebase';

const USER_STORAGE_KEY = 'aura_active_user_v1';
const ACCOUNTS_STORAGE_KEY = 'aura_registered_accounts_v1';
const PROFILE_STORAGE_KEY = 'aura_cycle_profile_v1';
const LOGS_STORAGE_KEY = 'aura_cycle_logs_v1';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });

  const [profile, setProfile] = useState<UserCycleProfile>(() => {
    if (currentUser?.cycleProfile) {
      return currentUser.cycleProfile;
    }
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
  const [bodyMindSubTab, setBodyMindSubTab] = useState<'nutrition' | 'sexual_health' | 'mental_health' | 'red_flags'>('nutrition');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login' | 'profile'>('register');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !currentUser && !profile.onboardingCompleted);
  const [isDiscreetMode, setIsDiscreetMode] = useState<boolean>(false);

  // Dynamic calculation of registered members tracking
  const [totalMemberCount, setTotalMemberCount] = useState<number>(() => {
    const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const count = rawAccounts ? JSON.parse(rawAccounts).length : 2;
    return 1248 + count;
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
  }, [allLogs]);

  // Global Quick Escape with Escape key (press ESC to toggle Discreet mode instantly)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSettingsOpen && !showOnboarding && !isAuthModalOpen) {
        setIsDiscreetMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, showOnboarding, isAuthModalOpen]);

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

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        cycleProfile: newProfile,
      });
    }

    if (shouldLoadSampleData) {
      const sampleLogs = generateSampleHistoricalLogs(newProfile.lastPeriodDate, newProfile.averageCycleLength);
      setAllLogs(sampleLogs);
    }
  };

  // Auth Handlers
  const handleRegisterUser = (newAccount: UserAccount, shouldLoadSampleData: boolean) => {
    setCurrentUser(newAccount);
    setProfile(newAccount.cycleProfile);
    setShowOnboarding(false);

    // Save to accounts list
    try {
      const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const accounts: UserAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];
      const updated = [newAccount, ...accounts.filter((a) => a.email !== newAccount.email)];
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
      setTotalMemberCount(1248 + updated.length);
    } catch (e) {
      // Fallback
    }

    if (shouldLoadSampleData) {
      const sampleLogs = generateSampleHistoricalLogs(
        newAccount.cycleProfile.lastPeriodDate,
        newAccount.cycleProfile.averageCycleLength
      );
      setAllLogs(sampleLogs);
    }
  };

  const handleLoginUser = (account: UserAccount) => {
    setCurrentUser(account);
    setProfile(account.cycleProfile);
    setShowOnboarding(false);
  };

  const handleLogoutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setCurrentUser(null);
  };

  const handleOpenAuth = (mode: 'register' | 'login' | 'profile' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
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
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogoutUser}
        totalMemberCount={totalMemberCount}
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
            onNavigateToTab={(tab, subTab) => {
              setCurrentTab(tab);
              if (
                subTab &&
                (subTab === 'nutrition' ||
                  subTab === 'sexual_health' ||
                  subTab === 'mental_health' ||
                  subTab === 'red_flags')
              ) {
                setBodyMindSubTab(subTab);
              }
            }}
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
          <BodyAndMindView profile={profile} initialSubTab={bodyMindSubTab} />
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

      {/* Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onRegister={handleRegisterUser}
        onLogin={handleLoginUser}
        onLogout={handleLogoutUser}
        onUpdateProfile={(updatedProfile) => handleSaveProfile(updatedProfile, false)}
        initialMode={authModalMode}
        totalMemberCount={totalMemberCount}
      />

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

      {/* Minimal Footer with Official AURA Logo */}
      <footer className="border-t border-[#EAE3D9] py-8 text-center text-xs text-[#8A7D73] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AuraLogo variant="horizontal" size="sm" theme="terracotta" />
            <span className="text-[11px] text-[#7A6E64] hidden md:inline">
              · Biological rhythm intelligence & hormonal pattern verification.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {!currentUser && (
              <>
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="font-bold text-[#8E3B22] hover:underline cursor-pointer"
                >
                  Create Account
                </button>
                <span>·</span>
              </>
            )}
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

