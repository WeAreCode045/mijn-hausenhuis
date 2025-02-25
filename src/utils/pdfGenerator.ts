
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { pdf } from '@react-pdf/renderer';
import { PropertyBrochureDocument } from './pdf/PropertyBrochureDocument';
import { supabase } from '@/integrations/supabase/client';
import type { Section } from '@/components/brochure/TemplateBuilder';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings, templateId?: string) => {
  try {
    let template;
    let agent;
    
    // Fetch template if templateId is provided
    if (templateId) {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) throw error;
      template = data;
    }

    // Fetch agent details if agent_id is present
    if (property.agent_id) {
      const { data: agentData, error: agentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', property.agent_id)
        .single();

      if (!agentError && agentData) {
        agent = agentData;
      }
    }

    // Ensure all arrays exist and are properly populated
    const sanitizedProperty = {
      ...property,
      areas: property.areas.map(area => ({
        ...area,
        imageIds: (area.imageIds || []).filter(id => 
          property.images.some(img => img.id === id)
        ) // Filter out deleted images
      })),
      images: property.images || [],
      gridImages: (property.gridImages || []).slice(0, 3), // Limit to 3 images for cover grid
      features: (property.features || []).slice(0, 10),
      nearby_places: (property.nearby_places || []).slice(0, 5),
      agent: agent // Add agent details to property
    };

    console.log('Generating PDF with areas:', sanitizedProperty.areas);
    console.log('Total images:', sanitizedProperty.images.length);
    console.log('Agent details:', agent);

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
