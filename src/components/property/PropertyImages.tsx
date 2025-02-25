
import { PropertyImage } from "@/types/property";
import { FeaturedImageSection } from "./images/FeaturedImageSection";
import { GridImagesSection } from "./images/GridImagesSection";
import { FloorplansSection } from "./images/FloorplansSection";
import { AreaPhotosSection } from "./images/AreaPhotosSection";

interface PropertyImagesProps {
  images: PropertyImage[];
  floorplans: string[];
  featuredImage: string | null;
  gridImages: string[];
  areaPhotos?: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onFeaturedImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onGridImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: (index: number) => Promise<void>;
  onRemoveFloorplan: (index: number) => Promise<void>;
  onRemoveAreaPhoto: (index: number) => Promise<void>;
  onSetFeaturedImage: (url: string | null) => void;
  onToggleGridImage: (urls: string[]) => void;
  showOnlyPropertyImages?: boolean;
  showOnlyFloorplans?: boolean;
  showOnlyAreaPhotos?: boolean;
}

export function PropertyImages({
  images,
  floorplans,
  featuredImage,
  gridImages,
  areaPhotos = [],
  onFloorplanUpload,
  onAreaPhotosUpload,
  onRemoveImage,
  onRemoveFloorplan,
  onRemoveAreaPhoto,
  onSetFeaturedImage,
  onToggleGridImage,
  showOnlyPropertyImages = false,
  showOnlyFloorplans = false,
  showOnlyAreaPhotos = false
}: PropertyImagesProps) {
  return (
    <div className="space-y-6">
      {showOnlyPropertyImages && (
        <div className="space-y-4">
          <FeaturedImageSection
            featuredImage={featuredImage}
            images={images}
            onSetFeaturedImage={onSetFeaturedImage}
          />
          <GridImagesSection
            gridImages={gridImages}
            images={images}
            onToggleGridImage={onToggleGridImage}
          />
        </div>
      )}

      {showOnlyFloorplans && (
        <FloorplansSection
          floorplans={floorplans}
          onFloorplanUpload={onFloorplanUpload}
          onRemoveFloorplan={onRemoveFloorplan}
        />
      )}

      {showOnlyAreaPhotos && (
        <AreaPhotosSection
          areaPhotos={areaPhotos}
          onAreaPhotosUpload={onAreaPhotosUpload}
          onRemoveAreaPhoto={onRemoveAreaPhoto}
        />
      )}
    </div>
  );
}
