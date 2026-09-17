/**
 * @file MyStayPage.tsx
 * @description Page view component for MyStayPage.
 */
import React, { useEffect, useState } from 'react';
import { getReservations, getGuestSpaAppointments, SpaAppointmentResult } from '../../services/api';

type Booking = {
  id: string;
  guestEmail?: string;
  property: string;
  location: string;
  checkIn: string;
  checkOut: string;
  room?: { name: string };
  spa?: { name: string };
  total: number;
  adults?: number;
  children?: number;
};

const ROOM_RATES: Record<string, { name: string; price: number }> = {
  'Suite': { name: 'Sunset Ocean Suite', price: 58000 },
  'Private Pool Villa': { name: 'Private Pool Villa', price: 58000 },
  'Deluxe': { name: 'Beach Villa', price: 42000 },
  'Beach Villa': { name: 'Beach Villa', price: 42000 },
  'Standard': { name: 'Oceanfront Room', price: 25000 },
  'Oceanfront Room': { name: 'Oceanfront Room', price: 25000 },
  'Residence': { name: 'Ocean Residence', price: 85000 },
};

function calculatePriceAndSpa(
  checkInStr: string,
  checkOutStr: string,
  roomType: string | null | undefined,
  spaAppts: SpaAppointmentResult[],
  existingSpa?: string,
  existingTotal?: number
) {
  const dIn = parseDateString(checkInStr) || new Date();
  const dOut = parseDateString(checkOutStr) || new Date(dIn.getTime() + 86400000 * 4);
  const nights = Math.max(1, Math.round((dOut.getTime() - dIn.getTime()) / 86400000));

  const roomKey = roomType || 'Suite';
  const roomInfo = ROOM_RATES[roomKey] || { name: roomKey, price: 58000 };
  const roomTotal = roomInfo.price * nights;

  // Match spa appointment
  let spaName = existingSpa || '';
  if (!spaName && spaAppts.length > 0) {
    const matched = spaAppts.find((a) => a.service) || spaAppts[0];
    if (matched) spaName = matched.service;
  }

  const spaTotal = spaName ? 24000 : 0;
  const taxes = Math.round((roomTotal + spaTotal) * 0.18);
  const calculatedTotal = roomTotal + spaTotal + taxes;

  return {
    roomName: roomInfo.name,
    spaName: spaName || undefined,
    total: existingTotal && existingTotal > 1000 ? existingTotal : calculatedTotal,
  };
}

function parseDateString(dStr?: string): Date | null {
  if (!dStr) return null;
  // Handle DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = dStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  }
  const parsed = new Date(dStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function readBookings(username: string): Booking[] {
  const normalizedUser = (username || '').toLowerCase().trim();
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith('meridian_booking_'))
    .map((key) => {
      try {
        return JSON.parse(window.localStorage.getItem(key) || 'null') as Booking | null;
      } catch {
        return null;
      }
    })
    .filter((booking): booking is Booking => {
      if (!booking) return false;
      if (!booking.guestEmail) return true;
      const bEmail = booking.guestEmail.toLowerCase().trim();
      return bEmail === normalizedUser || bEmail === 'guest' || normalizedUser === 'guest' || normalizedUser.includes('guest');
    })
    .sort((left, right) => {
      const dLeft = parseDateString(left.checkIn)?.getTime() || 0;
      const dRight = parseDateString(right.checkIn)?.getTime() || 0;
      return dRight - dLeft;
    });
}

function BookingCard({ booking }: { booking: Booking; key?: React.Key }) {
  const adults = booking.adults ?? 1;
  const children = booking.children ?? 0;
  const totalMembers = adults + children;

  return <article className="my-stay-card">
    <span className="confirmation-id">{booking.id}</span>
    <h2>{booking.property}</h2>
    <p>{booking.location}</p>
    <div className="my-stay-grid">
      <div><span>Stay dates</span><strong>{booking.checkIn} → {booking.checkOut}</strong></div>
      <div><span>Guests / Members</span><strong>{adults} {adults === 1 ? 'Adult' : 'Adults'}{children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''} ({totalMembers} {totalMembers === 1 ? 'Member' : 'Members'})</strong></div>
      <div><span>Room</span><strong>{booking.room?.name || 'Room pending'}</strong></div>
      <div><span>Spa</span><strong>{booking.spa?.name || 'No experience selected'}</strong></div>
      <div><span>Total</span><strong>₹{booking.total.toLocaleString()}</strong></div>
    </div>
  </article>;
}

export default function MyStayPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const user = JSON.parse(window.sessionStorage.getItem('meridian_user') || '{}');
  const userEmail = user.email || user.username || 'guest';
  const [allBookings, setAllBookings] = useState<Booking[]>(() => readBookings(userEmail));

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getReservations(),
      getGuestSpaAppointments({ guest_email: userEmail }),
    ])
      .then(([rows, spaAppts]) => {
        if (!isMounted) return;
        const local = readBookings(userEmail);
        const map = new Map<string, Booking>();

        local.forEach((b) => {
          const details = calculatePriceAndSpa(
            b.checkIn,
            b.checkOut,
            b.room?.name,
            spaAppts,
            b.spa?.name,
            b.total
          );
          const enriched: Booking = {
            ...b,
            room: { name: b.room?.name || details.roomName },
            spa: details.spaName ? { name: details.spaName } : b.spa,
            total: details.total,
          };
          map.set(b.id, enriched);
          try {
            localStorage.setItem(`meridian_booking_${b.id}`, JSON.stringify(enriched));
          } catch {
            // ignore
          }
        });

        rows.forEach((r: any) => {
          const existing = map.get(r.id);
          const details = calculatePriceAndSpa(
            r.check_in,
            r.check_out,
            r.room_type,
            spaAppts,
            existing?.spa?.name,
            existing?.total
          );
          const enriched: Booking = {
            id: r.id,
            guestEmail: userEmail,
            property: r.property_name,
            location: r.property_name,
            checkIn: r.check_in,
            checkOut: r.check_out,
            room: { name: r.room_type || details.roomName },
            spa: details.spaName ? { name: details.spaName } : undefined,
            total: details.total,
            adults: r.adults ?? existing?.adults ?? 1,
            children: r.children ?? existing?.children ?? 0,
          };
          map.set(r.id, enriched);
          try {
            localStorage.setItem(`meridian_booking_${r.id}`, JSON.stringify(enriched));
          } catch {
            // ignore
          }
        });

        const merged = Array.from(map.values()).sort((left, right) => {
          const dLeft = parseDateString(left.checkIn)?.getTime() || 0;
          const dRight = parseDateString(right.checkIn)?.getTime() || 0;
          return dRight - dLeft;
        });
        setAllBookings(merged);
      })
      .catch(() => {
        // Fallback to localStorage bookings if API error occurs
      });
    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentBookings = allBookings.filter((booking) => {
    const co = parseDateString(booking.checkOut) || parseDateString(booking.checkIn);
    if (!co) return true;
    return co >= today;
  });

  const previousBookings = allBookings.filter((booking) => {
    const co = parseDateString(booking.checkOut) || parseDateString(booking.checkIn);
    if (!co) return false;
    return co < today;
  });

  return <main className="my-stay-page">
    <button className="my-stay-back" onClick={() => onNavigate('/guest')}>← Meridian Resorts &amp; Spas</button>
    <div className="my-stay-inner">
      <p className="guest-auth-eyebrow">Guest profile</p>
      <h1>{user.username || 'My Profile'}</h1>
      <p>Manage your Meridian stays and revisit previous journeys.</p>
      <section>
        <h2>Current bookings</h2>
        {currentBookings.length ? currentBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />) : <div className="my-stay-empty"><h2>No current bookings</h2><p>Plan your next Meridian stay and it will appear here.</p><button onClick={() => onNavigate('/booking')}>Plan Your Stay</button></div>}
      </section>
      <section>
        <h2>Previous bookings</h2>
        {previousBookings.length ? previousBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />) : <p>No previous bookings yet.</p>}
      </section>
      <button className="booking-secondary" onClick={() => onNavigate('/guest')}>Explore the resort</button>
    </div>
  </main>;
}
