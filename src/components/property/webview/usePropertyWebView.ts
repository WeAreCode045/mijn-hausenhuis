
import { useState } from "react";

export function usePropertyWebView() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

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
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    selectedImage,
    setSelectedImage,
    currentPage,
    setCurrentPage,
    handleShare,
    handlePrint
  };
}
