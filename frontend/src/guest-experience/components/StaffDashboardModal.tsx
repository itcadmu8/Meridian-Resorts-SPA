/**
 * @file StaffDashboardModal.tsx
 * @description UI component for guest experience StaffDashboardModal.
 */
import React from 'react';
import { motion } from 'motion/react';
import { X, Briefcase, CheckCircle2, Clock, Users, BedDouble, Sparkles, Bell } from 'lucide-react';

interface StaffDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffInfo: { employeeId: string; role: string } | null;
  onTriggerToast: (title: string, desc: string) => void;
}

export const StaffDashboardModal: React.FC<StaffDashboardModalProps> = ({
  isOpen,
  onClose,
  staffInfo,
  onTriggerToast
}) => {
  if (!isOpen || !staffInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#EFE8DE] bg-[#0D242E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center border border-[#C5A880]/40">
              <Briefcase className="w-5 h-5 text-[#DFCDAA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl tracking-wide text-[#FBF9F5]">Colleague Operations Terminal</h3>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Live Shift
                </span>
              </div>
              <p className="text-xs text-[#F5F0EB]/70 font-sans">
                ID: {staffInfo.employeeId} · Division: {staffInfo.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
              <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 font-semibold block">
                VIP Arrivals Today
              </span>
              <p className="font-serif text-3xl text-[#0D242E] font-medium mt-1">14</p>
              <p className="text-[11px] text-emerald-700 mt-1">3 via Private Seaplane</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
              <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 font-semibold block">
                Villa Occupancy
              </span>
              <p className="font-serif text-3xl text-[#0D242E] font-medium mt-1">94.8%</p>
              <p className="text-[11px] text-[#C5A880] mt-1">48 of 50 Sanctuaries</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
              <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 font-semibold block">
                Active Butler Dispatches
              </span>
              <p className="font-serif text-3xl text-[#0D242E] font-medium mt-1">6</p>
              <p className="text-[11px] text-[#1C2826]/70 mt-1">Avg Response: 2.1 mins</p>
            </div>
          </div>

          {/* Pending Guest Tasks */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DE] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#0D242E]">
                Pending VIP Guest Inquiries & Requests
              </h4>
              <span className="text-[11px] text-[#C5A880] font-medium">Real-time sync</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EFE8DE] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#0D242E]">Pavilion 12 (Mr. & Mrs. Vance)</span>
                  <p className="text-[11px] text-[#1C2826]/70">Requested extra eucalyptus bath salts & sunset buggies to Tide</p>
                </div>
                <button
                  onClick={() => onTriggerToast('Dispatch Acknowledged', 'Dispatched Butler Team to Pavilion 12.')}
                  className="px-3 py-1.5 rounded-full bg-[#0D242E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#133845]"
                >
                  Fulfill
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EFE8DE] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#0D242E]">Presidential Enclave 01</span>
                  <p className="text-[11px] text-[#1C2826]/70">Sommelier wine decanting prepared for 20:00 dinner</p>
                </div>
                <button
                  onClick={() => onTriggerToast('Sommelier Notified', 'Cellar Reserve bottles staged for Presidential Enclave 01.')}
                  className="px-3 py-1.5 rounded-full bg-[#0D242E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#133845]"
                >
                  Confirmed
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
