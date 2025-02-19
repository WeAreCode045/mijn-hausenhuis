import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { generateCoverPage } from '../sections/coverPage';
import { generateDetailsPage } from '../sections/detailsPage';
import { generateContactPage } from '../sections/contactPage';
import { addHeaderFooter, calculateTotalPages } from '../utils/pageUtils';

class PropertyBrochure {
  private pdf: jsPDF;
  private property: PropertyData;
  private settings: AgencySettings;
  private currentPage: number;
  private totalPages: number;

  constructor(property: PropertyData, settings: AgencySettings) {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.property = property;
    this.settings = settings;
    this.currentPage = 1;
    this.totalPages = calculateTotalPages(property);
  }

  private async addAreasPages() {
    for (const area of this.property.areas) {
      if (this.currentPage % 2 === 0) this.pdf.addPage();
      this.currentPage++;
      addHeaderFooter(this.pdf, this.currentPage, this.totalPages, this.settings, this.property.title);

      const { margin } = BROCHURE_STYLES.spacing;
      let yPos = 50;

      // Area title
      this.pdf.setFillColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
      this.pdf.rect(margin, yPos, 3, 20, 'F');
      
      this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
      this.pdf.setFontSize(18);
      this.pdf.text(area.title, margin + 10, yPos + 15);

      // Area description
      yPos += 30;
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
      const description = this.pdf.splitTextToSize(area.description, 170);
      this.pdf.text(description, margin, yPos);

      // Area images in 3 columns
      if (area.images?.length) {
        yPos += description.length * 7 + 10;
        await this.addAreaImages(area.images, yPos);
      }
    }
  }

  private async addAreaImages(images: string[], startY: number) {
    const { margin, gutter } = BROCHURE_STYLES.spacing;
    const contentWidth = BROCHURE_STYLES.pageSize.width - (margin * 2);
    const imageWidth = (contentWidth - gutter * 2) / 3;
    const imageHeight = imageWidth / BROCHURE_STYLES.imageAspectRatio;

    for (let i = 0; i < images.length; i++) {
      try {
        const img = new Image();
        img.src = images[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const xPos = margin + (i % 3) * (imageWidth + gutter);
        const yPos = startY + Math.floor(i / 3) * (imageHeight + gutter);

        this.pdf.addImage(img, 'JPEG', xPos, yPos, imageWidth, imageHeight);
      } catch (error) {
        console.error('Error loading area image:', error);
      }
    }
  }

  private async addFloorplansPage() {
    this.pdf.addPage();
    this.currentPage++;
    addHeaderFooter(this.pdf, this.currentPage, this.totalPages, this.settings, this.property.title);

    const { margin } = BROCHURE_STYLES.spacing;
    let yPos = 50;

    // Floorplans title
    this.pdf.setFillColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
    this.pdf.rect(margin, yPos, 3, 20, 'F');
    
    this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    this.pdf.setFontSize(18);
    this.pdf.text('Plattegronden', margin + 10, yPos + 15);

    // Add floorplan images with less spacing
    yPos += 40;
    for (const floorplan of this.property.floorplans) {
      try {
        const img = new Image();
        img.src = floorplan;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const maxWidth = 180;
        const maxHeight = 130;
        
        const imgAspectRatio = img.width / img.height;
        let finalWidth = maxWidth;
        let finalHeight = finalWidth / imgAspectRatio;
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = finalHeight * imgAspectRatio;
        }

        const xOffset = (BROCHURE_STYLES.pageSize.width - finalWidth) / 2;
        this.pdf.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
        yPos += finalHeight + 10; // Reduced spacing between floorplans

        if (yPos > BROCHURE_STYLES.pageSize.height - 40) {
          this.pdf.addPage();
          this.currentPage++;
          addHeaderFooter(this.pdf, this.currentPage, this.totalPages, this.settings, this.property.title);
          yPos = 50;
        }
      } catch (error) {
        console.error('Error loading floorplan:', error);
      }
    }
  }

  private async addLocationPage() {
    if (!this.property.location_description && !this.property.map_image && !this.property.nearby_places?.length) return;

    this.pdf.addPage();
    this.currentPage++;
    addHeaderFooter(this.pdf, this.currentPage, this.totalPages, this.settings, this.property.title);

    const { margin, contentPadding } = BROCHURE_STYLES.spacing;
    let yPos = contentPadding.top;

    // Location title
    this.pdf.setFillColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
    this.pdf.rect(margin, yPos, 3, 20, 'F');
    
    this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    this.pdf.setFontSize(18);
    this.pdf.text('Locatie', margin + 10, yPos + 15);

    // Location description
    if (this.property.location_description) {
      yPos += 40;
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
      const description = this.pdf.splitTextToSize(this.property.location_description, 170);
      this.pdf.text(description, margin, yPos);
      yPos += description.length * 7 + 20;
    }

    // Map image
    if (this.property.map_image) {
      try {
        const img = new Image();
        img.src = this.property.map_image;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const maxWidth = 170;
        const maxHeight = 100;
        
        const imgAspectRatio = img.width / img.height;
        let finalWidth = maxWidth;
        let finalHeight = finalWidth / imgAspectRatio;
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = finalHeight * imgAspectRatio;
        }

        const xOffset = (BROCHURE_STYLES.pageSize.width - finalWidth) / 2;
        this.pdf.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
        yPos += finalHeight + 20;
      } catch (error) {
        console.error('Error loading map image:', error);
      }
    }

    // Nearby places
    if (this.property.nearby_places?.length) {
      this.pdf.setFontSize(16);
      this.pdf.setTextColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
      this.pdf.text('Voorzieningen in de buurt', margin, yPos);
      yPos += 20;

      const placesByType: { [key: string]: any[] } = {};
      this.property.nearby_places.forEach(place => {
        if (!placesByType[place.type]) {
          placesByType[place.type] = [];
        }
        placesByType[place.type].push(place);
      });

      Object.entries(placesByType).forEach(([type, places]) => {
        this.pdf.setFontSize(14);
        this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
        this.pdf.text(type.replace('_', ' '), margin, yPos);
        yPos += 15;

        places.forEach(place => {
          this.pdf.setFontSize(11);
          this.pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
          this.pdf.text(`• ${place.name}`, margin + 10, yPos);
          if (place.vicinity) {
            this.pdf.setFontSize(9);
            yPos += 10;
            this.pdf.text(place.vicinity, margin + 15, yPos);
          }
          yPos += 15;
        });
        yPos += 10;
      });
    }
  }

  public async generate() {
    // Cover page
    await generateCoverPage(this.pdf, this.property, this.currentPage);

    // Details page
    this.currentPage++;
    await generateDetailsPage(this.pdf, this.property, this.settings, this.currentPage, this.totalPages);

    // Areas pages
    if (this.property.areas?.length) {
      await this.addAreasPages();
    }

    // Floorplans
    if (this.property.floorplans?.length) {
      await this.addFloorplansPage();
    }

    // Location page
    await this.addLocationPage();

    // Contact page
    this.currentPage++;
    generateContactPage(this.pdf, this.settings, this.currentPage, this.totalPages, this.property.title);

    // Save PDF
    const filename = `${this.property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brochure.pdf`;
    this.pdf.save(filename);
  }
}

export const generatePropertyBrochure = async (property: PropertyData, settings: AgencySettings) => {
  const brochure = new PropertyBrochure(property, settings);
  await brochure.generate();
};
