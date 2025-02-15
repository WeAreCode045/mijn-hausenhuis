
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/settings/LogoUpload";
import { AgencyFields } from "@/components/settings/AgencyFields";
import { ColorInputs } from "@/components/settings/ColorInputs";
import { TypographySettings } from "@/components/settings/TypographySettings";
import { IconSettings } from "@/components/settings/IconSettings";
import { XmlImportSettings } from "@/components/settings/XmlImportSettings";
import { useAgencySettings } from "@/hooks/useAgencySettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"agency">("agency");
  const {
    settings,
    logoPreview,
    isLoading,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleLogoUpload,
  } = useAgencySettings();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="tabs">
        <Button onClick={() => setActiveTab("agency")} className={activeTab === "agency" ? "active" : ""}>
          Agency Settings
        </Button>
      </div>
      {activeTab === "agency" ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <LogoUpload logoPreview={logoPreview} onLogoUpload={handleLogoUpload} />
          <AgencyFields settings={settings} onChange={handleChange} />
          <ColorInputs
            primaryColor={settings.primaryColor}
            secondaryColor={settings.secondaryColor}
            onChange={handleChange}
          />
          <TypographySettings
            settings={settings}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
          <IconSettings
            settings={settings}
            onSelectChange={handleSelectChange}
          />
          <XmlImportSettings
            settings={settings}
            onChange={handleChange}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      ) : null}
    </div>
  );
};

export default Settings;
