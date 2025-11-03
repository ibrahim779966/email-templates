/**
 * API Constants - HTTP status codes, methods, error codes
 */

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const CONTENT_TYPES = {
  JSON: "application/json",
  MULTIPART: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
  CSV: "text/csv",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds

export default {
  HTTP_STATUS,
  API_METHODS,
  CONTENT_TYPES,
  ERROR_MESSAGES,
  RETRY_CONFIG,
  REQUEST_TIMEOUT,
};

export const CLOUDINARY_CONSTANTS = {
  RESOURCE_TYPES: {
    IMAGE: "image",
    RAW: "raw",
    VIDEO: "video",
    AUTO: "auto",
  },
};
