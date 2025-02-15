
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PropertyDetails } from "./property/PropertyDetails";
import { PropertyFeatures } from "./property/PropertyFeatures";
import { PropertyDescription } from "./property/PropertyDescription";
import { PropertyImages } from "./property/PropertyImages";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { useFeatures } from "@/hooks/useFeatures";
import type { PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

interface EditPropertyFormProps {
  onSubmit: (data: PropertySubmitData) => void;
}

export function EditPropertyForm({ onSubmit }: EditPropertyFormProps) {
  const { id } = useParams();
  const { toast } = useToast();
  const { formData, setFormData } = usePropertyForm(id, onSubmit);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const {
    handleImageUpload,
    handleFloorplanUpload,
    handleRemoveImage,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const submitData: PropertySubmitData = {
        ...formData,
        features: formData.features as unknown as Json,
        featuredImage: formData.featuredImage,
        gridImages: formData.gridImages,
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

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PropertyDetails
          {...formData}
          onChange={handleInputChange}
        />

        <PropertyDescription
          description={formData.description}
          onChange={handleInputChange}
        />

        <PropertyFeatures
          features={formData.features}
          onAdd={addFeature}
          onRemove={removeFeature}
          onUpdate={updateFeature}
        />

        <PropertyImages
          images={formData.images}
          floorplans={formData.floorplans}
          featuredImage={formData.featuredImage}
          gridImages={formData.gridImages}
          onImageUpload={handleImageUpload}
          onFloorplanUpload={handleFloorplanUpload}
          onRemoveImage={handleRemoveImage}
          onRemoveFloorplan={handleRemoveFloorplan}
          onSetFeaturedImage={handleSetFeaturedImage}
          onToggleGridImage={handleToggleGridImage}
        />

        <Button type="submit">{id ? "Update Property" : "Create Property"}</Button>
      </form>
    </Card>
  );
}
