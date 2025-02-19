
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import QRCode from 'qrcode';

const brandColors = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  accent: '#D6BCFA',
  neutral: '#F1F0FB',
};

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

      currentY += 30;
    } catch (error) {
      console.error('Error loading logo or QR code:', error);
    }
  }

  // Featured image
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
      pdf.addImage(img, 'JPEG', xOffset, currentY, finalWidth, finalHeight);
      currentY += finalHeight + 20;
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  }

  // Grid images
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

  // Title and price section
  pdf.setFillColor(settings?.primaryColor || brandColors.primary);
  pdf.rect(0, pageHeight - 60, pageWidth, 60, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont(undefined, 'bold');
  const title = property.title;
  pdf.text(title, margin, pageHeight - 25);
  
  if (property.price) {
    const priceWidth = pdf.getTextWidth(property.price);
    pdf.text(property.price, pageWidth - margin - priceWidth, pageHeight - 25);
  }
};
