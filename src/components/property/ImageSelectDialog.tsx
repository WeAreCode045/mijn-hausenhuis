
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImageSelectDialogProps {
  images: string[];
  onSelect: (url: string) => void;
  buttonText: string;
}

export function ImageSelectDialog({
  images,
  onSelect,
  buttonText,
}: ImageSelectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Image className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-4">
          {images.map((url) => (
            <div
              key={url}
              className="relative group cursor-pointer"
              onClick={() => {
                onSelect(url);
                setOpen(false);
              }}
            >
              <img
                src={url}
                alt="Property"
                className="w-full aspect-square object-cover rounded-lg hover:ring-2 hover:ring-primary transition-all"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
