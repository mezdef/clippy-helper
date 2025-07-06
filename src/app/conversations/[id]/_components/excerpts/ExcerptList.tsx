import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Excerpt } from './Excerpt';
import type { Excerpt as ExcerptType } from './Excerpt';

interface ExcerptsListProps {
  excerpts: ExcerptType[];
  borderColor?: string;
  onEditExcerpt?: (id: string, content: string, title: string) => void;
  onDeleteExcerpt?: (id: string) => void;
  editingItem?: {
    type: 'message' | 'excerpt';
    id: string;
  } | null;
  setEditingItem?: React.Dispatch<
    React.SetStateAction<{
      type: 'message' | 'excerpt';
      id: string;
    } | null>
  >;
}

export const ExcerptsList: React.FC<ExcerptsListProps> = ({
  excerpts,
  borderColor = 'border-blue-500',
  onEditExcerpt,
  onDeleteExcerpt,
  editingItem,
  setEditingItem,
}) => {
  if (!excerpts || excerpts.length === 0) return null;
  return (
    <div className="space-y-4">
      {excerpts.map(excerpt => (
        <div key={excerpt.id} className="flex gap-4">
          <Excerpt
            excerpt={excerpt}
            onEdit={onEditExcerpt}
            onDelete={onDeleteExcerpt}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        </div>
      ))}
    </div>
  );
};
