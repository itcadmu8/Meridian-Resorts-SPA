import React from 'react';
import { RefreshCw, Luggage } from 'lucide-react';

interface KpiStatsProps {
  totalArrivals: number;
  propertiesReporting: number;
  avgArrivals: number;
  lastUpdated: string;
  isRefreshing?: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const SectionHeader: React.FC<{
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}> = ({ lastUpdated, isRefreshing, onRefresh }) => {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="text-xs font-medium text-slate-500 mb-2.5 flex items-center space-x-1.5">
        <span className="hover:text-slate-800 cursor-pointer">Dashboard</span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Today&apos;s Arrivals</span>
      </div>

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#0f766e] shrink-0 mt-0.5 shadow-xs">
            <Luggage className="w-5 h-5 text-[#0f766e]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Today&apos;s Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              A consolidated view of today&apos;s guest arrivals across all properties.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <span>Last updated:</span>
            <span className="font-semibold text-slate-700">{lastUpdated}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5 animate-pulse"></span>
          </div>

          <button
            id="refresh-arrivals-button"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const KpiStats: React.FC<KpiStatsProps> = ({
  totalArrivals,
  propertiesReporting,
  avgArrivals,
  isLoading = false,
  isEmpty = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="h-3 w-28 bg-slate-200 rounded"></div>
              {idx === 1 && <div className="h-4 w-10 bg-slate-200 rounded-full"></div>}
            </div>
            <div className="h-9 w-16 bg-slate-200 rounded mb-3"></div>
            <div className="h-3 w-36 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const displayTotal = isEmpty ? 0 : totalArrivals;
  const displayProperties = isEmpty ? 0 : propertiesReporting;
  const displayAvg = isEmpty ? 0 : avgArrivals;

  return (
    <div id="kpi-stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Arrivals Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            TOTAL ARRIVALS
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            +8%
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
          {displayTotal}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Across all {displayProperties} properties
        </div>
      </div>

      {/* Properties Reporting Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            PROPERTIES REPORTING
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
          {displayProperties}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          All resorts reporting
        </div>
      </div>

      {/* Avg Arrivals / Property Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            AVG. ARRIVALS / PROPERTY
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
          {displayAvg}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Today&apos;s average
        </div>
      </div>
    </div>
  );
};
