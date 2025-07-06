'use client';
import React, { JSX, useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { ExcerptsList } from '../excerpts/ExcerptList';
import { Avatar, Button } from '@/components/ui';
import { useUpdateExcerpt, useDeleteExcerpt } from '@/hooks/useExcerpts';
import { EditMessageForm } from './EditMessageForm';

interface MessageProps {
  role: 'user' | 'assistant';
  text?: string;
  messageId?: string;
  onEditMessage?: (text: string, messageId: string) => Promise<void>;
  excerpts?: Array<{
    id: string;
    title: string;
    content: string;
    order: string;
  }>;
}

export const Message: React.FC<MessageProps> = ({
  role,
  text,
  messageId,
  onEditMessage,
  excerpts = [],
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const updateExcerptMutation = useUpdateExcerpt();
  const deleteExcerptMutation = useDeleteExcerpt();

  const isUser = role === 'user';
  const padding = isUser ? 'p-4' : 'p-0';
  const bgColor = isUser
    ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
    : 'bg-transparent';
  const borderColor = isUser ? 'border-green-500' : 'border-blue-500';

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

  const handleEditSave = async (editedText: string) => {
    await onEditMessage?.(editedText, messageId!);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Avatar role={role} />}

      <div
        className={`${isEditing ? 'w-full' : 'max-w-3xl'} ${bgColor} ${padding} rounded-lg`}
      >
        <div className="space-y-3">
          {/* Display text content or edit form */}
          {isUser && text && (
            <>
              {isEditing ? (
                <EditMessageForm
                  message={{ id: messageId!, text: text! }}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                />
              ) : (
                <div className="space-y-2">
                  <p className="whitespace-pre-line text-sm">{text}</p>
                </div>
              )}
            </>
          )}

          {!isUser && excerpts.length > 0 && (
            <ExcerptsList
              excerpts={excerpts}
              borderColor={borderColor}
              onEditExcerpt={handleEditExcerpt}
              onDeleteExcerpt={handleDeleteExcerpt}
            />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex flex-col items-center gap-2">
          <Avatar role={role} />
          {onEditMessage && text && (
            <Button
              onClick={isEditing ? handleEditCancel : () => setIsEditing(true)}
              icon={isEditing ? X : Edit2}
              size="sm"
              variant="ghost"
              title={isEditing ? 'Cancel editing' : 'Edit this message'}
              className="p-1.5"
            />
          )}
        </div>
      )}
    </div>
  );
};
