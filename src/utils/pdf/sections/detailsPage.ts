
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter } from '../pdfStyles';
import { Home, Bed, Bath, CalendarDays, Ruler } from 'lucide-react';

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

  await addDescription(pdf, property, settings, margin, yPos + 40, contentWidth);
  await addFeatures(pdf, property, settings, margin, contentWidth);
};

const addDescription = async (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined, margin: number, yPos: number, contentWidth: number) => {
  pdf.setFontSize(16);
  pdf.setTextColor(settings?.primaryColor || '#4B5563');
  pdf.text('Description', margin, yPos);
  
  pdf.setFontSize(11);
  pdf.setTextColor(70, 70, 70);
  const splitDescription = pdf.splitTextToSize(property.description, contentWidth);
  pdf.text(splitDescription, margin, yPos + 15);
  
  return splitDescription.length * 7 + 10;
};

const addFeatures = async (pdf: jsPDF, property: PropertyData, settings: AgencySettings | undefined, margin: number, contentWidth: number) => {
  if (property.features && property.features.length > 0) {
    let yPos = 200;
    
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(settings?.primaryColor || '#4B5563');
    
    pdf.rect(margin, yPos - 5, contentWidth, 25, 'F');
    pdf.text('Features', margin + 10, yPos + 10);
    
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
