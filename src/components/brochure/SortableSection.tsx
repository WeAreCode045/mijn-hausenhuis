
import React, { useState } from 'react';
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

  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array(section.design.columns || 1).fill(1)
  );

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

  const handleColumnResizeStart = (columnIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(columnIndex);

    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn === null) return;

      const container = e.currentTarget as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      
      const newWidths = [...columnWidths];
      const totalColumns = section.design.columns || 1;
      const widthPerColumn = containerWidth / totalColumns;
      
      newWidths[resizingColumn] = Math.max(0.5, Math.min(2, relativeX / widthPerColumn));
      setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
        className="grid gap-4 min-h-[100px] border-2 border-dashed border-gray-200 rounded-md p-4"
        style={{
          gridTemplateColumns: columnWidths.map(width => `${width}fr`).join(' ')
        }}
      >
        {Array.from({ length: section.design.columns || 1 }).map((_, index) => (
          <div
            key={index}
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
            {index < (section.design.columns || 1) - 1 && (
              <div
                className={cn(
                  "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary",
                  resizingColumn === index && "bg-primary"
                )}
                onMouseDown={(e) => handleColumnResizeStart(index, e)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
