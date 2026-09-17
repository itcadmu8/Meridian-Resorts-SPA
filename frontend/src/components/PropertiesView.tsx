/**
 * @file PropertiesView.tsx
 * @description React component for PropertiesView.
 */
import React from 'react';
import { PropertyCoverData } from '../types';
import { Building2, MapPin, User, Users, Utensils } from 'lucide-react';

interface PropertiesViewProps {
  properties: PropertyCoverData[];
  onSelectProperty: (property: PropertyCoverData) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5">
          <span>Portfolio Directory</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Resorts &amp; Estates</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E8F2F0] rounded-[10px] text-[#176B63]">
            <Building2 className="w-6 h-6 text-[#176B63]" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
              Meridian Properties Directory
            </h3>
            <p className="text-xs sm:text-sm text-[#647572]">
              Global luxury retreats, destination dining venues, and operational profiles.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProperty(p)}
            className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#176B63] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-[#F1F5F3] font-mono text-[11px] font-bold text-[#10201E] border border-[#D8E3E1]">
                {p.code}
              </span>
              <span className="text-xs font-semibold text-[#176B63] bg-[#E8F2F0] px-2 py-0.5 rounded">
                {p.occupancyPercent}% Occupancy
              </span>
            </div>

            <h4 className="text-base font-bold text-[#10201E] group-hover:text-[#176B63] transition-colors">
              {p.name}
            </h4>
            <p className="text-xs text-[#647572] flex items-center gap-1 mt-1 mb-4">
              <MapPin className="w-3.5 h-3.5 text-[#176B63]" />
              {p.location}
            </p>

            <div className="border-t border-[#E3E8E5] pt-3 space-y-2 text-xs text-[#647572]">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> General Manager:
                </span>
                <span className="font-medium text-[#10201E]">{p.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" /> Dining Capacity:
                </span>
                <span className="font-semibold text-[#10201E]">{p.capacity} covers</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Today's Covers:
                </span>
                <span className="font-bold text-[#176B63]">{p.covers}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E3E8E5]">
              <span className="text-[11px] font-medium text-[#647572] block mb-1">
                Signature Outlets:
              </span>
              <div className="flex flex-wrap gap-1">
                {p.signatureVenues.map((v, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#FAFBF9] text-[#10201E] border border-[#D8E3E1] px-1.5 py-0.5 rounded"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
