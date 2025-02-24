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
import { Grid, Layout, Columns, Type, GripVertical, Map, Phone, Image } from 'lucide-react';
import type { Template } from '@/pages/Templates';

export interface ContentElement {
  id: string;
  type: 'keyInfo' | 'features' | 'description' | 'images' | 'text' | 'header' | 'global';
  title: string;
  columnIndex?: number;
}

export interface Container {
  id: string;
  columns: number;
  columnWidths: number[];
  elements: ContentElement[];
}

export interface SectionDesign {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  containers: Container[];
}

export interface Section {
  id: string;
  type: 'cover' | 'details' | 'floorplans' | 'location' | 'areas' | 'contact';
  title: string;
  design: SectionDesign;
}

const globalElements: ContentElement[] = [
  { id: 'gh1', type: 'global', title: 'Header' },
  { id: 'gf1', type: 'global', title: 'Footer' },
  { id: 'gp1', type: 'global', title: 'Price' },
  { id: 'gt1', type: 'global', title: 'Property Title' },
  { id: 'gi1', type: 'global', title: 'Featured Image' }
];

const defaultContentElements: Record<string, ContentElement[]> = {
  details: [
    { id: 'ke1', type: 'keyInfo', title: 'Key Information' },
    { id: 'fe1', type: 'features', title: 'Features' },
    { id: 'de1', type: 'description', title: 'Description' }
  ],
  cover: [
    { id: 'hi1', type: 'header', title: 'Header' },
    { id: 'im1', type: 'images', title: 'Images' }
  ],
  floorplans: [
    { id: 'fp1', type: 'images', title: 'Floorplan Images' },
    { id: 'fd1', type: 'text', title: 'Floorplan Description' }
  ],
  location: [
    { id: 'mp1', type: 'images', title: 'Map' },
    { id: 'ld1', type: 'text', title: 'Location Description' },
    { id: 'np1', type: 'text', title: 'Nearby Places' }
  ],
  areas: [
    { id: 'ai1', type: 'images', title: 'Area Images' },
    { id: 'ad1', type: 'text', title: 'Area Description' }
  ],
  contact: [
    { id: 'cf1', type: 'text', title: 'Contact Form' },
    { id: 'ci1', type: 'images', title: 'Agent Image' },
    { id: 'cd1', type: 'text', title: 'Contact Details' }
  ]
};

const defaultSections: Section[] = [
  { 
    id: '1', 
    type: 'cover', 
    title: 'Cover Page', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '2', 
    type: 'details', 
    title: 'Property Details', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '3', 
    type: 'floorplans', 
    title: 'Floorplans', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '4', 
    type: 'location', 
    title: 'Location', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '5', 
    type: 'areas', 
    title: 'Areas', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '6', 
    type: 'contact', 
    title: 'Contact', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  }
];

export function TemplateBuilder({ template }: { template: Template | null }) {
  const [sections, setSections] = React.useState<Section[]>(
    template?.sections || defaultSections
  );
  const [templateName, setTemplateName] = React.useState(template?.name || '');
  const [description, setDescription] = React.useState(template?.description || '');
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (template) {
      setSections(template.sections);
      setTemplateName(template.name);
      setDescription(template.description || '');
    }
  }, [template]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const selectedSection = sections.find(section => section.id === selectedSectionId);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleContentDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id && selectedSection) {
      setSections(prevSections => prevSections.map(section => {
        if (section.id === selectedSection.id && section.design.contentElements) {
          const oldIndex = section.design.contentElements.findIndex(
            item => item.id === active.id
          );
          const newIndex = section.design.contentElements.findIndex(
            item => item.id === over.id
          );
          
          return {
            ...section,
            design: {
              ...section.design,
              contentElements: arrayMove(section.design.contentElements, oldIndex, newIndex)
            }
          };
        }
        return section;
      }));
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

  const handleAddColumn = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                columns: (section.design.columns || 1) + 1
              }
            }
          : section
      )
    );
  };

  const handleDeleteColumn = (sectionId: string, columnIndex: number) => {
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.id === sectionId) {
          const newColumns = (section.design.columns || 1) - 1;
          if (newColumns < 1) return section;

          const newContentElements = section.design.contentElements?.map(element => {
            if (element.columnIndex === columnIndex) {
              return { ...element, columnIndex: Math.max(0, columnIndex - 1) };
            }
            if (element.columnIndex && element.columnIndex > columnIndex) {
              return { ...element, columnIndex: element.columnIndex - 1 };
            }
            return element;
          });

          return {
            ...section,
            design: {
              ...section.design,
              columns: newColumns,
              contentElements: newContentElements
            }
          };
        }
        return section;
      })
    );
  };

  const handleAddContainer = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                containers: [
                  ...(section.design.containers || []),
                  {
                    id: crypto.randomUUID(),
                    columns: 1,
                    columnWidths: [1],
                    elements: []
                  }
                ]
              }
            }
          : section
      )
    );
  };

  const handleUpdateContainer = (sectionId: string, containerId: string, updates: Partial<Container>) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                containers: section.design.containers.map(container =>
                  container.id === containerId
                    ? { ...container, ...updates }
                    : container
                )
              }
            }
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save templates",
          variant: "destructive",
        });
        return;
      }

      const sectionsToSave = sections.map(section => ({
        id: section.id,
        type: section.type,
        title: section.title,
        design: {
          columns: section.design.columns,
          backgroundColor: section.design.backgroundColor,
          textColor: section.design.textColor,
          padding: section.design.padding,
          containers: section.design.containers.map(container => ({
            id: container.id,
            columns: container.columns,
            columnWidths: container.columnWidths,
            elements: container.elements.map(el => ({
              id: el.id,
              type: el.type,
              title: el.title
            }))
          }))
        }
      }));

      const templateData = {
        name: templateName,
        description,
        sections: sectionsToSave as unknown as Json,
        created_by: user.id
      };

      const { error } = await supabase
        .from('brochure_templates')
        .upsert([{
          ...(template?.id ? { id: template.id } : {}),
          ...templateData
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error saving template:', error);
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
              <div className="space-y-4">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    <SortableSection 
                      section={section} 
                      isSelected={selectedSectionId === section.id}
                      onAddColumn={() => handleAddColumn(section.id)}
                      onDeleteColumn={(columnIndex) => handleDeleteColumn(section.id, columnIndex)}
                      onAddContainer={() => handleAddContainer(section.id)}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <Button onClick={saveTemplate} className="w-full">
          {template ? 'Update Template' : 'Save Template'}
        </Button>
      </div>

      <div className="space-y-4">
        {selectedSection && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Content Elements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {defaultContentElements[selectedSection.type].map((element) => (
                    <div
                      key={element.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id);
                      }}
                      className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm cursor-move hover:border-primary"
                    >
                      {element.type === 'keyInfo' && <Grid className="h-4 w-4" />}
                      {element.type === 'features' && <Layout className="h-4 w-4" />}
                      {element.type === 'description' && <Type className="h-4 w-4" />}
                      {element.type === 'images' && <Image className="h-4 w-4" />}
                      {element.type === 'text' && <Type className="h-4 w-4" />}
                      <span className="text-sm font-medium">{element.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
          </>
        )}
      </div>
    </div>
  );
}
