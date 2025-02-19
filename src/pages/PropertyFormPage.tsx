
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData, PropertyData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { PropertyCardActions } from "@/components/property/PropertyCardActions";
import { Card } from "@/components/ui/card";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();

  const handleSubmit = async (data: PropertySubmitData) => {
    try {
      const propertyData = {
        ...data,
        features: data.features as Json,
        areas: data.areas as Json[],
        gridImages: data.gridImages,
        images: data.images as unknown as Json[]
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

  const { formData, setFormData } = usePropertyForm(id, handleSubmit);
  const {
    handleImageUpload,
    handleRemoveImage,
  } = usePropertyImages(formData, setFormData);

  const handleDelete = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "The property has been deleted successfully",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the property",
        variant: "destructive",
      });
    }
  };

  if (!formData) {
    return null;
  }

  // Add type assertion here since we know formData will have an id when used with PropertyCardActions
  const propertyData: PropertyData = {
    ...formData,
    id: formData.id || '', // Provide a default empty string if id is undefined
  };

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
          <div className="w-80 shrink-0 space-y-6">
            {id && (
              <Card className="p-4">
                <PropertyCardActions
                  property={propertyData}
                  settings={settings}
                  onDelete={handleDelete}
                  unreadCount={0}
                  onShowSubmissions={() => {}}
                />
              </Card>
            )}
            <PropertyMediaLibrary
              images={formData.images.map(img => img.url)}
              onImageUpload={handleImageUpload}
              onRemoveImage={(index) => {
                const imageToRemove = formData.images[index];
                if (imageToRemove) {
                  handleRemoveImage(imageToRemove.id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
