
import { useToast } from "@/components/ui/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        const { data, error } = await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: publicUrl
          })
          .select('id, url')
          .single();

        if (error) throw error;

        return data as PropertyImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages]
      });

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setFormData({
        ...formData,
        images: formData.images.filter(img => img.id !== imageId)
      });

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleAreaPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/location/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      
      setFormData({
        ...formData,
        areaPhotos: [...(formData.areaPhotos || []), ...urls]
      });

      toast({
        title: "Success",
        description: "Area photos uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading area photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload area photos",
        variant: "destructive",
      });
    }
  };

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      
      setFormData({
        ...formData,
        floorplans: [...formData.floorplans, ...urls]
      });

      toast({
        title: "Success",
        description: "Floorplans uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading floorplans:', error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAreaPhoto = (index: number) => {
    setFormData({
      ...formData,
      areaPhotos: formData.areaPhotos?.filter((_, i) => i !== index) || []
    });
  };

  const handleRemoveFloorplan = (index: number) => {
    setFormData({
      ...formData,
      floorplans: formData.floorplans.filter((_, i) => i !== index)
    });
  };

  const handleSetFeaturedImage = (url: string | null) => {
    setFormData({
      ...formData,
      featuredImage: url
    });
  };

  const handleToggleGridImage = (urls: string[]) => {
    setFormData({
      ...formData,
      gridImages: urls
    });
  };

  return {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  };
}
