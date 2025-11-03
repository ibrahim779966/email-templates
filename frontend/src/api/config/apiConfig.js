/**
 * Axios configuration and default settings
 */

export const apiConfig = {
  // Request timeout in milliseconds
  timeout: 30000,

  // Default headers for all requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Enable credentials (cookies) for cross-origin requests
  withCredentials: false,

  // Validate status codes
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
  HTML: "text/html",
  XML: "application/xml",
};

export default apiConfig;
