
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, nearbyPlaces } = await req.json();

    const placesDescription = nearbyPlaces.map((place: any) => 
      `${place.name} (${place.type.replace(/_/g, ' ')})`
    ).join(', ');

    const prompt = `Write a brief, engaging description (max 3 sentences) of this location: "${address}". 
                   Include relevant information about these nearby places: ${placesDescription}.
                   Focus on the convenience and lifestyle benefits of the location.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a real estate expert who writes concise, appealing location descriptions.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const description = data.choices[0].message.content;

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
