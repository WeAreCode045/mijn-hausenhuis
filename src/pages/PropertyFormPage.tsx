
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData, PropertyFormData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      // Convert PropertyFormData to PropertySubmitData
      const submitData: PropertySubmitData = {
        id: data.id,
        title: data.title,
        price: data.price,
        address: data.address,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        livingArea: data.livingArea,
        buildYear: data.buildYear,
        garages: data.garages,
        energyLabel: data.energyLabel,
        hasGarden: data.hasGarden,
        description: data.description,
        location_description: data.location_description,
        floorplans: data.floorplans,
        featuredImage: data.featuredImage,
        gridImages: data.gridImages,
        areaPhotos: data.areaPhotos,
        features: data.features as unknown as Json,
        areas: data.areas as unknown as Json[],
        nearby_places: data.nearby_places as unknown as Json,
        images: data.images.map(img => img.url), // Only send the URLs to the database
        latitude: data.latitude,
        longitude: data.longitude,
        object_id: data.object_id,
        map_image: data.map_image
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(submitData)
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
          .insert(submitData);
        
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

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800">
            {id ? "Edit Property" : "New Property"}
          </h1>
          <Button onClick={() => handleSubmit(formData)} className="gap-2">
            <Save className="h-4 w-4" />
            Save Property
          </Button>
        </div>
        <div className="flex gap-6">
          <PropertyForm onSubmit={handleSubmit} />
          <div className="w-80 shrink-0">
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
