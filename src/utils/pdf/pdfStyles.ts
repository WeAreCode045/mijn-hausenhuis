
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';

export const addHeaderFooter = (pdf: jsPDF, pageNum: number, totalPages: number, settings?: AgencySettings, propertyTitle?: string) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Header with background
  pdf.setFillColor(settings?.primaryColor || '#4B5563');
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  // Add logo
  if (settings?.logoUrl) {
    try {
      const img = new Image();
      img.src = settings.logoUrl;
      pdf.addImage(img, 'PNG', margin, 5, 40, 20);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Add contact details inline
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  const contactX = margin + 50;
  let contactDetails = [];
  
  if (settings?.name) contactDetails.push(settings.name);
  if (settings?.phone) contactDetails.push(settings.phone);
  if (settings?.email) contactDetails.push(settings.email);
  
  pdf.text(contactDetails.join(' | '), contactX, 18);
  
  // Footer with background
  pdf.setFillColor(settings?.secondaryColor || '#6B7280');
  pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  // Footer text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  
  if (propertyTitle) {
    const maxWidth = pageWidth - 80; // Leave space for page numbers
    pdf.text(propertyTitle, margin, pageHeight - 8, { maxWidth });
  }
  
  pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 8);
};

export const stylePropertyDetails = (pdf: jsPDF, margin: number, contentWidth: number, settings?: AgencySettings) => {
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(200, 200, 200);
  pdf.roundedRect(margin, 60, contentWidth, 80, 3, 3, 'FD');
};
