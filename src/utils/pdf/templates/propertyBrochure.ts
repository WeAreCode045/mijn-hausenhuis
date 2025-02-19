
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generateCoverPage } from '../sections/coverPage';
import { generateDetailsPage } from '../sections/detailsPage';
import { generateAreaPages } from '../sections/areaPages';
import { generateFloorplanPages } from '../sections/floorplanPages';
import { generateLocationPage } from '../sections/locationPage';
import { generateContactPage } from '../sections/contactPage';
import { calculateTotalPages } from '../utils/pageUtils';

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

  public async generate() {
    // Cover page
    await generateCoverPage(this.pdf, this.property, this.currentPage);

    // Details page
    this.currentPage++;
    await generateDetailsPage(this.pdf, this.property, this.settings, this.currentPage, this.totalPages);

    // Areas pages
    if (this.property.areas?.length) {
      this.currentPage = await generateAreaPages(
        this.pdf,
        this.property.areas,
        this.settings,
        this.currentPage,
        this.totalPages,
        this.property.title
      );
    }

    // Floorplans
    if (this.property.floorplans?.length) {
      this.currentPage = await generateFloorplanPages(
        this.pdf,
        this.property.floorplans,
        this.settings,
        this.currentPage,
        this.totalPages,
        this.property.title
      );
    }

    // Location page
    this.currentPage = await generateLocationPage(
      this.pdf,
      this.property,
      this.settings,
      this.currentPage,
      this.totalPages,
      this.property.title
    );

    // Contact page
    this.currentPage++;
    await generateContactPage(
      this.pdf,
      this.settings,
      this.currentPage,
      this.totalPages,
      this.property.title
    );

    // Save PDF
    const filename = `${this.property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brochure.pdf`;
    this.pdf.save(filename);
  }
}

export const generatePropertyBrochure = async (property: PropertyData, settings: AgencySettings) => {
  const brochure = new PropertyBrochure(property, settings);
  await brochure.generate();
};
