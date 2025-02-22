
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
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  image: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginVertical: 10,
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
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
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
  },
});

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
}

export const PropertyBrochureDocument = ({ property, settings }: PropertyBrochureDocumentProps) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      {property.featuredImage && (
        <Image src={property.featuredImage} style={styles.image} />
      )}
      <View style={styles.section}>
        <Text style={styles.heading}>{property.title}</Text>
        <Text style={styles.subheading}>{property.price}</Text>
      </View>
      
      {/* Grid Images */}
      <View style={styles.grid}>
        {property.gridImages.slice(0, 6).map((url, index) => (
          <Image key={index} src={url} style={styles.gridImage} />
        ))}
      </View>

      <Text style={styles.footer}>
        {settings.name} - {settings.phone} - {settings.email}
      </Text>
    </Page>

    {/* Details Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Property Details</Text>
        <Text style={styles.text}>{property.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Features</Text>
        <View style={styles.featuresGrid}>
          {property.features?.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.text}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Key Information</Text>
        <Text style={styles.text}>Living Area: {property.livingArea} m²</Text>
        <Text style={styles.text}>Plot Size: {property.sqft} m²</Text>
        <Text style={styles.text}>Bedrooms: {property.bedrooms}</Text>
        <Text style={styles.text}>Bathrooms: {property.bathrooms}</Text>
        {property.buildYear && (
          <Text style={styles.text}>Build Year: {property.buildYear}</Text>
        )}
      </View>
    </Page>

    {/* Areas Pages */}
    {property.areas && property.areas.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Areas</Text>
        {property.areas.map((area, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{area.title}</Text>
            <Text style={styles.text}>{area.description}</Text>
            <View style={styles.grid}>
              {area.imageIds
                .map(id => property.images.find(img => img.id === id))
                .filter(Boolean)
                .map((img, imgIndex) => (
                  <Image key={imgIndex} src={img!.url} style={styles.gridImage} />
                ))}
            </View>
          </View>
        ))}
      </Page>
    )}

    {/* Location Page */}
    {(property.location_description || property.map_image || property.nearby_places?.length > 0) && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Location</Text>
        
        {property.location_description && (
          <View style={styles.section}>
            <Text style={styles.text}>{property.location_description}</Text>
          </View>
        )}

        {property.map_image && (
          <Image src={property.map_image} style={styles.image} />
        )}

        {property.nearby_places && property.nearby_places.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subheading}>Nearby Places</Text>
            {property.nearby_places.map((place, index) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={styles.text}>
                  {place.name} - {place.vicinity}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    )}

    {/* Contact Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Contact Us</Text>
        
        {settings.logoUrl && (
          <Image src={settings.logoUrl} style={{ width: 200, marginBottom: 20 }} />
        )}

        <Text style={styles.text}>{settings.name}</Text>
        <Text style={styles.text}>{settings.address}</Text>
        <Text style={styles.text}>Phone: {settings.phone}</Text>
        <Text style={styles.text}>Email: {settings.email}</Text>

        {(settings.facebookUrl || settings.instagramUrl) && (
          <View style={{ marginTop: 20 }}>
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
