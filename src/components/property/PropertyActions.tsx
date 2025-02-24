
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { Share2, FileDown, Globe, Trash2, Save, FileTemplate } from "lucide-react";
import { AgencySettings } from "@/types/agency";
import { PropertyData } from "@/types/property";
import { PropertyWebView } from "./PropertyWebView";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/pages/Templates";

interface PropertyActionsProps {
  property: PropertyData;
  settings: AgencySettings;
  onDelete: () => void;
  onSave: () => void;
}

export function PropertyActions({ property, settings, onDelete, onSave }: PropertyActionsProps) {
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  // Fetch templates when component mounts
  useState(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('*');
      
      if (!error && data) {
        setTemplates(data);
      }
    };
    
    fetchTemplates();
  });

  const handleGeneratePDF = async () => {
    try {
      await generatePropertyPDF(property, settings, selectedTemplateId);
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={onSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsWebViewOpen(true)}
            >
              <Globe className="mr-2 h-4 w-4" />
              Web View
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGeneratePDF}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <a href={`/share/${property.id}`} target="_blank" rel="noopener noreferrer">
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </a>
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Property
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTemplate className="h-5 w-5" />
            Brochure Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Default Template</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            Select a template to use when generating the PDF brochure
          </p>
        </CardContent>
      </Card>

      <PropertyWebView
        property={property}
        open={isWebViewOpen}
        onOpenChange={setIsWebViewOpen}
      />
    </>
  );
}
