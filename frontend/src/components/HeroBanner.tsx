import React, { useState } from 'react';
import { Calendar, LogOut } from 'lucide-react';
import resortHeaderImage from '../assets/resort-header.jpg.png';

interface HeroBannerProps {
  currentDate?: string;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onPreviousDate?: () => void;
  onToday?: () => void;
  onNextDate?: () => void;
  onSignOut?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  currentDate = 'Tue, Sep 9, 2026',
  selectedDate = '',
  onDateChange,
  onPreviousDate,
  onToday,
  onNextDate,
  onSignOut
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  return (
    <div 
      id="operations-hero-banner"
      className="relative z-20 rounded-2xl shadow-sm mb-6 min-h-[140px] flex items-center"
    >
      {/* Background Image Container with Overflow Hidden for rounded corners */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* Background Image with Dark Vignette/Overlay */}
        <img
          src={resortHeaderImage}
          alt="Meridian Luxury Resort Overview"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        
        {/* Gradient Overlays for optimal text contrast matching the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/40" />
      </div>

      {/* Banner Content Container */}
      <div className="relative z-10 w-full px-6 py-6 sm:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
            Good Morning, Operations Team
          </h1>
          <p className="text-slate-200 text-sm mt-1 font-normal">
            Here's what's happening across our resorts today.
          </p>
        </div>

        {/* Action / Profile Pills */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Date Chip */}
          <div className="relative">
            <button
              type="button"
              aria-label="Select arrival date"
              aria-expanded={datePickerOpen}
              onClick={() => setDatePickerOpen((open) => !open)}
              className="flex items-center space-x-2 bg-slate-900/65 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-lg text-white text-xs font-medium shadow-xs hover:bg-slate-900/85 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-300" />
              <span>{currentDate}</span>
            </button>
            {datePickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDatePickerOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Select arrival date
                    </span>
                    <button
                      type="button"
                      onClick={() => setDatePickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors text-xs font-bold cursor-pointer"
                      aria-label="Close date picker"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) => {
                      if (event.target.value) {
                        onDateChange?.(event.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
                  />
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviousDate?.()}
                      className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => onToday?.()}
                      className="rounded-lg bg-teal-700 px-2 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => onNextDate?.()}
                      className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(false)}
                    className="mt-3 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile Chip */}
          <div
            id="user-profile-chip"
            className="flex items-center space-x-2.5 bg-slate-900/65 backdrop-blur-md border border-white/15 pl-1.5 pr-2.5 py-1.5 rounded-lg text-white text-xs font-medium shadow-xs"
          >
            <div className="w-6 h-6 rounded bg-[#0f766e] text-white flex items-center justify-center font-bold text-[10px] tracking-tight">
              OM
            </div>
            <span className="font-semibold text-slate-100">Operations Manager</span>
            <button
              type="button"
              onClick={() => setSignOutConfirmOpen(true)}
              aria-label="Sign out"
              title="Sign out"
              className="ml-1 rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      {signOutConfirmOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="sign-out-title">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl">
            <h2 id="sign-out-title" className="text-lg font-semibold">Sign out of operations?</h2>
            <p className="mt-2 text-sm text-slate-500">You will be returned to the public Meridian guest page.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSignOutConfirmOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignOutConfirmOpen(false);
                  onSignOut?.();
                }}
                className="rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d6660]"
              >
                Confirm sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
