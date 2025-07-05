import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message, MessageWithExcerpts } from '@/db/schema';

// Fetch messages for a conversation
export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<MessageWithExcerpts[]> => {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    enabled: !!conversationId,
  });
};

// Create a new message
export const useCreateMessage = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (newMessage, { conversationId }) => {
      // Add the new message to the messages cache
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: MessageWithExcerpts[] | undefined) =>
          old ? [...old, newMessage] : [newMessage]
      );

      // Invalidate the conversation to refresh the messages count
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
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
        (old: Message[] | undefined) => old?.filter(msg => msg.id !== messageId)
      );

      // Invalidate the conversation to refresh the messages count
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });
};

// Update a message
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
      messageData,
    }: {
      conversationId: string;
      messageId: string;
      messageData: { role?: string; content?: string };
    }): Promise<Message> => {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      return response.json();
    },
    onSuccess: (updatedMessage, { conversationId }) => {
      // Update the message in the messages cache
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: Message[] | undefined) =>
          old?.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );

      // Invalidate the conversation to refresh any derived data
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });
};
