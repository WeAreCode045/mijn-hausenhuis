
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Upload } from "lucide-react";

interface AddressInputProps {
  address: string;
  isLoading: boolean;
  isUploading: boolean;
  disabled: boolean;
  hasNearbyPlaces: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationFetch: () => Promise<void>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateDescription: () => Promise<void>;
}

export function AddressInput({
  address,
  isLoading,
  isUploading,
  disabled,
  hasNearbyPlaces,
  onChange,
  onLocationFetch,
  onImageUpload,
  onGenerateDescription,
}: AddressInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="address">Adres</Label>
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
          onClick={onLocationFetch}
          disabled={isLoading || disabled}
          className="whitespace-nowrap"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2" />
          )}
          Locatie Ophalen
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onGenerateDescription}
          disabled={!address || !hasNearbyPlaces}
        >
          Beschrijving Genereren
        </Button>
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
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
              Kaart Uploaden
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}
