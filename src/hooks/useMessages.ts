import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import type { MessageWithExcerpts } from '@/db/schema';
import type { FormattedMessage } from '@/services/message.service';
import type { MessageCreateData, MessageRole } from '@/types';

// Create a new message
export const useCreateMessage = (): UseMutationResult<
  MessageWithExcerpts,
  Error,
  { conversationId: string; messageData: MessageCreateData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageData,
    }: {
      conversationId: string;
      messageData: MessageCreateData;
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
    onSuccess: (newMessage, { conversationId }) => {
      // Add the new message to the messages cache
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: FormattedMessage[] | undefined) => {
          // Format the new message to match the cache structure
          const formattedMessage: FormattedMessage = {
            id: newMessage.id,
            role: newMessage.role as MessageRole,
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
  });
};

// Delete a message
export const useDeleteMessage = (): UseMutationResult<
  void,
  Error,
  { conversationId: string; messageId: string }
> => {
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
