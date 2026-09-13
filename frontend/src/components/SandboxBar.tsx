import React from 'react';
import { ViewMode } from '../types';

interface SandboxBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const SandboxBar: React.FC<SandboxBarProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div id="sandbox-viewport-bar" className="w-full bg-[#022c26] text-emerald-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-teal-900/60 z-30 select-none shadow-sm">
      <div className="flex items-center space-x-2 py-0.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold tracking-wider text-white uppercase text-[11px]">
          SANDBOX VIEWPORT
        </span>
        <span className="text-teal-400/80 font-normal">|</span>
        <span className="text-emerald-200/90 text-[11px]">
          Toggle operational response view:
        </span>
      </div>

      <div className="flex items-center space-x-1.5 py-0.5">
        <button
          id="view-mode-live"
          type="button"
          onClick={() => onViewModeChange('live')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'live'
              ? 'bg-[#0f766e] text-white shadow-inner ring-1 ring-teal-400/50'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/50'
          }`}
        >
          Normal / Live
        </button>

        <button
          id="view-mode-skeleton"
          type="button"
          onClick={() => onViewModeChange('skeleton')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'skeleton'
              ? 'bg-[#0f766e] text-white shadow-inner ring-1 ring-teal-400/50'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/50'
          }`}
        >
          Loading Skeleton
        </button>

        <button
          id="view-mode-error"
          type="button"
          onClick={() => onViewModeChange('error')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'error'
              ? 'bg-[#0f766e] text-white shadow-inner ring-1 ring-teal-400/50'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/50'
          }`}
        >
          Error State
        </button>

        <button
          id="view-mode-empty"
          type="button"
          onClick={() => onViewModeChange('empty')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'empty'
              ? 'bg-[#0f766e] text-white shadow-inner ring-1 ring-teal-400/50'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/50'
          }`}
        >
          Empty State
        </button>
      </div>
    </div>
  );
};
