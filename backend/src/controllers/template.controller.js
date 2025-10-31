// ============================================
// FILE: controllers/template.controller.js
// PURPOSE: Request handler - validates input and delegates to use cases
// RESPONSIBILITIES: Handle HTTP requests, validate input, format responses
// ============================================

const templateUseCase = require('../usecases/template.usecase');
const { CreateTemplateDto } = require('../dto/template.dto');
const { InternalServerError } = require('../utils/errors');

class TemplateController {

  /**
   * Create a new template
   * @route POST /api/v1/templates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createTemplate(req, res, next) {
    try {
      const { name, cloudinaryUrl, workId, previewImageUrl } = req.body;

      // Input validation
      if (!name || !cloudinaryUrl || !workId) {
        return res.status(400).json({
          message: 'Missing required fields: name, cloudinaryUrl, and workId.',
        });
      }

      // Create DTO for data transfer
      const createDto = new CreateTemplateDto(name, cloudinaryUrl, workId, previewImageUrl);
      
      // Delegate to use case
      const template = await templateUseCase.createTemplate(createDto);

      // Send success response
      res.status(201).json({
        message: 'Template created successfully.',
        data: template,
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(new InternalServerError('Failed to create template.', error));
    }
  }

  /**
   * Get all templates by work ID
   * @route GET /api/v1/templates/work/:workId
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getTemplatesByWorkId(req, res, next) {
    try {
      const { workId } = req.params;
      
      // Delegate to use case
      const templates = await templateUseCase.getTemplatesByWorkId(workId);

      // Send success response
      res.status(200).json({
        message: `Found ${templates.length} templates for work ID ${workId}.`,
        data: templates,
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(new InternalServerError('Failed to fetch templates.', error));
    }
  }

  /**
   * Get a single template by ID
   * @route GET /api/v1/templates/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getTemplateById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Delegate to use case
      const template = await templateUseCase.getTemplateById(id);

      // Send success response
      res.status(200).json({
        message: 'Template retrieved successfully.',
        data: template,
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Update a template
   * @route PUT /api/v1/templates/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      // Input validation
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ 
          message: 'Must provide at least one field to update.' 
        });
      }

      // Delegate to use case
      const updatedTemplate = await templateUseCase.updateTemplate(id, updateFields);

      // Send success response
      res.status(200).json({
        message: 'Template updated successfully.',
        data: updatedTemplate,
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Delete a template
   * @route DELETE /api/v1/templates/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;
      
      // Delegate to use case
      const result = await templateUseCase.deleteTemplate(id);

      // Send success response
      res.status(200).json(result);
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new TemplateController();