
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { addHeaderFooter } from './pdf/pdfStyles';
import { addCoverPage } from './pdf/sections/coverPage';
import { addDetailsPage } from './pdf/sections/detailsPage';
import { addContactPage } from './pdf/sections/contactPage';

export const generatePropertyPDF = async (property: PropertyData, settings?: AgencySettings) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const totalPages = property.areas ? property.areas.length + 3 : 3;

  // Cover Page
  await addCoverPage(pdf, property, settings);

  // Details Page
  pdf.addPage();
  await addDetailsPage(pdf, property, settings, 2, totalPages);

  // Areas Pages
  if (property.areas && property.areas.length > 0) {
    let pageNumber = 3;
    for (const area of property.areas) {
      pdf.addPage();
      addHeaderFooter(pdf, pageNumber++, totalPages, settings, property.title);
      
      // Area title with accent line
      pdf.setFillColor(settings?.primaryColor || '#9b87f5');
      pdf.rect(20, 45, 3, 20, 'F');
      
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(18);
      pdf.text(area.title, 30, 60);

      // Area description
      pdf.setFontSize(11);
      pdf.setTextColor(70, 70, 70);
      const splitAreaDesc = pdf.splitTextToSize(area.description, 170);
      pdf.text(splitAreaDesc, 20, 80);

      // Area images
      if (area.images && area.images.length > 0) {
        let currentY = 80 + (splitAreaDesc.length * 7);
        const imagesPerRow = 3;
        const imageWidth = (170 - (20 * (imagesPerRow - 1))) / imagesPerRow;
        const imageHeight = imageWidth * 0.75;

        let currentX = 20;
        let imageCount = 0;

        for (const imageUrl of area.images) {
          if (currentY + imageHeight > pdf.internal.pageSize.getHeight() - 30) {
            pdf.addPage();
            addHeaderFooter(pdf, pageNumber++, totalPages, settings, property.title);
            currentY = 45;
            currentX = 20;
          }

          if (imageCount > 0 && imageCount % imagesPerRow === 0) {
            currentY += imageHeight + 10;
            currentX = 20;
          }

          try {
            const img = new Image();
            img.src = imageUrl;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            pdf.addImage(img, 'JPEG', currentX, currentY, imageWidth, imageHeight);
            currentX += imageWidth + 10;
            imageCount++;
          } catch (error) {
            console.error('Error loading area image:', error);
          }
        }
      }
    }
  }

  // Floorplans Page
  if (property.floorplans && property.floorplans.length > 0) {
    pdf.addPage();
    addHeaderFooter(pdf, totalPages - 1, totalPages, settings, property.title);

    pdf.setFillColor(settings?.primaryColor || '#9b87f5');
    pdf.rect(20, 45, 3, 20, 'F');
    
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(18);
    pdf.text('Plattegronden', 30, 60);

    let currentY = 80;
    for (const floorplanUrl of property.floorplans) {
      try {
        const img = new Image();
        img.src = floorplanUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const maxWidth = 170;
        const maxHeight = 120;
        
        const imgAspectRatio = img.width / img.height;
        let finalWidth = maxWidth;
        let finalHeight = finalWidth / imgAspectRatio;
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = finalHeight * imgAspectRatio;
        }

        if (currentY + finalHeight > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          addHeaderFooter(pdf, totalPages - 1, totalPages, settings, property.title);
          currentY = 45;
        }

        const xOffset = (pdf.internal.pageSize.getWidth() - finalWidth) / 2;
        pdf.addImage(img, 'JPEG', xOffset, currentY, finalWidth, finalHeight);
        currentY += finalHeight + 20;
      } catch (error) {
        console.error('Error loading floorplan:', error);
      }
    }
  }

  // Contact Page
  pdf.addPage();
  await addContactPage(pdf, settings || { 
    name: '',
    email: '',
    phone: '',
    address: '',
    primaryColor: '#9b87f5',
    secondaryColor: '#7E69AB',
    agents: []
  }, totalPages, totalPages, property);

  // Save the PDF
  pdf.save(`${property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brochure.pdf`);
};
