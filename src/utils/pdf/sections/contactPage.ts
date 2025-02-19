
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

  const { margin, contentPadding } = BROCHURE_STYLES.spacing;
  let yPos = contentPadding.top;

  // Contact title with accent bar
  pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.rect(margin, yPos, 3, 20, 'F');
  
  pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
  pdf.setFontSize(24);
  pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
  pdf.text('Contact', margin + 10, yPos + 15);

  // Agency logo if available
  if (settings.logoUrl) {
    try {
      const img = new Image();
      img.src = settings.logoUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      pdf.addImage(img, 'PNG', margin, yPos + 40, 60, 30);
      yPos += 80;
    } catch (error) {
      console.error('Error loading logo:', error);
      yPos += 40;
    }
  } else {
    yPos += 40;
  }

  // Agency info box
  pdf.setFillColor(BROCHURE_STYLES.colors.neutral);
  pdf.roundedRect(margin, yPos, 170, 80, 3, 3, 'F');

  pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
  pdf.setFontSize(16);
  pdf.text(settings.name, margin + 10, yPos + 20);

  pdf.setFontSize(12);
  pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
  
  // Contact details with icons
  if (settings.address) {
    pdf.text('📍 ' + settings.address, margin + 10, yPos + 40);
  }
  if (settings.phone) {
    pdf.text('📞 ' + settings.phone, margin + 10, yPos + 55);
  }
  if (settings.email) {
    pdf.text('✉️ ' + settings.email, margin + 10, yPos + 70);
  }

  yPos += 100;

  // Social media section
  if (settings.facebookUrl || settings.instagramUrl) {
    pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
    pdf.setTextColor(255, 255, 255);
    pdf.roundedRect(margin, yPos, 170, 50, 3, 3, 'F');

    pdf.setFontSize(14);
    pdf.text('Volg ons op social media', margin + 10, yPos + 20);

    pdf.setFontSize(11);
    let socialYPos = yPos + 35;
    
    if (settings.facebookUrl) {
      pdf.text('Facebook: ' + settings.facebookUrl, margin + 10, socialYPos);
      socialYPos += 15;
    }
    if (settings.instagramUrl) {
      pdf.text('Instagram: ' + settings.instagramUrl, margin + 10, socialYPos);
    }
  }

  // Add agents if available
  if (settings.agents?.length) {
    yPos += 70;
    pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    pdf.setFontSize(16);
    pdf.text('Onze makelaars', margin, yPos);

    yPos += 20;
    settings.agents.forEach((agent, index) => {
      pdf.setFillColor(BROCHURE_STYLES.colors.neutral);
      pdf.roundedRect(margin, yPos, 170, 60, 3, 3, 'F');

      pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
      pdf.setFontSize(14);
      pdf.text(agent.name, margin + 10, yPos + 20);

      pdf.setFontSize(11);
      pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
      if (agent.phone) pdf.text('📞 ' + agent.phone, margin + 10, yPos + 35);
      if (agent.email) pdf.text('✉️ ' + agent.email, margin + 10, yPos + 50);

      yPos += 70;
    });
  }
};
