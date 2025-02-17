
import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";
import { CoverPage } from "./BrochurePreview/CoverPage";
import { DetailsPage } from "./BrochurePreview/DetailsPage";
import { FeaturesPage } from "./BrochurePreview/FeaturesPage";
import { MediaPage } from "./BrochurePreview/MediaPage";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

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
      setTimeout(onRenderComplete, 500);
    }
  }, [onRenderComplete]);

  const PageWrapper = ({ children, pageNumber }: { children: React.ReactNode; pageNumber: number }) => {
    const showHeaderFooter = pageNumber !== 0;

    return (
      <div className="flex flex-col h-full">
        {showHeaderFooter && (
          <div className="p-6 pb-2 flex justify-between items-start border-b">
            <div className="flex flex-col gap-2">
              {agencyLogo && (
                <img
                  src={agencyLogo}
                  alt="Agency Logo"
                  className="h-12 object-contain"
                />
              )}
            </div>
            <div className="flex items-center gap-4 text-xs">
              {agencySettings?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-estate-600" />
                  <span>{agencySettings.address}</span>
                </div>
              )}
              {agencySettings?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-estate-600" />
                  <span>{agencySettings.phone}</span>
                </div>
              )}
              {agencySettings?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-estate-600" />
                  <span>{agencySettings.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`flex-1 ${showHeaderFooter ? 'p-6' : ''}`}>
          {children}
        </div>

        {showHeaderFooter && (
          <div className="p-4 border-t mt-auto flex justify-between items-center bg-estate-50">
            <span className="font-semibold text-estate-600">
              {pageNumber === 1 ? "Details" : 
               pageNumber === 2 ? "Kenmerken" : "Media"}
            </span>
            <span className="text-sm text-estate-500">{pageNumber + 1}</span>
          </div>
        )}
      </div>
    );
  };

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
            <PageWrapper pageNumber={index}>
              {page}
            </PageWrapper>
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
