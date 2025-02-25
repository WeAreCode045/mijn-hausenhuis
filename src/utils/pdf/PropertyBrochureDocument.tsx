import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Section } from '@/components/brochure/TemplateBuilder';

const createStyles = (settings: AgencySettings) => StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  coverLogo: {
    width: 150,
    height: 50,
    objectFit: 'contain',
  },
  handwrittenText: {
    fontFamily: 'Helvetica',
    fontSize: 24,
    color: settings.secondaryColor || '#2a2a2a',
    fontStyle: 'italic',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: settings.primaryColor || '#9b87f5',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 900,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  coverPrice: {
    fontSize: 28,
    color: 'white',
    fontWeight: 900,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    color: settings.primaryColor || '#1a1a1a',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4a4a4a',
  },
  descriptionBlock: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginVertical: 15,
  },
  keyInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 20,
  },
  keyInfoBox: {
    width: '31%',
    padding: 15,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
    marginBottom: 10,
  },
  keyInfoLabel: {
    fontSize: 10,
    color: 'white',
    marginBottom: 4,
  },
  keyInfoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 60,
  },
  gridImage: {
    width: '23%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 8,
    aspectRatio: '4:3',
  },
  areaGridImage: {
    width: '48%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  fullWidthImage: {
    width: '100%',
    height: 400,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  categoryBlock: {
    backgroundColor: settings.primaryColor || '#40497A',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 15,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeItem: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  contactBlock: {
    width: '48%',
    padding: 20,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
    marginBottom: 20,
  },
  contactTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactInfo: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  qrCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrLabel: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  headerLogo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

const Header = ({ settings, styles }: { settings: AgencySettings; styles: any }) => (
  <View style={styles.header}>
    {settings.logoUrl && (
      <Image src={settings.logoUrl} style={styles.headerLogo} />
    )}
    <View style={{ flex: 1 }}>
      <Text style={styles.text}>{settings.name || ''}</Text>
      <Text style={styles.text}>{settings.phone || ''}</Text>
    </View>
  </View>
);

const Footer = ({ settings, styles }: { settings: AgencySettings; styles: any }) => (
  <View style={styles.footer}>
    <Text>{`${settings.name} - ${settings.address} - ${settings.phone} - ${settings.email}`}</Text>
  </View>
);

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
  template?: Section[];
}

export const PropertyBrochureDocument = ({ property, settings, template }: PropertyBrochureDocumentProps) => {
  const styles = createStyles(settings);

  const defaultSections: Section[] = [
    { 
      id: 'cover', 
      type: 'cover',
      title: 'Cover Page',
      design: {
        padding: '2rem',
        containers: []
      }
    },
    { 
      id: 'details',
      type: 'details',
      title: 'Property Details',
      design: {
        padding: '2rem',
        containers: []
      }
    },
    { 
      id: 'location',
      type: 'location',
      title: 'Location',
      design: {
        padding: '2rem',
        containers: []
      }
    },
    { 
      id: 'floorplans',
      type: 'floorplans',
      title: 'Floorplans',
      design: {
        padding: '2rem',
        containers: []
      }
    },
    { 
      id: 'areas',
      type: 'areas',
      title: 'Areas',
      design: {
        padding: '2rem',
        containers: []
      }
    },
    { 
      id: 'contact',
      type: 'contact',
      title: 'Contact',
      design: {
        padding: '2rem',
        containers: []
      }
    }
  ];

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'cover':
        return (
          <Page size="A4" style={styles.page}>
            <View style={styles.coverHeader}>
              {settings.logoUrl && (
                <Image src={settings.logoUrl} style={styles.coverLogo} />
              )}
              <Text style={styles.handwrittenText}>Wordt dit uw droomhuis?</Text>
            </View>

            {property.featuredImage && (
              <Image 
                src={property.featuredImage} 
                style={styles.fullWidthImage} 
              />
            )}

            <View style={styles.imageGrid}>
              {(property.gridImages || []).slice(0, 4).map((url, index) => (
                <Image key={index} src={url} style={styles.gridImage} />
              ))}
            </View>

            <View style={styles.coverFooter}>
              <Text style={styles.coverTitle}>
                {property.title || 'Untitled Property'}
              </Text>
              <Text style={styles.coverPrice}>
                {property.price || ''}
              </Text>
            </View>
          </Page>
        );

      case 'details':
        return (
          <Page size="A4" style={styles.page}>
            <Header settings={settings} styles={styles} />
            <View style={styles.keyInfoGrid}>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Living Area</Text>
                <Text style={styles.keyInfoValue}>{property.livingArea} m²</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Plot Size</Text>
                <Text style={styles.keyInfoValue}>{property.sqft} m²</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Bedrooms</Text>
                <Text style={styles.keyInfoValue}>{property.bedrooms}</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Bathrooms</Text>
                <Text style={styles.keyInfoValue}>{property.bathrooms}</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Build Year</Text>
                <Text style={styles.keyInfoValue}>{property.buildYear}</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.keyInfoLabel}>Energy Label</Text>
                <Text style={styles.keyInfoValue}>{property.energyLabel || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.descriptionBlock}>
              <Text style={styles.text}>{property.description}</Text>
            </View>
            <Footer settings={settings} styles={styles} />
          </Page>
        );

      case 'areas':
        return property.areas.map((area, index) => {
          console.log(`Processing area ${area.title} with ${area.imageIds?.length} images`);
          const imagesPerPage = 6; // 3 rows of 2 images
          const totalPages = Math.ceil((area.imageIds?.length || 0) / imagesPerPage);
          
          return Array.from({ length: totalPages }).map((_, pageIndex) => {
            console.log(`Creating page ${pageIndex + 1} of ${totalPages} for area ${area.title}`);
            return (
              <Page key={`${index}-${pageIndex}`} size="A4" style={styles.page}>
                <Header settings={settings} styles={styles} />
                {pageIndex === 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{area.title}</Text>
                    <Text style={[styles.text, { marginBottom: 20 }]}>{area.description}</Text>
                  </>
                )}
                <View style={styles.imageGrid}>
                  {(area.imageIds || [])
                    .slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage)
                    .map((imageId, imgIndex) => {
                      const imageUrl = property.images.find(img => img.id === imageId)?.url;
                      console.log(`Processing image ${imgIndex + 1} with URL:`, imageUrl);
                      if (!imageUrl) return null;

                      return (
                        <Image
                          key={imgIndex}
                          src={imageUrl}
                          style={styles.areaGridImage}
                        />
                      );
                    })}
                </View>
                <Footer settings={settings} styles={styles} />
              </Page>
            );
          });
        }).flat();

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
        const placesByType = (property.nearby_places || []).reduce((acc: Record<string, any[]>, place) => {
          if (!acc[place.type]) acc[place.type] = [];
          if (acc[place.type].length < 2) acc[place.type].push(place);
          return acc;
        }, {});

        return (
          <Page size="A4" style={styles.page}>
            <Header settings={settings} styles={styles} />
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={[styles.text, styles.descriptionBlock]}>
              {property.location_description}
            </Text>
            <View style={styles.imageGrid}>
              {Object.entries(placesByType).map(([type, places], index) => (
                <View key={type} style={styles.categoryBlock}>
                  <Text style={styles.categoryTitle}>{type.replace('_', ' ').toUpperCase()}</Text>
                  {places.map((place, placeIndex) => (
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
                {/* Add agent information here when available */}
              </View>
            </View>
            <View style={styles.qrCodeContainer}>
              {/* QR codes will be added here */}
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
