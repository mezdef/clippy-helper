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
import {
  API_ENDPOINTS,
  ERROR_MESSAGES,
  QUERY_KEYS,
  MESSAGE_ROLES,
} from '@/constants';
import { post } from '@/utils/api';

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
      return await post<AiResponseStructured>(API_ENDPOINTS.LLM, aiRequests);
    } catch (error) {
      console.error('Error sending prompt request:', error);
      throw new Error(ERROR_MESSAGES.AI_RESPONSE_FAILED);
    }
  };
  const getCurrentMessages = (): FormattedMessage[] => {
    return (
      (queryClient.getQueryData([
        QUERY_KEYS.MESSAGES,
        conversationId,
      ]) as FormattedMessage[]) || []
    );
  };
  const deleteMessagesFromIndex = async (
    messages: FormattedMessage[],
    fromIndex: number
  ): Promise<void> => {
    const messagesToDelete = messages.slice(fromIndex);

    for (const message of messagesToDelete) {
      await deleteMessageMutation.mutateAsync({
        conversationId,
        messageId: message.id,
      });
    }
  };

  const createUserMessage = async (content: string): Promise<void> => {
    await createMessageMutation.mutateAsync({
      conversationId,
      messageData: {
        role: 'user' as const,
        content,
      } satisfies MessageCreateData,
    });
  };

  const createAssistantMessage = async (
    aiResponse: AiResponseStructured
  ): Promise<void> => {
    await createMessageMutation.mutateAsync({
      conversationId,
      messageData: {
        role: 'assistant' as const,
        content: JSON.stringify(aiResponse.output_parsed),
        aiResponse: aiResponse.output_parsed,
      } satisfies MessageCreateData,
    });
  };
  const handleEditMessage = async (
    text: string,
    messageId: string
  ): Promise<void> => {
    setIsEditingMessage(true);

    try {
      const currentMessages = getCurrentMessages();
      const messageIndex = currentMessages.findIndex(
        msg => msg.id === messageId
      );

      // Delete all messages from the edited message onwards
      if (messageIndex !== -1) {
        await deleteMessagesFromIndex(currentMessages, messageIndex);
      }

      // Create new user message
      await createUserMessage(text);

      // Get updated messages and generate AI response
      const updatedMessages = getCurrentMessages();
      const aiRequests = createConversationRequest(updatedMessages, text);
      const aiResponse = await sendPromptRequest(aiRequests);

      // Create AI response message
      await createAssistantMessage(aiResponse);
    } catch (error) {
      console.error('Error in message editing:', error);
      throw error;
    } finally {
      setIsEditingMessage(false);
    }
  };

  const onSubmit = async (data: PromptFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Create user message
      await createUserMessage(data.prompt);

      // Get current messages and generate AI response
      const currentMessages = getCurrentMessages();
      const aiRequests = createConversationRequest(
        currentMessages,
        data.prompt
      );
      const aiResponse = await sendPromptRequest(aiRequests);

      // Create AI response message
      await createAssistantMessage(aiResponse);
    } catch (error) {
      console.error('Error in prompt submission:', error);
      throw error;
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
