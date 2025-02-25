
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Section } from '@/components/brochure/TemplateBuilder';
import { createStyles } from './styles/pdfStyles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CoverSection } from './sections/CoverSection';
import { DetailsSection } from './sections/DetailsSection';
import { AreasSection } from './sections/AreasSection';

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
    { id: 'location', type: 'location', title: 'Location', design: { padding: '2rem', containers: [] } },
    { id: 'floorplans', type: 'floorplans', title: 'Floorplans', design: { padding: '2rem', containers: [] } },
    { id: 'areas', type: 'areas', title: 'Areas', design: { padding: '2rem', containers: [] } },
    { id: 'contact', type: 'contact', title: 'Contact', design: { padding: '2rem', containers: [] } }
  ];

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'cover':
        return <CoverSection property={property} settings={settings} styles={styles} />;
      case 'details':
        return <DetailsSection property={property} settings={settings} styles={styles} />;
      case 'areas':
        return <AreasSection property={property} settings={settings} styles={styles} />;
      case 'floorplans':
        return (
          <Page size="A4" style={styles.page}>
            <Header settings={settings} styles={styles} />
            <Text style={styles.sectionTitle}>Floorplans</Text>
            <View style={styles.imageGrid}>
              {(property.floorplans || []).map((plan, index) => (
                <Image key={index} src={plan} style={styles.gridImage} />
              ))}
            </View>
            <Footer settings={settings} styles={styles} />
          </Page>
        );
      case 'location':
        return (
          <Page size="A4" style={styles.page}>
            <Header settings={settings} styles={styles} />
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={[styles.text, styles.descriptionBlock]}>
              {property.location_description}
            </Text>
            <View style={styles.imageGrid}>
              {Object.entries(
                (property.nearby_places || []).reduce((acc: Record<string, any[]>, place) => {
                  if (!acc[place.type]) acc[place.type] = [];
                  if (acc[place.type].length < 2) acc[place.type].push(place);
                  return acc;
                }, {})
              ).map(([type, places], index) => (
                <View key={type} style={styles.categoryBlock}>
                  <Text style={styles.categoryTitle}>{type.replace('_', ' ').toUpperCase()}</Text>
                  {places.map((place: any, placeIndex: number) => (
                    <Text key={placeIndex} style={styles.placeItem}>
                      {place.name} ({place.vicinity})
                    </Text>
                  ))}
                </View>
              ))}
            </View>
            {property.map_image && (
              <Image src={property.map_image} style={[styles.fullWidthImage, { marginTop: 20 }]} />
            )}
            <Footer settings={settings} styles={styles} />
          </Page>
        );
      case 'contact':
        return (
          <Page size="A4" style={styles.page}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.contactBlock}>
                <Text style={styles.contactTitle}>Agency Information</Text>
                <Text style={styles.contactInfo}>{settings.name}</Text>
                <Text style={styles.contactInfo}>{settings.address}</Text>
                <Text style={styles.contactInfo}>{settings.phone}</Text>
                <Text style={styles.contactInfo}>{settings.email}</Text>
              </View>
              <View style={styles.contactBlock}>
                <Text style={styles.contactTitle}>Agent Information</Text>
                <Text style={styles.contactInfo}>Your dedicated agent</Text>
              </View>
            </View>
          </Page>
        );
      default:
        return null;
    }
  };

  const sections = template || defaultSections;
  
  return (
    <Document>
      {sections.map((section) => renderSection(section))}
    </Document>
  );
};
