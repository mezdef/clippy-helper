import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Conversation } from '@/db/schema';
import type { FormattedMessage } from '@/services/message.service';

// Fetch all conversations
export const useConversations = (): ReturnType<typeof useQuery> => {
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

// Fetch a single conversation with messages and state management
export const useConversation = (
  id?: string
): {
  conversation: Conversation | undefined;
  messages: FormattedMessage[];
  conversationLoading: boolean;
  messagesLoading: boolean;
  isLoading: boolean;
  conversationError: Error | null;
  messagesError: Error | null;
  hasError: boolean;
  conversationId: string | undefined;
  isError: boolean;
  refetch: () => void;
} => {
  const params = useParams();
  const conversationId = id || (params.id as string);

  const conversationQuery = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return response.json();
    },
    enabled: !!conversationId,
  });

  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<FormattedMessage[]> => {
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

  return {
    // Data
    conversation: conversationQuery.data,
    messages: messagesQuery.data || [],

    // Loading states
    conversationLoading: conversationQuery.isLoading,
    messagesLoading: messagesQuery.isLoading,
    isLoading: conversationQuery.isLoading || messagesQuery.isLoading,

    // Error states
    conversationError: conversationQuery.error,
    messagesError: messagesQuery.error,
    hasError: !!conversationQuery.error || !!messagesQuery.error,

    // Other
    conversationId,
    isError: conversationQuery.isError || messagesQuery.isError,
    refetch: () => {
      conversationQuery.refetch();
      messagesQuery.refetch();
    },
  };
};

// Create a new conversation
export const useCreateConversation = (): UseMutationResult<
  Conversation,
  Error,
  string
> => {
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
export const useDeleteConversation = (): UseMutationResult<
  void,
  Error,
  string
> => {
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

// Update a conversation
export const useUpdateConversation = (): UseMutationResult<
  Conversation,
  Error,
  { id: string; title: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
    }): Promise<Conversation> => {
      const response = await fetch(`/api/conversations/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update conversation');
      }

      return response.json();
    },
    onSuccess: updatedConversation => {
      // Invalidate and refetch conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Add the updated conversation to the cache
      queryClient.setQueryData(
        ['conversation', updatedConversation.id],
        updatedConversation
      );
    },
  });
};

// Clear a conversation
export const useClearConversation = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/conversations/${id}/clear`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to clear conversation');
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
