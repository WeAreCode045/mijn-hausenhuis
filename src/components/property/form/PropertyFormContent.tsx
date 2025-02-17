import { Button } from "@/components/ui/button";
import { PropertyDetails } from "../PropertyDetails";
import { PropertyDescription } from "../PropertyDescription";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyAreas } from "../PropertyAreas";
import { PropertyImages } from "../PropertyImages";
import type { PropertyFormData, PropertyArea } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { transformNearbyPlaces } from "./transformUtils";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyNearbyPlaces } from "../PropertyNearbyPlaces";

interface PropertyFormContentProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData | ((prev: PropertyFormData) => PropertyFormData)) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => void;
  removeAreaImage: (areaId: string, imageUrl: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (gridImages: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PropertyFormContent({
  formData,
  setFormData,
  handleInputChange,
  addArea,
  removeArea,
  updateArea,
  handleAreaImageUpload,
  removeAreaImage,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  onSubmit
}: PropertyFormContentProps) {
  const { toast } = useToast();

  const loadLocationData = async () => {
    if (!formData.id) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('map_image, latitude, longitude, nearby_places')
        .eq('id', formData.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData((prev: PropertyFormData) => ({
          ...prev,
          map_image: data.map_image || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          nearby_places: transformNearbyPlaces(data.nearby_places)
        }));
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      toast({
        variant: "destructive",
        description: "Failed to load location data"
      });
    }
  };

  const handleMapImageDelete = async () => {
    if (!formData.id) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ map_image: null })
        .eq('id', formData.id);

      if (error) throw error;

      setFormData((prev: PropertyFormData) => ({
        ...prev,
        map_image: null
      }));

      toast({
        description: "Map image removed successfully"
      });
    } catch (error) {
      console.error('Error removing map image:', error);
      toast({
        variant: "destructive",
        description: "Failed to remove map image"
      });
    }
  };

  const handleMapImageUpload = async (url: string) => {
    if (!formData.id) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ map_image: url })
        .eq('id', formData.id);

      if (error) throw error;

      setFormData((prev: PropertyFormData) => ({
        ...prev,
        map_image: url
      }));

      toast({
        description: "Map image updated successfully"
      });
    } catch (error) {
      console.error('Error updating map image:', error);
      toast({
        variant: "destructive",
        description: "Failed to update map image"
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PropertyDetails
        {...formData}
        onChange={handleInputChange}
      />

      <PropertyLocation
        id={formData.id}
        address={formData.address}
        map_image={formData.map_image}
        onChange={handleInputChange}
        onLocationFetch={async () => {
          if (formData.id) {
            await loadLocationData();
            toast({
              description: "Location data updated successfully"
            });
          }
        }}
        onMapImageDelete={handleMapImageDelete}
        onMapImageUpload={handleMapImageUpload}
      />

      {formData.nearby_places && formData.nearby_places.length > 0 && (
        <PropertyNearbyPlaces places={formData.nearby_places} />
      )}

      <PropertyDescription
        description={formData.description}
        onChange={handleInputChange}
      />

      <PropertyFeatures
        features={formData.features}
        onAdd={() => setFormData((prev: PropertyFormData) => ({
          ...prev,
          features: [...prev.features, { id: Date.now().toString(), description: "" }]
        }))}
        onRemove={(id) => setFormData((prev: PropertyFormData) => ({
          ...prev,
          features: prev.features.filter(f => f.id !== id)
        }))}
        onUpdate={(id, description) => setFormData((prev: PropertyFormData) => ({
          ...prev,
          features: prev.features.map(f =>
            f.id === id ? { ...f, description } : f
          )
        }))}
      />

      <PropertyAreas
        areas={formData.areas}
        onAdd={addArea}
        onRemove={removeArea}
        onUpdate={updateArea}
        onImageUpload={handleAreaImageUpload}
        onImageRemove={removeAreaImage}
      />

      <PropertyImages
        images={formData.images}
        floorplans={formData.floorplans}
        areaPhotos={formData.areaPhotos}
        featuredImage={formData.featuredImage}
        gridImages={formData.gridImages}
        onImageUpload={handleImageUpload}
        onAreaPhotosUpload={handleAreaPhotosUpload}
        onFloorplanUpload={handleFloorplanUpload}
        onRemoveImage={handleRemoveImage}
        onRemoveAreaPhoto={handleRemoveAreaPhoto}
        onRemoveFloorplan={handleRemoveFloorplan}
        onSetFeaturedImage={handleSetFeaturedImage}
        onToggleGridImage={handleToggleGridImage}
      />

      <Button type="submit">Add Property</Button>
    </form>
  );
}
