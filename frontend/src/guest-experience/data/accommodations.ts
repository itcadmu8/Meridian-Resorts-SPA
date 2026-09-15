import { Accommodation } from '../types';

export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'oceanfront-rooms',
    name: 'Azure Horizon Suite',
    category: 'Oceanfront Rooms',
    description: 'Expansive ocean-facing sanctuary with full-height sliding glass doors opening onto an expansive teak timber terrace suspended above white sands.',
    capacity: '2 Adults, 1 Child',
    bedConfig: '1 King Bed or 2 Twin Beds',
    view: 'Unobstructed 180° Turquoise Lagoon View',
    size: '115 sq.m / 1,237 sq.ft',
    pricePerNight: 850,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: [
      'Ocean views',
      'Private sunset terrace',
      'Butler service',
      'Complimentary champagne breakfast',
      'High-speed Wi-Fi 6',
      'Smart environmental controls',
      'Acqua di Parma luxury bath amenities',
      'Freestanding stone soaking tub',
      '24-Hour in-room dining'
    ],
    highlight: 'Direct steps to the shoreline with dedicated sunset daybed'
  },
  {
    id: 'beach-villas',
    name: 'Secluded Palm Beach Villa',
    category: 'Beach Villas',
    description: 'Nestled discretely beneath tropical palms and pandanus greenery, providing direct barefoot sand access, private outdoor rainforest shower, and sheltered sala.',
    capacity: '3 Adults or 2 Adults + 2 Children',
    bedConfig: '1 Master King + Daybed Sala',
    view: 'Lush Tropical Garden leading to Private Beach',
    size: '175 sq.m / 1,883 sq.ft',
    pricePerNight: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: [
      'Private beach path',
      'Outdoor garden rain shower',
      'Dedicated Thakuru (Butler)',
      'Complimentary gourmet breakfast',
      'High-speed Wi-Fi',
      'Smart iPad room controls',
      'Artisanal organic bath remedies',
      'Private shaded beach cabana',
      'Curated wine and digestif bar'
    ],
    highlight: 'Absolute privacy surrounded by native flora with private beach footprint'
  },
  {
    id: 'private-pool-villas',
    name: 'Overwater Sunset Pool Villa',
    category: 'Private Pool Villas',
    description: 'Suspended over turquoise waters with a private 12-meter glass-fronted infinity plunge pool, catamaran overwater netting, and direct lagoon ladder descent.',
    capacity: '2 Adults',
    bedConfig: 'Custom Handcrafted California King',
    view: 'Endless Sunset Ocean Horizon',
    size: '220 sq.m / 2,368 sq.ft',
    pricePerNight: 1750,
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: [
      '12m Private infinity pool',
      'Lagoon swimming access ladder',
      '24/7 Dedicated Butler service',
      'Floating breakfast experience',
      'High-speed Wi-Fi',
      'Lutron smart lighting & climate',
      'Le Labo Santal 33 amenities',
      'Overwater hammock netting',
      'Starlight telescope terrace'
    ],
    highlight: 'Direct descent into the house coral garden & nightly sunset view'
  },
  {
    id: 'ocean-residences',
    name: 'The Grand Ocean Residence',
    category: 'Ocean Residences',
    description: 'A multi-level architectural triumph featuring two lavish master suites, expansive double-height living pavilion, sunken outdoor firepit, and 20m lap pool.',
    capacity: '6 Guests (4 Adults, 2 Children)',
    bedConfig: '2 Master King Suites + 1 Twin Suite',
    view: 'Panoramic Dual-Aspect Lagoon & Open Ocean',
    size: '480 sq.m / 5,166 sq.ft',
    pricePerNight: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: [
      '20m Private infinity lap pool',
      'Sunken firepit lounge',
      'Dual full-time butlers & private chef',
      'In-residence spa treatment room',
      'Sonos architectural sound',
      'Custom wine cellar and humidor',
      'Private golf buggy at disposal',
      'Bulgari bathroom collections',
      'Full designer kitchen'
    ],
    highlight: 'Two dedicated private butlers and a private chef on demand'
  },
  {
    id: 'presidential-villas',
    name: 'The Meridian Royal Sanctuary',
    category: 'Presidential Villas',
    description: 'The pinnacle of private coastal luxury. Occupying its own secluded peninsula with 4 master suites, private beach, Olympic-length pool, helipad access, and private spa pavilion.',
    capacity: '8 Adults + 4 Children',
    bedConfig: '4 Master En-Suites with King Beds',
    view: 'Private Island Peninsula & 360° Ocean Panoramas',
    size: '950 sq.m / 10,225 sq.ft',
    pricePerNight: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    ],
    amenities: [
      'Private 25m Olympic infinity pool',
      'Secluded 150m private sandy beach',
      'Dedicated 24/7 team of 4 (Chef, 2 Butlers, Chauffeur)',
      'Private wellness spa suite & sauna',
      'Private luxury yacht charter credit',
      'Secured gated estate boundary',
      'Bespoke culinary menus curated by Executive Chef',
      'Private cinema room and games lounge',
      'Hermès bath and body collections'
    ],
    highlight: 'Complete privacy with its own peninsula, private yacht tender, and dedicated team'
  }
];
