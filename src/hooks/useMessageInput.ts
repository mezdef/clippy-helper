import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { AiRequestInput } from '@/api/chat/route';
import { useCreateMessage, useDeleteMessage } from './useMessages';
import type { ChatInputFormRef } from '@/components/content/messages';
import type { FormattedMessage } from '@/services/message.service';

type FormData = { chatInput: string };

interface UseMessageInputProps {
  conversationId: string;
}

interface UseMessageInputReturn {
  methods: ReturnType<typeof useForm<FormData>>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  reAskedMessageId: string | null;
  handleReAsk: (text: string, messageId: string) => void;
  handleMessageSubmitted: () => Promise<void>;
  chatInputRef: React.RefObject<ChatInputFormRef | null>;
}

export const useMessageInput = ({
  conversationId,
}: UseMessageInputProps): UseMessageInputReturn => {
  const methods = useForm<FormData>();
  const queryClient = useQueryClient();
  const createMessageMutation = useCreateMessage();
  const deleteMessageMutation = useDeleteMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reAskedMessageId, setReAskedMessageId] = useState<string | null>(null);
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

  const handleReAsk = (text: string, messageId: string) => {
    chatInputRef.current?.setValue(text);
    chatInputRef.current?.focus();
    setReAskedMessageId(messageId);
  };

  const handleMessageSubmitted = async () => {
    if (reAskedMessageId) {
      const currentMessages =
        (queryClient.getQueryData([
          'messages',
          conversationId,
        ]) as FormattedMessage[]) || [];

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

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Handle re-ask cleanup if needed
      await handleMessageSubmitted();

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
    isSubmitting,
    reAskedMessageId,
    handleReAsk,
    handleMessageSubmitted,
    chatInputRef,
  };
};
