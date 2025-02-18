
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertySubmitData, PropertyPlaceType } from "@/types/property";

const initialFormData: PropertyFormData = {
  title: "",
  price: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  livingArea: "",
  buildYear: "",
  garages: "",
  energyLabel: "",
  hasGarden: false,
  description: "",
  location_description: "",
  features: [],
  images: [],
  floorplans: [],
  featuredImage: null,
  gridImages: [],
  areas: [],
  map_image: null,
  nearby_places: [],
  latitude: null,
  longitude: null
};

export function usePropertyForm(id: string | undefined, onSubmit: (data: PropertySubmitData) => void) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const features = Array.isArray(data.features)
          ? data.features.map((feature: any) => ({
              id: feature.id || String(Date.now()),
              description: feature.description || ""
            }))
          : [];

        const areas = Array.isArray(data.areas)
          ? data.areas.map((area: any) => ({
              id: area.id || crypto.randomUUID(),
              title: area.title || "",
              description: area.description || "",
              images: Array.isArray(area.images) ? area.images : []
            }))
          : [];

        const nearbyPlaces = Array.isArray(data.nearby_places)
          ? data.nearby_places.map((place: any) => ({
              id: place.id || "",
              name: place.name || "",
              type: place.type || "",
              vicinity: place.vicinity || "",
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0
            }))
          : [];

        setFormData({
          id: data.id,
          title: data.title || "",
          price: data.price || "",
          address: data.address || "",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          sqft: data.sqft || "",
          livingArea: data.livingArea || "",
          buildYear: data.buildYear || "",
          garages: data.garages || "",
          energyLabel: data.energyLabel || "",
          hasGarden: Boolean(data.hasGarden),
          description: data.description || "",
          location_description: data.location_description || "",
          features: features,
          images: data.images || [],
          floorplans: data.floorplans || [],
          featuredImage: data.featuredImage,
          gridImages: Array.isArray(data.gridImages) ? data.gridImages : [],
          areas: areas,
          map_image: data.map_image || null,
          nearby_places: nearbyPlaces,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          areaPhotos: data.areaPhotos || []
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load property data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading
  };
}
