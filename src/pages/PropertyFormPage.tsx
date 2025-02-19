
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { formData, setFormData } = usePropertyForm(id, onSubmit);
  const {
    handleImageUpload,
    handleRemoveImage
  } = usePropertyImages(formData, setFormData);

  const handleSubmit = async (data: PropertySubmitData) => {
    try {
      const propertyData = {
        ...data,
        features: data.features as Json,
        areas: data.areas as Json[],
        gridImages: data.gridImages,
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        
        if (updateError) throw updateError;

        toast({
          title: "Property Updated",
          description: "The property has been saved successfully",
          variant: "default",
        });
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert(propertyData);
        
        if (insertError) throw insertError;

        toast({
          title: "Property Created",
          description: "The property has been saved successfully",
          variant: "default",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the property",
        variant: "destructive",
      });
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800 mb-4">
            {id ? "Edit Property" : "New Property"}
          </h1>
        </div>
        <div className="flex gap-6">
          <PropertyForm onSubmit={handleSubmit} />
          <div className="w-80 shrink-0">
            <PropertyMediaLibrary
              images={formData.images}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
