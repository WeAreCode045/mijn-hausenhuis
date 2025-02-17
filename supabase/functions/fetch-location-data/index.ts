
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface GooglePlacesResult {
  name: string;
  types: string[];
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address, apiKey, propertyId } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // First, geocode the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('Location not found')
    }

    const location = geocodeData.results[0].geometry.location
    const { lat, lng } = location

    // Get static map image
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`
    
    // Fetch the map image
    const mapImageResponse = await fetch(mapImageUrl)
    const mapImageBlob = await mapImageResponse.blob()

    // Generate a unique filename for the map image
    const filename = `${propertyId}/map-${Date.now()}.png`

    // Upload the map image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('map_images')
      .upload(filename, mapImageBlob, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL of the uploaded image
    const { data: { publicUrl: mapPublicUrl } } = supabase.storage
      .from('map_images')
      .getPublicUrl(filename)

    // Fetch nearby places
    const places: { [key: string]: GooglePlacesResult[] } = {
      education: [],
      shopping: [],
      train: [],
      bus: [],
      sports: []
    };

    const placeTypes = [
      { type: 'school', category: 'education' },
      { type: 'shopping_mall', category: 'shopping' },
      { type: 'train_station', category: 'train' },
      { type: 'bus_station', category: 'bus' },
      { type: 'gym', category: 'sports' }
    ];

    // Fetch places for each type
    for (const { type, category } of placeTypes) {
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${apiKey}`
      const placesResponse = await fetch(nearbyUrl)
      const placesData = await placesResponse.json()

      if (placesData.results) {
        places[category] = placesData.results.map((place: GooglePlacesResult) => ({
          id: place.place_id,
          name: place.name,
          type: type,
          vicinity: place.vicinity,
          rating: place.rating || 0,
          user_ratings_total: place.user_ratings_total || 0
        }));
      }
    }

    // Filter places to include only those with ratings >= 4
    const nearbyPlaces = Object.values(places)
      .flat()
      .filter(place => place.rating >= 4)
      .slice(0, 10); // Limit to top 10 places

    // Update the property with the new data
    const { error: updateError } = await supabase
      .from('properties')
      .update({
        latitude: lat,
        longitude: lng,
        map_image: mapPublicUrl,
        nearby_places: nearbyPlaces
      })
      .eq('id', propertyId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        latitude: lat,
        longitude: lng,
        map_image: mapPublicUrl,
        nearby_places: nearbyPlaces
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
