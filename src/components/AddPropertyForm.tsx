
import { Card } from "@/components/ui/card";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { usePropertyFormState } from "./property/form/usePropertyFormState";

export function AddPropertyForm() {
  const formState = usePropertyFormState();

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <PropertyFormContent {...formState} />
    </Card>
  );
}
