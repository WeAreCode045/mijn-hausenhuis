
import { PropertyDetails } from "../PropertyDetails";
import { PropertyDescription } from "../PropertyDescription";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyAreas } from "../PropertyAreas";
import { PropertyImages } from "../PropertyImages";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyNearbyPlaces } from "../PropertyNearbyPlaces";
import { transformNearbyPlaces } from "./transformUtils";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyArea } from "@/types/property";

interface PropertyFormContentProps {
  currentStep: number;
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  id?: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (gridImages: string[]) => void;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  handleAreaImageUpload: (id: string, files: FileList) => void;
  removeAreaImage: (areaId: string, imageUrl: string) => void;
  handleMapImageDelete: () => void;
}

export function PropertyFormContent({
  currentStep,
  formData,
  setFormData,
  handleInputChange,
  id,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  addFeature,
  removeFeature,
  updateFeature,
  addArea,
  removeArea,
  updateArea,
  handleAreaImageUpload,
  removeAreaImage,
  handleMapImageDelete,
}: PropertyFormContentProps) {
  switch (currentStep) {
    case 1:
      return (
        <>
          <PropertyDetails
            {...formData}
            onChange={handleInputChange}
          />
          <PropertyDescription
            description={formData.description}
            onChange={handleInputChange}
          />
          <div className="space-y-4">
            <PropertyImages
              images={formData.images}
              floorplans={[]}
              areaPhotos={[]}
              featuredImage={formData.featuredImage}
              gridImages={formData.gridImages}
              onImageUpload={handleImageUpload}
              onFeaturedImageUpload={handleImageUpload}
              onGridImageUpload={handleImageUpload}
              onFloorplanUpload={() => {}}
              onAreaPhotosUpload={() => {}}
              onRemoveImage={handleRemoveImage}
              onRemoveAreaPhoto={() => {}}
              onRemoveFloorplan={() => {}}
              onSetFeaturedImage={handleSetFeaturedImage}
              onToggleGridImage={handleToggleGridImage}
              showOnlyPropertyImages={true}
            />
          </div>
        </>
      );
    case 2:
      return (
        <PropertyFeatures
          features={formData.features}
          onAdd={addFeature}
          onRemove={removeFeature}
          onUpdate={updateFeature}
        />
      );
    case 3:
      return (
        <PropertyAreas
          areas={formData.areas || []}
          onAdd={addArea}
          onRemove={removeArea}
          onUpdate={updateArea}
          onImageUpload={handleAreaImageUpload}
          onImageRemove={removeAreaImage}
        />
      );
    case 4:
      return (
        <div className="space-y-4">
          <PropertyImages
            images={[]}
            floorplans={formData.floorplans}
            areaPhotos={[]}
            featuredImage={null}
            gridImages={[]}
            onImageUpload={() => {}}
            onFeaturedImageUpload={() => {}}
            onGridImageUpload={() => {}}
            onAreaPhotosUpload={() => {}}
            onFloorplanUpload={handleFloorplanUpload}
            onRemoveImage={() => {}}
            onRemoveAreaPhoto={() => {}}
            onRemoveFloorplan={handleRemoveFloorplan}
            onSetFeaturedImage={() => {}}
            onToggleGridImage={() => {}}
            showOnlyFloorplans={true}
          />
        </div>
      );
    case 5:
      return (
        <div className="space-y-6">
          <PropertyLocation
            id={id}
            address={formData.address}
            map_image={formData.map_image}
            nearby_places={formData.nearby_places}
            location_description={formData.location_description}
            onChange={handleInputChange}
            onLocationFetch={async () => {
              if (id) {
                const { data, error } = await supabase
                  .from('properties')
                  .select('*')
                  .eq('id', id)
                  .single();

                if (!error && data) {
                  setFormData({
                    ...formData,
                    map_image: data.map_image || null,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    nearby_places: transformNearbyPlaces(data.nearby_places)
                  });
                }
              }
            }}
            onMapImageDelete={handleMapImageDelete}
          />
          <div className="mt-6">
            <PropertyImages
              images={[]}
              floorplans={[]}
              areaPhotos={formData.areaPhotos || []}
              featuredImage={null}
              gridImages={[]}
              onImageUpload={() => {}}
              onFeaturedImageUpload={() => {}}
              onGridImageUpload={() => {}}
              onAreaPhotosUpload={handleAreaPhotosUpload}
              onFloorplanUpload={() => {}}
              onRemoveImage={() => {}}
              onRemoveAreaPhoto={handleRemoveAreaPhoto}
              onRemoveFloorplan={() => {}}
              onSetFeaturedImage={() => {}}
              onToggleGridImage={() => {}}
              showOnlyAreaPhotos={true}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
