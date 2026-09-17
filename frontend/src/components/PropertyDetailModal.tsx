/**
 * @file PropertyDetailModal.tsx
 * @description React component for PropertyDetailModal.
 */
import React from 'react';
import { PropertyCoverData } from '../types';
import { X, MapPin, User, Users, Utensils, Award } from 'lucide-react';

interface PropertyDetailModalProps {
  property: PropertyCoverData | null;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div
      id="property-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-[#D8E3E1] max-w-lg w-full overflow-hidden text-xs text-[#10201E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#102624] text-white p-5 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-white/10 text-emerald-300 font-mono text-xs font-bold border border-white/20">
              {property.code}
            </span>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">{property.name}</h3>
              <p className="text-emerald-200/80 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {property.location}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F6F8F7] rounded-lg border border-[#D8E3E1]">
              <span className="text-[10px] text-[#647572] font-semibold uppercase tracking-wider block">
                Today's Covers
              </span>
              <span className="text-xl font-bold text-[#10201E] mt-0.5 block">
                {property.covers}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  property.variance >= 0 ? 'text-[#176B63]' : 'text-[#B38012]'
                }`}
              >
                {property.variance >= 0 ? `+${property.variance}` : property.variance} vs target
              </span>
            </div>

            <div className="p-3 bg-[#F6F8F7] rounded-lg border border-[#D8E3E1]">
              <span className="text-[10px] text-[#647572] font-semibold uppercase tracking-wider block">
                Resort Occupancy
              </span>
              <span className="text-xl font-bold text-[#10201E] mt-0.5 block">
                {property.occupancyPercent}%
              </span>
              <span className="text-[10px] text-[#647572]">High season peak</span>
            </div>

            <div className="p-3 bg-[#F6F8F7] rounded-lg border border-[#D8E3E1]">
              <span className="text-[10px] text-[#647572] font-semibold uppercase tracking-wider block">
                F&amp;B Capacity
              </span>
              <span className="text-xl font-bold text-[#10201E] mt-0.5 block">
                {property.capacity} seats
              </span>
              <span className="text-[10px] text-[#647572]">Across all outlets</span>
            </div>
          </div>

          {/* Meal Period Breakdown */}
          <div className="border border-[#D8E3E1] rounded-lg p-3.5 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#10201E] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#176B63]" />
                Covers by Service Period
              </span>
              <span className="text-[11px] text-[#647572]">
                Total: {property.covers} seated
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-[#647572] mb-0.5">
                  <span>Breakfast Service (07:00 - 11:00)</span>
                  <span className="font-semibold text-[#10201E]">
                    {property.breakdown.breakfast} covers
                  </span>
                </div>
                <div className="w-full bg-[#E3E8E5] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#176B63] h-full rounded-full transition-all"
                    style={{
                      width: `${(property.breakdown.breakfast / property.covers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#647572] mb-0.5">
                  <span>Lunch &amp; Terrace (12:00 - 15:30)</span>
                  <span className="font-semibold text-[#10201E]">
                    {property.breakdown.lunch} covers
                  </span>
                </div>
                <div className="w-full bg-[#E3E8E5] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3FB8B0] h-full rounded-full transition-all"
                    style={{
                      width: `${(property.breakdown.lunch / property.covers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#647572] mb-0.5">
                  <span>Dinner &amp; Sunset Seating (18:00 - 22:30)</span>
                  <span className="font-semibold text-[#10201E]">
                    {property.breakdown.dinner} covers
                  </span>
                </div>
                <div className="w-full bg-[#E3E8E5] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5AC3BC] h-full rounded-full transition-all"
                    style={{
                      width: `${(property.breakdown.dinner / property.covers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#647572] mb-0.5">
                  <span>In-Suite / Cabana Service</span>
                  <span className="font-semibold text-[#10201E]">
                    {property.breakdown.roomService} covers
                  </span>
                </div>
                <div className="w-full bg-[#E3E8E5] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#84D5D0] h-full rounded-full transition-all"
                    style={{
                      width: `${(property.breakdown.roomService / property.covers) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Signature Venues */}
          <div>
            <span className="text-[11px] font-semibold text-[#10201E] block mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#176B63]" />
              Active Dining Venues
            </span>
            <div className="flex flex-wrap gap-1.5">
              {property.signatureVenues.map((venue, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-[#E8F2F0] text-[#176B63] font-medium text-[11px] border border-[#176B63]/15"
                >
                  {venue}
                </span>
              ))}
            </div>
          </div>

          {/* General Manager Info */}
          <div className="flex items-center justify-between pt-2 border-t border-[#D8E3E1] text-[#647572]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#176B63]" />
              General Manager: <strong className="text-[#10201E] font-medium">{property.manager}</strong>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Users className="w-3 h-3 text-[#176B63]" />
              Staff On Duty: 38
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAFBF9] px-5 py-3 border-t border-[#D8E3E1] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#176B63] hover:bg-[#125650] text-white rounded-md font-medium text-xs shadow-sm transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
