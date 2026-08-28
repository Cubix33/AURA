import React, { useState, useRef, useEffect } from 'react';
import {
  HeartPulse,
  FileCheck2,
  Apple,
  Shield,
  Coins,
  Activity,
  EyeOff,
  User,
  ChevronDown,
  LogOut,
  Sliders,
  Sparkles,
  Settings,
  Menu,
  X,
  Users
} from 'lucide-react';
import { AuraLogo } from './AuraLogo';
import { UserAccount } from '../types';

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
  currentUser?: UserAccount | null;
  onOpenAuth: (initialMode?: 'register' | 'login' | 'profile') => void;
  onLogout?: () => void;
  totalMemberCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onToggleDiscreetMode,
  receiptCount,
  currentUser,
  onOpenAuth,
  onLogout,
  totalMemberCount = 1248,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'receipts', label: 'Receipts', icon: <FileCheck2 className="w-3.5 h-3.5" />, badge: receiptCount },
    { id: 'body_mind', label: 'Body & Mind', icon: <Apple className="w-3.5 h-3.5" /> },
    { id: 'rights_safety', label: 'Rights & Safety', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'empowerment', label: 'Empowerment', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'rhythms', label: 'Rhythms', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onSelectTab('today')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <AuraLogo variant="horizontal" size="sm" theme="terracotta" />
          </div>

          {/* Desktop Navigation Links (Clean & balanced) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#2E2420] text-white shadow-2xs'
                      : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#F2DFD5] text-[#8E3B22]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Discreet Safe Mode Button */}
            <button
              onClick={onToggleDiscreetMode}
              title="Discreet Safe Mode (ESC)"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#FAF3EE] hover:bg-[#F5E6DC] text-[#8E3B22] border border-[#ECD9CC] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Discreet</span>
            </button>

            {/* User Account / Sign In Pill */}
            <div className="relative" ref={menuRef}>
              {currentUser && !currentUser.isGuest ? (
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF5EF] border border-[#E2D8CD] transition-all cursor-pointer shadow-2xs"
                >
                  <div
                    className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: currentUser.avatarColor || '#8E3B22' }}
                  >
                    {currentUser.name[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#2B231F] hidden sm:inline max-w-[75px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#8A7D73]" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-xl bg-[#8E3B22] text-white hover:bg-[#772F1B] transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E8DFC9] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#F2ECE4]">
                    <p className="text-xs font-bold text-[#2B231F] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#7A6F66] truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuth('profile');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#54463E] hover:bg-[#FAF5EF] hover:text-[#2B231F] flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#8E3B22]" />
                    <span>Cycle Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#54463E] hover:bg-[#FAF5EF] hover:text-[#2B231F] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#8E3B22]" />
                    <span>Recalibrate Baseline</span>
                  </button>

                  <div className="my-1 border-t border-[#F2ECE4]" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#54463E] hover:bg-[#FAF5EF] hover:text-[#2B231F] flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8E3B22]" />
                    <span>Switch / Register New</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-[#8E3B22] hover:bg-[#FDF1EE] flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-[#54463E] hover:bg-[#F2ECE5] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#EAE3D9] space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#2E2420] text-white shadow-2xs'
                      : 'text-[#63574E] hover:bg-[#F2ECE5] hover:text-[#2E2420]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#F2DFD5] text-[#8E3B22]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

