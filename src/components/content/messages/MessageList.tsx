'use client';
import React, { JSX } from 'react';
import { useMessagesContext } from './MessagesContext';
import { MessageSquare } from 'lucide-react';
import { Message } from './Message';
import { LoadingSpinner } from '@/components/loading';

interface MessageListProps {
  conversationTitle?: string;
  conversationCreatedAt?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationTitle,
  conversationCreatedAt,
}): JSX.Element => {
  const { messages, loading } = useMessagesContext();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Conversation Info */}
      {conversationTitle && (
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {conversationTitle}
            </h1>
            {conversationCreatedAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created {conversationCreatedAt}
              </p>
            )}
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No messages in this conversation yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message: any, index: number) => (
            <Message
              key={index}
              role={message.role}
              text={message.text}
              content={message.content}
            />
          ))}
        </div>
      )}
    </div>
  );
};
