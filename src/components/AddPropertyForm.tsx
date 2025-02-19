
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { Json } from "@/integrations/supabase/types";

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

export function AddPropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert formData to PropertySubmitData with proper type casting
      const submitData: PropertySubmitData = {
        ...formData,
        features: formData.features as unknown as Json,
        areas: formData.areas.map(area => ({
          id: area.id,
          title: area.title,
          description: area.description,
          imageIds: area.imageIds
        })) as unknown as Json[],
        images: formData.images.map(img => img.url),
        nearby_places: (formData.nearby_places || []).map(place => ({
          id: place.id,
          name: place.name,
          type: place.type,
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total
        })) as unknown as Json
      };

      const { error } = await supabase
        .from('properties')
        .insert(submitData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property created successfully",
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

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <PropertyFormContent 
        formData={formData}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
