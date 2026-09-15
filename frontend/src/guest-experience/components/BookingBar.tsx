import React, { useState } from 'react';
import { Calendar, Users, MapPin, Search } from 'lucide-react';
import { RESORTS } from '../data/resorts';
import { BookingState } from '../types';

interface BookingBarProps {
  onSearch: (booking: BookingState) => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({ onSearch }) => {
  const [selectedResort, setSelectedResort] = useState(RESORTS[0].id);
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-20');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      resortId: selectedResort,
      checkIn,
      checkOut,
      guests,
      rooms
    });
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-16 sm:-mt-12">
      <div className="bg-[#FBF9F5] rounded-2xl sm:rounded-full p-4 sm:p-3 shadow-2xl border border-[#C5A880]/30 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Destination */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl sm:rounded-full bg-white border border-[#EFE8DE] hover:border-[#C5A880]/50 transition-colors">
            <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] tracking-wider uppercase text-[#1C2826]/60 font-sans font-semibold">
                Sanctuary / Destination
              </label>
              <select
                value={selectedResort}
                onChange={(e) => setSelectedResort(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#0D242E] focus:outline-none cursor-pointer truncate"
              >
                {RESORTS.map((resort) => (
                  <option key={resort.id} value={resort.id} className="text-[#0D242E]">
                    {resort.name} ({resort.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl sm:rounded-full bg-white border border-[#EFE8DE] hover:border-[#C5A880]/50 transition-colors">
            <Calendar className="w-4 h-4 text-[#C5A880] shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] tracking-wider uppercase text-[#1C2826]/60 font-sans font-semibold">
                Arrival & Departure
              </label>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0D242E]">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs"
                />
                <span className="text-[#C5A880]">—</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs"
                />
              </div>
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl sm:rounded-full bg-white border border-[#EFE8DE] hover:border-[#C5A880]/50 transition-colors">
            <Users className="w-4 h-4 text-[#C5A880] shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] tracking-wider uppercase text-[#1C2826]/60 font-sans font-semibold">
                Guests & Sanctuaries
              </label>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#0D242E]">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
                <span className="text-[#C5A880]">·</span>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Sanctuary</option>
                  <option value={2}>2 Sanctuaries</option>
                  <option value={3}>3 Sanctuaries</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div>
            <button
              type="submit"
              id="booking-bar-submit-btn"
              className="w-full bg-[#0D242E] hover:bg-[#133845] text-[#FBF9F5] hover:text-[#C5A880] py-3.5 px-6 rounded-xl sm:rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
            >
              <Search className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Check Availability</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
