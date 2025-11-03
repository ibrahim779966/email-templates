/**
 * Local Storage Keys
 */

export const STORAGE_KEYS = {
  // Authentication
  OAUTH_TOKEN: "oauthToken",
  REFRESH_TOKEN: "refreshToken",
  TOKEN_EXPIRY: "tokenExpiry",

  // User Data
  USER_ID: "userId",
  USER_EMAIL: "userEmail",
  USER_NAME: "userName",

  // Workspace
  SELECTED_WORKSPACE: "selectedWorkspace",
  WORK_ID: "workId",

  // App State
  THEME: "theme",
  LANGUAGE: "language",

  // Cache
  API_CACHE: "apiCache",
  LAST_SYNC: "lastSync",
};

// Default values
export const DEFAULT_VALUES = {
  WORK_ID: "USER-12345",
  THEME: "light",
  LANGUAGE: "en",
};

export const DEFAULT_WORK_ID = "USER-12345";

export default STORAGE_KEYS;
