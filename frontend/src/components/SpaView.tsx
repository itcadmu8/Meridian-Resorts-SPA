import React from 'react';
import { Sparkles, Clock, Heart, Award } from 'lucide-react';

export const SpaView: React.FC = () => {
  const spaRituals = [
    {
      id: 'spa-1',
      title: 'Mediterranean Marine Collagen Glow',
      resort: 'Meridian Beach Resort',
      duration: '90 min',
      booked: 18,
      therapist: 'Dr. Camille Laurent',
      capacity: 'Pavilion 1-4',
    },
    {
      id: 'spa-2',
      title: 'Desert Agave & Hot Basalt Healing',
      resort: 'Meridian Desert Resort',
      duration: '75 min',
      booked: 14,
      therapist: 'Tenzin N.',
      capacity: 'Canyon Suites',
    },
    {
      id: 'spa-3',
      title: 'Alpine Rosemary Detox & Thermal Bath',
      resort: 'Meridian Mountain Resort',
      duration: '110 min',
      booked: 12,
      therapist: 'Greta Meyer',
      capacity: 'Chalet Sanctuary',
    },
    {
      id: 'spa-4',
      title: 'Como Botanical Silk Wrap & Vichy Shower',
      resort: 'Meridian Lake Resort',
      duration: '60 min',
      booked: 16,
      therapist: 'Alessia Conti',
      capacity: 'Lakeside Cabanas',
    },
    {
      id: 'spa-5',
      title: 'Black Forest Pine & Birchwood Therapy',
      resort: 'Meridian Forest Resort',
      duration: '90 min',
      booked: 15,
      therapist: 'Klaus Richter',
      capacity: 'Timber Sauna Suite',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5">
          <span>Wellness &amp; Thalassotherapy</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Today's Spa Schedules</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E8F2F0] rounded-[10px] text-[#176B63]">
            <Sparkles className="w-6 h-6 text-[#176B63]" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
              Spa &amp; Wellness Appointments
            </h3>
            <p className="text-xs sm:text-sm text-[#647572]">
              Therapeutic bookings, thermal baths, and private wellness pavilions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaRituals.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-[10px] border border-[#D8E3E1] p-5 shadow-[0_1px_3px_rgba(23,32,31,0.05)] hover:border-[#176B63] transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#176B63] bg-[#E8F2F0] px-2 py-0.5 rounded">
                {r.resort}
              </span>
              <span className="text-xs text-[#647572] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {r.duration}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#10201E] mt-3">{r.title}</h4>
            <div className="mt-4 space-y-1.5 text-xs text-[#647572] border-t border-[#E3E8E5] pt-3">
              <div className="flex justify-between">
                <span>Bookings Today:</span>
                <span className="font-semibold text-[#10201E]">{r.booked} sessions</span>
              </div>
              <div className="flex justify-between">
                <span>Lead Practitioner:</span>
                <span className="font-medium text-[#10201E]">{r.therapist}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-[#10201E]">{r.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
