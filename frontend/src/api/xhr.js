/**
 * Enhanced XHR Module with Interceptors, Retry Logic, and Error Handling
 */

import axios from "axios";
import apiUrls from "./config/apiUrls";
import { apiConfig } from "./config/apiConfig";
import { RETRY_CONFIG } from "../constants/apiConstants";

// Import interceptors
import {
  requestInterceptor,
  requestErrorInterceptor,
} from "./interceptors/requestInterceptor";

import { responseSuccessInterceptor } from "./interceptors/responseInterceptor";

import { errorInterceptor, shouldRetry } from "./interceptors/errorInterceptor";

/**
 * Create axios instance with default config
 */
const axiosInstance = axios.create({
  baseURL: apiUrls.base_url,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
  withCredentials: apiConfig.withCredentials,
});

/**
 * Setup request interceptors
 */
axiosInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

/**
 * Setup response interceptors
 */
axiosInstance.interceptors.response.use(
  responseSuccessInterceptor,
  errorInterceptor
);

/**
 * Delay helper for retry logic
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Enhanced request function with retry logic
 */
async function request(httpOptions) {
  const {
    url,
    method = "GET",
    data,
    params,
    headers = {},
    secure = true,
    files,
    csv = false,
    retry = true,
    maxRetries = RETRY_CONFIG.MAX_RETRIES,
    retryDelay = RETRY_CONFIG.RETRY_DELAY,
    ...restOptions
  } = httpOptions;

  // Build request config
  const config = {
    url,
    method: method.toUpperCase(),
    data,
    params,
    headers: {
      ...headers,
    },
    secure,
    files,
    csv,
    ...restOptions,
  };

  // Attempt request with retry logic
  let lastError = null;
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const response = await axiosInstance(config);
      return response;
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (
        retry &&
        retryCount < maxRetries &&
        shouldRetry(error, retryCount, maxRetries)
      ) {
        retryCount++;
        const waitTime = retryDelay * Math.pow(2, retryCount - 1); // Exponential backoff

        console.warn(
          `🔄 Retrying request (${retryCount}/${maxRetries}) after ${waitTime}ms...`,
          config.url
        );

        await delay(waitTime);
        continue;
      }

      // No more retries, throw error
      throw error;
    }
  }

  // If we get here, all retries failed
  throw lastError;
}

/**
 * Convenience methods for different HTTP verbs
 */
export const apiRequest = {
  /**
   * GET request
   */
  get: (url, options = {}) => {
    return request({
      url,
      method: "GET",
      ...options,
    });
  },

  /**
   * POST request
   */
  post: (url, data, options = {}) => {
    return request({
      url,
      method: "POST",
      data,
      ...options,
    });
  },

  /**
   * PUT request
   */
  put: (url, data, options = {}) => {
    return request({
      url,
      method: "PUT",
      data,
      ...options,
    });
  },

  /**
   * PATCH request
   */
  patch: (url, data, options = {}) => {
    return request({
      url,
      method: "PATCH",
      data,
      ...options,
    });
  },

  /**
   * DELETE request
   */
  delete: (url, options = {}) => {
    return request({
      url,
      method: "DELETE",
      ...options,
    });
  },

  /**
   * Upload file(s)
   */
  upload: (url, files, data = {}, options = {}) => {
    return request({
      url,
      method: "POST",
      files,
      data,
      ...options,
    });
  },
};

/**
 * Get axios instance (for advanced use cases)
 */
export const getAxiosInstance = () => axiosInstance;

/**
 * Default export
 */
export default request;
