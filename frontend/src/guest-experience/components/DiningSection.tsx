import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, MapPin, Shirt } from 'lucide-react';
import { RESTAURANTS } from '../data/dining';
import { Restaurant } from '../types';
import { DiningModal } from './DiningModal';

interface DiningSectionProps {
  onReserveTable: (restaurant: Restaurant, time: string, partySize: number) => void;
}

export const DiningSection: React.FC<DiningSectionProps> = ({ onReserveTable }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  return (
    <section id="dining" className="py-24 sm:py-32 bg-[#F5F0EB]/50 scroll-mt-12 border-t border-[#EFE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Epicurean Artistry
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            A Journey of Flavours
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            From ocean-fresh raw bars hovering over illuminated coral reefs to barefoot
            starlight grills and regal Malabar spice journeys. Every restaurant at Meridian
            is an intimate celebration of terroir, season, and master craftsmanship.
          </p>
        </div>

        {/* Featured Hero Restaurant (Tide) */}
        <div className="mb-12 bg-white rounded-3xl overflow-hidden border border-[#EFE8DE] shadow-sm hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#0D242E]">
            <img
              src={RESTAURANTS[0].imageUrl}
              alt={RESTAURANTS[0].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#0D242E]/80 backdrop-blur-md text-[#DFCDAA] text-[11px] uppercase tracking-wider font-semibold border border-white/20">
                Signature Oceanfront Destination
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-[#FBF9F5]/80">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-semibold">
                {RESTAURANTS[0].cuisine}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#0D242E] mt-1">
                {RESTAURANTS[0].name}
              </h3>
              <p className="text-xs text-[#1C2826]/60 italic font-serif mt-1">
                {RESTAURANTS[0].tagline}
              </p>

              <p className="mt-4 text-xs sm:text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
                {RESTAURANTS[0].description}
              </p>

              <div className="mt-5 p-3.5 rounded-xl bg-white border border-[#EFE8DE] space-y-1.5 text-xs text-[#1C2826]/80 font-sans">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{RESTAURANTS[0].openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{RESTAURANTS[0].location}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setSelectedRestaurant(RESTAURANTS[0])}
                className="flex-1 py-3 px-5 rounded-full bg-[#0D242E] hover:bg-[#133845] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>View Restaurant & Menu</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Remaining Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESTAURANTS.slice(1).map((res) => (
            <div
              key={res.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#0D242E]">
                  <img
                    src={res.imageUrl}
                    alt={res.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-[11px] font-sans font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
                    {res.diningStyle}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-sans font-semibold">
                    {res.cuisine}
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#0D242E] group-hover:text-[#9E8159] transition-colors mt-0.5">
                    {res.name}
                  </h4>
                  <p className="mt-2 text-xs text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
                    {res.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedRestaurant(res)}
                  className="w-full py-2.5 px-4 rounded-full border border-[#0D242E]/15 hover:border-[#0D242E] text-xs uppercase tracking-[0.14em] font-semibold text-[#0D242E] hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Restaurant</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DiningModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onReserveTable={onReserveTable}
      />
    </section>
  );
};
