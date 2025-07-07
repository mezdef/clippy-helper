'use client';
import React, { JSX } from 'react';
import { useParams } from 'next/navigation';
import { MessageList } from '@/components/features/messages';
import { PromptForm } from '@/components/features/prompt';
import { LoadingPage } from '@/components/ui/loading';
import { useAppState } from '@/hooks/useAppState';
import { useConversation } from '@/hooks/useConversations';
import { usePrompt } from '@/hooks/usePrompt';
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

  const { handleEditMessage, promptFormRef } = usePrompt({
    conversationId,
  });

  // Global app state management
  const {
    editingItem,
    setEditingItem,
    isEditingMessage,
    isSubmitting,
    clearEditingItem,
  } = useAppState();

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
        onEditMessage={handleEditMessage}
        isTyping={isSubmitting || isEditingMessage}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
      <PromptForm
        ref={promptFormRef}
        conversationId={conversationId}
        onFocus={() => clearEditingItem()}
      />
    </div>
  );
}
