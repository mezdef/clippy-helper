import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/db/schema';

// Fetch all conversations
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return response.json();
    },
  });
};

// Fetch a single conversation with messages
export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// Create a new conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string): Promise<Conversation> => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      return response.json();
    },
    onSuccess: newConversation => {
      // Invalidate and refetch conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Add the new conversation to the cache
      queryClient.setQueryData(
        ['conversation', newConversation.id],
        newConversation
      );
    },
  });
};

// Delete a conversation
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from conversations list
      queryClient.setQueryData(
        ['conversations'],
        (old: Conversation[] | undefined) =>
          old?.filter(conv => conv.id !== deletedId)
      );
      // Remove from individual conversation cache
      queryClient.removeQueries({ queryKey: ['conversation', deletedId] });
    },
  });
};
