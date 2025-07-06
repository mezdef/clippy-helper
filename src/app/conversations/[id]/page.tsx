'use client';
import React, { JSX, useState } from 'react';
import { useParams } from 'next/navigation';
import { useConversation } from '@/hooks/useConversations';
import { MessageList, ChatInputForm } from './_components/messages';
import { useMessageInput } from '@/hooks/useMessageInput';
import { LoadingPage } from '@/components/ui/loading';
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

  const { handleEditMessage, isEditingMessage, chatInputRef } = useMessageInput(
    {
      conversationId,
    }
  );

  // State to manage which item is being edited (message or excerpt)
  const [editingItem, setEditingItem] = useState<{
    type: 'message' | 'excerpt';
    id: string;
  } | null>(null);

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
        isTyping={chatInputRef.current?.isSubmitting || isEditingMessage}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
      <ChatInputForm
        ref={chatInputRef}
        conversationId={conversationId}
        onFocus={() => setEditingItem(null)}
      />
    </div>
  );
}
