import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import resortHeaderImage from '../assets/resort-header.jpg.png';

interface HeroBannerProps {
  currentDate?: string;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onPreviousDate?: () => void;
  onToday?: () => void;
  onNextDate?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  currentDate = 'Tue, Sep 9, 2026',
  selectedDate = '',
  onDateChange,
  onPreviousDate,
  onToday,
  onNextDate
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <div 
      id="operations-hero-banner"
      className="relative rounded-2xl overflow-hidden shadow-sm mb-6 min-h-[140px] flex items-center"
    >
      {/* Background Image with Dark Vignette/Overlay */}
      <img
        src={resortHeaderImage}
        alt="Meridian Luxury Resort Overview"
        className="absolute inset-0 w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
      />
      
      {/* Gradient Overlays for optimal text contrast matching the screenshot */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/40" />

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
              className="flex items-center space-x-2 bg-slate-900/65 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-lg text-white text-xs font-medium shadow-xs hover:bg-slate-900/85 transition-colors"
            >
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span>{currentDate}</span>
            </button>
            {datePickerOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl">
                <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Select arrival date
                  <input
                    autoFocus
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      onDateChange?.(event.target.value);
                      setDatePickerOpen(false);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal"
                  />
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button type="button" onClick={onPreviousDate} className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold hover:bg-slate-50">Previous</button>
                  <button type="button" onClick={onToday} className="rounded-lg bg-teal-700 px-2 py-2 text-xs font-semibold text-white hover:bg-teal-800">Today</button>
                  <button type="button" onClick={onNextDate} className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold hover:bg-slate-50">Next</button>
                </div>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
