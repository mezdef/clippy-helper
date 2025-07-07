// API request configuration - standardizes timeout and content handling
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  BASE_URL: '/api',
  JSON_CONTENT_TYPE: 'application/json',
} as const;

// API endpoint configuration - centralizes all backend routes
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  LLM: '/api/llm',
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_BY_ID: (id: string) => `/api/conversations/${id}`,
  MESSAGES: (conversationId: string) =>
    `/api/conversations/${conversationId}/messages`,
  MESSAGE_BY_ID: (conversationId: string, messageId: string) =>
    `/api/conversations/${conversationId}/messages/${messageId}`,
  EXCERPT_BY_ID: (id: string) => `/api/excerpts/${id}`,
} as const;

// React Query configuration - balances performance with data freshness
export const QUERY_CONFIG = {
  /** 5 minute stale time - conversations change infrequently */
  DEFAULT_STALE_TIME: 1000 * 60 * 5,
  /** 10 minute garbage collection - keeps memory usage reasonable */
  DEFAULT_GC_TIME: 1000 * 60 * 10,
  /** 3 retry attempts for failed queries - handles transient network issues */
  DEFAULT_RETRY_ATTEMPTS: 3,
} as const;

// Query keys for React Query caching - prevents cache conflicts
export const QUERY_KEYS = {
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  EXCERPTS: 'excerpts',
  CONVERSATION: 'conversation',
  HEALTH: 'health',
} as const;

// Message role constants - matches OpenAI API format
export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

// Health monitoring status types
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  DEGRADED: 'degraded',
} as const;

// Standardized error messages - provides consistent user experience
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred',
  NETWORK: 'Network connection error',
  API_ERROR: 'API request failed',
  VALIDATION: 'Invalid input provided',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
  MESSAGE_CREATE_FAILED: 'Failed to create message',
  MESSAGE_DELETE_FAILED: 'Failed to delete message',
  MESSAGE_UPDATE_FAILED: 'Failed to update message',
  CONVERSATION_CREATE_FAILED: 'Failed to create conversation',
  AI_RESPONSE_FAILED: 'Failed to generate AI response',
  NO_MESSAGES_FOR_AI: 'No messages provided for AI generation',
  INVALID_MESSAGE_FORMAT: 'Invalid message format',
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
  ENV_VAR_MISSING: 'Required environment variable is missing',
} as const;

// Success messages for positive user feedback
export const SUCCESS_MESSAGES = {
  MESSAGE_CREATED: 'Message created successfully',
  MESSAGE_UPDATED: 'Message updated successfully',
  MESSAGE_DELETED: 'Message deleted successfully',
  CONVERSATION_CREATED: 'Conversation created successfully',
  CONVERSATION_UPDATED: 'Conversation updated successfully',
  AI_RESPONSE_GENERATED: 'AI response generated successfully',
} as const;

// HTTP status codes - standardizes API response codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// OpenAI API configuration - optimized for advice generation
export const OPENAI_CONFIG = {
  /** GPT-4 model for high-quality advice generation */
  DEFAULT_MODEL: 'gpt-4o-2024-08-06',
  /** System prompt that ensures structured advice output */
  ADVICE_SYSTEM_PROMPT: 'Provide advice as an unordered list.',
  /** 2000 tokens max - balances response quality with cost */
  MAX_TOKENS: 2000,
  /** 0.7 temperature - creative but focused responses */
  TEMPERATURE: 0.7,
} as const;

// UI configuration - optimizes user experience
export const UI_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  ANIMATION_DURATION: 300,
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

// Validation rules - enforce data quality and prevent abuse
export const VALIDATION_RULES = {
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 10000,
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MIN_EXCERPT_TITLE_LENGTH: 1,
  MAX_EXCERPT_TITLE_LENGTH: 100,
  MAX_EXCERPT_CONTENT_LENGTH: 5000,
} as const;

// Database configuration - optimizes connection handling
export const DATABASE_CONFIG = {
  /** 30 second connection timeout - prevents hanging connections */
  CONNECTION_TIMEOUT: 30000,
  /** 10 second query timeout - prevents slow queries from blocking */
  QUERY_TIMEOUT: 10000,
  /** 10 max connections - balances performance with resource usage */
  MAX_POOL_SIZE: 10,
  /** 2 min connections - ensures some connections are always available */
  MIN_POOL_SIZE: 2,
} as const;
