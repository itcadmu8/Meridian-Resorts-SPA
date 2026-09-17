/**
 * @file dining.ts
 * @description Mock data and static configuration for dining.
 */
import { Restaurant } from '../types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'tide',
    name: 'Tide',
    cuisine: 'Oceanfront Contemporary Seafood & Raw Bar',
    tagline: 'Harvested from Island Depths, Crafted with Purity',
    description: 'Suspended above the tidal flats, Tide celebrates daily catches from artisanal fisherman: line-caught reef fish, butter-poached Maldivian lobster, and a dramatic raw bar on crushed ice.',
    diningStyle: 'Fine Dining & Raw Bar',
    openingHours: 'Dinner: 18:30 - 22:30',
    location: 'Oceanfront Jetty Pavilion',
    dressCode: 'Resort Elegant (Collared shirts, smart casual footwear)',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    signatureDish: 'Glazed Black Cod with Mirin Reduction & Fermented Seaweed Emulsion',
    menuHighlights: [
      { name: 'Hokkaido Scallop Carpaccio', desc: 'Finger lime, white soy, cold-pressed yuzu, Oscietra caviar', price: '$42' },
      { name: 'Line-Caught Coral Grouper', desc: 'Steamed in banana leaf with wild ginger and coconut broth', price: '$68' },
      { name: 'Whole Butter-Poached Rock Lobster', desc: 'Charred lime, saffron risotto, lemongrass bisque', price: '$95' }
    ]
  },
  {
    id: 'the-palm',
    name: 'The Palm',
    cuisine: 'Artisanal International & Sunlit Tropical Breakfasts',
    tagline: 'Garden Serenity & Global Culinary Heritage',
    description: 'Surrounded by towering coconut palms and blooming frangipani trees, The Palm offers vibrant breakfast buffets with fresh boulangerie, organic pressed tonics, and Mediterranean wood-fired lunches.',
    diningStyle: 'All-Day Casual Fine Dining',
    openingHours: 'Breakfast: 06:30 - 11:00 | Lunch: 12:30 - 15:30',
    location: 'Central Tropical Courtyard',
    dressCode: 'Resort Casual',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    signatureDish: 'Handmade Burrata with Heirloom Island Tomatoes & Basil Oil',
    menuHighlights: [
      { name: 'Floating Pavilion Breakfast', desc: 'Acai bowls, warm brioche, eggs Benedict with blue swimmer crab', price: '$55' },
      { name: 'Wood-Fired Truffle Pinsa', desc: 'Fior di latte, summer black truffles, wild arugula', price: '$38' },
      { name: 'Seared Yellowfin Nicoise', desc: 'Quail eggs, purple potatoes, Taggiasca olives, lemon vinaigrette', price: '$44' }
    ]
  },
  {
    id: 'ember',
    name: 'Ember',
    cuisine: 'Beachside Open-Fire Grill & Smokehouse',
    tagline: 'Primordial Fire, Prime Cuts & Coastal Char',
    description: 'Feet in the soft sand, listen to the crackle of island mangrove wood and ironbark embers. Wagyu prime cuts, charred tiger prawns, and smoked tropical root vegetables under the stars.',
    diningStyle: 'Barefoot Beach Luxury Grill',
    openingHours: 'Dinner: 18:00 - 23:00',
    location: 'West Shore Starlight Beach',
    dressCode: 'Barefoot Chic (Smart casual beachwear)',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    signatureDish: '45-Day Dry Aged Tomahawk over Mangrove Embers with Chimichurri & Sea Salt',
    menuHighlights: [
      { name: 'Fire-Roasted Giant King Prawns', desc: 'Garlic piri-piri butter, smoked sea salt, charred lime', price: '$58' },
      { name: 'Australian Wagyu MB9+ Ribeye', desc: 'Bone marrow butter, grilled wild asparagus, truffled potato purée', price: '$110' },
      { name: 'Charred Pineapple Tart Tatin', desc: 'Rum caramel, homemade Madagascar vanilla bean gelato', price: '$26' }
    ]
  },
  {
    id: 'saffron',
    name: 'Saffron',
    cuisine: 'Modern Royal Indian & Coastal Spice Odyssey',
    tagline: 'Centuries of Spice Reimagined with Modern Artistry',
    description: 'A culinary homage to spice routes of the Malabar and Coromandel coasts. Traditional brass accents, hand-hammered utensils, and royal heritage recipes refined with progressive gastronomy.',
    diningStyle: 'Gourmet Haute Cuisine',
    openingHours: 'Dinner: 19:00 - 23:00',
    location: 'Heritage Pavilion & Lotus Terrace',
    dressCode: 'Resort Elegant',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85',
    signatureDish: 'Slow-Dum Awadhi Raan with 24-Carat Gold Leaf & Saffron Naan',
    menuHighlights: [
      { name: 'Malabar Crab & Coconut Mille-Feuille', desc: 'Mustard seeds, curry leaf crisps, tamarind glaze', price: '$38' },
      { name: 'Smoked Kashmiri Morel Pulao', desc: 'Stuffed gucchi with pine nuts, aged Dehradun basmati rice', price: '$52' },
      { name: 'Old Delhi Shahi Tukda Sphere', desc: 'Rabdi reduction, pistachio dust, silver leaf', price: '$24' }
    ]
  },
  {
    id: 'azure-lounge',
    name: 'Azure Lounge',
    cuisine: 'Sunset Mixology, Sommelier Cellar & Tapas',
    tagline: 'Golden Hour Elixirs & Oceanic Sunset Panoramas',
    description: 'An elevated open-air cantilevered lounge overlooking the westward reef. Featuring cold-drip botanicals, artisanal mezcal infusions, vintage champagne flights, and refined raw tapas.',
    diningStyle: 'Cocktail Lounge & Small Plates',
    openingHours: '16:00 - 01:00',
    location: 'Sunset Pier Headland',
    dressCode: 'Smart Casual',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
    signatureDish: 'The Meridian Sunset (Smoked Island Rum, Spiced Passionfruit, Gold Flakes)',
    menuHighlights: [
      { name: 'Toro Tuna & Caviar Tartare Crisp', desc: 'Nori tempura, shiso leaf, smoked soy', price: '$36' },
      { name: 'Wagyu Beef Tataki Skewers', desc: 'Ponzu glaze, sesame crisp, charred scallion', price: '$34' },
      { name: 'Artisan Island Cheese Board', desc: 'Fig jam, honeycomb, homemade sourdough crackers', price: '$32' }
    ]
  }
];
