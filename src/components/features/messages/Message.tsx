'use client';
import React, { JSX } from 'react';
import { Edit2, X } from 'lucide-react';
import { ExcerptsList } from '../excerpts/ExcerptList';
import { Avatar, Button } from '@/components/ui';
import { EditMessageForm } from './EditMessageForm';
import type { MessageRole, EditingStateProps } from '@/types';

interface MessageProps extends EditingStateProps {
  role: MessageRole;
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
  editingItem,
  setEditingItem,
}): JSX.Element => {
  // Check if this message is being edited
  const isEditing =
    editingItem?.type === 'message' && editingItem?.id === messageId;

  const isUser = role === 'user';
  const padding = isUser ? 'p-4' : 'p-0';
  const bgColor = isUser
    ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
    : 'bg-transparent';

  const handleEditSave = async (editedText: string) => {
    await onEditMessage?.(editedText, messageId!);
    setEditingItem?.(null);
  };

  const handleEditCancel = () => {
    setEditingItem?.(null);
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="w-8 flex-shrink-0">
        {!isUser && <Avatar role={role} />}
      </div>

      <div className={`w-full ${bgColor} ${padding} rounded-lg`}>
        <div className="space-y-3">
          {/* Display text content or edit form for user messages */}
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
                  <p className="whitespace-pre-line text-sm text-right">
                    {text}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Display excerpts for assistant messages */}
          {!isUser && excerpts.length > 0 && (
            <ExcerptsList
              excerpts={excerpts}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex flex-col items-center gap-2">
          <Avatar role={role} />
          {onEditMessage && text && (
            <Button
              onClick={
                isEditing
                  ? handleEditCancel
                  : () => setEditingItem?.({ type: 'message', id: messageId! })
              }
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
