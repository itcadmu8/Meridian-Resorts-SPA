export type ViewState = 'normal' | 'loading' | 'error' | 'empty';

export type NavScreen = 'dashboard' | 'fb-covers' | 'arrivals' | 'spa' | 'properties' | 'reports';

export interface PropertyCoverData {
  id: string;
  code: string;
  name: string;
  shortName: string;
  covers: number;
  percentage: number;
  target: number;
  variance: number;
  color: string;
  location: string;
  manager: string;
  breakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    roomService: number;
  };
  capacity: number;
  occupancyPercent: number;
  signatureVenues: string[];
}

export type SortColumn = 'name' | 'covers' | 'percentage' | 'target' | 'variance';
export type SortDirection = 'asc' | 'desc';
