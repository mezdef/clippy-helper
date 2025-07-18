// Component size variants
export type ComponentSize = 'sm' | 'md' | 'lg';

// Button variants
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

// Editing state type used in multiple components
export interface EditingItem {
  type: 'message' | 'excerpt';
  id: string;
}

// Common props for components that handle editing state
export interface EditingStateProps {
  editingItem?: EditingItem | null;
  setEditingItem?: (item: EditingItem | null) => void;
}
