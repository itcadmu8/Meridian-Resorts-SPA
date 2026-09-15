import React, { useState, useMemo, useEffect } from 'react';
import { PropertyCoverData, ViewState, SortColumn, SortDirection } from '../types';
import {
  UtensilsCrossed,
  RotateCw,
  Search,
  ArrowUpDown,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface FbCoversViewProps {
  viewState: ViewState;
  onViewStateChange: (state: ViewState) => void;
  properties: PropertyCoverData[];
  onSelectProperty: (property: PropertyCoverData) => void;
}

interface TooltipData {
  x: number;
  y: number;
  title: string;
  covers: number;
  percentage: number;
}

export const FbCoversView: React.FC<FbCoversViewProps> = ({
  viewState,
  onViewStateChange,
  properties,
  onSelectProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState<SortColumn>('covers');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [lastUpdatedTime, setLastUpdatedTime] = useState('09:15 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Dynamic calculations based on current properties
  const totalCovers = useMemo(
    () => properties.reduce((acc, p) => acc + p.covers, 0),
    [properties]
  );
  const reportingCount = properties.length;
  const avgCovers = reportingCount > 0 ? Math.round(totalCovers / reportingCount) : 0;

  // The bar chart order in the reference screenshot: Beach, Lake, Mountain, City, Desert, Forest
  const barChartOrder = ['Beach', 'Lake', 'Mountain', 'City', 'Desert', 'Forest'];
  const barChartProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      const idxA = barChartOrder.indexOf(a.shortName);
      const idxB = barChartOrder.indexOf(b.shortName);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [properties]);

  // Donut slices order in reference screenshot:
  // Beach (85, 20%), Desert (76, 18%), Lake (72, 17%), Forest (65, 15%), Mountain (64, 15%), City (58, 14%)
  const donutProperties = useMemo(() => {
    return [...properties].sort((a, b) => b.covers - a.covers);
  }, [properties]);

  // Sorted and filtered table list
  const filteredProperties = useMemo(() => {
    return properties
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let compare = 0;
        if (sortCol === 'name') {
          compare = a.name.localeCompare(b.name);
        } else if (sortCol === 'covers') {
          compare = a.covers - b.covers;
        } else if (sortCol === 'percentage') {
          compare = a.percentage - b.percentage;
        } else if (sortCol === 'target') {
          compare = a.target - b.target;
        } else if (sortCol === 'variance') {
          compare = a.variance - b.variance;
        }
        return sortDir === 'asc' ? compare : -compare;
      });
  }, [properties, searchQuery, sortCol, sortDir]);

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setLastUpdatedTime(`${formattedHours}:${mins} ${ampm}`);
    }, 700);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      onViewStateChange('normal');
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setLastUpdatedTime(`${formattedHours}:${mins} ${ampm}`);
    }, 1200);
  };

  // Donut SVG arc calculations
  // Circle radius r=54, circumference = 2 * PI * 54 = 339.292
  const circumference = 2 * Math.PI * 54;
  let accumulatedOffset = 0;
  const donutSlices = donutProperties.map((prop, idx) => {
    const fraction = totalCovers > 0 ? prop.covers / totalCovers : 0;
    const strokeDash = fraction * circumference;
    const currentOffset = accumulatedOffset;
    accumulatedOffset += strokeDash;
    return {
      prop,
      index: idx,
      dashArray: `${strokeDash.toFixed(2)} ${circumference.toFixed(2)}`,
      dashOffset: -currentOffset,
      fraction,
    };
  });

  // Calculate center display text for donut
  const centerDisplay = useMemo(() => {
    if (hoveredSliceIndex !== null && donutProperties[hoveredSliceIndex]) {
      const p = donutProperties[hoveredSliceIndex];
      return {
        count: p.covers,
        label: p.shortName.toUpperCase(),
      };
    }
    return {
      count: totalCovers,
      label: 'COVERS',
    };
  }, [hoveredSliceIndex, donutProperties, totalCovers]);

  // If viewState is 'loading'
  if (viewState === 'loading') {
    return (
      <div id="viewLoading" className="space-y-6 animate-pulse select-none">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-[#E5E7EB]" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-[#E5E7EB] rounded" />
              <div className="w-72 h-4 bg-[#E5E7EB] rounded" />
            </div>
          </div>
          <div className="w-32 h-9 bg-[#E5E7EB] rounded-lg" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-32 flex flex-col justify-between">
            <div className="w-24 h-4 bg-[#E5E7EB] rounded" />
            <div className="w-16 h-8 bg-[#E5E7EB] rounded" />
            <div className="w-32 h-3 bg-[#E5E7EB] rounded" />
          </div>
          <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-32 flex flex-col justify-between">
            <div className="w-28 h-4 bg-[#E5E7EB] rounded" />
            <div className="w-12 h-8 bg-[#E5E7EB] rounded" />
            <div className="w-36 h-3 bg-[#E5E7EB] rounded" />
          </div>
          <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-32 flex flex-col justify-between">
            <div className="w-32 h-4 bg-[#E5E7EB] rounded" />
            <div className="w-12 h-8 bg-[#E5E7EB] rounded" />
            <div className="w-28 h-3 bg-[#E5E7EB] rounded" />
          </div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-80 flex flex-col justify-between">
            <div className="w-48 h-5 bg-[#E5E7EB] rounded" />
            <div className="flex items-end justify-between h-48 px-6">
              <div className="w-11 bg-[#E5E7EB] rounded-t h-40" />
              <div className="w-11 bg-[#E5E7EB] rounded-t h-32" />
              <div className="w-11 bg-[#E5E7EB] rounded-t h-28" />
              <div className="w-11 bg-[#E5E7EB] rounded-t h-24" />
              <div className="w-11 bg-[#E5E7EB] rounded-t h-36" />
              <div className="w-11 bg-[#E5E7EB] rounded-t h-30" />
            </div>
            <div className="w-full h-3 bg-[#E5E7EB] rounded" />
          </div>
          <div className="lg:col-span-5 bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-80 flex flex-col items-center justify-between">
            <div className="w-full flex justify-between">
              <div className="w-36 h-5 bg-[#E5E7EB] rounded" />
              <div className="w-16 h-5 bg-[#E5E7EB] rounded-full" />
            </div>
            <div className="w-36 h-36 rounded-full border-8 border-[#E5E7EB]" />
            <div className="w-full h-10 bg-[#E5E7EB] rounded" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 h-64 space-y-4">
          <div className="w-44 h-5 bg-[#E5E7EB] rounded" />
          <div className="w-full h-8 bg-[#E5E7EB] rounded" />
          <div className="w-full h-8 bg-[#E5E7EB] rounded" />
          <div className="w-full h-8 bg-[#E5E7EB] rounded" />
        </div>
      </div>
    );
  }

  // If viewState is 'error'
  if (viewState === 'error') {
    return (
      <div
        id="viewError"
        className="bg-white rounded-[10px] border border-[#D8E3E1] p-12 text-center shadow-[0_1px_3px_rgba(23,32,31,0.05)] select-none my-6"
      >
        <div className="w-14 h-14 rounded-full bg-red-50 text-[#C75450] flex items-center justify-center mx-auto mb-4 border border-[#C75450]/20">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#10201E] mb-1">
          Unable to load today's F&amp;B covers
        </h3>
        <p className="text-sm text-[#647572] max-w-md mx-auto mb-6">
          We couldn't retrieve today's dining records from the resort service. Please check
          your network connection or retry.
        </p>
        <button
          id="retryButton"
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 bg-[#176B63] hover:bg-[#125650] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#176B63]/30 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          <RotateCw
            className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
          />
          <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
        </button>
      </div>
    );
  }

  // If viewState is 'empty'
  if (viewState === 'empty' || properties.length === 0) {
    return (
      <div
        id="viewEmpty"
        className="bg-white rounded-[10px] border border-[#D8E3E1] p-12 text-center shadow-[0_1px_3px_rgba(23,32,31,0.05)] select-none my-6"
      >
        <div className="w-14 h-14 rounded-full bg-[#E8F2F0] text-[#176B63] flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#10201E] mb-1">
          No F&amp;B covers recorded for today
        </h3>
        <p className="text-sm text-[#647572] max-w-md mx-auto mb-6">
          No food &amp; beverage cover records are currently available across reporting properties
          for today.
        </p>
        <button
          id="btn-restore-empty"
          type="button"
          onClick={() => onViewStateChange('normal')}
          className="bg-[#176B63] hover:bg-[#125650] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#176B63]/30 cursor-pointer"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  // Normal / Live View
  return (
    <div id="viewNormal" className="space-y-6">
      {/* Section Header: Page Title & Actions with Breadcrumb */}
      <div>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5 select-none"
        >
          <span className="hover:text-[#176B63] cursor-pointer">Dashboard</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Today's F&amp;B Covers</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#E8F2F0] rounded-[10px] text-[#176B63] mt-0.5 shadow-xs">
              <UtensilsCrossed className="w-6 h-6 text-[#176B63]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
                Today's F&amp;B Covers
              </h3>
              <p className="text-xs sm:text-sm text-[#647572] mt-0.5">
                A consolidated view of today's food &amp; beverage covers across all properties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto select-none">
            <div className="text-xs text-[#647572] flex items-center gap-1.5">
              <span>
                Last updated:{' '}
                <span className="text-[#10201E] font-medium">{lastUpdatedTime}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#23866A] animate-pulse" />
            </div>

            <button
              id="refreshBtn"
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[10px] bg-[#176B63] hover:bg-[#125650] text-white transition-all shadow-[0_1px_3px_rgba(23,32,31,0.05)] focus:outline-none focus:ring-2 focus:ring-[#176B63]/30 cursor-pointer"
            >
              <RotateCw
                className={`w-3.5 h-3.5 transition-transform duration-700 ${
                  isRefreshing ? 'rotate-180 animate-spin' : ''
                }`}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1" data-purpose="kpi-cards">
        {/* Card 1: TOTAL F&B COVERS */}
        <div className="bg-[#FFFFFF] p-6 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#CBD5E1] transition-colors duration-150 flex flex-col justify-between select-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              TOTAL F&amp;B COVERS
            </span>
            <span className="text-[11px] font-semibold text-[#176B63] bg-[#E8F2F0] px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-[#10201E] tracking-tight tabular-nums">
              {totalCovers}
            </div>
            <p className="text-xs text-[#647572] mt-1">Across all 6 properties</p>
          </div>
        </div>

        {/* Card 2: PROPERTIES */}
        <div className="bg-[#FFFFFF] p-6 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#CBD5E1] transition-colors duration-150 flex flex-col justify-between select-none">
          <div>
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              PROPERTIES
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-[#10201E] tracking-tight tabular-nums">
              {reportingCount}
            </div>
            <p className="text-xs text-[#647572] mt-1">All resorts reporting</p>
          </div>
        </div>

        {/* Card 3: AVG. COVERS / PROPERTY */}
        <div className="bg-[#FFFFFF] p-6 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#CBD5E1] transition-colors duration-150 flex flex-col justify-between select-none">
          <div>
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              AVG. COVERS / PROPERTY
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-[#10201E] tracking-tight tabular-nums">
              {avgCovers}
            </div>
            <p className="text-xs text-[#647572] mt-1">Today's average</p>
          </div>
        </div>
      </div>

      {/* Charts Section (7 cols & 5 cols layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1" data-purpose="charts-row">
        {/* Left Panel: Property-wise F&B Covers Comparison Bar Chart */}
        <section className="lg:col-span-7 bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)] flex flex-col justify-between overflow-hidden">
          {/* Header & Legend */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D8E3E1]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-[#176B63] rounded-full" />
              <h4 className="text-sm font-semibold text-[#10201E]">
                Property-wise F&amp;B Covers Comparison
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#647572] select-none">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#176B63]" />
                Covers Today
              </span>
              <span className="text-[#D8E3E1]">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 border-b-2 border-dashed border-[#176B63]/60" />
                Target: 70 avg
              </span>
            </div>
          </div>

          {/* Bar Chart Canvas SVG & Grid */}
          <div className="relative pt-6 pb-2 pl-12 pr-6 flex items-stretch w-full overflow-hidden">
            <div className="w-6 shrink-0 flex items-center justify-center select-none -ml-8 mr-2">
              <span className="text-[10px] font-bold tracking-widest text-[#5C736F] uppercase -rotate-90 origin-center whitespace-nowrap">
                COVERS
              </span>
            </div>

            <div className="relative flex-1 flex flex-col min-w-0">
              <div className="relative h-56 min-w-0 w-full">
                {/* Horizontal Guide Lines & Y-Axis Numbers (Max 100) */}
                <div className="absolute inset-0 flex flex-col justify-between select-none pointer-events-none pb-0">
                  <div className="w-full border-b border-dashed border-[#E3E8E5] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5C736F] -translate-y-1/2">100</span>
                  </div>
                  <div className="w-full border-b border-dashed border-[#E3E8E5] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5C736F] -translate-y-1/2">80</span>
                  </div>
                  {/* Target 70 Indicator Line */}
                  <div className="w-full border-b border-dashed border-[#176B63]/60 relative flex items-center justify-between">
                    <span className="text-xs font-mono text-[#176B63] font-semibold -translate-y-1/2">
                      70
                    </span>
                  </div>
                  <div className="w-full border-b border-dashed border-[#E3E8E5] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5C736F] -translate-y-1/2">50</span>
                  </div>
                  <div className="w-full border-b border-dashed border-[#E3E8E5] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5C736F] -translate-y-1/2">25</span>
                  </div>
                  <div className="w-full border-b border-[#D8E3E1] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5C736F] -translate-y-1/2">0</span>
                  </div>
                </div>

                {/* Bars in specified reference order */}
                <div className="absolute inset-x-8 bottom-0 top-0 grid grid-cols-6 gap-3">
                  {barChartProperties.map((prop) => {
                    const heightPercent = Math.min(100, Math.max(5, (prop.covers / 100) * 100));
                    return (
                      <div
                        key={prop.id}
                        id={`bar-${prop.shortName.toLowerCase()}`}
                        onClick={() => onSelectProperty(prop)}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10,
                            title: prop.name,
                            covers: prop.covers,
                            percentage: prop.percentage,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className="flex flex-col items-center justify-end relative cursor-pointer h-full min-w-0 group"
                      >
                        <span className="text-[13px] font-semibold text-[#142623] mb-1.5 transition-transform group-hover:-translate-y-1 select-none">
                          {prop.covers}
                        </span>
                        <div
                          className="w-full max-w-[42px] bg-[#176B63] rounded-t group-hover:bg-[#125650] transition-all duration-300 shadow-2xs"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="grid grid-cols-6 gap-3 pt-2.5 px-8 select-none">
                {barChartProperties.map((prop) => (
                  <span
                    key={prop.id}
                    title={prop.name}
                    className="text-xs text-[#5C736F] font-medium text-center truncate px-0.5 cursor-pointer hover:text-[#176B63]"
                    onClick={() => onSelectProperty(prop)}
                  >
                    {prop.shortName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Share of Today's Covers Donut Chart */}
        <section className="lg:col-span-5 bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)] flex flex-col justify-between overflow-hidden">
          {/* Header with Total Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D8E3E1]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-[#176B63] rounded-full" />
              <h4 className="text-sm font-semibold text-[#10201E]">
                Share of Today's Covers
              </h4>
            </div>
            <span className="text-[11px] font-medium text-[#176B63] bg-[#E8F2F0] px-2 py-0.5 rounded select-none">
              {totalCovers} Total
            </span>
          </div>

          {/* Donut Visual with Centered Counter */}
          <div className="flex flex-col items-center justify-center gap-5 my-auto py-2 w-full">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="none"
                  stroke="#F4F6F5"
                  strokeWidth="18"
                />
                {/* Slices */}
                {donutSlices.map(({ prop, index, dashArray, dashOffset }) => {
                  const isHovered = hoveredSliceIndex === index;
                  const isAnyHovered = hoveredSliceIndex !== null;
                  return (
                    <circle
                      key={prop.id}
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke={prop.color}
                      strokeWidth={isHovered ? 24 : 18}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        opacity: isAnyHovered ? (isHovered ? 1 : 0.4) : 1,
                      }}
                      onMouseEnter={(e) => {
                        setHoveredSliceIndex(index);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                          title: prop.name,
                          covers: prop.covers,
                          percentage: prop.percentage,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredSliceIndex(null);
                        setTooltip(null);
                      }}
                      onClick={() => onSelectProperty(prop)}
                    />
                  );
                })}
              </svg>

              {/* Centered Dynamic Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <span className="text-2xl font-bold text-[#176B63] leading-none tracking-tight tabular-nums transition-all">
                  {centerDisplay.count}
                </span>
                <span className="text-[11px] font-medium text-[#647572] mt-0.5 tracking-wider uppercase transition-all">
                  {centerDisplay.label}
                </span>
              </div>
            </div>

            {/* 2-Column Legend matching direct sibling layout */}
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs select-none">
              {/* Col 1: Beach, Lake, Mountain */}
              <div className="space-y-1.5 min-w-0">
                {donutProperties
                  .filter((_, idx) => idx % 2 === 0)
                  .map((prop) => {
                    const originalIdx = donutProperties.findIndex((p) => p.id === prop.id);
                    const isHovered = hoveredSliceIndex === originalIdx;
                    return (
                      <div
                        key={prop.id}
                        onMouseEnter={() => setHoveredSliceIndex(originalIdx)}
                        onMouseLeave={() => setHoveredSliceIndex(null)}
                        onClick={() => onSelectProperty(prop)}
                        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors duration-150 ${
                          isHovered ? 'bg-[#E1F0F2]' : 'hover:bg-[#F1F5F3]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: prop.color }}
                          />
                          <span className="text-xs text-[#10201E] font-medium truncate">
                            {prop.shortName === 'Beach' ? 'Meridian Beach' : `Meridian ${prop.shortName}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="font-semibold text-xs text-[#10201E]">
                            {prop.covers}
                          </span>
                          <span className="text-[#647572] text-[11px]">
                            ({prop.percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Col 2: Desert, Forest, City */}
              <div className="space-y-1.5 min-w-0">
                {donutProperties
                  .filter((_, idx) => idx % 2 === 1)
                  .map((prop) => {
                    const originalIdx = donutProperties.findIndex((p) => p.id === prop.id);
                    const isHovered = hoveredSliceIndex === originalIdx;
                    return (
                      <div
                        key={prop.id}
                        onMouseEnter={() => setHoveredSliceIndex(originalIdx)}
                        onMouseLeave={() => setHoveredSliceIndex(null)}
                        onClick={() => onSelectProperty(prop)}
                        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors duration-150 ${
                          isHovered ? 'bg-[#E1F0F2]' : 'hover:bg-[#F1F5F3]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: prop.color }}
                          />
                          <span className="text-xs text-[#10201E] font-medium truncate">
                            {prop.shortName === 'Desert' ? 'Meridian Desert' : `Meridian ${prop.shortName}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="font-semibold text-xs text-[#10201E]">
                            {prop.covers}
                          </span>
                          <span className="text-[#647572] text-[11px]">
                            ({prop.percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Property Breakdown Table */}
      <section
        className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)]"
        data-purpose="breakdown-table"
      >
        <div className="border-b border-[#D8E3E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 -mx-6 -mt-6 mb-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-[#176B63] rounded-full" />
            <h4 className="text-sm font-semibold text-[#10201E]">Property Breakdown</h4>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#647572]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              id="tableSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-8 pr-3 py-1.5 text-xs text-[#10201E] bg-[#F8FAFA] border border-[#D8E3E1] focus:bg-white rounded-lg focus:outline-none focus:border-[#176B63] focus:ring-1 focus:ring-[#176B63]/30 transition-colors placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-left text-xs" id="coversTable">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#647572] font-medium border-b border-[#D8E3E1] uppercase tracking-wider text-[11px] select-none">
                <th scope="col" className="py-3 px-6">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 select-none hover:text-[#10201E] focus:outline-none transition-colors cursor-pointer"
                  >
                    PROPERTY
                    <ArrowUpDown className="w-3 h-3 text-[#647572]" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-6">
                  <button
                    type="button"
                    onClick={() => handleSort('covers')}
                    className="inline-flex items-center gap-1 select-none hover:text-[#10201E] focus:outline-none transition-colors cursor-pointer"
                  >
                    TODAY'S COVERS
                    <ArrowUpDown className="w-3 h-3 text-[#647572]" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-6">
                  <button
                    type="button"
                    onClick={() => handleSort('percentage')}
                    className="inline-flex items-center gap-1 select-none hover:text-[#10201E] focus:outline-none transition-colors cursor-pointer"
                  >
                    % OF TOTAL
                    <ArrowUpDown className="w-3 h-3 text-[#647572]" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-6">
                  <button
                    type="button"
                    onClick={() => handleSort('target')}
                    className="inline-flex items-center gap-1 select-none hover:text-[#10201E] focus:outline-none transition-colors cursor-pointer"
                  >
                    TARGET (AVG)
                    <ArrowUpDown className="w-3 h-3 text-[#647572]" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-6">
                  <button
                    type="button"
                    onClick={() => handleSort('variance')}
                    className="inline-flex items-center gap-1 select-none hover:text-[#10201E] focus:outline-none transition-colors cursor-pointer"
                  >
                    VARIANCE
                    <ArrowUpDown className="w-3 h-3 text-[#647572]" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D8E3E1] text-[#10201E] bg-white" id="coversTableBody">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => {
                  const isPositive = prop.variance >= 0;
                  return (
                    <tr
                      key={prop.id}
                      onClick={() => onSelectProperty(prop)}
                      className="group hover:bg-[#F1F5F3] transition-colors cursor-pointer"
                      title="Click to view detailed resort dining breakdown"
                    >
                      <td className="py-3.5 px-6 flex items-center gap-2.5 font-medium text-[#10201E]">
                        <span className="bg-[#F1F5F3] text-[#647572] border border-[#D8E3E1] text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                          {prop.code}
                        </span>
                        <span className="text-[#10201E] group-hover:text-[#176B63] transition-colors">
                          {prop.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-[#10201E] tabular-nums">
                        {prop.covers}
                      </td>
                      <td className="py-3.5 px-6 text-[#647572]">{prop.percentage}%</td>
                      <td className="py-3.5 px-6 text-[#647572] tabular-nums">{prop.target}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isPositive
                              ? 'bg-[#E8F2F0] text-[#176B63]'
                              : 'bg-[#FDF6E2] text-[#B38012]'
                          }`}
                        >
                          {isPositive ? `+${prop.variance}` : prop.variance}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-[#647572] text-xs">
                    No matching properties found for "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot className="bg-[#FAFBF9] border-t border-[#D8E3E1] text-[#10201E] select-none">
              <tr>
                <td className="py-3.5 px-6 text-xs font-semibold">
                  Total{' '}
                  <span className="text-[#647572] font-normal text-[11px] ml-1">
                    ({reportingCount} Properties Reporting)
                  </span>
                </td>
                <td className="py-3.5 px-6 text-xs font-semibold text-[#10201E] tabular-nums">
                  {totalCovers}
                </td>
                <td className="py-3.5 px-6 text-xs font-medium text-[#647572]">100%</td>
                <td className="py-3.5 px-6 text-xs font-medium text-[#647572] tabular-nums">
                  {avgCovers}
                </td>
                <td className="py-3.5 px-6 text-xs font-semibold text-[#176B63]">
                  +12% vs yesterday
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-[#121918] text-white text-xs py-1.5 px-3 rounded shadow-lg transition-opacity duration-150"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className="text-neutral-300">{tooltip.title}</span> •{' '}
          <strong className="text-white">{tooltip.covers} covers</strong> ({tooltip.percentage}%)
        </div>
      )}
    </div>
  );
};
