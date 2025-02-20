
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyArea } from "@/types/property";
import { PlusCircle, MinusCircle } from "lucide-react";

interface PropertyAreasProps {
  areas: PropertyArea[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
}

export function PropertyAreas({
  areas,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
}: PropertyAreasProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Areas and Floors</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Area
        </Button>
      </div>
      {areas.map((area) => (
        <div key={area.id} className="space-y-4 border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Input
              value={area.title}
              onChange={(e) => onUpdate(area.id, 'title', e.target.value)}
              placeholder="Area Title"
              className="flex-1 mr-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(area.id)}
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          <Textarea
            value={area.description}
            onChange={(e) => onUpdate(area.id, 'description', e.target.value)}
            placeholder="Area Description"
          />
        </div>
      ))}
    </div>
  );
}
