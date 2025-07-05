'use client';
import React, { JSX } from 'react';
import { useParams } from 'next/navigation';
import { MessageList } from '@/components/content/messages';
import { ChatInputForm } from '@/components/content/messages';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { LoadingPage } from '@/components/loading';
import { useConversation } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import type { Conversation, Message } from '@/db/schema';

// Extended type for conversation with messages
type ConversationWithMessages = Conversation & {
  messages: Message[];
};

export default function ConversationPage(): JSX.Element {
  const params = useParams();
  const conversationId = params.id as string;

  const {
    data: conversation,
    isLoading: conversationLoading,
    error: conversationError,
  } = useConversation(conversationId);
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
  } = useMessages(conversationId);

  if (conversationLoading) {
    return <LoadingPage text="Loading conversation..." />;
  }

  if (conversationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Error loading conversation</p>
          <p className="text-sm text-gray-500 mt-2">
            {conversationError.message}
          </p>
          <Link
            href="/"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to conversations
          </Link>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Conversation not found</p>
          <Link
            href="/"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to conversations
          </Link>
        </div>
      </div>
    );
  }

  if (messagesLoading) {
    return <LoadingPage text="Loading messages..." />;
  }

  if (messagesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Error loading messages</p>
          <p className="text-sm text-gray-500 mt-2">{messagesError.message}</p>
        </div>
      </div>
    );
  }

  // Convert messages to the format expected by MessageList
  const formattedMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    text: msg.content,
    content: msg.structuredContent as any,
  }));

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={formattedMessages}
        conversationTitle={conversation.title}
        conversationCreatedAt={new Date(
          conversation.createdAt
        ).toLocaleDateString()}
      />
      <ChatInputForm conversationId={conversationId} />
    </div>
  );
}
