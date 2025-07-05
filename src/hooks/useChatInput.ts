import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiRequestInput } from '@/api/chat/route';
import { useCreateMessage } from './useMessages';
import { useQueryClient } from '@tanstack/react-query';

type FormData = { chatInput: string };

interface UseChatInputProps {
  conversationId: string;
}

interface UseChatInputReturn {
  methods: ReturnType<typeof useForm<FormData>>;
  onSubmit: (data: FormData) => Promise<void>;
}

export const useChatInput = ({
  conversationId,
}: UseChatInputProps): UseChatInputReturn => {
  const methods = useForm<FormData>();
  const queryClient = useQueryClient();
  const createMessageMutation = useCreateMessage();

  const sendChatRequest = async (
    aiRequests: AiRequestInput[]
  ): Promise<any> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aiRequests),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Unknown error');
    }

    return result;
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // Save user message to database first
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'user',
          content: data.chatInput,
        },
      });

      // Get existing messages to build AI request context
      const existingMessages =
        (queryClient.getQueryData(['messages', conversationId]) as any[]) || [];
      const userMessages = existingMessages
        .filter((msg: any) => msg.role === 'user')
        .map((msg: any) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }));

      // Add the new user message to the context
      const newAiRequests: AiRequestInput[] = [
        ...userMessages,
        {
          role: 'user',
          content: data.chatInput,
        },
      ];

      // Get AI response
      const result = await sendChatRequest(newAiRequests);

      // Save AI message to database
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'assistant',
          content: JSON.stringify(result.output_parsed),
          structuredContent: result.output_parsed,
        },
      });
    } catch (err) {
      console.error('Error in chat submission:', err);
      throw err;
    } finally {
      methods.reset();
    }
  };

  return {
    methods,
    onSubmit,
  };
};
