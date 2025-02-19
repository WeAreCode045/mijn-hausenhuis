
import { Json } from "@/integrations/supabase/types";

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyImage {
  id: string;
  url: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  imageIds: string[];
}

export interface PropertyPlaceType {
  id: string;
  name: string;
  type: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

export interface PropertyGridImage {
  id: string;
  url: string;
}

export interface PropertyData {
  id: string;
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  description: string;
  location_description?: string;
  features: PropertyFeature[];
  images: PropertyImage[];
  floorplans: string[];
  featuredImage: string | null;
  gridImages: string[];
  areas: PropertyArea[];
  areaPhotos?: string[];
  currentPath?: string;
  object_id?: string;
  map_image?: string;
  nearby_places?: PropertyPlaceType[];
  latitude?: number;
  longitude?: number;
}

export interface PropertyFormData extends Omit<PropertyData, 'id'> {
  id?: string;
}

export interface PropertySubmitData extends Omit<PropertyData, 'features' | 'areas' | 'nearby_places' | 'images'> {
  features: Json;
  areas: Json[];
  nearby_places: Json;
  images: Json;
}
