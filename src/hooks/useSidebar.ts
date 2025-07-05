import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Sidebar state interface
interface SidebarState {
  isOpen: boolean;
  activeSidebar?: string;
}

// Get sidebar state from localStorage or default
const getSidebarState = (): SidebarState => {
  if (typeof window === 'undefined') {
    return { isOpen: false };
  }

  try {
    const stored = localStorage.getItem('sidebar-state');
    return stored ? JSON.parse(stored) : { isOpen: false };
  } catch {
    return { isOpen: false };
  }
};

// Save sidebar state to localStorage
const saveSidebarState = (state: SidebarState) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('sidebar-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save sidebar state:', error);
  }
};

// Hook to manage sidebar state
export const useSidebar = (sidebarId?: string) => {
  const queryClient = useQueryClient();

  // Query for sidebar state
  const { data: sidebarState = { isOpen: false } } = useQuery({
    queryKey: ['sidebar', sidebarId],
    queryFn: () => getSidebarState(),
    staleTime: Infinity, // Sidebar state doesn't need to be refetched
    gcTime: Infinity, // Keep in cache indefinitely
  });

  // Mutation to update sidebar state
  const updateSidebarMutation = useMutation({
    mutationFn: async (updates: Partial<SidebarState>) => {
      const newState = { ...sidebarState, ...updates };
      saveSidebarState(newState);
      return newState;
    },
    onSuccess: newState => {
      // Update the cache immediately
      queryClient.setQueryData(['sidebar', sidebarId], newState);
    },
  });

  // Convenience functions
  const openSidebar = () => {
    updateSidebarMutation.mutate({ isOpen: true, activeSidebar: sidebarId });
  };

  const closeSidebar = () => {
    updateSidebarMutation.mutate({ isOpen: false });
  };

  const toggleSidebar = () => {
    updateSidebarMutation.mutate({
      isOpen: !sidebarState.isOpen,
      activeSidebar: !sidebarState.isOpen ? sidebarId : undefined,
    });
  };

  return {
    isOpen: sidebarState.isOpen,
    activeSidebar: sidebarState.activeSidebar,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    updateSidebar: updateSidebarMutation.mutate,
    isLoading: updateSidebarMutation.isPending,
  };
};

// Hook to manage multiple sidebars
export const useSidebarManager = () => {
  const queryClient = useQueryClient();

  // Get all sidebar states
  const { data: allSidebars = {} } = useQuery({
    queryKey: ['sidebars'],
    queryFn: () => {
      if (typeof window === 'undefined') return {};

      try {
        const stored = localStorage.getItem('all-sidebars');
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Mutation to update all sidebars
  const updateSidebarsMutation = useMutation({
    mutationFn: async (updates: Record<string, SidebarState>) => {
      const newState = { ...allSidebars, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('all-sidebars', JSON.stringify(newState));
      }
      return newState;
    },
    onSuccess: newState => {
      queryClient.setQueryData(['sidebars'], newState);
    },
  });

  const closeAllSidebars = () => {
    const closedSidebars = Object.keys(allSidebars).reduce(
      (acc, key) => {
        acc[key] = { ...allSidebars[key], isOpen: false };
        return acc;
      },
      {} as Record<string, SidebarState>
    );

    updateSidebarsMutation.mutate(closedSidebars);
  };

  return {
    allSidebars,
    closeAllSidebars,
    updateSidebars: updateSidebarsMutation.mutate,
    isLoading: updateSidebarsMutation.isPending,
  };
};
