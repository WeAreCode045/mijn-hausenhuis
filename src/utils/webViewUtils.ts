
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from 'nanoid';

export async function getOrCreateWebViewUrl(propertyId: string): Promise<string | null> {
  try {
    // First, try to get existing web view URL
    const { data: existingView, error } = await supabase
      .from('property_web_views')
      .select('view_token')
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching web view:', error);
      return null;
    }

    if (existingView) {
      return `/property/view/${existingView.view_token}`;
    }

    // If no existing view, create a new one
    const viewToken = nanoid(10); // Generate a unique token
    
    const { error: insertError } = await supabase
      .from('property_web_views')
      .insert({
        property_id: propertyId,
        view_token: viewToken
      });

    if (insertError) {
      console.error('Error creating web view URL:', insertError);
      return null;
    }

    return `/property/view/${viewToken}`;
  } catch (error) {
    console.error('Unexpected error in getOrCreateWebViewUrl:', error);
    return null;
  }
}
