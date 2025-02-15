
import { PropertyForm } from "@/components/PropertyForm";
import type { PropertySubmitData } from "@/types/property";

export default function AddPropertyPage() {
  const handleSubmit = async (data: PropertySubmitData) => {
    console.log("New property submitted with data:", data);
    // Add logic to save the new property to the database
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Property</h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
