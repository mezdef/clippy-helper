import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { AiRequestInput } from '@/api/chat/route';
import { useCreateMessage, useDeleteMessage } from './useMessages';
import { useAppState } from './useAppState';
import type { ChatInputFormRef } from '@/app/conversations/[id]/_components/messages';
import type { FormattedMessage } from '@/services/message.service';
import type { ChatInputFormData } from '@/types';

interface UseMessageInputProps {
  conversationId: string;
}

interface UseMessageInputReturn {
  methods: ReturnType<typeof useForm<ChatInputFormData>>;
  onSubmit: (data: ChatInputFormData) => Promise<void>;
  handleEditMessage: (text: string, messageId: string) => Promise<void>;
  chatInputRef: React.RefObject<ChatInputFormRef | null>;
}

export const useMessageInput = ({
  conversationId,
}: UseMessageInputProps): UseMessageInputReturn => {
  const methods = useForm<ChatInputFormData>({
    defaultValues: {
      chatInput: '',
    },
  });
  const queryClient = useQueryClient();
  const createMessageMutation = useCreateMessage();
  const deleteMessageMutation = useDeleteMessage();
  const { setIsSubmitting, setIsEditingMessage } = useAppState();
  const chatInputRef = useRef<ChatInputFormRef | null>(null);

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

  const handleEditMessage = async (
    text: string,
    messageId: string
  ): Promise<void> => {
    setIsEditingMessage(true);
    try {
      const currentMessages =
        (queryClient.getQueryData([
          'messages',
          conversationId,
        ]) as FormattedMessage[]) || [];

      const messageIndex = currentMessages.findIndex(
        msg => msg.id === messageId
      );

      if (messageIndex !== -1) {
        const messagesToDelete = currentMessages.slice(messageIndex);

        // Delete messages first
        for (const message of messagesToDelete) {
          await deleteMessageMutation.mutateAsync({
            conversationId,
            messageId: message.id,
          });
        }
      }

      // Save new user message to database
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'user',
          content: text,
        },
      });

      // Get existing messages to build AI request context
      const existingMessages =
        (queryClient.getQueryData(['messages', conversationId]) as any[]) || [];
      const userMessages = existingMessages
        .filter((msg: any) => msg.role === 'user')
        .map((msg: any) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.text || msg.content || '',
        }));

      // Add the new user message to the context
      const newAiRequests: AiRequestInput[] = [
        ...userMessages,
        {
          role: 'user',
          content: text,
        },
      ];

      // Get AI response
      const result = await sendChatRequest(newAiRequests);

      // Save AI message to database with excerpts
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'assistant',
          content: JSON.stringify(result.output_parsed),
          aiResponse: result.output_parsed,
        },
      });
    } catch (err) {
      console.error('Error in direct re-ask:', err);
      throw err;
    } finally {
      setIsEditingMessage(false);
    }
  };

  const onSubmit = async (data: ChatInputFormData): Promise<void> => {
    setIsSubmitting(true);
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
          content: msg.text || msg.content || '',
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

      // Save AI message to database with excerpts
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'assistant',
          content: JSON.stringify(result.output_parsed),
          aiResponse: result.output_parsed,
        },
      });
    } catch (err) {
      console.error('Error in chat submission:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
      methods.reset();
    }
  };

  return {
    methods,
    onSubmit,
    handleEditMessage,
    chatInputRef,
  };
};
