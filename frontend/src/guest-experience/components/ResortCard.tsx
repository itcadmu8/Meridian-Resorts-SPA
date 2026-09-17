/**
 * @file ResortCard.tsx
 * @description UI component for guest experience ResortCard.
 */
import React from 'react';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Resort } from '../types';

interface ResortCardProps {
  resort: Resort;
  onExplore: (resort: Resort) => void;
}

export const ResortCard: React.FC<ResortCardProps> = ({ resort, onExplore }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container with Hover Zoom */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0D242E]">
        <img
          src={resort.imageUrl}
          alt={resort.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Location Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#0D242E] text-[11px] font-sans font-medium shadow-sm">
          <MapPin className="w-3 h-3 text-[#C5A880]" />
          <span>{resort.location}</span>
        </div>

        {/* Vibe Pill */}
        <div className="absolute top-4 right-4 hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#DFCDAA] text-[10px] tracking-wider uppercase font-sans border border-white/20">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{resort.country}</span>
        </div>

        {/* Starting Rate Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[#DFCDAA] font-sans">
              Starting from
            </p>
            <p className="font-serif text-2xl font-light">
              ${resort.startingRate} <span className="text-xs font-sans text-white/70">/ night</span>
            </p>
          </div>
          <span className="text-[11px] text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
            {resort.startingCategory}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-[#FBF9F5]/50">
        <div>
          <h3 className="font-serif text-2xl text-[#0D242E] font-normal tracking-wide group-hover:text-[#9E8159] transition-colors">
            {resort.name}
          </h3>
          <p className="text-xs tracking-widest uppercase text-[#C5A880] font-sans font-medium mt-1">
            {resort.tagline}
          </p>

          <p className="mt-3.5 text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
            {resort.description}
          </p>

          {/* Key Feature Badges */}
          <div className="mt-4 pt-4 border-t border-[#EFE8DE] flex flex-wrap gap-1.5">
            {resort.features.slice(0, 3).map((feat) => (
              <span
                key={feat}
                className="text-[10px] tracking-wider uppercase bg-[#F5F0EB] text-[#0D242E]/80 px-2.5 py-0.5 rounded-full font-sans"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-[#EFE8DE] flex items-center justify-between">
          <span className="text-[11px] text-[#1C2826]/60 font-sans italic">
            {resort.transferType}
          </span>
          <button
            onClick={() => onExplore(resort)}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#0D242E] group-hover:text-[#9E8159] transition-colors focus:outline-none"
          >
            <span>Explore Resort</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A880]" />
          </button>
        </div>
      </div>
    </div>
  );
};
