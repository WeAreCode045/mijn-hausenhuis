
import { Card } from "@/components/ui/card";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { usePropertyFormState } from "./property/form/usePropertyFormState";
import { useFeatures } from "@/hooks/useFeatures";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";

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
  const [currentStep, setCurrentStep] = useState(1);
  const formState = usePropertyFormState(initialFormData, async (data) => {
    // Handle form submission
    try {
      if (!data.id) return;
      const { error } = await supabase
        .from('properties')
        .upsert(data);
      if (error) throw error;
    } catch (error) {
      console.error('Error saving property:', error);
    }
  });

  const handleMapImageDelete = async () => {
    try {
      if (!formState.formData.id) return;
      const { error } = await supabase
        .from('properties')
        .update({ map_image: null })
        .eq('id', formState.formData.id);

      if (error) throw error;

      formState.setFormData({ ...formState.formData, map_image: null });
    } catch (error) {
      console.error('Error removing map image:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <PropertyFormContent 
        {...formState}
        currentStep={currentStep}
        handleMapImageDelete={handleMapImageDelete}
      />
    </Card>
  );
}
