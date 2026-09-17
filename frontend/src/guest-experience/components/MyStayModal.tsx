/**
 * @file MyStayModal.tsx
 * @description UI component for guest experience MyStayModal.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Compass,
  CheckCircle2,
  Key,
  MessageSquare,
  Utensils,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  BedDouble
} from 'lucide-react';

interface MyStayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (title: string, desc: string) => void;
}

export const MyStayModal: React.FC<MyStayModalProps> = ({ isOpen, onClose, onTriggerToast }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'concierge' | 'preferences'>('overview');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Thakuru (Butler Marcus)',
      text: 'Good day Mr. & Mrs. Vance. Welcome to Meridian Azure Cove. Your chilled Bollinger champagne and ocean bath are prepared in Pavilion 12. How may I assist you today?',
      time: '14:20'
    }
  ]);
  const [selectedPillow, setSelectedPillow] = useState('Hungarian Goose Down');
  const [roomTemp, setRoomTemp] = useState('21°C');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = { sender: 'You', text: chatMessage, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setChatMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Thakuru (Butler Marcus)',
          text: 'Understood with pleasure. I have coordinated your request immediately.',
          time: 'Just now'
        }
      ]);
      onTriggerToast('Butler Request Received', 'Your Thakuru Marcus is attending to your request.');
    }, 1000);
  };

  const handleCheckInToggle = () => {
    setIsCheckedIn(true);
    onTriggerToast('Digital Key Activated', 'Room 114 - Azure Horizon Suite. Bluetooth access enabled.');
  };

  const handleSavePreferences = () => {
    onTriggerToast('Preferences Updated', `Pillow choice saved: ${selectedPillow}. Room climate set to ${roomTemp}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#EFE8DE] bg-[#0D242E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 flex items-center justify-center border border-[#C5A880]/40">
              <Compass className="w-5 h-5 text-[#DFCDAA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl tracking-wide text-[#FBF9F5]">My Stay Portal</h3>
                <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-[#DFCDAA]">
                  Res: MER-89241
                </span>
              </div>
              <p className="text-xs text-[#F5F0EB]/70 font-sans">
                Meridian Azure Cove, Maldives · Oct 15 - Oct 20, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EFE8DE] bg-[#F5F0EB]/80 px-6 sm:px-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#C5A880] text-[#0D242E]'
                : 'border-transparent text-[#1C2826]/60 hover:text-[#0D242E]'
            }`}
          >
            Stay Overview
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
              activeTab === 'concierge'
                ? 'border-[#C5A880] text-[#0D242E]'
                : 'border-transparent text-[#1C2826]/60 hover:text-[#0D242E]'
            }`}
          >
            Butler & Concierge Chat
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
              activeTab === 'preferences'
                ? 'border-[#C5A880] text-[#0D242E]'
                : 'border-transparent text-[#1C2826]/60 hover:text-[#0D242E]'
            }`}
          >
            Guest Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Check-In / Digital Key Banner */}
              <div className="p-5 rounded-2xl bg-white border border-[#EFE8DE] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <Key className="w-6 h-6 text-[#C5A880]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#0D242E]">
                      {isCheckedIn ? 'Mobile Key Active · Room 114' : 'Express Mobile Check-In'}
                    </h4>
                    <p className="text-xs text-[#1C2826]/70 font-sans">
                      {isCheckedIn
                        ? 'Hold device near door lock or touch to unlock over Bluetooth'
                        : 'Bypass front desk and unlock your sanctuary directly upon arrival'}
                    </p>
                  </div>
                </div>

                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckInToggle}
                    className="px-5 py-2.5 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full text-xs uppercase tracking-wider font-semibold shrink-0 transition-colors shadow-sm"
                  >
                    Complete Check-In
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Ready
                  </span>
                )}
              </div>

              {/* Reservation Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
                  <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 block font-semibold">
                    Sanctuary
                  </span>
                  <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                    Overwater Sunset Pool Villa
                  </p>
                  <p className="text-[11px] text-[#C5A880] mt-1">Direct Lagoon Descent</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
                  <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 block font-semibold">
                    Guests
                  </span>
                  <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                    2 Adults (Mr. & Mrs. Vance)
                  </p>
                  <p className="text-[11px] text-[#1C2826]/60 mt-1">Seaplane VIP Terminal</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
                  <span className="text-[10px] uppercase tracking-wider text-[#1C2826]/60 block font-semibold">
                    Dedicated Thakuru
                  </span>
                  <p className="font-serif text-base text-[#0D242E] font-medium mt-0.5">
                    Marcus Lind
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">● On Duty 24/7</p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#0D242E] mb-3">
                  Digital Concierge Services
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => onTriggerToast('Dining Reservation', 'Opening Priority Table Booker for Tide & Ember.')}
                    className="p-3.5 rounded-xl bg-white border border-[#EFE8DE] hover:border-[#C5A880] text-center transition-all group"
                  >
                    <Utensils className="w-5 h-5 mx-auto text-[#C5A880] group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="block text-xs font-semibold text-[#0D242E]">Reserve Table</span>
                    <span className="text-[10px] text-[#1C2826]/60">Tide, Ember, Saffron</span>
                  </button>

                  <button
                    onClick={() => onTriggerToast('Spa Booking', 'Opening Spa Treatment reservation scheduler.')}
                    className="p-3.5 rounded-xl bg-white border border-[#EFE8DE] hover:border-[#C5A880] text-center transition-all group"
                  >
                    <Sparkles className="w-5 h-5 mx-auto text-[#C5A880] group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="block text-xs font-semibold text-[#0D242E]">Book Spa Ritual</span>
                    <span className="text-[10px] text-[#1C2826]/60">Ayurveda & Massages</span>
                  </button>

                  <button
                    onClick={() => onTriggerToast('Housekeeping Requested', 'Evening turndown & fresh linen scheduled for 18:00.')}
                    className="p-3.5 rounded-xl bg-white border border-[#EFE8DE] hover:border-[#C5A880] text-center transition-all group"
                  >
                    <BedDouble className="w-5 h-5 mx-auto text-[#C5A880] group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="block text-xs font-semibold text-[#0D242E]">Housekeeping</span>
                    <span className="text-[10px] text-[#1C2826]/60">Turndown & amenities</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('concierge')}
                    className="p-3.5 rounded-xl bg-white border border-[#EFE8DE] hover:border-[#C5A880] text-center transition-all group"
                  >
                    <MessageSquare className="w-5 h-5 mx-auto text-[#C5A880] group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="block text-xs font-semibold text-[#0D242E]">Chat Butler</span>
                    <span className="text-[10px] text-[#1C2826]/60">Instant response</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'concierge' && (
            <div className="flex flex-col h-[380px] bg-white rounded-2xl border border-[#EFE8DE] p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      m.sender === 'You' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1C2826]/60">
                        {m.sender}
                      </span>
                      <span className="text-[9px] text-[#1C2826]/40">{m.time}</span>
                    </div>
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'You'
                          ? 'bg-[#0D242E] text-white rounded-br-xs'
                          : 'bg-[#F5F0EB] text-[#0D242E] rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-[#EFE8DE] flex gap-2">
                <input
                  type="text"
                  placeholder="Request ice, seaplane confirmation, buggies, bath salt..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-[#FBF9F5] border border-[#EFE8DE] rounded-full px-4 py-2 text-xs text-[#0D242E] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full transition-colors"
                >
                  <Send className="w-4 h-4 text-[#C5A880]" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#EFE8DE] space-y-4">
                <h4 className="font-serif text-lg text-[#0D242E]">Customized Villa Settings</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1C2826]/70 mb-1.5">
                      Orthopedic & Down Pillow Selection
                    </label>
                    <select
                      value={selectedPillow}
                      onChange={(e) => setSelectedPillow(e.target.value)}
                      className="w-full bg-[#F5F0EB] p-2.5 rounded-xl border border-[#EFE8DE] text-xs font-medium text-[#0D242E]"
                    >
                      <option>Hungarian Goose Down</option>
                      <option>Memory Foam Cervical Support</option>
                      <option>Mulberry Silk Hypoallergenic</option>
                      <option>Organic Buckwheat Botanical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1C2826]/70 mb-1.5">
                      Target Sleeping Temperature
                    </label>
                    <select
                      value={roomTemp}
                      onChange={(e) => setRoomTemp(e.target.value)}
                      className="w-full bg-[#F5F0EB] p-2.5 rounded-xl border border-[#EFE8DE] text-xs font-medium text-[#0D242E]"
                    >
                      <option>20°C (Crisp Cool)</option>
                      <option>21°C (Optimal Deep Sleep)</option>
                      <option>22°C (Temperate)</option>
                      <option>23°C (Tropical Gentle)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSavePreferences}
                    className="py-2.5 px-5 bg-[#0D242E] hover:bg-[#133845] text-white rounded-full text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
                  >
                    Save Preferences to Butler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
