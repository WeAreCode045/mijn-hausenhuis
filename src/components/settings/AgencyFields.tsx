
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgencySettings } from "@/types/agency";

interface AgencyFieldsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AgencyFields = ({ settings, onChange }: AgencyFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Agency Name</Label>
        <Input
          id="name"
          name="name"
          value={settings.name}
          onChange={onChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agentName">Agent Name</Label>
        <Input
          id="agentName"
          name="agentName"
          value={settings.agentName}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={settings.email}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={settings.phone}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={settings.address}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
        <Input
          id="googleMapsApiKey"
          name="googleMapsApiKey"
          value={settings.googleMapsApiKey}
          onChange={onChange}
          type="password"
        />
      </div>
    </>
  );
};
