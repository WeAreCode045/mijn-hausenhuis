
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PropertyMediaLibraryProps {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PropertyMediaLibrary({
  images,
  onImageUpload,
  onRemoveImage,
}: PropertyMediaLibraryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Media Library</Label>
        <Input
          type="file"
          onChange={onImageUpload}
          accept="image/*"
          multiple
          className="max-w-[300px]"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Property photo ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
              onClick={() => onRemoveImage(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
