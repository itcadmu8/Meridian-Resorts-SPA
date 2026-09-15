import React from 'react';
import { X, Calendar, MapPin, BedDouble, Plane, Mail, Phone, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ArrivalReservation } from '../types';

interface ReservationModalProps {
  reservation: ArrivalReservation | null;
  onClose: () => void;
  onConfirmCheckIn?: (id: string) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  reservation,
  onClose,
  onConfirmCheckIn,
}) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Luxury Accent */}
        <div className="bg-gradient-to-r from-[#0a3e39] to-[#0f766e] text-white p-6 relative">
          <button
            id="close-reservation-modal"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/30 ${reservation.guestAvatarColor}`}>
              {reservation.guestInitials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {reservation.guestName}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/20 text-white backdrop-blur-xs">
                  {reservation.loyaltyTier}
                </span>
              </div>
              <p className="text-xs text-teal-100/90 font-mono mt-0.5">
                {reservation.reservationId} &bull; Guest ID: {reservation.guestId}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#0f766e]" />
                <span className="text-[10.5px] uppercase font-bold tracking-wider">Assigned Property</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{reservation.property}</p>
              <span className="text-[11px] text-teal-700 font-medium">{reservation.propertyCategory} Collection</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <BedDouble className="w-3.5 h-3.5 text-[#0f766e]" />
                <span className="text-[10.5px] uppercase font-bold tracking-wider">Accommodation</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{reservation.roomNumber}</p>
              <span className="text-[11px] text-slate-500 font-medium">{reservation.roomType}</span>
            </div>
          </div>

          {/* Stay Dates and Flight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-[10.5px] text-slate-400 uppercase font-semibold">Stay Duration</span>
                <p className="font-semibold text-slate-800">
                  {reservation.checkInDate} &rarr; {reservation.checkOutDate} ({reservation.totalNights} nights)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
              <Plane className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-[10.5px] text-slate-400 uppercase font-semibold">Arrival Logistics</span>
                <p className="font-semibold text-slate-800">
                  {reservation.flightArrival || 'Standard Private Transfer'} ({reservation.pax} Guests)
                </p>
              </div>
            </div>
          </div>

          {/* Special Guest Preferences */}
          {reservation.specialPreference && (
            <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200/80">
              <div className="flex items-center space-x-2 text-teal-900 font-bold mb-1.5">
                <Heart className="w-4 h-4 text-teal-600 fill-teal-600/20" />
                <span>Special Request &amp; Concierge Notes</span>
              </div>
              <p className="text-teal-950 font-medium leading-relaxed">
                &ldquo;{reservation.specialPreference}&rdquo;
              </p>
              <div className="mt-2 flex items-center space-x-1 text-[11px] text-teal-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Villa butler assigned and notified</span>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-slate-500">
            {reservation.contactEmail && (
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{reservation.contactEmail}</span>
              </div>
            )}
            {reservation.contactPhone && (
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{reservation.contactPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Status: {reservation.status}</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              id="confirm-checkin-action"
              type="button"
              onClick={() => {
                if (onConfirmCheckIn) onConfirmCheckIn(reservation.id);
                onClose();
              }}
              className="bg-[#0f766e] hover:bg-[#115e59] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Process Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
