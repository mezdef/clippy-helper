import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Global app state interface
interface AppState {
  editingItem: {
    type: 'message' | 'excerpt';
    id: string;
  } | null;
  isSubmitting: boolean;
  isEditingMessage: boolean;
}

// Default app state
const defaultAppState: AppState = {
  editingItem: null,
  isSubmitting: false,
  isEditingMessage: false,
};

// Hook to manage global app state
export const useAppState = () => {
  const queryClient = useQueryClient();

  // Query for app state
  const { data: appState = defaultAppState } = useQuery({
    queryKey: ['appState'],
    queryFn: () => defaultAppState,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Mutation to update app state
  const updateAppStateMutation = useMutation({
    mutationFn: async (updates: Partial<AppState>) => {
      const newState = { ...appState, ...updates };
      return newState;
    },
    onSuccess: newState => {
      queryClient.setQueryData(['appState'], newState);
    },
  });

  // Convenience functions
  const setEditingItem = (item: AppState['editingItem']) => {
    updateAppStateMutation.mutate({ editingItem: item });
  };

  const setIsSubmitting = (isSubmitting: boolean) => {
    updateAppStateMutation.mutate({ isSubmitting });
  };

  const setIsEditingMessage = (isEditingMessage: boolean) => {
    updateAppStateMutation.mutate({ isEditingMessage });
  };

  const clearEditingItem = () => {
    updateAppStateMutation.mutate({ editingItem: null });
  };

  return {
    // State
    editingItem: appState.editingItem,
    isSubmitting: appState.isSubmitting,
    isEditingMessage: appState.isEditingMessage,

    // Actions
    setEditingItem,
    setIsSubmitting,
    setIsEditingMessage,
    clearEditingItem,
    updateAppState: updateAppStateMutation.mutate,

    // Meta
    isUpdating: updateAppStateMutation.isPending,
  };
};
