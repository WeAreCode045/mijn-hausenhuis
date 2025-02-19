
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generateCoverPage } from '../sections/coverPage';
import { generateDetailsPage } from '../sections/detailsPage';
import { generateAreaPages } from '../sections/areaPages';
import { generateContactPage } from '../sections/contactPage';
import { generateLocationPage } from '../sections/locationPage';

export async function generatePropertyBrochure(
  property: PropertyData,
  settings: AgencySettings,
  propertyImages: string[],
  featuredImageUrl: string | null,
  description_background_url?: string,
  locationImageUrl?: string,
  contactImageUrl?: string,
): Promise<jsPDF> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let currentPage = 0;

  // Calculate total pages
  const totalPages = property.areas && property.areas.length > 0 ? 
    Math.ceil(property.areas.length / 2) + 6 : 6;

  // Generate pages
  currentPage = await generateCoverPage(
    pdf,
    property,
    settings,
    currentPage,
    totalPages,
    featuredImageUrl,
    description_background_url
  );

  currentPage = await generateDetailsPage(
    pdf,
    property,
    settings,
    currentPage,
    totalPages
  );

  if (property.areas && property.areas.length > 0) {
    currentPage = await generateAreaPages(
      pdf,
      property,
      settings,
      currentPage,
      totalPages,
      property.title
    );
  }

  currentPage = await generateLocationPage(
    pdf,
    property,
    settings,
    currentPage,
    totalPages,
    property.title
  );

  await generateContactPage(
    pdf,
    settings,
    currentPage,
    totalPages,
    property.title
  );

  return pdf;
}
