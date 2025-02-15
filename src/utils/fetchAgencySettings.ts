
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";

export async function fetchAgencySettings(): Promise<AgencySettings | null> {
  const { data, error } = await supabase
    .from('agency_settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: String(data.id),
    name: data.name || "",
    agentName: data.agent_name || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    primaryColor: data.primary_color || "#40497A",
    secondaryColor: data.secondary_color || "#E2E8F0",
    logoUrl: data.logo_url,
    iconBuildYear: data.icon_build_year || "calendar",
    iconBedrooms: data.icon_bedrooms || "bed",
    iconBathrooms: data.icon_bathrooms || "bath",
    iconGarages: data.icon_garages || "car",
    iconEnergyClass: data.icon_energy_class || "zap",
    iconSqft: data.icon_sqft || "ruler",
    iconLivingSpace: data.icon_living_space || "home",
    googleMapsApiKey: data.google_maps_api_key || "",
    xmlImportUrl: data.xml_import_url || "",
  };
}
