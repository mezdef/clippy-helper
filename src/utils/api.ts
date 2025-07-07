import { API_CONFIG, ERROR_MESSAGES } from '@/constants';

/**
 * Request configuration for all API calls - standardizes timeout and headers
 * @interface ApiRequestOptions
 */
export interface ApiRequestOptions {
  /** HTTP method for the request */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body data */
  body?: unknown;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Core API request handler with timeout protection and consistent error handling
 * @param url - The API endpoint URL
 * @param options - Request configuration options
 * @returns Promise resolving to parsed response data
 * @throws Error if request fails or response is not ok
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_CONFIG.DEFAULT_TIMEOUT,
  } = options;

  const requestHeaders = {
    'Content-Type': API_CONFIG.JSON_CONTENT_TYPE,
    ...headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    /**
     * Implement timeout protection to prevent hanging requests
     */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      /**
       * Try to extract error details from response, fallback to HTTP status
       */
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }
}

/**
 * GET helper - for data retrieval operations
 * @param url - The API endpoint URL
 * @param options - Additional request options
 * @returns Promise resolving to parsed response data
 */
export async function get<T = unknown>(
  url: string,
  options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * POST helper - for creating new resources
 * @param url - The API endpoint URL
 * @param data - Request body data
 * @param options - Additional request options
 * @returns Promise resolving to parsed response data
 */
export async function post<T = unknown>(
  url: string,
  data?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'POST', body: data });
}

/**
 * PUT helper - for full resource updates
 * @param url - The API endpoint URL
 * @param data - Request body data
 * @param options - Additional request options
 * @returns Promise resolving to parsed response data
 */
export async function put<T = unknown>(
  url: string,
  data?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'PUT', body: data });
}

/**
 * DELETE helper - for resource removal
 * @param url - The API endpoint URL
 * @param options - Additional request options
 * @returns Promise resolving to parsed response data
 */
export async function del<T = unknown>(
  url: string,
  options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

/**
 * PATCH helper - for partial resource updates
 * @param url - The API endpoint URL
 * @param data - Request body data
 * @param options - Additional request options
 * @returns Promise resolving to parsed response data
 */
export async function patch<T = unknown>(
  url: string,
  data?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'PATCH', body: data });
}

/**
 * Standardize error handling across the application
 * @param error - The error object
 * @returns Formatted error message
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return ERROR_MESSAGES.API_ERROR;
}

/**
 * Quick success check for API responses
 * @param response - The API response
 * @returns Boolean indicating success
 */
export function isSuccessResponse(response: { error?: string }): boolean {
  return !response.error;
}

/**
 * Extract error message from various API response formats
 * @param response - The API response
 * @returns Error message or null if no error
 */
export function extractErrorMessage(response: {
  error?: string;
  message?: string;
}): string | null {
  return response.error || response.message || null;
}
