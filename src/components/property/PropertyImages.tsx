
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ImageSelectDialog } from "./ImageSelectDialog";

interface PropertyImagesProps {
  images: string[];
  floorplans: string[];
  featuredImage: string | null;
  gridImages: string[];
  areaPhotos?: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFeaturedImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGridImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveFloorplan: (index: number) => void;
  onRemoveAreaPhoto: (index: number) => void;
  onSetFeaturedImage: (url: string | null) => void;
  onToggleGridImage: (gridImages: string[]) => void;
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
  onImageUpload,
  onFeaturedImageUpload,
  onGridImageUpload,
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
  const handleGridImagesSelect = (selectedUrls: string[]) => {
    const newGridImages = [...gridImages];
    selectedUrls.forEach(url => {
      if (newGridImages.length < 4 && !newGridImages.includes(url)) {
        newGridImages.push(url);
      }
    });
    onToggleGridImage(newGridImages);
  };

  return (
    <div className="space-y-6">
      {showOnlyPropertyImages && (
        <div className="space-y-4">
          <div className="space-y-4">
            <Label>Featured Image</Label>
            <div className="relative group">
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured property"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6"
                    onClick={() => onSetFeaturedImage(null)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <ImageSelectDialog
                  images={images}
                  onSelect={(urls) => onSetFeaturedImage(urls[0])}
                  buttonText="Select Featured Image"
                  maxSelect={1}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Grid Images (4 images)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gridImages.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Grid photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6"
                      onClick={() => {
                        const newGridImages = [...gridImages];
                        newGridImages.splice(index, 1);
                        onToggleGridImage(newGridImages);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {gridImages.length < 4 && (
                <ImageSelectDialog
                  images={images.filter(img => !gridImages.includes(img))}
                  onSelect={handleGridImagesSelect}
                  buttonText="Add Grid Images"
                  maxSelect={4 - gridImages.length}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showOnlyFloorplans && (
        <div className="space-y-4">
          <Label>Floorplans (Max 10)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {floorplans.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Floorplan ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                  onClick={() => onRemoveFloorplan(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Input
            type="file"
            onChange={onFloorplanUpload}
            accept="image/*"
            multiple
            className="mt-2"
          />
        </div>
      )}

      {showOnlyAreaPhotos && (
        <div className="space-y-4">
          <Label>Area Photos (Max 6)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {areaPhotos.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Area photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                  onClick={() => onRemoveAreaPhoto(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Input
            type="file"
            onChange={onAreaPhotosUpload}
            accept="image/*"
            multiple
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
}
