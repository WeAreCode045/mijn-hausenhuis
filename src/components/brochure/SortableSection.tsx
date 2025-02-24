
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Grid, Plus } from 'lucide-react';
import type { Section, ContentElement } from './TemplateBuilder';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface SortableSectionProps {
  section: Section;
  isSelected?: boolean;
  onAddColumn?: () => void;
}

export function SortableSection({ section, isSelected, onAddColumn }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const gridColumns = section.design.columns || 1;

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

      <div 
        className={cn(
          "grid gap-4 min-h-[100px] border-2 border-dashed border-gray-200 rounded-md p-4",
          `grid-cols-${gridColumns}`
        )}
      >
        {Array.from({ length: gridColumns }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-md p-2 min-h-[100px] relative"
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
        ))}
      </div>
    </div>
  );
}
