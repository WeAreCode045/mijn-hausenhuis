
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

export const CoverSection = ({ property, settings, styles }: { 
  property: PropertyData; 
  settings: AgencySettings; 
  styles: any; 
}) => (
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
      {(property.gridImages || []).slice(0, 3).map((url, index) => (
        <Image 
          key={index} 
          src={url} 
          style={{
            width: '31%',
            height: 140,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 15
          }} 
        />
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
