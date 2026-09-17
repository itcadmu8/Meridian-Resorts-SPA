/**
 * @file MeridianGuestHome.jsx
 * @description Page view component for MeridianGuestHome.
 */
import { useEffect, useState } from 'react'

import AiChatWidget from '../../components/ai/AiChatWidget'
import AiLauncher from '../../components/ai/AiLauncher'
import { useAuth } from '../../hooks/useAuth'

const properties = [
  { id: 'azure', name: 'Meridian Azure Coast', location: 'Mombasa, Kenya', code: 'AZC', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85', description: 'A barefoot-luxury beachfront retreat shaped by warm tides, private cabanas, and slow coastal mornings.', amenities: ['Private beach', 'Sunset dhow cruises', 'Ocean spa'] },
  { id: 'highland', name: 'Meridian Highland Retreat', location: 'Nanyuki, Kenya', code: 'HRT', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85', description: 'Forest-view lodges beneath Mount Kenya, built for crisp air, quiet walks, and unhurried afternoons.', amenities: ['Forest lodges', 'Mountain views', 'Fireplace dining'] },
  { id: 'city', name: 'Meridian City Gardens', location: 'Nairobi, Kenya', code: 'CTG', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85', description: 'A rooftop pool, skyline dining, and a calm garden address in the heart of the capital.', amenities: ['Rooftop pool', 'Skyline dining', 'Urban spa'] },
  { id: 'lake', name: 'Meridian Lakeview Lodge', location: 'Naivasha, Kenya', code: 'LWL', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', description: 'Wake to flamingos and still water from every terrace at our lakeside hideaway.', amenities: ['Lake terraces', 'Birding walks', 'Garden kitchen'] },
  { id: 'savannah', name: 'Meridian Savannah Reserve', location: 'Maasai Mara, Kenya', code: 'SVR', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85', description: 'Tented suites on the migration route, with a private plunge pool and expert guides.', amenities: ['Private plunge pools', 'Safari guides', 'Bush dinners'] },
  { id: 'coral', name: 'Meridian Coral Bay', location: 'Diani, Kenya', code: 'CRB', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', description: 'Reef-side snorkeling, palm-shaded villas, and sunset dhow cruises just beyond your room.', amenities: ['Reef snorkeling', 'Dhow cruises', 'Palm villas'] },
]

const treatments = [
  ['Deep Tissue Massage', 'Massage', '60 min', 'A restorative treatment for travel-tired muscles.'],
  ['Coastal Glow Facial', 'Facial', '75 min', 'A hydrating sun-recovery ritual using local botanicals.'],
  ['Hot Stone Therapy', 'Ritual', '90 min', 'Full-body warmth therapy, best after a long travel day.'],
]

export default function MeridianGuestHome({ onNavigate }) {
  const { user, isAuthenticated, username, logout } = useAuth()
  const [selectedProperty, setSelectedProperty] = useState(properties[0])
  const [isAiOpen, setIsAiOpen] = useState(() => window.localStorage.getItem('open_ai_after_login') === 'true')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if ((params.get('openAi') === '1' || window.localStorage.getItem('open_ai_after_login') === 'true') && isAuthenticated) {
      setIsAiOpen(true)
      window.localStorage.removeItem('open_ai_after_login')
    }
  }, [isAuthenticated])

  function handleAiClick() {
    if (!isAuthenticated || user?.role !== 'GUEST') {
      window.localStorage.setItem('open_ai_after_login', 'true')
      onNavigate('/guest/login?redirect=/guest&openAi=1')
      return
    }
    setIsAiOpen((open) => !open)
  }

  return <div className="luxury-guest-page">
    <header className="luxury-header"><button className="luxury-brand" type="button" onClick={() => onNavigate('/')}><span>M</span><strong>MERIDIAN<small>RESORTS &amp; SPA</small></strong></button><nav><a href="#luxury-properties">Our 6 Properties</a><a href="#luxury-spa">Spa Sanctuary</a><a href="#luxury-dining">Gastronomy</a><a href="#luxury-experiences">Experiences</a></nav><div className="luxury-header-actions">{isAuthenticated && user?.role === 'GUEST' ? <div className="guest-identity"><span>{(username || 'G').slice(0, 1).toUpperCase()}</span><b>{username}</b><button type="button" onClick={logout}>Sign out</button></div> : <button type="button" onClick={() => onNavigate('/guest/login')}>Guest Login</button>}<button className="staff-link" type="button" onClick={() => onNavigate(user?.role === 'STAFF' ? '/staff/dashboard' : '/staff/login')}>Staff Portal ↗</button></div></header>

    <section className="luxury-hero"><img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85" alt="Meridian resort pool and spa" /><div className="luxury-hero-shade" /><div className="luxury-hero-content"><span className="luxury-eyebrow">6 world-class luxury destinations</span><h1>Quiet elegance across oceans, lakes &amp; peaks.</h1><p>From overwater private villas to neoclassical alpine sanctuaries. Experience bespoke wellness, remarkable gastronomy, and attentive personal concierge care.</p><div><button className="primary-luxury-action" type="button" onClick={handleAiClick}>◌ &nbsp; Ask Meridian AI Concierge</button><a className="secondary-luxury-action" href="#luxury-properties">Explore Properties</a></div></div></section>

    <section id="luxury-properties" className="luxury-section properties-section"><header className="luxury-section-heading"><div><span className="luxury-eyebrow dark">Portfolio</span><h2>Our six signature resorts</h2><p>Select a resort to preview its bespoke amenities, architecture, and dining offerings.</p></div><div className="property-pills">{properties.map((property) => <button type="button" key={property.id} className={selectedProperty.id === property.id ? 'active' : ''} onClick={() => setSelectedProperty(property)}>{property.name.replace('Meridian ', '')}</button>)}</div></header><article className="property-spotlight"><div className="spotlight-image"><img src={selectedProperty.image} alt={selectedProperty.name} /><span>{selectedProperty.location}</span></div><div className="spotlight-copy"><div><span className="luxury-eyebrow dark">{selectedProperty.code} · Full resort amenities</span><h3>{selectedProperty.name}</h3><p>{selectedProperty.description}</p><h4>Featured highlights</h4><div className="amenity-list">{selectedProperty.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}</div></div><footer><button type="button" onClick={handleAiClick}>Book spa or inquire with AI →</button><small>● PMS live connected</small></footer></div></article></section>

    <section id="luxury-spa" className="luxury-section spa-section"><div className="centered-section-heading"><span className="luxury-eyebrow dark">Holistic sanctuary</span><h2>Signature spa treatments</h2><p>Crafted botanical remedies, hot stone therapies, and tailored facials delivered by master therapists.</p></div><div className="treatment-grid">{treatments.map(([name, category, duration, description]) => <article className="treatment-card" key={name}><header><span>{category}</span><strong>{duration}</strong></header><h3>{name}</h3><p>{description}</p><footer><small>Available chain-wide</small><button type="button" onClick={handleAiClick}>Reserve with AI →</button></footer></article>)}</div></section>

    <section id="luxury-dining" className="luxury-section dining-section"><div><span className="luxury-eyebrow dark">Gastronomy</span><h2>Every table tells a story.</h2><p>From reef-side lunches to fireside tasting menus, our kitchens follow the character of every property. Ask Meridian AI about tonight&rsquo;s dining hours, signature dishes, and the right table for your stay.</p><button type="button" onClick={handleAiClick}>Ask about tonight →</button></div><div className="dining-stat"><strong>24/7</strong><span>in-room dining<br />across the collection</span></div></section>

    <section id="luxury-experiences" className="experience-strip"><span>Meridian experiences</span><strong>Stay a little longer. Remember it forever.</strong><span>Six properties · one considered welcome</span></section>
    <footer className="luxury-footer"><strong>MERIDIAN <small>RESORTS &amp; SPA</small></strong><span>Multi-property hospitality, thoughtfully connected.</span><div><button type="button" onClick={() => onNavigate('/staff/login')}>Staff Portal Login</button><button type="button" onClick={() => onNavigate('/guest/login')}>Guest Account</button></div></footer>
    {!isAiOpen && <AiLauncher onClick={handleAiClick} />}{isAiOpen && <AiChatWidget onClose={() => setIsAiOpen(false)} />}
  </div>
}