
import { Card } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { Home, Car, Calendar, Ruler, Zap } from "lucide-react";

interface DetailsPageProps {
  data: PropertyData;
}

export function DetailsPage({ data }: DetailsPageProps) {
  const getEnergyLabelColor = (label: string) => {
    const colors: { [key: string]: string } = {
      'A+++': 'bg-green-600',
      'A++': 'bg-green-500',
      'A+': 'bg-green-400',
      'A': 'bg-green-300',
      'B': 'bg-lime-400',
      'C': 'bg-yellow-400',
      'D': 'bg-orange-400',
      'E': 'bg-orange-500',
      'F': 'bg-red-400',
      'G': 'bg-red-500',
    };
    return colors[label] || 'bg-gray-400';
  };

  return (
    <Card className="w-full bg-white shadow-lg animate-fadeIn mb-8 p-6">
      <div className="grid grid-cols-4 gap-6 bg-estate-50 p-6 rounded-lg mb-6">
        <div className="flex flex-col items-center">
          <Home className="w-8 h-8 text-estate-600 mb-2" />
          <p className="text-estate-500 text-sm">Woonoppervlak</p>
          <p className="text-lg font-semibold">{data.livingArea} m²</p>
        </div>
        <div className="flex flex-col items-center">
          <Ruler className="w-8 h-8 text-estate-600 mb-2" />
          <p className="text-estate-500 text-sm">Perceel</p>
          <p className="text-lg font-semibold">{data.sqft} m²</p>
        </div>
        <div className="flex flex-col items-center">
          <Calendar className="w-8 h-8 text-estate-600 mb-2" />
          <p className="text-estate-500 text-sm">Bouwjaar</p>
          <p className="text-lg font-semibold">{data.buildYear}</p>
        </div>
        <div className="flex flex-col items-center">
          <Car className="w-8 h-8 text-estate-600 mb-2" />
          <p className="text-estate-500 text-sm">Garages</p>
          <p className="text-lg font-semibold">{data.garages}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 bg-estate-50 p-6 rounded-lg mb-6">
        <div className="text-center">
          <p className="text-estate-500 text-sm">Slaapkamers</p>
          <p className="text-xl font-semibold">{data.bedrooms}</p>
        </div>
        <div className="text-center">
          <p className="text-estate-500 text-sm">Badkamers</p>
          <p className="text-xl font-semibold">{data.bathrooms}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <p className="text-estate-500 text-sm">Energielabel</p>
          </div>
          <div className={`mt-2 px-4 py-1 rounded-full text-white font-semibold ${getEnergyLabelColor(data.energyLabel)}`}>
            {data.energyLabel}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-estate-700 mb-2">Locatie</h3>
          <p className="text-estate-600">{data.address}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-estate-700 mb-2">Beschrijving</h3>
          <p className="text-estate-600 whitespace-pre-wrap leading-relaxed">{data.description}</p>
        </div>
      </div>
    </Card>
  );
}
