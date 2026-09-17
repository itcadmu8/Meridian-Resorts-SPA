/**
 * @file OffersSection.tsx
 * @description UI component for guest experience OffersSection.
 */
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/offers';
import { SpecialOffer } from '../types';
import { OfferModal } from './OfferModal';

interface OffersSectionProps {
  onReserveOffer: (offer: SpecialOffer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onReserveOffer }) => {
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null);

  return (
    <section id="offers" className="py-24 sm:py-32 bg-[#FBF9F5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Seasonal Privileges
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            Curated Special Escapes
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Enhance your stay with thoughtfully designed packages that combine extended
            nights, transformative spa therapies, and bespoke culinary journeys.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPECIAL_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0D242E]">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {offer.badge && (
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0D242E] text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full shadow-xs">
                      {offer.badge}
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-white/90">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{offer.validity}</span>
                    </div>
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/20">
                      {offer.code}
                    </span>
                  </div>
                </div>

                <div className="p-7 sm:p-8">
                  <h3 className="font-serif text-2xl text-[#0D242E] group-hover:text-[#9E8159] transition-colors leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#C5A880] font-sans font-medium mt-1">
                    {offer.tagline}
                  </p>
                  <p className="mt-3.5 text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
                    {offer.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#EFE8DE]">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[#0D242E]/70 mb-2 font-sans">
                      Package Highlights
                    </p>
                    <div className="space-y-1.5">
                      {offer.inclusions.slice(0, 3).map((inc, i) => (
                        <p key={i} className="text-xs text-[#1C2826]/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0" />
                          <span className="truncate">{inc}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-7 sm:p-8 pt-0">
                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="w-full py-3 px-5 rounded-full border border-[#0D242E]/20 hover:border-[#0D242E] text-xs uppercase tracking-[0.16em] font-semibold text-[#0D242E] hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Offer Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OfferModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onReserveOffer={onReserveOffer}
      />
    </section>
  );
};
