
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    // Fetch property data
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) throw error;

    // Generate enhanced descriptions using GPT-4
    const propertyPrompt = `
      Create a professional real estate brochure description for this property:
      Title: ${property.title}
      Price: ${property.price}
      Location: ${property.address}
      Features: ${property.features?.map((f: any) => f.description).join(', ')}
      Make it engaging, professional, and highlight the key selling points.
      Keep it under 300 words.
    `;

    const areaPrompt = `
      Create a compelling neighborhood description based on these nearby places:
      ${JSON.stringify(property.nearby_places)}
      Highlight the convenience and lifestyle benefits of the location.
      Keep it under 200 words.
    `;

    const [propertyResponse, areaResponse] = await Promise.all([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional real estate copywriter.' },
            { role: 'user', content: propertyPrompt }
          ],
        }),
      }),
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional real estate copywriter.' },
            { role: 'user', content: areaPrompt }
          ],
        }),
      })
    ]);

    const [propertyData, areaData] = await Promise.all([
      propertyResponse.json(),
      areaResponse.json()
    ]);

    const enhancedDescription = propertyData.choices[0].message.content;
    const enhancedAreaDescription = areaData.choices[0].message.content;

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add content to PDF
    // Title
    doc.setFontSize(24);
    doc.text(property.title, 20, 20);

    // Price
    doc.setFontSize(20);
    doc.text(`Price: ${property.price}`, 20, 35);

    // Main description
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(enhancedDescription, 170);
    doc.text(splitDescription, 20, 50);

    // Features
    doc.setFontSize(16);
    doc.text('Key Features:', 20, 120);
    doc.setFontSize(12);
    let yPosition = 130;
    property.features?.forEach((feature: any) => {
      doc.text(`• ${feature.description}`, 25, yPosition);
      yPosition += 7;
    });

    // Area description
    doc.addPage();
    doc.setFontSize(16);
    doc.text('The Neighborhood', 20, 20);
    doc.setFontSize(12);
    const splitAreaDesc = doc.splitTextToSize(enhancedAreaDescription, 170);
    doc.text(splitAreaDesc, 20, 35);

    // If there's a map image, add it
    if (property.map_image) {
      try {
        const mapImage = property.map_image.split(',')[1]; // Remove data:image/png;base64,
        doc.addImage(mapImage, 'PNG', 20, 100, 170, 85);
      } catch (error) {
        console.error('Error adding map image:', error);
      }
    }

    // Convert to base64
    const pdfOutput = doc.output('datauristring');

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf: pdfOutput 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
