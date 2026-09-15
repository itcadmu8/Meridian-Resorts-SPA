import React from 'react';
import { Users, BedDouble, Eye, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Accommodation } from '../types';

interface AccommodationCardProps {
  room: Accommodation;
  onExplore: (room: Accommodation) => void;
  onBook: (room: Accommodation) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ room, onExplore, onBook }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
      {/* Large Image Showcase */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0D242E]">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#0D242E] text-[11px] font-sans font-semibold shadow-sm">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>{room.category}</span>
          </span>
        </div>

        {/* Size Pill */}
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#DFCDAA] text-[10px] tracking-wider uppercase font-sans border border-white/20">
            {room.size}
          </span>
        </div>

        {/* Price & View Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[#DFCDAA] font-sans">
              From
            </p>
            <p className="font-serif text-2xl font-light">
              ${room.pricePerNight} <span className="text-xs font-sans text-white/70">/ night</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
            <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="max-w-[130px] truncate">{room.view}</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-[#FBF9F5]/40">
        <div>
          <h3 className="font-serif text-2xl text-[#0D242E] font-normal tracking-wide group-hover:text-[#9E8159] transition-colors">
            {room.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed line-clamp-2">
            {room.description}
          </p>

          {/* Quick Specs: Capacity & Bedding */}
          <div className="mt-4 py-3 border-y border-[#EFE8DE] grid grid-cols-2 gap-2 text-xs text-[#1C2826]/80 font-sans">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="truncate">{room.bedConfig}</span>
            </div>
          </div>

          {/* Key Amenities Checklist */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#0D242E]/70 mb-2 font-sans">
              Key Inclusions
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
              {room.amenities.slice(0, 4).map((amenity) => (
                <div key={amenity} className="flex items-center gap-1.5 text-[11px] text-[#1C2826]/80 font-sans">
                  <Check className="w-3 h-3 text-[#C5A880] shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#EFE8DE] flex items-center gap-3">
          <button
            onClick={() => onExplore(room)}
            className="flex-1 py-2.5 px-4 rounded-full border border-[#0D242E]/20 hover:border-[#0D242E] text-[#0D242E] text-xs uppercase tracking-[0.16em] font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Room</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </button>
          <button
            onClick={() => onBook(room)}
            className="py-2.5 px-5 rounded-full bg-[#0D242E] hover:bg-[#133845] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-colors shadow-sm"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};
