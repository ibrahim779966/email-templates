/**
 * API URLs Configuration - UPDATED FOR AZURE
 * All backend endpoints are defined here
 * 
 * REPLACE YOUR EXISTING apiUrls.js WITH THIS FILE
 */

const apiUrls = {
  // Base URL - change this for different environments
  base_url:
    import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1",

  // Auth endpoints
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh-token",
    verifyToken: "/auth/verify",
  },

  // Template endpoints
  templates: {
    getAll: "/templates/work/", // + workId
    getById: "/templates/", // + templateId
    create: "/templates",
    update: "/templates/", // + templateId
    delete: "/templates/", // + templateId
    generateHTML: "/templates/generate-html/", // + templateId (optional endpoint)
  },

  // Azure Blob Storage endpoints (REPLACES cloudinary config)
  azure: {
    // Backend endpoints for Azure operations
    generateSASToken: "/azure/generate-sas-token",
    deleteBlob: "/azure/delete-blob",
    generatePublicUrl: "/azure/generate-public-url",
    
    // Azure Storage configuration (from environment variables)
    account_name: import.meta.env.REACT_APP_AZURE_STORAGE_ACCOUNT || "",
    container_name: import.meta.env.REACT_APP_AZURE_CONTAINER_NAME || "templates",
  },

  // User endpoints
  user: {
    profile: "/user/profile",
    updateProfile: "/user/profile",
    changePassword: "/user/change-password",
  },
};

export default apiUrls;
