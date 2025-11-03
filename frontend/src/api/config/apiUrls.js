/**
 * API URLs Configuration
 * All backend endpoints are defined here
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
  },

  // Cloudinary configuration
  cloudinary: {
    cloud_name: import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dhlex64es",
    upload_preset:
      import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "newsletter",
    image_upload_url: "https://api.cloudinary.com/v1_1/dhlex64es/image/upload",
    raw_upload_url: "https://api.cloudinary.com/v1_1/dhlex64es/raw/upload",
  },

  // User endpoints
  user: {
    profile: "/user/profile",
    updateProfile: "/user/profile",
    changePassword: "/user/change-password",
  },
};

export default apiUrls;
