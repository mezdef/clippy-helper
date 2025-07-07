import React from 'react';
import { Excerpt } from './Excerpt';
import type { Excerpt as ExcerptType } from './Excerpt';
import type { EditingItem } from '@/types';

interface ExcerptsListProps {
  excerpts: ExcerptType[];
  borderColor?: string;
  onEditExcerpt?: (id: string, content: string, title: string) => void;
  onDeleteExcerpt?: (id: string) => void;
  editingItem?: EditingItem | null;
  setEditingItem?: (item: EditingItem | null) => void;
}

export const ExcerptsList: React.FC<ExcerptsListProps> = React.memo(
  ({
    excerpts,
    borderColor: _borderColor = 'border-blue-500',
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
  }
);

ExcerptsList.displayName = 'ExcerptsList';
