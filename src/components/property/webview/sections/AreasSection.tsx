
import { WebViewSectionProps } from "../types";

export function AreasSection({ property, settings }: WebViewSectionProps) {
  if (!property.areas || property.areas.length === 0) return null;

  // Calculate which areas should be shown on this page based on the page number
  const pageMatch = property.currentPath?.match(/areas-(\d+)/);
  const pageIndex = pageMatch ? parseInt(pageMatch[1]) : 0;
  const startIndex = pageIndex * 2;
  const areasForThisPage = property.areas.slice(startIndex, startIndex + 2);

  // Looking at the console logs, the area photos are stored in the areaPhotos array
  const getAreaImages = (index: number): string[] => {
    if (!property.areaPhotos) return [];
    // Calculate the starting index for this area's photos (2 photos per area)
    const startIdx = index * 2;
    return property.areaPhotos.slice(startIdx, startIdx + 2);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="px-6 space-y-8">
        {areasForThisPage.map((area, index) => {
          const areaImages = getAreaImages(startIndex + index);
          
          return (
            <div key={index} className="space-y-4">
              <div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: settings?.secondaryColor }}
                >
                  {area.title}
                </h3>
                <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {area.description}
                </p>
              </div>

              {areaImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {areaImages.map((imageUrl, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={imageUrl}
                      alt={`${area.title} ${imgIndex + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
