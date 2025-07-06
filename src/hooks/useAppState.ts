import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { EditingItem } from '@/types';

// Global app state interface
interface AppState {
  editingItem: EditingItem | null;
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

  // Convenience functions with immediate updates
  const setEditingItem = useCallback(
    (item: EditingItem | null) => {
      const newState = { ...appState, editingItem: item };
      queryClient.setQueryData(['appState'], newState);
    },
    [appState, queryClient]
  );

  const setIsSubmitting = useCallback(
    (isSubmitting: boolean) => {
      const newState = { ...appState, isSubmitting };
      queryClient.setQueryData(['appState'], newState);
    },
    [appState, queryClient]
  );

  const setIsEditingMessage = useCallback(
    (isEditingMessage: boolean) => {
      const newState = { ...appState, isEditingMessage };
      queryClient.setQueryData(['appState'], newState);
    },
    [appState, queryClient]
  );

  const clearEditingItem = useCallback(() => {
    const newState = { ...appState, editingItem: null };
    queryClient.setQueryData(['appState'], newState);
  }, [appState, queryClient]);

  const updateAppState = useCallback(
    (updates: Partial<AppState>) => {
      const newState = { ...appState, ...updates };
      queryClient.setQueryData(['appState'], newState);
    },
    [appState, queryClient]
  );

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
    updateAppState,

    // Meta (for compatibility)
    isUpdating: false,
  };
};
