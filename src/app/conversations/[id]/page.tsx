'use client';
import React, { JSX, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useMessagesContext,
  MessagesProvider,
} from '@/components/content/messages';
import { MessageList } from '@/components/content/messages';
import { ChatInputForm } from '@/components/content/messages';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Conversation } from '@/db/schema';

// Component that uses MessagesContext
const ConversationContent: React.FC<{
  conversationId: string;
  conversation: Conversation;
}> = ({ conversationId, conversation }) => {
  const {
    setMessages,
    setAiRequests,
    setAiResponses,
    loading: messagesLoading,
    error: messagesError,
  } = useMessagesContext();

  useEffect(() => {
    const loadConversationData = async () => {
      try {
        // Load messages for this conversation
        const messagesResponse = await fetch(
          `/api/conversations/${conversationId}/messages`
        );
        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();

          // Convert messages to message format
          const loadedMessages = messages.map((msg: any) => ({
            role: msg.role,
            text: msg.content,
            content: msg.structuredContent,
          }));
          setMessages(loadedMessages);

          // Update aiRequests for API calls
          const userMessages = messages
            .filter((msg: any) => msg.role === 'user')
            .map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            }));
          setAiRequests(userMessages);

          // Update aiResponses for API calls - just store the structured content
          const assistantMessages = messages
            .filter(
              (msg: any) => msg.role === 'assistant' && msg.structuredContent
            )
            .map(
              (msg: any) =>
                ({
                  output_parsed: msg.structuredContent,
                }) as any
            );
          setAiResponses(assistantMessages);
        }
      } catch (error) {
        console.error('Error loading conversation messages:', error);
      }
    };

    if (conversationId) {
      loadConversationData();
    }
  }, [conversationId, setMessages, setAiRequests, setAiResponses]);

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <LoadingPage text="Loading messages..." />
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <p className="text-red-600">Error loading messages</p>
          <p className="text-sm text-gray-500 mt-2">{messagesError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MessageList
        conversationTitle={conversation.title}
        conversationCreatedAt={new Date(
          conversation.createdAt
        ).toLocaleDateString()}
      />
      <ChatInputForm />
    </>
  );
};

export default function ConversationPage(): JSX.Element {
  const params = useParams();
  const conversationId = params.id as string;

  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadConversationData = async () => {
      try {
        setConversationLoading(true);

        // Load conversation metadata
        const conversationResponse = await fetch(
          `/api/conversations/${conversationId}`
        );
        if (!conversationResponse.ok) {
          throw new Error('Failed to load conversation');
        }
        const conversation = await conversationResponse.json();
        setCurrentConversation(conversation);
      } catch (error) {
        console.error('Error loading conversation:', error);
        setConversationError((error as Error).message);
      } finally {
        setConversationLoading(false);
      }
    };

    if (conversationId) {
      loadConversationData();
    }
  }, [conversationId]);

  if (conversationLoading) {
    return <LoadingPage text="Loading conversation..." />;
  }

  if (conversationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Error loading conversation</p>
          <p className="text-sm text-gray-500 mt-2">{conversationError}</p>
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

  if (!currentConversation) {
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
      <MessagesProvider>
        <ConversationContent
          conversationId={conversationId}
          conversation={currentConversation}
        />
      </MessagesProvider>
    </div>
  );
}
