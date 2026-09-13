export type ViewMode = 'live' | 'skeleton' | 'error' | 'empty';

export type NavTab = 
  | 'dashboard'
  | 'fb-covers'
  | 'arrivals'
  | 'spa-bookings'
  | 'properties'
  | 'reports';

export type LoyaltyTier = 'Platinum' | 'Gold' | 'Silver' | 'Standard';

export type ReservationStatus = 'Confirmed' | 'Checked In' | 'Pending' | 'Canceled';

export interface ArrivalReservation {
  id: string;
  reservationId: string;
  guestId: string;
  guestName: string;
  guestInitials: string;
  guestAvatarColor: string;
  property: string;
  propertyCategory: 'Beach' | 'Lake' | 'Mountain' | 'City' | 'Desert' | 'Forest';
  checkInDate: string;
  checkOutDate: string;
  loyaltyTier: LoyaltyTier;
  status: ReservationStatus;
  roomNumber: string;
  roomType: string;
  specialPreference?: string;
  contactEmail?: string;
  contactPhone?: string;
  flightArrival?: string;
  pax: number;
  totalNights: number;
}

export interface GuestPreference {
  guestId: string;
  guestName: string;
  guestInitials: string;
  avatarColor: string;
  roomNumber: string;
  preference: string;
  property: string;
  priority?: 'High' | 'Standard';
}

export interface PropertyArrivalStats {
  category: 'Beach' | 'Lake' | 'Mountain' | 'City' | 'Desert' | 'Forest';
  shortLabel: string;
  propertyName: string;
  count: number;
  sharePercentage: number;
  color: string;
}
