
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { ImageSelectDialog } from "../ImageSelectDialog";

interface GridImagesSectionProps {
  gridImages: string[];
  images: PropertyImage[];
  onToggleGridImage: (urls: string[]) => void;
}

export function GridImagesSection({
  gridImages,
  images,
  onToggleGridImage,
}: GridImagesSectionProps) {
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
            images={images.filter(img => !gridImages.includes(img.url))}
            onSelect={handleGridImagesSelect}
            buttonText="Add Grid Images"
            maxSelect={4 - gridImages.length}
          />
        )}
      </div>
    </div>
  );
}
