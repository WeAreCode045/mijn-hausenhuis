import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PropertyDetails } from "../PropertyDetails";
import { PropertyDescription } from "../PropertyDescription";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyImages } from "../PropertyImages";
import { PropertyAreas } from "../PropertyAreas";
import { PropertyFormData, PropertyArea } from "@/types/property";

interface PropertyFormContentProps {
  formData: PropertyFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentStep: number;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (images: string[]) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  handleAreaImageUpload: (id: string, files: FileList) => void;
  removeAreaImage: (id: string, imageId: string) => void;
  handleMapImageDelete: () => Promise<void>;
}

export function PropertyFormContent({
  formData,
  onSubmit,
  currentStep,
  addFeature,
  removeFeature,
  updateFeature,
  handleInputChange,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  addArea,
  removeArea,
  updateArea,
  handleAreaImageUpload,
  removeAreaImage,
  handleMapImageDelete
}: PropertyFormContentProps) {
  if (!formData) return null;

  return (
    <div className="space-y-6">
      <PropertyDetails
        {...formData}
        onChange={handleInputChange}
      />

      <PropertyDescription
        description={formData.description}
        location_description={formData.location_description}
        onChange={handleInputChange}
      />

      <PropertyLocation
        id={formData.id}
        address={formData.address}
        description={formData.description}
        location_description={formData.location_description}
        map_image={formData.map_image}
        nearby_places={formData.nearby_places}
        onChange={handleInputChange}
        onLocationFetch={async () => {}}
        onMapImageDelete={handleMapImageDelete}
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
        areaPhotos={formData.areaPhotos}
        onImageUpload={handleImageUpload}
        onFeaturedImageUpload={handleImageUpload}
        onGridImageUpload={handleImageUpload}
        onFloorplanUpload={handleFloorplanUpload}
        onAreaPhotosUpload={handleAreaPhotosUpload}
        onRemoveImage={handleRemoveImage}
        onRemoveFloorplan={handleRemoveFloorplan}
        onRemoveAreaPhoto={handleRemoveAreaPhoto}
        onSetFeaturedImage={handleSetFeaturedImage}
        onToggleGridImage={handleToggleGridImage}
      />

      <PropertyAreas
        areas={formData.areas}
        onAdd={addArea}
        onRemove={removeArea}
        onUpdate={updateArea}
        onImageUpload={handleAreaImageUpload}
        onImageRemove={removeAreaImage}
      />
    </div>
  );
}
