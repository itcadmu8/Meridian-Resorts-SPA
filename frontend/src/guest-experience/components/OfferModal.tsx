import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Check, Tag, ArrowRight } from 'lucide-react';
import { SpecialOffer } from '../types';

interface OfferModalProps {
  offer: SpecialOffer | null;
  onClose: () => void;
  onReserveOffer: (offer: SpecialOffer) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ offer, onClose, onReserveOffer }) => {
  if (!offer) return null;

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
            src={offer.imageUrl}
            alt={offer.title}
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
              Exclusive Privilege
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mt-0.5">{offer.title}</h3>
            <p className="text-xs text-[#EFE8DE]/80 font-serif italic">{offer.tagline}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F0EB] border border-[#EFE8DE] text-xs font-sans text-[#0D242E]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{offer.validity}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase bg-white px-2.5 py-1 rounded border border-[#EFE8DE] text-[#0D242E] font-semibold">
              <Tag className="w-3 h-3 text-[#C5A880]" />
              <span>Code: {offer.code}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-2 font-sans">
              Privilege Overview
            </h4>
            <p className="text-sm text-[#1C2826]/80 leading-relaxed font-sans font-light">
              {offer.description}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EFE8DE]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] mb-3 font-sans">
              Package Inclusions & Honors
            </h4>
            <div className="space-y-2">
              {offer.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#1C2826]/85 font-sans">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onReserveOffer(offer);
            }}
            className="w-full bg-[#0D242E] hover:bg-[#133845] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Calendar className="w-4 h-4 text-[#C5A880]" />
            <span>Reserve With Privilege Code ({offer.code})</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
