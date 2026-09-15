import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { RESORTS } from '../../guest-experience/data/resorts';
import { SPA_EXPERIENCES } from '../../guest-experience/data/spa';

const rooms = [
  { id: 'ocean-room', name: 'Oceanfront Room', description: 'King bed, ocean view, private balcony.', occupancy: 2, price: 25000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80' },
  { id: 'beach-villa', name: 'Beach Villa', description: 'King bed, direct beach access, private terrace.', occupancy: 3, price: 42000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' },
  { id: 'pool-villa', name: 'Private Pool Villa', description: 'Private pool, ocean view, butler service.', occupancy: 3, price: 58000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80' },
  { id: 'residence', name: 'Ocean Residence', description: 'Multiple rooms, private pool, premium ocean view.', occupancy: 4, price: 85000, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80' },
];

const steps = ['Stay', 'Room', 'Spa & Experiences', 'Preferences', 'Review'];
const addDays = (date: string, amount: number) => { const next = new Date(`${date}T00:00:00`); next.setDate(next.getDate() + amount); return next.toISOString().slice(0, 10); };
const nightsBetween = (start: string, end: string) => Math.max(0, Math.round((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000));

export default function BookingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState(0);
  const [propertyId, setPropertyId] = useState(RESORTS[0].id);
  const [checkIn, setCheckIn] = useState(addDays(today, 1));
  const [checkOut, setCheckOut] = useState(addDays(today, 5));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [spaId, setSpaId] = useState('');
  const [spaDate, setSpaDate] = useState('');
  const [spaTime, setSpaTime] = useState('04:00 PM');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const property = RESORTS.find((item) => item.id === propertyId) || RESORTS[0];
  const room = rooms.find((item) => item.id === roomId) || rooms[0];
  const spa = SPA_EXPERIENCES.find((item) => item.id === spaId);
  const nights = nightsBetween(checkIn, checkOut);
  const roomTotal = room.price * nights;
  const spaTotal = spa ? spa.price : 0;
  const taxes = Math.round((roomTotal + spaTotal) * 0.18);
  const total = roomTotal + spaTotal + taxes;

  const togglePreference = (item: string) => setPreferences((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const next = () => { setError(''); if (step === 0 && (!checkIn || !checkOut || nights < 1)) return setError('Choose a valid stay with checkout after check-in.'); if (step === 1 && !roomId) return setError('Select a room to continue.'); setStep((current) => Math.min(4, current + 1)); };
  const confirm = () => { const id = `MRD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`; const booking = { id, guestEmail: JSON.parse(localStorage.getItem('meridian_user') || '{}').username || 'guest', property: property.name, location: property.location, checkIn, checkOut, nights, adults, children, room, spa, spaDate, spaTime, preferences, notes, total }; localStorage.setItem(`meridian_booking_${id}`, JSON.stringify(booking)); localStorage.setItem('meridian_latest_booking', JSON.stringify(booking)); onNavigate(`/booking/confirmation/${id}`); };

  return <main className="booking-page"><header className="booking-page-header"><button type="button" onClick={() => onNavigate('/guest')}>MERIDIAN <small>RESORTS &amp; SPAS</small></button><span>Plan Your Meridian Escape</span></header><div className="booking-page-inner"><div className="booking-intro"><p>Reservation planning</p><h1>Plan Your Meridian Escape</h1><span>Choose your destination, stay, experiences and preferences. We&apos;ll take care of the rest.</span></div><div className="booking-progress">{steps.map((label, index) => <div className={index <= step ? 'active' : ''} key={label}><i>{index < step ? <Check size={14} /> : index + 1}</i><span>{label}</span></div>)}</div><section className="booking-card">
    {step === 0 && <div className="booking-step"><h2>Choose your stay</h2><div className="booking-form-grid"><label>Property<select value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>{RESORTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><small>{property.location}</small></label><label>Check-in<input min={today} type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label><label>Check-out<input min={checkIn} type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label></div><div className="guest-steppers"><Stepper label="Adults" value={adults} min={1} onChange={setAdults} /><Stepper label="Children" value={children} min={0} onChange={setChildren} /></div><div className="night-summary">{nights} nights · {adults} adults · {children} children</div></div>}
    {step === 1 && <div className="booking-step"><h2>Select your room</h2><div className="room-selection-grid">{rooms.map((item) => <button type="button" className={`room-selection-card ${roomId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setRoomId(item.id)}><img src={item.image} alt={item.name} /><span><strong>{item.name}</strong><small>{item.description}</small><em>₹{item.price.toLocaleString()} / night</em></span></button>)}</div></div>}
    {step === 2 && <div className="booking-step"><h2>Enhance Your Stay</h2><p className="booking-muted">Add a spa experience or skip for now.</p><div className="spa-selection-grid">{SPA_EXPERIENCES.slice(0, 6).map((item) => <button type="button" className={`spa-selection-card ${spaId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setSpaId(spaId === item.id ? '' : item.id)}><strong>{item.name}</strong><small>{item.duration} · ₹{item.price}</small><span>{item.description}</span></button>)}</div>{spa && <div className="spa-time-fields"><label>Date<input type="date" min={checkIn} max={checkOut} value={spaDate} onChange={(e) => setSpaDate(e.target.value)} /></label><label>Preferred time<select value={spaTime} onChange={(e) => setSpaTime(e.target.value)}><option>08:00 AM</option><option>10:00 AM</option><option>02:00 PM</option><option>04:00 PM</option><option>06:00 PM</option></select></label></div>}<button type="button" className="booking-skip" onClick={() => { setSpaId(''); setStep(3); }}>Skip for now</button></div>}
    {step === 3 && <div className="booking-step"><h2>Make Your Stay Yours</h2><p className="booking-muted">Tell us what would make your stay more comfortable.</p><PreferenceGroup title="Room preferences" items={['Ocean view', 'Garden view', 'High floor', 'Quiet area', 'Near pool', 'Away from elevator']} selected={preferences} onToggle={togglePreference} /><PreferenceGroup title="Dining preferences" items={['Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'No preference']} selected={preferences} onToggle={togglePreference} /><PreferenceGroup title="Wellness preferences" items={['Relaxation', 'Fitness', 'Ayurveda', 'Recovery', 'Mindfulness']} selected={preferences} onToggle={togglePreference} /><label className="booking-notes">Additional requests<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us anything that would make your stay more comfortable..." /></label></div>}
    {step === 4 && <div className="booking-step"><h2>Review your reservation</h2><div className="review-grid"><Review label="Property" value={`${property.name} · ${property.location}`} /><Review label="Stay" value={`${checkIn} → ${checkOut} · ${nights} nights`} /><Review label="Guests" value={`${adults} adults · ${children} children`} /><Review label="Room" value={`${room.name} · ₹${room.price.toLocaleString()}/night`} /><Review label="Spa" value={spa ? `${spa.name} · ${spaDate || 'Date to be selected'} · ${spaTime}` : 'No spa experience selected'} /><Review label="Preferences" value={preferences.length ? preferences.join(', ') : 'No preferences selected'} /></div><div className="booking-total"><span>Estimated total</span><strong>₹{total.toLocaleString()}</strong><small>Includes estimated taxes and fees</small></div></div>}
    {error && <p className="booking-error">{error}</p>}<div className="booking-actions">{step > 0 && <button type="button" className="booking-secondary" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={16} /> Back</button>}{step < 4 ? <button type="button" className="booking-primary" onClick={next}>Continue <ChevronRight size={16} /></button> : <button type="button" className="booking-primary" onClick={confirm}>Confirm Reservation</button>}</div>
  </section></div></main>;
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (value: number) => void }) { return <div className="booking-stepper"><span>{label}</span><div><button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button><strong>{value}</strong><button type="button" onClick={() => onChange(value + 1)}>+</button></div></div>; }
function PreferenceGroup({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (value: string) => void }) { return <fieldset className="preference-group"><legend>{title}</legend><div>{items.map((item) => <button type="button" className={selected.includes(item) ? 'selected' : ''} key={item} onClick={() => onToggle(item)}>{item}</button>)}</div></fieldset>; }
function Review({ label, value }: { label: string; value: string }) { return <div className="review-item"><span>{label}</span><strong>{value}</strong></div>; }
