import React from 'react';

export interface Excerpt {
  id: string;
  title: string;
  content: string;
  order: string;
}

interface ExcerptProps {
  excerpt: Excerpt;
}

export const Excerpt: React.FC<ExcerptProps> = ({ excerpt }) => {
  return (
    <li className="border-l-2 border-blue-300 pl-3">
      <h5 className="font-medium text-blue-700 dark:text-blue-300">
        {excerpt.title}
      </h5>
      <p className="text-sm whitespace-pre-line">{excerpt.content}</p>
    </li>
  );
};
