import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateMessage, useDeleteMessage } from './useMessages';
import { useAppState } from './useAppState';
import type { PromptFormRef } from '@/components/features/prompt';
import type { FormattedMessage } from '@/services/message.service';
import type { PromptFormData, MessageCreateData } from '@/types';
import type {
  AiRequestInput,
  AiResponseStructured,
} from '@/services/llm.service';

interface UsePromptProps {
  conversationId: string;
}

interface UsePromptReturn {
  methods: ReturnType<typeof useForm<PromptFormData>>;
  onSubmit: (data: PromptFormData) => Promise<void>;
  handleEditMessage: (text: string, messageId: string) => Promise<void>;
  promptFormRef: React.RefObject<PromptFormRef | null>;
  isSubmitting: boolean;
}

export const usePrompt = ({
  conversationId,
}: UsePromptProps): UsePromptReturn => {
  const methods = useForm<PromptFormData>({
    defaultValues: {
      prompt: '',
    },
  });
  const queryClient = useQueryClient();
  const createMessageMutation = useCreateMessage();
  const deleteMessageMutation = useDeleteMessage();
  const { setIsSubmitting, setIsEditingMessage, isSubmitting } = useAppState();
  const promptFormRef = useRef<PromptFormRef | null>(null);

  /**
   * Build conversation context from existing messages
   */
  const buildConversationContext = (
    existingMessages: FormattedMessage[]
  ): AiRequestInput[] => {
    return existingMessages
      .filter(msg => msg.role === 'user')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.text || '',
      }));
  };

  /**
   * Create a complete conversation request with new user message
   */
  const createConversationRequest = (
    existingMessages: FormattedMessage[],
    newUserMessage: string
  ): AiRequestInput[] => {
    const conversationContext = buildConversationContext(existingMessages);

    return [
      ...conversationContext,
      {
        role: 'user',
        content: newUserMessage,
      },
    ];
  };

  /**
   * Send request to LLM API
   */
  const sendPromptRequest = async (
    aiRequests: AiRequestInput[]
  ): Promise<AiResponseStructured> => {
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiRequests),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      return result;
    } catch (error) {
      console.error('Error sending prompt request:', error);
      throw error;
    }
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
          role: 'user' as const,
          content: text,
        } satisfies MessageCreateData,
      });

      // Get existing messages to build AI request context
      const existingMessages =
        (queryClient.getQueryData([
          'messages',
          conversationId,
        ]) as FormattedMessage[]) || [];

      // Create conversation request with new user message
      const newAiRequests: AiRequestInput[] = createConversationRequest(
        existingMessages,
        text
      );

      // Get AI response
      const result = await sendPromptRequest(newAiRequests);

      // Save AI message to database with excerpts
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'assistant' as const,
          content: JSON.stringify(result.output_parsed),
          aiResponse: result.output_parsed,
        } satisfies MessageCreateData,
      });
    } catch (err) {
      console.error('Error in direct re-ask:', err);
      throw err;
    } finally {
      setIsEditingMessage(false);
    }
  };

  const onSubmit = async (data: PromptFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Save user message to database first
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'user' as const,
          content: data.prompt,
        } satisfies MessageCreateData,
      });

      // Get existing messages to build AI request context
      const existingMessages =
        (queryClient.getQueryData([
          'messages',
          conversationId,
        ]) as FormattedMessage[]) || [];

      // Create conversation request with new user message
      const newAiRequests: AiRequestInput[] = createConversationRequest(
        existingMessages,
        data.prompt
      );

      // Get AI response
      const result = await sendPromptRequest(newAiRequests);

      // Save AI message to database with excerpts
      await createMessageMutation.mutateAsync({
        conversationId,
        messageData: {
          role: 'assistant' as const,
          content: JSON.stringify(result.output_parsed),
          aiResponse: result.output_parsed,
        } satisfies MessageCreateData,
      });
    } catch (err) {
      console.error('Error in prompt submission:', err);
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
    promptFormRef,
    isSubmitting,
  };
};
