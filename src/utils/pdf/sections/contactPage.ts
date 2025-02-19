
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { addHeaderFooter } from '../utils/pageUtils';

export const generateContactPage = (
  pdf: jsPDF,
  settings: AgencySettings,
  currentPage: number,
  totalPages: number,
  propertyTitle: string
): void => {
  pdf.addPage();
  addHeaderFooter(pdf, currentPage, totalPages, settings, propertyTitle);

  const { margin } = BROCHURE_STYLES.spacing;
  let yPos = 50;

  // Contact title
  pdf.setFontSize(24);
  pdf.setTextColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
  pdf.text('Contact', margin, yPos);

  // Agency info
  yPos += 30;
  pdf.setFontSize(14);
  pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
  pdf.text(settings.name, margin, yPos);

  const contactDetails = [
    settings.address,
    settings.phone,
    settings.email
  ].filter(Boolean);

  yPos += 20;
  pdf.setFontSize(12);
  pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
  contactDetails.forEach(detail => {
    pdf.text(detail || '', margin, yPos);
    yPos += 15;
  });

  // Social media
  if (settings.facebookUrl || settings.instagramUrl) {
    yPos += 20;
    pdf.setFontSize(14);
    pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    pdf.text('Volg ons op social media', margin, yPos);

    yPos += 20;
    pdf.setFontSize(12);
    pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    
    if (settings.facebookUrl) {
      pdf.text('Facebook: ' + settings.facebookUrl, margin, yPos);
      yPos += 15;
    }
    if (settings.instagramUrl) {
      pdf.text('Instagram: ' + settings.instagramUrl, margin, yPos);
    }
  }
};
