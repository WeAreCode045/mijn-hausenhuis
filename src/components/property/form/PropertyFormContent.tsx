
import React from 'react';
import { PropertyFormData, PropertyArea } from '@/types/property';

export interface PropertyFormContentProps {
  formData: PropertyFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentStep: number;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (urls: string[]) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
  handleAreaImageUpload: (id: string, files: FileList) => void;
  removeAreaImage: (areaId: string, imageUrl: string) => void;
  handleMapImageDelete: () => Promise<void>;
}

export const PropertyFormContent: React.FC<PropertyFormContentProps> = ({
  formData,
  onSubmit,
  currentStep,
  addFeature,
  removeFeature,
  updateFeature,
  handleInputChange,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  addArea,
  removeArea,
  updateArea,
  handleAreaImageUpload,
  removeAreaImage,
  handleMapImageDelete
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                name="price"
                id="price"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                type="text"
                name="bedrooms"
                id="bedrooms"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="text"
                name="bathrooms"
                id="bathrooms"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                Sqft
              </label>
              <input
                type="text"
                name="sqft"
                id="sqft"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.sqft}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="livingArea" className="block text-sm font-medium text-gray-700">
                Living Area
              </label>
              <input
                type="text"
                name="livingArea"
                id="livingArea"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.livingArea}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="buildYear" className="block text-sm font-medium text-gray-700">
                Build Year
              </label>
              <input
                type="text"
                name="buildYear"
                id="buildYear"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.buildYear}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="garages" className="block text-sm font-medium text-gray-700">
                Garages
              </label>
              <input
                type="text"
                name="garages"
                id="garages"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.garages}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      default:
        return <div>No content for this step.</div>;
    }
  };

  return (
    <div>
      {renderStepContent()}
    </div>
  );
};
