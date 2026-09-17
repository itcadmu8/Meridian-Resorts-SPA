/**
 * @file GuestLanding.tsx
 * @description Page view component for GuestLanding.
 */
import React, { useState } from 'react';
import { ChatWidget } from '../../components/ChatWidget';

const properties = [
  { name: 'Azure Coast', location: 'Mombasa, Kenya', image: 'C', description: 'A barefoot-luxury beachfront retreat shaped by warm tides, private cabanas, and slow coastal mornings.', amenities: ['Private beach', 'Sunset dhow cruises', 'Ocean spa'] },
  { name: 'Highland Retreat', location: 'Nanyuki, Kenya', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85', description: 'Forest-view lodges beneath Mount Kenya, built for crisp air, quiet walks, and unhurried afternoons.', amenities: ['Forest lodges', 'Mountain views', 'Fireplace dining'] },
  { name: 'City Gardens', location: 'Nairobi, Kenya', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85', description: 'A rooftop pool, skyline dining, and a calm garden address in the heart of the capital.', amenities: ['Rooftop pool', 'Skyline dining', 'Urban spa'] },
];

export default function GuestLanding() {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <div className="guest-landing">
      <header className="guest-header">
        <a className="guest-brand" href="/guest">MERIDIAN <small>RESORTS &amp; SPA</small></a>
        <nav aria-label="Guest navigation">
          <a href="#guest-properties">Properties</a>
          <a href="#guest-spa">Spa Sanctuary</a>
          <a href="#guest-dining">Gastronomy</a>
        </nav>
        <a className="guest-staff-link" href="/">Operations view</a>
      </header>

      <section className="guest-hero">
        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85" alt="Meridian resort pool and spa" />
        <div className="guest-hero-shade" />
        <div className="guest-hero-content">
          <span className="guest-eyebrow">Six world-class luxury destinations</span>
          <h1>Quiet elegance across oceans, lakes and peaks.</h1>
          <p>Experience bespoke wellness, remarkable gastronomy, and attentive personal concierge care.</p>
          <a className="guest-primary-action" href="#guest-properties">Explore the collection</a>
        </div>
      </section>

      <section id="guest-properties" className="guest-section">
        <div className="guest-section-heading"><span className="guest-eyebrow guest-dark">The collection</span><h2>Find your Meridian</h2><p>Select a destination to preview its character and signature amenities.</p></div>
        <div className="guest-property-pills">{properties.map((property) => <button type="button" className={selectedProperty.name === property.name ? 'active' : ''} key={property.name} onClick={() => setSelectedProperty(property)}>{property.name}</button>)}</div>
        <article className="guest-property-spotlight"><img src={selectedProperty.image} alt={selectedProperty.name} /><div><span className="guest-eyebrow guest-dark">{selectedProperty.location}</span><h3>Meridian {selectedProperty.name}</h3><p>{selectedProperty.description}</p><div className="guest-amenities">{selectedProperty.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}</div></div></article>
      </section>

      <section id="guest-spa" className="guest-section guest-spa"><span className="guest-eyebrow guest-dark">Holistic sanctuary</span><h2>Signature spa treatments</h2><p>Crafted botanical remedies, hot stone therapies, and tailored facials delivered by master therapists.</p></section>
      <section id="guest-dining" className="guest-section guest-dining"><div><span className="guest-eyebrow guest-dark">Gastronomy</span><h2>Every table tells a story.</h2><p>From reef-side lunches to fireside tasting menus, our kitchens follow the character of every property.</p></div><strong>24/7<small> in-room dining across the collection</small></strong></section>
      <footer className="guest-footer"><strong>MERIDIAN <small>RESORTS &amp; SPA</small></strong><span>Multi-property hospitality, thoughtfully connected.</span></footer>
      <ChatWidget />
    </div>
  );
}
