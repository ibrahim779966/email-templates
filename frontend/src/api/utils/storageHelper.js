import { STORAGE_KEYS, DEFAULT_WORK_ID } from "../../constants/storageKeys";

/**
 * Get the selected workspace ID
 * @returns {string} The workspace ID
 */
export const getWorkspaceId = () => {
  try {
    return (
      localStorage.getItem(STORAGE_KEYS.SELECTED_WORKSPACE) || DEFAULT_WORK_ID
    );
  } catch (error) {
    console.error("Error getting workspace ID:", error);
    return DEFAULT_WORK_ID;
  }
};

/**
 * Set the selected workspace ID
 * @param {string} workspaceId - The workspace ID to store
 */
export const setWorkspaceId = (workspaceId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_WORKSPACE, workspaceId);
  } catch (error) {
    console.error("Error setting workspace ID:", error);
  }
};

/**
 * Get the work ID (for now returns default, will be updated with authentication)
 * @returns {string} The work ID
 */
export const getWorkId = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.WORK_ID) || DEFAULT_WORK_ID;
  } catch (error) {
    console.error("Error getting work ID:", error);
    return DEFAULT_WORK_ID;
  }
};

/**
 * Set the work ID
 * @param {string} workId - The work ID to store
 */
export const setWorkId = (workId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORK_ID, workId);
  } catch (error) {
    console.error("Error setting work ID:", error);
  }
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
