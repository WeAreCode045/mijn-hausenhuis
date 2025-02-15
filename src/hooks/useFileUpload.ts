
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload() {
  const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^\x00-\x7F]/g, '')}`;
    const { error } = await supabase.storage
      .from('agency_files')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('agency_files')
      .getPublicUrl(fileName);
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return publicUrl;
  };

  return { uploadFile };
}
