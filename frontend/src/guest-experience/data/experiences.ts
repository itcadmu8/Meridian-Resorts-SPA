import { ExperienceItem } from '../types';

export const EXPERIENCES: ExperienceItem[] = [
  // Ocean
  {
    id: 'exp-yacht',
    title: 'Private Yacht Cruise to Secluded Sandbanks',
    category: 'Ocean',
    duration: '4 Hours',
    groupSize: 'Up to 6 Guests',
    description: 'Charter the Meridian 68-foot luxury catamaran to virgin desert sandbanks with a dedicated captain, steward, and chilled vintage champagne lunch.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=85',
    priceIndicator: 'From $1,450 / charter',
    inclusions: ['Private crew & steward', 'Seafood luncheon', 'Seabob underwater scooters', 'Vintage champagne']
  },
  {
    id: 'exp-sunset-sailing',
    title: 'Traditional Sunset Wooden Dhow Sailing',
    category: 'Ocean',
    duration: '2 Hours',
    groupSize: 'Up to 8 Guests',
    description: 'Glide quietly along the reef edge as golden hour bathes the water in shades of amber, accompanied by live acoustic flute and artisanal canapés.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$180 per guest',
    inclusions: ['Canapé pairing', 'Selection of fine wines', 'Acoustic musicians', 'Sunset binoculars']
  },
  {
    id: 'exp-snorkeling-manta',
    title: 'Manta Ray & Coral Safari Snorkeling',
    category: 'Ocean',
    duration: '3 Hours',
    groupSize: 'Max 6 Guests',
    description: 'Led by our resident marine biologist, swim alongside majestic oceanic manta rays and sea turtles in our protected UNESCO biosphere reserve.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$220 per guest',
    inclusions: ['Marine biologist briefing', 'High-end snorkel gear', 'Underwater Go-Pro video footage', 'Refreshments']
  },
  {
    id: 'exp-dolphin',
    title: 'Wild Spinner Dolphin Expedition',
    category: 'Ocean',
    duration: '2.5 Hours',
    groupSize: 'Small Groups',
    description: 'Witness pods of wild spinner dolphins leaping in acrobatic synchrony across crystal deep channels during early morning calm waters.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$165 per guest',
    inclusions: ['Hydrophone listening device', 'Hot tea and breakfast pastries', 'Guaranteed sightings policy']
  },

  // Nature
  {
    id: 'exp-rainforest-walk',
    title: 'Guided Canopy & Medicinal Botanical Trek',
    category: 'Nature',
    duration: '3 Hours',
    groupSize: 'Up to 6 Guests',
    description: 'Traverse protected coastal rainforest with our ethnobotanist, uncovering wild orchids, ancient healing herbs, and rare endemic bird species.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$110 per guest',
    inclusions: ['Binoculars & field guide', 'Tasting of edible wild fruits', 'Botanical journal keepsake']
  },
  {
    id: 'exp-mangrove-kayak',
    title: 'Silent Solar Kayak Mangrove Exploration',
    category: 'Nature',
    duration: '2.5 Hours',
    groupSize: 'Pairs or Solo',
    description: 'Paddle transparent glass-bottom kayaks through winding turquoise mangrove tunnels alive with juvenile reef fish, kingfishers, and herons.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$95 per guest',
    inclusions: ['Glass-bottom kayak', 'Waterproof equipment pouches', 'Naturalist guide']
  },

  // Culture
  {
    id: 'exp-cooking-masterclass',
    title: 'Island Culinary Masterclass with Executive Chef',
    category: 'Culture',
    duration: '3 Hours',
    groupSize: 'Up to 4 Guests',
    description: 'Begin with morning herb harvesting in the organic estate garden, followed by hands-on preparation of fresh seafood curries and dessert.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$190 per guest',
    inclusions: ['Chef-monogrammed apron', '4-course feast with wine', 'Personal recipe booklet']
  },
  {
    id: 'exp-village-craft',
    title: 'Heritage Village Discovery & Weaver Guild Visit',
    category: 'Culture',
    duration: '3.5 Hours',
    groupSize: 'Up to 6 Guests',
    description: 'Step into traditional local villages, meet master cane weavers and pottery artisans, and partake in an authentic community tea ceremony.',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$120 per guest',
    inclusions: ['Private Tuk-Tuk chauffeur', 'Artisan gift', 'Village community fund donation']
  },

  // Wellness
  {
    id: 'exp-sunrise-yoga',
    title: 'Sunrise Prana Yoga on Overwater Jetty',
    category: 'Wellness',
    duration: '75 Minutes',
    groupSize: 'Complimentary / Private option',
    description: 'Greet the first light with synchronized pranayama breathwork and gentle flowing asanas listening to rhythmic waves breaking on the outer reef.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=85',
    priceIndicator: 'Complimentary Daily (Private $140)',
    inclusions: ['Lululemon mats & blocks', 'Cold-pressed coconut water', 'Essential oil cool towels']
  },
  {
    id: 'exp-sound-healing',
    title: 'Tibetan Singing Bowl & Ocean Gong Bath',
    category: 'Wellness',
    duration: '60 Minutes',
    groupSize: 'Up to 8 Guests',
    description: 'Deep cellular restoration using hand-hammered 7-metal Tibetan singing bowls whose resonant vibrations balance energy centers beneath candlelight.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$85 per guest',
    inclusions: ['Silk eye pillows', 'Warm herbal infusions', 'Guided chakra grounding']
  },

  // Romance
  {
    id: 'exp-private-beach-dinner',
    title: 'Candlelit Sandbank Stargazer Dinner',
    category: 'Romance',
    duration: 'Evening Experience',
    groupSize: '2 Guests',
    description: 'A sunken sand table illuminated by 100 tiki torches on a private beach. Five courses cooked live by a dedicated private chef with personalized music.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$890 per couple',
    inclusions: ['Dedicated private chef & butler', '5-Course tasting menu', 'Sommelier wine pairing', 'Floral pathway']
  },
  {
    id: 'exp-sunset-picnic',
    title: 'Cliffside Sunset Champagne Picnic',
    category: 'Romance',
    duration: '2.5 Hours',
    groupSize: '2 Guests',
    description: 'Suspended above the crashing surf with Moroccan rugs, plush linen cushions, chilled Krug champagne, fresh oysters, and French cheeses.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85',
    priceIndicator: '$450 per couple',
    inclusions: ['Bottle of premium champagne', 'Gourmet charcuterie & oysters', 'Private cliffside sanctuary']
  }
];
