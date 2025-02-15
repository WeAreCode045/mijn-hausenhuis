
import { Home, Ruler, Bed, Bath, Car, CalendarDays, Zap, MapPin } from "lucide-react";
import { PropertyData } from "@/types/property";

interface PropertyDetailsProps {
  property: PropertyData;
  primaryColor?: string;
}

export function PropertyDetails({ property, primaryColor }: PropertyDetailsProps) {
  const detailsConfig = [
    { icon: Home, label: "Living Area", value: `${property.livingArea} m²` },
    { icon: Ruler, label: "Plot Size", value: `${property.sqft} m²` },
    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { icon: Car, label: "Garages", value: property.garages },
    { icon: CalendarDays, label: "Build Year", value: property.buildYear },
    { icon: Zap, label: "Energy Label", value: property.energyLabel },
    { icon: MapPin, label: "Garden", value: property.hasGarden ? "Yes" : "No" }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {detailsConfig.map((detail, index) => (
        <div
          key={index}
          className="p-4 rounded-lg text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: primaryColor }}
        >
          <detail.icon className="w-6 h-6 text-white mb-2" />
          <p className="text-white font-bold text-sm mb-1">{detail.label}</p>
          <p className="text-white font-bold">{detail.value}</p>
        </div>
      ))}
    </div>
  );
}
