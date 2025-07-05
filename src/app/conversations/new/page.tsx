'use client';
import React, { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessagesProvider } from '@/components/content/messages';
import { MessageList } from '@/components/content/messages';
import { ChatInputForm } from '@/components/content/messages';

export default function NewConversationPage(): JSX.Element {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleConversationCreated = (conversation: any) => {
    setConversationId(conversation.id);
    // Navigate to the actual conversation page
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <MessagesProvider>
        <MessageList conversationTitle="New Conversation" />
        <ChatInputForm onConversationCreated={handleConversationCreated} />
      </MessagesProvider>
    </div>
  );
}
