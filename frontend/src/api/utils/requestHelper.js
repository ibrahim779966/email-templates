/**
 * Request Helper Utilities
 * Common functions for building and handling requests
 */

import { CONTENT_TYPES } from "../../constants/apiConstants";

/**
 * Build query string from params object
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const queryString = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

  return queryString ? `?${queryString}` : "";
};

/**
 * Build URL with path parameters
 */
export const buildUrl = (baseUrl, pathParams = {}) => {
  let url = baseUrl;

  Object.keys(pathParams).forEach((key) => {
    const value = pathParams[key];
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });

  return url;
};

/**
 * Create FormData from object
 */
export const createFormData = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined) {
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
      return;
    }

    // Handle files
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    // Handle objects (stringify)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // Handle primitives
    formData.append(key, value);
  });

  return formData;
};

/**
 * Parse error from API response
 */
export const parseApiError = (error) => {
  return {
    message: error.message || "An error occurred",
    status: error.status || 0,
    statusText: error.statusText || "Unknown",
    errors: error.errors || null,
    data: error.data || null,
  };
};

/**
 * Check if response is successful
 */
export const isSuccessResponse = (response) => {
  return response && response.status >= 200 && response.status < 300;
};

/**
 * Extract data from API response
 */
export const extractResponseData = (response) => {
  if (!response) return null;

  // If response has data property
  if (response.data !== undefined) {
    return response.data;
  }

  // Return response as is
  return response;
};

/**
 * Merge request options with defaults
 */
export const mergeRequestOptions = (defaultOptions, options) => {
  return {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
    params: {
      ...defaultOptions.params,
      ...options.params,
    },
  };
};

/**
 * Create request config for file download
 */
export const createDownloadConfig = (options = {}) => {
  return {
    ...options,
    responseType: "blob",
    headers: {
      ...options.headers,
      Accept: options.accept || "*/*",
    },
  };
};

/**
 * Download file from blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes || allowedTypes.length === 0) {
    return true;
  }

  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const baseType = type.split("/");
      return file.type.startsWith(baseType + "/");
    }
    return file.type === type;
  });
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize) => {
  if (!maxSize) return true;
  return file.size <= maxSize;
};

export default {
  buildQueryString,
  buildUrl,
  createFormData,
  parseApiError,
  isSuccessResponse,
  extractResponseData,
  mergeRequestOptions,
  createDownloadConfig,
  downloadBlob,
  formatFileSize,
  validateFileType,
  validateFileSize,
};
