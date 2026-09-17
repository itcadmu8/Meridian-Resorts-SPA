/**
 * @file BookingFlowModal.tsx
 * @description UI component for guest experience BookingFlowModal.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Users, Compass, Check, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { BookingSearchParams, Accommodation, Resort, SpecialOffer } from '../types';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: BookingSearchParams;
  selectedRoom?: Accommodation | null;
  selectedOffer?: SpecialOffer | null;
  onConfirmBooking: (bookingSummary: any) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  initialParams,
  selectedRoom,
  selectedOffer,
  onConfirmBooking
}) => {
  const [guestName, setGuestName] = useState('Alexander Vance');
  const [guestEmail, setGuestEmail] = useState('a.vance@privatesanctuary.com');
  const [specialRequests, setSpecialRequests] = useState('Quiet oceanfront pavilion, late seaplane arrival.');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const resortName = initialParams?.resort || 'Meridian Azure Cove, Maldives';
  let rawCheckIn = initialParams?.checkIn || '2026-10-15';
  let rawCheckOut = initialParams?.checkOut || '2026-10-20';

  // Guarantee checkIn is chronological before checkOut
  let checkIn = rawCheckIn;
  let checkOut = rawCheckOut;
  if (new Date(rawCheckIn) > new Date(rawCheckOut)) {
    checkIn = rawCheckOut;
    checkOut = rawCheckIn;
  }

  const guests = initialParams?.guests || 2;
  const roomName = selectedRoom?.name || 'Overwater Sunset Pool Villa';
  const nightlyRate = selectedRoom?.pricePerNight || 1250;

  // Calculate actual nights stay between checkIn and checkOut
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  const subtotal = nightlyRate * nights;
  const taxAndService = Math.round(subtotal * 0.16);
  const total = subtotal + taxAndService;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmBooking({
        resNumber: 'MER-' + Math.floor(10000 + Math.random() * 90000),
        resort: resortName,
        room: roomName,
        checkIn,
        checkOut,
        guestName,
        total
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#EFE8DE] bg-[#0D242E] text-white">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#DFCDAA]" />
            <div>
              <h3 className="font-serif text-xl tracking-wide text-[#FBF9F5]">
                Sanctuary Reservation
              </h3>
              <p className="text-xs text-[#F5F0EB]/70 font-sans">
                {resortName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Reservation Details Card */}
          <div className="p-5 rounded-2xl bg-[#F5F0EB] border border-[#EFE8DE] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-[#0D242E]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#1C2826]/60 block">
                Selected Sanctuary
              </span>
              <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                {roomName}
              </p>
              {selectedOffer && (
                <p className="text-[10px] text-[#C5A880] font-medium mt-1">
                  Offer applied: {selectedOffer.code}
                </p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#1C2826]/60 block">
                Dates of Stay
              </span>
              <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                {checkIn} → {checkOut}
              </p>
              <p className="text-[11px] text-[#1C2826]/70 mt-1">{nights} Nights ({guests} Guests)</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold text-[#1C2826]/60 block">
                Estimated Total
              </span>
              <p className="font-serif text-2xl text-[#0D242E] font-light mt-0.5">
                ${total.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#1C2826]/60">Includes taxes, island service & seaplane escort</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/70 mb-1 font-sans">
                  Lead Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/70 mb-1 font-sans">
                  Email for Sanctuary Dispatch
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/70 mb-1 font-sans">
                Personalized Butler Notes & Dietary Preferences
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Dietary requests, champagne preferences, pillow specifications..."
                className="w-full px-4 py-2.5 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#EFE8DE] flex items-center justify-between text-xs text-[#1C2826]/80 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Zero-Fee Cancellation up to 14 days prior to arrival</span>
              </div>
              <span className="font-semibold text-emerald-700">Instant VIP Confirmation</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#0D242E] hover:bg-[#133845] disabled:opacity-50 text-white py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 shadow"
            >
              {isProcessing ? (
                <span>Confirming Sanctuary Reservation...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  <span>Confirm Sanctuary Reservation (${total.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
