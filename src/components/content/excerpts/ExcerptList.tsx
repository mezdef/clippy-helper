import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Excerpt } from './Excerpt';
import type { Excerpt as ExcerptType } from './Excerpt';

interface ExcerptsListProps {
  excerpts: ExcerptType[];
  borderColor?: string;
  onEditExcerpt?: (id: string, content: string, title: string) => void;
  onDeleteExcerpt?: (id: string) => void;
}

export const ExcerptsList: React.FC<ExcerptsListProps> = ({
  excerpts,
  borderColor = 'border-blue-500',
  onEditExcerpt,
  onDeleteExcerpt,
}) => {
  if (!excerpts || excerpts.length === 0) return null;
  return (
    <div className="space-y-4">
      {excerpts.map(excerpt => (
        <div key={excerpt.id} className="flex gap-4">
          <div
            className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 flex-1`}
          >
            <Excerpt
              excerpt={excerpt}
              onEdit={onEditExcerpt}
              onDelete={onDeleteExcerpt}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
