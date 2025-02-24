
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData, PropertyFormData, PropertyImage, PropertyData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyActions } from "@/components/property/PropertyActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code } from "@/components/ui/code";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  const { isAdmin } = useAuth();
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string }>>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");

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
          .update({
            ...data,
            agent_id: selectedAgent || null
          })
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
          .insert({
            ...data,
            agent_id: selectedAgent || null
          });
        
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
    if (!formData.id) {
      console.error('Property ID is required');
      return;
    }

    // Create a propertyData object with the required id
    const propertyData: PropertyData = {
      ...formData,
      id: formData.id, // This ensures id is treated as required
      features: formData.features || [],
      images: formData.images || [],
      floorplans: formData.floorplans || [],
      areas: formData.areas || [],
      title: formData.title || '',
      price: formData.price || '',
      address: formData.address || '',
      bedrooms: formData.bedrooms || '',
      bathrooms: formData.bathrooms || '',
      sqft: formData.sqft || '',
      livingArea: formData.livingArea || '',
      buildYear: formData.buildYear || '',
      garages: formData.garages || '',
      energyLabel: formData.energyLabel || '',
      hasGarden: formData.hasGarden || false,
      description: formData.description || '',
      featuredImage: formData.featuredImage || null,
      gridImages: formData.gridImages || []
    };

    const submitData: PropertySubmitData = {
      id: propertyData.id,
      title: propertyData.title,
      price: propertyData.price,
      address: propertyData.address,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      sqft: propertyData.sqft,
      livingArea: propertyData.livingArea,
      buildYear: propertyData.buildYear,
      garages: propertyData.garages,
      energyLabel: propertyData.energyLabel,
      hasGarden: propertyData.hasGarden,
      description: propertyData.description,
      location_description: propertyData.location_description,
      floorplans: propertyData.floorplans,
      featuredImage: propertyData.featuredImage,
      gridImages: propertyData.gridImages,
      areaPhotos: propertyData.areaPhotos,
      features: propertyData.features as unknown as Json,
      areas: propertyData.areas as unknown as Json[],
      nearby_places: propertyData.nearby_places as unknown as Json,
      images: propertyData.images.map(img => img.url),
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
      object_id: propertyData.object_id,
      map_image: propertyData.map_image,
      agent_id: selectedAgent || null
    };
    
    handleDatabaseSubmit(submitData);
  };

  const { formData, setFormData, isLoading } = usePropertyForm(id, handleFormSubmit);
  const {
    handleImageUpload,
    handleRemoveImage,
  } = usePropertyImages(formData, setFormData);

  useEffect(() => {
    if (formData?.agent_id) {
      setSelectedAgent(formData.agent_id);
    }
  }, [formData?.agent_id]);

  const handleDeleteProperty = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted",
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete the property",
        variant: "destructive",
      });
    }
  };

  if (!formData) {
    return null;
  }

  // Cast formData to PropertyData when we know id exists
  const propertyDataWithId: PropertyData = {
    ...formData,
    id: formData.id || crypto.randomUUID(), // Provide a new ID if none exists
    features: formData.features || [],
    images: formData.images || [],
    floorplans: formData.floorplans || [],
    areas: formData.areas || [],
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    sqft: formData.sqft || '',
    livingArea: formData.livingArea || '',
    buildYear: formData.buildYear || '',
    garages: formData.garages || '',
    energyLabel: formData.energyLabel || '',
    hasGarden: formData.hasGarden || false,
    description: formData.description || '',
    featuredImage: formData.featuredImage || null,
    gridImages: formData.gridImages || []
  };

  const apiEndpoint = `${window.location.origin}/api/properties/${propertyDataWithId.id}`;

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-estate-800">
            {id ? "Edit Property" : "New Property"}
          </h1>
        </div>

        {propertyDataWithId.id && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription className="font-mono">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">ID:</span> {propertyDataWithId.id}
                    </div>
                    <div>
                      <span className="font-semibold">Object ID:</span> {propertyDataWithId.object_id || 'Not set'}
                    </div>
                    <div>
                      <span className="font-semibold">API Endpoint:</span>
                      <Code className="ml-2">{apiEndpoint}</Code>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-6">
          <PropertyForm onSubmit={handleFormSubmit} />
          <div className="w-80 shrink-0 space-y-6">
            {id && (
              <PropertyActions
                property={propertyDataWithId}
                settings={settings}
                onDelete={handleDeleteProperty}
                onSave={() => handleFormSubmit(formData)}
              />
            )}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedAgent}
                    onValueChange={setSelectedAgent}
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
              images={propertyDataWithId.images.map(img => img.url)}
              onImageUpload={handleImageUpload}
              onRemoveImage={(index) => {
                const imageToRemove = propertyDataWithId.images[index];
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
