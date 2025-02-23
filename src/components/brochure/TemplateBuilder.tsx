
import React from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Section {
  id: string;
  type: 'cover' | 'details' | 'floorplans' | 'location' | 'areas' | 'contact';
  title: string;
}

const defaultSections: Section[] = [
  { id: '1', type: 'cover', title: 'Cover Page' },
  { id: '2', type: 'details', title: 'Property Details' },
  { id: '3', type: 'floorplans', title: 'Floorplans' },
  { id: '4', type: 'location', title: 'Location' },
  { id: '5', type: 'areas', title: 'Areas' },
  { id: '6', type: 'contact', title: 'Contact' },
];

export function TemplateBuilder() {
  const [sections, setSections] = React.useState<Section[]>(defaultSections);
  const [templateName, setTemplateName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

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
      const { error } = await supabase
        .from('brochure_templates')
        .insert([
          {
            name: templateName,
            description,
            sections: sections,
          },
        ]);

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
    <div className="p-6 space-y-6">
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
                <SortableSection key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <Button onClick={saveTemplate} className="w-full">
        Save Template
      </Button>
    </div>
  );
}
