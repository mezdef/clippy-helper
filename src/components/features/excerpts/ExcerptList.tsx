import React from 'react';
import { useUpdateExcerpt, useDeleteExcerpt } from '@/hooks/useExcerpts';
import { Excerpt } from './Excerpt';
import type { Excerpt as ExcerptType } from './Excerpt';
import type { EditingItem } from '@/types';

interface ExcerptsListProps {
  excerpts: ExcerptType[];
  borderColor?: string;
  editingItem?: EditingItem | null;
  setEditingItem?: (item: EditingItem | null) => void;
}

export const ExcerptsList: React.FC<ExcerptsListProps> = React.memo(
  ({
    excerpts,
    borderColor: _borderColor = 'border-blue-500',
    editingItem,
    setEditingItem,
  }) => {
    const updateExcerptMutation = useUpdateExcerpt();
    const deleteExcerptMutation = useDeleteExcerpt();

    const handleEditExcerpt = async (
      id: string,
      content: string,
      title: string
    ) => {
      try {
        await updateExcerptMutation.mutateAsync({ id, content, title });
      } catch (error) {
        console.error('Error updating excerpt:', error);
      }
    };

    const handleDeleteExcerpt = async (id: string) => {
      try {
        await deleteExcerptMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting excerpt:', error);
      }
    };

    if (!excerpts || excerpts.length === 0) return null;

    return (
      <div className="space-y-4">
        {excerpts.map(excerpt => (
          <div key={excerpt.id} className="flex gap-4">
            <Excerpt
              excerpt={excerpt}
              onEdit={handleEditExcerpt}
              onDelete={handleDeleteExcerpt}
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
