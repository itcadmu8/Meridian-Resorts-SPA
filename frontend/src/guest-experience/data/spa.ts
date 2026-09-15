import { SpaExperience, WellnessFacility } from '../types';

export const SPA_EXPERIENCES: SpaExperience[] = [
  {
    id: 'meridian-massage',
    name: 'Signature Meridian Massage',
    duration: '90 Minutes',
    category: 'Rituals',
    price: 260,
    description: 'A rhythmic, full-body therapy fusing long oceanic strokes with warm coastal coconut oil and aromatic island vetiver, releasing tension along meridian energy pathways.',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Cold-pressed virgin coconut oil, wild vetiver, frangipani blossoms'
  },
  {
    id: 'ocean-stone-ritual',
    name: 'Ocean Stone Ritual',
    duration: '105 Minutes',
    category: 'Body',
    price: 295,
    description: 'Smooth volcanic basalt stones heated in aromatic sea salt water gently glide along tension lines, paired with chilled marble stones for lymphatic drainage.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Mineral sea salt, heated volcanic river stones, sandalwood elixir'
  },
  {
    id: 'ayurvedic-renewal',
    name: 'Ayurvedic Renewal (Abhyanga & Shirodhara)',
    duration: '120 Minutes',
    category: 'Ayurveda',
    price: 340,
    description: 'An ancient dosha-balancing ritual beginning with warm herb-infused herbal oil synchronized body strokes, followed by continuous warm oil stream poured over the third eye.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Organic sesame oil infused with 24 Himalayan healing herbs and brahmi'
  },
  {
    id: 'botanical-facial',
    name: 'Tropical Botanical Facial',
    duration: '75 Minutes',
    category: 'Facial',
    price: 220,
    description: 'Deep cellular hydration powered by organic ocean sea kelp, fresh aloe vera pulp, wild rosehip, and enzymatic papaya exfoliation leaving a radiant sun-kissed glow.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Living kelp extract, cold-pressed jojoba, cold damask rose water'
  },
  {
    id: 'couples-sunset-ritual',
    name: "Couples' Sunset Ritual",
    duration: '150 Minutes',
    category: 'Couples',
    price: 680,
    description: 'Conducted in an overwater double pavilion during twilight: foot bath with sea minerals, synchronized body massage, private botanical milk bath, chilled vintage champagne, and tropical fruit.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Jasmine essence, coconut milk, pink Himalayan bath salts, organic cocoa butter'
  },
  {
    id: 'deep-recovery-therapy',
    name: 'Deep Recovery Therapy',
    duration: '90 Minutes',
    category: 'Body',
    price: 275,
    description: 'Designed for active explorers and divers. Concentrated deep-tissue friction, trigger point release, and cooling arnica compresses relieve joint fatigue and chronic stiffness.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Wintergreen, organic arnica montana, eucalyptus, camphor'
  },
  {
    id: 'private-wellness-journey',
    name: 'Private Wellness Journey',
    duration: 'Half-Day (4 Hours)',
    category: 'Rituals',
    price: 850,
    description: 'An bespoke immersion featuring private Ayurvedic consultation, tailored sound bath, full-body exfoliation, customized restorative massage, and private beachfront organic lunch.',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=85',
    ingredients: 'Custom tailored oils compounded daily by resident Ayurvedic Vaidya'
  }
];

export const WELLNESS_FACILITIES: WellnessFacility[] = [
  {
    id: 'treatment-suites',
    name: 'Overwater Treatment Suites',
    description: 'Nine individual glass-bottomed pavilions hovering over coral gardens with gentle wave acoustics.',
    iconName: 'Sparkles',
    hours: '08:00 - 21:00'
  },
  {
    id: 'sauna',
    name: 'Cedar Finnish Sauna',
    description: 'Panoramic glass wall viewing the ocean horizon with infused eucalyptus and mint steam cycles.',
    iconName: 'Flame',
    hours: '07:00 - 22:00'
  },
  {
    id: 'steam-room',
    name: 'Aromatic Herbal Steam Room',
    description: 'Enveloped in warm island lemongrass, cardamom, and mountain mist botanicals for deep purification.',
    iconName: 'Cloud',
    hours: '07:00 - 22:00'
  },
  {
    id: 'hydrotherapy',
    name: 'Marine Hydrotherapy Circuit',
    description: 'Therapeutic vitality pool with seawater jet streams, reflexology pebble paths, and cold plunge waterfalls.',
    iconName: 'Droplets',
    hours: '07:00 - 21:00'
  },
  {
    id: 'yoga-pavilion',
    name: 'Open-Air Yoga Pavilion',
    description: 'Thatched roof pavilion catching sea breezes, hosting sunrise Hatha, Yin, and Vinyasa practices.',
    iconName: 'Sun',
    hours: '06:30 - 20:00'
  },
  {
    id: 'meditation-gardens',
    name: 'Zen Meditation Gardens',
    description: 'Quiet sanctuary of lotus ponds, ancient banyan shade, stone pathways, and gentle wind chimes.',
    iconName: 'Flower2',
    hours: 'Dawn to Dusk'
  },
  {
    id: 'fitness-studio',
    name: 'Oceanfront Kinetic Studio',
    description: 'State-of-the-art Technogym equipment with private trainers, pilates reformer beds, and TRX suspension.',
    iconName: 'Activity',
    hours: '24 Hours'
  },
  {
    id: 'relaxation-lounge',
    name: 'Ocean-View Relaxation Lounge',
    description: 'Daybeds overlooking the open surf with complimentary herbal tisanes, dried fruits, and silence policy.',
    iconName: 'Compass',
    hours: '08:00 - 21:30'
  }
];
