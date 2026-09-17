import React from 'react';
import { PropertyCoverData } from '../types';
import {
  TrendingUp,
  Users,
  BedDouble,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface DashboardOverviewProps {
  properties: PropertyCoverData[];
  summary?: {
    total_properties?: number;
    total_arrivals?: number;
    portfolio_occupancy?: number;
    total_spa_bookings?: number;
    total_fb_covers?: number;
  };
  onNavigateToFb: () => void;
  onSelectProperty: (property: PropertyCoverData) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  properties,
  summary,
  onNavigateToFb,
  onSelectProperty,
}) => {
  const totalCovers = summary?.total_fb_covers ?? properties.reduce((acc, p) => acc + (p.covers || 0), 0);
  const totalArrivals = summary?.total_arrivals ?? properties.reduce((acc, p) => acc + ((p as any).arrivals_count || 0), 0);
  const totalSpa = summary?.total_spa_bookings ?? properties.reduce((acc, p) => acc + ((p as any).spa_bookings_count || 0), 0);
  const portfolioOcc = summary?.portfolio_occupancy ?? Math.round(properties.reduce((acc, p) => acc + (p.occupancyPercent || 0), 0) / (properties.length || 1));

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div>
        <nav className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5">
          <span>Command Center</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Resort Portfolio Overview</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
              Operational Performance
            </h3>
            <p className="text-xs sm:text-sm text-[#647572] mt-0.5">
              Live consolidated telemetry across 6 premier global properties.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              All 6 PMS Integrations Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              PORTFOLIO OCCUPANCY
            </span>
            <BedDouble className="w-4 h-4 text-[#176B63]" />
          </div>
          <div className="text-3xl font-semibold text-[#10201E] mt-2">{portfolioOcc}%</div>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% vs target
          </p>
        </div>

        <div
          onClick={onNavigateToFb}
          className="bg-white p-5 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#176B63] cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              TODAY'S F&amp;B COVERS
            </span>
            <UtensilsCrossed className="w-4 h-4 text-[#176B63] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-semibold text-[#10201E] mt-2">{totalCovers}</div>
          <p className="text-xs text-[#176B63] font-medium mt-1 flex items-center gap-1">
            View Live Covers Dashboard <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              ARRIVALS SCHEDULED
            </span>
            <Users className="w-4 h-4 text-[#176B63]" />
          </div>
          <div className="text-3xl font-semibold text-[#10201E] mt-2">{totalArrivals}</div>
          <p className="text-xs text-[#647572] mt-1">Confirmed guest arrivals today</p>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#D8E3E1] shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wider text-[#647572] uppercase">
              SPA APPOINTMENTS
            </span>
            <Sparkles className="w-4 h-4 text-[#176B63]" />
          </div>
          <div className="text-3xl font-semibold text-[#10201E] mt-2">{totalSpa}</div>
          <p className="text-xs text-[#647572] mt-1">Scheduled sessions today</p>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#D8E3E1] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-[#176B63] rounded-full" />
            <h4 className="text-sm font-semibold text-[#10201E]">Property Operations Snapshot</h4>
          </div>
          <span className="text-xs text-[#647572]">Click a property to inspect shift details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="p-4 rounded-lg border border-[#D8E3E1] bg-[#FAFBF9] hover:bg-white hover:border-[#176B63] transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-[#D8E3E1] text-[#10201E]">
                    {prop.code}
                  </span>
                  <span className="font-semibold text-xs text-[#10201E] group-hover:text-[#176B63] transition-colors">
                    {prop.name}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#176B63] bg-[#E8F2F0] px-2 py-0.5 rounded">
                  {prop.covers} covers
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#647572] mt-3">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-[#10201E] font-medium">{prop.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy:</span>
                  <span className="text-[#10201E] font-medium">{prop.occupancyPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>General Manager:</span>
                  <span className="text-[#10201E] font-medium">{prop.manager}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E3E8E5] flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dining Open
                </span>
                <span className="text-[#176B63] font-medium group-hover:underline flex items-center gap-1">
                  Full Breakdown <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
