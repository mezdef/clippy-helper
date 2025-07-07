import { VALIDATION_RULES } from '@/constants';

// Standardized validation result - consistent interface for all validation functions
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate message content against business rules (prevents empty spam and enforces limits)
export function validateMessage(content: string): ValidationResult {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Message content is required' };
  }

  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length < VALIDATION_RULES.MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message must be at least ${VALIDATION_RULES.MIN_MESSAGE_LENGTH} characters`,
    };
  }

  // Prevent extremely long messages that could cause performance issues
  if (trimmed.length > VALIDATION_RULES.MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message must be no more than ${VALIDATION_RULES.MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Validate conversation titles for UI display and database storage
export function validateConversationTitle(title: string): ValidationResult {
  if (!title || typeof title !== 'string') {
    return {
      isValid: false,
      error: 'Conversation title is required',
    };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < VALIDATION_RULES.MIN_TITLE_LENGTH) {
    return {
      isValid: false,
      error: 'Conversation title cannot be empty',
    };
  }

  // Prevent titles that are too long for UI display
  if (trimmedTitle.length > VALIDATION_RULES.MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Conversation title cannot exceed ${VALIDATION_RULES.MAX_TITLE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Validate excerpt titles for advice organization
export function validateExcerptTitle(title: string): ValidationResult {
  if (!title || typeof title !== 'string') {
    return {
      isValid: false,
      error: 'Excerpt title is required',
    };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < VALIDATION_RULES.MIN_EXCERPT_TITLE_LENGTH) {
    return {
      isValid: false,
      error: 'Excerpt title cannot be empty',
    };
  }

  // Keep excerpt titles concise for better UX
  if (trimmedTitle.length > VALIDATION_RULES.MAX_EXCERPT_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Excerpt title cannot exceed ${VALIDATION_RULES.MAX_EXCERPT_TITLE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Validate excerpt content for AI advice storage
export function validateExcerptContent(content: string): ValidationResult {
  if (!content || typeof content !== 'string') {
    return {
      isValid: false,
      error: 'Excerpt content is required',
    };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length === 0) {
    return {
      isValid: false,
      error: 'Excerpt content cannot be empty',
    };
  }

  // Prevent extremely long excerpts that hurt readability
  if (trimmedContent.length > VALIDATION_RULES.MAX_EXCERPT_CONTENT_LENGTH) {
    return {
      isValid: false,
      error: `Excerpt content cannot exceed ${VALIDATION_RULES.MAX_EXCERPT_CONTENT_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Validate UUID format for database relationships
export function validateUUID(uuid: string): ValidationResult {
  if (!uuid || typeof uuid !== 'string') {
    return {
      isValid: false,
      error: 'UUID is required',
    };
  }

  // Standard UUID v4 format check
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(uuid)) {
    return {
      isValid: false,
      error: 'Invalid UUID format',
    };
  }

  return { isValid: true };
}

// Basic email format validation (not comprehensive, use server-side validation for security)
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  // Basic email pattern - server should do comprehensive validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  return { isValid: true };
}

// Generic required field validation for forms
export function validateRequired(
  value: unknown,
  fieldName: string
): ValidationResult {
  if (value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty`,
    };
  }

  return { isValid: true };
}

// Validate multiple fields and return first error (fail-fast approach)
export function validateMultiple(
  results: ValidationResult[]
): ValidationResult {
  for (const result of results) {
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
}

// Type-safe form validation with custom rules per field
export function validateFormData<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: T[keyof T]) => ValidationResult>
): ValidationResult {
  for (const [field, rule] of Object.entries(rules) as [
    keyof T,
    (value: T[keyof T]) => ValidationResult,
  ][]) {
    const result = rule(data[field]);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `${String(field)}: ${result.error}`,
      };
    }
  }

  return { isValid: true };
}
