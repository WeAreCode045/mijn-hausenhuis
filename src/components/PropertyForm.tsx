
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAutosave } from "@/hooks/usePropertyAutosave";
import type { PropertyFormData } from "@/types/property";
import { steps } from "./property/form/formSteps";
import { FormStepNavigation } from "./property/form/FormStepNavigation";
import { useFormSteps } from "@/hooks/useFormSteps";
import { PropertyFormContent } from "./property/form/PropertyFormContent";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id, onSubmit);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit(onSubmit);
  const { autosaveData } = usePropertyAutosave();
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const {
    handleAreaImageUpload,
    addArea,
    removeArea,
    updateArea,
    removeAreaImage
  } = usePropertyAreas(formData, setFormData);

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    () => autosaveData(formData),
    steps.length
  );

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMapImageDelete = async () => {
    setFormData({ ...formData, map_image: null });
  };

  // Create adapter functions to match expected types
  const handleRemoveImageAdapter = async (index: number) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove) {
      await handleRemoveImage(imageToRemove.id);
    }
  };

  const handleToggleGridImageAdapter = async (url: string) => {
    const newGridImages = [...(formData.gridImages || [])];
    if (newGridImages.includes(url)) {
      newGridImages.splice(newGridImages.indexOf(url), 1);
    } else {
      newGridImages.push(url);
    }
    handleToggleGridImage(newGridImages);
  };

  if (!formData || isLoading) {
    return null;
  }

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, formData);
      }} className="space-y-6">
        <FormStepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isUpdateMode={!!id}
        />
        <PropertyFormContent 
          step={currentStep}
          formData={formData}
          onFieldChange={handleFieldChange}
          onAddFeature={addFeature}
          onRemoveFeature={removeFeature}
          onUpdateFeature={updateFeature}
          onAddArea={addArea}
          onRemoveArea={removeArea}
          onUpdateArea={updateArea}
          onAreaImageUpload={handleAreaImageUpload}
          onAreaImageRemove={removeAreaImage}
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImageAdapter}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImageAdapter}
          handleMapImageDelete={handleMapImageDelete}
        />
      </form>
    </Card>
  );
}
