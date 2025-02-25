
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { FloorplansSection } from "../sections/FloorplansSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { ContactSection } from "../sections/ContactSection";

interface SectionConfigProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  isPrintView: boolean;
  waitForPlaces?: boolean;
}

export const getSections = ({ property, settings, currentPage, isPrintView, waitForPlaces }: SectionConfigProps) => {
  const key = `page-${currentPage}`;
  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <OverviewSection key={key} property={property} settings={settings} />
          </div>
          {isPrintView && (
            <PrintFooter property={property} currentPage={currentPage} settings={settings} />
          )}
        </div>
      )
    },
    {
      id: 'details',
      title: 'Details',
      content: (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <DetailsSection key={key} property={property} settings={settings} />
            </div>
          </div>
          {isPrintView && (
            <PrintFooter property={property} currentPage={currentPage} settings={settings} />
          )}
        </div>
      )
    }
  ];

  // Add area sections if there are areas
  if (property.areas && property.areas.length > 0) {
    for (let i = 0; i < Math.ceil(property.areas.length / 2); i++) {
      sections.push({
        id: `areas-${i}`,
        title: `Areas ${i + 1}`,
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <AreasSection 
                  key={`${key}-areas-${i}`} 
                  property={{
                    ...property,
                    currentPath: `areas-${i}`
                  }} 
                  settings={settings} 
                />
              </div>
            </div>
            {isPrintView && (
              <PrintFooter property={property} currentPage={currentPage} settings={settings} />
            )}
          </div>
        )
      });
    }
  }

  // Add floorplans section if there are floorplans
  if (property.floorplans && property.floorplans.length > 0) {
    sections.push({
      id: 'floorplans',
      title: 'Floorplans',
      content: (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <FloorplansSection key={key} property={property} settings={settings} />
            </div>
          </div>
          {isPrintView && (
            <PrintFooter property={property} currentPage={currentPage} settings={settings} />
          )}
        </div>
      )
    });
  }

  // Add neighborhood section
  sections.push({
    id: 'neighborhood',
    title: 'Neighborhood',
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <NeighborhoodSection key={key} property={property} settings={settings} waitForPlaces={waitForPlaces} />
          </div>
        </div>
        {isPrintView && (
          <PrintFooter property={property} currentPage={currentPage} settings={settings} />
        )}
      </div>
    )
  });

  // Add contact section if not in print view
  if (!isPrintView) {
    sections.push({
      id: 'contact',
      title: 'Contact',
      content: (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <ContactSection key={key} property={property} settings={settings} />
            </div>
          </div>
        </div>
      )
    });
  }

  return sections;
};

interface PrintFooterProps {
  property: PropertyData;
  currentPage: number;
  settings: AgencySettings;
}

const PrintFooter = ({ property, currentPage, settings }: PrintFooterProps) => (
  <div 
    className="h-16 flex items-center justify-between px-6 mt-auto"
    style={{ backgroundColor: settings?.primaryColor }}
  >
    <div className="w-24"></div>
    <h2 className="text-white font-medium text-lg">{property.title}</h2>
    <div className="text-white text-sm">Page {currentPage + 1}</div>
  </div>
);
