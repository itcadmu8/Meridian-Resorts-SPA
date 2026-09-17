/**
 * @file Header.tsx
 * @description React component for Header.
 */
import React, { useState, useRef, useEffect } from 'react';
import { RESORT_HERO_IMAGE } from '../data/resortData';
import { Calendar, ChevronDown, Menu, User, ShieldCheck, Clock, Bell } from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      data-purpose="dashboard-header"
      className="relative overflow-hidden bg-[#12221F] border-b border-[#D8E3E1] px-6 sm:px-8 py-6 flex items-center justify-between shrink-0 min-h-[135px] select-none"
    >
      {/* Panoramic Resort Photograph with High Visibility */}
      <img
        src={RESORT_HERO_IMAGE}
        alt="Meridian Resort"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[center_65%] pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Elegant subtle dark teal translucent gradient overlay (75-85% photo visibility) */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(14, 38, 35, 0.72) 0%, rgba(14, 38, 35, 0.5) 45%, rgba(14, 38, 35, 0.25) 100%)',
          zIndex: 2,
        }}
      />

      {/* Left Title Content */}
      <div className="relative flex items-center gap-3" style={{ zIndex: 10 }}>
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-md bg-black/30 text-white border border-white/20 hover:bg-black/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-white font-semibold text-xl sm:text-2xl tracking-tight leading-tight">
            Good Morning, Operations Team
          </h2>
          <p className="text-[#E8F2F0] text-xs sm:text-sm mt-1 font-normal">
            Here's what's happening across our resorts today.
          </p>
        </div>
      </div>

      {/* Right Action Controls: Lightweight translucent glass-like pills */}
      <div className="relative flex items-center gap-3" style={{ zIndex: 10 }}>
        {/* Date Display */}
        <div
          id="date-pill"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs font-medium border border-white/20 backdrop-blur-sm shadow-sm select-none"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <Calendar className="w-3.5 h-3.5 text-white/90" />
          <span>Tue, Sep 9, 2026</span>
        </div>

        {/* Manager User Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="user-profile-menu-button"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all text-white shadow-sm text-left focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div className="px-1.5 py-0.5 rounded bg-emerald-400 text-[#12221F] font-bold text-[11px] leading-none shrink-0 shadow-sm">
              OM
            </div>
            <span className="text-xs font-medium text-white hidden md:inline">
              Operations Manager
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/80 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* User Profile Dropdown Menu */}
          {dropdownOpen && (
            <div
              id="user-dropdown-menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#D8E3E1] py-2 z-50 text-xs text-[#10201E] animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3.5 py-2.5 border-b border-[#E3E8E5]">
                <div className="font-semibold text-sm text-[#10201E]">Alex Rivera</div>
                <div className="text-[#647572] text-[11px]">Global Resort Operations Lead</div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated • Central Command</span>
                </div>
              </div>

              <div className="py-1 px-1.5">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#647572]">
                  Active Shift
                </div>
                <div className="grid grid-cols-3 gap-1 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setCurrentShift('morning')}
                    className={`py-1 rounded text-center text-[11px] font-medium transition-colors cursor-pointer ${
                      currentShift === 'morning'
                        ? 'bg-[#176B63] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentShift('afternoon')}
                    className={`py-1 rounded text-center text-[11px] font-medium transition-colors cursor-pointer ${
                      currentShift === 'afternoon'
                        ? 'bg-[#176B63] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Afternoon
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentShift('evening')}
                    className={`py-1 rounded text-center text-[11px] font-medium transition-colors cursor-pointer ${
                      currentShift === 'evening'
                        ? 'bg-[#176B63] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Evening
                  </button>
                </div>
              </div>

              <div className="border-t border-[#E3E8E5] pt-1 mt-1">
                <div className="flex items-center gap-2 px-3 py-2 text-[#647572]">
                  <Clock className="w-3.5 h-3.5 text-[#176B63]" />
                  <span>Shift Time: 06:00 - 15:00 UTC</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-[#647572]">
                  <Bell className="w-3.5 h-3.5 text-[#176B63]" />
                  <span>Alerts: Real-time broadcast ON</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
