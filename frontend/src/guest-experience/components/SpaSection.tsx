import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  Cloud,
  Droplets,
  Sun,
  Flower2,
  Activity,
  Compass,
  Check
} from 'lucide-react';
import { SPA_EXPERIENCES, WELLNESS_FACILITIES } from '../data/spa';
import { SpaExperience } from '../types';
import { SpaModal } from './SpaModal';

interface SpaSectionProps {
  onBookSpa: (treatment?: SpaExperience) => void;
}

export const SpaSection: React.FC<SpaSectionProps> = ({ onBookSpa }) => {
  const [selectedTreatment, setSelectedTreatment] = useState<SpaExperience | null>(null);

  const getFacilityIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return Sparkles;
      case 'Flame':
        return Flame;
      case 'Cloud':
        return Cloud;
      case 'Droplets':
        return Droplets;
      case 'Sun':
        return Sun;
      case 'Flower2':
        return Flower2;
      case 'Activity':
        return Activity;
      default:
        return Compass;
    }
  };

  return (
    <section id="spa" className="py-24 sm:py-32 bg-[#FBF9F5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Restorative Sanctuary
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            The Art of Deep Relaxation
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Step away from the everyday and enter a world of restorative rituals inspired
            by nature. Drawing from indigenous island botanicals, oceanic sea minerals, and
            timeless Ayurvedic healing.
          </p>
        </div>

        {/* Spa Experiences Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl text-[#0D242E] font-normal tracking-wide">
              Curated Treatment Rituals
            </h3>
            <span className="text-xs uppercase tracking-wider text-[#C5A880] font-sans font-semibold">
              7 Signature Protocols
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SPA_EXPERIENCES.map((treatment) => (
              <div
                key={treatment.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#0D242E]">
                    <img
                      src={treatment.imageUrl}
                      alt={treatment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full text-[#0D242E]">
                      {treatment.category}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white font-serif text-lg font-light">
                      ${treatment.price}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-[#1C2826]/60 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{treatment.duration}</span>
                    </div>
                    <h4 className="font-serif text-lg font-medium text-[#0D242E] group-hover:text-[#9E8159] transition-colors leading-snug">
                      {treatment.name}
                    </h4>
                    <p className="mt-2 text-xs text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
                      {treatment.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedTreatment(treatment)}
                    className="w-full py-2 px-3 rounded-full border border-[#0D242E]/15 hover:border-[#0D242E] text-xs uppercase tracking-[0.14em] font-semibold text-[#0D242E] hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Explore Treatment</span>
                    <ArrowRight className="w-3 h-3 text-[#C5A880]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wellness Facilities Showcase */}
        <div className="bg-[#F5F0EB] rounded-3xl p-8 sm:p-12 border border-[#EFE8DE] mb-16">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0D242E] font-normal">
              State-of-the-Art Wellness Sanctuaries
            </h3>
            <p className="text-xs sm:text-sm text-[#1C2826]/70 mt-2 font-sans">
              Complimentary for all resident guests throughout their stay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WELLNESS_FACILITIES.map((facility) => {
              const IconComp = getFacilityIcon(facility.iconName);
              return (
                <div
                  key={facility.id}
                  className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-white/60 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0EB] flex items-center justify-center mb-3">
                    <IconComp className="w-5 h-5 text-[#C5A880]" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#0D242E]">
                    {facility.name}
                  </h4>
                  <p className="text-xs text-[#1C2826]/75 mt-1.5 leading-relaxed font-sans">
                    {facility.description}
                  </p>
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-wider font-semibold text-[#C5A880]">
                    {facility.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immersive CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-[#0D242E] text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#DFCDAA] font-sans font-semibold">
              Bespoke Healing Journeys
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
              Begin Your Wellness Journey
            </h3>
            <p className="text-sm text-[#F5F0EB]/80 font-sans leading-relaxed">
              Consult with our resident Ayurvedic Vaidya and naturopaths for a customized
              multi-day vitality plan paired with daily treatments and restorative diet.
            </p>
          </div>

          <button
            onClick={() => onBookSpa()}
            id="spa-cta-begin-journey-btn"
            className="px-8 py-4 bg-[#C5A880] hover:bg-[#9E8159] text-white rounded-full text-xs uppercase tracking-[0.22em] font-semibold transition-all shadow-lg hover:shadow-xl shrink-0"
          >
            Begin Your Wellness Journey
          </button>
        </div>
      </div>

      <SpaModal
        treatment={selectedTreatment}
        onClose={() => setSelectedTreatment(null)}
        onBookTreatment={onBookSpa}
      />
    </section>
  );
};
