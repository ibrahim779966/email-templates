// ============================================
// FILE: services/template.service.js
// PURPOSE: Business logic layer - contains reusable business operations
// RESPONSIBILITIES: Handle business rules, validations, and error handling
// ============================================

const templateRepository = require('../repository/template.repository');
const { TemplateNotFoundError } = require('../utils/errors');

class TemplateService {

  /**
   * Create a new template
   * @param {Object} templateData - Data for creating template
   * @returns {Promise<Object>} - Created template
   */
  async createTemplate(templateData) {
    return await templateRepository.create(templateData);
  }

  /**
   * Get a single template by ID
   * @param {String} templateId - Template ID
   * @returns {Promise<Object>} - Template document
   * @throws {TemplateNotFoundError} - If template not found
   */
  async getTemplateById(templateId) {
    const template = await templateRepository.findById(templateId);
    
    // Business rule: Throw error if template doesn't exist
    if (!template) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found.`);
    }
    
    return template;
  }

  /**
   * Get all templates by work ID
   * @param {String} workId - Work ID to filter templates
   * @returns {Promise<Array>} - Array of templates
   */
  async getTemplatesByWorkId(workId) {
    return await templateRepository.findByWorkId(workId);
  }

  /**
   * Update an existing template
   * @param {String} templateId - Template ID
   * @param {Object} updateFields - Fields to update
   * @returns {Promise<Object>} - Updated template
   * @throws {TemplateNotFoundError} - If template not found
   */
  async updateTemplate(templateId, updateFields) {
    const updatedTemplate = await templateRepository.updateById(
      templateId,
      updateFields
    );

    // Business rule: Throw error if template doesn't exist
    if (!updatedTemplate) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found for update.`);
    }
    
    return updatedTemplate;
  }

  /**
   * Delete a template
   * @param {String} templateId - Template ID
   * @returns {Promise<Object>} - Success message
   * @throws {TemplateNotFoundError} - If template not found
   */
  async deleteTemplate(templateId) {
    const deletedTemplate = await templateRepository.deleteById(templateId);

    // Business rule: Throw error if template doesn't exist
    if (!deletedTemplate) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found for deletion.`);
    }
    
    return { message: 'Template successfully deleted.' };
  }
}

module.exports = new TemplateService();

