const apiUrls = {
  // ✅ FIXED: Use proper Vite env var syntax
  base_url: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",

  // Template endpoints
  createTemplate: "/templates",
  getTemplatesByWorkId: "/templates/work/",
  getTemplateById: "/templates/",
  updateTemplate: "/templates/",
  deleteTemplate: "/templates/",
  getEmailHtml: "/templates/", // Will append /:id/email-html
  getPublicTemplates: "/templates/public",

  // Cloudinary image upload endpoint
  uploadImage: "/templates/upload-image",
};

export default apiUrls;
