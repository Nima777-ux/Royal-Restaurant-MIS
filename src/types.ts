export type Language = 'en' | 'fa';
export type Theme = 'dark' | 'light';

export interface Dish {
  id: string;
  name: string;
  nameFa?: string;
  subtitle: string;
  subtitleFa?: string;
  category: 'starters' | 'mains' | 'pasta' | 'desserts' | 'drinks';
  price: string;
  priceUsd: number;
  description: string;
  descriptionFa?: string;
  longDescription: string;
  longDescriptionFa?: string;
  image: string;
  ingredients: string[];
  ingredientsFa?: string[];
  pairing: string;
  pairingFa?: string;
  calories?: string;
  highlightTag?: string;
  highlightTagFa?: string;
  flavorProfile: {
    richness: number;
    intensity: number;
    sweetness: number;
    umami: number;
    aroma: number;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberId: string;
  tier: string;
  tierFa: string;
  points: number;
  isAuthenticated: boolean;
  emailVerified?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  nameFa?: string;
  origin: string;
  originFa?: string;
  elevation?: string;
  elevationFa?: string;
  harvestSeason?: string;
  harvestSeasonFa?: string;
  climate?: string;
  climateFa?: string;
  description: string;
  descriptionFa?: string;
  tastingNote: string;
  tastingNoteFa?: string;
  iconName: string;
  coords: { x: number; y: number }; // percentage position around center plate
  color: string;
  image?: string;
  harvestMethod?: string;
  harvestMethodFa?: string;
  rarity?: string;
  rarityFa?: string;
  pairedDishName?: string;
  pairedDishNameFa?: string;
  sensoryScores?: {
    earthiness: number;
    umami: number;
    aroma: number;
    intensity: number;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  titleFa?: string;
  category: string;
  categoryFa?: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  caption: string;
  captionFa?: string;
}

export interface ReservationData {
  date: string;
  time: string;
  guests: number;
  seatingArea: 'Atrium' | "Chef's Counter" | 'Private Mezzanine' | 'Terrace';
  name: string;
  email: string;
  phone: string;
  dietaryNotes: string;
  bookingRef?: string;
}

export type CursorMode = 'default' | 'hover' | 'explore' | 'view' | 'reserve' | 'drag';

