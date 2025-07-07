'use client';
import React, { JSX, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import type { EditingItem, MessageRole } from '@/types';
import { generateMapKey } from '@/utils/generateMapKey';
import { Message } from './Message';
import { MessageListTitle } from './MessageListTitle';

interface MessageType {
  role: MessageRole;
  text: string;
  id?: string;
  excerpts?: Array<{
    id: string;
    title: string;
    content: string;
    order: string;
  }>;
}

interface MessageListProps {
  messages: MessageType[];
  conversationTitle?: string;
  conversationCreatedAt?: string;
  onEditMessage?: (text: string, messageId: string) => Promise<void>;
  isTyping?: boolean;
  editingItem?: EditingItem | null;
  setEditingItem?: (item: EditingItem | null) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  conversationTitle,
  conversationCreatedAt,
  onEditMessage,
  isTyping = false,
  editingItem,
  setEditingItem,
}): JSX.Element => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or typing indicator appears
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollToBottom = () => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      };

      // Use a small delay to ensure DOM updates are complete
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, isTyping]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 min-h-0 overflow-y-auto p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      {/* Conversation Info */}
      {conversationTitle && (
        <MessageListTitle
          title={conversationTitle}
          createdAt={conversationCreatedAt}
        />
      )}

      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No messages in this conversation yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message: MessageType, index: number) => (
            <Message
              key={generateMapKey(message, index, ['role', 'text', 'excerpts'])}
              role={message.role}
              text={message.text}
              messageId={message.id}
              onEditMessage={onEditMessage}
              excerpts={message.excerpts}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          ))}
          {/* Typing indicator for while the LLM is thinking */}
          {isTyping && <TypingIndicator />}
        </div>
      )}
    </div>
  );
};
