'use client';
import React, { JSX, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

interface MessageType {
  role: 'user' | 'assistant';
  text: string;
  content?: any;
  id?: string;
}

interface MessageListProps {
  messages: MessageType[];
  conversationTitle?: string;
  conversationCreatedAt?: string;
  onReAsk?: (text: string, messageId: string) => void;
  isTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  conversationTitle,
  conversationCreatedAt,
  onReAsk,
  isTyping = false,
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
          {messages.map((message: MessageType, index: number) => (
            <Message
              key={message.id || index}
              role={message.role}
              text={message.text}
              content={message.content}
              messageId={message.id}
              onReAsk={onReAsk}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}
    </div>
  );
};
