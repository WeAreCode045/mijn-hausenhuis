
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

const Index = () => {
  const navigate = useNavigate();
  const { properties, handleDelete } = useProperties();

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800">Woning Brochures</h1>
          <Button onClick={() => navigate('/property/new')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nieuwe Brochure
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
