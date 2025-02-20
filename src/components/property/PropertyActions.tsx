
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, ExternalLink, Share2, Trash2 } from "lucide-react";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyActionsProps {
  property: PropertyData;
  settings: AgencySettings;
  onDelete: () => void;
}

export function PropertyActions({ property, settings, onDelete }: PropertyActionsProps) {
  const navigate = useNavigate();
  
  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/property/${property.id}/webview`;
    const text = `Check out this property: ${property.title}`;
    
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
        window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
    }
  };

  const handleDownloadPDF = async () => {
    await generatePropertyPDF(property, settings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/property/${property.id}/webview`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Webview
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleDownloadPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('linkedin')}>
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('email')}>
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
