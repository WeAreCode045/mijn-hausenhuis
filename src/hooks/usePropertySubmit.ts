
import { supabase } from "@/integrations/supabase/client";
import { PropertyData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export async function usePropertySubmit(propertyData: PropertyData) {
  try {
    const { images, features, areas, nearby_places, ...rest } = propertyData;

    const imageUrls = images.map(img => img.url);
    const featuresJson = features.map(f => ({ id: f.id, description: f.description })) as unknown as Json;
    const areasJson = areas.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      imageIds: a.imageIds
    })) as unknown as Json[];
    const nearbyPlacesJson = nearby_places?.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      vicinity: p.vicinity,
      rating: p.rating,
      user_ratings_total: p.user_ratings_total
    })) as unknown as Json;

    const { error } = await supabase
      .from('properties')
      .upsert({
        ...rest,
        images: imageUrls,
        features: featuresJson,
        areas: areasJson,
        nearby_places: nearbyPlacesJson
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting property:', error);
    throw error;
  }
}
