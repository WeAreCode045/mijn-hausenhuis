
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { ImagePreviewDialog } from "./components/ImagePreviewDialog";
import { WebViewHeader } from "./WebViewHeader";

interface PropertyWebViewContentProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
}

export function PropertyWebViewContent({
  property,
  settings,
  currentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload,
  isPrintView = false,
  waitForPlaces = false
}: PropertyWebViewContentProps) {
  const sections = getSections({ 
    property, 
    settings, 
    currentPage, 
    isPrintView,
    waitForPlaces
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b">
        <WebViewHeader settings={settings} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="h-full">
          {sections[currentPage]?.content}
        </div>
      </div>

      {/* Footer */}
      {!isPrintView && (
        <div 
          className="p-4 border-t flex justify-between items-center"
          style={{ backgroundColor: settings?.primaryColor || '#9b87f5' }}
        >
          <span className="font-semibold text-white">
            {property.title}
          </span>
          <span className="text-white text-sm">
            {currentPage + 1}
          </span>
        </div>
      )}

      <ImagePreviewDialog 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
