'use client';
import React, { JSX } from 'react';
import { MessageList } from '@/components/content/messages';
import {
  ChatInputForm,
  type ChatInputFormRef,
} from '@/components/content/messages';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { LoadingPage } from '@/components/ui/loading';
import { useConversation } from '@/hooks/useConversations';
import { useMessageInput } from '@/hooks/useMessageInput';

export default function ConversationPage(): JSX.Element {
  const {
    conversationId,
    conversation,
    messages,
    isLoading,
    hasError,
    conversationError,
    messagesError,
  } = useConversation();

  const { handleReAsk, handleMessageSubmitted, chatInputRef } = useMessageInput(
    {
      conversationId,
    }
  );

  if (isLoading) {
    return <LoadingPage text="Loading conversation..." />;
  }

  if (hasError) {
    const error = conversationError || messagesError;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Error loading conversation</p>
          <p className="text-sm text-gray-500 mt-2">{error?.message}</p>
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

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={messages}
        conversationTitle={conversation.title}
        conversationCreatedAt={new Date(
          conversation.createdAt
        ).toLocaleDateString()}
        onReAsk={handleReAsk}
        isTyping={chatInputRef.current?.isSubmitting || false}
      />
      <ChatInputForm
        ref={chatInputRef}
        conversationId={conversationId}
        onMessageSubmitted={handleMessageSubmitted}
      />
    </div>
  );
}
