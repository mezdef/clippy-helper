'use client';
import React, { JSX } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Conversation } from '@/db/schema';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onConversationClick: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isDeleting: boolean;
}

const ConversationItemComponent: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onConversationClick,
  onDeleteConversation,
  isDeleting,
}): JSX.Element => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div
        className="flex items-center flex-1 cursor-pointer"
        onClick={() => onConversationClick(conversation.id)}
      >
        <MessageSquare
          className={`h-4 w-4 mr-2 flex-shrink-0 ${
            isActive ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium truncate ${
              isActive ? 'text-blue-900 dark:text-blue-100' : ''
            }`}
          >
            {conversation.title}
          </p>
          <p
            className={`text-xs ${
              isActive
                ? 'text-blue-600 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {new Date(conversation.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button
        onClick={() => onDeleteConversation(conversation.id)}
        disabled={isDeleting}
        icon={isDeleting ? undefined : Trash2}
        variant="ghost"
        size="sm"
        className={`${
          isActive
            ? 'text-blue-400 hover:text-red-500'
            : 'text-gray-400 hover:text-red-500'
        }`}
        title="Delete conversation"
      >
        {isDeleting && <LoadingSpinner size="sm" />}
      </Button>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders in conversation lists
export const ConversationItem = React.memo(ConversationItemComponent);
