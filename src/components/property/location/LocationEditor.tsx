
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocationEditorProps {
  id?: string;
  location_description?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function LocationEditor({ location_description, onChange }: LocationEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location_description">Locatiebeschrijving</Label>
      <Textarea
        id="location_description"
        name="location_description"
        value={location_description || ""}
        onChange={onChange}
        className="min-h-[200px] resize-none"
        placeholder="Voer een locatiebeschrijving in..."
      />
    </div>
  );
}
