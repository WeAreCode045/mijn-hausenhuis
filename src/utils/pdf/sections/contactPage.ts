
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter } from '../pdfStyles';
import QRCode from 'qrcode';

export const addContactPage = async (pdf: jsPDF, settings: AgencySettings, pageNumber: number, totalPages: number, property: PropertyData) => {
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  addHeaderFooter(pdf, pageNumber, totalPages, settings, property.title);
  
  // Title section with accent
  pdf.setFillColor(settings?.primaryColor || '#4B5563');
  pdf.rect(margin, 45, 3, 20, 'F');
  
  pdf.setTextColor(50, 50, 50);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('Contact Information', margin + 10, 60);
  pdf.setFont(undefined, 'normal');
  
  let contactY = await addAgencyInfo(pdf, settings, margin, contentWidth);
  contactY = await addQRCode(pdf, property, margin, contactY);
  await addAgents(pdf, settings, margin, contentWidth, contactY);
};

const addAgencyInfo = async (pdf: jsPDF, settings: AgencySettings, margin: number, contentWidth: number) => {
  const contactY = 85;

  pdf.setFillColor(settings?.primaryColor || '#4B5563');
  pdf.setDrawColor(settings?.primaryColor || '#4B5563');
  pdf.roundedRect(margin, contactY, contentWidth, 60, 3, 3, 'FD');
  
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

  return contactY + 80;
};

const addQRCode = async (pdf: jsPDF, property: PropertyData, margin: number, contactY: number) => {
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

  return contactY + 80;
};

const addAgents = async (pdf: jsPDF, settings: AgencySettings, margin: number, contentWidth: number, contactY: number) => {
  if (settings.agents && settings.agents.length > 0) {
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Our Agents', margin, contactY);
    let currentY = contactY + 20;

    settings.agents.forEach((agent) => {
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, currentY, contentWidth, 50, 3, 3, 'F');
      
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(agent.name, margin + 15, currentY + 20);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(70, 70, 70);
      const contactInfo = [
        `Phone: ${agent.phone}`,
        `Email: ${agent.email}`,
        agent.whatsapp ? `WhatsApp: ${agent.whatsapp}` : null
      ].filter(Boolean).join(' | ');
      
      pdf.text(contactInfo, margin + 15, currentY + 35);
      
      currentY += 60;
    });
  }
};
