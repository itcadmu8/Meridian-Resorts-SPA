/**
 * @file SpaModal.tsx
 * @description UI component for guest experience SpaModal.
 */
import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Sparkles, Droplets, Check, Calendar } from 'lucide-react';
import { SpaExperience } from '../types';

interface SpaModalProps {
  treatment: SpaExperience | null;
  onClose: () => void;
  onBookTreatment: (treatment: SpaExperience) => void;
}

export const SpaModal: React.FC<SpaModalProps> = ({ treatment, onClose, onBookTreatment }) => {
  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0D242E]">
          <img
            src={treatment.imageUrl}
            alt={treatment.name}
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
            <span className="text-[11px] uppercase tracking-widest text-[#DFCDAA] font-sans">
              {treatment.category} Ritual
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mt-0.5">{treatment.name}</h3>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F0EB] border border-[#EFE8DE] text-xs sm:text-sm font-sans">
            <div className="flex items-center gap-2 text-[#0D242E]">
              <Clock className="w-4 h-4 text-[#C5A880]" />
              <span>Duration: <strong>{treatment.duration}</strong></span>
            </div>
            <div className="text-right">
              <span className="text-lg font-serif font-medium text-[#0D242E]">${treatment.price}</span>
              <span className="text-xs text-[#1C2826]/70"> / guest</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-2 font-sans">
              Treatment Protocol & Experience
            </h4>
            <p className="text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
              {treatment.description}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EFE8DE]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-1.5 font-sans">
              <Droplets className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Artisanal Botanical Formulation</span>
            </div>
            <p className="text-xs text-[#1C2826]/75 italic font-sans leading-relaxed">
              {treatment.ingredients}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#1C2826]/80 font-sans">
              <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Includes pre-treatment botanical foot cleansing & dosha assessment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1C2826]/80 font-sans">
              <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Post-ritual relaxation in ocean-view lounge with herbal tisane</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookTreatment(treatment);
            }}
            className="w-full bg-[#0D242E] hover:bg-[#133845] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Calendar className="w-4 h-4 text-[#C5A880]" />
            <span>Book This Spa Ritual</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
