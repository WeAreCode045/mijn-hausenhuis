import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyDetails } from "../PropertyDetails";
import { PropertyDescription } from "../PropertyDescription";
import { PropertyLocation } from "../PropertyLocation";
import { PropertyFeatures } from "../PropertyFeatures";
import { PropertyImages } from "../PropertyImages";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyForm } from "@/hooks/usePropertyForm";

export function PropertyFormContent() {
  const { profile, isAdmin } = useAuth();
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string }>>([]);
  const { formData, setFormData } = usePropertyForm();
  
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
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
              onChange={(e) => {
                const { name, value, type, checked } = e.target;
                setFormData({
                  ...formData,
                  [name]: type === 'checkbox' ? checked : value,
                });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyDescription
              description={formData.description}
              location_description={formData.location_description}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormData({
                  ...formData,
                  [name]: value,
                });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyLocation
              address={formData.address}
              latitude={formData.latitude}
              longitude={formData.longitude}
              map_image={formData.map_image}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormData({
                  ...formData,
                  [name]: value,
                });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyFeatures
              features={formData.features}
              onFeaturesChange={(newFeatures) => {
                setFormData({
                  ...formData,
                  features: newFeatures,
                });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyImages
              images={formData.images}
              floorplans={formData.floorplans}
              featuredImage={formData.featuredImage}
              gridImages={formData.gridImages}
              areaPhotos={formData.areaPhotos}
              onFloorplanUpload={() => {}}
              onAreaPhotosUpload={() => {}}
              onRemoveImage={() => {}}
              onRemoveFloorplan={() => {}}
              onRemoveAreaPhoto={() => {}}
              onSetFeaturedImage={() => {}}
              onToggleGridImage={() => {}}
            />
          </CardContent>
        </Card>
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
                onValueChange={(value) => setFormData({ ...formData, agent_id: value })}
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
        
        <Card>
          <CardHeader>
            <CardTitle>Property Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Areas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
