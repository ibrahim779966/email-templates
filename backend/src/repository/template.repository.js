// ============================================
// FILE: repository/template.repository.js
// PURPOSE: Data access layer - handles all database operations
// RESPONSIBILITIES: Direct interaction with database through Mongoose model
// ============================================

const Template = require("../model/template.model");

// const Template = require('./template.model');

class TemplateRepository {
  /**
   * Create a new template in the database
   * @param {Object} templateData - Template data to be saved
   * @returns {Promise<Object>} - Saved template document
   */
  async create(templateData) {
    const newTemplate = new Template(templateData);
    return await newTemplate.save();
  }

  /**
   * Find a template by its ID
   * @param {String} templateId - Template ID
   * @returns {Promise<Object|null>} - Template document or null
   */
  async findById(templateId) {
    return await Template.findById(templateId);
  }

  /**
   * Find all templates by work ID
   * @param {String} workId - Work ID to filter templates
   * @returns {Promise<Array>} - Array of template documents
   */
  async findByWorkId(workId) {
    return await Template.find({ workId }).sort({ updatedAt: -1 });
  }
  async getPublicTemplates() {
    return await Template.find({ isPublic: true }).sort({ updatedAt: -1 });
  }

  /**
   * Update a template by ID
   * @param {String} templateId - Template ID
   * @param {Object} updateFields - Fields to update
   * @returns {Promise<Object|null>} - Updated template or null
   */
  async updateById(templateId, updateFields) {
    return await Template.findByIdAndUpdate(
      templateId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete a template by ID
   * @param {String} templateId - Template ID
   * @returns {Promise<Object|null>} - Deleted template or null
   */
  async deleteById(templateId) {
    return await Template.findByIdAndDelete(templateId);
  }
}

module.exports = new TemplateRepository();
