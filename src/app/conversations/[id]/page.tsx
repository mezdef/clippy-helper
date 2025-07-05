'use client';
import React, { JSX, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageList } from '@/components/content/messages';
import {
  ChatInputForm,
  type ChatInputFormRef,
} from '@/components/content/messages';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { LoadingPage } from '@/components/ui/loading';
import { useConversation } from '@/hooks/useConversations';
import { useMessages, useDeleteMessage } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from '@/db/schema';

export default function ConversationPage(): JSX.Element {
  const params = useParams();
  const conversationId = params.id as string;
  const chatInputRef = useRef<ChatInputFormRef>(null);
  const [reAskedMessageId, setReAskedMessageId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
  const deleteMessageMutation = useDeleteMessage();

  const handleReAsk = (text: string, messageId: string) => {
    chatInputRef.current?.setValue(text);
    chatInputRef.current?.focus();
    setReAskedMessageId(messageId);
  };

  const handleMessageSubmitted = async () => {
    if (reAskedMessageId) {
      const currentMessages =
        (queryClient.getQueryData(['messages', conversationId]) as Message[]) ||
        [];

      const messageIndex = currentMessages.findIndex(
        msg => msg.id === reAskedMessageId
      );

      if (messageIndex !== -1) {
        const messagesToDelete = currentMessages.slice(messageIndex);

        try {
          for (const message of messagesToDelete) {
            await deleteMessageMutation.mutateAsync({
              conversationId,
              messageId: message.id,
            });
          }
        } catch (error) {
          console.error('Error deleting messages:', error);
        }
      }

      setReAskedMessageId(null);
    }
  };

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
    id: msg.id,
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
