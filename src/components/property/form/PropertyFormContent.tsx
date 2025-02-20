
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PropertyDetails } from "../PropertyDetails";
import { PropertyDescription } from "../PropertyDescription";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyImages } from "../PropertyImages";
import { PropertyAreas } from "../PropertyAreas";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { PropertyFormData } from "@/types/property";

export function PropertyFormContent() {
  const { profile, isAdmin } = useAuth();
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string }>>([]);
  const { formData, setFormData, id } = usePropertyForm(id, () => {}); // Add required arguments
  
  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'agent');
      
      if (!error && data) {
        setAgents(data);
      }
    };
    
    if (isAdmin) {
      fetchAgents();
    }
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
      <div className="space-y-6">
        <PropertyDetails
          id={formData.id}
          title={formData.title}
          price={formData.price}
          address={formData.address}
          buildYear={formData.buildYear}
          sqft={formData.sqft}
          livingArea={formData.livingArea}
          bedrooms={formData.bedrooms}
          bathrooms={formData.bathrooms}
          garages={formData.garages}
          energyLabel={formData.energyLabel}
          hasGarden={formData.hasGarden}
          onChange={handleInputChange}
        />

        <PropertyDescription
          description={formData.description}
          onChange={handleInputChange}
        />

        <PropertyLocation
          id={formData.id}
          address={formData.address}
          description={formData.description}
          location_description={formData.location_description}
          map_image={formData.map_image}
          nearby_places={formData.nearby_places}
          onChange={handleInputChange}
          onLocationFetch={async () => {}}
          onMapImageDelete={async () => {}}
        />

        <PropertyFeatures
          features={formData.features}
          onAdd={() => {}}
          onRemove={(id: string) => {}}
          onUpdate={(id: string, description: string) => {}}
        />

        <PropertyImages
          images={formData.images}
          floorplans={formData.floorplans}
          featuredImage={formData.featuredImage}
          gridImages={formData.gridImages}
          areaPhotos={formData.areaPhotos}
          onImageUpload={() => {}}
          onFeaturedImageUpload={() => {}}
          onGridImageUpload={() => {}}
          onFloorplanUpload={() => {}}
          onAreaPhotosUpload={() => {}}
          onRemoveImage={() => {}}
          onRemoveFloorplan={() => {}}
          onRemoveAreaPhoto={() => {}}
          onSetFeaturedImage={() => {}}
          onToggleGridImage={() => {}}
        />

        <PropertyAreas
          areas={formData.areas}
          onAreaAdd={() => {}}
          onAreaRemove={() => {}}
          onAreaUpdate={() => {}}
          onImageUpload={() => {}}
          onImageRemove={() => {}}
        />
      </div>
      
      <div className="space-y-6">
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Assign Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.agent_id || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, agent_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
