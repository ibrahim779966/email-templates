/**
 * Template Service
 * All template-related API calls with proper error handling
 */

import request, { apiRequest } from "../xhr";
import apiUrls from "../config/apiUrls";
import { getWorkId } from "../utils/storageHelper";
import { buildUrl, parseApiError } from "../utils/requestHelper";

/**
 * Get all templates for the current work ID
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
 */
const getTemplateById = async (templateId) => {
  try {
    const response = await apiRequest.get(
      `${apiUrls.templates.getById}${templateId}`
    );

    // Handle nested response structure
    const template = response.data?.data || response.data || response;

    if (!template || !template.cloudinaryUrl) {
      throw new Error("Template not found or missing cloudinaryUrl");
    }

    return template;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new template
 */
const createTemplate = async (templateData) => {
  try {
    if (!templateData.name || !templateData.cloudinaryUrl) {
      throw new Error("Template name and cloudinaryUrl are required");
    }

    const workId = getWorkId();

    const payload = {
      name: templateData.name,
      cloudinaryUrl: templateData.cloudinaryUrl,
      workId: workId,
      previewImageUrl: templateData.previewImageUrl,
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
