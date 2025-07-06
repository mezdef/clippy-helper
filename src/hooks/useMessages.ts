import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppState } from './useAppState';
import type { MessageWithExcerpts } from '@/db/schema';
import type { FormattedMessage } from '@/services/message.service';

// Create a new message
export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { setIsSubmitting } = useAppState();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageData,
    }: {
      conversationId: string;
      messageData: { role: string; content: string; aiResponse?: any };
    }): Promise<MessageWithExcerpts> => {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      return response.json();
    },
    onMutate: async ({ messageData }) => {
      // Set loading state
      if (messageData.role === 'user') {
        setIsSubmitting(true);
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages'] });
    },
    onSuccess: (newMessage, { conversationId, messageData }) => {
      // Clear loading state
      if (messageData.role === 'assistant') {
        setIsSubmitting(false);
      }

      // Add the new message to the messages cache
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: FormattedMessage[] | undefined) => {
          // Format the new message to match the cache structure
          const formattedMessage: FormattedMessage = {
            id: newMessage.id,
            role: newMessage.role as 'user' | 'assistant',
            text: newMessage.content,
            excerpts: newMessage.excerpts || [],
          };
          return old ? [...old, formattedMessage] : [formattedMessage];
        }
      );

      // Invalidate the conversation to refresh the messages count
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
    onError: () => {
      // Clear loading state on error
      setIsSubmitting(false);
    },
  });
};

// Delete a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }): Promise<void> => {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    },
    onSuccess: (_, { conversationId, messageId }) => {
      // Remove the message from the messages cache
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: FormattedMessage[] | undefined) =>
          old?.filter(msg => msg.id !== messageId)
      );

      // Invalidate the conversation to refresh the messages count
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });
};
