/**
 * @file resorts.ts
 * @description Mock data and static configuration for resorts.
 */
import { Resort } from '../types';

export const RESORTS: Resort[] = [
  {
    id: 'azure-cove',
    name: 'Meridian Azure Cove',
    tagline: 'Private Island Solitude & Luminous Atolls',
    location: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    description: 'An exclusive private atoll fringed by crystalline turquoise lagoons, soft powdery sands, and overwater sanctuaries designed for pure stillness.',
    startingRate: 1450,
    startingCategory: 'Lagoon Water Villa',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '29°C Tropical Ocean Breeze',
    transferType: '30-minute Luxury Seaplane',
    features: ['Overwater Hammocks', 'House Coral Reef', 'Starlight Cinema', 'Underwater Wine Cellar'],
    vibe: 'Secluded Luxury & Marine Wonder'
  },
  {
    id: 'palm-bay',
    name: 'Meridian Palm Bay',
    tagline: 'Portuguese Heritage Meets Arabian Sea Serenity',
    location: 'South Goa Coastline, India',
    country: 'India',
    description: 'Tucked beneath ancient swaying coconut groves and untouched golden sand dunes, offering sun-drenched verandas and coastal culinary warmth.',
    startingRate: 780,
    startingCategory: 'Heritage Palm Suite',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '28°C Coastal Sunset Calm',
    transferType: 'Private Chauffeur (45 min from Dabolim / Mopa)',
    features: ['Portuguese Verandas', 'Spice Garden Spa', 'Sunset Cliffside Bar', 'Direct Beachfront Lawn'],
    vibe: 'Colonial Elegance & Coastal Bliss'
  },
  {
    id: 'coral-sands',
    name: 'Meridian Coral Sands',
    tagline: 'Untamed Archipelago Luxury & Virgin Beaches',
    location: 'Havelock Island, Andaman & Nicobar',
    country: 'India',
    description: 'An untouched maritime Eden where ancient rainforest canopies kiss sapphire seas and phosphorescent evening waters illuminate private beachfront villas.',
    startingRate: 920,
    startingCategory: 'Beachfront Timber Pavilion',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '27°C Maritime Tropics',
    transferType: 'Speed Catamaran & Private Escort',
    features: ['Bioluminescent Night Kayaking', 'Private Reef Safari', 'Teak Wood Architecture', 'PADI Master Diving'],
    vibe: 'Untouched Island Frontier'
  },
  {
    id: 'ocean-pearl',
    name: 'Meridian Ocean Pearl',
    tagline: 'Southern Sri Lankan Shoreline & Ceylon Heritage',
    location: 'Tangalle Coastal Headland, Sri Lanka',
    country: 'Sri Lanka',
    description: 'Perched along a dramatic cliffside flanked by secluded golden coves, cinnamon groves, and rolling Indian Ocean surf.',
    startingRate: 860,
    startingCategory: 'Cliffside Ocean Suite',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '28°C Gentle Sea Mists',
    transferType: 'Helicopter Transfer or Luxury Chauffeur',
    features: ['Cliff-edge 50m Infinity Pool', 'Ceylon Tea Lounge', 'Turtle Sanctuary Access', 'Ayurvedic Herb Garden'],
    vibe: 'Poetic Horizon & Restorative Rhythms'
  },
  {
    id: 'rainforest-sanctuary',
    name: 'Meridian Rainforest Sanctuary',
    tagline: 'Vibrant Backwaters & Canopy Wellness Hideaway',
    location: 'Kumarakom Backwaters & Western Ghats, Kerala',
    country: 'India',
    description: 'Where emerald water channels meet mystical mist-clad canopies. Built using reclaimed teak and traditional nalukettu architecture, focused on authentic Ayurvedic healing.',
    startingRate: 810,
    startingCategory: 'Canopy Garden Pavilion',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '26°C Lush Tropical Freshness',
    transferType: 'Solar Powered Wooden Riverboat',
    features: ['Authentic Vaidya Doctor Consultations', 'Lotus Meditation Lake', 'Backwater Houseboat Escapes', 'Organic Farm-to-Table'],
    vibe: 'Deep Ayurvedic Healing & Greenery'
  },
  {
    id: 'sunset-cliffs',
    name: 'Meridian Sunset Cliffs',
    tagline: 'Dramatic Limestone Perch & Spiritual Horizon',
    location: 'Uluwatu Cliffs, Bali',
    country: 'Indonesia',
    description: 'Hovering 100 meters above azure Indian Ocean swells with open-air pavilions, infinity plunge pools, and uninterrupted 180-degree sunset vistas.',
    startingRate: 1120,
    startingCategory: 'Cliffside Oceanview Villa',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
    ],
    climate: '30°C Golden Hour Warmth',
    transferType: 'Private Executive Helicopter or Maybach',
    features: ['Cantilevered Cliff Sunset Bar', 'Balinese Fire Blessing Pavilion', 'Private Funicular to Beach', 'Personal Stargazing Telescope'],
    vibe: 'High-Altitude Coastal Drama'
  }
];
