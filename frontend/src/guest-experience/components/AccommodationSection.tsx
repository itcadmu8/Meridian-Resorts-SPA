/**
 * @file AccommodationSection.tsx
 * @description UI component for guest experience AccommodationSection.
 */
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ACCOMMODATIONS } from '../data/accommodations';
import { Accommodation } from '../types';
import { AccommodationCard } from './AccommodationCard';
import { RoomModal } from './RoomModal';

interface AccommodationSectionProps {
  onBookRoom: (room: Accommodation) => void;
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({ onBookRoom }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<Accommodation | null>(null);
  const [showAll, setShowAll] = useState(false);

  const categories = [
    'All',
    'Beach Villas',
    'Private Pool Villas',
    'Ocean Residences'
  ];

  const filteredRooms =
    selectedCategory === 'All'
      ? ACCOMMODATIONS
      : ACCOMMODATIONS.filter((r) => r.category === selectedCategory);

  const displayedRooms = showAll ? filteredRooms : filteredRooms.slice(0, 3);

  return (
    <section id="stay" className="py-16 sm:py-20 bg-[#F5F0EB]/60 scroll-mt-12 border-t border-[#EFE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EFE8DE] text-[#C5A880] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Villas & Residences
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#0D242E] tracking-tight">
            Private Sanctuaries
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-3.5" />
          <p className="text-xs sm:text-sm text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Native teak, expansive ocean horizons, private infinity pools, and dedicated Thakuru butler service.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAll(true);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.12em] font-sans font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0D242E] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F5F0EB] text-[#1C2826]/70 border border-[#EFE8DE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedRooms.map((room) => (
            <AccommodationCard
              key={room.id}
              room={room}
              onExplore={(r) => setSelectedRoom(r)}
              onBook={onBookRoom}
            />
          ))}
        </div>

        {/* View All Toggle */}
        {filteredRooms.length > 3 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2.5 border border-[#0D242E] text-[#0D242E] hover:bg-[#0D242E] hover:text-white rounded-full text-xs uppercase tracking-[0.16em] font-semibold transition-colors"
            >
              {showAll ? 'Show Fewer' : `View All ${filteredRooms.length} Villas`}
            </button>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onBook={onBookRoom}
      />
    </section>
  );
};
