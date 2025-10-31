// ============================================
// FILE: usecases/template.usecase.js
// PURPOSE: Application logic layer - orchestrates business flows
// RESPONSIBILITIES: Coordinate between multiple services, handle complex workflows
// NOTE: Currently simple pass-through, but can be extended with complex business logic
// ============================================

const templateService = require('../services/template.service');

class TemplateUseCase {

  /**
   * Use case: Create a new template
   * @param {Object} createTemplateDto - DTO containing template data
   * @returns {Promise<Object>} - Created template
   * NOTE: Can add multi-service orchestration, transaction handling, etc.
   */
  async createTemplate(createTemplateDto) {
    // Additional business validation or multi-service orchestration can go here
    // Example: Check user permissions, validate quotas, send notifications, etc.
    const template = await templateService.createTemplate(createTemplateDto);
    return template;
  }

  /**
   * Use case: Get template by ID
   * @param {String} templateId - Template ID
   * @returns {Promise<Object>} - Template document
   */
  async getTemplateById(templateId) {
    return await templateService.getTemplateById(templateId);
  }

  /**
   * Use case: Get all templates for a work ID
   * @param {String} workId - Work ID
   * @returns {Promise<Array>} - Array of templates
   */
  async getTemplatesByWorkId(workId) {
    return await templateService.getTemplatesByWorkId(workId);
  }

  /**
   * Use case: Update a template
   * @param {String} templateId - Template ID
   * @param {Object} updateFields - Fields to update
   * @returns {Promise<Object>} - Updated template
   * NOTE: Can add additional business rules like audit logging, validation, etc.
   */
  async updateTemplate(templateId, updateFields) {
    // Can add additional business rules or validations here
    // Example: Check if user has permission to update, log changes, etc.
    return await templateService.updateTemplate(templateId, updateFields);
  }

  /**
   * Use case: Delete a template
   * @param {String} templateId - Template ID
   * @returns {Promise<Object>} - Success message
   * NOTE: Can add cleanup tasks like deleting related resources from Cloudinary
   */
  async deleteTemplate(templateId) {
    // Can add cleanup operations here
    // Example: Delete associated files from cloud storage, notify other services, etc.
    return await templateService.deleteTemplate(templateId);
  }
}

module.exports = new TemplateUseCase();
