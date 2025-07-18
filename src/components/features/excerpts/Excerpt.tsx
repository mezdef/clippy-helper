'use client';
import React from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui';
import type { EditingItem } from '@/types';
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
  editingItem?: EditingItem | null;
  setEditingItem?: (item: EditingItem | null) => void;
}

export const Excerpt: React.FC<ExcerptProps> = React.memo(
  ({ excerpt, onEdit, onDelete, editingItem, setEditingItem }) => {
    // Check if this excerpt is being edited
    const isEditing =
      editingItem?.type === 'excerpt' && editingItem?.id === excerpt.id;

    const handleSave = (id: string, content: string, title: string) => {
      if (onEdit) {
        onEdit(id, content, title);
      }
      setEditingItem?.(null);
    };

    const handleCancel = () => {
      setEditingItem?.(null);
    };

    const handleDelete = () => {
      if (onDelete) {
        onDelete(excerpt.id);
      }
    };

    const handleEditClick = () => {
      if (isEditing) {
        handleCancel();
      } else {
        setEditingItem?.({ type: 'excerpt', id: excerpt.id });
      }
    };

    return (
      <>
        <div
          className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 flex-1`}
        >
          {isEditing ? (
            <EditExcerptForm
              excerpt={excerpt}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h5 className="font-medium text-blue-700 dark:text-blue-300">
                  {excerpt.title}
                </h5>
                <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{excerpt.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleEditClick}
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
  }
);

Excerpt.displayName = 'Excerpt';
