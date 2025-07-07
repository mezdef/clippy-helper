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

interface UseSidebarReturn {
  isOpen: boolean;
  activeSidebar?: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  updateSidebar: (updates: Partial<SidebarState>) => void;
  isLoading: boolean;
}

// Hook to manage sidebar state
export const useSidebar = (sidebarId?: string): UseSidebarReturn => {
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
