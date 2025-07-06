// Common role type used throughout the app
export type MessageRole = 'user' | 'assistant' | 'system';

// Form data types
export interface ChatInputFormData {
  chatInput: string;
}

export interface EditMessageFormData {
  text: string;
}

export interface EditExcerptFormData {
  title: string;
  content: string;
}

// API response types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
