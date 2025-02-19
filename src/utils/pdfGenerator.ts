
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generatePropertyBrochure } from './pdf/templates/propertyBrochure';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings) => {
  const propertyImages = property.images.map(img => img.url);
  const currentPage = 2; // Start from page 2 for details
  await generatePropertyBrochure(
    property,
    settings,
    propertyImages,
    property.featuredImage,
    undefined, // description_background_url
    property.map_image || undefined, // locationImageUrl
    undefined, // contactImageUrl
    currentPage // Add currentPage parameter
  );
};
