
import { useState } from "react";
import type { PropertyFormData, PropertyArea } from "@/types/property";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertySubmit } from "@/hooks/usePropertySubmit";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFormState() {
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
    areas: [],
    areaPhotos: [],
  });

  const { toast } = useToast();
  const { handleSubmit } = usePropertySubmit();
  const { uploadFile } = useFileUpload();
  const {
    handleImageUpload,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveImage,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await uploadFile(file);
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        areas: prev.areas.map(area => 
          area.id === areaId 
            ? { ...area, images: [...area.images, ...uploadedUrls] }
            : area
        )
      }));

      toast({
        title: "Success",
        description: "Area images uploaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error uploading area images:', error);
      toast({
        title: "Error",
        description: "Failed to upload area images",
        variant: "destructive",
      });
    }
  };

  const addArea = () => {
    setFormData(prev => ({
      ...prev,
      areas: [
        ...prev.areas,
        {
          id: crypto.randomUUID(),
          title: '',
          description: '',
          images: []
        }
      ]
    }));
  };

  const removeArea = (id: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter(area => area.id !== id)
    }));
  };

  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.map(area => 
        area.id === id ? { ...area, [field]: value } : area
      )
    }));
  };

  const removeAreaImage = (areaId: string, imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.map(area => 
        area.id === areaId
          ? { ...area, images: area.images.filter(url => url !== imageUrl) }
          : area
      )
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleAreaImageUpload,
    addArea,
    removeArea,
    updateArea,
    removeAreaImage,
    handleImageUpload,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveImage,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    onSubmit
  };
}
