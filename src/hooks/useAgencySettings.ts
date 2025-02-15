
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";

export const useAgencySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AgencySettings>({
    name: "",
    agentName: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: "#40497A",
    secondaryColor: "#E2E8F0",
    iconBuildYear: "calendar",
    iconBedrooms: "bed",
    iconBathrooms: "bath",
    iconGarages: "car",
    iconEnergyClass: "zap",
    iconSqft: "ruler",
    iconLivingSpace: "home",
    googleMapsApiKey: "",
    xmlImportUrl: "",
  });
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = settings.logoUrl;

      if (logoPreview && !logoPreview.startsWith('http')) {
        const file = await (await fetch(logoPreview)).blob();
        const filename = `logo-${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('agency_files')
          .upload(filename, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('agency_files')
          .getPublicUrl(filename);

        logoUrl = publicUrl;
      }

      const { error } = settings.id 
        ? await supabase
            .from('agency_settings')
            .update({
              name: settings.name,
              agent_name: settings.agentName,
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              primary_color: settings.primaryColor,
              secondary_color: settings.secondaryColor,
              logo_url: logoUrl,
              icon_build_year: settings.iconBuildYear,
              icon_bedrooms: settings.iconBedrooms,
              icon_bathrooms: settings.iconBathrooms,
              icon_garages: settings.iconGarages,
              icon_energy_class: settings.iconEnergyClass,
              icon_sqft: settings.iconSqft,
              icon_living_space: settings.iconLivingSpace,
              google_maps_api_key: settings.googleMapsApiKey,
              xml_import_url: settings.xmlImportUrl,
            })
            .eq('id', settings.id)
        : await supabase
            .from('agency_settings')
            .insert({
              name: settings.name,
              agent_name: settings.agentName,
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              primary_color: settings.primaryColor,
              secondary_color: settings.secondaryColor,
              logo_url: logoUrl,
              icon_build_year: settings.iconBuildYear,
              icon_bedrooms: settings.iconBedrooms,
              icon_bathrooms: settings.iconBathrooms,
              icon_garages: settings.iconGarages,
              icon_energy_class: settings.iconEnergyClass,
              icon_sqft: settings.iconSqft,
              icon_living_space: settings.iconLivingSpace,
              google_maps_api_key: settings.googleMapsApiKey,
              xml_import_url: settings.xmlImportUrl,
            });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      const newSettings = await fetchAgencySettings();
      if (newSettings) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchAgencySettings();
      if (data) {
        setSettings(data);
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      }
    };
    loadSettings();
  }, []);

  return {
    settings,
    logoPreview,
    isLoading,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleLogoUpload,
  };
};
