
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { PropertyAreas } from "@/components/property/PropertyAreas";

interface PropertyStepContentProps {
  step: number;
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof any, value: string | string[]) => void;
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

export function PropertyStepContent({
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
  handleMapImageDelete,
}: PropertyStepContentProps) {
  return (
    <div>
      {step === 0 && (
        <PropertyFormContent
          step={step}
          formData={formData}
          onFieldChange={onFieldChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onUpdateFeature={onUpdateFeature}
          onAddArea={onAddArea}
          onRemoveArea={onRemoveArea}
          onUpdateArea={onUpdateArea}
          onAreaImageUpload={onAreaImageUpload}
          onAreaImageRemove={onAreaImageRemove}
          handleImageUpload={async (e) => await handleImageUpload(e)}
          handleAreaPhotosUpload={async (e) => await handleAreaPhotosUpload(e)}
          handleFloorplanUpload={async (e) => await handleFloorplanUpload(e)}
          handleRemoveImage={async (index) => await handleRemoveImage(index)}
          handleRemoveAreaPhoto={async (index) => await handleRemoveAreaPhoto(index)}
          handleRemoveFloorplan={async (index) => await handleRemoveFloorplan(index)}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
          handleMapImageDelete={handleMapImageDelete}
        />
      )}
      {step === 1 && (
        <PropertyAreas
          areas={formData.areas}
          images={formData.images}
          onAdd={onAddArea}
          onRemove={onRemoveArea}
          onUpdate={onUpdateArea}
          onImageUpload={onAreaImageUpload}
          onImageRemove={onAreaImageRemove}
        />
      )}
    </div>
  );
}
