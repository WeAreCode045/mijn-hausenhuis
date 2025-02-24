
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Grid, Plus, Trash2 } from 'lucide-react';
import type { Section, ContentElement } from './TemplateBuilder';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface SortableSectionProps {
  section: Section;
  isSelected?: boolean;
  onAddColumn?: () => void;
  onDeleteColumn?: (index: number) => void;
  onAddContainer?: () => void;
}

export function SortableSection({ 
  section, 
  isSelected, 
  onAddColumn, 
  onDeleteColumn,
  onAddContainer 
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const [resizingColumn, setResizingColumn] = useState<number | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragOver = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    const elementId = e.dataTransfer.getData('text/plain');
    
    // Find the content element in the current section
    const element = section.design.contentElements?.find(el => el.id === elementId);
    if (element) {
      element.columnIndex = columnIndex;
      // Force a re-render
      section.design.contentElements = [...(section.design.contentElements || [])];
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "space-y-4 p-4 bg-white rounded-md border shadow-sm transition-colors",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-move p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-500" />
          </button>
          <span className="text-sm font-medium">{section.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddContainer}
            className="text-gray-500 hover:text-gray-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Container
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddColumn}
            className="text-gray-500 hover:text-gray-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Column
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: section.design.columns || 1 }).map((_, index) => (
          <div
            key={index}
            className="relative"
          >
            <div
              className={cn(
                "bg-gray-50 rounded-md p-2 min-h-[100px] relative",
                "transition-all duration-200"
              )}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {section.design.contentElements?.filter(
                element => element.columnIndex === index
              ).map((element) => (
                <div
                  key={element.id}
                  className="bg-white p-2 mb-2 rounded border shadow-sm"
                >
                  {element.title}
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <Grid className="h-6 w-6" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteColumn?.(index)}
              className="absolute -right-2 -top-2 p-1 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
