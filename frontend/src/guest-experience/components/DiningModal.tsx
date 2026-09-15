import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, MapPin, Shirt, Sparkles, Utensils, Calendar } from 'lucide-react';
import { Restaurant } from '../types';

interface DiningModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onReserveTable: (restaurant: Restaurant, time: string, partySize: number) => void;
}

export const DiningModal: React.FC<DiningModalProps> = ({ restaurant, onClose, onReserveTable }) => {
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState('19:30');

  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Visual Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0D242E]">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D242E] via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest text-[#DFCDAA] font-sans">
              {restaurant.cuisine}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light mt-0.5">{restaurant.name}</h3>
            <p className="text-xs text-[#EFE8DE]/80 italic mt-1 font-serif">{restaurant.tagline}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Key Facts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F5F0EB] border border-[#EFE8DE] text-xs text-[#0D242E] font-sans">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="truncate">{restaurant.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="truncate">{restaurant.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shirt className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="truncate">{restaurant.dressCode}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-2 font-sans">
              Culinary Philosophy
            </h4>
            <p className="text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
              {restaurant.description}
            </p>
          </div>

          {/* Signature Dish */}
          <div className="bg-white p-4 rounded-xl border border-[#EFE8DE] flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A880] font-sans">
                Chef's Signature Creation
              </p>
              <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                {restaurant.signatureDish}
              </p>
            </div>
          </div>

          {/* Menu Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-[#C5A880]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] font-sans">
                Sample Menu Selections
              </h4>
            </div>
            <div className="space-y-2.5">
              {restaurant.menuHighlights.map((item, i) => (
                <div key={i} className="flex items-baseline justify-between border-b border-[#EFE8DE] pb-2 text-xs">
                  <div>
                    <span className="font-serif text-sm font-medium text-[#0D242E]">{item.name}</span>
                    <p className="text-[11px] text-[#1C2826]/70 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-serif text-sm text-[#C5A880] font-semibold shrink-0 ml-4">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation Controls */}
          <div className="bg-[#F5F0EB] p-4 rounded-xl border border-[#EFE8DE] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[#1C2826]/60 mb-1">
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full bg-white p-2 rounded-lg border border-[#EFE8DE] text-xs font-medium text-[#0D242E]"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={8}>8+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[#1C2826]/60 mb-1">
                  Preferred Seating Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-[#EFE8DE] text-xs font-medium text-[#0D242E]"
                >
                  <option value="18:30">18:30 (Sunset Seating)</option>
                  <option value="19:30">19:30 (Prime Evening)</option>
                  <option value="20:30">20:30 (Starlight Dinner)</option>
                  <option value="21:30">21:30 (Late Dining)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onReserveTable(restaurant, time, partySize);
              }}
              className="w-full bg-[#0D242E] hover:bg-[#133845] text-white py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 shadow"
            >
              <Calendar className="w-4 h-4 text-[#C5A880]" />
              <span>Reserve Table at {restaurant.name}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
