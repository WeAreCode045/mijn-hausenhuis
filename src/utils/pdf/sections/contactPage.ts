
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter } from '../pdfStyles';
import QRCode from 'qrcode';

const brandColors = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  accent: '#D6BCFA',
  neutral: '#F1F0FB',
};

export const addContactPage = async (pdf: jsPDF, settings: AgencySettings, pageNumber: number, totalPages: number, property: PropertyData) => {
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  addHeaderFooter(pdf, pageNumber, totalPages, settings, property.title);
  
  // Title section with accent
  pdf.setFillColor(settings?.primaryColor || brandColors.primary);
  pdf.rect(margin, 45, 3, 20, 'F');
  
  pdf.setTextColor(50, 50, 50);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('Contact Informatie', margin + 10, 60);
  pdf.setFont(undefined, 'normal');
  
  let contactY = 85;

  // Agency info box
  pdf.setFillColor(settings?.primaryColor || brandColors.primary);
  pdf.roundedRect(margin, contactY, contentWidth, 60, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text(settings.name || '', margin + 15, contactY + 20);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  if (settings.address) {
    pdf.text(settings.address, margin + 15, contactY + 35);
  }
  if (settings.phone || settings.email) {
    const contactInfo = [settings.phone, settings.email].filter(Boolean).join(' | ');
    pdf.text(contactInfo, margin + 15, contactY + 50);
  }

  // QR Code
  contactY += 80;
  try {
    const qrUrl = await QRCode.toDataURL(`${window.location.origin}/property/view/${property.id}`);
    const qrImg = new Image();
    qrImg.src = qrUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
    });
    
    const qrSize = 50;
    pdf.addImage(qrImg, 'PNG', margin, contactY, qrSize, qrSize);
    
    pdf.setTextColor(70, 70, 70);
    pdf.setFontSize(12);
    pdf.text('Bekijk de brochure online', margin + qrSize + 10, contactY + 25);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Agents section
  if (settings.agents && settings.agents.length > 0) {
    contactY += 80;
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Onze Makelaars', margin, contactY);
    contactY += 20;

    settings.agents.forEach((agent) => {
      pdf.setFillColor(brandColors.neutral);
      pdf.roundedRect(margin, contactY, contentWidth, 50, 3, 3, 'F');
      
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(agent.name, margin + 15, contactY + 20);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(70, 70, 70);
      const contactInfo = [
        `Tel: ${agent.phone}`,
        `Email: ${agent.email}`,
        agent.whatsapp ? `WhatsApp: ${agent.whatsapp}` : null
      ].filter(Boolean).join(' | ');
      
      pdf.text(contactInfo, margin + 15, contactY + 35);
      
      contactY += 60;
    });
  }
};
