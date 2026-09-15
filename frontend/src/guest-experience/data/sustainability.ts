import { Testimonial, GuestService, SustainabilityPillar } from '../types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    guestName: 'Eleanor & Julian Vance-Cross',
    location: 'London, United Kingdom',
    resortVisited: 'Meridian Azure Cove, Maldives',
    rating: 5,
    quote: 'Every detail felt completely effortless. From the moment our seaplane docked, our private Thakuru anticipated every whisper of a wish. The overwater sunset pool villa was beyond architectural perfection.',
    stayDate: 'Visited November 2025',
    roomType: 'Overwater Sunset Pool Villa'
  },
  {
    id: 'test-2',
    guestName: 'Dr. Alistair Sterling',
    location: 'Zurich, Switzerland',
    resortVisited: 'Meridian Rainforest Sanctuary, Kerala',
    rating: 5,
    quote: 'As someone who lives an intense clinical schedule, the 7-day Ayurvedic Renewal reset my soul. The consultation with the Vaidya, the herbal steam rituals, and the silent backwater dawn canoe trips gave me back my peace.',
    stayDate: 'Visited January 2026',
    roomType: 'Canopy Garden Pavilion'
  },
  {
    id: 'test-3',
    guestName: 'Sophia & Matteo Rossi',
    location: 'Milan, Italy',
    resortVisited: 'Meridian Sunset Cliffs, Bali',
    rating: 5,
    quote: 'The cliffside private starlight dinner arranged by the concierge team was the most magical romantic evening of our lives. The cuisine at Ember and Tide matches any three-star establishment in Europe.',
    stayDate: 'Visited February 2026',
    roomType: 'The Grand Ocean Residence'
  },
  {
    id: 'test-4',
    guestName: 'The Harrison Family',
    location: 'Sydney, Australia',
    resortVisited: 'Meridian Coral Sands, Andaman Islands',
    rating: 5,
    quote: 'Finding a luxury resort that delights both parents seeking deep spa relaxation and young children fascinated by marine biology is rare. Meridian achieved it with effortless warmth and poise.',
    stayDate: 'Visited March 2026',
    roomType: 'Secluded Palm Beach Villa'
  },
  {
    id: 'test-5',
    guestName: 'Kavita & Arvind Mehra',
    location: 'Mumbai, India',
    resortVisited: 'Meridian Palm Bay, Goa',
    rating: 5,
    quote: 'A haven of subtle sophistication. The heritage Portuguese verandas, the sound of the Arabian Sea, and dinner at Saffron made our 20th anniversary deeply memorable. We have already reserved our return.',
    stayDate: 'Visited April 2026',
    roomType: 'Azure Horizon Suite'
  }
];

export const GUEST_SERVICES: GuestService[] = [
  {
    id: 'srv-airport',
    name: 'Bespoke Airport Transfers',
    category: 'Arrival & Departure',
    description: 'Private luxury seaplane charters, twin-engine helicopter transfers, or air-conditioned executive Mercedes/Maybach with VIP terminal escort.',
    iconName: 'Plane',
    availableHours: '24/7 on reservation',
    highlight: 'Curated cold towels, champagne, and luggage seamless check-through'
  },
  {
    id: 'srv-concierge',
    name: 'Les Clefs d’Or Concierge',
    category: 'Personalized Planning',
    description: 'Dedicated certified international concierges catering to bespoke private aviation, rare vintage sourcing, private islands, and customized itineraries.',
    iconName: 'Compass',
    availableHours: '24 Hours Daily',
    highlight: 'Access to off-limits natural reserves and closed-door cultural treasures'
  },
  {
    id: 'srv-butler',
    name: 'Dedicated Private Butler (Thakuru)',
    category: 'In-Villa Living',
    description: 'Trained to the highest British Butler Guild standards. Packing/unpacking, bath drawn to temperature with sea salts, in-villa dining service, and effortless coordination.',
    iconName: 'Sparkles',
    availableHours: '24 Hours Dedicated',
    highlight: 'Direct one-touch messaging on your guest mobile app'
  },
  {
    id: 'srv-housekeeping',
    name: 'Twice-Daily Artisanal Housekeeping',
    category: 'Comfort & Sanity',
    description: 'Meticulous morning service and evening turndown with aromatherapy pillow mists, organic island chocolates, and custom sleep temperature settings.',
    iconName: 'Home',
    availableHours: '07:00 - 23:00',
    highlight: 'Pillow menu featuring 8 orthopedic, down, and silk configurations'
  },
  {
    id: 'srv-laundry',
    name: 'Same-Day Eco Laundry & Pressing',
    category: 'Care',
    description: 'Gentle organic biodegradable garment care with complimentary unpacking pressing for all arrival suites and villas.',
    iconName: 'Shirt',
    availableHours: 'Same-day turnaround',
    highlight: 'Non-toxic, chemical-free marine safe gentle detergents'
  },
  {
    id: 'srv-dining',
    name: '24-Hour In-Villa Fine Dining',
    category: 'Culinary',
    description: 'Restaurant-quality gastronomic menus delivered on warm porcelain and linen or set up as a private barefoot poolside feast.',
    iconName: 'Utensils',
    availableHours: '24 Hours',
    highlight: 'Freshly baked pastries and cold-pressed juices delivered at dawn'
  },
  {
    id: 'srv-reservations',
    name: 'Priority Table & Spa Reservations',
    category: 'Planning',
    description: 'Guaranteed best table locations at Tide, Ember, and Saffron with personalized sommelier pairings and preferential spa treatment times.',
    iconName: 'CalendarCheck',
    availableHours: 'Instant via My Stay',
    highlight: 'Sunset-timed guaranteed prime water’s-edge seating'
  },
  {
    id: 'srv-excursions',
    name: 'Private Excursion Architecture',
    category: 'Adventure',
    description: 'Custom marine charters, private island escapes, helicopter sunset tours, and curated archaeological treks led by accredited scholars.',
    iconName: 'Anchor',
    availableHours: '07:00 - 20:00',
    highlight: 'Personal marine biologist and private onboard chef accompaniment'
  },
  {
    id: 'srv-transport',
    name: 'Chauffeured Luxury Fleet & Buggies',
    category: 'Mobility',
    description: 'Electric silent resort buggies at your beck and call, and private luxury off-resort SUVs for island exploration.',
    iconName: 'Car',
    availableHours: 'On-demand 24/7',
    highlight: '100% zero-emission solar-charged resort transport'
  },
  {
    id: 'srv-occasions',
    name: 'Special Celebrations & Milestones',
    category: 'Memories',
    description: 'Proposals, anniversary beach setups, vow renewals, and private celebrations planned down to the musical accompaniment and fireworks permissions.',
    iconName: 'Gift',
    availableHours: 'Dedicated celebration planner',
    highlight: 'Custom floral arrangements flown in from premier coastal growers'
  },
  {
    id: 'srv-family',
    name: 'Young Voyagers & Family Care',
    category: 'Family Care',
    description: 'Certified multilingual nannies, baby equipment rentals, coral biology junior workshops, and family movie nights under the palms.',
    iconName: 'Users',
    availableHours: '08:00 - 22:00',
    highlight: 'Complimentary organic baby food prepared fresh by our chefs'
  }
];

export const SUSTAINABILITY_PILLARS: SustainabilityPillar[] = [
  {
    id: 'ocean-conservation',
    title: 'Ocean & Coral Reef Conservation',
    description: 'Over 4,500 coral fragments successfully cultivated in our marine biology nursery and transplanted to restore surrounding barrier reefs.',
    stat: '4,500+',
    statLabel: 'Corals Planted & Monitored',
    iconName: 'Waves'
  },
  {
    id: 'plastic-free',
    title: 'Zero Single-Use Plastics',
    description: 'All resorts operate on-site glass bottling desalination plants, eradicating over 850,000 plastic water bottles per property annually.',
    stat: '100%',
    statLabel: 'Elimination of Single-Use Plastics',
    iconName: 'ShieldCheck'
  },
  {
    id: 'renewable-energy',
    title: 'Solar Microgrids & Clean Power',
    description: 'Our island properties generate upwards of 68% of their electrical power through silent floating solar photovoltaic arrays and battery storage.',
    stat: '68%',
    statLabel: 'Clean Solar Energy Generated',
    iconName: 'Sun'
  },
  {
    id: 'community-sourcing',
    title: 'Indigenous Community & Local Sourcing',
    description: 'We source 84% of all kitchen produce, wild catch, artisanal timber, and fabrics from local coastal families, cooperatives, and organic micro-farms.',
    stat: '84%',
    statLabel: 'Locally Sourced Produce & Materials',
    iconName: 'HeartHandshake'
  }
];
