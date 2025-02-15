
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Pencil, Trash } from "lucide-react";

interface PropertyCardActionsProps {
  propertyId: string;
  onWebViewOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PropertyCardActions = ({
  onWebViewOpen,
  onEdit,
  onDelete
}: PropertyCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={onWebViewOpen}
        title="Open Preview"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onEdit}
        title="Bewerk"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="destructive" 
        size="icon"
        onClick={onDelete}
        title="Verwijder"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
