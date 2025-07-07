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
import { API_ENDPOINTS, ERROR_MESSAGES, QUERY_KEYS } from '@/constants';
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

// Hook for managing AI conversation flow, message editing, and form state
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

  // Extract only user messages for AI context (avoids including previous AI responses)
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

  // Prepare full conversation payload for AI including historical context
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

  // Send conversation to AI service and get structured advice response
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

  // Access cached messages from React Query (avoids unnecessary re-fetches)
  const getCurrentMessages = (): FormattedMessage[] => {
    return (
      (queryClient.getQueryData([
        QUERY_KEYS.MESSAGES,
        conversationId,
      ]) as FormattedMessage[]) || []
    );
  };

  // Remove messages from a specific point onwards (used for conversation branching)
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

  // Store user message in database and update cache
  const createUserMessage = async (content: string): Promise<void> => {
    await createMessageMutation.mutateAsync({
      conversationId,
      messageData: {
        role: 'user' as const,
        content,
      } satisfies MessageCreateData,
    });
  };

  // Store AI response with structured excerpts in database
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

  // Edit message and regenerate conversation from that point (creates new conversation branch)
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

      // Remove all messages from the edited point onwards (conversation branching)
      if (messageIndex !== -1) {
        await deleteMessagesFromIndex(currentMessages, messageIndex);
      }

      // Create new user message with edited text
      await createUserMessage(text);

      // Generate fresh AI response based on new conversation state
      const updatedMessages = getCurrentMessages();
      const aiRequests = createConversationRequest(updatedMessages, text);
      const aiResponse = await sendPromptRequest(aiRequests);

      // Store the new AI response
      await createAssistantMessage(aiResponse);
    } catch (error) {
      console.error('Error in message editing:', error);
      throw error;
    } finally {
      setIsEditingMessage(false);
    }
  };

  // Handle new prompt submission - creates user message and generates AI response
  const onSubmit = async (data: PromptFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Store user's prompt
      await createUserMessage(data.prompt);

      // Get conversation context and generate AI response
      const currentMessages = getCurrentMessages();
      const aiRequests = createConversationRequest(
        currentMessages,
        data.prompt
      );
      const aiResponse = await sendPromptRequest(aiRequests);

      // Store AI response with structured excerpts
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
