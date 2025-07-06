'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit2, Trash2, X } from 'lucide-react';
import { EditExcerptForm } from './EditExcerptForm';
import { Button } from '@/components/ui';

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

  return (
    <>
      <div className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 flex-1`}>
        {isEditing ? (
          <EditExcerptForm
            excerpt={excerpt}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <li className="list-none flex items-start gap-4">
            <div className="flex-1">
              <h5 className="font-medium text-blue-700 dark:text-blue-300">
                {excerpt.title}
              </h5>
              <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{excerpt.content}</ReactMarkdown>
              </div>
            </div>
          </li>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          icon={isEditing ? X : Edit2}
          variant="ghost"
          size="sm"
          title={isEditing ? 'Cancel editing' : 'Edit excerpt'}
          className="text-gray-400 hover:text-gray-600"
        />
        {!isEditing && (
          <Button
            onClick={handleDelete}
            icon={Trash2}
            variant="ghost"
            size="sm"
            title="Delete excerpt"
            className="text-gray-400 hover:text-gray-600"
          />
        )}
      </div>
    </>
  );
};
