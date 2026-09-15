import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Sparkles, Wind, Plane, Check, Calendar, ArrowRight } from 'lucide-react';
import { Resort } from '../types';

interface ResortModalProps {
  resort: Resort | null;
  onClose: () => void;
  onBookResort: (resort: Resort) => void;
}

export const ResortModal: React.FC<ResortModalProps> = ({ resort, onClose, onBookResort }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!resort) return null;

  const images = [resort.imageUrl, ...resort.gallery];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE8DE] bg-[#F5F0EB]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#0D242E]">
              Meridian Sanctuary Spotlight
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#0D242E]/70 hover:text-[#0D242E] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-[#0D242E]">
              <img
                src={images[activeImage]}
                alt={resort.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="text-xs uppercase tracking-wider">{resort.location}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light">{resort.name}</h2>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-[#C5A880] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-semibold">
                  {resort.vibe}
                </span>
                <h3 className="font-serif text-2xl text-[#0D242E] mt-1">{resort.tagline}</h3>
              </div>
              <p className="text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
                {resort.description}
              </p>

              {/* Signature Features */}
              <div className="pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-2.5">
                  Sanctuary Highlights & Privileges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resort.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-[#1C2826]/85">
                      <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Rates & Arrival Info */}
            <div className="bg-[#F5F0EB] p-5 rounded-xl border border-[#EFE8DE] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#1C2826]/60 font-sans">
                  Indicative Nightly Rate
                </span>
                <p className="font-serif text-3xl text-[#0D242E] font-light mt-1">
                  ${resort.startingRate}
                  <span className="text-xs font-sans text-[#1C2826]/70"> / night</span>
                </p>
                <p className="text-[11px] text-[#C5A880] font-sans mt-0.5 font-medium">
                  {resort.startingCategory}
                </p>

                <div className="mt-4 pt-4 border-t border-[#EFE8DE] space-y-2.5 text-xs text-[#1C2826]/80">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{resort.climate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{resort.transferType}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBookResort(resort);
                }}
                className="w-full bg-[#0D242E] hover:bg-[#133845] text-[#FBF9F5] hover:text-[#C5A880] py-3 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Reserve at {resort.name.replace('Meridian ', '')}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
