import React, { useState } from 'react';
import { Briefcase, Plane, Star, Clock, CheckCircle2 } from 'lucide-react';

interface ArrivalGuest {
  id: string;
  guestName: string;
  property: string;
  roomType: string;
  eta: string;
  flight: string;
  status: 'Checked In' | 'En Route' | 'Luggage Staged' | 'Pre-Registration';
  vipLevel: string;
}

const MOCK_ARRIVALS: ArrivalGuest[] = [
  {
    id: 'arr-1',
    guestName: 'Lady Catherine Montgomery',
    property: 'Meridian Beach Resort',
    roomType: 'Presidential Ocean Villa',
    eta: '11:30 AM',
    flight: 'BA 204 (Private Terminal)',
    status: 'Checked In',
    vipLevel: 'Meridian Diamond Tier',
  },
  {
    id: 'arr-2',
    guestName: 'Dr. Henrik Lindqvist',
    property: 'Meridian Lake Resort',
    roomType: 'Grand Como Suite',
    eta: '01:15 PM',
    flight: 'LH 1822 (Milan MXP)',
    status: 'Luggage Staged',
    vipLevel: 'Resort Elite',
  },
  {
    id: 'arr-3',
    guestName: 'Mr. Satoshi & Aoi Tanaka',
    property: 'Meridian Desert Resort',
    roomType: 'Canyon Pool Casita',
    eta: '02:45 PM',
    flight: 'NH 12 (Sky Harbor PHX)',
    status: 'En Route',
    vipLevel: 'Meridian Founder',
  },
  {
    id: 'arr-4',
    guestName: 'Ambassador Pierre Dupont',
    property: 'Meridian Mountain Resort',
    roomType: 'Chalet Panoramic Alpine',
    eta: '04:00 PM',
    flight: 'AF 89 (Aspen ASE)',
    status: 'Pre-Registration',
    vipLevel: 'Meridian Diplomatic',
  },
  {
    id: 'arr-5',
    guestName: 'Sofia Valenzuela & Family',
    property: 'Meridian Forest Resort',
    roomType: 'Black Forest Timber Lodge',
    eta: '05:30 PM',
    flight: 'IB 3410 (Frankfurt FRA)',
    status: 'En Route',
    vipLevel: 'Resort Elite',
  },
];

export const ArrivalsView: React.FC = () => {
  const [filterProperty, setFilterProperty] = useState('All');

  const filtered = filterProperty === 'All'
    ? MOCK_ARRIVALS
    : MOCK_ARRIVALS.filter((a) => a.property.includes(filterProperty));

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5">
          <span>Guest Relations</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Today's Arrivals &amp; VIP Manifest</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#E8F2F0] rounded-[10px] text-[#176B63] mt-0.5">
              <Briefcase className="w-6 h-6 text-[#176B63]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
                Guest Arrivals Manifest
              </h3>
              <p className="text-xs sm:text-sm text-[#647572] mt-0.5">
                Monitoring high-priority arrivals, luggage transit, and suite preparations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#647572]">Property Filter:</span>
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="text-xs bg-white border border-[#D8E3E1] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#176B63]"
            >
              <option value="All">All 6 Properties</option>
              <option value="Beach">Meridian Beach</option>
              <option value="Desert">Meridian Desert</option>
              <option value="Lake">Meridian Lake</option>
              <option value="Forest">Meridian Forest</option>
              <option value="Mountain">Meridian Mountain</option>
              <option value="City">Meridian City</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
        <div className="overflow-x-auto -mx-6 -my-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] text-[#647572] font-medium border-b border-[#D8E3E1] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">GUEST / VIP TIER</th>
                <th className="py-3 px-6">DESTINATION RESORT</th>
                <th className="py-3 px-6">SUITE ALLOCATION</th>
                <th className="py-3 px-6">ETA &amp; LOGISTICS</th>
                <th className="py-3 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E3E1]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F1F5F3] transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-[#10201E]">{item.guestName}</div>
                    <div className="text-[11px] text-[#176B63] flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-[#176B63]" />
                      {item.vipLevel}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-[#10201E] font-medium">{item.property}</td>
                  <td className="py-3.5 px-6 text-[#647572]">{item.roomType}</td>
                  <td className="py-3.5 px-6 text-[#647572]">
                    <div className="flex items-center gap-1.5 text-[#10201E] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#176B63]" />
                      {item.eta}
                    </div>
                    <div className="text-[11px] text-[#647572] flex items-center gap-1 mt-0.5">
                      <Plane className="w-3 h-3" />
                      {item.flight}
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold ${
                        item.status === 'Checked In'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Luggage Staged'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
