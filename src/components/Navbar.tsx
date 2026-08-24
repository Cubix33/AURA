import React from 'react';
import { Sparkles, Calendar, FileCheck2, Activity, Settings, RotateCcw, HeartPulse } from 'lucide-react';

export type TabType = 'today' | 'receipts' | 'rhythms' | 'history';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  receiptCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onResetData,
  receiptCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onSelectTab('today')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#8E3B22] to-[#B8583B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-2xl sm:text-[26px] font-bold tracking-tight text-[#2B231F]">
                  AURA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#F5EAE4] text-[#8E3B22] hidden sm:inline-block">
                  Cycle Sync & Insights
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F66] hidden md:block">
                Why do I feel like this today? Spot patterns across your cycle.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('today')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'today'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Today</span>
            </button>

            <button
              onClick={() => onSelectTab('receipts')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'receipts'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Body Receipts</span>
              {receiptCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    currentTab === 'receipts'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F2DFD5] text-[#8E3B22]'
                  }`}
                >
                  {receiptCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('rhythms')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'rhythms'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">My Rhythms</span>
              <span className="sm:hidden">Rhythms</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'history'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>

            {/* Quick Actions */}
            <div className="pl-1 sm:pl-2 border-l border-[#E5DDD2] flex items-center gap-1">
              <button
                onClick={onOpenSettings}
                title="Cycle Settings"
                className="p-2 rounded-xl text-[#786C62] hover:text-[#2E2420] hover:bg-[#F2ECE5] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
