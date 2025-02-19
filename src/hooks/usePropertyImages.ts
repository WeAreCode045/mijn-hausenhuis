
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
    if (!formData.id || !e.target.files) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const url = await uploadFile(file);
        
        // Insert into property_images table
        const { data, error } = await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: url
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
    if (!formData.id) return;

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

  return {
    handleImageUpload,
    handleRemoveImage,
  };
}
