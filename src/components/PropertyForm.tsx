
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAutosave } from "@/hooks/usePropertyAutosave";
import type { PropertySubmitData } from "@/types/property";
import { steps } from "./property/form/formSteps";
import { FormStepNavigation } from "./property/form/FormStepNavigation";
import { useFormSteps } from "@/hooks/useFormSteps";
import { PropertyStepContent } from "./property/form/PropertyStepContent";
import { supabase } from "@/integrations/supabase/client";

interface PropertyFormProps {
  onSubmit: (data: PropertySubmitData) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const { id } = useParams();
  const { formData, setFormData } = usePropertyForm(id, onSubmit);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit(onSubmit);
  const { autosaveData } = usePropertyAutosave();
  
  const {
    handleImageUpload,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveImage: handleRemoveImageById,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  // Create an index-based wrapper for handleRemoveImage
  const handleRemoveImage = (index: number) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove) {
      handleRemoveImageById(imageToRemove.id);
    }
  };

  const {
    handleAreaImageUpload,
    addArea,
    removeArea,
    updateArea,
    removeAreaImage
  } = usePropertyAreas(formData, setFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMapImageDelete = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ map_image: null })
        .eq('id', formData.id);

      if (error) throw error;

      setFormData({ ...formData, map_image: null });
    } catch (error) {
      console.error('Error removing map image:', error);
    }
  };

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    () => autosaveData(formData),
    steps.length
  );

  if (!formData) {
    return null;
  }

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-6">
        <FormStepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isUpdateMode={!!id}
        />
        <PropertyStepContent
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          id={id}
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImage}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
          addFeature={addFeature}
          removeFeature={removeFeature}
          updateFeature={updateFeature}
          addArea={addArea}
          removeArea={removeArea}
          updateArea={updateArea}
          handleAreaImageUpload={handleAreaImageUpload}
          removeAreaImage={removeAreaImage}
          handleMapImageDelete={handleMapImageDelete}
        />
      </form>
    </Card>
  );
}
