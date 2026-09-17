/**
 * @file types.ts
 * @description Guest portal experience module and views for types.
 */
export interface Resort {
  id: string;
  name: string;
  tagline: string;
  location: string;
  country: string;
  description: string;
  startingRate: number;
  startingCategory: string;
  imageUrl: string;
  gallery: string[];
  climate: string;
  transferType: string;
  features: string[];
  vibe: string;
}

export interface Accommodation {
  id: string;
  name: string;
  category: 'Oceanfront Rooms' | 'Beach Villas' | 'Private Pool Villas' | 'Ocean Residences' | 'Presidential Villas';
  description: string;
  capacity: string;
  bedConfig: string;
  view: string;
  size: string;
  pricePerNight: number;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  highlight: string;
}

export interface SpaExperience {
  id: string;
  name: string;
  duration: string;
  description: string;
  price: number;
  category: 'Rituals' | 'Body' | 'Facial' | 'Couples' | 'Ayurveda';
  imageUrl: string;
  ingredients: string;
}

export interface WellnessFacility {
  id: string;
  name: string;
  description: string;
  iconName: string;
  hours: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tagline: string;
  description: string;
  diningStyle: string;
  openingHours: string;
  location: string;
  dressCode: string;
  imageUrl: string;
  signatureDish: string;
  menuHighlights: { name: string; desc: string; price: string }[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  category: 'Ocean' | 'Nature' | 'Culture' | 'Wellness' | 'Romance';
  duration: string;
  groupSize: string;
  description: string;
  imageUrl: string;
  priceIndicator: string;
  inclusions: string[];
}

export interface GuestService {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  availableHours: string;
  highlight: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  validity: string;
  imageUrl: string;
  inclusions: string[];
  code: string;
  badge?: string;
}

export interface SustainabilityPillar {
  id: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  guestName: string;
  location: string;
  resortVisited: string;
  rating: number;
  quote: string;
  stayDate: string;
  roomType: string;
  avatarUrl?: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  author: string;
}

export interface BookingState {
  resortId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  roomCategory?: string;
}

export interface BookingSearchParams {
  resort: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  promoCode?: string;
}

export interface GuestReservation {
  confirmationCode: string;
  guestName: string;
  email: string;
  resortName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string[];
  status: 'Confirmed' | 'Checked-in' | 'Checked-out';
  roomNumber?: string;
  digitalKeyActive: boolean;
}
