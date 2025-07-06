import { useMutation, useQueryClient } from '@tanstack/react-query';

// Update an excerpt
export const useUpdateExcerpt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      title,
    }: {
      id: string;
      content: string;
      title: string;
    }): Promise<any> => {
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
      // Invalidate and refetch messages to update the UI
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

// Delete an excerpt
export const useDeleteExcerpt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/excerpts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete excerpt');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch messages to update the UI
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
