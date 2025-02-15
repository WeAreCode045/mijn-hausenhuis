
import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";
import { CoverPage } from "./BrochurePreview/CoverPage";
import { DetailsPage } from "./BrochurePreview/DetailsPage";
import { FeaturesPage } from "./BrochurePreview/FeaturesPage";
import { MediaPage } from "./BrochurePreview/MediaPage";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BrochurePreviewProps {
  data: PropertyData;
  onRenderComplete?: () => void;
}

export function BrochurePreview({ data, onRenderComplete }: BrochurePreviewProps) {
  const [agencySettings, setAgencySettings] = useState<any>(null);
  const [agencyLogo, setAgencyLogo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const settings = localStorage.getItem("agencySettings");
    const logo = localStorage.getItem("agencyLogo");
    if (settings) {
      setAgencySettings(JSON.parse(settings));
    }
    if (logo) {
      setAgencyLogo(logo);
    }
  }, []);

  useEffect(() => {
    if (onRenderComplete) {
      // Add a small delay to ensure all images are loaded
      setTimeout(onRenderComplete, 500);
    }
  }, [onRenderComplete]);

  const pages = [
    <CoverPage key="cover" data={data} agencySettings={agencySettings} agencyLogo={agencyLogo} />,
    <DetailsPage key="details" data={data} />,
    data.features.length > 0 && <FeaturesPage key="features" features={data.features} address={data.address} />,
    (data.images.length > 0 || data.floorplans.length > 0) && (
      <MediaPage key="media" images={data.images} floorplans={data.floorplans} />
    ),
  ].filter(Boolean);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`brochure-page bg-white ${index === currentPage ? 'block' : 'hidden'}`}
            style={{ width: '794px', minHeight: '1123px' }}
          >
            {page}
          </div>
        ))}
        
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-estate-600">
            Pagina {currentPage + 1} van {pages.length}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
