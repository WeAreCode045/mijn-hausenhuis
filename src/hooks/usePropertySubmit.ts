
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function usePropertySubmit() {
  const { toast } = useToast();

  const handleSubmit = async (formData: PropertyFormData) => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert the nearby places to a format that matches the database schema
      const nearby_places = formData.nearby_places ? formData.nearby_places.map(place => ({
        id: place.id,
        name: place.name,
        type: place.type,
        vicinity: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      })) : [];

      const { error } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          price: formData.price,
          address: formData.address,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          sqft: formData.sqft,
          livingArea: formData.livingArea,
          buildYear: formData.buildYear,
          garages: formData.garages,
          energyLabel: formData.energyLabel,
          hasGarden: formData.hasGarden,
          description: formData.description,
          images: formData.images,
          floorplans: formData.floorplans,
          featuredImage: formData.featuredImage,
          gridImages: formData.gridImages,
          areaPhotos: formData.areaPhotos,
          object_id: formData.object_id,
          map_image: formData.map_image,
          latitude: formData.latitude,
          longitude: formData.longitude,
          features: formData.features as unknown as Json,
          areas: formData.areas as unknown as Json[],
          nearby_places: nearby_places as unknown as Json
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
