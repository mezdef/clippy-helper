'use client';
import React, { JSX } from 'react';
import { useParams } from 'next/navigation';
import { useConversation } from '@/hooks/useConversations';
import { MessageList, ChatInputForm } from '@/components/content/messages';
import { useMessageInput } from '@/hooks/useMessageInput';
import { LoadingPage } from '@/components/ui/loading';
import { Error as ErrorComponent } from '@/components/ui/Error';
import { formatDate } from '@/utils/date';

export default function ConversationPage(): JSX.Element {
  const params = useParams();
  const conversationId = params.id as string;

  const {
    conversation,
    messages,
    isLoading,
    hasError,
    conversationError,
    messagesError,
  } = useConversation(conversationId);

  const { handleReAsk, handleMessageSubmitted, chatInputRef } = useMessageInput(
    {
      conversationId,
    }
  );

  // Show loading state while data is being fetched
  if (isLoading) {
    return <LoadingPage text="Loading conversation..." />;
  }

  // Handle errors by throwing them for the error boundary
  if (hasError) {
    const error =
      conversationError ||
      messagesError ||
      new Error('Failed to load conversation');
    throw error;
  }

  // Handle not found by throwing a specific error
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={messages}
        conversationTitle={conversation.title}
        conversationCreatedAt={formatDate(conversation.createdAt)}
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
