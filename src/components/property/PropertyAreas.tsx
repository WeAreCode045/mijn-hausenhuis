
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyArea } from "@/types/property";
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ImageSelectDialog } from "./ImageSelectDialog";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useParams } from "react-router-dom";

interface PropertyAreasProps {
  areas: PropertyArea[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageUrl: string) => void;
}

export function PropertyAreas({
  areas,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
}: PropertyAreasProps) {
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const { id } = useParams();
  const { formData } = usePropertyForm(id, () => {});

  const toggleArea = (id: string) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  const handleImagesSelect = (areaId: string, selectedUrls: string[]) => {
    onUpdate(areaId, 'images', [...areas.find(a => a.id === areaId)?.images || [], ...selectedUrls]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Ruimtes en Verdiepingen</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Ruimte Toevoegen
        </Button>
      </div>
      
      {areas.map((area) => (
        <div 
          key={area.id} 
          className="border rounded-lg overflow-hidden"
        >
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleArea(area.id)}
          >
            <div className="flex items-center gap-2">
              {expandedArea === area.id ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium">
                {area.title || "Nieuwe Ruimte"}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(area.id);
              }}
              className="shrink-0"
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          {expandedArea === area.id && (
            <div className="p-4 space-y-4 border-t">
              <div>
                <Label htmlFor={`area-title-${area.id}`}>Titel</Label>
                <Input
                  id={`area-title-${area.id}`}
                  value={area.title}
                  onChange={(e) => onUpdate(area.id, 'title', e.target.value)}
                  placeholder="Bijv. Woonkamer, Eerste Verdieping"
                />
              </div>
              
              <div>
                <Label htmlFor={`area-desc-${area.id}`}>Beschrijving</Label>
                <Textarea
                  id={`area-desc-${area.id}`}
                  value={area.description}
                  onChange={(e) => onUpdate(area.id, 'description', e.target.value)}
                  placeholder="Beschrijf deze ruimte..."
                />
              </div>

              <div>
                <Label>Foto's</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {area.images.map((imageUrl) => (
                    <div key={imageUrl} className="relative group">
                      <img
                        src={imageUrl}
                        alt={area.title}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onImageRemove(area.id, imageUrl)}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <ImageSelectDialog
                    images={formData?.images || []}
                    onSelect={(urls) => handleImagesSelect(area.id, urls)}
                    buttonText="Foto's Toevoegen"
                    maxSelect={6}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
