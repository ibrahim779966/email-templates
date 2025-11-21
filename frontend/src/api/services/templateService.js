import request from "../xhr";
import apiUrls from "../config/apiUrls";
import { getWorkspaceId } from "../utils/storageHelper";

const templateService = {
  async getTemplatesByWorkId() {
    const workspaceId = getWorkspaceId();
    return request({
      method: "get",
      url: `${apiUrls.getTemplatesByWorkId}${workspaceId}`,
      secure: true,
    });
  },
  async getPublicTemplates() {
    return request({
      method: "get",
      url: apiUrls.getPublicTemplates,
      secure: false,
    });
  },

  async getTemplateById(templateId) {
    return request({
      method: "get",
      url: `${apiUrls.getTemplateById}${templateId}`,
      secure: true,
    });
  },

  async createTemplate(templateData) {
    const workspaceId = getWorkspaceId();
    return request({
      method: "post",
      url: apiUrls.createTemplate,
      data: {
        name: templateData.name,
        workId: workspaceId,
        elements: templateData.elements || [],
        globalSettings: templateData.globalSettings || {},
        previewImageUrl: templateData.previewImageUrl || "",
      },
      secure: true,
    });
  },

  async updateTemplate(templateId, updates) {
    return request({
      method: "put",
      url: `${apiUrls.updateTemplate}${templateId}`,
      data: updates,
      secure: true,
    });
  },

  async deleteTemplate(templateId) {
    return request({
      method: "delete",
      url: `${apiUrls.deleteTemplate}${templateId}`,
      secure: true,
    });
  },

  async getEmailHtml(templateId) {
    return request({
      method: "get",
      url: `${apiUrls.getEmailHtml}${templateId}`,
      secure: true,
    });
  },

  /// ✅ IMPROVED: Upload image to Cloudinary with better error handling
  async uploadImage(base64Image) {
    try {
      const response = await request({
        method: "post",
        url: apiUrls.uploadImage,
        data: {
          image: base64Image,
        },
        secure: true,
      });

      console.log("templateService.uploadImage response:", response);

      // Return the response data
      return response.data || response;
    } catch (error) {
      console.error("templateService.uploadImage error:", error);
      throw error;
    }
  },
};

export { templateService };
