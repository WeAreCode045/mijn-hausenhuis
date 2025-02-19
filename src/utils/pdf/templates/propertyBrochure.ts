
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

const BROCHURE_STYLES = {
  colors: {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    accent: '#D6BCFA',
    neutral: '#F1F0FB',
    text: {
      primary: '#1A1F2C',
      secondary: '#4A5568',
      light: '#A0AEC0'
    }
  },
  fonts: {
    heading: 'helvetica',
    body: 'helvetica'
  },
  spacing: {
    margin: 20,
    gutter: 10
  },
  imageAspectRatio: 1.5,
  pageSize: {
    width: 210, // A4 width in mm
    height: 297 // A4 height in mm
  }
};

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
    this.totalPages = this.calculateTotalPages();
  }

  private calculateTotalPages(): number {
    let pages = 3; // Cover, details, and contact pages
    if (this.property.areas?.length) {
      pages += Math.ceil(this.property.areas.length / 2); // 2 areas per page
    }
    if (this.property.floorplans?.length) {
      pages += Math.ceil(this.property.floorplans.length / 2); // 2 floorplans per page
    }
    return pages;
  }

  private addPageHeader() {
    const { width } = BROCHURE_STYLES.pageSize;
    const { margin } = BROCHURE_STYLES.spacing;

    this.pdf.setFillColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
    this.pdf.rect(0, 0, width, 30, 'F');

    if (this.settings.logoUrl) {
      try {
        const img = new Image();
        img.src = this.settings.logoUrl;
        this.pdf.addImage(img, 'PNG', margin, 5, 40, 20);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    }

    // Contact info in header
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(8);
    const contactInfo = [
      this.settings.name,
      this.settings.phone,
      this.settings.email
    ].filter(Boolean).join(' | ');
    this.pdf.text(contactInfo, margin + 50, 18);
  }

  private addPageFooter() {
    const { width, height } = BROCHURE_STYLES.pageSize;
    const { margin } = BROCHURE_STYLES.spacing;

    this.pdf.setFillColor(this.settings.secondaryColor || BROCHURE_STYLES.colors.secondary);
    this.pdf.rect(0, height - 20, width, 20, 'F');

    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(8);
    this.pdf.text(this.property.title, margin, height - 8);
    this.pdf.text(
      `Pagina ${this.currentPage} van ${this.totalPages}`,
      width - margin - 20,
      height - 8
    );
  }

  private async addCoverPage() {
    if (this.property.featuredImage) {
      try {
        const img = new Image();
        img.src = this.property.featuredImage;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const { width, height } = BROCHURE_STYLES.pageSize;
        const coverHeight = height * 0.7;
        this.pdf.addImage(img, 'JPEG', 0, 0, width, coverHeight);

        // Gradient overlay
        this.pdf.setFillColor(0, 0, 0);
        this.pdf.setGState(new this.pdf.GState({ opacity: 0.5 }));
        this.pdf.rect(0, coverHeight - 100, width, 100, 'F');

        // Property title and price
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(32);
        this.pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
        this.pdf.text(this.property.title, 20, coverHeight - 50);

        if (this.property.price) {
          this.pdf.setFontSize(24);
          this.pdf.text(this.property.price, 20, coverHeight - 20);
        }
      } catch (error) {
        console.error('Error loading featured image:', error);
      }
    }
  }

  private async addDetailsPage() {
    this.pdf.addPage();
    this.currentPage++;
    this.addPageHeader();
    this.addPageFooter();

    const { margin, gutter } = BROCHURE_STYLES.spacing;
    const contentWidth = BROCHURE_STYLES.pageSize.width - (margin * 2);

    // Property highlights
    const highlights = [
      { label: 'Woonoppervlakte', value: `${this.property.livingArea} m²` },
      { label: 'Perceeloppervlakte', value: `${this.property.sqft} m²` },
      { label: 'Slaapkamers', value: this.property.bedrooms },
      { label: 'Badkamers', value: this.property.bathrooms },
      { label: 'Bouwjaar', value: this.property.buildYear }
    ].filter(item => item.value);

    let yPos = 50;
    const highlightWidth = (contentWidth - (gutter * 2)) / 3;

    highlights.forEach((highlight, index) => {
      const xPos = margin + (index % 3) * (highlightWidth + gutter);
      if (index > 0 && index % 3 === 0) yPos += 40;

      this.pdf.setFillColor(BROCHURE_STYLES.colors.neutral);
      this.pdf.roundedRect(xPos, yPos, highlightWidth, 30, 3, 3, 'F');

      this.pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
      this.pdf.setFontSize(10);
      this.pdf.text(highlight.label, xPos + 10, yPos + 12);

      this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
      this.pdf.setFontSize(12);
      this.pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
      this.pdf.text(String(highlight.value), xPos + 10, yPos + 25);
    });

    // Description section
    yPos += 60;
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
    this.pdf.text('Omschrijving', margin, yPos);

    this.pdf.setFontSize(11);
    this.pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    const description = this.pdf.splitTextToSize(this.property.description, contentWidth);
    this.pdf.text(description, margin, yPos + 15);
  }

  public async generate() {
    // Cover page
    await this.addCoverPage();

    // Details page
    await this.addDetailsPage();

    // Areas pages
    if (this.property.areas?.length) {
      await this.addAreasPages();
    }

    // Floorplans
    if (this.property.floorplans?.length) {
      await this.addFloorplansPage();
    }

    // Save PDF
    const filename = `${this.property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brochure.pdf`;
    this.pdf.save(filename);
  }

  private async addAreasPages() {
    for (const area of this.property.areas) {
      if (this.currentPage % 2 === 0) this.pdf.addPage();
      this.currentPage++;
      this.addPageHeader();
      this.addPageFooter();

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

      // Area images
      if (area.images?.length) {
        yPos += description.length * 7 + 10;
        await this.addAreaImages(area.images, yPos);
      }
    }
  }

  private async addAreaImages(images: string[], startY: number) {
    const { margin, gutter } = BROCHURE_STYLES.spacing;
    const contentWidth = BROCHURE_STYLES.pageSize.width - (margin * 2);
    const imageWidth = (contentWidth - gutter) / 2;
    const imageHeight = imageWidth / BROCHURE_STYLES.imageAspectRatio;

    for (let i = 0; i < images.length; i++) {
      try {
        const img = new Image();
        img.src = images[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const xPos = margin + (i % 2) * (imageWidth + gutter);
        const yPos = startY + Math.floor(i / 2) * (imageHeight + gutter);

        this.pdf.addImage(img, 'JPEG', xPos, yPos, imageWidth, imageHeight);
      } catch (error) {
        console.error('Error loading area image:', error);
      }
    }
  }

  private async addFloorplansPage() {
    this.pdf.addPage();
    this.currentPage++;
    this.addPageHeader();
    this.addPageFooter();

    const { margin } = BROCHURE_STYLES.spacing;
    let yPos = 50;

    // Floorplans title
    this.pdf.setFillColor(this.settings.primaryColor || BROCHURE_STYLES.colors.primary);
    this.pdf.rect(margin, yPos, 3, 20, 'F');
    
    this.pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    this.pdf.setFontSize(18);
    this.pdf.text('Plattegronden', margin + 10, yPos + 15);

    // Add floorplan images
    yPos += 40;
    for (const floorplan of this.property.floorplans) {
      try {
        const img = new Image();
        img.src = floorplan;
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

        const xOffset = (BROCHURE_STYLES.pageSize.width - finalWidth) / 2;
        this.pdf.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
        yPos += finalHeight + 20;

        if (yPos > BROCHURE_STYLES.pageSize.height - 40) {
          this.pdf.addPage();
          this.currentPage++;
          this.addPageHeader();
          this.addPageFooter();
          yPos = 50;
        }
      } catch (error) {
        console.error('Error loading floorplan:', error);
      }
    }
  }
}

export const generatePropertyBrochure = async (property: PropertyData, settings: AgencySettings) => {
  const brochure = new PropertyBrochure(property, settings);
  await brochure.generate();
};
