
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyDetails } from "./property/PropertyDetails";
import { PropertyFeatures } from "./property/PropertyFeatures";
import { PropertyDescription } from "./property/PropertyDescription";
import { PropertyImages } from "./property/PropertyImages";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertySubmit } from "@/hooks/usePropertySubmit";
import type { PropertyFormData } from "@/types/property";

export function AddPropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    livingArea: "",
    buildYear: "",
    garages: "",
    energyLabel: "",
    hasGarden: false,
    description: "",
    features: [],
    images: [],
    floorplans: [],
    featuredImage: null,
    gridImages: [],
  });

  const { handleSubmit } = usePropertySubmit();
  const {
    handleImageUpload,
    handleFloorplanUpload,
    handleRemoveImage,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <form onSubmit={onSubmit} className="space-y-6">
        <PropertyDetails
          {...formData}
          onChange={handleInputChange}
        />

        <PropertyDescription
          description={formData.description}
          onChange={handleInputChange}
        />

        <PropertyFeatures
          features={formData.features}
          onAdd={() => setFormData(prev => ({
            ...prev,
            features: [...prev.features, { id: Date.now().toString(), description: "" }]
          }))}
          onRemove={(id) => setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f.id !== id)
          }))}
          onUpdate={(id, description) => setFormData(prev => ({
            ...prev,
            features: prev.features.map(f =>
              f.id === id ? { ...f, description } : f
            )
          }))}
        />

        <PropertyImages
          images={formData.images}
          floorplans={formData.floorplans}
          featuredImage={formData.featuredImage}
          gridImages={formData.gridImages}
          onImageUpload={handleImageUpload}
          onFloorplanUpload={handleFloorplanUpload}
          onRemoveImage={handleRemoveImage}
          onRemoveFloorplan={handleRemoveFloorplan}
          onSetFeaturedImage={handleSetFeaturedImage}
          onToggleGridImage={handleToggleGridImage}
        />

        <Button type="submit">Add Property</Button>
      </form>
    </Card>
  );
}
