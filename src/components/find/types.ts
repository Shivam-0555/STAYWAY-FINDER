// src/components/find/types.ts
export interface PlaceDTO {
  _id: string;
  name: string;
  category: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  description?: string;
  rating?: number;
  budget?: number;
  verified?: boolean;
  website?: string;
  phone?: string;
  imageUrl?: string;
  owner?: string;
  type?: string;
  distanceKm?: number;
  // Category-specific optional fields
  amenities?: string[];
  facilities?: string[] | Record<string, boolean>;
  popularDishes?: string[];
  foodType?: string;
  averageCost?: number;
  vegOnly?: boolean;
  services?: string[];
  medicalServices?: string[];
  bankingServices?: string[];
  transportFacilities?: string[];
  emergencyContact?: string;
  operatingHours?: string;
  openingHours?: string;
  status?: string;
  reviews?: Array<{ user: string; comment: string; rating: number }>;
  [key: string]: any;
}

export type SortOption = "alphabetical" | "rating" | "nearest";
export type CategoryKey =
  | ""
  | "hostel"
  | "food"
  | "bus"
  | "atm"
  | "clinic"
  | "emergency";

