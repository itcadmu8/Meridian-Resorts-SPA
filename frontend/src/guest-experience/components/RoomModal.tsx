/**
 * @file RoomModal.tsx
 * @description UI component for guest experience RoomModal.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, BedDouble, Eye, Check, Calendar, Sparkles } from 'lucide-react';
import { Accommodation } from '../types';

interface RoomModalProps {
  room: Accommodation | null;
  onClose: () => void;
  onBook: (room: Accommodation) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, onClose, onBook }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!room) return null;

  const images = [room.imageUrl, ...room.gallery];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE8DE] bg-[#F5F0EB]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#0D242E]">
              {room.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#0D242E]/70 hover:text-[#0D242E] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Visual Carousel */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-[#0D242E]">
              <img
                src={images[activeImage]}
                alt={room.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xs uppercase tracking-wider text-[#DFCDAA]">{room.size}</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light">{room.name}</h2>
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

          {/* Details & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
                {room.description}
              </p>

              {/* Highlight Note */}
              <div className="bg-[#F5F0EB] p-3.5 rounded-xl border-l-2 border-[#C5A880] text-xs text-[#0D242E] font-medium font-sans">
                Signature Feature: {room.highlight}
              </div>

              {/* Full Amenities Checklist */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-3">
                  Sanctuary Amenities & Privileges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-xs text-[#1C2826]/85">
                      <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking Card */}
            <div className="bg-[#F5F0EB] p-5 rounded-xl border border-[#EFE8DE] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#1C2826]/60 font-sans">
                  Nightly Sanctuary Rate
                </span>
                <p className="font-serif text-3xl text-[#0D242E] font-light mt-1">
                  ${room.pricePerNight}
                  <span className="text-xs font-sans text-[#1C2826]/70"> / night</span>
                </p>

                <div className="mt-4 pt-4 border-t border-[#EFE8DE] space-y-2.5 text-xs text-[#1C2826]/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{room.bedConfig}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{room.view}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBook(room);
                }}
                className="w-full bg-[#0D242E] hover:bg-[#133845] text-[#FBF9F5] hover:text-[#C5A880] py-3 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Book This Sanctuary</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
