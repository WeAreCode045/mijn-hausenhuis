
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function usePropertyFormSubmit(onSubmit: (data: PropertySubmitData) => void) {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure we have an id, generate one if it doesn't exist
      const id = formData.id || crypto.randomUUID();

      // Convert places to the expected format
      const nearby_places = formData.nearby_places?.map(place => ({
        id: place.id,
        name: place.name,
        type: place.type,
        vicinity: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      })) || [];

      const submitData: PropertySubmitData = {
        id,
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
      };

      await onSubmit(submitData);
      
      toast({
        title: "Success",
        description: "Property saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
