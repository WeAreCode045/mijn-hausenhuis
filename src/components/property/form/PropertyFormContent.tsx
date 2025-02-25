import { PropertyDetails } from "../PropertyDetails";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyAreas } from "../PropertyAreas";
import { PropertyImages } from "../PropertyImages";
import type { PropertyFormData } from "@/types/property";

interface PropertyFormContentProps {
  step: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, field: keyof { id: string; description: string; }, value: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof { id: string; title: string; description: string; imageIds: string[]; }, value: string | string[]) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (index: number) => Promise<void>;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete: () => void;
}

export function PropertyFormContent({ 
  step, 
  formData, 
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete
}: PropertyFormContentProps) {
  const steps = [
    <PropertyDetails key="details" formData={formData} onFieldChange={onFieldChange} />,
    <PropertyFeatures 
      key="features"
      features={formData.features} 
      onAdd={onAddFeature}
      onRemove={onRemoveFeature}
      onUpdate={onUpdateFeature}
    />,
    <PropertyLocation 
      key="location"
      address={formData.address}
      location_description={formData.location_description}
      map_image={formData.map_image}
      latitude={formData.latitude}
      longitude={formData.longitude}
      nearby_places={formData.nearby_places}
      onFieldChange={onFieldChange}
      onMapImageDelete={handleMapImageDelete}
    />,
    <PropertyAreas
      key="areas"
      areas={formData.areas}
      images={formData.images}
      onAdd={onAddArea}
      onRemove={onRemoveArea}
      onUpdate={onUpdateArea}
      onImageUpload={onAreaImageUpload}
      onImageRemove={onAreaImageRemove}
    />,
    <PropertyImages 
      key="images"
      images={formData.images}
      areaPhotos={formData.areaPhotos}
      floorplans={formData.floorplans}
      featuredImage={formData.featuredImage}
      gridImages={formData.gridImages}
      handleImageUpload={handleImageUpload}
      handleAreaPhotosUpload={handleAreaPhotosUpload}
      handleFloorplanUpload={handleFloorplanUpload}
      handleRemoveImage={handleRemoveImage}
      handleRemoveAreaPhoto={handleRemoveAreaPhoto}
      handleRemoveFloorplan={handleRemoveFloorplan}
      handleSetFeaturedImage={handleSetFeaturedImage}
      handleToggleGridImage={handleToggleGridImage}
    />
  ];

  return (
    <div className="space-y-8">
      {steps[step]}
    </div>
  );
}
