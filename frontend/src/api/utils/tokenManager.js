import { STORAGE_KEYS } from "../../constants/storageKeys";

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OAUTH_TOKEN);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The token to store
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.OAUTH_TOKEN, token);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OAUTH_TOKEN);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

/**
 * Check if a token exists
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasToken = () => {
  return !!getToken();
};
