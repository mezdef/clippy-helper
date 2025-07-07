import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { EditingItem } from '@/types';

// Global app state interface
interface AppState {
  editingItem: EditingItem | null;
  isSubmitting: boolean;
  isEditingMessage: boolean;
  error: string | null;
  isLoading: boolean;
}

// Default app state
const defaultAppState: AppState = {
  editingItem: null,
  isSubmitting: false,
  isEditingMessage: false,
  error: null,
  isLoading: false,
};

// Return type for useAppState hook
interface UseAppStateReturn extends AppState {
  setEditingItem: (item: EditingItem | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEditingMessage: (isEditingMessage: boolean) => void;
  clearEditingItem: () => void;
  updateAppState: (updates: Partial<AppState>) => void;
  showError: (message: string) => void;
  startLoading: () => void;
  stopLoading: () => void;
  isUpdating: boolean;
}

// Hook to manage global app state
export const useAppState = (): UseAppStateReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const showError = (message: string): void => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const startLoading = (): void => setIsLoading(true);
  const stopLoading = (): void => setIsLoading(false);

  return {
    // State
    editingItem: appState.editingItem,
    isSubmitting: appState.isSubmitting,
    isEditingMessage: appState.isEditingMessage,
    error,
    isLoading,

    // Actions
    setEditingItem,
    setIsSubmitting,
    setIsEditingMessage,
    clearEditingItem,
    updateAppState,
    showError,
    startLoading,
    stopLoading,

    // Meta (for compatibility)
    isUpdating: false,
  };
};
