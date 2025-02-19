
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
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface PropertyFormProps {
  onSubmit: (data: PropertySubmitData) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const { id } = useParams();
  const { toast } = useToast();
  const { formData, setFormData } = usePropertyForm(id, onSubmit);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit(onSubmit);
  const { autosaveData } = usePropertyAutosave();
  
  const {
    handleImageUpload,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveImage,
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

  const handleGenerateBrochure = async () => {
    if (!id) return;

    try {
      toast({
        description: "Generating brochure...",
      });

      const { data, error } = await supabase.functions.invoke('generate-brochure', {
        body: { propertyId: id }
      });

      if (error) throw error;

      // Create a link to download the PDF
      const link = document.createElement('a');
      link.href = data.pdf;
      link.download = `${formData.title.replace(/\s+/g, '-').toLowerCase()}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        description: "Brochure generated successfully!",
      });
    } catch (error) {
      console.error('Error generating brochure:', error);
      toast({
        variant: "destructive",
        description: "Failed to generate brochure. Please try again.",
      });
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
    <Card className="w-full max-w-2xl p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Property Details</h2>
        {id && (
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateBrochure}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Brochure
          </Button>
        )}
      </div>
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
