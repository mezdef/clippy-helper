import React from 'react';
import { Excerpt } from './Excerpt';
import type { Excerpt as ExcerptType } from './Excerpt';

interface ExcerptsListProps {
  excerpts: ExcerptType[];
  borderColor?: string;
}

export const ExcerptsList: React.FC<ExcerptsListProps> = ({
  excerpts,
  borderColor = 'border-blue-500',
}) => {
  if (!excerpts || excerpts.length === 0) return null;
  return (
    <div className={`border-l-4 ${borderColor} pl-4`}>
      <ul className="space-y-2">
        {excerpts.map(excerpt => (
          <Excerpt key={excerpt.id} excerpt={excerpt} />
        ))}
      </ul>
    </div>
  );
};
