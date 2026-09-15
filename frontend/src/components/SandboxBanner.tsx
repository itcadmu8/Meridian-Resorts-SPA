import React from 'react';
import { ViewState } from '../types';
import { RotateCcw, Sparkles } from 'lucide-react';

interface SandboxBannerProps {
  currentViewState: ViewState;
  onViewStateChange: (state: ViewState) => void;
  onSimulateDinnerRush: () => void;
  onResetData: () => void;
}

export const SandboxBanner: React.FC<SandboxBannerProps> = ({
  currentViewState,
  onViewStateChange,
  onSimulateDinnerRush,
  onResetData,
}) => {
  return (
    <aside
      id="sandbox-banner"
      className="text-white/70 text-xs px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-50 select-none shadow-sm"
      style={{
        background: 'rgb(16, 76, 80)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-semibold text-white tracking-wider uppercase text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SANDBOX VIEWPORT
        </span>
        <span className="text-white/40 hidden sm:inline">|</span>
        <span className="text-white/85 text-xs">Toggle operational response view:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* State Switcher Pills */}
        <div
          id="stateControls"
          className="flex items-center gap-1 bg-[#1C2624] p-1 rounded-lg border border-white/10"
        >
          <button
            id="state-btn-normal"
            type="button"
            onClick={() => onViewStateChange('normal')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all focus:outline-none cursor-pointer ${
              currentViewState === 'normal'
                ? 'bg-[#176B63] text-white shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Normal / Live
          </button>
          <button
            id="state-btn-loading"
            type="button"
            onClick={() => onViewStateChange('loading')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all focus:outline-none cursor-pointer ${
              currentViewState === 'loading'
                ? 'bg-[#176B63] text-white shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Loading Skeleton
          </button>
          <button
            id="state-btn-error"
            type="button"
            onClick={() => onViewStateChange('error')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all focus:outline-none cursor-pointer ${
              currentViewState === 'error'
                ? 'bg-[#176B63] text-white shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Error State
          </button>
          <button
            id="state-btn-empty"
            type="button"
            onClick={() => onViewStateChange('empty')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all focus:outline-none cursor-pointer ${
              currentViewState === 'empty'
                ? 'bg-[#176B63] text-white shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Empty State
          </button>
        </div>

        {/* Live Simulation Controls */}
        <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-white/20">
          <button
            id="btn-dinner-rush"
            type="button"
            onClick={onSimulateDinnerRush}
            title="Simulate dinner seating surge across resorts"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-400/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>Dinner Surge</span>
          </button>
          <button
            id="btn-reset-data"
            type="button"
            onClick={onResetData}
            title="Reset to original numbers"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-white/10 hover:bg-white/20 text-white/80 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-white/70" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
