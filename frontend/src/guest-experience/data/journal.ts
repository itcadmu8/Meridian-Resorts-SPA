/**
 * @file journal.ts
 * @description Mock data and static configuration for journal.
 */
import { JournalArticle } from '../types';

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-weekend-paradise',
    title: 'The Perfect Weekend in Paradise',
    category: 'Travel Itinerary',
    readTime: '5 min read',
    date: 'October 12, 2026',
    author: 'Elena Rostova, Cultural Director',
    excerpt: 'How 48 unhurried hours between turquoise atolls, private sandbanks, and candlelight dining can reset your internal pace of life.',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=85',
    content: [
      'Time moves differently when measured by the incoming tide and the descent of the sun into violet waters. At Meridian, the art of doing nothing is not an absence of activity, but the presence of attention.',
      'Begin your morning with barefoot steps across dew-kissed teak wood to the edge of the lagoon. A private floating breakfast arrives as manta rays glide quietly below the stilts of your overwater pavilion.',
      'In the afternoon, charter our solar catamaran to an uninhabited sandspit where our sommelier pairs crisp Chablis with line-caught reef ceviche before twilight turns the sky to gold.'
    ]
  },
  {
    id: 'journal-slow-down',
    title: 'Five Ways to Slow Down by the Ocean',
    category: 'Mindfulness & Wellbeing',
    readTime: '4 min read',
    date: 'September 28, 2026',
    author: 'Dr. Anand Kumar, Resident Vaidya',
    excerpt: 'The neurological power of "blue space": practical rituals for letting coastal acoustics dissolve mental fatigue.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
    content: [
      'Marine scientists describe the therapeutic trance induced by sea horizons as the "Blue Mind"—a mildly meditative state characterized by calm, peacefulness, and general happiness.',
      '1. Synchronize breath with incoming swells: Notice how the rhythm of six breaths per minute mirrors gentle wave periods.',
      '2. Barefoot earthing on mineral sand: Allowing direct contact between skin and ocean sediment discharges cellular inflammation.',
      '3. Screen-free horizons at golden hour: Transitioning your eyes to infinite focal lengths relieves optic nerve tension.',
      '4. Immersion in warm marine hydrotherapy pools.',
      '5. Nightly starlight meditation without ambient artificial glare.'
    ]
  },
  {
    id: 'journal-tropical-wellness',
    title: 'A Guide to Tropical Wellness',
    category: 'Spa & Longevity',
    readTime: '6 min read',
    date: 'September 14, 2026',
    author: 'Dr. Maya Lin, Head of Holistic Therapies',
    excerpt: 'Harnessing the restorative potency of native botanicals, virgin coconut oils, sea minerals, and ancient Ayurvedic wisdom.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
    content: [
      'Tropical environments provide nature’s most potent pharmacopeia. At Meridian Spas, we compound our elixirs daily from living sea kelp, cold-pressed cold coconut, wild vetiver, and indigenous spices.',
      'Our signature Ayurvedic protocols balance the three bio-energies (Vata, Pitta, Kapha) with personalized bodywork, synchronized herbal oil streams (Shirodhara), and deep tissue thermal therapies.'
    ]
  },
  {
    id: 'journal-sunset-dining',
    title: 'The Meridian Guide to Sunset Dining',
    category: 'Culinary Arts',
    readTime: '4 min read',
    date: 'August 30, 2026',
    author: 'Chef Guillaume Vance, Executive Chef',
    excerpt: 'From starlit sandbank grills to cantilevered cliff pavilions: orchestrating flavors to match the shifting moods of dusk.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85',
    content: [
      'Sunset is the pinnacle theater of our day. At Tide and Azure Lounge, our culinary team designs menus that progress in synergy with fading light—from crisp, refreshing citrus crudos to rich charcoal-roasted Wagyu and smoky digestifs.'
    ]
  },
  {
    id: 'journal-local-flavours',
    title: 'Discovering Local Flavours: The Spice Routes',
    category: 'Epicurean Stories',
    readTime: '5 min read',
    date: 'August 18, 2026',
    author: 'Sunil Nair, Master of Spices',
    excerpt: 'Tracing centuries-old maritime trade routes through tellicherry black pepper, wild cardamom, and heirloom coconut cream.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85',
    content: [
      'The spice winds that once carried merchant galleons across the Indian Ocean continue to shape our culinary ethos. At Saffron and Ember, we source directly from organic community plantations in Wayanad and Tangalle.'
    ]
  },
  {
    id: 'journal-ocean-adventures',
    title: 'Ocean Adventures for Every Traveller',
    category: 'Discovery & Wildlife',
    readTime: '5 min read',
    date: 'August 02, 2026',
    author: 'Captain Marcus Lind, Lead Naturalist',
    excerpt: 'From peaceful glass-bottom kayak glides to exhilarating manta ray encounters: discovering the living pulse of the sea.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=85',
    content: [
      'Whether you are an experienced deep-sea diver or stepping onto a paddleboard for the first time, our marine biologists accompany you to witness coral ecosystems thriving in absolute seclusion.'
    ]
  }
];
