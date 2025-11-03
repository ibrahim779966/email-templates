/**
 * Request Interceptor
 * Modifies outgoing requests before they are sent
 */

import { getToken, hasToken } from "../utils/tokenManager";
import { getWorkId } from "../utils/storageHelper";
import { getCurrentEnvironment } from "../config/environments";

/**
 * Add authentication headers to request
 */
export const addAuthHeader = (config) => {
  const token = getToken();

  if (token && config.secure !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Add common headers to all requests
 */
export const addCommonHeaders = (config) => {
  // Add work ID if available
  const workId = getWorkId();
  if (workId) {
    config.headers["X-Work-ID"] = workId;
  }

  // Add request timestamp
  config.headers["X-Request-Time"] = new Date().toISOString();

  // Add environment info
  config.headers["X-Environment"] = getCurrentEnvironment();

  return config;
};

/**
 * Handle request logging in development
 */
export const logRequest = (config) => {
  if (process.env.NODE_ENV === "development") {
    console.group(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log("Headers:", config.headers);
    console.log("Data:", config.data);
    console.log("Params:", config.params);
    console.groupEnd();
  }
  return config;
};

/**
 * Transform request data if needed
 */
export const transformRequestData = (config) => {
  // Handle FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  }

  // Handle file uploads
  if (config.files) {
    const formData = new FormData();

    // Append files
    if (Array.isArray(config.files)) {
      config.files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    } else {
      formData.append("file", config.files);
    }

    // Append other data
    if (config.data) {
      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data[key]);
      });
    }

    config.data = formData;
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
};

/**
 * Main request interceptor
 */
export const requestInterceptor = (config) => {
  // Chain all request transformations
  config = addAuthHeader(config);
  config = addCommonHeaders(config);
  config = transformRequestData(config);
  config = logRequest(config);

  return config;
};

/**
 * Request error interceptor
 */
export const requestErrorInterceptor = (error) => {
  console.error("❌ Request Error:", error);
  return Promise.reject(error);
};

export default {
  requestInterceptor,
  requestErrorInterceptor,
};
