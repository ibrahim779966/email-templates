const templateService = require('../services/template.service');
const { CreateTemplateDto } = require('../dto/template.dto');
const { InternalServerError } = require('../utils/errors'); 

class TemplateController {
  
  async createTemplate(req, res, next) {
    try {
      const { name, cloudinaryUrl, workId, previewImageUrl } = req.body;

      if (!name || !cloudinaryUrl || !workId) {
        return res.status(400).json({
          message: 'Missing required fields: name, cloudinaryUrl, and workId.',
        });
      }

      const createDto = new CreateTemplateDto(name, cloudinaryUrl, workId, previewImageUrl);
      const template = await templateService.createTemplate(createDto);
      
      res.status(201).json({
        message: 'Template created successfully.',
        data: template,
      });
    } catch (error) {
      next(new InternalServerError('Failed to create template.', error));
    }
  }

  async getTemplatesByWorkId(req, res, next) {
    try {
      const { workId } = req.params;
      const templates = await templateService.getTemplatesByWorkId(workId);
      
      res.status(200).json({
        message: `Found ${templates.length} templates for work ID ${workId}.`,
        data: templates,
      });
    } catch (error) {
      next(new InternalServerError('Failed to fetch templates.', error));
    }
  }

  async getTemplateById(req, res, next) {
    try {
      const { id } = req.params;
      const template = await templateService.getTemplateById(id);
      
      res.status(200).json({
        message: 'Template retrieved successfully.',
        data: template,
      });
    } catch (error) {
      next(error); 
    }
  }

  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const updateFields = req.body; 

      if (Object.keys(updateFields).length === 0) {
         return res.status(400).json({ message: 'Must provide at least one field to update.' });
      }

      const updatedTemplate = await templateService.updateTemplate(id, updateFields);

      res.status(200).json({
        message: 'Template updated successfully.',
        data: updatedTemplate,
      });
    } catch (error) {
      next(error); 
    }
  }

  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const result = await templateService.deleteTemplate(id);
      
      res.status(200).json(result);
    } catch (error) {
      next(error); 
    }
  }
}

module.exports = new TemplateController();