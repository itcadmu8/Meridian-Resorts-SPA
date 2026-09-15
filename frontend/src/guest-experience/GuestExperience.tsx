/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookingBar } from './components/BookingBar';
import { ResortCollection } from './components/ResortCollection';
import { AccommodationSection } from './components/AccommodationSection';
import { ResortExperiencePreview } from './components/ResortExperiencePreview';
import { MyStaySection } from './components/MyStaySection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ChatWidget } from '../components/ChatWidget';

// Modals
import { BookingFlowModal } from './components/BookingFlowModal';
import { MyStayModal } from './components/MyStayModal';
import { LoginExperience } from './components/LoginExperience';
import { StaffDashboardModal } from './components/StaffDashboardModal';
import { Toast, ToastNotification } from './components/Toast';

// Types
import {
  BookingSearchParams,
  Accommodation,
  Resort,
  SpecialOffer,
  SpaExperience,
  Restaurant,
  ExperienceItem,
  GuestService
} from './types';

export default function App({ onNavigate = () => {} }: { onNavigate?: (path: string) => void }) {
  const { signIn } = useAuth();
  // Navigation & Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMyStayOpen, setIsMyStayOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isStaffDashboardOpen, setIsStaffDashboardOpen] = useState(false);
  const [staffSession, setStaffSession] = useState<{ employeeId: string; role: string } | null>(null);

  // Booking Flow Data State
  const [bookingParams, setBookingParams] = useState<BookingSearchParams>({
    resort: 'Meridian Azure Cove, Maldives',
    checkIn: '2026-10-15',
    checkOut: '2026-10-20',
    guests: 2,
    promoCode: ''
  });
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Accommodation | null>(null);
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<SpecialOffer | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleSearchBooking = (params: BookingSearchParams) => {
    setBookingParams(params);
    setSelectedRoomForBooking(null);
    setSelectedOfferForBooking(null);
    setIsBookingOpen(true);
  };

  const handleBookResort = (resort: Resort) => {
    setBookingParams((prev) => ({ ...prev, resort: `${resort.name}, ${resort.location}` }));
    setIsBookingOpen(true);
  };

  const handleBookRoom = (room: Accommodation) => {
    setSelectedRoomForBooking(room);
    setIsBookingOpen(true);
  };

  const handleBookSpa = (treatment?: SpaExperience) => {
    if (treatment) {
      addToast(
        'Treatment Reserved',
        `Your reservation request for ${treatment.name} (${treatment.duration}) has been dispatched to the Spa Concierge.`
      );
    } else {
      addToast(
        'Wellness Journey Consultation',
        'Our Ayurvedic Vaidya will contact you to curate your multi-day wellness itinerary.'
      );
    }
  };

  const handleReserveTable = (restaurant: Restaurant, time: string, partySize: number) => {
    addToast(
      'Table Confirmed',
      `Reserved at ${restaurant.name} for ${partySize} guests at ${time}. Enjoy your culinary evening.`,
      'success'
    );
  };

  const handleInquireExperience = (exp: ExperienceItem) => {
    addToast(
      'Expedition Noted',
      `Our Chief Concierge has added "${exp.title}" to your itinerary request.`
    );
  };

  const handleRequestService = (service: GuestService) => {
    addToast(
      'Service Dispatched',
      `${service.name} requested. A dedicated coordinator is attending to your villa.`
    );
  };

  const handleReserveOffer = (offer: SpecialOffer) => {
    setSelectedOfferForBooking(offer);
    setBookingParams((prev) => ({ ...prev, promoCode: offer.code }));
    setIsBookingOpen(true);
  };

  const handleSubscribeNewsletter = (email: string) => {
    addToast(
      'Journal Subscription Confirmed',
      `Welcome dispatches and seasonal private retreat invitations will be sent to ${email}.`,
      'success'
    );
  };

  const handleGuestLoginSuccess = (resNumber: string, lastName: string) => {
    addToast(
      'Welcome, Guest',
      `Reservation ${resNumber} for ${lastName} retrieved. Accessing My Stay.`,
      'success'
    );
    setIsMyStayOpen(true);
  };

  const handleStaffLoginSuccess = (employeeId: string, role: string) => {
    setStaffSession({ employeeId, role });
    addToast(
      'Terminal Authenticated',
      `Signed in as Colleague ID ${employeeId} (${role}).`,
      'info'
    );
    setIsStaffDashboardOpen(true);
  };

  const handleConfirmBooking = (summary: any) => {
    addToast(
      'Reservation Confirmed',
      `Confirmation ${summary.resNumber} issued for ${summary.room} at ${summary.resort}. Welcome to Meridian!`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C2826] font-sans antialiased selection:bg-[#C5A880] selection:text-white relative">
      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Global Header */}
      <Header
        onOpenLogin={() => window.location.assign('/login')}
        onOpenMyStay={() => setIsMyStayOpen(true)}
        onBookNow={() => window.location.assign(localStorage.getItem('meridian_access_token') ? '/booking' : '/login?redirect=/booking')}
      />

      {/* Hero Section */}
      <Hero
        onExploreResorts={() => {
          const el = document.getElementById('resorts');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookStay={() => window.location.assign(localStorage.getItem('meridian_access_token') ? '/booking' : '/login?redirect=/booking')}
      />

      {/* Booking Bar (Search Widget) */}
      <BookingBar onSearch={handleSearchBooking} />

      {/* Main Sections */}
      <main>
        {/* Resort Collection */}
        <ResortCollection onBookResort={handleBookResort} />

        {/* Accommodation / Stay Section */}
        <AccommodationSection onBookRoom={handleBookRoom} />

        {/* Combined Dining & Spa Experience */}
        <ResortExperiencePreview
          onReserveTable={handleReserveTable}
          onBookSpa={handleBookSpa}
        />

        {/* Guest Personalization / My Stay Concierge */}
        <MyStaySection onAccessMyStay={() => setIsMyStayOpen(true)} />

        {/* Private Newsletter Dispatches */}
        <Newsletter onSubscribe={handleSubscribeNewsletter} />
      </main>

      {/* Luxury Footer */}
      <Footer
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenMyStay={() => setIsMyStayOpen(true)}
      />

      {/* Interactive Modals */}
      <BookingFlowModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialParams={bookingParams}
        selectedRoom={selectedRoomForBooking}
        selectedOffer={selectedOfferForBooking}
        onConfirmBooking={handleConfirmBooking}
      />

      <MyStayModal
        isOpen={isMyStayOpen}
        onClose={() => setIsMyStayOpen(false)}
        onTriggerToast={(title, msg) => addToast(title, msg, 'gold')}
      />

      <LoginExperience
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onGuestCredentials={(username, password) => signIn({ username, password, role: 'GUEST' })}
        onStaffCredentials={async (username, password) => {
          await signIn({ username, password, role: 'STAFF' });
          window.location.assign('/');
        }}
        onGuestLoginSuccess={handleGuestLoginSuccess}
        onStaffLoginSuccess={handleStaffLoginSuccess}
      />

      <StaffDashboardModal
        isOpen={isStaffDashboardOpen}
        onClose={() => setIsStaffDashboardOpen(false)}
        staffInfo={staffSession}
        onTriggerToast={(title, msg) => addToast(title, msg, 'info')}
      />
      <ChatWidget />
    </div>
  );
}
