/**
 * @file ResortExperiencePreview.tsx
 * @description UI component for guest experience ResortExperiencePreview.
 */
import React, { useState } from 'react';
import { Sparkles, Utensils, Flower2, Clock, MapPin, Calendar, ArrowRight, X } from 'lucide-react';
import { Restaurant, SpaExperience } from '../types';
import { RESTAURANTS } from '../data/dining';
import { SPA_EXPERIENCES } from '../data/spa';

interface ResortExperiencePreviewProps {
  onReserveTable: (restaurant: Restaurant, time: string, partySize: number) => void;
  onBookSpa: (treatment?: SpaExperience) => void;
}

export const ResortExperiencePreview: React.FC<ResortExperiencePreviewProps> = ({
  onReserveTable,
  onBookSpa,
}) => {
  const [isDiningModalOpen, setIsDiningModalOpen] = useState(false);
  const [isSpaModalOpen, setIsSpaModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS[0]);
  const [reservationTime, setReservationTime] = useState('19:30');
  const [partySize, setPartySize] = useState(2);

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReserveTable(selectedRestaurant, reservationTime, partySize);
    setIsDiningModalOpen(false);
  };

  return (
    <section id="wellness-dining" className="py-20 sm:py-24 bg-[#F5F0EB]/60 scroll-mt-12 border-t border-[#EFE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EFE8DE] text-[#C5A880] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Refined Living
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0D242E] font-light tracking-tight">
            Dining & Restorative Wellness
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed font-light">
            Indulge in sustainably sourced coastal gastronomy and deep Ayurvedic rejuvenation across our oceanfront sanctuaries.
          </p>
        </div>

        {/* 2-Card Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Dining */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={RESTAURANTS[0]?.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"}
                alt="Dining at Meridian"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#0D242E] font-semibold">
                <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Culinary Arts</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
                  Oceanfront Gastronomy
                </h3>
                <p className="text-xs text-[#EFE8DE]/90 mt-1 font-light">
                  From wood-fired local seafood to candlelit private sandbank tastings.
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="grid grid-cols-2 gap-3 text-xs text-[#1C2826]/80 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>5 Specialty Venues</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Sommelier Cellar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Chef's Catch Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Sunset Pavilion</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#EFE8DE]">
                <span className="text-xs text-[#1C2826]/60 italic font-serif">Open daily for breakfast, lunch & dinner</span>
                <button
                  onClick={() => setIsDiningModalOpen(true)}
                  className="px-5 py-2.5 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <span>Reserve Table</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Spa & Wellness */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={SPA_EXPERIENCES[0]?.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"}
                alt="Lotus Spa at Meridian"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#0D242E] font-semibold">
                <Flower2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>The Lotus Spa</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
                  Restorative Sanctuaries
                </h3>
                <p className="text-xs text-[#EFE8DE]/90 mt-1 font-light">
                  Ancient Ayurvedic protocols, hydrotherapy pavilions, and ocean stone massages.
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="grid grid-cols-2 gap-3 text-xs text-[#1C2826]/80 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Overwater Pavilions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Ayurvedic Vaidya</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Himalayan Salt Sauna</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Yoga & Sound Baths</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#EFE8DE]">
                <span className="text-xs text-[#1C2826]/60 italic font-serif">Signature rituals from $190</span>
                <button
                  onClick={() => setIsSpaModalOpen(true)}
                  className="px-5 py-2.5 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <span>Book Treatment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dining Reservation Modal */}
      {isDiningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] w-full max-w-md rounded-2xl p-6 sm:p-7 border border-[#C5A880]/40 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif text-lg text-[#0D242E]">Table Reservation</h3>
              </div>
              <button
                onClick={() => setIsDiningModalOpen(false)}
                className="text-[#1C2826]/50 hover:text-[#0D242E] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1">
                  Select Venue
                </label>
                <select
                  value={selectedRestaurant.id}
                  onChange={(e) => {
                    const r = RESTAURANTS.find((item) => item.id === e.target.value);
                    if (r) setSelectedRestaurant(r);
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                >
                  {RESTAURANTS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} · {r.cuisine}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1">
                    Seating Time
                  </label>
                  <select
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="18:30">18:30 (Sunset)</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1">
                    Party Size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={6}>6+ Guests</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full text-xs uppercase tracking-wider font-semibold transition-colors mt-2"
              >
                Confirm Table Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spa Treatment Modal */}
      {isSpaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] w-full max-w-md rounded-2xl p-6 sm:p-7 border border-[#C5A880]/40 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <div className="flex items-center gap-2">
                <Flower2 className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif text-lg text-[#0D242E]">Curated Spa Rituals</h3>
              </div>
              <button
                onClick={() => setIsSpaModalOpen(false)}
                className="text-[#1C2826]/50 hover:text-[#0D242E] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {SPA_EXPERIENCES.slice(0, 4).map((treatment) => (
                <div
                  key={treatment.id}
                  className="p-3.5 bg-white rounded-xl border border-[#EFE8DE] flex items-center justify-between gap-3 hover:border-[#C5A880] transition-colors"
                >
                  <div>
                    <h4 className="font-serif text-sm text-[#0D242E] font-medium">{treatment.name}</h4>
                    <p className="text-[11px] text-[#1C2826]/70 mt-0.5">{treatment.duration} · ${treatment.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      onBookSpa(treatment);
                      setIsSpaModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#0D242E] text-white text-[11px] uppercase tracking-wider rounded-full hover:bg-[#133845] transition-colors shrink-0"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onBookSpa();
                setIsSpaModalOpen(false);
              }}
              className="w-full py-2.5 border border-[#0D242E] text-[#0D242E] rounded-full text-xs uppercase tracking-wider font-medium hover:bg-[#0D242E] hover:text-white transition-colors"
            >
              Request Custom Wellness Consultation
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
