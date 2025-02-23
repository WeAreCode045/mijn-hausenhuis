
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Section } from './TemplateBuilder';

interface SortableSectionProps {
  section: Section;
}

export function SortableSection({ section }: SortableSectionProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm"
    >
      <button
        className="cursor-move p-1 hover:bg-gray-100 rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </button>
      <span className="text-sm font-medium">{section.title}</span>
    </div>
  );
}
