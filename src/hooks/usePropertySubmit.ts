
import { supabase } from "@/integrations/supabase/client";
import { PropertyData, PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export const usePropertySubmit = () => {
  const submitProperty = async (property: PropertyData): Promise<void> => {
    const imageUrls = property.images.map(img => img.url);
    
    const submitData: PropertySubmitData = {
      ...property,
      features: property.features as unknown as Json,
      areas: property.areas.map(area => ({
        id: area.id,
        title: area.title,
        description: area.description,
        imageIds: area.imageIds
      })) as unknown as Json[],
      images: imageUrls,
      nearby_places: property.nearby_places as unknown as Json
    };

    const { error } = await supabase
      .from('properties')
      .insert(submitData);

    if (error) {
      throw error;
    }
  };

  return { submitProperty };
};
