
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter, stylePropertyDetails } from '../pdfStyles';

const brandColors = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  accent: '#D6BCFA',
  neutral: '#F1F0FB',
};

export const addDetailsPage = async (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined, pageNumber: number, totalPages: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  addHeaderFooter(pdf, pageNumber, totalPages, settings, property.title);
  stylePropertyDetails(pdf, margin, contentWidth, settings);

  // Property details
  const details = [
    { label: 'Woonoppervlakte', value: `${property.livingArea} m²` },
    { label: 'Perceeloppervlakte', value: `${property.sqft} m²` },
    { label: 'Slaapkamers', value: property.bedrooms },
    { label: 'Badkamers', value: property.bathrooms },
    { label: 'Bouwjaar', value: property.buildYear }
  ];

  pdf.setTextColor(50, 50, 50);
  let yPos = 75;
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

  // Description
  yPos = 160;
  pdf.setFontSize(16);
  pdf.setTextColor(settings?.primaryColor || brandColors.primary);
  pdf.text('Omschrijving', margin, yPos);
  
  pdf.setFontSize(11);
  pdf.setTextColor(70, 70, 70);
  const splitDescription = pdf.splitTextToSize(property.description, contentWidth);
  pdf.text(splitDescription, margin, yPos + 15);

  // Features
  if (property.features && property.features.length > 0) {
    yPos = 240;
    
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(settings?.primaryColor || brandColors.primary);
    
    pdf.rect(margin, yPos - 5, contentWidth, 25, 'F');
    pdf.text('Kenmerken', margin + 10, yPos + 10);
    
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
