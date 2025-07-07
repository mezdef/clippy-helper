import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import type { Excerpt } from '@/db/schema';
import type { FormattedMessage } from '@/services/message.service';
import { useAppState } from './useAppState';

// Update an excerpt
export const useUpdateExcerpt = (): UseMutationResult<
  Excerpt,
  Error,
  { id: string; content: string; title: string }
> => {
  const queryClient = useQueryClient();
  const { clearEditingItem } = useAppState();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      title,
    }: {
      id: string;
      content: string;
      title: string;
    }): Promise<Excerpt> => {
      const response = await fetch(`/api/excerpts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update excerpt');
      }

      return response.json();
    },
    onSuccess: updatedExcerpt => {
      // Clear editing state
      clearEditingItem();

      // Update the excerpt in the messages cache optimistically
      queryClient.setQueriesData(
        { queryKey: ['messages'] },
        (oldData: FormattedMessage[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map(message => ({
            ...message,
            excerpts:
              message.excerpts?.map(excerpt =>
                excerpt.id === updatedExcerpt.id
                  ? { ...excerpt, ...updatedExcerpt }
                  : excerpt
              ) || [],
          }));
        }
      );
    },
  });
};

// Delete an excerpt
export const useDeleteExcerpt = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  const { clearEditingItem } = useAppState();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/excerpts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete excerpt');
      }
    },
    onSuccess: (_, deletedId) => {
      // Clear editing state
      clearEditingItem();

      // Remove the excerpt from the messages cache optimistically
      queryClient.setQueriesData(
        { queryKey: ['messages'] },
        (oldData: FormattedMessage[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map(message => ({
            ...message,
            excerpts:
              message.excerpts?.filter(excerpt => excerpt.id !== deletedId) ||
              [],
          }));
        }
      );
    },
  });
};
