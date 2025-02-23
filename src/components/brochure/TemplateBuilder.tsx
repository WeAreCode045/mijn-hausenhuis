
import React from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Grid, Layout, Columns, Type } from 'lucide-react';

export interface SectionDesign {
  columns?: number;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  headerStyle?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
  };
  footerStyle?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
  };
}

export interface Section {
  id: string;
  type: 'cover' | 'details' | 'floorplans' | 'location' | 'areas' | 'contact';
  title: string;
  design?: SectionDesign;
}

const defaultSections: Section[] = [
  { id: '1', type: 'cover', title: 'Cover Page', design: { padding: '2rem' } },
  { id: '2', type: 'details', title: 'Property Details', design: { columns: 2, padding: '2rem' } },
  { id: '3', type: 'floorplans', title: 'Floorplans', design: { columns: 2, padding: '2rem' } },
  { id: '4', type: 'location', title: 'Location', design: { padding: '2rem' } },
  { id: '5', type: 'areas', title: 'Areas', design: { columns: 3, padding: '2rem' } },
  { id: '6', type: 'contact', title: 'Contact', design: { padding: '2rem' } },
];

export function TemplateBuilder() {
  const [sections, setSections] = React.useState<Section[]>(defaultSections);
  const [templateName, setTemplateName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const selectedSection = sections.find(section => section.id === selectedSectionId);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateSectionDesign = (sectionId: string, design: Partial<SectionDesign>) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, design: { ...section.design, ...design } }
          : section
      )
    );
  };

  const saveTemplate = async () => {
    if (!templateName) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    try {
      const sectionsJson = sections.map(section => ({
        ...section,
        type: section.type as string,
      })) as Json[];

      const { error } = await supabase
        .from('brochure_templates')
        .insert({
          name: templateName,
          description,
          sections: sectionsJson,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Arrange Sections</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    <SortableSection 
                      section={section} 
                      isSelected={selectedSectionId === section.id}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <Button onClick={saveTemplate} className="w-full">
          Save Template
        </Button>
      </div>

      <div className="space-y-4">
        {selectedSection && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Section Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select
                  value={selectedSection.design?.columns?.toString() || "1"}
                  onValueChange={(value) => 
                    updateSectionDesign(selectedSection.id, { columns: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedSection.design?.backgroundColor || "#ffffff"}
                    onChange={(e) => 
                      updateSectionDesign(selectedSection.id, { backgroundColor: e.target.value })
                    }
                    className="w-12 h-12 p-1"
                  />
                  <Input
                    type="text"
                    value={selectedSection.design?.backgroundColor || "#ffffff"}
                    onChange={(e) => 
                      updateSectionDesign(selectedSection.id, { backgroundColor: e.target.value })
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedSection.design?.textColor || "#000000"}
                    onChange={(e) => 
                      updateSectionDesign(selectedSection.id, { textColor: e.target.value })
                    }
                    className="w-12 h-12 p-1"
                  />
                  <Input
                    type="text"
                    value={selectedSection.design?.textColor || "#000000"}
                    onChange={(e) => 
                      updateSectionDesign(selectedSection.id, { textColor: e.target.value })
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Padding</Label>
                <Select
                  value={selectedSection.design?.padding || "2rem"}
                  onValueChange={(value) => 
                    updateSectionDesign(selectedSection.id, { padding: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1rem">Small</SelectItem>
                    <SelectItem value="2rem">Medium</SelectItem>
                    <SelectItem value="3rem">Large</SelectItem>
                    <SelectItem value="4rem">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
