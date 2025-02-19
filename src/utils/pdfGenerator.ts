
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generatePropertyBrochure } from './pdf/templates/propertyBrochure';

export const generatePropertyPDF = async (property: PropertyData, settings?: AgencySettings) => {
  await generatePropertyBrochure(property, settings || {
    name: '',
    email: '',
    phone: '',
    address: '',
    primaryColor: '#9b87f5',
    secondaryColor: '#7E69AB',
    agents: []
  });
};
