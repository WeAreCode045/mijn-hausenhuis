
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generatePropertyBrochure } from './pdf/templates/propertyBrochure';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings) => {
  const propertyImages = property.images.map(img => img.url);
  await generatePropertyBrochure(
    property,
    settings,
    propertyImages,
    property.featuredImage,
    undefined, // description_background_url
    property.map_image || undefined, // locationImageUrl
    undefined // contactImageUrl
  );
};
