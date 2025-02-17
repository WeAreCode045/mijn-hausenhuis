
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useMapImage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMapImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    setIsUploading(true);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('map_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('map_images')
        .getPublicUrl(fileName);

      console.log('Map image uploaded, public URL:', publicUrl); // Add logging

      toast({
        description: "Map image uploaded successfully",
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading map image:', error);
      toast({
        variant: "destructive",
        description: "Failed to upload map image",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadMapImage,
  };
}
