// ============================================
// FILE: controllers/template.controller.js
// PURPOSE: Template Controller with Cloudinary Integration
// ============================================

const templateUseCase = require("../usecases/template.usecase");
const { CreateTemplateDto, UpdateTemplateDto } = require("../dto/template.dto");
const { InternalServerError } = require("../utils/errors");
const {
  processElementsImages,
  uploadBase64ToCloudinary,
} = require("../config/cloudinary.config");

class TemplateController {
  /**
   * Create a new template
   * @route POST /api/v1/templates
   */
  async createTemplate(req, res, next) {
    try {
      const { name, elements, globalSettings, previewImageUrl, category } =
        req.body;
      const workId = req.user?.workId || req.body.workId; // Support both auth methods

      if (!name) {
        return res.status(400).json({
          message: "Missing required field: name",
        });
      }

      // Process elements and upload images to Cloudinary
      let processedElements = elements || [];
      if (processedElements.length > 0) {
        processedElements = await processElementsImages(processedElements);
      }

      // Process preview image if it's base64
      let processedPreviewUrl = previewImageUrl || "";
      if (
        processedPreviewUrl &&
        processedPreviewUrl.startsWith("data:image/")
      ) {
        processedPreviewUrl = await uploadBase64ToCloudinary(
          processedPreviewUrl
        );
      }

      const createDto = new CreateTemplateDto(
        name,
        workId,
        processedElements,
        globalSettings || {},
        processedPreviewUrl,
        category || "Other" // provide default if needed
      );

      const template = await templateUseCase.createTemplate(createDto);

      res.status(201).json({
        message: "Template created successfully.",
        data: template,
      });
    } catch (error) {
      next(new InternalServerError("Failed to create template.", error));
    }
  }

  /**
   * Get all templates by work ID
   * @route GET /api/v1/templates/work/:workId
   */
  async getTemplatesByWorkId(req, res, next) {
    try {
      const workId = req.user?.workId || req.params.workId;
      const templates = await templateUseCase.getTemplatesByWorkId(workId);

      res.status(200).json({
        message: `Found ${templates.length} templates.`,
        data: templates,
      });
    } catch (error) {
      next(new InternalServerError("Failed to fetch templates.", error));
    }
  }

  /**
   * Get a single template by ID
   * @route GET /api/v1/templates/:id
   */
  async getTemplateById(req, res, next) {
    try {
      const { id } = req.params;
      const template = await templateUseCase.getTemplateById(id);

      res.status(200).json({
        message: "Template retrieved successfully.",
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get all public templates
   * @route GET /api/v1/templates/public
   */
  async getPublicTemplates(req, res, next) {
    try {
      const templates = await templateUseCase.getPublicTemplates();
      res.status(200).json({
        message: `Found ${templates.length} public templates.`,
        data: templates,
      });
    } catch (error) {
      next(new InternalServerError("Failed to fetch public templates.", error));
    }
  }

  /**
   * Update a template
   * @route PUT /api/v1/templates/:id
   */
  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Process elements if provided
      if (updateData.elements && Array.isArray(updateData.elements)) {
        updateData.elements = await processElementsImages(updateData.elements);
      }

      // Process preview image if it's base64
      if (
        updateData.previewImageUrl &&
        updateData.previewImageUrl.startsWith("data:image/")
      ) {
        updateData.previewImageUrl = await uploadBase64ToCloudinary(
          updateData.previewImageUrl
        );
      }

      const updates = new UpdateTemplateDto(updateData);

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          message: "Must provide at least one field to update.",
        });
      }

      const updatedTemplate = await templateUseCase.updateTemplate(id, updates);

      res.status(200).json({
        message: "Template updated successfully.",
        data: updatedTemplate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a template
   * @route DELETE /api/v1/templates/:id
   */
  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const result = await templateUseCase.deleteTemplate(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate email HTML from template
   * @route GET /api/v1/templates/:id/email-html
   */
  async getEmailHtml(req, res, next) {
    try {
      const { id } = req.params;
      const html = await templateUseCase.generateEmailHtml(id);

      res.status(200).json({
        message: "Email HTML generated successfully.",
        data: { html },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload single image to Cloudinary
   * @route POST /api/v1/templates/upload-image
   */
  async uploadImage(req, res, next) {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({
          message: "Image data is required",
        });
      }

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadBase64ToCloudinary(image);

      res.status(200).json({
        message: "Image uploaded successfully.",
        data: { url: cloudinaryUrl },
      });
    } catch (error) {
      next(new InternalServerError("Failed to upload image.", error));
    }
  }
}

module.exports = new TemplateController();
