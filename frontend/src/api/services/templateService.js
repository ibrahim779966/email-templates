/**
 * Template Service
 * All template-related API calls with proper error handling
 * ✅ UPDATED: Now uses Azure Blob Storage fields instead of Cloudinary
 */

import request, { apiRequest } from "../xhr";
import apiUrls from "../config/apiUrls";
import { getWorkId } from "../utils/storageHelper";
import { buildUrl, parseApiError } from "../utils/requestHelper";

/**
 * Get all templates for the current work ID
 * ✅ NO CHANGES - Database query unchanged
 */
const getTemplatesByWorkId = async () => {
  try {
    const workId = getWorkId();
    const url = `${apiUrls.templates.getAll}${workId}`;

    const response = await apiRequest.get(url, {
      secure: false, // Set to true when auth is implemented
    });

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to fetch templates:", parsedError);
    throw parsedError;
  }
};

/**
 * Get a single template by ID
 * ✅ CHANGED: Now checks for dataUrl instead of cloudinaryUrl
 */
const getTemplateById = async (templateId) => {
  try {
    const response = await apiRequest.get(
      `${apiUrls.templates.getById}${templateId}`
    );

    // Handle nested response structure
    const template = response.data?.data || response.data || response;

    // ✅ CHANGED: Check for dataUrl instead of cloudinaryUrl
    if (!template || !template.dataUrl) {
      throw new Error("Template not found or missing dataUrl");
    }

    return template;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new template
 * ✅ CHANGED: Now uses Azure fields (dataUrl, htmlUrl, blob names)
 */
const createTemplate = async (templateData) => {
  try {
    // ✅ CHANGED: Validate Azure fields instead of cloudinaryUrl
    if (!templateData.name || !templateData.dataUrl) {
      throw new Error("Template name and dataUrl are required");
    }

    const workId = getWorkId();

    // ✅ CHANGED: New payload structure with Azure fields
    const payload = {
      name: templateData.name,
      dataUrl: templateData.dataUrl,           // ✅ NEW: Azure JSON URL
      htmlUrl: templateData.htmlUrl,           // ✅ NEW: Azure HTML URL
      dataBlobName: templateData.dataBlobName, // ✅ NEW: Blob name for deletion
      htmlBlobName: templateData.htmlBlobName, // ✅ NEW: Blob name for deletion
      workId: workId,
      previewImageUrl: templateData.previewImageUrl,
      thumbnailBlobName: templateData.thumbnailBlobName, // ✅ NEW: Thumbnail blob name
    };

    const response = await apiRequest.post(apiUrls.templates.create, payload, {
      secure: false,
    });

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to create template:", parsedError);
    throw parsedError;
  }
};

/**
 * Update an existing template
 * ✅ NO CHANGES - Accepts any updates object
 */
const updateTemplate = async (templateId, updates) => {
  try {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    const url = `${apiUrls.templates.update}${templateId}`;

    const response = await apiRequest.put(url, updates, {
      secure: false,
    });

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to update template:", parsedError);
    throw parsedError;
  }
};

/**
 * Delete a template
 * ✅ NO CHANGES - Backend handles Azure blob deletion
 */
const deleteTemplate = async (templateId) => {
  try {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    const url = `${apiUrls.templates.delete}${templateId}`;

    const response = await apiRequest.delete(url, {
      secure: false,
    });

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to delete template:", parsedError);
    throw parsedError;
  }
};

/**
 * Bulk delete templates
 * ✅ NO CHANGES - Backend handles Azure blob deletion
 */
const bulkDeleteTemplates = async (templateIds) => {
  try {
    if (!Array.isArray(templateIds) || templateIds.length === 0) {
      throw new Error("Template IDs array is required");
    }

    const response = await apiRequest.post(
      "/templates/bulk-delete",
      {
        templateIds,
      },
      {
        secure: false,
      }
    );

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to bulk delete templates:", parsedError);
    throw parsedError;
  }
};

/**
 * Duplicate a template
 * ✅ NO CHANGES - Backend handles duplication with Azure
 */
const duplicateTemplate = async (templateId) => {
  try {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    const response = await apiRequest.post(
      `/templates/${templateId}/duplicate`,
      {},
      {
        secure: false,
      }
    );

    return response.data || response;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Failed to duplicate template:", parsedError);
    throw parsedError;
  }
};

const templateService = {
  getTemplatesByWorkId,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  bulkDeleteTemplates,
  duplicateTemplate,
};

export { templateService };
export default templateService;