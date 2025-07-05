'use client';
import React, { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageType, useMessagesContext } from './MessagesContext';
import { Form, Input } from '@/components/forms';
import { AiRequestInput } from '@/api/chat/route';
import { Sparkles, Loader2 } from 'lucide-react';

type FormData = { chatInput: string };

interface ChatInputFormProps {
  onConversationCreated?: (conversation: any) => void;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  onConversationCreated,
}): JSX.Element => {
  const methods = useForm<FormData>();
  const {
    messages,
    setMessages,
    aiRequests,
    aiResponses,
    setAiRequests,
    setAiResponses,
    setLoading,
    setError,
    loading,
  } = useMessagesContext();
  const [currentConversation, setCurrentConversation] = useState<any>(null);

  const onSubmit = async (data: FormData): Promise<void> => {
    const newMessages: MessageType[] = [
      ...messages,
      {
        role: 'user',
        text: data.chatInput,
      },
    ];
    const newAiRequests: AiRequestInput[] = [
      ...aiRequests,
      {
        role: 'user',
        content: data.chatInput,
      },
    ];
    setMessages(newMessages);
    setAiRequests(newAiRequests);
    setError(null);
    setLoading(true);

    try {
      // Save conversation if this is the first message
      if (!currentConversation) {
        const conversationTitle = `Chat ${new Date().toLocaleString()}`;
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: conversationTitle }),
        });
        if (response.ok) {
          const conversation = await response.json();
          setCurrentConversation(conversation);
          // Call the callback if provided
          onConversationCreated?.(conversation);
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAiRequests),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');

      // Update the messages with the ai's response
      const updatedMessages: MessageType[] = [
        ...newMessages,
        {
          role: 'assistant',
          content: result.output_parsed,
        },
      ];
      setMessages(updatedMessages);

      // Update the aiResponses with the ai's response
      setAiResponses([...aiResponses, result]);

      // Save messages to database if we have a conversation
      if (currentConversation?.id) {
        // Save user message
        await fetch(`/api/conversations/${currentConversation.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'user',
            content: data.chatInput,
          }),
        });

        // Save assistant message
        await fetch(`/api/conversations/${currentConversation.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'assistant',
            content: JSON.stringify(result.output_parsed),
            structuredContent: result.output_parsed,
          }),
        });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      methods.reset();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <Form
          onSubmit={onSubmit}
          methods={methods}
          className="flex flex-row gap-2 w-full items-end"
        >
          <div className="flex-1">
            <Input
              id="chatInput"
              label="Ask Clippy for something..."
              placeholder="I'd like to write a letter..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            disabled={loading}
            aria-label="Send"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </button>
        </Form>
      </div>
    </div>
  );
};
