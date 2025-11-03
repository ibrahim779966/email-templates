/**
 * Export all interceptors
 */

export * from "./requestInterceptor";
export * from "./responseInterceptor";
export * from "./errorInterceptor";

import {
  requestInterceptor,
  requestErrorInterceptor,
} from "./requestInterceptor";

import { responseSuccessInterceptor } from "./responseInterceptor";

import { errorInterceptor } from "./errorInterceptor";

export default {
  request: requestInterceptor,
  requestError: requestErrorInterceptor,
  response: responseSuccessInterceptor,
  responseError: errorInterceptor,
};
