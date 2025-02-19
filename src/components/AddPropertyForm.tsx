
import { Card } from "@/components/ui/card";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { usePropertyFormState } from "./property/form/usePropertyFormState";
import { useFeatures } from "@/hooks/useFeatures";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertySubmitData } from "@/types/property";

export function AddPropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { formState, handleSubmit } = usePropertyFormState();
  const { addFeature, removeFeature, updateFeature } = useFeatures(formState.formData, formState.setFormData);

  const handleMapImageDelete = async () => {
    try {
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
        addFeature={addFeature}
        removeFeature={removeFeature}
        updateFeature={updateFeature}
        handleMapImageDelete={handleMapImageDelete}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
