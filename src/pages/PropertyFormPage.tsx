
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData, PropertyFormData, PropertyImage } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  const { isAdmin } = useAuth();
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string }>>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (isAdmin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'agent');
        
        if (!error && data) {
          setAgents(data);
        }
      }
    };
    
    fetchAgents();
  }, [isAdmin]);

  const handleDatabaseSubmit = async (data: PropertySubmitData) => {
    try {
      if (id) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(data)
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
          .insert(data);
        
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

  const handleFormSubmit = (formData: PropertyFormData) => {
    // Convert PropertyFormData to PropertySubmitData
    const submitData: PropertySubmitData = {
      id: formData.id,
      title: formData.title,
      price: formData.price,
      address: formData.address,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      sqft: formData.sqft,
      livingArea: formData.livingArea,
      buildYear: formData.buildYear,
      garages: formData.garages,
      energyLabel: formData.energyLabel,
      hasGarden: formData.hasGarden,
      description: formData.description,
      location_description: formData.location_description,
      floorplans: formData.floorplans,
      featuredImage: formData.featuredImage,
      gridImages: formData.gridImages,
      areaPhotos: formData.areaPhotos,
      features: formData.features as unknown as Json,
      areas: formData.areas as unknown as Json[],
      nearby_places: formData.nearby_places as unknown as Json,
      images: formData.images.map(img => img.url),
      latitude: formData.latitude,
      longitude: formData.longitude,
      object_id: formData.object_id,
      map_image: formData.map_image
    };
    handleDatabaseSubmit(submitData);
  };

  const { formData, setFormData } = usePropertyForm(id, handleFormSubmit);
  const {
    handleImageUpload,
    handleRemoveImage,
  } = usePropertyImages(formData, setFormData);

  if (!formData) {
    return null;
  }

  const handleAgentChange = (value: string) => {
    setFormData({ ...formData, agent_id: value });
  };

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800">
            {id ? "Edit Property" : "New Property"}
          </h1>
          <Button onClick={() => handleFormSubmit(formData)} className="gap-2">
            <Save className="h-4 w-4" />
            Save Property
          </Button>
        </div>
        <div className="flex gap-6">
          <PropertyForm onSubmit={handleFormSubmit} />
          <div className="w-80 shrink-0 space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.agent_id || ''}
                    onValueChange={handleAgentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
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
