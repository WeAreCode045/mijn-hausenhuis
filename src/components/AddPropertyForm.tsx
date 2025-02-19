
import { Card } from "@/components/ui/card";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { usePropertyFormState } from "./property/form/usePropertyFormState";
import { useFeatures } from "@/hooks/useFeatures";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData, PropertyDatabaseData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function AddPropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { formState, handleSubmit } = usePropertyFormState();

  const handleMapImageDelete = async () => {
    try {
      if (!formState.formData.id) return;
      
      const updateData: PropertyDatabaseData = {
        map_image: null
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
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
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
