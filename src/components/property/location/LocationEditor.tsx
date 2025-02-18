
import { BlockNoteViewRaw } from "@blocknote/react";
import "@blocknote/core/style.css";
import { Label } from "@/components/ui/label";
import { useLocationEditor } from "./useLocationEditor";

interface LocationEditorProps {
  id?: string;
  location_description?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function LocationEditor({ id, location_description, onChange }: LocationEditorProps) {
  const editor = useLocationEditor(id, location_description, onChange);

  return (
    <div className="space-y-2">
      <Label htmlFor="location_description">Locatiebeschrijving</Label>
      <div className="min-h-[200px] border rounded-md overflow-hidden">
        <BlockNoteViewRaw 
          editor={editor}
        />
      </div>
    </div>
  );
}
