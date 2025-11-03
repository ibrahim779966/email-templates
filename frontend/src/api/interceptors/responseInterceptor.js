/**
 * Response Interceptor
 * Handles API responses before they reach the application
 */

import { HTTP_STATUS } from "../../constants/apiConstants";

/**
 * Handle successful responses
 */
export const responseSuccessInterceptor = (response) => {
  // Log response in development
  if (process.env.NODE_ENV === "development") {
    console.group(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("Headers:", response.headers);
    console.groupEnd();
  }

  // Extract data from response
  // Most APIs return data in response.data
  return response.data ? response : response;
};

/**
 * Transform response data structure
 */
export const transformResponseData = (response) => {
  // If response has a standard structure, normalize it
  if (response.data) {
    return {
      data: response.data.data || response.data,
      message: response.data.message || "Success",
      status: response.status,
      success: true,
    };
  }

  return response;
};

export default {
  responseSuccessInterceptor,
  transformResponseData,
};
