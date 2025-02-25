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
  handleRemoveAreaPhoto: (index: number) => Promise<void>;
  handleRemoveFloorplan: (index: number) => Promise<void>;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (urls: string[]) => void;
  handleMapImageDelete: () => Promise<void>;
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
    <PropertyDetails 
      key="details" 
      id={formData.id}
      title={formData.title}
      price={formData.price}
      address={formData.address}
      buildYear={formData.buildYear}
      sqft={formData.sqft}
      livingArea={formData.livingArea}
      bedrooms={formData.bedrooms}
      bathrooms={formData.bathrooms}
      garages={formData.garages}
      energyLabel={formData.energyLabel}
      hasGarden={formData.hasGarden}
      onChange={(e) => onFieldChange(e.target.name as keyof PropertyFormData, e.target.value)}
    />,
    <PropertyFeatures 
      key="features"
      features={formData.features} 
      onAdd={onAddFeature}
      onRemove={onRemoveFeature}
      onUpdate={(id, description) => onUpdateFeature(id, 'description', description)}
    />,
    <PropertyLocation 
      key="location"
      id={formData.id}
      address={formData.address}
      description={formData.description}
      location_description={formData.location_description}
      map_image={formData.map_image}
      nearby_places={formData.nearby_places}
      onChange={(e) => onFieldChange(e.target.name as keyof PropertyFormData, e.target.value)}
      onLocationFetch={async () => {}} // Add proper implementation if needed
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
      floorplans={formData.floorplans}
      areaPhotos={formData.areaPhotos}
      featuredImage={formData.featuredImage}
      gridImages={formData.gridImages}
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
  ];

  return (
    <div className="space-y-8">
      {steps[step]}
    </div>
  );
}
