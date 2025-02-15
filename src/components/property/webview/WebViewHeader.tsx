
import { Button } from "@/components/ui/button";
import { Share2, Printer } from "lucide-react";
import { getPrintStyles } from "./PrintStyles";

interface WebViewHeaderProps {
  logoUrl?: string;
  handleShare: (platform: string) => void;
  title?: string;
}

export function WebViewHeader({ logoUrl, handleShare, title = "Brochure" }: WebViewHeaderProps) {
  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = getPrintStyles();
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <div className="p-6 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        {logoUrl && (
          <img src={logoUrl} alt="Agency Logo" className="h-12 object-contain" />
        )}
        <div className="text-2xl font-semibold">{title}</div>
      </div>
      <div className="flex gap-2 no-print">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleShare('whatsapp')}
          title="Share on WhatsApp"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handlePrint}
          title="Print Brochure"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
