
import { useState } from "react";
import { usePageCalculation } from "./hooks/usePageCalculation";
import type { PropertyData } from "@/types/property";

export function usePropertyWebView(propertyData?: PropertyData) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { calculateTotalPages } = usePageCalculation();

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const text = `Check out this property: `;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent('Property')}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPages = propertyData ? calculateTotalPages(propertyData) : 0;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    currentPage,
    setCurrentPage,
    handleShare,
    handlePrint,
    handleNext,
    handlePrevious,
    totalPages
  };
}
