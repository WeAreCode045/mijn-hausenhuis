
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { FloorplansSection } from "../sections/FloorplansSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { ContactSection } from "../sections/ContactSection";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

interface SectionConfigProps {
  property: PropertyData;
  settings?: AgencySettings;
  currentPage: number;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
}

export function getSections({ property, settings, currentPage, isPrintView = false, waitForPlaces = false }: SectionConfigProps) {
  // Update property with current path for areas section pagination
  const currentPageStr = currentPage.toString();
  const propertyWithPath = {
    ...property,
    currentPath: currentPage === 0 ? 'overview' :
                currentPage === 1 ? 'details' :
                currentPage === 2 ? `areas-${Math.floor((currentPage - 2))}` :
                currentPage === 3 ? 'floorplans' :
                currentPage === 4 ? 'neighborhood' :
                'contact'
  };

  return [
    {
      id: 'overview',
      content: <OverviewSection property={propertyWithPath} settings={settings} />,
    },
    {
      id: 'details',
      content: <DetailsSection property={propertyWithPath} settings={settings} />,
    },
    ...(property.areas && property.areas.length > 0 
      ? [{ 
          id: 'areas',
          content: <AreasSection property={propertyWithPath} settings={settings} /> 
        }] 
      : []
    ),
    ...(property.floorplans && property.floorplans.length > 0
      ? [{
          id: 'floorplans',
          content: <FloorplansSection property={propertyWithPath} settings={settings} />
        }]
      : []
    ),
    {
      id: 'neighborhood',
      content: <NeighborhoodSection 
        property={propertyWithPath} 
        settings={settings}
        waitForPlaces={waitForPlaces}
      />,
    },
    ...(isPrintView ? [] : [{
      id: 'contact',
      content: <ContactSection property={propertyWithPath} settings={settings} />,
    }]),
  ];
}
