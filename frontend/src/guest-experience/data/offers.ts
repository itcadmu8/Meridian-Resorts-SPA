/**
 * @file offers.ts
 * @description Mock data and static configuration for offers.
 */
import { SpecialOffer } from '../types';

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'stay-longer',
    title: 'Stay Longer, Experience More',
    tagline: 'Extend Your Seclusion Across Ocean & Garden',
    description: 'Immerse yourself more deeply in the calm rhythms of Meridian. Reserve a minimum stay of 5 nights and receive a complimentary 90-minute signature spa ritual per guest, daily gourmet breakfast, and sunset cruise.',
    validity: 'Valid for stays through December 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      '5th Night complimentary or 20% privilege rate',
      'Daily champagne breakfast for two at The Palm',
      'One 90-minute Signature Meridian Massage per adult',
      'Private sunset wooden dhow sailing experience',
      'Early check-in & late checkout (subject to availability)'
    ],
    code: 'MER-LONG5',
    badge: 'Signature Privilege'
  },
  {
    id: 'romance-sea',
    title: 'Romance by the Sea',
    tagline: 'An Intimate Coastal Sanctuary for Two',
    description: 'Designed exclusively for honeymoons, anniversaries, and romantic escapes. Features a guaranteed upgrade to a Private Pool Villa, a private candlelit beach dinner with personal chef, and our bespoke Couples’ Sunset Ritual.',
    validity: 'Valid year-round',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      'Guaranteed one-category room/villa upgrade upon booking',
      'Private candlelit 5-course beach dinner with sommelier pairings',
      '150-minute Couples’ Sunset Ritual in overwater suite',
      'Chilled vintage champagne and tropical fruit upon arrival',
      'In-villa floating breakfast experience'
    ],
    code: 'MER-ROMANCE',
    badge: 'Curated For Lovers'
  },
  {
    id: 'wellness-escape',
    title: 'Wellness Escape & Vitality Retreat',
    tagline: 'Holistic Rejuvenation for Body and Mind',
    description: 'A transformative wellness journey crafted in consultation with our resident Ayurvedic Vaidya and longevity specialists. Includes daily customized spa treatments, morning yoga, sound baths, and chef-curated wholesome organic cuisine.',
    validity: 'Valid through November 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      'Comprehensive Ayurvedic lifestyle & pulse consultation',
      'Daily 90-minute personalized restorative spa therapy',
      'Daily private sunrise yoga & ocean sound bath sessions',
      'All meals crafted according to your personal dosha constitution',
      'Unlimited access to hydrotherapy vitality circuits and cedar saunas'
    ],
    code: 'MER-VITALITY',
    badge: 'Restorative Retreat'
  },
  {
    id: 'family-escape',
    title: 'Family Ocean & Island Escape',
    tagline: 'Cherished Multi-Generational Memories',
    description: 'Unforgettable adventures for all generations. Children explore marine biology at the Coral Junior Club while parents unwind. Includes a $400 resort credit per stay, family cooking classes, and dolphin spotting cruises.',
    validity: 'Valid during festive & seasonal holidays',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      'Complimentary stays and dining for children under 12',
      '$400 USD Resort Credit toward dining, watersports, and spa',
      'Family dolphin spotting excursion and coral planting safari',
      'Hands-on family pastry and pasta masterclass with our chefs',
      'Full-day complimentary access to Meridian Young Voyagers club'
    ],
    code: 'MER-FAMILY',
    badge: 'Generational Memories'
  }
];
