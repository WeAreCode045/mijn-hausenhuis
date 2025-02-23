
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
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
    position: 'absolute',
    top: 20,
    left: 30,
    right: 30,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    color: 'white',
  },
  footerText: {
    fontSize: 10,
    color: 'white',
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
    marginTop: 70, // Space for header
    marginBottom: 50, // Space for footer
  },
  areaContent: {
    flex: 1,
  },
  areaDescription: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  areaImageGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  areaImage: {
    width: '48%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
  },
  keyInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  keyInfoItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  keyInfoLabel: {
    width: 100,
    fontSize: 12,
    color: '#666',
  },
  keyInfoValue: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  }
});

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
}

const PageHeader = ({ settings }: { settings: AgencySettings }) => (
  <View style={styles.header}>
    {settings.logoUrl && (
      <Image src={settings.logoUrl} style={styles.headerLogo} />
    )}
    <View style={styles.headerInfo}>
      <Text style={styles.headerText}>{settings.name}</Text>
      <Text style={styles.headerText}>{settings.address}</Text>
      <Text style={styles.headerText}>Phone: {settings.phone}</Text>
      <Text style={styles.headerText}>Email: {settings.email}</Text>
    </View>
  </View>
);

const PageFooter = ({ title, pageNumber, settings }: { title: string; pageNumber: number; settings: AgencySettings }) => (
  <View style={[styles.footer, { backgroundColor: settings.primaryColor || '#9b87f5' }]}>
    <Text style={styles.footerText}>{title}</Text>
    <Text style={styles.footerText}>Page {pageNumber}</Text>
  </View>
);

export const PropertyBrochureDocument = ({ property, settings }: PropertyBrochureDocumentProps) => (
  <Document>
    {/* Cover Page - No header/footer */}
    <Page size="A4" style={styles.page}>
      {property.featuredImage && (
        <Image src={property.featuredImage} style={styles.image} />
      )}
      <View style={styles.section}>
        <Text style={styles.heading}>{property.title}</Text>
        <Text style={styles.subheading}>{property.price}</Text>
      </View>
      
      <View style={styles.grid}>
        {(property.gridImages || []).slice(0, 6).map((url, index) => (
          <Image key={index} src={url} style={styles.gridImage} />
        ))}
      </View>

      <Text style={[styles.footerText, { color: '#666', position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center' }]}>
        {settings.name} - {settings.phone} - {settings.email}
      </Text>
    </Page>

    {/* Details Page */}
    <Page size="A4" style={styles.page}>
      <PageHeader settings={settings} />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>Property Details</Text>
          <Text style={styles.text}>{property.description}</Text>
        </View>

        <View style={styles.keyInfo}>
          <Text style={styles.subheading}>Key Information</Text>
          <View style={styles.keyInfoItem}>
            <Text style={styles.keyInfoLabel}>Living Area:</Text>
            <Text style={styles.keyInfoValue}>{property.livingArea} m²</Text>
          </View>
          <View style={styles.keyInfoItem}>
            <Text style={styles.keyInfoLabel}>Plot Size:</Text>
            <Text style={styles.keyInfoValue}>{property.sqft} m²</Text>
          </View>
          <View style={styles.keyInfoItem}>
            <Text style={styles.keyInfoLabel}>Bedrooms:</Text>
            <Text style={styles.keyInfoValue}>{property.bedrooms}</Text>
          </View>
          <View style={styles.keyInfoItem}>
            <Text style={styles.keyInfoLabel}>Bathrooms:</Text>
            <Text style={styles.keyInfoValue}>{property.bathrooms}</Text>
          </View>
          {property.buildYear && (
            <View style={styles.keyInfoItem}>
              <Text style={styles.keyInfoLabel}>Build Year:</Text>
              <Text style={styles.keyInfoValue}>{property.buildYear}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Features</Text>
          <View style={styles.featuresGrid}>
            {(property.features || []).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.text}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <PageFooter title={property.title} pageNumber={2} settings={settings} />
    </Page>

    {/* Individual Area Pages */}
    {(property.areas || []).map((area, index) => (
      <Page key={area.id} size="A4" style={styles.page}>
        <PageHeader settings={settings} />
        <View style={styles.content}>
          <Text style={styles.heading}>{area.title}</Text>
          <View style={styles.areaDescription}>
            <Text style={styles.text}>{area.description}</Text>
          </View>
          <View style={styles.areaImageGrid}>
            {(area.imageIds || [])
              .map(id => (property.images || []).find(img => img.id === id))
              .filter(Boolean)
              .map((img, imgIndex) => (
                <Image key={imgIndex} src={img!.url} style={styles.areaImage} />
              ))}
          </View>
        </View>
        <PageFooter 
          title={property.title} 
          pageNumber={3 + index} 
          settings={settings} 
        />
      </Page>
    ))}

    {/* Location Page */}
    {(property.location_description || property.map_image || (property.nearby_places || []).length > 0) && (
      <Page size="A4" style={styles.page}>
        <PageHeader settings={settings} />
        <View style={styles.content}>
          <Text style={styles.heading}>Location</Text>
          
          {property.location_description && (
            <View style={styles.areaDescription}>
              <Text style={styles.text}>{property.location_description}</Text>
            </View>
          )}

          {property.map_image && (
            <Image src={property.map_image} style={styles.image} />
          )}

          {(property.nearby_places || []).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subheading}>Nearby Places</Text>
              {property.nearby_places?.map((place, index) => (
                <View key={index} style={styles.keyInfoItem}>
                  <Text style={styles.text}>
                    {place.name} - {place.vicinity}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <PageFooter 
          title={property.title} 
          pageNumber={3 + (property.areas?.length || 0)} 
          settings={settings} 
        />
      </Page>
    )}

    {/* Contact Page */}
    <Page size="A4" style={styles.page}>
      <PageHeader settings={settings} />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>Contact Us</Text>
          
          {settings.logoUrl && (
            <Image src={settings.logoUrl} style={{ width: 200, marginBottom: 20 }} />
          )}

          <View style={styles.keyInfo}>
            <Text style={styles.text}>{settings.name}</Text>
            <Text style={styles.text}>{settings.address}</Text>
            <Text style={styles.text}>Phone: {settings.phone}</Text>
            <Text style={styles.text}>Email: {settings.email}</Text>
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
      </View>
      <PageFooter 
        title={property.title} 
        pageNumber={4 + (property.areas?.length || 0)} 
        settings={settings} 
      />
    </Page>
  </Document>
);
