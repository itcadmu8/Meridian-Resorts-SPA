/**
 * @file StateViews.tsx
 * @description React component for StateViews.
 */
import React from 'react';
import { AlertTriangle, RotateCcw, Search, Database } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
}

export const OperationalErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="bg-white rounded-2xl border border-red-200 p-8 my-6 text-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        PMS Feed Connection Interrupted
      </h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
        Unable to retrieve real-time guest arrivals from the central PMS gateway (Error: 503 Service Unavailable). The failover cache was last synced 18 minutes ago.
      </p>

      <div className="flex items-center justify-center space-x-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center space-x-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Load Local Snapshot</span>
        </button>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  onReset: () => void;
}

export const OperationalEmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 my-6 text-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <Search className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        No Scheduled Arrivals
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
        There are currently zero guest arrivals matching this filter or scheduled for this date.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center space-x-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
      >
        <span>Reset Filter &amp; View All Arrivals</span>
      </button>
    </div>
  );
};
