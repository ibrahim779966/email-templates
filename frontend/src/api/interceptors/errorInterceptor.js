/**
 * Error Interceptor
 * Handles API errors and provides consistent error responses
 */

import { HTTP_STATUS, ERROR_MESSAGES } from "../../constants/apiConstants";
import { removeToken } from "../utils/tokenManager";
import { clearStorage } from "../utils/storageHelper";

/**
 * Parse error response
 */
const parseErrorResponse = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      message: error.response.data?.message || error.message,
      errors: error.response.data?.errors || null,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      statusText: "Network Error",
      message: ERROR_MESSAGES.NETWORK_ERROR,
      isNetworkError: true,
    };
  } else {
    // Error in request configuration
    return {
      status: 0,
      statusText: "Request Error",
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      isConfigError: true,
    };
  }
};

/**
 * Handle authentication errors
 */
const handleAuthError = (error) => {
  const status = error.response?.status;

  if (status === HTTP_STATUS.UNAUTHORIZED) {
    // Token expired or invalid
    console.warn("🔒 Authentication failed - clearing session");

    // Clear tokens and user data
    removeToken();
    clearStorage();

    // Optionally redirect to login
    // window.location.href = '/login';

    return {
      ...parseErrorResponse(error),
      message: ERROR_MESSAGES.UNAUTHORIZED,
      requiresLogin: true,
    };
  }

  if (status === HTTP_STATUS.FORBIDDEN) {
    return {
      ...parseErrorResponse(error),
      message: ERROR_MESSAGES.FORBIDDEN,
    };
  }

  return null;
};

/**
 * Handle network errors
 */
const handleNetworkError = (error) => {
  if (!error.response && error.message === "Network Error") {
    return {
      status: 0,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      isNetworkError: true,
    };
  }

  return null;
};

/**
 * Handle timeout errors
 */
const handleTimeoutError = (error) => {
  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return {
      status: HTTP_STATUS.GATEWAY_TIMEOUT,
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      isTimeout: true,
    };
  }

  return null;
};

/**
 * Handle specific HTTP status codes
 */
const handleHttpStatusError = (error) => {
  const status = error.response?.status;

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return {
        ...parseErrorResponse(error),
        message: error.response.data?.message || "Invalid request data",
      };

    case HTTP_STATUS.NOT_FOUND:
      return {
        ...parseErrorResponse(error),
        message: ERROR_MESSAGES.NOT_FOUND,
      };

    case HTTP_STATUS.CONFLICT:
      return {
        ...parseErrorResponse(error),
        message: error.response.data?.message || "Resource conflict",
      };

    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return {
        ...parseErrorResponse(error),
        message: "Too many requests. Please try again later.",
        retryAfter: error.response.headers["retry-after"],
      };

    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return {
        ...parseErrorResponse(error),
        message: ERROR_MESSAGES.SERVER_ERROR,
        isServerError: true,
      };

    default:
      return null;
  }
};

/**
 * Log error in development
 */
const logError = (error, parsedError) => {
  if (process.env.NODE_ENV === "development") {
    console.group("❌ API Error");
    console.error("Original Error:", error);
    console.error("Parsed Error:", parsedError);
    console.error("Request:", error.config);
    console.groupEnd();
  }
};

/**
 * Main error interceptor
 */
export const errorInterceptor = (error) => {
  // Try different error handlers in order
  let parsedError =
    handleAuthError(error) ||
    handleNetworkError(error) ||
    handleTimeoutError(error) ||
    handleHttpStatusError(error) ||
    parseErrorResponse(error);

  // Log error
  logError(error, parsedError);

  // Attach original error for debugging
  parsedError.originalError = error;

  // Return rejected promise with parsed error
  return Promise.reject(parsedError);
};

/**
 * Check if error should trigger retry
 */
export const shouldRetry = (error, retryCount, maxRetries) => {
  // Don't retry if max retries reached
  if (retryCount >= maxRetries) {
    return false;
  }

  // Retry on network errors
  if (error.isNetworkError) {
    return true;
  }

  // Retry on timeout
  if (error.isTimeout) {
    return true;
  }

  // Retry on specific status codes
  const retryStatusCodes = [408, 429, 500, 502, 503, 504];
  if (retryStatusCodes.includes(error.status)) {
    return true;
  }

  return false;
};

export default {
  errorInterceptor,
  shouldRetry,
};
