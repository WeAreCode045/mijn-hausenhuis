
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Upload, Trash2, Plus, Bus, Train } from "lucide-react";
import { useLocationData } from "./location/useLocationData";
import { useMapImage } from "./location/useMapImage";
import { MapPreview } from "./location/MapPreview";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyPlaceType } from "@/types/property";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PropertyLocationProps {
  id?: string;
  address: string;
  description?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationFetch: () => Promise<void>;
  onMapImageDelete?: () => void;
  onMapImageUpload?: (url: string) => void;
}

export function PropertyLocation({
  id,
  address,
  description,
  map_image,
  nearby_places = [],
  onChange,
  onLocationFetch,
  onMapImageDelete,
  onMapImageUpload,
}: PropertyLocationProps) {
  const { isLoading, fetchLocationData } = useLocationData();
  const { isUploading, uploadMapImage } = useMapImage();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return;

    const file = e.target.files[0];
    const url = await uploadMapImage(file);
    
    if (url) {
      try {
        const { error } = await supabase
          .from('properties')
          .update({ map_image: url })
          .eq('id', id);

        if (error) throw error;

        if (onMapImageUpload) {
          onMapImageUpload(url);
        }
      } catch (error) {
        console.error('Error updating property with map image:', error);
      }
    }

    e.target.value = '';
  };

  const handleLocationFetch = async () => {
    const data = await fetchLocationData(address, id);
    if (data) {
      await onLocationFetch();
    }
  };

  const handleGenerateDescription = async () => {
    if (!id || !address) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-location-description', {
        body: { address, nearbyPlaces: nearby_places }
      });

      if (error) throw error;

      if (data?.description) {
        const { error: updateError } = await supabase
          .from('properties')
          .update({ description: data.description })
          .eq('id', id);

        if (updateError) throw updateError;

        // Create a synthetic event to update the form state
        const event = {
          target: {
            name: 'description',
            value: data.description
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        
        onChange(event);

        toast({
          description: "Location description generated successfully",
        });
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: "destructive",
        description: "Failed to generate location description",
      });
    }
  };

  const handlePlaceDelete = async (e: React.MouseEvent, placeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;

    try {
      const updatedPlaces = nearby_places.filter(place => place.id !== placeId);

      const { error } = await supabase
        .from('properties')
        .update({ nearby_places: updatedPlaces })
        .eq('id', id);

      if (error) throw error;

      await onLocationFetch();
      toast({
        description: "Place removed successfully",
      });
    } catch (error) {
      console.error('Error removing place:', error);
      toast({
        variant: "destructive",
        description: "Failed to remove place",
      });
    }
  };

  const placesByType = nearby_places.reduce((acc: Record<string, PropertyPlaceType[]>, place) => {
    let type = place.type;
    if (['bus_station', 'train_station', 'transit_station'].includes(place.type)) {
      type = 'public_transport';
    }
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(place);
    return acc;
  }, {});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public_transport':
        return <Bus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatPlaceType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            name="address"
            value={address}
            onChange={onChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleLocationFetch}
            disabled={isLoading || !id}
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            Fetch Location
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGenerateDescription}
            disabled={!address || !nearby_places.length}
          >
            Generate Description
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="map-image-upload"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              asChild
            >
              <label htmlFor="map-image-upload" className="cursor-pointer">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Map
              </label>
            </Button>
          </div>
        </div>
      </div>

      {map_image && (
        <MapPreview 
          map_image={map_image} 
          onDelete={onMapImageDelete ?? (() => {})} 
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Location Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          className="min-h-[200px]"
          placeholder="Generate a description using the button above..."
        />
      </div>

      {Object.entries(placesByType).length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Nearby Places</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(placesByType).map(([type, places]) => (
              <div key={type} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 capitalize flex items-center gap-2">
                  {getTypeIcon(type)}
                  {formatPlaceType(type)}
                </h4>
                <ul className="space-y-2">
                  {places.map((place) => (
                    <li key={place.id} className="text-sm">
                      <div className="flex items-start justify-between group">
                        <div>
                          <span className="font-medium">{place.name}</span>
                          {place.rating && (
                            <span className="text-yellow-500 ml-2">★ {place.rating}</span>
                          )}
                          {place.vicinity && (
                            <p className="text-gray-500 text-xs mt-1">{place.vicinity}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handlePlaceDelete(e, place.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
