
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter, stylePropertyDetails } from './pdfStyles';
import { Home, Bed, Bath, CalendarDays, Ruler } from 'lucide-react';
import QRCode from 'qrcode';

export const addCoverPage = async (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  // Add logo and QR code at the top
  if (settings?.logoUrl) {
    try {
      const img = new Image();
      img.src = settings.logoUrl;
      pdf.addImage(img, 'PNG', margin, currentY, 40, 20);

      // Add QR code on the right
      const qrUrl = await QRCode.toDataURL(`${window.location.origin}/property/view/${property.id}`);
      const qrImg = new Image();
      qrImg.src = qrUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });
      
      const qrSize = 20;
      pdf.setTextColor(70, 70, 70);
      pdf.setFontSize(10);
      const text = 'Bekijk de online brochure';
      const textWidth = pdf.getTextWidth(text);
      pdf.text(text, pageWidth - margin - qrSize - textWidth - 10, currentY + 13);
      pdf.addImage(qrImg, 'PNG', pageWidth - margin - qrSize, currentY, qrSize, qrSize);

      currentY += 30; // Space after logo
    } catch (error) {
      console.error('Error loading logo or QR code:', error);
    }
  }

  // Featured image with padding and rounded corners
  if (property.featuredImage) {
    try {
      const img = new Image();
      img.src = property.featuredImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const contentWidth = pageWidth - (margin * 2);
      const maxHeight = 120;
      
      const imgAspectRatio = img.width / img.height;
      let finalWidth = contentWidth;
      let finalHeight = finalWidth / imgAspectRatio;
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * imgAspectRatio;
      }
      
      const xOffset = (pageWidth - finalWidth) / 2;

      // Add rounded rectangle background
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(xOffset - 1, currentY - 1, finalWidth + 2, finalHeight + 2, 3, 3, 'F');
      pdf.addImage(img, 'JPEG', xOffset, currentY, finalWidth, finalHeight);
      currentY += finalHeight + 20;
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  }

  // Image grid with rounded corners
  if (property.gridImages && property.gridImages.length > 0) {
    const imagesPerRow = 3;
    const imageWidth = (pageWidth - (margin * 2) - ((imagesPerRow - 1) * 10)) / imagesPerRow;
    const imageHeight = imageWidth * 0.75;
    let currentX = margin;
    
    for (let i = 0; i < Math.min(property.gridImages.length, 6); i++) {
      try {
        const img = new Image();
        img.src = property.gridImages[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        // Add rounded rectangle background
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(currentX - 1, currentY - 1, imageWidth + 2, imageHeight + 2, 3, 3, 'F');
        pdf.addImage(img, 'JPEG', currentX, currentY, imageWidth, imageHeight);
        
        currentX += imageWidth + 10;
        if ((i + 1) % imagesPerRow === 0) {
          currentX = margin;
          currentY += imageHeight + 10;
        }
      } catch (error) {
        console.error('Error loading grid image:', error);
      }
    }
  }

  // Title and price section at the bottom
  pdf.setFillColor(settings?.primaryColor || '#4B5563');
  pdf.rect(0, pageHeight - 60, pageWidth, 60, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont(undefined, 'bold');
  const title = property.title;
  pdf.text(title, margin, pageHeight - 25);
  
  const price = property.price;
  const priceWidth = pdf.getTextWidth(price);
  pdf.text(price, pageWidth - margin - priceWidth, pageHeight - 25);
};

export const addDetailsPage = async (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined, pageNumber: number, totalPages: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  addHeaderFooter(pdf, pageNumber, totalPages, settings, property.title);

  // Property details
  const details = [
    { icon: Home, label: 'Living Area', value: `${property.livingArea} m²` },
    { icon: Ruler, label: 'Plot Size', value: `${property.sqft} m²` },
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: CalendarDays, label: 'Build Year', value: property.buildYear }
  ];

  pdf.setTextColor(50, 50, 50);
  let yPos = 45;
  const columnWidth = contentWidth / 3;
  
  details.forEach((detail, index) => {
    if (detail.value) {
      const xPos = margin + (index % 3) * columnWidth;
      if (index > 0 && index % 3 === 0) {
        yPos += 30;
      }
      
      pdf.setFontSize(10);
      pdf.text(detail.label, xPos, yPos);
      pdf.setFontSize(12);
      pdf.text(detail.value.toString(), xPos, yPos + 8);
    }
  });

  // Description section
  yPos += 40;
  pdf.setFontSize(16);
  pdf.setTextColor(settings?.primaryColor || '#4B5563');
  pdf.text('Description', margin, yPos);
  
  pdf.setFontSize(11);
  pdf.setTextColor(70, 70, 70);
  const splitDescription = pdf.splitTextToSize(property.description, contentWidth);
  pdf.text(splitDescription, margin, yPos + 15);

  // Features section with primary color background (reduced spacing)
  if (property.features && property.features.length > 0) {
    yPos += splitDescription.length * 7 + 10; // Reduced space even more
    
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(settings?.primaryColor || '#4B5563');
    
    // Features box header
    pdf.rect(margin, yPos - 5, contentWidth, 25, 'F');
    pdf.text('Features', margin + 10, yPos + 10);
    
    // Features table
    yPos += 30;
    const colWidth = contentWidth / 2;
    let currentCol = 0;
    let startY = yPos;
    
    pdf.setFontSize(11);
    pdf.setTextColor(70, 70, 70);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPos - 5, contentWidth, Math.ceil(property.features.length / 2) * 12 + 10, 'F');

    property.features.forEach((feature, index) => {
      if (feature.description) {
        const xPos = margin + 10 + (currentCol * colWidth);
        const yOffset = Math.floor(index / 2) * 12;
        
        pdf.circle(xPos - 5, startY + yOffset + 3, 1, 'F');
        pdf.text(feature.description, xPos, startY + yOffset);
        
        currentCol = (currentCol + 1) % 2;
      }
    });
  }
};

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
  
  let contactY = 85;

  // Agency info box with primary color
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

  // QR Code section
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
    
    // QR Code text
    pdf.setTextColor(70, 70, 70);
    pdf.setFontSize(12);
    pdf.text('Bekijk de brochure online', margin + qrSize + 10, contactY + 25);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Agents section with improved styling
  if (settings.agents && settings.agents.length > 0) {
    contactY += 80;
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Our Agents', margin, contactY);
    contactY += 20;

    settings.agents.forEach((agent, index) => {
      // Agent card background
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, contactY, contentWidth, 50, 3, 3, 'F');
      
      // Agent info
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(agent.name, margin + 15, contactY + 20);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(70, 70, 70);
      const contactInfo = [
        `Phone: ${agent.phone}`,
        `Email: ${agent.email}`,
        agent.whatsapp ? `WhatsApp: ${agent.whatsapp}` : null
      ].filter(Boolean).join(' | ');
      
      pdf.text(contactInfo, margin + 15, contactY + 35);
      
      contactY += 60; // Space between agent cards
    });
  }
};
