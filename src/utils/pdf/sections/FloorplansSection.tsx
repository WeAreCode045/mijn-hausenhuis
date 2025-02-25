
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const FloorplansSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => (
  <Page size="A4" style={styles.page}>
    <Header settings={settings} styles={styles} />
    <Text style={styles.sectionTitle}>Floorplans</Text>
    <View style={{ gap: 20 }}>
      {(property.floorplans || []).map((plan, index) => (
        <View key={index} style={{ width: '100%', marginBottom: 20 }}>
          <Image 
            src={plan} 
            style={{
              width: '100%',
              height: 400,
              objectFit: 'contain',
              backgroundColor: '#f8f9fa',
              borderRadius: 8
            }} 
          />
        </View>
      ))}
    </View>
    <Footer settings={settings} styles={styles} />
  </Page>
);
