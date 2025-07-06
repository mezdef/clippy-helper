'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit2, Trash2 } from 'lucide-react';
import { EditExcerptForm } from './EditExcerptForm';

export interface Excerpt {
  id: string;
  title: string;
  content: string;
  order: string;
}

interface ExcerptProps {
  excerpt: Excerpt;
  onEdit?: (id: string, content: string, title: string) => void;
  onDelete?: (id: string) => void;
}

export const Excerpt: React.FC<ExcerptProps> = ({
  excerpt,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (id: string, content: string, title: string) => {
    if (onEdit) {
      onEdit(id, content, title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(excerpt.id);
    }
  };

  if (isEditing) {
    return (
      <EditExcerptForm
        excerpt={excerpt}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <li className="list-none">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-blue-700 dark:text-blue-300">
            {excerpt.title}
          </h5>
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{excerpt.content}</ReactMarkdown>
          </div>
        </div>
        <div className="flex gap-1 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Edit excerpt"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="Delete excerpt"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
};
