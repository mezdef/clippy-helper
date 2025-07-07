import { VALIDATION_RULES } from '@/constants';

/**
 * Validation result interface
 * @interface ValidationResult
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates message content
 * @param content - The message content to validate
 * @returns Validation result with success status and optional error message
 */
export function validateMessageContent(content: string): ValidationResult {
  if (!content || typeof content !== 'string') {
    return {
      isValid: false,
      error: 'Message content is required',
    };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length < VALIDATION_RULES.MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: 'Message content cannot be empty',
    };
  }

  if (trimmedContent.length > VALIDATION_RULES.MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message content cannot exceed ${VALIDATION_RULES.MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates conversation title
 * @param title - The conversation title to validate
 * @returns Validation result with success status and optional error message
 */
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

  if (trimmedTitle.length > VALIDATION_RULES.MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Conversation title cannot exceed ${VALIDATION_RULES.MAX_TITLE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates excerpt title
 * @param title - The excerpt title to validate
 * @returns Validation result with success status and optional error message
 */
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

  if (trimmedTitle.length > VALIDATION_RULES.MAX_EXCERPT_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Excerpt title cannot exceed ${VALIDATION_RULES.MAX_EXCERPT_TITLE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates excerpt content
 * @param content - The excerpt content to validate
 * @returns Validation result with success status and optional error message
 */
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

  if (trimmedContent.length > VALIDATION_RULES.MAX_EXCERPT_CONTENT_LENGTH) {
    return {
      isValid: false,
      error: `Excerpt content cannot exceed ${VALIDATION_RULES.MAX_EXCERPT_CONTENT_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates UUID format
 * @param uuid - The UUID string to validate
 * @returns Validation result with success status and optional error message
 */
export function validateUUID(uuid: string): ValidationResult {
  if (!uuid || typeof uuid !== 'string') {
    return {
      isValid: false,
      error: 'UUID is required',
    };
  }

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

/**
 * Validates email format
 * @param email - The email string to validate
 * @returns Validation result with success status and optional error message
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  return { isValid: true };
}

/**
 * Validates that a value is not empty
 * @param value - The value to validate
 * @param fieldName - The name of the field being validated
 * @returns Validation result with success status and optional error message
 */
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

/**
 * Validates multiple validation results
 * @param results - Array of validation results to check
 * @returns Combined validation result with all error messages
 */
export function validateMultiple(
  results: ValidationResult[]
): ValidationResult {
  const errors = results
    .filter(result => !result.isValid)
    .map(result => result.error)
    .filter(Boolean);

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join(', '),
    };
  }

  return { isValid: true };
}
