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
  uploadImage: "/azure/upload-image",       //  NEW
  uploadData: "/azure/upload-data",         //  NEW
  fetchData: "/azure/fetch-data",           //  NEW
  deleteBlob: "/azure/delete-blob",         // Keep this
  listBlobs: "/azure/list-blobs",           //  NEW
},

  // User endpoints
  user: {
    profile: "/user/profile",
    updateProfile: "/user/profile",
    changePassword: "/user/change-password",
  },
};

export default apiUrls;
