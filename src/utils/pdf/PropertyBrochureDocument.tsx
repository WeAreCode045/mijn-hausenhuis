
import { Document } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Section } from '@/components/brochure/TemplateBuilder';
import { createStyles } from './styles/pdfStyles';
import { CoverSection } from './sections/CoverSection';
import { DetailsSection } from './sections/DetailsSection';
import { AreasSection } from './sections/AreasSection';
import { FloorplansSection } from './sections/FloorplansSection';
import { LocationSection } from './sections/LocationSection';
import { ContactSection } from './sections/ContactSection';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
  template?: Section[];
}

export const PropertyBrochureDocument = ({ property, settings, template }: PropertyBrochureDocumentProps) => {
  const styles = createStyles(settings);

  const defaultSections: Section[] = [
    { id: 'cover', type: 'cover', title: 'Cover Page', design: { padding: '2rem', containers: [] } },
    { id: 'details', type: 'details', title: 'Property Details', design: { padding: '2rem', containers: [] } },
    { id: 'areas', type: 'areas', title: 'Areas', design: { padding: '2rem', containers: [] } },
    { id: 'floorplans', type: 'floorplans', title: 'Floorplans', design: { padding: '2rem', containers: [] } },
    { id: 'location', type: 'location', title: 'Location', design: { padding: '2rem', containers: [] } },
    { id: 'contact', type: 'contact', title: 'Contact', design: { padding: '2rem', containers: [] } }
  ];

  const sections = template || defaultSections;
  
  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'cover':
        return <CoverSection key={section.id} property={property} settings={settings} styles={styles} />;
      case 'details':
        return <DetailsSection key={section.id} property={property} settings={settings} styles={styles} />;
      case 'areas':
        return <AreasSection key={section.id} property={property} settings={settings} styles={styles} />;
      case 'floorplans':
        return <FloorplansSection key={section.id} property={property} settings={settings} styles={styles} />;
      case 'location':
        return <LocationSection key={section.id} property={property} settings={settings} styles={styles} />;
      case 'contact':
        return <ContactSection key={section.id} property={property} settings={settings} styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <Document>
      {sections.map((section) => renderSection(section))}
    </Document>
  );
};
