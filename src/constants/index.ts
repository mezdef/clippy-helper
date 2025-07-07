/**
 * API Configuration Constants
 */
export const API_CONFIG = {
  /** Default timeout for API requests in milliseconds */
  DEFAULT_TIMEOUT: 30000,
  /** Base URL for API endpoints */
  BASE_URL: '/api',
  /** Content type for JSON requests */
  JSON_CONTENT_TYPE: 'application/json',
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  /** Health check endpoint */
  HEALTH: '/api/health',
  /** LLM service endpoint */
  LLM: '/api/llm',
  /** Conversations endpoint */
  CONVERSATIONS: '/api/conversations',
  /** Get conversation by ID */
  CONVERSATION_BY_ID: (id: string) => `/api/conversations/${id}`,
  /** Messages for a conversation */
  MESSAGES: (conversationId: string) =>
    `/api/conversations/${conversationId}/messages`,
  /** Specific message endpoint */
  MESSAGE_BY_ID: (conversationId: string, messageId: string) =>
    `/api/conversations/${conversationId}/messages/${messageId}`,
  /** Excerpt endpoint */
  EXCERPT_BY_ID: (id: string) => `/api/excerpts/${id}`,
} as const;

/**
 * React Query Configuration
 */
export const QUERY_CONFIG = {
  /** Default stale time for queries (5 minutes) */
  DEFAULT_STALE_TIME: 1000 * 60 * 5,
  /** Default garbage collection time (10 minutes) */
  DEFAULT_GC_TIME: 1000 * 60 * 10,
  /** Retry attempts for failed queries */
  DEFAULT_RETRY_ATTEMPTS: 3,
} as const;

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  /** Conversations query key */
  CONVERSATIONS: 'conversations',
  /** Messages query key */
  MESSAGES: 'messages',
  /** Excerpts query key */
  EXCERPTS: 'excerpts',
  /** Conversation by ID query key */
  CONVERSATION: 'conversation',
  /** Health check query key */
  HEALTH: 'health',
} as const;

/**
 * Message Roles
 */
export const MESSAGE_ROLES = {
  /** User message role */
  USER: 'user',
  /** Assistant message role */
  ASSISTANT: 'assistant',
  /** System message role */
  SYSTEM: 'system',
} as const;

/**
 * Health Status Types
 */
export const HEALTH_STATUS = {
  /** Healthy status */
  HEALTHY: 'healthy',
  /** Unhealthy status */
  UNHEALTHY: 'unhealthy',
  /** Degraded status */
  DEGRADED: 'degraded',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  /** Generic error message */
  GENERIC: 'An unexpected error occurred',
  /** Network error message */
  NETWORK: 'Network connection error',
  /** API error message */
  API_ERROR: 'API request failed',
  /** Validation error message */
  VALIDATION: 'Invalid input provided',
  /** Not found error message */
  NOT_FOUND: 'Resource not found',
  /** Unauthorized error message */
  UNAUTHORIZED: 'Unauthorized access',
  /** Server error message */
  SERVER_ERROR: 'Internal server error',
  /** Message creation failed */
  MESSAGE_CREATE_FAILED: 'Failed to create message',
  /** Message deletion failed */
  MESSAGE_DELETE_FAILED: 'Failed to delete message',
  /** Message update failed */
  MESSAGE_UPDATE_FAILED: 'Failed to update message',
  /** Conversation creation failed */
  CONVERSATION_CREATE_FAILED: 'Failed to create conversation',
  /** AI response generation failed */
  AI_RESPONSE_FAILED: 'Failed to generate AI response',
  /** No messages provided for AI */
  NO_MESSAGES_FOR_AI: 'No messages provided for AI generation',
  /** Invalid message format */
  INVALID_MESSAGE_FORMAT: 'Invalid message format',
  /** Database connection failed */
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
  /** Environment variable missing */
  ENV_VAR_MISSING: 'Required environment variable is missing',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  /** Message created successfully */
  MESSAGE_CREATED: 'Message created successfully',
  /** Message updated successfully */
  MESSAGE_UPDATED: 'Message updated successfully',
  /** Message deleted successfully */
  MESSAGE_DELETED: 'Message deleted successfully',
  /** Conversation created successfully */
  CONVERSATION_CREATED: 'Conversation created successfully',
  /** Conversation updated successfully */
  CONVERSATION_UPDATED: 'Conversation updated successfully',
  /** AI response generated successfully */
  AI_RESPONSE_GENERATED: 'AI response generated successfully',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  /** Success status */
  OK: 200,
  /** Created status */
  CREATED: 201,
  /** Bad request status */
  BAD_REQUEST: 400,
  /** Unauthorized status */
  UNAUTHORIZED: 401,
  /** Not found status */
  NOT_FOUND: 404,
  /** Internal server error status */
  INTERNAL_SERVER_ERROR: 500,
  /** Service unavailable status */
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * OpenAI Configuration
 */
export const OPENAI_CONFIG = {
  /** Default model for chat completions */
  DEFAULT_MODEL: 'gpt-4o-2024-08-06',
  /** System prompt for advice generation */
  ADVICE_SYSTEM_PROMPT: 'Provide advice as an unordered list.',
  /** Maximum tokens for responses */
  MAX_TOKENS: 2000,
  /** Temperature for response generation */
  TEMPERATURE: 0.7,
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /** Default page size for pagination */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,
  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 300,
  /** Debounce delay for search inputs */
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  /** Minimum length for message content */
  MIN_MESSAGE_LENGTH: 1,
  /** Maximum length for message content */
  MAX_MESSAGE_LENGTH: 10000,
  /** Minimum length for conversation title */
  MIN_TITLE_LENGTH: 1,
  /** Maximum length for conversation title */
  MAX_TITLE_LENGTH: 200,
  /** Minimum length for excerpt title */
  MIN_EXCERPT_TITLE_LENGTH: 1,
  /** Maximum length for excerpt title */
  MAX_EXCERPT_TITLE_LENGTH: 100,
  /** Maximum length for excerpt content */
  MAX_EXCERPT_CONTENT_LENGTH: 5000,
} as const;

/**
 * Database Configuration
 */
export const DATABASE_CONFIG = {
  /** Default connection timeout */
  CONNECTION_TIMEOUT: 30000,
  /** Default query timeout */
  QUERY_TIMEOUT: 10000,
  /** Maximum pool size */
  MAX_POOL_SIZE: 10,
  /** Minimum pool size */
  MIN_POOL_SIZE: 2,
} as const;
