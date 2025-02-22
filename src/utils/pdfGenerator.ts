
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { pdf } from '@react-pdf/renderer';
import { PropertyBrochureDocument } from './pdf/PropertyBrochureDocument';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings) => {
  const blob = await pdf(PropertyBrochureDocument({ property, settings })).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
