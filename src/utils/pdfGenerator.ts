
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { pdf } from '@react-pdf/renderer';
import { PropertyBrochureDocument } from './pdf/PropertyBrochureDocument';
import { supabase } from '@/integrations/supabase/client';
import type { Section } from '@/components/brochure/TemplateBuilder';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings, templateId?: string) => {
  try {
    let template;
    
    if (templateId) {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) throw error;
      template = data;
    }

    // Sanitize the property data to ensure valid arrays
    const sanitizedProperty = {
      ...property,
      // Ensure arrays exist and have reasonable lengths
      gridImages: (property.gridImages || []).slice(0, 6),
      features: (property.features || []).slice(0, 10),
      nearby_places: (property.nearby_places || []).slice(0, 5),
      areas: (property.areas || []).slice(0, 4),
      images: (property.images || []).slice(0, 20)
    };

    const blob = await pdf(PropertyBrochureDocument({ 
      property: sanitizedProperty, 
      settings,
      template: template?.sections as Section[] | undefined
    })).toBlob();
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
