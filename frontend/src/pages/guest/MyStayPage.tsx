import React from 'react';

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
};

function readBookings(username: string): Booking[] {
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith('meridian_booking_'))
    .map((key) => {
      try {
        return JSON.parse(window.localStorage.getItem(key) || 'null') as Booking | null;
      } catch {
        return null;
      }
    })
    .filter((booking): booking is Booking => Boolean(booking && (!booking.guestEmail || booking.guestEmail === username)))
    .sort((left, right) => right.checkIn.localeCompare(left.checkIn));
}

function BookingCard({ booking }: { booking: Booking }) {
  return <article className="my-stay-card">
    <span className="confirmation-id">{booking.id}</span>
    <h2>{booking.property}</h2>
    <p>{booking.location}</p>
    <div className="my-stay-grid">
      <div><span>Stay dates</span><strong>{booking.checkIn} → {booking.checkOut}</strong></div>
      <div><span>Room</span><strong>{booking.room?.name || 'Room pending'}</strong></div>
      <div><span>Spa</span><strong>{booking.spa?.name || 'No experience selected'}</strong></div>
      <div><span>Total</span><strong>₹{booking.total.toLocaleString()}</strong></div>
    </div>
  </article>;
}

export default function MyStayPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const user = JSON.parse(window.sessionStorage.getItem('meridian_user') || '{}');
  const bookings = readBookings(user.username || 'guest');
  const today = new Date().toISOString().slice(0, 10);
  const currentBookings = bookings.filter((booking) => booking.checkOut >= today);
  const previousBookings = bookings.filter((booking) => booking.checkOut < today);

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
