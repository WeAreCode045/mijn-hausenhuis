
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
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

      currentY += 30;
    } catch (error) {
      console.error('Error loading logo or QR code:', error);
    }
  }

  await addFeaturedImage(pdf, property, margin, currentY);
  await addImageGrid(pdf, property, margin);
  addTitleSection(pdf, property, settings, margin);
};

const addFeaturedImage = async (pdf: jsPDF, property: PropertyData, margin: number, currentY: number) => {
  if (property.featuredImage) {
    try {
      const img = new Image();
      img.src = property.featuredImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
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

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(xOffset - 1, currentY - 1, finalWidth + 2, finalHeight + 2, 3, 3, 'F');
      pdf.addImage(img, 'JPEG', xOffset, currentY, finalWidth, finalHeight);
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  }
};

const addImageGrid = async (pdf: jsPDF, property: PropertyData, margin: number) => {
  if (property.gridImages && property.gridImages.length > 0) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imagesPerRow = 3;
    const imageWidth = (pageWidth - (margin * 2) - ((imagesPerRow - 1) * 10)) / imagesPerRow;
    const imageHeight = imageWidth * 0.75;
    let currentX = margin;
    let currentY = 170;
    
    for (let i = 0; i < Math.min(property.gridImages.length, 6); i++) {
      try {
        const img = new Image();
        img.src = property.gridImages[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
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
};

const addTitleSection = (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined, margin: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

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
