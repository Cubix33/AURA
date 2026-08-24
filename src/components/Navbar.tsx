import React from 'react';
import {
  Sparkles,
  Calendar,
  FileCheck2,
  Activity,
  Settings,
  HeartPulse,
  Apple,
  Shield,
  Coins,
  EyeOff,
  Radio
} from 'lucide-react';

export type TabType =
  | 'today'
  | 'receipts'
  | 'rhythms'
  | 'history'
  | 'body_mind'
  | 'rights_safety'
  | 'empowerment';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onToggleDiscreetMode: () => void;
  receiptCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onToggleDiscreetMode,
  receiptCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onSelectTab('today')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#8E3B22] to-[#B8583B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-2xl sm:text-[26px] font-bold tracking-tight text-[#2B231F]">
                  AURA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#F5EAE4] text-[#8E3B22] hidden md:inline-block">
                  Holistic Sovereignty & Health
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F66] hidden lg:block">
                Hormonal rhythms, nutrition, rights, safety & empowerment
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => onSelectTab('today')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'today'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={() => onSelectTab('receipts')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'receipts'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Receipts</span>
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
              onClick={() => onSelectTab('body_mind')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'body_mind'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Body & Mind</span>
            </button>

            <button
              onClick={() => onSelectTab('rights_safety')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'rights_safety'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Rights & Safety</span>
            </button>

            <button
              onClick={() => onSelectTab('empowerment')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'empowerment'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Empowerment</span>
            </button>

            <button
              onClick={() => onSelectTab('rhythms')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentTab === 'rhythms'
                  ? 'bg-[#2E2420] text-white shadow-xs'
                  : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rhythms</span>
            </button>

            {/* Quick Actions */}
            <div className="pl-2 border-l border-[#E5DDD2] flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleDiscreetMode}
                title="Discreet Safe Mode (Quick disguise as calculator/notes)"
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF3EE] hover:bg-[#F5E6DC] text-[#8E3B22] border border-[#ECD9CC] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Discreet</span>
              </button>

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
