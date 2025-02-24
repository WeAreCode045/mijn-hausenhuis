import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PropertyFormData } from "@/types/property";

interface PropertyFormContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyFormData["areas"][0], value: string | string[]) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete: () => Promise<void>;
}

export function PropertyFormContent({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
}: PropertyFormContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Title"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="text"
            value={formData.price}
            onChange={(e) => onFieldChange('price', e.target.value)}
            placeholder="Price"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            placeholder="Address"
          />
        </div>
        <div>
          <Label htmlFor="object_id">Object ID</Label>
          <Input
            id="object_id"
            type="text"
            value={formData.object_id || ''}
            onChange={(e) => onFieldChange('object_id', e.target.value)}
            placeholder="Object ID"
          />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={(e) => onFieldChange('bedrooms', e.target.value)}
            placeholder="Bedrooms"
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={(e) => onFieldChange('bathrooms', e.target.value)}
            placeholder="Bathrooms"
          />
        </div>
        <div>
          <Label htmlFor="sqft">Sqft</Label>
          <Input
            id="sqft"
            type="number"
            value={formData.sqft}
            onChange={(e) => onFieldChange('sqft', e.target.value)}
            placeholder="Sqft"
          />
        </div>
        <div>
          <Label htmlFor="livingArea">Living Area</Label>
          <Input
            id="livingArea"
            type="number"
            value={formData.livingArea}
            onChange={(e) => onFieldChange('livingArea', e.target.value)}
            placeholder="Living Area"
          />
        </div>
        <div>
          <Label htmlFor="buildYear">Build Year</Label>
          <Input
            id="buildYear"
            type="number"
            value={formData.buildYear}
            onChange={(e) => onFieldChange('buildYear', e.target.value)}
            placeholder="Build Year"
          />
        </div>
        <div>
          <Label htmlFor="garages">Garages</Label>
          <Input
            id="garages"
            type="number"
            value={formData.garages}
            onChange={(e) => onFieldChange('garages', e.target.value)}
            placeholder="Garages"
          />
        </div>
        <div>
          <Label htmlFor="energyLabel">Energy Label</Label>
          <Select
            value={formData.energyLabel}
            onValueChange={(value) => onFieldChange('energyLabel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select energy label" />
            </SelectTrigger>
            <SelectContent>
              {['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasGarden"
            checked={formData.hasGarden}
            onCheckedChange={(checked) => onFieldChange('hasGarden', !!checked)}
          />
          <Label htmlFor="hasGarden">Has Garden</Label>
        </div>
        <div className="col-span-2">
          <Label htmlFor="location_description">Location Description</Label>
          <Textarea
            id="location_description"
            value={formData.location_description}
            onChange={(e) => onFieldChange('location_description', e.target.value)}
            placeholder="Location Description"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="col-span-2">
          <PropertyFeatures
            features={formData.features}
            onAdd={onAddFeature}
            onRemove={onRemoveFeature}
            onUpdate={onUpdateFeature}
          />
        </div>
        <div className="col-span-2">
          <PropertyAreas
            areas={formData.areas}
            onAdd={onAddArea}
            onRemove={onRemoveArea}
            onUpdate={onUpdateArea}
            onImageUpload={onAreaImageUpload}
            onImageRemove={onAreaImageRemove}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
          <Input
            id="virtualTourUrl"
            value={formData.virtualTourUrl || ''}
            onChange={(e) => onFieldChange('virtualTourUrl', e.target.value)}
            placeholder="Enter virtual tour URL"
          />
        </div>
      </div>
    </div>
  );
}
