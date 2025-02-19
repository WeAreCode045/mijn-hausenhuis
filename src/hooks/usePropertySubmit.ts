
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData, PropertyDatabaseData } from "@/types/property";

export async function usePropertySubmit(propertyData: PropertySubmitData) {
  try {
    const { images, ...rest } = propertyData;
    
    const databaseData: PropertyDatabaseData = {
      ...rest,
      images: images.map(img => img.url)
    };

    const { error } = await supabase
      .from('properties')
      .upsert(databaseData);

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting property:', error);
    throw error;
  }
}
