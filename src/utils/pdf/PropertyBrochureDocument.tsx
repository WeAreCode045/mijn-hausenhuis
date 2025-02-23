import { Document, Page, View, Text, Image, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

const createStyles = (settings: AgencySettings) => StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2a2a2a',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4a4a4a',
  },
  image: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginVertical: 10,
    borderRadius: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  featureItem: {
    width: '48%',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 30,
  },
  headerLogo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },
  headerInfo: {
    flex: 1,
  },
  headerText: {
    fontSize: 8,
    color: '#666',
  },
  footerText: {
    fontSize: 10,
    color: '#666',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridImage: {
    width: '31%',
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
  },
  content: {
    marginTop: 20,
    marginBottom: 50,
  },
  areaDescription: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
  },
  areaText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: 'white',
  },
  keyInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  keyInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
  },
  keyInfoBox: {
    width: '31%',
    padding: 15,
    backgroundColor: settings.primaryColor || '#40497A',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: settings.secondaryColor || '#E2E8F0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyInfoContent: {
    flex: 1,
  },
  keyInfoBoxLabel: {
    fontSize: 10,
    color: 'white',
    marginBottom: 4,
  },
  keyInfoBoxValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  floorplanGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginVertical: 15,
  },
  floorplanItem: {
    width: '100%',
    marginBottom: 20,
  },
  floorplanImage: {
    width: '100%',
    height: 400,
    objectFit: 'contain',
    marginVertical: 10,
  },
  floorplanCaption: {
    fontSize: 12,
    color: '#4a4a4a',
    textAlign: 'center',
    marginTop: 5,
  }
});

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
  template?: Section[];
}

const PageHeader = ({ settings, styles }: { settings: AgencySettings; styles: ReturnType<typeof createStyles> }) => (
  <View style={styles.header}>
    {settings.logoUrl && (
      <Image src={settings.logoUrl} style={styles.headerLogo} />
    )}
    <View style={styles.headerInfo}>
      <Text style={styles.headerText}>{settings.name || ''}</Text>
      <Text style={styles.headerText}>{settings.address || ''}</Text>
      <Text style={styles.headerText}>Phone: {settings.phone || ''}</Text>
      <Text style={styles.headerText}>Email: {settings.email || ''}</Text>
    </View>
  </View>
);

const RulerIcon = () => (
  <Svg viewBox="0 0 24 24" width={20} height={20}>
    <Path
      d="M3 21V3h18v18H3z M3 16.5h18 M3 12h18 M3 7.5h18"
      stroke="white"
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

const BedIcon = () => (
  <Svg viewBox="0 0 24 24" width={20} height={20}>
    <Path
      d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8 M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"
      stroke="white"
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

const BathIcon = () => (
  <Svg viewBox="0 0 24 24" width={20} height={20}>
    <Path
      d="M4 12h16a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4h-10a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1z M6 12V5a2 2 0 0 1 2-2h3v2.25"
      stroke="white"
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg viewBox="0 0 24 24" width={20} height={20}>
    <Path
      d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
      stroke="white"
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

export const PropertyBrochureDocument = ({ property, settings, template }: PropertyBrochureDocumentProps) => {
  const {
    gridImages = [],
    features = [],
    nearby_places = [],
    areas = [],
    images = [],
    floorplans = []
  } = property;

  const styles = createStyles(settings);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PageHeader settings={settings} styles={styles} />
        
        {property.featuredImage && (
          <Image src={property.featuredImage} style={styles.image} />
        )}
        
        <View style={styles.section}>
          <Text style={styles.heading}>{property.title || 'Untitled Property'}</Text>
          <Text style={styles.subheading}>{property.price || ''}</Text>
        </View>
        
        <View style={styles.grid}>
          {gridImages.slice(0, 6).map((url, index) => (
            <Image key={index} src={url} style={styles.gridImage} />
          ))}
        </View>

        <Text style={styles.footerText}>
          {[settings.name, settings.phone, settings.email]
            .filter(Boolean)
            .join(' - ')}
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader settings={settings} styles={styles} />
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.heading}>Property Details</Text>
            <Text style={styles.text}>{property.description || ''}</Text>
          </View>

          <View style={styles.keyInfoGrid}>
            <View style={styles.keyInfoBox}>
              <View style={styles.iconContainer}>
                <RulerIcon />
              </View>
              <View style={styles.keyInfoContent}>
                <Text style={styles.keyInfoBoxLabel}>Living Area</Text>
                <Text style={styles.keyInfoBoxValue}>{property.livingArea || '0'} m²</Text>
              </View>
            </View>

            <View style={styles.keyInfoBox}>
              <View style={styles.iconContainer}>
                <RulerIcon />
              </View>
              <View style={styles.keyInfoContent}>
                <Text style={styles.keyInfoBoxLabel}>Plot Size</Text>
                <Text style={styles.keyInfoBoxValue}>{property.sqft || '0'} m²</Text>
              </View>
            </View>

            <View style={styles.keyInfoBox}>
              <View style={styles.iconContainer}>
                <BedIcon />
              </View>
              <View style={styles.keyInfoContent}>
                <Text style={styles.keyInfoBoxLabel}>Bedrooms</Text>
                <Text style={styles.keyInfoBoxValue}>{property.bedrooms || '0'}</Text>
              </View>
            </View>

            <View style={styles.keyInfoBox}>
              <View style={styles.iconContainer}>
                <BathIcon />
              </View>
              <View style={styles.keyInfoContent}>
                <Text style={styles.keyInfoBoxLabel}>Bathrooms</Text>
                <Text style={styles.keyInfoBoxValue}>{property.bathrooms || '0'}</Text>
              </View>
            </View>

            {property.buildYear && (
              <View style={styles.keyInfoBox}>
                <View style={styles.iconContainer}>
                  <CalendarIcon />
                </View>
                <View style={styles.keyInfoContent}>
                  <Text style={styles.keyInfoBoxLabel}>Build Year</Text>
                  <Text style={styles.keyInfoBoxValue}>{property.buildYear}</Text>
                </View>
              </View>
            )}
          </View>

          {features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subheading}>Features</Text>
              <View style={styles.featuresGrid}>
                {features.slice(0, 10).map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.text}>{feature.description || ''}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>

      {floorplans && floorplans.length > 0 && (
        <Page size="A4" style={styles.page}>
          <PageHeader settings={settings} styles={styles} />
          <View style={styles.content}>
            <Text style={styles.heading}>Floorplans</Text>
            <View style={styles.floorplanGrid}>
              {floorplans.map((plan, index) => (
                <View key={index} style={styles.floorplanItem}>
                  <Image 
                    src={plan} 
                    style={styles.floorplanImage}
                  />
                  <Text style={styles.floorplanCaption}>
                    Floorplan {index + 1}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.footerText}>
            {[settings.name, settings.phone, settings.email]
              .filter(Boolean)
              .join(' - ')}
          </Text>
        </Page>
      )}

      {(property.location_description || property.map_image) && (
        <Page size="A4" style={styles.page}>
          <PageHeader settings={settings} styles={styles} />
          <View style={styles.content}>
            <Text style={styles.heading}>Location</Text>
            
            {property.location_description && (
              <View style={styles.areaDescription}>
                <Text style={styles.areaText}>{property.location_description}</Text>
              </View>
            )}

            {property.map_image && (
              <Image src={property.map_image} style={styles.image} />
            )}

            {nearby_places.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.subheading}>Nearby Places</Text>
                {nearby_places.slice(0, 5).map((place, index) => (
                  <View key={index} style={styles.keyInfo}>
                    <Text style={styles.text}>
                      {place.name || ''} - {place.vicinity || ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Page>
      )}

      {areas.length > 0 && areas.slice(0, 4).map((area, index) => (
        <Page key={area.id || index} size="A4" style={styles.page}>
          <PageHeader settings={settings} styles={styles} />
          <View style={styles.content}>
            <Text style={styles.heading}>{area.title || ''}</Text>
            <View style={styles.areaDescription}>
              <Text style={styles.areaText}>{area.description || ''}</Text>
            </View>
            <View style={styles.grid}>
              {(area.imageIds || [])
                .slice(0, 6)
                .map(id => images.find(img => img.id === id))
                .filter(Boolean)
                .map((img, imgIndex) => (
                  <Image key={imgIndex} src={img!.url} style={styles.gridImage} />
                ))}
            </View>
          </View>
        </Page>
      ))}

      <Page size="A4" style={styles.page}>
        <PageHeader settings={settings} styles={styles} />
        <View style={styles.content}>
          <Text style={styles.heading}>Contact Us</Text>
          
          {settings.logoUrl && (
            <Image src={settings.logoUrl} style={{ width: 200, marginBottom: 20 }} />
          )}

          <View style={styles.keyInfo}>
            <Text style={styles.text}>{settings.name || ''}</Text>
            <Text style={styles.text}>{settings.address || ''}</Text>
            <Text style={styles.text}>Phone: {settings.phone || ''}</Text>
            <Text style={styles.text}>Email: {settings.email || ''}</Text>
          </View>

          {(settings.facebookUrl || settings.instagramUrl) && (
            <View style={[styles.keyInfo, { marginTop: 20 }]}>
              <Text style={styles.subheading}>Follow Us</Text>
              {settings.facebookUrl && (
                <Text style={styles.text}>Facebook: {settings.facebookUrl}</Text>
              )}
              {settings.instagramUrl && (
                <Text style={styles.text}>Instagram: {settings.instagramUrl}</Text>
              )}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
