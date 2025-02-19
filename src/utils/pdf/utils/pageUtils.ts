
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';

export const addHeaderFooter = (
  pdf: jsPDF,
  pageNum: number,
  totalPages: number,
  settings: AgencySettings,
  propertyTitle: string
): void => {
  const { width, height } = BROCHURE_STYLES.pageSize;
  const { margin } = BROCHURE_STYLES.spacing;

  pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.rect(0, 0, width, 30, 'F');

  if (settings.logoUrl) {
    try {
      const img = new Image();
      img.src = settings.logoUrl;
      pdf.addImage(img, 'PNG', margin, 5, 40, 20);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Contact info in header
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  const contactInfo = [
    settings.name,
    settings.phone,
    settings.email
  ].filter(Boolean).join(' | ');
  pdf.text(contactInfo, margin + 50, 18);

  // Footer
  pdf.setFillColor(settings.secondaryColor || BROCHURE_STYLES.colors.secondary);
  pdf.rect(0, height - 20, width, 20, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(propertyTitle, margin, height - 8);
  pdf.text(
    `Pagina ${pageNum} van ${totalPages}`,
    width - margin - 20,
    height - 8
  );
};

export const calculateTotalPages = (property: PropertyData): number => {
  let pages = 3; // Cover, details, and contact pages
  if (property.areas?.length) {
    pages += Math.ceil(property.areas.length / 2);
  }
  if (property.floorplans?.length) {
    pages += Math.ceil(property.floorplans.length / 2);
  }
  return pages;
};
